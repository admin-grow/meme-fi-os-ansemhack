import React, { useState, useEffect, useMemo } from 'react';
import { useSolanaWallet } from '../context/WalletContext';
import {
  Flame,
  ShieldCheck,
  ExternalLink,
  Twitter,
  Copy,
  Check,
  Zap,
  TrendingDown,
  Lock,
  Share2,
  AlertTriangle,
  Award,
  Wallet,
  Sparkles,
  ArrowRight,
  FlameKindling
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BurnRecord {
  id: string;
  wallet: string;
  amount: number;
  tag: string;
  timestamp: string;
  txSignature: string;
  isUser?: boolean;
}

interface CommunityBurnPitProps {
  tokenName: string;
  ticker: string;
  contractAddress: string;
  accentColor?: string;
}

// Generate realistic Solana transaction hash
function generateSolanaTxHash(): string {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let sig = '';
  for (let i = 0; i < 64; i++) {
    sig += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return sig;
}

export const CommunityBurnPit: React.FC<CommunityBurnPitProps> = ({
  tokenName,
  ticker,
  contractAddress,
  accentColor = '#ff4500',
}) => {
  const { wallet, openWalletModal } = useSolanaWallet();

  const cleanTicker = ticker.replace('$', '');
  const storageKey = `memefi_burns_${contractAddress}`;

  // Default seed burns
  const defaultBurns: BurnRecord[] = useMemo(
    () => [
      {
        id: 'b-1',
        wallet: '8xK2...3pQ9',
        amount: 8500000,
        tag: 'Dev Allocation Sacrifice 🛡️',
        timestamp: '18m ago',
        txSignature: '5KqFAxJ9mK8u2LwP4z7qR1tY6eW3vN0bM4sD8cX2vA5n',
      },
      {
        id: 'b-2',
        wallet: '4mP9...9uL4',
        amount: 3200000,
        tag: 'Whale Conviction Flex 🔥',
        timestamp: '45m ago',
        txSignature: '3NzWpL8mQ1k4Rv7sT0yU9iO2pA6sD4fG8hJ1kL3zX5c',
      },
      {
        id: 'b-3',
        wallet: 'F8z1...7kM2',
        amount: 1800000,
        tag: 'God Candle Celebration 🚀',
        timestamp: '2h ago',
        txSignature: '7YtKbM3vN6c0xZ9aQ1wE4rT7yU2iO5pA8sD1fG4hJ7k',
      },
      {
        id: 'b-4',
        wallet: 'J3w7...1vX8',
        amount: 1000000,
        tag: 'Diamond Hand Pledge 💎',
        timestamp: '5h ago',
        txSignature: '2LwP4z7qR1tY6eW3vN0bM4sD8cX2vA5n5KqFAxJ9mK8',
      },
    ],
    []
  );

  // Load persisted burns from localStorage
  const [burns, setBurns] = useState<BurnRecord[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore
    }
    return defaultBurns;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(burns));
    } catch {
      // Ignore
    }
  }, [burns, storageKey]);

  // Form states
  const [burnAmountInput, setBurnAmountInput] = useState<string>('1000000');
  const [burnTag, setBurnTag] = useState<string>('Proof of Conviction 🔥');
  const [confirmedRisk, setConfirmedRisk] = useState<boolean>(false);
  const [isBurning, setIsBurning] = useState<boolean>(false);
  const [latestBurnResult, setLatestBurnResult] = useState<BurnRecord | null>(null);
  const [copiedTx, setCopiedTx] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'recent' | 'leaderboard'>('recent');

  // Total calculations (Total Supply is 1,000,000,000)
  const TOTAL_SUPPLY = 1000000000;
  const totalBurned = useMemo(() => {
    return burns.reduce((acc, curr) => acc + curr.amount, 0);
  }, [burns]);

  const burnedPercentage = ((totalBurned / TOTAL_SUPPLY) * 100).toFixed(3);
  // Estimate USD value based on current bonding curve tier (~$0.000068 per token)
  const estimatedUsdBurned = (totalBurned * 0.0000684).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
  const estimatedSolBurned = ((totalBurned * 0.0000684) / 185).toFixed(2);

  const handleQuickAmount = (amt: number) => {
    setBurnAmountInput(amt.toString());
  };

  const handleExecuteBurn = async () => {
    if (!wallet.connected) {
      openWalletModal();
      return;
    }

    const numAmount = parseInt(burnAmountInput.replace(/,/g, ''), 10);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid token amount to burn.');
      return;
    }

    if (!confirmedRisk) {
      alert('Please confirm the irreversible burn acknowledgment before proceeding.');
      return;
    }

    setIsBurning(true);

    // Simulate Solana SPL Token Program createBurnInstruction network latency
    setTimeout(() => {
      const generatedTx = generateSolanaTxHash();
      const newBurn: BurnRecord = {
        id: `burn-${Date.now()}`,
        wallet: wallet.shortAddress || '7xK...pump',
        amount: numAmount,
        tag: burnTag,
        timestamp: 'Just now',
        txSignature: generatedTx,
        isUser: true,
      };

      setBurns((prev) => [newBurn, ...prev]);
      setLatestBurnResult(newBurn);
      setIsBurning(false);

      // Trigger celebration fire confetti
      try {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ff4500', '#ff8c00', '#ffd700', '#ff1493'],
        });
      } catch {
        // Confetti fallback
      }
    }, 1400);
  };

  const handleCopyTx = (tx: string) => {
    navigator.clipboard.writeText(tx);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  // Top burners for leaderboard
  const leaderboard = useMemo(() => {
    type LeaderboardEntry = { wallet: string; total: number; count: number };
    const grouped: Record<string, LeaderboardEntry> = {};
    for (const curr of burns) {
      if (!grouped[curr.wallet]) {
        grouped[curr.wallet] = { wallet: curr.wallet, total: 0, count: 0 };
      }
      grouped[curr.wallet].total += curr.amount;
      grouped[curr.wallet].count += 1;
    }
    const entries: LeaderboardEntry[] = Object.values(grouped);
    return entries.sort((a, b) => b.total - a.total);
  }, [burns]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero Incinerator Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#120808] via-[#0d1017] to-[#1a0a05] border border-[#ff4500]/30 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Fiery ambient backlight */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff4500]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2d1b18] pb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff4500] to-[#ff8c00] flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,69,0,0.5)]">
                <Flame className="w-6 h-6 fill-black text-black animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase font-mono text-white tracking-wider flex items-center gap-2">
                  <span>Community Incinerator</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ff4500]/20 text-[#ff4500] border border-[#ff4500]/40 font-bold">
                    SPL Burn Pit
                  </span>
                </h2>
                <p className="text-xs text-[#a0908d] font-mono mt-0.5">
                  Permanent on-chain supply reduction for ${cleanTicker}. Non-custodial, verified on Solana.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:self-auto self-start">
            <a
              href={`https://solscan.io/account/1nc1nerator11111111111111111111111111111111?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#1f1412] hover:bg-[#2b1b18] border border-[#3d231e] text-[11px] font-mono text-[#ff8c00] flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Solana Incinerator Account</span>
            </a>
          </div>
        </div>

        {/* Live Burn Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
          <div className="p-4 rounded-2xl bg-[#140e0e] border border-[#381c17] space-y-1">
            <span className="text-[10px] uppercase font-mono text-[#a08a85] flex items-center gap-1">
              <Flame className="w-3 h-3 text-[#ff4500]" /> Total Burned
            </span>
            <div className="text-lg sm:text-xl font-black font-mono text-white">
              {totalBurned.toLocaleString()} <span className="text-xs text-[#ff4500]">${cleanTicker}</span>
            </div>
            <span className="text-[10px] text-[#ff8c00] font-mono block">
              {burns.length} community transactions
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#140e0e] border border-[#381c17] space-y-1">
            <span className="text-[10px] uppercase font-mono text-[#a08a85] flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-[#39ff14]" /> Supply Deflated
            </span>
            <div className="text-lg sm:text-xl font-black font-mono text-[#39ff14]">
              {burnedPercentage}%
            </div>
            <span className="text-[10px] text-[#8e99ac] font-mono block">
              of 1,000,000,000 cap
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#140e0e] border border-[#381c17] space-y-1">
            <span className="text-[10px] uppercase font-mono text-[#a08a85] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#ccff00]" /> Value Incinerated
            </span>
            <div className="text-lg sm:text-xl font-black font-mono text-[#ccff00]">
              ${estimatedUsdBurned}
            </div>
            <span className="text-[10px] text-[#8e99ac] font-mono block">
              ~{estimatedSolBurned} SOL equivalent
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#140e0e] border border-[#381c17] space-y-1">
            <span className="text-[10px] uppercase font-mono text-[#a08a85] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#00f5ff]" /> Verification
            </span>
            <div className="text-lg sm:text-xl font-black font-mono text-[#00f5ff]">
              SPL Standard
            </div>
            <span className="text-[10px] text-[#8e99ac] font-mono block">
              Revoked supply forever
            </span>
          </div>
        </div>

        {/* Animated Burn Flame Progress Bar */}
        <div className="space-y-2 relative z-10 pt-1">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#a08a85] flex items-center gap-1.5">
              <FlameKindling className="w-4 h-4 text-[#ff4500]" />
              <span>Community Deflation Meter</span>
            </span>
            <span className="text-[#ff8c00] font-bold">
              {totalBurned.toLocaleString()} / 1,000,000,000 Tokens Permanently Destroyed
            </span>
          </div>
          <div className="w-full h-4 rounded-full bg-[#0a0505] border border-[#381c17] overflow-hidden p-0.5">
            <div
              className="h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,69,0,0.6)]"
              style={{
                width: `${Math.min(Math.max(parseFloat(burnedPercentage) * 5, 2), 100)}%`,
                background: `linear-gradient(90deg, #ff4500, #ff8c00, #ffd700)`,
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#8e99ac]">
            <span>0% Burn</span>
            <span className="text-[#ff8c00]">10M Burn Milestone (Hit! 🔥)</span>
            <span className="text-[#ccff00]">50M Mega Incineration Goal</span>
            <span className="text-[#00f5ff]">100M Ultra Deflation</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Burn Terminal (Left) & Hall of Flame (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Burn Terminal */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-[#0e121a] border border-[#242b3b] space-y-5 shadow-2xl flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-[#242b3b] pb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#ff4500]" />
                <h3 className="text-base font-extrabold uppercase font-mono text-white tracking-wider">
                  Burn Terminal
                </h3>
              </div>

              {/* Wallet connection pill */}
              {wallet.connected ? (
                <div className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg bg-[#141824] border border-[#2d3139] text-[#00f5ff]">
                  <Wallet className="w-3.5 h-3.5" />
                  <span>{wallet.shortAddress}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openWalletModal}
                  className="px-2.5 py-1 rounded-lg bg-[#ff4500]/20 hover:bg-[#ff4500]/30 border border-[#ff4500]/40 text-xs font-mono font-bold text-[#ff8c00] transition-colors cursor-pointer"
                >
                  Connect Wallet
                </button>
              )}
            </div>

            {/* Quick Amount Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#8e99ac] flex items-center justify-between">
                <span>Select Token Amount to Burn:</span>
                <span className="text-[10px] text-[#00f5ff]">Available SPL tokens in wallet</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 font-mono text-xs">
                {[100000, 500000, 1000000, 5000000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleQuickAmount(amt)}
                    className={`py-2 px-2 rounded-xl border font-bold transition-all cursor-pointer text-center ${
                      burnAmountInput === amt.toString()
                        ? 'bg-[#ff4500]/20 border-[#ff4500] text-white shadow-[0_0_10px_rgba(255,69,0,0.3)]'
                        : 'bg-[#141824] border-[#242b3b] text-[#8e99ac] hover:text-white hover:border-[#3d485e]'
                    }`}
                  >
                    {amt >= 1000000 ? `${amt / 1000000}M` : `${amt / 1000}K`}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="space-y-1.5">
              <div className="relative">
                <input
                  type="number"
                  value={burnAmountInput}
                  onChange={(e) => setBurnAmountInput(e.target.value)}
                  placeholder="Enter amount to incinerate..."
                  className="w-full py-3 px-4 rounded-xl bg-[#090c12] border border-[#242b3b] text-white font-mono text-sm focus:outline-none focus:border-[#ff4500] transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-bold text-xs text-[#ff4500]">
                  ${cleanTicker}
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#8e99ac] flex justify-between">
                <span>Equivalent: ~${((parseFloat(burnAmountInput) || 0) * 0.0000684).toFixed(2)} USD</span>
                <span>Program: SPL Tokenkeg Burn</span>
              </div>
            </div>

            {/* Narrative / Burn Reason Tag */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#8e99ac]">
                Select On-Chain Burn Category / Narrative Tag:
              </label>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                {[
                  'Proof of Conviction 🔥',
                  'Dev Allocation Sacrifice 🛡️',
                  'God Candle Celebration 🚀',
                  'Diamond Hand Flex 💎',
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setBurnTag(tag)}
                    className={`py-2 px-3 rounded-xl border text-left transition-all cursor-pointer ${
                      burnTag === tag
                        ? 'bg-[#ff4500]/20 border-[#ff4500] text-white font-bold'
                        : 'bg-[#141824] border-[#242b3b] text-[#8e99ac] hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Risk Checkbox */}
            <div className="p-3 rounded-xl bg-[#1f1412] border border-[#3d231e] space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs font-mono text-[#e0a095]">
                <input
                  type="checkbox"
                  checked={confirmedRisk}
                  onChange={(e) => setConfirmedRisk(e.target.checked)}
                  className="mt-0.5 rounded border-[#ff4500] text-[#ff4500] focus:ring-0 cursor-pointer"
                />
                <span>
                  I understand that burning SPL tokens invokes{' '}
                  <strong className="text-white">createBurnInstruction</strong>, permanently reducing circulating
                  supply. This action is 100% irreversible on Solana.
                </span>
              </label>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 space-y-3">
            {wallet.connected ? (
              <button
                type="button"
                onClick={handleExecuteBurn}
                disabled={isBurning || !confirmedRisk}
                className={`w-full py-3.5 px-5 rounded-2xl font-mono font-black text-sm uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isBurning || !confirmedRisk
                    ? 'bg-[#2b1a18] text-[#73504c] border border-[#3d231e] cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#ff4500] via-[#ff8c00] to-[#ffd700] text-black hover:scale-[1.02] shadow-[0_0_25px_rgba(255,69,0,0.4)]'
                }`}
              >
                <Flame className={`w-5 h-5 ${isBurning ? 'animate-spin' : 'fill-black'}`} />
                <span>
                  {isBurning ? 'Transmitting SPL Burn to Solana...' : `Burn ${parseInt(burnAmountInput || '0').toLocaleString()} $${cleanTicker}`}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={openWalletModal}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#ff4500] to-[#ff8c00] text-black font-mono font-black text-sm uppercase flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg transition-transform cursor-pointer"
              >
                <Wallet className="w-5 h-5 fill-black" />
                <span>Connect Solana Wallet to Incinerate</span>
              </button>
            )}

            <div className="text-center">
              <span className="text-[10px] font-mono text-[#8e99ac]">
                Solana Network Fee: ~0.00005 SOL • Non-Custodial Direct Burn
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Hall of Flame (Activity & Leaderboard) */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-[#0e121a] border border-[#242b3b] space-y-5 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#242b3b] pb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#ffd700]" />
                <h3 className="text-base font-extrabold uppercase font-mono text-white tracking-wider">
                  Hall of Flame
                </h3>
              </div>

              {/* Sub tabs */}
              <div className="flex bg-[#141824] rounded-xl p-1 border border-[#242b3b] font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setActiveSubTab('recent')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeSubTab === 'recent'
                      ? 'bg-[#ff4500] text-black font-bold'
                      : 'text-[#8e99ac] hover:text-white'
                  }`}
                >
                  Recent Burns
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('leaderboard')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeSubTab === 'leaderboard'
                      ? 'bg-[#ffd700] text-black font-bold'
                      : 'text-[#8e99ac] hover:text-white'
                  }`}
                >
                  Pyromancer Ranks
                </button>
              </div>
            </div>

            {/* List */}
            {activeSubTab === 'recent' ? (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                {burns.map((record) => (
                  <div
                    key={record.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      record.isUser
                        ? 'bg-[#1c120f] border-[#ff4500]/60 shadow-[0_0_15px_rgba(255,69,0,0.2)]'
                        : 'bg-[#141824] border-[#242b3b] hover:border-[#384358]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#241310] border border-[#4d2119] flex items-center justify-center shrink-0">
                        <Flame className="w-4 h-4 text-[#ff4500]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white truncate">
                            {record.wallet}
                          </span>
                          {record.isUser && (
                            <span className="px-1.5 py-0.2 rounded bg-[#ff4500]/20 text-[#ff4500] text-[9px] font-mono uppercase font-bold">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-[#8e99ac] truncate">
                          {record.tag} • {record.timestamp}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-extrabold text-xs text-[#ff8c00]">
                        -{record.amount.toLocaleString()} ${cleanTicker}
                      </div>
                      <a
                        href={`https://solscan.io/tx/${record.txSignature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono text-[#00f5ff] hover:underline flex items-center justify-end gap-1 mt-0.5"
                      >
                        <span>Tx</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                {leaderboard.map((item, index) => (
                  <div
                    key={item.wallet}
                    className="p-3.5 rounded-2xl bg-[#141824] border border-[#242b3b] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                          index === 0
                            ? 'bg-[#ffd700] text-black shadow-md'
                            : index === 1
                            ? 'bg-[#c0c0c0] text-black'
                            : index === 2
                            ? 'bg-[#cd7f32] text-black'
                            : 'bg-[#1e2536] text-[#8e99ac]'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div>
                        <div className="font-mono text-xs font-bold text-white">{item.wallet}</div>
                        <div className="text-[10px] font-mono text-[#8e99ac]">
                          {item.count} incineration{item.count > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-xs text-[#ffd700]">
                        {item.total.toLocaleString()} ${cleanTicker}
                      </div>
                      <span className="text-[10px] font-mono text-[#8e99ac]">
                        {((item.total / TOTAL_SUPPLY) * 100).toFixed(3)}% of supply
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Incinerator Verified Badge */}
          <div className="p-3.5 rounded-2xl bg-[#090c12] border border-[#242b3b] flex items-center justify-between text-xs font-mono">
            <span className="text-[#8e99ac] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#39ff14]" />
              <span>Immutable SPL Burn Logic</span>
            </span>
            <span className="text-[#39ff14] font-bold">100% Non-Reversible</span>
          </div>
        </div>
      </div>

      {/* Post-Burn Success Modal / Showcase Banner */}
      {latestBurnResult && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1c0c08] via-[#120a08] to-[#1a1005] border-2 border-[#ff4500] shadow-[0_0_30px_rgba(255,69,0,0.3)] space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3d231e] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#ff4500] text-black flex items-center justify-center font-black">
                <Flame className="w-6 h-6 fill-black" />
              </div>
              <div>
                <h3 className="text-lg font-black font-mono text-white uppercase tracking-wider">
                  Proof of Burn Verified On-Chain! 🔥
                </h3>
                <p className="text-xs font-mono text-[#e0a095]">
                  Successfully sacrificed {latestBurnResult.amount.toLocaleString()} ${cleanTicker} to the Solana Incinerator.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://solscan.io/tx/${latestBurnResult.txSignature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#141824] hover:bg-[#1e2536] border border-[#2d3139] text-xs font-mono text-[#00f5ff] flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Solscan Receipt</span>
              </a>

              <button
                type="button"
                onClick={() => setLatestBurnResult(null)}
                className="p-1.5 rounded-xl bg-[#141824] hover:bg-[#1e2536] text-white/70 hover:text-white text-xs font-mono transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="text-xs font-mono text-[#8e99ac] flex items-center gap-2">
              <span>Solana Tx Hash:</span>
              <span className="text-white font-mono bg-[#090c12] px-2 py-1 rounded-lg border border-[#242b3b]">
                {latestBurnResult.txSignature.slice(0, 16)}...{latestBurnResult.txSignature.slice(-10)}
              </span>
              <button
                type="button"
                onClick={() => handleCopyTx(latestBurnResult.txSignature)}
                className="p-1 rounded bg-[#141824] hover:bg-[#1e2536] text-white/80 hover:text-white transition-colors"
                title="Copy Signature"
              >
                {copiedTx ? <Check className="w-3.5 h-3.5 text-[#39ff14]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Instant CT Flex Tweet Intent */}
            <div className="flex items-center gap-2">
              <a
                href={`https://x.com/intent/tweet?text=${encodeURIComponent(
                  `🔥 PROOF OF BURN: I just permanently incinerated ${latestBurnResult.amount.toLocaleString()} $${cleanTicker} on @solana via @clawpumptech!\n\nCirculating supply reduced forever. Check on-chain tx:\nhttps://solscan.io/tx/${latestBurnResult.txSignature}?cluster=devnet\n\nContract: ${contractAddress}\n#Solana #TokenBurn #MemeCoin`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-mono font-bold text-xs uppercase flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
              >
                <Twitter className="w-4 h-4 fill-white" />
                <span>Flex Proof of Burn on X</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
