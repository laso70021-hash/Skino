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
  ArrowRight,
  Lock,
  Building,
  Crown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from '../components/common/BackButton';
import { SUBSCRIPTION_PLANS } from '../data/subscriptionPlans';
import { SubscriptionTier } from '../types';

export const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, setSubscriptionTier, formatPrice, currency, entitlements } = useApp();

  const [schedulePrompt, setSchedulePrompt] = useState(
    'I wake up at 06:15, commute to office from 07:30 to 17:00, hit the gym from 18:00 to 19:15, and sleep around 22:45.'
  );
  const [isReorganizing, setIsReorganizing] = useState(false);
  const [reorganizedResult, setReorganizedResult] = useState<any>(null);
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Normalize current tier
  const rawTier = userProfile?.subscriptionTier || 'silver';
  const currentTier: SubscriptionTier =
    rawTier === 'start' ? 'bronze' : rawTier === 'high' ? 'gold' : rawTier;

  const handleSelectPlan = async (tier: SubscriptionTier) => {
    await setSubscriptionTier(tier);
    setSuccessNotice(`Successfully switched to the ${tier.toUpperCase()} tier!`);
    setTimeout(() => setSuccessNotice(null), 3500);
  };

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
      console.warn('Reorganize fallback:', err);
    } finally {
      setIsReorganizing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <BackButton fallback="/dashboard" label="Back to Dashboard" />
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span>Membership</span>
          <span>·</span>
          <span className="font-bold text-stone-900 uppercase bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
            {currentTier} Tier Active
          </span>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">{successNotice}</span>
          </div>
          <button
            onClick={() => setSuccessNotice(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Title Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
            Subscription &amp; Intelligence Tiers
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-950 font-serif-display mt-0.5">
            Skina Intelligence Plans
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-xl">
            Choose the plan calibrated to your skin health goals. Every tier unlocks deeper analytical depth—from facial heatmaps and 5-axis radar charts to clinical clinic management.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-stone-100 text-stone-700">
            Billed in {currency}
          </div>
        </div>
      </div>

      {/* 6 Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrent = currentTier === plan.id;
          const price = formatPrice(plan.priceTZS, plan.priceUSD);

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-7 border transition-all flex flex-col justify-between relative ${
                isCurrent
                  ? 'bg-stone-950 text-white border-stone-950 shadow-xl ring-2 ring-teal-500/50'
                  : plan.highlighted
                  ? 'bg-white text-stone-900 border-teal-500 shadow-md ring-1 ring-teal-500/20'
                  : 'bg-white text-stone-900 border-stone-200/80 shadow-2xs hover:shadow-md'
              }`}
            >
              {plan.badge && (
                <span className={`absolute -top-3 left-6 px-3 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                  isCurrent
                    ? 'bg-teal-400 text-stone-950'
                    : plan.highlighted
                    ? 'bg-teal-600 text-white'
                    : 'bg-stone-800 text-white'
                }`}>
                  {isCurrent ? 'Current Active Tier' : plan.badge}
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className={`text-xl font-bold font-serif-display ${isCurrent ? 'text-white' : 'text-stone-950'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs mt-1 leading-relaxed ${isCurrent ? 'text-stone-300' : 'text-stone-500'}`}>
                    {plan.tagline}
                  </p>
                </div>

                <div className="pt-2 pb-1 border-y border-stone-100/10">
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-2xl sm:text-3xl font-extrabold font-serif-display ${isCurrent ? 'text-white' : 'text-stone-950'}`}>
                      {plan.priceUSD === 0 ? 'Free' : price}
                    </span>
                    {plan.priceUSD > 0 && (
                      <span className={`text-xs ${isCurrent ? 'text-stone-400' : 'text-stone-500'}`}>
                        / month
                      </span>
                    )}
                  </div>
                  <span className={`text-[11px] block mt-0.5 ${isCurrent ? 'text-teal-300' : 'text-teal-800 font-bold'}`}>
                    {plan.entitlements.monthlyScans > 1000
                      ? 'Unlimited AI Scans'
                      : `${plan.entitlements.monthlyScans} AI Scans / Month`}
                  </span>
                </div>

                <div className="space-y-2.5 pt-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${isCurrent ? 'text-stone-400' : 'text-stone-400'}`}>
                    Included Capabilities
                  </span>
                  <ul className="space-y-2">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs">
                        <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isCurrent ? 'text-teal-300' : 'text-teal-600'}`} />
                        <span className={isCurrent ? 'text-stone-200' : 'text-stone-700'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <button
                  disabled={isCurrent}
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 rounded-full font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-white/10 text-white border border-white/20 cursor-default'
                      : plan.highlighted
                      ? 'bg-stone-950 hover:bg-stone-800 text-white shadow-md'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-200'
                  }`}
                >
                  {isCurrent ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-teal-300" />
                      <span>Active Plan</span>
                    </>
                  ) : (
                    <span>Choose {plan.name} →</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Matrix Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
            Full Tier Architecture
          </span>
          <h2 className="text-xl font-bold text-stone-950 font-serif-display">
            Plan Entitlements Comparison
          </h2>
          <p className="text-xs text-stone-500">
            Understand exactly what capabilities each tier unlocks
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-[11px] text-stone-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Capability</th>
                <th className="py-3 px-2 text-center">Free</th>
                <th className="py-3 px-2 text-center">Bronze</th>
                <th className="py-3 px-2 text-center bg-teal-50/50 rounded-t-xl">Silver</th>
                <th className="py-3 px-2 text-center">Gold</th>
                <th className="py-3 px-2 text-center">Platinum</th>
                <th className="py-3 px-2 text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              <tr>
                <td className="py-3 px-3 font-semibold text-stone-900">Basic Multi-Angle AI Scan</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center bg-teal-50/30 text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-stone-900">Guided Scanning &amp; Quality Check</td>
                <td className="py-3 px-2 text-center text-stone-300">—</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center bg-teal-50/30 text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-stone-900">Zone-by-Zone Facial Diagnostics</td>
                <td className="py-3 px-2 text-center text-stone-300">—</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center bg-teal-50/30 text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-stone-900">Facial Heatmaps (Oil, Pores, Redness)</td>
                <td className="py-3 px-2 text-center text-stone-300">—</td>
                <td className="py-3 px-2 text-center text-stone-300">—</td>
                <td className="py-3 px-2 text-center bg-teal-50/30 text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-stone-900">5-Axis Radar Chart Analysis</td>
                <td className="py-3 px-2 text-center text-stone-300">—</td>
                <td className="py-3 px-2 text-center text-stone-300">—</td>
                <td className="py-3 px-2 text-center bg-teal-50/30 text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-stone-900">Aligned Before &amp; After Comparison</td>
                <td className="py-3 px-2 text-center text-stone-300">—</td>
                <td className="py-3 px-2 text-center text-stone-300">—</td>
                <td className="py-3 px-2 text-center bg-teal-50/30 text-stone-300">—</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-stone-900">Circadian Schedule Reorganization</td>
                <td className="py-3 px-2 text-center text-stone-300">—</td>
                <td className="py-3 px-2 text-center text-stone-300">—</td>
                <td className="py-3 px-2 text-center bg-teal-50/30 text-stone-300">—</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-stone-900">Exportable Personal PDF Report</td>
                <td className="py-3 px-2 text-center text-stone-300">—</td>
                <td className="py-3 px-2 text-center text-stone-300">—</td>
                <td className="py-3 px-2 text-center bg-teal-50/30 text-stone-300">—</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-stone-900">Professional Clinical Reports</td>
                <td className="py-3 px-2 text-center text-stone-300">—</td>
                <td className="py-3 px-2 text-center text-stone-300">—</td>
                <td className="py-3 px-2 text-center bg-teal-50/30 text-stone-300">—</td>
                <td className="py-3 px-2 text-center text-stone-300">—</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-stone-900">Clinic Multi-Staff &amp; Patient Profiles</td>
                <td className="py-3 px-2 text-center text-stone-300">—</td>
                <td className="py-3 px-2 text-center text-stone-300">—</td>
                <td className="py-3 px-2 text-center bg-teal-50/30 text-stone-300">—</td>
                <td className="py-3 px-2 text-center text-stone-300">—</td>
                <td className="py-3 px-2 text-center text-stone-300">—</td>
                <td className="py-3 px-2 text-center text-teal-600 font-bold">✓</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-stone-900">Monthly Scan Allowance</td>
                <td className="py-3 px-2 text-center font-mono font-bold">3</td>
                <td className="py-3 px-2 text-center font-mono font-bold">10</td>
                <td className="py-3 px-2 text-center bg-teal-50/30 font-mono font-bold">25</td>
                <td className="py-3 px-2 text-center font-mono font-bold">50</td>
                <td className="py-3 px-2 text-center font-mono font-bold text-teal-700">Unlimited</td>
                <td className="py-3 px-2 text-center font-mono font-bold text-teal-700">Unlimited</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Circadian Schedule Optimizer Tool (Gold+) */}
      <div className="bg-[#faf8f5] p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
            <h3 className="text-xl font-bold text-stone-950 font-serif-display">
              Circadian Daily Routine Reorganizer
            </h3>
          </div>
          {entitlements.advancedProgress ? (
            <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Gold Tier Feature
            </span>
          ) : (
            <span className="text-[10px] font-bold text-stone-500 bg-stone-200/60 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3" /> Gold Tier Feature
            </span>
          )}
        </div>

        <p className="text-xs text-stone-600 leading-relaxed max-w-2xl">
          Align your morning and evening skincare routines, meal timing, hydration checkpoints, and sleep windows to maximize product absorption and optimize nocturnal skin barrier repair.
        </p>

        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-stone-700">
            Describe your typical daily schedule:
          </label>
          <textarea
            value={schedulePrompt}
            onChange={(e) => setSchedulePrompt(e.target.value)}
            rows={3}
            className="w-full p-3.5 rounded-2xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-stone-900 transition"
          />
          <button
            onClick={handleReorganizeSchedule}
            disabled={isReorganizing}
            className="px-6 py-3 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {isReorganizing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Optimizing Schedule with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                <span>Optimize My Circadian Schedule</span>
              </>
            )}
          </button>
        </div>

        {reorganizedResult && (
          <div className="mt-6 pt-4 border-t border-stone-200/80 space-y-4 animate-in fade-in">
            <h4 className="text-sm font-bold text-stone-950 font-serif-display">
              AI-Calibrated Timetable:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(reorganizedResult.optimizedSchedule || []).map((item: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white border border-stone-200/80 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{item.title}</span>
                    <span className="font-mono text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-stone-500 text-[11px]">{item.description}</p>
                </div>
              ))}
            </div>
            {reorganizedResult.reasoning && (
              <p className="text-xs text-stone-600 bg-white p-4 rounded-2xl border border-stone-200/80 italic">
                "{reorganizedResult.reasoning}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
