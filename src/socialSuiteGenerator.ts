import JSZip from 'jszip';

export interface SocialAssetSuiteInput {
  tokenName: string;
  ticker: string;
  tagline: string;
  lore: string;
  mascotSvg?: string;
  mascotImageUrl?: string;
  styleName?: string;
  contractAddress: string;
}

/**
 * Renders SVG string to HTMLImageElement for canvas stamping
 */
async function svgToImage(svgString: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const cleanSvg = svgString.includes('xmlns')
      ? svgString
      : svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    const blob = new Blob([cleanSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      // Fallback: create empty placeholder
      const placeholder = new Image();
      placeholder.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      resolve(placeholder);
    };
    img.src = url;
  });
}

/**
 * Loads an image from URL or data URL
 */
async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      const placeholder = new Image();
      placeholder.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      resolve(placeholder);
    };
    img.src = url;
  });
}

/**
 * 1. Generates 1:1 Profile Avatar (512x512 PNG)
 */
export async function generateProfileAvatarBlob(input: SocialAssetSuiteInput): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // Background Gradient
  const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 320);
  grad.addColorStop(0, '#1c2230');
  grad.addColorStop(1, '#08090c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Background grid lines
  ctx.strokeStyle = 'rgba(0, 245, 255, 0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 512; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  // Draw Mascot
  let mascotImg: HTMLImageElement | null = null;
  if (input.mascotImageUrl) {
    mascotImg = await loadImage(input.mascotImageUrl);
  } else if (input.mascotSvg) {
    mascotImg = await svgToImage(input.mascotSvg);
  }

  if (mascotImg && mascotImg.width > 1) {
    ctx.drawImage(mascotImg, 56, 56, 400, 400);
  } else {
    // Procedural Badge
    ctx.fillStyle = '#ccff00';
    ctx.beginPath();
    ctx.arc(256, 256, 160, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 72px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(input.ticker.slice(0, 4), 256, 256);
  }

  // Border & Glow Accent
  ctx.strokeStyle = '#ccff00';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, 504, 504);

  // Bottom Ticker Pill
  ctx.fillStyle = '#000000';
  ctx.fillRect(160, 440, 192, 44);
  ctx.strokeStyle = '#00f5ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(160, 440, 192, 44);

  ctx.fillStyle = '#ccff00';
  ctx.font = 'bold 22px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(input.ticker, 256, 462);

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'));
}

/**
 * 2. Generates 3:1 Twitter/X Banner (1500x500 PNG)
 */
export async function generateTwitterBannerBlob(input: SocialAssetSuiteInput): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 1500;
  canvas.height = 500;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // Background
  const grad = ctx.createLinearGradient(0, 0, 1500, 500);
  grad.addColorStop(0, '#090a0f');
  grad.addColorStop(0.5, '#121622');
  grad.addColorStop(1, '#07080b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1500, 500);

  // High-tech decorative grid & scanlines
  ctx.strokeStyle = 'rgba(204, 255, 0, 0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 1500; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 500);
    ctx.stroke();
  }
  for (let y = 0; y < 500; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1500, y);
    ctx.stroke();
  }

  // Left Content: Token Name, Ticker, Tagline, CA
  ctx.fillStyle = '#00f5ff';
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('⚡ OFFICIAL SOLANA TOKEN // POWERED BY CLAWPUMP', 80, 90);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 68px sans-serif';
  ctx.fillText(input.tokenName, 80, 175);

  ctx.fillStyle = '#ccff00';
  ctx.font = '900 52px monospace';
  ctx.fillText(input.ticker, 80, 240);

  ctx.fillStyle = '#e0e0e0';
  ctx.font = 'italic 24px sans-serif';
  const taglineTrunc = input.tagline.length > 55 ? input.tagline.slice(0, 52) + '...' : input.tagline;
  ctx.fillText(`"${taglineTrunc}"`, 80, 290);

  // Contract Address Pill
  ctx.fillStyle = '#10141d';
  ctx.fillRect(80, 340, 720, 50);
  ctx.strokeStyle = '#2d3b4e';
  ctx.lineWidth = 2;
  ctx.strokeRect(80, 340, 720, 50);

  ctx.fillStyle = '#39ff14';
  ctx.font = 'bold 18px monospace';
  ctx.fillText(`CA: ${input.contractAddress.slice(0, 42)}...`, 100, 372);

  // Right Side: Mascot Frame
  ctx.fillStyle = '#10141d';
  ctx.beginPath();
  ctx.arc(1220, 250, 180, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ccff00';
  ctx.lineWidth = 4;
  ctx.stroke();

  let mascotImg: HTMLImageElement | null = null;
  if (input.mascotImageUrl) {
    mascotImg = await loadImage(input.mascotImageUrl);
  } else if (input.mascotSvg) {
    mascotImg = await svgToImage(input.mascotSvg);
  }

  if (mascotImg && mascotImg.width > 1) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(1220, 250, 170, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(mascotImg, 1220 - 170, 250 - 170, 340, 340);
    ctx.restore();
  }

  // Footer stamp
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '14px monospace';
  ctx.fillText('GEN BY MEMEFI OS • #ANSEMHACK 2026', 80, 440);

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'));
}

/**
 * 3. Generates Telegram Portal Header (800x400 PNG)
 */
export async function generateTelegramHeaderBlob(input: SocialAssetSuiteInput): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // Vibrant Telegram Cyber Background
  const grad = ctx.createLinearGradient(0, 0, 800, 400);
  grad.addColorStop(0, '#001a2e');
  grad.addColorStop(1, '#050a14');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 400);

  // Cyan & Lime glow
  ctx.fillStyle = '#00f5ff';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('🚀 TELEGRAM PORTAL // COMMUNITY HEADQUARTERS', 50, 60);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 48px sans-serif';
  ctx.fillText(input.tokenName, 50, 120);

  ctx.fillStyle = '#ccff00';
  ctx.font = '900 36px monospace';
  ctx.fillText(`${input.ticker} OFFICIAL`, 50, 170);

  ctx.fillStyle = '#39ff14';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('🟢 100% BUY ALERTS & COMMUNITY ACTIVE', 50, 220);

  // Mascot mini circle on the right
  ctx.fillStyle = '#10141d';
  ctx.beginPath();
  ctx.arc(640, 200, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#00f5ff';
  ctx.lineWidth = 4;
  ctx.stroke();

  let mascotImg: HTMLImageElement | null = null;
  if (input.mascotImageUrl) {
    mascotImg = await loadImage(input.mascotImageUrl);
  } else if (input.mascotSvg) {
    mascotImg = await svgToImage(input.mascotSvg);
  }

  if (mascotImg && mascotImg.width > 1) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(640, 200, 115, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(mascotImg, 640 - 115, 200 - 115, 230, 230);
    ctx.restore();
  }

  // Footer CTA
  ctx.fillStyle = '#ccff00';
  ctx.fillRect(50, 310, 400, 44);
  ctx.fillStyle = '#000000';
  ctx.font = '900 18px monospace';
  ctx.fillText('JOIN COMMUNITY & VERIFY HOLDINGS ⚡', 70, 338);

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'));
}

/**
 * 4. Generates 3 Pre-Stamped Meme Canvas Shards
 */
export async function generateMemeShardBlob(
  input: SocialAssetSuiteInput,
  templateTitle: string,
  topHeader: string,
  bottomCaption: string
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // Background
  ctx.fillStyle = '#0e1117';
  ctx.fillRect(0, 0, 600, 600);

  // Header Banner
  ctx.fillStyle = '#ccff00';
  ctx.fillRect(0, 0, 600, 70);
  ctx.fillStyle = '#000000';
  ctx.font = '900 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(topHeader.toUpperCase(), 300, 46);

  // Center Content: Mascot
  let mascotImg: HTMLImageElement | null = null;
  if (input.mascotImageUrl) {
    mascotImg = await loadImage(input.mascotImageUrl);
  } else if (input.mascotSvg) {
    mascotImg = await svgToImage(input.mascotSvg);
  }

  if (mascotImg && mascotImg.width > 1) {
    ctx.drawImage(mascotImg, 100, 100, 400, 400);
  } else {
    ctx.fillStyle = '#1e2430';
    ctx.fillRect(100, 100, 400, 400);
    ctx.fillStyle = '#00f5ff';
    ctx.font = 'bold 36px monospace';
    ctx.fillText(input.ticker, 300, 300);
  }

  // Bottom Caption Bar
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillRect(0, 510, 600, 90);
  ctx.strokeStyle = '#00f5ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 510);
  ctx.lineTo(600, 510);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(bottomCaption, 300, 550);

  ctx.fillStyle = '#ccff00';
  ctx.font = 'bold 14px monospace';
  ctx.fillText(`${input.ticker} • CLAWPUMP MEMEFI OS`, 300, 580);

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'));
}

/**
 * 5. Bundles complete Social Branding Suite into a downloadable ZIP archive
 */
export async function downloadCompleteBrandingKitZip(input: SocialAssetSuiteInput): Promise<void> {
  const zip = new JSZip();
  const folderName = `${input.ticker.replace('$', '')}_Branding_Kit`;
  const folder = zip.folder(folderName) || zip;

  // 1. Profile / Metaplex Avatar (512x512) - Used for On-Chain Metaplex Metadata, Telegram Group Icon & Twitter PFP
  const avatarBlob = await generateProfileAvatarBlob(input);
  folder.file('01_PROFILE_PFP_Telegram_and_Twitter_512x512.png', avatarBlob);

  // 2. Twitter/X Header Banner (1500x500) - Used for Twitter/X Profile Header Banner
  const bannerBlob = await generateTwitterBannerBlob(input);
  folder.file('02_HEADER_BANNER_Twitter_X_1500x500.png', bannerBlob);

  // 3. Telegram Portal Welcome Graphic (800x400) - Used for Telegram Group Welcome / Pinned Buy Alert
  const tgBlob = await generateTelegramHeaderBlob(input);
  folder.file('03_PORTAL_BANNER_Telegram_Community_800x400.png', tgBlob);

  // 4. Meme Canvas Shards (3 Variations) - Pre-formatted for Social Media & Telegram Chat Hype
  const shard1 = await generateMemeShardBlob(
    input,
    'Breaking News',
    'BREAKING: GOD CANDLE IMMINENT',
    `Whales spotted accumulating ${input.ticker}`
  );
  folder.file('04_COMMUNITY_ALERT_Breaking_News_Meme_Square.png', shard1);

  const shard2 = await generateMemeShardBlob(
    input,
    'Solana Momentum',
    'SOLANA BREAKOUT IN PROGRESS',
    `Sending ${input.ticker} to the moon!`
  );
  folder.file('05_COMMUNITY_ALERT_God_Candle_Chart_Meme_Square.png', shard2);

  // 5. Plain English How-To-Use Instructions
  const instructionsText = `========================================================================
🚀 ${input.tokenName} ($${input.ticker.replace('$', '')}) - SOCIAL BRANDING & GRAPHICS KIT
========================================================================

Here is how and where to upload each file in this branding pack:

------------------------------------------------------------------------
📁 01_PROFILE_PFP_Telegram_and_Twitter_512x512.png
------------------------------------------------------------------------
• WHERE TO USE:
  - Twitter / X: Profile Picture (Avatar)
  - Telegram: Group Chat / Channel Icon Avatar
  - DexScreener & Solscan: Token Logo Metadata
• SPECIFICATIONS: 512x512px High-Res Square PNG

------------------------------------------------------------------------
📁 02_HEADER_BANNER_Twitter_X_1500x500.png
------------------------------------------------------------------------
• WHERE TO USE:
  - Twitter / X: Profile Header Banner (Upload in "Edit Profile" -> Header)
• SPECIFICATIONS: 1500x500px (3:1 Standard X Banner)
• INCLUDES: Official Token Name, $${input.ticker.replace('$', '')} Ticker, Tagline, & Contract Address (CA)

------------------------------------------------------------------------
📁 03_PORTAL_BANNER_Telegram_Community_800x400.png
------------------------------------------------------------------------
• WHERE TO USE:
  - Telegram: Pinned Welcome Message, Buy Alert Bot Banner, Portal Channel
• SPECIFICATIONS: 800x400px (2:1 Community Portal Banner)

------------------------------------------------------------------------
📁 04_COMMUNITY_ALERT_Breaking_News_Meme_Square.png
📁 05_COMMUNITY_ALERT_God_Candle_Chart_Meme_Square.png
------------------------------------------------------------------------
• WHERE TO USE:
  - Twitter / X: Attach to community announcement tweets, replies, and quote posts
  - Telegram & Discord: Drop into active chats when green candles or milestones hit
• SPECIFICATIONS: 600x600px High-Impact Meme Canvas Overlays

------------------------------------------------------------------------
📁 00_METADATA_OnChain_Token_Specs.json
------------------------------------------------------------------------
• WHERE TO USE:
  - Reference for Metaplex token deployment, DexScreener verification, and official narrative lore.

Contract Address: ${input.contractAddress}
Generated by: MemeFi OS AI Multi-Agent Studio
========================================================================
`;
  folder.file('README_HOW_TO_USE_GRAPHICS.txt', instructionsText);

  // 6. Metadata JSON & Lore Readme
  const metaText = JSON.stringify(
    {
      token_name: input.tokenName,
      ticker: input.ticker,
      tagline: input.tagline,
      lore: input.lore,
      contract_address: input.contractAddress,
      generated_by: 'MemeFi OS (AnsemHack 2026)',
      bonding_curve: 'ClawPump v2',
      social_guide: 'Refer to README_HOW_TO_USE_GRAPHICS.txt for upload instructions',
    },
    null,
    2
  );
  folder.file('00_METADATA_OnChain_Token_Specs.json', metaText);

  // Generate ZIP file and trigger browser download
  const content = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(content);
  a.download = `${input.ticker.replace('$', '')}_MemeFi_Branding_Suite.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}
