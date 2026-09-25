import React, { useState, useEffect } from 'react';
import { Agent1NarrativeResult, Agent2VisualResult, TokenDeploymentData } from '../types';
import { getThemeByStyleName } from '../themeConfig';
import {
  downloadCompleteBrandingKitZip,
  generateProfileAvatarBlob,
  generateTwitterBannerBlob,
  generateTelegramHeaderBlob,
} from '../socialSuiteGenerator';
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
  ChevronDown,
  ChevronUp,
  Download,
  BarChart3,
  Users,
  Layers,
  ArrowUpRight,
  Send,
  CheckCircle2,
  Compass,
  MessageCircle,
  Eye,
  Rocket,
  Image as ImageIcon
} from 'lucide-react';
import { generateVectorMascotSvg } from '../utils/mascotSvgGenerator';
import { CommunitySentimentGauge } from './CommunitySentimentGauge';
import { CommunityBurnPit } from './CommunityBurnPit';
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
  const [bondingProgress] = useState(68);
  const [solRaised] = useState(58.2);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [isDownloadingPfp, setIsDownloadingPfp] = useState(false);
  const [isDownloadingBanner, setIsDownloadingBanner] = useState(false);
  const [isDownloadingTg, setIsDownloadingTg] = useState(false);
  const [activeMemeTab, setActiveMemeTab] = useState<'mascot' | 'breaking' | 'godcandle' | 'laser'>('mascot');
  const [mascotImgError, setMascotImgError] = useState(false);

  // Derive contract address
  const contractAddress =
    propTokenCA ||
    propMintAddress ||
    propDeployment?.mintAddress ||
    'MFCAT88x7vK6wQ5nP4mB3xC2yR9tU1eW7sD5fG3pump';

  // Fallback narrative if accessed directly via URL
  const narrative: Agent1NarrativeResult = propNarrative || {
    token_name: 'MemeFiCat',
    ticker: '$MFCAT',
    tagline: 'The official cybernetic feline orchestrating multi-agent AI meme deployments on Solana.',
    viral_score: 99,
    lore: 'Born inside the Solana SVM runtime, $MFCAT is the official genesis utility mascot of MemeFi OS. Armed with glowing cyber-goggles and multi-terminal command interfaces, MemeFiCat coordinates the 4 sequential AI agents, automates viral meme canvas synthesis, and purrs at 400 TPS with permanent 100% genesis LP token burn.',
    tweet_pack: [
      '🐾 $MFCAT is officially deployed on Solana! The official genesis utility mascot of MemeFi OS is live. 100% genesis LP burned forever.',
      'Why chase ordinary tokens when the MemeFi OS mascot $MFCAT coordinates the entire 4-agent swarm on-chain? ⚡🐱',
      '⚡ Community mobilization active for $MFCAT! Grab your allocation on the ClawPump bonding curve before Raydium graduation.',
    ],
    mascot_prompt: 'Cybernetic neon cat with glowing holographic sunglasses sitting on a supercomputer cluster terminal, cyberpunk pixel art',
  };

  const cleanTicker = narrative.ticker.startsWith('$') ? narrative.ticker : `$${narrative.ticker}`;

  const fallbackSvg = generateVectorMascotSvg(
    cleanTicker,
    narrative.token_name,
    narrative.mascot_prompt || narrative.lore,
    'Tech/AI Absurdism',
    'Cyberpunk Pixel Art'
  );

  const visual: Agent2VisualResult = {
    image_generation_prompt: propVisual?.image_generation_prompt || 'Digital vector sticker mascot',
    negative_prompt: propVisual?.negative_prompt || 'blurry, low quality',
    meme_overlay: propVisual?.meme_overlay || {
      template_type: 'Breaking News',
      top_header: 'BREAKING NEWS',
      bottom_caption: `400 TPS GOD CANDLE DETECTED FOR ${cleanTicker}`,
      ticker_watermark: cleanTicker,
    },
    mascot_image_url: propVisual?.mascot_image_url,
    rendered_meme_url: propVisual?.rendered_meme_url,
    mascot_svg: propVisual?.mascot_svg || fallbackSvg,
  };

  const theme = getThemeByStyleName(visual.visual_elements?.background_style || 'Cyberpunk Pixel Art');

  // Trigger celebratory confetti on initial visit
  useEffect(() => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.5 },
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
        ticker: cleanTicker,
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

  const triggerBlobDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPfp = async () => {
    setIsDownloadingPfp(true);
    try {
      const blob = await generateProfileAvatarBlob({
        tokenName: narrative.token_name,
        ticker: cleanTicker,
        tagline: narrative.tagline,
        lore: narrative.lore,
        contractAddress: contractAddress,
        mascotSvg: visual.mascot_svg,
        mascotImageUrl: visual.mascot_image_url,
      });
      triggerBlobDownload(blob, `${cleanTicker.replace('$', '')}_Profile_Avatar_512x512.png`);
    } catch (err) {
      console.error('Failed to download PFP:', err);
    } finally {
      setIsDownloadingPfp(false);
    }
  };

  const handleDownloadBanner = async () => {
    setIsDownloadingBanner(true);
    try {
      const blob = await generateTwitterBannerBlob({
        tokenName: narrative.token_name,
        ticker: cleanTicker,
        tagline: narrative.tagline,
        lore: narrative.lore,
        contractAddress: contractAddress,
        mascotSvg: visual.mascot_svg,
        mascotImageUrl: visual.mascot_image_url,
      });
      triggerBlobDownload(blob, `${cleanTicker.replace('$', '')}_Twitter_X_Banner_1500x500.png`);
    } catch (err) {
      console.error('Failed to download Banner:', err);
    } finally {
      setIsDownloadingBanner(false);
    }
  };

  const handleDownloadTg = async () => {
    setIsDownloadingTg(true);
    try {
      const blob = await generateTelegramHeaderBlob({
        tokenName: narrative.token_name,
        ticker: cleanTicker,
        tagline: narrative.tagline,
        lore: narrative.lore,
        contractAddress: contractAddress,
        mascotSvg: visual.mascot_svg,
        mascotImageUrl: visual.mascot_image_url,
      });
      triggerBlobDownload(blob, `${cleanTicker.replace('$', '')}_Telegram_Portal_Header_800x400.png`);
    } catch (err) {
      console.error('Failed to download Telegram Header:', err);
    } finally {
      setIsDownloadingTg(false);
    }
  };

  const tweetIntent = `https://x.com/intent/tweet?text=${encodeURIComponent(
    `🐾 Check out ${narrative.token_name} (${cleanTicker}) on Solana!\n\n"${narrative.tagline}"\n\n🎯 Mint CA: ${contractAddress}\n🌐 Micro-Site: ${typeof window !== 'undefined' ? window.location.href : ''}\n\n#Solana #MemeCoin #AnsemHack`
  )}`;

  const pumpFunBuyUrl = `https://pump.fun/coin/${contractAddress}`;
  const dexScreenerUrl = `https://dexscreener.com/solana/${contractAddress}`;
  const isMainnet = propDeployment?.solanaNetwork === 'mainnet' || (!contractAddress.includes('pump') && (contractAddress.startsWith('MFCAT') || contractAddress.startsWith('HITL')));
  const solscanUrl = isMainnet 
    ? `https://solscan.io/token/${contractAddress}`
    : `https://solscan.io/token/${contractAddress}?cluster=devnet`;

  const microFaqs = [
    {
      q: `What is ${narrative.token_name} (${cleanTicker})?`,
      a: `${narrative.token_name} is a 100% fair launch meme coin deployed on Solana. Powered by MemeFi OS, its lore, visuals, and community assets are coordinated across autonomous multi-agent swarms with strict human-in-the-loop review.`,
    },
    {
      q: 'Are the LP tokens permanently burned?',
      a: 'Yes. 100% of the Genesis LP liquidity tokens were permanently burned at launch. There is zero mint authority, zero freeze authority, and zero hidden team allocations.',
    },
    {
      q: 'What are the buy and sell transaction taxes?',
      a: '0% Buy Tax, 0% Sell Tax. Clean, frictionless swaps on Solana bonding curves and Raydium DEX pools.',
    },
    {
      q: 'How does the community get involved?',
      a: 'Join our official Telegram channel, participate in social dispatches on X, and download our Meme Studio sticker pack to create and share new memes.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-white selection:bg-[#00f5ff] selection:text-black font-sans antialiased pb-24">
      
      {/* ── TOP ANNOUNCEMENT TICKER ── */}
      <div className="bg-gradient-to-r from-[#00f5ff]/20 via-[#ccff00]/15 to-[#00f5ff]/20 border-b border-[#1f2937] py-2 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-xs font-mono">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ccff00]"></span>
          </span>
          <span className="text-[#ccff00] font-bold tracking-wider uppercase">Official Fair Launch</span>
          <span className="text-gray-400 hidden sm:inline">•</span>
          <span className="text-gray-300 hidden sm:inline">100% Genesis LP Tokens Burned Forever</span>
          <span className="text-gray-400 hidden sm:inline">•</span>
          <span className="text-[#00f5ff] font-bold">Zero Presale • Zero Mint Authority</span>
        </div>
      </div>

      {/* ── MINIMAL TOP NAVIGATION ── */}
      <nav className="sticky top-0 z-40 bg-[#07090e]/90 backdrop-blur-md border-b border-[#1a2233]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo & Studio Back Link */}
          <div className="flex items-center gap-3">
            {onBackToStudio && (
              <button
                type="button"
                onClick={onBackToStudio}
                className="p-2 rounded-xl bg-[#121622] hover:bg-[#1c2236] text-gray-400 hover:text-white border border-[#232d42] transition-colors flex items-center gap-1.5 text-xs font-mono font-bold cursor-pointer"
                title="Return to MemeFi OS Studio"
              >
                <ArrowLeft className="w-4 h-4 text-[#00f5ff]" />
                <span className="hidden sm:inline">Back to Studio</span>
              </button>
            )}

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00f5ff] to-[#ccff00] p-0.5 shadow-[0_0_15px_rgba(0,245,255,0.3)]">
                <div className="w-full h-full bg-[#090b10] rounded-[10px] overflow-hidden flex items-center justify-center">
                  {visual.mascot_image_url && !mascotImgError ? (
                    <img
                      src={visual.mascot_image_url}
                      alt={narrative.token_name}
                      className="w-full h-full object-cover"
                      onError={() => setMascotImgError(true)}
                    />
                  ) : (
                    <span className="font-mono font-black text-xs text-[#00f5ff]">{cleanTicker.slice(1, 3)}</span>
                  )}
                </div>
              </div>
              <div>
                <span className="font-mono font-black text-sm text-white tracking-tight">{narrative.token_name}</span>
                <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00f5ff]/15 text-[#00f5ff] border border-[#00f5ff]/30">
                  {cleanTicker}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links & Buy CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="p-2.5 rounded-xl bg-[#121622] hover:bg-[#1c2236] text-gray-300 hover:text-white border border-[#232d42] transition-colors cursor-pointer"
              title="Copy share link"
            >
              {copiedShare ? <Check className="w-4 h-4 text-[#ccff00]" /> : <Share2 className="w-4 h-4" />}
            </button>

            <a
              href={tweetIntent}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-[#121622] hover:bg-[#1c2236] text-gray-300 hover:text-[#00f5ff] border border-[#232d42] transition-colors"
              title="Share on X (Twitter)"
            >
              <Twitter className="w-4 h-4" />
            </a>

            <a
              href={dexScreenerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00f5ff] to-[#ccff00] hover:opacity-90 text-black font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all"
            >
              <BarChart3 className="w-3.5 h-3.5 text-black" />
              <span>DexScreener Chart</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ── 1. HERO SECTION ── */}
      <section className="relative pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#00f5ff]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-[#ccff00]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Mascot Visual Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group w-full max-w-[380px] aspect-square rounded-3xl bg-gradient-to-b from-[#161d2e] to-[#0a0d14] p-1 border-2 border-[#222d44] shadow-[0_0_50px_rgba(0,245,255,0.15)] transition-transform hover:scale-[1.01]">
              
              {/* Inner Avatar Display */}
              <div className="w-full h-full rounded-[22px] overflow-hidden bg-[#0a0d14] relative flex items-center justify-center">
                {activeMemeTab === 'mascot' ? (
                  visual.mascot_image_url && !mascotImgError ? (
                    <img
                      src={visual.mascot_image_url}
                      alt={narrative.token_name}
                      className="w-full h-full object-cover"
                      onError={() => setMascotImgError(true)}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center p-4"
                      dangerouslySetInnerHTML={{ __html: visual.mascot_svg || fallbackSvg }}
                    />
                  )
                ) : (
                  /* Live Meme Card Preview */
                  <div className="w-full h-full p-4 flex flex-col justify-between bg-gradient-to-b from-[#0e1320] to-[#07090e] border border-[#20293d] rounded-[20px] text-center">
                    <div className="bg-red-600 text-white font-mono font-black text-xs py-1 px-3 rounded uppercase tracking-wider">
                      {activeMemeTab === 'breaking' ? 'BREAKING NEWS' : activeMemeTab === 'godcandle' ? 'GOD CANDLE DETECTED' : 'SOLANA LASER CAT'}
                    </div>
                    <div className="my-auto py-2">
                      <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden mb-2">
                        {visual.mascot_image_url && !mascotImgError ? (
                          <img src={visual.mascot_image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div dangerouslySetInnerHTML={{ __html: visual.mascot_svg || fallbackSvg }} />
                        )}
                      </div>
                      <div className="font-mono font-black text-sm text-[#ccff00] leading-tight">
                        {cleanTicker} PURRS AT 400 TPS
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-gray-400 bg-black/60 py-1 rounded">
                      CA: {contractAddress.slice(0, 8)}...{contractAddress.slice(-6)}
                    </div>
                  </div>
                )}

                {/* Floating Live Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#303e5c] text-[10px] font-mono font-bold text-[#ccff00] flex items-center gap-1.5 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
                  <span>VIRAL SCORE {narrative.viral_score || 99}/100</span>
                </div>
              </div>
            </div>

            {/* Quick Mascot Theme Tabs */}
            <div className="mt-3 flex items-center gap-1.5 p-1 rounded-xl bg-[#0e121a] border border-[#1f2738] text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setActiveMemeTab('mascot')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeMemeTab === 'mascot'
                    ? 'bg-[#00f5ff] text-black font-bold shadow-[0_0_10px_rgba(0,245,255,0.3)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Mascot
              </button>
              <button
                type="button"
                onClick={() => setActiveMemeTab('breaking')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeMemeTab === 'breaking'
                    ? 'bg-[#00f5ff] text-black font-bold shadow-[0_0_10px_rgba(0,245,255,0.3)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Breaking News
              </button>
              <button
                type="button"
                onClick={() => setActiveMemeTab('godcandle')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeMemeTab === 'godcandle'
                    ? 'bg-[#00f5ff] text-black font-bold shadow-[0_0_10px_rgba(0,245,255,0.3)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                God Candle
              </button>
            </div>
          </div>

          {/* Right Column: Narrative & Action Core */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Ticker & Token Name */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f5ff]/10 border border-[#00f5ff]/30 text-[#00f5ff] text-xs font-mono font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OFFICIAL SOLANA MEME TOKEN</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-white leading-none">
                {narrative.token_name}
                <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] via-[#ccff00] to-[#00f5ff]">
                  {cleanTicker}
                </span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-gray-300 font-sans leading-relaxed max-w-xl">
                {narrative.tagline}
              </p>
            </div>

            {/* Interactive 1-Click Copy CA Pill */}
            <div className="p-3 sm:p-4 rounded-2xl bg-[#0c1018] border border-[#1e273a] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#ccff00]" />
                  <span>Solana Contract Address (CA)</span>
                </span>
                <a
                  href={solscanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00f5ff] hover:underline flex items-center gap-1"
                >
                  <span>Solscan</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 bg-[#06080d] border border-[#242f47] rounded-xl px-3.5 py-2.5 font-mono text-xs text-gray-200 truncate select-all">
                  {contractAddress}
                </div>
                <button
                  type="button"
                  onClick={handleCopyCA}
                  className="px-4 py-2.5 rounded-xl bg-[#00f5ff] hover:bg-[#80faff] text-black font-mono font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-[0_0_15px_rgba(0,245,255,0.3)]"
                >
                  {copiedCA ? (
                    <>
                      <Check className="w-4 h-4 text-black" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-black" />
                      <span>Copy CA</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Primary Action Button Cluster */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={dexScreenerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#00f5ff] to-[#ccff00] hover:opacity-90 text-black font-mono font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,245,255,0.35)] transition-all transform hover:-translate-y-0.5"
              >
                <BarChart3 className="w-4 h-4 text-black" />
                <span>Live DexScreener Chart</span>
              </a>

              <a
                href={solscanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-2xl bg-[#121622] hover:bg-[#1b2234] text-white font-mono font-bold text-sm flex items-center justify-center gap-2 border border-[#253046] transition-all"
              >
                <ExternalLink className="w-4 h-4 text-[#00f5ff]" />
                <span>Solscan Explorer</span>
              </a>

              <a
                href={tweetIntent}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-2xl bg-[#121622] hover:bg-[#1b2234] text-white font-mono font-bold text-sm flex items-center justify-center gap-2 border border-[#253046] transition-all"
              >
                <Twitter className="w-4 h-4 text-[#00f5ff]" />
                <span>Spread on X</span>
              </a>
            </div>

            {/* Live Stats Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#0a0e16] border border-[#1b2336]">
                <div className="text-[11px] font-mono text-gray-400">Total Supply</div>
                <div className="text-sm sm:text-base font-mono font-bold text-white mt-0.5">1,000,000,000</div>
              </div>

              <div className="p-3 rounded-xl bg-[#0a0e16] border border-[#1b2336]">
                <div className="text-[11px] font-mono text-gray-400">Buy / Sell Tax</div>
                <div className="text-sm sm:text-base font-mono font-bold text-[#ccff00] mt-0.5">0% / 0%</div>
              </div>

              <div className="p-3 rounded-xl bg-[#0a0e16] border border-[#1b2336]">
                <div className="text-[11px] font-mono text-gray-400">LP Tokens</div>
                <div className="text-sm sm:text-base font-mono font-bold text-[#00f5ff] mt-0.5">100% Burned</div>
              </div>

              <div className="p-3 rounded-xl bg-[#0a0e16] border border-[#1b2336]">
                <div className="text-[11px] font-mono text-gray-400">Bonding Curve</div>
                <div className="text-sm sm:text-base font-mono font-bold text-[#ccff00] mt-0.5">{bondingProgress}% Graduated</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. COMMUNITY SENTIMENT & VIRAL GAUGE ── */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <CommunitySentimentGauge
          tokenName={narrative.token_name}
          ticker={cleanTicker}
          contractAddress={contractAddress}
          initialScore={narrative.viral_score || 94}
        />
      </section>

      {/* ── 3. THE LORE & ORIGIN STORY ── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-b from-[#0d121c] to-[#080a10] border border-[#1c2538] p-6 sm:p-10 relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          
          <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-[#00f5ff] uppercase tracking-wider mb-3">
            <Compass className="w-4 h-4" />
            <span>The Origin Lore &amp; Protocol Manifesto</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-mono font-black text-white tracking-tight">
            The Cybernetic Lore Behind {cleanTicker}
          </h2>

          <div className="mt-6 space-y-4 text-gray-300 font-sans text-base sm:text-lg leading-relaxed">
            <p className="bg-[#121826]/70 p-4 rounded-2xl border-l-4 border-[#00f5ff] font-mono text-sm text-gray-200">
              "{narrative.lore}"
            </p>
            <p>
              While ordinary meme coins rely on stolen stock art and dev wallets dumping at block 10, <strong>{narrative.token_name}</strong> was engineered as a decentralized community standard. Every meme, every canvas graphic, and every broadcast alert is generated autonomously and governed by the community.
            </p>
          </div>

          {/* Tweet Pack Showcase */}
          {narrative.tweet_pack && narrative.tweet_pack.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[#1a2336] space-y-3">
              <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Twitter className="w-3.5 h-3.5 text-[#00f5ff]" />
                <span>Official Launch Tweet Pack</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {narrative.tweet_pack.map((tweet, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[#07090f] border border-[#1b2438] text-xs font-mono text-gray-300 flex flex-col justify-between">
                    <p className="italic">"{tweet}"</p>
                    <a
                      href={`https://x.com/intent/tweet?text=${encodeURIComponent(tweet)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 text-[11px] text-[#00f5ff] hover:underline inline-flex items-center gap-1 font-bold"
                    >
                      <span>Broadcast This</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ── 4. CLEAN TOKENOMICS & SECURITY ── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] text-xs font-mono font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>UNCOMPROMISING TOKENOMICS</span>
          </div>
          <h2 className="text-3xl font-mono font-black text-white tracking-tight">
            Fair Launch Architecture
          </h2>
          <p className="mt-2 text-sm text-gray-400 font-sans">
            Built strictly on Solana bonding curve principles. No insider allocations, no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-[#0c1018] border border-[#1c2438] relative group hover:border-[#00f5ff]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#00f5ff]/10 text-[#00f5ff] flex items-center justify-center font-black mb-4">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-mono font-bold text-lg text-white">100% LP Burned</h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
              Initial Genesis liquidity tokens are permanently burned on-chain to ensure untamperable floor support.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-[#0c1018] border border-[#1c2438] relative group hover:border-[#ccff00]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#ccff00]/10 text-[#ccff00] flex items-center justify-center font-black mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-mono font-bold text-lg text-white">Zero Mint Authority</h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
              Contract authorities are revoked at creation. Supply is strictly capped at 1,000,000,000 tokens forever.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-[#0c1018] border border-[#1c2438] relative group hover:border-[#00f5ff]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#00f5ff]/10 text-[#00f5ff] flex items-center justify-center font-black mb-4">
              <Coins className="w-5 h-5" />
            </div>
            <h3 className="font-mono font-bold text-lg text-white">0% Transaction Tax</h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
              Zero buy tax, zero sell tax. 100% of trading volume flows directly through decentralized Solana liquidity pools.
            </p>
          </div>

        </div>
      </section>

      {/* ── 5. COMMUNITY BURN PIT & DEFLATION VAULT ── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <CommunityBurnPit
          tokenName={narrative.token_name}
          ticker={cleanTicker}
          contractAddress={contractAddress}
          accentColor="#ff4500"
        />
      </section>

      {/* ── 6. MEME & SOCIAL ASSET VAULT (X BANNER, PFP, STICKERS) ── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-[#0c1018] border border-[#1d263b] p-6 sm:p-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1a2336]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00f5ff] uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Official Social Media &amp; Brand Assets</span>
              </div>
              <h2 className="text-2xl font-mono font-black text-white">
                Download X Banner, Profile Pic &amp; Memes
              </h2>
            </div>

            <button
              type="button"
              onClick={handleDownloadBrandingKit}
              disabled={isDownloadingZip}
              className="px-5 py-2.5 rounded-xl bg-[#00f5ff] hover:bg-[#80faff] disabled:opacity-50 text-black font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,245,255,0.3)] transition-all cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloadingZip ? 'Zipping Full Kit...' : 'Download Full Suite (.ZIP)'}</span>
            </button>
          </div>

          {/* Primary Social Media Assets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            
            {/* Asset 1: X (Twitter) Header Banner */}
            <div className="p-5 rounded-2xl bg-[#07090e] border border-[#1e273d] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#00f5ff]">
                    <Twitter className="w-3.5 h-3.5" />
                    <span>X (Twitter) Header Banner</span>
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 bg-black/60 px-2 py-0.5 rounded border border-[#222]">
                    1500 × 500 HD
                  </span>
                </div>

                {/* Banner Preview */}
                <div className="w-full aspect-[3/1] rounded-xl overflow-hidden bg-gradient-to-r from-[#090a0f] via-[#121622] to-[#07080b] border border-[#25324b] p-3 flex items-center justify-between relative mb-4">
                  <div className="space-y-1">
                    <div className="text-[9px] font-mono text-[#00f5ff]">SOLANA FAIR LAUNCH</div>
                    <div className="font-mono font-black text-base text-white leading-none">{narrative.token_name}</div>
                    <div className="font-mono font-bold text-xs text-[#ccff00]">{cleanTicker}</div>
                  </div>
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#ccff00] bg-black shrink-0">
                    {visual.mascot_image_url && !mascotImgError ? (
                      <img src={visual.mascot_image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: visual.mascot_svg || fallbackSvg }} className="w-full h-full" />
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadBanner}
                disabled={isDownloadingBanner}
                className="w-full py-2.5 rounded-xl bg-[#121826] hover:bg-[#1a2337] text-[#00f5ff] border border-[#00f5ff]/40 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isDownloadingBanner ? 'Generating Banner...' : 'Download X Banner (.PNG)'}</span>
              </button>
            </div>

            {/* Asset 2: Profile Picture (PFP Avatar) */}
            <div className="p-5 rounded-2xl bg-[#07090e] border border-[#1e273d] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#ccff00]">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Profile Picture (PFP)</span>
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 bg-black/60 px-2 py-0.5 rounded border border-[#222]">
                    512 × 512 Square
                  </span>
                </div>

                {/* Avatar Preview */}
                <div className="w-full aspect-[3/1] rounded-xl bg-[#0c1018] border border-[#25324b] flex items-center justify-center gap-4 mb-4 p-2">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.2)] bg-black">
                    {visual.mascot_image_url && !mascotImgError ? (
                      <img src={visual.mascot_image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: visual.mascot_svg || fallbackSvg }} className="w-full h-full" />
                    )}
                  </div>
                  <div className="text-left text-xs font-mono">
                    <div className="font-bold text-white">{cleanTicker} PFP</div>
                    <div className="text-[11px] text-gray-400">High-res transparency</div>
                    <div className="text-[10px] text-[#ccff00] mt-1">Ready for X &amp; Telegram</div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadPfp}
                disabled={isDownloadingPfp}
                className="w-full py-2.5 rounded-xl bg-[#121826] hover:bg-[#1a2337] text-[#ccff00] border border-[#ccff00]/40 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isDownloadingPfp ? 'Generating PFP...' : 'Download Profile Avatar (.PNG)'}</span>
              </button>
            </div>

          </div>

          {/* Secondary Community Memes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            
            {/* Asset 3: Telegram Portal Header */}
            <div className="p-4 rounded-2xl bg-[#07090e] border border-[#1c2438] flex flex-col justify-between text-center">
              <div className="w-full h-24 rounded-xl bg-gradient-to-r from-[#001a2e] to-[#050a14] border border-[#00f5ff]/30 p-2 flex items-center justify-between mb-2">
                <div className="text-left">
                  <div className="text-[8px] font-mono text-[#00f5ff]">TELEGRAM PORTAL</div>
                  <div className="font-mono font-black text-xs text-white">{cleanTicker}</div>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden bg-black shrink-0">
                  {visual.mascot_image_url && !mascotImgError ? (
                    <img src={visual.mascot_image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: visual.mascot_svg || fallbackSvg }} />
                  )}
                </div>
              </div>
              <div className="font-mono font-bold text-xs text-white mb-2">Telegram Header (800×400)</div>
              <button
                type="button"
                onClick={handleDownloadTg}
                disabled={isDownloadingTg}
                className="w-full py-1.5 rounded-lg bg-[#141b2b] hover:bg-[#1c253b] text-gray-200 text-[11px] font-mono font-bold flex items-center justify-center gap-1 border border-[#25324c]"
              >
                <Download className="w-3 h-3 text-[#00f5ff]" />
                <span>Download</span>
              </button>
            </div>

            {/* Asset 4: Breaking News Meme */}
            <div className="p-4 rounded-2xl bg-[#07090e] border border-[#1c2438] flex flex-col justify-between text-center">
              <div className="w-full h-24 rounded-xl bg-gradient-to-b from-[#1a0e0e] to-[#0c0606] border border-red-500/30 p-2 flex flex-col justify-between mb-2 text-center">
                <span className="bg-red-600 text-[8px] font-mono font-bold text-white px-1 py-0.5 rounded uppercase">Breaking News</span>
                <span className="font-mono font-black text-[11px] text-[#ccff00] leading-tight">{cleanTicker} DEPLOYED</span>
                <span className="text-[8px] font-mono text-gray-400">400 TPS SOLANA</span>
              </div>
              <div className="font-mono font-bold text-xs text-white mb-2">Breaking News Meme</div>
              <button
                type="button"
                onClick={handleDownloadBrandingKit}
                className="w-full py-1.5 rounded-lg bg-[#141b2b] hover:bg-[#1c253b] text-gray-200 text-[11px] font-mono font-bold flex items-center justify-center gap-1 border border-[#25324c]"
              >
                <Download className="w-3 h-3 text-[#ccff00]" />
                <span>Download (.ZIP)</span>
              </button>
            </div>

            {/* Asset 5: God Candle Banner */}
            <div className="p-4 rounded-2xl bg-[#07090e] border border-[#1c2438] flex flex-col justify-between text-center">
              <div className="w-full h-24 rounded-xl bg-gradient-to-b from-[#0e1a14] to-[#060c09] border border-[#39ff14]/30 p-2 flex flex-col justify-between mb-2 text-center">
                <span className="bg-[#39ff14]/20 text-[#39ff14] text-[8px] font-mono font-bold px-1 py-0.5 rounded uppercase">God Candle</span>
                <span className="font-mono font-black text-[11px] text-white leading-tight">SOLANA ACTIVE</span>
                <span className="text-[8px] font-mono text-[#39ff14]">100% LP BURNED</span>
              </div>
              <div className="font-mono font-bold text-xs text-white mb-2">God Candle Template</div>
              <button
                type="button"
                onClick={handleDownloadBrandingKit}
                className="w-full py-1.5 rounded-lg bg-[#141b2b] hover:bg-[#1c253b] text-gray-200 text-[11px] font-mono font-bold flex items-center justify-center gap-1 border border-[#25324c]"
              >
                <Download className="w-3 h-3 text-[#00f5ff]" />
                <span>Download (.ZIP)</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ── 5. HOW TO ACQUIRE (NO DIRECT SWAP LINKS - PURE CONTRACT ADDRESS REFERENCE) ── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f5ff]/10 border border-[#00f5ff]/30 text-[#00f5ff] text-xs font-mono font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#39ff14]" />
            <span>DECENTRALIZED ACCESS GUIDE</span>
          </div>
          <h2 className="text-3xl font-mono font-black text-white tracking-tight">
            How to Acquire {cleanTicker}
          </h2>
          <p className="mt-2 text-xs text-gray-400 font-mono">
            Always verify the on-chain mint contract address before interacting with any Solana DEX.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-6 rounded-2xl bg-[#0c1018] border border-[#1c2438] flex flex-col justify-between">
            <div>
              <span className="font-mono font-black text-2xl text-[#00f5ff]">01</span>
              <h3 className="font-mono font-bold text-base text-white mt-2">Create a Solana Wallet</h3>
              <p className="mt-1.5 text-xs text-gray-400 font-sans leading-relaxed">
                Install a non-custodial Solana wallet such as Phantom, Solflare, or Backpack via their official websites or browser extensions.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#182030] text-[11px] font-mono text-gray-400">
              Never share your recovery seed phrase.
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c1018] border border-[#1c2438] flex flex-col justify-between">
            <div>
              <span className="font-mono font-black text-2xl text-[#ccff00]">02</span>
              <h3 className="font-mono font-bold text-base text-white mt-2">Fund Wallet with SOL</h3>
              <p className="mt-1.5 text-xs text-gray-400 font-sans leading-relaxed">
                Acquire SOL on your preferred exchange or bridge and deposit it into your personal non-custodial Solana wallet address.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#182030] text-[11px] font-mono text-gray-400">
              Keep ~0.005 SOL for network transaction fees.
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c1018] border border-[#1c2438] flex flex-col justify-between">
            <div>
              <span className="font-mono font-black text-2xl text-[#00f5ff]">03</span>
              <h3 className="font-mono font-bold text-base text-white mt-2">Paste Official Contract Address</h3>
              <p className="mt-1.5 text-xs text-gray-400 font-sans leading-relaxed">
                Copy the verified Contract Address (CA) below and paste it into your favorite decentralized exchange or wallet swap interface.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyCA}
              className="mt-4 pt-3 border-t border-[#182030] text-[11px] font-mono font-bold text-[#00f5ff] hover:text-[#ccff00] flex items-center justify-between cursor-pointer w-full"
            >
              <span>{copiedCA ? '✓ Address Copied' : 'Copy Verified CA'}</span>
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* ── 6. FREQUENTLY ASKED QUESTIONS (ACCORDION) ── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-mono font-black text-white text-center mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {microFaqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-[#0c1018] border border-[#1c2438] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-mono font-bold text-sm text-white hover:text-[#00f5ff] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#00f5ff] shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-gray-300 font-sans leading-relaxed border-t border-[#182030] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 7. COMPREHENSIVE LEGAL & RISK DISCLAIMERS ── */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="p-6 rounded-2xl bg-[#090d14] border border-[#1b253b] text-left space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#ccff00]" />
            <span>Protocol Notices &amp; Cultural Disclaimers</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-gray-400 leading-relaxed">
            <div className="space-y-1.5 bg-[#06080e] p-3.5 rounded-xl border border-[#141b2a]">
              <div className="font-mono font-bold text-gray-200 text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff]" />
                <span>Meme &amp; Cultural Expression Status</span>
              </div>
              <p>
                {narrative.token_name} ({cleanTicker}) is an experimental, decentralized meme coin created exclusively for cultural entertainment, satire, and community art on Solana. It is not an investment contract, security, currency, or financial product.
              </p>
            </div>

            <div className="space-y-1.5 bg-[#06080e] p-3.5 rounded-xl border border-[#141b2a]">
              <div className="font-mono font-bold text-gray-200 text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]" />
                <span>No Future Profit Expectations</span>
              </div>
              <p>
                Cryptocurrency and meme token markets are volatile. Nothing on this micro-site constitutes financial, legal, or investment advice. Community participants should always do their own research (DYOR) and assume capital risk when participating.
              </p>
            </div>

            <div className="space-y-1.5 bg-[#06080e] p-3.5 rounded-xl border border-[#141b2a]">
              <div className="font-mono font-bold text-gray-200 text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff]" />
                <span>Pre-Flight Verification Architecture</span>
              </div>
              <p>
                Safety verification badges and static bytecode scans represent automated heuristic checks conducted at deployment time, not third-party smart contract certifications or liability assurances.
              </p>
            </div>

            <div className="space-y-1.5 bg-[#06080e] p-3.5 rounded-xl border border-[#141b2a]">
              <div className="font-mono font-bold text-gray-200 text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]" />
                <span>Non-Custodial Decentralization</span>
              </div>
              <p>
                MemeFi OS and its autonomous agents never hold custody of user funds or private keys. All token swaps execute directly through public Solana smart contracts and decentralized liquidity pools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#141b2b] pt-10 pb-16 px-4 text-center text-xs font-mono text-gray-400 space-y-3">
        <div className="flex items-center justify-center gap-2 text-white font-bold">
          <span>{narrative.token_name} ({cleanTicker})</span>
          <span>•</span>
          <span>Deployed on Solana</span>
        </div>
        <p className="max-w-md mx-auto text-gray-400">
          Powered by MemeFi OS Multi-Agent Swarm Infrastructure.
          100% Community Owned • 0% Taxes • Permanent Genesis LP Burn.
        </p>
      </footer>

      {/* ── 7. STICKY BOTTOM QUICK-BUY BAR (MOBILE & DESKTOP) ── */}
      <div className="fixed bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-auto sm:right-6 sm:left-auto z-50 animate-slideUp">
        <div className="p-2 sm:p-2.5 rounded-2xl bg-[#0b0e15]/95 backdrop-blur-md border-2 border-[#26334d] shadow-[0_0_30px_rgba(0,0,0,0.8)] flex items-center justify-between sm:justify-start gap-3 sm:gap-4 max-w-lg mx-auto">
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00f5ff] to-[#ccff00] p-0.5 shrink-0">
              <div className="w-full h-full bg-black rounded-[9px] overflow-hidden flex items-center justify-center">
                {visual.mascot_image_url && !mascotImgError ? (
                  <img src={visual.mascot_image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-mono font-black text-[10px] text-[#00f5ff]">{cleanTicker.slice(1, 3)}</span>
                )}
              </div>
            </div>
            <div className="hidden xs:block">
              <div className="font-mono font-bold text-xs text-white leading-tight">{cleanTicker}</div>
              <div className="font-mono text-[10px] text-[#ccff00]">0% Tax • 100% Burn</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCA}
              className="px-3 py-2 rounded-xl bg-[#151c2a] hover:bg-[#1e273a] text-gray-200 text-xs font-mono font-bold flex items-center gap-1.5 border border-[#27344e] transition-colors cursor-pointer"
            >
              {copiedCA ? <Check className="w-3.5 h-3.5 text-[#ccff00]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCA ? 'Copied' : 'Copy CA'}</span>
            </button>

            <a
              href={dexScreenerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00f5ff] to-[#ccff00] hover:opacity-90 text-black font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,245,255,0.3)] transition-all"
            >
              <BarChart3 className="w-3.5 h-3.5 text-black" />
              <span>DexScreener</span>
            </a>
          </div>

        </div>
      </div>

    </div>
  );
};
