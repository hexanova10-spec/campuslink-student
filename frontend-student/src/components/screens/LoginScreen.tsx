import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Cpu, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle, Sun, Moon } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, setCurrentScreen, loginAsDemoStudent } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [email, setEmail] = useState('aarav.sharma@campus.edu');
  const [password, setPassword] = useState('student@123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050a19] text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Royal Blue Background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-600/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Bar with Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-xs font-semibold shadow-sm transition-all text-slate-700 dark:text-slate-200"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 shadow-xl shadow-blue-600/25 mb-4 border border-white/20">
          <Cpu className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-black text-blue-950 dark:text-white tracking-tight">CAMPUSLINK STUDENT</h1>
        <p className="mt-1 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
          Student Placement Command Center
        </p>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
          "Know Your Readiness. Discover Your Opportunity. Get Placement Ready."
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/85 dark:bg-[#0b1428]/85 backdrop-blur-2xl border border-blue-200/80 dark:border-blue-900/50 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-600 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Student College Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-blue-50/40 dark:bg-slate-950/70 border border-blue-200/80 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors"
                  placeholder="student@campus.edu"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setCurrentScreen('forgot-password')}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-blue-50/40 dark:bg-slate-950/70 border border-blue-200/80 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Command Center'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-6 pt-6 border-t border-blue-100 dark:border-slate-800">
            <div className="text-center mb-3">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Reviewing the prototype?</span>
            </div>
            <button
              onClick={() => loginAsDemoStudent()}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-50 dark:bg-slate-900 hover:bg-blue-100 dark:hover:bg-slate-800 border border-blue-200/80 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant 1-Click Demo Login (Aarav Sharma)</span>
            </button>
          </div>

          <div className="mt-5 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              New to CampusLink?{' '}
              <button
                type="button"
                onClick={() => setCurrentScreen('register')}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Create Student Account
              </button>
            </p>
          </div>
        </div>

        {/* Strict Student Boundary Note */}
        <div className="mt-4 p-3 rounded-2xl bg-white/60 dark:bg-slate-900/40 border border-blue-100 dark:border-blue-900/30 text-center backdrop-blur-md">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Strict Student Privacy: TPO and recruiter modules excluded</span>
          </p>
        </div>
      </div>
    </div>
  );
};
