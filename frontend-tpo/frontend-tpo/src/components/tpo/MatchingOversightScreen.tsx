import React, { useState } from 'react';
import { Sparkles, Briefcase, Award, AlertCircle, CheckCircle, ArrowRight, Layers } from 'lucide-react';
import { repo } from '../../services/storage';

export const MatchingOversightScreen: React.FC = () => {
  const jobs = repo.getJobs();
  const students = repo.getStudents();
  const applications = repo.getApplications();

  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  const jobApps = applications
    .filter(a => a.jobId === selectedJobId)
    .sort((a, b) => b.aiMatchScore - a.aiMatchScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
            AI Matching Oversight & Candidate Ranking
          </h1>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI MATCH ENGINE
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Pre-release audit of algorithmic student rankings, skill gap matrices, and explainability rationale.
        </p>
      </div>

      {/* Drive Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Briefcase className="w-5 h-5 text-indigo-400" />
          <span className="text-xs font-bold text-slate-300 uppercase">Evaluating Role:</span>
          <select
            value={selectedJobId}
            onChange={e => setSelectedJobId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
          >
            {jobs.map(j => (
              <option key={j.id} value={j.id}>
                {j.title} (₹{j.ctcLPA} LPA)
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Required Competencies: {selectedJob?.eligibilityCriteria.requiredSkills.join(', ') || 'Core Engineering'}
        </span>
      </div>

      {/* Ranked Candidate Match Matrix */}
      <div className="space-y-3">
        {jobApps.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
            No applicants for this role yet.
          </div>
        ) : (
          jobApps.map((app, index) => {
            const stu = students.find(s => s.id === app.studentId);
            if (!stu) return null;

            return (
              <div
                key={app.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 hover:border-slate-700 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center font-bold text-purple-300 text-xs font-mono">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{stu.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {stu.rollNumber} • {stu.branch} • CGPA {stu.cgpa.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-slate-400">AI Match Index</div>
                      <div className="text-lg font-black text-purple-300 font-mono">{app.aiMatchScore}%</div>
                    </div>
                  </div>
                </div>

                {/* Match Explainability */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Skill Alignment:</span>
                    <span className="font-bold text-emerald-400 font-mono">{app.skillMatchPercentage}% Match</span>
                  </div>

                  {app.skillGaps.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-rose-400 font-semibold">Identified Skill Deficits:</span>
                      <div className="flex flex-wrap gap-1">
                        {app.skillGaps.map((gap, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px]"
                          >
                            {gap}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/80">
                    "Candidate provides strong foundational systems background with verified GitHub artifacts."
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
