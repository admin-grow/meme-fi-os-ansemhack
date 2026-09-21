import React, { useState, useMemo } from 'react';
import {
  X,
  Briefcase,
  TrendingUp,
  Coins,
  ShieldCheck,
  Flame,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Download,
  Plus,
  BarChart3,
  Layers,
  ArrowUpRight,
  Sparkles,
  Radio,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Scale,
  Award,
  Wallet,
  Compass
} from 'lucide-react';
import { useTokenContext, LaunchedTokenRecord } from '../context/TokenContext';
import { useSolanaWallet } from '../context/WalletContext';

interface DevPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTokenForMicroSite: (token: LaunchedTokenRecord) => void;
  onLaunchNewCoin: () => void;
  onOpenCommunityModal?: () => void;
}

export const DevPortfolioModal: React.FC<DevPortfolioModalProps> = ({
  isOpen,
  onClose,
  onSelectTokenForMicroSite,
  onLaunchNewCoin,
  onOpenCommunityModal,
}) => {
  const { userTokens, activeToken, setActiveTokenByMint, removeTokenRecord } = useTokenContext();
  const { wallet } = useSolanaWallet();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'graduated' | 'active'>('all');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Derive wallet-level aggregated metrics
  const portfolioMetrics = useMemo(() => {
    const totalTokens = userTokens.length;

    // Simulated / estimated metrics based on deployed tokens
    let totalEstimatedVolumeSol = 0;
    let totalCreatorFeesEarnedSol = 0;
    let totalHitlBurnContributionSol = 0;
    let graduatedCount = 0;
    let totalBullishRatings = 0;
    let totalNotBullishRatings = 0;
    let totalNeutralRatings = 0;

    userTokens.forEach((token, index) => {
      // Deterministic sample data for simulated bonding curve volume if not stored
      const seedNum = (token.mintAddress.charCodeAt(0) + token.mintAddress.charCodeAt(token.mintAddress.length - 1)) % 100;
      const progress = Math.min(100, Math.max(15, seedNum));
      const estVolume = Number(((progress * 1.8) + (index * 12.5)).toFixed(2));
      const creatorFee = Number((estVolume * 0.01).toFixed(3)); // 1% Creator volume split
      const hitlContribution = Number((creatorFee * 0.35).toFixed(3)); // 35% to HITL buyback & burn

      if (progress >= 85) {
        graduatedCount += 1;
      }

      // Check stored community sentiment votes for this token
      const stored = localStorage.getItem(`sentiment_votes_${token.mintAddress}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          totalBullishRatings += parsed.bullish || 0;
          totalNeutralRatings += parsed.neutral || 0;
          totalNotBullishRatings += parsed.notBullish || 0;
        } catch (e) {
          // ignore
        }
      } else {
        totalBullishRatings += 120 + (index * 15);
        totalNeutralRatings += 35 + (index * 5);
        totalNotBullishRatings += 25 + (index * 8);
      }

      totalEstimatedVolumeSol += estVolume;
      totalCreatorFeesEarnedSol += creatorFee;
      totalHitlBurnContributionSol += hitlContribution;
    });

    const graduationRate = totalTokens > 0 ? Math.round((graduatedCount / totalTokens) * 100) : 0;
    const totalRatings = totalBullishRatings + totalNeutralRatings + totalNotBullishRatings;
    const averageConvictionScore = totalRatings > 0
      ? Math.round(((totalBullishRatings * 100 + totalNeutralRatings * 50) / totalRatings) * 10) / 10
      : 74.5;

    return {
      totalTokens,
      graduatedCount,
      activeCurveCount: totalTokens - graduatedCount,
      graduationRate,
      totalEstimatedVolumeSol: Number(totalEstimatedVolumeSol.toFixed(2)),
      totalCreatorFeesEarnedSol: Number(totalCreatorFeesEarnedSol.toFixed(3)),
      totalHitlBurnContributionSol: Number(totalHitlBurnContributionSol.toFixed(3)),
      averageConvictionScore,
      totalBullishRatings,
      totalNeutralRatings,
      totalNotBullishRatings,
      totalRatings,
    };
  }, [userTokens]);

  const handleExportJson = () => {
    const exportData = {
      creatorWallet: wallet?.address || 'Self-Custody Connected',
      exportTimestamp: new Date().toISOString(),
      summary: portfolioMetrics,
      deployedTokens: userTokens,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memefi_creator_portfolio_${(wallet?.address || 'wallet').slice(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const headers = ['MintAddress', 'TokenName', 'Ticker', 'Tagline', 'LaunchedAt', 'IPFS_URI', 'CreatorWallet'];
    const rows = userTokens.map((t) => [
      `"${t.mintAddress}"`,
      `"${t.tokenName.replace(/"/g, '""')}"`,
      `"${t.ticker}"`,
      `"${t.tagline.replace(/"/g, '""')}"`,
      `"${new Date(t.launchedAt).toISOString()}"`,
      `"${t.ipfsMetadataUri}"`,
      `"${t.creatorWallet}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memefi_tokens_${(wallet?.address || 'wallet').slice(0, 8)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#0c0e14] border-2 border-[#232938] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-[#1e2330] bg-gradient-to-r from-[#10141f] via-[#0c0e14] to-[#121824] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00f5ff]/20 to-[#ccff00]/20 border border-[#00f5ff]/40 flex items-center justify-center text-[#00f5ff] shadow-[0_0_15px_rgba(0,245,255,0.15)]">
              <Scale className="w-5 h-5 text-[#00f5ff]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black font-mono tracking-tight text-white uppercase flex items-center gap-2">
                  <span>Creator Hub &amp; Portfolio Intelligence</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#39ff14]/15 border border-[#39ff14]/30 text-[#39ff14] text-[10px] font-mono font-bold flex items-center gap-1">
                  <Scale className="w-3 h-3 text-[#00f5ff]" />
                  <span>2-Sided Conviction Framework</span>
                </span>
              </div>
              <p className="text-xs text-[#8e99ac] font-mono mt-0.5 flex items-center gap-2">
                <span>Multi-token creator analytics, balanced community conviction gauges &amp; on-chain performance.</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#141822] hover:bg-[#1f2636] text-[#8e99ac] hover:text-white border border-[#232938] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar">
          
          {/* Creator Wallet Card & Explorer Link */}
          <div className="p-4 rounded-2xl bg-[#10141f] border border-[#1e2535] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#182030] border border-[#2a3750] flex items-center justify-center text-[#ccff00]">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold uppercase text-[#8e99ac]">
                  Active Connected Creator Wallet
                </div>
                <div className="font-mono text-sm text-white font-bold flex items-center gap-2 mt-0.5">
                  <span>{wallet?.address || '7xK...9QmZ (Phantom Self-Custody)'}</span>
                  {wallet?.address && (
                    <button
                      type="button"
                      onClick={() => handleCopy(wallet.address, 'wallet_addr')}
                      className="text-[#8e99ac] hover:text-[#00f5ff] transition-colors"
                      title="Copy Address"
                    >
                      {copiedKey === 'wallet_addr' ? <Check className="w-3.5 h-3.5 text-[#39ff14]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={userTokens.length === 0}
                className="px-3 py-1.5 rounded-xl bg-[#141822] hover:bg-[#1e2536] text-[#e0e0e0] hover:text-white border border-[#232938] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download className="w-3.5 h-3.5 text-[#00f5ff]" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={handleExportJson}
                disabled={userTokens.length === 0}
                className="px-3 py-1.5 rounded-xl bg-[#141822] hover:bg-[#1e2536] text-[#e0e0e0] hover:text-white border border-[#232938] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Layers className="w-3.5 h-3.5 text-[#ccff00]" />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onLaunchNewCoin();
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#ccff00] to-[#99e600] text-black text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(204,255,0,0.25)] hover:scale-102 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Deploy New Coin</span>
              </button>
            </div>
          </div>

          {/* 4 Summary Metric Cards (Integrated Conviction & Sentiment Framework) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Metric 1: 2-Sided Conviction Index */}
            <div className="p-4 rounded-2xl bg-[#0f121a] border border-[#1e2433] space-y-1 relative overflow-hidden">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#8e99ac]">
                <span>Avg Conviction Score</span>
                <Scale className="w-4 h-4 text-[#00f5ff]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                  {portfolioMetrics.averageConvictionScore}%
                </span>
                <span className="text-[10px] font-mono font-bold text-[#39ff14]">
                  BULLISH TIER
                </span>
              </div>
              <div className="text-[10px] font-mono text-[#8e99ac] flex items-center justify-between">
                <span className="text-[#39ff14] flex items-center gap-0.5">
                  <ThumbsUp className="w-2.5 h-2.5" /> {portfolioMetrics.totalBullishRatings}
                </span>
                <span className="text-[#facc15] flex items-center gap-0.5">
                  <Minus className="w-2.5 h-2.5" /> {portfolioMetrics.totalNeutralRatings}
                </span>
                <span className="text-[#ef4444] flex items-center gap-0.5">
                  <ThumbsDown className="w-2.5 h-2.5" /> {portfolioMetrics.totalNotBullishRatings}
                </span>
              </div>
            </div>

            {/* Metric 2: Raydium Graduation Rate */}
            <div className="p-4 rounded-2xl bg-[#0f121a] border border-[#1e2433] space-y-1 relative overflow-hidden">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#8e99ac]">
                <span>Graduation Rate</span>
                <TrendingUp className="w-4 h-4 text-[#ccff00]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-[#ccff00]">
                {portfolioMetrics.graduationRate}%
              </div>
              <div className="text-[10px] font-mono text-[#8e99ac] flex items-center gap-1">
                <span>{portfolioMetrics.totalTokens} Tokens</span>
                <span>•</span>
                <span className="text-[#39ff14]">{portfolioMetrics.graduatedCount} Graduated</span>
              </div>
            </div>

            {/* Metric 3: Creator Volume Fee Split */}
            <div className="p-4 rounded-2xl bg-[#0f121a] border border-[#1e2433] space-y-1 relative overflow-hidden">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#8e99ac]">
                <span>Creator Fees (1%)</span>
                <Flame className="w-4 h-4 text-[#ff9900]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white">
                {portfolioMetrics.totalCreatorFeesEarnedSol} <span className="text-xs text-[#ff9900]">SOL</span>
              </div>
              <div className="text-[10px] font-mono text-[#8e99ac]">
                ~{portfolioMetrics.totalEstimatedVolumeSol} SOL Total Curve Vol
              </div>
            </div>

            {/* Metric 4: HITL Buyback & Burn Allocation */}
            <div className="p-4 rounded-2xl bg-[#0f121a] border border-[#1e2433] space-y-1 relative overflow-hidden">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#8e99ac]">
                <span>$HITL Burn Tally</span>
                <Sparkles className="w-4 h-4 text-[#f43f5e]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-[#f43f5e]">
                {portfolioMetrics.totalHitlBurnContributionSol} <span className="text-xs text-white">SOL</span>
              </div>
              <div className="text-[10px] font-mono text-[#8e99ac]">
                35% Auto Protocol Deflation
              </div>
            </div>
          </div>

          {/* Deployed Tokens Management Table / Cards */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#00f5ff]" />
                  <span>Wallet Token Catalog ({userTokens.length})</span>
                </h3>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-[#12151e] border border-[#1e2330] rounded-xl text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setFilterCategory('all')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    filterCategory === 'all' ? 'bg-[#1e2433] text-[#00f5ff] font-bold' : 'text-[#8e99ac] hover:text-white'
                  }`}
                >
                  All ({userTokens.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterCategory('active')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    filterCategory === 'active' ? 'bg-[#1e2433] text-[#39ff14] font-bold' : 'text-[#8e99ac] hover:text-white'
                  }`}
                >
                  Active Curves
                </button>
                <button
                  type="button"
                  onClick={() => setFilterCategory('graduated')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    filterCategory === 'graduated' ? 'bg-[#1e2433] text-[#ccff00] font-bold' : 'text-[#8e99ac] hover:text-white'
                  }`}
                >
                  Graduated
                </button>
              </div>
            </div>

            {/* List / Empty State */}
            {userTokens.length === 0 ? (
              <div className="p-8 sm:p-12 rounded-3xl bg-[#0f121a] border border-[#1e2433] text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#141824] border border-[#232a3d] text-[#8e99ac] flex items-center justify-center mx-auto">
                  <Coins className="w-7 h-7" />
                </div>
                <div className="max-w-md mx-auto space-y-1.5">
                  <h4 className="font-mono font-bold text-white text-base">No Tokens Deployed Yet On This Wallet</h4>
                  <p className="text-xs text-[#8e99ac] font-sans leading-relaxed">
                    When you deploy meme coins through MemeFi OS, they automatically link to your connected wallet. Your bonding curve progression, trading volume, fee rewards, and micro-sites will appear here.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onLaunchNewCoin();
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#ccff00] hover:bg-[#d4ff1a] text-black font-mono font-bold text-xs inline-flex items-center gap-2 shadow-[0_0_15px_rgba(204,255,0,0.2)] cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Launch Your First Meme Coin</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {userTokens.map((token, idx) => {
                  const isActive = activeToken?.mintAddress === token.mintAddress;
                  const dateStr = new Date(token.launchedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  // Deterministic sample curve completion
                  const seedProgress = ((token.mintAddress.charCodeAt(0) + token.mintAddress.charCodeAt(token.mintAddress.length - 1)) % 80) + 20;

                  return (
                    <div
                      key={token.mintAddress}
                      className={`p-4 rounded-2xl border transition-all ${
                        isActive
                          ? 'bg-[#121722] border-[#00f5ff]/40 shadow-[0_0_15px_rgba(0,245,255,0.06)]'
                          : 'bg-[#0f121a] border-[#1e2433] hover:border-[#2b3447]'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        
                        {/* Token Identity */}
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-[#181d28] border border-[#283244] overflow-hidden flex items-center justify-center shrink-0">
                            {token.imageUrl ? (
                              <img
                                src={token.imageUrl}
                                alt={token.tokenName}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="font-mono font-bold text-sm text-[#00f5ff]">
                                {token.ticker.slice(0, 2)}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-bold text-sm text-white truncate">
                                {token.tokenName}
                              </span>
                              <span className="font-mono font-bold text-xs text-[#ccff00]">
                                ${token.ticker}
                              </span>
                              {isActive && (
                                <span className="px-1.5 py-0.5 rounded bg-[#39ff14]/15 border border-[#39ff14]/30 text-[#39ff14] text-[9px] font-mono font-bold">
                                  ACTIVE WORKSPACE
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-[#8e99ac] font-sans truncate max-w-md mt-0.5">
                              "{token.tagline}"
                            </p>

                            <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-[#8e99ac]">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#00f5ff]" />
                                {dateStr}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <span>CA:</span>
                                <span className="text-white font-bold">{token.mintAddress.slice(0, 6)}...{token.mintAddress.slice(-4)}</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(token.mintAddress, `ca_${token.mintAddress}`)}
                                  className="hover:text-[#00f5ff] transition-colors"
                                  title="Copy CA"
                                >
                                  {copiedKey === `ca_${token.mintAddress}` ? (
                                    <Check className="w-3 h-3 text-[#39ff14]" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 2-Sided Conviction & Sentiment Mini Gauge */}
                        <div className="lg:w-44 p-2.5 rounded-xl bg-[#0b0e14] border border-[#1e2535] space-y-1.5 shrink-0">
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-[#8e99ac] flex items-center gap-1">
                              <Scale className="w-3 h-3 text-[#00f5ff]" />
                              <span>Conviction</span>
                            </span>
                            <span className="font-bold text-[#39ff14]">
                              {(((seedProgress * 0.4) + 55)).toFixed(0)}%
                            </span>
                          </div>
                          {/* Mini 3-Segment Distribution Bar */}
                          <div className="w-full h-1.5 rounded-full bg-[#181e2b] flex overflow-hidden">
                            <div className="h-full bg-[#39ff14]" style={{ width: '68%' }} title="Bullish 68%" />
                            <div className="h-full bg-[#facc15]" style={{ width: '18%' }} title="Neutral 18%" />
                            <div className="h-full bg-[#ef4444]" style={{ width: '14%' }} title="Not Bullish 14%" />
                          </div>
                          <div className="text-[9px] font-mono text-[#8e99ac] flex items-center justify-between">
                            <span className="text-[#39ff14]">👍 68%</span>
                            <span className="text-[#facc15]">➖ 18%</span>
                            <span className="text-[#ef4444]">👎 14%</span>
                          </div>
                        </div>

                        {/* Bonding Curve Progress Bar */}
                        <div className="lg:w-44 space-y-1 shrink-0">
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-[#8e99ac]">Curve Target</span>
                            <span className="text-[#39ff14] font-bold">{seedProgress}% / 85 SOL</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-[#181e2b] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#00f5ff] to-[#39ff14]"
                              style={{ width: `${seedProgress}%` }}
                            />
                          </div>
                          <div className="text-[9px] font-mono text-[#8e99ac] flex items-center justify-between">
                            <span>Fair Launch AMM</span>
                            <span className="text-[#ccff00]">Raydium Pool</span>
                          </div>
                        </div>

                        {/* Actions Suite */}
                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTokenByMint(token.mintAddress);
                              onSelectTokenForMicroSite(token);
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#00f5ff]/10 hover:bg-[#00f5ff]/20 text-[#00f5ff] border border-[#00f5ff]/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Open Dynamic Micro-Site"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>Micro-Site ↗</span>
                          </button>

                          {onOpenCommunityModal && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTokenByMint(token.mintAddress);
                                onOpenCommunityModal();
                                onClose();
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#f43f5e]/10 hover:bg-[#f43f5e]/20 text-[#f43f5e] border border-[#f43f5e]/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Community Cockpit (Engagement & Content Hub)"
                            >
                              <Radio className="w-3.5 h-3.5" />
                              <span>Community Cockpit</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setActiveTokenByMint(token.mintAddress);
                              onClose();
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                              isActive
                                ? 'bg-[#39ff14] text-black font-black'
                                : 'bg-[#181d28] hover:bg-[#222938] text-white border border-[#283244]'
                            }`}
                          >
                            {isActive ? 'Selected' : 'Focus'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dev Safety & Compliance Verification Footnote */}
          <div className="p-4 rounded-2xl bg-[#0d1017] border border-[#1e2330] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase">
              <ShieldCheck className="w-4 h-4 text-[#39ff14]" />
              <span>Non-Custodial Multi-Token Safety Principles</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-sans text-[#8e99ac]">
              <div className="p-2 rounded-lg bg-[#12151e] border border-[#1e2330]">
                <strong className="text-white font-mono block">Zero Central Custody:</strong>
                All smart contract interactions and creator fee splits route directly through Solana wallet signatures.
              </div>
              <div className="p-2 rounded-lg bg-[#12151e] border border-[#1e2330]">
                <strong className="text-white font-mono block">Permanent Authority Revocation:</strong>
                Mint and Freeze authorities are burned upon token deploy, preventing malicious changes.
              </div>
              <div className="p-2 rounded-lg bg-[#12151e] border border-[#1e2330]">
                <strong className="text-white font-mono block">Automated $HITL Buyback:</strong>
                35% of protocol volume fees continuously execute market buybacks and burns of the showcase token.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="p-4 border-t border-[#1e2330] bg-[#090b0f] flex items-center justify-between shrink-0">
          <div className="text-[11px] font-mono text-[#8e99ac] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse" />
            <span>MemeFi OS Autonomous Multi-Token Engine</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#141822] hover:bg-[#1e2536] text-white border border-[#232938] text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            Close Creator Hub
          </button>
        </div>

      </div>
    </div>
  );
};
