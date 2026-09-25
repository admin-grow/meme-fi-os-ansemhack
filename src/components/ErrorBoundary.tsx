import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2, ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by MemeFi OS ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleHardReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error('Storage clear error:', e);
    }
    window.location.href = window.location.origin + window.location.pathname;
  };

  private handleSoftReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-xl w-full bg-[#0e1320] border border-red-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(239,68,68,0.2)] text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>

            <h1 className="text-2xl font-mono font-black text-white mb-2">
              System Interface Glitch
            </h1>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              MemeFi OS caught an unexpected interface exception. Your on-chain token assets and wallet keys are unaffected.
            </p>

            {this.state.error && (
              <div className="bg-[#06080d] border border-[#1e2738] rounded-xl p-4 mb-6 text-left overflow-x-auto">
                <div className="text-[11px] font-mono text-red-400 font-bold mb-1">
                  {this.state.error.name}: {this.state.error.message}
                </div>
                {this.state.error.stack && (
                  <pre className="text-[10px] font-mono text-gray-500 max-h-32 overflow-y-auto whitespace-pre-wrap">
                    {this.state.error.stack.slice(0, 500)}...
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleSoftReload}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#00f5ff] hover:bg-[#80faff] text-black font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,245,255,0.3)]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                type="button"
                onClick={this.handleHardReset}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#1a2130] hover:bg-red-950/40 text-gray-300 hover:text-red-300 border border-[#2b374e] hover:border-red-500/40 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
                <span>Reset Cache & Storage</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
