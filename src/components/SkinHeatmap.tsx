import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Layers, Lock, Info, ChevronRight, Activity } from 'lucide-react';
import { SkinAnalysis } from '../types';
import { useApp } from '../context/AppContext';

interface SkinHeatmapProps {
  analysis: SkinAnalysis;
}

type HeatmapMode = 'oil' | 'pores' | 'redness' | 'spots' | 'wrinkles' | 'texture' | 'hydration';

export const SkinHeatmap: React.FC<SkinHeatmapProps> = ({ analysis }) => {
  const navigate = useNavigate();
  const { entitlements } = useApp();
  const [activeMode, setActiveMode] = useState<HeatmapMode>('oil');

  const modes: { id: HeatmapMode; label: string; color: string; desc: string }[] = [
    { id: 'oil', label: 'Oil & Sebum', color: '#f59e0b', desc: 'Sebaceous lipid concentration across T-Zone & nasal bridge' },
    { id: 'pores', label: 'Pores', color: '#6366f1', desc: 'Visible follicular openings and pore dilation density' },
    { id: 'redness', label: 'Redness', color: '#f43f5e', desc: 'Vascular erythema and superficial micro-capillary flush' },
    { id: 'spots', label: 'Spots & Pigment', color: '#8b5cf6', desc: 'Localized post-inflammatory melanin clustering' },
    { id: 'texture', label: 'Texture', color: '#0ea5e9', desc: 'Micro-roughness and cellular turnover uniformity' },
    { id: 'wrinkles', label: 'Micro-Lines', color: '#ec4899', desc: 'Superficial expression lines and dehydration crevices' },
    { id: 'hydration', label: 'Hydration', color: '#10b981', desc: 'Epidermal moisture retention and bounce index' },
  ];

  const currentModeInfo = modes.find((m) => m.id === activeMode) || modes[0];
  const heatmapData = analysis.facialHeatmap?.[activeMode] || {
    intensity: activeMode === 'hydration' ? 76 : activeMode === 'oil' ? 68 : 42,
    areaRatio: activeMode === 'hydration' ? 60 : activeMode === 'oil' ? 22 : 14
  };

  // If tier does not have heatmaps (Free or Bronze)
  if (!entitlements.heatmaps) {
    return (
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-stone-900 to-stone-950 text-white p-6 sm:p-8 border border-stone-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-full border border-teal-800/60 inline-flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              Silver &amp; Gold Feature
            </span>
            <h3 className="text-xl font-bold font-serif-display text-white">
              Facial Heatmap Visualization &amp; Segmentation
            </h3>
            <p className="text-xs text-stone-400">
              Color-coded zonal mapping isolating oil, pores, redness, and dehydration across facial areas.
            </p>
          </div>

          <button
            onClick={() => navigate('/profile/subscription')}
            className="px-5 py-2.5 rounded-full bg-teal-400 hover:bg-teal-300 text-stone-950 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unlock Heatmaps</span>
          </button>
        </div>

        {/* Blurred preview mock */}
        <div className="relative h-64 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-center justify-center p-6 text-center backdrop-blur-md overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 max-w-sm space-y-2">
            <Activity className="w-8 h-8 text-teal-400 mx-auto" />
            <p className="text-sm font-bold text-stone-200">
              Visual Heatmap Overlays
            </p>
            <p className="text-xs text-stone-400">
              Available on Silver, Gold, Platinum, and Enterprise plans. Upgrade to see color-graded regional intensity and Area Ratio diagnostics.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
            <h3 className="text-xl font-bold text-stone-950 font-serif-display">
              Facial Heatmap Overlay &amp; Segmentation
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Zonal concern intensity mapping across forehead, cheeks, nose, and chin
          </p>
        </div>

        {/* Mode Selector Chips */}
        <div className="flex flex-wrap gap-1.5">
          {modes.map((mode) => {
            const isSel = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  isSel
                    ? 'bg-stone-950 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: mode.color }}
                />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Heatmap Stage */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Facial Silhouette with Color Heatmap Overlays */}
        <div className="md:col-span-7 relative flex items-center justify-center bg-[#faf8f5] rounded-3xl p-6 border border-stone-200/80 min-h-[340px]">
          {/* Facial Silhouette Graphic */}
          <div className="relative w-64 h-80 max-w-full flex items-center justify-center">
            {/* Base Face Contour SVG */}
            <svg
              viewBox="0 0 240 300"
              className="w-full h-full text-stone-300 stroke-stone-400 fill-stone-100/50"
              strokeWidth="2"
            >
              {/* Head Outline */}
              <path
                d="M 120,20 C 60,20 30,70 30,140 C 30,220 70,280 120,280 C 170,280 210,220 210,140 C 210,70 180,20 120,20 Z"
                className="fill-stone-100/80 stroke-stone-300"
              />

              {/* Forehead Zone */}
              <path
                d="M 60,70 C 60,50 90,40 120,40 C 150,40 180,50 180,70 C 180,95 150,95 120,95 C 90,95 60,95 60,70 Z"
                fill={currentModeInfo.color}
                fillOpacity={
                  activeMode === 'oil' ? 0.65 : activeMode === 'hydration' ? 0.55 : 0.4
                }
                className="transition-all duration-500"
              />

              {/* Nose Bridge Zone */}
              <path
                d="M 110,105 L 130,105 L 135,165 L 105,165 Z"
                fill={currentModeInfo.color}
                fillOpacity={
                  activeMode === 'oil' || activeMode === 'pores' ? 0.75 : 0.35
                }
                className="transition-all duration-500"
              />

              {/* Left Cheek Zone */}
              <path
                d="M 45,130 C 45,110 75,115 95,135 C 95,170 70,195 50,175 C 40,165 45,145 45,130 Z"
                fill={currentModeInfo.color}
                fillOpacity={
                  activeMode === 'redness' || activeMode === 'spots' ? 0.7 : 0.45
                }
                className="transition-all duration-500"
              />

              {/* Right Cheek Zone */}
              <path
                d="M 195,130 C 195,110 165,115 145,135 C 145,170 170,195 190,175 C 200,165 195,145 195,130 Z"
                fill={currentModeInfo.color}
                fillOpacity={
                  activeMode === 'hydration' ? 0.65 : activeMode === 'texture' ? 0.55 : 0.4
                }
                className="transition-all duration-500"
              />

              {/* Chin Zone */}
              <path
                d="M 85,210 C 85,190 120,195 155,190 C 155,230 135,260 120,260 C 105,260 85,230 85,210 Z"
                fill={currentModeInfo.color}
                fillOpacity={
                  activeMode === 'oil' ? 0.55 : activeMode === 'spots' ? 0.45 : 0.35
                }
                className="transition-all duration-500"
              />

              {/* Subtle Landmark Crosshairs */}
              <circle cx="85" cy="115" r="3" fill="#78716c" opacity="0.6" />
              <circle cx="155" cy="115" r="3" fill="#78716c" opacity="0.6" />
              <line x1="110" y1="185" x2="130" y2="185" stroke="#78716c" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            </svg>

            {/* Floating Zone Tag */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-stone-200 shadow-2xs text-[10px] font-bold text-stone-700">
              Zone: <span className="text-stone-900">{currentModeInfo.label}</span>
            </div>

            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-stone-200 shadow-2xs text-[10px] font-mono font-bold text-stone-900">
              {heatmapData.intensity}% Intensity
            </div>
          </div>
        </div>

        {/* Right: Technical Analytics & Area Ratio */}
        <div className="md:col-span-5 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
              Active Evaluation Parameter
            </span>
            <h4 className="text-xl font-bold text-stone-950 font-serif-display">
              {currentModeInfo.label}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {currentModeInfo.desc}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200/80 space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Intensity Level
              </span>
              <div className="text-2xl font-bold font-mono text-stone-900">
                {heatmapData.intensity}/100
              </div>
              <span className="text-[11px] font-bold text-teal-700 block">
                {heatmapData.intensity < 40 ? 'Calm / Low' : heatmapData.intensity < 70 ? 'Moderate' : 'Concentrated'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200/80 space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Area Ratio
              </span>
              <div className="text-2xl font-bold font-mono text-stone-900">
                {heatmapData.areaRatio}%
              </div>
              <span className="text-[11px] text-stone-500 block">
                Of total facial surface
              </span>
            </div>
          </div>

          {/* Clinical Cosmetic Guidance Note */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs space-y-1 text-stone-600">
            <div className="flex items-center gap-1.5 font-bold text-stone-900">
              <Info className="w-3.5 h-3.5 text-teal-700" />
              <span>Diagnostic Takeaway</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {activeMode === 'oil' && 'Concentrated in nasal and central forehead zones. A lightweight non-comedogenic gel and Niacinamide balance daily lipid levels.'}
              {activeMode === 'pores' && 'Mild visible enlargement in medial cheeks and nasal bridge. Maintain consistent 45s gentle cleansing without physical scrubs.'}
              {activeMode === 'redness' && 'Mild surface erythema along cheek perimeters. Avoid harsh glycolic acids or hot water; prioritize Madecassoside and Panthenol.'}
              {activeMode === 'spots' && 'Faint post-inflammatory melanin. Azelaic acid and daily broad-spectrum SPF 50+ provide optimal fading and UV prevention.'}
              {activeMode === 'wrinkles' && 'Minimal micro-texture observed. Daily hydration checkpoint adherence supports natural dermal plumpness.'}
              {activeMode === 'hydration' && 'Well-distributed epidermal water binding. Evening occlusive balm helps lock in moisture overnight.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
