import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Clock, Building, DollarSign, MapPin, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { repo } from '../../services/storage';
import { Job, JobStatus } from '../../types';

export const JobApprovalScreen: React.FC = () => {
  const jobs = repo.getJobs();
  const companies = repo.getCompanies();

  const [activeTab, setActiveTab] = useState<'PENDING' | 'ALL'>('PENDING');
  const [modalJob, setModalJob] = useState<Job | null>(null);
  const [modalAction, setModalAction] = useState<JobStatus | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const pendingJobs = jobs.filter(j => j.status === 'PENDING_TPO_REVIEW');
  const displayJobs = activeTab === 'PENDING' ? pendingJobs : jobs;

  const handleOpenActionModal = (job: Job, action: JobStatus) => {
    setModalJob(job);
    setModalAction(action);
    setReviewNotes(
      action === 'APPROVED'
        ? 'Eligibility criteria and compensation package verified against institutional placement guidelines.'
        : action === 'CHANGES_REQUESTED'
        ? 'Please revise minimum CGPA threshold to 7.0 and include ECE department students.'
        : 'Role does not meet minimum CTC policy for campus placement.'
    );
  };

  const handleConfirmAction = () => {
    if (modalJob && modalAction) {
      repo.updateJobStatus(modalJob.id, modalAction, reviewNotes);
      setModalJob(null);
      setModalAction(null);
      setReviewNotes('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
              Job Review & Institutional Approval Queue
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {pendingJobs.length} Pending Review
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Validate recruiter job postings, eligibility parameters, and compensation compliance before releasing to students.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'PENDING' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending Review ({pendingJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Postings ({jobs.length})
          </button>
        </div>
      </div>

      {/* Jobs Review Cards */}
      <div className="space-y-4">
        {displayJobs.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs">
            No job postings currently pending review.
          </div>
        ) : (
          displayJobs.map(job => {
            const comp = companies.find(c => c.id === job.companyId);
            const isPending = job.status === 'PENDING_TPO_REVIEW';

            return (
              <div
                key={job.id}
                className={`bg-slate-900 border rounded-2xl p-5 shadow-lg space-y-4 transition ${
                  isPending ? 'border-amber-500/40 ring-1 ring-amber-500/20' : 'border-slate-800'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wide">
                        {comp?.name || 'Recruiter'}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                        {comp?.industry}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-white mt-0.5">{job.title}</h3>
                    <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {job.location}
                      </span>
                      <span>• Type: <strong className="text-white">{job.roleType}</strong></span>
                      <span>• Openings: <strong className="text-white">{job.openings}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      job.status === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : job.status === 'PENDING_TPO_REVIEW'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                        : job.status === 'CHANGES_REQUESTED'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    }`}>
                      {job.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Job Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Fixed CTC</div>
                    <div className="font-extrabold text-emerald-400 text-base mt-0.5">₹{job.ctcLPA} LPA</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Monthly Stipend</div>
                    <div className="font-extrabold text-white text-base mt-0.5 font-mono">
                      {job.stipendPerMonth ? `₹${job.stipendPerMonth.toLocaleString()}` : 'N/A'}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Min CGPA Cutoff</div>
                    <div className="font-extrabold text-indigo-300 text-base mt-0.5 font-mono">
                      {job.eligibilityCriteria.minCgpa.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Max Backlogs Allowed</div>
                    <div className="font-extrabold text-white text-base mt-0.5 font-mono">
                      {job.eligibilityCriteria.maxBacklogs}
                    </div>
                  </div>
                </div>

                {/* Eligibility Criteria Breakdown */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Allowed Engineering Branches:</span>
                    <span className="font-bold text-slate-200">
                      {job.eligibilityCriteria.eligibleBranches.join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Graduation Batch:</span>
                    <span className="font-bold text-slate-200">
                      {job.eligibilityCriteria.allowedGraduationYears.join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mandatory Skills Required:</span>
                    <span className="font-bold text-purple-300">
                      {job.eligibilityCriteria.requiredSkills.join(', ') || 'General Engineering'}
                    </span>
                  </div>
                  {job.reviewNotes && (
                    <div className="pt-2 border-t border-slate-800 text-slate-300">
                      <strong className="text-indigo-400">TPO Review Notes:</strong> {job.reviewNotes}
                    </div>
                  )}
                </div>

                {/* Actions Bar */}
                <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleOpenActionModal(job, 'CHANGES_REQUESTED')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-xs font-semibold transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                    <span>Request Changes</span>
                  </button>

                  <button
                    onClick={() => handleOpenActionModal(job, 'REJECTED')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition"
                  >
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Reject Posting</span>
                  </button>

                  <button
                    onClick={() => handleOpenActionModal(job, 'APPROVED')}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Job</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Review Modal */}
      {modalJob && modalAction && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
              <span>Confirm {modalAction.replace(/_/g, ' ')}: {modalJob.title}</span>
            </h3>

            <p className="text-xs text-slate-400">
              Enter official review feedback. This statement is recorded in the institutional audit log and transmitted to the recruiter.
            </p>

            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">
                Official Review Notes:
              </label>
              <textarea
                rows={4}
                value={reviewNotes}
                onChange={e => setReviewNotes(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => {
                  setModalJob(null);
                  setModalAction(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30"
              >
                Submit Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
