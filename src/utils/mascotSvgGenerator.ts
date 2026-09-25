// Deterministic client-side SVG mascot generator ensuring mascots always render crisply
export function generateVectorMascotSvg(
  ticker: string,
  tokenName: string,
  mascotPrompt: string = '',
  category: string = 'Tech/AI Absurdism',
  style: string = 'Cyberpunk Pixel Art'
): string {
  const normStyle = (style || 'Cyberpunk').toLowerCase();
  const lowerPrompt = `${mascotPrompt} ${tokenName} ${category}`.toLowerCase();

  // Deterministic seed from ticker + tokenName + prompt
  let seed = 0;
  const str = ticker + tokenName + mascotPrompt;
  for (let i = 0; i < str.length; i++) {
    seed = (seed << 5) - seed + str.charCodeAt(i);
    seed |= 0;
  }
  const absSeed = Math.abs(seed);

  // Dynamic Neon Cyber Palettes
  const neonPalettes = [
    { bg1: '#0b1120', bg2: '#022c22', stroke1: '#00ff88', stroke2: '#00f0ff', skin: '#10b981', accent: '#059669', glow: '#00ff88' },
    { bg1: '#1a0b2e', bg2: '#090514', stroke1: '#d946ef', stroke2: '#8b5cf6', skin: '#a855f7', accent: '#7e22ce', glow: '#d946ef' },
    { bg1: '#1c1917', bg2: '#0c0a09', stroke1: '#f59e0b', stroke2: '#ef4444', skin: '#f97316', accent: '#c2410c', glow: '#f59e0b' },
    { bg1: '#082f49', bg2: '#020617', stroke1: '#38bdf8', stroke2: '#818cf8', skin: '#0ea5e9', accent: '#0369a1', glow: '#38bdf8' },
    { bg1: '#14532d', bg2: '#052e16', stroke1: '#4ade80', stroke2: '#a3e635', skin: '#22c55e', accent: '#15803d', glow: '#4ade80' },
    { bg1: '#2e1065', bg2: '#172554', stroke1: '#38bdf8', stroke2: '#c084fc', skin: '#ec4899', accent: '#be185d', glow: '#ec4899' },
  ];
  const p = neonPalettes[absSeed % neonPalettes.length];

  // Character Archetypes
  const isHITL = lowerPrompt.includes('hitl') || lowerPrompt.includes('human') || lowerPrompt.includes('loop');
  const isDog = lowerPrompt.includes('dog') || lowerPrompt.includes('shiba') || lowerPrompt.includes('inu') || lowerPrompt.includes('puppy') || lowerPrompt.includes('canine');
  const isCat = lowerPrompt.includes('cat') || lowerPrompt.includes('kitten') || lowerPrompt.includes('feline') || lowerPrompt.includes('meow') || lowerPrompt.includes('mfcat');
  const isOtter = lowerPrompt.includes('otter') || lowerPrompt.includes('capy') || lowerPrompt.includes('capybara') || lowerPrompt.includes('sloth') || lowerPrompt.includes('badger') || lowerPrompt.includes('beaver');
  const isDuck = lowerPrompt.includes('duck') || lowerPrompt.includes('goose') || lowerPrompt.includes('quack') || lowerPrompt.includes('mallard') || lowerPrompt.includes('bird');
  const isFrog = lowerPrompt.includes('frog') || lowerPrompt.includes('pepe') || lowerPrompt.includes('toad');
  const isBull = lowerPrompt.includes('bull') || lowerPrompt.includes('horn') || lowerPrompt.includes('ox');
  const isBanana = lowerPrompt.includes('banana') || lowerPrompt.includes('chair') || lowerPrompt.includes('lawn') || lowerPrompt.includes('fruit');
  const isAlien = lowerPrompt.includes('alien') || lowerPrompt.includes('ufo') || lowerPrompt.includes('space') || lowerPrompt.includes('cosmic');
  const isDiamond = lowerPrompt.includes('diamond') || lowerPrompt.includes('crystal') || lowerPrompt.includes('solana') || lowerPrompt.includes('gold');

  // 1. Pixel Art
  if (normStyle.includes('pixel')) {
    const pixelSkin = isFrog ? '#22c55e' : isDog ? '#f59e0b' : isCat ? '#ec4899' : p.skin;
    return `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <defs>
        <pattern id="pixelGrid_${absSeed}" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="#09090b" />
          <rect width="16" height="1" fill="#18181b" />
          <rect width="1" height="16" fill="#18181b" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="512" height="512" fill="url(#pixelGrid_${absSeed})" />
      <rect x="32" y="32" width="448" height="448" fill="none" stroke="${p.stroke1}" stroke-width="8" />
      <rect x="48" y="48" width="416" height="416" fill="none" stroke="${p.stroke2}" stroke-width="4" opacity="0.4" />
      
      <!-- 8-Bit Pixel Mascot Head -->
      <rect x="160" y="144" width="192" height="160" fill="${pixelSkin}" />
      ${isCat || isDog ? `
        <rect x="144" y="96" width="48" height="48" fill="${pixelSkin}" />
        <rect x="320" y="96" width="48" height="48" fill="${pixelSkin}" />
      ` : isFrog ? `
        <rect x="144" y="112" width="64" height="48" fill="#15803d" />
        <rect x="304" y="112" width="64" height="48" fill="#15803d" />
      ` : isBull ? `
        <rect x="112" y="128" width="48" height="32" fill="#facc15" />
        <rect x="352" y="128" width="48" height="32" fill="#facc15" />
      ` : `
        <rect x="128" y="112" width="48" height="48" fill="${pixelSkin}" opacity="0.8" />
        <rect x="336" y="112" width="48" height="48" fill="${pixelSkin}" opacity="0.8" />
      `}
      
      <!-- 8-Bit Laser Shades -->
      <rect x="144" y="176" width="224" height="48" fill="#000000" />
      <rect x="160" y="192" width="80" height="24" fill="${p.glow}" />
      <rect x="272" y="192" width="80" height="24" fill="${p.glow}" />
      <rect x="176" y="192" width="16" height="16" fill="#ffffff" />
      <rect x="288" y="192" width="16" height="16" fill="#ffffff" />
      
      <!-- Mouth / Snout -->
      <rect x="208" y="304" width="96" height="64" fill="#1e293b" />
      <rect x="224" y="320" width="64" height="32" fill="${p.glow}" />
      
      <!-- Ticker Plaque -->
      <rect x="128" y="400" width="256" height="48" fill="#000000" stroke="${p.glow}" stroke-width="4" />
      <text x="256" y="434" font-family="'Courier New', monospace" font-size="22" font-weight="bold" fill="${p.glow}" text-anchor="middle">${ticker}</text>
    </svg>`;
  }

  // 2. Vector Cyberpunk / Modern Mascot
  const headColor = isFrog ? '#22c55e' : isDog ? '#f59e0b' : isCat ? '#ec4899' : isBull ? '#b45309' : isBanana ? '#eab308' : isAlien ? '#06b6d4' : isDiamond ? '#38bdf8' : p.skin;
  const earColor = isDog ? '#d97706' : isCat ? '#db2777' : isBull ? '#78350f' : p.accent;

  return `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad_${absSeed}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${p.bg1}" />
        <stop offset="100%" stop-color="${p.bg2}" />
      </linearGradient>
      <linearGradient id="neonStroke_${absSeed}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${p.stroke1}" />
        <stop offset="100%" stop-color="${p.stroke2}" />
      </linearGradient>
      <filter id="glow_${absSeed}" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    <!-- Outer Shield Frame -->
    <circle cx="256" cy="256" r="240" fill="url(#bgGrad_${absSeed})" stroke="url(#neonStroke_${absSeed})" stroke-width="8"/>
    <circle cx="256" cy="256" r="226" fill="none" stroke="${p.stroke1}" stroke-dasharray="8 6" opacity="0.4"/>
    <circle cx="256" cy="256" r="140" fill="#000000" fill-opacity="0.4" />
    
    <!-- Archetype Head & Facial Features -->
    ${isHITL ? `
      <!-- HITL Developer in Hoodie & Glasses with Big Red Stamp -->
      <!-- Holographic Swarm Data Screens -->
      <rect x="55" y="95" width="85" height="62" rx="8" fill="#030712" stroke="#00f5ff" stroke-width="2" opacity="0.85" />
      <line x1="65" y1="112" x2="125" y2="112" stroke="#00f5ff" stroke-width="2" />
      <line x1="65" y1="122" x2="105" y2="122" stroke="#39ff14" stroke-width="2" />
      <line x1="65" y1="132" x2="130" y2="132" stroke="#00f5ff" stroke-width="2" stroke-dasharray="3 2" />
      <text x="97" y="148" font-family="monospace" font-size="9" fill="#00f5ff" text-anchor="middle">SWARM: ACTIVE</text>

      <rect x="372" y="95" width="85" height="62" rx="8" fill="#030712" stroke="#a855f7" stroke-width="2" opacity="0.85" />
      <line x1="382" y1="112" x2="442" y2="112" stroke="#a855f7" stroke-width="2" />
      <line x1="382" y1="122" x2="420" y2="122" stroke="#39ff14" stroke-width="2" />
      <line x1="382" y1="132" x2="445" y2="132" stroke="#a855f7" stroke-width="2" stroke-dasharray="3 2" />
      <text x="414" y="148" font-family="monospace" font-size="9" fill="#a855f7" text-anchor="middle">RPC: SOLANA</text>

      <!-- Hoodie Body -->
      <path d="M 160 360 C 160 280, 205 255, 256 255 C 307 255, 352 280, 352 360 Z" fill="#1e2433" stroke="#334155" stroke-width="6" />
      <!-- Messy Tech Hair -->
      <path d="M 180 170 C 170 100, 210 80, 256 80 C 302 80, 342 100, 332 170 Z" fill="#0f172a" stroke="#020617" stroke-width="5" />
      <circle cx="205" cy="110" r="18" fill="#1e1b4b" />
      <circle cx="256" cy="98" r="22" fill="#1e1b4b" />
      <circle cx="307" cy="110" r="18" fill="#1e1b4b" />

      <!-- Human Face -->
      <ellipse cx="256" cy="190" rx="70" ry="64" fill="#fed7aa" stroke="#ea580c" stroke-width="5" />
      <!-- Tired Eye Bags & Blue Light Glasses -->
      <path d="M 210 202 Q 225 210 240 202" fill="none" stroke="#ea580c" stroke-width="3" opacity="0.6" />
      <path d="M 272 202 Q 287 210 302 202" fill="none" stroke="#ea580c" stroke-width="3" opacity="0.6" />
      <!-- Glowing Blue-Light Glasses -->
      <rect x="198" y="172" width="46" height="32" rx="7" fill="#0284c7" fill-opacity="0.35" stroke="#38bdf8" stroke-width="4" filter="url(#glow_${absSeed})" />
      <rect x="268" y="172" width="46" height="32" rx="7" fill="#0284c7" fill-opacity="0.35" stroke="#38bdf8" stroke-width="4" filter="url(#glow_${absSeed})" />
      <line x1="244" y1="188" x2="268" y2="188" stroke="#38bdf8" stroke-width="5" />

      <!-- Smirk / Determined Mouth -->
      <path d="M 236 226 Q 256 238 276 226" fill="none" stroke="#9a3412" stroke-width="4" stroke-linecap="round" />

      <!-- Giant Red "APPROVED" Rubber Stamp Held Up -->
      <g transform="rotate(-10 300 270)">
        <rect x="250" y="240" width="115" height="46" rx="8" fill="#dc2626" stroke="#ffffff" stroke-width="3" filter="url(#glow_${absSeed})" />
        <rect x="255" y="245" width="105" height="36" rx="5" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="5 3" />
        <text x="307" y="269" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">APPROVED</text>
        <rect x="295" y="215" width="24" height="26" rx="5" fill="#991b1b" stroke="#ffffff" stroke-width="2" />
      </g>

      <!-- Iced Oat Latte with straw -->
      <rect x="120" y="285" width="30" height="46" rx="5" fill="#fef3c7" stroke="#b45309" stroke-width="3" opacity="0.95" />
      <line x1="135" y1="268" x2="135" y2="300" stroke="#22c55e" stroke-width="4" stroke-linecap="round" />
      <text x="135" y="315" font-family="monospace" font-size="9" fill="#78350f" text-anchor="middle">☕</text>
    ` : isFrog ? `
      <circle cx="190" cy="140" r="42" fill="#15803d" stroke="#052e16" stroke-width="6" />
      <circle cx="322" cy="140" r="42" fill="#15803d" stroke="#052e16" stroke-width="6" />
      <circle cx="190" cy="140" r="24" fill="#ffffff" />
      <circle cx="322" cy="140" r="24" fill="#ffffff" />
      <circle cx="190" cy="140" r="12" fill="#000000" />
      <circle cx="322" cy="140" r="12" fill="#000000" />
      <ellipse cx="256" cy="220" rx="115" ry="85" fill="${headColor}" stroke="#052e16" stroke-width="6" />
      <path d="M 180 235 Q 256 265 332 235" fill="none" stroke="#052e16" stroke-width="8" stroke-linecap="round" />
    ` : isBull ? `
      <path d="M 170 180 C 120 140, 100 80, 120 40 C 140 80, 170 120, 200 150" fill="#facc15" stroke="#a16207" stroke-width="6" />
      <path d="M 342 180 C 392 140, 412 80, 392 40 C 372 80, 342 120, 312 150" fill="#facc15" stroke="#a16207" stroke-width="6" />
      <ellipse cx="256" cy="220" rx="100" ry="90" fill="${headColor}" stroke="#78350f" stroke-width="6" />
      <circle cx="256" cy="265" r="24" fill="none" stroke="#facc15" stroke-width="6" filter="url(#glow_${absSeed})" />
    ` : isDog ? `
      <polygon points="175,150 120,80 190,180" fill="${earColor}" stroke="#78350f" stroke-width="5" />
      <polygon points="337,150 392,80 322,180" fill="${earColor}" stroke="#78350f" stroke-width="5" />
      <ellipse cx="256" cy="220" rx="105" ry="90" fill="${headColor}" stroke="#78350f" stroke-width="6" />
      <ellipse cx="256" cy="245" rx="44" ry="32" fill="#fef3c7" />
      <polygon points="256,235 240,225 272,225" fill="#000000" />
      <path d="M 256 235 V 250 Q 256 260 242 255 M 256 250 Q 256 260 270 255" fill="none" stroke="#000000" stroke-width="4" stroke-linecap="round" />
    ` : isCat ? `
      <polygon points="180,150 140,80 200,170" fill="${earColor}" stroke="#831843" stroke-width="5" />
      <polygon points="332,150 372,80 312,170" fill="${earColor}" stroke="#831843" stroke-width="5" />
      <ellipse cx="256" cy="220" rx="100" ry="85" fill="${headColor}" stroke="#831843" stroke-width="6" />
      <line x1="140" y1="220" x2="200" y2="225" stroke="#ffffff" stroke-width="3" />
      <line x1="140" y1="240" x2="200" y2="235" stroke="#ffffff" stroke-width="3" />
      <line x1="372" y1="220" x2="312" y2="225" stroke="#ffffff" stroke-width="3" />
      <line x1="372" y1="240" x2="312" y2="235" stroke="#ffffff" stroke-width="3" />
    ` : isOtter ? `
      <!-- Otter / Capybara Chubby Silhouette -->
      <circle cx="160" cy="155" r="28" fill="#78350f" stroke="#451a03" stroke-width="5" />
      <circle cx="352" cy="155" r="28" fill="#78350f" stroke="#451a03" stroke-width="5" />
      <circle cx="160" cy="155" r="14" fill="#fed7aa" />
      <circle cx="352" cy="155" r="14" fill="#fed7aa" />
      <ellipse cx="256" cy="225" rx="105" ry="95" fill="#92400e" stroke="#451a03" stroke-width="6" />
      <ellipse cx="256" cy="245" rx="55" ry="40" fill="#fef3c7" stroke="#b45309" stroke-width="4" />
      <ellipse cx="256" cy="230" rx="16" ry="12" fill="#1c1917" />
      <path d="M 256 242 V 256 Q 256 268 240 262 M 256 256 Q 256 268 272 262" fill="none" stroke="#1c1917" stroke-width="4" stroke-linecap="round" />
    ` : isDuck ? `
      <!-- Duck Silhouette -->
      <ellipse cx="256" cy="225" rx="95" ry="90" fill="#facc15" stroke="#ca8a04" stroke-width="6" />
      <path d="M 235 138 C 245 105, 275 110, 270 138" fill="#facc15" stroke="#ca8a04" stroke-width="5" />
      <path d="M 185 240 Q 256 270 327 240 Q 256 295 185 240 Z" fill="#ea580c" stroke="#9a3412" stroke-width="6" />
      <ellipse cx="256" cy="248" rx="8" ry="4" fill="#9a3412" />
    ` : isAlien ? `
      <ellipse cx="256" cy="210" rx="90" ry="110" fill="${headColor}" stroke="#0e7490" stroke-width="6" />
      <ellipse cx="215" cy="200" rx="30" ry="40" fill="#000000" transform="rotate(-15 215 200)" filter="url(#glow_${absSeed})" />
      <ellipse cx="297" cy="200" rx="30" ry="40" fill="#000000" transform="rotate(15 297 200)" filter="url(#glow_${absSeed})" />
      <circle cx="210" cy="190" r="8" fill="#ffffff" />
      <circle cx="292" cy="190" r="8" fill="#ffffff" />
    ` : `
      <ellipse cx="256" cy="220" rx="95" ry="85" fill="${headColor}" stroke="#064e3b" stroke-width="6" />
      <polygon points="175,170 120,130 180,210" fill="${earColor}" stroke="#064e3b" stroke-width="4" />
      <polygon points="337,170 392,130 332,210" fill="${earColor}" stroke="#064e3b" stroke-width="4" />
    `}

    <!-- Laser Clout Sunglasses -->
    ${!isFrog && !isAlien && !isHITL ? `
      <polygon points="170,195 245,195 240,235 180,235" fill="#09090b" stroke="${p.stroke1}" stroke-width="4" />
      <polygon points="267,195 342,195 332,235 272,235" fill="#09090b" stroke="${p.stroke1}" stroke-width="4" />
      <line x1="245" y1="205" x2="267" y2="205" stroke="${p.stroke1}" stroke-width="6" />
      <line x1="210" y1="215" x2="40" y2="150" stroke="#f43f5e" stroke-width="7" filter="url(#glow_${absSeed})" stroke-linecap="round" />
      <line x1="305" y1="215" x2="472" y2="150" stroke="#f43f5e" stroke-width="7" filter="url(#glow_${absSeed})" stroke-linecap="round" />
    ` : ''}

    <!-- Ticker Emblem Badge -->
    <rect x="136" y="420" width="240" height="48" rx="24" fill="#020617" stroke="${p.stroke1}" stroke-width="4" />
    <text x="256" y="453" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="900" fill="${p.stroke1}" text-anchor="middle" letter-spacing="2">${ticker}</text>
  </svg>`;
}
