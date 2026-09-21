import React, { useState, useEffect } from 'react';
import { WalletProvider, useSolanaWallet } from './context/WalletContext';
import { TokenProvider, useTokenContext, LaunchedTokenRecord } from './context/TokenContext';
import { 
  CategoryType, 
  WizardStep, 
  FullCampaignData, 
  Agent1NarrativeResult,
  Agent2VisualResult, 
  TokenDeploymentData, 
  RaidEventType,
  Agent3TelegramResult 
} from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { WizardStepper } from './components/WizardStepper';
import { AboutSection } from './components/AboutSection';
import { AgentsOverviewSection } from './components/AgentsOverviewSection';
import { FaqSection } from './components/FaqSection';
import { Step1ConceptHub } from './components/Step1ConceptHub';
import { Step3MemeStudio } from './components/Step3MemeStudio';
import { Step4TokenDeploy } from './components/Step4TokenDeploy';
import { Step5TelegramPostLaunch } from './components/Step5TelegramPostLaunch';
import { DynamicTokenMicroSite } from './components/DynamicTokenMicroSite';
import { generateVectorMascotSvg } from './utils/mascotSvgGenerator';
import { generateClientFallbackCampaign } from './utils/fallbackCampaign';
import { AppSidebar } from './components/AppSidebar';
import { CryptoTerminalLanding } from './components/CryptoTerminalLanding';
import { WhitepaperModal } from './components/WhitepaperModal';
import { ImportTokenModal } from './components/ImportTokenModal';
import { NarrativeLifecycleModal } from './components/NarrativeLifecycleModal';
import { AssetFinderModal } from './components/AssetFinderModal';
import { CommunityEngagementModal } from './components/CommunityEngagementModal';
import { DevPortfolioModal } from './components/DevPortfolioModal';
import { SuperAdminDashboardModal } from './components/SuperAdminDashboardModal';
import { Zap, Sparkles, ShieldCheck, Globe, ArrowLeft, ExternalLink, Laptop, BookOpen, ArrowRight, FolderOpen, Radio, TrendingUp, Coins, Menu } from 'lucide-react';

function AppContent() {
  const { wallet } = useSolanaWallet();
  const { userTokens, activeToken, saveLaunchedToken, setActiveTokenByMint } = useTokenContext();

  // Primary View Controller: 'landing' (Crypto Terminal & Launches) vs 'studio' (Standalone App Workspace)
  const [activeView, setActiveView] = useState<'studio' | 'landing'>('landing');

  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [maxReachedStep, setMaxReachedStep] = useState<WizardStep>(1);

  // Concept parameters
  const [category, setCategory] = useState<CategoryType>('Tech/AI Absurdism');
  const [prompt, setPrompt] = useState<string>('');

  // Sidebar & Modal States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isNarrativeModalOpen, setIsNarrativeModalOpen] = useState<boolean>(false);
  const [isAssetFinderOpen, setIsAssetFinderOpen] = useState<boolean>(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState<boolean>(false);
  const [isDevPortfolioOpen, setIsDevPortfolioOpen] = useState<boolean>(false);
  const [isSuperAdminOpen, setIsSuperAdminOpen] = useState<boolean>(false);
  const [isWhitepaperOpen, setIsWhitepaperOpen] = useState<boolean>(false);

  // Check URL query parameters for direct route to studio or specific view
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'studio' || params.get('studio') === 'true' || params.get('step') || params.get('create') === 'true') {
        setActiveView('studio');
      } else if (params.get('view') === 'landing') {
        setActiveView('landing');
      }
    }
  }, []);

  // Global Superadmin Keyboard Shortcut: Ctrl+Shift+A / Cmd+Shift+A or private URL query
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsSuperAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('superadmin') === 'true' || params.get('admin') === 'true' || window.location.hash === '#superadmin') {
        setIsSuperAdminOpen(true);
      }
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Campaign State
  const [campaign, setCampaign] = useState<FullCampaignData | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeAgentLog, setActiveAgentLog] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRefreshingRaid, setIsRefreshingRaid] = useState<boolean>(false);

  // Dynamic Route / Preview State (/token/:mintAddress or ?token=...)
  const [activeTokenRouteCA, setActiveTokenRouteCA] = useState<string | null>(null);
  const [isPreviewingMicroSite, setIsPreviewingMicroSite] = useState<boolean>(false);

  // Check URL pathname or query param for direct token route
  useEffect(() => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const queryToken = searchParams.get('token');

    if (path.startsWith('/token/')) {
      const ca = path.replace('/token/', '').trim();
      if (ca) {
        setActiveTokenRouteCA(ca);
      }
    } else if (queryToken) {
      setActiveTokenRouteCA(queryToken.trim());
    }
  }, []);

  // Responsive mobile viewport tracking for layout spacing and mobile header detection
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 768px)');
    const handleViewportChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobileViewport(e.matches);
    };
    handleViewportChange(mq);

    try {
      mq.addEventListener('change', handleViewportChange);
      return () => mq.removeEventListener('change', handleViewportChange);
    } catch {
      mq.addListener(handleViewportChange);
      return () => mq.removeListener(handleViewportChange);
    }
  }, []);

  const scrollToStudio = () => {
    setActiveView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate full campaign invoking Agent 1, Agent 2, Agent 3
  const handleGenerateCampaign = async (autoAdvance: boolean = true) => {
    setIsGenerating(true);
    setErrorMessage(null);
    setActiveAgentLog('Agent 1 (Trend Strategist): Mining Crypto Twitter tropes & crafting $TICKER lore...');

    const timer1 = setTimeout(() => {
      setActiveAgentLog('Agent 2 (Visual Designer): Rendering 512x512 vector mascot & Breaking News overlays...');
    }, 1000);

    const timer2 = setTimeout(() => {
      setActiveAgentLog('Agent 3 (Community Mobilizer): Generating Telegram buy alerts & Twitter broadcast actions...');
    }, 2000);

    try {
      const response = await fetch('/api/generate-full-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          category,
          prompt,
          template_type: 'Breaking News',
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      const contentType = response.headers.get('content-type') || '';
      let data: FullCampaignData | null = null;

      if (response.ok && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch {
          data = null;
        }
      }

      // If backend returned valid campaign data, use it
      if (data && data.agent1 && data.agent2 && data.agent3) {
        setCampaign(data);
      } else {
        // Resilient deterministic client-side synthesis ensures the user flow is NEVER blocked
        const fallbackData = generateClientFallbackCampaign({
          category,
          prompt,
          template_type: 'Breaking News',
        });
        setCampaign(fallbackData);
      }

      // Keep user on Step 1 to review and understand the narrative in the right pane before proceeding
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.warn('Network campaign generation fallback triggered:', err);
      // Seamlessly fall back to client-side generated suite
      const fallbackData = generateClientFallbackCampaign({
        category,
        prompt,
        template_type: 'Breaking News',
      });
      setCampaign(fallbackData);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsGenerating(false);
      setActiveAgentLog('');
    }
  };

  // Step Navigation Handler with guard rails
  const handleStepNavigation = (step: WizardStep) => {
    if (step <= maxReachedStep) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setCampaign(null);
    setCurrentStep(1);
    setMaxReachedStep(1);
    setErrorMessage(null);
    setPrompt('');
    setActiveView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateVisual = (newVisual: Agent2VisualResult) => {
    if (campaign) {
      setCampaign({
        ...campaign,
        agent2: newVisual,
      });
    }
  };

  const handleDeploySuccess = (deploymentData: TokenDeploymentData) => {
    if (campaign) {
      setCampaign({
        ...campaign,
        deployment: deploymentData,
      });

      // Save to global Token context for multi-token workspace
      saveLaunchedToken({
        mintAddress: deploymentData.mintAddress,
        tokenName: campaign.agent1.token_name,
        ticker: campaign.agent1.ticker.replace('$', ''),
        tagline: campaign.agent1.tagline,
        lore: campaign.agent1.lore,
        imageUrl: campaign.agent2.rendered_meme_url || campaign.agent2.mascot_image_url || '',
        mascotSvg: campaign.agent2.mascot_svg,
        renderedMemeUrl: campaign.agent2.rendered_meme_url,
        ipfsMetadataUri: deploymentData.clawPumpUrl || '',
        creatorWallet: wallet?.address || 'Self-Custody Connected',
        socialLinks: deploymentData.socialLinks,
      });
    }
  };

  const handleRefreshRaid = async (eventType: RaidEventType) => {
    if (!campaign) return;
    setIsRefreshingRaid(true);

    try {
      const response = await fetch('/api/generate-telegram-raid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deployed_ticker: campaign.agent1.ticker,
          event_type: eventType,
          vibe_tone: campaign.agent1.tagline,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh raid alert');
      }

      const raidData: Agent3TelegramResult = await response.json();
      setCampaign({
        ...campaign,
        agent3: raidData,
      });
    } catch (err: any) {
      console.error('Raid refresh error:', err);
    } finally {
      setIsRefreshingRaid(false);
    }
  };

  const handleSelectTokenForMicroSite = (token: LaunchedTokenRecord) => {
    setActiveTokenRouteCA(token.mintAddress);
    setIsPreviewingMicroSite(true);
  };

  const handleSelectTokenToStudio = (token: LaunchedTokenRecord) => {
    setActiveTokenByMint(token.mintAddress);

    // Populate the Studio campaign state with this token so Steps 1, 2, 3, 4 are fully active
    const tokenCampaign: FullCampaignData = {
      agent1: {
        token_name: token.tokenName,
        ticker: token.ticker.startsWith('$') ? token.ticker : `$${token.ticker}`,
        tagline: token.tagline,
        lore: token.lore,
        viral_score: 96,
        tweet_pack: [
          `🔥 ${token.tokenName} ($${token.ticker.replace('$', '')}) is live on Solana!`,
          token.tagline,
          `Join the community: https://clawpump.tech/token/${token.mintAddress}`,
        ],
        mascot_prompt: token.lore,
      },
      agent2: {
        image_generation_prompt: `High quality vector mascot of ${token.tokenName}`,
        negative_prompt: 'blurry, low quality',
        meme_overlay: {
          template_type: 'Breaking News',
          top_header: 'BREAKING NEWS',
          bottom_caption: `${token.tokenName.toUpperCase()} ACTIVE ON SOLANA`,
          ticker_watermark: token.ticker.startsWith('$') ? token.ticker : `$${token.ticker}`,
        },
        mascot_image_url: token.imageUrl,
        mascot_svg: token.mascotSvg || generateVectorMascotSvg(
          token.ticker,
          token.tokenName,
          token.lore,
          'Tech/AI Absurdism'
        ),
        rendered_meme_url: token.renderedMemeUrl || token.imageUrl,
      },
      agent3: {
        telegram_message: `🚀 <b>NEW $${token.ticker.replace('$', '')} COMMUNITY DISPATCH!</b>\n\nAutonomous agents deployed $${token.ticker.replace('$', '')} on Solana.\n\n🎯 <b>Target:</b> 100 Replies & Retweets.\n\n👇 <b>Engage now:</b>`,
        button_label: `⚡ Execute $${token.ticker.replace('$', '')} Broadcast`,
        button_url: `https://x.com/intent/tweet?text=${encodeURIComponent(`Check out $${token.ticker.replace('$', '')} on Solana! CA: ${token.mintAddress}`)}`,
      },
      deployment: {
        deployed: true,
        mintAddress: token.mintAddress,
        txHash: '5zK9X...simulatedSolanaTxHash',
        liquidityPool: 'Raydium-ClawPump-BondingCurve',
        bondingCurve: 'SolanaProgram2022BondingEngine',
        blockNumber: 29482910,
        solanaNetwork: 'mainnet-beta',
        timestamp: new Date(token.launchedAt || Date.now()).toISOString(),
        deployerWallet: token.creatorWallet,
        initialSupply: '1,000,000,000',
        poolShare: '100% Fair Launch',
        clawPumpUrl: `https://clawpump.tech/token/${token.mintAddress}`,
        socialLinks: token.socialLinks,
      }
    };

    setCampaign(tokenCampaign);
    setMaxReachedStep(4);
    setCurrentStep(2); // Jump straight to Step 2 (Visual Studio / Meme Studio)
    setActiveView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If viewing dynamic micro-site full-screen
  if (activeTokenRouteCA || isPreviewingMicroSite) {
    const matchedToken = userTokens.find((t) => t.mintAddress === activeTokenRouteCA) || activeToken;

    // Build rich narrative from matched record or active campaign
    const microSiteNarrative: Agent1NarrativeResult = matchedToken ? {
      token_name: matchedToken.tokenName,
      ticker: matchedToken.ticker.startsWith('$') ? matchedToken.ticker : `$${matchedToken.ticker}`,
      tagline: matchedToken.tagline,
      lore: matchedToken.lore,
      viral_score: 96,
      tweet_pack: [
        `🔥 ${matchedToken.tokenName} ($${matchedToken.ticker}) is live on Solana!`,
        matchedToken.tagline,
        `Join the community: https://clawpump.tech/token/${matchedToken.mintAddress}`,
      ],
      mascot_prompt: matchedToken.lore,
    } : (campaign?.agent1 || {
      token_name: 'Swarm Mind Protocol',
      ticker: '$SWRMS',
      tagline: 'Autonomous Multi-Agent Swarm Coin on ClawPump',
      lore: 'Forged in high-frequency Solana bonding curves, combining sovereign agent lore with rapid Telegram community mobilization.',
      viral_score: 96,
      tweet_pack: [
        '⚡ Autonomous meme community mobilization active on Solana! #Solana #MemeCoin',
        'Decentralized community milestone reached on Solana. 100% fair launch, zero presale on @clawpumptech.',
      ],
      mascot_prompt: 'Cyberpunk pixelated sovereign degen mascot on dark matrix background',
    });

    const microSiteVisual: Agent2VisualResult = matchedToken ? {
      image_generation_prompt: `Vector sticker of ${matchedToken.tokenName} mascot`,
      negative_prompt: 'blurry, low quality',
      meme_overlay: {
        template_type: 'Breaking News',
        top_header: 'BREAKING NEWS',
        bottom_caption: `${matchedToken.tokenName.toUpperCase()} GOD CANDLE DETECTED ON SOLANA`,
        ticker_watermark: matchedToken.ticker.startsWith('$') ? matchedToken.ticker : `$${matchedToken.ticker}`,
      },
      mascot_image_url: matchedToken.imageUrl,
      mascot_svg: matchedToken.mascotSvg || generateVectorMascotSvg(
        matchedToken.ticker,
        matchedToken.tokenName,
        matchedToken.lore,
        'Tech/AI Absurdism'
      ),
      rendered_meme_url: matchedToken.renderedMemeUrl || matchedToken.imageUrl,
    } : (campaign?.agent2 || {
      image_generation_prompt: 'Cyberpunk vector mascot',
      negative_prompt: 'blurry',
      meme_overlay: {
        template_type: 'Breaking News',
        top_header: 'BREAKING NEWS',
        bottom_caption: `GOD CANDLE DETECTED FOR ${microSiteNarrative.ticker}`,
        ticker_watermark: microSiteNarrative.ticker,
      },
      mascot_svg: generateVectorMascotSvg(
        microSiteNarrative.ticker,
        microSiteNarrative.token_name,
        microSiteNarrative.lore,
        'Tech/AI Absurdism'
      ),
    });

    const microSiteDeployment: TokenDeploymentData | undefined = campaign?.deployment ? {
      ...campaign.deployment,
    } : (matchedToken ? {
      deployed: true,
      mintAddress: matchedToken.mintAddress,
      txHash: '5zK9X...simulatedSolanaTxHash',
      liquidityPool: 'Raydium-ClawPump-BondingCurve',
      bondingCurve: 'SolanaProgram2022BondingEngine',
      blockNumber: 29482910,
      solanaNetwork: 'mainnet-beta',
      timestamp: new Date(matchedToken.launchedAt || Date.now()).toISOString(),
      deployerWallet: matchedToken.creatorWallet,
      initialSupply: '1,000,000,000',
      poolShare: '100% Fair Launch',
      clawPumpUrl: `https://clawpump.tech/token/${matchedToken.mintAddress}`,
    } : undefined);

    return (
      <DynamicTokenMicroSite
        mintAddress={activeTokenRouteCA || matchedToken?.mintAddress || '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsypump'}
        tokenCA={activeTokenRouteCA || matchedToken?.mintAddress || '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsypump'}
        narrative={microSiteNarrative}
        visual={microSiteVisual}
        deployment={microSiteDeployment}
        onBackToStudio={() => {
          setActiveTokenRouteCA(null);
          setIsPreviewingMicroSite(false);
        }}
      />
    );
  }

  // Compute active narrative data for the Narrative Lifecycle Modal
  const activeNarrativeForModal: Agent1NarrativeResult = campaign?.agent1 || (activeToken ? {
    token_name: activeToken.tokenName,
    ticker: activeToken.ticker.startsWith('$') ? activeToken.ticker : `$${activeToken.ticker}`,
    tagline: activeToken.tagline,
    lore: activeToken.lore,
    viral_score: 95,
    tweet_pack: [
      `🔥 ${activeToken.tokenName} ($${activeToken.ticker}) is live on Solana!`,
      activeToken.tagline,
      `Join the community: https://clawpump.tech/token/${activeToken.mintAddress}`,
    ],
    mascot_prompt: activeToken.lore,
  } : {
    token_name: 'Meme Universe Token',
    ticker: '$MEME',
    tagline: 'The Ultimate Autonomous Multi-Season Narrative Protocol',
    lore: 'From genesis launch to global IRL meta takeover, orchestrating 3 seasons of organic community retention and continuous lore expansion.',
    viral_score: 94,
    tweet_pack: [
      '🔥 Season 1 Genesis has arrived on Solana!',
      'The meme cult is actively expanding across Crypto Twitter.',
      'Join the official community vanguard.',
    ],
    mascot_prompt: 'A cyberpunk vector mascot celebrating victory on Solana',
  });

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-[#e0e0e0] flex font-sans selection:bg-[#00f5ff]/30 selection:text-[#00f5ff] w-full max-w-full relative">
      {/* Left Persistent Workspace Sidebar */}
      <AppSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onLaunchNewCoin={handleReset}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenNarrativeModal={() => setIsNarrativeModalOpen(true)}
        onOpenCommunityModal={() => setIsCommunityModalOpen(true)}
        onOpenAssetFinderModal={() => setIsAssetFinderOpen(true)}
        onOpenDevPortfolioModal={() => setIsDevPortfolioOpen(true)}
        onOpenWhitepaper={() => setIsWhitepaperOpen(true)}
        onSelectTokenForMicroSite={handleSelectTokenForMicroSite}
        onSelectTokenToStudio={handleSelectTokenToStudio}
        campaignNarrative={campaign?.agent1 || null}
        campaignVisual={campaign?.agent2 || null}
        campaignDeployment={campaign?.deployment || null}
        activeView={activeView}
        onChangeView={setActiveView}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 w-full max-w-full transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-[68px]' : 'lg:pl-72'}`}>
        {/* Top Header Navigation with View Switcher */}
        <Header 
          activeView={activeView}
          onChangeView={setActiveView}
          onReset={handleReset} 
          hasData={Boolean(campaign)} 
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenWhitepaper={() => setIsWhitepaperOpen(true)}
        />

        {/* VIEW 1: DEDICATED TOKEN STUDIO WORKSPACE (Default, Clean, Focused) */}
        {activeView === 'studio' ? (
          <main
            id="studio-workspace-main"
            className={`flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 transition-all duration-300 ${
              isMobileSidebarOpen
                ? 'pb-48 sm:pb-56'
                : isMobileViewport
                ? 'pb-40 sm:pb-48 md:pb-32'
                : 'pb-28 sm:pb-36'
            }`}
          >
            {/* Top Workspace Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1e222d]">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#00f5ff] uppercase tracking-widest font-bold">
                  <Zap className="w-3.5 h-3.5 text-[#00f5ff]" />
                  {currentStep === 4 ? 'Post-Launch Operations' : 'Autonomous Solana Studio'}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-0.5">
                  {currentStep === 4
                    ? 'Community & Conviction Cockpit'
                    : 'Meme Coin Genesis Studio'}
                </h2>
              </div>

              {currentStep === 4 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="py-1.5 px-3 rounded-lg bg-[#1a1d24] hover:bg-[#2d3139] text-[#ccff00] border border-[#ccff00]/40 font-mono text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    + Launch Another Coin
                  </button>
                </div>
              )}
            </div>

            {/* 4-Step Guided Stepper Navigation (Always accessible for continuous creation) */}
            <WizardStepper
              currentStep={currentStep}
              maxReachedStep={maxReachedStep}
              onSelectStep={handleStepNavigation}
              isGenerating={isGenerating}
            />

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-[#1a1d24] border border-[#f43f5e]/60 flex items-center justify-between text-xs font-mono text-[#f43f5e]">
                <div className="flex items-center gap-2">
                  <span className="text-base">⚠️</span>
                  <span>{errorMessage}</span>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-[#e0e0e0] opacity-60 hover:opacity-100 uppercase px-2 py-1 bg-[#0a0b0d] rounded border border-[#2d3139]"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Step-by-Step Functional Workspaces */}
            <div className="transition-all duration-300">
              {currentStep === 1 && (
                <Step1ConceptHub
                  category={category}
                  setCategory={setCategory}
                  prompt={prompt}
                  setPrompt={setPrompt}
                  onGenerate={() => handleGenerateCampaign(false)}
                  isGenerating={isGenerating}
                  activeAgentLog={activeAgentLog}
                  narrative={campaign?.agent1 || null}
                  onUpdateNarrative={(updated) => {
                    setCampaign((prev) => prev ? { ...prev, agent1: updated } : null);
                  }}
                  onApproveAndProceed={() => {
                    setCurrentStep(2);
                    setMaxReachedStep((prev) => (prev < 2 ? 2 : prev));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenNarrativeModal={() => setIsNarrativeModalOpen(true)}
                />
              )}

              {currentStep === 2 && campaign && (
                <Step3MemeStudio
                  narrative={campaign.agent1}
                  visual={campaign.agent2}
                  onUpdateVisual={handleUpdateVisual}
                  isDeployed={Boolean(campaign.deployment?.deployed)}
                  onGoToCockpit={() => {
                    setCurrentStep(4);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onNext={() => {
                    setCurrentStep(3);
                    setMaxReachedStep((prev) => (prev < 3 ? 3 : prev));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {currentStep === 3 && campaign && (
                <Step4TokenDeploy
                  narrative={campaign.agent1}
                  deployment={campaign.deployment || null}
                  onDeploySuccess={handleDeploySuccess}
                  onNext={() => {
                    setCurrentStep(4);
                    setMaxReachedStep(4);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  mascotSvg={campaign.agent2?.mascot_svg}
                />
              )}

              {currentStep === 4 && campaign && (
                <Step5TelegramPostLaunch
                  narrative={campaign.agent1}
                  visual={campaign.agent2}
                  telegram={campaign.agent3}
                  deployment={campaign.deployment || null}
                  onRefreshRaid={handleRefreshRaid}
                  isRefreshingRaid={isRefreshingRaid}
                  onOpenMicroSite={() => setIsPreviewingMicroSite(true)}
                  onReturnToMemeStudio={() => {
                    setCurrentStep(2);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onLaunchNewCoin={handleReset}
                  onViewGenesis={() => {
                    setCurrentStep(1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}
            </div>
          </main>
        ) : (
          /* VIEW 2: DEDICATED CRYPTO TERMINAL LANDING PAGE & LAUNCHED TOKENS */
          <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-hidden space-y-12">
            <CryptoTerminalLanding
              onLaunchStudio={scrollToStudio}
              onOpenWhitepaper={() => setIsWhitepaperOpen(true)}
              onSelectTokenForMicroSite={handleSelectTokenForMicroSite}
            />

            {/* Protocol FAQ Hub */}
            <div className="pt-8 border-t border-[#1e2536] space-y-12">
              <div id="faq-section">
                <FaqSection />
              </div>
            </div>
          </div>
        )}

        {/* Standardized Master Footer */}
        <footer
          id="app-footer"
          className={`mt-auto border-t border-[#232938] bg-[#050608] pt-12 pb-24 sm:py-14 text-center text-xs text-[#e0e0e0] font-mono relative z-10 shadow-[0_-8px_24px_rgba(0,0,0,0.6)] w-full max-w-full overflow-x-hidden ${
            activeView === 'studio' ? 'mt-28 sm:mt-32 md:mt-36' : 'mt-16 sm:mt-24'
          }`}
        >
          {/* Demarcation highlight line ensuring clear separation from studio workspace & canvas footer */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00f5ff]/30 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white tracking-wider uppercase text-sm">MEMEFI OS</span>
                <span className="text-[#2d3139]">|</span>
                <span className="text-[#00f5ff] text-[11px]">DYNAMIC MICRO-SITE &amp; SOCIAL SUITE GENERATOR</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="px-2.5 py-1 rounded bg-[#12141a] border border-[#39ff14]/50 text-[#39ff14] text-[10px] font-bold uppercase">
                  #AnsemHack Submission
                </span>
                <span className="px-2.5 py-1 rounded bg-[#12141a] border border-[#00f5ff]/40 text-[#00f5ff] text-[10px] font-bold uppercase">
                  Powered by AI Studio &amp; Solana
                </span>
                <span className="px-2.5 py-1 rounded bg-[#12141a] border border-[#ccff00]/40 text-[#ccff00] text-[10px] font-bold uppercase">
                  Non-Custodial
                </span>
              </div>
            </div>

            {/* Quick Links & Switchers */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#e0e0e0]/80">
              <button
                type="button"
                onClick={() => setActiveView(activeView === 'studio' ? 'landing' : 'studio')}
                className="text-[#00f5ff] hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                {activeView === 'studio' ? '📖 View Landing Page & Docs' : '🚀 Open Launch Studio'}
              </button>
              <span className="text-[#2d3139]">|</span>
              <a
                href="https://x.com/MemeFi_OS"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00f5ff] hover:underline"
              >
                🐦 @MemeFi_OS
              </a>
              <span className="text-[#2d3139]">|</span>
              <a
                href="https://t.me/+gbar8aC6QgkzZDNh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#39ff14] hover:underline"
              >
                💬 Telegram Community
              </a>
            </div>

            {/* Non-Custodial Disclaimer */}
            <div className="pt-4 border-t border-[#1e222d] max-w-4xl mx-auto space-y-2 text-left">
              <div className="flex items-center gap-2 text-[#39ff14] text-[11px] font-bold uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Non-Custodial Disclaimer &amp; Software Interface Notice:</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-80 text-[#c4cddb] font-sans">
                MemeFi OS is provided strictly for informational, educational, and workflow developer tooling purposes. The software does not provide financial services, broker-dealer execution, investment advisory, or custodial escrow. All deployments are signed client-side by the user; MemeFi OS developers maintain zero custody and zero access to user private keys. Tokens created using this interface are speculative, non-functional community meme assets created solely for social interaction, artistic parody, and entertainment. They carry no intrinsic financial value, convey no voting rights or equity ownership, and offer no expectation of profit. Automated pre-flight heuristic checks verify bytecode packaging format and authority revocation flags; they do not constitute formal third-party audits or guarantees against market volatility. Users are solely responsible for inspecting raw transaction parameters and smart contract instructions before signing.
              </p>
            </div>

            {/* Copyright / Attribution */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-[10px] opacity-40 gap-2">
              <span>© 2026 MEMEFI OS // BUILT FOR ANSEMHACK HACKATHON</span>
              <span>ALL RIGHTS RESERVED • STRICTLY NON-CUSTODIAL</span>
            </div>
          </div>
        </footer>

        {/* Mobile Sticky Bottom Navigation Dock (Optimized for one-hand phone navigation) */}
        <nav 
          id="mobile-bottom-dock"
          aria-label="Mobile Navigation"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080b11]/95 backdrop-blur-md border-t border-[#1e2536] px-2 pt-2 pb-safe flex items-center justify-around shadow-[0_-8px_25px_rgba(0,0,0,0.85)]"
        >
          <button
            type="button"
            onClick={() => {
              setActiveView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-mono font-bold transition-all min-h-[44px] min-w-[56px] cursor-pointer ${
              activeView === 'landing' 
                ? 'text-[#00f5ff] bg-[#00f5ff]/15 border border-[#00f5ff]/40 shadow-[0_0_12px_rgba(0,245,255,0.2)]' 
                : 'text-[#8e99ac] hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Launches</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveView('studio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl text-[10px] font-mono font-black transition-all min-h-[44px] cursor-pointer ${
              activeView === 'studio'
                ? 'bg-gradient-to-r from-[#ccff00] to-[#99e600] text-black shadow-[0_0_15px_rgba(204,255,0,0.4)]'
                : 'bg-[#18202d] text-[#ccff00] border border-[#ccff00]/40'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDevPortfolioOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-mono font-bold text-[#8e99ac] hover:text-white transition-all min-h-[44px] min-w-[56px] cursor-pointer active:scale-95"
          >
            <Coins className="w-4 h-4 text-[#39ff14]" />
            <span>My Coins</span>
          </button>

          <button
            type="button"
            onClick={() => setIsWhitepaperOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-mono font-bold text-[#8e99ac] hover:text-white transition-all min-h-[44px] min-w-[56px] cursor-pointer active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-[#00f5ff]" />
            <span>Whitepaper</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-mono font-bold text-[#8e99ac] hover:text-white transition-all min-h-[44px] min-w-[56px] cursor-pointer active:scale-95"
          >
            <Menu className="w-4 h-4 text-[#e0e0e0]" />
            <span>Menu</span>
          </button>
        </nav>
      </div>

      {/* Global Modals */}
      <ImportTokenModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onLaunchNew={handleReset}
        onSelectTokenForMicroSite={handleSelectTokenForMicroSite}
        onSuccess={() => {
          setActiveView('studio');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <NarrativeLifecycleModal
        isOpen={isNarrativeModalOpen}
        onClose={() => setIsNarrativeModalOpen(false)}
        narrative={activeNarrativeForModal}
      />

      <AssetFinderModal
        isOpen={isAssetFinderOpen}
        onClose={() => setIsAssetFinderOpen(false)}
        narrative={campaign?.agent1 || (activeToken ? {
          token_name: activeToken.tokenName,
          ticker: activeToken.ticker,
          tagline: activeToken.tagline || 'Autonomous Meme Coin',
          lore: activeToken.lore || 'Community driven token on Solana',
          viral_score: 95,
          tweet_pack: [],
          mascot_prompt: 'Cyberpunk mascot'
        } : null)}
        visual={campaign?.agent2 || null}
        deployment={campaign?.deployment || (activeToken ? {
          mintAddress: activeToken.mintAddress,
          txHash: activeToken.txHash || '',
          timestamp: activeToken.launchedAt,
          status: 'DEPLOYED',
          bondingCurveAddress: '',
          explorerUrl: `https://solscan.io/token/${activeToken.mintAddress}?cluster=devnet`,
        } : null)}
        onGoToMemeStudio={() => {
          setCurrentStep(2);
          setMaxReachedStep((prev) => (prev < 2 ? 2 : prev));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <CommunityEngagementModal
        isOpen={isCommunityModalOpen}
        onClose={() => setIsCommunityModalOpen(false)}
        narrative={campaign?.agent1 || (activeToken ? {
          token_name: activeToken.tokenName,
          ticker: activeToken.ticker,
          tagline: activeToken.tagline || 'Autonomous Meme Coin',
          lore: activeToken.lore || 'Community driven token on Solana',
          viral_score: 95,
          tweet_pack: [],
          mascot_prompt: 'Cyberpunk mascot'
        } : null)}
        visual={campaign?.agent2 || null}
        deployment={campaign?.deployment || (activeToken ? {
          mintAddress: activeToken.mintAddress,
          txHash: activeToken.txHash || '',
          timestamp: activeToken.launchedAt,
          status: 'DEPLOYED',
          bondingCurveAddress: '',
          explorerUrl: `https://solscan.io/token/${activeToken.mintAddress}?cluster=devnet`,
        } : null)}
        onGoToMemeStudio={() => {
          setCurrentStep(2);
          setMaxReachedStep((prev) => (prev < 2 ? 2 : prev));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <DevPortfolioModal
        isOpen={isDevPortfolioOpen}
        onClose={() => setIsDevPortfolioOpen(false)}
        onSelectTokenForMicroSite={handleSelectTokenForMicroSite}
        onLaunchNewCoin={handleReset}
        onOpenCommunityModal={() => setIsCommunityModalOpen(true)}
      />

      <SuperAdminDashboardModal
        isOpen={isSuperAdminOpen}
        onClose={() => setIsSuperAdminOpen(false)}
      />

      <WhitepaperModal
        isOpen={isWhitepaperOpen}
        onClose={() => setIsWhitepaperOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <WalletProvider>
      <TokenProvider>
        <AppContent />
      </TokenProvider>
    </WalletProvider>
  );
}

export default App;
