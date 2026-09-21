import React, { useState, useMemo } from 'react';
import { Sparkles, Compass, Milestone, Flag, Swords, ShieldCheck, Flame, ChevronRight, Copy, Check, Twitter, Calendar, Trophy, Star, ArrowUpRight } from 'lucide-react';
import { Agent1NarrativeResult } from '../types';

interface NarrativeRoadmapProps {
  data: Agent1NarrativeResult;
}

export interface SeasonMilestone {
  id: string;
  title: string;
  description: string;
  category: 'Lore Chapter' | 'Community Mission' | 'Mascot Evolution' | 'Ecosystem Utility';
  status: 'active' | 'upcoming' | 'legendary';
  deliverable: string;
}

export interface SeasonPlan {
  seasonNumber: number;
  seasonName: string;
  subtitle: string;
  timeframe: string;
  themeColor: string;
  badgeColor: string;
  mascotEvolution: {
    title: string;
    description: string;
    icon: string;
  };
  narrativeArc: string;
  storyChapterHook: string;
  milestones: SeasonMilestone[];
  communityGoal: string;
}

export const NarrativeRoadmap: React.FC<NarrativeRoadmapProps> = ({ data }) => {
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'season-detail' | 'timeline'>('season-detail');
  const [copiedChapter, setCopiedChapter] = useState<number | null>(null);

  // Dynamically derive 3 cohesive story seasons from the token's generated name, ticker, and lore
  const seasons: SeasonPlan[] = useMemo(() => {
    const name = data.token_name || 'The Legend';
    const ticker = data.ticker || '$MEME';

    return [
      {
        seasonNumber: 1,
        seasonName: 'Season 1: Genesis & The Awakening',
        subtitle: 'The Spark • Genesis Lore • Community Vanguard',
        timeframe: 'Month 1 (Launch Era)',
        themeColor: '#00f5ff',
        badgeColor: 'border-[#00f5ff] text-[#00f5ff] bg-[#00f5ff]/10',
        mascotEvolution: {
          title: `${name} (Genesis Archetype)`,
          description: 'The raw, unfiltered origin form. Unbothered by market volatility, establishing the core meme aesthetic on Solana.',
          icon: '🐣',
        },
        narrativeArc: `In the genesis chapter, ${name} emerges from obscurity into the spotlight. What started as an unhinged inside joke instantly strikes a chord with Crypto Twitter, proving that ${ticker} is here to defy standard convention.`,
        storyChapterHook: `📖 Chapter 1: The Genesis of ${ticker}. They told us it was just an ordinary ${name}, but when the market started moving, only ${ticker} remained completely unbothered. The origin story has officially begun. 🚀`,
        communityGoal: 'Establish 2,500 organic holders & 100 community-created authentic meme variations on X.',
        milestones: [
          {
            id: 's1-1',
            title: 'Genesis Storyboard & Token Mint',
            description: 'Deploy the foundational lore contract, launch vector mascot, and establish bonding curve liquidity on Solana.',
            category: 'Lore Chapter',
            status: 'active',
            deliverable: 'Solana Smart Contract & Genesis Meme Suite',
          },
          {
            id: 's1-2',
            title: 'The Community Momentum Vanguard',
            description: 'Activate automated Telegram community triggers and establish the official memetic narrative on Crypto Twitter.',
            category: 'Community Mission',
            status: 'active',
            deliverable: 'Telegram Community Dispatch Integration',
          },
          {
            id: 's1-3',
            title: 'Genesis Meme Overlay Archive',
            description: 'Release the open-source community meme canvas studio with high-res PNG mascot cutouts and meme templates.',
            category: 'Mascot Evolution',
            status: 'upcoming',
            deliverable: 'Community Meme Studio & Asset Pack',
          },
        ],
      },
      {
        seasonNumber: 2,
        seasonName: 'Season 2: The Escalation & Cult Expansion',
        subtitle: 'World Expansion • Lore Comics • Underground Movement',
        timeframe: 'Months 2 - 3 (Growth Era)',
        themeColor: '#ccff00',
        badgeColor: 'border-[#ccff00] text-[#ccff00] bg-[#ccff00]/10',
        mascotEvolution: {
          title: `${name} (Supercharged Lore Form)`,
          description: 'Equipped with bespoke narrative artifacts, specialized gear, and an expanded cast of sidekick characters.',
          icon: '⚡',
        },
        narrativeArc: `As the movement spreads, ${name} ventures outside the initial setting. A network of rival characters and unexpected allies join the lore, igniting serialized webcomic strips, animated community shorts, and token-gated narrative quests.`,
        storyChapterHook: `📖 Chapter 2: The Expansion of ${ticker}. ${name} has broken out of the local setting and is now building an unstoppable on-chain society. The cult lore runs deeper than anyone expected. ⚔️`,
        communityGoal: 'Trend #1 on Solana DexScreener & unlock the official animated community short film series.',
        milestones: [
          {
            id: 's2-1',
            title: 'Serialized Webcomic Series (Issues #1-#4)',
            description: 'Launch weekly 4-panel community-voted comic strips expanding on the daily adventures of ${name}.',
            category: 'Lore Chapter',
            status: 'upcoming',
            deliverable: 'Weekly Digital Comic Drops on X',
          },
          {
            id: 's2-2',
            title: 'Mascot Sidekick & Rival Crossover',
            description: 'Introduce secondary story characters voted on by the community, creating a rich multi-character meme universe.',
            category: 'Mascot Evolution',
            status: 'upcoming',
            deliverable: 'Expanded 5-Character Vector Asset Pack',
          },
          {
            id: 's2-3',
            title: 'Holder Lore Badges & Governance Quests',
            description: 'Reward loyal diamond-hand community members with custom interactive digital story badges and community roles.',
            category: 'Ecosystem Utility',
            status: 'upcoming',
            deliverable: 'On-Chain Narrative Badge Verification',
          },
        ],
      },
      {
        seasonNumber: 3,
        seasonName: 'Season 3: The Climax & Mythic Legacy',
        subtitle: 'Ascended Meta • Global IRL Takeover • Immortal Status',
        timeframe: 'Months 4+ (Legacy Era)',
        themeColor: '#a855f7',
        badgeColor: 'border-[#a855f7] text-[#a855f7] bg-[#a855f7]/10',
        mascotEvolution: {
          title: `${name} (Mythic Ascended Sovereign)`,
          description: 'The ultimate transcendent form. Glowing with legendary energy, forever immortalized in Web3 folklore.',
          icon: '👑',
        },
        narrativeArc: `In the grand season climax, ${name} reaches absolute mythic status. The narrative transcends digital spaces with global IRL sticker drops at major crypto conferences, an interactive on-chain story game, and permanent hall-of-fame status.`,
        storyChapterHook: `📖 Chapter 3: The Immortal ${ticker}. What was once an absurd dream is now a permanent pillar of decentralized culture. ${name} stands victorious over the doubters. 👑`,
        communityGoal: 'Plaster 10,000 physical stickers across 12 international tech conferences & launch decentralized mini-game.',
        milestones: [
          {
            id: 's3-1',
            title: 'Decentralized Interactive Story Game',
            description: 'Playable browser mini-game where holder decisions shape the next branch of the ${name} canonical storyline.',
            category: 'Ecosystem Utility',
            status: 'legendary',
            deliverable: 'Interactive Web-Based Retro Arcade Game',
          },
          {
            id: 's3-2',
            title: 'Global IRL Street Sticker Vanguard',
            description: 'Physical sticker and billboard blitz at Devcon, Token2049, and Solana Breakpoint festivals worldwide.',
            category: 'Community Mission',
            status: 'legendary',
            deliverable: 'Worldwide Physical Merch & Sticker Distribution',
          },
          {
            id: 's3-3',
            title: 'Immortal Meta Hall of Fame',
            description: 'Permanent archival of the complete ${name} 3-season comic archive and milestone treasury.',
            category: 'Lore Chapter',
            status: 'legendary',
            deliverable: 'Permanent Canonical Archive & Open Lore License',
          },
        ],
      },
    ];
  }, [data]);

  const activeSeasonData = seasons.find((s) => s.seasonNumber === selectedSeason) || seasons[0];

  const handleCopyChapter = (hook: string, seasonNum: number) => {
    navigator.clipboard.writeText(hook);
    setCopiedChapter(seasonNum);
    setTimeout(() => setCopiedChapter(null), 2000);
  };

  return (
    <div className="bg-[#12141a] border border-[#2d3139] rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2d3139]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#00f5ff]/10 border border-[#00f5ff]/30 flex items-center justify-center text-[#00f5ff]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase font-mono tracking-widest text-white">
                Narrative Life Cycle &amp; Season Evolution
              </h3>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-[#00f5ff]/10 text-[#00f5ff] border border-[#00f5ff]/30 rounded uppercase">
                Community Playbook
              </span>
            </div>
            <p className="text-[11px] text-[#e0e0e0] opacity-60 font-mono">
              How {data.token_name} ({data.ticker}) expands from launch genesis into an unstoppable multi-season narrative ecosystem
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-[#0a0b0d] p-1 rounded-lg border border-[#2d3139] shrink-0">
          <button
            onClick={() => setViewMode('season-detail')}
            className={`px-3 py-1 text-xs font-mono font-bold rounded transition-all cursor-pointer ${
              viewMode === 'season-detail'
                ? 'bg-[#00f5ff] text-black shadow-[0_0_10px_rgba(0,245,255,0.3)]'
                : 'text-[#e0e0e0] opacity-70 hover:opacity-100'
            }`}
          >
            Season Cards
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1 text-xs font-mono font-bold rounded transition-all cursor-pointer ${
              viewMode === 'timeline'
                ? 'bg-[#00f5ff] text-black shadow-[0_0_10px_rgba(0,245,255,0.3)]'
                : 'text-[#e0e0e0] opacity-70 hover:opacity-100'
            }`}
          >
            Full Timeline
          </button>
        </div>
      </div>

      {/* Season Navigation Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {seasons.map((s) => {
          const isSelected = selectedSeason === s.seasonNumber;
          return (
            <button
              key={s.seasonNumber}
              onClick={() => setSelectedSeason(s.seasonNumber)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-[#1a1d24] border-[#00f5ff] shadow-[0_0_15px_rgba(0,245,255,0.15)] text-white'
                  : 'bg-[#0a0b0d] border-[#2d3139] hover:border-[#2d3139]/80 text-[#e0e0e0] opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${s.badgeColor}`}>
                  Season 0{s.seasonNumber}
                </span>
                <span className="text-[10px] font-mono text-[#e0e0e0] opacity-50 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {s.timeframe.split(' ')[0]}
                </span>
              </div>
              <div className="text-xs font-bold truncate">{s.seasonName.split(': ')[1] || s.seasonName}</div>
              <div className="text-[10px] opacity-60 truncate mt-0.5 font-mono">{s.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* VIEW A: SEASON DETAIL VIEW */}
      {viewMode === 'season-detail' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Season Lore Banner */}
          <div className="bg-[#0a0b0d] border border-[#2d3139] rounded-xl p-4 sm:p-5 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-base">{activeSeasonData.mascotEvolution.icon}</span>
                  <h4 className="text-sm sm:text-base font-bold text-white tracking-wide">
                    {activeSeasonData.seasonName}
                  </h4>
                  <span className="text-xs text-[#00f5ff] font-mono">({activeSeasonData.timeframe})</span>
                </div>
                <p className="text-xs leading-relaxed text-[#e0e0e0] opacity-90 font-sans">
                  {activeSeasonData.narrativeArc}
                </p>
              </div>

              {/* Mascot Evolution Stage Box */}
              <div className="bg-[#12141a] border border-[#2d3139] rounded-lg p-3 shrink-0 lg:w-72">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-[#ccff00] mb-1">
                  <Sparkles className="w-3 h-3" />
                  Mascot Evolution Stage
                </div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{activeSeasonData.mascotEvolution.icon}</span>
                  <span>{activeSeasonData.mascotEvolution.title}</span>
                </div>
                <p className="text-[10px] text-[#e0e0e0] opacity-70 mt-1 font-mono leading-tight">
                  {activeSeasonData.mascotEvolution.description}
                </p>
              </div>
            </div>

            {/* Click-to-Copy Seasonal Narrative Chapter Hook */}
            <div className="mt-4 pt-3 border-t border-[#2d3139] flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#12141a]/60 p-3 rounded-lg">
              <div className="text-[11px] text-[#e0e0e0] font-sans truncate pr-2 opacity-90 italic">
                "{activeSeasonData.storyChapterHook}"
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopyChapter(activeSeasonData.storyChapterHook, activeSeasonData.seasonNumber)}
                  className="px-2.5 py-1 text-[10px] font-mono font-bold rounded bg-[#00f5ff]/10 text-[#00f5ff] hover:bg-[#00f5ff] hover:text-black transition-all flex items-center gap-1 cursor-pointer"
                >
                  {copiedChapter === activeSeasonData.seasonNumber ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Chapter Hook</span>
                    </>
                  )}
                </button>
                <a
                  href={`https://x.com/intent/tweet?text=${encodeURIComponent(activeSeasonData.storyChapterHook)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded text-slate-400 hover:text-[#00f5ff] transition-colors"
                  title="Post to X"
                >
                  <Twitter className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Season Milestones Grid */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold opacity-60 font-mono tracking-wider flex items-center gap-1.5">
                <Milestone className="w-3 h-3 text-[#00f5ff]" />
                Season 0{activeSeasonData.seasonNumber} Key Milestones &amp; Deliverables
              </label>
              <span className="text-[10px] font-mono text-[#00f5ff] opacity-80">
                3 Core Execution Pillars
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeSeasonData.milestones.map((m) => (
                <div
                  key={m.id}
                  className="bg-[#0a0b0d] border border-[#2d3139] hover:border-[#00f5ff]/40 rounded-xl p-4 flex flex-col justify-between transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#1a1d24] text-[#00f5ff] border border-[#2d3139]">
                        {m.category}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                          m.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : m.status === 'legendary'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {m.status === 'active' ? '● Live Now' : m.status === 'legendary' ? '★ Legendary' : '○ Upcoming'}
                      </span>
                    </div>

                    <h5 className="text-xs font-bold text-white mb-1.5 group-hover:text-[#00f5ff] transition-colors">
                      {m.title}
                    </h5>
                    <p className="text-[11px] text-[#e0e0e0] opacity-70 leading-relaxed font-sans mb-3">
                      {m.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#2d3139] flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#e0e0e0] opacity-50">Deliverable:</span>
                    <span className="text-[#ccff00] font-semibold truncate ml-1">{m.deliverable}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Mobilization Unlock Target */}
          <div className="p-3.5 bg-[#12141a] border border-[#2d3139] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00] shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ccff00]">
                  Season Community Vanguard Objective:
                </div>
                <div className="text-xs text-white font-sans mt-0.5">
                  {activeSeasonData.communityGoal}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-mono text-[#00f5ff]">
              <span>Next Season Unlocks at Target</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      )}

      {/* VIEW B: COMPREHENSIVE TIMELINE VIEW */}
      {viewMode === 'timeline' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="relative pl-6 border-l-2 border-[#2d3139] space-y-8 my-2">
            {seasons.map((s, idx) => (
              <div key={s.seasonNumber} className="relative group">
                {/* Timeline Dot */}
                <div
                  className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 bg-[#0a0b0d] flex items-center justify-center ${
                    idx === 0
                      ? 'border-[#00f5ff] shadow-[0_0_10px_rgba(0,245,255,0.6)]'
                      : idx === 1
                      ? 'border-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,0.6)]'
                      : 'border-[#a855f7] shadow-[0_0_10px_rgba(168,85,247,0.6)]'
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>

                {/* Timeline Card */}
                <div className="bg-[#0a0b0d] border border-[#2d3139] rounded-xl p-4 sm:p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{s.mascotEvolution.icon}</span>
                      <h4 className="text-sm font-bold text-white">{s.seasonName}</h4>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${s.badgeColor}`}>
                        {s.timeframe}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#ccff00] flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      {s.mascotEvolution.title}
                    </span>
                  </div>

                  <p className="text-xs text-[#e0e0e0] opacity-80 leading-relaxed font-sans">
                    {s.narrativeArc}
                  </p>

                  {/* Milestones Chips */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[#2d3139]">
                    {s.milestones.map((m) => (
                      <div key={m.id} className="bg-[#12141a] p-2.5 rounded-lg border border-[#2d3139]/60">
                        <div className="text-[9px] font-mono uppercase text-[#00f5ff] font-bold truncate">
                          {m.category}
                        </div>
                        <div className="text-xs font-semibold text-white truncate mt-0.5">
                          {m.title}
                        </div>
                        <div className="text-[10px] text-[#e0e0e0] opacity-60 font-mono truncate mt-1">
                          ↳ {m.deliverable}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
