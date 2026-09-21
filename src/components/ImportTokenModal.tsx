import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Coins, 
  Globe, 
  Search, 
  Check, 
  Copy, 
  X,
  ExternalLink,
  Sparkles,
  ArrowRight,
  FolderOpen,
  AlertCircle,
  Plus
} from 'lucide-react';
import { useTokenContext, LaunchedTokenRecord } from '../context/TokenContext';
import { useSolanaWallet } from '../context/WalletContext';

interface ImportTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onLaunchNew?: () => void;
  onSelectTokenForMicroSite?: (token: LaunchedTokenRecord) => void;
}

export const ImportTokenModal: React.FC<ImportTokenModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onLaunchNew,
  onSelectTokenForMicroSite,
}) => {
  const { userTokens, activeToken, setActiveTokenByMint } = useTokenContext();
  const { wallet } = useSolanaWallet();

  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCA, setCopiedCA] = useState<string | null>(null);
  const [lookupMessage, setLookupMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Filtered tokens from vault based on search input (must be called unconditionally before any return)
  const filteredTokens = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return userTokens;

    return userTokens.filter((token) => {
      const matchName = token.tokenName.toLowerCase().includes(query);
      const matchTicker = token.ticker.toLowerCase().includes(query);
      const matchCA = token.mintAddress.toLowerCase().includes(query);
      return matchName || matchTicker || matchCA;
    });
  }, [userTokens, searchQuery]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCA(id);
    setTimeout(() => setCopiedCA(null), 2000);
  };

  const handleSelectToken = (token: LaunchedTokenRecord) => {
    setActiveTokenByMint(token.mintAddress);
    if (onSelectTokenForMicroSite) {
      onSelectTokenForMicroSite(token);
    }
    if (onSuccess) onSuccess();
    onClose();
  };

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    // Extract CA if user pasted a link
    let extracted = query;
    if (query.includes('pump.fun/coin/')) {
      extracted = query.split('pump.fun/coin/')[1]?.split('?')[0]?.split('/')[0] || query;
    } else if (query.includes('pump.fun/')) {
      extracted = query.split('pump.fun/')[1]?.split('?')[0]?.split('/')[0] || query;
    } else if (query.includes('dexscreener.com/solana/')) {
      extracted = query.split('dexscreener.com/solana/')[1]?.split('?')[0]?.split('/')[0] || query;
    } else if (query.includes('solscan.io/token/')) {
      extracted = query.split('solscan.io/token/')[1]?.split('?')[0]?.split('/')[0] || query;
    }

    const matched = userTokens.find(
      (t) =>
        t.mintAddress.toLowerCase() === extracted.toLowerCase() ||
        t.ticker.toLowerCase().replace('$', '') === extracted.toLowerCase().replace('$', '') ||
        t.tokenName.toLowerCase() === extracted.toLowerCase()
    );

    if (matched) {
      handleSelectToken(matched);
    } else {
      setLookupMessage({
        type: 'error',
        text: `Contract "${extracted.slice(0, 12)}..." not found in your App Launch Vault. This workspace manages tokens created and launched through this platform.`,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-xl max-h-[90vh] rounded-3xl bg-[#0c0e15] border-2 border-[#242b3b] shadow-[0_0_50px_rgba(0,245,255,0.15)] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#1e2433] bg-[#090b10] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00f5ff] to-[#ccff00] flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(0,245,255,0.3)]">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono font-black text-sm sm:text-base text-white uppercase tracking-tight">
                  Find &amp; Load Launched Token
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#00f5ff]/15 border border-[#00f5ff]/30 text-[#00f5ff] text-[10px] font-mono font-bold">
                  App Vault ({userTokens.length})
                </span>
              </div>
              <p className="text-xs text-[#8e99ac] font-mono hidden sm:block">
                Search or select any token launched from this app to restore into your workspace
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#141822] hover:bg-[#1e2433] text-[#8e99ac] hover:text-white border border-[#232938] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search / Filter Input Bar */}
        <div className="p-4 sm:p-6 border-b border-[#1e2433] bg-[#0e121a] space-y-3 shrink-0">
          <form onSubmit={handleLookupSubmit} className="relative">
            <Search className="w-4 h-4 text-[#8e99ac] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setLookupMessage(null);
              }}
              placeholder="Search by Token Name, Ticker, CA, or paste Pump.fun link..."
              className="w-full bg-[#090b10] border border-[#232938] focus:border-[#00f5ff] rounded-xl pl-10 pr-24 py-2.5 text-xs font-mono text-white placeholder-[#8e99ac]/50 outline-none transition-colors"
              autoFocus
            />
            {searchQuery && (
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-[#00f5ff] hover:bg-[#80faff] text-black font-mono font-bold text-xs transition-colors cursor-pointer"
              >
                Find CA
              </button>
            )}
          </form>

          {/* Context Explainer Notice */}
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#141824] border border-[#242c3d] text-[11px] font-mono text-[#8e99ac]">
            <ShieldCheck className="w-4 h-4 text-[#00f5ff] shrink-0 mt-0.5" />
            <span>
              This workspace activates Brand Asset Kits, 3-Season Lore, and Community Cockpits exclusively for tokens <strong>created and launched through this platform</strong>.
            </span>
          </div>

          {/* Lookup Notification */}
          {lookupMessage && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <div>{lookupMessage.text}</div>
                {onLaunchNew && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onLaunchNew();
                    }}
                    className="mt-1 inline-flex items-center gap-1 text-[#ccff00] hover:underline font-bold"
                  >
                    <span>Launch a new token now</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Vault List Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#8e99ac]">
            <span>Your Launched Token Vault</span>
            <span>{filteredTokens.length} found</span>
          </div>

          {filteredTokens.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#0e121a] border border-[#1e2433] text-center space-y-3">
              <Coins className="w-8 h-8 text-[#8e99ac] mx-auto opacity-50" />
              <div className="space-y-1">
                <div className="font-mono font-bold text-sm text-white">No Matching Launched Tokens</div>
                <p className="text-xs text-[#8e99ac] font-mono max-w-sm mx-auto">
                  {userTokens.length === 0
                    ? 'You have not launched any meme coins yet in this workspace session.'
                    : `No launched token matched "${searchQuery}".`}
                </p>
              </div>
              {onLaunchNew && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLaunchNew();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-mono font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create &amp; Launch First Token</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredTokens.map((token) => {
                const isActive = activeToken?.mintAddress === token.mintAddress;
                return (
                  <div
                    key={token.mintAddress}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-[#141b26] border-[#00f5ff]/60 shadow-[0_0_20px_rgba(0,245,255,0.1)]'
                        : 'bg-[#10141f] border-[#232938] hover:border-[#354057]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Token Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        {token.imageUrl ? (
                          <img
                            src={token.imageUrl}
                            alt={token.tokenName}
                            className="w-10 h-10 rounded-xl object-cover border border-[#232938] shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-[#1e2433] border border-[#2b3447] text-[#00f5ff] flex items-center justify-center font-mono font-bold text-xs shrink-0">
                            {token.ticker.slice(0, 2).replace('$', '')}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm font-mono truncate">
                              {token.tokenName}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-[#ccff00]/15 border border-[#ccff00]/30 text-[#ccff00] text-xs font-mono font-bold">
                              {token.ticker.startsWith('$') ? token.ticker : `$${token.ticker}`}
                            </span>
                            {isActive && (
                              <span className="px-2 py-0.5 rounded-md bg-[#00f5ff]/20 text-[#00f5ff] text-[10px] font-mono font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-pulse"></span>
                                ACTIVE
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-mono text-[#8e99ac] truncate">
                              CA: {token.mintAddress.slice(0, 8)}...{token.mintAddress.slice(-6)}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(token.mintAddress, token.mintAddress)}
                              className="text-[#8e99ac] hover:text-white p-0.5 transition-colors cursor-pointer"
                              title="Copy Contract Address"
                            >
                              {copiedCA === token.mintAddress ? (
                                <Check className="w-3 h-3 text-[#39ff14]" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleSelectToken(token)}
                          className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#00f5ff] text-black hover:bg-[#80faff] shadow-[0_0_12px_rgba(0,245,255,0.3)]'
                              : 'bg-[#182030] hover:bg-[#222d42] text-white border border-[#2d3a54]'
                          }`}
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>{isActive ? 'Workspace Active' : 'Load Into Workspace'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#1e2433] bg-[#090b10] flex items-center justify-between shrink-0">
          <div className="text-xs font-mono text-[#8e99ac]">
            Connected: <span className="text-white">{wallet.address ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : 'Devnet Sandbox'}</span>
          </div>

          <div className="flex items-center gap-2">
            {onLaunchNew && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLaunchNew();
                }}
                className="px-4 py-2 rounded-xl bg-[#141822] hover:bg-[#1e2433] text-[#ccff00] border border-[#ccff00]/30 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Launch New Coin</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#181d28] hover:bg-[#222938] text-white font-mono text-xs cursor-pointer border border-[#283244]"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
