import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Sparkles,
  AlertCircle,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { CloseButton } from './common/CloseButton';
import {
  signInWithGoogle,
  signInEmail,
  registerEmail,
  resetPassword
} from '../lib/firebase';
import { useApp } from '../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { updateUserProfile, userProfile, loginDemoUser, isAdmin } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [skinType, setSkinType] = useState<any>('Combination');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.user) {
        await updateUserProfile({
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || displayName || 'Amina'
        });
        const isUserAdmin = result.user.email === 'postkwanza@gmail.com';
        onClose();
        navigate(isUserAdmin ? '/admin' : '/dashboard');
      } else {
        onClose();
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setError(err.message || 'Google Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const cred = await signInEmail(email, password);
        const isUserAdmin = cred.user.email === 'postkwanza@gmail.com';
        onClose();
        navigate(isUserAdmin ? '/admin' : '/dashboard');
      } else if (mode === 'signup') {
        const cred = await registerEmail(email, password);
        if (cred.user) {
          await updateUserProfile({
            uid: cred.user.uid,
            email: cred.user.email || email,
            displayName: displayName.trim() || 'Amina',
            skinType
          });
        }
        onClose();
        navigate('/dashboard');
      } else if (mode === 'reset') {
        await resetPassword(email);
        setSuccessMsg('Password reset link sent to your email.');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl p-6 sm:p-7 my-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Account Access</span>
            <h2 className="text-xl font-bold text-stone-900 font-serif-display">
              {mode === 'signin' && 'Sign In to SkinAI'}
              {mode === 'signup' && 'Create Your Skin Profile'}
              {mode === 'reset' && 'Reset Password'}
            </h2>
          </div>
          <CloseButton onClick={onClose} ariaLabel="Close sign in modal" />
        </div>

        {/* 1-Click Demo Logins */}
        <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              1-Click Demo Logins
            </span>
            <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">
              Instant Access
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                loginDemoUser('user');
                onClose();
                navigate('/dashboard');
              }}
              className="px-3 py-2 rounded-xl bg-white hover:bg-teal-50/80 border border-stone-200 hover:border-teal-300 text-left transition flex items-center gap-2.5 group cursor-pointer shadow-2xs"
            >
              <div className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                A
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-stone-900 group-hover:text-teal-800 truncate">Amina (User)</p>
                <p className="text-[10px] text-stone-500 truncate">Routine &amp; Scan</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                loginDemoUser('admin');
                onClose();
                navigate('/admin');
              }}
              className="px-3 py-2 rounded-xl bg-white hover:bg-purple-50/80 border border-stone-200 hover:border-purple-300 text-left transition flex items-center gap-2.5 group cursor-pointer shadow-2xs"
            >
              <div className="w-7 h-7 rounded-full bg-purple-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
                G
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-stone-900 group-hover:text-purple-800 truncate">Dr. Grace (Admin)</p>
                <p className="text-[10px] text-stone-500 truncate">Catalog &amp; AI Rules</p>
              </div>
            </button>
          </div>
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google &amp; Workspace</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-stone-200 w-full" />
          <span className="bg-white px-3 text-[10px] text-stone-400 font-bold uppercase tracking-wider">
            or with email
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Email form */}
        <form onSubmit={handleEmailAuth} className="space-y-3 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Amina"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-stone-900"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 text-stone-900"
            />
          </div>

          {mode !== 'reset' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-stone-700">Password</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-[11px] text-teal-700 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-stone-900"
              />
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Known Skin Type</label>
              <select
                value={skinType}
                onChange={(e) => setSkinType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-stone-900 bg-white"
              >
                <option value="Combination">Combination (Oily T-Zone, Normal Cheeks)</option>
                <option value="Oily">Oily (Excess Sebum, Pore Prominence)</option>
                <option value="Dry">Dry (Tightness, Occasional Flakiness)</option>
                <option value="Sensitive">Sensitive (Prone to Redness / Stinging)</option>
                <option value="Normal">Normal (Balanced Moisture &amp; Sebum)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-teal-600/20"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : mode === 'signin' ? (
              'Sign In'
            ) : mode === 'signup' ? (
              'Create Account'
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-stone-500">
          {mode === 'signin' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-teal-700 font-bold hover:underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setMode('signin')}
                className="text-teal-700 font-bold hover:underline"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
