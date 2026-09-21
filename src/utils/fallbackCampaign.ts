import { FullCampaignData, CategoryType } from '../types';
import { generateVectorMascotSvg } from './mascotSvgGenerator';

interface FallbackOptions {
  category?: CategoryType | string;
  prompt?: string;
  template_type?: string;
}

const NARRATIVE_PRESETS: Record<string, {
  name: string;
  ticker: string;
  tagline: string;
  lore: string;
  mascotPrompt: string;
  tweets: string[];
}> = {
  'Tech/AI Absurdism': {
    name: 'MemeFiCat',
    ticker: '$MFCAT',
    tagline: 'The official cybernetic feline orchestrating multi-agent AI meme deployments on Solana.',
    lore: 'Born inside the Solana SVM runtime, $MFCAT is the official genesis utility mascot of MemeFi OS. Armed with glowing cyber-goggles and multi-terminal command interfaces, MemeFiCat coordinates the 4 sequential AI agents, automates viral meme canvas synthesis, and purrs at 400 TPS with permanent 100% genesis LP token burn.',
    mascotPrompt: 'Cybernetic neon cat with glowing holographic sunglasses sitting on a supercomputer cluster terminal, cyberpunk pixel art',
    tweets: [
      '🐾 $MFCAT is officially deployed on Solana! The official genesis utility mascot of MemeFi OS is live. 100% genesis LP burned forever.',
      'Why chase ordinary tokens when the MemeFi OS mascot $MFCAT coordinates the entire 4-agent swarm on-chain? ⚡🐱',
      '⚡ Community mobilization active for $MFCAT! Grab your allocation on the ClawPump bonding curve before Raydium graduation.'
    ],
  },
  'Degenerate/Lore Culture': {
    name: 'Midnight Ramen',
    ticker: '$RAMEN',
    tagline: 'Fueled by 4 AM green candles and instant broth.',
    lore: 'Forged in the depths of late-night trading sessions when the charts never sleep. $RAMEN is the official currency of degenerate conviction.',
    mascotPrompt: 'Steaming bowl of spicy cyberpunk ramen with neon green noodles and laser chopstick eyes',
    tweets: [
      '🍜 $RAMEN is officially live on Solana! Built for every degen staring at 1-minute candles at 4 AM.',
      'No venture capitalists. No locked tokens. Just pure sodium and on-chain culture. $RAMEN',
      'Grab your chopsticks! $RAMEN community broadcast is now live.'
    ],
  },
  'Animals/Creatures': {
    name: 'Cosmic Capy',
    ticker: '$CAPY',
    tagline: 'The most unbothered creature in the entire multiverse.',
    lore: 'Floating peacefully through Solana blocks without a single worry. $CAPY teaches the blockchain the supreme art of supreme chill.',
    mascotPrompt: 'Zen capybara meditating in an astronaut helmet floating serenely through a nebula',
    tweets: [
      '🐾 $CAPY has landed on Solana! Stay unbothered, stay decentralized.',
      'Markets go up, markets go down, $CAPY stays completely peaceful in orbit.',
      'Join the cosmic chill pack with $CAPY on ClawPump today!'
    ],
  },
  'Political/Satire': {
    name: 'Consensus Bureau',
    ticker: '$BUREAU',
    tagline: 'Eliminating red tape with cryptographic finality.',
    lore: 'A satirical autonomous committee dedicated to approving every meme with maximum procedural complexity and zero real delays.',
    mascotPrompt: 'Futuristic robotic official in a suit stamping a glowing red approved badge onto a blockchain ledger',
    tweets: [
      '🏛️ The $BUREAU is officially in session on Solana! Order in the meme court.',
      'By decree of the decentralized committee, $BUREAU has burned all genesis LP tokens forever.',
      'Submit your meme motions to the $BUREAU floor today!'
    ],
  },
};

export function generateClientFallbackCampaign(options: FallbackOptions = {}): FullCampaignData {
  const category = (options.category || 'Tech/AI Absurdism') as string;
  const prompt = (options.prompt || '').trim();
  const templateType = options.template_type || 'Breaking News';

  const preset = NARRATIVE_PRESETS[category] || NARRATIVE_PRESETS['Tech/AI Absurdism'];

  // If user provided a prompt, customize the name & ticker deterministically
  let tokenName = preset.name;
  let ticker = preset.ticker;
  let tagline = preset.tagline;
  let lore = preset.lore;
  let mascotPrompt = preset.mascotPrompt;

  if (prompt.length > 0) {
    const cleanWord = prompt.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    const words = cleanWord.split(/\s+/).filter(Boolean);
    if (words.length > 0) {
      tokenName = words.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      const rawTicker = words.map(w => w.charAt(0)).join('').toUpperCase();
      ticker = rawTicker.length >= 3 ? `$${rawTicker.slice(0, 5)}` : `$${(rawTicker + 'SOL').slice(0, 4)}`;
      tagline = `The official ${tokenName} narrative protocol on Solana.`;
      lore = `Born from internet culture and community demand, ${tokenName} (${ticker}) brings organic viral energy to the Solana blockchain with 100% fair launch transparency.`;
      mascotPrompt = `Artistic vector mascot representing ${tokenName}, high-tech cyberpunk lighting, clean centered emblem, high resolution`;
    }
  }

  const cleanTicker = ticker.replace('$', '');
  const svg = generateVectorMascotSvg(cleanTicker, tokenName, mascotPrompt, category, 'Cyberpunk Pixel Art');

  return {
    agent1: {
      token_name: tokenName,
      ticker: ticker,
      tagline: tagline,
      viral_score: 94,
      lore: lore,
      safety_adjustment: null,
      tweet_pack: preset.tweets.map(t => t.replace(/(\$NCAT|\$RAMEN|\$CAPY|\$BUREAU)/g, ticker).replace(/(Neural Catnip|Midnight Ramen|Cosmic Capy|Consensus Bureau)/g, tokenName)),
      mascot_prompt: mascotPrompt,
      agent0_audit: {
        verified: true,
        intercepted: false,
        compliance_score: 100,
      },
    },
    agent2: {
      image_generation_prompt: `A centered, high resolution vector logo of ${mascotPrompt}, crisp clean outlines, vibrant cyberpunk lighting, transparent background, 512x512 resolution`,
      negative_prompt: 'text, watermark, low quality, blurry, cropped, signature',
      meme_overlay: {
        template_type: templateType,
        top_header: `BREAKING: ${ticker} MOMENTUM DETECTED`,
        bottom_caption: `${tagline}`,
        ticker_watermark: ticker,
      },
      mascot_svg: svg,
    },
    agent3: {
      telegram_message: `🚀 <b>NEW ${ticker} (${tokenName}) FAIR LAUNCH!</b>\n\n⚡ The community agents detected a viral narrative opportunity.\n\n🎯 <b>Lore:</b> ${tagline}\n\n👇 <b>Click to participate:</b>`,
      button_label: `⚡ Execute ${ticker} Broadcast`,
      button_url: `https://x.com/intent/tweet?text=${encodeURIComponent(`Shipping with ${ticker} (${tokenName}) on Solana via @clawpumptech! Fair launch bonding curve active.`)}`,
      alert_type: 'Fair Launch',
      buy_volume_sol: 2.5,
      market_cap_usd: '$69,420',
    },
  };
}
