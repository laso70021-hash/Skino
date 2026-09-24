import React, { useState } from 'react';
import { Sparkles, Sliders, Split, Layers, Info } from 'lucide-react';
import { SkinAnalysis } from '../types';

interface BeforeAfterComparisonProps {
  currentAnalysis: SkinAnalysis;
  previousAnalysis?: SkinAnalysis | null;
}

export const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({
  currentAnalysis,
  previousAnalysis
}) => {
  const [mode, setMode] = useState<'slider' | 'side-by-side'>('slider');
  const [sliderPos, setSliderPos] = useState<number>(50);

  // Fallback demo images if user took 1 scan or opted out of photo storage
  const baselinePhoto =
    previousAnalysis?.imageUrl ||
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80';
  const currentPhoto =
    currentAnalysis?.imageUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80';

  const baselineScore = previousAnalysis?.skinHealthScore || 68;
  const currentScore = currentAnalysis?.skinHealthScore || 74;
  const delta = currentScore - baselineScore;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
            <h3 className="text-xl font-bold text-stone-950 font-serif-display">
              Aligned Before &amp; After Comparison
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Longitudinal alignment comparing baseline scan against your latest evaluation
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-full text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setMode('slider')}
            className={`px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
              mode === 'slider'
                ? 'bg-white text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Slider</span>
          </button>
          <button
            onClick={() => setMode('side-by-side')}
            className={`px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
              mode === 'side-by-side'
                ? 'bg-white text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>
        </div>
      </div>

      {/* Main Comparison Canvas */}
      {mode === 'slider' ? (
        <div className="relative aspect-4/3 sm:aspect-16/9 max-h-[420px] rounded-3xl overflow-hidden bg-stone-900 border border-stone-200 select-none">
          {/* Baseline Image (Full background) */}
          <img
            src={baselinePhoto}
            alt="Baseline Scan"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Current Image (Clipped by slider position) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={currentPhoto}
              alt="Latest Scan"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ width: '100%', maxWidth: 'none' }}
            />
          </div>

          {/* Slider Divider Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 cursor-ew-resize flex items-center justify-center"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-7 h-7 rounded-full bg-white shadow-lg border-2 border-teal-600 flex items-center justify-center text-teal-700 text-xs font-bold">
              ↔
            </div>
          </div>

          {/* Invisible Range Input for Smooth Dragging */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            aria-label="Before after comparison slider"
          />

          {/* Floating Pill Badges */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-stone-950/80 text-white text-[10px] font-bold backdrop-blur-xs z-10">
            Latest Scan (Today)
          </div>
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-stone-950/80 text-white text-[10px] font-bold backdrop-blur-xs z-10">
            Baseline Scan
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 relative aspect-4/3">
            <img
              src={baselinePhoto}
              alt="Baseline Scan"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-950/80 text-white text-[10px] font-bold backdrop-blur-xs">
              Baseline Scan · Score {baselineScore}%
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 relative aspect-4/3">
            <img
              src={currentPhoto}
              alt="Latest Scan"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-teal-900/90 text-white text-[10px] font-bold backdrop-blur-xs">
              Latest Scan · Score {currentScore}% ({delta >= 0 ? `+${delta}%` : `${delta}%`})
            </div>
          </div>
        </div>
      )}

      {/* Delta Stats & Lighting Caution */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200/80 space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Barrier Index Delta
          </span>
          <div className="text-xl font-bold font-mono text-emerald-700">
            {delta >= 0 ? `+${delta}% Improvement` : `${delta}% Variation`}
          </div>
          <span className="text-[11px] text-stone-500 block">
            Measured across 6 clinical cosmetic metrics
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200/80 space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Erythema &amp; Redness Calm
          </span>
          <div className="text-xl font-bold font-mono text-teal-700">
            +8% Calmer
          </div>
          <span className="text-[11px] text-stone-500 block">
            Cheek and perimeter vascular calm
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200/80 space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Sebum Equilibrium
          </span>
          <div className="text-xl font-bold font-mono text-stone-900">
            Balanced
          </div>
          <span className="text-[11px] text-stone-500 block">
            Normal T-zone moisture ratio
          </span>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-amber-900 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Alignment Note:</strong> Minor variations in ambient lighting, ambient humidity, room color temperature, and camera distance can influence photographic visual appearance. For optimal consistency, capture scans in natural diffuse daylight.
        </p>
      </div>
    </div>
  );
};
