import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import {
  Bell,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  LogOut,
  User,
  BookOpen,
  Award,
  Compass,
  Cpu,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  onOpenNotifications: () => void;
  unreadCount: number;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNotifications,
  unreadCount,
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const { student, logout, setCurrentScreen, currentScreen, loginAsDemoStudent } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [readinessScore, setReadinessScore] = useState<number>(82);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    async function loadScore() {
      try {
        const r = await api.getReadiness();
        if (r) setReadinessScore(r.overall_score);
      } catch (e) {
        // fallback
      }
    }
    loadScore();
  }, [currentScreen]);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#060c1d]/95 backdrop-blur-2xl border-b border-blue-200/80 dark:border-blue-900/50 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Sidebar Toggle Button + Brand */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Sidebar Toggle Button as requested: "the side bar sholu not open always it shoud be one if we want ro open" */}
            <button
              onClick={onToggleSidebar}
              className={`p-2 rounded-xl transition-all flex items-center gap-2 border ${
                isSidebarOpen
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/25'
                  : 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/50'
              }`}
              title={isSidebarOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-label="Toggle Navigation Menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              <span className="text-xs font-bold hidden sm:inline">
                {isSidebarOpen ? 'Close Menu' : 'Menu'}
              </span>
            </button>

            {/* Logo & Tagline */}
            <button
              onClick={() => setCurrentScreen('dashboard')}
              className="flex items-center gap-3 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-600/25 group-hover:scale-105 transition-transform text-white border border-white/20">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-blue-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    CAMPUSLINK
                  </span>
                  <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-600/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-600/20 dark:border-blue-400/30 uppercase">
                    Student
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden lg:block">
                  Know Your Readiness. Discover Your Opportunity.
                </p>
              </div>
            </button>
          </div>

          {/* Center Actions / Quick Pill */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setCurrentScreen('readiness-score')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300 text-xs font-semibold hover:scale-105 transition-all shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Readiness: {readinessScore}/100</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-blue-600 text-white">
                {readinessScore >= 80 ? 'Highly Employable' : readinessScore >= 60 ? 'Ready' : 'Developing'}
              </span>
            </button>

            <button
              onClick={() => setCurrentScreen('ai-career-assistant')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-md shadow-blue-600/25"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
              <span>AI Placement Coach</span>
            </button>
          </div>

          {/* Right Actions: Theme Toggle, Notifications, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark Mode / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl border border-blue-200/80 dark:border-blue-800/60 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-all shadow-sm text-xs font-semibold"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark and Light Mode"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-blue-600" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-blue-200 dark:hover:border-slate-700"
              title="Placement Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2 sm:pl-2.5 rounded-xl border border-blue-200/80 dark:border-blue-900/50 hover:border-blue-400 dark:hover:border-blue-600 bg-white/90 dark:bg-slate-900/80 transition-all text-left shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-blue-100 dark:bg-blue-950 flex items-center justify-center border border-blue-300 dark:border-blue-700">
                  {student?.avatar_url ? (
                    <img src={student.avatar_url} alt={student.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {student?.full_name || 'Student Account'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    {student?.roll_number || 'B.Tech CSE'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white/95 dark:bg-[#0c142b]/95 backdrop-blur-xl border border-blue-200/80 dark:border-blue-800/80 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-blue-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{student?.full_name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{student?.college_name}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Verified Student Access
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => setCurrentScreen('profile')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800/70 hover:text-blue-600 dark:hover:text-white flex items-center gap-2.5 transition-colors"
                    >
                      <User className="w-4 h-4 text-blue-500" />
                      <span>My Profile & Preferences</span>
                    </button>
                    <button
                      onClick={() => setCurrentScreen('readiness-score')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800/70 hover:text-blue-600 dark:hover:text-white flex items-center gap-2.5 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                      <span>Readiness Breakdown ({readinessScore}/100)</span>
                    </button>
                    <button
                      onClick={() => setCurrentScreen('documents')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800/70 hover:text-blue-600 dark:hover:text-white flex items-center gap-2.5 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span>Documents Locker</span>
                    </button>
                    <button
                      onClick={() => setCurrentScreen('settings')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800/70 hover:text-blue-600 dark:hover:text-white flex items-center gap-2.5 transition-colors"
                    >
                      <Award className="w-4 h-4 text-blue-500" />
                      <span>Settings & PostgreSQL Contract</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-blue-100 dark:border-slate-800">
                    <button
                      onClick={() => loginAsDemoStudent()}
                      className="w-full text-left px-4 py-2 text-xs text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-slate-800/70 flex items-center gap-2.5"
                    >
                      <Compass className="w-4 h-4" />
                      <span>Reset to Demo Profile (Aarav)</span>
                    </button>
                    <button
                      onClick={() => logout()}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800/70 flex items-center gap-2.5"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out of Student Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
