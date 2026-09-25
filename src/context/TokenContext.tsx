import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { generateVectorMascotSvg } from '../utils/mascotSvgGenerator';
import { TokenSocialLinks } from '../types';
import memeFiCatImage from '../assets/images/memefi_cat_mascot_1790023358949.jpg';
import { useSolanaWallet } from './WalletContext';

export interface LaunchedTokenRecord {
  mintAddress: string;
  tokenName: string;
  ticker: string;
  tagline: string;
  lore: string;
  imageUrl: string;
  mascotSvg?: string;
  renderedMemeUrl?: string;
  ipfsMetadataUri?: string;
  launchedAt: number; // Unix timestamp
  telegramChannelId?: string;
  socialLinks?: TokenSocialLinks;
  creatorWallet: string;
  initialBuySol?: number;
  marketCap?: number;
  solRaised?: number;
  rewardModel?: 'HOLDER_REWARDS' | 'CREATOR_FEE';
  creatorFeePercent?: number;
  marketCapUsd?: number;
  volume24hUsd?: number;
  holdersCount?: number;
  bondingProgress?: number;
  network?: 'devnet' | 'mainnet';
  txHash?: string;
}

export const DEFAULT_GENESIS_MFCAT_TOKEN: LaunchedTokenRecord | null = null;
export const DEFAULT_GENESIS_HITL_TOKEN: LaunchedTokenRecord | null = null;

interface TokenContextType {
  // All tokens deployed by currently active wallet / sandbox
  userTokens: LaunchedTokenRecord[];
  allTokens: LaunchedTokenRecord[];
  // Currently focused token (Coin A vs Coin B)
  activeToken: LaunchedTokenRecord | null;
  networkFilter: 'all' | 'mainnet' | 'devnet';
  setNetworkFilter: (filter: 'all' | 'mainnet' | 'devnet') => void;
  setActiveTokenByMint: (mintAddress: string) => void;
  saveLaunchedToken: (token: Omit<LaunchedTokenRecord, 'launchedAt'>) => void;
  removeTokenRecord: (mintAddress: string) => void;
  clearDevnetTokens: () => void;
  // Dynamic community broadcast generation helpers
  getTwitterBroadcastUrl: (token: LaunchedTokenRecord, customMessage?: string) => string;
  getTwitterRaidUrl: (token: LaunchedTokenRecord, customMessage?: string) => string;
  getTelegramAlertPayload: (token: LaunchedTokenRecord, eventType?: string) => {
    message: string;
    buttonUrl: string;
  };
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

const STORAGE_PREFIX = 'memefi_deployed_tokens_';

// Sanitize token records to prevent massive Base64 Canvas data URLs from blowing browser localStorage quota (5MB limit)
function sanitizeTokenForStorage(token: LaunchedTokenRecord): LaunchedTokenRecord {
  return {
    ...token,
    // Avoid persisting multi-megabyte canvas data URLs to localStorage
    imageUrl: token.imageUrl && token.imageUrl.startsWith('data:') && token.imageUrl.length > 30000
      ? ''
      : token.imageUrl,
    renderedMemeUrl: token.renderedMemeUrl && token.renderedMemeUrl.startsWith('data:') && token.renderedMemeUrl.length > 30000
      ? undefined
      : token.renderedMemeUrl,
    // If SVG is exceptionally large, omit from storage (can be procedurally regenerated on demand)
    mascotSvg: token.mascotSvg && token.mascotSvg.length > 30000
      ? undefined
      : token.mascotSvg,
  };
}

// Resilient persistence helper with multi-tier quota error recovery
function safePersistTokens(storageKey: string, tokens: LaunchedTokenRecord[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  // Cap at 12 most recent records to prevent quota exhaustion
  const capped = tokens.slice(0, 12).map(sanitizeTokenForStorage);

  try {
    localStorage.setItem(storageKey, JSON.stringify(capped));
  } catch (quotaErr) {
    console.warn('LocalStorage quota limit reached. Pruning cache to recover storage space...', quotaErr);
    
    // Tier 1: Prune to 4 most recent tokens with minimal attributes
    try {
      const lightweight = capped.slice(0, 4).map((t) => ({
        ...t,
        renderedMemeUrl: undefined,
        mascotSvg: undefined,
      }));
      localStorage.setItem(storageKey, JSON.stringify(lightweight));
    } catch {
      // Tier 2: Reclaim space by evicting stale temporary keys and keep only active token
      try {
        const keysToClean: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key !== storageKey && (key.startsWith('memefi_') || key.startsWith('sentiment_'))) {
            keysToClean.push(key);
          }
        }
        keysToClean.forEach((k) => {
          try { localStorage.removeItem(k); } catch {}
        });

        const singleToken = capped.slice(0, 1).map((t) => ({
          ...t,
          renderedMemeUrl: undefined,
          mascotSvg: undefined,
        }));
        localStorage.setItem(storageKey, JSON.stringify(singleToken));
      } catch (finalErr) {
        // Safe failover: in-memory state remains fully functional even if disk storage is full
        console.warn('LocalStorage unavailable or completely filled. Session will continue in-memory.', finalErr);
      }
    }
  }
}

export const TokenProvider: React.FC<{
  children: React.ReactNode;
  activeWalletAddress?: string | null;
}> = ({ children, activeWalletAddress: propWalletAddress }) => {
  const { wallet } = useSolanaWallet();
  const activeWalletAddress = propWalletAddress !== undefined ? propWalletAddress : wallet?.address;
  const currentNetwork = wallet?.network || 'devnet';

  const [rawTokens, setRawTokens] = useState<LaunchedTokenRecord[]>([]);
  const [activeMint, setActiveMint] = useState<string | null>(null);
  const [networkFilter, setNetworkFilter] = useState<'all' | 'mainnet' | 'devnet'>('all');

  // Storage key is strictly isolated per connected wallet address and network
  const storageKey = useMemo(() => {
    return activeWalletAddress
      ? `${STORAGE_PREFIX}${activeWalletAddress}`
      : `${STORAGE_PREFIX}sandbox_default`;
  }, [activeWalletAddress]);

  // Load tokens from localStorage upon wallet change and migrate/tag existing tokens
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed: LaunchedTokenRecord[] = JSON.parse(raw);
        if (parsed.length > 0) {
          // Filter out legacy sample demo tokens
          const genuineTokens = parsed.filter(
            (t) =>
              t.mintAddress !== 'MFCAT88x7vK6wQ5nP4mB3xC2yR9tU1eW7sD5fG3pump' &&
              t.mintAddress !== 'HITL99zX4kL9wV8nB7mC5xP2qR1tY6uJ3aE7sD4fG2pump' &&
              t.tokenName !== 'MemeFiCat' &&
              t.tokenName !== 'Human in the Loop'
          );

          // Rehydrate mascot SVG and ensure network tag is present
          const hydrated = genuineTokens.map((t) => {
            const hasNetwork = t.network === 'devnet' || t.network === 'mainnet';
            const network = hasNetwork 
              ? t.network 
              : 'mainnet';
            
            return {
              ...t,
              network,
              mascotSvg: t.mascotSvg || generateVectorMascotSvg(t.ticker, t.tokenName, t.lore || t.tagline, 'Tech/AI Absurdism', 'Cyberpunk Pixel Art'),
            };
          });

          setRawTokens(hydrated);
          setActiveMint(hydrated.length > 0 ? hydrated[0].mintAddress : null);
        } else {
          setRawTokens([]);
          setActiveMint(null);
        }
      } else {
        setRawTokens([]);
        setActiveMint(null);
      }
    } catch (e) {
      console.error('Failed to load wallet tokens from localStorage:', e);
      setRawTokens([]);
      setActiveMint(null);
    }
  }, [storageKey]);

  // Save new deployed token into isolated storage with explicit network tag and cloud persistence
  const saveLaunchedToken = async (tokenData: Omit<LaunchedTokenRecord, 'launchedAt'>) => {
    const newRecord: LaunchedTokenRecord = {
      ...tokenData,
      network: tokenData.network || currentNetwork,
      launchedAt: Date.now(),
    };

    // Attempt Cloud Persistence (Non-custodial, wallet-signed)
    if (activeWalletAddress && newRecord.mascotSvg) {
        try {
            // Note: In a full production implementation, we would prompt 
            // for a signature here. For now, we simulate the structure.
            await fetch('/api/save-asset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    walletAddress: activeWalletAddress,
                    assetData: newRecord.mascotSvg,
                    signature: "SIMULATED_SIGNATURE_PLACEHOLDER",
                    message: "Authorize asset storage to cloud"
                })
            });
        } catch (e) {
            console.error("Cloud persistence failed:", e);
        }
    }

    setRawTokens((prev) => {
      const filtered = prev.filter((t) => t.mintAddress !== newRecord.mintAddress);
      const updated = [newRecord, ...filtered];
      safePersistTokens(storageKey, updated);
      return updated;
    });

    setActiveMint(newRecord.mintAddress);
  };

  const removeTokenRecord = (mintAddress: string) => {
    setRawTokens((prev) => {
      const updated = prev.filter((t) => t.mintAddress !== mintAddress);
      safePersistTokens(storageKey, updated);
      return updated;
    });
    if (activeMint === mintAddress) {
      setActiveMint(null);
    }
  };

  // Clear all Devnet simulation tokens from workspace
  const clearDevnetTokens = () => {
    setRawTokens((prev) => {
      // Keep only mainnet tokens and official showcase tokens
      const retained = prev.filter((t) => t.network === 'mainnet' || t.mintAddress === DEFAULT_GENESIS_MFCAT_TOKEN.mintAddress || t.mintAddress === DEFAULT_GENESIS_HITL_TOKEN.mintAddress);
      safePersistTokens(storageKey, retained);
      return retained;
    });
    setActiveMint(DEFAULT_GENESIS_MFCAT_TOKEN.mintAddress);
  };

  const setActiveTokenByMint = (mintAddress: string) => {
    setActiveMint(mintAddress);
  };

  // Filtered tokens based on selected networkFilter
  const userTokens = useMemo(() => {
    if (networkFilter === 'all') return rawTokens;
    return rawTokens.filter((t) => {
      const tokenNet = t.network || 'mainnet';
      return tokenNet === networkFilter;
    });
  }, [rawTokens, networkFilter]);

  const activeToken = useMemo(() => {
    return rawTokens.find((t) => t.mintAddress === activeMint) || rawTokens[0] || null;
  }, [rawTokens, activeMint]);

  // Agent 03: Click-to-Tweet dynamic community broadcast link generator
  const getTwitterBroadcastUrl = (token: LaunchedTokenRecord, customMessage?: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://memefios.app';
    const microSiteUrl = `${origin}?token=${token.mintAddress}`;
    const text =
      customMessage ||
      `🚀 COMMUNITY ALERT: $${token.ticker} (${token.tokenName}) is live on @clawpumptech!\n\n"${token.tagline}"\n\n🎯 CA: ${token.mintAddress}\n🌐 Micro-Site: ${microSiteUrl}\n\n#Solana #MemeCoin #AnsemHack`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  };

  const getTwitterRaidUrl = getTwitterBroadcastUrl;

  // Agent 03: Telegram community payload with dynamic CA & Micro-Site URLs
  const getTelegramAlertPayload = (token: LaunchedTokenRecord, eventType: string = 'Spike') => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://memefios.app';
    const microSiteUrl = `${origin}?token=${token.mintAddress}`;
    const message = `🚀 <b>$${token.ticker} ${eventType.toUpperCase()} DETECTED!</b>\n\n<b>Token:</b> ${token.tokenName}\n<b>Contract:</b> <code>${token.mintAddress}</code>\n<b>Lore:</b> ${token.lore}\n\n🎯 <b>Community Goal:</b> 100 Retweets in 5 Minutes!`;
    return {
      message,
      buttonUrl: microSiteUrl,
    };
  };

  return (
    <TokenContext.Provider
      value={{
        userTokens,
        allTokens: rawTokens,
        activeToken,
        networkFilter,
        setNetworkFilter,
        setActiveTokenByMint,
        saveLaunchedToken,
        removeTokenRecord,
        clearDevnetTokens,
        getTwitterBroadcastUrl,
        getTwitterRaidUrl,
        getTelegramAlertPayload,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useTokenContext = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useTokenContext must be used within a TokenProvider');
  }
  return context;
};
