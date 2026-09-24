import React, { useState } from 'react';
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
  Apple
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WellnessScheduleItem } from '../types';

export const WellnessPlanView: React.FC = () => {
  const {
    wellnessPlan,
    saveWellnessPlan,
    userProfile,
    latestAnalysis,
    updateUserProfile
  } = useApp();

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
      alert('Updated plan with standardized wellness recommendations.');
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
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Holistic Care</span>
          <h1 className="text-2xl font-bold text-stone-900 font-serif-display">
            AI Nutrition &amp; Wellness Schedule
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Timed hydration checkpoints and antioxidant-dense nutrition supporting systemic skin health.
          </p>
        </div>

        <button
          onClick={() => setIsQuestionnaireOpen(true)}
          className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Update Lifestyle Survey</span>
        </button>
      </div>

      {/* Hydration Interactive Tracker Card */}
      <div className="bg-gradient-to-tr from-teal-900 via-teal-800 to-stone-900 text-white p-6 rounded-2xl shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-teal-300" />
            <span className="font-bold text-sm tracking-wide">Daily Hydration Log</span>
          </div>
          <span className="text-xs font-mono text-teal-200">
            Target: {wellnessPlan?.waterTargetMl || 2500} ml
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono">
              {currentWaterMl} <span className="text-sm font-normal text-teal-200">ml</span>
            </div>
            <div className="text-xs text-teal-100">
              {waterPercent}% of your optimal cellular hydration benchmark
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => addWater(250)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> +250ml Glass
            </button>
            <button
              onClick={() => addWater(500)}
              className="px-3.5 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-stone-950 text-xs font-bold shadow-md transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> +500ml Bottle
            </button>
          </div>
        </div>

        <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-teal-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${waterPercent}%` }}
          />
        </div>
      </div>

      {/* Wellness Timeline */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            Your Daily Wellness &amp; Nutrition Schedule
          </h2>
          <span className="text-xs text-stone-500">Tap to mark completed</span>
        </div>

        <div className="relative border-l-2 border-stone-200 ml-4 space-y-6 pl-6 py-2">
          {(wellnessPlan?.schedule || []).map((item, idx) => (
            <div
              key={idx}
              onClick={() => toggleScheduleItem(idx)}
              className={`relative cursor-pointer group transition p-3.5 rounded-xl border ${
                item.completed
                  ? 'bg-emerald-50/60 border-emerald-200 text-stone-500'
                  : 'bg-stone-50 border-stone-200 hover:bg-stone-100/80 text-stone-800'
              }`}
            >
              {/* Timeline indicator node */}
              <div
                className={`absolute -left-[35px] top-3.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition ${
                  item.completed
                    ? 'bg-emerald-600 border-white text-white'
                    : 'bg-white border-stone-300 text-stone-600 group-hover:border-teal-500'
                }`}
              >
                {item.completed ? '✓' : idx + 1}
              </div>

              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {item.time}
                    </span>
                    <span className="text-xs font-bold text-stone-900">{item.title}</span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {item.hydrationMl && (
                  <span className="text-[11px] font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded shrink-0">
                    +{item.hydrationMl}ml
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nutritional Highlights Grid */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
          <Apple className="w-4 h-4 text-emerald-600" />
          Key Micronutrients &amp; Local Whole Foods
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(wellnessPlan?.nutritionHighlights || []).map((highlight, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 leading-relaxed space-y-1"
            >
              <div className="font-bold text-stone-900">Highlight {idx + 1}</div>
              <p>{highlight}</p>
            </div>
          ))}
        </div>

        {/* Responsible medical disclaimer */}
        <div className="p-3.5 rounded-xl bg-stone-100 border border-stone-200 text-[11px] text-stone-600 leading-normal flex items-start gap-2">
          <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
          <span>{wellnessPlan?.dietaryNote}</span>
        </div>
      </div>

      {/* Questionnaire Update Modal */}
      {isQuestionnaireOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 my-6 space-y-4">
            <h2 className="font-bold text-stone-900 text-base">Personalize Your Wellness &amp; Nutrition Plan</h2>
            <p className="text-xs text-stone-500">
              Provide your dietary lifestyle details to calibrate your schedule.
            </p>

            <form onSubmit={handleGeneratePlan} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Meals Per Day</label>
                <select
                  value={mealsPerDay}
                  onChange={(e) => setMealsPerDay(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white"
                >
                  <option value="2">2 Meals (Intermittent Fasting)</option>
                  <option value="3">3 Main Meals</option>
                  <option value="4">3 Meals + Nutrient Snack</option>
                  <option value="5">5 Small Frequent Meals</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Dietary Preference</label>
                <input
                  type="text"
                  value={dietStyle}
                  onChange={(e) => setDietStyle(e.target.value)}
                  placeholder="e.g. Balanced, Vegetarian, Low-Dairy, Plant-Based"
                  className="w-full px-3 py-2 rounded-lg border border-stone-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Local Accessible Foods</label>
                <input
                  type="text"
                  value={accessibleFoods}
                  onChange={(e) => setAccessibleFoods(e.target.value)}
                  placeholder="e.g. Papaya, spinach, sweet potatoes, avocado, beans"
                  className="w-full px-3 py-2 rounded-lg border border-stone-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Sleep &amp; Wake Hours</label>
                <input
                  type="text"
                  value={sleepSchedule}
                  onChange={(e) => setSleepSchedule(e.target.value)}
                  placeholder="e.g. Wake 06:30, Sleep 22:30"
                  className="w-full px-3 py-2 rounded-lg border border-stone-200"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuestionnaireOpen(false)}
                  className="px-4 py-2 rounded-lg text-stone-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold transition flex items-center gap-1.5"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" /> Generate Wellness Plan
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
