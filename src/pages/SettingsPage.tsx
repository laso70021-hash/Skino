import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Trash2,
  Download,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Bell,
  Clock,
  Mail,
  User,
  Save
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from '../components/common/BackButton';
import { CloseButton } from '../components/common/CloseButton';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    updateUserProfile,
    analyses,
    deleteAllPhotosAndScans,
    calendarEvents,
    morningRoutine,
    eveningRoutine
  } = useApp();

  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedSuccess, setDeletedSuccess] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Local state for notification settings
  const [notifications, setNotifications] = useState(
    userProfile?.notificationSettings || {
      morningSkincare: true,
      eveningSkincare: true,
      nutrition: true,
      water: true,
      weeklyReport: true,
      marketing: false,
      emailDigests: true
    }
  );

  const [allowPhotoStorage, setAllowPhotoStorage] = useState(
    userProfile?.allowPhotoStorage ?? true
  );

  const [schedule, setSchedule] = useState(
    userProfile?.dailySchedule || {
      wakeTime: '06:30',
      workStart: '08:00',
      workEnd: '17:00',
      exerciseTime: '18:00',
      sleepTime: '22:30'
    }
  );

  const handleSaveSettings = async () => {
    await updateUserProfile({
      allowPhotoStorage,
      notificationSettings: notifications,
      dailySchedule: schedule
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleConfirmDeleteAll = async () => {
    setIsDeleting(true);
    await deleteAllPhotosAndScans();
    setIsDeleting(false);
    setShowDeleteConfirm(false);
    setDeletedSuccess(true);
    setTimeout(() => setDeletedSuccess(false), 4000);
  };

  const handleExportData = () => {
    const exportPayload = {
      userProfile,
      analyses,
      morningRoutine,
      eveningRoutine,
      calendarEvents,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `skinai-user-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <BackButton fallback="/profile" label="Back to Profile" />
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span>Profile</span>
          <span>/</span>
          <span className="text-stone-700 font-medium">Settings &amp; Privacy</span>
        </div>
      </div>

      {/* Page Title Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Account Preferences
          </span>
          <h1 className="text-2xl font-bold text-stone-900 font-serif-display mt-0.5">
            Settings &amp; Data Control
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your photo retention rights, reminders, schedule timings, and data exports.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Your settings and preferences have been updated successfully.</span>
        </div>
      )}

      {deletedSuccess && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-rose-600" />
          <span>All historical face scans and facial photos have been permanently deleted from storage.</span>
        </div>
      )}

      {/* Privacy & Photo Retention */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <h2 className="font-bold text-stone-900 text-base flex items-center gap-2">
          <Shield className="w-4 h-4 text-teal-600" />
          Facial Photo Retention &amp; Privacy Rights
        </h2>

        <p className="text-xs text-stone-600 leading-relaxed">
          Your facial photos are utilized exclusively to extract cosmetic feature metrics (texture, hydration, sebum, redness). We do not sell your biometric data or share it with third-party advertisers.
        </p>

        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={allowPhotoStorage}
              onChange={(e) => setAllowPhotoStorage(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-stone-300"
            />
            <div className="text-xs">
              <strong className="text-stone-900 block font-semibold">
                Store facial images for longitudinal progress tracking
              </strong>
              <p className="text-stone-500 mt-0.5 text-[11px]">
                When disabled, photos are processed ephemerally by the ML feature extractor and never saved to persistent cloud storage.
              </p>
            </div>
          </label>
        </div>

        {/* Export & Deletion Action Row */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100">
          <button
            onClick={handleExportData}
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Export All Account Data (JSON)</span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Delete All Photos &amp; Scan Records</span>
          </button>
        </div>
      </div>

      {/* Reminder & Notification Preferences */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <h2 className="font-bold text-stone-900 text-base flex items-center gap-2">
          <Bell className="w-4 h-4 text-teal-600" />
          Notification &amp; Reminder Preferences
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            { key: 'morningSkincare', label: 'Morning Skincare Reminders', desc: 'Alert at scheduled application time' },
            { key: 'eveningSkincare', label: 'Evening Skincare Reminders', desc: 'Alert 45–60 min before bedtime' },
            { key: 'water', label: 'Hydration Checkpoints', desc: 'Mid-morning and afternoon water logging prompts' },
            { key: 'emailDigests', label: 'Gmail Routine Digests', desc: 'Send scheduled interval instructions to your Gmail' },
          ].map((item) => (
            <label
              key={item.key}
              className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-start gap-3 cursor-pointer hover:border-teal-300 transition"
            >
              <input
                type="checkbox"
                checked={(notifications as any)[item.key] ?? true}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    [item.key]: e.target.checked
                  })
                }
                className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-stone-300"
              />
              <div>
                <strong className="text-stone-900 block font-semibold">{item.label}</strong>
                <p className="text-[11px] text-stone-500">{item.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Daily Circadian Schedule Timings */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <h2 className="font-bold text-stone-900 text-base flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-600" />
          Standard Daily Circadian Schedule
        </h2>
        <p className="text-xs text-stone-500">
          Used to calculate optimal morning cleansing and evening absorption wait times.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-[11px] font-bold text-stone-500 block mb-1">Wake Time</label>
            <input
              type="time"
              value={schedule.wakeTime}
              onChange={(e) => setSchedule({ ...schedule, wakeTime: e.target.value })}
              className="w-full p-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-stone-500 block mb-1">Work Start</label>
            <input
              type="time"
              value={schedule.workStart}
              onChange={(e) => setSchedule({ ...schedule, workStart: e.target.value })}
              className="w-full p-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-stone-500 block mb-1">Exercise Time</label>
            <input
              type="time"
              value={schedule.exerciseTime}
              onChange={(e) => setSchedule({ ...schedule, exerciseTime: e.target.value })}
              className="w-full p-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-stone-500 block mb-1">Sleep Time</label>
            <input
              type="time"
              value={schedule.sleepTime}
              onChange={(e) => setSchedule({ ...schedule, sleepTime: e.target.value })}
              className="w-full p-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Small Action Modal: Confirm Delete All Photos */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
                <AlertTriangle className="w-5 h-5" />
                <span>Confirm Photo Deletion</span>
              </div>
              <CloseButton onClick={() => setShowDeleteConfirm(false)} ariaLabel="Close deletion confirmation" />
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you certain you want to permanently delete all uploaded face photos and historical scan records?
              This cannot be undone and will reset your baseline progress photo comparisons.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl text-stone-600 font-semibold text-xs hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleConfirmDeleteAll}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
