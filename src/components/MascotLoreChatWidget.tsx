import React, { useState } from 'react';
import { Send, Bot, Sparkles, X, MessageSquare, Flame } from 'lucide-react';

interface MascotLoreChatWidgetProps {
  tokenName: string;
  ticker: string;
  lore: string;
  tagline: string;
  accentColor: string;
}

interface ChatMessage {
  id: string;
  sender: 'mascot' | 'user';
  text: string;
  timestamp: string;
}

export const MascotLoreChatWidget: React.FC<MascotLoreChatWidgetProps> = ({
  tokenName,
  ticker,
  lore,
  tagline,
  accentColor,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'mascot',
      text: `Yo! I'm the official ${ticker} lore agent. "${tagline}". Ask me about the tokenomics, bonding curve velocity, or the community playbook!`,
      timestamp: 'Just now',
    },
  ]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || isTyping) return;

    const userText = inputMsg.trim();
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');
    setIsTyping(true);

    try {
      // Dynamic response from backend lore agent
      const res = await fetch('/api/mascot-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token_name: tokenName,
          ticker,
          lore,
          tagline,
          user_message: userText,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'mascot',
            text: data.reply || `LFG! Sending ${ticker} straight through the bonding curve!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error('Fallback');
      }
    } catch (err) {
      // Procedural witty meme response
      setTimeout(() => {
        const responses = [
          `Real degens don't ask questions, they just send ${ticker}! 🚀`,
          `According to the ancient Solana scrolls: ${lore.slice(0, 80)}... and that's the path to the moon!`,
          `100% bonded on ClawPump! No team allocation, pure community momentum for ${ticker}!`,
        ];
        const reply = responses[Math.floor(Math.random() * responses.length)];
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'mascot',
            text: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 600);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-3 rounded-full text-black font-bold text-xs uppercase font-mono shadow-[0_0_20px_rgba(204,255,0,0.4)] flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
          style={{ backgroundColor: accentColor || '#ccff00' }}
        >
          <Bot className="w-4 h-4 fill-black" />
          <span>Talk to {ticker} Agent</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        </button>
      )}

      {/* Mini Chat Window */}
      {isOpen && (
        <div className="w-[330px] sm:w-[380px] h-[480px] bg-[#0c0e12] border border-[#2d3139] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Chat Header */}
          <div
            className="p-3.5 border-b border-[#2d3139] flex items-center justify-between"
            style={{ backgroundColor: '#141720' }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-black font-mono"
                style={{ backgroundColor: accentColor || '#ccff00' }}
              >
                {ticker.slice(1, 3)}
              </div>
              <div>
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <span>{tokenName} Lore Bot</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
                <div className="text-[10px] text-[#e0e0e0]/60 font-mono">Interactive Mascot Agent</div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs font-sans">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl ${
                    m.sender === 'user'
                      ? 'bg-[#00f5ff] text-black font-medium rounded-br-none'
                      : 'bg-[#181c26] text-white border border-[#2d3139] rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                </div>
                <span className="text-[9px] text-[#e0e0e0]/40 font-mono mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2 bg-[#181c26] border border-[#2d3139] rounded-xl w-fit text-white/60 text-xs font-mono">
                <Sparkles className="w-3 h-3 text-[#ccff00] animate-spin" />
                <span>{ticker} Mascot is thinking...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-2.5 border-t border-[#2d3139] bg-[#10131a] flex gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={`Ask ${ticker} mascot anything...`}
              className="flex-1 bg-[#1a1e29] border border-[#2d3139] rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#00f5ff] font-sans"
            />
            <button
              type="submit"
              disabled={isTyping || !inputMsg.trim()}
              className="p-2 rounded-lg text-black font-bold transition-all disabled:opacity-40"
              style={{ backgroundColor: accentColor || '#ccff00' }}
            >
              <Send className="w-4 h-4 fill-black" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
