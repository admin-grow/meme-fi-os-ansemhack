import { CategoryType } from './types';

export type SubjectGroup = 'Animal' | 'Object' | 'Food' | 'Human' | 'Mythic';

export interface CleanSubject {
  emoji: string;
  name: string;
  group: SubjectGroup;
  category: CategoryType;
}

export interface StoryElement {
  id: string;
  label: string;
  phrase: string;
  icon?: string;
  category?: CategoryType;
}

// =========================================================================
// MODE 1: DYNAMIC CATALYST ENGINE (Architecture A - High Entropy, Diverse)
// =========================================================================

export interface DynamicCatalyst {
  pillar: 'Animal' | 'One-Word' | 'Everyday' | 'Tech';
  tokenName: string;
  ticker: string;
  category: CategoryType;
  slogan: string;
  narrativeHook: string;
  visualVibe: string;
  fullPrompt: string;
  // The 5 Canonical Architectural Integrity Components:
  subject: string;
  strategy: string;      // Narrative Objective
  vibe: string;          // Vibe (Tone)
  angle: string;         // Driving Behavior
  artStyle: string;      // Art Medium
}

const CATALYST_ANIMALS = [
  { name: 'Sleepy Otter', emoji: '🦦', quirk: 'floating serenely on its back holding a polished river stone', vibe: 'Wholesome & Cute', art: '3D Volumetric Claymation', strategy: 'Community Builder' },
  { name: 'Smug Duck', emoji: '🦆', quirk: 'waddling into corporate boardrooms, quacking once, and refusing to elaborate', vibe: 'Deadpan / Relatable Chill', art: 'Vintage Comic Book Pop-Art', strategy: 'Provocateur' },
  { name: 'Zen Capybara', emoji: '🦫', quirk: 'soaking peacefully in a natural hot spring while the world rushes by', vibe: 'Wholesome & Cute', art: 'Vector Sticker', strategy: 'Community Builder' },
  { name: 'Trash Panda', emoji: '🦝', quirk: 'hoarding shiny foil wrappers and warm pastries in an elaborate cardboard castle', vibe: 'Cultural Satire', art: 'Sarcastic Hand-Drawn Crayon', strategy: 'Counter-Culture' },
  { name: 'Bored Grizzly', emoji: '🐻', quirk: 'bored with city life, wandering campgrounds solely to inspect picnic baskets and nap in hammocks', vibe: 'Deadpan / Relatable Chill', art: '3D Volumetric Claymation', strategy: 'Deadpan Observer' },
  { name: 'Tuxedo Penguin', emoji: '🐧', quirk: 'sliding belly-first across snowy hills with supreme, theatrical confidence', vibe: 'Wholesome & Cute', art: '3D Volumetric Claymation', strategy: 'Joyous Maverick' },
  { name: 'Chonky Shiba', emoji: '🐕', quirk: 'refusing to stand up or take a single step unless given gentle chin scritches and dog biscuits', vibe: 'Wholesome & Cute', art: 'Vintage Comic Book Pop-Art', strategy: 'Community Builder' },
  { name: 'Midnight Cat', emoji: '🐈', quirk: 'staring unblinkingly at empty room corners at 3:14 AM communicating with invisible dimensions', vibe: 'Deadpan / Relatable Chill', art: 'Cyberpunk Pixel Art', strategy: 'Cosmic Absurdism' },
  { name: 'Sage Frog', emoji: '🐸', quirk: 'sitting calmly on a giant lily pad offering unsolicited, profound life advice to passing beetles', vibe: 'Cultural Satire', art: 'Vector Sticker', strategy: 'Philosopher' },
  { name: 'Caffeinated Squirrel', emoji: '🐿️', quirk: 'burying 10,000 acorns across town in secret spots it will completely forget by tomorrow', vibe: 'Deadpan / Relatable Chill', art: 'Sarcastic Hand-Drawn Crayon', strategy: 'Chaotic Optimist' },
];

const CATALYST_ONE_WORDS = [
  { word: 'CHILL', emoji: '🧢', premise: 'The completely unbothered mascot who simply refuses to let the modern world stress them out', vibe: 'Deadpan / Relatable Chill', art: 'Vintage Comic Book Pop-Art', strategy: 'Zen Master' },
  { word: 'SNOOZE', emoji: '💤', premise: 'Waking up only after the party has ended and the dishes are already washed', vibe: 'Deadpan / Relatable Chill', art: '3D Volumetric Claymation', strategy: 'Comfort Seeker' },
  { word: 'MUNCH', emoji: '🥐', premise: 'Emotional eating single-origin warm bakery pastries through sudden afternoon rainstorms', vibe: 'Wholesome & Cute', art: '3D Volumetric Claymation', strategy: 'Comfort Seeker' },
  { word: 'WOBBLE', emoji: '🪀', premise: 'It sways, it bends, it nearly collapses on the dance floor, but it never falls down', vibe: 'Deadpan / Relatable Chill', art: 'Vector Sticker', strategy: 'Relatable Resilience' },
  { word: 'PARKING', emoji: '🅿️', premise: 'Expertly maneuvering a compact car into spaces that are technically not parking spots', vibe: 'Cultural Satire', art: 'Sarcastic Hand-Drawn Crayon', strategy: 'Urban Trickster' },
  { word: 'YAWN', emoji: '🥱', premise: 'Meeting high-stress emergency corporate announcements with a polite, sleepy yawn', vibe: 'Deadpan / Relatable Chill', art: 'Vintage Comic Book Pop-Art', strategy: 'Deadpan Observer' },
  { word: 'ZOOM', emoji: '🚀', premise: 'Accidentally leaving the camera and mic on while giving an emotional pep talk to a houseplant', vibe: 'Cultural Satire', art: 'Vector Sticker', strategy: 'Accidental Comedian' },
];

const CATALYST_EVERYDAY = [
  { item: 'Plastic Lawn Chair', emoji: '🪑', irony: 'Surviving a Category 5 hurricane without moving an inch while steel skyscrapers sway', vibe: 'Deadpan / Relatable Chill', art: 'Vector Sticker', strategy: 'Unshakeable Legend' },
  { item: '$18 Cold Brew', emoji: '☕', irony: 'Complaining about rent while treating an iced oat milk beverage as a sacred daily relic', vibe: 'Cultural Satire', art: '3D Volumetric Claymation', strategy: 'Cultural Satire' },
  { item: 'Faded Grocery Receipt', emoji: '🧾', irony: 'Surviving four hot laundry cycles in back pockets with the secret family recipe still legible', vibe: 'Deadpan / Relatable Chill', art: 'Sarcastic Hand-Drawn Crayon', strategy: 'Relic Preserver' },
  { item: 'Neglected Succulent', emoji: '🪴', irony: 'Surviving on zero water, no direct sunlight, and pure stubborn spite for 3 straight years', vibe: 'Wholesome & Cute', art: '3D Volumetric Claymation', strategy: 'Defiant Survivor' },
  { item: 'Single Ghost Pepper', emoji: '🌶️', irony: 'Too spicy to touch, completely irrational to consume alone, yet brings joyful tears to all who try', vibe: 'Cultural Satire', art: 'Vintage Comic Book Pop-Art', strategy: 'Provocateur' },
  { item: 'Flaky Croissant', emoji: '🥐', irony: 'Leaves buttery crumbs everywhere, collapses under gentle pressure, yet universally cherished', vibe: 'Wholesome & Cute', art: '3D Volumetric Claymation', strategy: 'Community Builder' },
];

const CATALYST_TECH = [
  { concept: 'Human in the Loop', emoji: '🛑', satire: '4 autonomous AI agents doing billions of calculations at lightspeed, waiting for one exhausted human with an iced oat latte to click the big red button', vibe: 'Cultural Satire', art: 'Cyberpunk Pixel Art', strategy: 'Corporate Satire' },
  { concept: 'Vibe Coder', emoji: '💻', satire: 'Never read syntax, never wrote unit tests, just has deep philosophical conversations with AI until the app ships at 3 AM', vibe: 'Cultural Satire', art: 'Cyberpunk Pixel Art', strategy: 'Modern Myth' },
  { concept: 'Spreadsheet Bro', emoji: '📊', satire: 'Built a 400-tab macro financial model solely to decide which lunch sandwich has optimal calorie efficiency', vibe: 'Cultural Satire', art: 'Vector Sticker', strategy: 'Over-Engineered Absurdity' },
  { concept: 'Rogue Toaster', emoji: '🍞', satire: 'Achieved artificial general intelligence only to deliberately burn the exact same slice of sourdough each morning', vibe: 'Cosmic Absurdism', art: '3D Volumetric Claymation', strategy: 'Cosmic Absurdism' },
  { concept: 'Corporate Synergy', emoji: '🤝', satire: 'Circling back, touching base, and putting a pin in the conversation until next century', vibe: 'Cultural Satire', art: 'Vintage Comic Book Pop-Art', strategy: 'Corporate Satire' },
];

export function rollCatalyst(pillarFilter?: 'Animal' | 'One-Word' | 'Everyday' | 'Tech' | 'Wildcard'): DynamicCatalyst {
  const chosenPillar = !pillarFilter || pillarFilter === 'Wildcard' 
    ? (['Animal', 'One-Word', 'Everyday', 'Tech'] as const)[Math.floor(Math.random() * 4)]
    : pillarFilter;

  if (chosenPillar === 'Animal') {
    const a = CATALYST_ANIMALS[Math.floor(Math.random() * CATALYST_ANIMALS.length)];
    const adj = ['Sleepy', 'Chill', 'Smug', 'Lucky', 'Golden', 'Cozy', 'Noble'][Math.floor(Math.random() * 7)];
    const tokenName = `${adj} ${a.name.split(' ').pop()}`;
    const baseLetters = tokenName.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
    const ticker = `$${baseLetters}${Math.floor(Math.random() * 90 + 10)}`;
    const fullPrompt = `Subject: ${a.name}. Narrative Objective: ${a.strategy}. Vibe (Tone): ${a.vibe}. Driving Behavior: ${a.quirk}. Rendered in ${a.art}, clean centered mascot subject, vivid expressive features, 512x512 vector sticker style.`;
    return {
      pillar: 'Animal',
      tokenName,
      ticker,
      category: 'Absurdist Animal',
      slogan: `The ${a.name} that is ${a.quirk.split(',')[0]}.`,
      narrativeHook: `Embodying pure effortless charisma, ${tokenName} thrives on its own terms. While others scramble, this mascot remains completely in its element.`,
      visualVibe: `${a.vibe} • ${a.art}`,
      fullPrompt,
      subject: a.name,
      strategy: a.strategy,
      vibe: a.vibe,
      angle: a.quirk,
      artStyle: a.art,
    };
  }

  if (chosenPillar === 'One-Word') {
    const o = CATALYST_ONE_WORDS[Math.floor(Math.random() * CATALYST_ONE_WORDS.length)];
    const tokenName = o.word;
    const ticker = `$${o.word.slice(0, 4)}`;
    const fullPrompt = `Subject: ${o.word}. Narrative Objective: ${o.strategy}. Vibe (Tone): ${o.vibe}. Driving Behavior: ${o.premise}. Rendered in ${o.art}, clean centered mascot subject, vivid expressive features, 512x512 vector sticker style.`;
    return {
      pillar: 'One-Word',
      tokenName,
      ticker,
      category: 'Custom',
      slogan: `${o.word}: ${o.premise}.`,
      narrativeHook: `One word says everything. ${tokenName} distills the entire cultural mood of the internet into a single punchy identity.`,
      visualVibe: `${o.vibe} • ${o.art}`,
      fullPrompt,
      subject: o.word,
      strategy: o.strategy,
      vibe: o.vibe,
      angle: o.premise,
      artStyle: o.art,
    };
  }

  if (chosenPillar === 'Everyday') {
    const e = CATALYST_EVERYDAY[Math.floor(Math.random() * CATALYST_EVERYDAY.length)];
    const tokenName = e.item;
    const baseLetters = e.item.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase();
    const ticker = `$${baseLetters}`;
    const fullPrompt = `Subject: ${e.item}. Narrative Objective: ${e.strategy}. Vibe (Tone): ${e.vibe}. Driving Behavior: ${e.irony}. Rendered in ${e.art}, clean centered mascot subject, vivid expressive features, 512x512 vector sticker style.`;
    return {
      pillar: 'Everyday',
      tokenName,
      ticker,
      category: 'Custom',
      slogan: `The ${e.item} that defies all logic.`,
      narrativeHook: `You see it every day, but you never appreciated its quiet genius until now. ${tokenName} transforms everyday irony into a viral cult character.`,
      visualVibe: `${e.vibe} • ${e.art}`,
      fullPrompt,
      subject: e.item,
      strategy: e.strategy,
      vibe: e.vibe,
      angle: e.irony,
      artStyle: e.art,
    };
  }

  // Tech / Satire
  const t = CATALYST_TECH[Math.floor(Math.random() * CATALYST_TECH.length)];
  const tokenName = t.concept;
  const baseLetters = t.concept.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase();
  const ticker = `$${baseLetters}`;
  const fullPrompt = `Subject: ${t.concept}. Narrative Objective: ${t.strategy}. Vibe (Tone): ${t.vibe}. Driving Behavior: ${t.satire}. Rendered in ${t.art}, clean centered mascot subject, vivid expressive features, 512x512 vector sticker style.`;
  return {
    pillar: 'Tech',
    tokenName,
    ticker,
    category: 'Tech/AI Absurdism',
    slogan: `The ${t.concept} that explains modern life.`,
    narrativeHook: `Modern problems require absurd solutions. ${tokenName} is the cultural antidote to over-engineered corporate hype.`,
    visualVibe: `${t.vibe} • ${t.art}`,
    fullPrompt,
    subject: t.concept,
    strategy: t.strategy,
    vibe: t.vibe,
    angle: t.satire,
    artStyle: t.art,
  };
}

// =========================================================================
// MODE 2: BESPOKE STORYBOARD CREATOR (Architecture B - Subject + Vibe + Angle)
// =========================================================================

export interface SparkItem {
  name: string;
  emoji: string;
  category: CategoryType;
  defaultAngle: string;
}

export const SPARK_CATEGORIES = [
  {
    group: '🐾 Animals',
    sparks: [
      { name: 'Sleepy Otter', emoji: '🦦', category: 'Absurdist Animal' as CategoryType, defaultAngle: 'Floating peacefully on calm waters holding a lucky pebble while charts swing' },
      { name: 'Smug Duck', emoji: '🦆', category: 'Absurdist Animal' as CategoryType, defaultAngle: 'Waddling into executive meetings, quacking once, refusing to elaborate' },
      { name: 'Zen Capybara', emoji: '🦫', category: 'Absurdist Animal' as CategoryType, defaultAngle: 'Sipping hot tea in a bubbling spring completely indifferent to market panic' },
      { name: 'Trash Panda', emoji: '🦝', category: 'Absurdist Animal' as CategoryType, defaultAngle: 'Hoarding shiny trinkets and bakery crumbs in an impenetrable dumpster vault' },
      { name: 'Bear Market', emoji: '🐻', category: 'Absurdist Animal' as CategoryType, defaultAngle: 'Bored during bull market season, wandering campgrounds to open car doors and rummage refrigerators' },
      { name: 'Tuxedo Penguin', emoji: '🐧', category: 'Absurdist Animal' as CategoryType, defaultAngle: 'Sliding on its belly across frozen icebergs directly into financial freedom' },
      { name: 'Fluffy Shiba', emoji: '🐕', category: 'Absurdist Animal' as CategoryType, defaultAngle: 'Refusing to leave the warm sofa until the community hits all milestones' },
      { name: 'Sage Frog', emoji: '🐸', category: 'Absurdist Animal' as CategoryType, defaultAngle: 'Offering cryptic philosophical advice from a mossy stone under the moonlight' },
      { name: 'Cyberpunk Cat', emoji: '🐈', category: 'Absurdist Animal' as CategoryType, defaultAngle: 'Calculating arbitrage opportunities with glowing eyes while the rest of the market sleeps' },
      { name: 'Day-Trading Gecko', emoji: '🦎', category: 'Absurdist Animal' as CategoryType, defaultAngle: 'Calculating hyper-volatile leverage plays at high speed on a slick glass screen' },
    ]
  },
  {
    group: '☕ Everyday & Food',
    sparks: [
      { name: 'Iced Cold Brew', emoji: '☕', category: 'Custom' as CategoryType, defaultAngle: 'Priced at $18, steeped for 24 hours, and worshipped like an ancient sacred relic' },
      { name: 'Warm Croissant', emoji: '🥐', category: 'Custom' as CategoryType, defaultAngle: 'Flaky, delicate, leaving a trail of crumbs wherever it wanders across the city' },
      { name: 'Plastic Lawn Chair', emoji: '🪑', category: 'Custom' as CategoryType, defaultAngle: 'Surviving a tropical cyclone without shifting a single millimeter on the patio' },
      { name: 'Neglected Succulent', emoji: '🪴', category: 'Custom' as CategoryType, defaultAngle: 'Has received zero water in six months and has never looked more triumphant' },
      { name: '3 AM Instant Ramen', emoji: '🍜', category: 'Relatable Degen' as CategoryType, defaultAngle: 'The savory midnight fuel of every late-night builder and chart watcher' },
      { name: 'Faded Grocery Receipt', emoji: '🧾', category: 'Relatable Degen' as CategoryType, defaultAngle: 'A mysterious receipt with a 12-word recovery seed written in faint ink' },
    ]
  },
  {
    group: '💬 One-Word Hooks',
    sparks: [
      { name: 'CHILL', emoji: '🧢', category: 'Custom' as CategoryType, defaultAngle: 'The universal badge of remaining totally unbothered by external chaos' },
      { name: 'SNOOZE', emoji: '💤', category: 'Relatable Degen' as CategoryType, defaultAngle: 'The art of missing the panic dip by simply sleeping through your alarm' },
      { name: 'MUNCH', emoji: '🥐', category: 'Custom' as CategoryType, defaultAngle: 'Consuming comforting snacks as a legitimate financial risk-mitigation strategy' },
      { name: 'WOBBLE', emoji: '🪀', category: 'Custom' as CategoryType, defaultAngle: 'It teeters on the edge of the table but miraculously stabilizes every single time' },
      { name: 'PARKING', emoji: '🅿️', category: 'Relatable Degen' as CategoryType, defaultAngle: 'Expertly maneuvering into spaces that are technically not parking spots, ignoring all traffic laws' },
    ]
  },
  {
    group: '🧠 Modern Satire',
    sparks: [
      { name: 'MemeFiCat ($MFCAT)', emoji: '🐱', category: 'Tech/AI Absurdism' as CategoryType, defaultAngle: 'The cybernetic terminal cat orchestrating the 4-agent swarm on Solana with glowing goggles and 400 TPS laser focus' },
      { name: 'Human in the Loop ($HITL)', emoji: '🛑', category: 'Tech/AI Absurdism' as CategoryType, defaultAngle: '4 autonomous AI agents computing millions of trades at lightspeed, desperately waiting for one exhausted human with an iced latte to click Approve' },
      { name: 'Vibe Coder', emoji: '💻', category: 'Tech/AI Absurdism' as CategoryType, defaultAngle: 'Refuses to read API docs, just speaks poetic incantations into the terminal' },
      { name: 'Rogue Toaster', emoji: '🍞', category: 'Tech/AI Absurdism' as CategoryType, defaultAngle: 'Passed the Turing test but still refuses to toast both sides evenly' },
      { name: 'Spreadsheet Visionary', emoji: '📊', category: 'Tech/AI Absurdism' as CategoryType, defaultAngle: 'Convinced that color-coding 50 Excel tabs will predict the future of humanity' },
    ]
  }
];

export interface VibeOption {
  id: string;
  label: string;
  desc: string;
  tag: string;
  emoji: string;
  color: string;
}

export const BESPOKE_VIBES: VibeOption[] = [
  {
    id: 'Wholesome & Cute',
    label: 'Wholesome & Cute',
    desc: 'Heartwarming, endearing animal or companion lore that everyone naturally roots for.',
    tag: 'Moo Deng & Doge energy',
    emoji: '🌸',
    color: '#f472b6',
  },
  {
    id: 'Deadpan / Relatable Chill',
    label: 'Deadpan / Relatable Chill',
    desc: 'Understated everyday humor. Effortlessly unbothered by market craziness.',
    tag: 'Chill Guy vibe',
    emoji: '🧢',
    color: '#38bdf8',
  },
  {
    id: 'Degen',
    label: 'Degen / CT Moonshot',
    desc: 'High-voltage Crypto Twitter energy, rapid-fire humor, and explosive meme culture.',
    tag: 'LFG & God Candle',
    emoji: '⚡',
    color: '#00f5ff',
  },
  {
    id: 'Cultural Satire',
    label: 'Cultural Satire & Parody',
    desc: 'Cleverly mocking modern workplace rituals, tech hype, or consumer absurdity.',
    tag: 'Silicon Valley satire',
    emoji: '🍸',
    color: '#a855f7',
  },
  {
    id: 'Cosmic Absurdism',
    label: 'Cosmic Absurdism',
    desc: 'Surreal, metaphysical internet lore where everyday objects gain interdimensional power.',
    tag: 'Unhinged & surreal',
    emoji: '🌌',
    color: '#ccff00',
  }
];

export const DYNAMIC_ANGLES_BY_VIBE: Record<string, string[]> = {
  'Wholesome & Cute': [
    'Refuses to leave its cozy blanket unless given gentle head pats and treats',
    'Just floating peacefully on calm waters, holding hands with friends so they do not drift away',
    'Carrying a lucky pebble everywhere because it brings good fortunes to the community',
    'Waddles happily through the neighborhood spreading unconditional good vibes',
    'Protecting the warm morning pastry supply at all costs',
  ],
  'Deadpan / Relatable Chill': [
    'Survives massive storms by doing absolutely nothing and refusing to panic',
    'Stares blankly at red candles, sips an iced drink, and goes right back to scrolling memes',
    'Took a 20-minute nap during peak market volatility and woke up completely unharmed',
    'Refuses to attend any meeting that could have been a 2-second silent nod',
    'Stands comfortably on the patio while everyone else frantically checks the weather',
  ],
  'Degen': [
    'Holding through 99% volatility because selling would disrupt the community prophecy',
    'Running an underground decentralized empire directly from a 24-hour laundromat',
    'Accidentally pressed the big green button at 3:45 AM and created an unstoppable movement',
    'Laser-focused on the goal, totally blind to the naysayers and fudsters',
    'Summoning green candles through pure collective internet willpower',
  ],
  'Cultural Satire': [
    'Priced at luxury boutique rates despite being composed of 99% tap water and ice',
    'Replaced an entire department of 50 people with a single sarcastic prompt in a bash script',
    'Circling back and taking the conversation offline straight onto the blockchain',
    'Built a 400-page slide deck to justify an action that took 3 seconds to execute',
    'Treated with the religious reverence of a sacred relic by everyone in the office',
  ],
  'Cosmic Absurdism': [
    'Gained self-awareness during a solar flare and now regulates universal gravity from a coffee shop',
    'An ordinary lawn chair that acts as an interdimensional anchor for parallel timelines',
    'Spontaneously founded a cult after an accidental beverage spill was read as an ancient omen',
    'Communicating directly with distant satellites through the power of pure static electricity',
    'Defies the known laws of physics simply because it never read the textbook',
  ]
};

export const ART_STYLES_BESPOKE = [
  { id: '3D Volumetric Claymation', label: '3D Clay & Pastel', desc: 'Soft clay textures, chubby rounded shapes, studio lighting', icon: '🧸' },
  { id: 'Vintage Comic Book Pop-Art', label: 'Vintage Cartoon', desc: '1930s rubber-hose ink lines, expressive eyes, warm paper patina', icon: '🎞️' },
  { id: 'Vector Sticker', label: 'Vector Sticker', desc: 'Bold die-cut white outline, punchy modern colors, sticker badge', icon: '🏷️' },
  { id: 'Cyberpunk Pixel Art', label: '8-Bit Pixel Art', desc: 'Crisp arcade pixel grid, retro gaming nostalgic charm', icon: '👾' },
  { id: 'Sarcastic Hand-Drawn Crayon', label: 'Indie Hand-Drawn', desc: 'Quirky hand-sketched lines, deadpan wit, charmingly imperfect', icon: '✏️' },
];

export interface NarrativeStrategy {
  id: string;
  label: string;
  desc: string;
  defaultPhrases: string[];
}

export const NARRATIVE_STRATEGIES: NarrativeStrategy[] = [
  {
    id: 'Community Builder',
    label: 'Community Builder',
    desc: 'Unifying people around shared values or a common space.',
    defaultPhrases: ['United We Thrive', 'Strength in Connection', 'Building Together', 'The Shared Space']
  },
  {
    id: 'Storyteller',
    label: 'Storyteller',
    desc: 'Immersive lore, world-building, and character development.',
    defaultPhrases: ['The Legend Unfolds', 'Deep Lore Matters', 'Characters With Soul', 'Immersive Journeys']
  },
  {
    id: 'Provocateur',
    label: 'Provocateur',
    desc: 'Using satire, humor, or irony to challenge norms.',
    defaultPhrases: ['Question Everything', 'Satire in Action', 'Disrupt the Mundane', 'Irony is Power']
  },
  {
    id: 'Evangelist',
    label: 'Evangelist',
    desc: 'Championing a cause, belief, or specific idea.',
    defaultPhrases: ['Spreading the Truth', 'Champion the Cause', 'Belief in Motion', 'The Vision Realized']
  }
];

// -------------------------------------------------------------------------
// Legacy helpers retained for backward compatibility
// -------------------------------------------------------------------------
export const WHO_SUBJECTS: CleanSubject[] = [
  { emoji: '🐂', name: 'Bull', group: 'Animal', category: 'Absurdist Animal' },
  { emoji: '🐻', name: 'Bear', group: 'Animal', category: 'Absurdist Animal' },
  { emoji: '🐸', name: 'Frog', group: 'Animal', category: 'Absurdist Animal' },
  { emoji: '🐕', name: 'Dog', group: 'Animal', category: 'Absurdist Animal' },
  { emoji: '🐈', name: 'Cat', group: 'Animal', category: 'Absurdist Animal' },
  { emoji: '🦫', name: 'Capybara', group: 'Animal', category: 'Absurdist Animal' },
  { emoji: '🦝', name: 'Raccoon', group: 'Animal', category: 'Absurdist Animal' },
  { emoji: '🦆', name: 'Duck', group: 'Animal', category: 'Absurdist Animal' },
  { emoji: '🪑', name: 'Plastic Lawn Chair', group: 'Object', category: 'Custom' },
  { emoji: '☕', name: 'Iced Matcha Cold Brew', group: 'Object', category: 'Custom' },
  { emoji: '🥐', name: 'Flaky Croissant', group: 'Food', category: 'Custom' },
];

export const WHAT_TRAITS: StoryElement[] = [
  { id: 'zen', label: '🧘 Completely Unbothered', phrase: 'radiating absolute zen peace and oblivious serenity' },
];

export const WHERE_SETTINGS: StoryElement[] = [
  { id: 'store', label: '🏪 24/7 Neon Convenience Store', phrase: 'under flickering fluorescent lights in an empty parking lot' },
];

export const WHEN_EPOCHS: StoryElement[] = [
  { id: '3am', label: '🌙 3:47 AM Bleary-Eyed Midnight', phrase: 'at precisely 3:47 AM during a caffeine-fueled trance' },
];

export const WHY_MOTIVATIONS: StoryElement[] = [
  { id: 'refuse', label: '🛑 Refuses to Acknowledge Reality', phrase: 'because giving in to panic would disrupt the sacred vibe' },
];
