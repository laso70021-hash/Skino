import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  Droplets,
  Utensils,
  Sun,
  Moon,
  CheckCircle2,
  Plus,
  RefreshCw,
  Sparkles,
  Info,
  Clock,
  Apple,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from '../components/common/BackButton';
import { CloseButton } from '../components/common/CloseButton';

export const WellnessPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    wellnessPlan,
    saveWellnessPlan,
    userProfile,
    latestAnalysis
  } = useApp();

  const [activeTab, setActiveTab] = useState<'nutrition' | 'schedule'>('nutrition');
  const [currentWaterMl, setCurrentWaterMl] = useState(1600);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Questionnaire form state
  const [mealsPerDay, setMealsPerDay] = useState('3');
  const [waterGoal, setWaterGoal] = useState('2500');
  const [dietStyle, setDietStyle] = useState('Balanced / Omnivore');
  const [accessibleFoods, setAccessibleFoods] = useState('Avocado, spinach, papaya, eggs, lentils, oranges, sweet potatoes');
  const [sleepSchedule, setSleepSchedule] = useState('22:30 - 06:30');

  const addWater = (amount: number) => {
    setCurrentWaterMl((prev) => Math.min(prev + amount, (wellnessPlan?.waterTargetMl || 2500) + 1000));
  };

  const toggleScheduleItem = (index: number) => {
    if (!wellnessPlan) return;
    const updated = [...wellnessPlan.schedule];
    updated[index].completed = !updated[index].completed;
    saveWellnessPlan({ ...wellnessPlan, schedule: updated });
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsGenerating(true);
      const res = await fetch('/api/gemini/wellness-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionnaire: {
            mealsPerDay,
            waterGoal,
            dietStyle,
            accessibleFoods,
            sleepSchedule
          },
          userProfile,
          skinAnalysis: latestAnalysis
        })
      });

      if (!res.ok) throw new Error('Failed to generate plan');
      const data = await res.json();

      await saveWellnessPlan({
        id: 'plan-' + Date.now(),
        userId: userProfile?.uid || 'guest_user',
        waterTargetMl: data.waterTargetMl || 2500,
        schedule: data.schedule || [],
        nutritionHighlights: data.nutritionHighlights || [],
        dietaryNote: data.dietaryNote || 'Balanced nutrition supports overall physiological wellbeing.',
        updatedAt: new Date().toISOString()
      });

      setIsQuestionnaireOpen(false);
    } catch (err: any) {
      console.error('Plan generation error:', err);
      setIsQuestionnaireOpen(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const waterPercent = Math.min(
    100,
    Math.round((currentWaterMl / (wellnessPlan?.waterTargetMl || 2500)) * 100)
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <BackButton fallback="/home" label="Back to Home" />
        <button
          onClick={() => setIsQuestionnaireOpen(true)}
          className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
        >
          <Sliders className="w-3.5 h-3.5 text-teal-600" />
          <span>Update Lifestyle Quiz</span>
        </button>
      </div>

      {/* Page Title & Sub-tabs */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Internal Cellular Health
          </span>
          <h1 className="text-2xl font-bold text-stone-900 font-serif-display mt-0.5">
            Wellness &amp; Nutrition
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Nutritional antioxidants, hydration pacing, and circadian health guidelines that reinforce skin barrier integrity.
          </p>
        </div>

        {/* Sub-page Navigation Tabs */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'nutrition'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Nutrition Plan
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'schedule'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Wellness Schedule ({wellnessPlan?.schedule.length || 0})
          </button>
        </div>
      </div>

      {/* Hydration Tracker Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Daily Hydration Tracker</h3>
              <p className="text-xs text-stone-500">
                Paced water intake helps maintain cellular turgor and dermal elasticity.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => addWater(250)}
              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> 250ml
            </button>
            <button
              onClick={() => addWater(500)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> 500ml
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-stone-700">{currentWaterMl} ml logged</span>
            <span className="text-stone-400">Target: {wellnessPlan?.waterTargetMl || 2500} ml ({waterPercent}%)</span>
          </div>
          <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${waterPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* NUTRITION PLAN SUB-PAGE */}
      {activeTab === 'nutrition' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <Apple className="w-4 h-4 text-teal-600" />
              Targeted Nutritional Pillars
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {wellnessPlan?.nutritionHighlights.map((nh, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stone-900 text-xs">Nutritional Focus #{idx + 1}</h4>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                      Pillar #{idx + 1}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">{nh}</p>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                {wellnessPlan?.dietaryNote ||
                  'Dietary guidance is provided as nutritional education to support dermatological and barrier health. It is not intended to treat medical deficiencies.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* WELLNESS SCHEDULE SUB-PAGE */}
      {activeTab === 'schedule' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            Circadian Wellness Timeline
          </h3>

          <div className="space-y-3">
            {wellnessPlan?.schedule.map((item, idx) => (
              <div
                key={idx}
                onClick={() => toggleScheduleItem(idx)}
                className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                  item.completed
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                    : 'bg-stone-50 border-stone-200 hover:border-teal-300 text-stone-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                    item.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 bg-white'
                  }`}>
                    {item.completed && <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-700">{item.time}</span>
                      <span className="font-bold text-xs text-stone-900">{item.title}</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">{item.description}</p>
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold text-stone-400 bg-white px-2 py-0.5 rounded border border-stone-200 shrink-0">
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Small Action Modal: Update Lifestyle Quiz */}
      {isQuestionnaireOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 sm:p-7 my-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div>
                <h3 className="font-bold text-stone-900 text-base">Personalized Wellness Questionnaire</h3>
                <p className="text-xs text-stone-500">Tune your plan to your daily diet and routine.</p>
              </div>
              <CloseButton onClick={() => setIsQuestionnaireOpen(false)} ariaLabel="Close questionnaire" />
            </div>

            <form onSubmit={handleGeneratePlan} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Target Daily Water Intake</label>
                <select
                  value={waterGoal}
                  onChange={(e) => setWaterGoal(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900"
                >
                  <option value="2000">2,000 ml (8 glasses)</option>
                  <option value="2500">2,500 ml (Standard)</option>
                  <option value="3000">3,000 ml (Active / Warm climate)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Dietary Philosophy</label>
                <select
                  value={dietStyle}
                  onChange={(e) => setDietStyle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900"
                >
                  <option value="Balanced / Omnivore">Balanced / Omnivore</option>
                  <option value="Plant-forward / Vegetarian">Plant-forward / Vegetarian</option>
                  <option value="Low dairy & low GI">Low dairy &amp; low GI</option>
                  <option value="Pescatarian">Pescatarian</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Locally Accessible Whole Foods</label>
                <textarea
                  rows={2}
                  value={accessibleFoods}
                  onChange={(e) => setAccessibleFoods(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuestionnaireOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 font-semibold text-xs hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing Plan...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Regenerate Wellness Plan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
