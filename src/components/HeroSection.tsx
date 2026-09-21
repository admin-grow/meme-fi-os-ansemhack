import React from 'react';
import { Sparkles, Zap, ArrowDown, Bot, Flame, Layers } from 'lucide-react';

interface HeroSectionProps {
  onLaunchStudio: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onLaunchStudio,
}) => {
  return (
    <section id="hero-section" className="relative py-10 sm:py-14 border-b border-[#2d3139] overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#00f5ff]/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[250px] bg-[#39ff14]/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <a
            href="https://clawpump.tech/ansemhack"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#12141a] px-3.5 py-1.5 rounded-full border border-[#39ff14]/50 shadow-[0_0_12px_rgba(57,255,20,0.15)] hover:border-[#39ff14] transition-all cursor-pointer group"
          >
            <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse shadow-[0_0_8px_#39ff14]"></span>
            <span className="text-xs font-mono text-[#39ff14] font-bold uppercase tracking-wider group-hover:underline">
              AnsemHack Solana Track
            </span>
          </a>

          <div className="inline-flex items-center gap-1.5 bg-[#12141a] px-3 py-1.5 rounded-full border border-[#00f5ff]/40 text-xs font-mono text-[#00f5ff]">
            <Sparkles className="w-3.5 h-3.5 text-[#00f5ff]" />
            <span className="font-semibold uppercase tracking-wider">4x Synchronized Gemini Agents &amp; Defense Suite</span>
          </div>

          <a
            href="https://x.com/MemeFi_OS"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#12141a] px-3.5 py-1.5 rounded-full border border-[#00f5ff]/50 text-xs font-mono text-[#00f5ff] shadow-[0_0_10px_rgba(0,245,255,0.15)] hover:border-[#00f5ff] transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-[#00f5ff]" />
            <span className="font-bold uppercase tracking-wider">@MemeFi_OS</span>
          </a>
        </div>

        {/* Main Headline */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-[#00f5ff] uppercase font-bold tracking-widest">
            MemeFI OS • AI-Powered Web3 Studio
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase font-sans leading-[1.1]">
            Don't Just Launch a Token. <span className="text-[#39ff14]">Launch an Entire Movement.</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-[#e0e0e0] opacity-90 max-w-3xl mx-auto font-sans leading-relaxed">
            The AI-powered multi-agent studio that transforms internet sentiment into complete on-chain Solana token brands—synthesizing custom lore, vector mascots, social launch kits, and ClawPump bonding curves with a human in the loop.
          </p>
        </div>

        {/* CTA Button Group */}
        <div className="flex items-center justify-center pt-2">
          <button
            type="button"
            onClick={onLaunchStudio}
            className="w-full sm:w-auto py-3.5 px-8 bg-[#ccff00] text-black font-extrabold text-sm uppercase tracking-wider rounded-xl hover:bg-[#e0ff4f] shadow-[0_0_25px_rgba(204,255,0,0.3)] flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer font-mono"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>Open Operations Hub</span>
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        {/* Key Features Micro-Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-4 text-left max-w-5xl mx-auto">
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('switch-features-tab', { detail: 'agents' }));
              const el = document.getElementById('features-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-3 rounded-lg bg-[#12141a]/90 border border-[#2d3139] hover:border-[#00f5ff]/60 transition-all text-left space-y-0.5 cursor-pointer group"
          >
            <div className="text-[10px] font-mono text-[#00f5ff] uppercase font-bold flex items-center gap-1">
              <Bot className="w-3 h-3 text-[#00f5ff]" />
              Agent 01
            </div>
            <div className="text-xs font-bold text-white group-hover:text-[#00f5ff] transition-colors">Lore &amp; Ticker Engine</div>
          </button>

          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('switch-features-tab', { detail: 'agents' }));
              const el = document.getElementById('features-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-3 rounded-lg bg-[#12141a]/90 border border-[#2d3139] hover:border-[#39ff14]/60 transition-all text-left space-y-0.5 cursor-pointer group"
          >
            <div className="text-[10px] font-mono text-[#39ff14] uppercase font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#39ff14]" />
              Agent 02
            </div>
            <div className="text-xs font-bold text-white group-hover:text-[#39ff14] transition-colors">512px Meme Canvas</div>
          </button>

          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('switch-features-tab', { detail: 'agents' }));
              const el = document.getElementById('features-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-3 rounded-lg bg-[#12141a]/90 border border-[#2d3139] hover:border-[#f43f5e]/60 transition-all text-left space-y-0.5 cursor-pointer group"
          >
            <div className="text-[10px] font-mono text-[#f43f5e] uppercase font-bold flex items-center gap-1">
              <Flame className="w-3 h-3 text-[#f43f5e]" />
              Agent 03
            </div>
            <div className="text-xs font-bold text-white group-hover:text-[#f43f5e] transition-colors">Social Mobilizer</div>
          </button>

          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('switch-features-tab', { detail: 'agents' }));
              const el = document.getElementById('features-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-3 rounded-lg bg-[#12141a]/90 border border-[#2d3139] hover:border-[#a855f7]/60 transition-all text-left space-y-0.5 cursor-pointer group"
          >
            <div className="text-[10px] font-mono text-[#a855f7] uppercase font-bold flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#a855f7]" />
              Agent 04
            </div>
            <div className="text-xs font-bold text-white group-hover:text-[#a855f7] transition-colors">Dynamic Micro-Sites</div>
          </button>

          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('switch-features-tab', { detail: 'defense' }));
              const el = document.getElementById('features-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-3 rounded-lg bg-[#12141a]/90 border border-[#2d3139] hover:border-[#ccff00]/60 transition-all text-left space-y-0.5 col-span-2 sm:col-span-1 cursor-pointer group"
          >
            <div className="text-[10px] font-mono text-[#ccff00] uppercase font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#ccff00]" />
              Defense Suite
            </div>
            <div className="text-xs font-bold text-white group-hover:text-[#ccff00] transition-colors">HITL &amp; Zero Custody</div>
          </button>
        </div>
      </div>
    </section>
  );
};
