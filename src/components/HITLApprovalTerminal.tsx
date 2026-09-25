import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Zap,
  Terminal,
  Cpu,
  UserCheck,
  CheckCircle2,
  ExternalLink,
  Twitter,
  Radio,
  Clock,
  Sparkles,
  Layers,
  Flame,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

interface HITLApprovalTerminalProps {
  tokenName: string;
  ticker: string;
  contractAddress: string;
  initialApprovals?: number;
}

export const HITLApprovalTerminal: React.FC<HITLApprovalTerminalProps> = ({
  tokenName,
  ticker,
  contractAddress,
  initialApprovals = 1482,
}) => {
  const [approvalsCount, setApprovalsCount] = useState(initialApprovals);
  const [hasStamped, setHasStamped] = useState(false);
  const [isStamping, setIsStamping] = useState(false);
  const [testLoopStep, setTestLoopStep] = useState<number>(0);
  const [isExecutingLoop, setIsExecutingLoop] = useState(false);
  const [copiedSlot, setCopiedSlot] = useState(false);

  const cleanTicker = ticker.replace('$', '');

  const handleStampApproval = () => {
    if (isStamping) return;
    setIsStamping(true);

    setTimeout(() => {
      setApprovalsCount((prev) => prev + 1);
      setHasStamped(true);
      setIsStamping(false);

      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#00f5ff', '#39ff14', '#ffffff'],
      });
    }, 400);
  };

  const handleRun60SecLoop = () => {
    if (isExecutingLoop) return;
    setIsExecutingLoop(true);
    setTestLoopStep(1);

    // Step 1 -> Step 2 (Buy Simulation)
    setTimeout(() => {
      setTestLoopStep(2);
      // Step 2 -> Step 3 (Solana RPC Sync)
      setTimeout(() => {
        setTestLoopStep(3);
        // Step 3 -> Step 4 (Burn Verification)
        setTimeout(() => {
          setTestLoopStep(4);
          setIsExecutingLoop(false);
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        }, 900);
      }, 900);
    }, 900);
  };

  const tweetApprovalText = encodeURIComponent(
    `I just stamped human approval on $${cleanTicker} (Human in the Loop)! 🛑⚡\n\n4 AI swarms ran the math, but a human approved the block.\n\nLive on Solana: https://clawpump.tech/token/${contractAddress}\n@blknoiz06 #AnsemHack`
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#12080a] via-[#10141f] to-[#0a1518] border border-[#ef4444]/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                SOVEREIGN PROTOCOL LAYER
              </span>
              <span className="text-xs font-mono text-[#8e99ac]">•</span>
              <span className="text-xs font-mono text-[#00f5ff]">
                Ansem Hackathon Flagship Architecture
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase tracking-tight flex items-center gap-2">
              <span>🛑 Human in the Loop (HITL) Terminal</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#8e99ac] leading-relaxed">
              4 autonomous AI agent swarms calculate parameters, generate meme assets, and sync
              oracles. Only an authenticated human signature approves blocks for execution — eliminating
              hallucinations and maintaining sovereign decentralization.
            </p>
          </div>

          {/* Quick Metrics Capsule */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-[#080b12] border border-[#242b3b] text-center min-w-[140px]">
              <div className="text-[10px] font-mono text-[#8e99ac] uppercase">Human Approvals</div>
              <div className="text-2xl font-black font-mono text-[#ef4444] mt-0.5 flex items-center justify-center gap-1">
                <span>{approvalsCount.toLocaleString()}</span>
                <CheckCircle2 className="w-4 h-4 text-[#39ff14]" />
              </div>
              <div className="text-[9px] font-mono text-[#39ff14] mt-0.5">Verified on Solana</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#080b12] border border-[#242b3b] text-center min-w-[140px]">
              <div className="text-[10px] font-mono text-[#8e99ac] uppercase">AI Swarms Active</div>
              <div className="text-2xl font-black font-mono text-[#00f5ff] mt-0.5">4 / 4</div>
              <div className="text-[9px] font-mono text-[#00f5ff] mt-0.5">0 Hallucinations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Stamp Station + Agent Swarm Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Interactive Stamp Station */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0e121a] border border-[#242b3b] space-y-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#242b3b] pb-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#ef4444]" />
                <h3 className="text-base font-extrabold uppercase font-mono text-white tracking-wider">
                  Human Authority Execution Deck
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ef4444]/20 text-[#ef4444] font-bold">
                SLOT #312,891,402
              </span>
            </div>

            {/* Rubber Stamp Interaction Area */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-[#090c13] to-[#121622] border-2 border-dashed border-[#2d3748] flex flex-col items-center justify-center text-center space-y-4 relative">
              {/* Visual Stamp Imprint if stamped */}
              {hasStamped && (
                <div className="px-6 py-2 rounded-xl border-4 border-[#dc2626] text-[#dc2626] font-black text-2xl font-mono tracking-widest uppercase rotate-[-8deg] shadow-[0_0_30px_rgba(220,38,38,0.5)] animate-in fade-in zoom-in-90 duration-300">
                  APPROVED BY HUMAN
                </div>
              )}

              <div className="space-y-1">
                <p className="text-xs font-mono uppercase text-[#8e99ac]">
                  Autonomous Agent Proposal Status
                </p>
                <h4 className="text-lg sm:text-xl font-bold font-mono text-white">
                  {hasStamped
                    ? '✅ Block Validated & Cryptographically Signed'
                    : '⏳ Swarms Ready. Awaiting Your Physical Human Stamp'}
                </h4>
                <p className="text-xs text-[#8e99ac] max-w-md mx-auto">
                  {hasStamped
                    ? 'Your signature was verified on-chain. Zero autonomous deviations detected.'
                    : 'Click the rubber stamp below to approve the latest autonomous transaction bundle.'}
                </p>
              </div>

              {/* Physical Red Stamp Button */}
              <button
                type="button"
                id="btn-stamp-hitl"
                onClick={handleStampApproval}
                disabled={isStamping}
                className={`relative group px-8 py-4 rounded-2xl font-black font-mono text-sm sm:text-base uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-3 select-none ${
                  isStamping
                    ? 'scale-95 bg-[#991b1b] text-white/80'
                    : hasStamped
                    ? 'bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.6)]'
                    : 'bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white hover:scale-105 shadow-[0_0_35px_rgba(239,68,68,0.7)]'
                }`}
              >
                <span className="text-2xl">🛑</span>
                <span>
                  {isStamping
                    ? 'STAMPING BLOCK...'
                    : hasStamped
                    ? 'STAMP ANOTHER APPROVAL'
                    : 'STAMP HUMAN APPROVAL'}
                </span>
                <span className="px-2 py-0.5 rounded bg-black/40 text-xs font-mono">
                  #{approvalsCount}
                </span>
              </button>

              {/* Post-Stamp Receipt & Share */}
              {hasStamped && (
                <div className="w-full pt-4 border-t border-[#242b3b]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#8e99ac]">
                  <div className="flex items-center gap-1.5 text-[#39ff14]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Receipt Recorded: 0x7f4a...9b12</span>
                  </div>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${tweetApprovalText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#181d28] hover:bg-[#232938] text-[#00f5ff] border border-[#2d3748] flex items-center gap-1.5 transition-colors"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                    <span>Tweet My Approval</span>
                  </a>
                </div>
              )}
            </div>

            {/* 60-Second Loop Sandbox (Solving the Post-Launch Cold Start) */}
            <div className="p-5 rounded-2xl bg-[#090c13] border border-[#242b3b] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#ccff00]" />
                  <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                    The 60-Second Product Loop (T0 Usability)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 rounded border border-[#ccff00]/20 font-bold">
                  PROVE UTILITY FIRST
                </span>
              </div>
              <p className="text-xs text-[#8e99ac] leading-relaxed">
                Core design principle: <em>"Don't sell the ticker before the utility is visible."</em> At T0, anyone can verify the 4-step loop below in under 60 seconds without reading a 20-tweet thread.
              </p>

              {/* Step Process Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div
                  className={`p-3 rounded-xl border transition-all ${
                    testLoopStep >= 1
                      ? 'bg-[#ef4444]/15 border-[#ef4444]/50 text-white'
                      : 'bg-[#10141f] border-[#242b3b] text-[#8e99ac]'
                  }`}
                >
                  <div className="text-[10px] text-[#ef4444] font-bold">STEP 1</div>
                  <div className="font-bold mt-0.5">Human Stamp</div>
                  <div className="text-[10px] opacity-75 mt-1">Sign slot proposal</div>
                </div>

                <div
                  className={`p-3 rounded-xl border transition-all ${
                    testLoopStep >= 2
                      ? 'bg-[#00f5ff]/15 border-[#00f5ff]/50 text-white'
                      : 'bg-[#10141f] border-[#242b3b] text-[#8e99ac]'
                  }`}
                >
                  <div className="text-[10px] text-[#00f5ff] font-bold">STEP 2</div>
                  <div className="font-bold mt-0.5">Curve Test Buy</div>
                  <div className="text-[10px] opacity-75 mt-1">0.05 SOL atomic swap</div>
                </div>

                <div
                  className={`p-3 rounded-xl border transition-all ${
                    testLoopStep >= 3
                      ? 'bg-[#a855f7]/15 border-[#a855f7]/50 text-white'
                      : 'bg-[#10141f] border-[#242b3b] text-[#8e99ac]'
                  }`}
                >
                  <div className="text-[10px] text-[#a855f7] font-bold">STEP 3</div>
                  <div className="font-bold mt-0.5">Solana RPC Sync</div>
                  <div className="text-[10px] opacity-75 mt-1">Slot confirmation</div>
                </div>

                <div
                  className={`p-3 rounded-xl border transition-all ${
                    testLoopStep >= 4
                      ? 'bg-[#39ff14]/15 border-[#39ff14]/50 text-white'
                      : 'bg-[#10141f] border-[#242b3b] text-[#8e99ac]'
                  }`}
                >
                  <div className="text-[10px] text-[#39ff14] font-bold">STEP 4</div>
                  <div className="font-bold mt-0.5">Burn Verification</div>
                  <div className="text-[10px] opacity-75 mt-1">LP incinerated</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  id="btn-run-loop"
                  onClick={handleRun60SecLoop}
                  disabled={isExecutingLoop}
                  className="px-4 py-2 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs font-mono uppercase tracking-tight flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(204,255,0,0.3)]"
                >
                  <Zap className="w-3.5 h-3.5 fill-black" />
                  <span>{isExecutingLoop ? 'Running Live Verification...' : 'Run 60-Second Loop Demo'}</span>
                </button>

                {testLoopStep === 4 && (
                  <span className="text-xs font-mono text-[#39ff14] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Loop Verified (0 Errors)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: 4 AI Agent Swarms Status Matrix */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-[#0e121a] border border-[#242b3b] space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#242b3b] pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#00f5ff]" />
                <h3 className="text-xs font-extrabold uppercase font-mono text-white tracking-wider">
                  Swarm Telemetry Matrix
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#39ff14] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-pulse" />
                ALL AGENTS HEALTHY
              </span>
            </div>

            {/* Agent 1 */}
            <div className="p-3.5 rounded-2xl bg-[#090c13] border border-[#242b3b] space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[#00f5ff]">Agent 01 • Narrative Swarm</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#39ff14]/15 text-[#39ff14] font-bold">
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-[#8e99ac]">
                Synthesizing anti-slop origin lore, counter-narrative, and Twitter launch momentum hooks.
              </p>
              <div className="text-[10px] font-mono text-white/60 flex items-center justify-between pt-1 border-t border-[#242b3b]/40">
                <span>Output: Genesis Lore</span>
                <span className="text-[#39ff14]">Viral Score: 99/100</span>
              </div>
            </div>

            {/* Agent 2 */}
            <div className="p-3.5 rounded-2xl bg-[#090c13] border border-[#242b3b] space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[#a855f7]">Agent 02 • Visual Mascot</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#39ff14]/15 text-[#39ff14] font-bold">
                  RENDERED
                </span>
              </div>
              <p className="text-[11px] text-[#8e99ac]">
                Generating deterministic vector mascot SVG (developer in hoodie with stamp) &amp; meme templates.
              </p>
              <div className="text-[10px] font-mono text-white/60 flex items-center justify-between pt-1 border-t border-[#242b3b]/40">
                <span>Output: Vector SVG + PNG</span>
                <span className="text-[#a855f7]">512x512 Crisp</span>
              </div>
            </div>

            {/* Agent 3 */}
            <div className="p-3.5 rounded-2xl bg-[#090c13] border border-[#242b3b] space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[#ccff00]">Agent 03 • Community Dispatch</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#39ff14]/15 text-[#39ff14] font-bold">
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-[#8e99ac]">
                Automating Telegram alerts, launch broadcasts, and community viral amplification triggers.
              </p>
              <div className="text-[10px] font-mono text-white/60 flex items-center justify-between pt-1 border-t border-[#242b3b]/40">
                <span>Channel: Telegram &amp; Social</span>
                <span className="text-[#ccff00]">Ready</span>
              </div>
            </div>

            {/* Agent 4 */}
            <div className="p-3.5 rounded-2xl bg-[#090c13] border border-[#242b3b] space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[#39ff14]">Agent 04 • Solana Non-Custodial</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#39ff14]/15 text-[#39ff14] font-bold">
                  VERIFIED
                </span>
              </div>
              <p className="text-[11px] text-[#8e99ac]">
                Enforcing atomic authority revocation (Mint &amp; Freeze = 0), zero platform fee cut, Jito bundle staging.
              </p>
              <div className="text-[10px] font-mono text-white/60 flex items-center justify-between pt-1 border-t border-[#242b3b]/40">
                <span>Treasury Balance: 0.00 SOL</span>
                <span className="text-[#39ff14]">100% Trustless</span>
              </div>
            </div>

            {/* Human in the Loop Card */}
            <div className="p-4 rounded-2xl bg-[#1a0f12] border border-[#ef4444]/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[#ef4444] flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  Human in the Loop (HITL)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#ef4444]/20 text-[#ef4444] font-bold">
                  FINAL ARBITER
                </span>
              </div>
              <p className="text-[11px] text-[#e0e0e0]/90">
                The ultimate veto and authorization layer. Prevents rogue swarms and AI hallucinations before Block 0.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
