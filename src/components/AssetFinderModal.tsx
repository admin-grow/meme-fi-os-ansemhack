import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Image as ImageIcon,
  FileCode,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Radio,
  FileArchive,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { Agent1NarrativeResult, Agent2VisualResult, TokenDeploymentData } from '../types';
import { downloadCompleteBrandingKitZip } from '../socialSuiteGenerator';

interface AssetFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  narrative?: Agent1NarrativeResult | null;
  visual?: Agent2VisualResult | null;
  deployment?: TokenDeploymentData | null;
  onGoToMemeStudio?: () => void;
}

type PlatformFilter = 'all' | 'dexscreener' | 'coingecko' | 'twitter' | 'telegram' | 'metadata';

export const AssetFinderModal: React.FC<AssetFinderModalProps> = ({
  isOpen,
  onClose,
  narrative,
  visual,
  deployment,
  onGoToMemeStudio,
}) => {
  const [activeFilter, setActiveFilter] = useState<PlatformFilter>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const tokenName = narrative?.token_name || 'MemeFi Token';
  const ticker = narrative?.ticker || '$MEME';
  const tagline = narrative?.tagline || 'Autonomous Meme on Solana';
  const lore = narrative?.lore || 'Autonomous community token.';
  const contractAddress = deployment?.mintAddress || 'SoL11111111111111111111111111111111111111112';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      await downloadCompleteBrandingKitZip({
        tokenName,
        ticker,
        tagline,
        lore,
        contractAddress,
        mascotSvg: visual?.mascot_svg,
        mascotImageUrl: visual?.mascot_image_url,
        styleName: visual?.visual_elements?.background_style || 'Cyberpunk Pixel Art',
      });
    } catch (err) {
      console.error('Error downloading assets zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const metadataJson = JSON.stringify(
    {
      name: tokenName,
      symbol: ticker.replace('$', ''),
      description: `${tagline} | Lore: ${lore}`,
      contract_address: contractAddress,
      network: 'Solana (SPL Token)',
      mint_authority: 'REVOKED (Locked)',
      freeze_authority: 'REVOKED (Locked)',
      decimals: 9,
      total_supply: '1,000,000,000',
      fair_launch_platform: 'ClawPump / Pump.fun',
      dex_migration_target: 'Raydium (85 SOL threshold)',
      socials: {
        twitter: `https://x.com/search?q=${encodeURIComponent(ticker)}`,
        telegram: 'https://t.me/MemeFiCommunity',
      },
    },
    null,
    2
  );

  // Asset Items definition
  const assetItems = [
    {
      id: 'pfp-dexscreener',
      title: 'DexScreener & CoinGecko Token Icon',
      subtitle: '512×512 PNG • Verified 1:1 Square Ratio',
      platforms: ['all', 'dexscreener', 'coingecko', 'twitter', 'telegram'],
      type: 'image',
      aspectRatio: '1:1',
      badge: 'DexScreener & CoinGecko Spec',
      badgeColor: 'text-[#39ff14] bg-[#39ff14]/10 border-[#39ff14]/30',
      description: 'Clean boundary, centered mascot portrait compliant with DexScreener Enhanced Info and CoinGecko listing requirements.',
      previewContent: visual?.mascot_image_url ? (
        <img
          src={visual.mascot_image_url}
          alt={tokenName}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain p-2 rounded-xl"
        />
      ) : visual?.mascot_svg ? (
        <div
          dangerouslySetInnerHTML={{ __html: visual.mascot_svg }}
          className="w-full h-full p-2 flex items-center justify-center"
        />
      ) : (
        <div className="w-16 h-16 rounded-xl bg-[#ccff00] text-black font-black flex items-center justify-center text-xl font-mono">
          {ticker.replace('$', '').slice(0, 3)}
        </div>
      ),
      downloadFilename: `${ticker.replace('$', '')}_Profile_Icon_512x512.png`,
    },
    {
      id: 'header-banner',
      title: 'Twitter / X & DexScreener Header Banner',
      subtitle: '1500×500 PNG • 3:1 Aspect Ratio',
      platforms: ['all', 'dexscreener', 'twitter'],
      type: 'banner',
      aspectRatio: '3:1',
      badge: 'Twitter & DexScreener Profile',
      badgeColor: 'text-[#00f5ff] bg-[#00f5ff]/10 border-[#00f5ff]/30',
      description: 'High-impact panoramic header featuring official token ticker, slogan, and verified Contract Address.',
      previewContent: (
        <div className="w-full h-full bg-gradient-to-r from-[#0c1017] via-[#141926] to-[#0c1017] border border-[#232938] rounded-xl p-3 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-black font-mono text-[#ccff00]">{ticker}</span>
            <div className="text-[10px] text-white/80 font-mono truncate max-w-[140px]">{tokenName}</div>
            <div className="text-[8px] font-mono text-[#00f5ff]">{contractAddress.slice(0, 8)}...</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#ccff00]/20 text-[#ccff00] flex items-center justify-center font-mono font-bold text-xs">
            {ticker.replace('$', '').slice(0, 2)}
          </div>
        </div>
      ),
      downloadFilename: `${ticker.replace('$', '')}_Header_Banner_1500x500.png`,
    },
    {
      id: 'tg-portal',
      title: 'Telegram Portal & Buy-Bot Card',
      subtitle: '800×400 PNG • 2:1 Aspect Ratio',
      platforms: ['all', 'telegram'],
      type: 'banner',
      aspectRatio: '2:1',
      badge: 'Telegram Portal',
      badgeColor: 'text-[#0088cc] bg-[#0088cc]/10 border-[#0088cc]/30',
      description: 'Optimized welcome graphic and green candle buy alert template for high-speed Telegram channels.',
      previewContent: (
        <div className="w-full h-full bg-[#0d1520] border border-[#1b304d] rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-[#0088cc] font-bold">TELEGRAM PORTAL</span>
            <span className="text-[#39ff14] font-bold">🟢 BUY ALERT</span>
          </div>
          <div className="text-center font-mono">
            <div className="text-xs font-black text-white">{tokenName}</div>
            <div className="text-[9px] text-[#ccff00]">{ticker} • 100% Fair Launch</div>
          </div>
          <div className="text-[8px] text-[#8e99ac] text-center font-mono">
            t.me/{ticker.replace('$', '')}_Portal
          </div>
        </div>
      ),
      downloadFilename: `${ticker.replace('$', '')}_Telegram_Portal_800x400.png`,
    },
    {
      id: 'god-candle-shard',
      title: 'DexScreener "God Candle" Momentum Shard',
      subtitle: '600×600 PNG • Parabolic Breakout Template',
      platforms: ['all', 'dexscreener', 'twitter', 'telegram'],
      type: 'image',
      aspectRatio: '1:1',
      badge: 'Viral Momentum Shard',
      badgeColor: 'text-[#39ff14] bg-[#39ff14]/10 border-[#39ff14]/30',
      description: 'Parabolic green candle telemetry overlay formatted for Twitter community replies and Telegram breakout pumps.',
      previewContent: (
        <div className="w-full h-full bg-[#0a120c] border border-[#18361e] rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between text-[9px] font-mono text-[#39ff14]">
            <span className="font-bold">DEXSCREENER BREAKOUT</span>
            <span>+420.69%</span>
          </div>
          <div className="text-center font-mono">
            <div className="text-sm font-black text-[#39ff14]">GOD CANDLE DETECTED</div>
            <div className="text-[9px] text-white/80">{ticker} SENDING TO VALHALLA</div>
          </div>
          <div className="h-4 w-full rounded bg-[#0f2414] flex items-center px-1">
            <div className="w-3/4 h-2 rounded bg-gradient-to-r from-emerald-500 to-[#39ff14]"></div>
          </div>
        </div>
      ),
      downloadFilename: `${ticker.replace('$', '')}_God_Candle_Mobilize_Shard.png`,
    },
    {
      id: 'metadata-json',
      title: 'DexScreener & CoinGecko Listing JSON',
      subtitle: 'Structured On-Chain Token Parameters (.JSON)',
      platforms: ['all', 'dexscreener', 'coingecko', 'metadata'],
      type: 'code',
      badge: 'Official Listing Specs',
      badgeColor: 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/30',
      description: 'Pre-formatted JSON containing all metadata, tokenomics allocations, and revoked security authorities for listing forms.',
      previewContent: (
        <div className="w-full h-full bg-[#07090e] rounded-xl p-2.5 overflow-hidden text-[9px] font-mono text-[#8e99ac] leading-tight select-all">
          <pre className="text-[9px] font-mono text-emerald-400">
{`{
  "name": "${tokenName}",
  "symbol": "${ticker.replace('$', '')}",
  "mint": "${contractAddress.slice(0, 12)}...",
  "mint_authority": "REVOKED",
  "total_supply": "1B"
}`}
          </pre>
        </div>
      ),
      downloadFilename: `${ticker.replace('$', '')}_Listing_Metadata.json`,
      rawContent: metadataJson,
    },
  ];

  const filteredItems = assetItems.filter((item) =>
    activeFilter === 'all' ? true : item.platforms.includes(activeFilter)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#0c0e14] border-2 border-[#242b3b] rounded-3xl flex flex-col shadow-[0_0_50px_rgba(0,245,255,0.15)] overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-[#1e2433] bg-[#090b10] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00f5ff] to-[#ccff00] flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(0,245,255,0.3)]">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black font-mono uppercase text-white tracking-tight">
                  Brand Asset Hub &amp; Listing Kit
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#ccff00]/15 border border-[#ccff00]/30 text-[#ccff00] text-[10px] font-mono font-bold">
                  {ticker}
                </span>
              </div>
              <p className="text-xs text-[#8e99ac] font-mono">
                Pre-formatted graphics &amp; listing metadata for DexScreener, CoinGecko, X, and Telegram
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="hidden sm:flex px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00f5ff] to-[#39ff14] text-black font-mono font-black text-xs uppercase items-center gap-1.5 transition-transform hover:scale-105 shadow-lg cursor-pointer"
            >
              <FileArchive className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Zipping...' : 'Download Full Pack (.ZIP)'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#141822] hover:bg-[#1e2433] text-[#8e99ac] hover:text-white border border-[#232938] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Navigation Bar */}
        <div className="px-5 py-3 border-b border-[#1e2433] bg-[#0e121a] flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-[#1e2433] text-[#00f5ff] border border-[#00f5ff]/40 shadow-sm'
                  : 'text-[#8e99ac] hover:text-white bg-[#12151e] border border-transparent'
              }`}
            >
              All Assets ({assetItems.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('dexscreener')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'dexscreener'
                  ? 'bg-[#1e2433] text-[#39ff14] border border-[#39ff14]/40 shadow-sm'
                  : 'text-[#8e99ac] hover:text-white bg-[#12151e] border border-transparent'
              }`}
            >
              DexScreener
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('coingecko')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'coingecko'
                  ? 'bg-[#1e2433] text-[#ccff00] border border-[#ccff00]/40 shadow-sm'
                  : 'text-[#8e99ac] hover:text-white bg-[#12151e] border border-transparent'
              }`}
            >
              CoinGecko
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('twitter')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'twitter'
                  ? 'bg-[#1e2433] text-[#1d9bf0] border border-[#1d9bf0]/40 shadow-sm'
                  : 'text-[#8e99ac] hover:text-white bg-[#12151e] border border-transparent'
              }`}
            >
              Twitter / X
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('telegram')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'telegram'
                  ? 'bg-[#1e2433] text-[#0088cc] border border-[#0088cc]/40 shadow-sm'
                  : 'text-[#8e99ac] hover:text-white bg-[#12151e] border border-transparent'
              }`}
            >
              Telegram
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('metadata')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'metadata'
                  ? 'bg-[#1e2433] text-[#f59e0b] border border-[#f59e0b]/40 shadow-sm'
                  : 'text-[#8e99ac] hover:text-white bg-[#12151e] border border-transparent'
              }`}
            >
              Listing JSON
            </button>
          </div>

          {onGoToMemeStudio && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToMemeStudio();
              }}
              className="text-xs font-mono text-[#00f5ff] hover:underline flex items-center gap-1 shrink-0 whitespace-nowrap"
            >
              <span>Edit in Meme Studio</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Assets Grid Body */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto custom-scrollbar space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#121520] border border-[#232938] hover:border-[#38435c] transition-all space-y-3 flex flex-col justify-between shadow-lg group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                    <span className="text-[10px] font-mono text-[#8e99ac]">
                      {item.aspectRatio}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold font-mono text-white group-hover:text-[#00f5ff] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-[#8e99ac] font-mono">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Asset Visual Preview Box */}
                  <div className="w-full h-32 rounded-xl bg-[#080a0f] border border-[#1e2433] flex items-center justify-center overflow-hidden relative">
                    {item.previewContent}
                  </div>

                  <p className="text-[11px] text-[#8e99ac] font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-[#1e2433] flex items-center justify-between gap-2">
                  {item.rawContent ? (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.rawContent!, item.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#181d28] hover:bg-[#232938] text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-[#2d3139]"
                    >
                      {copiedKey === item.id ? <Check className="w-3.5 h-3.5 text-[#39ff14]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === item.id ? 'Copied JSON' : 'Copy JSON'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(contractAddress, item.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#181d28] hover:bg-[#232938] text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-[#2d3139]"
                    >
                      {copiedKey === item.id ? <Check className="w-3.5 h-3.5 text-[#39ff14]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === item.id ? 'Copied CA' : 'Copy CA'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleDownloadZip}
                    className="px-3 py-1.5 rounded-lg bg-[#1a2333] hover:bg-[#223047] text-[#00f5ff] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#00f5ff]/30"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Get File</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Bottom Footer Bar */}
        <div className="p-4 sm:p-5 border-t border-[#1e2433] bg-[#090b10] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs font-mono text-[#8e99ac] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#39ff14]" />
            <span>All assets are verified &amp; ready for DexScreener Enhanced Info, CoinGecko &amp; X</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#00f5ff] to-[#39ff14] text-black font-mono font-black text-xs uppercase flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-lg cursor-pointer"
            >
              <FileArchive className="w-4 h-4" />
              <span>{isZipping ? 'Packaging ZIP Archive...' : 'Download Full Brand Suite (.ZIP)'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
