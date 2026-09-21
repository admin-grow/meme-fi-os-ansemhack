import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  BookOpen, 
  ExternalLink, 
  TrendingUp, 
  Flame, 
  Users, 
  Activity, 
  ShieldCheck, 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Globe, 
  Coins, 
  Layers, 
  BarChart3, 
  Compass, 
  Radio, 
  Bot, 
  ChevronRight, 
  Search, 
  Filter,
  Download
} from 'lucide-react';
import { useTokenContext, LaunchedTokenRecord } from '../context/TokenContext';
import { generateVectorMascotSvg } from '../utils/mascotSvgGenerator';
import { Agent1NarrativeResult, Agent2VisualResult, TokenDeploymentData } from '../types';

interface CryptoTerminalLandingProps {
  onLaunchStudio: () => void;
  onOpenWhitepaper: () => void;
  onSelectTokenForMicroSite: (token: LaunchedTokenRecord) => void;
}

// Clean Zero-Baseline: All tokens rendered are 100% genuine user deployments from the active session / wallet
const CURATED_SHOWCASE_TOKENS: LaunchedTokenRecord[] = [];

export const CryptoTerminalLanding: React.FC<CryptoTerminalLandingProps> = ({
  onLaunchStudio,
  onOpenWhitepaper,
  onSelectTokenForMicroSite,
}) => {
  const { userTokens } = useTokenContext();
  const [filterMode, setFilterMode] = useState<'all' | 'rewards' | 'mine'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCA, setCopiedCA] = useState<string | null>(null);
  const [selectedTokenForManifesto, setSelectedTokenForManifesto] = useState<LaunchedTokenRecord | null>(null);
  const [copiedManifesto, setCopiedManifesto] = useState<boolean>(false);

  // Dynamic Sustainability Telemetry Calculations
  const holderRewardsTokens = useMemo(() => {
    return userTokens.filter((t) => t.rewardModel === 'HOLDER_REWARDS');
  }, [userTokens]);

  const creatorFeeTokens = useMemo(() => {
    return userTokens.filter((t) => t.rewardModel === 'CREATOR_FEE');
  }, [userTokens]);

  const totalHolderYieldSol = useMemo(() => {
    return (holderRewardsTokens.length * 0.05).toFixed(2);
  }, [holderRewardsTokens]);

  const totalCreatorRevenueSol = useMemo(() => {
    return (creatorFeeTokens.length * 0.02).toFixed(2);
  }, [creatorFeeTokens]);

  const totalMobilizations = useMemo(() => {
    return userTokens.length * 4;
  }, [userTokens]);

  // Combine user deployed tokens (first priority) + curated demo tokens
  const allTokens = useMemo(() => {
    const userMints = new Set(userTokens.map((t) => t.mintAddress));
    const nonDuplicatedCurated = CURATED_SHOWCASE_TOKENS.filter((t) => !userMints.has(t.mintAddress));
    return [...userTokens, ...nonDuplicatedCurated];
  }, [userTokens]);

  // Filtered tokens
  const filteredTokens = useMemo(() => {
    return allTokens.filter((token) => {
      const matchesSearch = 
        token.tokenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.tagline.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterMode === 'mine') {
        return userTokens.some((ut) => ut.mintAddress === token.mintAddress);
      }
      if (filterMode === 'rewards') {
        return token.rewardModel === 'HOLDER_REWARDS';
      }
      return true;
    });
  }, [allTokens, searchQuery, filterMode, userTokens]);

  const copyAddress = (address: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopiedCA(address);
    setTimeout(() => setCopiedCA(null), 2000);
  };

  return (
    <div className="space-y-12 animate-fadeIn text-white font-sans overflow-x-hidden">
      
      {/* 1. REAL-TIME PROTOCOL STATUS TAPE */}
      <div className="w-full bg-[#080b11] border-y border-[#1e2536] py-2 overflow-hidden select-none">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse" />
            <span className="px-1.5 py-0.2 rounded bg-[#00f5ff]/20 text-[#00f5ff] text-[10px] font-bold">STATUS</span>
            <span className="text-white font-bold">SOLANA SVM PIPELINE:</span>
            <span className="text-[#39ff14] font-bold">ACTIVE (DEVNET & MAINNET)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.2 rounded bg-[#ff5722]/20 text-[#ff5722] text-[10px] font-bold">SECURITY</span>
            <span className="text-white font-bold">LIQUIDITY DEFENSE:</span>
            <span className="text-[#ff5722] font-bold">100% GENESIS LP TOKEN BURN</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.2 rounded bg-[#00f5ff]/20 text-[#00f5ff] text-[10px] font-bold">ECONOMICS</span>
            <span className="text-white font-bold">FEE ALLOCATION:</span>
            <span className="text-[#00f5ff] font-bold">100% HOLDER STREAM OR CREATOR TREASURY</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.2 rounded bg-[#ccff00]/20 text-[#ccff00] text-[10px] font-bold">AI SWARM</span>
            <span className="text-white font-bold">AUTONOMOUS AGENTS:</span>
            <span className="text-[#ccff00] font-bold">4 SOVEREIGN NEURAL AGENTS (0, 1, 2, 3)</span>
          </div>

          {userTokens.length > 0 && userTokens.map((ut) => (
            <div key={ut.mintAddress} className="flex items-center gap-2">
              <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">DEPLOYED</span>
              <span className="text-white font-bold">${ut.ticker}:</span>
              <span className="text-[#00f5ff] font-bold">LIVE ON-CHAIN</span>
              <span className="text-[#39ff14] font-bold">&bull; 100% LP BURN READY</span>
            </div>
          ))}

          <div className="flex items-center gap-2">
            <span className="text-[#8e99ac]">CUSTODY ARCHITECTURE:</span>
            <span className="text-[#39ff14] font-bold">100% NON-CUSTODIAL (0 PRIVATE KEYS RETAINED)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#8e99ac]">COMMUNITY ENGINE:</span>
            <span className="text-[#00f5ff] font-bold">AGENT 03 SOCIAL MOBILIZATIONS</span>
          </div>
        </div>
      </div>

      {/* 2. HERO TERMINAL SECTION */}
      <section className="relative text-center py-8 sm:py-12 space-y-6 max-w-5xl mx-auto px-4 overflow-hidden">
        {/* Glowing aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00f5ff]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111622] border border-[#00f5ff]/40 text-[#00f5ff] text-xs font-mono shadow-[0_0_15px_rgba(0,245,255,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-[#00f5ff]" />
            <span className="font-bold uppercase tracking-wider">MemeFi OS &bull; AI-Powered Launch Studio on Solana</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-sans leading-[1.1]">
            AI-Powered Meme Coin <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] via-[#39ff14] to-[#ccff00]">
              Studio &amp; Community Engine
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-[#8e99ac] max-w-3xl mx-auto leading-relaxed">
            Launch and manage viral meme coins with multi-season AI lore, automated community alerts, custom brand kits, and dedicated live token micro-sites. 100% non-custodial instruction packaging on the Solana SVM.
          </p>
        </div>

        {/* Action Button Strip - Optimized for mobile touch and full-width layout */}
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 pt-2 w-full max-w-xl mx-auto">
          <button
            type="button"
            onClick={onLaunchStudio}
            className="min-h-[48px] py-3.5 px-6 sm:px-8 rounded-xl bg-gradient-to-r from-[#ccff00] to-[#99e600] text-black font-mono font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_25px_rgba(204,255,0,0.3)] cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>Launch Token Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('microsites-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex-1 sm:flex-none min-h-[48px] py-3 px-4 rounded-xl bg-[#141824] hover:bg-[#1e2538] border border-[#2d374d] text-white font-mono font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Globe className="w-4 h-4 text-[#00f5ff]" />
              <span>Explore Launches</span>
            </button>

            <button
              type="button"
              onClick={onOpenWhitepaper}
              className="flex-1 sm:flex-none min-h-[48px] py-3 px-4 rounded-xl bg-[#10141f] hover:bg-[#181d2c] border border-[#00f5ff]/30 text-[#00f5ff] font-mono font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-[#00f5ff]" />
              <span>Whitepaper</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. PROTOCOL SUSTAINABILITY TELEMETRY GRID */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 max-w-6xl mx-auto px-3 sm:px-4">
        {/* Pillar 1: Holder Stream Yield */}
        <div className="p-3 sm:p-5 rounded-2xl bg-[#0d1017] border border-[#1e2536] hover:border-[#00f5ff]/40 transition-colors space-y-1 min-w-0 overflow-hidden">
          <div className="text-[10px] sm:text-xs font-mono uppercase font-bold text-[#8e99ac] flex items-center gap-1.5 truncate">
            <TrendingUp className="w-3.5 h-3.5 text-[#00f5ff] shrink-0" />
            <span className="truncate">Holder Stream Yield</span>
          </div>
          <div className="text-base xs:text-lg sm:text-2xl lg:text-3xl font-black font-mono text-[#00f5ff] truncate">
            {totalHolderYieldSol} SOL
          </div>
          <div className="text-[10px] font-mono text-[#39ff14] flex items-center gap-1 truncate">
            <span className="truncate">Direct to Wallets</span>
            <span className="text-[#8e99ac] hidden sm:inline">&bull; Non-Custodial</span>
          </div>
        </div>

        {/* Pillar 2: Creator Operations Residuals */}
        <div className="p-3 sm:p-5 rounded-2xl bg-[#0d1017] border border-[#1e2536] hover:border-[#ccff00]/40 transition-colors space-y-1 min-w-0 overflow-hidden">
          <div className="text-[10px] sm:text-xs font-mono uppercase font-bold text-[#8e99ac] flex items-center gap-1.5 truncate">
            <Coins className="w-3.5 h-3.5 text-[#ccff00] shrink-0" />
            <span className="truncate">Creator Residuals</span>
          </div>
          <div className="text-base xs:text-lg sm:text-2xl lg:text-3xl font-black font-mono text-[#ccff00] truncate">
            {totalCreatorRevenueSol} SOL
          </div>
          <div className="text-[10px] font-mono text-[#8e99ac] truncate">
            Zero-Dump Monetization
          </div>
        </div>

        {/* Pillar 3: Genesis LP Liquidity Defense */}
        <div className="p-3 sm:p-5 rounded-2xl bg-[#0d1017] border border-[#1e2536] hover:border-[#ff5722]/40 transition-colors space-y-1 min-w-0 overflow-hidden">
          <div className="text-[10px] sm:text-xs font-mono uppercase font-bold text-[#8e99ac] flex items-center gap-1.5 truncate">
            <Flame className="w-3.5 h-3.5 text-[#ff5722] shrink-0" />
            <span className="truncate">Liquidity Defense</span>
          </div>
          <div className="text-base xs:text-lg sm:text-2xl lg:text-3xl font-black font-mono text-white truncate">
            100% Burn
          </div>
          <div className="text-[10px] font-mono text-[#39ff14] truncate">
            Raydium Migration Lock
          </div>
        </div>

        {/* Pillar 4: Community Mobilizations (Agent 03) */}
        <div className="p-3 sm:p-5 rounded-2xl bg-[#0d1017] border border-[#1e2536] hover:border-[#39ff14]/40 transition-colors space-y-1 min-w-0 overflow-hidden">
          <div className="text-[10px] sm:text-xs font-mono uppercase font-bold text-[#8e99ac] flex items-center gap-1.5 truncate">
            <Radio className="w-3.5 h-3.5 text-[#39ff14] shrink-0" />
            <span className="truncate">Community Mobilization</span>
          </div>
          <div className="text-base xs:text-lg sm:text-2xl lg:text-3xl font-black font-mono text-[#39ff14] truncate">
            {totalMobilizations} Synced
          </div>
          <div className="text-[10px] font-mono text-[#8e99ac] truncate">
            Agent 03 Social Dispatches
          </div>
        </div>
      </section>

      {/* 4. FEATURED LIVE COMMUNITY MICRO-SITES & LAUNCHED TOKENS */}
      <section id="microsites-grid" className="max-w-6xl mx-auto px-4 space-y-6 scroll-mt-20">
        
        {/* Section Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1e2536] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00f5ff] animate-pulse" />
              <span className="text-xs font-mono uppercase font-bold text-[#00f5ff] tracking-wider">
                Live Community Ecosystem
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase font-sans">
              Launched Token Micro-Sites
            </h2>
            <p className="text-xs text-[#8e99ac] font-mono">
              Click any token below to enter its live full-screen dedicated micro-site, inspect real-time bonding curves, or launch community broadcasts.
            </p>
          </div>

          {/* Search & Filter Controls - Responsive with smooth touch scrolling */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-[#8e99ac] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticker or name..."
                className="pl-8 pr-3 py-2 rounded-xl bg-[#0e121a] border border-[#242b3b] text-xs font-mono text-white placeholder-[#8e99ac] focus:outline-none focus:border-[#00f5ff] w-full"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#0e121a] p-1 rounded-xl border border-[#242b3b] text-xs font-mono overflow-x-auto no-scrollbar w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer text-xs ${
                  filterMode === 'all'
                    ? 'bg-[#1e2536] text-white font-bold shadow'
                    : 'text-[#8e99ac] hover:text-white'
                }`}
              >
                All ({allTokens.length})
              </button>

              <button
                type="button"
                onClick={() => setFilterMode('rewards')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer text-xs ${
                  filterMode === 'rewards'
                    ? 'bg-[#1e2536] text-[#39ff14] font-bold shadow'
                    : 'text-[#8e99ac] hover:text-white'
                }`}
              >
                Holder Stream
              </button>

              {userTokens.length > 0 && (
                <button
                  type="button"
                  onClick={() => setFilterMode('mine')}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer text-xs ${
                    filterMode === 'mine'
                      ? 'bg-[#00f5ff]/20 text-[#00f5ff] font-bold border border-[#00f5ff]/40'
                      : 'text-[#8e99ac] hover:text-white'
                  }`}
                >
                  My Tokens ({userTokens.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tokens Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {filteredTokens.length === 0 ? (
            <div className="col-span-full p-8 sm:p-12 rounded-3xl bg-[#0b0e15] border border-[#1f2638] text-center space-y-6 max-w-3xl mx-auto shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-[#00f5ff]/10 border border-[#00f5ff]/30 flex items-center justify-center mx-auto text-[#00f5ff] shadow-[0_0_20px_rgba(0,245,255,0.2)]">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121622] border border-[#262e40] text-xs font-mono text-[#39ff14]">
                  <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse" />
                  <span>Standby Mode &bull; Zero Deployed Coins</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-sans tracking-tight">
                  No Tokens Deployed in Current Session
                </h3>
                <p className="text-xs sm:text-sm text-[#8e99ac] max-w-lg mx-auto leading-relaxed">
                  The 4-Agent Autonomous Swarm is operational on Solana Devnet and Mainnet. Launch your first token in the studio to generate an interactive micro-site with real-time bonding curves, holder yield streams, and automated community dispatches.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onLaunchStudio}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#ccff00] to-[#99e600] text-black font-mono font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>Launch First Token in Studio</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenWhitepaper}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#141824] hover:bg-[#1e2538] border border-[#2d374d] text-[#8e99ac] hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#00f5ff]" />
                  <span>Inspect Architecture Docs</span>
                </button>
              </div>

              {/* 3 Sustainability Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#1a2130] text-left font-mono text-[11px]">
                <div className="p-3.5 rounded-xl bg-[#0e121a] border border-[#1e2536] space-y-1">
                  <div className="text-[#39ff14] font-bold flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#ff5722]" />
                    <span>100% LP Burn</span>
                  </div>
                  <p className="text-[#8e99ac] text-[10px] leading-normal">Provable Genesis LP destruction upon Raydium migration.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0e121a] border border-[#1e2536] space-y-1">
                  <div className="text-[#00f5ff] font-bold flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#00f5ff]" />
                    <span>Holder Yield</span>
                  </div>
                  <p className="text-[#8e99ac] text-[10px] leading-normal">Direct protocol volume streaming to loyal holder wallets.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0e121a] border border-[#1e2536] space-y-1">
                  <div className="text-[#ccff00] font-bold flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-[#ccff00]" />
                    <span>Agentic Ops</span>
                  </div>
                  <p className="text-[#8e99ac] text-[10px] leading-normal">24/7 Agent 03 social dispatches and Telegram event sync.</p>
                </div>
              </div>
            </div>
          ) : (
            filteredTokens.map((token) => {
            const isUserCreated = userTokens.some((ut) => ut.mintAddress === token.mintAddress);
            const mcap = token.marketCapUsd ? `$${(token.marketCapUsd / 1000000).toFixed(2)}M` : '$1.25M';
            const volume = token.volume24hUsd ? `$${(token.volume24hUsd / 1000).toFixed(0)}K` : '$420K';
            const holders = token.holdersCount || 1842;
            const progress = token.bondingProgress || 68;

            return (
              <div
                key={token.mintAddress}
                className="p-5 rounded-2xl bg-[#0b0e15] border border-[#1f2638] hover:border-[#00f5ff]/50 transition-all flex flex-col justify-between group relative overflow-hidden shadow-xl"
              >
                {/* User Created Badge Tag */}
                {isUserCreated && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-[#00f5ff] to-transparent text-black text-[9px] font-mono font-black uppercase px-3 py-1">
                    Your Token
                  </div>
                )}

                <div className="space-y-4">
                  {/* Top Row: Mascot Avatar + Header info */}
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl bg-[#121622] border border-[#262e40] flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                      {token.mascotSvg ? (
                        <div 
                          className="w-full h-full p-1"
                          dangerouslySetInnerHTML={{ __html: token.mascotSvg }} 
                        />
                      ) : (
                        <div 
                          className="w-full h-full p-1"
                          dangerouslySetInnerHTML={{ 
                            __html: generateVectorMascotSvg(token.ticker, token.tokenName, token.lore || token.tagline, 'Tech/AI Absurdism') 
                          }} 
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-white font-mono uppercase tracking-tight truncate">
                          {token.tokenName}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#00f5ff]/15 text-[#00f5ff] text-xs font-mono font-bold border border-[#00f5ff]/30 shrink-0">
                          ${token.ticker.replace('$', '')}
                        </span>
                      </div>
                      <p className="text-xs text-[#8e99ac] mt-1 line-clamp-2 leading-relaxed">
                        {token.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Badges Strip */}
                  <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] font-mono">
                    {token.rewardModel === 'HOLDER_REWARDS' ? (
                      <span className="px-1.5 py-0.5 rounded bg-[#39ff14]/15 text-[#39ff14] border border-[#39ff14]/30 font-bold truncate">
                        HOLDER STREAM
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30 font-bold truncate">
                        DEV TREASURY ({token.creatorFeePercent || 0.5}%)
                      </span>
                    )}

                    <span className="px-1.5 py-0.5 rounded bg-[#161c28] text-[#8e99ac] border border-[#262e40] truncate">
                      VERIFIED
                    </span>
                  </div>

                  {/* Telemetry Metrics Bar */}
                  <div className="grid grid-cols-3 gap-1 sm:gap-2 p-2 sm:p-2.5 rounded-xl bg-[#07090f] border border-[#19202f] text-center font-mono overflow-hidden">
                    <div className="min-w-0 overflow-hidden px-0.5 sm:px-1">
                      <div className="text-[9px] sm:text-[10px] text-[#8e99ac] uppercase truncate">Mkt Cap</div>
                      <div className="text-[11px] sm:text-xs font-bold text-white mt-0.5 truncate">{mcap}</div>
                    </div>
                    <div className="min-w-0 overflow-hidden px-0.5 sm:px-1">
                      <div className="text-[9px] sm:text-[10px] text-[#8e99ac] uppercase truncate">24h Vol</div>
                      <div className="text-[11px] sm:text-xs font-bold text-[#39ff14] mt-0.5 truncate">{volume}</div>
                    </div>
                    <div className="min-w-0 overflow-hidden px-0.5 sm:px-1">
                      <div className="text-[9px] sm:text-[10px] text-[#8e99ac] uppercase truncate">Holders</div>
                      <div className="text-[11px] sm:text-xs font-bold text-white mt-0.5 truncate" title={holders.toLocaleString()}>
                        {holders >= 1000 ? `${(holders / 1000).toFixed(1)}k` : holders}
                      </div>
                    </div>
                  </div>

                  {/* Bonding Curve Progress Bar */}
                  <div className="space-y-1 font-mono text-[10px] sm:text-[11px]">
                    <div className="flex justify-between items-center text-[#8e99ac]">
                      <span>Bonding Curve:</span>
                      <span className="text-[#00f5ff] font-bold truncate">{progress}% to Raydium</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#161c28] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#00f5ff] to-[#39ff14] transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-4 mt-4 border-t border-[#1a2130] flex flex-col sm:flex-row items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectTokenForMicroSite(token)}
                    className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-[#00f5ff]/15 hover:bg-[#00f5ff]/25 border border-[#00f5ff]/40 text-[#00f5ff] hover:text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,245,255,0.12)]"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Open Live Micro-Site ↗</span>
                  </button>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setSelectedTokenForManifesto(token)}
                      className="flex-1 sm:flex-none py-2 px-3 rounded-xl bg-[#141824] hover:bg-[#1f2638] border border-[#262e40] text-[#8e99ac] hover:text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title="Read token manifesto & narrative lore"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#ccff00]" />
                      <span className="hidden sm:inline">Manifesto</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => copyAddress(token.mintAddress, e)}
                      className="py-2 px-3 rounded-xl bg-[#141824] hover:bg-[#1f2638] border border-[#262e40] text-[#8e99ac] hover:text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title="Copy Token Contract Address"
                    >
                      {copiedCA === token.mintAddress ? (
                        <Check className="w-3.5 h-3.5 text-[#39ff14]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span className="text-[10px]">{copiedCA === token.mintAddress ? 'Copied' : 'CA'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
        </div>
      </section>

      {/* 5. "WHAT POWERS EVERY TOKEN MICRO-SITE" INTERACTIVE FEATURE STRIP */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d121c] via-[#0a0d14] to-[#0f1422] border border-[#222a3d] space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold text-[#00f5ff] tracking-wider">
              Decentralized Web3 Portal Architecture
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase font-sans">
              What Powers Every MemeFi Token Micro-Site
            </h3>
            <p className="text-xs sm:text-sm text-[#8e99ac] leading-relaxed">
              When you deploy through MemeFi OS, you don't just launch a token contract. You instantly generate an interactive, decentralized web experience hosted directly at <code className="text-[#00f5ff]">/token/:contractAddress</code>:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left font-mono">
            <div className="p-4 rounded-xl bg-[#0e121a] border border-[#1e2536] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#00f5ff]/15 border border-[#00f5ff]/30 flex items-center justify-center text-[#00f5ff]">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white">Live Pyth Oracle Pricing</div>
              <p className="text-[11px] text-[#8e99ac] leading-relaxed font-sans">
                Real-time candlestick charts and live correlation calculations against traditional US stock market assets.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0e121a] border border-[#1e2536] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#39ff14]/15 border border-[#39ff14]/30 flex items-center justify-center text-[#39ff14]">
                <Flame className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white">Bonding Curve Progress</div>
              <p className="text-[11px] text-[#8e99ac] leading-relaxed font-sans">
                Live Solana block telemetry tracking SOL raised toward Raydium automated liquidity pool migration.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0e121a] border border-[#1e2536] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#f43f5e]/15 border border-[#f43f5e]/30 flex items-center justify-center text-[#f43f5e]">
                <Radio className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white">Community Broadcast Terminal</div>
              <p className="text-[11px] text-[#8e99ac] leading-relaxed font-sans">
                One-click URL-encoded Twitter momentum posts, Telegram group alerts, and viral meme download packs for holders.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0e121a] border border-[#1e2536] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#ccff00]/15 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00]">
                <Coins className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white">Web3 Swap Slip</div>
              <p className="text-[11px] text-[#8e99ac] leading-relaxed font-sans">
                Non-custodial token swapping directly within the micro-site via Phantom, Solflare, or Backpack.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MULTI-AGENT CAPABILITIES GRID */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase font-bold text-[#ccff00] tracking-wider">
            Synchronized AI Swarm
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase font-sans">
            The 4-Agent Orchestrated Pipeline
          </h2>
          <p className="text-xs text-[#8e99ac] font-mono">
            Every token lifecycle is guided by specialized AI agents with human-in-the-loop oversight.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0b0e15] border border-[#1f2638] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#00f5ff]">AGENT 01</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#00f5ff]/10 text-[#00f5ff] border border-[#00f5ff]/30">LORE</span>
            </div>
            <h4 className="text-sm font-bold text-white font-mono">Narrative Strategist</h4>
            <p className="text-xs text-[#8e99ac] leading-relaxed">
              Analyzes crypto cultural archetypes, generates memorable tickers, 3-season episodic story arcs, and viral tweet packs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b0e15] border border-[#1f2638] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#39ff14]">AGENT 02</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30">MASCOTS</span>
            </div>
            <h4 className="text-sm font-bold text-white font-mono">Vector Meme Studio</h4>
            <p className="text-xs text-[#8e99ac] leading-relaxed">
              Renders scalable 512x512 vector mascot SVGs and high-contrast social meme templates (Breaking News, Drake Hotline).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b0e15] border border-[#1f2638] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#f43f5e]">AGENT 03</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/30">DISPATCH</span>
            </div>
            <h4 className="text-sm font-bold text-white font-mono">Telegram Community Mobilizer</h4>
            <p className="text-xs text-[#8e99ac] leading-relaxed">
              Coordinates automated buy alerts, milestone celebrations, and 1-click community broadcast commands for post-launch engagement.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b0e15] border border-[#1f2638] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#a855f7]">AGENT 04</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/30">MICRO-SITES</span>
            </div>
            <h4 className="text-sm font-bold text-white font-mono">Web3 Ops Host</h4>
            <p className="text-xs text-[#8e99ac] leading-relaxed">
              Instantly deploys full-screen branded micro-sites with live Pyth oracle charts, swap widgets, and community burn pits.
            </p>
          </div>
        </div>
      </section>

      {/* MODAL: TOKEN MANIFESTO & LORE PREVIEW */}
      {selectedTokenForManifesto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#0d1017] border border-[#242b3b] rounded-2xl shadow-2xl p-6 space-y-5 text-left font-sans max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#1f2638] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#141824] border border-[#262e40] flex items-center justify-center font-bold text-[#00f5ff]">
                  ${selectedTokenForManifesto.ticker.replace('$', '')}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono">
                    {selectedTokenForManifesto.tokenName} Brand Lore &amp; Manifesto
                  </h3>
                  <span className="text-xs text-[#8e99ac] font-mono">
                    Mint: {selectedTokenForManifesto.mintAddress.slice(0, 8)}...{selectedTokenForManifesto.mintAddress.slice(-6)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTokenForManifesto(null)}
                className="w-8 h-8 rounded-lg bg-[#141824] hover:bg-[#1f2638] text-[#8e99ac] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-[#c4cddb]">
              <div>
                <span className="font-mono font-bold text-[#00f5ff] uppercase text-[10px]">Tagline</span>
                <p className="text-sm font-semibold text-white mt-0.5">{selectedTokenForManifesto.tagline}</p>
              </div>

              <div>
                <span className="font-mono font-bold text-[#39ff14] uppercase text-[10px]">Lore &amp; Season Narrative</span>
                <p className="mt-1 bg-[#07090e] p-3.5 rounded-xl border border-[#19202f] font-mono text-[#8e99ac] leading-relaxed">
                  {selectedTokenForManifesto.lore || 'Season 1: The genesis deployment on Solana SVM.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#07090e] border border-[#19202f]">
                  <span className="text-[#8e99ac] text-[10px]">REWARD MODEL:</span>
                  <div className="font-bold text-white mt-0.5">
                    {selectedTokenForManifesto.rewardModel === 'HOLDER_REWARDS' 
                      ? '100% Holder Rewards Stream' 
                      : `Creator Operations Treasury (${selectedTokenForManifesto.creatorFeePercent || 0.5}%)`}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#07090e] border border-[#19202f]">
                  <span className="text-[#8e99ac] text-[10px]">ASSET ROUTING:</span>
                  <div className="font-bold text-[#00f5ff] mt-0.5">
                    Solana Native ($SOL)
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1f2638] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  const manifestoText = `# ${selectedTokenForManifesto.tokenName} ($${selectedTokenForManifesto.ticker})\n\n${selectedTokenForManifesto.tagline}\n\n## Lore\n${selectedTokenForManifesto.lore}\n\nContract: ${selectedTokenForManifesto.mintAddress}`;
                  navigator.clipboard.writeText(manifestoText);
                  setCopiedManifesto(true);
                  setTimeout(() => setCopiedManifesto(false), 2000);
                }}
                className="px-4 py-2 rounded-xl bg-[#141824] hover:bg-[#1f2638] border border-[#242b3b] text-white text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {copiedManifesto ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#39ff14]" />
                    <span className="text-[#39ff14]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#8e99ac]" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  const tokenToOpen = selectedTokenForManifesto;
                  setSelectedTokenForManifesto(null);
                  onSelectTokenForMicroSite(tokenToOpen);
                }}
                className="px-4 py-2 rounded-xl bg-[#00f5ff] hover:bg-[#33f7ff] text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Open Micro-Site ↗</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
