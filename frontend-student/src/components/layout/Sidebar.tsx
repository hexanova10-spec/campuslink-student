import React from 'react';
import { ScreenType } from '../../types/student';
import { LayoutDashboard, ShieldCheck, Target, Sparkles, BotMessageSquare, FileText, ScanEye, User, GraduationCap, Code2, FolderGit2, Award, Briefcase, Layers, CalendarCheck2, Trophy, FolderLock, Bell, Settings, X, Lock } from 'lucide-react';

interface SidebarProps { currentScreen: ScreenType; onNavigate: (screen: ScreenType) => void; unreadCount: number; isOpen: boolean; onClose: () => void; }
interface NavItem { id: ScreenType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string; }
interface NavSection { title: string; items: NavItem[]; }

export const Sidebar: React.FC<SidebarProps> = ({ currentScreen, onNavigate, unreadCount, isOpen, onClose }) => {
  const sections: NavSection[] = [
    { title: 'CORE WORKSPACE', items: [
      { id: 'dashboard', label: '1. Student Dashboard', icon: LayoutDashboard },
      { id: 'profile', label: '2. Student Profile', icon: User },
      { id: 'notifications', label: '3. Notifications', icon: Bell, badge: unreadCount ? String(unreadCount) : undefined }
    ]},
    { title: 'READINESS & AI', items: [
      { id: 'readiness-score', label: '4. AI Readiness Score', icon: ShieldCheck, badge: '82/100' },
      { id: 'skill-gap', label: '5. Skill Gap Analysis', icon: Target },
      { id: 'ai-career-assistant', label: '6. AI Career Coach', icon: Sparkles, badge: 'LIVE' },
      { id: 'mock-interview', label: '7. AI Mock Interview', icon: BotMessageSquare },
      { id: 'ai-resume-analysis', label: '8. AI Resume Audit', icon: ScanEye }
    ]},
    { title: 'PROFILE & PORTFOLIO', items: [
      { id: 'academics', label: '9. Academic Records', icon: GraduationCap },
      { id: 'skills', label: '10. Skills & Proficiency', icon: Code2 },
      { id: 'projects', label: '11. Projects & Work', icon: FolderGit2 },
      { id: 'certifications', label: '12. Certifications', icon: Award },
      { id: 'resume', label: '13. Resume Locker', icon: FileText }
    ]},
    { title: 'PLACEMENT PIPELINE', items: [
      { id: 'recommended-jobs', label: '14. Recommended Jobs', icon: Briefcase, badge: 'OPEN' },
      { id: 'applications', label: '15. Applications Tracker', icon: Layers },
      { id: 'interview-schedule', label: '16. Interview Schedule', icon: CalendarCheck2 },
      { id: 'offers', label: '17. Placement Offers', icon: Trophy }
    ]},
    { title: 'DOCUMENTS & SYSTEM', items: [
      { id: 'documents', label: '18. Documents Locker', icon: FolderLock },
      { id: 'settings', label: '19. Settings', icon: Settings }
    ]}
  ];

  if (!isOpen) return null;
  const handleSelect = (id: ScreenType) => { onNavigate(id); onClose(); };

  return <>
    <div onClick={onClose} className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200" />
    <aside className="fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[85vw] flex flex-col shadow-2xl select-none transition-all duration-300 animate-in slide-in-from-left bg-white/90 backdrop-blur-2xl border-r border-blue-200/80 text-slate-800 dark:bg-slate-950/85 dark:border-blue-500/20 dark:text-slate-100">
      <div className="px-5 py-4 border-b border-slate-200/80 bg-gradient-to-r from-blue-50/70 to-white/70 dark:border-white/10 dark:bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-600/30"><span className="font-black text-[10px]">CL</span></div>
          <div><div className="flex items-center gap-1.5"><span className="text-xs font-black tracking-wide text-slate-900 dark:text-white">WORKSPACE NAV</span><span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">19 Screens</span></div><p className="text-[10px] text-slate-500 dark:text-slate-400">Student Placement Portal</p></div>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl border border-slate-200 bg-white/80 hover:bg-slate-100 text-slate-700 dark:bg-slate-900/80 dark:border-white/10 dark:text-slate-300"><X className="w-4 h-4" /></button>
      </div>
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5">
        {sections.map(section => <div key={section.title} className="space-y-1">
          <h4 className="px-3 text-[10px] font-black uppercase tracking-wider font-mono text-blue-900/70 dark:text-blue-300/80">{section.title}</h4>
          {section.items.map(item => { const Icon=item.icon; const active=currentScreen===item.id; return <button key={item.id} onClick={()=>handleSelect(item.id)} className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs rounded-xl transition-all ${active ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30 translate-x-1' : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60 font-medium'}`}>
            <div className="flex items-center gap-2.5 min-w-0"><Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} /><span className="truncate">{item.label}</span></div>
            {item.badge && <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${active ? 'bg-white text-blue-800' : 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:border dark:border-blue-500/30 dark:text-blue-300'}`}>{item.badge}</span>}
          </button>; })}
        </div>)}
      </div>
      <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/70 dark:border-white/10 dark:bg-slate-950/80">
        <div className="rounded-2xl border p-3 bg-white/90 border-slate-200/90 shadow-sm dark:bg-slate-900/60 dark:border-white/10">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold mb-1 text-emerald-600 dark:text-emerald-400"><Lock className="w-3.5 h-3.5" /> Authenticated Student Domain</div>
          <p className="text-[11px] leading-snug text-slate-600 dark:text-slate-400">Strict student isolation. Placement data is visible only to authorized CampusLink services.</p>
        </div>
      </div>
    </aside>
  </>;
};
