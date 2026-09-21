import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { generateVectorMascotSvg } from '../utils/mascotSvgGenerator';
import { TokenSocialLinks } from '../types';

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
}

export const DEFAULT_GENESIS_HITL_TOKEN: LaunchedTokenRecord = {
  mintAddress: 'HITL99zX4kL9wV8nB7mC5xP2qR1tY6uJ3aE7sD4fG2pump',
  tokenName: 'Human in the Loop',
  ticker: 'HITL',
  tagline: 'AI writes the lore. AI paints the chart. A human must press the button.',
  lore: 'In an era of runaway autonomous AI agent swarms, $HITL is the ultimate cultural counter-balance. Four sovereign neural networks proposed the contract, generated the memes, and monitored the bonding curve — but an exhausted human with an iced oat latte had to manually click the big red APPROVE button before Block 0.',
  imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
  mascotSvg: generateVectorMascotSvg('HITL', 'Human in the Loop', 'Human in the loop developer in hoodie holding red approved stamp with iced coffee', 'Tech/AI Absurdism', 'Vector Sticker'),
  ipfsMetadataUri: 'https://clawpump.tech/token/HITL99zX4kL9wV8nB7mC5xP2qR1tY6uJ3aE7sD4fG2pump',
  launchedAt: 1726200000000,
  creatorWallet: '9yQP8a3N1vF7kxM2bL8uR4eW5dC6zVb1a0',
  initialBuySol: 0.05,
  marketCap: 64200,
  solRaised: 48.6,
};

interface TokenContextType {
  // All tokens deployed by currently active wallet / sandbox
  userTokens: LaunchedTokenRecord[];
  // Currently focused token (Coin A vs Coin B)
  activeToken: LaunchedTokenRecord | null;
  setActiveTokenByMint: (mintAddress: string) => void;
  saveLaunchedToken: (token: Omit<LaunchedTokenRecord, 'launchedAt'>) => void;
  removeTokenRecord: (mintAddress: string) => void;
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
}> = ({ children, activeWalletAddress }) => {
  const [userTokens, setUserTokens] = useState<LaunchedTokenRecord[]>([]);
  const [activeMint, setActiveMint] = useState<string | null>(null);

  // Storage key is strictly isolated per connected wallet address
  const storageKey = useMemo(() => {
    return activeWalletAddress
      ? `${STORAGE_PREFIX}${activeWalletAddress}`
      : `${STORAGE_PREFIX}sandbox_default`;
  }, [activeWalletAddress]);

  // Load tokens from localStorage upon wallet change
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed: LaunchedTokenRecord[] = JSON.parse(raw);
        if (parsed.length > 0) {
          // Rehydrate mascot SVG if omitted during quota-safe storage
          const hydrated = parsed.map((t) => {
            if (!t.mascotSvg) {
              return {
                ...t,
                mascotSvg: generateVectorMascotSvg(t.ticker, t.tokenName, t.lore || t.tagline, 'Tech/AI Absurdism', 'Vector Sticker'),
              };
            }
            return t;
          });
          setUserTokens(hydrated);
          setActiveMint((prev) => (prev && hydrated.some((t) => t.mintAddress === prev) ? prev : hydrated[0].mintAddress));
        } else {
          setUserTokens([]);
          setActiveMint(null);
        }
      } else {
        // Zero-baseline initial state for honest telemetry
        setUserTokens([]);
        setActiveMint(null);
      }
    } catch (e) {
      console.error('Failed to load wallet tokens from localStorage:', e);
      setUserTokens([]);
      setActiveMint(null);
    }
  }, [storageKey]);

  // Save new deployed token into isolated storage
  const saveLaunchedToken = (tokenData: Omit<LaunchedTokenRecord, 'launchedAt'>) => {
    const newRecord: LaunchedTokenRecord = {
      ...tokenData,
      launchedAt: Date.now(),
    };

    setUserTokens((prev) => {
      // Prevent duplicates
      const filtered = prev.filter((t) => t.mintAddress !== newRecord.mintAddress);
      const updated = [newRecord, ...filtered];
      safePersistTokens(storageKey, updated);
      return updated;
    });

    setActiveMint(newRecord.mintAddress);
  };

  const removeTokenRecord = (mintAddress: string) => {
    setUserTokens((prev) => {
      const updated = prev.filter((t) => t.mintAddress !== mintAddress);
      safePersistTokens(storageKey, updated);
      return updated;
    });
    if (activeMint === mintAddress) {
      setActiveMint(null);
    }
  };

  const setActiveTokenByMint = (mintAddress: string) => {
    setActiveMint(mintAddress);
  };

  const activeToken = useMemo(() => {
    return userTokens.find((t) => t.mintAddress === activeMint) || userTokens[0] || null;
  }, [userTokens, activeMint]);

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
        activeToken,
        setActiveTokenByMint,
        saveLaunchedToken,
        removeTokenRecord,
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
