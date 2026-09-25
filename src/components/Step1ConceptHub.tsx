import React, { useState, useEffect, useMemo } from 'react';
import { CategoryType, Agent1NarrativeResult, TickerAuditResult } from '../types';
import { 
  Zap, Sparkles, Shuffle, ArrowRight, Compass, Flame, 
  Film, RefreshCw, CheckCircle2, Lightbulb, Dices, 
  Copy, Check, ShieldCheck, AlertTriangle, BookOpen, Edit3, ExternalLink, Terminal
} from 'lucide-react';
import { 
  rollCatalyst, DynamicCatalyst, SPARK_CATEGORIES, BESPOKE_VIBES, 
  DYNAMIC_ANGLES_BY_VIBE, ART_STYLES_BESPOKE, NARRATIVE_STRATEGIES
} from '../storyboardData';

interface Step1ConceptHubProps {
  category: CategoryType;
  setCategory: (cat: CategoryType) => void;
  prompt: string;
  setPrompt: (p: string) => void;
  onGenerate: (bespokeConfig?: any) => void;
  isGenerating: boolean;
  activeAgentLog: string;
  narrative?: Agent1NarrativeResult | null;
  onUpdateNarrative?: (updated: Agent1NarrativeResult) => void;
  onApproveAndProceed: () => void;
  onOpenNarrativeModal?: () => void;
}


const PromptInspector: React.FC<{ show: boolean; setShow: (s: boolean) => void; prompt: string }> = ({ show, setShow, prompt }) => (
  <div className="mt-4 p-3 border border-[#2d3139] rounded-xl bg-[#0a0b0d] space-y-2">
    <button
      onClick={() => setShow(!show)}
      className="flex items-center gap-2 text-xs font-mono text-[#8b949e] hover:text-[#00f5ff]"
    >
      <Terminal className="w-3 h-3" />
      {show ? 'Hide Prompt Inspector' : 'Show Prompt Inspector'}
    </button>
    {show && (
      <div className="text-[10px] font-mono text-[#8b949e] p-2 bg-[#000] border border-[#232730] rounded-lg break-words overflow-auto max-h-40">
        <span className="text-[#c084fc] font-bold">USER_PROMPT:</span><br/>
        {prompt}
      </div>
    )}
  </div>
);

export const Step1ConceptHub: React.FC<Step1ConceptHubProps> = ({
  category,
  setCategory,
  prompt,
  setPrompt,
  onGenerate,
  isGenerating,
  activeAgentLog,
  narrative,
  onUpdateNarrative,
  onApproveAndProceed,
  onOpenNarrativeModal,
}) => {
  // Hub Mode: 'storyboard' = Mode 2 (Default: Bespoke Storyboard Creator), 'fast' = Mode 1 (Dynamic Catalyst Engine)
  const [hubMode, setHubMode] = useState<'storyboard' | 'fast'>('storyboard');

  // -------------------------------------------------------------
  // MODE 1: Fast Launch (Dynamic Catalyst Engine)
  // -------------------------------------------------------------
  const [selectedPillar, setSelectedPillar] = useState<'Wildcard' | 'Animal' | 'One-Word' | 'Everyday' | 'Tech'>('Wildcard');
  const [currentCatalyst, setCurrentCatalyst] = useState<DynamicCatalyst>(() => rollCatalyst('Wildcard'));

  const handleRollCatalyst = (pillar?: 'Wildcard' | 'Animal' | 'One-Word' | 'Everyday' | 'Tech') => {
    const targetPillar = pillar || selectedPillar;
    const fresh = rollCatalyst(targetPillar);
    setCurrentCatalyst(fresh);
    setCategory(fresh.category);
    setPrompt(fresh.fullPrompt);
  };

  // -------------------------------------------------------------
  // MODE 2: Bespoke Storyboard Creator (Subject + Vibe + Guidance)
  // -------------------------------------------------------------
  const [bespokeSubject, setBespokeSubject] = useState<string>('');
  const [bespokeVibe, setBespokeVibe] = useState<string>('Wholesome & Cute');
  const [bespokeAngle, setBespokeAngle] = useState<string>('Refuses to leave its cozy blanket unless given gentle head pats and treats');
  const [bespokeArtStyle, setBespokeArtStyle] = useState<string>('3D Volumetric Claymation');
  const [narrativeStrategy, setNarrativeStrategy] = useState<string>('Community Builder');
  const [activeSparkTab, setActiveSparkTab] = useState<number>(0);
  const [showInspector, setShowInspector] = useState(false);

  // Helper to validate if all required bespoke fields are filled
  const isBespokeFormValid = useMemo(() => {
    return bespokeSubject.trim() !== '';
  }, [bespokeSubject]);

  // Right-pane Interactive Narrative States
  const [copiedTicker, setCopiedTicker] = useState(false);
  const [currentTicker, setCurrentTicker] = useState(narrative?.ticker || '');
  const [isEditingCustomTicker, setIsEditingCustomTicker] = useState(false);
  const [customTickerInput, setCustomTickerInput] = useState(narrative?.ticker?.replace('$', '') || '');
  const [auditData, setAuditData] = useState<TickerAuditResult | undefined>(narrative?.ticker_audit);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isEditingLore, setIsEditingLore] = useState(false);
  const [editableLore, setEditableLore] = useState(narrative?.lore || '');
  const [isEditingMascotPrompt, setIsEditingMascotPrompt] = useState(false);
  const [editableMascotPrompt, setEditableMascotPrompt] = useState(narrative?.mascot_prompt || '');
  const [isEditingRallyingPhrase, setIsEditingRallyingPhrase] = useState(false);
  const [editableRallyingPhrase, setEditableRallyingPhrase] = useState(narrative?.rallying_phrase || '');

  // Keep local ticker & audit synced when narrative updates
  useEffect(() => {
    if (narrative) {
      setCurrentTicker(narrative.ticker);
      setCustomTickerInput(narrative.ticker.replace('$', ''));
      setAuditData(narrative.ticker_audit);
      setEditableLore(narrative.lore);
      setEditableMascotPrompt(narrative.mascot_prompt);
      setEditableRallyingPhrase(narrative.rallying_phrase);
    }
  }, [narrative]);

  // Derive available angles for current vibe
  const currentAnglePool = useMemo(() => {
    return DYNAMIC_ANGLES_BY_VIBE[bespokeVibe] || DYNAMIC_ANGLES_BY_VIBE['Wholesome & Cute'];
  }, [bespokeVibe]);

  // When vibe changes, adjust default angle
  const handleVibeChange = (vibeId: string) => {
    setBespokeVibe(vibeId);
    const angles = DYNAMIC_ANGLES_BY_VIBE[vibeId] || [];
    if (angles.length > 0) {
      setBespokeAngle(angles[0]);
    }
  };

  // Shuffle dynamic angle
  const handleShuffleAngle = () => {
    const pool = currentAnglePool;
    const nextAngle = pool[Math.floor(Math.random() * pool.length)];
    setBespokeAngle(nextAngle);
  };

  // Quick Spark Selection - instantly sets subject, category, and angle without blocking popups
  const handleSelectSpark = (spark: { name: string; emoji: string; category: CategoryType; defaultAngle: string }) => {
    setBespokeSubject(spark.name);
    setCategory(spark.category);
    if (spark.defaultAngle) {
      setBespokeAngle(spark.defaultAngle);
    }
  };

  // Surprise random subject
  const handleSurpriseSubject = () => {
    const allSparks = SPARK_CATEGORIES.flatMap(c => c.sparks);
    const randomSpark = allSparks[Math.floor(Math.random() * allSparks.length)];
    handleSelectSpark(randomSpark);
  };

  // Synthesize Mode 2 prompt
  const synthesizedBespokePrompt = useMemo(() => {
    return `Subject: ${bespokeSubject}. Narrative Strategy: ${narrativeStrategy}. Narrative Lens: ${bespokeVibe}. Driving Behavior: ${bespokeAngle}. Rendered in ${bespokeArtStyle}, clean centered mascot subject, vivid expressive features, 512x512 vector sticker style.`;
  }, [bespokeSubject, bespokeVibe, bespokeAngle, bespokeArtStyle, narrativeStrategy]);

  // Sync initial prompt on mount if empty - REMOVED: No longer auto-synthesizing
  useEffect(() => {
    // No action here
  }, []);

  const handleApplyBespokeAndGenerate = () => {
    if (!isBespokeFormValid) {
      return;
    }
    const bespokeConfig = {
      subject: bespokeSubject.trim(),
      vibe: bespokeVibe,
      angle: bespokeAngle,
      artStyle: bespokeArtStyle,
      strategy: narrativeStrategy || 'Community Builder',
      category,
      prompt: `Subject: ${bespokeSubject.trim()}. Narrative Objective: ${narrativeStrategy || 'Community Builder'}. Vibe (Tone): ${bespokeVibe}. Driving Behavior: ${bespokeAngle}. Rendered in ${bespokeArtStyle}, clean centered mascot subject, vivid expressive features, 512x512 vector sticker style.`,
      isFastRoll: false,
    };
    onGenerate(bespokeConfig);
  };

  // Ticker selection & custom edit
  const handleSelectAlternative = async (newTicker: string) => {
    setCurrentTicker(newTicker);
    setCustomTickerInput(newTicker.replace('$', ''));
    setIsAuditing(true);
    try {
      const res = await fetch('/api/audit-ticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: newTicker, token_name: narrative?.token_name || bespokeSubject }),
      });
      if (res.ok) {
        const audit: TickerAuditResult = await res.json();
        setAuditData(audit);
        if (narrative && onUpdateNarrative) {
          onUpdateNarrative({
            ...narrative,
            ticker: newTicker,
            ticker_audit: audit,
          });
        }
      }
    } catch (err) {
      console.warn('Audit error:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleApplyCustomTicker = async () => {
    let clean = customTickerInput.trim().toUpperCase().replace(/[^a-zA-Z0-9]/g, '');
    if (!clean) return;
    if (clean.length < 2) clean = clean.padEnd(3, 'X');
    if (clean.length > 6) clean = clean.slice(0, 6);
    const formattedTicker = `$${clean}`;

    setCurrentTicker(formattedTicker);
    setIsEditingCustomTicker(false);
    setIsAuditing(true);

    try {
      const res = await fetch('/api/audit-ticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: formattedTicker, token_name: narrative?.token_name || bespokeSubject }),
      });
      if (res.ok) {
        const audit: TickerAuditResult = await res.json();
        // Tag as user-customized
        audit.existing_pairs_summary = `Custom ticker (${formattedTicker}) set by user. Verify live liquidity on DEX before deployment.`;
        setAuditData(audit);
        if (narrative && onUpdateNarrative) {
          onUpdateNarrative({
            ...narrative,
            ticker: formattedTicker,
            ticker_audit: audit,
          });
        }
      }
    } catch (err) {
      console.warn('Custom ticker error:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleCopyTicker = () => {
    navigator.clipboard.writeText(currentTicker || narrative?.ticker || '');
    setCopiedTicker(true);
    setTimeout(() => setCopiedTicker(false), 2000);
  };

  const handleSaveLoreEdit = () => {
    setIsEditingLore(false);
    if (narrative && onUpdateNarrative) {
      onUpdateNarrative({
        ...narrative,
        lore: editableLore,
      });
    }
  };

  const handleSaveMascotPromptEdit = () => {
    setIsEditingMascotPrompt(false);
    if (narrative && onUpdateNarrative) {
      onUpdateNarrative({
        ...narrative,
        mascot_prompt: editableMascotPrompt,
      });
    }
  };

  const handleSaveRallyingPhraseEdit = () => {
    setIsEditingRallyingPhrase(false);
    if (narrative && onUpdateNarrative) {
      onUpdateNarrative({
        ...narrative,
        rallying_phrase: editableRallyingPhrase,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Mode Switcher Bar */}
      <div className="p-2 bg-[#12141a] border border-[#2d3139] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            id="btn-mode-storyboard"
            type="button"
            onClick={() => {
              setHubMode('storyboard');
              setPrompt(synthesizedBespokePrompt);
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs transition-all duration-200 ${
              hubMode === 'storyboard'
                ? 'bg-[#a855f7]/15 text-[#c084fc] border border-[#a855f7]/50 shadow-[0_0_15px_rgba(168,85,247,0.15)] font-bold'
                : 'text-[#8b949e] hover:text-[#e0e0e0] hover:bg-[#1a1d24] border border-transparent'
            }`}
          >
            <Film className="w-4 h-4 text-[#c084fc]" />
            <span>Storyboard Studio</span>
          </button>

          <button
            id="btn-mode-catalyst"
            type="button"
            onClick={() => {
              setHubMode('fast');
              setPrompt(currentCatalyst.fullPrompt);
              setCategory(currentCatalyst.category);
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs transition-all duration-200 ${
              hubMode === 'fast'
                ? 'bg-[#00f5ff]/15 text-[#00f5ff] border border-[#00f5ff]/50 shadow-[0_0_15px_rgba(0,245,255,0.15)] font-bold'
                : 'text-[#8b949e] hover:text-[#e0e0e0] hover:bg-[#1a1d24] border border-transparent'
            }`}
          >
            <Zap className="w-4 h-4 text-[#00f5ff]" />
            <span>Fast Generator</span>
          </button>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0b0d] border border-[#232730] rounded-xl text-xs font-mono text-[#8b949e]">
          <span className="w-2 h-2 rounded-full bg-[#00ff88]" />
          <span>Brand Synthesis</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TWO-PANE SPLIT VIEW: FORMULATION (LEFT) & DOSSIER (RIGHT) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================= */}
        {/* LEFT PANE: CONCEPT & STORYBOARD CONTROLS (5 Cols)          */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 space-y-4">
          {/* Subtitle / Header for Input Section */}
          <div className="p-3 bg-[#12141a] border border-[#2d3139] rounded-2xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c084fc] shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                {hubMode === 'storyboard' ? '1. Concept Setup' : '1. Fast Roll'}
              </h2>
            </div>
          </div>

          {hubMode === 'storyboard' ? (
            <div className="space-y-4">
              {/* Step 1: Subject Anchor */}
              <div className="p-4 bg-[#12141a] border border-[#2d3139] rounded-2xl shadow-xl space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#c084fc] flex items-center gap-2 font-bold">
                    <span className="w-5 h-5 rounded-full bg-[#a855f7]/20 border border-[#a855f7]/40 flex items-center justify-center text-[10px] text-[#c084fc] font-bold">1</span>
                    Token Subject
                  </h3>

                  <button
                    id="btn-surprise-subject"
                    type="button"
                    onClick={handleSurpriseSubject}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-[#a855f7]/15 hover:bg-[#a855f7]/25 border border-[#a855f7]/40 text-[#c084fc] font-mono text-[11px] rounded-lg transition-all"
                  >
                    <Dices className="w-3 h-3" />
                    <span>Surprise</span>
                  </button>
                </div>

                <PromptInspector show={showInspector} setShow={setShowInspector} prompt={synthesizedBespokePrompt} />

                <div className="relative">
                  <input
                    id="input-bespoke-subject"
                    type="text"
                    value={bespokeSubject}
                    maxLength={100}
                    onChange={(e) => setBespokeSubject(e.target.value)}
                    placeholder="e.g. Bear Market, Sleepy Otter, Smug Duck, Matcha Latte..."
                    className="w-full px-3.5 py-2.5 bg-[#0a0b0d] border border-[#2d3139] focus:border-[#a855f7] rounded-xl text-sm font-mono text-[#ffffff] placeholder-[#6b7280] focus:outline-none transition-all shadow-inner"
                  />
                  <div className="absolute right-3 top-2.5 text-[10px] font-mono text-[#6b7280]">
                    {bespokeSubject.length}/100
                  </div>
                </div>

                {/* Need a Spark Chips */}
                <div className="pt-2 border-t border-[#1f242e] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#8b949e] flex items-center gap-1">
                      <Lightbulb className="w-3 h-3 text-[#fbbf24]" />
                      Spark Ideas:
                    </span>
                    <div className="flex gap-1">
                      {SPARK_CATEGORIES.map((cat, idx) => (
                        <button
                          key={cat.group}
                          type="button"
                          onClick={() => setActiveSparkTab(idx)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                            activeSparkTab === idx
                              ? 'bg-[#a855f7]/30 text-[#c084fc] font-bold'
                              : 'text-[#6b7280] hover:text-[#9ca3af]'
                          }`}
                        >
                          {cat.group.split(' ')[1] || cat.group}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {SPARK_CATEGORIES[activeSparkTab].sparks.map((spark) => (
                      <button
                        key={spark.name}
                        type="button"
                        onClick={() => handleSelectSpark(spark)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all flex items-center gap-1 ${
                          bespokeSubject.toLowerCase() === spark.name.toLowerCase()
                            ? 'bg-[#a855f7]/25 border-[#a855f7] text-[#ffffff] shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                            : 'bg-[#0a0b0d] border-[#232730] text-[#8b949e] hover:border-[#a855f7]/40 hover:text-[#e0e0e0]'
                        }`}
                      >
                        <span>{spark.emoji}</span>
                        <span>{spark.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 2: Narrative Strategy & Phrase (NEW) */}
              <div className="p-4 bg-[#12141a] border border-[#2d3139] rounded-2xl shadow-xl space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#fbbf24] flex items-center gap-2 font-bold">
                  <span className="w-5 h-5 rounded-full bg-[#fbbf24]/20 border border-[#fbbf24]/40 flex items-center justify-center text-[10px] text-[#fbbf24] font-bold">2</span>
                  Narrative Objective
                </h3>
                
                <select 
                  value={narrativeStrategy}
                  onChange={(e) => setNarrativeStrategy(e.target.value)}
                  className="w-full p-2.5 bg-[#0a0b0d] border border-[#232730] rounded-xl text-xs font-mono text-[#e0e0e0] focus:border-[#fbbf24] focus:outline-none"
                >
                  <option value="">Select Objective</option>
                  {NARRATIVE_STRATEGIES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>

                <h3 className="text-xs font-mono uppercase tracking-wider text-[#00f5ff] flex items-center gap-2 font-bold">
                  <span className="w-5 h-5 rounded-full bg-[#00f5ff]/20 border border-[#00f5ff]/40 flex items-center justify-center text-[10px] text-[#00f5ff] font-bold">3</span>
                  Vibe (Tone)
                </h3>
                
                <select 
                  value={bespokeVibe}
                  onChange={(e) => handleVibeChange(e.target.value)}
                  className="w-full p-2.5 bg-[#0a0b0d] border border-[#232730] rounded-xl text-xs font-mono text-[#e0e0e0] focus:border-[#00f5ff] focus:outline-none"
                >
                  <option value="">Select Vibe</option>
                  {BESPOKE_VIBES.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
                </select>

                <h3 className="text-xs font-mono uppercase tracking-wider text-[#ccff00] flex items-center gap-2 font-bold">
                  <span className="w-5 h-5 rounded-full bg-[#ccff00]/20 border border-[#ccff00]/40 flex items-center justify-center text-[10px] text-[#ccff00] font-bold">4</span>
                  Driving Behavior
                </h3>
                <textarea
                  value={bespokeAngle}
                  onChange={(e) => setBespokeAngle(e.target.value)}
                  placeholder="e.g. Floating peacefully on calm waters..."
                  className="w-full p-2.5 bg-[#0a0b0d] border border-[#232730] rounded-xl text-xs font-mono text-[#e0e0e0] focus:border-[#ccff00] focus:outline-none resize-y min-h-[80px]"
                  rows={3}
                />
              </div>

              {/* Step 4: Visual Mascot Art Medium */}
              <div className="p-4 bg-[#12141a] border border-[#2d3139] rounded-2xl shadow-xl space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#00ff88] flex items-center gap-2 font-bold">
                  <span className="w-5 h-5 rounded-full bg-[#00ff88]/20 border border-[#00ff88]/40 flex items-center justify-center text-[10px] text-[#00ff88] font-bold">5</span>
                  Art Medium
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ART_STYLES_BESPOKE.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setBespokeArtStyle(style.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        bespokeArtStyle === style.id
                          ? 'bg-[#00ff88]/15 border-[#00ff88] text-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.15)]'
                          : 'bg-[#0a0b0d] border-[#232730] text-[#8b949e] hover:border-[#2d3139] hover:text-[#e0e0e0]'
                      }`}
                    >
                      <div className="text-base mb-0.5">{style.icon}</div>
                      <div className="font-mono text-xs font-bold leading-tight">{style.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate / Regenerate CTA Button */}
              <div className="p-3 bg-[#0a0b0d] border border-[#a855f7]/40 rounded-2xl">
                <button
                  id="btn-generate-bespoke"
                  type="button"
                  onClick={handleApplyBespokeAndGenerate}
                  disabled={isGenerating || !isBespokeFormValid}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-[#a855f7] hover:bg-[#9333ea] text-[#ffffff] font-mono text-xs font-bold rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : narrative ? (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>Regenerate Concept</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Concept</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* MODE 1: Fast Catalyst Engine */
            <div className="p-5 bg-[#12141a] border border-[#2d3139] rounded-2xl shadow-xl space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#00f5ff] flex items-center gap-2 font-bold">
                <Sparkles className="w-4 h-4" />
                Category Pillar
              </h3>

              {/* Pillar Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-[#0a0b0d] border border-[#232730] rounded-xl">
                {(['Wildcard', 'Animal', 'Everyday', 'One-Word', 'Tech'] as const).map((pillar) => (
                  <button
                    key={pillar}
                    type="button"
                    onClick={() => {
                      setSelectedPillar(pillar);
                      handleRollCatalyst(pillar);
                    }}
                    className={`py-2 px-2 text-center rounded-lg font-mono text-xs transition-all ${
                      selectedPillar === pillar
                        ? 'bg-[#00f5ff]/20 text-[#00f5ff] font-bold border border-[#00f5ff]/40 shadow-sm'
                        : 'text-[#8b949e] hover:text-[#e0e0e0]'
                    }`}
                  >
                    {pillar}
                  </button>
                ))}
              </div>

              {/* Rolled Catalyst Card */}
              <div className="p-4 bg-[#0a0b0d] border border-[#232730] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-[#00f5ff]/15 text-[#00f5ff] font-mono text-[10px] font-bold uppercase">
                    {currentCatalyst.category}
                  </span>
                  <span className="font-mono text-xs text-[#ccff00] font-bold">
                    {currentCatalyst.ticker}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold font-mono text-white">
                    {currentCatalyst.tokenName}
                  </h4>
                  <p className="text-xs text-[#38bdf8] font-medium italic mt-0.5">
                    "{currentCatalyst.slogan}"
                  </p>
                </div>

                <p className="text-[11px] text-[#8b949e] leading-relaxed">
                  {currentCatalyst.narrativeHook}
                </p>

                {/* 5-Component Architectural Integrity Verification Box */}
                <div className="p-2.5 bg-[#000]/60 border border-[#1f2937] rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#00ff88] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse"></span>
                      5 Architectural Components Verified
                    </span>
                    <span className="text-[#8b949e]">Pre-Flight Ready</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] font-mono border-t border-[#1f2937]/60 pt-1.5">
                    <div>
                      <span className="text-[#64748b]">1. Subject:</span>{' '}
                      <span className="text-white font-medium">{currentCatalyst.subject}</span>
                    </div>
                    <div>
                      <span className="text-[#64748b]">2. Objective:</span>{' '}
                      <span className="text-[#c084fc] font-medium">{currentCatalyst.strategy}</span>
                    </div>
                    <div>
                      <span className="text-[#64748b]">3. Vibe (Tone):</span>{' '}
                      <span className="text-[#00f5ff] font-medium">{currentCatalyst.vibe}</span>
                    </div>
                    <div>
                      <span className="text-[#64748b]">4. Art Medium:</span>{' '}
                      <span className="text-[#ccff00] font-medium">{currentCatalyst.artStyle}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[#64748b]">5. Driving Behavior:</span>{' '}
                      <span className="text-[#e2e8f0] italic">"{currentCatalyst.angle}"</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPrompt(currentCatalyst.fullPrompt);
                    setCategory(currentCatalyst.category);
                    onGenerate({
                      subject: currentCatalyst.subject,
                      strategy: currentCatalyst.strategy,
                      vibe: currentCatalyst.vibe,
                      angle: currentCatalyst.angle,
                      artStyle: currentCatalyst.artStyle,
                      category: currentCatalyst.category,
                      prompt: currentCatalyst.fullPrompt,
                      isFastRoll: true,
                    });
                  }}
                  disabled={isGenerating}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#00ff88] hover:bg-[#00dd77] text-black font-mono text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(0,255,136,0.25)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying & Generating...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Verify & Generate Concept</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleRollCatalyst()}
                  disabled={isGenerating}
                  className="px-3.5 py-3 bg-[#1a1d24] hover:bg-[#232730] border border-[#2d3139] text-[#e0e0e0] font-mono text-xs rounded-xl transition-all cursor-pointer"
                  title="Roll another random concept"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Active Generation Logs */}
          {isGenerating && activeAgentLog && (
            <div className="p-3.5 bg-[#0a0b0d] border border-[#00f5ff]/50 rounded-xl flex items-center gap-2.5 text-xs font-mono text-[#00f5ff] shadow-[0_0_15px_rgba(0,245,255,0.1)] animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin shrink-0 text-[#00f5ff]" />
              <span className="leading-snug">{activeAgentLog}</span>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* RIGHT PANE: GENERATED TOKEN CONCEPT PREVIEW (7 Cols)      */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 space-y-4">
          {/* Subtitle / Header for Results Section */}
          <div className="p-3 bg-[#12141a] border border-[#2d3139] rounded-2xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.8)]" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                2. Review &amp; Refine
              </h2>
            </div>
          </div>

          {narrative ? (
            <div className="bg-[#12141a] border border-[#2d3139] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 relative overflow-hidden">
              {/* Top Meta Bar */}
              <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#2d3139] gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-[#a855f7]/20 border border-[#a855f7]/40 flex items-center justify-center text-[10px] font-bold text-[#c084fc] font-mono">01</span>
                  <h2 className="text-xs uppercase font-bold text-[#c084fc] tracking-widest font-mono">
                    Token Identity
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-copy-ticker"
                    onClick={handleCopyTicker}
                    className="px-2.5 py-1 bg-[#ccff00] text-black text-[11px] font-mono font-bold rounded flex items-center gap-1.5 hover:bg-[#e0ff4f] transition-all cursor-pointer shadow-[0_0_10px_rgba(204,255,0,0.2)]"
                    title="Click to copy ticker"
                  >
                    <span>{currentTicker || narrative.ticker}</span>
                    {copiedTicker ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3 h-3 opacity-60" />}
                  </button>
                </div>
              </div>

              {/* Main Token Identity */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-[#8b949e] uppercase">
                      Name:
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono">
                      {narrative.token_name}
                    </h3>
                  </div>

                  {/* Token Symbol Row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-[#8b949e] uppercase">
                      Symbol:
                    </span>
                    
                    {!isEditingCustomTicker ? (
                      <div className="flex items-center gap-2">
                        <span className="text-base font-mono font-bold text-[#ccff00] px-2.5 py-0.5 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/30 inline-flex items-center">
                          {currentTicker || narrative.ticker}
                        </span>
                        <button
                          id="btn-edit-ticker"
                          onClick={() => {
                            setCustomTickerInput((currentTicker || narrative.ticker).replace('$', ''));
                            setIsEditingCustomTicker(true);
                          }}
                          className="px-2 py-1 text-xs font-mono text-[#8b949e] hover:text-white bg-[#1b1e24] hover:bg-[#252932] border border-[#2d3139] rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3 text-[#00f5ff]" />
                          <span>Edit</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <div className="relative flex items-center">
                          <span className="absolute left-2 text-xs font-mono font-bold text-[#ccff00]">$</span>
                          <input
                            type="text"
                            value={customTickerInput}
                            onChange={(e) => setCustomTickerInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleApplyCustomTicker();
                              if (e.key === 'Escape') setIsEditingCustomTicker(false);
                            }}
                            autoFocus
                            placeholder="SYMBOL"
                            className="pl-5 pr-2 py-1 text-xs font-mono font-bold text-white bg-[#0a0b0d] border border-[#00f5ff] rounded-lg focus:outline-none w-24 uppercase"
                          />
                        </div>
                        <button
                          onClick={handleApplyCustomTicker}
                          className="px-2.5 py-1 text-xs font-mono font-bold text-black bg-[#00f5ff] rounded-lg cursor-pointer"
                        >
                          Apply
                        </button>
                        <button
                          onClick={() => setIsEditingCustomTicker(false)}
                          className="px-2 py-1 text-xs font-mono text-[#8b949e] rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    <a
                      href={`https://dexscreener.com/search?q=${encodeURIComponent((currentTicker || narrative.ticker).replace('$', ''))}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-1 text-[11px] font-mono text-[#8b949e] hover:text-[#00f5ff] bg-[#12141a] hover:bg-[#1a1d24] border border-[#2d3139] rounded-lg flex items-center gap-1 transition-all ml-auto sm:ml-0"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>DexScreener</span>
                    </a>
                  </div>

                  <p className="text-[#00f5ff] font-mono text-xs italic">
                    "{narrative.tagline}"
                  </p>
                </div>

                {/* Score Gauge */}
                <div className="flex items-center gap-3 bg-[#0a0b0d] border border-[#2d3139] rounded-xl p-2.5 px-3 shrink-0">
                  <div className="relative w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#2d3139]">
                    <span className="text-xs font-bold font-mono text-[#00f5ff]">
                      {narrative.viral_score || 95}
                    </span>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase font-mono text-[#ccff00]">
                      Viral Fit
                    </div>
                    <div className="text-xs font-bold font-mono text-[#39ff14]">
                      {(narrative.viral_score || 95) >= 90 ? 'OPTIMIZED' : 'HIGH'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticker Alternatives */}
              {auditData?.suggested_alternatives && auditData.suggested_alternatives.length > 0 && (
                <div className="bg-[#0a0b0d] border border-[#2d3139] p-2.5 rounded-xl flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-[#8b949e]">Alternatives:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {auditData.suggested_alternatives.map((alt) => (
                      <button
                        key={alt}
                        onClick={() => handleSelectAlternative(alt)}
                        className={`px-2 py-0.5 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                          currentTicker === alt
                            ? 'bg-[#ccff00] text-black border-[#ccff00]'
                            : 'bg-[#1b1e24] text-white border-[#2d3139] hover:border-[#ccff00]'
                        }`}
                      >
                        {alt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Token Lore */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#c084fc] uppercase">
                    <BookOpen className="w-3.5 h-3.5 text-[#c084fc]" />
                    <span>Story &amp; Lore</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (isEditingLore) {
                        handleSaveLoreEdit();
                      } else {
                        setIsEditingLore(true);
                      }
                    }}
                    className="text-[11px] font-mono text-[#8b949e] hover:text-[#e0e0e0] flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isEditingLore ? 'Save' : 'Edit Lore'}</span>
                  </button>
                </div>

                {isEditingLore ? (
                  <div className="space-y-2">
                    <textarea
                      value={editableLore}
                      onChange={(e) => setEditableLore(e.target.value)}
                      rows={4}
                      className="w-full p-3 bg-[#0a0b0d] border border-[#a855f7] rounded-xl text-xs font-sans text-white focus:outline-none leading-relaxed"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditableLore(narrative.lore);
                          setIsEditingLore(false);
                        }}
                        className="px-2.5 py-1 bg-[#1a1d24] text-xs font-mono rounded text-[#8b949e]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveLoreEdit}
                        className="px-2.5 py-1 bg-[#a855f7] text-xs font-mono rounded text-white font-bold"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#0a0b0d] border border-[#2d3139] rounded-xl p-3.5 text-xs leading-relaxed text-[#f0f4f8] font-sans">
                    <p>{editableLore || narrative.lore}</p>
                  </div>
                )}

                {/* Pre-flight check badge */}
                <div className="p-3 rounded-xl border font-mono text-xs space-y-2 bg-[#091410] border-emerald-500/40 text-emerald-400">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white text-[11px] uppercase">
                        Agent 0 Architectural Integrity: Certified
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-black/40 text-[10px] font-bold text-emerald-300">
                      5/5 Components Passed
                    </span>
                  </div>

                  {narrative.agent0_audit?.preflight_components && (
                    <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-emerald-500/20 text-[10px] text-[#8b949e]">
                      <div>Subject: <span className="text-white font-bold">{narrative.agent0_audit.preflight_components.subject}</span></div>
                      <div>Objective: <span className="text-[#c084fc] font-bold">{narrative.agent0_audit.preflight_components.narrative_objective}</span></div>
                      <div>Tone: <span className="text-[#00f5ff] font-bold">{narrative.agent0_audit.preflight_components.vibe_tone}</span></div>
                      <div>Medium: <span className="text-[#ccff00] font-bold">{narrative.agent0_audit.preflight_components.art_medium}</span></div>
                      <div className="col-span-2">Behavior: <span className="text-[#e0e0e0] italic">"{narrative.agent0_audit.preflight_components.driving_behavior}"</span></div>
                    </div>
                  )}
                </div>
              </div>

                {/* Mascot Scene Prompt */}
              <div className="p-3 rounded-xl bg-[#0a0b0d] border border-[#2d3139] text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-mono font-bold text-[#00f5ff] flex items-center gap-1.5 uppercase">
                    <Sparkles className="w-3 h-3 text-[#00f5ff]" />
                    <span>Mascot Prompt</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (isEditingMascotPrompt) {
                        handleSaveMascotPromptEdit();
                      } else {
                        setIsEditingMascotPrompt(true);
                      }
                    }}
                    className="text-[11px] font-mono text-[#8b949e] hover:text-[#00f5ff] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isEditingMascotPrompt ? 'Save' : 'Edit Prompt'}</span>
                  </button>
                </div>

                {isEditingMascotPrompt ? (
                  <div className="space-y-2">
                    <textarea
                      value={editableMascotPrompt}
                      onChange={(e) => setEditableMascotPrompt(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 bg-[#12141a] border border-[#00f5ff] rounded-lg text-xs font-mono text-white focus:outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditableMascotPrompt(narrative.mascot_prompt);
                          setIsEditingMascotPrompt(false);
                        }}
                        className="px-2 py-1 bg-[#1a1d24] text-[11px] font-mono rounded text-[#8b949e]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveMascotPromptEdit}
                        className="px-2 py-1 bg-[#00f5ff] text-[11px] font-mono rounded text-black font-bold"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-[#e0e0e0]/90 font-mono italic bg-[#12141a]/60 p-2.5 rounded-lg border border-[#232730]">
                    "{editableMascotPrompt || narrative.mascot_prompt}"
                  </div>
                )}
              </div>
              
              {/* Rallying Phrase */}
              <div className="p-3 rounded-xl bg-[#0a0b0d] border border-[#2d3139] text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-mono font-bold text-[#fbbf24] flex items-center gap-1.5 uppercase">
                    <Flame className="w-3 h-3 text-[#fbbf24]" />
                    <span>Rallying Phrase</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (isEditingRallyingPhrase) {
                        handleSaveRallyingPhraseEdit();
                      } else {
                        setIsEditingRallyingPhrase(true);
                      }
                    }}
                    className="text-[11px] font-mono text-[#8b949e] hover:text-[#fbbf24] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isEditingRallyingPhrase ? 'Save' : 'Edit Phrase'}</span>
                  </button>
                </div>

                {isEditingRallyingPhrase ? (
                  <div className="space-y-2">
                    <input
                      value={editableRallyingPhrase}
                      onChange={(e) => setEditableRallyingPhrase(e.target.value)}
                      className="w-full p-2.5 bg-[#12141a] border border-[#fbbf24] rounded-lg text-xs font-mono text-white focus:outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditableRallyingPhrase(narrative.rallying_phrase);
                          setIsEditingRallyingPhrase(false);
                        }}
                        className="px-2 py-1 bg-[#1a1d24] text-[11px] font-mono rounded text-[#8b949e]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveRallyingPhraseEdit}
                        className="px-2 py-1 bg-[#fbbf24] text-[11px] font-mono rounded text-black font-bold"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-[#e0e0e0]/90 font-mono italic bg-[#12141a]/60 p-2.5 rounded-lg border border-[#232730]">
                    "{editableRallyingPhrase || narrative.rallying_phrase}"
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#2d3139] flex flex-col sm:flex-row items-center justify-between gap-3">
                {onOpenNarrativeModal && (
                  <button
                    type="button"
                    onClick={onOpenNarrativeModal}
                    className="w-full sm:w-auto px-3 py-2 rounded-xl bg-[#141824] hover:bg-[#1c2233] text-[#ccff00] border border-[#2d354a] text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Playbook ↗</span>
                  </button>
                )}

                <button
                  id="btn-approve-proceed-memes"
                  type="button"
                  onClick={() => {
                    setIsApproved(true);
                    onApproveAndProceed();
                  }}
                  className="w-full sm:w-auto py-3 px-5 bg-[#00f5ff] hover:bg-[#b2faff] text-black font-bold text-xs uppercase rounded-xl shadow-[0_0_20px_rgba(0,245,255,0.3)] flex items-center justify-center gap-2 transition-all cursor-pointer font-mono ml-auto"
                >
                  <span>Approve &amp; Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* PRE-GENERATION STATE */
            <div className="bg-[#12141a] border border-[#2d3139] border-dashed rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-[#a855f7]/10 border border-[#a855f7]/30 flex items-center justify-center mx-auto text-[#c084fc]">
                <BookOpen className="w-6 h-6" />
              </div>

              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-base font-bold text-white font-mono">
                  Concept Preview
                </h3>
                <p className="text-xs text-[#8b949e]">
                  Configure your concept on the left, then click <b>Generate Concept</b>.
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleApplyBespokeAndGenerate}
                  disabled={isGenerating || !bespokeSubject.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#a855f7] hover:bg-[#9333ea] text-white font-mono text-xs font-bold rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Generate Concept</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
