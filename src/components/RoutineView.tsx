import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Mail,
  ShieldAlert,
  Info,
  ChevronRight,
  Sun,
  Moon,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { RoutineStep, UserRoutine } from '../types';

interface RoutineViewProps {
  onOpenDigestModal: () => void;
}

export const RoutineView: React.FC<RoutineViewProps> = ({ onOpenDigestModal }) => {
  const {
    morningRoutine,
    eveningRoutine,
    latestAnalysis,
    catalogProducts,
    addCalendarEvent,
    isDarkMode,
    setIsDarkMode
  } = useApp();

  const [routineType, setRoutineType] = useState<'morning' | 'evening'>(() => isDarkMode ? 'evening' : 'morning');

  useEffect(() => {
    if (isDarkMode) {
      setRoutineType('evening');
    }
  }, [isDarkMode]);
  const [isRunnerActive, setIsRunnerActive] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isWaitingInterval, setIsWaitingInterval] = useState<boolean>(false);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [routineFinished, setRoutineFinished] = useState<boolean>(false);

  const activeRoutine: UserRoutine | null =
    routineType === 'morning' ? morningRoutine : eveningRoutine;
  const currentStep: RoutineStep | undefined =
    activeRoutine?.steps[currentStepIndex];

  // Timer interval effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if (isWaitingInterval) {
        // Wait finished, advance to next step
        setIsWaitingInterval(false);
        if (activeRoutine && currentStepIndex < activeRoutine.steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
          setTimerSecondsLeft(activeRoutine.steps[currentStepIndex + 1].durationSeconds || 30);
        } else {
          finishRoutine();
        }
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft, isWaitingInterval, currentStepIndex, activeRoutine]);

  const startRunner = () => {
    if (!activeRoutine || activeRoutine.steps.length === 0) return;
    setIsRunnerActive(true);
    setCurrentStepIndex(0);
    setIsWaitingInterval(false);
    setCompletedSteps([]);
    setRoutineFinished(false);
    setTimerSecondsLeft(activeRoutine.steps[0].durationSeconds || 30);
    setIsTimerRunning(true);
  };

  const completeCurrentStep = () => {
    if (!activeRoutine || !currentStep) return;

    setCompletedSteps((prev) => [...prev, currentStep.stepNumber]);

    // Check if there is a wait interval before the next step
    if (currentStep.waitIntervalSeconds > 0 && currentStepIndex < activeRoutine.steps.length - 1) {
      setIsWaitingInterval(true);
      setTimerSecondsLeft(currentStep.waitIntervalSeconds);
      setIsTimerRunning(true);
    } else if (currentStepIndex < activeRoutine.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setTimerSecondsLeft(activeRoutine.steps[currentStepIndex + 1].durationSeconds || 30);
      setIsTimerRunning(true);
    } else {
      finishRoutine();
    }
  };

  const skipStep = () => {
    if (!activeRoutine) return;
    if (currentStepIndex < activeRoutine.steps.length - 1) {
      setIsWaitingInterval(false);
      setCurrentStepIndex((prev) => prev + 1);
      setTimerSecondsLeft(activeRoutine.steps[currentStepIndex + 1].durationSeconds || 30);
      setIsTimerRunning(true);
    } else {
      finishRoutine();
    }
  };

  const finishRoutine = () => {
    setIsRunnerActive(false);
    setIsTimerRunning(false);
    setRoutineFinished(true);

    // Trigger celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Log completion to calendar
    addCalendarEvent({
      title: `${routineType === 'morning' ? 'Morning' : 'Evening'} Skincare Routine`,
      type: routineType === 'morning' ? 'morning_routine' : 'evening_routine',
      date: new Date().toISOString().split('T')[0],
      time: activeRoutine?.targetTime || (routineType === 'morning' ? '07:00' : '20:30'),
      completed: true,
      notes: `Completed all steps with scheduled wait intervals.`
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header with Switcher */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Personalized Schedule</span>
          <h1 className="text-2xl font-bold text-stone-900 font-serif-display">
            Your Skincare Routine &amp; Wait Intervals
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Exact application order, contact duration, and absorption wait intervals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Routine Switcher */}
          <div className="bg-stone-100 dark:bg-stone-800 p-1 rounded-xl flex items-center shadow-inner">
            <button
              onClick={() => {
                setRoutineType('morning');
                setIsRunnerActive(false);
                setIsDarkMode(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                routineType === 'morning' && !isDarkMode
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
              title="Morning routine (07:00 light mode)"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" /> Morning
            </button>
            <button
              onClick={() => {
                setRoutineType('evening');
                setIsRunnerActive(false);
                setIsDarkMode(true);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                routineType === 'evening' || isDarkMode
                  ? 'bg-white text-stone-900 shadow-sm dark:bg-stone-900 dark:text-teal-400'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
              title="Evening routine (20:30 dark mode)"
            >
              <Moon className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> Evening (20:30)
            </button>
          </div>

          <button
            onClick={onOpenDigestModal}
            className="p-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold transition"
            title="Send routine to Gmail"
          >
            <Mail className="w-4 h-4 text-teal-700" />
          </button>
        </div>
      </div>

      {/* Routine Runner Mode (When active) */}
      {isRunnerActive && currentStep && (
        <div className="bg-gradient-to-tr from-stone-900 via-teal-950 to-stone-900 text-white p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                {isWaitingInterval ? '⏳ Absorption Wait Interval' : `Step ${currentStep.stepNumber} of ${activeRoutine?.steps.length}`}
              </span>
            </div>
            <button
              onClick={() => setIsRunnerActive(false)}
              className="text-xs text-stone-400 hover:text-white"
            >
              Exit Runner
            </button>
          </div>

          <div className="text-center space-y-3 py-2">
            {isWaitingInterval ? (
              <div className="space-y-2">
                <span className="text-xs text-teal-200 font-medium uppercase tracking-wide">
                  Waiting for active ingredient absorption before applying next layer
                </span>
                <div className="text-6xl font-extrabold font-mono tracking-tight text-white">
                  {timerSecondsLeft}s
                </div>
                <p className="text-xs text-stone-300 max-w-sm mx-auto">
                  Let {currentStep.productName} settle into the epidermis to maximize barrier uptake and prevent pilling.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-xs text-teal-300 font-bold uppercase tracking-wider">
                  {currentStep.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif-display text-white">
                  {currentStep.productName}
                </h2>
                <p className="text-xs text-stone-300 font-medium">{currentStep.brand}</p>
                <div className="text-4xl font-extrabold font-mono text-teal-400 pt-2">
                  {timerSecondsLeft}s
                </div>
                <p className="text-xs text-stone-300 max-w-md mx-auto pt-1 leading-relaxed">
                  {currentStep.instructions}
                </p>
              </div>
            )}
          </div>

          {/* Runner Controls */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isTimerRunning ? 'Pause' : 'Resume'}
            </button>

            {!isWaitingInterval ? (
              <button
                onClick={completeCurrentStep}
                className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-teal-500/30 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                Done Applying →
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsWaitingInterval(false);
                  if (activeRoutine && currentStepIndex < activeRoutine.steps.length - 1) {
                    setCurrentStepIndex((prev) => prev + 1);
                    setTimerSecondsLeft(activeRoutine.steps[currentStepIndex + 1].durationSeconds || 30);
                  } else {
                    finishRoutine();
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-teal-500/30 transition"
              >
                Skip Wait Interval →
              </button>
            )}

            <button
              onClick={skipStep}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 font-semibold text-xs flex items-center gap-1 transition"
            >
              <SkipForward className="w-4 h-4" /> Skip Step
            </button>
          </div>
        </div>
      )}

      {/* Routine Completed Banner */}
      {routineFinished && (
        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <h3 className="font-bold text-emerald-950 text-sm">Routine Completed!</h3>
              <p className="text-xs text-emerald-800">
                Logged to your calendar. Consistent interval adherence builds strong cutaneous barrier health.
              </p>
            </div>
          </div>
          <button
            onClick={() => setRoutineFinished(false)}
            className="text-xs font-bold text-emerald-900 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Routine Action Bar */}
      {!isRunnerActive && (
        <div className="flex items-center justify-between bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            <span className="font-bold text-stone-800">Scheduled Time: {activeRoutine?.targetTime}</span>
            <span className="text-stone-400">·</span>
            <span className="text-stone-600">{activeRoutine?.steps.length} Layered Products</span>
          </div>

          <button
            onClick={startRunner}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Interactive Runner</span>
          </button>
        </div>
      )}

      {/* Steps List */}
      <div className="space-y-4">
        {(activeRoutine?.steps || []).map((step) => {
          const isDone = completedSteps.includes(step.stepNumber);
          return (
            <div
              key={step.stepNumber}
              className={`p-5 rounded-2xl bg-white border transition ${
                isDone ? 'border-emerald-300 bg-emerald-50/20' : 'border-stone-200 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-teal-100 text-teal-800 border border-teal-200'
                    }`}
                  >
                    {isDone ? '✓' : step.stepNumber}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                        {step.category}
                      </span>
                      {step.isUserProduct && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 font-semibold border border-stone-200">
                          From Your Shelf
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-stone-900">{step.productName}</h3>
                    <p className="text-xs text-stone-500 font-medium">{step.brand}</p>
                    <p className="text-xs text-stone-700 pt-1 leading-relaxed">{step.instructions}</p>

                    {/* Traceable justification */}
                    {step.whyRecommended && (
                      <div className="mt-2.5 p-2.5 rounded-lg bg-teal-50/60 border border-teal-100 text-[11px] text-teal-900 flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span><strong>Why chosen:</strong> {step.whyRecommended}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2 text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <div className="text-xs font-mono text-stone-500">
                    Apply: <strong className="text-stone-800">{step.durationSeconds}s</strong>
                  </div>

                  {step.waitIntervalSeconds > 0 && (
                    <div className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200/60 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Wait: {step.waitIntervalSeconds}s
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety & Contraindications Notice */}
      <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
        <h4 className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          Safety &amp; Active Ingredient Guidelines
        </h4>
        <ul className="space-y-1.5 text-xs text-stone-600 list-disc pl-4">
          {(activeRoutine?.safetyNotes || []).map((note, i) => (
            <li key={i}>{note}</li>
          ))}
          <li>
            Cosmetic guidance only. Perform a 24-hour patch test before introducing new potent actives.
          </li>
        </ul>
      </div>
    </div>
  );
};
