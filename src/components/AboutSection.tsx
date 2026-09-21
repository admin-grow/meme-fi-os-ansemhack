import React from 'react';
import { ShieldCheck, Cpu, Zap, Sparkles, Lock, Layers, Terminal, ArrowRight, CheckCircle2, Shield } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about-section" className="py-10 sm:py-14 border-b border-[#2d3139] space-y-8 scroll-mt-20 w-full max-w-full overflow-hidden">
      {/* Section Header */}
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00f5ff] uppercase tracking-widest font-bold">
          <Terminal className="w-3.5 h-3.5 text-[#00f5ff]" />
          Platform Manifesto
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
          About MemeFi OS
        </h2>
        <div className="text-xs sm:text-sm font-mono text-[#ccff00] font-semibold">
          High-Velocity Attention Engine &bull; Non-Custodial Architecture &bull; Human-in-the-Loop AI
        </div>
        <p className="text-xs sm:text-sm text-[#e0e0e0] opacity-70 font-sans leading-relaxed">
          The unified operating system bridging real-time viral culture with decentralized Solana execution.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* 1. CORE THESIS - Hero Callout */}
        <div className="lg:col-span-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#121622] via-[#10141d] to-[#121622] border border-[#00f5ff]/40 shadow-[0_0_30px_rgba(0,245,255,0.08)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Zap className="w-32 h-32 text-[#00f5ff]" />
          </div>
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#00f5ff]/20 text-[#00f5ff] text-[10px] font-mono font-bold tracking-wider uppercase border border-[#00f5ff]/40">
                01. Core Thesis
              </span>
              <span className="text-xs font-mono text-white/50">Attention Markets at Native Internet Speed</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold font-mono text-white tracking-tight">
              Meme tokens are attention markets operating at native internet speed.
            </h3>
            <p className="text-sm sm:text-base text-[#e0e0e0]/90 font-sans leading-relaxed max-w-4xl">
              MemeFi OS collapses the latency between idea generation and on-chain execution into a single, non-custodial software workspace. By orchestrating multi-agent AI synthesis directly with client-side Solana transaction builders, creators turn cultural moments into decentralized community movements in under 30 seconds.
            </p>
          </div>
        </div>

        {/* 2. DESIGN PHILOSOPHY & SYSTEM PILLARS */}
        <div className="lg:col-span-12 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#39ff14]/20 text-[#39ff14] text-[10px] font-mono font-bold tracking-wider uppercase border border-[#39ff14]/40">
                02. Design Philosophy &amp; System Pillars
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">3 Core Tenets</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Pillar 01 */}
            <div className="p-6 rounded-2xl bg-[#0f1218] border border-[#2d3139] hover:border-[#39ff14]/50 transition-all space-y-4 flex flex-col justify-between group shadow-sm hover:shadow-[0_0_20px_rgba(57,255,20,0.08)]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#39ff14]/10 border border-[#39ff14]/30 flex items-center justify-center text-[#39ff14]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#39ff14]">
                    @cz_binance
                  </span>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#39ff14] font-bold uppercase tracking-wider">
                    Pillar 01
                  </div>
                  <h4 className="text-base font-bold text-white font-mono uppercase mt-0.5">
                    Infrastructure Security &amp; User Safety
                  </h4>
                </div>
                <p className="text-xs text-[#e0e0e0]/80 font-sans leading-relaxed">
                  100% non-custodial software. Local client-side signing, zero server key access, and Human-in-the-Loop verification to ensure user custody remains inviolable.
                </p>
              </div>

              <div className="pt-3 border-t border-[#222630] flex items-center gap-2 text-[11px] font-mono text-[#39ff14]/90">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#39ff14]" />
                <span>Zero Private Key Exposure</span>
              </div>
            </div>

            {/* Pillar 02 */}
            <div className="p-6 rounded-2xl bg-[#0f1218] border border-[#2d3139] hover:border-[#00f5ff]/50 transition-all space-y-4 flex flex-col justify-between group shadow-sm hover:shadow-[0_0_20px_rgba(0,245,255,0.08)]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#00f5ff]/10 border border-[#00f5ff]/30 flex items-center justify-center text-[#00f5ff]">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#00f5ff]">
                    @richardheartwin
                  </span>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#00f5ff] font-bold uppercase tracking-wider">
                    Pillar 02
                  </div>
                  <h4 className="text-base font-bold text-white font-mono uppercase mt-0.5">
                    Pure Utility &amp; Regulatory Protection
                  </h4>
                </div>
                <p className="text-xs text-[#e0e0e0]/80 font-sans leading-relaxed">
                  Explicitly designed as an AI software studio for satire, digital artwork, and metadata generation—not an investment contract. Zero promoter promises, 0% dev tax, and pure fair-launch mechanics.
                </p>
              </div>

              <div className="pt-3 border-t border-[#222630] flex items-center gap-2 text-[11px] font-mono text-[#00f5ff]/90">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00f5ff]" />
                <span>Satire &amp; Creative Utility</span>
              </div>
            </div>

            {/* Pillar 03 */}
            <div className="p-6 rounded-2xl bg-[#0f1218] border border-[#2d3139] hover:border-[#ccff00]/50 transition-all space-y-4 flex flex-col justify-between group shadow-sm hover:shadow-[0_0_20px_rgba(204,255,0,0.08)]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00]">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#ccff00]">
                    @blknoiz06 / Ansem
                  </span>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#ccff00] font-bold uppercase tracking-wider">
                    Pillar 03
                  </div>
                  <h4 className="text-base font-bold text-white font-mono uppercase mt-0.5">
                    High-Velocity Attention Engine
                  </h4>
                </div>
                <p className="text-xs text-[#e0e0e0]/80 font-sans leading-relaxed">
                  Sub-30-second idea-to-market execution with turnkey community mobilization, dynamic micro-site deployment, and adaptive viral trend synthesis powered by Gemini models.
                </p>
              </div>

              <div className="pt-3 border-t border-[#222630] flex items-center gap-2 text-[11px] font-mono text-[#ccff00]/90">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#ccff00]" />
                <span>&lt; 30s Idea-to-Market</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
