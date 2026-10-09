import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { DashboardData } from '../../types/student';
import { CommandRoadmap } from '../roadmap/CommandRoadmap';
import {
  ShieldCheck,
  TrendingUp,
  FileText,
  Target,
  Briefcase,
  CalendarCheck2,
  Trophy,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Clock,
  MapPin,
  Building,
  CheckCircle2,
  ChevronRight,
  BotMessageSquare,
  Zap
} from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const { student, setCurrentScreen, setSelectedJobId } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);

    // The public demo is intentionally frontend-only, so it must not call /api.
    if (api.getToken() === 'campuslink-demo-student-session') {
      const demoStudent = student || {
        id: 'demo-student-001',
        user_id: 'demo-user-001',
        full_name: 'Siddharth Das',
        college_name: 'KIIT University, Bhubaneswar',
        branch: 'Computer Science & Engineering',
        target_role: 'Full Stack Developer',
      };
      const now = new Date().toISOString();
      setData({
        student: demoStudent as DashboardData['student'],
        readinessScore: {
          id: 'demo-readiness-001',
          student_id: demoStudent.id,
          overall_score: 78,
          category: 'READY',
          academic_factor: 82,
          skill_factor: 76,
          project_factor: 74,
          resume_factor: 80,
          mock_interview_factor: 70,
          strengths: ['Core programming', 'Problem solving', 'Project experience'],
          needs_improvement: ['System design', 'Interview communication'],
          action_items: ['Practice mock interviews', 'Polish resume projects'],
          calculated_at: now,
        },
        profileCompletion: 82,
        resumeScore: 80,
        skillCoverage: 76,
        applicationsCount: 4,
        upcomingInterviewsCount: 1,
        upcomingInterviews: [],
        offersCount: 0,
        pendingOffers: [],
        pendingDocumentsCount: 1,
        unreadNotificationsCount: 3,
        aiInsight: 'You are making good progress. Strengthen interview practice and highlight measurable outcomes in your projects.',
        recommendedJobs: [],
        targetRole: demoStudent.target_role || 'Full Stack Developer',
      });
      setLoading(false);
      return;
    }

    try {
      const res = await api.getDashboard();
      setData(res);
    } catch (err: any) {
      console.error('Failed to load dashboard:', err);
      setError(err?.message || 'Unable to load your placement dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Loading your placement command center...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-white/80 dark:bg-[#070e22]/80 p-6 text-center shadow-xl">
          <AlertTriangle className="w-8 h-8 mx-auto text-rose-500 mb-3" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Dashboard could not be loaded</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{error || 'The backend returned no dashboard data.'}</p>
          <button onClick={fetchDashboard} className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold">Retry</button>
        </div>
      </div>
    );
  }

  const score = data.readinessScore.overall_score;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Hero Banner in Royal Blue & White Glass */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 text-white p-6 sm:p-8 shadow-2xl shadow-blue-700/20 border border-white/20 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30 uppercase tracking-wider">
                Placement Command Center
              </span>
              <span className="text-xs text-blue-100 font-medium">
                {student?.college_name} • {student?.branch}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {student?.full_name?.split(' ')[0]}! 🚀
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Know Your Readiness. Discover Your Opportunity. Get Placement Ready.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setCurrentScreen('ai-career-assistant')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold transition-all shadow-lg hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Ask AI Career Coach</span>
            </button>
            <button
              onClick={() => setCurrentScreen('mock-interview')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900/40 hover:bg-blue-900/60 text-white text-xs font-semibold border border-white/30 backdrop-blur-md transition-all"
            >
              <BotMessageSquare className="w-4 h-4 text-cyan-300" />
              <span>Simulate Mock Interview</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Readiness & Core KPIs in Transparent Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Employability Score Card */}
        <div
          onClick={() => setCurrentScreen('readiness-score')}
          className="group relative bg-white/80 dark:bg-[#070e22]/75 backdrop-blur-xl border border-blue-200/80 dark:border-blue-900/50 hover:border-blue-500 rounded-2xl p-5 cursor-pointer transition-all shadow-lg hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">AI Readiness Score</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{score}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">/ 100</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 uppercase">
            {data.readinessScore.category}
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform">
            <span>View score breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Profile Completion */}
        <div
          onClick={() => setCurrentScreen('profile')}
          className="group bg-white/80 dark:bg-[#070e22]/75 backdrop-blur-xl border border-blue-200/80 dark:border-blue-900/50 hover:border-blue-500 rounded-2xl p-5 cursor-pointer transition-all shadow-lg hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Profile Dossier</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{data.profileCompletion}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${data.profileCompletion}%` }} />
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform">
            <span>Edit profile attributes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Resume ATS Score */}
        <div
          onClick={() => setCurrentScreen('ai-resume-analysis')}
          className="group bg-white/80 dark:bg-[#070e22]/75 backdrop-blur-xl border border-blue-200/80 dark:border-blue-900/50 hover:border-blue-500 rounded-2xl p-5 cursor-pointer transition-all shadow-lg hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Resume ATS Audit</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{data.resumeScore}%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Match</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
            High ATS Compliance
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform">
            <span>Run AI Resume Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Target Role Skill Coverage */}
        <div
          onClick={() => setCurrentScreen('skill-gap')}
          className="group bg-white/80 dark:bg-[#070e22]/75 backdrop-blur-xl border border-blue-200/80 dark:border-blue-900/50 hover:border-blue-500 rounded-2xl p-5 cursor-pointer transition-all shadow-lg hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Skill Coverage</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{data.skillCoverage}%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">for {data.targetRole}</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${data.skillCoverage}%` }} />
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform">
            <span>Address critical gaps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* AI Insight Callout Card (Transparent Royal Blue Glass) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600/15 via-indigo-600/10 to-cyan-500/15 dark:from-blue-950/60 dark:via-indigo-950/40 dark:to-[#070e22]/60 border border-blue-200 dark:border-blue-500/30 backdrop-blur-xl shadow-lg flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md shadow-blue-600/25">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-950 dark:text-white uppercase tracking-wider">AI Executive Placement Insight</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-mono font-bold">
              Live Synthesized
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            "{data.aiInsight}"
          </p>
        </div>
        <button
          onClick={() => setCurrentScreen('ai-career-assistant')}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex-shrink-0 shadow-sm transition-colors"
        >
          <span>Deep Dive</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Urgent Placement Alerts / Upcoming Interviews & Offers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Interviews Alert */}
        <div className="bg-white/80 dark:bg-[#070e22]/75 backdrop-blur-xl border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarCheck2 className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Upcoming Interviews</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300">
                {data.upcomingInterviewsCount} Scheduled
              </span>
            </div>
            <button
              onClick={() => setCurrentScreen('interview-schedule')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {data.upcomingInterviews.length > 0 ? (
            <div className="space-y-3">
              {data.upcomingInterviews.map((int) => (
                <div
                  key={int.id}
                  className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-[#040814]/70 border border-blue-100 dark:border-slate-800 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{int.company_name}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                          {int.reminder_24h_sent ? '24h Reminder Active' : 'Scheduled'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{int.round_name}</p>
                    </div>
                    <span className="text-xs font-mono text-blue-600 dark:text-cyan-400 font-bold">{int.interview_time}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-blue-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Date: {int.interview_date}</span>
                    <a
                      href={int.venue_or_meeting_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1"
                    >
                      <span>Join Meeting</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">No interviews scheduled in the next 48 hours.</p>
          )}
        </div>

        {/* Offers & Pending Documents */}
        <div className="bg-white/80 dark:bg-[#070e22]/75 backdrop-blur-xl border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-500" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Placement Offers Won</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  {data.offersCount} Active
                </span>
              </div>
              <button
                onClick={() => setCurrentScreen('offers')}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                <span>View Dossier</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {data.pendingOffers.length > 0 ? (
              <div className="space-y-3">
                {data.pendingOffers.map((off) => (
                  <div
                    key={off.id}
                    className="p-3.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{off.company_name}</div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">{off.role_title} • {off.location}</div>
                      <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{off.ctc}</div>
                    </div>
                    <button
                      onClick={() => setCurrentScreen('offers')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                    >
                      Review Offer
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-3 text-center">Applications in progress.</p>
            )}
          </div>

          {/* Pending Verification Notice */}
          <div className="mt-4 pt-3 border-t border-blue-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{data.pendingDocumentsCount} document(s) pending verification</span>
            </div>
            <button
              onClick={() => setCurrentScreen('documents')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Resolve in Locker
            </button>
          </div>
        </div>
      </div>

      {/* Interactive 30-Day Placement Sprint Roadmap */}
      <CommandRoadmap />

      {/* Recommended Jobs Preview */}
      <div className="bg-white/80 dark:bg-[#070e22]/75 backdrop-blur-xl border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Recommended Campus Drives</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Filtered for published, open drives matching your branch ({student?.branch}) and CGPA eligibility.
            </p>
          </div>
          <button
            onClick={() => setCurrentScreen('recommended-jobs')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 text-xs font-semibold text-blue-700 dark:text-blue-300 transition-colors border border-blue-200/60 dark:border-slate-700"
          >
            <span>Explore All Drives</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.recommendedJobs.map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-xl bg-blue-50/50 dark:bg-[#040814]/70 border border-blue-100/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{job.company_name}</h3>
                    <p className="text-xs text-blue-600 dark:text-blue-300 font-semibold">{job.role_title}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{job.matchPercentage}% MATCH</span>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Cutoff: {job.min_cgpa} CGPA</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400 mb-3">
                  <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <Building className="w-3 h-3" />
                    {job.ctc}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.location}
                  </span>
                </div>

                {/* Match & Missing Pills */}
                <div className="space-y-1.5 mb-4 text-[11px]">
                  <div className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span>Eligible: CGPA met, 0 backlogs, verified branch</span>
                  </div>
                  {job.missingSkills && job.missingSkills.length > 0 && (
                    <div className="text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                      <span>Missing gap: {job.missingSkills.slice(0, 2).join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-blue-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Deadline: {job.application_deadline}</span>
                <button
                  onClick={() => {
                    setSelectedJobId(job.id);
                    setCurrentScreen('job-details');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                >
                  <span>Review Drive</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
