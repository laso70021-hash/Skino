import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Camera,
  Layers,
  Clock,
  Trash2,
  CheckCircle2,
  Calendar,
  Activity,
  ArrowRight,
  TrendingUp,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from '../components/common/BackButton';
import { CloseButton } from '../components/common/CloseButton';

export const MySkinPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    latestAnalysis,
    analyses,
    deleteAnalysis
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [scanToDelete, setScanToDelete] = useState<string | null>(null);

  const confirmDeleteScan = async () => {
    if (scanToDelete) {
      await deleteAnalysis(scanToDelete);
      setScanToDelete(null);
    }
  };

  const beforePhoto =
    analyses.length > 1
      ? analyses[analyses.length - 1]?.imageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80';

  const afterPhoto =
    latestAnalysis?.imageUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <BackButton fallback="/home" label="Back to Home" />
        <button
          onClick={() => navigate('/scan')}
          className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>New Skin Scan</span>
        </button>
      </div>

      {/* Page Title & Sub-tabs */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Dermatological Profile
          </span>
          <h1 className="text-2xl font-bold text-stone-900 font-serif-display mt-0.5">
            My Skin
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Overview of your skin barrier characteristics, active metrics, and historical scan timeline.
          </p>
        </div>

        {/* Sub-page Navigation Tabs */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'overview'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Skin Overview
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'history'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Analysis History ({analyses.length})
          </button>
        </div>
      </div>

      {/* OVERVIEW SUB-PAGE */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main Health Index & Quick Attributes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score summary */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                Current Health Score
              </span>
              <div className="my-3 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-stone-900 font-serif-display">
                  {latestAnalysis?.skinHealthScore || 74}
                </span>
                <span className="text-sm font-bold text-stone-400">/100</span>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                +4% Improvement
              </div>
              <button
                onClick={() => navigate('/scan/results')}
                className="mt-4 text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <span>View Full Scan Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Profile Attributes */}
            <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                Active Biological Profile
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Skin Type</span>
                  <span className="font-bold text-stone-800 text-sm">{userProfile?.skinType || 'Combination'}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Age Demographic</span>
                  <span className="font-bold text-stone-800 text-sm">{userProfile?.ageRange || '25-34'}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Region / Climate</span>
                  <span className="font-bold text-stone-800 text-sm">{userProfile?.country || 'Tanzania'}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide block mb-1.5">
                  Primary Concerns:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(userProfile?.skinConcerns || ['Oiliness', 'Blemishes', 'Dark Spots']).map((c, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Metric Overview Bars */}
          {latestAnalysis && (
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-bold text-stone-900 text-sm">Cutaneous Metric Spectrum</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(latestAnalysis.metrics).map(([k, v]) => (
                  <div key={k} className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                    <div className="flex justify-between text-xs capitalize">
                      <span className="font-medium text-stone-600">{k}</span>
                      <span className="font-mono font-bold text-stone-900">{v}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden">
                      <div className="h-full bg-teal-600 rounded-full" style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Routing Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => navigate('/routine')}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-teal-300 hover:shadow-md transition cursor-pointer flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-stone-900 text-sm">Personalized Skincare Routine</h4>
                <p className="text-xs text-stone-500 mt-0.5">Morning &amp; evening steps with exact wait timers</p>
              </div>
              <ArrowRight className="w-4 h-4 text-teal-600" />
            </div>

            <div
              onClick={() => navigate('/products')}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-teal-300 hover:shadow-md transition cursor-pointer flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-stone-900 text-sm">Approved Cosmetic Products</h4>
                <p className="text-xs text-stone-500 mt-0.5">Vetted catalog with active ingredient compatibility</p>
              </div>
              <ArrowRight className="w-4 h-4 text-teal-600" />
            </div>
          </div>
        </div>
      )}

      {/* ANALYSIS HISTORY SUB-PAGE */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Before & After Interactive Slider */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-base">Visual Progression Comparison</h3>
                <p className="text-xs text-stone-500">Drag the slider to compare baseline scan vs latest evaluation.</p>
              </div>
              <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                Split {sliderPos}%
              </span>
            </div>

            <div className="relative aspect-4/3 sm:aspect-16/9 w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-stone-200 select-none shadow-md">
              {/* After Photo (Right) */}
              <img
                src={afterPhoto}
                alt="Latest scan"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-900/80 text-white backdrop-blur">
                Now
              </span>

              {/* Before Photo (Left clipped) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={beforePhoto}
                  alt="Baseline scan"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: '100%' }}
                />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-900/80 text-white backdrop-blur">
                  Baseline
                </span>
              </div>

              {/* Dividing Slider Line */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize flex items-center justify-center"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-white shadow-lg border border-stone-300 text-stone-700 flex items-center justify-center text-xs font-bold -ml-3.5">
                  ↔
                </div>
              </div>

              {/* Range Input Overlay */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
              />
            </div>
          </div>

          {/* Historical Scans List */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-900 text-base">Recorded Scan Evaluations</h3>

            <div className="space-y-3">
              {analyses.map((scan, idx) => (
                <div
                  key={scan.id}
                  className="p-4 rounded-xl border border-stone-200 hover:border-teal-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    {scan.imageUrl ? (
                      <img
                        src={scan.imageUrl}
                        alt="Scan thumbnail"
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400">
                        <Camera className="w-5 h-5" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">
                          Scan #{analyses.length - idx}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                          Score: {scan.skinHealthScore}/100
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {new Date(scan.createdAt).toLocaleDateString()} at{' '}
                        {new Date(scan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {scan.angles.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => navigate('/scan/results', { state: { analysis: scan } })}
                      className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition"
                    >
                      View Report
                    </button>
                    <button
                      onClick={() => setScanToDelete(scan.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete this scan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Small Action Modal: Confirm Delete Scan */}
      {scanToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-stone-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-base">Confirm Scan Deletion</h3>
              <CloseButton onClick={() => setScanToDelete(null)} ariaLabel="Cancel deletion" />
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to delete this scan record and its associated photo? This action cannot be undone.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setScanToDelete(null)}
                className="px-4 py-2 rounded-xl text-stone-600 font-semibold text-xs hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteScan}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
              >
                Delete Scan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
