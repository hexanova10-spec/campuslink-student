import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScreen: (screenId: number) => void;
}

export const ALL_36_SCREENS = [
  { id: 1, title: 'Session & Auth Switcher', category: 'Authentication & Security', desc: 'Simulate TPO vs Admin roles and tenant context' },
  { id: 2, title: 'Placement Command Center', category: 'Command & Analytics', desc: 'High-density placement KPIs, conversion rates, trends' },
  { id: 3, title: 'Students Roster', category: 'Student Pipeline', desc: 'Search and filter students by branch, CGPA, readiness, skills' },
  { id: 4, title: 'Student Profile & Details', category: 'Student Pipeline', desc: 'Deep dive student record, academics, assessments, mentor' },
  { id: 5, title: 'Readiness Monitoring', category: 'Student Pipeline', desc: 'Branch-wise aggregate readiness breakdown (Ready/Developing/At-Risk)' },
  { id: 6, title: 'AI At-Risk Student Engine', category: 'Student Pipeline', desc: 'Risk scoring, rejections velocity, causal factors & remediation' },
  { id: 7, title: 'Recruiters Directory', category: 'Corporate Relations', desc: 'College-approved recruiter accounts, contacts & activity' },
  { id: 8, title: 'Partner Companies', category: 'Corporate Relations', desc: 'Corporate tiers, historic hiring, package benchmarks' },
  { id: 9, title: 'Jobs Pipeline', category: 'Corporate Relations', desc: 'Active job postings, CTC packages, criteria & status' },
  { id: 10, title: 'Job Review & Approvals', category: 'Corporate Relations', desc: 'Queue of jobs in PENDING TPO REVIEW to Approve or Reject' },
  { id: 11, title: 'Eligibility Engine', category: 'Access & Selection', desc: 'Deterministic multi-rule engine (CGPA, Branch, Backlogs, Certs)' },
  { id: 12, title: 'Candidate Pool', category: 'Access & Selection', desc: 'Drive-specific applicant verification and stage pipeline' },
  { id: 13, title: 'Candidate Release & Access Control', category: 'Access & Selection', desc: 'CRITICAL CandidateAccess gate: Recruiters cannot see students without TPO grant' },
  { id: 14, title: 'AI Matching Oversight', category: 'Access & Selection', desc: 'AI Match Score, skill gap matrix and ranking before recruiter release' },
  { id: 15, title: 'Placement Drives', category: 'Drives & Scheduling', desc: 'Comprehensive drive lifecycle from Draft to Live and Completed' },
  { id: 16, title: 'Smart Scheduling Grid', category: 'Drives & Scheduling', desc: 'Slot allocator across auditoriums, labs, and interview cabins' },
  { id: 17, title: 'Conflict Management', category: 'Drives & Scheduling', desc: 'Venue, panel, student collisions & 1-click AI Optimize Schedule' },
  { id: 18, title: 'Interviews & Check-in', category: 'Operations', desc: 'Round tracking, candidate attendance, feedback and results' },
  { id: 19, title: 'Offers & Joining Tracker', category: 'Operations', desc: 'Offer letters, packages, acceptance, deferral, and joining dates' },
  { id: 20, title: 'Document Verification', category: 'Operations', desc: 'Marksheets, resumes, bonafides verification with rejection audits' },
  { id: 21, title: 'Broadcast Notifications', category: 'Communications', desc: 'Targeted drive alerts by branch, eligibility cohort, or individual' },
  { id: 22, title: 'AI Message Drafter', category: 'Communications', desc: 'AI drafts announcements, shortlists, reminders with 1-click review' },
  { id: 23, title: 'Placement Analytics', category: 'Analytics', desc: 'Branch-wise, skill-wise, recruiter conversion, and salary metrics' },
  { id: 24, title: 'Predictive Analytics (AI)', category: 'Analytics', desc: 'AI-labeled forecasts: risk conversion, skill demand, recruiter churn' },
  { id: 25, title: 'AI TPO Assistant', category: 'AI Assistants', desc: 'Private chatbot strictly grounded in authorized college records only' },
  { id: 26, title: 'Mentors & Interventions', category: 'Student Pipeline', desc: 'Faculty mentors assigned to at-risk candidates and tracked progress' },
  { id: 27, title: 'Placement Policies & Settings', category: 'Administration', desc: 'Dream offer rules, cutoff thresholds, drive blackout dates' },
  { id: 28, title: 'Global Admin Dashboard', category: 'System Administrator', desc: 'Cross-college health, university benchmarks, system load' },
  { id: 29, title: 'Colleges & Institutions', category: 'System Administrator', desc: 'Multi-college tenant directory, accreditation, and TPO heads' },
  { id: 30, title: 'Campuses & Departments', category: 'System Administrator', desc: 'Multi-campus mapping under university groups' },
  { id: 31, title: 'Global User Directory', category: 'System Administrator', desc: 'RBAC platform users, TPOs, coordinators, and recruiter credentials' },
  { id: 32, title: 'Roles & Permissions (RBAC)', category: 'System Administrator', desc: 'Permission matrix editor for TPO, Super Admin, and Coordinators' },
  { id: 33, title: 'Global Recruiters Registry', category: 'System Administrator', desc: 'Enterprise recruiter verification across all participating colleges' },
  { id: 34, title: 'University-Wide Analytics', category: 'System Administrator', desc: 'Cross-campus comparative placement rates & state-wide benchmarks' },
  { id: 35, title: 'AI Config & Guardrails', category: 'System Administrator', desc: 'Gemini model settings, prompt guardrails, and data boundary policies' },
  { id: 36, title: 'Audit Logs & DB Schemas', category: 'System Administrator', desc: 'Immutable audit trail, PostgreSQL DDL schema & SQLAlchemy models' }
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelectScreen }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = ALL_36_SCREENS.filter(
    s =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.category.toLowerCase().includes(query.toLowerCase()) ||
      s.desc.toLowerCase().includes(query.toLowerCase()) ||
      `#${s.id}`.includes(query)
  );

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-16 p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh] backdrop-blur-2xl border transition-colors ${
          isDark
            ? 'bg-[#0B1530] border-[#1E3A6B] text-[#F8FAFC]'
            : 'bg-white border-[#D9E2F2] text-[#101A3A]'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          className={`flex items-center gap-3 px-4 py-3.5 border-b ${
            isDark ? 'border-[#1E3A6B] bg-[#060E22]' : 'border-[#D9E2F2] bg-[#F8FAFF]'
          }`}
        >
          <Search className="w-5 h-5 text-[#3155E7] shrink-0" />
          <input
            type="text"
            placeholder="Search across all 36 screens, features, or jump to screen #..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className={`w-full bg-transparent border-none outline-none text-sm font-medium ${
              isDark ? 'text-white placeholder-slate-400' : 'text-[#101A3A] placeholder-[#94A3B8]'
            }`}
          />
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl border transition cursor-pointer ${
              isDark
                ? 'bg-[#101C3A] hover:bg-[#15244A] border-[#1E3A6B] text-slate-300'
                : 'bg-white hover:bg-slate-100 border-[#D9E2F2] text-slate-600'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#64748B] text-xs">
              No matching screens found for "{query}".
            </div>
          ) : (
            filtered.map(screen => (
              <button
                key={screen.id}
                onClick={() => {
                  onSelectScreen(screen.id);
                  onClose();
                }}
                className={`w-full text-left p-3 rounded-2xl transition flex items-center justify-between group cursor-pointer ${
                  isDark ? 'hover:bg-[#101C3A]' : 'hover:bg-[#F8FAFF]'
                }`}
              >
                <div className="flex items-start gap-3 truncate">
                  <div className="w-8 h-8 rounded-xl bg-[#3155E7]/15 text-[#3155E7] group-hover:bg-[#3155E7] group-hover:text-white flex items-center justify-center font-mono text-xs font-black shrink-0 border border-[#3155E7]/30 transition">
                    #{screen.id}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm transition group-hover:text-[#3155E7] ${isDark ? 'text-white' : 'text-[#101A3A]'}`}>
                        {screen.title}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-[#3155E7] border border-blue-500/20 shrink-0">
                        {screen.category}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 truncate ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>{screen.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#3155E7] group-hover:translate-x-1 transition shrink-0 ml-2" />
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          className={`px-4 py-2.5 border-t text-[11px] flex items-center justify-between font-medium ${
            isDark ? 'bg-[#060E22] border-[#1E3A6B] text-slate-400' : 'bg-[#F8FAFF] border-[#D9E2F2] text-[#64748B]'
          }`}
        >
          <span>Jump to any screen by typing screen number (e.g. "#13")</span>
          <span className="font-mono text-[#3155E7] font-bold">Total 36 Screens Directory</span>
        </div>
      </div>
    </div>
  );
};
