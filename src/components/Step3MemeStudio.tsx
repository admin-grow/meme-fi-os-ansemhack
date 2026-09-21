import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Agent2VisualResult,
  Agent1NarrativeResult,
  MemeTemplateType,
  MemeStyleType,
  AspectRatioType,
  CryptoOverlayBadges,
  MascotStampConfig,
} from '../types';
import {
  Download,
  Copy,
  Check,
  RefreshCw,
  Palette,
  Sparkles,
  ArrowRight,
  Zap,
  Sliders,
  Move,
  Layers,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { auditContentAuthenticity } from '../utils/authenticityEngine';
import { sanitizeMemeCaption } from '../utils/complianceFramework';

interface Step3MemeStudioProps {
  narrative: Agent1NarrativeResult;
  visual: Agent2VisualResult;
  onUpdateVisual: (updated: Agent2VisualResult) => void;
  onNext: () => void;
  isDeployed?: boolean;
  onGoToCockpit?: () => void;
}

const TEMPLATES: { id: MemeTemplateType; name: string; icon: string; desc: string }[] = [
  { id: 'Breaking News', name: 'Breaking News', icon: '📺', desc: 'CNN/Bloomberg parody ticker with red live banner' },
  { id: 'Official Launch Card', name: 'Launch Announcement', icon: '🚀', desc: 'Clean Fair Launch announcement card showcasing the mascot' },
  { id: 'Mascot Spotlight', name: 'Mascot Spotlight', icon: '✨', desc: 'Focused high-res mascot avatar with dynamic title and ticker' },
  { id: 'Custom Banner', name: 'Custom Launch Banner', icon: '🏷️', desc: 'Sleek dark mode banner for X headers & Telegram' },
  { id: 'Laser Eyes Degen', name: 'Laser Eyes Aura', icon: '⚡', desc: 'Solana cyberpunk glowing laser beams & diamond hands' },
  { id: 'Drake Meme', name: 'Reject / Accept', icon: '👉', desc: 'Traditional syntax vs 100% pure vibe coding' },
  { id: 'Distracted Boyfriend', name: 'Distracted Degen', icon: '👀', desc: 'Degen looking at $TICKER instead of index funds' },
];

const STYLE_OPTIONS: { id: MemeStyleType; label: string; icon: string; promptNote: string }[] = [
  { id: 'Cyberpunk', label: 'Cyberpunk', icon: '⚡', promptNote: 'Neon laser grids & glowing visor HUD' },
  { id: 'Pixel Art', label: 'Pixel Art', icon: '👾', promptNote: '8-bit retro arcade pixel canvas' },
  { id: 'Comic Book', label: 'Comic Book', icon: '💥', promptNote: 'Halftone action dots & POW cel-shading' },
  { id: '3D Render', label: '3D Render', icon: '🔮', promptNote: 'Glossy 3D claymorphism with soft specular glow' },
];

export const Step3MemeStudio: React.FC<Step3MemeStudioProps> = ({
  narrative,
  visual,
  onUpdateVisual,
  onNext,
  isDeployed = false,
  onGoToCockpit,
}) => {
  // Active Meme Customization State
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplateType>(
    (visual.meme_overlay?.template_type as MemeTemplateType) || 'Breaking News'
  );
  const [activeStyle, setActiveStyle] = useState<MemeStyleType>('Cyberpunk');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('1:1');
  const [topHeader, setTopHeader] = useState(() => {
    const raw = visual.meme_overlay?.top_header || 'BREAKING NEWS';
    return raw.replace(/\$100m|\$1b/gi, 'VIRAL').replace(/\+1000%/gi, 'FAIR LAUNCH');
  });
  const [bottomCaption, setBottomCaption] = useState(() => {
    const raw = visual.meme_overlay?.bottom_caption || `LOCAL MAN REPLACES ENTIRE TECH TEAM WITH ${narrative.ticker}`;
    return sanitizeMemeCaption(raw, narrative.ticker);
  });
  const [watermark, setWatermark] = useState(visual.meme_overlay?.ticker_watermark || narrative.ticker);

  // Overlay Badges Toggle State (Clean Fair Launch and Ticker watermark)
  const [badges, setBadges] = useState<CryptoOverlayBadges>({
    pumpBadge: true,
    tickerWatermark: true,
  });

  // Authenticity & Zero Fake News Provenance Tracking
  const [isUserModified, setIsUserModified] = useState(false);
  const [isParodyMode, setIsParodyMode] = useState(false);

  // Compute live provenance audit
  const authenticityAudit = useMemo(() => {
    return auditContentAuthenticity({
      text: `${topHeader} ${bottomCaption}`,
      isUserModified,
      userSelectedParodyMode: isParodyMode,
      contractAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsypump',
    });
  }, [topHeader, bottomCaption, isUserModified, isParodyMode]);

  // Mascot Stamping & Drag State
  const [mascotStamp, setMascotStamp] = useState<MascotStampConfig>({
    x: 0,
    y: 0,
    scale: 1.0,
    opacity: 100,
    transparentCutout: false,
    snappedPosition: 'center',
  });

  // Interactive Dragging on Canvas State
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // UI status states
  const [isRepromptingStyle, setIsRepromptingStyle] = useState(false);
  const [isGeneratingAiImage, setIsGeneratingAiImage] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloadingSingle, setIsDownloadingSingle] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [rateLimitNotice, setRateLimitNotice] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync state when props change
  useEffect(() => {
    if (visual.meme_overlay) {
      if (visual.meme_overlay.top_header) {
        setTopHeader(visual.meme_overlay.top_header.replace(/\$100m|\$1b/gi, 'VIRAL').replace(/\+1000%/gi, 'FAIR LAUNCH'));
      }
      if (visual.meme_overlay.bottom_caption) {
        setBottomCaption(sanitizeMemeCaption(visual.meme_overlay.bottom_caption, narrative.ticker));
      }
      if (visual.meme_overlay.ticker_watermark) setWatermark(visual.meme_overlay.ticker_watermark);
      if (visual.meme_overlay.template_type) {
        setSelectedTemplate(visual.meme_overlay.template_type as MemeTemplateType);
      }
    }
  }, [visual, narrative.ticker]);

  // Handle Dedicated Multi-Modal AI Image Synthesis via /api/generate-image with cost defense
  const handleGenerateAiMascot = async () => {
    if (isGeneratingAiImage) return;
    setIsGeneratingAiImage(true);
    setRateLimitNotice(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: narrative.mascot_prompt || visual.image_generation_prompt || `Mascot for ${narrative.token_name} ${narrative.ticker}`,
          ticker: narrative.ticker,
          token_name: narrative.token_name,
          category: 'Tech/AI Absurdism',
          style: activeStyle,
        }),
      });

      const data = await response.json();

      if (response.status === 429 || response.status === 403) {
        setRateLimitNotice(data.message || 'Free Client-Side Canvas Meme Studio active ($0.00 API cost).');
        if (data.mascot_svg) {
          onUpdateVisual({
            ...visual,
            mascot_svg: data.mascot_svg,
          });
        }
        return;
      }

      if (response.ok) {
        onUpdateVisual({
          ...visual,
          mascot_svg: data.mascot_svg || visual.mascot_svg,
          mascot_image_url: data.image_url || undefined,
        });

        if (data.quota_depleted || (!data.image_url && data.mascot_svg)) {
          setRateLimitNotice('✨ Procedural Vector Mascot Synthesizer active: High-resolution vector mascot loaded ($0 API credits used).');
        }
      }
    } catch (err) {
      console.info('Client-side mascot fallback active:', err);
      setRateLimitNotice('Free Client-Side Canvas Studio is active.');
    } finally {
      setIsGeneratingAiImage(false);
    }
  };

  // Handle Style Reprompting via Agent 2
  const handleSwapStyle = async (newStyle: MemeStyleType) => {
    if (newStyle === activeStyle && !isRepromptingStyle) return;
    setActiveStyle(newStyle);
    setIsRepromptingStyle(true);

    try {
      const response = await fetch('/api/agent2-visual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mascot_prompt: narrative.mascot_prompt,
          template_type: selectedTemplate,
          ticker: narrative.ticker,
          token_name: narrative.token_name,
          category: 'Tech/AI Absurdism',
          style: newStyle,
        }),
      });

      if (response.ok) {
        const data: Agent2VisualResult = await response.json();
        onUpdateVisual({
          ...visual,
          ...data,
        });
      }
    } catch (err) {
      console.info('Procedural visual style fallback active:', err);
    } finally {
      setIsRepromptingStyle(false);
    }
  };

  // Canvas Drawing Routine
  const drawMeme = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      tpl: MemeTemplateType,
      headerText: string,
      captionText: string,
      tickerStamp: string,
      overlayConfig: CryptoOverlayBadges,
      stampConfig: MascotStampConfig,
      svgStr: string,
      onComplete?: () => void
    ) => {
      // 1. Clear & Background
      ctx.clearRect(0, 0, width, height);

      // Sanitize against fake news & unverified financial pump claims
      const safeHeader = (headerText || 'BREAKING NEWS')
        .replace(/\$100m|\$1b/gi, 'VIRAL')
        .replace(/\+1000%/gi, 'FAIR LAUNCH');
      const safeCaption = sanitizeMemeCaption(captionText, tickerStamp);

      // Gradient background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      if (tpl === 'God Candle Chart') {
        bgGrad.addColorStop(0, '#061713');
        bgGrad.addColorStop(1, '#020617');
      } else if (tpl === 'Laser Eyes Degen') {
        bgGrad.addColorStop(0, '#1a0520');
        bgGrad.addColorStop(1, '#09090b');
      } else {
        bgGrad.addColorStop(0, '#0b1120');
        bgGrad.addColorStop(1, '#020617');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle Cyber Grid Lines
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.07)';
      ctx.lineWidth = 1;
      const gridSize = width === 1280 ? 48 : 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Render Mascot Layer (Supports both AI generated raster images and scalable SVGs)
      const svgContent = svgStr || visual.mascot_svg || '';
      let processedSvg = svgContent;

      // Transparent Cutout Mode: strip outer circle backgrounds if requested for SVG
      if (stampConfig.transparentCutout && processedSvg) {
        processedSvg = processedSvg.replace(/<circle[^>]*r="240"[^>]*\/>/g, '');
        processedSvg = processedSvg.replace(/<rect[^>]*width="512"[^>]*\/>/g, '');
      }

      const imageSource = visual.mascot_image_url || `data:image/svg+xml;charset=utf-8,${encodeURIComponent(processedSvg)}`;
      const mascotImg = new Image();
      mascotImg.crossOrigin = 'anonymous';

      mascotImg.onload = () => {
        // Calculate Mascot Coordinates based on snap/drag
        const baseSize = width === 1280 ? 380 : 360;
        const targetSize = baseSize * stampConfig.scale;

        let mascotX = (width - targetSize) / 2;
        let mascotY = (height - targetSize) / 2 - (width === 1280 ? 10 : 20);

        if (stampConfig.snappedPosition === 'top-left') {
          mascotX = 40;
          mascotY = 80;
        } else if (stampConfig.snappedPosition === 'top-right') {
          mascotX = width - targetSize - 40;
          mascotY = 80;
        } else if (stampConfig.snappedPosition === 'bottom-left') {
          mascotX = 40;
          mascotY = height - targetSize - 120;
        } else if (stampConfig.snappedPosition === 'bottom-right') {
          mascotX = width - targetSize - 40;
          mascotY = height - targetSize - 120;
        } else if (stampConfig.snappedPosition === 'custom') {
          mascotX = stampConfig.x;
          mascotY = stampConfig.y;
        }

        ctx.save();
        ctx.globalAlpha = stampConfig.opacity / 100;
        ctx.drawImage(mascotImg, mascotX, mascotY, targetSize, targetSize);
        ctx.restore();

        // 3. Template-Specific Overlays
        if (tpl === 'Breaking News') {
          // Top Red Banner
          const bannerHeight = width === 1280 ? 70 : 66;
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(0, 0, width, bannerHeight);

          // LIVE NOW Badge (Rendered right-aligned with fixed reserved width so wording never collides)
          const liveBadgeWidth = 110;
          const liveBadgeHeight = 34;
          const liveBadgeX = width - liveBadgeWidth - 20;
          const liveBadgeY = Math.floor((bannerHeight - liveBadgeHeight) / 2);

          // LIVE Badge container with pulsing indicator
          ctx.save();
          ctx.fillStyle = '#fbbf24';
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1.5;
          roundRect(ctx, liveBadgeX, liveBadgeY, liveBadgeWidth, liveBadgeHeight, 6);
          ctx.fill();
          ctx.stroke();

          // Pulsing red live dot
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.arc(liveBadgeX + 16, liveBadgeY + liveBadgeHeight / 2, 5, 0, Math.PI * 2);
          ctx.fill();

          // LIVE NOW text
          ctx.fillStyle = '#000000';
          ctx.font = '900 14px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText('LIVE NOW', liveBadgeX + 62, liveBadgeY + 22);
          ctx.restore();

          // Left Headline Text (Safely bounded to never overlap the LIVE NOW badge)
          ctx.save();
          const maxHeadlineWidth = liveBadgeX - 44;
          let fontSize = width === 1280 ? 28 : 24;
          ctx.font = `900 ${fontSize}px "Space Grotesk", sans-serif`;

          let displayHeader = `🚨 ${safeHeader.toUpperCase()}`;
          while (ctx.measureText(displayHeader).width > maxHeadlineWidth && fontSize > 16) {
            fontSize -= 2;
            ctx.font = `900 ${fontSize}px "Space Grotesk", sans-serif`;
          }

          // If still overflowing at min font, truncate with ellipsis
          if (ctx.measureText(displayHeader).width > maxHeadlineWidth) {
            while (displayHeader.length > 4 && ctx.measureText(displayHeader + '...').width > maxHeadlineWidth) {
              displayHeader = displayHeader.slice(0, -1);
            }
            displayHeader += '...';
          }

          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'left';
          ctx.fillText(displayHeader, 24, Math.floor(bannerHeight / 2) + Math.floor(fontSize / 3));
          ctx.restore();

          // Bottom Breaking Ticker Box
          const bottomH = width === 1280 ? 130 : 150;
          const bottomY = height - bottomH;
          ctx.fillStyle = 'rgba(10, 11, 13, 0.95)';
          ctx.fillRect(0, bottomY, width, bottomH);
          ctx.strokeStyle = '#00f5ff';
          ctx.lineWidth = 3;
          ctx.strokeRect(0, bottomY, width, bottomH);

          // Sub-bar
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(0, bottomY, width, 24);
          ctx.fillStyle = '#000000';
          ctx.font = '800 13px "JetBrains Mono", monospace';
          ctx.textAlign = 'left';
          ctx.fillText(
            `CLAWPUMP BREAKING MEME FEED • TICKER: ${tickerStamp} • FAIR LAUNCH READY`,
            20,
            bottomY + 17
          );

          // Main Caption
          ctx.fillStyle = '#ffffff';
          ctx.font = `800 ${width === 1280 ? 24 : 22}px "Space Grotesk", sans-serif`;
          ctx.textAlign = 'center';
          wrapText(ctx, safeCaption, width / 2, bottomY + (width === 1280 ? 65 : 68), width - 80, 30);
        } else if (tpl === 'Official Launch Card') {
          // Official Launch Announcement Layout - Elegant & Clean
          // Header Plaque
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.fillRect(20, 20, width - 40, 56);
          ctx.strokeStyle = '#00f5ff';
          ctx.lineWidth = 2;
          ctx.strokeRect(20, 20, width - 40, 56);

          ctx.fillStyle = '#00f5ff';
          ctx.font = `900 ${width === 1280 ? 26 : 22}px "Space Grotesk", sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(safeHeader.toUpperCase(), width / 2, 56);

          // Bottom Narrative Bar
          const boxH = 100;
          const boxY = height - boxH - 24;
          ctx.fillStyle = 'rgba(10, 11, 13, 0.92)';
          ctx.fillRect(20, boxY, width - 40, boxH);
          ctx.strokeStyle = '#39ff14';
          ctx.lineWidth = 2;
          ctx.strokeRect(20, boxY, width - 40, boxH);

          ctx.fillStyle = '#ffffff';
          ctx.font = '800 20px "Space Grotesk", sans-serif';
          ctx.textAlign = 'center';
          wrapText(ctx, safeCaption, width / 2, boxY + 44, width - 80, 26);
        } else if (tpl === 'Mascot Spotlight') {
          // Centered Mascot with top & bottom badges
          ctx.fillStyle = '#ccff00';
          ctx.font = `900 ${width === 1280 ? 32 : 26}px "Space Grotesk", sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(safeHeader.toUpperCase(), width / 2, 54);

          const bannerH = 90;
          const bannerY = height - bannerH - 20;
          ctx.fillStyle = 'rgba(10, 11, 13, 0.9)';
          ctx.fillRect(30, bannerY, width - 60, bannerH);
          ctx.strokeStyle = '#ccff00';
          ctx.lineWidth = 2;
          ctx.strokeRect(30, bannerY, width - 60, bannerH);

          ctx.fillStyle = '#ffffff';
          ctx.font = `800 ${width === 1280 ? 22 : 19}px "Space Grotesk", sans-serif`;
          ctx.textAlign = 'center';
          wrapText(ctx, safeCaption, width / 2, bannerY + 44, width - 100, 26);
        } else {
          // Default Custom Banner / Laser Eyes
          ctx.fillStyle = '#00f5ff';
          ctx.font = `900 ${width === 1280 ? 34 : 28}px "Space Grotesk", sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(safeHeader.toUpperCase(), width / 2, 60);

          const bannerH = width === 1280 ? 100 : 120;
          const bannerY = height - bannerH - 25;
          ctx.fillStyle = 'rgba(10, 11, 13, 0.92)';
          ctx.fillRect(30, bannerY, width - 60, bannerH);
          ctx.strokeStyle = '#00f5ff';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(30, bannerY, width - 60, bannerH);

          ctx.fillStyle = '#ffffff';
          ctx.font = `800 ${width === 1280 ? 22 : 21}px "Space Grotesk", sans-serif`;
          ctx.textAlign = 'center';
          wrapText(ctx, safeCaption, width / 2, bannerY + 48, width - 100, 28);
        }

        // 4. Valid Overlay Badges (Toggleable)
        // Badge 1: Clean Fair Launch Badge
        if (overlayConfig.pumpBadge) {
          const badgeW = 160;
          const badgeH = 34;
          const badgeX = 30;
          const badgeY = tpl === 'Breaking News' ? 80 : 30;

          ctx.save();
          ctx.fillStyle = '#064e3b';
          ctx.strokeStyle = '#39ff14';
          ctx.lineWidth = 2;
          roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 17);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#39ff14';
          ctx.font = '900 12px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText('🚀 FAIR LAUNCH', badgeX + badgeW / 2, badgeY + 22);
          ctx.restore();
        }

        // Badge 2: $TICKER Watermark Stamp
        if (overlayConfig.tickerWatermark) {
          ctx.save();
          ctx.fillStyle = 'rgba(0, 245, 255, 0.85)';
          ctx.font = '900 13px "JetBrains Mono", monospace';
          ctx.textAlign = 'right';
          ctx.fillText(tickerStamp, width - 30, height - 10);
          ctx.restore();
        }

        if (onComplete) onComplete();
      };

      let hasTriedSvgFallback = false;
      mascotImg.onerror = () => {
        if (!hasTriedSvgFallback && processedSvg) {
          hasTriedSvgFallback = true;
          mascotImg.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(processedSvg)}`;
        }
      };

      mascotImg.src = imageSource;
    },
    [visual.mascot_svg, visual.mascot_image_url, authenticityAudit, isParodyMode, isUserModified]
  );

  // Helper for word wrapping in canvas
  function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) {
    const words = (text || '').split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
  }

  // Helper for rounded rectangles
  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // Re-render main canvas whenever relevant state changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = aspectRatio === '16:9' ? 1280 : 720;
    const height = 720;
    canvas.width = width;
    canvas.height = height;

    drawMeme(
      ctx,
      width,
      height,
      selectedTemplate,
      topHeader,
      bottomCaption,
      watermark,
      badges,
      mascotStamp,
      visual.mascot_svg || ''
    );
  }, [
    selectedTemplate,
    aspectRatio,
    topHeader,
    bottomCaption,
    watermark,
    badges,
    mascotStamp,
    visual.mascot_svg,
    drawMeme,
  ]);

  // Interactive Mascot Dragging Handlers on Canvas
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    setIsDragging(true);
    setDragOffset({
      x: clickX - (mascotStamp.snappedPosition === 'custom' ? mascotStamp.x : (canvas.width - 360 * mascotStamp.scale) / 2),
      y: clickY - (mascotStamp.snappedPosition === 'custom' ? mascotStamp.y : (canvas.height - 360 * mascotStamp.scale) / 2),
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const currentX = (e.clientX - rect.left) * scaleX;
    const currentY = (e.clientY - rect.top) * scaleY;

    setMascotStamp((prev) => ({
      ...prev,
      snappedPosition: 'custom',
      x: Math.max(0, Math.min(canvas.width - 200, currentX - dragOffset.x)),
      y: Math.max(0, Math.min(canvas.height - 200, currentY - dragOffset.y)),
    }));
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  // Mobile Touch Dragging Handlers for Canvas
  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (touch.clientX - rect.left) * scaleX;
    const clickY = (touch.clientY - rect.top) * scaleY;

    setIsDragging(true);
    setDragOffset({
      x: clickX - (mascotStamp.snappedPosition === 'custom' ? mascotStamp.x : (canvas.width - 360 * mascotStamp.scale) / 2),
      y: clickY - (mascotStamp.snappedPosition === 'custom' ? mascotStamp.y : (canvas.height - 360 * mascotStamp.scale) / 2),
    });
  };

  const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || !e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const currentX = (touch.clientX - rect.left) * scaleX;
    const currentY = (touch.clientY - rect.top) * scaleY;

    setMascotStamp((prev) => ({
      ...prev,
      snappedPosition: 'custom',
      x: Math.max(0, Math.min(canvas.width - 200, currentX - dragOffset.x)),
      y: Math.max(0, Math.min(canvas.height - 200, currentY - dragOffset.y)),
    }));
  };

  const handleCanvasTouchEnd = () => {
    setIsDragging(false);
  };

  // Single PNG Download
  const handleDownloadSinglePng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDownloadingSingle(true);
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    const purposePrefix = aspectRatio === '16:9' ? 'TWITTER_HEADER_BANNER' : 'TELEGRAM_CHAT_OR_PROFILE_MEME';
    link.download = `${narrative.ticker.replace('$', '')}_${purposePrefix}_${selectedTemplate.toUpperCase().replace(/\s+/g, '_')}.png`;
    link.click();
    setTimeout(() => setIsDownloadingSingle(false), 600);
  };

  // Copy Canvas Image to Clipboard
  const handleCopyMemeImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        }
      });
    } catch (err) {
      console.error('Failed to copy image to clipboard', err);
    }
  };

  // Download Clean SVG Mascot
  const handleDownloadMascotSvg = () => {
    const svgBlob = new Blob([visual.mascot_svg || ''], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${narrative.ticker.replace('$', '')}_PROFILE_AVATAR_PFP_Scalable_Vector.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 1-Click "Download All" (Batch downloads 3 variations + SVG mascot)
  const handleDownloadAllVariations = async () => {
    setIsDownloadingAll(true);

    const variationsToGenerate: {
      tpl: MemeTemplateType;
      ratio: AspectRatioType;
      nameSuffix: string;
      header: string;
      caption: string;
    }[] = [
      {
        tpl: 'Breaking News',
        ratio: '1:1',
        nameSuffix: '01_BREAKING_NEWS_Telegram_and_Twitter_Community_Post',
        header: 'BREAKING NEWS',
        caption: `LOCAL MAN REPLACES ENTIRE TECH TEAM WITH ${narrative.ticker}`,
      },
      {
        tpl: 'Official Launch Card',
        ratio: '1:1',
        nameSuffix: '02_FAIR_LAUNCH_ANNOUNCEMENT_CARD',
        header: `${narrative.token_name.toUpperCase()} FAIR LAUNCH`,
        caption: narrative.tagline || `OFFICIAL COMMUNITY LAUNCH ON SOLANA`,
      },
      {
        tpl: 'Custom Banner',
        ratio: '16:9',
        nameSuffix: '03_TWITTER_X_PROFILE_HEADER_BANNER_16x9',
        header: `${narrative.token_name.toUpperCase()} LAUNCH BANNER`,
        caption: narrative.tagline,
      },
    ];

    for (let i = 0; i < variationsToGenerate.length; i++) {
      const v = variationsToGenerate[i];
      const offscreenCanvas = document.createElement('canvas');
      const w = v.ratio === '16:9' ? 1280 : 720;
      const h = 720;
      offscreenCanvas.width = w;
      offscreenCanvas.height = h;
      const offCtx = offscreenCanvas.getContext('2d');

      if (offCtx) {
        await new Promise<void>((resolve) => {
          drawMeme(
            offCtx,
            w,
            h,
            v.tpl,
            v.header,
            v.caption,
            watermark,
            badges,
            mascotStamp,
            visual.mascot_svg || '',
            () => {
              const imgData = offscreenCanvas.toDataURL('image/png');
              const link = document.createElement('a');
              link.href = imgData;
              link.download = `${narrative.ticker.replace('$', '')}_${v.nameSuffix}.png`;
              link.click();
              resolve();
            }
          );
        });
        await new Promise((r) => setTimeout(r, 400));
      }
    }

    // Also download Mascot SVG
    handleDownloadMascotSvg();

    setTimeout(() => {
      setIsDownloadingAll(false);
    }, 800);
  };

  return (
    <div className="w-full space-y-6">
      <div className="bg-[#12141a] border border-[#2d3139] rounded-xl p-5 sm:p-6 shadow-xl">
        {/* Top Header & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2d3139]">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-[#2d3139] flex items-center justify-center text-[10px] font-bold text-white">
              02
            </span>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xs uppercase font-bold text-[#00f5ff] tracking-widest flex items-center gap-2">
                  Meme Studio
                  {isRepromptingStyle && (
                    <span className="text-[10px] text-[#ccff00] font-normal flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" /> {activeStyle}...
                    </span>
                  )}
                </h2>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-white font-mono">{narrative.token_name}</span>
                <span className="text-xs font-mono font-bold text-[#ccff00] px-1.5 py-0.2 rounded bg-[#ccff00]/10 border border-[#ccff00]/30">
                  {narrative.ticker}
                </span>
              </div>
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handleGenerateAiMascot}
              disabled={isGeneratingAiImage}
              className="py-1.5 px-3 rounded bg-gradient-to-r from-[#d946ef]/20 to-[#8b5cf6]/20 hover:from-[#d946ef]/40 hover:to-[#8b5cf6]/40 text-[#f472b6] border border-[#d946ef]/40 text-xs font-mono uppercase flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(217,70,239,0.2)] cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAiImage ? 'animate-spin' : 'text-[#f472b6]'}`} />
              <span>{isGeneratingAiImage ? 'Generating...' : 'AI Mascot'}</span>
            </button>

            <button
              onClick={handleCopyMemeImage}
              className="py-1.5 px-3 rounded bg-[#1a1d24] hover:bg-[#2d3139] text-[#e0e0e0] border border-[#2d3139] text-xs font-mono uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-[#39ff14]" /> : <Copy className="w-3.5 h-3.5 text-[#00f5ff]" />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Live Token Continuous Asset Notice */}
        {isDeployed && (
          <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-[#0d1424] via-[#10192e] to-[#0b101c] border border-[#39ff14]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-[#39ff14]">
              <CheckCircle2 className="w-4 h-4 text-[#39ff14] shrink-0" />
              <div>
                <span className="font-bold uppercase tracking-wider text-white">
                  Continuous Asset Studio Active &bull; Live Token: {narrative.token_name} ({narrative.ticker})
                </span>
                <span className="text-[10px] text-[#8e99ac] block sm:inline sm:ml-2">
                  Generate new memes, switch templates, or download custom banners for your community at any time.
                </span>
              </div>
            </div>
            {onGoToCockpit && (
              <button
                type="button"
                onClick={onGoToCockpit}
                className="px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1a2032] border border-[#00f5ff]/40 text-[#00f5ff] text-[11px] font-bold uppercase transition-all shrink-0 cursor-pointer"
              >
                &larr; Return to Cockpit (Step 4)
              </button>
            )}
          </div>
        )}

        {/* Style Swapper Chips (Horizontal Bar) */}
        <div className="mt-4 pt-1">
          <div className="flex items-center justify-between gap-2 mb-2">
            <label className="text-[10px] uppercase font-bold opacity-50 tracking-wider font-mono flex items-center gap-1.5 text-[#e0e0e0]">
              <Palette className="w-3.5 h-3.5 text-[#00f5ff]" />
              Art Styles
            </label>
            <span className="text-[10px] text-[#00f5ff] font-mono opacity-80">
              {activeStyle}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STYLE_OPTIONS.map((style) => {
              const isSelected = activeStyle === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => handleSwapStyle(style.id)}
                  disabled={isRepromptingStyle}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-[#1a1d24] border-[#00f5ff] text-white shadow-[0_0_12px_rgba(0,245,255,0.25)]'
                      : 'bg-[#0a0b0d] border-[#2d3139] hover:border-[#00f5ff]/50 text-[#e0e0e0]'
                  }`}
                >
                  <span className="text-xl">{style.icon}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold font-sans flex items-center gap-1">
                      {style.label}
                      {isSelected && <CheckCircle2 className="w-3 h-3 text-[#00f5ff]" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Studio Grid: Left Canvas, Right Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Left Canvas Workstation */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#0a0b0d] border border-[#2d3139] rounded-xl p-4 relative group">
            {/* Aspect Ratio Selector Bar */}
            <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-[#2d3139]/60 text-xs">
              <span className="text-[10px] uppercase font-bold text-[#e0e0e0] opacity-50 font-mono flex items-center gap-1">
                <Sliders className="w-3 h-3 text-[#00f5ff]" /> Canvas Aspect Ratio
              </span>
              <div className="flex items-center gap-1.5 bg-[#12141a] p-1 rounded-lg border border-[#2d3139]">
                <button
                  onClick={() => setAspectRatio('1:1')}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    aspectRatio === '1:1'
                      ? 'bg-[#00f5ff] text-black shadow-[0_0_8px_rgba(0,245,255,0.3)]'
                      : 'text-[#e0e0e0] hover:text-white'
                  }`}
                >
                  1:1 (Telegram Square)
                </button>
                <button
                  onClick={() => setAspectRatio('16:9')}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    aspectRatio === '16:9'
                      ? 'bg-[#00f5ff] text-black shadow-[0_0_8px_rgba(0,245,255,0.3)]'
                      : 'text-[#e0e0e0] hover:text-white'
                  }`}
                >
                  16:9 (X Banner)
                </button>
              </div>
            </div>

            {/* Interactive Canvas */}
            <div
              className={`w-full max-w-[540px] rounded-lg overflow-hidden shadow-2xl border border-[#2d3139] relative ${
                aspectRatio === '16:9' ? 'aspect-video' : 'aspect-square'
              }`}
            >
              <canvas
                ref={canvasRef}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                onTouchStart={handleCanvasTouchStart}
                onTouchMove={handleCanvasTouchMove}
                onTouchEnd={handleCanvasTouchEnd}
                onTouchCancel={handleCanvasTouchEnd}
                className="w-full h-full object-contain cursor-grab active:cursor-grabbing rounded-lg select-none touch-none"
                title="Click and drag inside the canvas to reposition mascot"
              />
            </div>

            {/* Canvas Telemetry & Drag Hint */}
            <div className="mt-3 flex items-center justify-between w-full max-w-[540px] text-[10px] text-[#e0e0e0] opacity-70 font-mono px-1">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-pulse"></span>
                {aspectRatio === '16:9' ? '1280x720 (X Banner HD)' : '720x720 (Telegram Square HD)'}
              </span>
              <span className="flex items-center gap-1 text-[#00f5ff]">
                <Move className="w-3 h-3" /> Drag mascot anywhere on canvas
              </span>
            </div>
          </div>

          {/* Right Customization Controls */}
          <div className="lg:col-span-5 space-y-4">
            {/* 1. Graphic Overlay Badges */}
            <div className="p-3.5 bg-[#0a0b0d] border border-[#2d3139] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase font-bold text-[#00f5ff] tracking-wider font-mono flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#00f5ff]" />
                  Graphic Overlays &amp; Badges
                </label>
              </div>

              <div className="space-y-2">
                {/* Badge 1: Fair Launch Badge */}
                <label className="flex items-center justify-between p-2 rounded bg-[#12141a] border border-[#2d3139] text-xs cursor-pointer hover:border-[#39ff14]/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#39ff14]"></span>
                    <span className="font-mono text-[#e0e0e0] font-bold text-[11px]">
                      🚀 Fair Launch Status Badge
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={badges.pumpBadge}
                    onChange={(e) => setBadges({ ...badges, pumpBadge: e.target.checked })}
                    className="accent-[#39ff14] w-4 h-4 cursor-pointer"
                  />
                </label>

                {/* Badge 2: $TICKER Watermark Stamp */}
                <label className="flex items-center justify-between p-2 rounded bg-[#12141a] border border-[#2d3139] text-xs cursor-pointer hover:border-[#00f5ff]/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#00f5ff] font-bold">{narrative.ticker}</span>
                    <span className="font-mono text-[#e0e0e0] text-[11px]">Symbol Watermark</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={badges.tickerWatermark}
                    onChange={(e) => setBadges({ ...badges, tickerWatermark: e.target.checked })}
                    className="accent-[#00f5ff] w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* 2. Transparent Mascot Stamping & Snapping Controls */}
            <div className="p-3.5 bg-[#0a0b0d] border border-[#2d3139] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase font-bold text-[#ccff00] tracking-wider font-mono flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-[#ccff00]" />
                  Transparent Mascot Stamping
                </label>
                <button
                  onClick={() =>
                    setMascotStamp((prev) => ({
                      ...prev,
                      transparentCutout: !prev.transparentCutout,
                    }))
                  }
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                    mascotStamp.transparentCutout
                      ? 'bg-[#ccff00] text-black border-[#ccff00]'
                      : 'bg-[#12141a] text-[#e0e0e0] border-[#2d3139]'
                  }`}
                >
                  {mascotStamp.transparentCutout ? '✓ Cutout Active' : 'Cutout (No BG)'}
                </button>
              </div>

              {/* Snapping Presets */}
              <div>
                <span className="text-[9px] uppercase font-mono text-[#e0e0e0] opacity-50 block mb-1.5">
                  Snap Location Presets
                </span>
                <div className="grid grid-cols-5 gap-1 text-[10px] font-mono">
                  {(
                    [
                      { id: 'top-left', label: 'TL' },
                      { id: 'top-right', label: 'TR' },
                      { id: 'center', label: 'Center' },
                      { id: 'bottom-left', label: 'BL' },
                      { id: 'bottom-right', label: 'BR' },
                    ] as const
                  ).map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() =>
                        setMascotStamp((prev) => ({
                          ...prev,
                          snappedPosition: pos.id,
                        }))
                      }
                      className={`py-1 rounded border text-center transition-colors cursor-pointer ${
                        mascotStamp.snappedPosition === pos.id
                          ? 'bg-[#1a1d24] border-[#00f5ff] text-[#00f5ff]'
                          : 'bg-[#12141a] border-[#2d3139] text-[#e0e0e0] hover:border-[#00f5ff]/40'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scale & Opacity Sliders */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-[#e0e0e0] opacity-60 mb-1">
                    <span>Scale:</span>
                    <span>{mascotStamp.scale.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.8"
                    step="0.1"
                    value={mascotStamp.scale}
                    onChange={(e) =>
                      setMascotStamp((prev) => ({
                        ...prev,
                        scale: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full accent-[#00f5ff] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono text-[#e0e0e0] opacity-60 mb-1">
                    <span>Opacity:</span>
                    <span>{mascotStamp.opacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={mascotStamp.opacity}
                    onChange={(e) =>
                      setMascotStamp((prev) => ({
                        ...prev,
                        opacity: parseInt(e.target.value, 10),
                      }))
                    }
                    className="w-full accent-[#ccff00] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* 3. Meme Template Selection */}
            <div>
              <label className="text-[10px] uppercase font-bold opacity-40 mb-1.5 block tracking-wider font-mono">
                Select Meme Template
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map((tpl) => {
                  const isSelected = selectedTemplate === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => {
                        setSelectedTemplate(tpl.id);
                        if (tpl.id === 'Breaking News') {
                          setTopHeader('BREAKING NEWS');
                          setBottomCaption(`LOCAL MAN REPLACES ENTIRE TECH TEAM WITH ${narrative.ticker}`);
                        } else if (tpl.id === 'Official Launch Card') {
                          setTopHeader(`${narrative.token_name.toUpperCase()} FAIR LAUNCH`);
                          setBottomCaption(narrative.tagline || `OFFICIAL COMMUNITY LAUNCH ON SOLANA`);
                        } else if (tpl.id === 'Mascot Spotlight') {
                          setTopHeader(`MEET ${narrative.token_name.toUpperCase()}`);
                          setBottomCaption(`OFFICIAL MASCOT OF ${narrative.ticker} • 100% COMMUNITY OWNED`);
                        } else if (tpl.id === 'Laser Eyes Degen') {
                          setTopHeader('SOLANA ULTRA-SPEED ACTIVATED');
                          setBottomCaption(`SLEEPING IS TEMPORARY, ${narrative.ticker} DIAMOND HANDS ARE FOREVER`);
                        } else {
                          setTopHeader(`${narrative.token_name.toUpperCase()} LAUNCH`);
                          setBottomCaption(narrative.tagline);
                        }
                      }}
                      className={`p-2 rounded border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1a1d24] border-[#00f5ff] text-white shadow-[0_0_10px_rgba(0,245,255,0.2)]'
                          : 'bg-[#0a0b0d] border-[#2d3139] hover:border-[#00f5ff]/40 text-[#e0e0e0]'
                      }`}
                    >
                      <div className="text-base mb-0.5">{tpl.icon}</div>
                      <div className="text-xs font-bold font-sans truncate">{tpl.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Text Content Inputs */}
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] uppercase font-bold opacity-40 block tracking-wider font-mono">
                    Headline Text
                  </label>
                  {isUserModified && (
                    <span className="text-[9px] font-mono text-purple-400">
                      User Custom Edit
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={topHeader}
                  onChange={(e) => {
                    setTopHeader(e.target.value);
                    setIsUserModified(true);
                  }}
                  className="w-full bg-[#0a0b0d] border border-[#2d3139] rounded p-2 text-xs text-[#e0e0e0] focus:border-[#00f5ff] outline-none font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] uppercase font-bold opacity-40 block tracking-wider font-mono">
                    Bottom Caption / Narrative Punchline
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserModified(false);
                      setIsParodyMode(false);
                      setTopHeader(visual.meme_overlay?.top_header || 'BREAKING NEWS');
                      setBottomCaption(
                        visual.meme_overlay?.bottom_caption ||
                          `LOCAL MAN REPLACES ENTIRE TECH TEAM WITH ${narrative.ticker}`
                      );
                    }}
                    className="text-[9px] font-mono text-slate-400 hover:text-[#00f5ff] cursor-pointer"
                  >
                    Reset to Verified Original
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={bottomCaption}
                  onChange={(e) => {
                    setBottomCaption(e.target.value);
                    setIsUserModified(true);
                  }}
                  className="w-full bg-[#0a0b0d] border border-[#2d3139] rounded p-2 text-xs text-[#e0e0e0] focus:border-[#00f5ff] outline-none font-mono resize-none"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Gallery Grid (3 Auto-Generated Meme Variations Side-by-Side) */}
        <div className="mt-8 pt-6 border-t border-[#2d3139]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-xs uppercase font-bold text-[#00f5ff] tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00f5ff]" />
                Auto-Generated Variations
              </h3>
              <p className="text-[11px] text-[#8b949e] font-sans">
                Click any variation below to edit its captions or adjust layout on canvas.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#00f5ff] bg-[#00f5ff]/10 border border-[#00f5ff]/30 px-2.5 py-1 rounded-lg">
                📦 Auto-saved for launch pack
              </span>
            </div>
          </div>

          {/* 3 Variations Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Variation 1: Breaking News Alert */}
            <div
              onClick={() => {
                setSelectedTemplate('Breaking News');
                setTopHeader('BREAKING NEWS');
                setBottomCaption(`LOCAL MAN REPLACES ENTIRE TECH TEAM WITH ${narrative.ticker}`);
                setAspectRatio('1:1');
              }}
              className="bg-[#0a0b0d] border border-[#2d3139] hover:border-[#00f5ff] rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.01] group shadow-lg"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[#e0e0e0] mb-2 opacity-80">
                <span className="text-[#ef4444] font-bold">Variation 01: Breaking News</span>
                <span>1:1 Square</span>
              </div>
              <div className="aspect-square bg-[#0b1120] rounded-lg border border-[#2d3139] overflow-hidden relative flex flex-col justify-between p-2">
                <div className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center justify-between">
                  <span>🚨 BREAKING NEWS</span>
                  <span className="bg-yellow-400 text-black px-1 text-[7px] font-black rounded">LIVE</span>
                </div>
                <div className="my-auto flex items-center justify-center">
                  {visual.mascot_image_url ? (
                    <img
                      src={visual.mascot_image_url}
                      alt="AI Mascot"
                      className="w-20 h-20 object-contain rounded"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      className="w-20 h-20"
                      dangerouslySetInnerHTML={{ __html: visual.mascot_svg || '' }}
                    />
                  )}
                </div>
                <div className="bg-black/90 border border-cyan-400/50 p-1.5 rounded text-[8px] font-mono text-center text-white">
                  <div className="text-yellow-400 text-[7px] font-bold">CLAWPUMP BREAKING MEME FEED</div>
                  LOCAL MAN REPLACES ENTIRE TEAM WITH {narrative.ticker}
                </div>
              </div>
            </div>

            {/* Variation 2: Official Fair Launch Card */}
            <div
              onClick={() => {
                setSelectedTemplate('Official Launch Card');
                setTopHeader(`${narrative.token_name.toUpperCase()} FAIR LAUNCH`);
                setBottomCaption(narrative.tagline || `OFFICIAL COMMUNITY LAUNCH ON SOLANA`);
                setAspectRatio('1:1');
              }}
              className="bg-[#0a0b0d] border border-[#2d3139] hover:border-[#39ff14] rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.01] group shadow-lg"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[#e0e0e0] mb-2 opacity-80">
                <span className="text-[#39ff14] font-bold">Variation 02: Launch Card</span>
                <span>1:1 Square</span>
              </div>
              <div className="aspect-square bg-[#0b1426] rounded-lg border border-[#2d3139] overflow-hidden relative flex flex-col justify-between p-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#00f5ff] text-[9px] font-black font-mono truncate">
                    🚀 {narrative.token_name.toUpperCase()}
                  </span>
                  <span className="bg-emerald-950 text-[#39ff14] border border-[#39ff14] text-[7px] font-black px-1 py-0.5 rounded shrink-0">
                    FAIR LAUNCH
                  </span>
                </div>
                <div className="my-auto flex items-center justify-center relative">
                  {visual.mascot_image_url ? (
                    <img
                      src={visual.mascot_image_url}
                      alt="AI Mascot"
                      className="w-20 h-20 object-contain rounded opacity-85"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      className="w-20 h-20 opacity-85"
                      dangerouslySetInnerHTML={{ __html: visual.mascot_svg || '' }}
                    />
                  )}
                </div>
                <div className="bg-black/90 border border-emerald-500/60 p-1.5 rounded text-[8px] font-mono text-center text-white truncate">
                  {narrative.tagline || `OFFICIAL COMMUNITY LAUNCH ON SOLANA`}
                </div>
              </div>
            </div>

            {/* Variation 3: X Launch Header Banner */}
            <div
              onClick={() => {
                setSelectedTemplate('Custom Banner');
                setTopHeader(`${narrative.token_name.toUpperCase()} LAUNCH BANNER`);
                setBottomCaption(narrative.tagline);
                setAspectRatio('16:9');
              }}
              className="bg-[#0a0b0d] border border-[#2d3139] hover:border-[#00f5ff] rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.01] group shadow-lg"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[#e0e0e0] mb-2 opacity-80">
                <span className="text-[#00f5ff] font-bold">Variation 03: X Header Banner</span>
                <span>16:9 Banner</span>
              </div>
              <div className="aspect-video bg-[#0b1120] rounded-lg border border-[#2d3139] overflow-hidden relative flex flex-col justify-between p-2">
                <div className="flex justify-between items-center text-[8px] font-mono">
                  <span className="text-[#00f5ff] font-black">{narrative.token_name.toUpperCase()}</span>
                  <span className="text-[#39ff14]">FAIR LAUNCH READY</span>
                </div>
                <div className="my-auto flex items-center justify-center">
                  {visual.mascot_image_url ? (
                    <img
                      src={visual.mascot_image_url}
                      alt="AI Mascot"
                      className="w-16 h-16 object-contain rounded"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      className="w-16 h-16"
                      dangerouslySetInnerHTML={{ __html: visual.mascot_svg || '' }}
                    />
                  )}
                </div>
                <div className="bg-black/90 border border-cyan-400/50 p-1 rounded text-[7px] font-mono text-center text-cyan-200 truncate">
                  {narrative.tagline}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step Transition Action Bar */}
        <div className="mt-6 pt-4 border-t border-[#2d3139] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-[#e0e0e0] opacity-60 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{isDeployed ? 'Live Token Asset Studio' : 'Assets ready'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {isDeployed && onGoToCockpit && (
              <button
                type="button"
                onClick={() => {
                  try {
                    if (canvasRef.current) {
                      const dataUrl = canvasRef.current.toDataURL('image/png');
                      onUpdateVisual({
                        ...visual,
                        rendered_meme_url: dataUrl,
                      });
                    }
                  } catch (e) {
                    console.warn('Could not export canvas to dataUrl:', e);
                  }
                  onGoToCockpit();
                }}
                className="w-full sm:w-auto py-3 px-5 bg-[#39ff14] text-black font-bold text-xs uppercase tracking-tight rounded-xl hover:bg-[#52ff33] shadow-[0_0_20px_rgba(57,255,20,0.25)] flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Save &amp; Return to Cockpit</span>
              </button>
            )}

            <button
              onClick={() => {
                try {
                  if (canvasRef.current) {
                    const dataUrl = canvasRef.current.toDataURL('image/png');
                    onUpdateVisual({
                      ...visual,
                      rendered_meme_url: dataUrl,
                    });
                  }
                } catch (e) {
                  console.warn('Could not export canvas to dataUrl:', e);
                }
                onNext();
              }}
              className="w-full sm:w-auto py-3 px-5 bg-[#00f5ff] text-black font-bold text-xs uppercase tracking-tight rounded-xl hover:bg-[#b2faff] shadow-[0_0_20px_rgba(0,245,255,0.3)] flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
            >
              <span>{isDeployed ? 'Continue to Deployment Specs' : 'Approve & Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
