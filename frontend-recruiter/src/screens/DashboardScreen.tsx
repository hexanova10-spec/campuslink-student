import React from 'react';
import {
  Briefcase,
  Users,
  Sparkles,
  Calendar,
  Award,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  FileText,
  Plus
} from 'lucide-react';
import { useRecruiter } from '../context/RecruiterContext.tsx';

export const DashboardScreen: React.FC = () => {
  const {
    company,
    recruiter,
    jobs,
    applications,
    interviews,
    offers,
    drives,
    setActiveScreen,
    viewCandidate,
    openInterviewEval,
    theme
  } = useRecruiter();

  const isLight = theme === 'light';

  const openJobsCount = jobs.filter((j) => j.status === 'ACTIVE').length;
  const activeDrivesCount = drives.length;
  const authorizedApplicantsCount = applications.length;
  const aiShortlistCount = applications.filter((a) => (a.aiMatchScore || 0) >= 80).length;
  const upcomingInterviewsCount = interviews.filter((i) => i.status === 'SCHEDULED').length;
  const pendingOffersCount = offers.filter((o) => o.status === 'ISSUED').length;
  const pendingActionsCount =
    applications.filter((a) => a.status === 'UNDER REVIEW' || a.status === 'APPLIED').length +
    upcomingInterviewsCount;

  return (
    <div className="space-y-6">
      {/* Welcome & AI Insight Card - Royal Blue & White Glass */}
      <div
        className={`rounded-3xl p-6 md:p-8 relative overflow-hidden transition-all duration-300 shadow-xl ${
          isLight
            ? 'bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shadow-blue-600/20'
            : 'bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 border border-blue-500/30 text-white shadow-2xl'
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white border border-white/30 backdrop-blur-md">
               Recruitment Workspace
              </span>
              <span className="flex items-center gap-1 text-xs text-emerald-300 font-bold bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5" /> Zero-Leak Enforced
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Welcome back, {recruiter?.name}
            </h1>
            <p className="text-sm text-blue-100 max-w-2xl leading-relaxed">
              Managing campus talent acquisition pipeline for <strong className="text-white font-bold">{company?.name}</strong>.
              Protected by student-authorized data boundary regulations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveScreen('create_job')}
              className="px-4 py-2.5 rounded-xl bg-white text-blue-800 hover:bg-blue-50 font-bold text-xs transition-all shadow-md shadow-black/10 flex items-center gap-2 cursor-pointer hover:scale-105"
            >
              <Plus className="w-4 h-4 text-blue-700" /> Post Requisition
            </button>
            <button
              onClick={() => setActiveScreen('jd_upload')}
              className="px-4 py-2.5 rounded-xl bg-blue-800/60 hover:bg-blue-800 text-white border border-white/20 font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <FileText className="w-4 h-4 text-white" /> Upload & Parse JD
            </button>
          </div>
        </div>

        {/* AI Insight Callout */}
        <div className="mt-6 pt-5 border-t border-white/20 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-black/20 p-4 rounded-2xl backdrop-blur-md border border-white/15">
          <div className="p-2.5 bg-blue-500/30 rounded-xl text-white shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider font-mono text-blue-200">
                AI RECRUITER INSIGHT
              </span>
              <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">
                Live Calibrated
              </span>
            </div>
            <p className="text-sm font-semibold text-white mt-1">
              &quot;42 eligible applicants are available for Software Engineer. 13 have a match score above 80%.&quot;
            </p>
            <p className="text-xs text-blue-100 mt-0.5">
              Top candidate <strong className="text-white underline">Rahul Verma (94% match)</strong> demonstrates direct alignment with high-throughput backend technologies.
            </p>
          </div>
          <button
            onClick={() => setActiveScreen('candidate_ranking')}
            className="text-xs bg-white text-blue-700 hover:bg-blue-50 px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1 shrink-0 shadow-sm transition-transform cursor-pointer"
          >
            View Leaderboard <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 7 Key Counters Cards - Frosted Glass & Royal Blue Theme */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          {
            title: 'Open Jobs',
            count: openJobsCount,
            sub: 'Requisitions',
            icon: Briefcase,
            color: 'text-blue-500',
            screen: 'jobs'
          },
          {
            title: 'Active Drives',
            count: activeDrivesCount,
            sub: 'TPO Scheduled',
            icon: Calendar,
            color: 'text-emerald-500',
            screen: 'drives'
          },
          {
            title: 'Applicants',
            count: authorizedApplicantsCount,
            sub: 'Authorized Only',
            icon: Users,
            color: 'text-blue-600',
            screen: 'applicants'
          },
          {
            title: 'AI Shortlist',
            count: aiShortlistCount,
            sub: '> 80% Match',
            icon: Sparkles,
            color: 'text-amber-500',
            screen: 'candidate_ranking'
          },
          {
            title: 'Interviews',
            count: upcomingInterviewsCount,
            sub: 'Scheduled / Live',
            icon: Clock,
            color: 'text-indigo-500',
            screen: 'interview_schedule'
          },
          {
            title: 'Offers',
            count: pendingOffersCount,
            sub: 'Issued Letters',
            icon: Award,
            color: 'text-purple-500',
            screen: 'offers'
          },
          {
            title: 'Pending',
            count: pendingActionsCount,
            sub: 'Action Items',
            icon: AlertCircle,
            color: 'text-rose-500',
            screen: 'shortlist'
          }
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => setActiveScreen(card.screen as any)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer group hover:-translate-y-1 ${
                isLight
                  ? 'bg-white/75 backdrop-blur-xl border-slate-200/80 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-600/10'
                  : 'bg-slate-900/60 backdrop-blur-xl border-white/10 hover:border-blue-500/50 hover:shadow-xl'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {card.title}
                </span>
                <Icon className={`w-4 h-4 ${card.color} group-hover:scale-110 transition-transform`} />
              </div>
              <div className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {card.count}
              </div>
              <div className={`text-[10px] mt-1 font-mono font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {card.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Top Ranked Applicants vs Upcoming Interviews & Drives */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Top Applicants */}
        <div
          className={`lg:col-span-2 rounded-3xl p-6 border transition-colors shadow-lg ${
            isLight
              ? 'bg-white/75 backdrop-blur-xl border-slate-200/80'
              : 'bg-slate-900/60 backdrop-blur-xl border-white/10'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Users className="w-4 h-4 text-blue-600" /> Top Authorized Applicants
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Ranked by AI Multi-Factor Scoring (Skills, Projects, CGPA, Competency)
              </p>
            </div>
            <button
              onClick={() => setActiveScreen('applicants')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              View All ({applications.length}) <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className={`divide-y ${isLight ? 'divide-slate-200/80' : 'divide-white/10'}`}>
            {applications.slice(0, 4).map((app, idx) => (
              <div
                key={app.id}
                className={`py-3.5 flex items-center justify-between gap-4 px-2 rounded-xl transition-colors ${
                  isLight ? 'hover:bg-blue-50/50' : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-6 text-center font-mono font-bold text-sm ${
                      idx === 0
                        ? 'text-amber-500 font-black'
                        : idx === 1
                        ? 'text-slate-400'
                        : isLight
                        ? 'text-slate-600'
                        : 'text-slate-400'
                    }`}
                  >
                    #{idx + 1}
                  </div>
                  <img
                    src={app.student?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                    alt={app.student?.fullName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/30 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {app.student?.fullName || 'Candidate'}
                      </p>
                      <span
                        className={`text-[10px] px-2 py-0.5 font-mono font-bold rounded-md border ${
                          isLight
                            ? 'bg-slate-100 text-slate-700 border-slate-200'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        CGPA {app.student?.cgpa || '8.5'}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {app.student?.branch || 'Computer Science'} • {app.jobTitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-500 font-mono">
                      {app.aiMatchScore || 85}%
                    </span>
                    <p className={`text-[10px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {app.aiRecommendation || 'Recommended'}
                    </p>
                  </div>

                  <button
                    onClick={() => viewCandidate(app.studentId)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    Dossier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Upcoming Interviews & Drives */}
        <div className="space-y-6">
          <div
            className={`rounded-3xl p-5 border transition-colors shadow-lg space-y-4 ${
              isLight
                ? 'bg-white/75 backdrop-blur-xl border-slate-200/80'
                : 'bg-slate-900/60 backdrop-blur-xl border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Clock className="w-4 h-4 text-blue-600" /> Upcoming Interviews
              </h3>
              <button
                onClick={() => setActiveScreen('interview_schedule')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Calendar
              </button>
            </div>

            <div className="space-y-3">
              {interviews.slice(0, 3).map((intv) => (
                <div
                  key={intv.id}
                  className={`p-3 rounded-2xl border flex items-start justify-between gap-3 ${
                    isLight
                      ? 'bg-slate-50/70 border-slate-200'
                      : 'bg-slate-800/40 border-white/10'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {intv.studentName}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                        {intv.roundName}
                      </span>
                    </div>
                    <p className={`text-xs truncate max-w-[170px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {intv.jobTitle}
                    </p>
                    <p className={`text-[11px] flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      <Calendar className="w-3 h-3 text-blue-500" />
                      {intv.scheduledTime}
                    </p>
                  </div>

                  <button
                    onClick={() => openInterviewEval(intv.id)}
                    className="px-2.5 py-1 text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Evaluate
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`rounded-3xl p-5 border transition-colors shadow-lg space-y-4 ${
              isLight
                ? 'bg-white/75 backdrop-blur-xl border-slate-200/80'
                : 'bg-slate-900/60 backdrop-blur-xl border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Calendar className="w-4 h-4 text-emerald-500" /> Placement Drives
              </h3>
              <button
                onClick={() => setActiveScreen('drives')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {drives.map((drv) => (
                <div
                  key={drv.id}
                  className={`p-3.5 rounded-2xl border space-y-1.5 ${
                    isLight
                      ? 'bg-slate-50/70 border-slate-200'
                      : 'bg-slate-800/40 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-bold truncate max-w-[170px] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {drv.driveTitle}
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      TPO Approved
                    </span>
                  </div>
                  <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {drv.campusName} • {drv.driveDate}
                  </p>
                  <p className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Target: {drv.targetCandidateCount} Candidates • {drv.interviewType}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
