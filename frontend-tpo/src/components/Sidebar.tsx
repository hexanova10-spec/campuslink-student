import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Activity,
  AlertTriangle,
  Briefcase,
  Building,
  FileCheck2,
  SlidersHorizontal,
  KeyRound,
  Sparkles,
  CalendarDays,
  CalendarClock,
  ShieldAlert,
  ClipboardList,
  Award,
  FileText,
  Bell,
  MessageSquareShare,
  BarChart3,
  TrendingUp,
  Bot,
  GraduationCap,
  Settings,
  Shield,
  Layers,
  Network,
  Lock,
  Database,
  X
} from 'lucide-react';
import { repo } from '../services/storage';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  currentScreen: number;
  onSelectScreen: (screenId: number) => void;
}

interface NavItem {
  id: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  aiBadge?: boolean;
  alertBadge?: boolean;
  criticalBadge?: boolean;
  highlight?: boolean;
  conflictBadge?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ currentScreen, onSelectScreen }) => {
  const { theme, isSidebarOpen, setSidebarOpen } = useTheme();
  const currentUser = repo.getCurrentUser();
  const isAdmin = currentUser.role === 'SYSTEM_ADMIN';
  const isDark = theme === 'dark';

  if (!isSidebarOpen) {
    return null; // Side bar does NOT stay open always! It only opens when requested.
  }

  const tpoNavigationGroups: NavGroup[] = [
    {
      label: 'COMMAND & INTELLIGENCE',
      items: [
        { id: 2, label: 'Placement Command Center', icon: LayoutDashboard },
        { id: 23, label: 'Placement Analytics', icon: BarChart3 },
        { id: 24, label: 'Predictive Analytics (AI)', icon: TrendingUp, aiBadge: true },
        { id: 25, label: 'AI TPO Assistant', icon: Bot, aiBadge: true }
      ]
    },
    {
      label: 'STUDENT PIPELINE & RISK',
      items: [
        { id: 3, label: 'Students Roster', icon: Users },
        { id: 4, label: 'Student Profile & Details', icon: UserCheck },
        { id: 5, label: 'Readiness Monitoring', icon: Activity },
        { id: 6, label: 'AI At-Risk Engine', icon: AlertTriangle, alertBadge: true },
        { id: 26, label: 'Mentors & Interventions', icon: GraduationCap }
      ]
    },
    {
      label: 'COMPANIES & JOBS',
      items: [
        { id: 8, label: 'Partner Companies', icon: Building },
        { id: 7, label: 'Recruiters Directory', icon: Briefcase },
        { id: 9, label: 'Jobs Pipeline', icon: ClipboardList },
        { id: 10, label: 'Job Review & Approvals', icon: FileCheck2, highlight: true }
      ]
    },
    {
      label: 'ACCESS & MATCHING CONTROL',
      items: [
        { id: 11, label: 'Eligibility Engine', icon: SlidersHorizontal },
        { id: 12, label: 'Candidate Pool', icon: Layers },
        { id: 13, label: 'Candidate Release Control', icon: KeyRound, criticalBadge: true },
        { id: 14, label: 'AI Matching Oversight', icon: Sparkles, aiBadge: true }
      ]
    },
    {
      label: 'DRIVES & SCHEDULING',
      items: [
        { id: 15, label: 'Placement Drives', icon: CalendarDays },
        { id: 16, label: 'Smart Scheduling Grid', icon: CalendarClock },
        { id: 17, label: 'Conflict Management', icon: ShieldAlert, conflictBadge: true }
      ]
    },
    {
      label: 'OPERATIONS & OUTREACH',
      items: [
        { id: 18, label: 'Interviews & Check-in', icon: ClipboardList },
        { id: 19, label: 'Offers & Joining Tracker', icon: Award },
        { id: 20, label: 'Document Verification', icon: FileText },
        { id: 21, label: 'Broadcast Notifications', icon: Bell },
        { id: 22, label: 'AI Message Drafter', icon: MessageSquareShare, aiBadge: true }
      ]
    },
    {
      label: 'COLLEGE SETTINGS',
      items: [
        { id: 27, label: 'Placement Policies & Settings', icon: Settings },
        { id: 1, label: 'Session & Auth Switcher', icon: Shield }
      ]
    }
  ];

  const adminNavigationGroup: NavGroup = {
    label: 'SYSTEM ADMINISTRATOR SUITE',
    items: [
      { id: 28, label: 'Global Admin Dashboard', icon: LayoutDashboard },
      { id: 29, label: 'Colleges & Institutions', icon: Building },
      { id: 30, label: 'Campuses & Departments', icon: Network },
      { id: 31, label: 'Global User Directory', icon: Users },
      { id: 32, label: 'Roles & Permissions (RBAC)', icon: Lock },
      { id: 33, label: 'Global Recruiters Registry', icon: Briefcase },
      { id: 34, label: 'University-Wide Analytics', icon: BarChart3 },
      { id: 35, label: 'AI Config & Guardrails', icon: Bot, aiBadge: true },
      { id: 36, label: 'Audit Logs & DB Schemas', icon: Database, criticalBadge: true }
    ]
  };

  const handleSelect = (screenId: number) => {
    onSelectScreen(screenId);
    setSidebarOpen(false); // Close drawer after selection for clean viewport
  };

  return (
    <>
      {/* Frosted Transparent Backdrop */}
      <div
        onClick={() => setSidebarOpen(false)}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Slide-over Navigation Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] flex flex-col shadow-2xl backdrop-blur-2xl transition-transform animate-in slide-in-from-left duration-200 border-r ${
          isDark
            ? 'bg-[#0B1530] border-[#1E3A6B] text-[#F8FAFC]'
            : 'bg-white border-[#D9E2F2] text-[#101A3A]'
        }`}
      >
        {/* Drawer Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'bg-[#060E22] border-[#1E3A6B]' : 'bg-[#F8FAFF] border-[#D9E2F2]'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3155E7] animate-ping" />
              <span className="text-xs font-black tracking-wider uppercase text-[#3155E7]">
                All 36 Screens Directory
              </span>
            </div>
            <div className={`text-[11px] font-bold mt-0.5 ${isDark ? 'text-white' : 'text-[#101A3A]'}`}>
              {isAdmin ? 'System Administrator Suite' : 'College TPO Operations'}
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
            className={`p-1.5 rounded-xl border transition cursor-pointer ${
              isDark
                ? 'bg-[#101C3A] hover:bg-[#15244A] border-[#1E3A6B] text-slate-300'
                : 'bg-white hover:bg-slate-100 border-[#D9E2F2] text-slate-700'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Navigation Groups */}
        <nav className="p-3 space-y-5 flex-1 overflow-y-auto">
          {/* Admin Group if Admin */}
          {isAdmin && (
            <div>
              <div className="text-[10px] font-black uppercase px-2.5 py-1 tracking-wider text-[#10B981] flex items-center justify-between">
                <span>{adminNavigationGroup.label}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 font-mono font-bold">
                  SCREENS 28-36
                </span>
              </div>
              <div className="mt-1 space-y-0.5">
                {adminNavigationGroup.items.map(item => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        isActive
                          ? 'bg-[#3155E7] text-white shadow-md text-white-force'
                          : isDark
                          ? 'text-slate-200 hover:bg-[#101C3A] hover:text-white'
                          : 'text-slate-700 hover:bg-[#F8FAFF] hover:text-[#3155E7]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#3155E7]'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <span className="text-[10px] opacity-70 font-mono">#{item.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TPO Groups */}
          {tpoNavigationGroups.map(group => (
            <div key={group.label}>
              <div className="text-[10px] font-black uppercase px-2.5 py-1 tracking-wider text-[#3155E7]">
                {group.label}
              </div>
              <div className="mt-0.5 space-y-0.5">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        isActive
                          ? 'bg-[#3155E7] text-white shadow-md text-white-force'
                          : isDark
                          ? 'text-slate-200 hover:bg-[#101C3A] hover:text-white'
                          : 'text-slate-700 hover:bg-[#F8FAFF] hover:text-[#3155E7]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#3155E7]'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {item.criticalBadge && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500 text-white text-[9px] font-black shadow-xs text-white-force">
                            GATE
                          </span>
                        )}
                        {item.aiBadge && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-[#3155E7] text-[9px] font-black">
                            AI
                          </span>
                        )}
                        <span className="text-[10px] opacity-60 font-mono">#{item.id}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Drawer Footer */}
        <div
          className={`p-3.5 border-t text-xs flex items-center justify-between ${
            isDark ? 'bg-[#060E22] border-[#1E3A6B] text-slate-400' : 'bg-[#F8FAFF] border-[#D9E2F2] text-[#64748B]'
          }`}
        >
          <span>CampusLink Command v3.0</span>
          <button
            onClick={() => handleSelect(36)}
            className="text-[#3155E7] font-bold hover:underline cursor-pointer"
          >
            PostgreSQL DDL
          </button>
        </div>
      </aside>
    </>
  );
};
