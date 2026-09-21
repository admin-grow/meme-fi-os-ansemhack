import React, { useState } from 'react';
import {
  Bot,
  Image,
  Send,
  CheckCircle2,
  Sparkles,
  Terminal,
  Zap,
  Layers,
  Workflow,
  ShieldCheck,
  Globe,
  Radio,
} from 'lucide-react';

type FeatureTab = 'all' | 'agents' | 'defense' | 'microsites';

export const AgentsOverviewSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FeatureTab>('all');

  React.useEffect(() => {
    const handleTabSwitch = (e: Event) => {
      const customEvent = e as CustomEvent<FeatureTab>;
      if (customEvent.detail) {
        setActiveTab(customEvent.detail);
      }
    };
    window.addEventListener('switch-features-tab', handleTabSwitch as EventListener);
    return () => {
      window.removeEventListener('switch-features-tab', handleTabSwitch as EventListener);
    };
  }, []);

  const tabs: { id: FeatureTab; label: string; icon: React.ReactNode; count: string }[] = [
    { id: 'all', label: 'All 6 Platform Capabilities', icon: <Workflow className="w-3.5 h-3.5" />, count: 'Full Stack' },
    { id: 'agents', label: '4 Sequential AI Agents', icon: <Bot className="w-3.5 h-3.5" />, count: 'Workflow 01 - 04' },
    { id: 'defense', label: 'Defense & HITL Suite', icon: <ShieldCheck className="w-3.5 h-3.5" />, count: 'Safety Gate' },
    { id: 'microsites', label: 'Dynamic Micro-Sites', icon: <Globe className="w-3.5 h-3.5" />, count: 'Viral Loop' },
  ];

  return (
    <section id="features-section" className="py-10 sm:py-14 border-b border-[#2d3139] scroll-mt-20">
      <div className="max-w-7xl mx-auto space-y-7">
        {/* Section Title */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00f5ff] uppercase tracking-widest font-bold">
            <span className="w-2 h-2 rounded-full bg-[#00f5ff]"></span>
            Multi-Agent Operations &amp; Defense Suite
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
            Features &amp; 4-Agent Operations Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-[#e0e0e0] opacity-70 font-sans leading-relaxed">
            Every meme coin campaign is generated through 4 sequential AI agents governed by strict JSON contracts, an on-chain non-custodial Defense Suite, and automated dynamic micro-sites.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center justify-center">
          <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#0a0c12] border border-[#2d3139] shadow-inner max-w-full justify-center">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-3.5 rounded-xl font-mono text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1a1f2c] text-white font-bold border border-[#00f5ff]/60 shadow-[0_0_12px_rgba(0,245,255,0.2)]'
                      : 'text-[#e0e0e0]/70 hover:text-white hover:bg-[#12151e] border border-transparent'
                  }`}
                >
                  <span className={isActive ? 'text-[#00f5ff]' : 'text-[#e0e0e0]/50'}>{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-md hidden sm:inline-block ${
                      isActive ? 'bg-[#00f5ff]/20 text-[#00f5ff] font-bold' : 'bg-[#181c26] text-[#e0e0e0]/40'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Capabilities Grid Filtered by Tab */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. AGENT 01: Concept & Narrative Strategist */}
          {(activeTab === 'all' || activeTab === 'agents') && (
            <div className="p-5 rounded-2xl bg-[#12141a] border border-[#2d3139] hover:border-[#00f5ff]/60 transition-all shadow-xl space-y-4 relative flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#0a0b0d] border border-[#00f5ff] flex items-center justify-center text-[#00f5ff] shadow-[0_0_12px_rgba(0,245,255,0.2)]">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-[#8e99ac] uppercase">Step 1</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#062c33] text-[#00f5ff] border border-[#00f5ff]/40 uppercase">
                      Agent 01
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-tight">
                    Trend &amp; Narrative Strategist
                  </h3>
                  <p className="text-xs text-[#00f5ff] font-mono">Category: Narrative &amp; Ticker Engine</p>
                </div>

                <p className="text-xs text-[#e0e0e0] opacity-75 font-sans leading-relaxed">
                  Extracts 100% unique 3–5 letter tickers, viral trend scores (0–100), launch lore, 3-season retention storylines, and high-engagement launch tweet packs.
                </p>

                <div className="p-3 rounded-xl bg-[#0a0b0d] border border-[#2d3139] space-y-1.5 font-mono text-[11px]">
                  <div className="text-[10px] text-[#e0e0e0] opacity-40 uppercase font-bold">Strict JSON Contract:</div>
                  <div className="text-[#00f5ff] truncate">{"{ token_name, ticker, lore, tweet_pack, mascot_prompt }"}</div>
                  <div className="text-[10px] text-[#39ff14] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Status: User Review &amp; Approval Required</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#2d3139] flex items-center justify-between text-[11px] font-mono text-[#e0e0e0] opacity-60">
                <span>Model: Gemini 2.5 Flash</span>
                <span>Latency: ~400ms</span>
              </div>
            </div>
          )}

          {/* 2. AGENT 02: Visual Content & Graphic Studio */}
          {(activeTab === 'all' || activeTab === 'agents') && (
            <div className="p-5 rounded-2xl bg-[#12141a] border border-[#2d3139] hover:border-[#39ff14]/60 transition-all shadow-xl space-y-4 relative flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#0a0b0d] border border-[#39ff14] flex items-center justify-center text-[#39ff14] shadow-[0_0_12px_rgba(57,255,20,0.2)]">
                    <Image className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-[#8e99ac] uppercase">Step 2</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#064e3b] text-[#39ff14] border border-[#39ff14]/40 uppercase">
                      Agent 02
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-tight">
                    Visual Content &amp; Meme Studio
                  </h3>
                  <p className="text-xs text-[#39ff14] font-mono">Category: Generative Art &amp; Canvas</p>
                </div>

                <p className="text-xs text-[#e0e0e0] opacity-75 font-sans leading-relaxed">
                  Synthesizes 512×512 vector mascot imagery and renders live meme overlays (Breaking News, God Candle, Distracted Degen, Laser Eyes, and 16:9 X Banners).
                </p>

                <div className="p-3 rounded-xl bg-[#0a0b0d] border border-[#2d3139] space-y-1.5 font-mono text-[11px]">
                  <div className="text-[10px] text-[#e0e0e0] opacity-40 uppercase font-bold">Strict JSON Contract:</div>
                  <div className="text-[#39ff14] truncate">{"{ image_generation_prompt, meme_overlay, watermark }"}</div>
                  <div className="text-[10px] text-[#39ff14] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Resolution: 512x512 PNG Export</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#2d3139] flex items-center justify-between text-[11px] font-mono text-[#e0e0e0] opacity-60">
                <span>Model: Gemini 3.1 Flash Image</span>
                <span>Presets: 5 Styles</span>
              </div>
            </div>
          )}

          {/* 3. AGENT 03: Community Mobilizer & Dispatch Bot */}
          {(activeTab === 'all' || activeTab === 'agents') && (
            <div className="p-5 rounded-2xl bg-[#12141a] border border-[#2d3139] hover:border-[#f43f5e]/60 transition-all shadow-xl space-y-4 relative flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#0a0b0d] border border-[#f43f5e] flex items-center justify-center text-[#f43f5e] shadow-[0_0_12px_rgba(244,63,94,0.2)]">
                    <Send className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-[#8e99ac] uppercase">Step 3</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#4c0519] text-[#f43f5e] border border-[#f43f5e]/40 uppercase">
                      Agent 03
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-tight">
                    Community Mobilizer &amp; Dispatch Bot
                  </h3>
                  <p className="text-xs text-[#f43f5e] font-mono">Category: Telegram &amp; Twitter Mobilizer</p>
                </div>

                <p className="text-xs text-[#e0e0e0] opacity-75 font-sans leading-relaxed">
                  Formats real-time Telegram buy notifications, milestone announcements, green candle alerts, and 1-click URL-encoded Twitter community broadcast and momentum triggers.
                </p>

                <div className="p-3 rounded-xl bg-[#0a0b0d] border border-[#2d3139] space-y-1.5 font-mono text-[11px]">
                  <div className="text-[10px] text-[#e0e0e0] opacity-40 uppercase font-bold">Strict JSON Contract:</div>
                  <div className="text-[#f43f5e] truncate">{"{ telegram_message, button_label, button_url }"}</div>
                  <div className="text-[10px] text-[#39ff14] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Integration: Direct X.com Intents</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#2d3139] flex items-center justify-between text-[11px] font-mono text-[#e0e0e0] opacity-60">
                <span>Triggers: 4 Event Types</span>
                <span>Approval: Human-In-The-Loop</span>
              </div>
            </div>
          )}

          {/* 4. AGENT 04: Dynamic Micro-Site & Operations Host */}
          {(activeTab === 'all' || activeTab === 'agents') && (
            <div className="p-5 rounded-2xl bg-[#12141a] border border-[#2d3139] hover:border-[#a855f7]/60 transition-all shadow-xl space-y-4 relative flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#0a0b0d] border border-[#a855f7] flex items-center justify-center text-[#a855f7] shadow-[0_0_12px_rgba(168,85,247,0.2)]">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-[#8e99ac] uppercase">Step 4</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#3b0764] text-[#a855f7] border border-[#a855f7]/40 uppercase">
                      Agent 04
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-tight">
                    Micro-Site &amp; Operations Host
                  </h3>
                  <p className="text-xs text-[#a855f7] font-mono">Category: Dynamic Web3 Landing Engine</p>
                </div>

                <p className="text-xs text-[#e0e0e0] opacity-75 font-sans leading-relaxed">
                  Auto-assembles standalone `/token/[contractAddress]` landing pages with live DexScreener charts, swap routing, bonding curves, and a built-in viral creator referral banner.
                </p>

                <div className="p-3 rounded-xl bg-[#0a0b0d] border border-[#2d3139] space-y-1.5 font-mono text-[11px]">
                  <div className="text-[10px] text-[#e0e0e0] opacity-40 uppercase font-bold">Hosting &amp; State:</div>
                  <div className="text-[#a855f7] truncate">{"/token/:mintAddress (Stateless & Fast)"}</div>
                  <div className="text-[10px] text-[#39ff14] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Cost: $0.00 Serverless Hosting</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#2d3139] flex items-center justify-between text-[11px] font-mono text-[#e0e0e0] opacity-60">
                <span>Routing: Solana Client-Side</span>
                <span>Referral: Viral Growth CTA</span>
              </div>
            </div>
          )}
        </div>

        {/* DEFENSE SUITE & HITL SAFETY SECTION */}
        {(activeTab === 'all' || activeTab === 'defense') && (
          <div className="p-6 rounded-2xl bg-[#0e1117] border border-[#ccff00]/40 shadow-[0_0_20px_rgba(204,255,0,0.06)] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2d3139]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#12141a] border border-[#ccff00]/60 flex items-center justify-center text-[#ccff00] shadow-[0_0_12px_rgba(204,255,0,0.2)]">
                  <ShieldCheck className="w-5 h-5 text-[#ccff00]" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#ccff00] font-bold uppercase tracking-wider">
                    Security &amp; Safety Protocol
                  </div>
                  <h3 className="text-base font-bold text-white uppercase tracking-tight font-mono">
                    Creator Control Suite: Human-In-The-Loop Workflow
                  </h3>
                </div>
              </div>
              <span className="px-3 py-1 rounded-lg bg-[#ccff00]/10 text-[#ccff00] text-[10px] font-mono font-bold border border-[#ccff00]/30 self-start sm:self-auto">
                NON-CUSTODIAL &bull; CREATOR DIRECTED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#12141a] border border-[#2d3139] space-y-2">
                <div className="text-[#39ff14] font-mono font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#39ff14]" />
                  <span>1. Zero Custody Signing</span>
                </div>
                <p className="text-[#e0e0e0]/75 text-[11px] font-sans leading-relaxed">
                  No private keys touch any server. All transactions are compiled in the browser and signed directly by Phantom, Solflare, or connected wallets.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#12141a] border border-[#2d3139] space-y-2">
                <div className="text-[#00f5ff] font-mono font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#00f5ff]" />
                  <span>2. Creator Review &amp; Edit</span>
                </div>
                <p className="text-[#e0e0e0]/75 text-[11px] font-sans leading-relaxed">
                  All agent outputs are drafts presented directly in the studio. You inspect, edit, or reject before any deploy or broadcast occurs.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#12141a] border border-[#2d3139] space-y-2">
                <div className="text-[#ccff00] font-mono font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#ccff00]" />
                  <span>3. Revoked Authorities</span>
                </div>
                <p className="text-[#e0e0e0]/75 text-[11px] font-sans leading-relaxed">
                  Mint and Freeze authorities are permanently revoked upon deploy, providing mathematical protection against honeypots and blacklists.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#12141a] border border-[#2d3139] space-y-2">
                <div className="text-[#f43f5e] font-mono font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-[#f43f5e]" />
                  <span>4. Pre-Flight Sanitizer</span>
                </div>
                <p className="text-[#e0e0e0]/75 text-[11px] font-sans leading-relaxed">
                  Automated heuristics scan prompt payloads against malicious strings and trademark infringements before forwarding to AI agents.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* DYNAMIC MICRO-SITES DEEP DIVE (When 'microsites' tab is selected) */}
        {activeTab === 'microsites' && (
          <div className="p-6 rounded-2xl bg-[#0a0c12] border border-[#a855f7]/40 shadow-[0_0_20px_rgba(168,85,247,0.06)] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2d3139]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#12141a] border border-[#a855f7]/60 flex items-center justify-center text-[#a855f7] shadow-[0_0_12px_rgba(168,85,247,0.2)]">
                  <Globe className="w-5 h-5 text-[#a855f7]" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#a855f7] font-bold uppercase tracking-wider">
                    Growth Infrastructure
                  </div>
                  <h3 className="text-base font-bold text-white uppercase tracking-tight font-mono">
                    Dynamic Token Micro-Sites &amp; Viral Referral Loops
                  </h3>
                </div>
              </div>
              <span className="px-3 py-1 rounded-lg bg-[#a855f7]/10 text-[#a855f7] text-[10px] font-mono font-bold border border-[#a855f7]/30 self-start sm:self-auto">
                INSTANT ZERO-COST DEPLOYMENT
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#12151f] border border-[#2d3139] space-y-2">
                <div className="text-[10px] uppercase font-bold text-[#00f5ff]">1. Live On-Chain Hydration</div>
                <p className="text-[#e0e0e0]/75 font-sans text-[11px] leading-relaxed">
                  Fetches live price, market cap, and DexScreener chart embeds directly from Solana RPC without server database overhead.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#12151f] border border-[#2d3139] space-y-2">
                <div className="text-[10px] uppercase font-bold text-[#39ff14]">2. Multi-Season Story Hub</div>
                <p className="text-[#e0e0e0]/75 font-sans text-[11px] leading-relaxed">
                  Houses all 3 narrative seasons, launch tweet packs, and downloadable meme graphics for community mobilization in one link.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#12151f] border border-[#2d3139] space-y-2">
                <div className="text-[10px] uppercase font-bold text-[#ccff00]">3. Self-Funding Referral CTA</div>
                <p className="text-[#e0e0e0]/75 font-sans text-[11px] leading-relaxed">
                  Features an embedded <strong>[ ⚡ Powered by MemeFi OS — Launch Yours ]</strong> banner that funnels token buyers into launching their own coins.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
