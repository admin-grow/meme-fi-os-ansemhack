import React, { useState } from 'react';
import { useSolanaWallet, WalletType } from '../context/WalletContext';
import {
  Wallet,
  X,
  ExternalLink,
  ShieldCheck,
  Check,
  Flame,
  AlertCircle,
  RefreshCw,
  Droplets,
  Copy,
} from 'lucide-react';

export const WalletModal: React.FC = () => {
  const {
    wallet,
    isWalletModalOpen,
    closeWalletModal,
    connectWallet,
    disconnectWallet,
    rotateBurnerKey,
    airdropDevnetSol,
    setNetwork,
  } = useSolanaWallet();

  const [copied, setCopied] = useState(false);
  const [airdropping, setAirdropping] = useState(false);

  if (!isWalletModalOpen) return null;

  const handleCopy = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAirdrop = async () => {
    setAirdropping(true);
    await airdropDevnetSol();
    setTimeout(() => setAirdropping(false), 600);
  };

  const isPhantomInstalled = typeof window !== 'undefined' && Boolean((window as any)?.solana?.isPhantom || (window as any)?.phantom?.solana);
  const isSolflareInstalled = typeof window !== 'undefined' && Boolean((window as any)?.solflare?.isSolflare);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-2xl bg-[#0e1117] border border-[#2d3139] shadow-2xl overflow-hidden font-mono space-y-4 p-5 sm:p-6 relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2d3139]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00f5ff]/10 border border-[#00f5ff]/30 flex items-center justify-center text-[#00f5ff]">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Solana Wallet Connection
              </h3>
              <p className="text-[10px] text-[#e0e0e0]/60">Non-Custodial • Zero Private Key Storage</p>
            </div>
          </div>

          <button
            onClick={closeWalletModal}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a1d24] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Network Toggle */}
        <div className="p-2.5 rounded-xl bg-[#06080b] border border-[#2d3139] flex items-center justify-between text-xs">
          <span className="text-[10px] uppercase font-bold text-[#e0e0e0]/70">Target Cluster:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setNetwork('devnet')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                wallet.network === 'devnet'
                  ? 'bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14]/50 shadow-[0_0_8px_rgba(57,255,20,0.3)]'
                  : 'text-[#e0e0e0]/60 hover:text-white'
              }`}
            >
              Devnet (Sandbox)
            </button>
            <button
              onClick={() => setNetwork('mainnet')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                wallet.network === 'mainnet'
                  ? 'bg-[#00f5ff]/20 text-[#00f5ff] border border-[#00f5ff]/50 shadow-[0_0_8px_rgba(0,245,255,0.3)]'
                  : 'text-[#e0e0e0]/60 hover:text-white'
              }`}
            >
              Mainnet-Beta
            </button>
          </div>
        </div>

        {/* Currently Connected Status (if connected) */}
        {wallet.connected && (
          <div className="p-3.5 rounded-xl bg-[#141822] border border-[#00f5ff]/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase text-[#00f5ff] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#39ff14] shadow-[0_0_6px_#39ff14]" />
                Active: {wallet.walletName}
              </span>
              <span className="text-[11px] font-bold text-[#ccff00]">
                {wallet.balanceSol} SOL
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-[#090b10] border border-[#2d3139] text-xs">
              <span className="text-[#39ff14] text-[11px] font-mono break-all truncate max-w-[240px]">
                {wallet.address}
              </span>
              <button
                onClick={handleCopy}
                className="p-1 text-[#e0e0e0]/70 hover:text-[#00f5ff] transition-colors cursor-pointer"
                title="Copy Address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#39ff14]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {wallet.network === 'devnet' && (
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleAirdrop}
                  disabled={airdropping}
                  className="text-[10px] text-[#39ff14] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <Droplets className="w-3 h-3" />
                  <span>{airdropping ? 'Airdropping...' : '+0.50 Devnet SOL Faucet'}</span>
                </button>

                {wallet.walletType === 'burner' && (
                  <button
                    onClick={rotateBurnerKey}
                    className="text-[10px] text-[#00f5ff] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Rotate Key</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Wallet Selection Options */}
        <div className="space-y-2 pt-1">
          <span className="text-[10px] uppercase font-bold text-[#e0e0e0]/50 block">Select Provider:</span>

          {/* Option 1: Instant Sandbox Burner Keypair */}
          <button
            onClick={() => connectWallet('burner')}
            className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              wallet.walletType === 'burner' && wallet.connected
                ? 'bg-[#1a202c] border-[#ccff00] text-white shadow-[0_0_12px_rgba(204,255,0,0.15)]'
                : 'bg-[#12141c] border-[#2d3139] text-[#e0e0e0]/80 hover:border-[#ccff00]/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00] font-bold text-xs">
                ⚡
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-2">
                  <span>Burner Sandbox Keypair</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#ccff00]/20 text-[#ccff00] font-bold">
                    RECOMMENDED FOR DEMO
                  </span>
                </div>
                <div className="text-[10px] text-[#e0e0e0]/50">Instant 0-click test wallet (No extension needed)</div>
              </div>
            </div>
            {wallet.walletType === 'burner' && wallet.connected && (
              <Check className="w-4 h-4 text-[#ccff00]" />
            )}
          </button>

          {/* Option 2: Phantom Wallet */}
          <button
            onClick={() => connectWallet('phantom')}
            className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              wallet.walletType === 'phantom' && wallet.connected
                ? 'bg-[#1a202c] border-[#ab9ff2] text-white shadow-[0_0_12px_rgba(171,159,242,0.2)]'
                : 'bg-[#12141c] border-[#2d3139] text-[#e0e0e0]/80 hover:border-[#ab9ff2]/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#ab9ff2]/10 border border-[#ab9ff2]/30 flex items-center justify-center text-[#ab9ff2] font-bold text-xs">
                👻
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-2">
                  <span>Phantom Wallet</span>
                  {isPhantomInstalled ? (
                    <span className="text-[9px] px-1 rounded bg-[#39ff14]/20 text-[#39ff14]">DETECTED</span>
                  ) : (
                    <span className="text-[9px] px-1 rounded bg-[#e0e0e0]/20 text-[#e0e0e0]/70">INSTALL</span>
                  )}
                </div>
                <div className="text-[10px] text-[#e0e0e0]/50">Browser Extension / Mobile App</div>
              </div>
            </div>
            {wallet.walletType === 'phantom' && wallet.connected ? (
              <Check className="w-4 h-4 text-[#ab9ff2]" />
            ) : (
              <ExternalLink className="w-3.5 h-3.5 opacity-40" />
            )}
          </button>

          {/* Option 3: Solflare Wallet */}
          <button
            onClick={() => connectWallet('solflare')}
            className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              wallet.walletType === 'solflare' && wallet.connected
                ? 'bg-[#1a202c] border-[#fc6e20] text-white shadow-[0_0_12px_rgba(252,110,32,0.2)]'
                : 'bg-[#12141c] border-[#2d3139] text-[#e0e0e0]/80 hover:border-[#fc6e20]/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#fc6e20]/10 border border-[#fc6e20]/30 flex items-center justify-center text-[#fc6e20] font-bold text-xs">
                ☀️
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-2">
                  <span>Solflare Wallet</span>
                  {isSolflareInstalled ? (
                    <span className="text-[9px] px-1 rounded bg-[#39ff14]/20 text-[#39ff14]">DETECTED</span>
                  ) : (
                    <span className="text-[9px] px-1 rounded bg-[#e0e0e0]/20 text-[#e0e0e0]/70">INSTALL</span>
                  )}
                </div>
                <div className="text-[10px] text-[#e0e0e0]/50">Solana Native Wallet</div>
              </div>
            </div>
            {wallet.walletType === 'solflare' && wallet.connected ? (
              <Check className="w-4 h-4 text-[#fc6e20]" />
            ) : (
              <ExternalLink className="w-3.5 h-3.5 opacity-40" />
            )}
          </button>
        </div>

        {/* Error message */}
        {wallet.error && (
          <div className="p-2.5 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/40 text-[#ef4444] text-[11px] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{wallet.error}</span>
          </div>
        )}

        {/* Security & Non-Custodial Footer */}
        <div className="pt-2 border-t border-[#2d3139] flex items-center justify-between text-[10px] text-[#e0e0e0]/50">
          <div className="flex items-center gap-1 text-[#39ff14]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pillar 01: 100% Non-Custodial</span>
          </div>
          {wallet.connected && (
            <button
              onClick={disconnectWallet}
              className="text-[#ef4444] hover:underline cursor-pointer"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
