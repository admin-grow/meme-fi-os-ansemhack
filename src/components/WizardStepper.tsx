import React from 'react';
import { WizardStep } from '../types';
import { Lightbulb, FileText, Image as ImageIcon, Rocket, MessageSquare, Check } from 'lucide-react';

interface WizardStepperProps {
  currentStep: WizardStep;
  maxReachedStep: WizardStep;
  onSelectStep: (step: WizardStep) => void;
  isGenerating: boolean;
}

interface StepItem {
  id: WizardStep;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  agentTag?: string;
}

const STEPS: StepItem[] = [
  { id: 1, label: 'Concept & Lore', shortLabel: 'Concept', icon: Lightbulb, agentTag: 'Step 1' },
  { id: 2, label: 'Mascot & Memes', shortLabel: 'Visuals', icon: ImageIcon, agentTag: 'Step 2' },
  { id: 3, label: 'Deploy Token', shortLabel: 'Deploy', icon: Rocket, agentTag: 'Step 3' },
  { id: 4, label: 'Community Kit', shortLabel: 'Social', icon: MessageSquare, agentTag: 'Step 4' },
];

export const WizardStepper: React.FC<WizardStepperProps> = ({
  currentStep,
  maxReachedStep,
  onSelectStep,
  isGenerating,
}) => {
  return (
    <div className="w-full bg-[#12141a] border border-[#2d3139] rounded-xl p-1.5 sm:p-2 mb-6">
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = maxReachedStep > step.id;
          const isAccessible = step.id <= maxReachedStep && !isGenerating;

          return (
            <button
              key={step.id}
              onClick={() => isAccessible && onSelectStep(step.id)}
              disabled={!isAccessible}
              className={`relative flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 p-2 sm:p-2.5 rounded-lg transition-all text-left ${
                isActive
                  ? 'bg-[#1a1d24] border border-[#00f5ff] text-white shadow-[0_0_12px_rgba(0,245,255,0.2)]'
                  : isCompleted
                  ? 'bg-[#1a1d24] hover:bg-[#2d3139] border border-[#2d3139] text-[#e0e0e0] cursor-pointer'
                  : 'bg-[#0a0b0d] border border-[#2d3139]/40 text-slate-500 cursor-not-allowed opacity-50'
              }`}
            >
              {/* Step indicator numbered badge */}
              <div
                className={`w-6 h-6 rounded flex items-center justify-center shrink-0 text-[10px] font-mono font-bold transition-colors ${
                  isActive
                    ? 'bg-[#00f5ff] text-black shadow-[0_0_8px_#00f5ff]'
                    : isCompleted
                    ? 'bg-[#ccff00] text-black'
                    : 'bg-[#2d3139] text-white/70'
                }`}
              >
                {isCompleted && !isActive ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  `0${step.id}`
                )}
              </div>

              {/* Text info */}
              <div className="hidden md:block overflow-hidden">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#00f5ff] opacity-80">
                  {step.agentTag}
                </div>
                <div
                  className={`text-xs font-bold uppercase tracking-tight truncate ${
                    isActive ? 'text-white' : isCompleted ? 'text-[#e0e0e0]' : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </div>
              </div>

              {/* Mobile label */}
              <div className="block md:hidden text-[10px] font-mono uppercase font-bold text-center truncate w-full">
                {step.shortLabel}
              </div>

              {/* Active cyan dot indicator */}
              {isActive && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f5ff] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f5ff]"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
