import React, { useState } from 'react';
import { useTokenContext, LaunchedTokenRecord } from '../context/TokenContext';
import { Coins, Plus, ExternalLink, Trash2, CheckCircle, Sparkles, DownloadCloud, ShieldCheck, RefreshCw, Globe, Send, Twitter, Activity } from 'lucide-react';
import { fetchTokenMetadataAndStats, extractSolanaAddress } from '../utils/tokenResolver';

interface Props {
  onStartNewCampaign: () => void;
  onSelectTokenForMicroSite: (token: LaunchedTokenRecord) => void;
}

export const LaunchedTokensSelector: React.FC<Props> = ({
  onStartNewCampaign,
  onSelectTokenForMicroSite,
}) => {
  const { userTokens, activeToken, setActiveTokenByMint, saveLaunchedToken, removeTokenRecord } = useTokenContext();
  const [showImportModal, setShowImportModal] = useState(false);
  const [importCA, setImportCA] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleImportToken = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCA = extractSolanaAddress(importCA.trim());
    if (!cleanCA || cleanCA.length < 32) {
      setImportError('Please enter a valid Solana Mint Address or paste a link from DexScreener, Pump.fun, X, or Telegram.');
      return;
    }

    setIsImporting(true);
    setImportError(null);

    try {
      const metadata = await fetchTokenMetadataAndStats(cleanCA);
      saveLaunchedToken({
        mintAddress: metadata.mintAddress,
        tokenName: metadata.name,
        ticker: metadata.symbol.replace('$', ''),
        tagline: metadata.description || 'Autonomous Solana Meme Token',
        lore: metadata.description || `Autonomous meme community token launched on Solana: ${metadata.symbol}`,
        imageUrl: metadata.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
        ipfsMetadataUri: `https://clawpump.tech/token/${metadata.mintAddress}`,
        creatorWallet: 'imported_token_authority',
        solRaised: metadata.solRaised || 24,
        marketCap: metadata.marketCap || 38400,
      });

      setImportCA('');
      setShowImportModal(false);
    } catch (err: any) {
      setImportError(err?.message || 'Failed to resolve token on-chain. Please check contract address or URL.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="rounded-xl bg-[#0c0e14]/90 border border-[#1e222d] hover:border-[#2d3342] transition-colors p-3 sm:px-4 sm:py-3 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Compact token indicator & context label */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#141822] border border-[#262c3a] flex items-center justify-center text-[#00f5ff] shrink-0">
            <Coins className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
              Token Workspace
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#161a24] text-[#8e99ac] font-mono border border-[#232938]">
              {userTokens.length} {userTokens.length === 1 ? 'Token Saved' : 'Tokens Saved'}
            </span>
            {activeToken && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#39ff14]/10 text-[#39ff14] font-mono border border-[#39ff14]/25 truncate max-w-[140px] sm:max-w-[200px]">
                Active: ${activeToken.ticker}
              </span>
            )}
          </div>
        </div>

        {/* Right: Slim inline actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {userTokens.length > 0 && (
            <div className="relative min-w-[150px] sm:min-w-[180px]">
              <select
                value={activeToken?.mintAddress || ''}
                onChange={(e) => setActiveTokenByMint(e.target.value)}
                className="w-full bg-[#12151e] text-white border border-[#262c3a] hover:border-[#00f5ff]/60 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:border-[#00f5ff] focus:outline-none cursor-pointer transition-colors"
              >
                {userTokens.map((token) => (
                  <option key={token.mintAddress} value={token.mintAddress}>
                    ${token.ticker} ({token.mintAddress.slice(0, 4)}...{token.mintAddress.slice(-4)})
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeToken && (
            <button
              type="button"
              onClick={() => onSelectTokenForMicroSite(activeToken)}
              className="px-2.5 py-1.5 rounded-lg bg-[#141822] hover:bg-[#1c2230] text-[#00f5ff] border border-[#262c3a] hover:border-[#00f5ff]/40 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Open Live Dynamic Micro-Site"
            >
              <Sparkles className="w-3 h-3" />
              <span className="hidden xs:inline">Micro-Site</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="px-2.5 py-1.5 rounded-lg bg-[#141822] hover:bg-[#1c2230] text-[#e0e0e0] hover:text-white border border-[#262c3a] hover:border-[#00f5ff]/40 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Import an existing or quiet token by Contract Address"
          >
            <DownloadCloud className="w-3 h-3 text-[#00f5ff]" />
            <span>Import CA</span>
          </button>

          <button
            type="button"
            onClick={onStartNewCampaign}
            className="px-2.5 py-1.5 rounded-lg bg-[#ccff00]/10 hover:bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/30 hover:border-[#ccff00]/60 font-mono font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
            title="Start fresh token campaign"
          >
            <Plus className="w-3 h-3" />
            <span>New Coin</span>
          </button>

          {activeToken && (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Remove ${activeToken.tokenName} (${activeToken.ticker}) from local active switcher? (On-chain data is permanent)`)) {
                  removeTokenRecord(activeToken.mintAddress);
                }
              }}
              className="p-1.5 rounded-lg bg-[#141822] hover:bg-red-500/20 text-[#8e99ac] hover:text-red-400 border border-[#262c3a] hover:border-red-500/30 text-xs font-mono transition-colors cursor-pointer"
              title="Remove from quick switcher"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#12141a] border border-[#00f5ff]/50 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2d3139] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00f5ff]" />
                <h3 className="font-mono font-bold text-sm text-white uppercase">
                  Revive / Import Deployed Token
                </h3>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-[#e0e0e0]/50 hover:text-white text-lg font-mono"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-[#e0e0e0]/70 font-sans leading-relaxed">
              Cleared your browser cache or reviving a quiet coin after months? Paste a <b>Solana Contract Address (CA)</b> or any link from <b>DexScreener, Pump.fun, Twitter/X, or Telegram</b> to instantly recover its mascot, lore, trading metrics, and mobilization tools.
            </p>

            {/* Quick-Paste Platform Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[10px] font-mono text-[#e0e0e0]/50 uppercase mr-1">Supports:</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#16181f] border border-[#2d3139] text-[10px] font-mono text-[#00f5ff]">
                <Activity className="w-3 h-3 text-[#39ff14]" /> DexScreener
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#16181f] border border-[#2d3139] text-[10px] font-mono text-[#39ff14]">
                <Globe className="w-3 h-3 text-[#39ff14]" /> Pump.fun
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#16181f] border border-[#2d3139] text-[10px] font-mono text-[#1d9bf0]">
                <Twitter className="w-3 h-3 text-[#1d9bf0]" /> X / Twitter
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#16181f] border border-[#2d3139] text-[10px] font-mono text-[#229ed9]">
                <Send className="w-3 h-3 text-[#229ed9]" /> Telegram
              </span>
            </div>

            <form onSubmit={handleImportToken} className="space-y-3 pt-1">
              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-[#00f5ff] block mb-1">
                  Contract Address or Social / Dex URL
                </label>
                <input
                  type="text"
                  value={importCA}
                  onChange={(e) => setImportCA(e.target.value)}
                  placeholder="Paste CA, dexscreener.com/..., pump.fun/coin/..., etc."
                  className="w-full bg-[#0a0b0d] border border-[#2d3139] focus:border-[#00f5ff] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#39ff14] placeholder-[#e0e0e0]/30 outline-none"
                  autoFocus
                />
              </div>

              {importError && (
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-mono">
                  {importError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#1a1d24] text-[#e0e0e0] font-mono text-xs hover:bg-[#252936]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isImporting}
                  className="px-4 py-2 rounded-xl bg-[#00f5ff] hover:bg-[#b2faff] text-black font-mono font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(0,245,255,0.3)]"
                >
                  {isImporting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Resolving On-Chain...</span>
                    </>
                  ) : (
                    <>
                      <DownloadCloud className="w-3.5 h-3.5" />
                      <span>Import &amp; Restore</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
