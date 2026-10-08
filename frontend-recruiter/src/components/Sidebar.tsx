import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  FilePlus,
  FileUp,
  Brain,
  Users,
  Target,
  Trophy,
  UserCheck,
  Filter,
  CalendarDays,
  CalendarClock,
  ClipboardCheck,
  Award,
  BarChart3,
  Bell,
  Sparkles,
  ShieldCheck,
  UserCog,
  Lock,
  ChevronRight,
  X,
  PanelLeftClose
} from 'lucide-react';
import { useRecruiter, ScreenId } from '../context/RecruiterContext.tsx';

interface NavItem {
  id: ScreenId;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    applications,
    unreadNotificationsCount,
    company,
    sidebarOpen,
    setSidebarOpen,
    theme
  } = useRecruiter();

  const isLight = theme === 'light';

  // If sidebar is closed, do not render
  if (!sidebarOpen) {
    return null;
  }

  const groups: NavGroup[] = [
    {
      title: 'CORE WORKSPACE',
      items: [
        { id: 'dashboard', label: '1. Dashboard Overview', icon: LayoutDashboard },
        { id: 'company_profile', label: '2. Company Profile', icon: Building2 },
        { id: 'notifications', label: '3. Notifications', icon: Bell, badge: unreadNotificationsCount || undefined }
      ]
    },
    {
      title: 'JOB REQUISITION',
      items: [
        { id: 'jobs', label: '4. Open Requisitions', icon: Briefcase },
        { id: 'create_job', label: '5. Create Job Posting', icon: FilePlus },
        { id: 'jd_upload', label: '6. JD Upload & Parse', icon: FileUp },
        { id: 'ai_jd_analysis', label: '7. AI JD Extraction', icon: Brain }
      ]
    },
    {
      title: 'TALENT & MATCHING',
      items: [
        { id: 'applicants', label: '8. Authorized Applicants', icon: Users, badge: applications.length },
        { id: 'candidate_matching', label: '9. AI Multi-Factor Match', icon: Target },
        { id: 'candidate_ranking', label: '10. Candidate Leaderboard', icon: Trophy },
        { id: 'candidate_details', label: '11. Candidate Dossier', icon: UserCheck },
        { id: 'shortlist', label: '12. Pipeline & Decisions', icon: Filter }
      ]
    },
    {
      title: 'DRIVES & INTERVIEWS',
      items: [
        { id: 'drives', label: '13. Placement Drives', icon: CalendarDays },
        { id: 'interview_schedule', label: '14. Interview Schedule', icon: CalendarClock },
        { id: 'interview_evaluation', label: '15. AI Interview Scorecard', icon: ClipboardCheck }
      ]
    },
    {
      title: 'OFFERS & INTELLIGENCE',
      items: [
        { id: 'offers', label: '16. Offers & Appointment Letters', icon: Award },
        { id: 'analytics', label: '17. Company Analytics', icon: BarChart3 },
        { id: 'ai_assistant', label: '18. Recruiter AI Copilot', icon: Sparkles },
        { id: 'security_settings', label: '19. Privacy & Zero-Leak Audit', icon: ShieldCheck },
        { id: 'login', label: '20. Tenant Switcher', icon: UserCog }
      ]
    }
  ];

  return (
    <>
      {/* Backdrop overlay for quick dismissal */}
      <div
        onClick={() => setSidebarOpen(false)}
        className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Floating Glass Navigation Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[85vw] flex flex-col shadow-2xl select-none transition-all duration-300 animate-in slide-in-from-left ${
          isLight
            ? 'bg-white/90 backdrop-blur-2xl border-r border-blue-200/80 text-slate-800 shadow-blue-900/10'
            : 'bg-slate-950/85 backdrop-blur-2xl border-r border-blue-500/20 text-slate-100 shadow-2xl'
        }`}
      >
        {/* Top Header with Royal Blue Accent and Close Button */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between ${
            isLight ? 'border-slate-200/80 bg-gradient-to-r from-blue-50/70 to-white/70' : 'border-white/10 bg-slate-900/50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-black tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  WORKSPACE NAV
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-600 text-white">
                  20 Screens
                </span>
              </div>
              <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {company?.name || 'Recruiter Portal'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`p-2 rounded-xl transition-colors cursor-pointer border ${
              isLight
                ? 'bg-white/80 hover:bg-slate-100 border-slate-200 text-slate-700'
                : 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-slate-300'
            }`}
            title="Close Navigation Drawer"
            aria-label="Close Navigation Sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5 scrollbar-thin">
          {groups.map((group) => (
            <div key={group.title} className="space-y-1">
              <h4
                className={`px-3 text-[10px] font-black uppercase tracking-wider font-mono ${
                  isLight ? 'text-blue-900/70' : 'text-blue-300/80'
                }`}
              >
                {group.title}
              </h4>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveScreen(item.id);
                        setSidebarOpen(false); // Close on selection so user has full transparent screen!
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs rounded-xl transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30 translate-x-1'
                          : isLight
                          ? 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/80 font-medium'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-white' : isLight ? 'text-blue-600' : 'text-blue-400'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                            isActive
                              ? 'bg-white text-blue-800'
                              : isLight
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-blue-950/80 border border-blue-500/30 text-blue-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Security Scope Guard at Bottom */}
        <div
          className={`p-3.5 border-t ${
            isLight ? 'border-slate-200/80 bg-slate-50/70' : 'border-white/10 bg-slate-950/80'
          }`}
        >
          <div
            className={`rounded-2xl border p-3 ${
              isLight ? 'bg-white/90 border-slate-200/90 shadow-sm' : 'bg-slate-900/60 border-white/10'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <Lock className="w-3.5 h-3.5" /> Zero-Leak Enforced
              </span>
              <span className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                Tenant Guard
              </span>
            </div>
            <p className={`text-[11px] leading-snug ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Authorized to <strong className={isLight ? 'text-slate-900' : 'text-white'}>{company?.name}</strong>. Student database browsing blocked.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
