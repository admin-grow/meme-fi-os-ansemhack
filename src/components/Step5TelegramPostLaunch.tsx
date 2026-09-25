import React, { useState, useMemo } from 'react';
import { Agent1NarrativeResult, Agent2VisualResult, Agent3TelegramResult, TokenDeploymentData, RaidEventType } from '../types';
import {
  Send,
  Twitter,
  Copy,
  Check,
  ExternalLink,
  Bot,
  MessageSquare,
  Flame,
  CheckCircle,
  RefreshCw,
  Zap,
  Bell,
  Globe,
  Download,
  FolderDown,
  Sparkles,
  Layers,
  Eye,
  X,
  Shield,
  Clock,
  Heart,
  Users,
  Scale,
  ShieldCheck,
  Edit3,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Plus,
  ArrowRight,
  Sparkle,
  Radio,
  Share2,
  Save,
} from 'lucide-react';
import { SocialComplianceScannerBadge } from './SocialComplianceScannerBadge';
import {
  downloadCompleteBrandingKitZip,
  generateProfileAvatarBlob,
  generateTwitterBannerBlob,
  generateMemeShardBlob,
} from '../socialSuiteGenerator';
import { SwarmDefenseCockpit } from './SwarmDefenseCockpit';
import { XCommunitySetupWidget } from './XCommunitySetupWidget';
import { auditContentAuthenticity } from '../utils/authenticityEngine';
import { AuthenticityVerificationBadge } from './AuthenticityVerificationBadge';
import { NarrativeRoadmap } from './NarrativeRoadmap';

export type CockpitStation = 'mobilize' | 'guardian' | 'narrative' | 'brand';

interface Step5TelegramPostLaunchProps {
  narrative: Agent1NarrativeResult;
  visual?: Agent2VisualResult;
  telegram: Agent3TelegramResult;
  deployment: TokenDeploymentData | null;
  onRefreshRaid: (eventType: RaidEventType) => Promise<void>;
  isRefreshingRaid: boolean;
  onOpenMicroSite?: () => void;
  onReturnToMemeStudio?: () => void;
  activeStation?: CockpitStation;
  onChangeStation?: (station: CockpitStation) => void;
  onLaunchNewCoin?: () => void;
  onViewGenesis?: () => void;
}

const EVENT_TYPES: { id: RaidEventType; label: string }[] = [
  { id: 'Token Launch', label: 'Token Launch' },
  { id: 'Green Candle Spike', label: 'Green Candle Spike' },
  { id: 'Milestone Hit', label: 'Milestone Reached' },
  { id: 'Twitter Mobilization', label: 'Social Momentum' },
];

export const Step5TelegramPostLaunch: React.FC<Step5TelegramPostLaunchProps> = ({
  narrative,
  visual,
  telegram,
  deployment,
  onRefreshRaid,
  isRefreshingRaid,
  onOpenMicroSite,
  onReturnToMemeStudio,
  activeStation,
  onChangeStation,
  onLaunchNewCoin,
  onViewGenesis,
}) => {
  // Station State
  const [internalStation, setInternalStation] = useState<CockpitStation>('mobilize');
  const currentStation = activeStation || internalStation;

  const handleStationSelect = (station: CockpitStation) => {
    if (onChangeStation) {
      onChangeStation(station);
    } else {
      setInternalStation(station);
    }
  };

  // Sub-section state within Mobilization Station (defaults to launch tweets with live CA)
  const [mobilizeSubSection, setMobilizeSubSection] = useState<'tweets' | 'telegram' | 'xcommunity' | 'cron'>('tweets');

  // Origin Lore (Short Version) collapsible drawer
  const [showOriginLore, setShowOriginLore] = useState(false);

  const [copiedCA, setCopiedCA] = useState(false);
  const [copiedTweetIdx, setCopiedTweetIdx] = useState<number | null>(null);
  const [copiedMetadata, setCopiedMetadata] = useState(false);
  const [isDownloadingAvatar, setIsDownloadingAvatar] = useState(false);
  const [isDownloadingBanner, setIsDownloadingBanner] = useState(false);
  const [isDownloadingMeme1, setIsDownloadingMeme1] = useState(false);
  const [isDownloadingMeme2, setIsDownloadingMeme2] = useState(false);
  const [isDownloadingMetadata, setIsDownloadingMetadata] = useState(false);

  const [selectedEventType, setSelectedEventType] = useState<RaidEventType>('Token Launch');
  const [telegramConnected, setTelegramConnected] = useState(false);
  
  // 3 Project Social Handles State (Inherited from Step 4 Deployment & Persisted in localStorage)
  const defaultTwitterHandle = `@${narrative.ticker.replace('$', '')}_sol`;
  const defaultTelegramHandle = `t.me/${narrative.ticker.replace('$', '')}_portal`;
  const defaultWebsiteUrl = `https://${narrative.ticker.replace('$', '').toLowerCase()}.meme`;

  const [twitterHandle, setTwitterHandle] = useState<string>(() => {
    return (
      deployment?.socialLinks?.twitter ||
      localStorage.getItem(`memefi_x_${narrative.ticker}`) ||
      defaultTwitterHandle
    );
  });
  const [telegramHandle, setTelegramHandle] = useState<string>(() => {
    return (
      deployment?.socialLinks?.telegram ||
      localStorage.getItem(`memefi_tg_${narrative.ticker}`) ||
      defaultTelegramHandle
    );
  });
  const [websiteUrl, setWebsiteUrl] = useState<string>(() => {
    return (
      deployment?.socialLinks?.website ||
      localStorage.getItem(`memefi_web_${narrative.ticker}`) ||
      defaultWebsiteUrl
    );
  });
  const [handlesSaved, setHandlesSaved] = useState(false);

  const [channelInput, setChannelInput] = useState(() => {
    return (
      deployment?.socialLinks?.telegram ||
      localStorage.getItem(`memefi_tg_${narrative.ticker}`) ||
      defaultTelegramHandle
    );
  });

  const handleSaveSocialHandles = () => {
    localStorage.setItem(`memefi_x_${narrative.ticker}`, twitterHandle);
    localStorage.setItem(`memefi_tg_${narrative.ticker}`, telegramHandle);
    localStorage.setItem(`memefi_web_${narrative.ticker}`, websiteUrl);
    setChannelInput(telegramHandle);
    setHandlesSaved(true);
    setTimeout(() => setHandlesSaved(false), 2500);
  };
  const [isSendingAlert, setIsSendingAlert] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertMeta, setAlertMeta] = useState<any>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);
  const [isTestingCron, setIsTestingCron] = useState(false);
  const [cronExecutionResult, setCronExecutionResult] = useState<any>(null);
  const [copiedGcloud, setCopiedGcloud] = useState(false);

  // User Custom Edit & Provenance Tracking
  const [isCustomEditing, setIsCustomEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState<string>(telegram.telegram_message);

  // Custom User Override for Launch Tweets
  const [editableTweets, setEditableTweets] = useState<string[]>(() => {
    return (narrative.tweet_pack && narrative.tweet_pack.length > 0)
      ? [...narrative.tweet_pack]
      : [
          `🚀 $${narrative.ticker.replace('$', '')} is officially live on Solana via ClawPump!`,
          `The origin narrative is sealed. Conviction starts now.`,
          `Join the community before the god candle strikes.`
        ];
  });
  const [editingTweetIdx, setEditingTweetIdx] = useState<number | null>(null);

  const contractAddress = deployment?.mintAddress || '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsypump';

  const activeMessage = isCustomEditing ? editedMessage : telegram.telegram_message;

  // Compute live provenance audit
  const authenticityAudit = useMemo(() => {
    return auditContentAuthenticity({
      text: activeMessage.replace(/<[^>]*>?/gm, ''),
      isUserModified: isCustomEditing,
      contractAddress,
    });
  }, [activeMessage, isCustomEditing, contractAddress]);

  const handleCopyTweetWithCA = (tweetText: string, idx: number) => {
    const socialLine = [
      twitterHandle ? `𝕏 ${twitterHandle}` : '',
      telegramHandle ? `✈️ ${telegramHandle}` : '',
      websiteUrl ? `🌐 ${websiteUrl.replace(/^https?:\/\//, '')}` : ''
    ].filter(Boolean).join(' | ');

    const fullTweet = `${tweetText}\n\n$${narrative.ticker.replace('$', '')} CA:\n${contractAddress}${socialLine ? `\n\n${socialLine}` : ''}\n\n📈 Chart: https://dexscreener.com/solana/${contractAddress}`;
    navigator.clipboard.writeText(fullTweet);
    setCopiedTweetIdx(idx);
    setTimeout(() => setCopiedTweetIdx(null), 2000);
  };

  const handleDownloadAvatar = async () => {
    try {
      setIsDownloadingAvatar(true);
      const blob = await generateProfileAvatarBlob({
        tokenName: narrative.token_name,
        ticker: narrative.ticker,
        tagline: narrative.tagline,
        lore: narrative.lore,
        mascotSvg: visual?.mascot_svg,
        mascotImageUrl: visual?.mascot_image_url,
        contractAddress,
      });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${narrative.ticker.replace('$', '')}_Profile_Avatar_512.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error('Failed to download avatar:', err);
    } finally {
      setIsDownloadingAvatar(false);
    }
  };

  const handleDownloadBanner = async () => {
    try {
      setIsDownloadingBanner(true);
      const blob = await generateTwitterBannerBlob({
        tokenName: narrative.token_name,
        ticker: narrative.ticker,
        tagline: narrative.tagline,
        lore: narrative.lore,
        mascotSvg: visual?.mascot_svg,
        mascotImageUrl: visual?.mascot_image_url,
        contractAddress,
      });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${narrative.ticker.replace('$', '')}_Twitter_Banner_1500x500.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error('Failed to download banner:', err);
    } finally {
      setIsDownloadingBanner(false);
    }
  };

  const handleDownloadSvg = () => {
    if (!visual?.mascot_svg) return;
    const blob = new Blob([visual.mascot_svg], { type: 'image/svg+xml;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${narrative.ticker.replace('$', '')}_Mascot_Vector.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  };

  const handleCopyMetadataJson = () => {
    const meta = JSON.stringify(
      {
        name: narrative.token_name,
        symbol: narrative.ticker.replace('$', ''),
        description: `${narrative.tagline} — ${narrative.lore}`,
        image: visual?.mascot_image_url || 'ipfs://...',
        external_url: websiteUrl,
        socials: {
          twitter: twitterHandle.startsWith('@') ? `https://x.com/${twitterHandle.slice(1)}` : twitterHandle,
          telegram: telegramHandle.startsWith('@') ? `https://t.me/${telegramHandle.slice(1)}` : telegramHandle,
          website: websiteUrl,
        },
        attributes: [
          { trait_type: 'Viral Score', value: narrative.viral_score },
          { trait_type: 'Bonding Curve', value: 'ClawPump v2' },
          { trait_type: 'Network', value: deployment?.solanaNetwork || 'Solana Mainnet' },
          { trait_type: 'Twitter', value: twitterHandle },
          { trait_type: 'Telegram', value: telegramHandle },
        ],
        properties: {
          category: 'image',
          files: [{ uri: visual?.mascot_image_url || '', type: 'image/png' }],
          creators: [{ address: deployment?.deployerWallet || contractAddress, share: 100 }],
        },
      },
      null,
      2
    );
    navigator.clipboard.writeText(meta);
    setCopiedMetadata(true);
    setTimeout(() => setCopiedMetadata(false), 2000);
  };

  const handleDownloadMetadataJson = () => {
    setIsDownloadingMetadata(true);
    try {
      const meta = JSON.stringify(
        {
          name: narrative.token_name,
          symbol: narrative.ticker.replace('$', ''),
          description: `${narrative.tagline} — ${narrative.lore}`,
          contract_address: contractAddress,
          image: visual?.mascot_image_url || 'ipfs://...',
          external_url: websiteUrl,
          socials: {
            twitter: twitterHandle.startsWith('@') ? `https://x.com/${twitterHandle.slice(1)}` : twitterHandle,
            telegram: telegramHandle.startsWith('@') ? `https://t.me/${telegramHandle.slice(1)}` : telegramHandle,
            website: websiteUrl,
          },
          attributes: [
            { trait_type: 'Viral Score', value: narrative.viral_score },
            { trait_type: 'Bonding Curve', value: 'ClawPump v2' },
            { trait_type: 'Network', value: deployment?.solanaNetwork || 'Solana Mainnet' },
            { trait_type: 'Twitter', value: twitterHandle },
            { trait_type: 'Telegram', value: telegramHandle },
          ],
          properties: {
            category: 'image',
            files: [{ uri: visual?.mascot_image_url || '', type: 'image/png' }],
            creators: [{ address: deployment?.deployerWallet || contractAddress, share: 100 }],
          },
        },
        null,
        2
      );
      const blob = new Blob([meta], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${narrative.ticker.replace('$', '')}_OnChain_Metadata.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download metadata JSON:', e);
    } finally {
      setTimeout(() => setIsDownloadingMetadata(false), 500);
    }
  };

  const handleDownloadSingleMeme = async (template: 'Breaking News' | 'God Candle') => {
    if (template === 'Breaking News') setIsDownloadingMeme1(true);
    else setIsDownloadingMeme2(true);

    try {
      const blob = await generateMemeShardBlob(
        {
          tokenName: narrative.token_name,
          ticker: narrative.ticker,
          tagline: narrative.tagline,
          lore: narrative.lore,
          mascotSvg: visual?.mascot_svg,
          mascotImageUrl: visual?.mascot_image_url,
          contractAddress,
        },
        template === 'Breaking News' ? 'Breaking News' : 'Solana Momentum',
        template === 'Breaking News' ? 'BREAKING: GOD CANDLE IMMINENT' : 'SOLANA BREAKOUT IN PROGRESS',
        template === 'Breaking News'
          ? `Whales spotted accumulating ${narrative.ticker}`
          : `Sending ${narrative.ticker} to the moon!`
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${narrative.ticker.replace('$', '')}_${template === 'Breaking News' ? 'BREAKING_NEWS' : 'GOD_CANDLE'}_Meme.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download meme shard:', e);
    } finally {
      setIsDownloadingMeme1(false);
      setIsDownloadingMeme2(false);
    }
  };

  const socialLine = [
    twitterHandle ? `𝕏 ${twitterHandle}` : '',
    telegramHandle ? `✈️ ${telegramHandle}` : '',
    websiteUrl ? `🌐 ${websiteUrl.replace(/^https?:\/\//, '')}` : ''
  ].filter(Boolean).join(' | ');

  const primaryLaunchTweetText = (narrative.tweet_pack && narrative.tweet_pack[0])
    ? `${narrative.tweet_pack[0]}\n\n$${narrative.ticker.replace('$', '')} Official CA:\n${contractAddress}${socialLine ? `\n\n${socialLine}` : ''}\n\n📈 Live Chart: https://dexscreener.com/solana/${contractAddress}`
    : `🚀 $${narrative.ticker.replace('$', '')} is officially live on Solana via ClawPump!\n\nOfficial CA:\n${contractAddress}${socialLine ? `\n\n${socialLine}` : ''}\n\n📈 Live Chart: https://dexscreener.com/solana/${contractAddress}`;
  const primaryLaunchTweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(primaryLaunchTweetText)}`;

  const gcloudCommand = `gcloud scheduler jobs create http ${narrative.ticker.replace('$', '').toLowerCase()}-auto-dispatch \\
  --location=us-central1 \\
  --schedule="0 */2 * * *" \\
  --uri="${window.location.origin}/api/cron/autonomous-mobilize" \\
  --http-method=POST \\
  --headers="Content-Type=application/json,Authorization=Bearer memefi-secret-cron-token" \\
  --message-body='{"ticker":"${narrative.ticker}","token_name":"${narrative.token_name}","contract_address":"${contractAddress}","telegram_channel":"${channelInput}"}'`;

  const handleCopyGcloud = () => {
    navigator.clipboard.writeText(gcloudCommand);
    setCopiedGcloud(true);
    setTimeout(() => setCopiedGcloud(false), 2500);
  };

  const handleTestAutonomousCron = async () => {
    setIsTestingCron(true);
    setCronExecutionResult(null);
    try {
      const res = await fetch('/api/cron/autonomous-mobilize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer memefi-secret-cron-token',
        },
        body: JSON.stringify({
          ticker: narrative.ticker,
          token_name: narrative.token_name,
          contract_address: contractAddress,
          telegram_channel: channelInput,
          event_type: 'Autonomous Green Candle Spike (Cron Test)',
        }),
      });
      const data = await res.json();
      setCronExecutionResult(data);
    } catch (err: any) {
      setCronExecutionResult({
        success: false,
        error: err?.message || 'Failed to trigger cron test.',
      });
    } finally {
      setIsTestingCron(false);
    }
  };

  const handleCopyCA = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopiedCA(true);
    setTimeout(() => setCopiedCA(false), 2000);
  };

  const handleEventChange = async (event: RaidEventType) => {
    setSelectedEventType(event);
    await onRefreshRaid(event);
  };

  const handleDownloadBrandingKit = async () => {
    setIsDownloadingZip(true);
    setZipSuccess(false);
    try {
      await downloadCompleteBrandingKitZip({
        tokenName: narrative.token_name,
        ticker: narrative.ticker,
        tagline: narrative.tagline,
        lore: narrative.lore,
        mascotSvg: visual?.mascot_svg,
        mascotImageUrl: visual?.mascot_image_url,
        styleName: visual?.visual_elements?.background_style,
        contractAddress,
      });
      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate ZIP kit:', err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const handleSendTelegramAlert = async () => {
    setIsSendingAlert(true);
    setAlertSuccess(false);
    try {
      const res = await fetch('/api/telegram-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel_id: channelInput,
          message: activeMessage,
          ticker: narrative.ticker,
          provenance: authenticityAudit.source,
          truth_score: authenticityAudit.truthScore,
        }),
      });
      const data = await res.json();
      setAlertMeta(data);
      setAlertSuccess(true);
      setTelegramConnected(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingAlert(false);
    }
  };

  // Build the official Submission Tweet formatted for @MemeFi_OS and @clawpumptech
  const submissionTweetText = `🚀 Just launched ${narrative.token_name} (${narrative.ticker}) via @clawpumptech for #AnsemHack!

"${narrative.tagline}"

🎯 Mint CA: ${contractAddress}
⚡ 100% Pure Vibe-Coded on Solana
💎 Autonomous Conviction Guardian & Visual Mascot generated with @MemeFi_OS

@MemeFi_OS @clawpumptech #Solana #MemeCoin #AnsemHack`;

  const submissionTweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(submissionTweetText)}`;

  return (
    <div className="w-full space-y-5 animate-fadeIn">
      {/* 1. TOP COCKPIT HUD CARD */}
      <div className="bg-[#12141a] border border-[#2d3139] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#2d3139]">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f5ff] to-[#39ff14] p-0.5 shadow-[0_0_20px_rgba(0,245,255,0.25)] shrink-0">
              <div className="w-full h-full bg-[#0a0b0d] rounded-[10px] flex items-center justify-center">
                <Radio className="w-5 h-5 text-[#00f5ff] animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold font-mono text-white tracking-wider uppercase">
                  Community Dashboard
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#39ff14]/15 text-[#39ff14] border border-[#39ff14]/40 rounded uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-ping"></span>
                  Live
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs font-mono">
                <span className="font-bold text-white">{narrative.token_name}</span>
                <span className="font-bold text-[#ccff00] px-2 py-0.5 rounded bg-[#ccff00]/10 border border-[#ccff00]/30">
                  {narrative.ticker}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {onReturnToMemeStudio && (
              <button
                type="button"
                onClick={onReturnToMemeStudio}
                className="py-2 px-3 rounded-lg bg-[#00f5ff] hover:bg-[#b2faff] text-black font-bold text-xs uppercase font-mono flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(0,245,255,0.25)] transition-transform hover:scale-105 cursor-pointer"
                title="Return to Step 2 to generate new memes, custom captions, or fresh banners"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Meme Studio (Step 2)</span>
              </button>
            )}

            {onOpenMicroSite && (
              <button
                type="button"
                onClick={onOpenMicroSite}
                className="py-2 px-3 rounded-lg bg-[#ccff00] hover:bg-[#e0ff4f] text-black font-bold text-xs uppercase font-mono flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(204,255,0,0.2)] transition-transform hover:scale-105 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Micro-Site</span>
              </button>
            )}

            <a
              href={submissionTweetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-lg bg-[#1a1d24] hover:bg-[#2d3139] text-[#00f5ff] border border-[#00f5ff]/40 font-bold text-xs uppercase font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Twitter className="w-3.5 h-3.5" />
              <span>Post on X</span>
            </a>

            {onLaunchNewCoin && (
              <button
                type="button"
                onClick={onLaunchNewCoin}
                className="py-2 px-3 rounded-lg bg-[#1a1d24] hover:bg-[#2d3139] text-[#ccff00] border border-[#ccff00]/40 font-mono text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Token</span>
              </button>
            )}

            {onViewGenesis && (
              <button
                type="button"
                onClick={onViewGenesis}
                className="py-2 px-2.5 rounded-lg bg-[#141720] hover:bg-[#1a1f2c] text-[#8e99ac] hover:text-white border border-[#2d3139] font-mono text-[11px] transition-colors cursor-pointer"
              >
                Specs
              </button>
            )}
          </div>
        </div>

        {/* Contract Address Display Bar */}
        <div className="mt-4 p-3 rounded-xl bg-[#0a0b0d] border border-[#2d3139] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden w-full">
            <div className="w-7 h-7 rounded-lg bg-[#1a1d24] border border-[#2d3139] flex items-center justify-center shrink-0">
              <span className="text-[11px] font-mono font-bold text-[#ccff00]">CA</span>
            </div>
            <div className="overflow-hidden w-full">
              <span className="text-[9px] uppercase font-bold text-[#8e99ac] block font-mono">
                Contract Address
              </span>
              <div className="text-xs sm:text-sm font-bold font-mono text-[#39ff14] truncate select-all">
                {contractAddress}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopyCA}
              className={`py-1.5 px-3 rounded-lg text-xs font-mono uppercase transition-all cursor-pointer ${
                copiedCA
                  ? 'bg-[#39ff14] text-black font-bold'
                  : 'bg-[#1a1d24] hover:bg-[#2d3139] text-[#e0e0e0] border border-[#2d3139]'
              }`}
            >
              {copiedCA ? 'Copied' : 'Copy'}
            </button>

            <a
              href={`https://solscan.io/token/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 px-3 rounded-lg bg-[#1a1d24] hover:bg-[#2d3139] text-[#00f5ff] border border-[#2d3139] text-xs font-mono uppercase flex items-center gap-1 transition-colors"
            >
              <span>Explorer</span>
              <ExternalLink className="w-3 h-3 text-[#00f5ff]" />
            </a>
          </div>
        </div>

        {/* Centralized Post-Launch Distribution Strip */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#0d121c] via-[#101726] to-[#0c101a] border border-[#263147] shadow-xl">
          <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#1e2638]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ccff00]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Launch Toolkit
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {/* Action 1: Master Launch Kit (.ZIP) */}
            <button
              type="button"
              onClick={handleDownloadBrandingKit}
              disabled={isDownloadingZip}
              className="p-3.5 rounded-xl bg-[#ccff00] hover:bg-[#d9ff33] text-black font-mono text-xs font-bold transition-all flex flex-col justify-between gap-3 cursor-pointer shadow-[0_0_15px_rgba(204,255,0,0.2)] hover:scale-[1.02] disabled:opacity-50 text-left group"
            >
              <div className="flex items-center justify-between">
                <FolderDown className="w-5 h-5 text-black" />
                <span className="text-[9px] bg-black/20 text-black px-1.5 py-0.5 rounded font-black">ZIP</span>
              </div>
              <div>
                <div className="text-[11px] font-black uppercase leading-tight">
                  {isDownloadingZip ? 'Packaging...' : zipSuccess ? 'Downloaded' : 'Brand Kit'}
                </div>
                <div className="text-[9px] text-black/75 font-sans mt-0.5">
                  Avatars, Banners &amp; Memes
                </div>
              </div>
            </button>

            {/* Action 2: Launch Tweet with CA */}
            <a
              href={primaryLaunchTweetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-[#1d9bf0] hover:bg-[#38a9f5] text-white font-mono text-xs font-bold transition-all flex flex-col justify-between gap-3 cursor-pointer shadow-[0_0_15px_rgba(29,155,240,0.25)] hover:scale-[1.02] text-left group"
            >
              <div className="flex items-center justify-between">
                <Twitter className="w-5 h-5" />
                <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-bold">X</span>
              </div>
              <div>
                <div className="text-[11px] font-black uppercase leading-tight">
                  Announcement Tweet
                </div>
                <div className="text-[9px] text-white/80 font-sans mt-0.5">
                  Share token address
                </div>
              </div>
            </a>

            {/* Action 3: Telegram Community Dispatch */}
            <button
              type="button"
              onClick={() => {
                handleStationSelect('mobilize');
                setMobilizeSubSection('telegram');
              }}
              className="p-3.5 rounded-xl bg-[#00f5ff] hover:bg-[#b2faff] text-black font-mono text-xs font-bold transition-all flex flex-col justify-between gap-3 cursor-pointer shadow-[0_0_15px_rgba(0,245,255,0.2)] hover:scale-[1.02] text-left group"
            >
              <div className="flex items-center justify-between">
                <Send className="w-5 h-5" />
                <span className="text-[9px] bg-black/20 px-1.5 py-0.5 rounded font-bold">TELEGRAM</span>
              </div>
              <div>
                <div className="text-[11px] font-black uppercase leading-tight">
                  Community Alerts
                </div>
                <div className="text-[9px] text-black/75 font-sans mt-0.5">
                  Send updates to chat
                </div>
              </div>
            </button>

            {/* Action 4: Live Token Micro-Site or Brand Asset Hub */}
            {onOpenMicroSite ? (
              <button
                type="button"
                onClick={onOpenMicroSite}
                className="p-3.5 rounded-xl bg-[#141824] hover:bg-[#1d2334] border border-[#2b3548] hover:border-[#00f5ff]/60 text-white font-mono text-xs font-bold transition-all flex flex-col justify-between gap-3 cursor-pointer hover:scale-[1.02] text-left group"
              >
                <div className="flex items-center justify-between">
                  <Globe className="w-5 h-5 text-[#00f5ff]" />
                  <ExternalLink className="w-3.5 h-3.5 text-[#8e99ac] group-hover:text-white" />
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase text-[#00f5ff] leading-tight">
                    Micro-Site
                  </div>
                  <div className="text-[9px] text-[#8e99ac] font-sans mt-0.5">
                    Public token landing page
                  </div>
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleStationSelect('brand')}
                className="p-3.5 rounded-xl bg-[#141824] hover:bg-[#1d2334] border border-[#2b3548] hover:border-[#a855f7]/60 text-white font-mono text-xs font-bold transition-all flex flex-col justify-between gap-3 cursor-pointer hover:scale-[1.02] text-left group"
              >
                <div className="flex items-center justify-between">
                  <Layers className="w-5 h-5 text-[#a855f7]" />
                  <span className="text-[9px] bg-[#a855f7]/20 text-[#a855f7] px-1.5 py-0.5 rounded font-bold">ASSETS</span>
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase text-[#a855f7] leading-tight">
                    Brand Assets
                  </div>
                  <div className="text-[9px] text-[#8e99ac] font-sans mt-0.5">
                    Avatars &amp; Banners
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Continuous Post-Launch Creation Callout Banner */}
        {onReturnToMemeStudio && (
          <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-[#0d1424] via-[#10192e] to-[#0b101c] border border-[#00f5ff]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#00f5ff]/10 border border-[#00f5ff]/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#00f5ff]" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-white uppercase flex flex-wrap items-center gap-2">
                  <span>Continuous Creation Active</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#39ff14]/20 text-[#39ff14] font-mono font-bold">
                    POST-LAUNCH MEME GENERATOR
                  </span>
                </div>
                <p className="text-[11px] text-[#8e99ac] font-sans mt-0.5 max-w-2xl">
                  Need fresh viral memes or custom X banners during live trading? Jump back to Step 2 anytime to render new meme formats, edit captions, and download custom graphics for {narrative.ticker}.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onReturnToMemeStudio}
              className="py-2 px-3.5 rounded-lg bg-[#00f5ff] hover:bg-[#b2faff] text-black font-mono font-bold text-xs uppercase flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,245,255,0.25)] transition-all shrink-0 cursor-pointer w-full sm:w-auto justify-center"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Open Meme Studio</span>
            </button>
          </div>
        )}

        {/* 2. COLLAPSIBLE ORIGIN LORE TOGGLE */}
        <div className="mt-3 pt-3 border-t border-[#1e222d]">
          <button
            type="button"
            onClick={() => setShowOriginLore(!showOriginLore)}
            className="w-full flex items-center justify-between py-1.5 px-3 rounded-lg bg-[#0e1117] hover:bg-[#151922] border border-[#232938] text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2 text-xs font-mono">
              <BookOpen className="w-3.5 h-3.5 text-[#ccff00]" />
              <span className="font-bold text-white">Origin Lore</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-[#00f5ff]">
              <span>{showOriginLore ? 'Hide' : 'View'}</span>
              {showOriginLore ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {showOriginLore && (
            <div className="mt-3 p-4 rounded-xl bg-[#08090d] border border-[#262c3d] space-y-3 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#1e222d]">
                <div>
                  <div className="text-[10px] font-mono uppercase font-bold text-[#8e99ac]">Tagline</div>
                  <div className="text-sm font-bold text-[#ccff00] font-mono mt-0.5">"{narrative.tagline}"</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#8e99ac]">Resonance:</span>
                  <span className="text-xs font-mono font-bold text-[#39ff14] px-2 py-0.5 rounded bg-[#39ff14]/15 border border-[#39ff14]/30">
                    {narrative.viral_score || 94}/100
                  </span>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase font-bold text-[#8e99ac] mb-1">Lore</div>
                <p className="text-xs text-[#e0e0e0] leading-relaxed font-sans bg-[#0c0e14] p-3 rounded-lg border border-[#1e222d]">
                  {narrative.lore}
                </p>
              </div>

              {narrative.tweet_pack && narrative.tweet_pack.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono uppercase font-bold text-[#8e99ac] mb-1">Launch Posts</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {narrative.tweet_pack.map((tweet, i) => (
                      <div key={i} className="p-2 rounded-lg bg-[#0c0e14] border border-[#1e222d] text-[11px] text-[#e0e0e0] font-sans flex flex-col justify-between">
                        <div>{tweet}</div>
                        <div className="pt-2 flex justify-end">
                          <a
                            href={`https://x.com/intent/tweet?text=${encodeURIComponent(tweet + `\n\n$${narrative.ticker.replace('$', '')} CA: ${contractAddress}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono text-[#00f5ff] hover:underline flex items-center gap-1"
                          >
                            <span>Post</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. FOUR PRIMARY OPERATING STATIONS NAVIGATOR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 p-1.5 rounded-2xl bg-[#0a0b0d] border border-[#2d3139]">
        {/* Station 1: Community Mobilization */}
        <button
          type="button"
          onClick={() => handleStationSelect('mobilize')}
          className={`p-3 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2.5 text-left cursor-pointer ${
            currentStation === 'mobilize'
              ? 'bg-[#00f5ff] text-black shadow-[0_0_15px_rgba(0,245,255,0.3)]'
              : 'text-[#e0e0e0] hover:text-white bg-[#12151e] hover:bg-[#181d28] border border-[#1e2330]'
          }`}
        >
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
            currentStation === 'mobilize' ? 'bg-black text-[#00f5ff]' : 'bg-[#00f5ff]/15 text-[#00f5ff]'
          }`}>
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1 truncate">
            <div className="truncate">Mobilization</div>
            <div className={`text-[10px] font-normal truncate ${currentStation === 'mobilize' ? 'text-black/80' : 'text-[#8e99ac]'}`}>
              Social Broadcasts
            </div>
          </div>
        </button>

        {/* Station 2: Conviction Guardian */}
        <button
          type="button"
          onClick={() => handleStationSelect('guardian')}
          className={`p-3 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2.5 text-left cursor-pointer ${
            currentStation === 'guardian'
              ? 'bg-[#39ff14] text-black shadow-[0_0_15px_rgba(57,255,20,0.3)]'
              : 'text-[#e0e0e0] hover:text-white bg-[#12151e] hover:bg-[#181d28] border border-[#1e2330]'
          }`}
        >
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
            currentStation === 'guardian' ? 'bg-black text-[#39ff14]' : 'bg-[#39ff14]/15 text-[#39ff14]'
          }`}>
            <Shield className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1 truncate">
            <div className="truncate">Market Monitor</div>
            <div className={`text-[10px] font-normal truncate ${currentStation === 'guardian' ? 'text-black/80' : 'text-[#8e99ac]'}`}>
              Whale Activity
            </div>
          </div>
        </button>

        {/* Station 3: Narrative Seasons */}
        <button
          type="button"
          onClick={() => handleStationSelect('narrative')}
          className={`p-3 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2.5 text-left cursor-pointer ${
            currentStation === 'narrative'
              ? 'bg-[#ccff00] text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]'
              : 'text-[#e0e0e0] hover:text-white bg-[#12151e] hover:bg-[#181d28] border border-[#1e2330]'
          }`}
        >
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
            currentStation === 'narrative' ? 'bg-black text-[#ccff00]' : 'bg-[#ccff00]/15 text-[#ccff00]'
          }`}>
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1 truncate">
            <div className="truncate">Playbook</div>
            <div className={`text-[10px] font-normal truncate ${currentStation === 'narrative' ? 'text-black/80' : 'text-[#8e99ac]'}`}>
              Narrative Roadmap
            </div>
          </div>
        </button>

        {/* Station 4: Brand Asset Hub */}
        <button
          type="button"
          onClick={() => handleStationSelect('brand')}
          className={`p-3 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2.5 text-left cursor-pointer ${
            currentStation === 'brand'
              ? 'bg-[#a855f7] text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
              : 'text-[#e0e0e0] hover:text-white bg-[#12151e] hover:bg-[#181d28] border border-[#1e2330]'
          }`}
        >
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
            currentStation === 'brand' ? 'bg-black text-[#a855f7]' : 'bg-[#a855f7]/15 text-[#a855f7]'
          }`}>
            <Layers className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1 truncate">
            <div className="truncate">Assets</div>
            <div className={`text-[10px] font-normal truncate ${currentStation === 'brand' ? 'text-white/80' : 'text-[#8e99ac]'}`}>
              Design Exports
            </div>
          </div>
        </button>
      </div>

      {/* 4. STATION 1: COMMUNITY MOBILIZATION & SOCIAL DISPATCH */}
      {currentStation === 'mobilize' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Official Project Social Handles Configuration Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0a0f1d] via-[#101728] to-[#0c1220] border border-[#1d9bf0]/40 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#1f2a40]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#1d9bf0]/20 flex items-center justify-center text-[#1d9bf0]">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    Social Links
                  </h4>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveSocialHandles}
                className={`py-1.5 px-3.5 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  handlesSaved
                    ? 'bg-[#39ff14] text-black shadow-[0_0_10px_rgba(57,255,20,0.4)]'
                    : 'bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white shadow-[0_0_10px_rgba(29,155,240,0.3)]'
                }`}
              >
                {handlesSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{handlesSaved ? 'Saved' : 'Save Links'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Handle 1: X (Twitter) */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase text-[#1d9bf0] flex items-center gap-1.5">
                  <Twitter className="w-3 h-3" />
                  <span>X Handle</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={twitterHandle}
                    onChange={(e) => setTwitterHandle(e.target.value)}
                    placeholder="@YourToken"
                    className="w-full bg-[#080b12] border border-[#232f48] focus:border-[#1d9bf0] rounded-lg py-2 px-3 text-xs text-white font-mono outline-none transition-colors"
                  />
                  {twitterHandle && (
                    <a
                      href={`https://x.com/${twitterHandle.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-[#1d9bf0]"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Handle 2: Telegram Channel */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase text-[#00f5ff] flex items-center gap-1.5">
                  <Send className="w-3 h-3" />
                  <span>Telegram Channel</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={telegramHandle}
                    onChange={(e) => {
                      setTelegramHandle(e.target.value);
                      setChannelInput(e.target.value);
                    }}
                    placeholder="@YourToken_channel"
                    className="w-full bg-[#080b12] border border-[#232f48] focus:border-[#00f5ff] rounded-lg py-2 px-3 text-xs text-white font-mono outline-none transition-colors"
                  />
                  {telegramHandle && (
                    <a
                      href={`https://t.me/${telegramHandle.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-[#00f5ff]"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Handle 3: Project Website / MicroSite */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase text-[#ccff00] flex items-center gap-1.5">
                  <Globe className="w-3 h-3" />
                  <span>Website</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourtoken.com"
                    className="w-full bg-[#080b12] border border-[#232f48] focus:border-[#ccff00] rounded-lg py-2 px-3 text-xs text-white font-mono outline-none transition-colors"
                  />
                  {websiteUrl && (
                    <a
                      href={websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-[#ccff00]"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Tabs within Station 1 */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-[#0e1117] border border-[#232938] overflow-x-auto">
            <button
              type="button"
              onClick={() => setMobilizeSubSection('tweets')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                mobilizeSubSection === 'tweets'
                  ? 'bg-[#1d9bf0] text-white shadow-[0_0_10px_rgba(29,155,240,0.4)]'
                  : 'text-[#8e99ac] hover:text-white'
              }`}
            >
              <Twitter className="w-3.5 h-3.5" />
              <span>Launch Posts</span>
            </button>

            <button
              type="button"
              onClick={() => setMobilizeSubSection('telegram')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                mobilizeSubSection === 'telegram'
                  ? 'bg-[#00f5ff] text-black shadow-[0_0_10px_rgba(0,245,255,0.3)]'
                  : 'text-[#8e99ac] hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Telegram Alerts</span>
            </button>

            <button
              type="button"
              onClick={() => setMobilizeSubSection('xcommunity')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                mobilizeSubSection === 'xcommunity'
                  ? 'bg-[#1d9bf0] text-white shadow-[0_0_10px_rgba(29,155,240,0.4)]'
                  : 'text-[#8e99ac] hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>X Community</span>
            </button>

            <button
              type="button"
              onClick={() => setMobilizeSubSection('cron')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                mobilizeSubSection === 'cron'
                  ? 'bg-amber-400 text-black shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                  : 'text-[#8e99ac] hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Scheduler</span>
            </button>
          </div>

          {/* Sub-Tab: Launch Day Tweets with Live Verified CA */}
          {mobilizeSubSection === 'tweets' && (
            <div className="space-y-4">
              {/* Manual Account Setup Requirement Notice */}
              <div className="p-4 rounded-xl bg-[#131b2e] border-2 border-[#1d9bf0]/50 flex flex-col gap-2.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Twitter className="w-4 h-4 text-[#1d9bf0]" />
                    <span className="text-white font-bold uppercase tracking-wider text-xs">
                      Step 1: Set Up Your Project's X (Twitter) Profile Manually
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#1d9bf0]/20 text-[#1d9bf0] text-[10px] font-bold">
                    Mandatory First Step
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  Before broadcasting launch tweets, you must manually create an official X account (e.g. <b>@{narrative.ticker.replace('$', '')}_Solana</b>). Download your pre-sized <b>512x512 Mascot Avatar</b> and <b>1500x500 Header Banner</b> from Station 4 (Brand Asset Hub) so your page has instant credibility before posting.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-[#1d9bf0]/20 text-[11px]">
                  <button
                    type="button"
                    onClick={handleDownloadAvatar}
                    disabled={isDownloadingAvatar}
                    className="text-[#00f5ff] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <span>↓ Download 512x512 Profile Avatar</span>
                  </button>
                  <span className="text-slate-600">•</span>
                  <button
                    type="button"
                    onClick={handleDownloadBanner}
                    disabled={isDownloadingBanner}
                    className="text-[#00f5ff] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <span>↓ Download 1500x500 Twitter Banner</span>
                  </button>
                  <span className="text-slate-600">•</span>
                  <a
                    href="https://x.com/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1d9bf0] hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>Open X Signup ↗</span>
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0e1117] border border-[#232938] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse"></span>
                    <span className="text-[#39ff14] font-bold uppercase tracking-wider">
                      Verified Solana Contract Address Injected
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8e99ac] leading-relaxed font-sans">
                    These 3 high-impact announcements were pre-staged in Step 2. Now that your contract is deployed, each tweet automatically includes your official Contract Address and DexScreener chart link. Click <b>Post to X</b> to publish instantly without copycat sniping.
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-[#141824] border border-[#2d354a] text-right shrink-0">
                  <span className="text-[10px] text-[#8e99ac] block">Active CA:</span>
                  <span className="text-xs text-[#00f5ff] font-bold">{contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {editableTweets.map((tweet, idx) => {
                  const isEditing = editingTweetIdx === idx;
                  const fullTweet = `${tweet}\n\n$${narrative.ticker.replace('$', '')} Official CA:\n${contractAddress}${socialLine ? `\n\n${socialLine}` : ''}\n\n📈 Live Chart: https://dexscreener.com/solana/${contractAddress}`;
                  const tweetIntent = `https://x.com/intent/tweet?text=${encodeURIComponent(fullTweet)}`;
                  const isCopied = copiedTweetIdx === idx;

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#0a0d14] border border-[#232938] hover:border-[#1d9bf0]/50 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-[#1c2230] pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-[#1d9bf0] flex items-center gap-1.5">
                            <Twitter className="w-3.5 h-3.5" />
                            <span>Launch Tweet 0{idx + 1}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingTweetIdx(isEditing ? null : idx)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                              isEditing
                                ? 'bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/40 font-bold'
                                : 'text-slate-400 hover:text-white bg-[#141824] border border-[#2d354a]'
                            }`}
                            title="Edit tweet text before posting"
                          >
                            <Edit3 className="w-2.5 h-2.5" />
                            <span>{isEditing ? 'Done Editing' : 'Edit Text'}</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyTweetWithCA(tweet, idx)}
                            className={`py-1 px-2.5 rounded text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${
                              isCopied
                                ? 'bg-[#39ff14] text-black'
                                : 'bg-[#141824] hover:bg-[#1f2638] text-slate-300 border border-[#2d354a]'
                            }`}
                          >
                            {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>{isCopied ? 'Copied' : 'Copy'}</span>
                          </button>

                          <a
                            href={tweetIntent}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1 px-3 rounded bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-mono font-bold text-[10px] uppercase flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(29,155,240,0.3)]"
                            title="Publish tweet directly on X"
                          >
                            <span>🔥 Blast to Feed ↗</span>
                          </a>
                        </div>
                      </div>

                      {/* Tweet Preview / Edit Mode */}
                      {isEditing ? (
                        <div className="space-y-2 bg-[#0d111a] p-3 rounded-lg border border-[#ccff00]/30 animate-fadeIn">
                          <div className="flex items-center justify-between text-[10px] font-mono text-[#ccff00]">
                            <span className="font-bold">Creator Override Active:</span>
                            <span className="text-slate-400">Add CT slang, hashtags, or custom jokes</span>
                          </div>
                          <textarea
                            rows={3}
                            value={tweet}
                            onChange={(e) => {
                              const updated = [...editableTweets];
                              updated[idx] = e.target.value;
                              setEditableTweets(updated);
                            }}
                            className="w-full bg-[#050608] border border-[#2d3139] focus:border-[#ccff00] rounded-lg p-2 text-xs text-white font-mono outline-none leading-relaxed"
                            placeholder="Type custom tweet copy..."
                          />
                        </div>
                      ) : (
                        <div className="bg-[#121622] p-3.5 rounded-lg border border-[#1e2738] space-y-2">
                          <p className="text-xs text-white leading-relaxed font-sans">
                            {tweet}
                          </p>
                          {socialLine && (
                            <div className="text-[11px] font-mono text-[#00f5ff] bg-black/40 px-2.5 py-1 rounded border border-[#232f48]">
                              {socialLine}
                            </div>
                          )}
                          <div className="pt-2 border-t border-[#1e2738]/60 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#8e99ac]">
                            <span className="text-[#39ff14] font-bold">
                              CA: {contractAddress}
                            </span>
                            <span className="text-[#00f5ff] hover:underline">
                              dexscreener.com/solana/{contractAddress.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Social Compliance Badge */}
                      <SocialComplianceScannerBadge
                        content={fullTweet}
                        ticker={narrative.ticker}
                        compact={true}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sub-Tab A: Telegram Alerts */}
          {mobilizeSubSection === 'telegram' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Interactive Telegram Alert Preview */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold text-[#00f5ff] tracking-wider font-mono flex items-center gap-1.5">
                    <span>Telegram Community Dispatch &amp; Buy Alerts</span>
                    <span className="px-1.5 py-0.2 text-[9px] rounded bg-[#39ff14]/15 text-[#39ff14] border border-[#39ff14]/30">HITL Verified</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <AuthenticityVerificationBadge auditResult={authenticityAudit} compact contractAddress={contractAddress} />
                    <button
                      type="button"
                      onClick={() => setIsCustomEditing(!isCustomEditing)}
                      className={`text-[10px] font-mono py-1 px-2.5 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                        isCustomEditing
                          ? 'bg-[#00f5ff]/20 text-[#00f5ff] border-[#00f5ff]'
                          : 'bg-[#1a1d24] text-slate-300 border-[#2d3139] hover:text-white'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isCustomEditing ? 'Preview Mode' : 'Edit Text'}</span>
                    </button>
                  </div>
                </div>

                {/* Zero Fake News Guardrail */}
                <div className="p-2.5 rounded-lg bg-[#080a0e] border border-[#2d3139] text-[10px] font-mono text-[#e0e0e0]/70 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#39ff14] shrink-0 mt-0.5" />
                  <div>
                    <b>Zero-Misrepresentation Protocol Standard:</b> System-generated alerts reference confirmed on-chain metrics and organic narrative updates.
                  </div>
                </div>

                {/* Custom Edit Drawer */}
                {isCustomEditing && (
                  <div className="p-3.5 rounded-xl bg-[#0e1117] border border-[#00f5ff]/40 space-y-2 font-mono text-xs animate-fadeIn">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="text-[#00f5ff] font-bold uppercase">Customize Telegram Message HTML:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditedMessage(telegram.telegram_message);
                          setIsCustomEditing(false);
                        }}
                        className="hover:underline text-slate-400 hover:text-white cursor-pointer"
                      >
                        Reset to Original
                      </button>
                    </div>
                    <textarea
                      rows={6}
                      value={editedMessage}
                      onChange={(e) => setEditedMessage(e.target.value)}
                      className="w-full bg-[#050608] border border-[#2d3139] rounded-lg p-2 text-xs text-white font-mono focus:border-[#00f5ff] outline-none leading-relaxed"
                    />
                  </div>
                )}

                {/* Telegram Chat Simulation Bubble */}
                <div className="rounded-xl bg-[#0a0b0d] border border-[#2d3139] p-4 shadow-xl space-y-3 text-[#e0e0e0]">
                  <div className="flex items-center justify-between border-b border-[#2d3139] pb-2.5 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-[#ccff00] flex items-center justify-center font-bold text-black text-[10px]">
                        {narrative.ticker.slice(1, 3)}
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                          <span>{narrative.token_name} Community Dispatch</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14]"></span>
                        </div>
                        <div className="text-[10px] opacity-40">14,280 community members active</div>
                      </div>
                    </div>
                    <span className="text-[10px] opacity-40">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className="text-xs text-[#e0e0e0] leading-relaxed font-sans whitespace-pre-wrap selection:bg-[#00f5ff]/30"
                    dangerouslySetInnerHTML={{ __html: activeMessage }}
                  />

                  <div className="pt-1">
                    <a
                      href={telegram.button_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-lg bg-[#1a1d24] hover:bg-[#2d3139] border border-[#2d3139] text-[#00f5ff] font-bold text-xs uppercase font-mono flex items-center justify-center gap-2 transition-all shadow-md group cursor-pointer"
                    >
                      <Zap className="w-3 h-3 text-[#ccff00]" />
                      <span>{telegram.button_label}</span>
                      <ExternalLink className="w-3 h-3 opacity-40" />
                    </a>
                  </div>

                  <div className="pt-1 border-t border-[#2d3139]/50 flex items-center justify-between text-[9px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#39ff14]" />
                      <span>Origin: {authenticityAudit.source.replace(/_/g, ' ')}</span>
                    </span>
                    <span className="text-emerald-400 font-bold">{authenticityAudit.truthScore}% Truth Audit</span>
                  </div>
                </div>

                <SocialComplianceScannerBadge
                  content={telegram.telegram_message.replace(/<[^>]*>?/gm, '')}
                  ticker={narrative.ticker}
                />

                {/* Event Type Trigger Pills */}
                <div className="p-3 rounded-xl bg-[#0a0b0d] border border-[#2d3139]">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-60 mb-2 flex items-center justify-between">
                    <span>Community Event Trigger Template:</span>
                    {isRefreshingRaid && <span className="text-[#00f5ff] animate-pulse">Generating with Agent 3...</span>}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {EVENT_TYPES.map((evt) => (
                      <button
                        key={evt.id}
                        onClick={() => handleEventChange(evt.id)}
                        disabled={isRefreshingRaid}
                        className={`py-1.5 px-2 rounded-lg text-xs font-mono uppercase border transition-all text-center cursor-pointer ${
                          selectedEventType === evt.id
                            ? 'bg-[#1a1d24] border-[#00f5ff] text-[#00f5ff] font-bold'
                            : 'bg-[#0a0b0d] border-[#2d3139] text-[#e0e0e0] opacity-70 hover:opacity-100'
                        }`}
                      >
                        {evt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Connect Telegram Webhook Dispatcher */}
              <div className="lg:col-span-5 space-y-4">
                {/* Telegram Manual Setup Guide Banner */}
                <div className="p-4 rounded-xl bg-[#0c1424] border-2 border-[#00f5ff]/40 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-[#00f5ff]/20 pb-2">
                    <div className="flex items-center gap-2 text-white font-bold uppercase">
                      <Bot className="w-4 h-4 text-[#00f5ff]" />
                      <span>Manual Telegram Setup (Prerequisite)</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#00f5ff]/20 text-[#00f5ff] font-bold">
                      Required First
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                    MemeFi OS formats and dispatches live buy & community alerts, but you must first create your community group manually on Telegram:
                  </p>
                  <ol className="space-y-2 text-[11px] text-[#8e99ac] list-decimal list-inside">
                    <li>
                      <strong className="text-white">Create Group/Channel:</strong> Open Telegram and create a public group (e.g. <span className="text-[#00f5ff]">t.me/{narrative.ticker.replace('$', '')}_portal</span>).
                    </li>
                    <li>
                      <strong className="text-white">Set Mascot Avatar:</strong> Upload your downloaded 512x512 mascot logo as the Telegram group photo.
                    </li>
                    <li>
                      <strong className="text-white">Add Dispatch Bot:</strong> Add our broadcaster bot (<code className="text-[#39ff14] bg-black/40 px-1 rounded">@MemeFi_DispatchBot</code>) as an Admin with "Post Messages" permission.
                    </li>
                  </ol>
                  <div className="pt-1 text-[10px] text-[#00f5ff] flex items-center gap-2">
                    <span>💡 Once your group is created, enter its handle below to test dispatch!</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0a0b0d] border border-[#2d3139] space-y-3">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-[#00f5ff]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                      Connect Telegram Webhook
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#e0e0e0] opacity-60">
                    Broadcast real-time community milestone alerts and announcements directly to your project's Telegram group channel.
                  </p>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] uppercase font-bold opacity-40 tracking-wider font-mono">
                        Target Telegram Channel / Group
                      </label>
                      {telegramHandle && (
                        <span className="text-[9px] text-[#00f5ff] font-mono">
                          Synced with Project Handles
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={channelInput}
                      onChange={(e) => {
                        setChannelInput(e.target.value);
                        setTelegramHandle(e.target.value);
                      }}
                      className="w-full bg-[#12141a] border border-[#2d3139] rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-[#00f5ff]"
                      placeholder="@your_telegram_channel"
                    />
                  </div>

                  <button
                    onClick={handleSendTelegramAlert}
                    disabled={isSendingAlert}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#00f5ff] hover:bg-[#b2faff] text-black font-bold text-xs uppercase font-mono flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,245,255,0.2)] cursor-pointer disabled:opacity-50"
                  >
                    {isSendingAlert ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Dispatching Alert...</span>
                      </>
                    ) : alertSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Alert Dispatched to {channelInput}!</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Dispatch Alert to Telegram</span>
                      </>
                    )}
                  </button>

                  <div className="pt-2 flex items-center justify-between text-[11px] font-mono">
                    <span className="opacity-40">Bot Status:</span>
                    <span className="text-[#39ff14] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#39ff14]"></span>
                      <span>{telegramConnected ? 'Connected & Active' : 'Ready to Dispatch'}</span>
                    </span>
                  </div>
                </div>

                {/* Station Checklist */}
                <div className="p-4 rounded-xl bg-[#0a0b0d] border border-[#2d3139] space-y-2.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#39ff14]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                      Community Mobilization Status
                    </h4>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#e0e0e0] font-mono">
                    <li className="flex items-center gap-2">
                      <span className="text-[#39ff14] font-bold">✓</span>
                      <span>Agent 3 Telegram Alerts Configured</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#39ff14] font-bold">✓</span>
                      <span>Zero-Misrepresentation Audit Active</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#39ff14] font-bold">✓</span>
                      <span>X Community Engine Connected</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#39ff14] font-bold">✓</span>
                      <span>Conviction &amp; Market Health Active</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab B: X Community Setup & Governance */}
          {mobilizeSubSection === 'xcommunity' && (
            <div className="animate-fadeIn">
              <XCommunitySetupWidget
                narrative={narrative}
                visual={visual}
                deployment={deployment}
              />
            </div>
          )}

          {/* Sub-Tab C: Cloud Cron Pipeline */}
          {mobilizeSubSection === 'cron' && (
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0c0e14] border-2 border-[#00f5ff]/40 shadow-[0_0_25px_rgba(0,245,255,0.08)] space-y-5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2d3139]">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#00f5ff]" />
                    <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
                      Autonomous Community Pulse Pipeline (Cloud Scheduler + Cloud Run)
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-[#00f5ff]/20 text-[#00f5ff] text-[10px] font-mono font-bold">
                      $0 / MO SERVERLESS
                    </span>
                  </div>
                  <p className="text-[11px] text-[#e0e0e0]/70 font-mono mt-1">
                    Trigger autonomous lore synthesis, momentum alerts, and community dispatches every 2 hours with zero always-on server overhead.
                  </p>
                </div>

                <button
                  onClick={handleTestAutonomousCron}
                  disabled={isTestingCron}
                  className="py-2 px-4 rounded-xl bg-[#00f5ff] hover:bg-[#b2faff] text-black font-bold text-xs uppercase font-mono flex items-center justify-center gap-2 transition-transform hover:scale-105 shrink-0 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isTestingCron ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Executing Pipeline...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 fill-black" />
                      <span>⚡ Test Autonomous Trigger</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#141720] border border-[#2d3139] space-y-1">
                  <span className="text-[10px] text-[#ccff00] font-bold block">1. CLOUD SCHEDULER</span>
                  <div className="text-[11px] text-white font-bold">Cron `0 */2 * * *`</div>
                  <span className="text-[9px] text-[#e0e0e0]/50 block">Pings `/api/cron/autonomous-mobilize`</span>
                </div>

                <div className="p-3 rounded-lg bg-[#141720] border border-[#2d3139] space-y-1">
                  <span className="text-[10px] text-[#00f5ff] font-bold block">2. GEMINI AI ENGINE</span>
                  <div className="text-[11px] text-white font-bold">Lore Synthesis</div>
                  <span className="text-[9px] text-[#e0e0e0]/50 block">Generates fresh community angle</span>
                </div>

                <div className="p-3 rounded-lg bg-[#141720] border border-[#2d3139] space-y-1">
                  <span className="text-[10px] text-[#39ff14] font-bold block">3. MULTI-CHANNEL DISPATCH</span>
                  <div className="text-[11px] text-white font-bold">Telegram &amp; X (Twitter)</div>
                  <span className="text-[9px] text-[#e0e0e0]/50 block">Broadcasts alerts to holders</span>
                </div>

                <div className="p-3 rounded-lg bg-[#141720] border border-[#2d3139] space-y-1">
                  <span className="text-[10px] text-[#f59e0b] font-bold block">4. SCALE TO ZERO</span>
                  <div className="text-[11px] text-white font-bold">Stateless Serverless</div>
                  <span className="text-[9px] text-[#e0e0e0]/50 block">0 extra servers / 0 idle costs</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#08090c] border border-[#2d3139] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#00f5ff] font-mono">
                    Deploy to Google Cloud Scheduler (1 Terminal Command):
                  </span>
                  <button
                    onClick={handleCopyGcloud}
                    className="px-2.5 py-1 rounded-lg bg-[#1a1d24] hover:bg-[#2d3139] text-[#ccff00] text-[10px] font-mono uppercase flex items-center gap-1 border border-[#2d3139] transition-colors cursor-pointer"
                  >
                    {copiedGcloud ? <Check className="w-3 h-3 text-[#39ff14]" /> : <Copy className="w-3 h-3 text-[#ccff00]" />}
                    <span>{copiedGcloud ? 'Copied Command' : 'Copy gcloud Command'}</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded bg-[#030406] text-[#39ff14] text-[11px] font-mono overflow-x-auto whitespace-pre-wrap selection:bg-[#00f5ff]/30 leading-relaxed border border-[#1e222b]">
                  {gcloudCommand}
                </pre>
              </div>

              {cronExecutionResult && (
                <div className="p-4 rounded-xl bg-[#121620] border border-[#00f5ff]/60 space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-[#39ff14] font-bold">
                      <CheckCircle className="w-4 h-4" />
                      <span>Autonomous Cron Executed Successfully (Run ID: {cronExecutionResult.run_id || 'OK'})</span>
                    </div>
                    <span className="text-[10px] text-[#e0e0e0]/60">{cronExecutionResult.timestamp}</span>
                  </div>

                  {cronExecutionResult.generated_raid && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs font-mono">
                      <div className="p-3 rounded bg-[#090b0f] border border-[#2d3139] space-y-1">
                        <span className="text-[10px] uppercase text-[#00f5ff] font-bold block">
                          Autonomous Telegram Broadcast Output:
                        </span>
                        <div
                          className="text-[11px] text-[#e0e0e0] whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: cronExecutionResult.generated_raid.telegram_message }}
                        />
                      </div>

                      <div className="p-3 rounded bg-[#090b0f] border border-[#2d3139] space-y-1">
                        <span className="text-[10px] uppercase text-[#ccff00] font-bold block">
                          Autonomous Social Tweet Output:
                        </span>
                        <p className="text-[11px] text-[#e0e0e0] font-sans">
                          {cronExecutionResult.generated_raid.tweet_text}
                        </p>
                        <span className="text-[10px] text-[#39ff14] block pt-1">
                          Angle: {cronExecutionResult.generated_raid.viral_angle}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 5. STATION 2: CONVICTION GUARDIAN & MARKET HEALTH */}
      {currentStation === 'guardian' && (
        <div className="space-y-4 animate-fadeIn">
          <SwarmDefenseCockpit
            narrative={narrative}
            visual={visual}
            deployment={deployment}
          />
        </div>
      )}

      {/* 6. STATION 3: NARRATIVE SEASONS & COMMUNITY PLAYBOOK */}
      {currentStation === 'narrative' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Station Context Banner */}
          <div className="p-4 rounded-xl bg-[#12151e] border border-[#ccff00]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#ccff00]/15 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00] shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                  <span>3-Season Lore Lifecycle &amp; Community Milestones</span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-[#ccff00]/20 text-[#ccff00] font-mono font-bold">
                    Long Lore Engine
                  </span>
                </h3>
                <p className="text-xs text-[#8e99ac] font-mono mt-0.5">
                  Episodic storytelling that scales with bonding curve liquidity: Genesis Era (0–25%) ➔ Cult Expansion (25–75%) ➔ Mythic Legacy (Raydium Graduation).
                </p>
              </div>
            </div>
          </div>

          {/* Embedded NarrativeRoadmap Component */}
          <NarrativeRoadmap data={narrative} />
        </div>
      )}

      {/* 7. STATION 4: BRAND ASSET HUB & SUITE */}
      {currentStation === 'brand' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Master Download Bar */}
          <div className="p-5 rounded-2xl bg-[#0e1117] border border-[#2d3139] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#ccff00]" />
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
                    Official Social Branding &amp; Launch Graphics Kit
                  </h3>
                </div>
                <p className="text-xs text-[#8e99ac] font-mono mt-1">
                  Synthesized from Genesis Steps 2 &amp; 3 with your verified Solana Contract Address ({contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}). Download the complete suite as a .ZIP or grab individual assets below.
                </p>
              </div>

              <button
                onClick={handleDownloadBrandingKit}
                disabled={isDownloadingZip}
                className="py-3 px-6 rounded-xl bg-[#ccff00] hover:bg-[#e0ff4f] text-black font-bold text-xs uppercase font-mono flex items-center justify-center gap-2 transition-transform hover:scale-105 shrink-0 shadow-[0_0_20px_rgba(204,255,0,0.3)] cursor-pointer disabled:opacity-50"
              >
                {isDownloadingZip ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Packaging Complete Suite (.ZIP)...</span>
                  </>
                ) : zipSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Branding Kit Downloaded!</span>
                  </>
                ) : (
                  <>
                    <FolderDown className="w-4 h-4" />
                    <span>Download Complete Kit (.ZIP)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Individual Assets Interactive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Asset 1: 1:1 Avatar PFP */}
            <div className="p-5 rounded-2xl bg-[#0a0d14] border border-[#1e2738] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#00f5ff] uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>01. Official 1:1 Avatar PFP</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#8e99ac] bg-[#141824] px-2 py-0.5 rounded border border-[#2d354a]">
                    512x512 PNG / SVG
                  </span>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl bg-[#121622] border border-[#1e2738]">
                  <div className="w-20 h-20 rounded-2xl bg-[#1a2233] border-2 border-[#00f5ff]/60 overflow-hidden flex items-center justify-center shrink-0 shadow-lg relative">
                    {visual?.mascot_image_url ? (
                      <img
                        src={visual.mascot_image_url}
                        alt="Mascot Avatar"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : visual?.mascot_svg ? (
                      <div
                        className="w-full h-full p-1"
                        dangerouslySetInnerHTML={{ __html: visual.mascot_svg }}
                      />
                    ) : (
                      <span className="text-xl font-bold font-mono text-[#00f5ff]">
                        {narrative.ticker.slice(0, 3)}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-xs font-mono">
                    <div className="text-white font-bold">{narrative.token_name} Avatar</div>
                    <div className="text-[11px] text-[#8e99ac]">
                      Optimized for X profile avatar, Telegram group icon, and DexScreener logo.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#1c2230]">
                <button
                  type="button"
                  onClick={handleDownloadAvatar}
                  disabled={isDownloadingAvatar}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#141824] hover:bg-[#1f2638] text-white font-mono text-xs font-bold uppercase border border-[#2d354a] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#00f5ff]" />
                  <span>{isDownloadingAvatar ? 'Exporting...' : 'Download PNG'}</span>
                </button>
                {visual?.mascot_svg && (
                  <button
                    type="button"
                    onClick={handleDownloadSvg}
                    className="py-2 px-3 rounded-lg bg-[#141824] hover:bg-[#1f2638] text-[#39ff14] font-mono text-xs font-bold uppercase border border-[#2d354a] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>SVG</span>
                  </button>
                )}
              </div>
            </div>

            {/* Asset 2: 3:1 Twitter Header Banner */}
            <div className="p-5 rounded-2xl bg-[#0a0d14] border border-[#1e2738] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#ccff00] uppercase flex items-center gap-1.5">
                    <Twitter className="w-3.5 h-3.5" />
                    <span>02. Official X / Twitter Header</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#8e99ac] bg-[#141824] px-2 py-0.5 rounded border border-[#2d354a]">
                    1500x500 (3:1)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#121622] border border-[#1e2738] space-y-2">
                  <div className="h-20 w-full rounded-lg bg-gradient-to-r from-[#090a0f] via-[#121622] to-[#07080b] border border-[#2d3b4e] flex items-center justify-between px-3 overflow-hidden relative">
                    <div className="space-y-0.5">
                      <div className="text-[9px] text-[#00f5ff] font-mono font-bold">SOLANA MEME PROTOCOL</div>
                      <div className="text-xs font-black text-white leading-none">{narrative.token_name}</div>
                      <div className="text-[10px] text-[#ccff00] font-mono font-bold">{narrative.ticker}</div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-[#ccff00] bg-[#141720] overflow-hidden flex items-center justify-center shrink-0">
                      {visual?.mascot_image_url ? (
                        <img src={visual.mascot_image_url} alt="Banner Mascot" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-[10px] font-mono text-[#ccff00]">{narrative.ticker.slice(0, 2)}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-[11px] text-[#8e99ac] font-mono">
                    Pre-formatted with verified Contract Address stamp for instant profile branding.
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1c2230]">
                <button
                  type="button"
                  onClick={handleDownloadBanner}
                  disabled={isDownloadingBanner}
                  className="w-full py-2 px-3 rounded-lg bg-[#141824] hover:bg-[#1f2638] text-white font-mono text-xs font-bold uppercase border border-[#2d354a] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#ccff00]" />
                  <span>{isDownloadingBanner ? 'Generating...' : 'Download Header Banner (1500x500)'}</span>
                </button>
              </div>
            </div>

            {/* Asset 3: Community Meme Shards */}
            <div className="p-5 rounded-2xl bg-[#0a0d14] border border-[#1e2738] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#f59e0b] uppercase flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" />
                    <span>03. Community Meme Cards</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#8e99ac] bg-[#141824] px-2 py-0.5 rounded border border-[#2d354a]">
                    2 Variations (600x600)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-[#121622] border border-[#1e2738] text-center space-y-1">
                    <span className="text-[9px] font-mono font-bold text-[#ef4444] block">BREAKING NEWS</span>
                    <div className="text-[11px] text-white font-bold leading-tight truncate">{narrative.ticker} ALERT</div>
                    <span className="text-[9px] text-[#8e99ac] block truncate">High-urgency alert card</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#121622] border border-[#1e2738] text-center space-y-1">
                    <span className="text-[9px] font-mono font-bold text-[#39ff14] block">GOD CANDLE CHART</span>
                    <div className="text-[11px] text-white font-bold leading-tight truncate">BREAKOUT INCOMING</div>
                    <span className="text-[9px] text-[#8e99ac] block truncate">FOMO pump graphic</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#8e99ac] font-mono">
                  Bundled into the .ZIP pack ready to attach to community announcements, quoted tweets, and Telegram buy notifications.
                </p>
              </div>

              <div className="pt-2 border-t border-[#1c2230] space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadSingleMeme('Breaking News')}
                    disabled={isDownloadingMeme1}
                    className="py-2 px-2.5 rounded-lg bg-[#141824] hover:bg-[#1f2638] text-white font-mono text-[11px] font-bold uppercase border border-[#2d354a] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-[#ef4444]" />
                    <span>{isDownloadingMeme1 ? 'Exporting...' : 'Breaking News PNG'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadSingleMeme('God Candle')}
                    disabled={isDownloadingMeme2}
                    className="py-2 px-2.5 rounded-lg bg-[#141824] hover:bg-[#1f2638] text-white font-mono text-[11px] font-bold uppercase border border-[#2d354a] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-[#39ff14]" />
                    <span>{isDownloadingMeme2 ? 'Exporting...' : 'God Candle PNG'}</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadBrandingKit}
                  disabled={isDownloadingZip}
                  className="w-full py-2 px-3 rounded-lg bg-[#141824] hover:bg-[#1f2638] text-[#f59e0b] font-mono text-xs font-bold uppercase border border-[#2d354a] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FolderDown className="w-3.5 h-3.5" />
                  <span>Download Full Suite via .ZIP</span>
                </button>
              </div>
            </div>

            {/* Asset 4: DexScreener & Metaplex Metadata JSON */}
            <div className="p-5 rounded-2xl bg-[#0a0d14] border border-[#1e2738] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#39ff14] uppercase flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>04. DexScreener &amp; Metaplex Metadata</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#8e99ac] bg-[#141824] px-2 py-0.5 rounded border border-[#2d354a]">
                    JSON Spec
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#08090c] border border-[#1e222d] font-mono text-[11px] text-[#8e99ac] space-y-1 max-h-28 overflow-y-auto">
                  <div className="text-[#39ff14] font-bold">"{narrative.token_name}" (${narrative.ticker.replace('$', '')})</div>
                  <div className="truncate">CA: {contractAddress}</div>
                  <div className="text-[10px] text-slate-500">Standard Metaplex Token Metadata JSON format</div>
                </div>
                <p className="text-[11px] text-[#8e99ac] font-mono">
                  Instant 1-click copy or file download for updating DexScreener profile, Jupiter token verification, and Birdeye listing.
                </p>
              </div>

              <div className="pt-2 border-t border-[#1c2230] grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyMetadataJson}
                  className={`py-2 px-2.5 rounded-lg font-mono text-xs font-bold uppercase border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    copiedMetadata
                      ? 'bg-[#39ff14] text-black border-[#39ff14]'
                      : 'bg-[#141824] hover:bg-[#1f2638] text-white border-[#2d354a]'
                  }`}
                >
                  {copiedMetadata ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-[#39ff14]" />}
                  <span>{copiedMetadata ? 'Copied!' : 'Copy JSON'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadMetadataJson}
                  disabled={isDownloadingMetadata}
                  className="py-2 px-2.5 rounded-lg bg-[#141824] hover:bg-[#1f2638] text-[#00f5ff] font-mono text-xs font-bold uppercase border border-[#2d354a] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isDownloadingMetadata ? 'Saving...' : 'Download .json'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
