import React from 'react';
import { useSolanaWallet } from '../context/WalletContext';
import { Wallet, ChevronDown } from 'lucide-react';

export const ConnectWalletButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { wallet, openWalletModal } = useSolanaWallet();

  if (!wallet.connected) {
    return (
      <button
        type="button"
        id="header-connect-wallet-btn"
        onClick={openWalletModal}
        className={`px-2 sm:px-3.5 py-1.5 rounded-lg sm:rounded-xl bg-[#00f5ff] hover:bg-[#b2faff] text-black font-bold text-[11px] sm:text-xs font-mono uppercase flex items-center gap-1 sm:gap-1.5 transition-all shadow-[0_0_12px_rgba(0,245,255,0.3)] active:scale-95 cursor-pointer shrink-0 ${className}`}
        aria-label="Connect Solana Wallet"
      >
        <Wallet className="w-3.5 h-3.5 fill-black shrink-0" />
        <span>Connect</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      id="header-wallet-connected-btn"
      onClick={openWalletModal}
      className={`px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl bg-[#141822] hover:bg-[#1a202c] border border-[#00f5ff]/50 text-white text-[11px] sm:text-xs font-mono flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer shadow-[0_0_10px_rgba(0,245,255,0.1)] shrink-0 ${className}`}
      title={`${wallet.walletName} (${wallet.address})`}
      aria-label={`Connected: ${wallet.shortAddress}`}
    >
      <span className="w-2 h-2 rounded-full bg-[#39ff14] shadow-[0_0_6px_#39ff14] shrink-0" />
      <span className="font-bold text-[#00f5ff] max-w-[72px] xs:max-w-none truncate">{wallet.shortAddress}</span>
      <span className="text-[#e0e0e0]/50 text-[10px] hidden sm:inline">|</span>
      <span className="text-[#ccff00] font-bold text-[11px] hidden sm:inline">{wallet.balanceSol} SOL</span>
      <ChevronDown className="w-3 h-3 text-[#e0e0e0]/60 shrink-0" />
    </button>
  );
};
