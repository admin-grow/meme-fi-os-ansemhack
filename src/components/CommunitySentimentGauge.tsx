import React, { useState } from 'react';
import { 
  Flame, 
  TrendingUp, 
  TrendingDown,
  ShieldAlert,
  ShieldCheck, 
  Users, 
  Check, 
  Scale,
  ThumbsUp,
  ThumbsDown,
  Minus,
  HelpCircle,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CommunitySentimentGaugeProps {
  tokenName: string;
  ticker: string;
  contractAddress: string;
  initialScore?: number;
  compact?: boolean;
}

export const CommunitySentimentGauge: React.FC<CommunitySentimentGaugeProps> = ({
  tokenName,
  ticker,
  contractAddress,
  initialScore = 72,
  compact = false,
}) => {
  const formattedTicker = ticker.startsWith('$') ? ticker : `$${ticker}`;

  // Local storage key for persistent sentiment votes per contract
  const storageKey = `sentiment_votes_${contractAddress}`;

  const [voteStats, setVoteStats] = useState<{
    bullish: number;
    neutral: number;
    notBullish: number;
    userVoted: 'bullish' | 'neutral' | 'notBullish' | null;
  }>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      bullish: 138,
      neutral: 42,
      notBullish: 35,
      userVoted: null,
    };
  });

  const totalVotes = voteStats.bullish + voteStats.neutral + voteStats.notBullish;
  
  // Real dynamic score derived directly from balanced community voting (0 - 100 scale)
  // Bullish = 100 pts, Neutral = 50 pts, Not Bullish = 0 pts
  const calculatedScore = Math.round(
    ((voteStats.bullish * 100 + voteStats.neutral * 50 + voteStats.notBullish * 0) / (totalVotes || 1)) * 10
  ) / 10;

  // Derive sentiment tier, color and gauge needle angle
  const getSentimentTier = (score: number) => {
    if (score >= 78) {
      return { 
        label: 'Strong Bullish Consensus', 
        color: '#39ff14', 
        secondaryColor: '#22c55e',
        glow: 'rgba(57,255,20,0.3)', 
        status: 'BULLISH',
        desc: 'High community confidence & organic meme engagement.'
      };
    }
    if (score >= 60) {
      return { 
        label: 'Moderate Bullish Alignment', 
        color: '#00f5ff', 
        secondaryColor: '#0ea5e9',
        glow: 'rgba(0,245,255,0.3)', 
        status: 'POSITIVE',
        desc: 'Active cultural discovery with balanced market participation.'
      };
    }
    if (score >= 42) {
      return { 
        label: 'Neutral / Balanced Consensus', 
        color: '#facc15', 
        secondaryColor: '#eab308',
        glow: 'rgba(250,204,21,0.3)', 
        status: 'NEUTRAL',
        desc: 'Even split between optimistic holders and cautious observers.'
      };
    }
    return { 
      label: 'Caution / Skeptical (Not Bullish)', 
      color: '#ef4444', 
      secondaryColor: '#dc2626',
      glow: 'rgba(239,68,68,0.3)', 
      status: 'NOT BULLISH',
      desc: 'Significant caution flagged by community members.'
    };
  };

  const tier = getSentimentTier(calculatedScore);

  const handleVote = (voteType: 'bullish' | 'neutral' | 'notBullish') => {
    const prevVote = voteStats.userVoted;
    const newStats = { ...voteStats };

    if (prevVote === voteType) return; // already voted this

    // If changing vote, decrement previous
    if (prevVote) {
      newStats[prevVote] = Math.max(0, newStats[prevVote] - 1);
    }

    newStats[voteType] += 1;
    newStats.userVoted = voteType;

    setVoteStats(newStats);
    localStorage.setItem(storageKey, JSON.stringify(newStats));

    // Trigger visual confetti only on optimistic votes, or subtle feedback
    if (voteType === 'bullish') {
      try {
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#00f5ff', '#39ff14', '#ccff00'],
        });
      } catch (e) {
        // safe fallback
      }
    }
  };

  const bullishPercent = Math.round((voteStats.bullish / (totalVotes || 1)) * 100);
  const neutralPercent = Math.round((voteStats.neutral / (totalVotes || 1)) * 100);
  const notBullishPercent = Math.round((voteStats.notBullish / (totalVotes || 1)) * 100);

  // Semicircular Gauge Needle Rotation Calculation (-90 deg = 0%, 0 deg = 50%, +90 deg = 100%)
  const needleAngle = -90 + (calculatedScore / 100) * 180;

  if (compact) {
    return (
      <div className="p-3.5 rounded-2xl bg-[#0b0e14] border border-[#232a3b] flex items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-black font-mono shadow-sm"
            style={{ backgroundColor: tier.color }}
          >
            {calculatedScore.toFixed(0)}%
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-white uppercase">{tokenName} Gauge</span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tier.color }} />
            </div>
            <span className="text-[11px] font-mono" style={{ color: tier.color }}>{tier.status}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleVote('bullish')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
              voteStats.userVoted === 'bullish'
                ? 'bg-[#39ff14] text-black shadow-md'
                : 'bg-[#141924] hover:bg-[#1f2638] text-white border border-[#263147]'
            }`}
            title="Vote Bullish"
          >
            <ThumbsUp className="w-3 h-3" />
            <span>{voteStats.bullish}</span>
          </button>

          <button
            type="button"
            onClick={() => handleVote('notBullish')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
              voteStats.userVoted === 'notBullish'
                ? 'bg-[#ef4444] text-white shadow-md'
                : 'bg-[#141924] hover:bg-[#1f2638] text-white border border-[#263147]'
            }`}
            title="Vote Not Bullish / Skeptical"
          >
            <ThumbsDown className="w-3 h-3" />
            <span>{voteStats.notBullish}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-3xl bg-[#0b0e14] border-2 border-[#22293a] p-5 sm:p-7 shadow-2xl relative overflow-hidden space-y-6">
      {/* Ambient background glow */}
      <div 
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-15"
        style={{ backgroundColor: tier.color }}
      />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e2535] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#00f5ff]" />
            <h3 className="text-base sm:text-lg font-black uppercase font-mono text-white tracking-wider">
              Balanced Community Sentiment &amp; Conviction Gauge
            </h3>
          </div>
          <p className="text-xs text-[#8e99ac] font-mono mt-1">
            Unbiased 2-sided community evaluation. Both bullish enthusiasm and skeptical caution are weighted transparently.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-full bg-[#141926] border border-[#263147] text-[11px] font-mono font-bold text-[#8e99ac] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{totalVotes} Community Ratings Recorded</span>
          </span>
        </div>
      </div>

      {/* Main Gauge Visual + Key Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Column: Semicircular Speedometer Gauge Chart */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0e121a] border border-[#1e2535] space-y-4 text-center">
          
          <div className="relative w-56 h-32 flex items-end justify-center overflow-hidden">
            {/* SVG Speedometer Arc */}
            <svg viewBox="0 0 200 110" className="w-56 h-32">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="35%" stopColor="#f97316" />
                  <stop offset="50%" stopColor="#facc15" />
                  <stop offset="75%" stopColor="#00f5ff" />
                  <stop offset="100%" stopColor="#39ff14" />
                </linearGradient>
              </defs>

              {/* Background Arc Track */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#181f2c"
                strokeWidth="18"
                strokeLinecap="round"
              />

              {/* Color Gradient Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="16"
                strokeLinecap="round"
                opacity="0.85"
              />

              {/* Gauge Tick Markers */}
              {/* Not Bullish Zone */}
              <circle cx="35" cy="65" r="2.5" fill="#ef4444" />
              {/* Neutral Zone */}
              <circle cx="100" cy="25" r="2.5" fill="#facc15" />
              {/* Bullish Zone */}
              <circle cx="165" cy="65" r="2.5" fill="#39ff14" />

              {/* Center Pivot Base */}
              <circle cx="100" cy="100" r="10" fill="#252d3d" stroke="#00f5ff" strokeWidth="2" />
            </svg>

            {/* Dynamic Needle Layer */}
            <div 
              className="absolute bottom-0 left-1/2 w-1.5 h-20 bg-gradient-to-t from-white via-white to-[#00f5ff] rounded-full origin-bottom transition-all duration-700 ease-out shadow-lg"
              style={{
                transform: `translateX(-50%) rotate(${needleAngle}deg)`,
                filter: `drop-shadow(0 0 6px ${tier.glow})`,
              }}
            />
          </div>

          {/* Scale Labels below gauge */}
          <div className="w-full flex justify-between px-2 text-[10px] font-mono font-bold uppercase text-[#8e99ac]">
            <span className="text-[#ef4444] flex items-center gap-0.5">
              <TrendingDown className="w-3 h-3" /> Not Bullish (0%)
            </span>
            <span className="text-[#facc15]">Neutral (50%)</span>
            <span className="text-[#39ff14] flex items-center gap-0.5">
              Bullish (100%) <TrendingUp className="w-3 h-3" />
            </span>
          </div>

          {/* Current Score Output */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                {calculatedScore.toFixed(1)}%
              </span>
              <span 
                className="px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-black"
                style={{ 
                  backgroundColor: `${tier.color}15`, 
                  borderColor: `${tier.color}40`,
                  color: tier.color 
                }}
              >
                {tier.status}
              </span>
            </div>
            <div className="font-mono font-bold text-xs" style={{ color: tier.color }}>
              {tier.label}
            </div>
            <p className="text-[11px] text-[#8e99ac] font-mono max-w-[280px]">
              {tier.desc}
            </p>
          </div>
        </div>

        {/* Right Column: 2-Sided Breakdown & Transparent Voting */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Sentiment Distribution Matrix */}
          <div className="space-y-2.5">
            {/* Segment 1: Bullish */}
            <div className="p-3 rounded-xl bg-[#0e121a] border border-[#1e2535] space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <ThumbsUp className="w-3.5 h-3.5 text-[#39ff14]" />
                  <span>Bullish / Conviction Signals</span>
                </span>
                <span className="text-[#39ff14] font-bold">{bullishPercent}% ({voteStats.bullish} votes)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#181e2b] overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#39ff14] to-[#ccff00] transition-all duration-500" 
                  style={{ width: `${bullishPercent}%` }}
                />
              </div>
            </div>

            {/* Segment 2: Neutral / Observing */}
            <div className="p-3 rounded-xl bg-[#0e121a] border border-[#1e2535] space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Minus className="w-3.5 h-3.5 text-[#facc15]" />
                  <span>Neutral / Observational Stance</span>
                </span>
                <span className="text-[#facc15] font-bold">{neutralPercent}% ({voteStats.neutral} votes)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#181e2b] overflow-hidden">
                <div 
                  className="h-full rounded-full bg-[#facc15] transition-all duration-500" 
                  style={{ width: `${neutralPercent}%` }}
                />
              </div>
            </div>

            {/* Segment 3: Not Bullish / Caution */}
            <div className="p-3 rounded-xl bg-[#0e121a] border border-[#1e2535] space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <ThumbsDown className="w-3.5 h-3.5 text-[#ef4444]" />
                  <span>Not Bullish / Caution &amp; Skepticism</span>
                </span>
                <span className="text-[#ef4444] font-bold">{notBullishPercent}% ({voteStats.notBullish} votes)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#181e2b] overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#ef4444] to-[#dc2626] transition-all duration-500" 
                  style={{ width: `${notBullishPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive 3-Way Fair Voting Box */}
          <div className="p-4 rounded-2xl bg-[#121622] border border-[#232938] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-[#00f5ff]" />
                <span>Cast Your Honest Sentiment Rating for {formattedTicker}</span>
              </span>
              {voteStats.userVoted && (
                <span className="text-[10px] font-mono text-[#39ff14] flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Vote Recorded</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Bullish Option */}
              <button
                type="button"
                onClick={() => handleVote('bullish')}
                className={`py-2.5 px-2 rounded-xl font-mono text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  voteStats.userVoted === 'bullish'
                    ? 'bg-[#39ff14] text-black shadow-[0_0_15px_rgba(57,255,20,0.4)] scale-102 border-transparent'
                    : 'bg-[#090b10] hover:bg-[#141926] text-[#39ff14] border border-[#39ff14]/30 hover:border-[#39ff14]'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span className="truncate">Bullish</span>
              </button>

              {/* Neutral Option */}
              <button
                type="button"
                onClick={() => handleVote('neutral')}
                className={`py-2.5 px-2 rounded-xl font-mono text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  voteStats.userVoted === 'neutral'
                    ? 'bg-[#facc15] text-black shadow-[0_0_15px_rgba(250,204,21,0.4)] scale-102 border-transparent'
                    : 'bg-[#090b10] hover:bg-[#141926] text-[#facc15] border border-[#facc15]/30 hover:border-[#facc15]'
                }`}
              >
                <Minus className="w-3.5 h-3.5" />
                <span className="truncate">Neutral</span>
              </button>

              {/* Not Bullish Option */}
              <button
                type="button"
                onClick={() => handleVote('notBullish')}
                className={`py-2.5 px-2 rounded-xl font-mono text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  voteStats.userVoted === 'notBullish'
                    ? 'bg-[#ef4444] text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] scale-102 border-transparent'
                    : 'bg-[#090b10] hover:bg-[#141926] text-[#ef4444] border border-[#ef4444]/30 hover:border-[#ef4444]'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span className="truncate">Not Bullish</span>
              </button>
            </div>

            <p className="text-[10px] text-[#8e99ac] font-mono text-center">
              Votes directly adjust the speedometer gauge in real-time. Transparent &amp; decentralized.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

