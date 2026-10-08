import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  User,
  GraduationCap,
  Layers,
  Award
} from 'lucide-react';
import { useRecruiter } from '../context/RecruiterContext.tsx';
import { api } from '../services/api.ts';

export const CandidateMatchingScreen: React.FC = () => {
  const {
    jobs,
    applications,
    selectedJobId,
    setSelectedJobId,
    company,
    viewCandidate,
    refreshData
  } = useRecruiter();

  const [isRunningMatch, setIsRunningMatch] = useState(false);
  const [matchSuccess, setMatchSuccess] = useState(false);

  const activeJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];
  const jobApps = applications.filter((a) => a.jobId === activeJob?.id);

  const handleRunAIMatch = async () => {
    if (!activeJob) return;
    try {
      setIsRunningMatch(true);
      await api.matchCandidates(activeJob.id);
      await refreshData();
      setMatchSuccess(true);
      setTimeout(() => setMatchSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunningMatch(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shadow-blue-600/30">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              AI Candidate Multi-Factor Matching
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Scoped to {company?.name} Applicants
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gemini matches ONLY authorized applicants against requisition requirements across 8 core dimensions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={activeJob?.id || ''}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="bg-white text-slate-900 text-xs py-2 px-3.5 rounded-xl border border-blue-100 focus:outline-none focus:border-blue-500 cursor-pointer font-medium shadow-2xs"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleRunAIMatch}
            disabled={isRunningMatch}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <span>{isRunningMatch ? 'Analyzing Fit...' : 'Recalibrate AI Match'}</span>
          </button>
        </div>
      </div>

      {matchSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-bold shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Multi-factor matching scores updated across all {jobApps.length} authorized applicants!</span>
        </div>
      )}

      {/* Active Job Benchmark Card */}
      <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4 text-xs shadow-xs">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-bold">
            Active Job Benchmark
          </span>
          <p className="text-sm font-bold text-slate-900">{activeJob?.title}</p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-slate-600">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-mono font-bold">Min CGPA</span>
            <strong className="text-slate-900 font-mono text-xs">{activeJob?.minCgpa.toFixed(1)}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-mono font-bold">Mandatory Skills</span>
            <strong className="text-slate-900">{activeJob?.requiredSkills.join(', ')}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-mono font-bold">Target Candidates</span>
            <strong className="text-blue-700 font-mono text-xs">{jobApps.length} Authorized</strong>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {jobApps.map((app, idx) => {
          const breakdown = app.aiMatchBreakdown || {
            eligibilityScore: 90,
            skillMatchScore: 85,
            semanticSimilarity: 88,
            projectRelevance: 85,
            experienceScore: 80,
            certificationScore: 75,
            academicFit: 90,
            interviewReadiness: 85,
            whyRecommended: ['✓ Meets academic cutoff', '✓ Matches core tech stack'],
            gaps: ['⚠ Interview depth needed'],
            summary: 'Authorized applicant for review.'
          };

          return (
            <div
              key={app.id}
              className="bg-white/95 backdrop-blur-xl border border-blue-100 hover:border-blue-300 rounded-3xl p-6 space-y-4 transition-all shadow-xs"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-mono font-bold flex items-center justify-center text-xs border border-blue-200">
                    #{idx + 1}
                  </div>
                  <img
                    src={app.student?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                    alt={app.student?.fullName}
                    className="w-12 h-12 rounded-full object-cover border border-blue-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900">
                        {app.student?.fullName}
                      </h4>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                        CGPA {app.student?.cgpa}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {app.student?.branch} • {app.student?.collegeName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-2xl font-black text-blue-700 font-mono">
                      {app.aiMatchScore || 85}%
                    </span>
                    <p className="text-xs font-bold text-slate-700">
                      {app.aiRecommendation || 'Recommended'}
                    </p>
                  </div>

                  <button
                    onClick={() => viewCandidate(app.studentId)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    View Dossier
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-1 text-center font-mono">
                <div className="p-2 rounded-xl bg-blue-50/40 border border-blue-100">
                  <span className="text-[9px] text-slate-400 uppercase block truncate font-sans">Eligibility</span>
                  <span className="text-xs font-bold text-slate-900">{breakdown.eligibilityScore}%</span>
                </div>
                <div className="p-2 rounded-xl bg-blue-50/40 border border-blue-100">
                  <span className="text-[9px] text-slate-400 uppercase block truncate font-sans">Skill Match</span>
                  <span className="text-xs font-bold text-slate-900">{breakdown.skillMatchScore}%</span>
                </div>
                <div className="p-2 rounded-xl bg-blue-50/40 border border-blue-100">
                  <span className="text-[9px] text-slate-400 uppercase block truncate font-sans">Semantic Sim</span>
                  <span className="text-xs font-bold text-slate-900">{breakdown.semanticSimilarity}%</span>
                </div>
                <div className="p-2 rounded-xl bg-blue-50/40 border border-blue-100">
                  <span className="text-[9px] text-slate-400 uppercase block truncate font-sans">Project Rel</span>
                  <span className="text-xs font-bold text-slate-900">{breakdown.projectRelevance}%</span>
                </div>
                <div className="p-2 rounded-xl bg-blue-50/40 border border-blue-100">
                  <span className="text-[9px] text-slate-400 uppercase block truncate font-sans">Experience</span>
                  <span className="text-xs font-bold text-slate-900">{breakdown.experienceScore}%</span>
                </div>
                <div className="p-2 rounded-xl bg-blue-50/40 border border-blue-100">
                  <span className="text-[9px] text-slate-400 uppercase block truncate font-sans">Certifications</span>
                  <span className="text-xs font-bold text-slate-900">{breakdown.certificationScore}%</span>
                </div>
                <div className="p-2 rounded-xl bg-blue-50/40 border border-blue-100">
                  <span className="text-[9px] text-slate-400 uppercase block truncate font-sans">Academic Fit</span>
                  <span className="text-xs font-bold text-slate-900">{breakdown.academicFit}%</span>
                </div>
                <div className="p-2 rounded-xl bg-blue-50/40 border border-blue-100">
                  <span className="text-[9px] text-slate-400 uppercase block truncate font-sans">Readiness</span>
                  <span className="text-xs font-bold text-slate-900">{breakdown.interviewReadiness}%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-1.5">
                  <span className="font-bold text-emerald-800 uppercase tracking-wider font-mono text-[10px] block">
                    WHY RECOMMENDED
                  </span>
                  <ul className="space-y-1">
                    {breakdown.whyRecommended?.map((r, i) => (
                      <li key={i} className="text-emerald-900">
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-1.5">
                  <span className="font-bold text-amber-800 uppercase tracking-wider font-mono text-[10px] block">
                    IDENTIFIED GAPS &amp; PROBING AREAS
                  </span>
                  <ul className="space-y-1">
                    {breakdown.gaps?.length ? (
                      breakdown.gaps.map((g, i) => (
                        <li key={i} className="text-amber-900">
                          {g}
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500">No critical competency gaps identified.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
