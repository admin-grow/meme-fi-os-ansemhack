import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Zap, X, CheckCircle2, Lock, Flame } from 'lucide-react';

interface PreFlightConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDeploy: () => void;
  tokenName: string;
  ticker: string;
  network: 'devnet' | 'mainnet';
  initialBuySol: number;
  totalCostSol: number;
  rewardModel: 'HOLDER_REWARDS' | 'CREATOR_FEE';
  creatorFeePercent: number;
  jitoEnabled: boolean;
}

export const PreFlightConfirmationModal: React.FC<PreFlightConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirmDeploy,
  tokenName,
  ticker,
  network,
  initialBuySol,
  totalCostSol,
  rewardModel,
  creatorFeePercent,
  jitoEnabled,
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const isMatch = confirmationText.trim().toUpperCase() === 'DEPLOY';

  if (!isOpen) return null;

  const isDevnet = network === 'devnet';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-[#0e121a] border border-[#2d3748] rounded-2xl shadow-2xl overflow-hidden text-white font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div className={`px-6 py-4 flex items-center justify-between border-b ${
          isDevnet ? 'bg-[#1a1c24] border-[#2d3748]' : 'bg-[#1b1407] border-[#f59e0b]/40'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${
              isDevnet ? 'bg-[#00f5ff]/20 text-[#00f5ff]' : 'bg-[#f59e0b]/20 text-[#f59e0b]'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                PRE-FLIGHT LAUNCH GATE
              </h3>
              <p className="text-[11px] text-[#8e99ac]">
                Solana Smart Contract Inscription Authorization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8e99ac] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Network Banner */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
            isDevnet
              ? 'bg-[#00f5ff]/10 border-[#00f5ff]/30 text-[#00f5ff]'
              : 'bg-[#ff5722]/10 border-[#ff5722]/40 text-[#ff5722]'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${isDevnet ? 'bg-[#00f5ff]' : 'bg-[#ff5722]'}`} />
              <div className="flex flex-col">
                <span className="text-[10px] text-[#8e99ac] uppercase font-bold tracking-wider">Target Cluster</span>
                <span className="text-xs font-bold text-white">
                  {isDevnet ? 'Solana Devnet (Sandbox Simulation)' : 'Solana Mainnet-Beta (Live Real SOL)'}
                </span>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              isDevnet ? 'bg-[#00f5ff]/20 text-[#00f5ff]' : 'bg-[#ff5722]/20 text-[#ff5722]'
            }`}>
              {isDevnet ? 'TEST SIMULATION' : 'REAL SOL DEPLOYMENT'}
            </span>
          </div>

          {/* Token Summary Card */}
          <div className="p-4 rounded-xl bg-[#080a0f] border border-[#1e2536] space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-[#1e2536]">
              <span className="text-[#8e99ac]">Token Identifier:</span>
              <span className="text-white font-bold text-sm flex items-center gap-1.5">
                <span>{tokenName}</span>
                <span className="text-[#ccff00]">({ticker})</span>
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#8e99ac]">Creator Initial Buy:</span>
              <span className="text-[#ccff00] font-semibold">{initialBuySol} SOL</span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#8e99ac]">Total Estimated Cost:</span>
              <span className="text-[#39ff14] font-semibold">{totalCostSol} SOL</span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#8e99ac]">Reward Structure:</span>
              <span className="text-white font-medium">
                {rewardModel === 'HOLDER_REWARDS' ? '100% Holder Fee Streaming' : `Creator Treasury (${creatorFeePercent}%)`}
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px] pt-1">
              <span className="text-[#8e99ac]">MEV Protection:</span>
              <span className="text-white font-medium">
                {jitoEnabled ? 'Jito Private Mempool Bundle' : 'Standard Priority Gas'}
              </span>
            </div>
          </div>

          {/* Security Immutable Highlights */}
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 rounded-lg bg-[#121620] border border-[#1e2536] flex items-center gap-1.5 text-[#39ff14]">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>Mint & Freeze Revoked</span>
            </div>
            <div className="p-2 rounded-lg bg-[#121620] border border-[#1e2536] flex items-center gap-1.5 text-[#ff5722]">
              <Flame className="w-3.5 h-3.5 shrink-0" />
              <span>100% LP Tokens Burned</span>
            </div>
          </div>

          {/* Type 'DEPLOY' safety gate */}
          <div className="space-y-2 pt-2">
            <label className="block text-[11px] text-[#8e99ac]">
              To proceed with contract broadcast, type <strong className="text-white font-bold tracking-widest bg-[#1f2637] px-1.5 py-0.5 rounded">DEPLOY</strong> below:
            </label>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type DEPLOY to confirm"
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080a0f] border border-[#2d3748] focus:border-[#ccff00] text-white text-center font-bold tracking-widest uppercase outline-none transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-[#141824] hover:bg-[#1e2536] text-[#8e99ac] hover:text-white font-bold text-xs transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!isMatch}
              onClick={() => {
                if (isMatch) {
                  onConfirmDeploy();
                  onClose();
                }
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-tight flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isMatch
                  ? isDevnet
                    ? 'bg-[#00f5ff] text-black hover:bg-[#80faff] shadow-[0_0_20px_rgba(0,245,255,0.3)]'
                    : 'bg-[#ccff00] text-black hover:bg-[#e0ff4f] shadow-[0_0_20px_rgba(204,255,0,0.3)]'
                  : 'bg-[#1a1d24] text-slate-500 cursor-not-allowed border border-[#2d3139]'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Confirm & Inscribe</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
