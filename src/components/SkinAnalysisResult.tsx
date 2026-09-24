import React from 'react';
import {
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Calendar,
  Activity,
  Layers,
  Heart
} from 'lucide-react';
import { SkinAnalysis } from '../types';
import { useApp } from '../context/AppContext';

interface SkinAnalysisResultProps {
  analysis: SkinAnalysis;
  onContinueToRoutine: () => void;
  onRetakeScan: () => void;
}

export const SkinAnalysisResult: React.FC<SkinAnalysisResultProps> = ({
  analysis,
  onContinueToRoutine,
  onRetakeScan
}) => {
  const { setActiveTab } = useApp();

  const metrics = [
    { label: 'Blemishes / Clarity', value: analysis.metrics.blemishes, color: 'emerald' },
    { label: 'Hydration Level', value: analysis.metrics.hydration, color: 'teal' },
    { label: 'Sebum & Oil Balance', value: analysis.metrics.oilBalance, color: 'amber' },
    { label: 'Surface Texture', value: analysis.metrics.texture, color: 'blue' },
    { label: 'Tone & Pigmentation', value: analysis.metrics.pigmentation, color: 'indigo' },
    { label: 'Redness / Sensitivity', value: analysis.metrics.redness, color: 'rose' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Banner & Retake Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Computer Vision Findings</span>
          <h1 className="text-2xl font-bold text-stone-900 font-serif-display">
            Your Skin Analysis Results
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Analyzed on {new Date(analysis.createdAt).toLocaleDateString()} · Multi-angle evaluation ({analysis.angles.join(', ')})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRetakeScan}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retake Scan
          </button>
          <button
            onClick={onContinueToRoutine}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-md shadow-teal-600/20 flex items-center gap-1.5"
          >
            <span>View Routine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Score & Appearance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
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
                strokeDasharray={`${(analysis.skinHealthScore / 100) * 251.2} 251.2`}
                strokeLinecap="round"
                className="text-teal-600"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold text-stone-900">{analysis.skinHealthScore}%</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Health Score</span>
            </div>
          </div>

          <h3 className="font-bold text-stone-800 text-sm">Overall Skin Health Index</h3>
          <p className="text-[11px] text-stone-500 mt-1 max-w-xs">
            Standardized cosmetic baseline measuring clarity, barrier hydration, and texture balance.
          </p>
        </div>

        {/* AI Appearance Estimate Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Visual Appearance</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700">Estimated</span>
            </div>
            
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-stone-900">{analysis.estimatedAppearanceAge}</span>
              <span className="text-sm font-semibold text-stone-500">years</span>
            </div>
            <p className="text-xs font-semibold text-stone-700 mt-1">AI Skin Appearance Estimate</p>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-500 leading-normal flex items-start gap-2">
            <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <span>{analysis.appearanceAgeDisclaimer}</span>
          </div>
        </div>

        {/* Photo Thumbnail if retained */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Visual Capture</span>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Secure
            </span>
          </div>

          <div className="my-3 rounded-xl overflow-hidden aspect-4/3 bg-stone-900 border border-stone-200 flex items-center justify-center relative">
            {analysis.imageUrl ? (
              <img
                src={analysis.imageUrl}
                alt="Analyzed face"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-4">
                <span className="text-xs text-stone-400">Photo processed anonymously without permanent retention</span>
              </div>
            )}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-stone-900/80 backdrop-blur text-[10px] font-mono text-teal-300">
              Landmarks Mapped
            </div>
          </div>

          <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Photos stored only per your privacy settings
          </div>
        </div>
      </div>

      {/* Metrics Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            Cosmetic Characteristic Breakdown
          </h3>
          <span className="text-xs text-stone-500">Higher score = clearer, more balanced</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-stone-700">{m.label}</span>
                <span className="font-bold text-stone-900">{m.value}%</span>
              </div>
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-teal-600 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${m.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Structured ML Findings */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-600" />
            Detected Surface Observations
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Non-medical visual assessments paired with confidence intervals
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {analysis.findings.map((f, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">{f.concern}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    f.severity === 'Severe' || f.severity === 'High'
                      ? 'bg-rose-100 text-rose-800'
                      : f.severity === 'Moderate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {f.severity} Severity
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">{f.visibleIndicators}</p>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-200/60 text-stone-500">
                <span>Location: <strong className="text-stone-700">{f.location}</strong></span>
                <span className="font-mono text-teal-700 font-semibold">{f.confidence}% Confidence</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dermatological Disclaimer Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-900">Important Cosmetic Boundary</p>
          <p className="leading-relaxed text-amber-800">
            {analysis.dermatologyDisclaimer}
          </p>
        </div>
      </div>

      {/* Continue CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onContinueToRoutine}
          className="px-7 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-lg shadow-teal-600/25 transition flex items-center gap-2"
        >
          <span>Continue to Personalized Routine</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
