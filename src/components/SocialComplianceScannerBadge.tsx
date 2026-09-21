import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
  Scale,
  CheckCircle2,
} from 'lucide-react';
import { auditSocialContent, ComplianceAuditResult } from '../utils/complianceFramework';

interface SocialComplianceScannerBadgeProps {
  content: string;
  ticker?: string;
  onApplySanitized?: (sanitizedText: string) => void;
  compact?: boolean;
}

export const SocialComplianceScannerBadge: React.FC<SocialComplianceScannerBadgeProps> = ({
  content,
  ticker = '$TOKEN',
  onApplySanitized,
  compact = false,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const audit: ComplianceAuditResult = auditSocialContent(content, ticker);

  const getBadgeColor = () => {
    switch (audit.riskLevel) {
      case 'SAFE':
        return 'bg-[#39ff14]/10 border-[#39ff14]/30 text-[#39ff14]';
      case 'CAUTION':
        return 'bg-[#facc15]/10 border-[#facc15]/30 text-[#facc15]';
      case 'HIGH_RISK':
        return 'bg-[#ef4444]/15 border-[#ef4444]/40 text-[#ef4444]';
    }
  };

  const getBadgeIcon = () => {
    switch (audit.riskLevel) {
      case 'SAFE':
        return <ShieldCheck className="w-3.5 h-3.5 text-[#39ff14]" />;
      case 'CAUTION':
        return <AlertTriangle className="w-3.5 h-3.5 text-[#facc15]" />;
      case 'HIGH_RISK':
        return <AlertOctagon className="w-3.5 h-3.5 text-[#ef4444]" />;
    }
  };

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5">
        <span
          className={`px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold flex items-center gap-1 ${getBadgeColor()}`}
        >
          {getBadgeIcon()}
          <span>
            {audit.riskLevel === 'SAFE'
              ? '100% Compliant Copy'
              : audit.riskLevel === 'CAUTION'
              ? 'Moderate Risk'
              : 'High Securities Risk'}
          </span>
        </span>
        {audit.flags.length > 0 && onApplySanitized && (
          <button
            type="button"
            onClick={() => onApplySanitized(audit.sanitizedText)}
            className="px-2 py-0.5 rounded-md bg-[#39ff14]/15 hover:bg-[#39ff14]/25 text-[#39ff14] border border-[#39ff14]/30 text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title="Auto-Sanitize copy to compliant cultural phrasing"
          >
            <Sparkles className="w-3 h-3" />
            <span>Auto-Sanitize</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#232938] bg-[#0d1017] p-3 space-y-2">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-[#00f5ff]" />
            <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
              Regulatory &amp; Securities Scanner
            </span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold flex items-center gap-1 ${getBadgeColor()}`}
          >
            {getBadgeIcon()}
            <span>
              {audit.riskLevel === 'SAFE'
                ? `Compliance Score: ${audit.score}/100 (Safe)`
                : audit.riskLevel === 'CAUTION'
                ? `Caution: ${audit.score}/100`
                : `High Securities Risk: ${audit.score}/100`}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {audit.flags.length > 0 && onApplySanitized && (
            <button
              type="button"
              onClick={() => onApplySanitized(audit.sanitizedText)}
              className="px-2.5 py-1 rounded-lg bg-[#39ff14]/15 hover:bg-[#39ff14]/25 text-[#39ff14] border border-[#39ff14]/40 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sanitize Text</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="p-1 rounded text-[#8e99ac] hover:text-white transition-colors cursor-pointer"
          >
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Summary Message */}
      <p className="text-[11px] font-sans text-[#8e99ac] leading-relaxed">
        {audit.summary}
      </p>

      {/* Flagged Elements Warning */}
      {audit.flags.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] font-mono uppercase font-bold text-[#ef4444] flex items-center gap-1">
            <AlertOctagon className="w-3 h-3" />
            <span>Detected Red-Flag Phrases:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {audit.flags.map((flag, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-[#141722] border border-[#ef4444]/30 text-[11px] font-sans space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#ef4444] bg-[#ef4444]/10 px-1.5 py-0.5 rounded">
                    "{flag.phrase}"
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-300">
                    {flag.category.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[10px] text-[#b0b8c6]">{flag.reason}</p>
                <p className="text-[10px] text-[#39ff14] font-medium">
                  💡 Suggestion: {flag.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Framework Accordion */}
      {showDetails && (
        <div className="mt-2 pt-2 border-t border-[#1e2433] space-y-2 text-[11px] font-sans text-[#8e99ac] animate-fadeIn">
          <div className="p-2.5 rounded-lg bg-[#12151e] border border-[#1e2433] space-y-1.5">
            <div className="flex items-center gap-1.5 text-white font-mono font-bold text-[11px]">
              <Info className="w-3.5 h-3.5 text-[#00f5ff]" />
              <span>Howey Test &amp; Anti-FOMO Heuristic Rules:</span>
            </div>
            <ul className="space-y-1 list-disc list-inside text-[10px] text-[#94a3b8] leading-relaxed">
              <li>
                <strong className="text-white">Zero Expectation of Profit:</strong> Ban terms like "100x gains", "guaranteed moon", or "passive yield" which trigger Howey securities classification.
              </li>
              <li>
                <strong className="text-white">Zero Managerial Reliance:</strong> Frame campaigns as decentralized community participation rather than promises from a central development team.
              </li>
              <li>
                <strong className="text-white">No Aggressive Public Solicitation:</strong> Replace "Get in early before migration" with neutral milestone and mascot artwork updates.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
