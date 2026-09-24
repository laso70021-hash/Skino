import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { BackButton } from '../components/common/BackButton';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
}

export const AICoachPage: React.FC = () => {
  const navigate = useNavigate();
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
    'Can I use Azelaic Acid tonight with Retinol?',
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
    if (!userText) setInput('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const res = await fetch('/api/gemini/chat-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: chatHistory,
          userProfile,
          skinAnalysis: latestAnalysis,
          morningRoutine,
          eveningRoutine
        })
      });

      if (!res.ok) throw new Error('Coach service error');
      const data = await res.json();

      const assistantMessage: Message = {
        id: 'msg-' + Date.now(),
        sender: 'assistant',
        content: data.reply
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'assistant',
          content:
            'When layering active ingredients, wait at least 60 seconds between serums, and avoid pairing high-strength Retinoids with direct AHAs/BHAs in the same evening application.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <BackButton fallback="/home" label="Back to Home" />
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <BrainCircuit className="w-3.5 h-3.5 text-teal-600" />
          <span>High-Thinking Formulation Engine</span>
        </div>
      </div>

      {/* Page Title Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Interactive Advisory
          </span>
          <h1 className="text-2xl font-bold text-stone-900 font-serif-display mt-0.5">
            AI Skin &amp; Wellness Coach
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Ask any questions regarding active ingredient contraindications, contact wait times, or workout skincare pacing.
          </p>
        </div>

        <div className="text-xs text-stone-400 bg-stone-50 p-2 rounded-xl border border-stone-100 self-start sm:self-auto">
          Calibrated to your {userProfile?.skinType || 'Combination'} skin
        </div>
      </div>

      {/* Quick Question Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
          Frequent Cosmetic Inquiries:
        </span>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-xs px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 transition shadow-2xs hover:border-teal-300 text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-stone-900 text-white'
                    : 'bg-teal-600 text-white shadow-xs'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs max-w-lg leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-teal-600 text-white rounded-tr-none'
                    : 'bg-stone-50 border border-stone-200 text-stone-800 rounded-tl-none'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 rounded-tl-none flex items-center gap-2 text-xs text-stone-500">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                <span>Coach is analyzing formulation chemistry...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-stone-200 bg-stone-50/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask about active ingredient pairings, wait times, or reactions..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
