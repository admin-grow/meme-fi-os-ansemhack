import React, { useState } from 'react';
import {
  Twitter,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Users,
  MessageSquare,
  Globe,
  Radio,
  Send,
  HelpCircle,
  Layers,
  ChevronRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { Agent1NarrativeResult, Agent2VisualResult, TokenDeploymentData } from '../types';

interface XCommunitySetupWidgetProps {
  narrative?: Agent1NarrativeResult | null;
  visual?: Agent2VisualResult | null;
  deployment?: TokenDeploymentData | null;
}

export const XCommunitySetupWidget: React.FC<XCommunitySetupWidgetProps> = ({
  narrative,
  visual,
  deployment,
}) => {
  const tokenName = narrative?.token_name || 'Solana Meme Coin';
  const ticker = narrative?.ticker ? (narrative.ticker.startsWith('$') ? narrative.ticker : `$${narrative.ticker}`) : '$MEME';
  const cleanTicker = ticker.replace('$', '');
  const tagline = narrative?.tagline || 'Autonomous Community Meme Protocol on Solana';
  const contractAddress = deployment?.mintAddress || 'SoL11111111111111111111111111111111111111112';

  // Default suggested community names
  const suggestedNames = [
    `${ticker} Cult HQ`,
    `${tokenName} Community DAO`,
    `${ticker} Diamond Club`,
    `${tokenName} Syndicate`,
  ];

  const [selectedName, setSelectedName] = useState<string>(suggestedNames[0]);
  const [customName, setCustomName] = useState<string>('');
  const [isEditingCustomName, setIsEditingCustomName] = useState<boolean>(false);

  // Bio state
  const defaultBio = `🚀 Official X Community for ${tokenName} (${ticker}) on Solana.\n"${tagline}"\n\n🛡️ Verified Mint CA: ${contractAddress}\n🔥 100% Fair Launch • Zero Presale • Decentralized Meme Meta`;
  const [communityBio, setCommunityBio] = useState<string>(defaultBio);

  // Membership screening question
  const defaultQuestion = `Are you holding ${ticker} or contributing memes/art to our Solana community squad?`;
  const [membershipQuestion, setMembershipQuestion] = useState<string>(defaultQuestion);

  // Community Rules
  const defaultRules = [
    { title: '1. Verified CA Only', desc: `Only trust official contract address: ${contractAddress}. Never click untrusted links.` },
    { title: '2. High-Octane Memes', desc: `Keep vibes high! Share original ${cleanTicker} memes, artwork, and constructive lore updates.` },
    { title: '3. Zero Scamming / DMs', desc: 'Admins will NEVER DM you first or ask for seed phrases/private keys.' },
    { title: '4. Coordinated Momentum', desc: 'Support fellow community posts on X main feed and DexScreener with rocket reactions.' },
    { title: '5. Respect & WAGMI', desc: 'No hate speech, malicious FUD, or spamming unrelated tokens.' },
  ];
  const [communityRules, setCommunityRules] = useState(defaultRules);

  // Active comparison tab: 'guide' | 'public_vs_community'
  const [activeStrategyView, setActiveStrategyView] = useState<'public' | 'community'>('public');

  // Copy tracking state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const finalCommunityName = isEditingCustomName && customName.trim() ? customName.trim() : selectedName;

  const fullRulesString = communityRules
    .map((r, i) => `${r.title}\n${r.desc}`)
    .join('\n\n');

  // Public vs Community post templates
  const publicPostTemplate = `🚀 BIG MOMENTUM: ${tokenName} (${ticker}) is surging on Solana!\n\n"${tagline}"\n\n🔥 100% Fair Launch • Mint & Freeze Revoked\n🎯 CA: ${contractAddress}\n\nJoin our official X Community for daily community coordination! 👇\n#Solana #MemeCoin #WAGMI`;

  const communityPostTemplate = `🛡️ ${ticker} HOLDER ROLL-CALL:\n\nDrop your favorite ${cleanTicker} meme in the comments below! Top 3 memes get featured on our official token micro-site banner.\n\n"${tagline}"\nCA: ${contractAddress}\n\nStay diamond-handed 💎 #SolanaCommunity`;

  return (
    <div className="w-full bg-[#0e121a] border border-[#232938] rounded-2xl p-5 sm:p-6 space-y-6 text-left shadow-xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1e2433]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1d9bf0] to-[#00f5ff] flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(29,155,240,0.3)]">
            <Twitter className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono font-bold text-base sm:text-lg text-white uppercase tracking-tight">
                Step-by-Step X Community Setup Engine
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#1d9bf0]/15 border border-[#1d9bf0]/30 text-[#1d9bf0] text-[10px] font-mono font-bold">
                {tokenName} ({ticker})
              </span>
            </div>
            <p className="text-xs text-[#8e99ac] font-mono">
              Generate community names, bios, screening rules, and understand Community vs. Public posts.
            </p>
          </div>
        </div>

        {/* 1-Click Launch on X */}
        <a
          href="https://x.com/i/communities/create"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(29,155,240,0.3)] transition-all cursor-pointer shrink-0"
        >
          <span>Create Community on X</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Strategic Explainer: Public Posts vs. X Community Posts */}
      <div className="p-4 rounded-xl bg-[#121622] border border-[#232938] space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#ccff00]" />
            <span className="font-mono font-bold text-xs text-white uppercase">
              Content Strategy: Public Posts vs. X Community Posts
            </span>
          </div>
          
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#090b10] border border-[#1e2433]">
            <button
              type="button"
              onClick={() => setActiveStrategyView('public')}
              className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                activeStrategyView === 'public'
                  ? 'bg-[#1d9bf0] text-white'
                  : 'text-[#8e99ac] hover:text-white'
              }`}
            >
              Public Feed (Main Timeline)
            </button>
            <button
              type="button"
              onClick={() => setActiveStrategyView('community')}
              className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                activeStrategyView === 'community'
                  ? 'bg-[#00f5ff] text-black'
                  : 'text-[#8e99ac] hover:text-white'
              }`}
            >
              X Community Feed (Holders Hub)
            </button>
          </div>
        </div>

        {/* Dynamic Comparison Card */}
        {activeStrategyView === 'public' ? (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#090b10] border border-[#1e2433]">
                <div className="text-[#1d9bf0] font-bold">🎯 Audience:</div>
                <div className="text-[#8e99ac] mt-1">Everyone on X, For You page, hashtags, and algorithm searches.</div>
              </div>
              <div className="p-3 rounded-lg bg-[#090b10] border border-[#1e2433]">
                <div className="text-[#ccff00] font-bold">💡 Primary Goal:</div>
                <div className="text-[#8e99ac] mt-1">Acquire new holders, hype launch milestones, trend on DexScreener.</div>
              </div>
              <div className="p-3 rounded-lg bg-[#090b10] border border-[#1e2433]">
                <div className="text-[#39ff14] font-bold">⚡ Best Frequency:</div>
                <div className="text-[#8e99ac] mt-1">2–4 high-impact tweets per day with contract address &amp; tags.</div>
              </div>
            </div>

            {/* Generated Public Post Template */}
            <div className="p-3.5 rounded-xl bg-[#090b10] border border-[#1e2433] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Twitter className="w-3.5 h-3.5 text-[#1d9bf0]" />
                  <span>Recommended Public Timeline Post:</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyText(publicPostTemplate, 'public_post')}
                    className="px-2.5 py-1 rounded bg-[#181d28] hover:bg-[#232938] text-white text-xs font-mono flex items-center gap-1 cursor-pointer border border-[#2d3139]"
                  >
                    {copiedKey === 'public_post' ? <Check className="w-3 h-3 text-[#39ff14]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'public_post' ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={`https://x.com/intent/tweet?text=${encodeURIComponent(publicPostTemplate)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded bg-[#1d9bf0] text-white text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post Public</span>
                  </a>
                </div>
              </div>
              <div className="text-xs text-white font-sans whitespace-pre-wrap select-all bg-[#050608] p-2.5 rounded-lg border border-[#1a1e28]">
                {publicPostTemplate}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#090b10] border border-[#1e2433]">
                <div className="text-[#00f5ff] font-bold">👥 Audience:</div>
                <div className="text-[#8e99ac] mt-1">Dedicated members &amp; verified holders inside your X Community.</div>
              </div>
              <div className="p-3 rounded-lg bg-[#090b10] border border-[#1e2433]">
                <div className="text-[#f43f5e] font-bold">💡 Primary Goal:</div>
                <div className="text-[#8e99ac] mt-1">Holder retention, internal meme contests, daily coordination &amp; AMAs.</div>
              </div>
              <div className="p-3 rounded-lg bg-[#090b10] border border-[#1e2433]">
                <div className="text-[#ccff00] font-bold">⚡ Best Frequency:</div>
                <div className="text-[#8e99ac] mt-1">Continuous/daily chatter, mascot lore updates, meme drops.</div>
              </div>
            </div>

            {/* Generated Community Post Template */}
            <div className="p-3.5 rounded-xl bg-[#090b10] border border-[#1e2433] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#00f5ff]" />
                  <span>Recommended X Community Exclusive Post:</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyText(communityPostTemplate, 'comm_post')}
                    className="px-2.5 py-1 rounded bg-[#181d28] hover:bg-[#232938] text-white text-xs font-mono flex items-center gap-1 cursor-pointer border border-[#2d3139]"
                  >
                    {copiedKey === 'comm_post' ? <Check className="w-3 h-3 text-[#39ff14]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'comm_post' ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={`https://x.com/intent/tweet?text=${encodeURIComponent(communityPostTemplate)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded bg-[#00f5ff] text-black text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Share to Community</span>
                  </a>
                </div>
              </div>
              <div className="text-xs text-white font-sans whitespace-pre-wrap select-all bg-[#050608] p-2.5 rounded-lg border border-[#1a1e28]">
                {communityPostTemplate}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4-Step Interactive Setup Checklist */}
      <div className="space-y-4">
        <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00f5ff]" />
          <span>Interactive X Community Generation Kit</span>
        </h4>

        {/* STEP 1: SELECT OR CUSTOMIZE COMMUNITY NAME */}
        <div className="p-4 rounded-xl bg-[#121622] border border-[#232938] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
              <span className="w-5 h-5 rounded-full bg-[#1d9bf0] text-black flex items-center justify-center text-[10px]">1</span>
              <span>Select Community Name</span>
            </div>
            <button
              type="button"
              onClick={() => copyText(finalCommunityName, 'comm_name')}
              className="px-2.5 py-1 rounded bg-[#181d28] hover:bg-[#232938] text-white text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer border border-[#2d3139]"
            >
              {copiedKey === 'comm_name' ? <Check className="w-3 h-3 text-[#39ff14]" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'comm_name' ? 'Copied' : 'Copy Name'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestedNames.map((nameOption) => (
              <button
                key={nameOption}
                type="button"
                onClick={() => {
                  setSelectedName(nameOption);
                  setIsEditingCustomName(false);
                }}
                className={`p-2.5 rounded-xl font-mono text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between border ${
                  !isEditingCustomName && selectedName === nameOption
                    ? 'bg-[#182333] border-[#1d9bf0] text-white shadow-sm'
                    : 'bg-[#090b10] border-[#1e2433] text-[#8e99ac] hover:text-white'
                }`}
              >
                <span>{nameOption}</span>
                {!isEditingCustomName && selectedName === nameOption && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1d9bf0]" />
                )}
              </button>
            ))}
          </div>

          {/* Custom Name Field */}
          <div className="pt-1">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Or enter custom community name..."
                value={customName}
                onChange={(e) => {
                  setCustomName(e.target.value);
                  setIsEditingCustomName(true);
                }}
                className="w-full bg-[#090b10] border border-[#232938] focus:border-[#1d9bf0] rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-[#8e99ac]/50 outline-none"
              />
            </div>
          </div>
        </div>

        {/* STEP 2: GENERATED COMMUNITY BIO & DESCRIPTION */}
        <div className="p-4 rounded-xl bg-[#121622] border border-[#232938] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
              <span className="w-5 h-5 rounded-full bg-[#1d9bf0] text-black flex items-center justify-center text-[10px]">2</span>
              <span>Community Bio / Description</span>
            </div>
            <button
              type="button"
              onClick={() => copyText(communityBio, 'comm_bio')}
              className="px-2.5 py-1 rounded bg-[#181d28] hover:bg-[#232938] text-white text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer border border-[#2d3139]"
            >
              {copiedKey === 'comm_bio' ? <Check className="w-3 h-3 text-[#39ff14]" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'comm_bio' ? 'Copied' : 'Copy Bio'}</span>
            </button>
          </div>

          <textarea
            rows={4}
            value={communityBio}
            onChange={(e) => setCommunityBio(e.target.value)}
            className="w-full bg-[#090b10] border border-[#232938] focus:border-[#00f5ff] rounded-xl p-3 text-xs font-mono text-white leading-relaxed outline-none"
          />
          <div className="flex items-center justify-between text-[11px] font-mono text-[#8e99ac]">
            <span>Recommended limit: Under 280 characters for optimal mobile display</span>
            <span className={communityBio.length > 280 ? 'text-amber-400 font-bold' : ''}>
              {communityBio.length} chars
            </span>
          </div>
        </div>

        {/* STEP 3: MEMBERSHIP BIO / SCREENING QUESTION */}
        <div className="p-4 rounded-xl bg-[#121622] border border-[#232938] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
              <span className="w-5 h-5 rounded-full bg-[#1d9bf0] text-black flex items-center justify-center text-[10px]">3</span>
              <span>Membership Screening Question</span>
            </div>
            <button
              type="button"
              onClick={() => copyText(membershipQuestion, 'comm_question')}
              className="px-2.5 py-1 rounded bg-[#181d28] hover:bg-[#232938] text-white text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer border border-[#2d3139]"
            >
              {copiedKey === 'comm_question' ? <Check className="w-3 h-3 text-[#39ff14]" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'comm_question' ? 'Copied' : 'Copy Question'}</span>
            </button>
          </div>

          <input
            type="text"
            value={membershipQuestion}
            onChange={(e) => setMembershipQuestion(e.target.value)}
            className="w-full bg-[#090b10] border border-[#232938] focus:border-[#00f5ff] rounded-xl px-3 py-2.5 text-xs font-mono text-white outline-none"
          />
          <p className="text-[11px] text-[#8e99ac] font-mono">
            Prospective members answer this question when requesting to join restricted community channels.
          </p>
        </div>

        {/* STEP 4: COMMUNITY RULES (5 STANDARD PRESETS) */}
        <div className="p-4 rounded-xl bg-[#121622] border border-[#232938] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
              <span className="w-5 h-5 rounded-full bg-[#1d9bf0] text-black flex items-center justify-center text-[10px]">4</span>
              <span>X Community Guidelines &amp; Rules ({communityRules.length})</span>
            </div>
            <button
              type="button"
              onClick={() => copyText(fullRulesString, 'comm_all_rules')}
              className="px-2.5 py-1 rounded bg-[#181d28] hover:bg-[#232938] text-white text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer border border-[#2d3139]"
            >
              {copiedKey === 'comm_all_rules' ? <Check className="w-3 h-3 text-[#39ff14]" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'comm_all_rules' ? 'Copied All Rules' : 'Copy All 5 Rules'}</span>
            </button>
          </div>

          <div className="space-y-2">
            {communityRules.map((rule, index) => (
              <div
                key={index}
                className="p-3 rounded-xl bg-[#090b10] border border-[#1e2433] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="font-bold text-white text-xs">{rule.title}</div>
                  <div className="text-[#8e99ac] text-[11px] font-sans">{rule.desc}</div>
                </div>

                <button
                  type="button"
                  onClick={() => copyText(`${rule.title}: ${rule.desc}`, `rule_${index}`)}
                  className="px-2 py-1 rounded bg-[#181d28] hover:bg-[#232938] text-white text-[11px] font-mono flex items-center gap-1 self-start sm:self-center cursor-pointer border border-[#2d3139] shrink-0"
                >
                  {copiedKey === `rule_${index}` ? <Check className="w-3 h-3 text-[#39ff14]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === `rule_${index}` ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer Call to Action */}
      <div className="p-4 rounded-xl bg-[#090b10] border border-[#1e2433] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs font-mono text-[#8e99ac] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#39ff14]" />
          <span>Ready to deploy on X! Copy fields above and paste into the creation modal.</span>
        </div>

        <a
          href="https://x.com/i/communities/create"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(29,155,240,0.3)] cursor-pointer"
        >
          <Twitter className="w-4 h-4" />
          <span>Open X Community Creator</span>
        </a>
      </div>
    </div>
  );
};
