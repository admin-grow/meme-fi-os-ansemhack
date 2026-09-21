import React, { useState } from 'react';
import {
  Twitter,
  X as CloseIcon,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Repeat,
  Heart,
  Bookmark,
  Share,
  Sparkles,
  Layers,
  Send
} from 'lucide-react';
import { Agent1NarrativeResult, TokenDeploymentData } from '../types';

interface TwitterThreadPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  narrative: Agent1NarrativeResult;
  deployment?: TokenDeploymentData | null;
  mascotSvg?: string;
}

export const TwitterThreadPreviewModal: React.FC<TwitterThreadPreviewModalProps> = ({
  isOpen,
  onClose,
  narrative,
  deployment,
  mascotSvg,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen) return null;

  const ticker = narrative.ticker.replace('$', '');
  const tokenName = narrative.token_name;
  const rawTweets = narrative.tweet_pack && narrative.tweet_pack.length > 0
    ? narrative.tweet_pack
    : [
        `⚡ Introducing $${ticker} (${tokenName}) — The next cultural movement on Solana!\n\nLore: "${narrative.tagline}"\n\n100% genesis LP burned. Mint & freeze authorities permanently revoked. Zero team allocation.`,
        `📖 THE ORIGIN OF $${ticker}:\n\n${narrative.lore}`,
        `🚀 HOW TO JOIN THE $${ticker} COMMUNITY:\n\n1. Visit the micro-site\n2. Inspect verified on-chain parameters on Solscan\n3. Engage with the community narrative\n\nContract: ${deployment?.mintAddress || 'SoL11111111111111111111111111111111111111112'}\n#Solana #MemeCoin`
      ];

  const handleCopySingle = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyFullThread = () => {
    const formatted = rawTweets
      .map((t, idx) => `[${idx + 1}/${rawTweets.length}]\n${t}`)
      .join('\n\n---\n\n');
    navigator.clipboard.writeText(formatted);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleTweetIntent = (text: string) => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleTweetAllIntent = () => {
    const firstTweet = `${rawTweets[0]}\n\n(🧵 1/${rawTweets.length} Thread Below 👇)`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(firstTweet)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id="twitter-thread-preview-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-[#0b0e14] border border-[#242b3b] rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#0e121a] border-b border-[#1e2536] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1d9bf0]/15 border border-[#1d9bf0]/30 flex items-center justify-center text-[#1d9bf0]">
              <Twitter className="w-4 h-4 fill-[#1d9bf0]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black font-sans text-white uppercase tracking-tight">
                  X / Twitter Thread Preview
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1d9bf0]/15 text-[#1d9bf0] font-bold border border-[#1d9bf0]/30">
                  {rawTweets.length} Tweets
                </span>
              </div>
              <p className="text-[11px] text-[#8e99ac] font-mono">
                Visual mock-up of the AI-synthesized launch narrative pack
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-copy-full-thread"
              type="button"
              onClick={handleCopyFullThread}
              className="px-3 py-1.5 rounded-lg bg-[#161c28] hover:bg-[#1e2738] border border-[#2d3748] hover:border-[#1d9bf0]/50 text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              title="Copy entire formatted thread to clipboard"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-[#39ff14]" /> : <Copy className="w-3.5 h-3.5 text-[#1d9bf0]" />}
              <span>{copiedAll ? 'Thread Copied!' : 'Copy Thread'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#161c28] text-[#8e99ac] hover:text-white hover:bg-[#202738] transition-colors cursor-pointer"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Callout Bar */}
        <div className="px-5 py-2.5 bg-[#101522] border-b border-[#1e2536] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono shrink-0">
          <div className="flex items-center gap-2 text-[#8e99ac]">
            <Sparkles className="w-3.5 h-3.5 text-[#ccff00]" />
            <span>Formatted for high-engagement viral reach on Crypto Twitter.</span>
          </div>
          <button
            id="btn-launch-thread-on-x"
            type="button"
            onClick={handleTweetAllIntent}
            className="w-full sm:w-auto px-3 py-1 rounded-lg bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(29,155,240,0.3)] transition-colors"
          >
            <Send className="w-3 h-3" />
            <span>Publish Opener to X ↗</span>
          </button>
        </div>

        {/* Scrollable Visual Thread Feed (X Mockup) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-0 bg-[#000000]">
          {rawTweets.map((tweetText, idx) => {
            const isLast = idx === rawTweets.length - 1;
            const isFirst = idx === 0;

            return (
              <div key={idx} className="relative flex gap-3.5 group">
                {/* Thread Connector Line & Avatar */}
                <div className="flex flex-col items-center shrink-0">
                  {/* Avatar with Mascot preview */}
                  <div className="w-10 h-10 rounded-full bg-[#16181c] border border-[#2f3336] flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative z-10">
                    {mascotSvg ? (
                      <div
                        className="w-full h-full p-1 flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: mascotSvg }}
                      />
                    ) : (
                      <span className="text-sm font-bold text-[#1d9bf0] font-mono">
                        {ticker.slice(0, 2)}
                      </span>
                    )}
                  </div>

                  {/* Vertical connecting line */}
                  {!isLast && (
                    <div className="w-0.5 bg-[#2f3336] flex-1 my-1 group-hover:bg-[#1d9bf0]/40 transition-colors" />
                  )}
                </div>

                {/* Tweet Body Container */}
                <div className={`flex-1 pb-6 ${!isLast ? 'border-b border-[#2f3336]/40' : ''}`}>
                  {/* Author Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap text-sm leading-none">
                      <span className="font-bold text-white hover:underline cursor-pointer">
                        {tokenName}
                      </span>
                      <span className="text-[#1d9bf0] text-xs">✓</span>
                      <span className="text-[#71767b] text-xs font-mono">
                        @{ticker}_solana
                      </span>
                      <span className="text-[#71767b] text-xs">·</span>
                      <span className="text-[#71767b] text-xs">Just now</span>
                      <span className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#16181c] text-[#1d9bf0] border border-[#2f3336]">
                        {idx + 1}/{rawTweets.length}
                      </span>
                    </div>

                    {/* Tweet Actions (Copy / Share Intent) */}
                    <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleCopySingle(tweetText, idx)}
                        className="p-1.5 rounded-lg bg-[#16181c] hover:bg-[#202327] text-[#71767b] hover:text-[#1d9bf0] border border-[#2f3336] text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                        title="Copy single tweet"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3 h-3 text-[#39ff14]" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span className="text-[10px]">{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTweetIntent(tweetText)}
                        className="p-1.5 rounded-lg bg-[#16181c] hover:bg-[#1d9bf0]/20 text-[#71767b] hover:text-[#1d9bf0] border border-[#2f3336] text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                        title="Post this tweet to X"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="text-[10px]">Post</span>
                      </button>
                    </div>
                  </div>

                  {/* Tweet Content Text */}
                  <div className="mt-2 text-[13.5px] leading-relaxed text-[#e7e9ea] font-sans whitespace-pre-wrap select-text">
                    {tweetText}
                  </div>

                  {/* Optional First Tweet Media Card (Mascot / Launch Card) */}
                  {isFirst && mascotSvg && (
                    <div className="mt-3 rounded-2xl overflow-hidden border border-[#2f3336] bg-[#0c1017] p-4 flex items-center justify-center max-h-48">
                      <div
                        className="w-32 h-32 flex items-center justify-center drop-shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                        dangerouslySetInnerHTML={{ __html: mascotSvg }}
                      />
                    </div>
                  )}

                  {/* Engagement Mock Bar */}
                  <div className="mt-3 flex items-center justify-between text-[#71767b] text-xs max-w-md pt-1">
                    <div className="flex items-center gap-1 hover:text-[#1d9bf0] cursor-pointer transition-colors">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="text-[11px]">42</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-[#00ba7c] cursor-pointer transition-colors">
                      <Repeat className="w-3.5 h-3.5" />
                      <span className="text-[11px]">189</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-[#f91880] cursor-pointer transition-colors">
                      <Heart className="w-3.5 h-3.5" />
                      <span className="text-[11px]">842</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-[#1d9bf0] cursor-pointer transition-colors">
                      <Bookmark className="w-3.5 h-3.5" />
                      <span className="text-[11px]">96</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-[#1d9bf0] cursor-pointer transition-colors">
                      <Share className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0e121a] border-t border-[#1e2536] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono shrink-0">
          <div className="text-[#8e99ac]">
            <span>Tip: </span>
            <span className="text-white">Post the thread sequentially or use the 1-click openers to seed community conversation.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#1e2536] hover:bg-[#283248] text-white font-bold transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
