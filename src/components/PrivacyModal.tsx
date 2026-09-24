import React, { useState } from 'react';
import {
  Shield,
  Trash2,
  Download,
  Lock,
  CheckCircle2,
  X,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete all historical facial photos and scan records? This cannot be undone.')) {
      return;
    }
    setIsDeleting(true);
    await deleteAllPhotosAndScans();
    setIsDeleting(false);
    setDeletedSuccess(true);
    setTimeout(() => setDeletedSuccess(false), 3000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 sm:p-7 my-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-base">Privacy &amp; Data Control</h2>
              <p className="text-[11px] text-stone-500">Your facial images &amp; health data ownership</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official Privacy Guarantee Notice */}
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-teal-900">
            <Lock className="w-4 h-4 text-teal-700" />
            Strict Data Autonomy
          </div>
          <p className="text-teal-800 leading-relaxed text-[11px]">
            “Your photos are used to generate your personalized analysis. You control whether previous scans are retained.”
          </p>
          <p className="text-[11px] text-teal-700">
            Photos are used solely to generate your cosmetic characteristics and routine intervals. We never sell, license, or share facial biometric data.
          </p>
        </div>

        {/* Toggle Storage */}
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-stone-200 bg-stone-50 text-xs">
          <div>
            <span className="font-bold text-stone-900 block">Retain Progress Photos</span>
            <span className="text-[11px] text-stone-500">
              When disabled, future scans will only store numerical scores without photos.
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={userProfile?.allowPhotoStorage ?? true}
              onChange={(e) => updateUserProfile({ allowPhotoStorage: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600" />
          </label>
        </div>

        {/* Delete All Scans Button */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleDeleteAll}
            disabled={isDeleting || analyses.length === 0}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isDeleting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>Delete All Facial Photos &amp; Scan Records ({analyses.length})</span>
          </button>

          {deletedSuccess && (
            <p className="text-xs text-emerald-700 font-semibold text-center">
              ✓ All photos and historical scan records were successfully wiped.
            </p>
          )}

          <button
            onClick={handleExportData}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Full Data Archive (JSON)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
