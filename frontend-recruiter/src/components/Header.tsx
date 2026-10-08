import React from 'react';
import {
  Building2,
  Bell,
  Sparkles,
  RefreshCw,
  Sun,
  Moon,
  Menu,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { useRecruiter } from '../context/RecruiterContext.tsx';

export const Header: React.FC = () => {
  const {
    recruiter,
    company,
    availableRecruiters,
    switchRecruiterSession,
    setActiveScreen,
    unreadNotificationsCount,
    refreshData,
    isLoading,
    theme,
    toggleTheme,
    sidebarOpen,
    toggleSidebar
  } = useRecruiter();

  const isLight = theme === 'light';

  return (
    <header
      className={`sticky top-0 z-40 px-3 sm:px-6 py-2.5 flex items-center justify-between transition-colors duration-200 ${
        isLight
          ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/80 text-slate-900 shadow-sm shadow-blue-900/5'
          : 'bg-slate-950/70 backdrop-blur-xl border-b border-white/10 text-white shadow-md'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Sidebar Toggle Button - User controls when to open it */}
        <button
  onClick={toggleSidebar}
  aria-label={
    sidebarOpen
      ? 'Close Navigation Sidebar'
      : 'Open Navigation Sidebar'
  }
  className={`px-3 py-2 rounded-xl border transition-all flex items-center gap-2 cursor-pointer text-xs font-bold shadow-sm ${
    sidebarOpen
      ? isLight
        ? 'bg-blue-600 border-blue-600 text-white shadow-blue-500/20'
        : 'bg-blue-600 border-blue-500 text-white shadow-blue-500/30'
      : isLight
      ? 'bg-white/80 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300'
      : 'bg-slate-900/80 border-white/10 text-slate-200 hover:border-blue-500/50 hover:text-white'
  }`}
  title={sidebarOpen ? 'Close Navigation' : 'Open Navigation'}
>
  {sidebarOpen ? (
    <PanelLeftClose className="w-4 h-4 text-inherit" />
  ) : (
    <Menu className="w-4 h-4 text-blue-500" />
  )}

  <span className="hidden sm:inline">Menu</span>
</button>

        {/* Brand Logo & Name */}
        <div
          onClick={() => setActiveScreen('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5 text-white" />
          </div>
         <div>
  <div className="flex flex-col items-start">
    <span
      className={`font-extrabold tracking-tight text-base ${
        isLight ? "text-slate-900" : "text-white"
      }`}
    >
      CAMPUS<span className="text-blue-600">LINK</span>
    </span>

    <span
      className={`mt-0.5 text-[11px] px-2 py-0.5 rounded-full font-mono font-bold border ${
        isLight
          ? "bg-blue-50 border-blue-200 text-blue-700"
          : "bg-blue-600/20 border-blue-400/30 text-blue-300"
      }`}
    >
      RECRUITER
    </span>
  </div>

  <p
    className={`text-[10px] uppercase tracking-widest font-mono ${
      isLight ? "text-slate-500" : "text-slate-400"
    }`}
  >
  </p>
</div>
        </div>

        {/* Tenant Switcher */}
        <div className={`hidden lg:flex items-center gap-2 ml-3 pl-3 border-l ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
          <span className={`text-xs flex items-center gap-1 font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <Building2 className="w-3.5 h-3.5 text-blue-500" />
            Org:
          </span>
          <select
            value={recruiter?.id || ''}
            onChange={(e) => switchRecruiterSession(e.target.value)}
            aria-label="Active Organization"
            className={`text-xs font-semibold py-1.5 px-3 rounded-xl border focus:outline-none focus:border-blue-500 cursor-pointer transition-colors ${
              isLight
                ? 'bg-white/90 border-slate-200 text-slate-800 hover:border-slate-300'
                : 'bg-slate-900/90 border-white/10 text-white hover:border-white/20'
            }`}
          >
            {availableRecruiters.map((r) => (
              <option key={r.id} value={r.id} className={isLight ? 'text-slate-900 bg-white' : 'text-white bg-slate-900'}>
                {r.companyName} ({r.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Controls: Dark/Light Mode, Refresh, AI Assistant, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark Mode & Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          aria-label={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          className={`flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl border transition-all cursor-pointer text-xs font-semibold ${
            isLight
              ? 'bg-blue-50/80 border-blue-200 text-blue-700 hover:bg-blue-100'
              : 'bg-slate-900/80 border-white/10 text-amber-300 hover:bg-slate-800'
          }`}
          title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {isLight ? (
            <>
              <Moon className="w-4 h-4 text-blue-700" />
              <span className="hidden sm:inline">Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Light Mode</span>
            </>
          )}
        </button>

        {/* Refresh button */}
        <button
          onClick={() => refreshData()}
          disabled={isLoading}
          title="Refresh Data"
          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
            isLight
              ? 'bg-white/90 border-slate-200 text-slate-600 hover:text-blue-700 hover:border-blue-200'
              : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-500' : ''}`} />
        </button>

        {/* AI Assistant Quick Pill */}
        <button
          onClick={() => setActiveScreen('ai_assistant')}
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md shadow-blue-700/25 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
          <span className="hidden sm:inline">Recruiter Copilot</span>
        </button>

        {/* Notifications Icon */}
        <button
          onClick={() => setActiveScreen('notifications')}
          className={`relative p-2 rounded-xl border transition-colors cursor-pointer ${
            isLight
              ? 'bg-white/90 border-slate-200 text-slate-700 hover:text-blue-700'
              : 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Recruiter Profile Card */}
        <div
          onClick={() => setActiveScreen('login')}
          className={`flex items-center gap-2 pl-2 border-l cursor-pointer group ${
            isLight ? 'border-slate-200' : 'border-white/10'
          }`}
        >
          <img
            src={recruiter?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120'}
            alt={recruiter?.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-blue-500/40 group-hover:border-blue-500 transition-colors"
          />
          <div className="hidden xl:block text-left">
            <p className={`text-xs font-bold transition-colors ${isLight ? 'text-slate-900 group-hover:text-blue-700' : 'text-white group-hover:text-blue-300'}`}>
              {recruiter?.name || 'Recruiter'}
            </p>
            <p className={`text-[10px] truncate max-w-[130px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {company?.name || 'Company'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
