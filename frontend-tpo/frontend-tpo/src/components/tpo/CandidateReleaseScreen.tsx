import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  UserCheck,
  Send,
  Building,
  Briefcase
} from 'lucide-react';
import { repo } from '../../services/storage';
import { CandidateAccess } from '../../types';

export const CandidateReleaseScreen: React.FC = () => {
  const jobs = repo.getJobs();
  const students = repo.getStudents();
  const applications = repo.getApplications();
  const candidateAccess = repo.getCandidateAccessRecords();
  const companies = repo.getCompanies();

  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [scope, setScope] = useState<'FULL_VERIFIED_PROFILE' | 'MASKED_ANONYMIZED'>('FULL_VERIFIED_PROFILE');
  const [releaseSuccessMsg, setReleaseSuccessMsg] = useState<string | null>(null);

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];
  const targetCompany = companies.find(c => c.id === selectedJob?.companyId);
  const eligibleApps = applications.filter(a => a.jobId === selectedJobId && a.isEligible);

  // Toggle selection
  const handleToggleSelect = (studentId: string) => {
    setSelectedStudentIds(prev =>
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudentIds.length === eligibleApps.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(eligibleApps.map(a => a.studentId));
    }
  };

  const handleReleaseCandidates = () => {
    if (selectedStudentIds.length === 0) return;
    repo.releaseCandidatesToRecruiter(selectedJobId, selectedStudentIds, scope);
    setReleaseSuccessMsg(
      `Successfully released ${selectedStudentIds.length} candidate(s) to ${targetCompany?.name || 'Recruiter'}. CandidateAccess records activated.`
    );
    setSelectedStudentIds([]);
    setTimeout(() => setReleaseSuccessMsg(null), 4000);
  };

  const handleRevokeAccess = (accessId: string) => {
    repo.revokeCandidateAccess(accessId, 'TPO institutional administrative recall');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="blue-banner-card rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30 flex items-center gap-1">
                <Lock className="w-3 h-3 text-blue-300" />
                SECURITY GATEWAY
              </span>
              <span className="text-xs text-blue-200/80 font-mono">
                OBJECT-LEVEL ACCESS CONTROL (CANDIDATE_ACCESS)
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight text-white-force">
              Candidate Pool Release Authorization
            </h1>
            <p className="text-xs text-slate-200 mt-1 max-w-3xl">
              Recruiters are strictly blocked from browsing the student database. Candidates are invisible to external recruiters until the TPO explicitly grants an authorized <strong>CandidateAccess</strong> token.
            </p>
          </div>

          <div className="shrink-0 p-3.5 rounded-xl bg-slate-950/80 border border-blue-400/30 text-xs">
            <div className="text-[10px] uppercase font-bold text-slate-300">Security Invariant</div>
            <div className="font-extrabold text-amber-300 mt-0.5">Zero Recruiter Student Browsing</div>
            <div className="text-[10px] text-slate-300 mt-0.5">Strict Grant-on-Approval Pipeline</div>
          </div>
        </div>
      </div>

      {releaseSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{releaseSuccessMsg}</span>
        </div>
      )}

      {/* Target Drive & Batch Release Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Target Drive / Job Role:</div>
              <select
                value={selectedJobId}
                onChange={e => {
                  setSelectedJobId(e.target.value);
                  setSelectedStudentIds([]);
                }}
                className="mt-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
              >
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({companies.find(c => c.id === j.companyId)?.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Exposure Scope:</span>
              <select
                value={scope}
                onChange={e => setScope(e.target.value as any)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200"
              >
                <option value="FULL_VERIFIED_PROFILE">Full Verified Institutional Profile</option>
                <option value="MASKED_ANONYMIZED">Masked / Anonymized Screening Profile</option>
              </select>
            </div>

            <button
              onClick={handleReleaseCandidates}
              disabled={selectedStudentIds.length === 0}
              className={`mt-4 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition ${
                selectedStudentIds.length > 0
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Unlock className="w-4 h-4 text-emerald-300" />
              <span>Release Selected ({selectedStudentIds.length})</span>
            </button>
          </div>
        </div>

        {/* Verification Checklist */}
        <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800">
          <button
            onClick={handleSelectAll}
            className="text-xs text-indigo-400 hover:underline font-semibold"
          >
            {selectedStudentIds.length === eligibleApps.length ? 'Deselect All' : 'Select All Eligible'}
          </button>
          <span className="text-slate-400 font-mono">
            {eligibleApps.length} Verified Eligible Applicants Available for Release
          </span>
        </div>
      </div>

      {/* Eligible Candidates Table with Gate Toggles */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
            Candidate Gate for {selectedJob?.title}
          </h3>
          <span className="text-xs text-slate-500 font-mono">CandidateAccess Repository</span>
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
              <th className="py-3 px-4 w-10">Select</th>
              <th className="py-3 px-3">Student Name</th>
              <th className="py-3 px-3">Branch & CGPA</th>
              <th className="py-3 px-3">AI Match Score</th>
              <th className="py-3 px-3">Gate Access Record</th>
              <th className="py-3 px-4 text-right">Gate Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {eligibleApps.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                  No verified eligible applicants found for this position.
                </td>
              </tr>
            ) : (
              eligibleApps.map(app => {
                const stu = students.find(s => s.id === app.studentId);
                const activeAccess = candidateAccess.find(
                  ca => ca.jobId === app.jobId && ca.studentId === app.studentId && ca.accessStatus === 'ACTIVE'
                );

                if (!stu) return null;

                const isSelected = selectedStudentIds.includes(stu.id);

                return (
                  <tr
                    key={app.id}
                    onClick={() => handleToggleSelect(stu.id)}
                    className="hover:bg-slate-800/40 cursor-pointer transition"
                  >
                    <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(stu.id)}
                        className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{stu.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{stu.rollNumber}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-300">{stu.branch}</span>
                      <span className="text-slate-500 font-mono ml-2">CGPA {stu.cgpa.toFixed(2)}</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-purple-300">
                      {app.aiMatchScore}%
                    </td>
                    <td className="py-3 px-3">
                      {activeAccess ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            ACTIVE GRANT (#{activeAccess.id.slice(0, 8)})
                          </span>
                          <div className="text-[10px] text-slate-500 mt-0.5">{activeAccess.dataVisibilityScope}</div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                          <Lock className="w-3 h-3 text-amber-400" />
                          UNRELEASED (TPO GATE)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                      {activeAccess ? (
                        <button
                          onClick={() => handleRevokeAccess(activeAccess.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition"
                        >
                          Revoke Access
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            repo.releaseCandidatesToRecruiter(selectedJobId, [stu.id], scope);
                            setReleaseSuccessMsg(`Granted access for ${stu.fullName}`);
                            setTimeout(() => setReleaseSuccessMsg(null), 3000);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
                        >
                          Release Now
                        </button>
                      )}
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
