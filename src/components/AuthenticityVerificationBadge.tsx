import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Info,
  Layers,
  Sparkles,
  Lock,
  Zap,
} from 'lucide-react';
import {
  AuthenticityAuditResult,
  VerifiableMetric,
} from '../utils/authenticityEngine';

interface AuthenticityVerificationBadgeProps {
  auditResult: AuthenticityAuditResult;
  contractAddress?: string;
  showModalButton?: boolean;
  compact?: boolean;
  onToggleMode?: () => void;
}

export const AuthenticityVerificationBadge: React.FC<AuthenticityVerificationBadgeProps> = ({
  auditResult,
  contractAddress = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsypump',
  showModalButton = true,
  compact = false,
  onToggleMode,
}) => {
  const [showProofModal, setShowProofModal] = useState(false);

  const isSystemVerified = auditResult.source === 'SYSTEM_VERIFIED_ON_CHAIN';
  const isParody = auditResult.source === 'COMMUNITY_PARODY';
  const isUserEdited = auditResult.source === 'USER_EDITED';

  const badgeBg = isSystemVerified
    ? 'bg-[#064e3b]/80 border-[#39ff14]/60 text-[#39ff14]'
    : isParody
    ? 'bg-[#451a03]/80 border-[#f59e0b]/60 text-[#f59e0b]'
    : 'bg-[#1e1b4b]/80 border-[#a855f7]/60 text-[#c084fc]';

  return (
    <>
      <div
        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border font-mono text-[11px] transition-all shadow-sm ${badgeBg} ${
          compact ? 'text-[10px] py-0.5 px-2' : ''
        }`}
      >
        {isSystemVerified ? (
          <ShieldCheck className="w-3.5 h-3.5 text-[#39ff14] shrink-0" />
        ) : isParody ? (
          <Sparkles className="w-3.5 h-3.5 text-[#f59e0b] shrink-0" />
        ) : (
          <Layers className="w-3.5 h-3.5 text-[#c084fc] shrink-0" />
        )}

        <span className="font-bold uppercase tracking-wider">
          {isSystemVerified
            ? 'Verified On-Chain Grounded'
            : isParody
            ? 'Community Parody / Goal'
            : 'User Custom Edit'}
        </span>

        <span className="text-[10px] opacity-70 border-l border-current/30 pl-1.5 hidden sm:inline">
          {auditResult.truthScore}% Truth Score
        </span>

        {showModalButton && (
          <button
            type="button"
            onClick={() => setShowProofModal(true)}
            className="hover:underline flex items-center gap-0.5 text-[10px] opacity-80 hover:opacity-100 ml-1 cursor-pointer font-sans"
            title="Inspect Cryptographic On-Chain Proof"
          >
            <span>Verification Proof</span>
            <Info className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Proof Inspection Modal */}
      {showProofModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0e1117] border border-[#2d3139] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-white relative">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#2d3139] pb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isSystemVerified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider">
                    Content Provenance &amp; Verification Audit
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Zero-Fake-News Standard v2.4
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowProofModal(false)}
                className="text-slate-400 hover:text-white text-lg font-mono p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Status Summary */}
            <div className={`p-3 rounded-xl border ${
              isSystemVerified
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : isParody
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                : 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200'
            }`}>
              <div className="text-xs font-bold font-mono flex items-center gap-2">
                <span>Origin: {auditResult.source.replace(/_/g, ' ')}</span>
                <span className="px-1.5 py-0.2 text-[9px] rounded bg-white/10">
                  {auditResult.truthScore}/100 Compliance Score
                </span>
              </div>
              <p className="text-xs mt-1 leading-relaxed opacity-90 font-sans">
                {isSystemVerified
                  ? 'This asset was generated under verified protocol standards. Zero fictional price pumps, fake exchange announcements, or misleading claims were injected.'
                  : isParody
                  ? 'This graphic contains hyperbolic meme tropes or targets clearly distinguished as community satire. It is not an audited financial statement.'
                  : 'This content was edited or custom-typed by the user. The platform attributes user-authored text as community contributions.'}
              </p>
            </div>

            {/* Cryptographic Proof Details */}
            <div className="bg-[#050608] border border-[#2d3139] rounded-xl p-3.5 space-y-2.5 font-mono text-xs">
              <div className="text-[10px] uppercase font-bold text-[#00f5ff] tracking-wider flex items-center justify-between">
                <span>On-Chain Grounding State:</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED SPL
                </span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between border-b border-[#2d3139]/60 pb-1">
                  <span className="text-slate-400">Verifiable Metric:</span>
                  <span className="text-[#39ff14] font-bold">
                    {auditResult.verifiableMetric.badgeLabel}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#2d3139]/60 pb-1">
                  <span className="text-slate-400">Verification Source:</span>
                  <span className="text-white">{auditResult.verifiableMetric.proofSource}</span>
                </div>

                <div className="flex items-center justify-between border-b border-[#2d3139]/60 pb-1">
                  <span className="text-slate-400">Mint Authority:</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Permanently Revoked
                  </span>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-slate-400">Solana Mint CA:</span>
                  <span className="text-cyan-300 truncate max-w-[200px] select-all">
                    {contractAddress}
                  </span>
                </div>
              </div>
            </div>

            {/* Unverified Claims Warning if present */}
            {auditResult.unverifiedClaimsDetected.length > 0 && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Unverified Claim Flag:</span>
                </div>
                <ul className="list-disc pl-5 text-[11px] space-y-0.5">
                  {auditResult.unverifiedClaimsDetected.map((claim, idx) => (
                    <li key={idx}>{claim}</li>
                  ))}
                </ul>
                <p className="text-[10px] text-rose-300 opacity-80 pt-1">
                  Our system labels this content with a <b>Community Satire / User Parody</b> watermark so the broader public is not misled.
                </p>
              </div>
            )}

            {/* External Links */}
            <div className="flex items-center justify-between pt-2 border-t border-[#2d3139] text-xs font-mono">
              <a
                href={`https://solscan.io/token/${contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00f5ff] hover:underline flex items-center gap-1"
              >
                <span>Audit on Solscan</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => setShowProofModal(false)}
                className="px-4 py-1.5 rounded bg-[#1a1d24] hover:bg-[#2d3139] text-white font-mono cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
