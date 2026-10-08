import React from 'react';
import { ScreenType } from '../../types/student';
import {
  LayoutDashboard,
  ShieldCheck,
  Target,
  Sparkles,
  BotMessageSquare,
  FileText,
  ScanEye,
  User,
  GraduationCap,
  Code2,
  FolderGit2,
  Award,
  Briefcase,
  Layers,
  CalendarCheck2,
  Trophy,
  FolderLock,
  Bell,
  Settings,
  Flame,
  CheckCircle2,
  X,
  Compass
} from 'lucide-react';

interface SidebarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  unreadCount: number;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: ScreenType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  unreadCount,
  isOpen,
  onClose,
}) => {
  const sections: NavSection[] = [
    {
      title: 'COMMAND CENTER',
      items: [
        { id: 'dashboard', label: 'My Command Center', icon: LayoutDashboard },
        { id: 'readiness-score', label: 'AI Readiness Score', icon: ShieldCheck, badge: '82/100', badgeColor: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' },
      ],
    },
    {
      title: 'AI PLACEMENT COPILOT',
      items: [
        { id: 'ai-career-assistant', label: 'AI Career Coach', icon: Sparkles, badge: 'Live', badgeColor: 'bg-blue-500/20 text-blue-600 dark:text-blue-300' },
        { id: 'mock-interview', label: 'AI Mock Interview', icon: BotMessageSquare },
        { id: 'skill-gap', label: 'Skill Gap Analysis', icon: Target },
        { id: 'ai-resume-analysis', label: 'AI Resume Audit', icon: ScanEye },
      ],
    },
    {
      title: 'STUDENT PROFILE & PORTFOLIO',
      items: [
        { id: 'profile', label: 'Personal Information', icon: User },
        { id: 'academics', label: 'Academic Records', icon: GraduationCap },
        { id: 'skills', label: 'Skills & Proficiency', icon: Code2 },
        { id: 'projects', label: 'Projects & Work', icon: FolderGit2 },
        { id: 'certifications', label: 'Certifications', icon: Award },
        { id: 'resume', label: 'Resume Locker', icon: FileText },
      ],
    },
    {
      title: 'PLACEMENT DRIVES & PROGRESS',
      items: [
        { id: 'recommended-jobs', label: 'Recommended Jobs', icon: Briefcase, badge: '5 Open', badgeColor: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300' },
        { id: 'applications', label: 'Applications Tracker', icon: Layers, badge: '4 Active', badgeColor: 'bg-blue-500/20 text-blue-600 dark:text-blue-300' },
        { id: 'interview-schedule', label: 'Interview Schedule', icon: CalendarCheck2, badge: 'Tomorrow', badgeColor: 'bg-amber-500/20 text-amber-600 dark:text-amber-300' },
        { id: 'offers', label: 'Placement Offers', icon: Trophy, badge: '1 Won', badgeColor: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' },
      ],
    },
    {
      title: 'VAULT & SYSTEM',
      items: [
        { id: 'documents', label: 'Documents Locker', icon: FolderLock },
        { id: 'notifications', label: 'Notification Center', icon: Bell, badge: unreadCount > 0 ? `${unreadCount}` : undefined, badgeColor: 'bg-rose-500/20 text-rose-600 dark:text-rose-300' },
        { id: 'settings', label: 'Settings & DB Schema', icon: Settings },
      ],
    },
  ];

  if (!isOpen) {
    return null; // As requested: "the side bar sholu not open always it shoud be one if we want ro open"
  }

  const handleSelect = (id: ScreenType) => {
    onNavigate(id);
    onClose();
  };

  return (
    <>
      {/* Semi-transparent Glass Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-blue-950/30 dark:bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        title="Click to close menu"
      />

      {/* Flyout Glassmorphic Sidebar Drawer */}
      <aside className="fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] backdrop-blur-2xl bg-white/85 dark:bg-[#060e28]/90 border-r border-white/60 dark:border-blue-500/20 shadow-2xl flex flex-col justify-between py-4 select-none animate-in slide-in-from-left-4 duration-200">
        <div className="space-y-5 px-3 overflow-y-auto">
          {/* Header with Close Button */}
          <div className="flex items-center justify-between px-2 pt-1 pb-3 border-b border-blue-100/80 dark:border-blue-900/40">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-600/30 border border-white/20">
                CL
              </div>
              <div>
                <span className="font-extrabold text-xs text-blue-950 dark:text-white tracking-tight">
                  CAMPUSLINK MENU
                </span>
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                  Placement Command Center
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
              title="Close Menu"
              aria-label="Close Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Placement Alert Banner */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-cyan-500/10 dark:from-blue-950/60 dark:to-indigo-950/40 border border-blue-200/80 dark:border-blue-500/30 text-xs backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-bold mb-1">
              <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
              <span>Campus Season 2026</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
              Round 2 Interview tomorrow with <strong>TechNova Solutions</strong>.
            </p>
          </div>

          {/* Navigation Sections */}
          {sections.map((sec, secIdx) => (
            <div key={secIdx}>
              <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                {sec.title}
              </div>
              <nav className="space-y-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-white hover:bg-blue-50/80 dark:hover:bg-blue-950/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 border ${
                            isActive
                              ? 'bg-white/20 text-white border-white/30'
                              : `${item.badgeColor || 'bg-blue-100 dark:bg-slate-800 text-blue-800 dark:text-slate-300'} border-transparent`
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Security Guarantee Footer */}
        <div className="px-4 pt-3 border-t border-blue-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Authenticated Student Domain</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Strict isolation. Zero cross-student data exposure.
          </p>
        </div>
      </aside>
    </>
  );
};
