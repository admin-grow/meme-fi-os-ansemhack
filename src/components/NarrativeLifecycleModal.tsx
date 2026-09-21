import React from 'react';
import { Agent1NarrativeResult } from '../types';
import { NarrativeRoadmap } from './NarrativeRoadmap';
import { X, Compass, Sparkles, BookOpen } from 'lucide-react';

interface NarrativeLifecycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  narrative: Agent1NarrativeResult;
}

export const NarrativeLifecycleModal: React.FC<NarrativeLifecycleModalProps> = ({
  isOpen,
  onClose,
  narrative,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0e1117] border border-[#2d3139] hover:border-[#00f5ff]/40 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] my-auto overflow-hidden transition-all">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#232733] bg-[#121620]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#00f5ff]/10 border border-[#00f5ff]/30 flex items-center justify-center text-[#00f5ff]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Narrative Lifecycle &amp; Season Evolution
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ccff00]/10 text-[#ccff00] font-mono border border-[#ccff00]/30">
                  {narrative.token_name} ({narrative.ticker})
                </span>
              </div>
              <p className="text-[11px] text-[#e0e0e0]/70 font-sans mt-0.5">
                Multi-season community playbook, milestone triggers, and comic lore hooks for long-term community retention.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#1a1e2a] hover:bg-[#252b3c] text-[#8e99ac] hover:text-white border border-[#2d3345] transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto space-y-6">
          <NarrativeRoadmap data={narrative} />
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#232733] bg-[#0c0e14] text-xs font-mono text-[#8e99ac]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#00f5ff]" />
            <span>Autonomous Lore Engine by Chief Meme Officer Agent</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#1a1e2a] hover:bg-[#252b3c] text-white border border-[#2d3345] transition-colors cursor-pointer text-xs font-mono"
          >
            Close Playbook
          </button>
        </div>
      </div>
    </div>
  );
};
