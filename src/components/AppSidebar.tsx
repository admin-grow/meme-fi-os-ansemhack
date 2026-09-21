import React, { useState } from 'react';
import { 
  Plus, 
  Coins, 
  DownloadCloud, 
  Compass, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  ChevronDown,
  ChevronUp,
  X,
  History,
  BookOpen,
  Laptop,
  FolderOpen,
  Radio,
  Twitter,
  MessageSquare,
  Zap,
  TrendingUp,
  Flame,
  Copy,
  Check,
  Award,
  Sparkles,
  Users,
  Briefcase,
  Shield
} from 'lucide-react';
import { useTokenContext, LaunchedTokenRecord } from '../context/TokenContext';
import { useSolanaWallet } from '../context/WalletContext';
import { Agent1NarrativeResult, Agent2VisualResult, TokenDeploymentData } from '../types';

interface AppSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onLaunchNewCoin: () => void;
  onOpenImportModal: () => void;
  onOpenNarrativeModal: () => void;
  onOpenCommunityModal?: () => void;
  onOpenAssetFinderModal?: () => void;
  onOpenDevPortfolioModal?: () => void;
  onOpenWhitepaper?: () => void;
  onSelectTokenForMicroSite: (token: LaunchedTokenRecord) => void;
  campaignNarrative?: Agent1NarrativeResult | null;
  campaignVisual?: Agent2VisualResult | null;
  campaignDeployment?: TokenDeploymentData | null;
  activeView?: 'studio' | 'landing';
  onChangeView?: (view: 'studio' | 'landing') => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  onLaunchNewCoin,
  onOpenImportModal,
  onOpenNarrativeModal,
  onOpenCommunityModal,
  onOpenAssetFinderModal,
  onOpenDevPortfolioModal,
  onOpenWhitepaper,
  onSelectTokenForMicroSite,
  campaignNarrative,
  campaignVisual,
  campaignDeployment,
  activeView = 'studio',
  onChangeView,
}) => {
  const { userTokens, activeToken, setActiveTokenByMint, removeTokenRecord } = useTokenContext();
  const { wallet } = useSolanaWallet();
  const [isHistoryExpanded, setIsHistoryExpanded] = useState<boolean>(false);

  // Active display token from context or current in-flight campaign
  const displayTokenName = activeToken?.tokenName || campaignNarrative?.token_name || null;
  const displayTicker = activeToken?.ticker || campaignNarrative?.ticker || '$MEME';

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#090b0f] border-r border-[#1e222d] flex flex-col transition-all duration-300 ease-in-out ${
          isMobileOpen
            ? 'translate-x-0 w-72 sm:w-80 max-w-[85vw] visible pointer-events-auto shadow-2xl'
            : '-translate-x-full lg:translate-x-0 invisible lg:visible pointer-events-none lg:pointer-events-auto'
        } ${isCollapsed ? 'lg:w-[68px]' : 'lg:w-72'}`}
      >
        {/* Top Header: Segmented Mode Switcher & Collapse Toggle */}
        <div className="min-h-[56px] border-b border-[#1e222d] px-2.5 py-1.5 flex items-center justify-between gap-2 shrink-0 bg-[#0c0e14]">
          {!isCollapsed ? (
            <>
              {/* Segmented Switcher: Studio vs Landing */}
              <div className="flex-1 grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#12151e] border border-[#1e222d]">
                <button
                  type="button"
                  onClick={() => {
                    if (onChangeView) onChangeView('studio');
                    if (isMobileOpen) onCloseMobile();
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeView === 'studio'
                      ? 'bg-[#1e2433] text-[#00f5ff] border border-[#00f5ff]/40 shadow-[0_0_10px_rgba(0,245,255,0.15)]'
                      : 'text-[#8e99ac] hover:text-white hover:bg-[#161a24]'
                  }`}
                  title="Switch to Token Launch Studio"
                >
                  <Zap className="w-3.5 h-3.5 text-[#00f5ff] shrink-0" />
                  <span className="truncate">Studio</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onChangeView) onChangeView('landing');
                    if (isMobileOpen) onCloseMobile();
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeView === 'landing'
                      ? 'bg-[#1e2433] text-[#ccff00] border border-[#ccff00]/40 shadow-[0_0_10px_rgba(204,255,0,0.15)]'
                      : 'text-[#8e99ac] hover:text-white hover:bg-[#161a24]'
                  }`}
                  title="Switch to Landing Page"
                >
                  <Globe className="w-3.5 h-3.5 text-[#ccff00] shrink-0" />
                  <span className="truncate">Landing</span>
                </button>
              </div>

              {/* Desktop Toggle Button */}
              <button
                type="button"
                onClick={onToggleCollapse}
                className="hidden lg:flex p-1.5 rounded-lg bg-[#141822] hover:bg-[#1e2433] text-[#8e99ac] hover:text-white border border-[#232938] transition-colors cursor-pointer shrink-0"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg bg-[#141822] text-[#8e99ac] hover:text-white shrink-0"
                title="Close Sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1.5 w-full py-1">
              <button
                type="button"
                onClick={onToggleCollapse}
                className="p-1.5 rounded-lg bg-[#141822] hover:bg-[#1e2433] text-[#8e99ac] hover:text-white border border-[#232938] transition-colors cursor-pointer mx-auto"
                title="Expand Sidebar"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <div className="flex flex-col gap-1 w-full items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (onChangeView) onChangeView('studio');
                  }}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    activeView === 'studio'
                      ? 'bg-[#1e2433] text-[#00f5ff] border border-[#00f5ff]/40 shadow-[0_0_8px_rgba(0,245,255,0.2)]'
                      : 'text-[#8e99ac] hover:text-white hover:bg-[#161a24]'
                  }`}
                  title="Token Studio"
                >
                  <Zap className="w-3.5 h-3.5 text-[#00f5ff]" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onChangeView) onChangeView('landing');
                  }}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    activeView === 'landing'
                      ? 'bg-[#1e2433] text-[#ccff00] border border-[#ccff00]/40 shadow-[0_0_8px_rgba(204,255,0,0.2)]'
                      : 'text-[#8e99ac] hover:text-white hover:bg-[#161a24]'
                  }`}
                  title="Landing Page"
                >
                  <Globe className="w-3.5 h-3.5 text-[#ccff00]" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-4 custom-scrollbar">
          
          {/* PRIMARY CTA: Launch New Coin */}
          <div>
            <button
              type="button"
              onClick={() => {
                onLaunchNewCoin();
                if (onChangeView) onChangeView('studio');
                if (isMobileOpen) onCloseMobile();
              }}
              className={`w-full rounded-xl bg-gradient-to-r from-[#ccff00] to-[#99e600] hover:from-[#d4ff1a] hover:to-[#a6f000] text-black font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(204,255,0,0.25)] cursor-pointer ${
                isCollapsed ? 'p-3' : 'py-2.5 px-3'
              }`}
              title="Launch New Coin"
            >
              <Plus className="w-4 h-4 shrink-0 stroke-[2.5]" />
              {!isCollapsed && <span className="uppercase tracking-tight">Launch New Coin</span>}
            </button>
          </div>

          {/* ACTIVE TOKEN CARD (if any active or generating token) */}
          {(displayTokenName || displayTicker) && (
            <div className="space-y-1.5">
              {!isCollapsed && (
                <div className="text-[10px] font-mono uppercase font-bold text-[#8e99ac] px-1 flex items-center justify-between">
                  <span>Active Token HUD</span>
                  <span className="text-[#39ff14] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-pulse"></span>
                    Live
                  </span>
                </div>
              )}

              <div className={`rounded-xl bg-[#12151e] border border-[#232938] p-3 space-y-2.5 ${isCollapsed ? 'text-center p-2' : ''}`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#00f5ff]/15 border border-[#00f5ff]/30 text-[#00f5ff] flex items-center justify-center font-mono font-bold text-xs shrink-0">
                    {displayTicker ? displayTicker.slice(0, 2).replace('$', '') : '🪙'}
                  </div>
                  {!isCollapsed && (
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate">
                        {displayTokenName || 'Current Campaign'}
                      </div>
                      <div className="text-[11px] font-mono text-[#ccff00] truncate">
                        {displayTicker ? (displayTicker.startsWith('$') ? displayTicker : `$${displayTicker}`) : '$MEME'}
                      </div>
                    </div>
                  )}
                </div>

                {!isCollapsed && activeToken && (
                  <div className="pt-1 border-t border-[#1e222d]">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTokenForMicroSite(activeToken);
                        if (isMobileOpen) onCloseMobile();
                      }}
                      className="w-full py-1.5 px-2 rounded-lg bg-[#181d28] hover:bg-[#202736] text-[#00f5ff] border border-[#262e3f] text-[10px] font-mono flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      title="View Dynamic Micro-Site"
                    >
                      <Globe className="w-3 h-3" />
                      <span>View Active Micro-Site ↗</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* POST-LAUNCH COMMUNITY ENGAGEMENT LAUNCHER */}
          {onOpenCommunityModal && (
            <button
              type="button"
              onClick={() => {
                onOpenCommunityModal();
                if (isMobileOpen) onCloseMobile();
              }}
              className={`w-full rounded-xl bg-gradient-to-r from-[#1a1420] to-[#121622] hover:from-[#261c30] hover:to-[#1a2030] text-white border border-[#f43f5e]/40 hover:border-[#f43f5e] font-mono text-xs flex items-center transition-all cursor-pointer shadow-[0_0_12px_rgba(244,63,94,0.12)] group overflow-hidden ${
                isCollapsed ? 'p-3 justify-center' : 'p-2.5 gap-2.5 text-left'
              }`}
              title="Open Community Cockpit (Telegram, Social Bot, Memes & Micro-Site)"
            >
              <div className="w-6 h-6 rounded-lg bg-[#f43f5e]/15 border border-[#f43f5e]/30 flex items-center justify-center text-[#f43f5e] shrink-0 group-hover:scale-105 transition-transform">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1 flex items-center justify-between gap-1.5 overflow-hidden">
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white text-xs truncate flex items-center gap-1.5">
                      <span className="truncate">Community Cockpit</span>
                    </div>
                    <div className="text-[10px] text-[#f43f5e] font-mono truncate">
                      Daily Engagement &amp; Hub
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-[#f43f5e]/20 text-[#f43f5e] text-[9px] font-bold shrink-0 whitespace-nowrap">
                    OPEN ↗
                  </span>
                </div>
              )}
            </button>
          )}

          {/* WORKSPACE UTILITIES & ASSET FINDER */}
          <div className="space-y-2 pt-2 border-t border-[#1e222d]">
            {!isCollapsed && (
              <div className="text-[10px] font-mono uppercase font-bold text-[#8e99ac] px-1">
                Workspace Utilities &amp; Assets
              </div>
            )}

            {/* Utility 0: Creator Hub & Portfolio Workspace */}
            {onOpenDevPortfolioModal && (
              <button
                type="button"
                onClick={() => {
                  onOpenDevPortfolioModal();
                  if (isMobileOpen) onCloseMobile();
                }}
                className={`w-full rounded-xl bg-gradient-to-r from-[#141b26] to-[#121822] hover:from-[#1b2535] hover:to-[#18202d] text-white border border-[#ccff00]/40 hover:border-[#ccff00] font-mono text-xs flex items-center transition-all cursor-pointer shadow-[0_0_12px_rgba(204,255,0,0.12)] group overflow-hidden ${
                  isCollapsed ? 'p-3 justify-center' : 'p-2.5 gap-2.5 text-left'
                }`}
                title="Open Creator Hub & Multi-Token Portfolio Analytics"
              >
                <div className="w-6 h-6 rounded-lg bg-[#ccff00]/15 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00] shrink-0 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-3.5 h-3.5 text-[#ccff00]" />
                </div>
                {!isCollapsed && (
                  <div className="min-w-0 flex-1 flex items-center justify-between gap-1.5 overflow-hidden">
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white text-xs truncate flex items-center gap-1.5">
                        <span className="truncate">Creator Hub</span>
                      </div>
                      <div className="text-[10px] text-[#ccff00] font-mono truncate">
                        Portfolio &amp; Fee Analytics
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-[#ccff00]/20 text-[#ccff00] text-[9px] font-bold shrink-0 whitespace-nowrap">
                      HUB ↗
                    </span>
                  </div>
                )}
              </button>
            )}

            {/* Utility 0.5: Asset Finder / Brand Asset Hub */}
            {onOpenAssetFinderModal && (
              <button
                type="button"
                onClick={() => {
                  onOpenAssetFinderModal();
                  if (isMobileOpen) onCloseMobile();
                }}
                className={`w-full rounded-xl bg-gradient-to-r from-[#141b26] to-[#121822] hover:from-[#1b2535] hover:to-[#18202d] text-white border border-[#00f5ff]/40 hover:border-[#00f5ff] font-mono text-xs flex items-center transition-all cursor-pointer shadow-[0_0_12px_rgba(0,245,255,0.1)] overflow-hidden ${
                  isCollapsed ? 'p-3 justify-center' : 'p-2.5 gap-2.5 text-left'
                }`}
                title="Open Brand Asset Hub (DexScreener, CoinGecko, X, TG)"
              >
                <FolderOpen className="w-4 h-4 text-[#00f5ff] shrink-0" />
                {!isCollapsed && (
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="font-bold text-white text-xs flex items-center justify-between gap-1.5">
                      <span className="truncate">Asset Hub &amp; Packs</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#00f5ff]/20 text-[#00f5ff] font-bold shrink-0 whitespace-nowrap">
                        DEX/CG
                      </span>
                    </div>
                    <div className="text-[10px] text-[#8e99ac] truncate">PFP, Banners, Shards &amp; JSON</div>
                  </div>
                )}
              </button>
            )}

            {/* Utility 1: Find Launched CA Trigger */}
            <button
              type="button"
              onClick={() => {
                onOpenImportModal();
                if (isMobileOpen) onCloseMobile();
              }}
              className={`w-full rounded-xl bg-[#12151e] hover:bg-[#181d28] text-[#e0e0e0] hover:text-white border border-[#232938] hover:border-[#00f5ff]/40 font-mono text-xs flex items-center transition-colors cursor-pointer ${
                isCollapsed ? 'p-3 justify-center' : 'p-2.5 gap-2.5 text-left'
              }`}
              title="Find and Load Launched Token CA"
            >
              <Coins className="w-4 h-4 text-[#00f5ff] shrink-0" />
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-white text-xs">Find Launched CA</div>
                  <div className="text-[10px] text-[#8e99ac] truncate">App Vault &amp; Micro-Sites</div>
                </div>
              )}
            </button>

            {/* Utility 2: Narrative Lifecycle Trigger */}
            <button
              type="button"
              onClick={() => {
                onOpenNarrativeModal();
                if (isMobileOpen) onCloseMobile();
              }}
              className={`w-full rounded-xl bg-[#12151e] hover:bg-[#181d28] text-[#e0e0e0] hover:text-white border border-[#232938] hover:border-[#ccff00]/40 font-mono text-xs flex items-center transition-colors cursor-pointer ${
                isCollapsed ? 'p-3 justify-center' : 'p-2.5 gap-2.5 text-left'
              }`}
              title="Open 3-Season Narrative Lifecycle"
            >
              <Compass className="w-4 h-4 text-[#ccff00] shrink-0" />
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-white text-xs">Narrative Lifecycle</div>
                  <div className="text-[10px] text-[#8e99ac] truncate">3-Season Lore &amp; Milestones</div>
                </div>
              )}
            </button>

            {/* Utility 2.5: Protocol Whitepaper */}
            {onOpenWhitepaper && (
              <button
                type="button"
                onClick={() => {
                  onOpenWhitepaper();
                  if (isMobileOpen) onCloseMobile();
                }}
                className={`w-full rounded-xl bg-[#12151e] hover:bg-[#181d28] text-[#e0e0e0] hover:text-white border border-[#232938] hover:border-[#00f5ff]/40 font-mono text-xs flex items-center transition-colors cursor-pointer overflow-hidden ${
                  isCollapsed ? 'p-3 justify-center' : 'p-2.5 gap-2.5 text-left'
                }`}
                title="Protocol Whitepaper & Technical Specs"
              >
                <BookOpen className="w-4 h-4 text-[#00f5ff] shrink-0" />
                {!isCollapsed && (
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="font-bold text-white text-xs flex items-center justify-between gap-1.5">
                      <span className="truncate">Whitepaper &amp; Specs</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#00f5ff]/20 text-[#00f5ff] font-bold shrink-0 whitespace-nowrap">
                        v2.6
                      </span>
                    </div>
                    <div className="text-[10px] text-[#8e99ac] truncate">Solana bytecode, Claw &amp; rules</div>
                  </div>
                )}
              </button>
            )}

            {/* Utility 3: Coin History */}
            {!isCollapsed ? (
              <div className="rounded-xl bg-[#12151e] border border-[#232938] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                  className="w-full p-2.5 flex items-center justify-between text-left hover:bg-[#181d28] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-[#00f5ff] shrink-0" />
                    <div>
                      <div className="font-bold text-white text-xs">Coin History</div>
                      <div className="text-[10px] text-[#8e99ac]">
                        {userTokens.length} {userTokens.length === 1 ? 'Token' : 'Tokens'} Saved
                      </div>
                    </div>
                  </div>
                  <div className="text-[#8e99ac]">
                    {isHistoryExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {isHistoryExpanded && (
                  <div className="p-2 pt-0 space-y-1.5 border-t border-[#1e222d] mt-1">
                    {userTokens.length === 0 ? (
                      <div className="p-2.5 rounded-lg bg-[#0c0e14] border border-[#1a1e28] text-center">
                        <p className="text-[10px] text-[#8e99ac] font-sans">
                          No coins saved yet.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar pr-0.5 pt-1">
                        {userTokens.map((token) => {
                          const isActive = activeToken?.mintAddress === token.mintAddress;
                          return (
                            <div
                              key={token.mintAddress}
                              className={`group rounded-lg border transition-all p-2 ${
                                isActive
                                  ? 'bg-[#141822] border-[#00f5ff]/40 shadow-[0_0_10px_rgba(0,245,255,0.08)]'
                                  : 'bg-[#0c0e14] border-[#1a1e28] hover:border-[#283040]'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveTokenByMint(token.mintAddress);
                                    if (onChangeView) onChangeView('studio');
                                    if (isMobileOpen) onCloseMobile();
                                  }}
                                  className="flex items-center gap-2 min-w-0 text-left cursor-pointer flex-1"
                                >
                                  <div className="w-5 h-5 rounded bg-[#1c2230] border border-[#2d364a] text-white flex items-center justify-center font-mono text-[9px] font-bold shrink-0">
                                    {token.ticker.slice(0, 2)}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="text-[11px] font-bold text-white truncate flex items-center gap-1">
                                      <span>${token.ticker}</span>
                                      {isActive && (
                                        <span className="text-[7px] font-mono px-1 rounded bg-[#39ff14]/15 text-[#39ff14] border border-[#39ff14]/30">
                                          ACTIVE
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[9px] font-mono text-[#8e99ac] truncate">
                                      {token.mintAddress.slice(0, 4)}...{token.mintAddress.slice(-4)}
                                    </div>
                                  </div>
                                </button>

                                <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onSelectTokenForMicroSite(token);
                                      if (isMobileOpen) onCloseMobile();
                                    }}
                                    className="p-1 rounded hover:bg-[#1c2230] text-[#00f5ff] transition-colors cursor-pointer"
                                    title="Open Micro-Site"
                                  >
                                    <Globe className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (confirm(`Remove $${token.ticker} from workspace?`)) {
                                        removeTokenRecord(token.mintAddress);
                                      }
                                    }}
                                    className="p-1 rounded hover:bg-red-500/20 text-[#5b6475] hover:text-red-400 transition-colors cursor-pointer"
                                    title="Remove from history"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="w-full p-3 rounded-xl bg-[#12151e] hover:bg-[#181d28] text-[#00f5ff] border border-[#232938] flex items-center justify-center cursor-pointer transition-colors"
                title={`Coin History (${userTokens.length})`}
              >
                <Coins className="w-4 h-4 text-[#00f5ff]" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Sidebar Footer */}
        {!isCollapsed && (
          <div className="p-3 border-t border-[#1e222d] bg-[#0c0e14] shrink-0">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#8e99ac]">
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${wallet.network === 'mainnet' ? 'bg-[#39ff14]' : 'bg-[#00f5ff] animate-pulse'}`} />
                <span>{wallet.network === 'mainnet' ? 'Solana Mainnet-Beta' : 'Solana Devnet (Sandbox)'}</span>
              </span>
              <span className="text-[#ccff00]">v2.5 Cockpit</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

