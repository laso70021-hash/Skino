import React, { useState } from 'react';
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
  Package,
  FileText,
  Activity,
  Sliders,
  Split,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from '../components/common/BackButton';
import { SkinAnalysis } from '../types';
import { SkinHeatmap } from '../components/SkinHeatmap';
import { SkinRadarChart } from '../components/SkinRadarChart';
import { FacialZoneAnalysis } from '../components/FacialZoneAnalysis';
import { BeforeAfterComparison } from '../components/BeforeAfterComparison';
import { ExportSkinReportModal } from '../components/ExportSkinReportModal';

export const ScanResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { latestAnalysis, analyses, catalogProducts, formatPrice, entitlements } = useApp();
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Pick analysis from router state, or fallback to latestAnalysis from context
  const analysis: SkinAnalysis | null =
    (location.state as any)?.analysis || latestAnalysis;

  const previousAnalysis = analyses.length > 1 ? analyses[1] : null;

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
            className="mt-5 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs cursor-pointer"
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
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Top Navigation & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <BackButton fallback="/dashboard" label="Back to Dashboard" />
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsReportOpen(true)}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold border border-stone-200 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-stone-600" />
            <span>Export Report</span>
          </button>
          <button
            onClick={() => navigate('/scan')}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold border border-stone-200 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>Retake Scan</span>
          </button>
          <button
            onClick={() => navigate('/routine')}
            className="px-4 py-1.5 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>View My Routine</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-300" />
          </button>
        </div>
      </div>

      {/* Page Title Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
            Skina Computer Vision Evaluation
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-950 font-serif-display mt-0.5">
            Your Comprehensive Skin Analysis
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Evaluated on {new Date(analysis.createdAt).toLocaleDateString()} · Multi-angle evaluation ({analysis.angles.join(', ')}) · {analysis.modelVersion || 'Gemini 3.8'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200 text-teal-900 text-xs font-bold self-start sm:self-auto">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Formulation Grounded</span>
        </div>
      </div>

      {/* Main Score & Metric Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/80 shadow-2xs flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            +4% this week
          </div>

          <div className="relative w-36 h-36 flex items-center justify-center my-3">
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
        <div className="md:col-span-2 bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/80 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <h3 className="font-bold text-stone-900 text-sm">Detailed Metric Breakdown</h3>
            <span className="text-xs text-stone-400 font-mono">0–100 Scale</span>
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
            <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-[#faf8f5] p-3 rounded-2xl">
              <div>
                <span className="font-bold text-stone-800">Visual Appearance Age Estimate: </span>
                <span className="font-bold text-teal-800 text-sm font-mono ml-1">{analysis.estimatedAppearanceAge} years</span>
              </div>
              <p className="text-[10px] text-stone-500 italic max-w-sm">
                {analysis.appearanceAgeDisclaimer}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MULTI-DIMENSIONAL RADAR CHART */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
              <h3 className="text-xl font-bold text-stone-950 font-serif-display">
                Multi-Dimensional Skin Radar
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Simultaneous pentagonal mapping of Hydration, Sebum, Pores, Spots, Wrinkles, and Texture
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            6 Core Dimensions
          </span>
        </div>

        <SkinRadarChart metrics={analysis.radarMetrics} />
      </div>

      {/* FACIAL HEATMAP OVERLAY & SEGMENTATION */}
      <SkinHeatmap analysis={analysis} />

      {/* ZONE-BY-ZONE FACIAL DIAGNOSTICS */}
      <FacialZoneAnalysis zones={analysis.facialZones} />

      {/* ALIGNED BEFORE & AFTER COMPARISON */}
      <BeforeAfterComparison
        currentAnalysis={analysis}
        previousAnalysis={previousAnalysis}
      />

      {/* Computer Vision Findings */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h2 className="font-bold text-stone-900 text-base flex items-center gap-2 font-serif-display">
            <Layers className="w-4 h-4 text-teal-600" />
            Detected Skin Condition Indicators
          </h2>
          <span className="text-xs text-stone-500">Confidence Calibration</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.findings.map((f, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200/80 space-y-2 hover:border-teal-300 transition"
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

        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>{analysis.dermatologyDisclaimer}</p>
        </div>
      </div>

      {/* Your Personalized Plan Section */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for Implementation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-display">
            Your Personalized Skincare &amp; Interval Schedule
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed">
            We have generated morning and evening routines calibrated with exact absorption wait intervals (30s, 60s, 90s) between product layers to maximize active ingredient uptake.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/routine')}
            className="px-6 py-3.5 rounded-full bg-white hover:bg-stone-100 text-stone-950 font-bold text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View My Routine →</span>
          </button>
          <button
            onClick={() => navigate('/coach')}
            className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-teal-300" />
            <span>Ask Skina AI</span>
          </button>
        </div>
      </div>

      {/* Recommended Products Grounded From Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-base font-serif-display">Recommended Catalog Formulations</h3>
            <p className="text-xs text-stone-500">
              Approved formulations matched to your detected skin findings. Click any product to view full details.
            </p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 cursor-pointer"
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
              className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs p-4 hover:shadow-md hover:border-stone-400 transition flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-stone-50 relative">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-stone-950/80 text-white backdrop-blur-xs">
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

              <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">
                  {formatPrice(p.priceTZS, p.priceUSD)}
                </span>
                <span className="text-[11px] font-bold text-teal-800 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  View Formulation →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Report Modal */}
      <ExportSkinReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        analysis={analysis}
      />
    </div>
  );
};
