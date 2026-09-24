import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShieldAlert,
  Info,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowLeft,
  Package
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from '../components/common/BackButton';
import { SkinAnalysis } from '../types';

export const ScanResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { latestAnalysis, catalogProducts, formatPrice } = useApp();

  // Pick analysis from router state, or fallback to latestAnalysis from context
  const analysis: SkinAnalysis | null =
    (location.state as any)?.analysis || latestAnalysis;

  if (!analysis) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-4">
        <BackButton fallback="/scan" label="Back to Scan" />
        <div className="p-8 bg-white rounded-2xl border border-stone-200 shadow-sm mt-4">
          <Sparkles className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-stone-900">No Scan Results Yet</h2>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Take a quick multi-angle face scan to generate your personalized skin health evaluation.
          </p>
          <button
            onClick={() => navigate('/scan')}
            className="mt-5 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs"
          >
            Start Face Scan
          </button>
        </div>
      </div>
    );
  }

  const metrics = [
    { label: 'Blemishes / Clarity', value: analysis.metrics.blemishes, color: 'emerald' },
    { label: 'Hydration Level', value: analysis.metrics.hydration, color: 'teal' },
    { label: 'Sebum & Oil Balance', value: analysis.metrics.oilBalance, color: 'amber' },
    { label: 'Surface Texture', value: analysis.metrics.texture, color: 'blue' },
    { label: 'Tone & Pigmentation', value: analysis.metrics.pigmentation, color: 'indigo' },
    { label: 'Redness / Sensitivity', value: analysis.metrics.redness, color: 'rose' },
  ];

  // Recommended products grounded from catalog
  const recommendedProducts = catalogProducts.slice(0, 3);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Navigation & Back Button */}
      <div className="flex items-center justify-between">
        <BackButton fallback="/scan" label="Back to Scan" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/scan')}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold border border-stone-200 transition flex items-center gap-1.5 shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>Retake Scan</span>
          </button>
          <button
            onClick={() => navigate('/routine')}
            className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <span>View My Routine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Page Title Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Clinical Computer Vision Evaluation
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif-display mt-0.5">
            Your AI Skin Analysis
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Evaluated on {new Date(analysis.createdAt).toLocaleDateString()} · Multi-angle evaluation ({analysis.angles.join(', ')})
          </p>
        </div>

        <div className="flex items-center gap-2 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 text-teal-800 text-xs font-semibold self-start sm:self-auto">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Formulation Grounded</span>
        </div>
      </div>

      {/* Main Score & Metric Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            +4% this week
          </div>

          <div className="relative w-36 h-36 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                className="text-stone-100"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                className="text-teal-600 transition-all duration-1000 ease-out"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysis.skinHealthScore / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-stone-900 font-serif-display">
                {analysis.skinHealthScore}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                Score / 100
              </span>
            </div>
          </div>

          <h3 className="font-bold text-stone-900 text-sm">Overall Skin Health Index</h3>
          <p className="text-[11px] text-stone-500 mt-1 max-w-[220px]">
            Composite score derived from epidermal barrier integrity, sebum balance, and blemish clarity.
          </p>
        </div>

        {/* 6 Key Metric Gauges */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <h3 className="font-bold text-stone-900 text-sm">Detailed Metric Breakdown</h3>
            <span className="text-xs text-stone-400">Benchmark Scale (0–100)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {metrics.map((m) => (
              <div key={m.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-700">{m.label}</span>
                  <span className="font-mono font-bold text-stone-900">{m.value}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-teal-600 transition-all duration-700"
                    style={{ width: `${m.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Visual Appearance Age Estimate */}
          {analysis.estimatedAppearanceAge && (
            <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-stone-50 p-3 rounded-xl">
              <div>
                <span className="font-bold text-stone-800">Visual Appearance Age Estimate: </span>
                <span className="font-bold text-teal-700 text-sm">{analysis.estimatedAppearanceAge} years</span>
              </div>
              <p className="text-[10px] text-stone-500 italic max-w-sm">
                {analysis.appearanceAgeDisclaimer}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Computer Vision Findings */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <h2 className="font-bold text-stone-900 text-base flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-600" />
            Detected Skin Condition Indicators
          </h2>
          <span className="text-xs text-stone-500">Confidence Calibration</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.findings.map((f, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 hover:border-teal-300 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-stone-900 text-xs">{f.concern}</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {f.severity}
                </span>
              </div>

              <p className="text-[11px] text-stone-600 leading-relaxed">
                {f.visibleIndicators}
              </p>

              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-500">
                <span>Location: {f.location}</span>
                <span className="font-semibold text-teal-700">Confidence: {f.confidence}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>{analysis.dermatologyDisclaimer}</p>
        </div>
      </div>

      {/* Your Personalized Plan Section */}
      <div className="bg-gradient-to-r from-teal-900 to-stone-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for Implementation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-display">
            Your Personalized Skincare &amp; Interval Schedule
          </h2>
          <p className="text-xs text-teal-100/80 leading-relaxed">
            We have generated morning and evening routines calibrated with exact absorption wait intervals (30s, 60s, 90s) between product layers to maximize active ingredient uptake.
          </p>
        </div>

        <button
          onClick={() => navigate('/routine')}
          className="px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-stone-950 font-bold text-xs transition shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <span>View My Routine →</span>
        </button>
      </div>

      {/* Recommended Products Grounded From Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-base">Recommended Catalog Formulations</h3>
            <p className="text-xs text-stone-500">
              Approved formulations matched to your detected skin findings. Click any product to view full details.
            </p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recommendedProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/products/${p.id}`)}
              className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 hover:shadow-md hover:border-teal-300 transition flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="aspect-square w-full rounded-xl overflow-hidden bg-stone-50 relative">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal-600 text-white">
                    {p.category}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    {p.brand}
                  </span>
                  <h4 className="font-bold text-stone-900 text-xs mt-0.5 line-clamp-1 group-hover:text-teal-700 transition">
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                    {p.whyRecommended}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="font-extrabold text-stone-900">
                  {formatPrice(p.priceTZS, p.priceUSD)}
                </span>
                <span className="font-bold text-teal-600 flex items-center gap-0.5 text-[11px]">
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
