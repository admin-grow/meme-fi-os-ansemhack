import React, { useState } from 'react';
import {
  FileCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Zap,
  Info,
  DollarSign,
  Wallet,
  ExternalLink,
  Copy,
  Check,
  Code2,
  Globe,
  Database
} from 'lucide-react';

interface InscriptionConfigProps {
  inscriptionMode: 'STANDARD_OFFCHAIN' | 'TOKEN2022_INSCRIBED';
  onChangeInscriptionMode: (mode: 'STANDARD_OFFCHAIN' | 'TOKEN2022_INSCRIBED') => void;
  payerType: 'CREATOR_WALLET' | 'PLATFORM_SPONSORED';
  onChangePayerType: (payer: 'CREATOR_WALLET' | 'PLATFORM_SPONSORED') => void;
  mascotSvg?: string;
  ticker: string;
  tokenName: string;
  lore: string;
  standardRentSol: number;
  inscribedRentSol: number;
  payloadBytes: number;
  hasSufficientBalance: boolean;
  walletBalanceSol: number;
}

export const OnChainInscriptionModule: React.FC<InscriptionConfigProps> = ({
  inscriptionMode,
  onChangeInscriptionMode,
  payerType,
  onChangePayerType,
  mascotSvg,
  ticker,
  tokenName,
  lore,
  standardRentSol,
  inscribedRentSol,
  payloadBytes,
  hasSufficientBalance,
  walletBalanceSol,
}) => {
  const [showByteInspector, setShowByteInspector] = useState(false);
  const [copiedBytecode, setCopiedBytecode] = useState(false);

  // Generate deterministic preview bytes & mock hash for the bytecode viewer
  const rawSvgLength = mascotSvg ? mascotSvg.length : 8420;
  const kbSize = (payloadBytes / 1024).toFixed(2);
  const mockSha256 = `0x7f9a${ticker.replace('$', '').toLowerCase()}4c8e10d29b6f8a55e2d14c990b7e28b${rawSvgLength.toString(16)}`;

  const handleCopyBytecode = () => {
    navigator.clipboard.writeText(mascotSvg || `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!-- Inscribed ${ticker} --></svg>`);
    setCopiedBytecode(true);
    setTimeout(() => setCopiedBytecode(false), 2000);
  };

  return (
    <div className="p-4 sm:p-5 my-3 rounded-xl bg-[#0a0e17] border border-[#223048] space-y-4 text-xs font-mono shadow-xl">
      {/* Header & Badging */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1c293f]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00f5ff]/20 to-[#9945ff]/30 text-[#00f5ff] flex items-center justify-center border border-[#00f5ff]/40 shadow-[0_0_12px_rgba(0,245,255,0.2)]">
            <Database className="w-4 h-4 text-[#00f5ff]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wide">
                Solana Inscription &amp; Token-2022 Engine
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#9945ff]/20 text-[#c084fc] text-[9px] font-bold border border-[#9945ff]/40">
                LIBREPLEX &bull; 2026 SPEC
              </span>
            </div>
            <p className="text-[11px] text-[#8e99ac] mt-0.5">
              Permanently bake your vector mascot SVG &amp; micro-site directly into Solana validator account memory
            </p>
          </div>
        </div>

        {/* Bytecode Inspector Quick Action */}
        <button
          type="button"
          onClick={() => setShowByteInspector(!showByteInspector)}
          className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg bg-[#141d2e] hover:bg-[#1a273e] text-[#00f5ff] border border-[#00f5ff]/30 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>{showByteInspector ? 'Hide Bytecode' : 'Inspect Bytes & Hash'}</span>
        </button>
      </div>

      {/* Mode Selector: Standard Off-Chain vs Fully Inscribed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Option 1: Standard Off-Chain (Pump.fun style) */}
        <div
          onClick={() => onChangeInscriptionMode('STANDARD_OFFCHAIN')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
            inscriptionMode === 'STANDARD_OFFCHAIN'
              ? 'bg-[#0e1420] border-[#00f5ff] shadow-[0_0_15px_rgba(0,245,255,0.12)]'
              : 'bg-[#080b12] border-[#1b2333] hover:border-[#2a3750]'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌐</span>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-tight flex items-center gap-1.5">
                  Standard Metadata
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#223048] text-[#8e99ac] font-bold">
                    FAST / LOW COST
                  </span>
                </h4>
                <p className="text-[10px] text-[#8e99ac] font-mono">
                  Off-chain IPFS / Arweave pointer • ~{standardRentSol} SOL Rent
                </p>
              </div>
            </div>
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                inscriptionMode === 'STANDARD_OFFCHAIN'
                  ? 'border-[#00f5ff] bg-[#00f5ff] text-black'
                  : 'border-[#45526c]'
              }`}
            >
              {inscriptionMode === 'STANDARD_OFFCHAIN' && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </div>
          <p className="text-[11px] text-[#8e99ac] leading-relaxed">
            Standard Solana SPL mint pointing to decentralized IPFS metadata. Instant creation with minimal Solana account rent.
          </p>
          <div className="mt-2.5 pt-2 border-t border-[#1a2233] flex items-center justify-between text-[10px] text-[#8e99ac]">
            <span>Account Rent Deposit:</span>
            <span className="text-white font-bold">{standardRentSol} SOL (~$0.30)</span>
          </div>
        </div>

        {/* Option 2: Fully Inscribed Token-2022 (Unruggable On-Chain SVG) */}
        <div
          onClick={() => onChangeInscriptionMode('TOKEN2022_INSCRIBED')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
            inscriptionMode === 'TOKEN2022_INSCRIBED'
              ? 'bg-[#150f24] border-[#c084fc] shadow-[0_0_18px_rgba(192,132,252,0.2)]'
              : 'bg-[#080b12] border-[#1b2333] hover:border-[#2a3750]'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-tight flex items-center gap-1.5">
                  100% Inscribed On-Chain
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#9945ff]/30 text-[#c084fc] font-bold border border-[#9945ff]/40">
                    ANSEM &bull; HACK META
                  </span>
                </h4>
                <p className="text-[10px] text-[#c084fc] font-mono font-semibold">
                  Zero external server • Vector SVG embedded in Mint PDA
                </p>
              </div>
            </div>
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                inscriptionMode === 'TOKEN2022_INSCRIBED'
                  ? 'border-[#c084fc] bg-[#c084fc] text-black'
                  : 'border-[#45526c]'
              }`}
            >
              {inscriptionMode === 'TOKEN2022_INSCRIBED' && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </div>
          <p className="text-[11px] text-[#8e99ac] leading-relaxed">
            Bytecode chunked directly into Solana rent-exempt account storage using LibrePlex Inscriptions &amp; Token-2022 <code className="text-[#00f5ff]">MetadataPointer</code>.
          </p>
          <div className="mt-2.5 pt-2 border-t border-[#231a38] flex items-center justify-between text-[10px] text-[#8e99ac]">
            <span>Account Rent Deposit:</span>
            <span className="text-[#39ff14] font-bold">~{inscribedRentSol} SOL (100% Reclaimable)</span>
          </div>
        </div>
      </div>

      {/* WHO PAYS THE FEE? Interactive Creator Decision Section */}
      {inscriptionMode === 'TOKEN2022_INSCRIBED' && (
        <div className="p-3.5 rounded-lg bg-[#0e1320] border border-[#253248] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1b2536]">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#ccff00]" />
              <span className="text-xs font-bold text-white uppercase tracking-wide">
                Fee Payer Authorization: Who Covers The On-Chain Rent?
              </span>
            </div>
            <span className="text-[10px] text-[#8e99ac]">
              Solana Rent Rate: 0.00696 SOL / KB
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Creator Pays Mode */}
            <div
              onClick={() => onChangePayerType('CREATOR_WALLET')}
              className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5 ${
                payerType === 'CREATOR_WALLET'
                  ? 'bg-[#151d2d] border-[#39ff14] shadow-sm'
                  : 'bg-[#0a0e16] border-[#1e2738] hover:border-[#2f3d56]'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                  payerType === 'CREATOR_WALLET'
                    ? 'border-[#39ff14] bg-[#39ff14] text-black'
                    : 'border-[#505d76]'
                }`}
              >
                {payerType === 'CREATOR_WALLET' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
              <div className="space-y-0.5">
                <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <span>Creator Connected Wallet</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#39ff14]/20 text-[#39ff14] font-bold">
                    RECOMMENDED
                  </span>
                </div>
                <p className="text-[10px] text-[#8e99ac] leading-tight">
                  You deposit ~{inscribedRentSol} SOL from your Phantom/Solflare wallet. <strong>The deposit is 100% owned by and refundable to your wallet</strong> if ever dereferenced.
                </p>
              </div>
            </div>

            {/* Platform Sponsored Mode */}
            <div
              onClick={() => onChangePayerType('PLATFORM_SPONSORED')}
              className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5 ${
                payerType === 'PLATFORM_SPONSORED'
                  ? 'bg-[#171424] border-[#c084fc] shadow-sm'
                  : 'bg-[#0a0e16] border-[#1e2738] hover:border-[#2f3d56]'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                  payerType === 'PLATFORM_SPONSORED'
                    ? 'border-[#c084fc] bg-[#c084fc] text-black'
                    : 'border-[#505d76]'
                }`}
              >
                {payerType === 'PLATFORM_SPONSORED' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
              <div className="space-y-0.5">
                <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <span>MemeFI Protocol Gasless Relay</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#9945ff]/20 text-[#c084fc] font-bold">
                    SPONSORED
                  </span>
                </div>
                <p className="text-[10px] text-[#8e99ac] leading-tight">
                  MemeFI Octane Relayer signs as <code className="text-white">fee_payer</code> (0 SOL creator rent). A standard 0.5% protocol bonding curve share applies upon trading migration.
                </p>
              </div>
            </div>
          </div>

          {/* Itemized Economics Breakdown Card */}
          <div className="p-2.5 rounded bg-[#070a10] border border-[#1b2333] space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between text-[#8e99ac]">
              <span>Mascot Payload Compression:</span>
              <span className="text-white font-mono">{payloadBytes.toLocaleString()} bytes ({kbSize} KB)</span>
            </div>
            <div className="flex items-center justify-between text-[#8e99ac]">
              <span>MIME Type Header:</span>
              <span className="text-[#00f5ff] font-mono">image/svg+xml;charset=utf-8</span>
            </div>
            <div className="flex items-center justify-between text-[#8e99ac]">
              <span>Solana Rent Exemption Deposit:</span>
              <span className="text-white font-mono">
                {payerType === 'PLATFORM_SPONSORED' ? (
                  <span className="text-[#39ff14]">0.0000 SOL (Subsidized by MemeFI)</span>
                ) : (
                  <span>~{inscribedRentSol} SOL (Paid by your wallet)</span>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#182030] font-bold">
              <span className="text-white">Refundability Status:</span>
              <span className="text-[#39ff14]">100% Reclaimable SOL Asset</span>
            </div>
          </div>
        </div>
      )}

      {/* Byte Inspector Tray (Expandable) */}
      {showByteInspector && (
        <div className="p-3.5 rounded-lg bg-[#07090f] border border-[#1d2638] space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#182132]">
            <div className="flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-[#00f5ff]" />
              <span className="text-[11px] font-bold text-white uppercase">
                On-Chain Inscription Binary Manifest
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyBytecode}
              className="text-[10px] text-[#39ff14] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copiedBytecode ? <Check className="w-3 h-3 text-[#39ff14]" /> : <Copy className="w-3 h-3" />}
              <span>{copiedBytecode ? 'Copied' : 'Copy Raw SVG'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
            <div>
              <span className="text-[#8e99ac]">Target Mint PDA:</span>
              <div className="text-[#00f5ff] truncate font-mono">
                {ticker ? `${ticker.replace('$', '')}Mint11111111111111111111111111111111` : 'Token2022MintPDA'}
              </div>
            </div>
            <div>
              <span className="text-[#8e99ac]">SHA-256 Inscription Hash:</span>
              <div className="text-white truncate font-mono">{mockSha256}</div>
            </div>
          </div>

          <div className="relative">
            <pre className="p-2.5 rounded bg-[#030509] border border-[#141c2b] text-[10px] text-emerald-400 font-mono overflow-x-auto max-h-28 whitespace-pre-wrap select-all leading-tight">
              {mascotSvg
                ? mascotSvg.slice(0, 360) + '\n<!-- ... truncated for preview. Total size: ' + payloadBytes + ' bytes ... -->'
                : `// Inscribed SVG Bytecode will be rendered here\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">\n  <!-- ${tokenName} (${ticker}) Pure Procedural Vector -->\n</svg>`}
            </pre>
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#8e99ac]">
            <span>Solana Gateway Renderer:</span>
            <span className="text-[#c084fc] font-semibold">ordinals.libreplex.io / Solscan Token-2022</span>
          </div>
        </div>
      )}
    </div>
  );
};
