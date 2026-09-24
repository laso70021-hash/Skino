import React from 'react';
import { Download, Printer, X, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SkinAnalysis } from '../types';
import { useApp } from '../context/AppContext';

interface ExportSkinReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: SkinAnalysis;
}

export const ExportSkinReportModal: React.FC<ExportSkinReportModalProps> = ({
  isOpen,
  onClose,
  analysis
}) => {
  const { userProfile, morningRoutine, eveningRoutine } = useApp();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl p-6 sm:p-8 space-y-6 my-8 border border-stone-200 animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-stone-950 text-white flex items-center justify-center font-bold text-xs">
              S
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-950 font-serif-display">
                Skina Comprehensive Skin Report
              </h3>
              <p className="text-xs text-stone-500">
                Official AI Skin Intelligence Summary
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Document Canvas */}
        <div className="bg-[#faf8f5] p-6 rounded-2xl border border-stone-200/80 space-y-5 text-xs text-stone-800 print:bg-white print:border-none print:p-0">
          {/* Header block */}
          <div className="flex justify-between items-start border-b border-stone-200/80 pb-4">
            <div>
              <strong className="text-base font-bold text-stone-950 block font-serif-display">
                Patient / Member: {userProfile?.displayName || 'Amina'}
              </strong>
              <span className="text-stone-500">Skin Type: {userProfile?.skinType || 'Combination'}</span>
              <span className="text-stone-400 block mt-0.5">Report Date: {new Date(analysis.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                Tier: {userProfile?.subscriptionTier.toUpperCase() || 'GOLD'}
              </span>
              <div className="text-xl font-extrabold font-serif-display text-stone-950 mt-1">
                Score: {analysis.skinHealthScore}/100
              </div>
            </div>
          </div>

          {/* Metrics summary */}
          <div>
            <strong className="font-bold text-stone-900 block mb-2">Evaluated Skin Health Metrics:</strong>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-white border border-stone-200/80">
                <span className="text-[10px] text-stone-400 block uppercase font-bold">Hydration</span>
                <span className="font-bold text-stone-900 text-sm">{analysis.metrics.hydration}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-200/80">
                <span className="text-[10px] text-stone-400 block uppercase font-bold">Oil Balance</span>
                <span className="font-bold text-stone-900 text-sm">{analysis.metrics.oilBalance}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-200/80">
                <span className="text-[10px] text-stone-400 block uppercase font-bold">Texture</span>
                <span className="font-bold text-stone-900 text-sm">{analysis.metrics.texture}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-200/80">
                <span className="text-[10px] text-stone-400 block uppercase font-bold">Tone Evenness</span>
                <span className="font-bold text-stone-900 text-sm">{analysis.metrics.pigmentation}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-200/80">
                <span className="text-[10px] text-stone-400 block uppercase font-bold">Vascular Calm</span>
                <span className="font-bold text-stone-900 text-sm">{analysis.metrics.redness}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-200/80">
                <span className="text-[10px] text-stone-400 block uppercase font-bold">Blemish Clarity</span>
                <span className="font-bold text-stone-900 text-sm">{analysis.metrics.blemishes}%</span>
              </div>
            </div>
          </div>

          {/* Primary Findings */}
          <div>
            <strong className="font-bold text-stone-900 block mb-1.5">Observed Cosmetic Characteristics:</strong>
            <div className="space-y-1.5">
              {analysis.findings.map((f, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white border border-stone-200/80 flex items-start justify-between">
                  <div>
                    <span className="font-bold text-stone-900 block">{f.concern}</span>
                    <span className="text-stone-500 text-[11px]">{f.visibleIndicators}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                    {f.severity} ({f.confidence}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Recommended Routine Steps */}
          <div>
            <strong className="font-bold text-stone-900 block mb-1.5">Formulation Regimen (Morning &amp; Evening):</strong>
            <div className="space-y-1 text-[11px] text-stone-600">
              <div className="p-2 bg-white rounded-lg border border-stone-200/60">
                <strong>AM Sequence: </strong>
                {morningRoutine?.steps.map(s => s.productName).join(' → ') || 'Cleanser → Serum → Moisturizer → SPF 50'}
              </div>
              <div className="p-2 bg-white rounded-lg border border-stone-200/60">
                <strong>PM Sequence: </strong>
                {eveningRoutine?.steps.map(s => s.productName).join(' → ') || 'Double Cleanse → Azelaic Acid → Barrier Balm'}
              </div>
            </div>
          </div>

          {/* Medical disclaimer */}
          <div className="pt-2 border-t border-stone-200/80 text-[10px] text-stone-400 leading-tight">
            This report represents cosmetic wellness and formulation advisory data generated via Skina computer-vision models. It does not constitute a medical diagnosis. Consult a board-certified dermatologist for persistent, painful, or infectious skin conditions.
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-full border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs transition flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
