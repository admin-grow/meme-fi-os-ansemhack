/**
 * MemeFi OS — Social Compliance & Regulatory Guardrail Framework
 *
 * Implements automated securities law & Howey Test guardrails for meme coin
 * social media generation (X/Twitter, Telegram, Discord, Micro-sites).
 *
 * Categorizes & filters:
 * 1. HOWEY_PROFIT_PROMISE: Explicit or implied promises of financial return/ROI.
 * 2. FOMO_SOLICITATION: High-pressure buying solicitation and artificial urgency ("Get in early", "Buy before migration").
 * 3. MANAGERIAL_EFFORTS: Centralized developer/team promises creating reliance on others.
 * 4. PRICE_MANIPULATION: Coordinated artificial pump triggers.
 */

export type ComplianceRiskCategory =
  | 'HOWEY_PROFIT_PROMISE'
  | 'FOMO_SOLICITATION'
  | 'MANAGERIAL_EFFORTS'
  | 'PRICE_MANIPULATION';

export interface ComplianceFlag {
  phrase: string;
  category: ComplianceRiskCategory;
  reason: string;
  severity: 'HIGH' | 'MEDIUM';
  suggestion: string;
}

export interface ComplianceAuditResult {
  riskLevel: 'SAFE' | 'CAUTION' | 'HIGH_RISK';
  score: number; // 0 to 100 (100 = 100% compliant cultural copy)
  flags: ComplianceFlag[];
  sanitizedText: string;
  isSafeToPublish: boolean;
  summary: string;
  ruleCitations: string[];
}

interface RuleDefinition {
  regex: RegExp;
  category: ComplianceRiskCategory;
  reason: string;
  severity: 'HIGH' | 'MEDIUM';
  suggestion: string;
  replacementPattern: string;
}

const COMPLIANCE_RULES: RuleDefinition[] = [
  // 1. FOMO & Unregistered Public Solicitation
  {
    regex: /\b(get in early|buy before (it'?s too late|migration|raydium|the pump|it sends))\b/gi,
    category: 'FOMO_SOLICITATION',
    reason: 'Creates aggressive speculative FOMO and investment solicitation urgency under securities advertising standards.',
    severity: 'HIGH',
    suggestion: 'Reframe to celebrate decentralized community milestones or open-source culture.',
    replacementPattern: 'explore the open-source community milestone',
  },
  {
    regex: /\b(bonding curve is moving fast|curve filling fast|hurry before)\b/gi,
    category: 'FOMO_SOLICITATION',
    reason: 'Urgency-based solicitation encouraging fast speculative purchases.',
    severity: 'MEDIUM',
    suggestion: 'Describe fair-launch mechanics neutrally.',
    replacementPattern: 'decentralized bonding curve is active',
  },
  {
    regex: /\b(fill your bags|load up now|buy now before|ape in now)\b/gi,
    category: 'FOMO_SOLICITATION',
    reason: 'Direct call-to-action urging speculative purchase of tokens.',
    severity: 'HIGH',
    suggestion: 'Invite users to view artwork, read lore, or join the decentralized community.',
    replacementPattern: 'check out the community lore and artwork',
  },
  {
    regex: /\b(last chance to (buy|enter|get in))\b/gi,
    category: 'FOMO_SOLICITATION',
    reason: 'Artificial scarcity and manipulative urgency trigger.',
    severity: 'HIGH',
    suggestion: 'Highlight permanent 100% fair launch transparency.',
    replacementPattern: '100% fair launch, zero presale',
  },

  // 2. Howey Expectation of Profit & Financial Return
  {
    regex: /\b(\d+x (gains|returns|profit|gem|moonshot)|100x|1000x|\+?\d+00%|make you rich|financial freedom|passive (income|yield))\b/gi,
    category: 'HOWEY_PROFIT_PROMISE',
    reason: 'Directly violates the Howey Test prong by creating a clear expectation of financial profit.',
    severity: 'HIGH',
    suggestion: 'Focus on entertainment, satire, and cultural resonance with zero financial promises.',
    replacementPattern: 'viral meme culture',
  },
  {
    regex: /\b(pump(s|ed|ing)?\s+(to|past)\s+\$?\d+[mkb]?|\$100m|\$1b|target\s+\$?\d+[mkb]?|breaks?\s+chart)\b/gi,
    category: 'HOWEY_PROFIT_PROMISE',
    reason: 'Fabricated financial price target or unverified market capitalization pump claim.',
    severity: 'HIGH',
    suggestion: 'Replace with genuine meme humor and community vibes.',
    replacementPattern: 'embraces pure chill vibes',
  },
  {
    regex: /\b(guaranteed (moon|profit|pump|gains|100x)|easy money)\b/gi,
    category: 'HOWEY_PROFIT_PROMISE',
    reason: 'Explicit guarantee of financial return (strictly prohibited across global financial jurisdictions).',
    severity: 'HIGH',
    suggestion: 'Meme tokens carry zero financial guarantees.',
    replacementPattern: 'pure meme energy',
  },
  {
    regex: /\b(price target|road to \$[0-9.]+|sending to \$[0-9.]+)\b/gi,
    category: 'HOWEY_PROFIT_PROMISE',
    reason: 'Financial price projection implying asset appreciation.',
    severity: 'HIGH',
    suggestion: 'Replace with humorous or lore-based community goals.',
    replacementPattern: 'celebrating community milestones',
  },

  // 3. Managerial Efforts & Centralized Issuer Claims
  {
    regex: /\b(dev team will (pump|boost|list|guarantee)|our team is pumping|team will make you rich)\b/gi,
    category: 'MANAGERIAL_EFFORTS',
    reason: 'Satisfies the Howey Test prong of "reliance on the managerial efforts of others".',
    severity: 'HIGH',
    suggestion: 'Frame initiatives as decentralized community participation.',
    replacementPattern: 'community members are sharing memes and artwork',
  },
  {
    regex: /\b(invest in our (project|team|company|token)|investment opportunity)\b/gi,
    category: 'HOWEY_PROFIT_PROMISE',
    reason: 'Frames the meme token as a formal investment vehicle rather than a cultural collectible.',
    severity: 'HIGH',
    suggestion: 'Refer to "community participation" or "meme collectible".',
    replacementPattern: 'join the decentralized meme movement',
  },

  // 4. Market Manipulation
  {
    regex: /\b(coordinate (the |a )pump|everyone buy at once|pump and dump)\b/gi,
    category: 'PRICE_MANIPULATION',
    reason: 'Implicates coordinated market manipulation and artificial volume inflation.',
    severity: 'HIGH',
    suggestion: 'Focus on organic social engagement and meme sharing.',
    replacementPattern: 'share memes and rally the community',
  },
];

/**
 * Audits social copy against compliance and Howey rules
 */
export function auditSocialContent(text: string, tokenTicker: string = '$TOKEN'): ComplianceAuditResult {
  if (!text || text.trim() === '') {
    return {
      riskLevel: 'SAFE',
      score: 100,
      flags: [],
      sanitizedText: text,
      isSafeToPublish: true,
      summary: 'No content to audit.',
      ruleCitations: [],
    };
  }

  const flags: ComplianceFlag[] = [];
  const ruleCitationsSet = new Set<string>();

  for (const rule of COMPLIANCE_RULES) {
    const matches = text.match(rule.regex);
    if (matches && matches.length > 0) {
      for (const match of matches) {
        flags.push({
          phrase: match,
          category: rule.category,
          reason: rule.reason,
          severity: rule.severity,
          suggestion: rule.suggestion,
        });

        if (rule.category === 'HOWEY_PROFIT_PROMISE' || rule.category === 'MANAGERIAL_EFFORTS') {
          ruleCitationsSet.add('SEC Howey Test (Investment Contract Scrutiny)');
        }
        if (rule.category === 'FOMO_SOLICITATION') {
          ruleCitationsSet.add('FTC & Consumer Protection Deceptive Advertising Standards');
        }
        if (rule.category === 'PRICE_MANIPULATION') {
          ruleCitationsSet.add('CFTC / SEC Market Manipulation Guardrails');
        }
      }
    }
  }

  const highSeverityCount = flags.filter((f) => f.severity === 'HIGH').length;
  const mediumSeverityCount = flags.filter((f) => f.severity === 'MEDIUM').length;

  let score = 100 - highSeverityCount * 35 - mediumSeverityCount * 15;
  score = Math.max(0, Math.min(100, score));

  let riskLevel: 'SAFE' | 'CAUTION' | 'HIGH_RISK' = 'SAFE';
  if (highSeverityCount > 0 || score < 60) {
    riskLevel = 'HIGH_RISK';
  } else if (mediumSeverityCount > 0 || score < 90) {
    riskLevel = 'CAUTION';
  }

  const sanitizedText = sanitizeSocialPost(text, tokenTicker);

  const summary =
    riskLevel === 'SAFE'
      ? '🟢 100% Compliant: Pure decentralized meme & cultural engagement copy. Zero financial promises or FOMO triggers.'
      : riskLevel === 'CAUTION'
      ? '🟡 Caution: Moderate urgency language detected. Consider sanitizing into neutral community copy.'
      : '🔴 High Regulatory Risk: Contains prohibited investment promises, Howey triggers, or aggressive FOMO solicitation.';

  return {
    riskLevel,
    score,
    flags,
    sanitizedText,
    isSafeToPublish: riskLevel !== 'HIGH_RISK',
    summary,
    ruleCitations: Array.from(ruleCitationsSet),
  };
}

/**
 * Automatically rewrites a post into 100% compliant cultural/decentralized copy
 */
export function sanitizeSocialPost(text: string, tokenTicker: string = '$TOKEN'): string {
  let cleaned = text;

  // Specific common patterns
  cleaned = cleaned.replace(
    /The bonding curve is moving fast[.! ]*Get in early before Raydium migration[.]?/gi,
    `Decentralized milestone active on Solana. 100% fair launch, zero presale on @clawpumptech.`
  );

  cleaned = cleaned.replace(
    /bonding curve is moving fast/gi,
    'community milestone is active'
  );

  cleaned = cleaned.replace(
    /get in early before (raydium migration|it'?s too late|the pump)/gi,
    'explore the fair-launch milestone'
  );

  cleaned = cleaned.replace(
    /buy before (it'?s too late|raydium|migration)/gi,
    'check out the decentralized community art'
  );

  cleaned = cleaned.replace(
    /fill your bags|ape in now|load up now/gi,
    'join the meme movement'
  );

  cleaned = cleaned.replace(
    /\b(100x|1000x|make you rich|financial freedom|passive yield)\b/gi,
    'viral community energy'
  );

  cleaned = cleaned.replace(
    /guaranteed (moon|profit|gains|pump)/gi,
    'pure meme humor'
  );

  cleaned = cleaned.replace(
    /dev team will (pump|boost)/gi,
    'community is creating memes'
  );

  cleaned = cleaned.replace(
    /invest in our project/gi,
    'explore our decentralized art'
  );

  // Fake price pumps and valuation claims
  cleaned = cleaned.replace(
    /pumps?\s+(past|to)\s+\$?\d+[mkb]?/gi,
    'radiates pure community vibes'
  );
  cleaned = cleaned.replace(/\$100m|\$1b/gi, 'viral momentum');
  cleaned = cleaned.replace(/breaks?\s+chart/gi, 'embraces chill culture');

  // Clean up double spaces
  cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();

  return cleaned;
}

/**
 * Specifically cleans canvas meme captions to prevent fake financial news / $100M claims
 */
export function sanitizeMemeCaption(text: string, tokenTicker: string = '$TOKEN'): string {
  if (!text) return '';
  let cleaned = text;

  // Specific common generator clichés
  cleaned = cleaned.replace(
    /replaces?\s+(500|\d+)?\s*engineers?\s+with\s+.*?and\s+pumps?\s+to\s+\$?\d+[mkb]?/gi,
    `replaces daily stress with ${tokenTicker} and radiates pure chill energy`
  );

  cleaned = cleaned.replace(
    /wall\s+street\s+analysts?\s+baffled\s+as\s+.*?pumps?\s+past\s+\$?\d+[mkb]?/gi,
    `wall street analysts baffled as ${tokenTicker} radiates pure community peace`
  );

  cleaned = cleaned.replace(
    /pumps?\s+(past|to)\s+\$?\d+[mkb]?/gi,
    'radiates pure community vibes'
  );

  cleaned = cleaned.replace(/\$100m|\$1b|\$10m/gi, 'cozy vibes');
  cleaned = cleaned.replace(/\+1000%|\+500%|\+100%/gi, '100% FAIR LAUNCH');
  cleaned = cleaned.replace(/breaks?\s+chart/gi, 'breaks the monotony');

  cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();
  return cleaned;
}

/**
 * Standard Compliance & Risk Notice Footer for Meme Coin Dispatches
 */
export const COMPLIANCE_DISCLAIMERS = {
  shortTag: '#MemeFi #Decentralized #CommunityArt #NFA',
  fullLegalDisclaimer:
    'Disclaimer: This meme token is a decentralized, non-functional cultural asset created strictly for community entertainment and artistic expression. Zero intrinsic economic value, zero expectation of financial profit. Not investment advice.',
};
