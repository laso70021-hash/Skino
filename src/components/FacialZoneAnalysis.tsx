import React from 'react';
import { FacialZoneInfo } from '../types';
import { Layers, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface FacialZoneAnalysisProps {
  zones?: {
    forehead?: FacialZoneInfo;
    leftCheek?: FacialZoneInfo;
    rightCheek?: FacialZoneInfo;
    nose?: FacialZoneInfo;
    chin?: FacialZoneInfo;
  };
}

export const FacialZoneAnalysis: React.FC<FacialZoneAnalysisProps> = ({ zones }) => {
  const defaultZones = {
    forehead: {
      observation: 'Moderate surface sebum accumulation across central brow; minimal micro-lines.',
      metric: 72,
      severity: 'Moderate' as const,
      recommendation: 'Niacinamide serum morning and evening to regulate sebaceous activity.'
    },
    leftCheek: {
      observation: 'Subtle post-inflammatory erythema with good dermal moisture bounce.',
      metric: 76,
      severity: 'Low' as const,
      recommendation: 'Azelaic acid treatment to gently calm erythema and promote even tone.'
    },
    rightCheek: {
      observation: 'Healthy epidermal hydration; faint isolated melanin clustering.',
      metric: 80,
      severity: 'Normal' as const,
      recommendation: 'Daily broad-spectrum SPF 50+ to protect melanocytes from UV escalation.'
    },
    nose: {
      observation: 'Enlarged follicular openings with superficial sebum oxidation.',
      metric: 66,
      severity: 'Moderate' as const,
      recommendation: 'Double cleansing with gentle non-stripping surfactant in the evening.'
    },
    chin: {
      observation: 'Occasional closed comedone pattern near lower vermilion border.',
      metric: 74,
      severity: 'Low' as const,
      recommendation: 'Maintain consistent cleansing intervals and avoid pore-clogging heavy waxes.'
    }
  };

  const activeZones = zones || defaultZones;

  const zoneList = [
    { key: 'forehead', label: 'Forehead Zone', data: activeZones.forehead || defaultZones.forehead },
    { key: 'leftCheek', label: 'Left Cheek Zone', data: activeZones.leftCheek || defaultZones.leftCheek },
    { key: 'rightCheek', label: 'Right Cheek Zone', data: activeZones.rightCheek || defaultZones.rightCheek },
    { key: 'nose', label: 'Nose & Alar Groove', data: activeZones.nose || defaultZones.nose },
    { key: 'chin', label: 'Chin & Mandibular Edge', data: activeZones.chin || defaultZones.chin },
  ];

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'High':
      case 'Severe':
        return 'text-rose-800 bg-rose-50 border-rose-200';
      case 'Moderate':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'Low':
        return 'text-teal-800 bg-teal-50 border-teal-200';
      default:
        return 'text-emerald-800 bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-700" />
            <h3 className="text-xl font-bold text-stone-950 font-serif-display">
              Zone-by-Zone Facial Diagnostics
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Anatomical segmentation mapping regional barrier resilience and active ingredients
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-stone-400 hidden sm:inline">
          5 Zones Evaluated
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {zoneList.map((z) => (
          <div
            key={z.key}
            className="p-5 rounded-2xl bg-[#faf8f5] border border-stone-200/80 shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-950 text-sm font-serif-display">
                  {z.label}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getSeverityBadge(z.data.severity)}`}>
                  {z.data.severity}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-stone-900">
                  {z.data.metric}
                </span>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                  Health Index / 100
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                {z.data.observation}
              </p>
            </div>

            <div className="pt-2 border-t border-stone-200/60 text-xs">
              <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block mb-0.5">
                Targeted Care
              </span>
              <p className="text-[11px] text-stone-700 font-medium">
                {z.data.recommendation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
