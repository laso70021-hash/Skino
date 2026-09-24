import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  BrainCircuit,
  RefreshCw,
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  isThinking?: boolean;
}

export const AICoachView: React.FC = () => {
  const { userProfile, morningRoutine, eveningRoutine, latestAnalysis, catalogProducts } = useApp();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: `Hello ${userProfile?.displayName || 'there'}! I am your SkinAI Certified Coach. 
I have high-thinking ingredient reasoning enabled to check active formulation safety, layer order, wait intervals, and daily lifestyle scheduling.

What would you like to check today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    'Can I use my Azelaic Acid tonight with Retinol?',
    'My skin feels dry after cleansing. What should I buffer?',
    'I work out at 6 PM. How should I rearrange my evening routine?',
    'What is the recommended wait interval between Niacinamide and sunscreen?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      content: textToSend.trim()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          userProfile,
          activeRoutine: {
            morning: morningRoutine,
            evening: eveningRoutine
          },
          skinAnalysis: latestAnalysis,
          catalogProducts: catalogProducts.filter((p) => p.isActive)
        })
      });

      if (!res.ok) throw new Error('Coach server error');
      const data = await res.json();

      const coachMessage: Message = {
        id: 'msg-reply-' + Date.now(),
        sender: 'assistant',
        content: data.reply || 'I am ready to help you with your next skincare step.'
      };
      setMessages((prev) => [...prev, coachMessage]);
    } catch (err: any) {
      console.error('Coach error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-err-' + Date.now(),
          sender: 'assistant',
          content: 'I had trouble connecting. Skincare tip: Remember to never mix high-strength BHA and Retinol in the same step—alternate them on separate evenings.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-16">
      {/* Top Thinking Mode Banner */}
      <div className="bg-gradient-to-r from-stone-900 to-teal-950 p-4 sm:p-5 rounded-2xl text-white shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center font-bold">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">High Thinking Skin Coach</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-stone-900 font-extrabold uppercase tracking-wider">
                ThinkingLevel.HIGH
              </span>
            </div>
            <p className="text-xs text-teal-200 mt-0.5">
              Powered by gemini-3.1-pro-preview with deep cosmetic active compatibility reasoning.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-400">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>Non-Medical Guidance</span>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="font-semibold text-stone-500 shrink-0">Try asking:</span>
        {sampleQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-teal-500 whitespace-nowrap transition text-xs shrink-0 shadow-xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-6 min-h-[420px] max-h-[550px] overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-teal-600 text-white rounded-br-none shadow-sm'
                  : 'bg-stone-50 text-stone-800 border border-stone-200/80 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-center gap-3">
              <BrainCircuit className="w-4 h-4 text-amber-600 animate-spin" />
              <div className="space-y-0.5">
                <span className="font-bold block">Thinking through formulation interactions...</span>
                <span className="text-[11px] text-amber-800">
                  Checking active concentrations, pH layer sequence, and contraindications.
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-stone-200 shadow-sm"
      >
        <input
          type="text"
          placeholder="Ask anything about your routine, active layering, or ingredient questions..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 bg-transparent text-xs sm:text-sm text-stone-900 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white disabled:bg-stone-200 disabled:text-stone-400 transition shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
