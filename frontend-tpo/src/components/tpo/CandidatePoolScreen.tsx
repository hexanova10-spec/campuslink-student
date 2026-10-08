import React, { useState } from 'react';
import { Layers, ArrowRight, CheckCircle2, UserCheck, KeyRound, Sparkles, Filter, Search } from 'lucide-react';
import { repo } from '../../services/storage';

interface CandidatePoolScreenProps {
  onSelectScreen: (screenId: number) => void;
  onSelectStudent: (studentId: string) => void;
}

export const CandidatePoolScreen: React.FC<CandidatePoolScreenProps> = ({ onSelectScreen, onSelectStudent }) => {
  const jobs = repo.getJobs();
  const students = repo.getStudents();
  const applications = repo.getApplications();
  const candidateAccess = repo.getCandidateAccessRecords();

  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];
  const jobApps = applications.filter(a => a.jobId === selectedJobId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
            Drive Candidate Pool Verification
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review applicant cohort per placement drive before authorizing candidate exposure to recruiter portals.
          </p>
        </div>

        <button
          onClick={() => onSelectScreen(13)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
        >
          <KeyRound className="w-4 h-4 text-amber-300" />
          <span>Go to Candidate Release Control</span>
        </button>
      </div>

      {/* Select Job Drive */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-indigo-400" />
          <span className="text-xs font-bold text-slate-300 uppercase">Select Drive Role:</span>
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
          {jobApps.length} Registered Applicants
        </span>
      </div>

      {/* Candidate Pool Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
              <th className="py-3 px-4">Candidate & Roll No</th>
              <th className="py-3 px-3">CGPA</th>
              <th className="py-3 px-3">AI Match Score</th>
              <th className="py-3 px-3">Eligibility</th>
              <th className="py-3 px-3">Recruiter Access Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {jobApps.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-500 text-xs">
                  No registered applications for this position.
                </td>
              </tr>
            ) : (
              jobApps.map(app => {
                const stu = students.find(s => s.id === app.studentId);
                const hasAccess = candidateAccess.some(
                  ca => ca.jobId === app.jobId && ca.studentId === app.studentId && ca.accessStatus === 'ACTIVE'
                );

                if (!stu) return null;

                return (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{stu.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{stu.rollNumber} • {stu.branch}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-300">
                      {stu.cgpa.toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-purple-300 font-mono">{app.aiMatchScore}%</span>
                    </td>
                    <td className="py-3 px-3">
                      {app.isEligible ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          ELIGIBLE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                          INELIGIBLE
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {hasAccess ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          RELEASED TO RECRUITER
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                          GATE LOCKED (TPO HOLD)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectStudent(stu.id)}
                        className="text-xs text-indigo-400 hover:underline font-semibold"
                      >
                        Inspect Record
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
