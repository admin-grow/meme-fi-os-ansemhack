import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Coins, 
  Lock, 
  Layers, 
  Terminal, 
  ExternalLink,
  Flame,
  AlertTriangle,
  Globe
} from 'lucide-react';
import { TechStackSection } from './TechStackSection';

interface WhitepaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTokenName?: string;
  activeTicker?: string;
}

export const WhitepaperModal: React.FC<WhitepaperModalProps> = ({
  isOpen,
  onClose,
  activeTokenName,
  activeTicker,
}) => {
  const [activeTab, setActiveTab] = useState<
    'thesis' | 'agents' | 'compliance' | 'claw' | 'tokenomics' | 'disclaimer' | 'specs'
  >('thesis');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const rawWhitepaperMarkdown = `# MemeFi OS: Technical Specification & Protocol Whitepaper
Version: 2.6 // AnsemHack Solana Track Specification
Classification: Non-Custodial Multi-Agent Meme Launch Architecture

---

## 1. Executive Summary & Genesis Thesis

Meme tokens represent pure attention markets operating at native internet speed. However, 99.4% of meme coins suffer from the post-launch cold-start problem: initial trading velocity evaporates within 60 minutes due to lack of narrative depth, absence of sustained creative assets, and zero community coordination infrastructure.

MemeFi OS collapses the latency between creative ideation and on-chain execution into a single, non-custodial software workspace. By orchestrating a synchronized multi-agent AI pipeline with client-side Solana transaction packaging, creators can deploy culturally resonant, parody-grounded community movements on Solana in under 60 seconds—without retaining private keys or operating custodial backends.

### Core Architectural Axiom
- **Our Side (MemeFi OS)**: Purely client-side packaging, AI narrative synthesis, and automated parameter heuristic screening.
- **The Execution Side (Claw & SVM)**: On-chain smart contract execution, bonding curve math, liquidity management, and decentralized snapshot streaming.

---

## 2. Multi-Agent Engine Architecture

The protocol organizes four autonomous agent modules that operate sequentially with human-in-the-loop (HITL) checkpoints:

1. **Agent 1 (Trend Strategist & Lore Engine)**:
   - Evaluates crypto culture tropes across six archetypes (Tech/AI Absurdism, Political Satire, Financial Nihilism, etc.).
   - Generates a coherent three-season narrative arc, punchy ticker symbols, and viral broadcast tweet packs.

2. **Agent 2 (Vector Mascot & Meme Studio)**:
   - Renders 512x512 scalable SVG vector mascots and high-contrast social meme templates (e.g., Breaking News, Drake Hotline, Galaxy Brain).
   - Generates deterministic mascottic visual assets suitable for IPFS and Solana token metadata (SPL Token-2022 and Metaplex standards).

3. **Agent 3 (Community Mobilizer & Social Dispatch Bot)**:
   - Generates real-time Telegram buy alerts, milestone announcements, and 1-click community broadcast messages.
   - Maintains post-launch narrative momentum through autonomous content generation.

4. **Agent 4 (Dynamic Token Micro-Site Generator)**:
   - Autonomously builds and compiles a dedicated, full-screen branded micro-site for every token.
   - Includes real-time DexScreener candlestick charts, bonding curve progress meters, community broadcast hubs, and shareable manifestos.

---

## 3. Agent 0: Adversarial Compliance & Parody Shield

To prevent creators from inadvertently making claims that trigger securities classifications (under the Howey Test), MemeFi OS integrates **Agent 0**—an automated heuristic screening engine.

### Automated Heuristic Constraints:
- **Zero Investment Language**: Automatically detects and blocks phrases such as "guaranteed yield," "passive income," "profit share," "stock equity," or "promoter returns."
- **Parody & Cultural Satire Enforcement**: Restructures all token lore into explicit satire, creative commentary, and community meme formats protected under cultural fair-use doctrines.
- **Dual-Agent Consensus Gate**: If Agent 0 detects problematic claims, the packaging pipeline is halted until the creator rewrites the narrative into compliant meme framing.

*Notice: Agent 0 performs automated heuristic scanning for parameter consistency; it does not constitute formal legal counsel or an official regulatory exemption.*

---

## 4. The Claw Protocol & Non-Custodial Architecture

The primary security vulnerability in Web3 launchpads is custodial execution (exemplified by high-profile social engineering and server-side sandwich hacks). MemeFi OS establishes an inviolable non-custodial boundary:

### Non-Custodial Architecture:
1. **Zero Server Private Keys**: Deployer keys and transaction signing occur strictly in the user's browser wallet via standard Web3 adapters (@solana/wallet-adapter).
2. **Zero Custodial Escrow**: Central Treasury Deposit = 0.00 SOL. MemeFi OS never holds user SOL or controls minted supply.
3. **Atomic 8-Instruction Solana Bundle**:
   - Instruction 1: Create Mint Account (SPL Token Program)
   - Instruction 2: Initialize Mint with 9 Decimals & 1,000,000,000 supply
   - Instruction 3: **Revoke Mint Authority** (Enforces hard non-inflationary supply cap)
   - Instruction 4: **Revoke Freeze Authority** (Eliminates honeypot blacklist risks)
   - Instruction 5: Initialize Bonding Curve Liquidity Pool via ClawPump
   - Instruction 6: **Incinerate 100% LP Tokens** (Routed directly to 1nc1nerator...)
   - Instruction 7: Metaplex Metadata Pointer binding
   - Instruction 8: Jito-Solana Private Mempool Bundle (Anti-Sandwich / Block-0 Anti-Snipe protection)

---

## 5. Bonding Curve Mechanics & Holder Reward Models

MemeFi OS incorporates modern Solana bonding curve specifications:

### 1. Fair-Launch Bonding Curve Liquidity
- **Deterministic Autonomous Curve**: Automatically initializes the bonding curve liquidity pool with 1,000,000,000 token supply.
- **100% Genesis LP Incineration**: Directly routes 100% of the initial LP tokens to the Solana Incinerator address upon deployment, permanently preventing developer liquidity withdrawal.
- **Zero-Latency Price Discovery**: Delivers continuous, instant on-chain liquidity velocity with Raydium graduation upon curve completion.

### 2. Launch Fee & Reward Models:
- **Model A: 100% Holder Rewards (Recommended / Viral Meta)**:
  - 0% developer fee.
  - 100% of trading fee velocity from bonding curve volume is pooled and autonomously streamed hourly, pro-rata, to all token holders with balances greater than $20 USD.
  - Completely distributed on-chain with zero manual intervention or custom staking contracts.
- **Model B: Creator Operations Treasury**:
  - Directs 0.25% to 1.0% of trading volume fees to the creator deployer wallet to fund continuous DEX ads, Telegram marketing, and community buybacks.

---

## 6. Disclaimers, Software Scope & Parameter Verification Notice

**EXPLICIT DISCLAIMER:**
MemeFi OS is an autonomous software interface and client-side developer tooling suite provided strictly for informational, educational, and workflow tooling purposes. 
- MemeFi OS does not provide financial services, custody, broker-dealer execution, investment advisory, or custodial escrow.
- Users are solely responsible for reviewing all transaction parameters, smart contract instructions, and liquidity variables before signing any transactions locally with their connected Solana wallet.
- Tokens generated, packaged, or launched via this interface are speculative, non-functional community meme assets created solely for social interaction, artistic expression, and parody.
- Tokens carry no intrinsic financial value, convey no voting rights or equity ownership in any underlying corporate entity, and offer no guarantee or expectation of profit.
- Automated pre-flight verification checks, heuristic parameter scans, and non-custodial packaging routines verify structural formatting and authority revocation flags; they do not constitute formal third-party audits, investment endorsements, or guarantees against market losses or smart contract vulnerabilities.
- All on-chain deployments are executed permissionlessly and directly by users via autonomous smart contracts on the Solana blockchain at their sole discretion and risk.
`;

  const handleDownload = () => {
    const blob = new Blob([rawWhitepaperMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MemeFi_OS_Protocol_Whitepaper_v2.6.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rawWhitepaperMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Window */}
      <div className="relative z-10 w-full max-w-5xl bg-[#0a0d14] border border-[#262e40] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-left font-sans">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#1f2637] bg-[#0e121b] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f5ff]/20 via-[#10141f] to-[#ccff00]/20 border border-[#00f5ff]/40 flex items-center justify-center text-[#00f5ff]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white uppercase font-mono tracking-tight">
                  MemeFi OS Protocol Whitepaper
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#39ff14]/15 text-[#39ff14] text-[9px] font-mono font-bold border border-[#39ff14]/30">
                  SPEC v2.6
                </span>
              </div>
              <p className="text-xs text-[#8e99ac] font-mono mt-0.5">
                Multi-Agent Synthesis, Non-Custodial Claw Packaging &amp; Solana Bonding Specifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1f2637] border border-[#2d364a] text-[#00f5ff] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy raw markdown to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#39ff14]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied MD' : 'Copy Markdown'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download markdown whitepaper file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .md</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#141824] hover:bg-[#1f2637] text-[#8e99ac] hover:text-white flex items-center justify-center transition-colors cursor-pointer ml-1"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1f2637] bg-[#07090e] px-4 overflow-x-auto shrink-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('thesis')}
            className={`py-3 px-3.5 text-xs font-mono font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'thesis'
                ? 'border-[#00f5ff] text-[#00f5ff]'
                : 'border-transparent text-[#8e99ac] hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>01. Genesis Thesis</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('agents')}
            className={`py-3 px-3.5 text-xs font-mono font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'agents'
                ? 'border-[#00f5ff] text-[#00f5ff]'
                : 'border-transparent text-[#8e99ac] hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>02. Multi-Agent Engine</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('compliance')}
            className={`py-3 px-3.5 text-xs font-mono font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'compliance'
                ? 'border-[#39ff14] text-[#39ff14]'
                : 'border-transparent text-[#8e99ac] hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>03. Agent 0 Pre-Flight Scanner</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('claw')}
            className={`py-3 px-3.5 text-xs font-mono font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'claw'
                ? 'border-[#00f5ff] text-[#00f5ff]'
                : 'border-transparent text-[#8e99ac] hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>04. Non-Custodial Claw SVM</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tokenomics')}
            className={`py-3 px-3.5 text-xs font-mono font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tokenomics'
                ? 'border-[#ccff00] text-[#ccff00]'
                : 'border-transparent text-[#8e99ac] hover:text-white'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>05. Bonding Curves &amp; Rewards</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('disclaimer')}
            className={`py-3 px-3.5 text-xs font-mono font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'disclaimer'
                ? 'border-[#f59e0b] text-[#f59e0b]'
                : 'border-transparent text-[#8e99ac] hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>06. Legal Status &amp; Risks</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`py-3 px-3.5 text-xs font-mono font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'specs'
                ? 'border-[#00f5ff] text-[#00f5ff]'
                : 'border-transparent text-[#8e99ac] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>07. Architecture &amp; Stack</span>
          </button>
        </div>

        {/* Scrollable Whitepaper Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm leading-relaxed text-[#c4cddb]">
          
          {/* TAB 1: GENESIS THESIS */}
          {activeTab === 'thesis' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-[#0f1420] border border-[#00f5ff]/30 space-y-3">
                <span className="text-[10px] font-mono uppercase font-bold text-[#00f5ff] tracking-wider">
                  The Post-Launch Volume Decay Problem
                </span>
                <h3 className="text-xl font-bold text-white font-mono">
                  Why 99.4% of meme coins experience rapid post-launch velocity collapse
                </h3>
                <p className="text-sm text-[#8e99ac]">
                  Standard meme token launches lack post-launch narrative infrastructure. When trading velocity dries up, the community scatters. MemeFi OS treats meme coins not as static one-off tokens, but as <strong>living, community-driven narrative ecosystems</strong> equipped with multi-season lore generation, continuous meme synthesis, automated alerts, and dedicated decentralized micro-sites.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#0f121a] border border-[#232938] space-y-2">
                  <div className="text-xs font-mono text-[#00f5ff] font-bold uppercase">Axiom 1: Attention Velocity</div>
                  <p className="text-xs text-[#8e99ac]">
                    Meme tokens are attention markets operating at native internet speed. The gap between cultural ideation and decentralized liquidity must be sub-60 seconds.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0f121a] border border-[#232938] space-y-2">
                  <div className="text-xs font-mono text-[#39ff14] font-bold uppercase">Axiom 2: Strict Non-Custody</div>
                  <p className="text-xs text-[#8e99ac]">
                    Transactions are assembled and signed purely within the client browser. No central server touches private keys, retains user funds, or operates custodial escrows.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0f121a] border border-[#232938] space-y-2">
                  <div className="text-xs font-mono text-[#ccff00] font-bold uppercase">Axiom 3: Autonomous Longevity</div>
                  <p className="text-xs text-[#8e99ac]">
                    Multi-season story arcs, automated community broadcast alerts, and live community micro-sites provide real-time utility and engagement from Block 0.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MULTI-AGENT ENGINE */}
          {activeTab === 'agents' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white font-mono uppercase">
                  4 Synchronized Autonomous Modules
                </h3>
                <p className="text-xs text-[#8e99ac]">
                  Each agent is specialized for a distinct phase of meme token creation, launch, and retention:
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#0f121a] border border-[#232938] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#00f5ff] font-bold">AGENT 1: TREND STRATEGIST &amp; LORE ENGINE</span>
                    <span className="text-[10px] font-mono text-slate-400">Context Window Analysis</span>
                  </div>
                  <p className="text-xs text-[#8e99ac]">
                    Analyzes crypto cultural archetypes, generates memorable ticker symbols ($TICKER), catchy taglines, three-season episodic lore narratives, and 1-click broadcast tweet packs.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0f121a] border border-[#232938] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#39ff14] font-bold">AGENT 2: VECTOR MASCOT &amp; MEME STUDIO</span>
                    <span className="text-[10px] font-mono text-slate-400">Deterministic SVG &amp; Overlays</span>
                  </div>
                  <p className="text-xs text-[#8e99ac]">
                    Produces scalable 512x512 vector mascot art and dynamic meme formats (Breaking News, God Candle alerts) ready for decentralized metadata storage (Metaplex/IPFS).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0f121a] border border-[#232938] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#f43f5e] font-bold">AGENT 3: SOCIAL MOBILIZER &amp; TELEGRAM BOT</span>
                    <span className="text-[10px] font-mono text-slate-400">Post-Launch Retention</span>
                  </div>
                  <p className="text-xs text-[#8e99ac]">
                    Coordinates community broadcast alerts, milestone celebrations, and high-energy copy for continuous Telegram and Twitter engagement.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0f121a] border border-[#232938] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#a855f7] font-bold">AGENT 4: DYNAMIC TOKEN MICRO-SITE GENERATOR</span>
                    <span className="text-[10px] font-mono text-slate-400">Branded Experience</span>
                  </div>
                  <p className="text-xs text-[#8e99ac]">
                    Generates a standalone, dedicated branded web portal for the coin, complete with real-time DexScreener charts, bonding curve gauges, and verified on-chain contract references.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AGENT 0 PRE-FLIGHT SCANNER */}
          {activeTab === 'compliance' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-[#0c1612] border border-[#39ff14]/30 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#39ff14]" />
                  <h3 className="text-lg font-bold text-white font-mono">
                    Agent 0: Adversarial Heuristic Screening &amp; Parody Alignment
                  </h3>
                </div>
                <p className="text-xs text-[#8e99ac]">
                  To prevent users from inadvertently generating claims that trigger securities classifications (Howey Test), Agent 0 runs automated heuristic verification on every piece of generated text and metadata before deployment.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-[#1c0f12] border border-[#ef4444]/40 space-y-2">
                  <div className="text-[#ef4444] font-bold uppercase">Prohibited Terminology Filtered:</div>
                  <ul className="space-y-1 text-[#8e99ac] list-disc list-inside">
                    <li>"Guaranteed Returns / APY"</li>
                    <li>"Passive Income Stream"</li>
                    <li>"Equity Stake / Stock Ownership"</li>
                    <li>"Corporate Dividend Sharing"</li>
                    <li>"Promoter Price Pumping Promises"</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#0f1813] border border-[#39ff14]/40 space-y-2">
                  <div className="text-[#39ff14] font-bold uppercase">Parody &amp; Satire Formatting:</div>
                  <ul className="space-y-1 text-[#8e99ac] list-disc list-inside">
                    <li>Explicit cultural satire classification</li>
                    <li>Community meme &amp; social token framing</li>
                    <li>Zero promises of managerial effort</li>
                    <li>Non-custodial fair launch declaration</li>
                    <li>Clear experimental software labels</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NON-CUSTODIAL CLAW SVM */}
          {activeTab === 'claw' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-[#0f1422] border border-[#00f5ff]/30 space-y-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#00f5ff]" />
                  <h3 className="text-lg font-bold text-white font-mono">
                    The Non-Custodial Division: Client-Side vs Protocol
                  </h3>
                </div>
                <p className="text-xs text-[#8e99ac]">
                  Reflecting the lessons of past Web3 sandwich and account takeover vulnerabilities, MemeFi OS enforces a strict architectural boundary: transaction instructions are constructed client-side on the user device, and the Solana Virtual Machine executes them on-chain.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0a0d14] border border-[#1f2637] space-y-3 text-xs font-mono">
                <div className="text-white font-bold uppercase text-[11px] text-[#00f5ff]">
                  8-Instruction Atomic Transaction Architecture:
                </div>
                <div className="space-y-2 text-[#8e99ac]">
                  <div className="p-2 rounded bg-[#10141f] border border-[#1f2637]">
                    <strong className="text-white">Ix 1-2: Token Mint Initialization</strong> &bull; Creates the SPL Token-2022 account with 9 decimals and 1,000,000,000 fixed supply.
                  </div>
                  <div className="p-2 rounded bg-[#10141f] border border-[#1f2637]">
                    <strong className="text-[#39ff14]">Ix 3-4: Authority Revocations</strong> &bull; Passes <code className="text-white">createSetAuthorityInstruction</code> to revoke both Mint and Freeze authorities immediately. Eliminates honeypot blacklist risks.
                  </div>
                  <div className="p-2 rounded bg-[#10141f] border border-[#1f2637]">
                    <strong className="text-amber-400">Ix 5-6: Liquidity Pool &amp; LP Burn</strong> &bull; Pairs liquidity into the bonding curve and transfers 100% of LP tokens directly to the Solana Incinerator (<code className="text-white">1nc1nerator...</code>).
                  </div>
                  <div className="p-2 rounded bg-[#10141f] border border-[#1f2637]">
                    <strong className="text-[#a855f7]">Ix 7-8: Jito Anti-Snipe &amp; Metadata</strong> &bull; Submits directly via Jito-Solana private mempool bundles to prevent Block 0 MEV sandwiches.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TOKENOMICS & BONDING CURVES */}
          {activeTab === 'tokenomics' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-[#14150d] border border-[#ccff00]/30 space-y-3">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-[#ccff00]" />
                  <h3 className="text-lg font-bold text-white font-mono">
                    Solana Bonding Curve Specifications &amp; Reward Streams
                  </h3>
                </div>
                <p className="text-xs text-[#8e99ac]">
                  Take advantage of automated fair-launch bonding curve liquidity, 100% initial LP incineration, and optional holder reward streams.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-[#0f121a] border border-[#232938] space-y-2">
                  <div className="text-[#39ff14] font-bold uppercase">🎁 100% Holder Rewards Stream</div>
                  <p className="text-xs text-[#8e99ac]">
                    100% of trading fee velocity from bonding curve volume is pooled and autonomously streamed multiple times per hour directly to token holders with &gt; $20 balance in SOL.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0f121a] border border-[#232938] space-y-2">
                  <div className="text-amber-400 font-bold uppercase">💼 Creator Operations Fee</div>
                  <p className="text-xs text-[#8e99ac]">
                    Allocates 0.25% to 1.0% to the creator deployer wallet to fund continuous DexScreener advertising, Telegram marketing, and community buybacks.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0a0d14] border border-[#1f2637] space-y-2">
                <div className="text-xs font-mono text-[#ccff00] font-bold uppercase">100% Genesis LP Token Incineration</div>
                <p className="text-xs text-[#8e99ac]">
                  All initial liquidity pool tokens created upon curve initialization are permanently burned by routing them directly to the Solana Incinerator address (<code>1nc1nerator...</code>), eliminating rug pull and liquidity withdrawal vectors.
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: LEGAL STATUS & RISKS */}
          {activeTab === 'disclaimer' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-[#1c150c] border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white font-mono">
                    Explicit Disclaimer &amp; Software Scope Notice
                  </h3>
                </div>
                <p className="text-xs text-[#8e99ac] leading-relaxed">
                  MemeFi OS is provided strictly for informational, educational, and developer workflow tooling purposes. The software does not provide financial services, broker-dealer execution, investment advisory, or custodial escrow.
                </p>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-200">
                  <strong>User Responsibility:</strong> Users are solely responsible for thoroughly inspecting raw transaction parameters, smart contract instructions, and liquidity settings before signing any transactions locally with their connected Solana wallet.
                </div>
              </div>

              <div className="space-y-3 text-xs text-[#8e99ac]">
                <p>
                  <strong>Pre-Flight Verification vs. Formal Audit:</strong> Automated pre-flight verification checks, heuristic parameter scans, and Agent 0 reviews are automated software heuristic routines designed for non-custodial packaging. They do not constitute a formal third-party cryptographic or financial audit, nor do they guarantee smart contract immunity or regulatory compliance.
                </p>
                <p>
                  <strong>Extreme Market Volatility:</strong> Meme tokens are speculative, non-functional digital items created for community engagement and satire. Interacting with decentralized liquidity pools and cryptocurrencies involves extreme volatility and may result in the complete loss of invested capital.
                </p>
                <p>
                  <strong>Non-Custodial Packaging:</strong> All deployments are signed client-side by the user. MemeFi OS developers have no custody, no access to user private keys, and zero ability to alter transactions or recover lost funds.
                </p>
              </div>
            </div>
          )}

          {/* TAB 7: TECHNICAL ARCHITECTURE & STACK SPECIFICATIONS */}
          {activeTab === 'specs' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-[#0f1420] border border-[#00f5ff]/30 space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-[#00f5ff] tracking-wider">
                  Protocol Specification &amp; System Architecture
                </span>
                <h3 className="text-xl font-bold text-white font-mono">
                  Multi-Agent Stack, Smart Contracts &amp; Non-Custodial Layer
                </h3>
                <p className="text-sm text-[#8e99ac]">
                  Detailed technical breakdown of the AI models, on-chain Solana VM bytecode, security verification engines, and non-custodial packaging pipeline.
                </p>
              </div>

              <div className="bg-[#0a0c12] rounded-2xl border border-[#1f2638] p-4 sm:p-6">
                <TechStackSection />
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#1f2637] bg-[#0c0f16] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs font-mono text-[#8e99ac]">
          <div>
            <span>Format: Standard Markdown // Ready for DexScreener &amp; GitBook</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#141824] hover:bg-[#1f2637] border border-[#2d364a] text-[#00f5ff] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#39ff14]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy All Text'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Whitepaper .md</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
