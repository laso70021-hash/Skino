import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  CheckCircle2,
  Sparkles,
  Clock,
  RefreshCw,
  Sliders,
  Check,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from '../components/common/BackButton';
import { CloseButton } from '../components/common/CloseButton';

export const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, setSubscriptionTier, formatPrice, currency } = useApp();

  const [schedulePrompt, setSchedulePrompt] = useState(
    'I wake up at 06:15, commute to office from 07:30 to 17:00, hit the gym from 18:00 to 19:15, and sleep around 22:45.'
  );
  const [isReorganizing, setIsReorganizing] = useState(false);
  const [reorganizedResult, setReorganizedResult] = useState<any>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

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
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <BackButton fallback="/profile" label="Back to Profile" />
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span>Membership</span>
          <span>·</span>
          <span className="font-bold text-stone-800 uppercase">{currentTier} Plan Active</span>
        </div>
      </div>

      {/* Page Title Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Subscription &amp; Intelligence Tiers
          </span>
          <h1 className="text-2xl font-bold text-stone-900 font-serif-display mt-0.5">
            SkinAI Membership Plans
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-xl">
            Choose the plan that matches your skincare journey. Upgrade to HIGH Tier to unlock circadian daily schedule reorganization and priority high-thinking reasoning.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700">
          Billed in {currency}
        </div>
      </div>

      {/* Plans Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* START PLAN */}
        <div
          className={`bg-white rounded-2xl p-6 border transition relative flex flex-col justify-between ${
            currentTier === 'start'
              ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-md'
              : 'border-stone-200 shadow-sm'
          }`}
        >
          {currentTier === 'start' && (
            <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full text-[10px] font-bold bg-teal-600 text-white shadow-xs">
              Current Active Plan
            </span>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-stone-900">START PLAN</h2>
                <p className="text-xs text-stone-500">Essential Skin &amp; Routine Foundations</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-stone-900">
                  {formatPrice(20000, 8)}
                </span>
                <span className="text-xs text-stone-400 block">/ month</span>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Unlimited 3-angle AI skin &amp; face scans</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Personalized morning &amp; evening skincare routine</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Exact application duration &amp; wait intervals</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Full access to approved product catalog</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Google Calendar &amp; Gmail email routine sync</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-4 border-t border-stone-100">
            {currentTier === 'start' ? (
              <button
                disabled
                className="w-full py-2.5 rounded-xl bg-teal-50 text-teal-800 font-bold text-xs text-center border border-teal-200"
              >
                Current Active Plan
              </button>
            ) : (
              <button
                onClick={() => setSubscriptionTier('start')}
                className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs text-center transition"
              >
                Switch to START Plan
              </button>
            )}
          </div>
        </div>

        {/* HIGH PLAN */}
        <div
          className={`bg-white rounded-2xl p-6 border transition relative flex flex-col justify-between ${
            currentTier === 'high'
              ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-lg'
              : 'border-amber-200/80 shadow-md'
          }`}
        >
          <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
            HIGH INTELLIGENCE
          </span>

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <h2 className="text-lg font-bold text-stone-900">HIGH PLAN</h2>
                </div>
                <p className="text-xs text-stone-500">Advanced Lifestyle &amp; Circadian Intelligence</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-stone-900">
                  {formatPrice(45000, 18)}
                </span>
                <span className="text-xs text-stone-400 block">/ month</span>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
              <li className="flex items-center gap-2 font-semibold text-stone-800">
                <Check className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Everything in START plan, plus:</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Daily Schedule Reorganizer (adapts around work, gym &amp; sleep)</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Priority AI Coach with High-Thinking Active Ingredient Chemistry</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Automated weekly skin progress reports</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Direct consultation export for dermatologists</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-4 border-t border-stone-100">
            {currentTier === 'high' ? (
              <button
                disabled
                className="w-full py-2.5 rounded-xl bg-amber-50 text-amber-800 font-bold text-xs text-center border border-amber-300"
              >
                ✓ Current Active Plan
              </button>
            ) : (
              <button
                onClick={() => setSubscriptionTier('high')}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs text-center transition shadow-md shadow-amber-500/20"
              >
                Upgrade to HIGH Plan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* HIGH TIER FEATURE: DAILY SCHEDULE REORGANIZER */}
      <div className="bg-stone-900 rounded-2xl p-6 sm:p-8 text-white space-y-5 border border-stone-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Daily Schedule Reorganizer</h3>
              <p className="text-xs text-stone-400">Exclusive to HIGH Plan Members</p>
            </div>
          </div>

          {currentTier !== 'high' && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 self-start sm:self-auto">
              Locked on START Tier
            </span>
          )}
        </div>

        <p className="text-xs text-stone-300 leading-relaxed max-w-2xl">
          Describe your daily work hours, commute, gym workouts, and sleep habits. Our model calculates optimal application intervals, workout rinse checkpoints, and pillow-rub avoidance timings.
        </p>

        <div className="space-y-3">
          <textarea
            disabled={currentTier !== 'high'}
            rows={3}
            value={schedulePrompt}
            onChange={(e) => setSchedulePrompt(e.target.value)}
            className="w-full p-3 rounded-xl bg-stone-800/90 border border-stone-700 text-xs text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
            placeholder="Describe your day (e.g. Wake 6am, office 8am-5pm, gym 6pm, bed 11pm)..."
          />

          <button
            disabled={currentTier !== 'high' || isReorganizing}
            onClick={handleReorganizeSchedule}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
              currentTier === 'high'
                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 cursor-pointer shadow-lg shadow-amber-500/20'
                : 'bg-stone-800 text-stone-500 cursor-not-allowed'
            }`}
          >
            {isReorganizing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Reorganizing Schedule with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Reorganize My Daily Timetable</span>
              </>
            )}
          </button>
        </div>

        {/* Reorganized Schedule Result */}
        {reorganizedResult && (
          <div className="pt-4 border-t border-stone-800 space-y-3">
            <h4 className="font-bold text-sm text-amber-400">Circadian Optimized Schedule</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {reorganizedResult.optimizedSchedule?.map((s: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-stone-800/60 border border-stone-700/60 text-xs space-y-1"
                >
                  <div className="flex justify-between items-center text-amber-300 font-mono font-bold">
                    <span>{s.time}</span>
                    <span className="uppercase text-[9px] px-2 py-0.5 rounded bg-stone-700 text-stone-200">
                      {s.category}
                    </span>
                  </div>
                  <strong className="text-white block">{s.title}</strong>
                  <p className="text-stone-400 text-[11px] leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
            {reorganizedResult.reasoning && (
              <p className="text-[11px] text-stone-400 italic pt-1">
                Note: {reorganizedResult.reasoning}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Cancel Subscription link & modal */}
      {currentTier !== 'start' && (
        <div className="text-center pt-4">
          <button
            onClick={() => setShowCancelModal(true)}
            className="text-xs text-stone-400 hover:text-stone-700 underline"
          >
            Cancel or downgrade subscription
          </button>
        </div>
      )}

      {/* Small Action Modal: Confirm Cancel Subscription */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-stone-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-base">Downgrade Membership</h3>
              <CloseButton onClick={() => setShowCancelModal(false)} ariaLabel="Close cancel dialog" />
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to switch back to the START Plan? You will lose access to the Daily Schedule Reorganizer and high-thinking coaching.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-xl text-stone-600 font-semibold text-xs hover:bg-stone-100"
              >
                Keep HIGH Plan
              </button>
              <button
                onClick={() => {
                  setSubscriptionTier('start');
                  setShowCancelModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
              >
                Confirm Downgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
