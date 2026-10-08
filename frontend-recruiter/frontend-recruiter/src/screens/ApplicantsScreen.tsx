import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Calendar,
  AlertTriangle,
  UserX,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useRecruiter } from '../context/RecruiterContext.tsx';
import { api } from '../services/api.ts';
import { RejectCandidateModal } from '../components/RejectCandidateModal.tsx';

export const ApplicantsScreen: React.FC = () => {
  const {
    applications,
    jobs,
    company,
    recruiter,
    viewCandidate,
    selectedJobId,
    setSelectedJobId,
    setActiveScreen,
    refreshData
  } = useRecruiter();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Rejection modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedAppForReject, setSelectedAppForReject] = useState<{
    id: string;
    studentName: string;
    jobTitle: string;
  } | null>(null);

  const [successToast, setSuccessToast] = useState<string | null>(null);

  const filteredApps = applications.filter((app) => {
    if (selectedJobId && selectedJobId !== 'ALL' && app.jobId !== selectedJobId) {
      return false;
    }
    if (statusFilter !== 'ALL' && app.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = app.student?.fullName?.toLowerCase() || '';
      const skills = app.student?.skills?.join(' ').toLowerCase() || '';
      const branch = app.student?.branch?.toLowerCase() || '';
      if (!name.includes(q) && !skills.includes(q) && !branch.includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleOpenReject = (app: any) => {
    setSelectedAppForReject({
      id: app.id,
      studentName: app.student?.fullName || 'Candidate',
      jobTitle: app.jobTitle || 'Job Requisition'
    });
    setRejectModalOpen(true);
  };

  const handleConfirmRejection = async (data: {
    applicationId: string;
    rejectionReason: string;
    rejectionComment: string;
  }) => {
    await api.rejectApplication(data.applicationId, {
      rejection_reason: data.rejectionReason,
      rejection_comment: data.rejectionComment,
      rejected_by: recruiter?.name || 'Authorized Recruiter'
    });

    await refreshData();
    setSuccessToast('Candidate rejected successfully.');
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification Banner */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer font-bold text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-600/30">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Authorized Campus Applicants
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> {applications.length} Authorized
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Displaying only students who applied to <strong className="text-slate-900 font-bold">{company?.name}</strong> or were released by College/TPO. Complete student database is restricted.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveScreen('candidate_matching')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>Run AI Match</span>
          </button>
        </div>
      </div>

      {/* Filters and Search Bar - Royal Blue + White + Transparency */}
      <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, skill, or branch..."
            className="w-full border border-blue-100 rounded-xl pl-10 pr-3.5 py-2 text-xs bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Job:</span>
            <select
              value={selectedJobId || 'ALL'}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-blue-100 bg-white text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
            >
              <option value="ALL">All Jobs ({jobs.length})</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-blue-100 bg-white text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPLIED">Applied</option>
              <option value="UNDER REVIEW">Under Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEW">Interview</option>
              <option value="SELECTED">Selected</option>
              <option value="OFFERED">Offered</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applicants Roster Table */}
      <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-blue-100 bg-blue-50/50 text-[11px] font-bold uppercase tracking-wider font-mono text-slate-600">
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4">Applied Job</th>
                <th className="py-3.5 px-4">Academics</th>
                <th className="py-3.5 px-4">Match Score</th>
                <th className="py-3.5 px-4">Status & Reason</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50 text-xs">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No authorized applicants found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={app.student?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                          alt={app.student?.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-blue-200 shrink-0 bg-white"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">
                              {app.student?.fullName || 'Candidate'}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {app.student?.rollNumber}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {app.student?.email}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {app.student?.skills?.slice(0, 3).map((s: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200/80"
                              >
                                {s}
                              </span>
                            ))}
                            {(app.student?.skills?.length || 0) > 3 && (
                              <span className="text-[10px] font-mono text-slate-400">
                                +{(app.student?.skills?.length || 0) - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold block truncate max-w-[200px] text-slate-900">
                        {app.jobTitle}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Applied: {new Date(app.appliedDate).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-slate-900">
                          {app.student?.cgpa?.toFixed(2)} CGPA
                        </span>
                        {app.student?.activeBacklogs > 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-50 text-rose-600 font-bold border border-rose-200">
                            {app.student?.activeBacklogs} Backlog
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-sans block truncate max-w-[150px] text-slate-500">
                        {app.student?.branch}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-blue-700 font-mono">
                            {app.aiMatchScore || 80}%
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              app.aiRecommendation === 'Strong Hire'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : app.aiRecommendation === 'Recommended'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : app.aiRecommendation === 'Consider'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {app.aiRecommendation || 'Recommended'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono ${
                          app.status === 'SHORTLISTED'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : app.status === 'INTERVIEW'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : app.status === 'SELECTED' || app.status === 'OFFERED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : app.status === 'REJECTED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {app.status}
                      </span>

                      {/* Display Rejection Reason if rejected */}
                      {app.status === 'REJECTED' && (app.rejection_reason || app.rejectionReason) && (
                        <div className="mt-1">
                          <span className="block text-[11px] font-semibold text-rose-600 truncate max-w-[170px]" title={app.rejection_reason || app.rejectionReason}>
                            Reason: {app.rejection_reason || app.rejectionReason}
                          </span>
                          {(app.rejection_comment || app.rejectionNotes) && (
                            <span className="block text-[10px] text-slate-500 truncate max-w-[170px]" title={app.rejection_comment || app.rejectionNotes}>
                              &quot;{app.rejection_comment || app.rejectionNotes}&quot;
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {app.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleOpenReject(app)}
                            className="px-2.5 py-1.5 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                            title="Reject Candidate (Mandatory reason)"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}

                        <button
                          onClick={() => viewCandidate(app.studentId)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs shadow-blue-600/20 cursor-pointer"
                        >
                          View Dossier
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mandatory Rejection Reason Confirmation Modal */}
      {selectedAppForReject && (
        <RejectCandidateModal
          isOpen={rejectModalOpen}
          onClose={() => {
            setRejectModalOpen(false);
            setSelectedAppForReject(null);
          }}
          candidateName={selectedAppForReject.studentName}
          applicationId={selectedAppForReject.id}
          jobTitle={selectedAppForReject.jobTitle}
          onConfirm={handleConfirmRejection}
        />
      )}
    </div>
  );
};
