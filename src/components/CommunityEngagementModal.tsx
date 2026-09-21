import React, { useState } from 'react';
import {
  X,
  Radio,
  Calendar,
  Zap,
  Bot,
  Award,
  Twitter,
  Copy,
  Check,
  Send,
  Sparkles,
  Flame,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  Clock,
  Compass,
  ExternalLink,
  Users,
  Target,
  Share2,
  RefreshCw,
  Layers,
  Heart,
  Edit3
} from 'lucide-react';
import { Agent1NarrativeResult, Agent2VisualResult, TokenDeploymentData } from '../types';
import { MascotLoreChatWidget } from './MascotLoreChatWidget';
import { XCommunitySetupWidget } from './XCommunitySetupWidget';

interface CommunityEngagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  narrative?: Agent1NarrativeResult | null;
  visual?: Agent2VisualResult | null;
  deployment?: TokenDeploymentData | null;
  initialTab?: 'schedule' | 'xcommunity' | 'engagement' | 'mascot' | 'milestones';
  onGoToMemeStudio?: () => void;
}

type TabType = 'schedule' | 'xcommunity' | 'engagement' | 'mascot' | 'milestones';
type SeasonNumber = 1 | 2 | 3;
type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export const CommunityEngagementModal: React.FC<CommunityEngagementModalProps> = ({
  isOpen,
  onClose,
  narrative,
  visual,
  deployment,
  initialTab = 'schedule',
  onGoToMemeStudio,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [selectedSeason, setSelectedSeason] = useState<SeasonNumber>(1);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('mon');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Custom User Overrides for Daily Content
  const [customTweets, setCustomTweets] = useState<Record<string, string>>({});
  const [customTgAlerts, setCustomTgAlerts] = useState<Record<string, string>>({});
  const [isEditingDailyTweet, setIsEditingDailyTweet] = useState(false);
  const [isEditingDailyTg, setIsEditingDailyTg] = useState(false);

  if (!isOpen) return null;

  const tokenName = narrative?.token_name || 'Solana Meme Coin';
  const ticker = narrative?.ticker || '$MEME';
  const tagline = narrative?.tagline || 'Community Meme Protocol';
  const lore = narrative?.lore || 'Community token created on Solana.';
  const contractAddress = deployment?.mintAddress || 'SoL11111111111111111111111111111111111111112';

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const battleCryText = `🚀 ${ticker} is sending! "${tagline}"\n\n🎯 Mint CA: ${contractAddress}\n\n#Solana #MemeCoin #WAGMI`;

  // Season descriptions
  const seasonInfo = {
    1: {
      title: 'Season 01: Genesis Ignition',
      subtitle: 'Curve Takeover, Bonding Velocity & Raydium Migration',
      accentColor: '#00f5ff',
      badgeBg: 'bg-[#00f5ff]/10 text-[#00f5ff] border-[#00f5ff]/30',
      objective: 'Fill the 85 SOL bonding curve, reach first 500 holders, secure DexScreener rocket reactions.',
    },
    2: {
      title: 'Season 02: Cult Expansion',
      subtitle: 'Meme Meta Saturation, Viral X Broadcasts & Coingecko Listing',
      accentColor: '#ccff00',
      badgeBg: 'bg-[#ccff00]/10 text-[#ccff00] border-[#ccff00]/30',
      objective: 'Scale to 2,000+ holders, trend #1 on DexScreener, drop daily community meme shards.',
    },
    3: {
      title: 'Season 03: Cultural Hegemony',
      subtitle: 'Autonomous DAO Lore, Global Mobilization & Metaverse Domination',
      accentColor: '#39ff14',
      badgeBg: 'bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14]/30',
      objective: 'Decentralized community DAO takeovers, Tier-1 exchange push, viral cultural folklore.',
    },
  };

  // 7-day schedule definition
  const seasonalSchedules: Record<SeasonNumber, Record<DayOfWeek, {
    dayName: string;
    theme: string;
    tag: string;
    focus: string;
    generateTweet: () => string;
    generateTgAlert: () => string;
    memePromptHint: string;
  }>> = {
    1: {
      mon: {
        dayName: 'Monday',
        theme: 'Genesis Ignition & Fair Launch',
        tag: '🚀 Fair Launch Kickoff',
        focus: 'Announcing 100% fair launch, zero presale, revoked mint authority.',
        generateTweet: () =>
          `🚀 MONDAY GENESIS: ${tokenName} (${ticker}) is officially LIVE on the Solana ClawPump curve!\n\n"${tagline}"\n\n🛡️ 100% Fair Launch • 0% Team Presale • Mint & Freeze Revoked\n🎯 CA: ${contractAddress}\n\nJoin the initial curve wave before the 85 SOL Raydium migration! 🌊\n#Solana #MemeCoin #FairLaunch`,
        generateTgAlert: () =>
          `🚀 <b>GENESIS MONDAY IGNITION: ${ticker}!</b>\n\n${tokenName} has initiated the fair-launch curve.\n\n🛡️ <b>Security:</b> Mint & Freeze Revoked\n📈 <b>Target:</b> 85 SOL Raydium Migration\n\n🎯 <code>${contractAddress}</code>`,
        memePromptHint: 'Centered mascot holding an ignition rocket taking off from a glowing Solana terminal.',
      },
      tue: {
        dayName: 'Tuesday',
        theme: 'Lore Deep Dive & Origin Story',
        tag: '📜 Lore Breakdown',
        focus: 'Unpacking the mascot origin story and cultural satire.',
        generateTweet: () =>
          `📜 LORE TUESDAY: Why was ${tokenName} (${ticker}) created?\n\n"${lore}"\n\nEvery great Solana meta starts with unbreakable narrative resonance. "${tagline}"\n\n💎 Lock in early: ${contractAddress}\n#Solana #CryptoLore #CT`,
        generateTgAlert: () =>
          `📜 <b>ORIGIN STORY UNLOCKED:</b>\n\n${tokenName} lore is spreading across CT. Read the genesis archives and engage the replies!\n\n👇 Join the movement: <code>${contractAddress}</code>`,
        memePromptHint: 'Mascot studying ancient crypto scroll containing parabolic green candles.',
      },
      wed: {
        dayName: 'Wednesday',
        theme: 'Midweek DexScreener Momentum Wave',
        tag: '⚡ DexScreener Surge',
        focus: 'Mobilizing community to rocket react and boost trending score.',
        generateTweet: () =>
          `⚡ WEDNESDAY MOMENTUM SURGE: Sending ${ticker} to the top of DexScreener trending!\n\n1️⃣ Click the link\n2️⃣ Smash 🚀 rocket & 💎 diamond reactions\n3️⃣ Drop "${tagline}" in the comments\n\nMint CA: ${contractAddress}\nLFG 🔥 #Solana #MemeCoin`,
        generateTgAlert: () =>
          `⚡ <b>DEXSCREENER MOMENTUM TARGET DETECTED!</b>\n\nSlam 100 Rocket reactions on ${ticker} right now!\n\n🎯 CA: <code>${contractAddress}</code>`,
        memePromptHint: 'Mascot wearing battle helmet leading an army of diamond-handed degen avatars.',
      },
      thu: {
        dayName: 'Thursday',
        theme: 'Bonding Curve Telemetry & Milestone',
        tag: '📊 Curve Progress Update',
        focus: 'Celebrating SOL progress towards the 85 SOL migration milestone.',
        generateTweet: () =>
          `📊 CURVE UPDATE: ${ticker} is accelerating toward the Raydium liquidity migration!\n\n🔥 SOL Deposited: Climbing fast\n👥 Holders: Growing hourly\n🔒 100% of LP will be burned at migration.\n\n"${tagline}"\nCA: ${contractAddress}\n#Solana #BondingCurve #Raydium`,
        generateTgAlert: () =>
          `📊 <b>BONDING CURVE RADAR UPDATE:</b>\n\n${ticker} liquidity pool is swelling. Next stop: 100% bonded & Raydium LP burn.\n\n🎯 <code>${contractAddress}</code>`,
        memePromptHint: 'Mascot measuring a glowing green progress gauge hitting high voltage.',
      },
      fri: {
        dayName: 'Friday',
        theme: 'God Candle Friday & Weekend Push',
        tag: '🕯️ God Candle Alert',
        focus: 'High-energy meme shard celebration and green candle sentiment.',
        generateTweet: () =>
          `🕯️ GOD CANDLE FRIDAY: Who said the weekend was for sleeping?\n\n${tokenName} (${ticker}) is printing green pillars on the chart. Never fade the narrative!\n\n"${tagline}"\n🎯 Contract: ${contractAddress}\n\nRetweet if you're holding through Valhalla 🛡️ #Solana #GodCandle`,
        generateTgAlert: () =>
          `🕯️ <b>GOD CANDLE FRIDAY SENTIMENT:</b>\n\nGreen candle detected on ${ticker}! Send the broadcast links to all groups.\n\n🎯 <code>${contractAddress}</code>`,
        memePromptHint: 'Gigantic glowing neon green candle towering into the clouds with mascot surfing it.',
      },
      sat: {
        dayName: 'Saturday',
        theme: 'Community Meme Contest & Creative Drop',
        tag: '🎨 Meme Contest',
        focus: 'Engaging users to remix the mascot in Meme Studio.',
        generateTweet: () =>
          `🎨 SATURDAY MEME WARS: Best meme featuring ${tokenName} (${ticker}) wins legendary community recognition!\n\nDrop your creations below using our official mascot. Slogan: "${tagline}"\n\nOfficial CA: ${contractAddress}\nLet the unhinged memes flow 👾 #SolanaMemes #MemeWars`,
        generateTgAlert: () =>
          `🎨 <b>COMMUNITY MEME DROP ACTIVE:</b>\n\nPost your best ${ticker} meme on X and tag the team for retweets!\n\n🎯 <code>${contractAddress}</code>`,
        memePromptHint: 'Mascot spraying neon graffiti art of the token ticker onto a cyberpunk billboard.',
      },
      sun: {
        dayName: 'Sunday',
        theme: 'Weekly Recap & Raydium Countdown',
        tag: '📈 Weekly Recap',
        focus: 'Reviewing holder growth, volume, and setting targets for next week.',
        generateTweet: () =>
          `📈 SUNDAY RECAP: Week 1 of ${tokenName} (${ticker}) was pure electric energy.\n\n✅ 0% Taxes • Fully Audited On-Chain\n✅ Metaplex SPL Token Standard\n✅ Season 1 Genesis Ignition full steam ahead\n\n"${tagline}"\nCA: ${contractAddress}\nReady for week 2? 🚀 #Solana #WeeklyRecap`,
        generateTgAlert: () =>
          `📈 <b>WEEK 1 RECAP COMPLETE:</b>\n\n${ticker} holder base is rock solid. Next week expands the meta!\n\n🎯 <code>${contractAddress}</code>`,
        memePromptHint: 'Mascot resting on top of Solana trophy with sunglasses, watching market cap chart.',
      },
    },
    2: {
      mon: {
        dayName: 'Monday',
        theme: 'Cult Expansion & Raydium Volume',
        tag: '🔥 Multi-DEX Trading',
        focus: 'Transitioning from curve graduation to multi-DEX liquidity.',
        generateTweet: () =>
          `🔥 CULT EXPANSION MONDAY: ${tokenName} (${ticker}) is now trading with burned LP across Raydium & DEXes!\n\nNo dev keys. No inflation. Just pure community velocity.\n"${tagline}"\n\nVerify on Solscan: ${contractAddress}\n#Solana #Raydium #Crypto`,
        generateTgAlert: () =>
          `🔥 <b>SEASON 2 CULT ACTIVATION:</b>\n\n${ticker} is dominating Raydium volume. Join the DexScreener comments!\n\n🎯 <code>${contractAddress}</code>`,
        memePromptHint: 'Mascot leading a massive stadium crowd cheering with ticker banners.',
      },
      tue: {
        dayName: 'Tuesday',
        theme: 'CoinGecko & CoinMarketCap Fast-Track',
        tag: '🦎 CG Listing Push',
        focus: 'Rallying community to submit listing requests and stars.',
        generateTweet: () =>
          `🦎 TRACKING TUESDAY: CoinGecko & CMC submissions are live for ${tokenName} (${ticker})!\n\nStar the token and add to your watchlist.\n\n"${tagline}"\nCA: ${contractAddress}\n#CoinGecko #Solana #WAGMI`,
        generateTgAlert: () =>
          `🦎 <b>COINGECKO WATCHLIST PUSH:</b>\n\nAdd ${ticker} to your CoinGecko watchlist and upvote the bullish rating!\n\n🎯 <code>${contractAddress}</code>`,
        memePromptHint: 'Mascot shaking hands with a friendly gecko wearing neon shades.',
      },
      wed: {
        dayName: 'Wednesday',
        theme: 'Meme Shard Storm & CT Mobilization',
        tag: '🌪️ CT Influencer Reply Wave',
        focus: 'Engaging major crypto Twitter influencer discussions with token memes.',
        generateTweet: () =>
          `🌪️ MOBILIZE TARGET ACQUIRED: Drop ${ticker} meme shards into every major Solana space right now!\n\n"${tagline}"\nThey can't ignore the narrative when the community is everywhere.\n\nCA: ${contractAddress}\n#Solana #AnsemHack`,
        generateTgAlert: () =>
          `🌪️ <b>TWITTER MOMENTUM STORM TRIGGERED:</b>\n\nClick link and reply with mascot meme shard on 5 top crypto accounts!\n\n🎯 <code>${contractAddress}</code>`,
        memePromptHint: 'Mascot hologram projecting across a futuristic cyberpunk metropolis.',
      },
      thu: {
        dayName: 'Thursday',
        theme: 'Holder Milestone & Diamond Hands Spotlight',
        tag: '💎 1,000+ Holders Celebration',
        focus: 'Showcasing on-chain distribution, wallet growth, and zero top-holder dominance.',
        generateTweet: () =>
          `💎 DIAMOND THURSDAY: Over 1,000+ unique wallets now hold ${tokenName} (${ticker})!\n\nZero top-heavy whales. Pure decentralized community ownership.\n\n"${tagline}"\nVerify on-chain: ${contractAddress}\n#Solana #HODL #DiamondHands`,
        generateTgAlert: () =>
          `💎 <b>1,000+ HOLDERS SURPASSED!</b>\n\n${ticker} on-chain distribution is one of the healthiest on Solana. LFG!\n\n🎯 <code>${contractAddress}</code>`,
        memePromptHint: 'Mascot surrounded by sparkling glowing diamonds and on-chain pie chart.',
      },
      fri: {
        dayName: 'Friday',
        theme: 'Weekend Momentum & Meme Drop',
        tag: '🚀 Friday Supercycle Post',
        focus: 'Weekend liquidity setup and viral TikTok/X video hooks.',
        generateTweet: () =>
          `🚀 THE FRIDAY SUPERCYCLE: While other coins fade, ${tokenName} (${ticker}) doubles down.\n\n"${tagline}"\n\nRetweet if ${ticker} is on your weekend trading radar!\nCA: ${contractAddress}\n#Solana #MemeCoinWeekend`,
        generateTgAlert: () =>
          `🚀 <b>WEEKEND MOMENTUM ACCELERATION:</b>\n\nVolume spike incoming on ${ticker}. Keep the chats hyper-active!\n\n🎯 <code>${contractAddress}</code>`,
        memePromptHint: 'Mascot flying a customized Solana spaceship through an asteroid field of green candles.',
      },
      sat: {
        dayName: 'Saturday',
        theme: 'Space / Community Voice Hangout',
        tag: '🎙️ Saturday X Spaces',
        focus: 'Hosting live audio chat on Twitter Spaces discussing narrative evolution.',
        generateTweet: () =>
          `🎙️ SATURDAY SPACES: Tune in to discuss the expansion of ${tokenName} (${ticker}) and season 3 preview!\n\nBring your questions, alpha, and unhinged memes.\n"${tagline}"\n\nCA: ${contractAddress}\n#SolanaSpaces #Crypto`,
        generateTgAlert: () =>
          `🎙️ <b>COMMUNITY SPACES STARTING NOW:</b>\n\nJoin the live voice channel on X and rep ${ticker}!\n\n🎯 <code>${contractAddress}</code>`,
        memePromptHint: 'Mascot speaking into a vintage golden radio broadcast microphone.',
      },
      sun: {
        dayName: 'Sunday',
        theme: 'Season 2 Progress Report',
        tag: '📊 Cult Expansion Report',
        focus: 'Recapping weekly volume, social impressions, and meme submissions.',
        generateTweet: () =>
          `📊 SEASON 2 METRICS: ${tokenName} (${ticker}) weekly summary:\n\n🔥 Social Impressions: 500K+\n👥 Active Mobilizers: 250+\n💎 LP Status: 100% Burned Forever\n\n"${tagline}"\nCA: ${contractAddress}\n#SolanaReport #Crypto`,
        generateTgAlert: () =>
          `📊 <b>SEASON 2 SUMMARY:</b>\n\nImpressive weekly metrics for ${ticker}. Prepare for Season 3 Meta Hegemony!\n\n🎯 <code>${contractAddress}</code>`,
        memePromptHint: 'Mascot sitting at command desk reviewing holographic telemetry dashboards.',
      },
    },
    3: {
      mon: {
        dayName: 'Monday',
        theme: 'Autonomous DAO Lore & Governance',
        tag: '🏛️ DAO Meta Launch',
        focus: 'Empowering community proposals and autonomous lore expansion.',
        generateTweet: () =>
          `🏛️ SEASON 3 HEGEMONY: ${tokenName} (${ticker}) is now a self-sustaining autonomous cultural meta.\n\nNo central leader. The narrative is driven 100% by the collective.\n\n"${tagline}"\nMint CA: ${contractAddress}\n#SolanaDAO #DecentralizedCulture`,
        generateTgAlert: () =>
          `🏛️ <b>AUTONOMOUS DAO INITIATIVE:</b>\n\nCommunity votes on the next seasonal initiative for ${ticker}!\n\n🎯 <code>${contractAddress}</code>`,
        memePromptHint: 'Mascot standing in front of high-tech decentralized senate chamber.',
      },
      tue: {
        dayName: 'Tuesday',
        theme: 'Tier-1 Exchange & Cross-Chain Narrative',
        tag: '🌐 Global Meta Push',
        focus: 'Pitching major CEX listing teams with our audited tokenomics and holder stats.',
        generateTweet: () =>
          `🌐 GLOBAL EXPANSION: ${tokenName} (${ticker}) has proven what community-first decentralization looks like.\n\nAudited • 100% Revoked Authorities • Viral Brand Identity\n"${tagline}"\n\nCA: ${contractAddress}\nTag your favorite CEX to list ${ticker}! 🚀 #CEXListing #Solana`,
        generateTgAlert: () =>
          `🌐 <b>GLOBAL CEX INITIATIVE:</b>\n\nTag Binance, Bybit & OKX with ${ticker} tokenomics stats!\n\n🎯 <code>${contractAddress}</code>`,
        memePromptHint: 'Mascot planting a Solana flag on a futuristic digital globe.',
      },
      wed: {
        dayName: 'Wednesday',
        theme: 'Autonomous AI Mascot Lore Integration',
        tag: '🤖 AI Lore Engine Live',
        focus: 'Showcasing real-time interactive mascot chat and continuous narrative generation.',
        generateTweet: () =>
          `🤖 AUTONOMOUS LORE LIVE: Chat with the official ${tokenName} (${ticker}) Mascot on our micro-site 24/7!\n\nPowered by autonomous LLM personality trained on our lore.\n"${tagline}"\n\nInteract now: ${contractAddress}\n#AIMeme #SolanaAI`,
        generateTgAlert: () =>
          `🤖 <b>AI MASCOT IS LIVE:</b>\n\nTalk to ${ticker} mascot directly on the token micro-site and ask anything about the lore!\n\n🎯 <code>${contractAddress}</code>`,
        memePromptHint: 'Mascot surrounded by glowing neural AI nodes and holographic prompt matrix.',
      },
      thu: {
        dayName: 'Thursday',
        theme: 'IRL Culture & Merch Wave',
        tag: '👕 IRL Cultural Wave',
        focus: 'Community photos, custom stickers, and physical meme drops at crypto events.',
        generateTweet: () =>
          `👕 CULTURAL HEGEMONY: ${tokenName} (${ticker}) is expanding from digital feeds into real-world culture.\n\n"${tagline}"\nSpotted at major Web3 events across the globe.\n\nOfficial Solana CA: ${contractAddress}\n#SolanaIRL #MemeCulture`,
        generateTgAlert: () =>
          `👕 <b>IRL MERCH & STICKER DROP:</b>\n\nDownload high-res sticker packs from Asset Hub and tag photos!\n\n🎯 <code>${contractAddress}</code>`,
        memePromptHint: 'Mascot wearing oversized designer hoodie with token ticker patch in Times Square.',
      },
      fri: {
        dayName: 'Friday',
        theme: 'Mega Momentum Wave & Liquidity Supercharge',
        tag: '⚡ Mega Friday Wave',
        focus: 'Coordinated cross-platform social blitz across X, Telegram, and TikTok.',
        generateTweet: () =>
          `⚡ MEGA MOMENTUM FRIDAY: The ${tokenName} (${ticker}) community never stops executing.\n\n"${tagline}"\n\nDrop a 🚀 below and let's send this candle to outer space!\nContract: ${contractAddress}\n#Solana #Crypto`,
        generateTgAlert: () =>
          `⚡ <b>MEGA MOMENTUM WAVE ENGAGED:</b>\n\nAll community channels coordinated for maximum reach on ${ticker}!\n\n🎯 <code>${contractAddress}</code>`,
        memePromptHint: 'Mascot commanding a thunderous lightning storm illuminating a chart breaking all-time highs.',
      },
      sat: {
        dayName: 'Saturday',
        theme: 'Community Global Hackathon & Creative Showcase',
        tag: '💻 Community Creators Showcase',
        focus: 'Celebrating animations, songs, games, and art created by token holders.',
        generateTweet: () =>
          `💻 COMMUNITY SHOWCASE: Holder-built animations, remix beats, and games for ${tokenName} (${ticker}).\n\nThis is what happens when you build a 100% fair cult.\n"${tagline}"\n\nCA: ${contractAddress}\n#SolanaBuilders #CryptoArt`,
        generateTgAlert: () =>
          `💻 <b>CREATOR SHOWCASE ACTIVE:</b>\n\nUpvote community art and remixes for ${ticker}!\n\n🎯 <code>${contractAddress}</code>`,
        memePromptHint: 'Mascot working on high-tech multi-screen workstation building video games.',
      },
      sun: {
        dayName: 'Sunday',
        theme: 'Eternal Hegemony & Next Season Horizon',
        tag: '👑 Eternal Hegemony',
        focus: 'Consolidating long-term community treasury, narrative canon, and ongoing viral loop.',
        generateTweet: () =>
          `👑 ETERNAL HEGEMONY: ${tokenName} (${ticker}) stands as permanent Solana folklore.\n\nFrom Genesis curve ignition to global cultural meta.\n"${tagline}"\n\nVerified Solana CA: ${contractAddress}\nForever decentralized. 🛡️ #SolanaLegacy #MemeCoin`,
        generateTgAlert: () =>
          `👑 <b>ETERNAL CULTURAL META:</b>\n\n${ticker} is locked into Solana history. The momentum continues every single day!\n\n🎯 <code>${contractAddress}</code>`,
        memePromptHint: 'Mascot crowned on a golden digital throne overlooking a boundless cyber horizon.',
      },
    },
  };

  const dayKey = `${selectedSeason}_${selectedDay}`;
  const currentTemplate = seasonalSchedules[selectedSeason][selectedDay];
  const currentTweet = customTweets[dayKey] !== undefined ? customTweets[dayKey] : currentTemplate.generateTweet();
  const currentTgAlert = customTgAlerts[dayKey] !== undefined ? customTgAlerts[dayKey] : currentTemplate.generateTgAlert();

  const daysList: Array<{ key: DayOfWeek; label: string; short: string }> = [
    { key: 'mon', label: 'Monday', short: 'Mon' },
    { key: 'tue', label: 'Tuesday', short: 'Tue' },
    { key: 'wed', label: 'Wednesday', short: 'Wed' },
    { key: 'thu', label: 'Thursday', short: 'Thu' },
    { key: 'fri', label: 'Friday', short: 'Fri' },
    { key: 'sat', label: 'Saturday', short: 'Sat' },
    { key: 'sun', label: 'Sunday', short: 'Sun' },
  ];

  // Holder Milestones list
  const milestones = [
    {
      holders: 100,
      badge: 'Genesis Seed',
      title: 'First 100 Diamond Holders',
      unlocked: true,
      reward: 'Telegram Voice Space AMA & Genesis Badge Shards',
      tweetTemplate: `💎 MILESTONE UNLOCKED: 100 Diamond-Handed Wallets on ${tokenName} (${ticker})!\n\nThe genesis bonding curve is blazing. Zero presale, 100% fair.\n"${tagline}"\n\nCA: ${contractAddress}\n#Solana #HODL`,
    },
    {
      holders: 500,
      badge: 'Curve Graduation',
      title: '500 Holders & Raydium Migration',
      unlocked: false,
      reward: '100% LP Token Burn Verification & DexScreener Profile Upgrade',
      tweetTemplate: `🌊 500 HOLDERS & RAYDIUM MIGRATION: ${tokenName} (${ticker}) has graduated the bonding curve!\n\n🔥 100% LP Burned forever\n🔒 Audited Metaplex token\n\nCA: ${contractAddress}\n#Raydium #SolanaMigration`,
    },
    {
      holders: 1000,
      badge: 'Cult Velocity',
      title: '1,000+ Unique Cult Holders',
      unlocked: false,
      reward: 'CoinGecko & CoinMarketCap Fast-Track Submission Packet',
      tweetTemplate: `🔥 1,000 HOLDERS SURPASSED: The ${tokenName} (${ticker}) cult is unstoppable!\n\n"${tagline}"\n\nJoin the decentralized community movement: ${contractAddress}\n#Solana #MemeSeason`,
    },
    {
      holders: 2500,
      badge: 'Global Meta',
      title: '2,500+ Holders & Tier-1 CEX Push',
      unlocked: false,
      reward: 'Autonomous DAO Treasury & Global Merch Distribution',
      tweetTemplate: `👑 2,500 HOLDERS: ${tokenName} (${ticker}) is rewriting Solana lore.\n\nTag your favorite CEX to list the official autonomous meme! 🚀\nCA: ${contractAddress}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-5xl max-h-[92vh] bg-[#0c0e15] border-2 border-[#242b3b] rounded-3xl flex flex-col shadow-[0_0_60px_rgba(244,63,94,0.15)] overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-[#1e2433] bg-[#090b10] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#f43f5e] to-[#ccff00] flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black font-mono uppercase text-white tracking-tight">
                  Post-Launch Community Engagement Cockpit
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#f43f5e]/15 border border-[#f43f5e]/30 text-[#f43f5e] text-[10px] font-mono font-bold">
                  {ticker}
                </span>
              </div>
              <p className="text-xs text-[#8e99ac] font-mono hidden sm:block">
                Seasonal content calendar, live community mobilizer, mascot lore agent, and holder rewards
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#141822] hover:bg-[#1e2433] text-[#8e99ac] hover:text-white border border-[#232938] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Sub-Module Navigation Tabs */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-[#1e2433] bg-[#0e121a] flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'schedule'
                ? 'bg-[#1e2433] text-[#ccff00] border border-[#ccff00]/40 shadow-sm'
                : 'text-[#8e99ac] hover:text-white bg-[#12151e] border border-transparent'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#ccff00]" />
            <span>1. Daily Seasonal Calendar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('xcommunity')}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'xcommunity'
                ? 'bg-[#1e2433] text-[#1d9bf0] border border-[#1d9bf0]/40 shadow-sm'
                : 'text-[#8e99ac] hover:text-white bg-[#12151e] border border-transparent'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#1d9bf0]" />
            <span>2. X Community Engine</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('engagement')}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'engagement'
                ? 'bg-[#1e2433] text-[#f43f5e] border border-[#f43f5e]/40 shadow-sm'
                : 'text-[#8e99ac] hover:text-white bg-[#12151e] border border-transparent'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-[#f43f5e]" />
            <span>3. Community Engagement &amp; Slogans</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mascot')}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'mascot'
                ? 'bg-[#1e2433] text-[#00f5ff] border border-[#00f5ff]/40 shadow-sm'
                : 'text-[#8e99ac] hover:text-white bg-[#12151e] border border-transparent'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-[#00f5ff]" />
            <span>4. Mascot Lore AI Agent</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('milestones')}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'milestones'
                ? 'bg-[#1e2433] text-[#39ff14] border border-[#39ff14]/40 shadow-sm'
                : 'text-[#8e99ac] hover:text-white bg-[#12151e] border border-transparent'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-[#39ff14]" />
            <span>5. Holder Milestones &amp; Bounties</span>
          </button>
        </div>

        {/* Modal Main Content Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-5 text-left">
          
          {/* TAB 1: DAILY SEASONAL CALENDAR */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              {/* Season Selection Header */}
              <div className="p-4 rounded-2xl bg-[#121622] border border-[#232938] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-[#ccff00]" />
                    Lifecycle Season Selection:
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {([1, 2, 3] as SeasonNumber[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSeason(s)}
                        className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          selectedSeason === s
                            ? 'bg-[#1e2738] text-white border'
                            : 'bg-[#0e121a] text-[#8e99ac] hover:text-white border border-transparent'
                        }`}
                        style={{
                          borderColor: selectedSeason === s ? seasonInfo[s].accentColor : 'transparent',
                        }}
                      >
                        Season 0{s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs font-mono text-[#8e99ac] flex items-center justify-between pt-1 border-t border-[#1e2433]">
                  <span>{seasonInfo[selectedSeason].title}</span>
                  <span className="text-[#39ff14] text-[11px]">{seasonInfo[selectedSeason].objective}</span>
                </div>
              </div>

              {/* 7-Day Day Selector Bar */}
              <div className="p-1.5 rounded-2xl bg-[#090b10] border border-[#1e2433] flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
                {daysList.map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => setSelectedDay(d.key)}
                    className={`flex-1 py-1.5 px-2.5 rounded-xl font-mono text-xs transition-all cursor-pointer text-center whitespace-nowrap ${
                      selectedDay === d.key
                        ? 'bg-[#182030] text-[#ccff00] font-black border border-[#ccff00]/40 shadow-sm'
                        : 'text-[#8e99ac] hover:text-white bg-transparent'
                    }`}
                  >
                    {d.short}
                  </button>
                ))}
              </div>

              {/* Daily Post Focus */}
              <div className="p-4 rounded-2xl bg-[#121622] border border-[#232938] space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] font-bold uppercase">
                    {currentTemplate.dayName} • {currentTemplate.tag}
                  </span>
                  <span className="text-white/80 font-bold">{currentTemplate.theme}</span>
                </div>
                <p className="text-xs text-[#8e99ac] font-sans">
                  <strong>Content Strategy:</strong> {currentTemplate.focus}
                </p>
              </div>

              {/* Twitter Post Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#10141f] border border-[#232938] space-y-3">
                <div className="flex flex-wrap items-center justify-between border-b border-[#1e2433] pb-2.5 gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1d9bf0]">
                    <Twitter className="w-4 h-4" />
                    <span>Formatted X / Twitter Post</span>
                    <button
                      type="button"
                      onClick={() => setIsEditingDailyTweet(!isEditingDailyTweet)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                        isEditingDailyTweet
                          ? 'bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/40 font-bold'
                          : 'text-slate-400 hover:text-white bg-[#141824] border border-[#2d354a]'
                      }`}
                      title="Edit tweet text before posting"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>{isEditingDailyTweet ? 'Done Editing' : 'Edit Text'}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyText(currentTweet, 'tweet')}
                      className="px-3 py-1 rounded-lg bg-[#181d28] hover:bg-[#232938] text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-[#2d3139]"
                    >
                      {copiedKey === 'tweet' ? <Check className="w-3.5 h-3.5 text-[#39ff14]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'tweet' ? 'Copied' : 'Copy'}</span>
                    </button>
                    <a
                      href={`https://x.com/intent/tweet?text=${encodeURIComponent(currentTweet)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1 rounded-lg bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-[0_0_10px_rgba(29,155,240,0.3)]"
                      title="Publish to X feed"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>🔥 Blast to Feed ↗</span>
                    </a>
                  </div>
                </div>

                {isEditingDailyTweet ? (
                  <div className="space-y-2 bg-[#0d111a] p-3 rounded-xl border border-[#ccff00]/30 animate-fadeIn">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#ccff00]">
                      <span className="font-bold">Creator Override Active:</span>
                      <span className="text-slate-400">Add custom memes, CT hashtags, or alpha</span>
                    </div>
                    <textarea
                      rows={4}
                      value={currentTweet}
                      onChange={(e) => {
                        setCustomTweets({ ...customTweets, [dayKey]: e.target.value });
                      }}
                      className="w-full bg-[#050608] border border-[#2d3139] focus:border-[#ccff00] rounded-lg p-2.5 text-xs text-white font-mono outline-none leading-relaxed"
                      placeholder="Type custom daily tweet..."
                    />
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-[#090b10] border border-[#1e2433] font-sans text-xs sm:text-sm text-white leading-relaxed whitespace-pre-wrap select-all">
                    {currentTweet}
                  </div>
                )}
              </div>

              {/* Telegram Alert Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#10141f] border border-[#232938] space-y-3">
                <div className="flex flex-wrap items-center justify-between border-b border-[#1e2433] pb-2.5 gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0088cc]">
                    <MessageSquare className="w-4 h-4" />
                    <span>Telegram Channel Broadcast Alert</span>
                    <button
                      type="button"
                      onClick={() => setIsEditingDailyTg(!isEditingDailyTg)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                        isEditingDailyTg
                          ? 'bg-[#00f5ff]/20 text-[#00f5ff] border border-[#00f5ff]/40 font-bold'
                          : 'text-slate-400 hover:text-white bg-[#141824] border border-[#2d354a]'
                      }`}
                      title="Edit telegram HTML alert before copying"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>{isEditingDailyTg ? 'Done Editing' : 'Edit Text'}</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText(currentTgAlert, 'tg')}
                    className="px-3 py-1 rounded-lg bg-[#181d28] hover:bg-[#232938] text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-[#2d3139]"
                  >
                    {copiedKey === 'tg' ? <Check className="w-3.5 h-3.5 text-[#39ff14]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'tg' ? 'Copied HTML' : 'Copy HTML Alert'}</span>
                  </button>
                </div>

                {isEditingDailyTg ? (
                  <div className="space-y-2 bg-[#0d111a] p-3 rounded-xl border border-[#00f5ff]/30 animate-fadeIn">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#00f5ff]">
                      <span className="font-bold">Telegram HTML Override:</span>
                      <span className="text-slate-400">Supports &lt;b&gt;, &lt;i&gt;, &lt;code&gt; tags</span>
                    </div>
                    <textarea
                      rows={4}
                      value={currentTgAlert}
                      onChange={(e) => {
                        setCustomTgAlerts({ ...customTgAlerts, [dayKey]: e.target.value });
                      }}
                      className="w-full bg-[#050608] border border-[#2d3139] focus:border-[#00f5ff] rounded-lg p-2.5 text-xs text-[#00f5ff] font-mono outline-none leading-relaxed"
                      placeholder="Type custom telegram alert..."
                    />
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-[#090b10] border border-[#1e2433] font-mono text-xs text-[#00f5ff] leading-relaxed whitespace-pre-wrap select-all">
                    {currentTgAlert}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: X COMMUNITY SETUP ENGINE */}
          {activeTab === 'xcommunity' && (
            <div className="animate-fadeIn">
              <XCommunitySetupWidget
                tokenName={tokenName}
                ticker={ticker}
                tagline={tagline}
                lore={lore}
                contractAddress={contractAddress}
              />
            </div>
          )}

          {/* TAB 3: COMMUNITY ENGAGEMENT & SLOGANS */}
          {activeTab === 'engagement' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#121622] border border-[#232938] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-[#f43f5e]" />
                    <h3 className="font-mono font-bold text-sm text-white uppercase">
                      Community Engagement &amp; Sentiment Objectives
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#39ff14]/15 border border-[#39ff14]/30 text-[#39ff14] text-[10px] font-mono font-bold">
                    ACTIVE SPRINT
                  </span>
                </div>
                <p className="text-xs text-[#8e99ac] font-sans leading-relaxed">
                  Coordinate social momentum and authentic sentiment across Crypto Twitter, X Communities, and DexScreener to maximize {ticker} organic reach.
                </p>

                {/* 1-Click Launchers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <a
                    href={`https://x.com/intent/tweet?text=${encodeURIComponent(battleCryText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#1d9bf0]/15 hover:bg-[#1d9bf0]/25 text-[#1d9bf0] border border-[#1d9bf0]/30 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                  >
                    <Twitter className="w-4 h-4" />
                    <span>Launch Twitter Community Broadcast</span>
                  </a>

                  <a
                    href={`https://pump.fun/coin/${contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#ccff00]/15 hover:bg-[#ccff00]/25 text-[#ccff00] border border-[#ccff00]/30 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Pump.fun Bonding Pool</span>
                  </a>
                </div>
              </div>

              {/* Slogan & Battle Cry Arsenal */}
              <div className="p-5 rounded-2xl bg-[#10141f] border border-[#232938] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#ccff00]" />
                    Official Community Battle-Cry &amp; Copy Shards
                  </span>
                  <span className="text-[10px] font-mono text-[#8e99ac]">Ready for Discord/TG Drops</span>
                </div>

                <div className="space-y-2">
                  <div className="p-3.5 rounded-xl bg-[#090b10] border border-[#1e2433] flex items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">Primary Battle Cry</div>
                      <div className="text-xs text-[#00f5ff] font-mono truncate">{battleCryText}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyText(battleCryText, 'cry')}
                      className="px-3 py-1.5 rounded-lg bg-[#181d28] hover:bg-[#232938] text-white text-xs font-mono flex items-center gap-1.5 shrink-0 cursor-pointer border border-[#2d3139]"
                    >
                      {copiedKey === 'cry' ? <Check className="w-3.5 h-3.5 text-[#39ff14]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'cry' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#090b10] border border-[#1e2433] flex items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="text-xs font-bold text-white">DexScreener Comment Shard</div>
                      <div className="text-xs text-[#8e99ac] font-mono truncate">
                        "🚀 {ticker} sending to Valhalla! 100% fair launch, zero presale. {tagline}"
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyText(`🚀 ${ticker} sending to Valhalla! 100% fair launch, zero presale. "${tagline}" | CA: ${contractAddress}`, 'dex')}
                      className="px-3 py-1.5 rounded-lg bg-[#181d28] hover:bg-[#232938] text-white text-xs font-mono flex items-center gap-1.5 shrink-0 cursor-pointer border border-[#2d3139]"
                    >
                      {copiedKey === 'dex' ? <Check className="w-3.5 h-3.5 text-[#39ff14]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'dex' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MASCOT LORE AI AGENT */}
          {activeTab === 'mascot' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#121622] border border-[#232938] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                    <Bot className="w-4 h-4 text-[#00f5ff]" />
                    <span>Live Autonomous Mascot Lore Agent</span>
                  </h3>
                  <p className="text-xs text-[#8e99ac] font-sans">
                    Test how your mascot responds to community lore questions before linking it to Telegram bots.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-[#00f5ff]/10 border border-[#00f5ff]/30 text-[#00f5ff] text-xs font-mono font-bold">
                  24/7 AI Ready
                </span>
              </div>

              {/* Embedded Chat Widget */}
              <div className="rounded-2xl bg-[#090b10] border border-[#1e2433] overflow-hidden p-2">
                <MascotLoreChatWidget
                  narrative={narrative}
                  visual={visual}
                  tokenDeployment={deployment}
                />
              </div>
            </div>
          )}

          {/* TAB 4: HOLDER MILESTONES & BOUNTIES */}
          {activeTab === 'milestones' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#121622] border border-[#232938] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#39ff14]" />
                    <span>On-Chain Holder Progression &amp; Community Bounties</span>
                  </h3>
                  <p className="text-xs text-[#8e99ac] font-sans">
                    Automated celebration templates and community rewards for each wallet milestone.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#10141f] border border-[#232938] space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-[#39ff14]/15 border border-[#39ff14]/30 text-[#39ff14]">
                          {m.badge}
                        </span>
                        <span className="text-xs font-mono font-bold text-white">
                          {m.holders} Holders
                        </span>
                      </div>

                      <h4 className="text-sm font-bold font-mono text-white">{m.title}</h4>
                      <p className="text-xs text-[#8e99ac] font-sans">
                        <strong>Reward:</strong> {m.reward}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#1e2433] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => copyText(m.tweetTemplate, `milestone-${idx}`)}
                        className="px-3 py-1.5 rounded-lg bg-[#181d28] hover:bg-[#232938] text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-[#2d3139]"
                      >
                        {copiedKey === `milestone-${idx}` ? <Check className="w-3.5 h-3.5 text-[#39ff14]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === `milestone-${idx}` ? 'Copied Post' : 'Copy Post'}</span>
                      </button>

                      <a
                        href={`https://x.com/intent/tweet?text=${encodeURIComponent(m.tweetTemplate)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Post</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer Bar */}
        <div className="p-4 sm:p-5 border-t border-[#1e2433] bg-[#090b10] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs font-mono text-[#8e99ac] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#39ff14]" />
            <span>Community Cockpit dynamically bound to {tokenName} ({ticker})</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onGoToMemeStudio && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoToMemeStudio();
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#141822] hover:bg-[#1e2433] text-[#00f5ff] border border-[#00f5ff]/30 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Edit Visual Shards in Meme Studio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
