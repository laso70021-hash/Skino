import React, { useState } from 'react';
import {
  TrendingUp,
  Camera,
  Trash2,
  Lock,
  Download,
  Shield,
  Layers,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SkinAnalysis } from '../types';

interface ProgressViewProps {
  onStartNewScan: () => void;
  onOpenPrivacy: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  onStartNewScan,
  onOpenPrivacy
}) => {
  const { analyses, deleteAnalysis, deleteAllPhotosAndScans } = useApp();

  const [compareBefore, setCompareBefore] = useState<SkinAnalysis | null>(
    analyses.length > 1 ? analyses[analyses.length - 1] : analyses[0] || null
  );
  const [compareNow, setCompareNow] = useState<SkinAnalysis | null>(
    analyses.length > 0 ? analyses[0] : null
  );

  const [sliderPosition, setSliderPosition] = useState(50);

  const oldestScore = analyses.length > 0 ? analyses[analyses.length - 1].skinHealthScore : 74;
  const latestScore = analyses.length > 0 ? analyses[0].skinHealthScore : 74;
  const delta = latestScore - oldestScore;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Track Improvements</span>
          <h1 className="text-2xl font-bold text-stone-900 font-serif-display">
            Skin Progress &amp; Comparison
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor cosmetic skin index trends and compare visual features over time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPrivacy}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Privacy &amp; Data Deletion</span>
          </button>

          <button
            onClick={onStartNewScan}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-teal-600/20"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>+ New Scan</span>
          </button>
        </div>
      </div>

      {/* Progress Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-stone-500">Overall Score Evolution</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900">{latestScore}%</span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                delta >= 0
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              <TrendingUp className="w-3 h-3" /> {delta >= 0 ? `+${delta}%` : `${delta}%`}
            </span>
          </div>
          <p className="text-[11px] text-stone-500">
            Across {analyses.length} logged computer-vision evaluation{analyses.length === 1 ? '' : 's'}.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-stone-500">Hydration Gain</span>
          <div className="text-3xl font-extrabold text-teal-600">+12%</div>
          <p className="text-[11px] text-stone-500">
            Attributed to scheduled serum intervals and 2.5L daily hydration target.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-stone-500">Blemish Clarity</span>
          <div className="text-3xl font-extrabold text-emerald-600">+8%</div>
          <p className="text-[11px] text-stone-500">
            Visible papules and dark spots normalized with Azelaic acid &amp; Niacinamide.
          </p>
        </div>
      </div>

      {/* Before / Now Photo Slider Comparison */}
      {compareBefore && compareNow && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-stone-900 text-base">Before vs. Now Visual Comparison</h3>
              <p className="text-xs text-stone-500">
                Drag slider to evaluate skin texture and blemish recovery.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500">Comparing:</span>
              <span className="font-bold text-stone-700">
                {new Date(compareBefore.createdAt).toLocaleDateString()}
              </span>
              <span className="text-stone-400">vs</span>
              <span className="font-bold text-teal-700">
                {new Date(compareNow.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Interactive Comparison Slider */}
          <div className="relative aspect-16/9 sm:aspect-2/1 max-w-3xl mx-auto rounded-xl overflow-hidden border border-stone-300 select-none">
            {/* "Now" Image (Background) */}
            <img
              src={
                compareNow.imageUrl ||
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80'
              }
              alt="Now"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur text-white px-2.5 py-1 rounded text-xs font-bold z-10">
              Now ({compareNow.skinHealthScore}%)
            </div>

            {/* "Before" Image (Clipped Foreground) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={
                  compareBefore.imageUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
                }
                alt="Before"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%', height: '100%' }}
              />
              <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur text-white px-2.5 py-1 rounded text-xs font-bold z-10">
                Before ({compareBefore.skinHealthScore}%)
              </div>
            </div>

            {/* Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-stone-700 text-xs font-bold">
                ↔
              </div>
            </div>

            {/* Range Input Overlay */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
            />
          </div>
        </div>
      )}

      {/* Historical Scans List */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-stone-900 text-sm">Scan History Log</h3>
          <span className="text-xs text-stone-500">
            {analyses.length} scan{analyses.length === 1 ? '' : 's'} recorded
          </span>
        </div>

        <div className="space-y-3">
          {analyses.map((scan, idx) => (
            <div
              key={scan.id}
              className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-stone-900 text-white font-extrabold flex items-center justify-center text-sm shrink-0">
                  {scan.skinHealthScore}%
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">
                      Scan #{analyses.length - idx}
                    </span>
                    <span className="text-stone-400">·</span>
                    <span className="text-stone-500 font-mono">
                      {new Date(scan.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-600 mt-0.5">
                    Estimated appearance age: {scan.estimatedAppearanceAge} yrs · Blemishes: {scan.metrics.blemishes}% · Hydration: {scan.metrics.hydration}%
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => deleteAnalysis(scan.id)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Delete this scan from history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-[11px] text-stone-600 leading-relaxed">
        <strong>Responsible Medical Note:</strong> Score progression reflects cosmetic appearance indicators and routine consistency; not intended as medical proof of efficacy or disease diagnosis.
      </div>
    </div>
  );
};
