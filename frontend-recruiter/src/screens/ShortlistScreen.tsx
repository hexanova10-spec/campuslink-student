import React, { useState } from 'react';
import {
  Filter,
  CheckSquare,
  Square,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Send,
  Calendar,
  Layers,
  Award,
  Search,
  MessageSquare,
  UserX
} from 'lucide-react';
import { useRecruiter } from '../context/RecruiterContext.tsx';
import { api } from '../services/api.ts';
import { RejectCandidateModal } from '../components/RejectCandidateModal.tsx';

export const ShortlistScreen: React.FC = () => {
  const {
    company,
    recruiter,
    jobs,
    applications,
    selectedJobId,
    setSelectedJobId,
    viewCandidate,
    refreshData,
    setActiveScreen
  } = useRecruiter();

  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [targetStatusFilter, setTargetStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Modal for Rejection Reason
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingCandidateInfo, setRejectingCandidateInfo] = useState<{
    id: string;
    name: string;
    jobTitle?: string;
  } | null>(null);

  const filteredApps = applications.filter((app) => {
    if (selectedJobId && app.jobId !== selectedJobId) return false;
    if (targetStatusFilter !== 'ALL' && app.status !== targetStatusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const name = app.student?.fullName?.toLowerCase() || '';
      const roll = app.student?.rollNumber?.toLowerCase() || '';
      if (!name.includes(q) && !roll.includes(q)) return false;
    }
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedAppIds.length === filteredApps.length) {
      setSelectedAppIds([]);
    } else {
      setSelectedAppIds(filteredApps.map((a) => a.id));
    }
  };

  const toggleSelectApp = (id: string) => {
    if (selectedAppIds.includes(id)) {
      setSelectedAppIds(selectedAppIds.filter((item) => item !== id));
    } else {
      setSelectedAppIds([...selectedAppIds, id]);
    }
  };

  const handleBulkStatusChange = async (targetStatus: string) => {
    if (selectedAppIds.length === 0) return;
    setIsProcessing(true);
    try {
      await api.bulkPipelineAction({
        applicationIds: selectedAppIds,
        targetStatus
      });
      setActionSuccessMsg(`Successfully updated ${selectedAppIds.length} candidate(s) to ${targetStatus}`);
      setSelectedAppIds([]);
      await refreshData();
      setTimeout(() => setActionSuccessMsg(null), 3500);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSingleStatusChange = async (appId: string, status: string) => {
    if (status === 'REJECTED') {
      const targetApp = applications.find((a) => a.id === appId);
      setRejectingCandidateInfo({
        id: appId,
        name: targetApp?.student?.fullName || 'Candidate',
        jobTitle: jobs.find((j) => j.id === targetApp?.jobId)?.title
      });
      setShowRejectModal(true);
      return;
    }

    setIsProcessing(true);
    try {
      await api.updateApplicationStatus(appId, { status });
      setActionSuccessMsg(`Candidate moved to ${status}`);
      await refreshData();
      setTimeout(() => setActionSuccessMsg(null), 3500);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmRejection = async (data: {
    applicationId: string;
    rejectionReason: string;
    rejectionComment: string;
  }) => {
    setIsProcessing(true);
    try {
      if (selectedAppIds.length > 0 && !rejectingCandidateInfo) {
        // Bulk rejection
        await api.bulkPipelineAction({
          applicationIds: selectedAppIds,
          targetStatus: 'REJECTED',
          rejection_reason: data.rejectionReason,
          rejection_comment: data.rejectionComment
        });
        setSelectedAppIds([]);
        setActionSuccessMsg(`Batch of ${selectedAppIds.length} candidate(s) rejected successfully.`);
      } else {
        // Single candidate rejection
        await api.rejectApplication(data.applicationId, {
          rejection_reason: data.rejectionReason,
          rejection_comment: data.rejectionComment,
          rejected_by: recruiter?.name || 'Authorized Recruiter'
        });
        setActionSuccessMsg('Candidate rejected successfully.');
      }
      setShowRejectModal(false);
      setRejectingCandidateInfo(null);
      await refreshData();
      setTimeout(() => setActionSuccessMsg(null), 3500);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shadow-blue-600/30">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Shortlist & Pipeline Command Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Bulk candidate progression, auditable rejection reasons, and interview pipeline staging.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Restricted to Authorized {company?.name} Applicants</span>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center justify-between font-bold animate-in fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActionSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer font-bold text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* Filter and Job Selection Bar - Royal Blue + White + Transparency */}
      <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Filter by Requisition
            </label>
            <select
              value={selectedJobId || ''}
              onChange={(e) => setSelectedJobId(e.target.value)}
              aria-label="Filter by Requisition"
              className="w-full rounded-xl p-2.5 text-xs font-bold border border-blue-100 bg-white text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="">All Requisitions ({jobs.length})</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Stage Filter
            </label>
            <select
              value={targetStatusFilter}
              onChange={(e) => setTargetStatusFilter(e.target.value)}
              aria-label="Stage Filter"
              className="w-full rounded-xl p-2.5 text-xs font-bold border border-blue-100 bg-white text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All Stages ({applications.length})</option>
              <option value="APPLIED">APPLIED</option>
              <option value="UNDER REVIEW">UNDER REVIEW</option>
              <option value="SHORTLISTED">SHORTLISTED</option>
              <option value="INTERVIEW">INTERVIEW</option>
              <option value="SELECTED">SELECTED</option>
              <option value="OFFERED">OFFERED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Search Candidate Name or Roll Number
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidates..."
                className="w-full rounded-xl pl-9 pr-3 py-2 text-xs font-medium border border-blue-100 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Bulk Action Controls */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSelectAll}
              className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border border-blue-100 bg-white hover:bg-blue-50 text-slate-700 transition-colors cursor-pointer shadow-2xs"
            >
              {selectedAppIds.length === filteredApps.length && filteredApps.length > 0 ? (
                <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
              ) : (
                <Square className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{selectedAppIds.length > 0 ? `${selectedAppIds.length} Selected` : 'Select All'}</span>
            </button>

            {selectedAppIds.length > 0 && (
              <span className="text-xs text-blue-700 font-bold">
                {selectedAppIds.length} candidates ready for bulk pipeline action
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={selectedAppIds.length === 0 || isProcessing}
              onClick={() => handleBulkStatusChange('SHORTLISTED')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-blue-600/20 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Bulk Shortlist
            </button>
            <button
              disabled={selectedAppIds.length === 0 || isProcessing}
              onClick={() => handleBulkStatusChange('INTERVIEW')}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              Move to Interview
            </button>
            <button
              disabled={selectedAppIds.length === 0 || isProcessing}
              onClick={() => {
                setRejectingCandidateInfo({
                  id: selectedAppIds[0],
                  name: `${selectedAppIds.length} Selected Candidates`,
                  jobTitle: 'Bulk Pipeline Batch'
                });
                setShowRejectModal(true);
              }}
              className="px-3.5 py-1.5 bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 hover:text-rose-700 disabled:opacity-40 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <UserX className="w-3.5 h-3.5 text-rose-600" />
              Bulk Reject
            </button>
          </div>
        </div>
      </div>

      {/* Candidates Pipeline Table */}
      <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-blue-100 bg-blue-50/50 uppercase text-[11px] tracking-wider font-mono text-slate-600">
                <th className="py-3 px-4 w-10 text-center">
                  <span className="sr-only">Select</span>
                </th>
                <th className="py-3 px-4 font-bold">Candidate</th>
                <th className="py-3 px-4 font-bold">Role</th>
                <th className="py-3 px-4 font-bold text-center">AI Match</th>
                <th className="py-3 px-4 font-bold">Academic</th>
                <th className="py-3 px-4 font-bold text-center">Current Status</th>
                <th className="py-3 px-4 font-bold text-right">Quick Transition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {filteredApps.map((app) => {
                const isSelected = selectedAppIds.includes(app.id);
                return (
                  <tr
                    key={app.id}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-blue-50/80'
                        : 'hover:bg-blue-50/30'
                    }`}
                  >
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleSelectApp(app.id)}
                        className="text-slate-400 hover:text-blue-600 cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => viewCandidate(app.studentId)}
                        className="font-bold hover:text-blue-600 transition-colors text-left cursor-pointer text-slate-900"
                      >
                        {app.student?.fullName || 'Candidate'}
                      </button>
                      <div className="text-[11px] text-slate-500">
                        {app.student?.collegeName}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {jobs.find((j) => j.id === app.jobId)?.title || 'Software Engineer'}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-bold">
                        {app.aiMatchScore || 85}%
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      CGPA {app.student?.cgpa} ({app.student?.activeBacklogs} backlogs)
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono ${
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
                      {app.status === 'REJECTED' && (app.rejection_reason || app.rejectionReason) && (
                        <span className="block text-[10px] text-rose-600 mt-0.5 truncate max-w-[130px] mx-auto font-medium" title={app.rejection_reason || app.rejectionReason}>
                          {app.rejection_reason || app.rejectionReason}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          disabled={isProcessing}
                          onClick={() => handleSingleStatusChange(app.id, 'SHORTLISTED')}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                          title="Shortlist"
                        >
                          Shortlist
                        </button>
                        <button
                          disabled={isProcessing}
                          onClick={() => handleSingleStatusChange(app.id, 'INTERVIEW')}
                          className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                          title="Interview"
                        >
                          Interview
                        </button>
                        {app.status !== 'REJECTED' && (
                          <button
                            disabled={isProcessing}
                            onClick={() => handleSingleStatusChange(app.id, 'REJECTED')}
                            className="px-2.5 py-1 bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                            title="Reject Candidate"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mandatory Rejection Reason Compliance Modal */}
      {showRejectModal && (
        <RejectCandidateModal
          isOpen={showRejectModal}
          onClose={() => {
            setShowRejectModal(false);
            setRejectingCandidateInfo(null);
          }}
          candidateName={rejectingCandidateInfo?.name || 'Selected Candidate(s)'}
          applicationId={rejectingCandidateInfo?.id || (selectedAppIds[0] || '')}
          jobTitle={rejectingCandidateInfo?.jobTitle}
          onConfirm={handleConfirmRejection}
        />
      )}
    </div>
  );
};
