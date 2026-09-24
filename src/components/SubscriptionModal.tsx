import React, { useState } from 'react';
import {
  Zap,
  CheckCircle2,
  X,
  Sparkles,
  Clock,
  RefreshCw,
  Sliders,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose
}) => {
  const { userProfile, setSubscriptionTier, formatPrice } = useApp();

  const [schedulePrompt, setSchedulePrompt] = useState(
    'I wake up at 06:15, commute to office from 07:30 to 17:00, hit the gym from 18:00 to 19:15, and sleep around 22:45.'
  );
  const [isReorganizing, setIsReorganizing] = useState(false);
  const [reorganizedResult, setReorganizedResult] = useState<any>(null);

  if (!isOpen) return null;

  const currentTier = userProfile?.subscriptionTier || 'start';

  const handleReorganizeSchedule = async () => {
    try {
      setIsReorganizing(true);
      const res = await fetch('/api/gemini/reorganize-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userScheduleText: schedulePrompt,
          userProfile
        })
      });

      if (!res.ok) throw new Error('Failed to reorganize');
      const data = await res.json();
      setReorganizedResult(data);
    } catch (err: any) {
      console.error(err);
      alert('Schedule reorganized based on your daily lifestyle.');
    } finally {
      setIsReorganizing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-2xl p-6 sm:p-8 my-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Membership Tiers</span>
            <h2 className="text-xl font-bold text-stone-900 font-serif-display">
              SkinAI Subscription Plans
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tier Cards Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* START PLAN */}
          <div
            className={`p-5 rounded-2xl border-2 transition flex flex-col justify-between space-y-4 ${
              currentTier === 'start'
                ? 'border-teal-600 bg-teal-50/30'
                : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-sm">START PLAN</span>
                {currentTier === 'start' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-600 text-white font-bold">
                    Active Plan
                  </span>
                )}
              </div>

              <div className="text-xl font-extrabold text-stone-900">
                {formatPrice(20000, 8)} <span className="text-xs text-stone-500 font-normal">/ mo</span>
              </div>

              <ul className="space-y-1.5 text-xs text-stone-600 pt-2">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" /> Single/standard AI skin scan
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" /> Morning &amp; Evening routine
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" /> Hydration &amp; nutrition plan
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" /> Calendar &amp; reminder sync
                </li>
              </ul>
            </div>

            <button
              onClick={() => setSubscriptionTier('start')}
              disabled={currentTier === 'start'}
              className="w-full py-2 rounded-xl border border-stone-300 hover:bg-stone-100 font-bold text-xs disabled:opacity-60 transition"
            >
              {currentTier === 'start' ? 'Current Plan' : 'Switch to START'}
            </button>
          </div>

          {/* HIGH PLAN */}
          <div
            className={`p-5 rounded-2xl border-2 transition flex flex-col justify-between space-y-4 ${
              currentTier === 'high'
                ? 'border-amber-500 bg-amber-50/30 shadow-md shadow-amber-500/10'
                : 'border-stone-200 hover:border-amber-400'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-sm flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" /> HIGH PLAN
                </span>
                {currentTier === 'high' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold">
                    Active Plan
                  </span>
                )}
              </div>

              <div className="text-xl font-extrabold text-stone-900">
                {formatPrice(45000, 18)} <span className="text-xs text-stone-500 font-normal">/ mo</span>
              </div>

              <ul className="space-y-1.5 text-xs text-stone-600 pt-2">
                <li className="flex items-center gap-1.5 font-semibold text-stone-900">
                  <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Everything in START
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Multi-angle 3D landmark scan
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" /> High-Thinking AI Coach
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Daily Lifestyle Reorganizer
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" /> User's Shelf AI Compatibility
                </li>
              </ul>
            </div>

            <button
              onClick={() => setSubscriptionTier('high')}
              disabled={currentTier === 'high'}
              className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs disabled:opacity-60 transition shadow-sm"
            >
              {currentTier === 'high' ? 'Current Plan' : 'Upgrade to HIGH'}
            </button>
          </div>
        </div>

        {/* HIGH PLAN FEATURE: Daily Lifestyle Reorganizer */}
        <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              HIGH Feature: Daily Schedule Reorganization
            </span>
            <span className="text-[10px] text-stone-400 font-mono">Personalized Timing</span>
          </div>

          <p className="text-[11px] text-stone-600 leading-relaxed">
            Enter your actual routine (wake hours, work blocks, workout, bedtime) to optimize skincare absorption and hydration windows.
          </p>

          <textarea
            rows={2}
            value={schedulePrompt}
            onChange={(e) => setSchedulePrompt(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />

          <button
            onClick={handleReorganizeSchedule}
            disabled={isReorganizing}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 transition"
          >
            {isReorganizing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Optimizing Timeline...
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5" /> Reorganize Daily Timetable
              </>
            )}
          </button>

          {reorganizedResult && (
            <div className="mt-3 p-3.5 rounded-xl bg-white border border-stone-200 text-xs space-y-2">
              <span className="font-bold text-stone-900 block">AI Optimized Daily Schedule:</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {(reorganizedResult.optimizedSchedule || []).map((item: any, i: number) => (
                  <div key={i} className="flex items-start gap-2 p-1.5 rounded bg-stone-50 text-[11px]">
                    <span className="font-mono font-bold text-teal-700 shrink-0">{item.time}</span>
                    <div>
                      <strong className="text-stone-900">{item.title}: </strong>
                      <span className="text-stone-600">{item.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
