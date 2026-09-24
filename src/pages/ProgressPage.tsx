import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Camera,
  Layers,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Activity,
  Flame,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from '../components/common/BackButton';
import { SkinAnalysis } from '../types';

export const ProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const { analyses, calendarEvents, morningRoutine, eveningRoutine } = useApp();

  const [activeTab, setActiveTab] = useState<'skin' | 'routine'>('skin');
  const [sliderPosition, setSliderPosition] = useState(50);

  const [compareBefore, setCompareBefore] = useState<SkinAnalysis | null>(
    analyses.length > 1 ? analyses[analyses.length - 1] : analyses[0] || null
  );
  const [compareNow, setCompareNow] = useState<SkinAnalysis | null>(
    analyses.length > 0 ? analyses[0] : null
  );

  const oldestScore = analyses.length > 0 ? analyses[analyses.length - 1].skinHealthScore : 70;
  const latestScore = analyses.length > 0 ? analyses[0].skinHealthScore : 74;
  const delta = latestScore - oldestScore;

  // Routine adherence stats
  const completedEvents = calendarEvents.filter((e) => e.completed).length;
  const totalEvents = Math.max(calendarEvents.length, 1);
  const adherencePercent = Math.min(100, Math.round((completedEvents / totalEvents) * 100));

  const beforeImg =
    compareBefore?.imageUrl ||
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80';
  const nowImg =
    compareNow?.imageUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <BackButton fallback="/home" label="Back to Home" />
        <button
          onClick={() => navigate('/scan')}
          className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>New Progress Scan</span>
        </button>
      </div>

      {/* Page Title & Sub-tabs */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Longitudinal Tracking
          </span>
          <h1 className="text-2xl font-bold text-stone-900 font-serif-display mt-0.5">
            Progress &amp; Adherence
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Observe measurable improvements in epidermal clarity and maintain your daily routine streak.
          </p>
        </div>

        {/* Sub-page Navigation Tabs */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('skin')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'skin'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Skin Progress
          </button>
          <button
            onClick={() => setActiveTab('routine')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'routine'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Routine Progress
          </button>
        </div>
      </div>

      {/* SKIN PROGRESS SUB-PAGE */}
      {activeTab === 'skin' && (
        <div className="space-y-6">
          {/* Delta Score Metric Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">Baseline Score</span>
              <div className="text-3xl font-extrabold text-stone-900 font-serif-display mt-1">{oldestScore}/100</div>
              <span className="text-[11px] text-stone-500">Initial scan evaluation</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wide">Current Health Score</span>
              <div className="text-3xl font-extrabold text-stone-900 font-serif-display mt-1">{latestScore}/100</div>
              <span className="text-[11px] text-teal-700 font-semibold">Latest facial assessment</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Net Progression</span>
              <div className="text-3xl font-extrabold text-emerald-600 font-serif-display mt-1">
                {delta >= 0 ? `+${delta}` : delta}%
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold">Over {analyses.length} scan recordings</span>
            </div>
          </div>

          {/* Interactive Before & After Visual Slider */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-base">Visual Progression Comparison</h3>
                <p className="text-xs text-stone-500">Drag to inspect facial clarity and texture changes.</p>
              </div>
              <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                Split {sliderPosition}%
              </span>
            </div>

            <div className="relative aspect-4/3 sm:aspect-16/9 w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-stone-200 select-none shadow-md">
              {/* Now photo */}
              <img
                src={nowImg}
                alt="Latest scan"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-900/80 text-white backdrop-blur">
                Now ({latestScore}/100)
              </span>

              {/* Baseline photo */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={beforeImg}
                  alt="Baseline scan"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: '100%' }}
                />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-900/80 text-white backdrop-blur">
                  Baseline ({oldestScore}/100)
                </span>
              </div>

              {/* Slider divider */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize flex items-center justify-center"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-white shadow-lg border border-stone-300 text-stone-700 flex items-center justify-center text-xs font-bold -ml-3.5">
                  ↔
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* ROUTINE PROGRESS SUB-PAGE */}
      {activeTab === 'routine' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-bold uppercase tracking-wide">Current Streak</span>
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
              <div className="text-3xl font-extrabold text-stone-900 font-serif-display mt-1">
                7 Days
              </div>
              <span className="text-[11px] text-amber-700 font-semibold">Active consistency</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-bold uppercase tracking-wide">Adherence Rate</span>
                <Activity className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-3xl font-extrabold text-stone-900 font-serif-display mt-1">
                {adherencePercent}%
              </div>
              <span className="text-[11px] text-teal-700 font-semibold">Checkpoints marked complete</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-bold uppercase tracking-wide">Barrier Mastery</span>
                <Award className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-3xl font-extrabold text-stone-900 font-serif-display mt-1">
                Level 2
              </div>
              <span className="text-[11px] text-indigo-700 font-semibold">Consistent wait intervals</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-900 text-base">Weekly Routine Consistency</h3>
            <p className="text-xs text-stone-500">
              Applying products in their recommended sequence and allowing wait intervals ensures optimal penetration of active ingredients.
            </p>

            <div className="grid grid-cols-7 gap-2 pt-2 text-center">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                <div key={day} className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 block">{day}</span>
                  <div className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center mx-auto text-xs font-bold">
                    ✓
                  </div>
                  <span className="text-[9px] text-stone-500 block">AM &amp; PM</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
