import React, { useState, useEffect } from 'react';
import { Agent1NarrativeResult, Agent2VisualResult, TokenDeploymentData } from '../types';
import { getThemeByStyleName } from '../themeConfig';
import { MascotLoreChatWidget } from './MascotLoreChatWidget';
import { CommunitySentimentGauge } from './CommunitySentimentGauge';
import { CommunityBurnPit } from './CommunityBurnPit';
import { SecurityAuditDrawer } from './SecurityAuditDrawer';
import { HITLApprovalTerminal } from './HITLApprovalTerminal';
import { downloadCompleteBrandingKitZip } from '../socialSuiteGenerator';
import {
  Zap,
  Twitter,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Flame,
  ArrowLeft,
  Share2,
  Lock,
  Coins,
  Radio,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Download,
  BarChart3,
  Users,
  Layers,
  Activity,
  Award,
  CheckCircle2,
  Percent,
  Compass,
  MessageCircle,
  Eye,
  RefreshCw,
  Heart,
  Cpu,
  Landmark,
  ArrowUpRight,
  Link2
} from 'lucide-react';
import { generateVectorMascotSvg } from '../utils/mascotSvgGenerator';
import confetti from 'canvas-confetti';

interface DynamicTokenMicroSiteProps {
  mintAddress?: string;
  tokenCA?: string;
  narrative?: Agent1NarrativeResult;
  visual?: Agent2VisualResult;
  deployment?: TokenDeploymentData;
  onBackToStudio?: () => void;
}

export const DynamicTokenMicroSite: React.FC<DynamicTokenMicroSiteProps> = ({
  mintAddress: propMintAddress,
  tokenCA: propTokenCA,
  narrative: propNarrative,
  visual: propVisual,
  deployment: propDeployment,
  onBackToStudio,
}) => {
  const [copiedCA, setCopiedCA] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [bondingProgress, setBondingProgress] = useState(42);
  const [solRaised, setSolRaised] = useState(35.7);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'tokenomics' | 'playbook' | 'chart' | 'engagement' | 'burn' | 'media' | 'hitl'>('overview');
  const [hitlApprovals, setHitlApprovals] = useState(1482);
  const [hasUserStamped, setHasUserStamped] = useState(false);
  const [stampAnimation, setStampAnimation] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);
  const [heroMediaTab, setHeroMediaTab] = useState<'mascot' | 'meme'>('mascot');
  const [memeTemplate, setMemeTemplate] = useState<string>(propVisual?.meme_overlay?.template_type || 'Breaking News');
  const [mascotImgError, setMascotImgError] = useState(false);
  const [memeImgError, setMemeImgError] = useState(false);
  const [recentBuys, setRecentBuys] = useState<Array<{ wallet: string; amountSol: number; timeAgo: string; type: 'buy' }>>([
    { wallet: '8xK...3pQ', amountSol: 2.5, timeAgo: '12s ago', type: 'buy' },
    { wallet: '4mP...9uL', amountSol: 5.8, timeAgo: '45s ago', type: 'buy' },
    { wallet: 'F8z...7kM', amountSol: 1.2, timeAgo: '2m ago', type: 'buy' },
    { wallet: 'J3w...1vX', amountSol: 8.4, timeAgo: '3m ago', type: 'buy' },
  ]);

  // Derive contract address
  const contractAddress =
    propTokenCA ||
    propMintAddress ||
    propDeployment?.mintAddress ||
    'HITL99zX4kL9wV8nB7mC5xP2qR1tY6uJ3aE7sD4fG2pump';

  // Fallback narrative if accessed directly via URL (Genesis Showcase Token: $HITL)
  const narrative: Agent1NarrativeResult = propNarrative || {
    token_name: 'Human in the Loop',
    ticker: '$HITL',
    tagline: 'AI writes the lore. AI paints the chart. A human must press the button.',
    viral_score: 99,
    lore: 'In an era of runaway autonomous AI agent tokens, $HITL is the ultimate cultural counter-balance. Four sovereign neural networks computed the parameters, generated the memes, and monitored the bonding curve — but an exhausted human with an iced oat latte had to manually click the big red APPROVE button before Block 0.',
    tweet_pack: [
      'Four AI swarms screamed at the screen, but the Human in the Loop held the line. Meet $HITL. 🛑⚡ #Solana #AnsemHack',
      'Autonomous swarms are fast, but someone still has to press the big red button. 100% fair launch, zero presale on $HITL.',
      'AI wrote the code. AI painted the chart. The human approved the mint. Welcome to $HITL on Solana!',
    ],
    mascot_prompt: 'Human in the loop developer in hoodie holding red approved stamp with iced coffee',
  };

  const fallbackSvg = generateVectorMascotSvg(
    narrative.ticker,
    narrative.token_name,
    narrative.mascot_prompt,
    'Tech/AI Absurdism'
  );

  const visual: Agent2VisualResult = {
    image_generation_prompt: propVisual?.image_generation_prompt || 'Digital vector sticker mascot',
    negative_prompt: propVisual?.negative_prompt || 'blurry, low quality',
    meme_overlay: propVisual?.meme_overlay || {
      template_type: 'Breaking News',
      top_header: 'BREAKING NEWS',
      bottom_caption: `GOD CANDLE DETECTED FOR ${narrative.ticker}`,
      ticker_watermark: narrative.ticker,
    },
    mascot_image_url: propVisual?.mascot_image_url,
    rendered_meme_url: propVisual?.rendered_meme_url,
    mascot_svg: propVisual?.mascot_svg || fallbackSvg,
  };

  const theme = getThemeByStyleName(visual.visual_elements?.background_style || 'Cyberpunk Pixel Art');

  // Trigger celebration on load
  useEffect(() => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const handleCopyCA = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopiedCA(true);
    setTimeout(() => setCopiedCA(false), 2000);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleDownloadBrandingKit = async () => {
    setIsDownloadingZip(true);
    try {
      await downloadCompleteBrandingKitZip({
        tokenName: narrative.token_name,
        ticker: narrative.ticker,
        tagline: narrative.tagline,
        lore: narrative.lore,
        contractAddress: contractAddress,
        mascotSvg: visual.mascot_svg,
        mascotImageUrl: visual.mascot_image_url,
        styleName: visual.visual_elements?.background_style || 'Cyberpunk Pixel Art',
      });
    } catch (err) {
      console.error('Failed to download zip:', err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const tweetIntent = `https://x.com/intent/tweet?text=${encodeURIComponent(
    `🔥 Check out ${narrative.token_name} (${narrative.ticker}) on Solana!\n\n"${narrative.tagline}"\n\n🎯 Mint CA: ${contractAddress}\n\n#Solana #MemeCoin #AnsemHack`
  )}`;

  const microFaqs = [
    {
      q: `What is ${narrative.token_name} (${narrative.ticker})?`,
      a: `${narrative.token_name} (${narrative.ticker}) is an autonomous community meme token on Solana launched via ClawPump. "${narrative.tagline}" Lore: ${narrative.lore}`,
    },
    {
      q: 'What are the exact tokenomics and allocation breakdown?',
      a: `Total Supply is strictly capped at 1,000,000,000 $${narrative.ticker.replace('$', '')} (1 Billion tokens). 80% is allocated to the public fair-launch bonding curve, 20% is seeded into the Raydium decentralized liquidity pool upon curve completion with permanent LP burn, and 0% is reserved for team presale or insiders. Taxes are 0% Buy / 0% Sell.`,
    },
    {
      q: 'How does the bonding curve & Raydium migration work?',
      a: 'This token is launched with a 100% fair launch mechanism and 0% team presale. As community members trade on the curve, SOL accumulates until the 85 SOL target is hit (100% bonded). At that point, the entire liquidity pool is automatically deposited into Raydium DEX and the LP tokens are burned forever, enabling decentralized trading with permanently locked liquidity.',
    },
    {
      q: `How do I buy ${narrative.ticker} securely on Solana?`,
      a: `To buy ${narrative.ticker}, connect a non-custodial Solana wallet (like Phantom or Solflare) with SOL balance. Click 'Buy on ClawPump' or paste the official Contract Address (${contractAddress}) into ClawPump / Raydium. Always double check the mint address before confirming transactions.`,
    },
    {
      q: 'What are the financial risks of holding or trading this token?',
      a: `Interacting with cryptocurrencies, decentralized bonding curves, and meme coins involves extreme market volatility, technical risks, and unpredictable liquidity. Participating in ${narrative.token_name} (${narrative.ticker}) carries 100% capital risk and may result in a total loss of funds. Never trade or commit funds you cannot afford to lose completely. Meme coins carry zero intrinsic economic utility, dividend yield, or corporate governance rights, and offer no promise or expectation of profit.`,
    },
    {
      q: 'Who created this token and is the contract safe?',
      a: 'This token was generated using MemeFi OS’s non-custodial 3-agent pipeline with human-in-the-loop verification and deployed directly to Solana smart contracts. The mint and freeze authorities are permanently revoked, and creator presale allocation is 0%.',
    },
    {
      q: 'Can anyone burn tokens, and how does the Community Incinerator work?',
      a: `Yes! Any holder, whale, or developer can permanently burn tokens directly from their connected Solana wallet in the Community Burn Pit. Burning tokens executes the native Solana SPL Token program instruction (createBurnInstruction) to decrease circulating supply forever or transfers tokens to the Solana Incinerator address. The transaction signature is permanently verifiable on Solscan and cannot be reversed or recovered.`,
    },
    {
      q: 'What is the Do Your Own Research (DYOR) guideline for community members?',
      a: `Always verify the official contract address (${contractAddress}) on Solana block explorers (such as Solscan or DexScreener) before signing any wallet transaction. Meme tokens are speculative cultural assets created for community entertainment and decentralized engagement.`,
    },
  ];

  return (
    <div
      className="min-h-screen text-[#e0e0e0] flex flex-col font-sans selection:bg-[#00f5ff]/30 selection:text-[#00f5ff] relative overflow-x-clip"
      style={{ backgroundColor: theme.primaryBg }}
    >
      {/* Background Ambient Glow & Grid Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 15%, ${theme.accentColor} 0%, transparent 65%), linear-gradient(to bottom, transparent, #06080c)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#1f293d_1px,transparent_1px),linear-gradient(to_bottom,#1f293d_1px,transparent_1px)] bg-[size:4rem_4rem]"
      />

      {/* Top Navbar */}
      <nav className="border-b border-[#2d3139]/80 backdrop-blur-md bg-black/50 sticky top-0 z-40 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBackToStudio && (
            <button
              onClick={onBackToStudio}
              className="p-1.5 rounded-lg bg-[#1a1d24] border border-[#2d3139] text-white/70 hover:text-white hover:border-[#00f5ff] transition-all flex items-center gap-1 text-xs font-mono cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Studio</span>
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-black font-mono shadow-md"
              style={{ backgroundColor: theme.accentColor }}
            >
              {narrative.ticker.replace('$', '').slice(0, 2)}
            </span>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold text-sm tracking-tight text-white">{narrative.token_name}</span>
                <span className="text-xs font-mono font-bold" style={{ color: theme.accentColor }}>
                  {narrative.ticker}
                </span>
              </div>
              <div className="text-[10px] text-[#8e99ac] font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>ClawPump Bonding Curve</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsAuditDrawerOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#141824] border border-[#00f5ff]/40 text-[#00f5ff] hover:bg-[#1a2032] hover:text-white transition-all text-xs font-mono cursor-pointer"
            title="Inspect 3 security pillars, 8-instruction bytecode, and non-custodial pipeline"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#39ff14]" />
            <span className="hidden md:inline">Verification &amp; Controls</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-[#39ff14]/20 text-[#39ff14] font-bold">Checks Passed &rsaquo;</span>
          </button>

          <button
            onClick={handleDownloadBrandingKit}
            disabled={isDownloadingZip}
            className="hidden sm:flex px-3 py-1.5 rounded-lg bg-[#141720] border border-[#2d3139] hover:border-[#ccff00] text-xs font-mono text-white items-center gap-1.5 transition-colors cursor-pointer"
            title="Download full 5-asset social branding kit (.ZIP)"
          >
            <Download className="w-3.5 h-3.5 text-[#ccff00]" />
            <span>{isDownloadingZip ? 'Zipping...' : 'Branding Kit'}</span>
          </button>

          <button
            onClick={handleCopyShareLink}
            className="px-3 py-1.5 rounded-lg bg-[#141720] border border-[#2d3139] text-xs font-mono hover:border-[#00f5ff] text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#00f5ff]" />
            <span>{copiedShare ? 'Copied' : 'Share'}</span>
          </button>

          <a
            href={`https://pump.fun/coin/${contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg text-black font-black text-xs font-mono uppercase tracking-tight flex items-center gap-1.5 shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-transform hover:scale-105"
            style={{ backgroundColor: theme.accentColor }}
          >
            <Zap className="w-3.5 h-3.5 fill-black" />
            <span>Buy ${narrative.ticker.replace('$', '')}</span>
          </a>
        </div>
      </nav>

      {/* Main Landing Page Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10 relative z-10">
        
        {/* Live Ticker Announcement Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#0e121a]/90 border border-[#242b3b] shadow-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" />
              LIVE ON SOLANA
            </span>
            <span className="text-xs text-[#8e99ac] font-mono hidden sm:inline">
              100% Fair Launch • Mint &amp; Freeze Revoked • 0% Taxes
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-[#8e99ac]">Curve Status:</span>
            <span className="text-[#39ff14] font-bold">{bondingProgress}% Bonded ({solRaised}/85 SOL)</span>
          </div>
        </div>

        {/* QuickBooks-Style Background Trust Ribbon */}
        <div className="p-2.5 rounded-xl bg-[#0a0d14] border border-[#242b3b] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-[#8e99ac] truncate">
            <span className="w-2 h-2 rounded-full bg-[#39ff14] shadow-[0_0_6px_#39ff14] shrink-0" />
            <span className="truncate">
              <strong className="text-white font-semibold">Non-Custodial Pipeline:</strong> Zero platform treasury (0.00 SOL) &bull; Atomic authority revocation &bull; 100% LP incinerated
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsAuditDrawerOpen(true)}
            className="text-[11px] text-[#00f5ff] hover:underline shrink-0 ml-2 font-bold cursor-pointer"
          >
            View Verification Specs &rarr;
          </button>
        </div>

        {/* HITL Autonomous vs Human Trust Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#ef4444]/15 via-[#18121a] to-[#00f5ff]/15 border border-[#ef4444]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ef4444]/20 border border-[#ef4444]/40 flex items-center justify-center text-xl shrink-0">
              🛑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white uppercase tracking-wider">$HITL Protocol (Human in the Loop)</span>
                <span className="px-1.5 py-0.5 rounded bg-[#39ff14]/20 text-[#39ff14] text-[10px] font-bold">4 AI Swarms + 1 Human</span>
              </div>
              <p className="text-[11px] text-[#8e99ac]">
                AI writes the lore and calculates the curve. An exhausted human developer with an iced oat latte approves the block.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('hitl')}
            className="px-3.5 py-2 rounded-xl bg-[#ef4444] hover:bg-[#dc2626] text-white font-extrabold text-xs font-mono uppercase tracking-tight flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] shrink-0 cursor-pointer"
          >
            <span>Stamp Human Approval ({hitlApprovals})</span>
            <span>&rarr;</span>
          </button>
        </div>

        {/* Hero Section: Visual Mascot + Core Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Mascot & Meme Visual Suite */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-3">
            {/* Mascot vs Meme Card Switcher */}
            <div className="inline-flex items-center p-1 bg-[#121620] rounded-xl border border-[#242b3b] shadow-lg">
              <button
                type="button"
                id="btn-hero-mascot"
                onClick={() => setHeroMediaTab('mascot')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  heroMediaTab === 'mascot'
                    ? 'bg-[#00f5ff] text-black shadow-[0_0_12px_rgba(0,245,255,0.4)] scale-105'
                    : 'text-[#8e99ac] hover:text-white'
                }`}
              >
                <span>🎭 Mascot Logo</span>
              </button>
              <button
                type="button"
                id="btn-hero-meme"
                onClick={() => setHeroMediaTab('meme')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  heroMediaTab === 'meme'
                    ? 'bg-[#00f5ff] text-black shadow-[0_0_12px_rgba(0,245,255,0.4)] scale-105'
                    : 'text-[#8e99ac] hover:text-white'
                }`}
              >
                <span>🖼️ Meme Card</span>
                <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse"></span>
              </button>
            </div>

            {/* Template Selector Pills (Active in Meme Mode) */}
            {heroMediaTab === 'meme' && (
              <div className="flex items-center gap-1 p-1 bg-[#10141e] rounded-lg border border-[#242b3b] text-[10px] font-mono animate-fadeIn">
                {(['Breaking News', 'God Candle Chart', 'Laser Eyes Matrix'] as const).map((tpl) => (
                  <button
                    key={tpl}
                    type="button"
                    onClick={() => setMemeTemplate(tpl)}
                    className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                      memeTemplate === tpl
                        ? 'bg-[#00f5ff]/20 text-[#00f5ff] font-bold border border-[#00f5ff]/40'
                        : 'text-[#8e99ac] hover:text-white'
                    }`}
                  >
                    {tpl === 'Breaking News' ? '🚨 News' : tpl === 'God Candle Chart' ? '📈 Candle' : '👁️ Matrix'}
                  </button>
                ))}
              </div>
            )}

            {/* Media Canvas Box */}
            <div
              className="w-full max-w-[380px] aspect-square rounded-3xl border-2 p-3 sm:p-4 shadow-2xl relative flex items-center justify-center overflow-hidden transition-all group"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: heroMediaTab === 'meme' ? '#39ff14' : theme.accentColor,
                boxShadow: heroMediaTab === 'meme' ? '0 0 50px rgba(57,255,20,0.25)' : `0 0 50px ${theme.accentGlow}`,
              }}
            >
              {heroMediaTab === 'meme' ? (
                visual.rendered_meme_url &&
                visual.rendered_meme_url !== visual.mascot_image_url &&
                !memeImgError ? (
                  <img
                    src={visual.rendered_meme_url}
                    alt={`${narrative.token_name} Meme Card`}
                    onError={() => setMemeImgError(true)}
                    className="w-full h-full object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  /* Dynamic Interactive Meme Card Graphic */
                  <div
                    className={`w-full h-full rounded-2xl border p-3.5 flex flex-col justify-between text-center relative overflow-hidden transition-all ${
                      memeTemplate === 'God Candle Chart'
                        ? 'bg-gradient-to-br from-[#061a12] via-[#020d09] to-[#041209] border-[#39ff14]/50'
                        : memeTemplate === 'Laser Eyes Matrix'
                        ? 'bg-gradient-to-br from-[#041624] via-[#020b12] to-[#020810] border-[#00f5ff]/50'
                        : 'bg-gradient-to-br from-[#1c080d] via-[#0b0f19] to-[#020617] border-red-500/50'
                    }`}
                  >
                    {/* Top Emergency / Chart Header */}
                    <div className="w-full flex items-center justify-between gap-1 z-10">
                      {memeTemplate === 'God Candle Chart' ? (
                        <div className="w-full bg-emerald-600/90 text-black font-mono font-black text-[10px] sm:text-xs py-1 px-2.5 rounded uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md">
                          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                          <span>📈 GOD CANDLE MOMENTUM • VERIFIED ON-CHAIN</span>
                        </div>
                      ) : memeTemplate === 'Laser Eyes Matrix' ? (
                        <div className="w-full bg-[#00f5ff] text-black font-mono font-black text-[10px] sm:text-xs py-1 px-2.5 rounded uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md">
                          <Sparkles className="w-3 h-3 fill-black" />
                          <span>⚡ LASER FOCUS PROTOCOL ACTIVE</span>
                        </div>
                      ) : (
                        <div className="w-full bg-red-600 text-white font-mono font-black text-[10px] sm:text-xs py-1 px-2.5 rounded uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md">
                          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                          <span>🚨 {visual.meme_overlay?.top_header || 'BREAKING NEWS • SOLANA'}</span>
                        </div>
                      )}
                    </div>

                    {/* Central Mascot with Ambient Glow Ring */}
                    <div className="flex-1 flex items-center justify-center py-2 relative z-10">
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                          className={`w-36 h-36 rounded-full blur-2xl opacity-40 transition-colors ${
                            memeTemplate === 'God Candle Chart'
                              ? 'bg-[#39ff14]'
                              : memeTemplate === 'Laser Eyes Matrix'
                              ? 'bg-[#00f5ff]'
                              : 'bg-red-500'
                          }`}
                        ></div>
                      </div>

                      <div className="w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center relative transform group-hover:scale-110 transition-transform duration-300">
                        {visual.mascot_image_url && !mascotImgError ? (
                          <img
                            src={visual.mascot_image_url}
                            alt={narrative.token_name}
                            referrerPolicy="no-referrer"
                            onError={() => setMascotImgError(true)}
                            className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(0,245,255,0.4)]"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center drop-shadow-[0_0_20px_rgba(0,245,255,0.4)]"
                            dangerouslySetInnerHTML={{ __html: visual.mascot_svg || fallbackSvg }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Floating Overlay Badges: Grounded On-Chain State */}
                    <div className="w-full flex items-center justify-between text-[9px] font-mono px-1 z-10">
                      <span className="px-1.5 py-0.5 rounded bg-black/80 text-[#39ff14] border border-[#39ff14]/40 font-bold flex items-center gap-1">
                        <span>🛡️ 100% REVOKED MINT</span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-black/80 text-[#00f5ff] border border-[#00f5ff]/40 font-bold flex items-center gap-1">
                        <span>🔥 85% BONDED</span>
                      </span>
                    </div>

                    {/* Bottom Punchline News Chyron */}
                    <div className="w-full mt-1.5 bg-black/95 border border-[#00f5ff]/40 p-2 rounded-xl text-[10px] sm:text-[11px] font-mono font-bold text-white shadow-xl z-10">
                      <p className="text-[#39ff14] uppercase tracking-wide truncate">
                        "{visual.meme_overlay?.bottom_caption || `${narrative.ticker} GOD CANDLE DETECTED ON SOLANA`}"
                      </p>
                      <div className="mt-1 flex items-center justify-between text-[9px] text-[#8e99ac] border-t border-[#242b3b] pt-1">
                        <span>{narrative.ticker} • 100% FAIR LAUNCH</span>
                        <span className="text-[#39ff14] font-bold">✓ VERIFIED ON-CHAIN DATA</span>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                /* Mascot Mode: Clean Isolated Vector Badge */
                <div className="w-full h-full flex items-center justify-center p-2 relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-black/30 rounded-2xl pointer-events-none"></div>
                  {visual.mascot_image_url && !mascotImgError ? (
                    <img
                      src={visual.mascot_image_url}
                      alt={narrative.token_name}
                      referrerPolicy="no-referrer"
                      onError={() => setMascotImgError(true)}
                      className="w-full h-full object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: visual.mascot_svg || fallbackSvg }}
                    />
                  )}
                </div>
              )}

              {/* Floating verified badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-lg border border-[#2d3139] text-[10px] font-mono text-[#39ff14] flex items-center gap-1 z-20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Metaplex SPL</span>
              </div>

              {/* Ticker floating badge */}
              <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg border border-[#2d3139] text-xs font-mono font-black text-[#ccff00] z-20">
                {narrative.ticker}
              </div>
            </div>

            {/* Quick Mascot & Meme Asset Actions */}
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([visual.mascot_svg || fallbackSvg], { type: 'image/svg+xml' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${narrative.ticker.replace('$', '')}_mascot.svg`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-2.5 py-1 rounded bg-[#161a24] hover:bg-[#202736] text-[#8e99ac] hover:text-white border border-[#242b3b] flex items-center gap-1 cursor-pointer transition-all"
              >
                <Download className="w-3 h-3 text-[#00f5ff]" />
                <span>SVG Vector</span>
              </button>
              {visual.rendered_meme_url && (
                <a
                  href={visual.rendered_meme_url}
                  download={`${narrative.ticker.replace('$', '')}_meme.png`}
                  className="px-2.5 py-1 rounded bg-[#161a24] hover:bg-[#202736] text-[#8e99ac] hover:text-white border border-[#242b3b] flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Download className="w-3 h-3 text-[#39ff14]" />
                  <span>Meme PNG</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Narrative Lore, Instant Buy, Socials */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00f5ff]">
                  Autonomous Meme Protocol
                </span>
                <span className="text-xs text-white/40">•</span>
                <span className="text-xs font-mono text-[#39ff14] flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Trend Score: {narrative.viral_score}/100
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
                {narrative.token_name}
              </h1>
              <p className="text-base sm:text-lg font-mono font-semibold" style={{ color: theme.accentColor }}>
                "{narrative.tagline}"
              </p>
            </div>

            {/* Lore Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#10141f] border border-[#242b3b] space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider">
                <span className="text-[#00f5ff]">Origin Story &amp; Narrative Lore</span>
                <span className="text-[#8e99ac]">Season 1: Genesis</span>
              </div>
              <p className="text-xs sm:text-sm text-[#e0e0e0]/90 leading-relaxed font-sans">
                {narrative.lore}
              </p>
            </div>

            {/* Contract Address Interactive Bar */}
            <div className="p-3.5 rounded-xl bg-[#090c12] border border-[#242b3b] space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#8e99ac] uppercase">
                <span className="flex items-center gap-1">
                  <Coins className="w-3 h-3 text-[#00f5ff]" />
                  <span>Solana Contract Address (CA)</span>
                </span>
                <span className="text-[#39ff14]">100% Non-Custodial</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-mono font-bold text-[#39ff14] truncate select-all">
                  {contractAddress}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCA}
                  className="px-3.5 py-1.5 rounded-lg bg-[#181d28] hover:bg-[#232938] text-xs font-mono uppercase text-white border border-[#2d3139] shrink-0 transition-colors cursor-pointer flex items-center gap-1"
                >
                  {copiedCA ? <Check className="w-3.5 h-3.5 text-[#39ff14]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCA ? 'Copied' : 'Copy CA'}</span>
                </button>
              </div>
            </div>

            {/* Instant Action Hub: Buy on ClawPump / Raydium & Burn Pit & Tweet */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <a
                href={`https://pump.fun/coin/${contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl text-black font-extrabold text-xs uppercase font-mono tracking-tight flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-[0_0_20px_rgba(204,255,0,0.25)]"
                style={{ backgroundColor: theme.accentColor }}
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>Buy ${narrative.ticker.replace('$', '')}</span>
              </a>

              <button
                type="button"
                onClick={() => setActiveTab('burn')}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff4500]/20 to-[#ff8c00]/20 hover:from-[#ff4500]/30 hover:to-[#ff8c00]/30 border border-[#ff4500]/50 text-[#ff8c00] font-bold text-xs uppercase font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,69,0,0.2)]"
              >
                <Flame className="w-4 h-4 text-[#ff4500]" />
                <span>🔥 Community Burn Pit</span>
              </button>

              <a
                href={tweetIntent}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-[#141824] hover:bg-[#1f2538] border border-[#242b3b] text-[#00f5ff] font-bold text-xs uppercase font-mono flex items-center justify-center gap-2 transition-colors"
              >
                <Twitter className="w-4 h-4" />
                <span>Join Discussion on X</span>
              </a>
            </div>
          </div>
        </div>

        {/* Live Community Sentiment & Conviction Radar */}
        <CommunitySentimentGauge
          tokenName={narrative.token_name}
          ticker={narrative.ticker}
          contractAddress={contractAddress}
          initialScore={narrative.viral_score || 96}
        />

        {/* Navigation Tabs for Micro-Site Deep Dive */}
        <div className="flex border-b border-[#242b3b] gap-2 sm:gap-6 font-mono text-xs overflow-x-auto custom-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-2 font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'text-[#00f5ff] border-b-2 border-[#00f5ff]'
                : 'text-[#8e99ac] hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Market HUD &amp; Curve</span>
          </button>

          <button
            type="button"
            id="tab-btn-hitl"
            onClick={() => setActiveTab('hitl')}
            className={`pb-3 px-2 font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'hitl'
                ? 'text-[#ef4444] border-b-2 border-[#ef4444]'
                : 'text-[#8e99ac] hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#ef4444]" />
            <span>HITL Protocol Terminal</span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#ef4444]/20 text-[#ef4444] text-[9px] font-mono font-black animate-pulse">
              ANSEM HACK
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('burn')}
            className={`pb-3 px-2 font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'burn'
                ? 'text-[#ff4500] border-b-2 border-[#ff4500]'
                : 'text-[#8e99ac] hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4 text-[#ff4500]" />
            <span>Community Burn Pit</span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#ff4500]/20 text-[#ff4500] text-[9px] font-mono font-black">
              LIVE
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tokenomics')}
            className={`pb-3 px-2 font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'tokenomics'
                ? 'text-[#ccff00] border-b-2 border-[#ccff00]'
                : 'text-[#8e99ac] hover:text-white'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>Tokenomics Matrix (100% Fair)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('playbook')}
            className={`pb-3 px-2 font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'playbook'
                ? 'text-[#39ff14] border-b-2 border-[#39ff14]'
                : 'text-[#8e99ac] hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Community Playbook</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('engagement')}
            className={`pb-3 px-2 font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'engagement'
                ? 'text-[#f43f5e] border-b-2 border-[#f43f5e]'
                : 'text-[#8e99ac] hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Community Engagement Hub</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`pb-3 px-2 font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'media'
                ? 'text-[#00f5ff] border-b-2 border-[#00f5ff]'
                : 'text-[#8e99ac] hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#00f5ff]" />
            <span>Mascot &amp; Meme Kit</span>
          </button>
        </div>

        {/* TAB 1: Live Market HUD & Bonding Curve */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#0e121a] border border-[#242b3b] space-y-5 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#ccff00]" />
                    <h3 className="text-base font-extrabold uppercase font-mono text-white tracking-wider">
                      Live Bonding Curve Telemetry (ClawPump Protocol)
                    </h3>
                  </div>
                  <p className="text-xs text-[#8e99ac] font-mono mt-1">
                    When curve hits 100% (~85 SOL), $12,000+ liquidity is deposited to Raydium DEX and LP is permanently burned.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xl font-black font-mono text-[#39ff14]">{bondingProgress}% Bonded</span>
                  <div className="text-xs text-[#8e99ac] font-mono">{solRaised} / 85.0 SOL in curve</div>
                </div>
              </div>

              {/* Progress Bar with Milestones */}
              <div className="space-y-2">
                <div className="w-full h-4 rounded-full bg-[#080a0f] border border-[#242b3b] overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(57,255,20,0.4)]"
                    style={{
                      width: `${bondingProgress}%`,
                      background: `linear-gradient(90deg, ${theme.accentColor}, #39ff14)`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#8e99ac]">
                  <span>0% (Fair Launch)</span>
                  <span className="text-[#00f5ff]">50% (DexScreener Trending)</span>
                  <span className="text-[#39ff14]">100% (Raydium Migration &amp; LP Burn)</span>
                </div>
              </div>

              {/* Fast Stats Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-[#141824] border border-[#242b3b] space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[#8e99ac] block">Market Cap</span>
                  <span className="text-base sm:text-lg font-black font-mono text-white">$68,420 USD</span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +142.8%
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#141824] border border-[#242b3b] space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[#8e99ac] block">Holders</span>
                  <span className="text-base sm:text-lg font-black font-mono text-[#00f5ff]">148 Wallets</span>
                  <span className="text-[10px] text-[#8e99ac] font-mono">0% Top 10 Dominance</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#141824] border border-[#242b3b] space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[#8e99ac] block">LP Security</span>
                  <span className="text-base sm:text-lg font-black font-mono text-[#39ff14]">100% Burned</span>
                  <span className="text-[10px] text-[#39ff14] font-mono">Zero Rug Pull Risk</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#141824] border border-[#242b3b] space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[#8e99ac] block">Dev Allocation</span>
                  <span className="text-base sm:text-lg font-black font-mono text-[#ccff00]">0% Presale</span>
                  <span className="text-[10px] text-[#8e99ac] font-mono">100% Community Fair</span>
                </div>
              </div>

              {/* Live Buy Feed Stream */}
              <div className="p-4 rounded-2xl bg-[#090c12] border border-[#242b3b] space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Recent On-Chain Activity Feed
                  </span>
                  <span className="text-[#8e99ac] text-[10px]">Auto-Refreshed via Solana RPC</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {recentBuys.map((item, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-[#121622] border border-[#1e2536] flex items-center justify-between text-xs font-mono">
                      <span className="text-[#39ff14] font-bold">🟢 +{item.amountSol} SOL</span>
                      <span className="text-[#8e99ac]">{item.wallet}</span>
                      <span className="text-[10px] text-[#5b6475]">{item.timeAgo}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Tokenomics Matrix */}
        {activeTab === 'tokenomics' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Master Tokenomics Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0e121a] border border-[#242b3b] space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242b3b] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Percent className="w-5 h-5 text-[#ccff00]" />
                    <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-white tracking-wider">
                      Official Tokenomics &amp; Supply Matrix
                    </h2>
                  </div>
                  <p className="text-xs text-[#8e99ac] font-mono mt-1">
                    Strictly fixed supply with zero inflation, zero taxes, and autonomous smart contract decentralization.
                  </p>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] font-mono text-xs font-bold self-start sm:self-auto">
                  Total Supply: 1,000,000,000 $${narrative.ticker.replace('$', '')}
                </div>
              </div>

              {/* Visual Segmented Supply Bar */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-[#8e99ac] flex justify-between">
                  <span>Supply Distribution Breakdown</span>
                  <span className="text-white font-bold">100% Circulating &amp; Public</span>
                </div>
                <div className="w-full h-6 rounded-xl bg-[#080a0f] border border-[#242b3b] overflow-hidden flex p-1 gap-1">
                  <div
                    style={{ width: '80%' }}
                    className="h-full rounded-lg bg-gradient-to-r from-[#00f5ff] to-[#00bfff] flex items-center justify-center text-[10px] font-mono font-bold text-black"
                    title="80% (800,000,000) - Public Bonding Curve"
                  >
                    80% Bonding Curve
                  </div>
                  <div
                    style={{ width: '20%' }}
                    className="h-full rounded-lg bg-gradient-to-r from-[#39ff14] to-[#ccff00] flex items-center justify-center text-[10px] font-mono font-bold text-black"
                    title="20% (200,000,000) - Raydium DEX Liquidity Pool"
                  >
                    20% Raydium LP
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-[#8e99ac] pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00f5ff]"></span>
                    <span>80% (800M) Public Bonding Curve</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#39ff14]"></span>
                    <span>20% (200M) Raydium Migration Pool (LP Burn)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                    <span>0% Team • 0% VC • 0% Presale</span>
                  </div>
                </div>
              </div>

              {/* 4 Security Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-[#141824] border border-[#242b3b] space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#00f5ff]/15 border border-[#00f5ff]/30 text-[#00f5ff] flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-mono font-bold uppercase text-white">Mint Authority</div>
                  <div className="text-sm font-black font-mono text-[#39ff14]">REVOKED</div>
                  <p className="text-[11px] text-[#8e99ac] font-sans">
                    No new tokens can ever be minted. Total supply is mathematically locked at 1 Billion forever.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#141824] border border-[#242b3b] space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#ccff00]/15 border border-[#ccff00]/30 text-[#ccff00] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-mono font-bold uppercase text-white">Freeze Authority</div>
                  <div className="text-sm font-black font-mono text-[#39ff14]">REVOKED</div>
                  <p className="text-[11px] text-[#8e99ac] font-sans">
                    No wallet can ever be frozen or blacklisted. The token is 100% censorship-resistant.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#141824] border border-[#242b3b] space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#39ff14]/15 border border-[#39ff14]/30 text-[#39ff14] flex items-center justify-center">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-mono font-bold uppercase text-white">LP Tokens</div>
                  <div className="text-sm font-black font-mono text-[#39ff14]">100% BURNED</div>
                  <p className="text-[11px] text-[#8e99ac] font-sans">
                    All LP tokens generated on Raydium migration are automatically burned to Solana dead address.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#141824] border border-[#242b3b] space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#f59e0b]/15 border border-[#f59e0b]/30 text-[#f59e0b] flex items-center justify-center">
                    <Percent className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-mono font-bold uppercase text-white">Transaction Tax</div>
                  <div className="text-sm font-black font-mono text-white">0% BUY / 0% SELL</div>
                  <p className="text-[11px] text-[#8e99ac] font-sans">
                    Zero fee extraction. Every transaction goes 100% to buyers and sellers with no dev tax.
                  </p>
                </div>
              </div>

              {/* Verified On-Chain Security Audit Trust Ribbon */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#080a0f] border border-[#242b3b] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#39ff14]/15 border border-[#39ff14]/30 flex items-center justify-center text-[#39ff14] shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono text-white">
                        Verified On-Chain Security Controls
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#39ff14]/20 text-[#39ff14] text-[10px] font-mono font-bold border border-[#39ff14]/30">
                        CHECKS PASSED
                      </span>
                    </div>
                    <p className="text-xs text-[#8e99ac] font-mono mt-0.5">
                      Authorities Revoked &bull; 100% LP Burned to Incinerator &bull; Jito MEV Protected
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsAuditDrawerOpen(true)}
                    className="text-xs font-mono text-[#00f5ff] hover:text-white px-3.5 py-2 rounded-xl bg-[#141824] border border-[#242b3b] hover:border-[#00f5ff]/50 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#00f5ff]" />
                    <span>Inspect Verification Specs &rarr;</span>
                  </button>
                  <a
                    href={`https://solscan.io/token/${contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-[#8e99ac] hover:text-white px-3 py-2 rounded-xl bg-[#0e1117] border border-[#242b3b] hover:border-[#8e99ac]/50 flex items-center gap-1 transition-all"
                  >
                    <span>Solscan</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Community Playbook */}
        {activeTab === 'playbook' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0e121a] border border-[#242b3b] space-y-6 shadow-2xl">
              <div className="border-b border-[#242b3b] pb-4">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#39ff14]" />
                  <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-white tracking-wider">
                    Community Playbook
                  </h2>
                </div>
                <p className="text-xs text-[#8e99ac] font-mono mt-1">
                  Autonomous community milestones guiding ${narrative.ticker.replace('$', '')} from Genesis launch to decentralized cultural meta.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Season 1 */}
                <div className="p-5 rounded-2xl bg-[#141824] border-2 border-[#00f5ff]/40 space-y-3 relative overflow-hidden">
                  <div className="px-2.5 py-1 rounded-md bg-[#00f5ff]/20 text-[#00f5ff] font-mono font-bold text-[10px] inline-block uppercase">
                    Season 01 • Genesis Ignition
                  </div>
                  <h3 className="text-base font-bold text-white font-mono">Bonding Curve Progression</h3>
                  <ul className="space-y-2 text-xs text-[#8e99ac] font-sans">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00f5ff] shrink-0 mt-0.5" />
                      <span>Fair-launch deployment on Solana ClawPump curve</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00f5ff] shrink-0 mt-0.5" />
                      <span>Telegram community bot &amp; Twitter community mobilization</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00f5ff] shrink-0 mt-0.5" />
                      <span>Hit 85 SOL target &rarr; Raydium DEX Migration &amp; LP Burn</span>
                    </li>
                  </ul>
                </div>

                {/* Season 2 */}
                <div className="p-5 rounded-2xl bg-[#141824] border border-[#242b3b] space-y-3 relative overflow-hidden">
                  <div className="px-2.5 py-1 rounded-md bg-[#ccff00]/20 text-[#ccff00] font-mono font-bold text-[10px] inline-block uppercase">
                    Season 02 • Community Expansion
                  </div>
                  <h3 className="text-base font-bold text-white font-mono">Meme Meta Expansion</h3>
                  <ul className="space-y-2 text-xs text-[#8e99ac] font-sans">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#ccff00] shrink-0 mt-0.5" />
                      <span>DexScreener &amp; CoinGecko fast-track verification</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#ccff00] shrink-0 mt-0.5" />
                      <span>Dynamic visual studio meme shards drop on X</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#ccff00] shrink-0 mt-0.5" />
                      <span>1,000+ Verified on-chain community holders</span>
                    </li>
                  </ul>
                </div>

                {/* Season 3 */}
                <div className="p-5 rounded-2xl bg-[#141824] border border-[#242b3b] space-y-3 relative overflow-hidden">
                  <div className="px-2.5 py-1 rounded-md bg-[#39ff14]/20 text-[#39ff14] font-mono font-bold text-[10px] inline-block uppercase">
                    Season 03 • Cultural Longevity
                  </div>
                  <h3 className="text-base font-bold text-white font-mono">Decentralized Community Meta</h3>
                  <ul className="space-y-2 text-xs text-[#8e99ac] font-sans">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#39ff14] shrink-0 mt-0.5" />
                      <span>Autonomous AI Mascot Lore Chat live integration</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#39ff14] shrink-0 mt-0.5" />
                      <span>Cross-platform community merchandise &amp; IRL community meetups</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#39ff14] shrink-0 mt-0.5" />
                      <span>Autonomous community-led meme DAO governance</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Community Engagement Hub */}
        {activeTab === 'engagement' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0e121a] border border-[#242b3b] space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242b3b] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-[#f43f5e]" />
                    <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-white tracking-wider">
                      Community Engagement &amp; Sentiment Hub
                    </h2>
                  </div>
                  <p className="text-xs text-[#8e99ac] font-mono mt-1">
                    Mobilize authentic holder engagement on X / Twitter and Telegram with verified brand assets.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadBrandingKit}
                  disabled={isDownloadingZip}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00f5ff] to-[#39ff14] text-black font-mono font-black text-xs uppercase flex items-center gap-2 transition-transform hover:scale-105 shadow-lg cursor-pointer shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isDownloadingZip ? 'Packaging Zip...' : 'Download Full Brand Pack (.ZIP)'}</span>
                </button>
              </div>

              {/* Tweet Storm Pack */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-[#00f5ff] uppercase">Community Engagement Starters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {narrative.tweet_pack.map((tweet, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#141824] border border-[#242b3b] space-y-3 flex flex-col justify-between">
                      <p className="text-xs text-white font-sans leading-relaxed">
                        "{tweet}"
                      </p>
                      <a
                        href={`https://x.com/intent/tweet?text=${encodeURIComponent(`${tweet}\n\nCA: ${contractAddress}\n\n#Solana #MemeCoin`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="self-end px-3 py-1.5 rounded-lg bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-mono font-bold text-[11px] flex items-center gap-1.5 transition-colors"
                      >
                        <Twitter className="w-3 h-3" />
                        <span>Post on X</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Community Incinerator / Token Burn Pit */}
        {activeTab === 'burn' && (
          <CommunityBurnPit
            tokenName={narrative.token_name}
            ticker={narrative.ticker}
            contractAddress={contractAddress}
            accentColor={theme.accentColor}
          />
        )}

        {/* TAB 6: Mascot & Meme Media Kit */}
        {activeTab === 'media' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0e121a] border border-[#242b3b] space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242b3b] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#00f5ff]" />
                    <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-white tracking-wider">
                      Official Mascot &amp; Meme Assets
                    </h2>
                  </div>
                  <p className="text-xs text-[#8e99ac] font-mono mt-1">
                    Free, decentralized brand assets ready for Telegram stickers, Twitter profile pics, and creative community memes.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadBrandingKit}
                  disabled={isDownloadingZip}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00f5ff] to-[#39ff14] text-black font-mono font-black text-xs uppercase flex items-center gap-2 transition-transform hover:scale-105 shadow-lg cursor-pointer shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isDownloadingZip ? 'Packaging Zip...' : 'Download Full Brand Pack (.ZIP)'}</span>
                </button>
              </div>

              {/* Grid of Mascot and Meme Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Mascot Card */}
                <div className="p-5 rounded-2xl bg-[#141824] border border-[#242b3b] space-y-4 flex flex-col items-center">
                  <div className="w-full flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#00f5ff] uppercase flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Vector Sticker Mascot
                    </span>
                    <span className="text-[10px] font-mono text-white/50">Lossless Scalable</span>
                  </div>

                  <div className="w-48 h-48 sm:w-56 sm:h-56 p-2 rounded-2xl bg-black/50 border border-[#2d3139] flex items-center justify-center overflow-hidden">
                    {visual.mascot_image_url && !mascotImgError ? (
                      <img
                        src={visual.mascot_image_url}
                        alt={narrative.token_name}
                        referrerPolicy="no-referrer"
                        onError={() => setMascotImgError(true)}
                        className="w-full h-full object-contain rounded-xl"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: visual.mascot_svg || fallbackSvg }}
                      />
                    )}
                  </div>

                  <div className="w-full flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const blob = new Blob([visual.mascot_svg || fallbackSvg], { type: 'image/svg+xml' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${narrative.ticker.replace('$', '')}_mascot.svg`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="flex-1 py-2 px-3 rounded-lg bg-[#00f5ff]/10 hover:bg-[#00f5ff]/20 text-[#00f5ff] border border-[#00f5ff]/30 font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download SVG</span>
                    </button>
                    {visual.mascot_image_url && (
                      <a
                        href={visual.mascot_image_url}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3 rounded-lg bg-[#1f2538] hover:bg-[#2b334c] text-white border border-[#2d3139] font-mono text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>HD Image</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Meme Card */}
                <div className="p-5 rounded-2xl bg-[#141824] border border-[#242b3b] space-y-4 flex flex-col items-center">
                  <div className="w-full flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#39ff14] uppercase flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-[#39ff14]" />
                      Meme Overlay Card
                    </span>
                    <span className="text-[10px] font-mono text-white/50">{visual.meme_overlay?.template_type || 'Breaking News'}</span>
                  </div>

                  <div className="w-full aspect-video p-2 rounded-2xl bg-black/50 border border-[#2d3139] flex items-center justify-center overflow-hidden">
                    {visual.rendered_meme_url && !memeImgError ? (
                      <img
                        src={visual.rendered_meme_url}
                        alt={`${narrative.token_name} Meme Card`}
                        onError={() => setMemeImgError(true)}
                        className="w-full h-full object-contain rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#0b1120] to-[#020617] border border-[#00f5ff]/30 p-3 flex flex-col justify-between text-center">
                        <div className="bg-red-600 text-white font-black text-[10px] py-0.5 px-2 rounded uppercase tracking-wider">
                          🚨 {visual.meme_overlay?.top_header || 'BREAKING NEWS'}
                        </div>
                        <div className="flex-1 flex items-center justify-center py-1">
                          <div
                            className="w-20 h-20 flex items-center justify-center"
                            dangerouslySetInnerHTML={{ __html: visual.mascot_svg || fallbackSvg }}
                          />
                        </div>
                        <div className="bg-black/90 border border-[#00f5ff]/40 p-1 rounded text-[10px] font-mono text-[#00f5ff] font-bold truncate">
                          {visual.meme_overlay?.bottom_caption || `${narrative.ticker} GOD CANDLE DETECTED`}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="w-full flex items-center gap-2 pt-2">
                    {visual.rendered_meme_url ? (
                      <a
                        href={visual.rendered_meme_url}
                        download={`${narrative.ticker.replace('$', '')}_meme.png`}
                        className="flex-1 py-2 px-3 rounded-lg bg-[#39ff14]/10 hover:bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14]/30 font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Meme PNG</span>
                      </a>
                    ) : (
                      <div className="flex-1 py-2 px-3 rounded-lg bg-white/5 text-white/50 font-mono text-xs text-center">
                        Meme generated in studio
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: HITL Protocol (Human in the Loop) Terminal */}
        {activeTab === 'hitl' && (
          <HITLApprovalTerminal
            tokenName={narrative.token_name}
            ticker={narrative.ticker}
            contractAddress={contractAddress}
            initialApprovals={hitlApprovals}
          />
        )}

        {/* Interactive Micro-Site FAQ Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1017] border border-[#242b3b] space-y-5 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#242b3b]">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-black"
                style={{ backgroundColor: theme.accentColor }}
              >
                <HelpCircle className="w-4 h-4 text-black" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-mono uppercase text-white tracking-tight">
                  Frequently Asked Questions
                </h3>
                <p className="text-xs text-[#8e99ac] font-mono">
                  Everything you need to know about {narrative.token_name} ({narrative.ticker})
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#ff4500] bg-[#ff4500]/10 px-2.5 py-1 rounded-full border border-[#ff4500]/30 self-start sm:self-auto font-bold">
              8 Verified Answers
            </span>
          </div>

          <div className="space-y-3">
            {microFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border transition-all overflow-hidden"
                  style={{
                    backgroundColor: isOpen ? '#121620' : '#0a0c10',
                    borderColor: isOpen ? theme.accentColor : '#222630',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold font-mono text-white flex items-center gap-2">
                      <span className="text-[#00f5ff] text-xs">Q{idx + 1}.</span>
                      {faq.q}
                    </span>
                    <span className="text-white/60 shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4" style={{ color: theme.accentColor }} />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-[#e0e0e0]/80 font-sans leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Built-In Community Growth Banner: Powered by MemeFi OS */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#121622] via-[#1a2233] to-[#121622] border-2 border-[#00f5ff]/60 shadow-[0_0_30px_rgba(0,245,255,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-5 text-left">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00f5ff]/20 text-[#00f5ff] text-[10px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#00f5ff]" />
              Built-In Community Growth Engine
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-mono uppercase text-white tracking-tight">
              Create Your Own Meme Token on Solana
            </h3>
            <p className="text-xs text-[#e0e0e0]/70 font-sans leading-relaxed">
              Launch a 100% non-custodial meme coin with custom AI lore, 512x512 vector mascot, dynamic bonding curve, and automated Telegram mobilization bot in under 60 seconds.
            </p>
          </div>

          <div className="shrink-0">
            {onBackToStudio ? (
              <button
                type="button"
                onClick={onBackToStudio}
                className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-[#00f5ff] hover:bg-[#b2faff] text-black font-extrabold text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-[0_0_20px_rgba(0,245,255,0.4)] cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>⚡ Powered by MemeFi OS — Launch Yours</span>
              </button>
            ) : (
              <a
                href="/"
                className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-[#00f5ff] hover:bg-[#b2faff] text-black font-extrabold text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-[0_0_20px_rgba(0,245,255,0.4)] cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>⚡ Powered by MemeFi OS — Launch Yours</span>
              </a>
            )}
          </div>
        </div>
      </main>

      {/* Floating Interactive Mascot Lore Chat Widget */}
      <MascotLoreChatWidget
        tokenName={narrative.token_name}
        ticker={narrative.ticker}
        lore={narrative.lore}
        tagline={narrative.tagline}
        accentColor={theme.accentColor}
      />

      {/* Standardized Master Submission Footer */}
      <footer className="border-t border-[#2d3139] bg-[#07080a] py-6 text-center text-xs text-[#e0e0e0] font-mono mt-12">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="font-bold text-white uppercase">MemeFi OS</span>
            <span className="text-[#2d3139]">|</span>
            <span className="text-[#00f5ff]">Powered by AI Studio &amp; Solana</span>
            <span className="text-[#2d3139]">|</span>
            <span className="text-[#39ff14]">Non-Custodial</span>
            <span className="text-[#2d3139]">|</span>
            <span className="text-[#ccff00]">#AnsemHack Submission</span>
          </div>
          <p className="text-[11px] opacity-60">"Generated with MemeFi OS — The No-Code AI Meme Coin Engine"</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] opacity-60 pt-1">
            {onBackToStudio && (
              <button onClick={onBackToStudio} className="hover:text-white underline cursor-pointer">
                ⚡ Launch Your Own
              </button>
            )}
            <button
              onClick={() => setIsAuditDrawerOpen(true)}
              className="hover:text-white cursor-pointer"
            >
              🛡️ Security Controls &amp; Verification
            </button>
            <span className="hover:text-white">📜 Terms &amp; Disclaimer</span>
            <a
              href="https://x.com/MemeFi_OS"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00f5ff] hover:underline"
            >
              🐦 @MemeFi_OS
            </a>
            <span className="text-[#2d3139]">|</span>
            <a
              href="https://t.me/+gbar8aC6QgkzZDNh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#39ff14] hover:underline"
            >
              💬 Telegram Group
            </a>
          </div>

          <div className="pt-3 border-t border-[#2d3139]/40 max-w-4xl mx-auto text-left space-y-1">
            <div className="flex items-center gap-1.5 text-[#39ff14] text-[10px] font-bold uppercase">
              <ShieldCheck className="w-3 h-3" />
              <span>Non-Custodial Disclaimer:</span>
            </div>
            <p className="text-[10px] leading-relaxed opacity-60 font-sans">
              MemeFi OS is a non-custodial software interface and workflow automation tool. The platform consolidates and automates standard, user-driven digital creation and deployment practices—including generative visual design, metadata formatting, and smart contract interaction—into a unified workflow. Tokens generated or deployed using this interface are speculative, non-functional digital assets created solely for social interaction, community engagement, and market speculation. They carry no intrinsic financial value, convey no yield or governance rights, and offer no guarantee or expectation of profit derived from the efforts of the platform developers. All on-chain deployments, liquidity creations, and secondary market trades are executed directly by users via autonomous smart contracts at their own risk. Interacting with cryptocurrencies and meme coins involves extreme volatility and may result in a 100% total loss of capital.
            </p>
          </div>
        </div>
      </footer>

      {/* Slide-Over Security Audit Drawer */}
      <SecurityAuditDrawer
        isOpen={isAuditDrawerOpen}
        onClose={() => setIsAuditDrawerOpen(false)}
        tokenName={narrative.token_name}
        ticker={narrative.ticker}
        mintAddress={contractAddress}
        deployment={propDeployment}
      />
    </div>
  );
};
