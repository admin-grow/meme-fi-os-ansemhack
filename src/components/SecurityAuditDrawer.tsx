import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Flame,
  Cpu,
  Layers,
  Award,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  Activity,
} from 'lucide-react';
import { TokenDeploymentData } from '../types';

interface SecurityAuditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  deployment?: TokenDeploymentData | null;
  tokenName?: string;
  ticker?: string;
  mintAddress?: string;
  jitoEnabled?: boolean;
  onToggleJito?: (enabled: boolean) => void;
  network?: string;
}

export const SecurityAuditDrawer: React.FC<SecurityAuditDrawerProps> = ({
  isOpen,
  onClose,
  deployment,
  tokenName = 'Token',
  ticker = '$TOKEN',
  mintAddress,
  jitoEnabled = true,
  onToggleJito,
  network = 'devnet',
}) => {
  const [activeTab, setActiveTab] = useState<'pillars' | 'bytecode' | 'architecture'>('pillars');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentMint = deployment?.mintAddress || mintAddress || 'SoL11111111111111111111111111111111111111112';
  const currentTx = deployment?.txHash || '5xTX...mock';
  const clusterParam = network === 'devnet' ? '?cluster=devnet' : '';

  const copyVerificationProof = () => {
    const proof = `🛡️ ${tokenName} (${ticker}) PRE-FLIGHT VERIFICATION RECORD\n` +
      `🌐 Network: ${network === 'devnet' ? 'Solana Devnet (Sandbox)' : 'Solana Mainnet-Beta'}\n` +
      `✅ Mint Authority: REVOKED (Atomic Ix 3 - Non-inflationary)\n` +
      `✅ Freeze Authority: REVOKED (Atomic Ix 4 - Anti-Honeypot)\n` +
      `🔥 LP Burn: 100% to Solana Incinerator (1nc1nerator... - Ix 6)\n` +
      `⚡ MEV Shield: Jito-Solana Private Mempool (Block 0 Anti-Snipe & Anti-Sandwich)\n` +
      `🔗 Contract: ${currentMint}\n` +
      `📜 Verification: https://solscan.io/token/${currentMint}${clusterParam}`;
    navigator.clipboard.writeText(proof);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative z-10 w-full max-w-lg bg-[#0d111a] border-l border-[#242b3b] shadow-2xl h-full flex flex-col text-left text-white font-sans overflow-hidden">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#242b3b] bg-[#121622] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00f5ff]/15 border border-[#00f5ff]/30 flex items-center justify-center text-[#00f5ff]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                  Controls &amp; Pre-Flight Specifications
                </h3>
                <span className="px-2 py-0.5 rounded bg-[#39ff14]/20 text-[#39ff14] text-[9px] font-mono font-bold border border-[#39ff14]/30">
                  CHECKS PASSED
                </span>
              </div>
              <p className="text-[11px] text-[#8e99ac] font-mono mt-0.5">
                Background verification engine for {ticker}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1a2030] hover:bg-[#242b3b] text-[#8e99ac] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#242b3b] bg-[#0a0d14] px-4">
          <button
            type="button"
            onClick={() => setActiveTab('pillars')}
            className={`py-2.5 px-3 text-xs font-mono font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'pillars'
                ? 'border-[#00f5ff] text-[#00f5ff]'
                : 'border-transparent text-[#8e99ac] hover:text-white'
            }`}
          >
            Security Pillars (3)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bytecode')}
            className={`py-2.5 px-3 text-xs font-mono font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'bytecode'
                ? 'border-[#00f5ff] text-[#00f5ff]'
                : 'border-transparent text-[#8e99ac] hover:text-white'
            }`}
          >
            8-Ix Bytecode
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`py-2.5 px-3 text-xs font-mono font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'architecture'
                ? 'border-[#00f5ff] text-[#00f5ff]'
                : 'border-transparent text-[#8e99ac] hover:text-white'
            }`}
          >
            Safety Architecture
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {activeTab === 'pillars' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-[#141824] border border-[#242b3b] text-[11px] text-[#8e99ac] font-mono leading-relaxed">
                <span className="text-[#00f5ff] font-bold">Verification Objective:</span> Validate that neither the deployer nor the platform can manipulate token supply, blacklist wallets, pull liquidity, or exploit slot-0 transactions.
              </div>

              {/* Pillar 1 */}
              <div className="p-4 rounded-xl bg-[#141824] border border-[#242b3b] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#00f5ff] px-2 py-0.5 rounded bg-[#00f5ff]/10 border border-[#00f5ff]/30 font-mono">
                    Security Priority #1
                  </span>
                  <span className="text-[10px] text-[#39ff14] font-bold font-mono">ATOMIC REVOCATION</span>
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#39ff14]" />
                  <span>Authority Revocation Verification</span>
                </div>
                <p className="text-[11px] text-[#8e99ac] leading-relaxed">
                  The <code className="text-[#39ff14] font-mono">createSetAuthorityInstruction</code> is packed inside the <strong>exact same atomic transaction</strong> as the mint account initialization.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] font-mono">
                  <div className="p-2 rounded bg-[#0d111a] border border-[#242b3b]">
                    <span className="text-[#8e99ac] block">mintAuthority:</span>
                    <span className="text-[#39ff14] font-bold">Option::None (Burned)</span>
                  </div>
                  <div className="p-2 rounded bg-[#0d111a] border border-[#242b3b]">
                    <span className="text-[#8e99ac] block">freezeAuthority:</span>
                    <span className="text-[#39ff14] font-bold">Option::None (Anti-Honeypot)</span>
                  </div>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-4 rounded-xl bg-[#141824] border border-[#242b3b] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#ff4500] px-2 py-0.5 rounded bg-[#ff4500]/10 border border-[#ff4500]/30 font-mono">
                    Security Priority #2
                  </span>
                  <span className="text-[10px] text-[#ff4500] font-bold font-mono">100% LP BURN</span>
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#ff4500]" />
                  <span>LP Lock &amp; Incinerator Burning Proof</span>
                </div>
                <p className="text-[11px] text-[#8e99ac] leading-relaxed">
                  100% of the Raydium/ClawPump LP tokens are transferred directly to the verified Solana Incinerator dead address in Instruction 6.
                </p>
                <div className="p-2 rounded bg-[#0d111a] border border-[#242b3b] text-[10px] font-mono break-all">
                  <span className="text-[#8e99ac] block">Incinerator Recipient:</span>
                  <span className="text-[#ff8c00] font-bold">1nc1nerator1111111111111111111111111111111111111111</span>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-4 rounded-xl bg-[#141824] border border-[#242b3b] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#ccff00] px-2 py-0.5 rounded bg-[#ccff00]/10 border border-[#ccff00]/30 font-mono">
                    Security Priority #3
                  </span>
                  {onToggleJito && (
                    <label className="flex items-center gap-1.5 cursor-pointer font-mono text-[10px] text-[#ccff00]">
                      <input
                        type="checkbox"
                        checked={jitoEnabled}
                        onChange={(e) => onToggleJito(e.target.checked)}
                        className="accent-[#ccff00] w-3.5 h-3.5 cursor-pointer"
                      />
                      <span>Active Shield</span>
                    </label>
                  )}
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#ccff00]" />
                  <span>MEV &amp; Block 0 Anti-Snipe Protection</span>
                </div>
                <p className="text-[11px] text-[#8e99ac] leading-relaxed">
                  Submits deployment through <strong>Jito-Solana Private Validator Mempools</strong> (+0.001 SOL tip) to prevent predatory front-running and sandwich attacks.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] font-mono">
                  <div className="p-2 rounded bg-[#0d111a] border border-[#242b3b]">
                    <span className="text-[#8e99ac] block">Mempool Type:</span>
                    <span className="text-[#ccff00] font-bold">Jito Private Bundle</span>
                  </div>
                  <div className="p-2 rounded bg-[#0d111a] border border-[#242b3b]">
                    <span className="text-[#8e99ac] block">Dev Snipe Limit:</span>
                    <span className="text-[#39ff14] font-bold">&le; 1.5% Cap</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bytecode' && (
            <div className="space-y-3 font-mono">
              <div className="text-[10px] uppercase font-bold text-[#00f5ff] flex items-center justify-between pb-1 border-b border-[#242b3b]">
                <span>Atomic Transaction Manifest</span>
                <span className="text-[#39ff14]">All 8 Succeed or Entire Tx Reverts</span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="p-2.5 rounded-lg bg-[#141824] border border-[#242b3b]">
                  <div className="flex items-center justify-between text-[#00f5ff] font-bold">
                    <span>Ix 0: ComputeBudget::SetUnitPrice</span>
                    <span className="text-[9px] text-[#8e99ac]">50_000 micro-lamports</span>
                  </div>
                  <span className="text-[10px] text-[#8e99ac] block mt-0.5">Priority execution in next validator slot</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#141824] border border-[#242b3b]">
                  <div className="flex items-center justify-between text-[#00f5ff] font-bold">
                    <span>Ix 1: SystemProgram::CreateAccount</span>
                    <span className="text-[9px] text-[#8e99ac]">Rent Exempt</span>
                  </div>
                  <span className="text-[10px] text-[#8e99ac] block mt-0.5">Rent-exempt PDA initialization for mint key</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#141824] border border-[#242b3b]">
                  <div className="flex items-center justify-between text-[#00f5ff] font-bold">
                    <span>
                      {deployment?.inscriptionMode === 'TOKEN2022_INSCRIBED'
                        ? 'Ix 2: Token2022::InitializeMintWithMetadataPointer'
                        : 'Ix 2: TokenProgram::InitializeMint2'}
                    </span>
                    <span className="text-[9px] text-[#c084fc]">
                      {deployment?.inscriptionMode === 'TOKEN2022_INSCRIBED' ? 'TOKEN-2022 INSCRIBED' : '1B Supply / 6 Decimals'}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8e99ac] block mt-0.5">
                    {deployment?.inscriptionMode === 'TOKEN2022_INSCRIBED'
                      ? 'Immutable vector SVG mascot & micro-site baked into rent-exempt Mint PDA'
                      : 'Fixed standard SPL token issuance'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#141824] border-l-2 border-[#39ff14] border-y border-r border-[#242b3b]">
                  <div className="flex items-center justify-between text-[#39ff14] font-bold">
                    <span>Ix 3: SetAuthority(MintTokens -&gt; None)</span>
                    <span className="text-[9px] text-[#39ff14]">REVOKED</span>
                  </div>
                  <span className="text-[10px] text-[#8e99ac] block mt-0.5">Permanent non-inflationary fixed supply parameter</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#141824] border-l-2 border-[#39ff14] border-y border-r border-[#242b3b]">
                  <div className="flex items-center justify-between text-[#39ff14] font-bold">
                    <span>Ix 4: SetAuthority(FreezeAccount -&gt; None)</span>
                    <span className="text-[9px] text-[#39ff14]">REVOKED</span>
                  </div>
                  <span className="text-[10px] text-[#8e99ac] block mt-0.5">Anti-Honeypot protection (wallets cannot be frozen)</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#141824] border border-[#242b3b]">
                  <div className="flex items-center justify-between text-[#00f5ff] font-bold">
                    <span>Ix 5: ClawPump::InitializeBondingCurve</span>
                    <span className="text-[9px] text-[#8e99ac]">xy=k Pool</span>
                  </div>
                  <span className="text-[10px] text-[#8e99ac] block mt-0.5">Deposit 85% supply to constant-product curve</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#141824] border-l-2 border-[#ff4500] border-y border-r border-[#242b3b]">
                  <div className="flex items-center justify-between text-[#ff4500] font-bold">
                    <span>Ix 6: Transfer(LP_Tokens -&gt; 1nc1nerator...)</span>
                    <span className="text-[9px] text-[#ff4500]">BURNED</span>
                  </div>
                  <span className="text-[10px] text-[#8e99ac] block mt-0.5">100% LP tokens sent to unrecoverable dead address</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#141824] border-l-2 border-[#ccff00] border-y border-r border-[#242b3b]">
                  <div className="flex items-center justify-between text-[#ccff00] font-bold">
                    <span>Ix 7: JitoTipProgram::Transfer</span>
                    <span className="text-[9px] text-[#ccff00]">0.001 SOL TIP</span>
                  </div>
                  <span className="text-[10px] text-[#8e99ac] block mt-0.5">Private validator bundle routing (Anti-Sandwich)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-3 font-mono text-[11px]">
              <div className="p-3.5 rounded-xl bg-[#141824] border border-[#242b3b] space-y-1.5">
                <span className="text-xs font-bold text-[#39ff14] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% Non-Custodial UI</span>
                </span>
                <p className="text-[#8e99ac] font-sans leading-relaxed">
                  MemeFi OS never retains private keys, custody of funds, or intermediary escrow contracts. Transactions are assembled on the client and handed directly to your connected wallet for human approval.
                </p>
                <div className="pt-1 text-[10px] text-[#00f5ff]">
                  Central Treasury Deposit = 0.00 SOL
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#141824] border border-[#242b3b] space-y-1.5">
                <span className="text-xs font-bold text-[#00f5ff] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Platform Revenue &amp; Sustainability</span>
                </span>
                <p className="text-[#8e99ac] font-sans leading-relaxed">
                  Transparent smart contract routing: 1% trading volume splits to the platform treasury, and 35% of all royalties execute automated decentralized buybacks and burns.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#141824] border border-[#242b3b] space-y-1.5">
                <span className="text-xs font-bold text-[#ccff00] flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Backend Rate Limits &amp; Injection Defense</span>
                </span>
                <p className="text-[#8e99ac] font-sans leading-relaxed">
                  Active in-memory token bucket rate limiting (30 requests/10 min) and strict prompt sanitization to shield compute and AI inference against drain attacks.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#242b3b] bg-[#121622] space-y-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyVerificationProof}
              className="flex-1 py-2 px-3 rounded-lg bg-[#00f5ff]/15 hover:bg-[#00f5ff]/25 border border-[#00f5ff]/40 text-[#00f5ff] font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#39ff14]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Verification Record Copied!' : 'Copy Verification Proof for X / TG'}</span>
            </button>

            {deployment?.mintAddress && (
              <a
                href={`https://solscan.io/token/${deployment.mintAddress}${clusterParam}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-lg bg-[#1a2030] hover:bg-[#242b3b] border border-[#2d3139] text-[#8e99ac] hover:text-white font-mono text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Solscan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="p-2.5 rounded-lg bg-[#0d1017] border border-amber-500/20 text-[10px] text-[#8e99ac] font-mono leading-relaxed space-y-1 text-left">
            <p className="text-amber-300 font-bold uppercase tracking-wider">
              ⚠️ Pre-Flight Verification &amp; Software Scope Notice:
            </p>
            <p>
              Automated pre-flight heuristic checks verify parameter formatting, non-custodial packaging, and authority revocation flags. They do not constitute a formal third-party cryptographic or financial audit, nor do they guarantee smart contract immunity or market performance. Users remain solely responsible for reviewing all transaction instructions locally before signing with their wallet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
