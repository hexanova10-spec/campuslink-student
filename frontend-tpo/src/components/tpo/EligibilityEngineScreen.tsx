import React, { useState } from 'react';
import {
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  Users,
  Briefcase,
  Search,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { repo } from '../../services/storage';
import { evaluateEligibility, evaluateStudentPool } from '../../services/eligibilityEngine';
import { Student, Job } from '../../types';

export const EligibilityEngineScreen: React.FC = () => {
  const students = repo.getStudents();
  const jobs = repo.getJobs();

  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'SINGLE_TEST' | 'POOL_EVALUATION'>('SINGLE_TEST');

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];
  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const singleResult = selectedJob && selectedStudent
    ? evaluateEligibility(selectedStudent, selectedJob)
    : null;

  const poolResult = selectedJob
    ? evaluateStudentPool(students, selectedJob)
    : { eligible: [], ineligible: [] };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
              Deterministic Institutional Eligibility Engine
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Deterministic Rules Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Exact mathematical verification across CGPA cutoffs, engineering branches, academic backlogs, and cohort constraints without LLM hallucinations.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('SINGLE_TEST')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'SINGLE_TEST' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Candidate Audit
          </button>
          <button
            onClick={() => setActiveTab('POOL_EVALUATION')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'POOL_EVALUATION' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Batch Pool Audit ({students.length} Candidates)
          </button>
        </div>
      </div>

      {/* Target Job Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Evaluating Rules for Drive / Job Role:
            </div>
            <select
              value={selectedJobId}
              onChange={e => setSelectedJobId(e.target.value)}
              className="mt-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
            >
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.title} (₹{j.ctcLPA} LPA, Min CGPA {j.eligibilityCriteria.minCgpa.toFixed(1)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedJob && (
          <div className="text-xs text-slate-300 flex flex-wrap items-center gap-3">
            <span>Cutoff: <strong className="text-white font-mono">{selectedJob.eligibilityCriteria.minCgpa.toFixed(2)}</strong></span>
            <span>• Max Backlogs: <strong className="text-white font-mono">{selectedJob.eligibilityCriteria.maxBacklogs}</strong></span>
            <span>• Branches: <strong className="text-indigo-400">{selectedJob.eligibilityCriteria.eligibleBranches.join(', ')}</strong></span>
          </div>
        )}
      </div>

      {/* TAB 1: SINGLE CANDIDATE LIVE AUDIT */}
      {activeTab === 'SINGLE_TEST' && singleResult && selectedStudent && selectedJob && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Candidate Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="font-bold text-sm text-white">Select Student for Live Rule Testing</h3>
            
            <div className="space-y-1.5 max-h-[420px] overflow-y-auto">
              {students.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudentId(s.id)}
                  className={`w-full text-left p-3 rounded-xl text-xs transition border flex items-center justify-between ${
                    s.id === selectedStudentId
                      ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div>{s.fullName}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {s.branch} • CGPA {s.cgpa.toFixed(2)} • {s.activeBacklogs} Backlogs
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              ))}
            </div>
          </div>

          {/* Audit Result Display */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Audit Verdict for {selectedStudent.fullName} ({selectedStudent.rollNumber})
                </span>
                <h2 className="text-xl font-black text-white mt-0.5">{selectedJob.title}</h2>
              </div>

              <div className={`px-4 py-2 rounded-xl text-sm font-extrabold flex items-center gap-2 border ${
                singleResult.isEligible
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {singleResult.isEligible ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>ELIGIBLE</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>NOT ELIGIBLE</span>
                  </>
                )}
              </div>
            </div>

            {/* Exact Audit Reason Summary Box */}
            <div className={`p-4 rounded-xl border text-xs font-medium ${
              singleResult.isEligible
                ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                : 'bg-rose-950/30 border-rose-800/50 text-rose-200'
            }`}>
              <div className="font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>Deterministic Verification Statement:</span>
              </div>
              <p className="font-mono">{singleResult.summaryMessage}</p>
            </div>

            {/* Failure Breakdown if Ineligible */}
            {singleResult.failures.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-rose-400">
                  Unsatisfied Constraints ({singleResult.failures.length} Criteria Failed):
                </h3>
                <div className="space-y-2">
                  {singleResult.failures.map((f, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-slate-950 border border-rose-900/40 text-xs space-y-1.5"
                    >
                      <div className="font-bold text-rose-300 flex items-center justify-between">
                        <span>Rule: {f.rule}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">VIOLATION</span>
                      </div>
                      <div className="text-slate-300 font-mono text-[11px] bg-slate-900/80 p-2 rounded-lg">
                        {f.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Passed Rules */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Verified Cleared Criteria ({singleResult.passedRules.length}):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {singleResult.passedRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BATCH POOL AUDIT */}
      {activeTab === 'POOL_EVALUATION' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Eligible Pool */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Eligible Candidates ({poolResult.eligible.length})</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {Math.round((poolResult.eligible.length / (students.length || 1)) * 100)}% Conversion
              </span>
            </div>

            <div className="space-y-2">
              {poolResult.eligible.map(({ student }) => (
                <div
                  key={student.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-white">{student.fullName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {student.rollNumber} • {student.branch} • CGPA {student.cgpa.toFixed(2)}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    PASSED ALL RULES
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ineligible Pool */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-rose-300 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Disqualified Candidates ({poolResult.ineligible.length})</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Audit Log Recorded</span>
            </div>

            <div className="space-y-2">
              {poolResult.ineligible.map(({ student, result }) => (
                <div
                  key={student.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1.5"
                >
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-slate-300">{student.fullName}</div>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                      {result.failures.length} FAILURE(S)
                    </span>
                  </div>
                  <div className="text-[11px] text-rose-400/90 font-mono">
                    {result.failures.map(f => f.reason).join('; ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
