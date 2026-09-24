import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  AlertCircle,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { BackButton } from '../components/common/BackButton';
import { SendDigestModal } from '../components/SendDigestModal';
import { RoutineStep, UserRoutine } from '../types';

export const RoutinePage: React.FC = () => {
  const navigate = useNavigate();
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
  const [isDigestOpen, setIsDigestOpen] = useState<boolean>(false);
  const [calendarSyncSuccess, setCalendarSyncSuccess] = useState<boolean>(false);

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

  const finishRoutine = async () => {
    setRoutineFinished(true);
    setIsTimerRunning(false);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });

    const todayStr = new Date().toISOString().split('T')[0];
    await addCalendarEvent({
      title: `${routineType === 'morning' ? 'Morning' : 'Evening'} Skincare Routine Completed`,
      time: activeRoutine?.targetTime || (routineType === 'morning' ? '07:00' : '20:30'),
      date: todayStr,
      type: routineType === 'morning' ? 'morning_routine' : 'evening_routine',
      completed: true,
      notes: `Finished all ${activeRoutine?.steps.length} formulated steps.`
    });
  };

  const handleSyncToCalendar = async () => {
    const todayStr = new Date().toISOString().split('T')[0];
    await addCalendarEvent({
      title: `${routineType === 'morning' ? 'Morning' : 'Evening'} Skincare Routine`,
      time: activeRoutine?.targetTime || (routineType === 'morning' ? '07:00' : '20:30'),
      date: todayStr,
      type: routineType === 'morning' ? 'morning_routine' : 'evening_routine',
      completed: false,
      notes: `Application duration: ~${Math.round(totalTimeSeconds / 60)} minutes with absorption wait intervals.`
    });
    setCalendarSyncSuccess(true);
    setTimeout(() => setCalendarSyncSuccess(false), 3000);
  };

  const totalTimeSeconds =
    activeRoutine?.steps.reduce(
      (acc, s) => acc + s.durationSeconds + s.waitIntervalSeconds,
      0
    ) || 0;

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <BackButton fallback="/home" label="Back to Home" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDigestOpen(true)}
            className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
          >
            <Mail className="w-3.5 h-3.5 text-teal-600" />
            <span>Send to Gmail</span>
          </button>
          <button
            onClick={handleSyncToCalendar}
            className="px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Add to Calendar</span>
          </button>
        </div>
      </div>

      {calendarSyncSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Scheduled to your in-app agenda and synchronized for reminders.</span>
        </div>
      )}

      {/* Page Title & Morning/Evening Sub-tabs */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Circadian Layering Protocol
          </span>
          <h1 className="text-2xl font-bold text-stone-900 font-serif-display mt-0.5">
            My Skincare Routine
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Formulated application sequence with exact absorption wait intervals between active layers.
          </p>
        </div>

        {/* Morning / Evening Toggle */}
        <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl self-start sm:self-auto shadow-inner">
          <button
            onClick={() => {
              setRoutineType('morning');
              setIsRunnerActive(false);
              setIsDarkMode(false);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              routineType === 'morning' && !isDarkMode
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
            title="Switch to 07:00 Morning Routine (Light Mode)"
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Morning ({morningRoutine?.steps.length || 0})</span>
          </button>
          <button
            onClick={() => {
              setRoutineType('evening');
              setIsRunnerActive(false);
              setIsDarkMode(true);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              routineType === 'evening' || isDarkMode
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
            title="Switch to 20:30 Evening Routine (Dark Mode)"
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Evening ({eveningRoutine?.steps.length || 0})</span>
          </button>
        </div>
      </div>

      {/* Routine Metadata Bar */}
      <div className="bg-stone-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (routineType === 'morning') {
                setRoutineType('evening');
                setIsDarkMode(true);
              } else {
                setRoutineType('morning');
                setIsDarkMode(false);
              }
            }}
            className="flex items-center gap-1.5 text-stone-300 hover:text-white transition cursor-pointer"
            title="Click to toggle routine schedule time"
          >
            <Clock className="w-4 h-4 text-teal-400" />
            <span>Scheduled Target: <strong className="text-white font-mono underline decoration-teal-400/50 decoration-dashed">{activeRoutine?.targetTime || (routineType === 'morning' ? '07:00' : '20:30')}</strong></span>
          </button>
          <span className="text-stone-600">|</span>
          <span className="text-stone-300">
            Total Routine Duration: <strong className="text-white">{Math.ceil(totalTimeSeconds / 60)} minutes</strong>
          </span>
        </div>

        {!isRunnerActive && (
          <button
            onClick={startRunner}
            className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-stone-950" />
            <span>Start Interactive Routine Runner</span>
          </button>
        )}
      </div>

      {/* INTERACTIVE ROUTINE RUNNER MODE */}
      {isRunnerActive && currentStep && !routineFinished && (
        <div className="bg-white rounded-2xl border-2 border-teal-500 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-500 animate-pulse" />
              <h3 className="font-bold text-stone-900 text-sm">
                Step {currentStepIndex + 1} of {activeRoutine?.steps.length}: {currentStep.productName}
              </h3>
            </div>
            <button
              onClick={() => setIsRunnerActive(false)}
              className="text-xs font-semibold text-stone-400 hover:text-stone-700"
            >
              Exit Runner
            </button>
          </div>

          <div className="text-center space-y-2 max-w-lg mx-auto py-2">
            <span className="text-xs uppercase font-bold tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
              {isWaitingInterval ? 'Absorption Wait Interval' : 'Application Window'}
            </span>

            <div className="text-5xl sm:text-6xl font-extrabold font-mono text-stone-900 my-4">
              {Math.floor(timerSecondsLeft / 60)}:
              {(timerSecondsLeft % 60).toString().padStart(2, '0')}
            </div>

            <p className="text-xs text-stone-600">
              {isWaitingInterval
                ? `Allow ${currentStep.productName} to penetrate epidermal layers before applying next product.`
                : currentStep.instructions}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1.5 transition"
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Resume
                </>
              )}
            </button>

            <button
              onClick={completeCurrentStep}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-teal-600/20 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isWaitingInterval ? 'Skip Wait' : 'Done / Next Step'}</span>
            </button>
          </div>
        </div>
      )}

      {routineFinished && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-emerald-950 text-base">Routine Completed!</h3>
          <p className="text-xs text-emerald-800 max-w-sm mx-auto">
            You completed all {activeRoutine?.steps.length} formulated steps with proper wait intervals. Logged to your calendar.
          </p>
          <button
            onClick={() => setIsRunnerActive(false)}
            className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
          >
            Return to Routine Overview
          </button>
        </div>
      )}

      {/* Routine Steps List */}
      <div className="space-y-4">
        <h3 className="font-bold text-stone-900 text-base">Formulated Application Order</h3>

        <div className="space-y-3">
          {activeRoutine?.steps.map((step, idx) => {
            const matchedCatalogProduct = catalogProducts.find(
              (cp) => cp.name.toLowerCase() === step.productName.toLowerCase()
            );

            return (
              <div
                key={step.stepNumber}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-teal-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-teal-100/80 text-teal-800 font-extrabold text-sm flex items-center justify-center shrink-0">
                    #{step.stepNumber}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-stone-900 text-sm">{step.productName}</h4>
                      <span className="text-xs text-stone-400">({step.brand})</span>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
                      {step.instructions}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500 pt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-stone-400" />
                        Apply: {step.durationSeconds}s
                      </span>
                      {step.waitIntervalSeconds > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-teal-700 font-semibold font-mono">
                            Wait {step.waitIntervalSeconds}s before next layer
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {matchedCatalogProduct ? (
                    <button
                      onClick={() => navigate(`/products/${matchedCatalogProduct.id}`)}
                      className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <span>Product Info</span>
                      <ArrowRight className="w-3 h-3 text-stone-500" />
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/products')}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-medium"
                    >
                      Find Formulation
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety & Contraindication Notes */}
      {activeRoutine?.safetyNotes && activeRoutine.safetyNotes.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 space-y-2 text-xs text-amber-950">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Active Ingredient Safety &amp; Layering Rules:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-amber-900">
            {activeRoutine.safetyNotes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Small Action Modal: Send to Gmail */}
      <SendDigestModal isOpen={isDigestOpen} onClose={() => setIsDigestOpen(false)} />
    </div>
  );
};
