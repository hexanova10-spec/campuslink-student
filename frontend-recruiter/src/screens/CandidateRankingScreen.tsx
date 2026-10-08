import React, { useState } from 'react';
import {
  Trophy,
  Sparkles,
  ShieldCheck,
  Medal,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Brain,
  Filter,
  Eye,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { useRecruiter } from '../context/RecruiterContext.tsx';

export const CandidateRankingScreen: React.FC = () => {
  const {
    company,
    jobs,
    applications,
    selectedJobId,
    setSelectedJobId,
    viewCandidate,
    setActiveScreen,
    theme
  } = useRecruiter();

  const isLight = theme === 'light';
  const currentJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  // Only authorized applicants for the selected job
  const jobApplications = applications
    .filter((a) => (selectedJobId ? a.jobId === selectedJobId : true))
    .sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0));

  const top3 = jobApplications.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
              <Trophy className="w-5 h-5" />
            </span>
            <h1 className={`text-2xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              AI Candidate Leaderboard & Ranking
            </h1>
          </div>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Algorithmic ranking calibrated against required competencies, project relevance, and academic cutoffs.
          </p>
        </div>

        {/* Security Isolation Tag */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Zero-Leak: Evaluates ONLY {company?.name} Applicants ({jobApplications.length})</span>
        </div>
      </div>

      {/* Requisition Selector Bar */}
      <div
        className={`rounded-2xl p-4 border transition-colors flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm ${
          isLight
            ? 'bg-white/80 backdrop-blur-xl border-slate-200/90 text-slate-800'
            : 'bg-slate-900/60 backdrop-blur-xl border-white/10 text-white'
        }`}
      >
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className={`text-xs uppercase font-bold tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Target Requisition:
          </span>
          <select
            value={selectedJobId || ''}
            onChange={(e) => setSelectedJobId(e.target.value)}
            aria-label="Target Requisition"
            className={`text-xs font-bold rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 cursor-pointer ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-800'
                : 'bg-slate-950 border-white/10 text-slate-200'
            }`}
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} ({job.openings} Openings • Min {job.minCgpa} CGPA)
              </option>
            ))}
          </select>
        </div>

        <div className={`flex items-center gap-3 text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          <span className="flex items-center gap-1.5 font-medium">
            <Brain className="w-3.5 h-3.5 text-blue-500" />
            Weighted Scoring: 40% Skills, 25% Projects, 20% Academics, 15% Readiness
          </span>
        </div>
      </div>

      {/* Top 3 Podium Cards - Royal Blue & White Glass Theme */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {top3.map((app, index) => {
            const rank = index + 1;
            const borderColors = [
              isLight ? 'border-amber-400/60 shadow-lg shadow-amber-500/5' : 'border-amber-500/40',
              isLight ? 'border-blue-400/50 shadow-lg shadow-blue-500/5' : 'border-blue-400/30',
              isLight ? 'border-slate-300 shadow-md' : 'border-slate-700'
            ];
            const badgeColors = [
              'bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black',
              'bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black',
              'bg-slate-700 text-white font-black'
            ];

            return (
              <div
                key={app.id}
                className={`relative border rounded-3xl p-6 flex flex-col justify-between transition-all hover:-translate-y-1 backdrop-blur-xl ${
                  isLight ? 'bg-white/80' : 'bg-slate-900/60'
                } ${borderColors[index] || 'border-slate-200'}`}
              >
                {/* Rank Ribbon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-md ${badgeColors[index]}`}>
                      #{rank}
                    </span>
                    <span className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                      {rank === 1 ? 'Top Recommended' : rank === 2 ? 'High Match' : 'Strong Contender'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                      {app.aiMatchScore}%
                    </span>
                    <span className={`text-[10px] block -mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Match Index
                    </span>
                  </div>
                </div>

                {/* Candidate Info */}
                <div className="space-y-2 mb-4">
                  <h3 className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {app.student?.fullName || 'Candidate'}
                  </h3>
                  <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {app.student?.collegeName} • {app.student?.branch}
                  </p>
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <span className={`px-2 py-0.5 rounded-md font-mono font-bold ${isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-800 text-slate-200'}`}>
                      CGPA {app.student?.cgpa}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 rounded-md font-semibold">
                      {app.student?.experience?.length || 0} exp
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-md font-semibold">
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* AI Justification Highlights */}
                <div
                  className={`rounded-2xl p-3.5 text-xs mb-4 space-y-2 border ${
                    isLight
                      ? 'bg-blue-50/60 border-blue-100 text-slate-700'
                      : 'bg-slate-950/60 border-white/10 text-slate-300'
                  }`}
                >
                  <div className="font-medium line-clamp-2">
                    {app.aiMatchBreakdown?.summary || 'High alignment across mandatory technical requirements and competitive coding record.'}
                  </div>
                  {app.aiMatchBreakdown?.whyRecommended && app.aiMatchBreakdown.whyRecommended.length > 0 && (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      Strengths: {app.aiMatchBreakdown.whyRecommended.slice(0, 2).join(', ')}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className={`flex items-center gap-2 pt-3 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                  <button
                    onClick={() => viewCandidate(app.studentId)}
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Dossier
                  </button>
                  <button
                    onClick={() => setActiveScreen('shortlist')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center transition-colors cursor-pointer border ${
                      isLight
                        ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    }`}
                    title="Manage in Pipeline"
                  >
                    Pipeline <ArrowRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Complete Ranked Leaderboard Table - Transparent Glass Theme */}
      <div
        className={`rounded-3xl border overflow-hidden shadow-xl transition-colors ${
          isLight
            ? 'bg-white/80 backdrop-blur-xl border-slate-200/90'
            : 'bg-slate-900/60 backdrop-blur-xl border-white/10'
        }`}
      >
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-950/40 border-white/10'
          }`}
        >
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Full Ranked Roster for {currentJob?.title || 'Selected Role'}
            </h3>
          </div>
          <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {jobApplications.length} Authorized Candidates Evaluated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr
                className={`border-b uppercase text-[11px] tracking-wider ${
                  isLight
                    ? 'bg-slate-100/70 text-slate-600 border-slate-200'
                    : 'bg-slate-950/60 text-slate-400 border-white/10'
                }`}
              >
                <th className="py-3 px-4 font-bold text-center w-12">Rank</th>
                <th className="py-3 px-4 font-bold">Candidate</th>
                <th className="py-3 px-4 font-bold text-center">Match Index</th>
                <th className="py-3 px-4 font-bold">Academic Merit</th>
                <th className="py-3 px-4 font-bold">Matched Skills</th>
                <th className="py-3 px-4 font-bold">Identified Gap</th>
                <th className="py-3 px-4 font-bold text-center">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-200/80' : 'divide-white/10'}`}>
              {jobApplications.map((app, index) => {
                const rank = index + 1;
                const score = app.aiMatchScore || 80;
                return (
                  <tr
                    key={app.id}
                    className={`transition-colors group cursor-pointer ${
                      isLight ? 'hover:bg-blue-50/60' : 'hover:bg-slate-800/40'
                    }`}
                    onClick={() => viewCandidate(app.studentId)}
                  >
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-[11px] ${
                          rank === 1
                            ? 'bg-amber-500 text-white shadow-sm'
                            : rank === 2
                            ? 'bg-blue-600 text-white shadow-sm'
                            : rank === 3
                            ? 'bg-slate-600 text-white'
                            : isLight
                            ? 'text-slate-600'
                            : 'text-slate-400 font-mono'
                        }`}
                      >
                        #{rank}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className={`font-bold transition-colors group-hover:text-blue-600 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {app.student?.fullName || 'Candidate'}
                      </div>
                      <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {app.student?.collegeName} • {app.student?.branch}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 rounded-full font-bold text-blue-700 dark:text-blue-300">
                        <TrendingUp className="w-3 h-3" />
                        {score}%
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className={`font-mono font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                        CGPA {app.student?.cgpa}
                      </div>
                      <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {app.student?.activeBacklogs === 0 ? 'Zero Backlogs' : `${app.student?.activeBacklogs} Backlogs`}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {app.student?.skills?.slice(0, 3).map((s: string) => (
                          <span
                            key={s}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                              isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {s}
                          </span>
                        ))}
                        {((app.student?.skills?.length || 0) > 3) && (
                          <span className={`text-[10px] self-center ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            +{(app.student?.skills?.length || 0) - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {app.aiMatchBreakdown?.gaps && app.aiMatchBreakdown.gaps.length > 0 ? (
                        <div className="flex items-center gap-1 text-amber-500 text-[11px] font-medium">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>{app.aiMatchBreakdown.gaps[0]}</span>
                        </div>
                      ) : (
                        <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>None detected</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-[10px] font-bold">
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => viewCandidate(app.studentId)}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer font-bold"
                        title="View Full Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Dossier</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
