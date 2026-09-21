import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ShieldCheck, 
  Zap, 
  Bot, 
  Wallet, 
  Layers, 
  Lock, 
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: React.ReactNode;
  category: string;
}

interface CategoryGroup {
  name: string;
  icon: React.ReactNode;
  tagline: string;
  faqs: FaqItem[];
}

export const FaqSection: React.FC = () => {
  // Track which category groups are expanded
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Getting Started & Launch Workflow': true,
    'Wallet Funding & Costs': true,
    'Meme Studio, Brand Assets & Micro-Sites': false,
    'Tokenomics & Creator Revenue': false,
    'Security, Non-Custodial Architecture & Risk': false,
  });

  // Track which specific question is open across groups
  const [openQuestionId, setOpenQuestionId] = useState<string | null>('get-1');

  const rawFaqs: FaqItem[] = [
    // 1. Getting Started & Launch Workflow
    {
      id: 'get-1',
      category: 'Getting Started & Launch Workflow',
      question: 'How do I create and launch a token from start to finish?',
      answer: (
        <div className="space-y-3">
          <p>
            Launching a meme token on MemeFi OS is structured into four intuitive steps with zero coding required:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-[#94a3b8] font-sans">
            <li>
              <strong className="text-white">Trend &amp; Narrative Input:</strong> Enter your core topic, meme concept, or news headline, then select a creative archetype (e.g. <em>Degen, Tech Satire, Absurdist Animals</em>) and target art style (e.g. <em>3D Clay, Pixel Art, Retro Anime</em>).
            </li>
            <li>
              <strong className="text-white">Multi-Agent AI Synthesis:</strong> Sequential Gemini agents generate your original ticker, viral score, 3-season storyline, high-contrast vector logo prompt, social tweet pack, and Telegram community dispatch copy.
            </li>
            <li>
              <strong className="text-white">Human-In-The-Loop Review:</strong> Review and tweak any generated asset. You can edit the ticker, rewrite lore, regenerate mascot art, select your revenue model, and toggle between Solana Devnet (test) and Mainnet.
            </li>
            <li>
              <strong className="text-white">1-Click Wallet Deployment:</strong> Connect your non-custodial Solana wallet (Phantom, Solflare, etc.) and approve the transaction. Your token mints, LP liquidity initialises, and your live branded micro-site launches in seconds.
            </li>
          </ol>
        </div>
      ),
    },
    {
      id: 'get-2',
      category: 'Getting Started & Launch Workflow',
      question: 'What is the Human-In-The-Loop (HITL) review process?',
      answer: (
        <p>
          MemeFi OS never executes transactions or publishes tokens automatically. You maintain 100% creative and executive authority over every element. At each step, you can refine token names, regenerate mascot graphics, adjust narrative lore, and customize tokenomics parameters before any transaction is sent to your wallet for signature.
        </p>
      ),
    },
    {
      id: 'get-3',
      category: 'Getting Started & Launch Workflow',
      question: 'Can I test token launches for free on Solana Devnet before spending real SOL?',
      answer: (
        <p>
          Yes! We strongly encourage testing your concepts on <strong>Solana Devnet</strong> first. Use the network toggle in the top navigation bar to switch to Devnet mode. In Devnet mode, you can use free test SOL to test the entire multi-agent synthesis, custom meme graphics creation, and simulated bonding curve deployment with zero financial risk.
        </p>
      ),
    },

    // 2. Wallet Funding & Costs
    {
      id: 'fund-1',
      category: 'Wallet Funding & Costs',
      question: 'How do I fund a Solana wallet with SOL?',
      answer: (
        <div className="space-y-3">
          <p>
            To deploy a token on Solana Mainnet, your non-custodial wallet needs a small amount of SOL (recommended: 0.05 to 0.1 SOL for rent and network gas). Here is how to fund your wallet:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 rounded-lg bg-[#141926] border border-[#243047] space-y-1">
              <span className="text-[11px] font-mono text-[#00f5ff] uppercase font-bold">Option A: Direct In-Wallet Buy</span>
              <p className="text-xs text-[#94a3b8]">
                Open your wallet app (e.g., Phantom or Solflare) and click <strong>&quot;Buy SOL&quot;</strong> to purchase directly using MoonPay, Coinbase Pay, Robinhood, or Apple Pay.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#141926] border border-[#243047] space-y-1">
              <span className="text-[11px] font-mono text-[#39ff14] uppercase font-bold">Option B: Centralized Exchange Transfer</span>
              <p className="text-xs text-[#94a3b8]">
                Buy SOL on Coinbase, Binance, Kraken, or OKX, then withdraw/send the SOL directly to your Solana wallet public address.
              </p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#161a24] border border-[#263145] text-xs text-[#94a3b8]">
            <strong className="text-white">For Free Devnet Testing:</strong> You do NOT need real money. Switch to <em>Solana Devnet</em> in the top header and click the built-in <strong>&quot;Request Airdrop&quot;</strong> button to receive 1 free Devnet test SOL instantly.
          </div>
        </div>
      ),
    },
    {
      id: 'fund-2',
      category: 'Wallet Funding & Costs',
      question: 'How much does it cost to deploy a token on Solana Mainnet?',
      answer: (
        <p>
          Deploying a token on Solana requires approximately <strong>~0.02 to 0.04 SOL</strong>. This covers on-chain Solana rent exemption for the token mint account, Metaplex metadata pointer storage, and initial bonding curve pool registration. MemeFi OS does not charge any upfront software subscription fees or hidden onboarding surcharges.
        </p>
      ),
    },
    {
      id: 'fund-3',
      category: 'Wallet Funding & Costs',
      question: 'Which Solana wallets are supported?',
      answer: (
        <p>
          MemeFi OS supports all major Solana non-custodial browser extensions and mobile wallet apps via the Solana Wallet Adapter standard, including <strong>Phantom</strong>, <strong>Solflare</strong>, <strong>Backpack</strong>, <strong>Coinbase Wallet</strong>, and <strong>Torus</strong>. You can also generate an in-browser Burner Wallet for rapid sandboxed testing.
        </p>
      ),
    },

    // 3. Meme Studio, Brand Assets & Micro-Sites
    {
      id: 'art-1',
      category: 'Meme Studio, Brand Assets & Micro-Sites',
      question: 'What graphics and assets are included in the generated Launch Kit?',
      answer: (
        <div className="space-y-2">
          <p>
            Agent 02 (Visual Content &amp; Meme Studio) automatically formats a complete brand identity package:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-[#94a3b8]">
            <li><strong className="text-white">Vector Mascot Logo:</strong> High-definition 512x512 mascot artwork rendered in your chosen aesthetic medium.</li>
            <li><strong className="text-white">Social Meme Overlays:</strong> Customizable viral templates including Breaking News banners, God Candle green spikes, Matrix cyber overlays, and 16:9 X Header banners.</li>
            <li><strong className="text-white">Community Dispatch Copy:</strong> Pre-formatted Telegram buy alerts, milestone notices, and 1-click Twitter community broadcast triggers.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'art-2',
      category: 'Meme Studio, Brand Assets & Micro-Sites',
      question: 'How do I download or export my mascot images and meme templates?',
      answer: (
        <p>
          You can download any individual image or meme overlay as a high-resolution PNG by clicking the <strong>&quot;Download PNG&quot;</strong> icon on the canvas. Additionally, you can export all generated assets, lore files, and metadata in a single compressed <strong>ZIP Brand Launch Kit</strong> with 1 click.
        </p>
      ),
    },
    {
      id: 'art-3',
      category: 'Meme Studio, Brand Assets & Micro-Sites',
      question: 'What is the instant Token Micro-Site and how does it work?',
      answer: (
        <p>
          Every deployed token is automatically assigned a dedicated, full-screen public web hub at <code className="px-1.5 py-0.5 rounded bg-[#161d2d] text-[#00f5ff] text-xs font-mono">/token/[contractAddress]</code>. The micro-site displays real-time price feeds, bonding curve progress meters, 3-season narrative lore, social community links, and direct DEX trading buttons for your community.
        </p>
      ),
    },
    {
      id: 'art-4',
      category: 'Meme Studio, Brand Assets & Micro-Sites',
      question: 'Can I revisit or manage tokens I previously created?',
      answer: (
        <p>
          Yes! All tokens launched or drafted during your sessions are saved in your local <strong>Launch Vault</strong>. You can switch between tokens using the top token selector or open the <em>Import Token</em> tool to reload any previous contract and access its full marketing suite.
        </p>
      ),
    },

    // 4. Tokenomics & Creator Revenue
    {
      id: 'tok-1',
      category: 'Tokenomics & Creator Revenue',
      question: 'How do creators earn sustainable revenue without dumping on their community?',
      answer: (
        <p>
          Instead of developers hoarding large token allocations and dumping them on early community members, creators can select a <strong>Creator Operations Treasury</strong> (0.5% to 2.0% volume stream). This routes a small percentage of trading volume directly to your deployer wallet to fund continuous DEX banners, social media marketing, and community buybacks without selling a single token from your personal balance.
        </p>
      ),
    },
    {
      id: 'tok-2',
      category: 'Tokenomics & Creator Revenue',
      question: 'What is the 100% Community Holder Streaming model?',
      answer: (
        <p>
          Under the <strong>100% Holder Reward model</strong>, 0% of trading fees go to the developer. Instead, swap and bonding curve volume fees are pooled and autonomously streamed proportionally to all non-custodial holder wallets, transforming pure market volatility into an on-chain holder reward mechanism.
        </p>
      ),
    },
    {
      id: 'tok-3',
      category: 'Tokenomics & Creator Revenue',
      question: 'How is the 100% Genesis LP burn enforced on-chain?',
      answer: (
        <p>
          When a token completes its bonding curve and graduates to Raydium, 100% of the newly minted Liquidity Provider (LP) tokens are programmatically sent to the dead burn address (<code className="text-[#39ff14] font-mono text-xs">1nc1nerator11111111111111111111111111111111</code>). This is permanently enforced at the smart contract level, preventing liquidity pull or creator withdrawal.
        </p>
      ),
    },

    // 5. Security, Non-Custodial Architecture & Risk
    {
      id: 'sec-1',
      category: 'Security, Non-Custodial Architecture & Risk',
      question: 'Does MemeFi OS ever have custody of my private keys or funds?',
      answer: (
        <p>
          <strong>Never.</strong> MemeFi OS is a 100% non-custodial software workspace. Private keys never touch our servers and are never stored in external databases. All transaction bytecode is assembled client-side in your browser and transmitted to your personal wallet (e.g., Phantom or Solflare) for your explicit cryptographic signature.
        </p>
      ),
    },
    {
      id: 'sec-2',
      category: 'Security, Non-Custodial Architecture & Risk',
      question: 'Are the token mint and freeze authorities permanently revoked?',
      answer: (
        <p>
          Yes. All tokens deployed through the ClawPump bonding curve protocol have both <strong>Mint Authority</strong> and <strong>Freeze Authority</strong> permanently revoked upon creation. This mathematically prevents arbitrary token inflation, blacklist freezes, or honeypot mechanics.
        </p>
      ),
    },
    {
      id: 'sec-3',
      category: 'Security, Non-Custodial Architecture & Risk',
      question: 'What are the financial risks involved with meme coins and trading?',
      answer: (
        <p>
          Cryptocurrency trading, token creation, and meme coin participation involve extreme price volatility, market illiquidity, and technological risk. Interacting with decentralized protocols and meme tokens can result in a total loss of funds. Never deploy capital you cannot afford to lose completely. MemeFi OS is strictly a software automation interface and does not provide financial, legal, or investment advice.
        </p>
      ),
    },
  ];

  // Group FAQs by Category
  const categoryGroups: CategoryGroup[] = useMemo(() => {
    return [
      {
        name: 'Getting Started & Launch Workflow',
        icon: <Zap className="w-4 h-4 text-[#00f5ff]" />,
        tagline: '4-step creation flow, human-in-the-loop review, and Solana Devnet testing',
        faqs: rawFaqs.filter((f) => f.category === 'Getting Started & Launch Workflow'),
      },
      {
        name: 'Wallet Funding & Costs',
        icon: <Wallet className="w-4 h-4 text-[#39ff14]" />,
        tagline: 'How to fund your wallet, free testnet faucets, and Solana network fees',
        faqs: rawFaqs.filter((f) => f.category === 'Wallet Funding & Costs'),
      },
      {
        name: 'Meme Studio, Brand Assets & Micro-Sites',
        icon: <Layers className="w-4 h-4 text-[#a855f7]" />,
        tagline: 'Vector mascots, social meme overlays, ZIP exports, and instant web hubs',
        faqs: rawFaqs.filter((f) => f.category === 'Meme Studio, Brand Assets & Micro-Sites'),
      },
      {
        name: 'Tokenomics & Creator Revenue',
        icon: <TrendingUp className="w-4 h-4 text-[#ccff00]" />,
        tagline: 'Zero-dump creator treasury streams, holder fee streaming, and 100% LP burn',
        faqs: rawFaqs.filter((f) => f.category === 'Tokenomics & Creator Revenue'),
      },
      {
        name: 'Security, Non-Custodial Architecture & Risk',
        icon: <ShieldCheck className="w-4 h-4 text-[#ff5722]" />,
        tagline: 'Non-custodial key isolation, authority revocations, and risk disclosures',
        faqs: rawFaqs.filter((f) => f.category === 'Security, Non-Custodial Architecture & Risk'),
      },
    ];
  }, []);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const toggleQuestion = (questionId: string) => {
    setOpenQuestionId((prev) => (prev === questionId ? null : questionId));
  };

  const expandAllGroups = () => {
    const allExpanded: Record<string, boolean> = {};
    categoryGroups.forEach((g) => {
      allExpanded[g.name] = true;
    });
    setExpandedGroups(allExpanded);
  };

  const collapseAllGroups = () => {
    const allCollapsed: Record<string, boolean> = {};
    categoryGroups.forEach((g) => {
      allCollapsed[g.name] = false;
    });
    setExpandedGroups(allCollapsed);
    setOpenQuestionId(null);
  };

  return (
    <section id="faq-section" className="py-10 sm:py-14 border-b border-[#2d3139] w-full max-w-full overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Section Title & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00f5ff] uppercase tracking-widest font-bold">
              <HelpCircle className="w-3.5 h-3.5 text-[#00f5ff]" />
              User Guide &amp; Knowledge Base
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#8e99ac] font-sans leading-relaxed">
              Step-by-step instructions for funding your wallet, creating tokens, downloading marketing assets, and navigating protocol mechanics.
            </p>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={expandAllGroups}
              className="px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1f2538] border border-[#2a3449] text-[#8e99ac] hover:text-white text-[11px] font-mono transition-colors cursor-pointer"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAllGroups}
              className="px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1f2538] border border-[#2a3449] text-[#8e99ac] hover:text-white text-[11px] font-mono transition-colors cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Grouped Accordion Categories */}
        <div className="space-y-4">
          {categoryGroups.map((group) => {
            const isGroupExpanded = !!expandedGroups[group.name];
            return (
              <div
                key={group.name}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isGroupExpanded
                    ? 'bg-[#0b0e15] border-[#252f44] shadow-lg shadow-black/40'
                    : 'bg-[#080b11] border-[#1a2130] hover:border-[#2a3449]'
                }`}
              >
                {/* Group Header Button */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.name)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none transition-colors select-none"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                        isGroupExpanded
                          ? 'bg-[#121826] border-[#00f5ff]/40 shadow-[0_0_12px_rgba(0,245,255,0.15)]'
                          : 'bg-[#0d121c] border-[#1e2738]'
                      }`}
                    >
                      {group.icon}
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-black text-white font-sans tracking-tight">
                          {group.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#161d2d] border border-[#26334d] text-[10px] font-mono text-[#8e99ac]">
                          {group.faqs.length} questions
                        </span>
                      </div>
                      <p className="text-xs text-[#8e99ac] truncate hidden sm:block">
                        {group.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-mono text-[#8e99ac] hidden sm:inline">
                      {isGroupExpanded ? 'Collapse Group' : 'Expand Group'}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-lg bg-[#141a27] border border-[#242f44] flex items-center justify-center transition-transform duration-200 ${
                        isGroupExpanded ? 'rotate-180 border-[#00f5ff]/50 text-[#00f5ff]' : 'text-[#8e99ac]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Sub-items (Individual Questions within the Group) */}
                {isGroupExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 space-y-2.5 border-t border-[#1a2333]/80 animate-fadeIn">
                    {group.faqs.map((faq) => {
                      const isQuestionOpen = openQuestionId === faq.id;
                      return (
                        <div
                          key={faq.id}
                          className={`rounded-xl border transition-all overflow-hidden ${
                            isQuestionOpen
                              ? 'bg-[#101520] border-[#00f5ff]/50 shadow-[0_0_15px_rgba(0,245,255,0.06)]'
                              : 'bg-[#0d111a] border-[#1b2332] hover:border-[#28344c]'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleQuestion(faq.id)}
                            className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 cursor-pointer focus:outline-none"
                          >
                            <span className="text-xs sm:text-sm font-bold text-white font-sans leading-snug">
                              {faq.question}
                            </span>
                            <div
                              className={`w-6 h-6 rounded-md bg-[#161d2a] border border-[#26334a] flex items-center justify-center shrink-0 transition-transform ${
                                isQuestionOpen ? 'rotate-180 border-[#00f5ff] text-[#00f5ff]' : 'text-[#8e99ac]'
                              }`}
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </div>
                          </button>

                          {isQuestionOpen && (
                            <div className="px-3.5 sm:px-4 pb-4 pt-0 text-xs sm:text-sm leading-relaxed text-[#8e99ac] font-sans border-t border-[#1e283b]/60 animate-fadeIn">
                              <div className="pt-2 text-[#cbd5e1]">{faq.answer}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};


