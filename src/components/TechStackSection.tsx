import React, { useState } from 'react';
import {
  Cpu,
  Zap,
  ShieldCheck,
  Layers,
  Terminal,
  Sparkles,
  Database,
  Code,
  Globe,
  Lock,
  Coins,
  Bot,
  Activity,
  Workflow,
} from 'lucide-react';

type TechTab = 'all' | 'ai_agents' | 'solana' | 'security' | 'monetization';

export const TechStackSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TechTab>('ai_agents');

  const stackItems = [
    {
      id: 'gemini',
      title: 'Google Gemini 2.5 Flash & 3.1 Flash Image',
      category: 'Agent 01 & 02: Narrative & Vision',
      tab: 'ai_agents' as const,
      icon: <Sparkles className="w-5 h-5 text-[#00f5ff]" />,
      accentColor: 'border-[#00f5ff]/40 text-[#00f5ff]',
      badgeColor: 'bg-[#00f5ff]/10 text-[#00f5ff] border-[#00f5ff]/30',
      description:
        'Drives Agent 01 (Narrative Strategist) and Agent 02 (Visual Studio) with strict JSON schema adherence and sub-second generation latency.',
      specs: ['Structured JSON Output', 'Prompt Sanitization', 'Adaptive Tone & Lore Matrix'],
    },
    {
      id: 'mobilizer',
      title: 'Agent 03: Community Mobilizer & Dispatch Bot',
      category: 'Agent 03: Social Mobilization',
      tab: 'ai_agents' as const,
      icon: <Bot className="w-5 h-5 text-[#f43f5e]" />,
      accentColor: 'border-[#f43f5e]/40 text-[#f43f5e]',
      badgeColor: 'bg-[#f43f5e]/10 text-[#f43f5e] border-[#f43f5e]/30',
      description:
        'Generates real-time Telegram buy notifications, milestone alerts, and 1-click URL-encoded Twitter broadcast links with human verification gates.',
      specs: ['Direct X.com Intent Generation', 'Telegram HTML Formatting', '4 Dynamic Event Triggers'],
    },
    {
      id: 'microsites',
      title: 'Agent 04: Dynamic Micro-Site & Ops Host',
      category: 'Agent 04: Web3 Landing Engine',
      tab: 'ai_agents' as const,
      icon: <Globe className="w-5 h-5 text-[#a855f7]" />,
      accentColor: 'border-[#a855f7]/40 text-[#a855f7]',
      badgeColor: 'bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30',
      description:
        'Instantly provisions stateless `/token/:contractAddress` landing pages with live DexScreener charts, swap routing, and viral creator referral loops.',
      specs: ['Client-Side Solana Hydration', '$0 Serverless Infrastructure', 'Self-Funding Referral Loops'],
    },
    {
      id: 'clawpump',
      title: 'ClawPump v2 Bonding Curve',
      category: 'Solana Smart Contract Layer',
      tab: 'solana' as const,
      icon: <Zap className="w-5 h-5 text-[#ccff00]" />,
      accentColor: 'border-[#ccff00]/40 text-[#ccff00]',
      badgeColor: 'bg-[#ccff00]/10 text-[#ccff00] border-[#ccff00]/30',
      description:
        'Non-custodial constant-product automated market maker (x * y = k) providing instant liquidity bonding curves with revoked mint & freeze authorities.',
      specs: ['Zero Central Treasury', 'Revoked Mint Authority', 'Automated Raydium Migration'],
    },
    {
      id: 'web3',
      title: 'Solana Web3.js & Devnet Engine',
      category: 'On-Chain Client Formatting',
      tab: 'solana' as const,
      icon: <Terminal className="w-5 h-5 text-[#39ff14]" />,
      accentColor: 'border-[#39ff14]/40 text-[#39ff14]',
      badgeColor: 'bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14]/30',
      description:
        'Encodes raw transactions client-side with compute-budget optimization, MEV slippage protection (0.5%-2%), and Devnet sandbox testing.',
      specs: ['Client-Side Transaction Bytecode', 'Devnet / Mainnet Toggle', 'Burner Wallet ≤ 0.1 SOL Cap'],
    },
    {
      id: 'canvas',
      title: 'HTML5 512x512 Meme Canvas Studio',
      category: 'Client-Side Graphic Studio',
      tab: 'ai_agents' as const,
      icon: <Layers className="w-5 h-5 text-[#39ff14]" />,
      accentColor: 'border-[#39ff14]/40 text-[#39ff14]',
      badgeColor: 'bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14]/30',
      description:
        'Interactive real-time canvas rendering 512x512 vector mascots with custom Breaking News, God Candle, Distracted Degen, and 16:9 X Banners.',
      specs: ['Real-Time Typography Composite', '512x512 High-DPI Export', 'Dynamic Watermark Stamping'],
    },
    {
      id: 'hitl',
      title: 'Human-In-The-Loop ($HITL) Defense Suite',
      category: 'Security & Safety Protocol',
      tab: 'security' as const,
      icon: <ShieldCheck className="w-5 h-5 text-[#ccff00]" />,
      accentColor: 'border-[#ccff00]/40 text-[#ccff00]',
      badgeColor: 'bg-[#ccff00]/10 text-[#ccff00] border-[#ccff00]/30',
      description:
        'Enforces mandatory creator review on every generated token name, visual asset, transaction signature, and automated Telegram community broadcast.',
      specs: ['100% Non-Custodial UI', 'Explicit Wallet Signing Gates', 'Pre-Flight Content Heuristics'],
    },
    {
      id: 'frontend',
      title: 'Vite, React 18 & Tailwind CSS',
      category: 'Frontend & Terminal Architecture',
      tab: 'security' as const,
      icon: <Code className="w-5 h-5 text-[#38bdf8]" />,
      accentColor: 'border-[#38bdf8]/40 text-[#38bdf8]',
      badgeColor: 'bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/30',
      description:
        'Cyber-terminal dark aesthetic designed with crisp monospace typography, zero-delay state hydration, and responsive desktop/mobile ergonomics.',
      specs: ['Sub-10ms UI State Transitions', 'Pure CSS Utility Design', 'Zero Layout Shifts'],
    },
  ];

  const filteredItems = activeTab === 'all' 
    ? stackItems 
    : stackItems.filter((item) => item.tab === activeTab);

  const tabs: { id: TechTab; label: string; icon: React.ReactNode; count: string }[] = [
    { id: 'ai_agents', label: 'Agent Intelligence', icon: <Bot className="w-3.5 h-3.5" />, count: 'Gemini + Canvas' },
    { id: 'solana', label: 'Solana Protocols', icon: <Zap className="w-3.5 h-3.5" />, count: 'ClawPump + Web3' },
    { id: 'security', label: 'Non-Custodial Security', icon: <ShieldCheck className="w-3.5 h-3.5" />, count: 'Human-In-The-Loop' },
    { id: 'monetization', label: 'Monetization Protocol', icon: <Coins className="w-3.5 h-3.5" />, count: 'On-Chain Split' },
    { id: 'all', label: 'All Architecture', icon: <Workflow className="w-3.5 h-3.5" />, count: '6 Modules' },
  ];

  return (
    <section id="tech-stack" className="py-10 sm:py-14 border-b border-[#2d3139] w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-7">
        {/* Section Title */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#ccff00] uppercase tracking-widest font-bold">
            <Cpu className="w-3.5 h-3.5 text-[#ccff00]" />
            Full-Stack Infrastructure
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
            Tech Stack &amp; Architecture Hub
          </h2>
          <p className="text-xs sm:text-sm text-[#e0e0e0] opacity-70 font-sans leading-relaxed">
            Organized architecture layers powering non-custodial token launches, Google Gemini agents, and verified Solana smart contract infrastructure.
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

        {/* Dynamic Tab Views */}
        {activeTab !== 'monetization' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl bg-[#12141a] border ${item.accentColor} hover:bg-[#151820] transition-all shadow-lg space-y-3.5 flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-[#0a0b0d] border border-[#2d3139] flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                      {item.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#e0e0e0] opacity-75 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                {/* Specs Pills */}
                <div className="pt-3 border-t border-[#2d3139] space-y-1">
                  {item.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-1.5 text-[11px] font-mono text-[#e0e0e0] opacity-70">
                      <span className="text-[#39ff14] text-[10px]">✔</span>
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Security Specific Tab Insight (When 'all' or 'security' selected) */}
        {(activeTab === 'all' || activeTab === 'security') && (
          <div className="p-6 rounded-2xl bg-[#0e1117] border border-[#39ff14]/40 shadow-[0_0_20px_rgba(57,255,20,0.06)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2d3139]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#12141a] border border-[#39ff14]/50 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#39ff14]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-tight font-mono">
                    Non-Custodial Architecture &amp; Creator Control
                  </h3>
                  <p className="text-[11px] font-mono text-[#39ff14]">
                    Zero Central Treasury • Client-Side Signing • Disposable Burner Best Practices
                  </p>
                </div>
              </div>
              <div className="text-[10px] font-mono text-[#ccff00] bg-[#12141a] px-3 py-1.5 rounded-lg border border-[#ccff00]/40 flex items-center gap-1.5 self-start sm:self-auto">
                <Lock className="w-3 h-3 text-[#ccff00]" />
                <span>STRICTLY NON-CUSTODIAL</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
              <div className="space-y-1 p-3 rounded-xl bg-[#12141a] border border-[#2d3139]">
                <div className="text-[#39ff14] font-mono font-bold uppercase text-[10px]">1. Zero Central Treasury</div>
                <p className="text-[#e0e0e0] opacity-75 text-[11px] leading-relaxed">
                  Never accepts deposits, holds user balances, or maintains custody of SOL funds on server backends.
                </p>
              </div>

              <div className="space-y-1 p-3 rounded-xl bg-[#12141a] border border-[#2d3139]">
                <div className="text-[#00f5ff] font-mono font-bold uppercase text-[10px]">2. Browser-Only Signing</div>
                <p className="text-[#e0e0e0] opacity-75 text-[11px] leading-relaxed">
                  All Solana transaction bytecode is assembled client-side and signed directly in your connected wallet.
                </p>
              </div>

              <div className="space-y-1 p-3 rounded-xl bg-[#12141a] border border-[#2d3139]">
                <div className="text-[#ccff00] font-mono font-bold uppercase text-[10px]">3. Pre-Flight Heuristics</div>
                <p className="text-[#e0e0e0] opacity-75 text-[11px] leading-relaxed">
                  Automated heuristic sanitization flags malicious injection patterns and high-risk policy conflicts.
                </p>
              </div>

              <div className="space-y-1 p-3 rounded-xl bg-[#12141a] border border-[#2d3139]">
                <div className="text-[#f43f5e] font-mono font-bold uppercase text-[10px]">4. Disposable Burner Cap</div>
                <p className="text-[#e0e0e0] opacity-75 text-[11px] leading-relaxed">
                  Recommended testing practices suggest test wallets capped to ≤ 0.10 SOL to isolate primary assets.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Monetization Specific Tab Insight (When 'all' or 'monetization' selected) */}
        {(activeTab === 'all' || activeTab === 'monetization') && (
          <div className="p-6 rounded-2xl bg-[#0a0c12] border border-[#00f5ff]/40 shadow-[0_0_20px_rgba(0,245,255,0.06)] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2d3139]">
              <div>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-[#ccff00]" />
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                    Public Platform Monetization &amp; Self-Funding Protocol
                  </h3>
                </div>
                <p className="text-[11px] text-[#e0e0e0]/70 font-mono mt-1">
                  Zero hosting deficit • On-chain royalty split • 35% Buyback &amp; Burn of $HITL
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#ccff00]/10 text-[#ccff00] text-[10px] font-mono font-bold border border-[#ccff00]/30 self-start sm:self-auto">
                ON-CHAIN SMART CONTRACT ROUTING
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#12151f] border border-[#2d3139] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#00f5ff]">1. Upfront Creator Fee</span>
                  <span className="text-white font-bold">~0.02 SOL</span>
                </div>
                <p className="text-[#e0e0e0]/75 font-sans text-[11px] leading-relaxed">
                  Injected into the deployment instruction to subsidize multi-agent compute and decentralized storage. Single launch covers months of serverless hosting.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#12151f] border border-[#2d3139] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#39ff14]">2. Bonding Curve Volume</span>
                  <span className="text-white font-bold">1% Royalty Split</span>
                </div>
                <p className="text-[#e0e0e0]/75 font-sans text-[11px] leading-relaxed">
                  When a token gains traction, 1% of creator volume generated on ClawPump bonding curves streams directly to the non-custodial platform treasury.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#12151f] border border-[#2d3139] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#ccff00]">3. Buyback &amp; Burn</span>
                  <span className="text-white font-bold">35% to $HITL</span>
                </div>
                <p className="text-[#e0e0e0]/75 font-sans text-[11px] leading-relaxed">
                  35% of all platform royalties automatically buy back and burn the ecosystem showcase token ($HITL), creating deflationary alignment.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
