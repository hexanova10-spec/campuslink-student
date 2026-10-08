import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import {
  Building2, Bell, Sparkles, ShieldCheck, ChevronDown, LogOut, User,
  BookOpen, Award, Menu, X, Sun, Moon, PanelLeftClose, PanelLeft
} from 'lucide-react';

interface NavbarProps {
  onOpenNotifications: () => void;
  unreadCount: number;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications, unreadCount, onToggleSidebar, isSidebarOpen }) => {
  const { student, logout, setCurrentScreen } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const [readinessScore, setReadinessScore] = useState<number>(82);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const avatarInput = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadScore() {
      try {
        const r = await api.getReadiness();
        if (r) setReadinessScore(r.overall_score);
      } catch { /* dashboard remains usable when readiness is unavailable */ }
    }
    loadScore();
  }, []);

  const saveAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await api.updateProfile({ avatarUrl: String(reader.result) });
        const fresh = await api.getProfile();
        if (fresh) window.location.reload();
      } catch (error) {
        console.error('Student avatar upload failed', error);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <header className={`sticky top-0 z-40 px-3 sm:px-6 py-2.5 flex items-center justify-between transition-colors duration-200 ${isDark
      ? 'bg-slate-950/70 backdrop-blur-xl border-b border-white/10 text-white shadow-md'
      : 'bg-white/80 backdrop-blur-xl border-b border-slate-200/80 text-slate-900 shadow-sm shadow-blue-900/5'}`}>
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onToggleSidebar} aria-label={isSidebarOpen ? 'Close Navigation Sidebar' : 'Open Navigation Sidebar'}
          className={`px-3 py-2 rounded-xl border transition-all flex items-center gap-2 cursor-pointer text-xs font-bold shadow-sm ${isSidebarOpen
            ? 'bg-blue-600 border-blue-600 text-white shadow-blue-500/20'
            : isDark
              ? 'bg-slate-900/80 border-white/10 text-slate-200 hover:border-blue-500/50'
              : 'bg-white/80 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300'}`}>
          {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <Menu className="w-4 h-4 text-blue-500" />}
          <span className="hidden sm:inline">{isSidebarOpen ? 'Close Menu' : 'Menu'}</span>
        </button>

        <button onClick={() => setCurrentScreen('dashboard')} className="flex items-center gap-2.5 cursor-pointer group text-left">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className={`font-extrabold tracking-tight text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>CAMPUS<span className="text-blue-600">LINK</span></span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border uppercase ${isDark
                ? 'bg-blue-600/20 border-blue-400/30 text-blue-300'
                : 'bg-blue-50 border-blue-200 text-blue-700'}`}>STUDENT</span>
            </div>
            <p className={`text-[10px] uppercase tracking-widest font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Placement Workspace</p>
          </div>
        </button>

        <div className={`hidden xl:flex items-center gap-2 ml-2 pl-3 border-l ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Readiness</span>
          <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${isDark ? 'bg-blue-600/20 border-blue-500/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>{readinessScore}/100</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button onClick={() => setCurrentScreen('ai-career-assistant')}
          className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md shadow-blue-700/25 transition-all cursor-pointer">
          <Sparkles className="w-3.5 h-3.5 text-white" /><span>Student Copilot</span>
        </button>

        <button onClick={toggleTheme} aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className={`flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl border transition-all cursor-pointer text-xs font-semibold ${isDark
            ? 'bg-slate-900/80 border-white/10 text-amber-300 hover:bg-slate-800'
            : 'bg-blue-50/80 border-blue-200 text-blue-700 hover:bg-blue-100'}`}>
          {isDark ? <><Sun className="w-4 h-4 text-amber-400" /><span className="hidden sm:inline">Light</span></> : <><Moon className="w-4 h-4 text-blue-700" /><span className="hidden sm:inline">Dark</span></>}
        </button>

        <button onClick={onOpenNotifications} className={`relative p-2 rounded-xl border transition-colors cursor-pointer ${isDark
          ? 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-white'
          : 'bg-white/90 border-slate-200 text-slate-700 hover:text-blue-700'}`} title="Notifications">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>}
        </button>

        <div className={`relative flex items-center gap-2 pl-2 border-l ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          <input ref={avatarInput} type="file" accept="image/*" className="hidden" onChange={saveAvatar} />
          <button onClick={() => setProfileDropdownOpen(v => !v)} className="flex items-center gap-2 cursor-pointer group">
            <img src={student?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120'} alt={student?.full_name || 'Student'}
              className="w-8 h-8 rounded-full object-cover border-2 border-blue-500/40 group-hover:border-blue-500 transition-colors" />
            <div className="hidden xl:block text-left">
              <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{student?.full_name || 'Siddharth Das'}</p>
              <p className={`text-[10px] truncate max-w-[130px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{student?.college_name || 'KIIT University, Bhubaneswar'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>
          {profileDropdownOpen && (
            <div className={`absolute right-0 top-11 w-64 rounded-2xl border shadow-2xl p-2 z-50 backdrop-blur-2xl ${isDark ? 'bg-slate-950/95 border-white/10 text-white' : 'bg-white/95 border-blue-200 text-slate-900'}`}>
              <div className="px-3 py-2 border-b border-slate-200/60 dark:border-slate-800">
                <p className="text-xs font-bold">{student?.full_name || 'Siddharth Das'}</p>
                <p className="text-[10px] text-slate-500 truncate">{student?.college_name || 'KIIT University, Bhubaneswar'}</p>
              </div>
              <button onClick={() => { setCurrentScreen('profile'); setProfileDropdownOpen(false); }} className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2"><User className="w-4 h-4 text-blue-500" />My Profile</button>
              <button onClick={() => { setCurrentScreen('documents'); setProfileDropdownOpen(false); }} className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2"><BookOpen className="w-4 h-4 text-blue-500" />Documents Locker</button>
              <button onClick={() => { setCurrentScreen('readiness-score'); setProfileDropdownOpen(false); }} className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-blue-500" />Readiness Breakdown</button>
              <button onClick={() => { avatarInput.current?.click(); setProfileDropdownOpen(false); }} className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2"><Award className="w-4 h-4 text-blue-500" />Change Profile Picture</button>
              <button onClick={logout} className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"><LogOut className="w-4 h-4" />Log Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
