import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Zap,
  Shield,
  LogOut,
  Save,
  CheckCircle2,
  Sparkles,
  Camera,
  Calendar,
  Package,
  ArrowRight,
  Settings,
  CreditCard
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from '../components/common/BackButton';
import { CloseButton } from '../components/common/CloseButton';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    userProfile,
    updateUserProfile,
    logout,
    analyses,
    morningRoutine,
    eveningRoutine,
    userProducts,
    formatPrice
  } = useApp();

  const [displayName, setDisplayName] = useState(userProfile?.displayName || 'Amina');
  const [skinType, setSkinType] = useState(userProfile?.skinType || 'Combination');
  const [allergies, setAllergies] = useState(userProfile?.allergies || 'None reported');
  const [lifestyle, setLifestyle] = useState(userProfile?.lifestyle || 'Moderate sun exposure, air-conditioned office.');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      displayName,
      skinType: skinType as any,
      allergies,
      lifestyle
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleConfirmLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
    navigate('/home');
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <BackButton fallback="/home" label="Back to Home" />
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* User Header Profile Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white font-bold text-2xl flex items-center justify-center shadow-md shadow-teal-600/20">
            {displayName.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-stone-900 font-serif-display">
                {displayName}
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide bg-teal-50 text-teal-800 border border-teal-200">
                {userProfile?.subscriptionTier === 'high' ? 'HIGH Plan' : 'START Plan'}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">{user?.email || userProfile?.email}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Member since {new Date(userProfile?.createdAt || Date.now()).toLocaleDateString()} · {userProfile?.country || 'Tanzania'}
            </p>
          </div>
        </div>

        {/* Sub-page Jump Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => navigate('/profile/subscription')}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-600" />
            <span>Subscription</span>
          </button>
          <button
            onClick={() => navigate('/profile/settings')}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5 text-stone-600" />
            <span>Settings &amp; Privacy</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile characteristics saved successfully.</span>
        </div>
      )}

      {/* Account Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => navigate('/skin')}
          className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:border-teal-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Skin Scans</span>
            <Camera className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2">{analyses.length}</div>
          <span className="text-[10px] text-teal-600 font-semibold flex items-center gap-0.5 mt-0.5">
            <span>View Timeline</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </span>
        </div>

        <div
          onClick={() => navigate('/routine')}
          className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:border-teal-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Routine Steps</span>
            <Sparkles className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2">
            {(morningRoutine?.steps.length || 0) + (eveningRoutine?.steps.length || 0)}
          </div>
          <span className="text-[10px] text-teal-600 font-semibold flex items-center gap-0.5 mt-0.5">
            <span>Morning &amp; Evening</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </span>
        </div>

        <div
          onClick={() => navigate('/products')}
          className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:border-teal-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>My Shelf</span>
            <Package className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2">{userProducts.length}</div>
          <span className="text-[10px] text-teal-600 font-semibold flex items-center gap-0.5 mt-0.5">
            <span>Products</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </span>
        </div>

        <div
          onClick={() => navigate('/profile/subscription')}
          className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:border-amber-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Plan Tier</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-base font-bold text-stone-900 mt-2 uppercase">
            {userProfile?.subscriptionTier || 'START'}
          </div>
          <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5 mt-0.5">
            <span>Manage Plan</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <h2 className="font-bold text-stone-900 text-base flex items-center gap-2">
          <User className="w-4 h-4 text-teal-600" />
          Personal &amp; Biological Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-stone-700 block mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">Skin Type</label>
            <select
              value={skinType}
              onChange={(e) => setSkinType(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:ring-2 focus:ring-teal-500 focus:outline-none font-medium"
            >
              <option value="Oily">Oily</option>
              <option value="Dry">Dry</option>
              <option value="Combination">Combination</option>
              <option value="Sensitive">Sensitive</option>
              <option value="Normal">Normal</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="font-semibold text-stone-700 block mb-1">Known Allergies / Irritations</label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Fragrance, high % glycolic acid, eucalyptus..."
              className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-semibold text-stone-700 block mb-1">Lifestyle &amp; Environmental Exposure</label>
            <textarea
              rows={2}
              value={lifestyle}
              onChange={(e) => setLifestyle(e.target.value)}
              placeholder="e.g. Work outdoors, gym 4x weekly, wear heavy makeup..."
              className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Update Account Profile</span>
          </button>
        </div>
      </form>

      {/* Small Action Modal: Confirm Logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-stone-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-base">Confirm Sign Out</h3>
              <CloseButton onClick={() => setShowLogoutConfirm(false)} ariaLabel="Cancel sign out" />
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to sign out of your SkinAI account on this device?
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-xl text-stone-600 font-semibold text-xs hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
