import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Zap, 
  ExternalLink, 
  Menu, 
  ChevronDown, 
  BookOpen, 
  Shield, 
  Layers, 
  HelpCircle,
  Laptop,
  Database
} from 'lucide-react';
import { ConnectWalletButton } from './ConnectWalletButton';

interface HeaderProps {
  activeView: 'studio' | 'landing';
  onChangeView: (view: 'studio' | 'landing') => void;
  onReset: () => void;
  hasData: boolean;
  onOpenMobileSidebar?: () => void;
  onNavigateToSection?: (sectionId: string) => void;
  onOpenWhitepaper?: () => void;
  onOpenDatabaseModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onChangeView,
  onReset,
  hasData,
  onOpenMobileSidebar,
  onNavigateToSection,
  onOpenWhitepaper,
  onOpenDatabaseModal,
}) => {
  const [isLandingDropdownOpen, setIsLandingDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Intelligent mobile viewport detection
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleViewportChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
      if (e.matches) {
        setIsLandingDropdownOpen(false);
      }
    };
    handleViewportChange(mediaQuery);

    try {
      mediaQuery.addEventListener('change', handleViewportChange);
      return () => mediaQuery.removeEventListener('change', handleViewportChange);
    } catch {
      mediaQuery.addListener(handleViewportChange);
      return () => mediaQuery.removeListener(handleViewportChange);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLandingDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLandingSectionClick = (sectionId: string) => {
    setIsLandingDropdownOpen(false);
    if (activeView !== 'landing') {
      onChangeView('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="h-14 sm:h-16 border-b border-[#2d3139] flex items-center justify-between px-2.5 sm:px-6 bg-[#0d0f14]/95 backdrop-blur-md sticky top-0 z-30 w-full max-w-full">
      <div className="w-full max-w-full flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Left Section: Prioritized Mobile Sidebar Toggle & Branding */}
        <div className="flex items-center gap-2 sm:gap-3 shrink min-w-0">
          {onOpenMobileSidebar && (
            <button
              type="button"
              id="header-mobile-sidebar-toggle"
              onClick={onOpenMobileSidebar}
              className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#141822] hover:bg-[#1f2637] text-[#00f5ff] border border-[#00f5ff]/30 shadow-[0_0_10px_rgba(0,245,255,0.15)] active:scale-95 transition-all flex items-center justify-center cursor-pointer shrink-0"
              title="Open Workspace Sidebar & Tools"
              aria-label="Open Workspace Sidebar & Tools"
            >
              <Menu className="w-4 h-4 text-[#00f5ff]" />
            </button>
          )}

          <button 
            type="button"
            onClick={() => onChangeView('studio')}
            className="flex items-center gap-1.5 sm:gap-2 text-left cursor-pointer group shrink min-w-0"
            title="MemeFI OS - Solana Launchpad"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#00f5ff] to-[#ccff00] rounded-lg flex items-center justify-center font-bold text-black text-sm sm:text-base italic shrink-0 shadow-[0_0_12px_rgba(0,245,255,0.3)] group-hover:scale-105 transition-transform">
              M
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <h1 className="text-sm sm:text-lg font-black tracking-tight uppercase flex items-center truncate">
                  <span className="text-white">MemeFI</span>
                  <span className="text-[#00f5ff] ml-0.5">OS</span>
                </h1>
                <span className="hidden sm:inline-flex text-[10px] font-mono text-slate-300 opacity-60 px-1.5 py-0.5 rounded bg-[#1a1d24] border border-[#2d3139]">
                  v2.5
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 opacity-60 hidden sm:block uppercase tracking-wider">
                AI-Powered Launch Studio on Solana
              </p>
            </div>
          </button>
        </div>

        {/* Center View Switcher: Studio Workspace vs. Landing Page (Desktop Only: md:flex) */}
        <nav className="hidden md:flex items-center gap-2 bg-[#12151e] p-1 rounded-xl border border-[#232938]">
          {/* Studio Workspace Tab */}
          <button
            type="button"
            id="desktop-launch-studio-tab"
            onClick={() => onChangeView('studio')}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'studio'
                ? 'bg-gradient-to-r from-[#00f5ff]/20 to-[#ccff00]/20 text-white border border-[#00f5ff]/40 shadow-[0_0_12px_rgba(0,245,255,0.15)]'
                : 'text-[#8e99ac] hover:text-white hover:bg-[#1a1f2c]'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 text-[#00f5ff]" />
            <span>Launch Studio</span>
          </button>

          {/* Landing Page Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              id="desktop-landing-docs-dropdown"
              onClick={() => setIsLandingDropdownOpen(!isLandingDropdownOpen)}
              className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'landing'
                  ? 'bg-[#1e2433] text-white border border-[#2d364a]'
                  : 'text-[#8e99ac] hover:text-white hover:bg-[#1a1f2c]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#ccff00]" />
              <span>Landing Page</span>
              <ChevronDown className={`w-3 h-3 text-[#8e99ac] transition-transform ${isLandingDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Items */}
            {isLandingDropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 rounded-xl bg-[#0e1118] border border-[#262d3d] shadow-2xl py-1.5 z-50 text-xs font-mono backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => handleLandingSectionClick('hero-section')}
                  className="w-full px-3 py-2 text-left text-white hover:bg-[#181d28] hover:text-[#00f5ff] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-[#00f5ff]" />
                  <div>
                    <div className="font-bold">Overview &amp; Hero</div>
                    <div className="text-[10px] text-[#8e99ac]">Landing page intro</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleLandingSectionClick('about-section')}
                  className="w-full px-3 py-2 text-left text-white hover:bg-[#181d28] hover:text-[#00f5ff] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#ccff00]" />
                  <div>
                    <div className="font-bold">About Protocol</div>
                    <div className="text-[10px] text-[#8e99ac]">Autonomous meme coin engine</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleLandingSectionClick('features-section')}
                  className="w-full px-3 py-2 text-left text-white hover:bg-[#181d28] hover:text-[#00f5ff] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-[#39ff14]" />
                  <div>
                    <div className="font-bold">Features &amp; Swarm</div>
                    <div className="text-[10px] text-[#8e99ac]">4 AI agents &amp; Defense suite</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleLandingSectionClick('tech-stack-section')}
                  className="w-full px-3 py-2 text-left text-white hover:bg-[#181d28] hover:text-[#00f5ff] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-[#00f5ff]" />
                  <div>
                    <div className="font-bold">Architecture</div>
                    <div className="text-[10px] text-[#8e99ac]">Solana non-custodial pipeline</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleLandingSectionClick('faq-section')}
                  className="w-full px-3 py-2 text-left text-white hover:bg-[#181d28] hover:text-[#00f5ff] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <div>
                    <div className="font-bold">FAQ</div>
                    <div className="text-[10px] text-[#8e99ac]">Frequently asked questions</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLandingDropdownOpen(false);
                    if (onOpenWhitepaper) onOpenWhitepaper();
                  }}
                  className="w-full px-3 py-2 text-left text-white hover:bg-[#181d28] hover:text-[#00f5ff] flex items-center gap-2.5 transition-colors cursor-pointer border-t border-[#1f2638]"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#00f5ff]" />
                  <div>
                    <div className="font-bold text-[#00f5ff]">Protocol Whitepaper</div>
                    <div className="text-[10px] text-[#8e99ac]">Specifications &amp; Markdown Export</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Quick Direct Whitepaper Button */}
          {onOpenWhitepaper && (
            <button
              type="button"
              onClick={onOpenWhitepaper}
              className="px-3 py-1.5 text-xs font-mono font-bold rounded-lg text-[#00f5ff] hover:bg-[#00f5ff]/15 hover:text-white border border-[#00f5ff]/30 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Open MemeFi OS Protocol Whitepaper & Specification"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#00f5ff]" />
              <span>Whitepaper</span>
            </button>
          )}

          {/* Firestore Database Generations Button */}
          {onOpenDatabaseModal && (
            <button
              type="button"
              onClick={onOpenDatabaseModal}
              className="px-3 py-1.5 text-xs font-mono font-bold rounded-lg text-emerald-400 hover:bg-emerald-500/15 hover:text-white border border-emerald-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
              title="View Firestore Database Collections & Recent Generations"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Database</span>
            </button>
          )}
        </nav>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Non-Critical Extended Nav Links & Icons: Intelligently Hidden on Mobile and Tablet (<xl) */}
          <div className="hidden xl:flex items-center gap-1 text-xs font-mono text-[#8e99ac]">
            <a
              href="https://x.com/MemeFi_OS"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 hover:text-[#00f5ff] transition-colors flex items-center gap-1"
            >
              <span>Twitter / X</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
            <a
              href="https://t.me/+gbar8aC6QgkzZDNh"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 hover:text-[#39ff14] transition-colors flex items-center gap-1"
            >
              <span>Telegram</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>

          {/* Solana Wallet Button */}
          <ConnectWalletButton />

          {/* Non-Critical Desktop Action: Quick Reset / 'New Coin' (Intelligently Hidden on Mobile, md:flex only) */}
          {hasData && (
            <button
              type="button"
              id="header-new-coin-desktop-btn"
              onClick={(e) => {
                e.preventDefault();
                onReset();
                if (activeView !== 'studio') onChangeView('studio');
              }}
              className="hidden md:flex text-xs font-mono uppercase px-3 py-1.5 rounded-lg bg-[#1a1d24] hover:bg-[#2d3139] text-[#00f5ff] border border-[#00f5ff]/40 transition-colors items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(0,245,255,0.1)]"
              title="Start a new meme coin concept"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00f5ff]" />
              <span>New Coin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
