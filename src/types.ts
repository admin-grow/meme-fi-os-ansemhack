export type CategoryType = 
  | 'Tech/AI Absurdism' 
  | 'Relatable Degen' 
  | 'Absurdist Animal' 
  | 'Custom';

export type MemeStyleType = 
  | 'Pixel Art' 
  | 'Cyberpunk' 
  | 'Comic Book' 
  | '3D Render';

export type AspectRatioType = '1:1' | '16:9';

export type MemeTemplateType = 
  | 'Breaking News' 
  | 'Official Launch Card'
  | 'Mascot Spotlight'
  | 'Custom Banner'
  | 'Laser Eyes Degen'
  | 'Drake Meme' 
  | 'Distracted Boyfriend'
  | 'God Candle Chart';

export interface CryptoOverlayBadges {
  pumpBadge: boolean;
  fairLaunchBadge?: boolean;
  tickerWatermark: boolean;
}

export interface MascotStampConfig {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  transparentCutout: boolean;
  snappedPosition: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'custom';
}

export type RaidEventType = 
  | 'Token Launch' 
  | 'Green Candle Spike' 
  | 'Milestone Hit' 
  | 'Twitter Raid'
  | 'Twitter Mobilization';

export type BroadcastEventType = RaidEventType;
export type CommunityAlertEventType = RaidEventType;

export interface TickerAuditResult {
  ticker: string;
  is_unique_on_dex: boolean;
  is_trademark_safe: boolean;
  collision_count: number;
  existing_pairs_summary?: string;
  trademark_risk_notes?: string;
  collision_level: 'CLEAN' | 'LOW' | 'MEDIUM' | 'HIGH_COLLISION' | 'TRADEMARK_FLAG';
  suggested_alternatives?: string[];
}

export interface Agent0AuditSummary {
  verified: boolean;
  intercepted: boolean;
  log_id?: string;
  compliance_score: number;
  triggers?: string[];
  preflight_components?: {
    subject: string;
    narrative_objective: string;
    vibe_tone: string;
    driving_behavior: string;
    art_medium: string;
    is_crypto_persona?: boolean;
  };
}

export interface Agent1NarrativeResult {
  ticker_audit?: TickerAuditResult;
  agent0_audit?: Agent0AuditSummary;
  token_name: string;
  ticker: string;
  tagline: string;
  rallying_phrase?: string;
  viral_score: number;
  lore: string;
  tweet_pack: string[];
  mascot_prompt: string;
  safety_adjustment?: string | null;
}

export interface MemeOverlayConfig {
  template_type: string;
  top_header: string;
  bottom_caption: string;
  ticker_watermark: string;
}

export interface Agent2VisualResult {
  image_generation_prompt: string;
  negative_prompt: string;
  meme_overlay: MemeOverlayConfig;
  visual_elements?: {
    character_type?: string;
    primary_color?: string;
    accent_color?: string;
    expression?: string;
    accessories?: string[];
    background_style?: string;
    svg_badge_icon?: string;
  };
  mascot_svg?: string;
  mascot_image_url?: string;
  rendered_meme_url?: string;
}

export interface Agent3TelegramResult {
  telegram_message: string;
  button_label: string;
  button_url: string;
  alert_type?: string;
  buy_volume_sol?: number;
  market_cap_usd?: string;
}

export interface FullCampaignData {
  agent1: Agent1NarrativeResult;
  agent2: Agent2VisualResult;
  agent3: Agent3TelegramResult;
  deployment?: TokenDeploymentData;
}

export interface OnChainAuditInstruction {
  ixIndex: number;
  program: string;
  action: string;
  auditRule: string;
  status: 'VERIFIED' | 'REVOKED' | 'BURNED' | 'ATOMIC_CONFIRMED';
}

export interface OnChainVerificationSpecs {
  atomicTransaction: boolean;
  mintAuthorityRevoked: boolean;
  freezeAuthorityRevoked: boolean;
  revocationInstructionIndices: number[];
  lpLockAddress: string;
  lpBurnTx: string;
  lpLockMethod: string;
  lpTokensBurnedPercent: number;
  jitoBundleId: string;
  jitoTipSol: number;
  antiSnipeMevProtection: string;
  devMaxBlock0HoldingPercent: number;
  atomicInstructions: OnChainAuditInstruction[];
  auditCertificationStatus: 'PASS_AUDIT_READY';
}

export type OnChainAuditGuarantees = OnChainVerificationSpecs;

export interface TokenSocialLinks {
  twitter?: string;
  telegram?: string;
  website?: string;
}

export interface TokenDeploymentData {
  deployed: boolean;
  mintAddress: string;
  txHash: string;
  liquidityPool: string;
  bondingCurve: string;
  blockNumber: number;
  solanaNetwork: string;
  timestamp: string;
  deployerWallet: string;
  initialSupply: string;
  poolShare: string;
  clawPumpUrl: string;
  socialLinks?: TokenSocialLinks;
  verificationSpecs?: OnChainVerificationSpecs;
  auditGuarantees?: OnChainVerificationSpecs;
  rewardModel?: 'HOLDER_REWARDS' | 'CREATOR_FEE';
  creatorFeePercent?: number;
  quoteAssetType?: 'SOL';
  quoteAssetSymbol?: string;
  holderRewardsFrequency?: string;
  minHoldingForRewardsUsd?: number;
  // On-Chain Inscription & Token-2022 Metadata
  inscriptionMode?: 'STANDARD_OFFCHAIN' | 'TOKEN2022_INSCRIBED';
  inscribedRentSol?: number;
  inscriptionAccountPda?: string;
  inscriptionPayloadBytes?: number;
  inscriptionMimeType?: string;
  inscriptionSha256?: string;
  payerType?: 'CREATOR_WALLET' | 'PLATFORM_SPONSORED';
}

export type WizardStep = 1 | 2 | 3 | 4;

// =========================================================================
// CHAPTER 6: AUTONOMOUS 4-AGENT DEFENSE SWARM TYPES
// =========================================================================
export type SwarmAgentId = 'shield' | 'raider' | 'sentinel' | 'lore_keeper';
export type SwarmAgentStatus = 'ACTIVE' | 'DEFENDING' | 'IDLE';

export interface FudAnnihilatorResult {
  fud_query: string;
  rebuttal_message: string;
  confidence_score: number;
  on_chain_facts: {
    bonding_curve_percent: number;
    top_10_holder_percent: number;
    liquidity_locked: boolean;
    dev_holding_percent: number;
    creator_fees_to_inference_percent: number;
  };
  threat_level: 'LOW' | 'MEDIUM' | 'CRITICAL_PANIC';
  timestamp: string;
}

export interface TwitterRaiderResult {
  target_topic: string;
  influencer_handle?: string;
  tweet_reply_copy: string;
  viral_hashtags: string[];
  engagement_angle: string;
  raid_intent_url: string;
  mobilize_intent_url?: string;
  timestamp: string;
}

export type TwitterMobilizerResult = TwitterRaiderResult;
export type MobilizeEventType = RaidEventType;

export interface WhaleSentinelResult {
  buy_amount_sol: number;
  buyer_wallet: string;
  green_candle_message: string;
  market_cap_usd: string;
  raydium_progress_percent: number;
  celebration_badge: string;
  timestamp: string;
}

export interface LoreKeeperResult {
  season_number: number;
  episode_title: string;
  narrative_hook: string;
  new_lore_snippet: string;
  sidekick_or_artifact: string;
  visual_meme_prompt: string;
  timestamp: string;
}

export interface SwarmLogEvent {
  id: string;
  timestamp: string;
  agentId: SwarmAgentId;
  agentName: string;
  eventType: 'SHIELD_DEFENSE' | 'TWITTER_RAID' | 'TWITTER_MOBILIZE' | 'WHALE_RADAR' | 'LORE_EXPANSION';
  title: string;
  detail: string;
  metrics?: string;
  verifiedOnChain?: boolean;
}

// -------------------------------------------------------------
// Superadmin Guardian & Platform Metrics Interfaces
// -------------------------------------------------------------

export interface RpcNodeTelemetry {
  endpoint: string;
  region: string;
  tps: number;
  latencyMs: number;
  status: 'HEALTHY' | 'SYNCING' | 'DEGRADED';
}

export interface SuperadminHallucinationLog {
  id: string;
  timestamp: string;
  tokenName: string;
  ticker: string;
  category: string;
  severity: 'CRITICAL_DEFUSED' | 'HIGH_PREVENTED' | 'MEDIUM_CLEARED' | 'CLEAN_PASS';
  triggerKeywords: string[];
  originalText: string;
  sanitizedText: string;
  auditAction: 'AUTO_SANITIZED_TO_PARODY' | 'EQUITY_CLAIM_DEFUSED' | 'TRADEMARK_PARODIED' | 'PASSED_CLEAN';
  complianceScore: number;
}

export interface SuperadminMetrics {
  totalGenerations: number;
  cleanPasses: number;
  hallucinationsIntercepted: number;
  compliancePassRate: number;
  avgLatencyMs: number;
  totalPromptTokensEst: number;
  totalOutputTokensEst: number;
  solRaisedSimulated: number;
  tokensDeployedTotal: number;
  lpBurnedCount: number;
  hitlApprovalsStamped: number;
  activeRpcNodes: RpcNodeTelemetry[];
}

export interface SuperadminCircuitBreakers {
  masterLaunchActive: boolean;
  strictParodyEnforcement: boolean;
  instantAgent0AutoRewrite: boolean;
}

export interface SuperadminTelemetryResponse {
  status: string;
  metrics: SuperadminMetrics;
  circuitBreakers: SuperadminCircuitBreakers;
  bannedKeywords: string[];
  hallucinationLogs: SuperadminHallucinationLog[];
  timestamp: string;
}


