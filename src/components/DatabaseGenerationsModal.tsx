import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, X, CheckCircle, ExternalLink, Sparkles, Clock, Layers, ArrowUpRight } from 'lucide-react';
import { RecentGenerationRecord, fetchRecentGenerationsFromDb } from '../lib/firebase';
import { FullCampaignData } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoadCampaign: (campaign: FullCampaignData) => void;
}

export const DatabaseGenerationsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onLoadCampaign,
}) => {
  const [generations, setGenerations] = useState<RecentGenerationRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadGenerations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch via backend API first, fallback to direct Firestore
      const res = await fetch('/api/recent-generations?limit=15');
      if (res.ok) {
        const json = await res.json();
        if (json.generations && json.generations.length > 0) {
          setGenerations(json.generations);
          setIsLoading(false);
          return;
        }
      }
      
      // Fallback to client SDK
      const dbRecords = await fetchRecentGenerationsFromDb(15);
      setGenerations(dbRecords);
    } catch (err: any) {
      console.error('Failed to load recent generations:', err);
      setError(err?.message || 'Failed to fetch database collections');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadGenerations();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c0e14] border border-[#1e222d] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1e222d] bg-[#121620]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-wide">
                  Firestore Database Collections
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live Synced
                </span>
              </div>
              <p className="text-xs text-[#a0a5b5] font-mono mt-0.5">
                Collection: <span className="text-white">recent_generations</span> | Database: <span className="text-[#a0a5b5]/70">ai-studio-memefiosaicreato-d2af9199-06d9-4d00-a7ce-8b5636b872f2</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadGenerations}
              disabled={isLoading}
              className="p-2 rounded-lg bg-[#1a1f2c] border border-[#2d3342] text-[#a0a5b5] hover:text-white hover:border-[#3d4558] transition-colors disabled:opacity-50"
              title="Refresh database records"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#1a1f2c] border border-[#2d3342] text-[#a0a5b5] hover:text-white hover:border-[#3d4558] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isLoading && generations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
              <p className="text-sm text-[#a0a5b5]">Querying Firestore collection...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <p className="font-semibold">Error reading from database</p>
              <p className="text-xs mt-1 text-red-400/80">{error}</p>
            </div>
          ) : generations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="p-4 rounded-full bg-[#161a24] border border-[#222735] text-[#a0a5b5]">
                <Layers className="w-8 h-8" />
              </div>
              <p className="text-base font-medium text-white">No Generations in Database Yet</p>
              <p className="text-xs text-[#a0a5b5] max-w-md">
                Generate a new campaign in Step 1. Every newly created campaign is now automatically written to the Firestore collection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generations.map((gen, idx) => {
                const hasFullCampaign = gen.agent1 && gen.agent2 && gen.agent3;
                return (
                  <div
                    key={gen.id || idx}
                    className="p-4 rounded-xl bg-[#121620] border border-[#1e222d] hover:border-[#2d3748] transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                              {gen.token_name || 'Unnamed Token'}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#1e2330] text-[#00ffcc] border border-[#2a3245]">
                              ${gen.ticker || 'MEME'}
                            </span>
                          </div>
                          {gen.category && (
                            <span className="text-[10px] text-[#a0a5b5] uppercase tracking-wider block mt-0.5">
                              {gen.category}
                            </span>
                          )}
                        </div>

                        {gen.viral_score && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                            <Sparkles className="w-3 h-3" />
                            <span>{gen.viral_score}/100</span>
                          </div>
                        )}
                      </div>

                      {gen.tagline && (
                        <p className="text-xs text-[#e2e8f0] italic line-clamp-2 mb-2">
                          "{gen.tagline}"
                        </p>
                      )}

                      {gen.prompt && (
                        <p className="text-[11px] text-[#718096] line-clamp-2 bg-[#0c0e14] p-2 rounded-lg border border-[#1a1f2c] mb-3">
                          <span className="text-[#a0a5b5] font-semibold">Prompt:</span> {gen.prompt}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#1e222d] flex items-center justify-between text-[11px] text-[#718096]">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Clock className="w-3.5 h-3.5 text-[#a0a5b5]" />
                        <span>
                          {gen.createdAt ? new Date(gen.createdAt).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }) : 'Recent'}
                        </span>
                      </div>

                      {hasFullCampaign ? (
                        <button
                          onClick={() => {
                            onLoadCampaign({
                              agent1: gen.agent1,
                              agent2: gen.agent2,
                              agent3: gen.agent3,
                            });
                            onClose();
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors font-medium text-xs"
                        >
                          <span>Load Campaign</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#4a5568] font-mono">Doc ID: {gen.id?.slice(0, 8)}...</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#1e222d] bg-[#0f121a] flex items-center justify-between text-xs text-[#718096]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Connected to Cloud Firestore Database</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#1a1f2c] border border-[#2d3342] text-white hover:bg-[#252b3d] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
