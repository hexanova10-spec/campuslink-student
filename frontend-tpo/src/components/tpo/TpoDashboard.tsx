import React from 'react';
import {
  Users,
  Briefcase,
  CalendarDays,
  Award,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Building2,
  FileCheck,
  ChevronRight,
  Sparkles,
  Zap,
  Activity,
  KeyRound,
  Layers,
  History,
  Check,
  ArrowRight
} from 'lucide-react';
import { repo } from '../../services/storage';

interface TpoDashboardProps {
  onSelectScreen: (screenId: number) => void;
}

export const TpoDashboard: React.FC<TpoDashboardProps> = ({ onSelectScreen }) => {
  const institution = repo.getEffectiveInstitution();
  const students = repo.getStudents();
  const drives = repo.getDrives();
  const offers = repo.getOffers();
  const conflicts = repo.getConflicts().filter(c => c.status === 'UNRESOLVED');
  const applications = repo.getApplications();
  const interviews = repo.getInterviews();
  const candidateAccess = repo.getCandidateAccessRecords();
  const auditLogs = repo.getAuditLogs();

  // Metrics calculation
  const totalStudents = students.length;
  const registered = students.filter(s => s.placementWillingness).length;
  const profileComplete = students.filter(s => s.profileCompletion >= 90).length;
  const placementReady = students.filter(s => s.readinessLevel === 'PLACEMENT_READY').length;
  const highlyEmployable = students.filter(s => s.readinessLevel === 'HIGHLY_EMPLOYABLE').length;
  const developing = students.filter(s => s.readinessLevel === 'DEVELOPING').length;
  const atRisk = students.filter(s => s.isFlaggedAtRisk || s.readinessLevel === 'AT_RISK').length;

  const activeDrives = drives.filter(d => d.status === 'SCHEDULED' || d.status === 'LIVE').length;
  const totalShortlisted = applications.filter(a => a.status === 'SHORTLISTED' || a.status === 'OFFERED').length;
  const totalInterviews = students.reduce((acc, s) => acc + s.totalInterviews, 0);

  const totalOffersCount = offers.length;
  const acceptedOffers = offers.filter(o => o.status === 'ACCEPTED' || o.status === 'JOINED').length;
  const placedStudents = students.filter(s => s.placementStatus === 'PLACED').length;

  const placementPct = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;
  const acceptancePct = totalOffersCount > 0 ? Math.round((acceptedOffers / totalOffersCount) * 100) : 0;

  // Branch data
  const branches = ['CSE', 'ECE', 'IT', 'MECH', 'EEE'];
  const branchStats = branches.map(b => {
    const branchStudents = students.filter(s => s.branch === b);
    const placed = branchStudents.filter(s => s.placementStatus === 'PLACED').length;
    const rate = branchStudents.length > 0 ? Math.round((placed / branchStudents.length) * 100) : 0;
    return { branch: b, total: branchStudents.length, placed, rate };
  });

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* =====================================================================
          1. COMMAND CENTER HERO (Section 9 & 19)
          ===================================================================== */}
      <section
        className="hero-command-center rounded-3xl p-5 sm:p-6 lg:p-7 shadow-xl relative overflow-hidden transition-colors"
        aria-label="Command Center Hero"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#3155E7]/15 text-[#3155E7] border border-[#3155E7]/30">
                ACTIVE INSTITUTIONAL SESSION
              </span>
              <span className="text-xs font-mono font-bold text-[#64748B]">CODE: {institution.code}</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
              {institution.name} Placement Command Center
            </h1>
            <p className="text-xs sm:text-sm max-w-2xl text-[#64748B] leading-relaxed">
              Enterprise real-time monitoring of campus recruitment drives, candidate release authorization gates, smart conflict scheduling, and student readiness interventions.
            </p>
          </div>

          {/* Quick Action Matrix (Moved from Navbar to Hero Section as specified in Section 4 & 9) */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Release Candidates */}
            <button
              onClick={() => onSelectScreen(13)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3155E7] hover:bg-[#2546D0] text-white text-xs font-black shadow-lg shadow-[#3155E7]/30 transition hover:scale-[1.02] cursor-pointer text-white-force"
              title="Screen 13: Candidate Release Control"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Release Candidates</span>
            </button>

            {/* Check Conflicts */}
            <button
              onClick={() => onSelectScreen(17)}
              className="hero-secondary-btn flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
              title="Screen 17: Conflict Management"
            >
              <ShieldAlert className={`w-4 h-4 ${conflicts.length > 0 ? 'text-[#EF476F] animate-pulse' : 'text-[#3155E7]'}`} />
              <span>Check Conflicts ({conflicts.length})</span>
            </button>

            {/* Ask AI Co-Pilot */}
            <button
              onClick={() => onSelectScreen(25)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition shadow-md shadow-indigo-600/20 cursor-pointer text-white-force"
              title="Screen 25: AI TPO Assistant"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Ask AI Co-Pilot</span>
            </button>
          </div>
        </div>

        {/* Real-time Status Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#D9E2F2] dark:border-[#1E3A6B] relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-[#4F46E5] shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-[#64748B] font-medium">Placement Rate</div>
              <div className="text-base sm:text-lg font-black metric-val">
                {placementPct}%{' '}
                <span className="text-xs text-[#10B981] font-semibold">({placedStudents}/{totalStudents})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-[#64748B] font-medium">Avg & Peak CTC</div>
              <div className="text-base sm:text-lg font-black metric-val">
                ₹{institution.averagePackageLPA}{' '}
                <span className="text-xs text-[#64748B] font-semibold">/ ₹{institution.highestPackageLPA} LPA</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#F59E0B] shrink-0">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-[#64748B] font-medium">Active Drives</div>
              <div className="text-base sm:text-lg font-black metric-val">
                {activeDrives} Drives{' '}
                <span className="text-xs text-[#F59E0B] font-semibold">Live</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-[#EF476F] shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-[#64748B] font-medium">At-Risk Pool</div>
              <div className="text-base sm:text-lg font-black text-[#EF476F]">
                {atRisk} Candidates
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. KEY PLACEMENT KPIS (14 Institutional Indicators) (Section 10 & 20)
          ===================================================================== */}
      <section aria-label="Placement KPI Indicators">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
            14 Institutional Placement KPI Indicators
          </h2>
          <span className="text-[11px] text-[#64748B] font-mono">Real-Time Data Feed</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
          {[
            { label: 'Total Students', value: totalStudents, screen: 3, color: 'text-[#3155E7]' },
            { label: 'Registered', value: registered, screen: 3, color: 'text-[#0284C7]' },
            { label: 'Profile Complete', value: profileComplete, screen: 3, color: 'text-[#10B981]' },
            { label: 'Placement Ready', value: placementReady, screen: 5, color: 'text-[#4F46E5]' },
            { label: 'Highly Employable', value: highlyEmployable, screen: 5, color: 'text-[#7C3AED]' },
            { label: 'At Risk', value: atRisk, screen: 6, color: 'text-[#EF476F]' },
            { label: 'Active Drives', value: activeDrives, screen: 15, color: 'text-[#F59E0B]' },
            { label: 'Applicants', value: applications.length, screen: 12, color: 'text-[#2563EB]' },
            { label: 'Shortlisted', value: totalShortlisted, screen: 12, color: 'text-[#0D9488]' },
            { label: 'Interviews', value: totalInterviews, screen: 18, color: 'text-[#8B5CF6]' },
            { label: 'Offers Issued', value: totalOffersCount, screen: 19, color: 'text-[#DB2777]' },
            { label: 'Accepted', value: acceptedOffers, screen: 19, color: 'text-[#16A34A]' },
            { label: 'Placed', value: placedStudents, screen: 3, color: 'text-[#0891B2]' },
            { label: 'Acceptance %', value: `${acceptancePct}%`, screen: 23, color: 'text-[#D97706]' }
          ].map((kpi, idx) => (
            <button
              key={idx}
              onClick={() => onSelectScreen(kpi.screen)}
              className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-left hover:scale-[1.02] transition shadow-xs group cursor-pointer"
            >
              <div className="text-[11px] text-[#64748B] truncate font-medium">{kpi.label}</div>
              <div className={`text-xl font-black mt-1 ${kpi.color}`}>{kpi.value}</div>
              <div className="text-[10px] text-[#64748B] mt-1.5 flex items-center gap-1 group-hover:text-[#3155E7] transition font-medium">
                <span>View #{kpi.screen}</span>
                <ChevronRight className="w-2.5 h-2.5" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* =====================================================================
          3. STUDENT READINESS & COHORT VELOCITY (Section 10 & 40)
          ===================================================================== */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#3155E7]" />
              <span>Student Readiness & Competency Cohorts</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live employability readiness categorization based on mock drives, coding scores, and resume validation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectScreen(5)}
              className="text-xs text-[#3155E7] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Readiness Matrix</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-slate-400">·</span>
            <button
              onClick={() => onSelectScreen(6)}
              className="text-xs text-[#EF476F] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>At-Risk Engine</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-300">Placement Ready</span>
              <span className="font-black text-[#4F46E5]">{placementReady}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4F46E5] rounded-full"
                style={{ width: `${totalStudents > 0 ? (placementReady / totalStudents) * 100 : 0}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">Cleared all core criteria & mock technical interviews</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-300">Highly Employable</span>
              <span className="font-black text-[#7C3AED]">{highlyEmployable}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#7C3AED] rounded-full"
                style={{ width: `${totalStudents > 0 ? (highlyEmployable / totalStudents) * 100 : 0}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">Top tier DSA, system design & project credentials</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-300">Developing</span>
              <span className="font-black text-[#F59E0B]">{developing}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F59E0B] rounded-full"
                style={{ width: `${totalStudents > 0 ? (developing / totalStudents) * 100 : 0}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">Enrolled in active skill bridge & resume rework modules</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-300">At-Risk Interventions</span>
              <span className="font-black text-[#EF476F]">{atRisk}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#EF476F] rounded-full"
                style={{ width: `${totalStudents > 0 ? (atRisk / totalStudents) * 100 : 0}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">Assigned dedicated faculty mentors for intervention</p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. ACTIVE DRIVES & PLACEMENT CONFLICTS (Section 4 & 10)
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Placement Drives */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#3155E7]" />
                <span>Active Placement Drives</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-[#F59E0B] font-bold">
                  {activeDrives} Live
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Campus schedules, registered applicant volume and stage gates</p>
            </div>
            <button
              onClick={() => onSelectScreen(15)}
              className="text-xs text-[#3155E7] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>All Drives</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {drives.slice(0, 3).map(drive => (
              <div
                key={drive.id}
                onClick={() => onSelectScreen(15)}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-[#3155E7] transition cursor-pointer flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{drive.driveName}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      drive.status === 'SCHEDULED' ? 'bg-amber-500/20 text-[#F59E0B]' : 'bg-emerald-500/20 text-[#10B981]'
                    }`}>
                      {drive.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2 sm:gap-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#64748B]" />
                      {drive.date} ({drive.startTime})
                    </span>
                    <span>· {drive.venue}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-[#3155E7] font-mono">
                    {drive.registeredCandidatesCount} Candidates
                  </div>
                  <div className="text-[10px] text-slate-400">{drive.rounds.length} Assessment Rounds</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Placement Conflicts Monitoring (Section 4 & 10) */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#EF476F]" />
                <span>Placement Conflicts & Collisions</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-[#EF476F] font-bold">
                  {conflicts.length} Unresolved
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Automated clash detection across panels, venues, and student slots</p>
            </div>
            <button
              onClick={() => onSelectScreen(17)}
              className="text-xs text-[#EF476F] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Resolve in Matrix</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {conflicts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800">
                <Check className="w-6 h-6 text-[#10B981] mx-auto mb-1" />
                <span>No scheduling conflicts detected. All panels & venues clear.</span>
              </div>
            ) : (
              conflicts.slice(0, 3).map(conf => (
                <div
                  key={conf.id}
                  onClick={() => onSelectScreen(17)}
                  className="p-3 rounded-xl bg-slate-950/60 border border-rose-500/30 hover:border-[#EF476F] transition cursor-pointer flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{conf.title}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-[#EF476F]">
                        {conf.conflictType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {conf.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#EF476F] px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20">
                      1-Click Fix
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* =====================================================================
          5. CANDIDATE RELEASE & INTERVIEW PIPELINE (Section 4 & 10)
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidate Release Gate Status (Section 4 & 10) */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-500" />
                <span>Candidate Release Authorization Gates</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-[#F59E0B] font-bold">
                  Gate Controlled
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Recruiters cannot access student PII or profile records without active TPO grants.
              </p>
            </div>
            <button
              onClick={() => onSelectScreen(13)}
              className="text-xs text-[#3155E7] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Manage Gates</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">Active Grants</div>
              <div className="text-lg font-black text-[#10B981] mt-0.5">
                {candidateAccess.filter(ca => ca.accessStatus === 'ACTIVE').length}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Approved Corporate Access</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">Full Profile Scope</div>
              <div className="text-lg font-black text-[#3155E7] mt-0.5">
                {candidateAccess.filter(ca => ca.dataVisibilityScope === 'FULL_VERIFIED_PROFILE').length}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Unmasked Profile Scope</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">Revoked / Blocked</div>
              <div className="text-lg font-black text-[#EF476F] mt-0.5">
                {candidateAccess.filter(ca => ca.accessStatus === 'REVOKED').length}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Access Suspended</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
            <span className="text-slate-300 font-medium">Institutional Policy Compliance:</span>
            <span className="font-bold text-[#10B981] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% RBAC Enforced
            </span>
          </div>
        </section>

        {/* Upcoming Interviews & Check-in (Section 4 & 10) */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#3155E7]" />
                <span>Upcoming Interviews & Operations</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-[#3155E7] font-bold">
                  {interviews.length} Scheduled
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Live panel attendance, candidate check-in and stage progression</p>
            </div>
            <button
              onClick={() => onSelectScreen(18)}
              className="text-xs text-[#3155E7] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Interviews Screen</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {interviews.slice(0, 3).map(intv => (
              <div
                key={intv.id}
                onClick={() => onSelectScreen(18)}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-[#3155E7] transition cursor-pointer flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{intv.roundName}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/15 text-[#3155E7]">
                      {intv.attendanceStatus}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                    <span>{intv.scheduledTime}</span>
                    <span>· {intv.venueOrRoom}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-300 font-mono">
                    Candidate #{intv.studentId}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* =====================================================================
          6. PLACEMENT ANALYTICS & CTC BENCHMARKS (Section 10 & 40)
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branch Placement Conversion */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Branch-Wise Placement Conversion</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-[#4F46E5] font-bold">Live</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Students placed vs registered across engineering departments</p>
            </div>
            <button
              onClick={() => onSelectScreen(23)}
              className="text-xs text-[#3155E7] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Full Analytics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {branchStats.map(stat => (
              <div key={stat.branch} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{stat.branch} Department</span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {stat.placed} Placed / {stat.total} Students ({stat.rate}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    className="bg-[#3155E7] rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, stat.rate)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skill Demand vs Supply Matrix */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Skill Demand vs Candidate Supply</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-[#10B981] font-bold">Market Index</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Corporate recruiter requirements vs certified students</p>
            </div>
            <button
              onClick={() => onSelectScreen(23)}
              className="text-xs text-[#3155E7] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Skill Gap Report</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {[
              { skill: 'Distributed Systems & Microservices', demand: '94%', supply: '38%', deficit: 'Critical Deficit' },
              { skill: 'Cloud Architecture (AWS / GCP / Azure)', demand: '88%', supply: '52%', deficit: 'Moderate Gap' },
              { skill: 'Fullstack TypeScript & React', demand: '82%', supply: '74%', deficit: 'Balanced' },
              { skill: 'Core C++ & Algorithmic Problem Solving', demand: '90%', supply: '65%', deficit: 'High Demand' },
              { skill: 'Embedded C / Verilog (Hardware/ECE)', demand: '68%', supply: '42%', deficit: 'Specialized Gap' }
            ].map(item => (
              <div key={item.skill} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-200">{item.skill}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Recruiter Demand: <span className="text-[#F59E0B] font-bold">{item.demand}</span> · Pool Mastery: <span className="text-[#3155E7] font-bold">{item.supply}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${
                  item.deficit.includes('Critical')
                    ? 'bg-rose-500/20 text-[#EF476F] border-rose-500/30'
                    : item.deficit.includes('Gap') || item.deficit.includes('High')
                    ? 'bg-amber-500/20 text-[#F59E0B] border-amber-500/30'
                    : 'bg-emerald-500/20 text-[#10B981] border-emerald-500/30'
                }`}>
                  {item.deficit}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Corporate CTC Tier Breakdown */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-sm text-white mb-0.5 flex items-center gap-2">
            <span>Corporate CTC Tier Breakdown & Benchmarks</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-[#7C3AED] font-bold">CTC Bands</span>
          </h3>
          <p className="text-xs text-slate-400">Active offers categorized by institutional placement policy bands</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <div className="text-[10px] text-[#4F46E5] font-bold">SUPER DREAM</div>
            <div className="text-lg font-black text-white mt-0.5">₹30+ LPA</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Google, Microsoft, Uber</div>
          </div>
          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold">DREAM TIER</div>
            <div className="text-lg font-black text-white mt-0.5">₹15 - ₹30 LPA</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Oracle, TI, Cisco</div>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="text-[10px] text-[#10B981] font-bold">CORE TIER</div>
            <div className="text-lg font-black text-white mt-0.5">₹10 - ₹15 LPA</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Deloitte USI, L&T Infotech</div>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="text-[10px] text-[#F59E0B] font-bold">MASS TIER</div>
            <div className="text-lg font-black text-white mt-0.5">₹6 - ₹10 LPA</div>
            <div className="text-[10px] text-slate-400 mt-0.5">TCS Digital / Prime</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span className="text-slate-300 font-medium">Highest Verified On-Campus Package:</span>
          <span className="font-extrabold text-[#10B981] text-sm">
            ₹54.0 LPA (Google LLC · Aarav Singhania)
          </span>
        </div>
      </section>

      {/* =====================================================================
          7. AI INSIGHTS & RECENT ACTIVITY (Section 10 & 40)
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predictive AI Insights */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Predictive Placement AI Intelligence</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-[#3155E7] font-bold">AI Forecast</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Algorithmic risk detection and proactive drive recommendations</p>
            </div>
            <button
              onClick={() => onSelectScreen(24)}
              className="text-xs text-[#3155E7] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>AI Dashboard</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Cohort At-Risk Conversion Forecast</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-[#10B981] font-bold">
                  82% Positive
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                With mentor interventions active, 82% of current at-risk students are projected to reach placement readiness before Phase 2 drives.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Recruiter Retention & Repeat Hiring</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-[#3155E7] font-bold">
                  94% Retention
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                18 of 19 top tier employers have renewed campus visit commitments with average package expansion of +12.4%.
              </p>
            </div>
          </div>
        </section>

        {/* Recent Recruitment Activity & Audit Log */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <History className="w-4 h-4 text-[#3155E7]" />
                <span>Recent Operations & Audit Trail</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Immutable audit record of TPO actions, gate releases & policy changes</p>
            </div>
            <button
              onClick={() => onSelectScreen(36)}
              className="text-xs text-[#3155E7] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Full Audit Logs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {auditLogs.slice(0, 3).map(log => (
              <div
                key={log.id}
                className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between gap-3"
              >
                <div className="truncate">
                  <div className="font-semibold text-slate-200 truncate">{log.details}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Actor #{log.userId} · Action: <span className="font-mono text-[#3155E7]">{log.action}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
