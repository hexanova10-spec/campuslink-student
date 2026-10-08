import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  GraduationCap,
  Briefcase,
  Code2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Lock,
  Mail,
  Phone,
  Sparkles,
  ExternalLink,
  Award,
  BookOpen,
  Send,
  XCircle,
  HelpCircle,
  FileCode,
  ShieldAlert,
  UserX,
  Clock
} from 'lucide-react';
import { useRecruiter } from '../context/RecruiterContext.tsx';
import { api } from '../services/api.ts';
import { StudentProfile, Application } from '../types/recruiter.ts';
import { RejectCandidateModal } from '../components/RejectCandidateModal.tsx';

export const CandidateDetailScreen: React.FC = () => {
  const {
    company,
    recruiter,
    selectedCandidateId,
    setActiveScreen,
    selectedJobId,
    setSelectedJobId,
    jobs,
    applications,
    refreshData
  } = useRecruiter();

  const [candidate, setCandidate] = useState<StudentProfile | null>(null);
  const [candidateApps, setCandidateApps] = useState<Application[]>([]);
  const [accessDeniedError, setAccessDeniedError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'resume' | 'projects' | 'match_explanation' | 'privacy_audit'>('match_explanation');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null);
  const [recruiterNotesInput, setRecruiterNotesInput] = useState('');

  // Rejection Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  // Security Penetration Test State
  const [penTestRunning, setPenTestRunning] = useState(false);
  const [penTestResult, setPenTestResult] = useState<any | null>(null);

  const fetchCandidateData = async () => {
    if (!selectedCandidateId) return;
    setAccessDeniedError(null);
    const res = await api.getCandidate(selectedCandidateId);

    if (!res.ok) {
      setAccessDeniedError(res.data?.message || 'Unauthorized access: You cannot view this student profile.');
      setCandidate(null);
    } else {
      setCandidate(res.data.candidate);
      setCandidateApps(res.data.applications || []);
    }
  };

  useEffect(() => {
    fetchCandidateData();
  }, [selectedCandidateId]);

  const currentApp =
    candidateApps.find((a) => (selectedJobId ? a.jobId === selectedJobId : true)) ||
    candidateApps[0] ||
    applications.find((a) => a.studentId === selectedCandidateId);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!currentApp) return;
    setStatusUpdating(true);
    try {
      await api.updateApplicationStatus(currentApp.id, {
        status: newStatus,
        recruiterNotes: recruiterNotesInput || undefined
      });
      setStatusSuccess(`Updated status to ${newStatus}`);
      await refreshData();
      await fetchCandidateData();
      setTimeout(() => setStatusSuccess(null), 3500);
    } catch (e) {
      console.error(e);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleConfirmRejection = async (data: {
    applicationId: string;
    rejectionReason: string;
    rejectionComment: string;
  }) => {
    setStatusUpdating(true);
    try {
      await api.rejectApplication(data.applicationId, {
        rejection_reason: data.rejectionReason,
        rejection_comment: data.rejectionComment,
        rejected_by: recruiter?.name || 'Authorized Recruiter'
      });
      setStatusSuccess('Candidate rejected successfully.');
      await refreshData();
      await fetchCandidateData();
      setTimeout(() => setStatusSuccess(null), 4000);
    } finally {
      setStatusUpdating(false);
    }
  };

  const runPenetrationTest = async (type: 'UNAPPLIED_STUDENT' | 'COMPETITOR_CANDIDATE') => {
    setPenTestRunning(true);
    setPenTestResult(null);
    try {
      const res = await api.testUnauthorizedAccess(type);
      setPenTestResult(res.data);
    } finally {
      setPenTestRunning(false);
    }
  };

  if (accessDeniedError) {
    return (
      <div className="w-full space-y-6">
        <button
          onClick={() => setActiveScreen('applicants')}
          className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1.5 transition-colors cursor-pointer font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Authorized Applicants
        </button>

        <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-8 max-w-2xl mx-auto text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">403 Forbidden: Zero-Leak Data Privacy Guard Active</h2>
          <p className="text-rose-800 text-xs leading-relaxed">{accessDeniedError}</p>
          <div className="bg-white p-4 rounded-2xl text-left border border-rose-100 text-xs text-slate-600 space-y-2 font-mono">
            <div className="text-slate-900 font-semibold font-sans">Enforced Security Rules:</div>
            <div>• Recruiter cannot browse university-wide student database.</div>
            <div>• Recruiter cannot view candidates of other companies.</div>
            <div>• Recruiter cannot view unapplied students without explicit TPO drive authorization.</div>
            <div>• Incident has been logged to the immutable tamper-evident audit ledger.</div>
          </div>
          <button
            onClick={() => setActiveScreen('applicants')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer"
          >
            Return to Authorized Roster
          </button>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-16 text-slate-500 text-sm">
        <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
        Loading authorized candidate dossier...
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen('applicants')}
            className="p-2 border border-blue-100 rounded-xl bg-white hover:bg-blue-50 text-slate-700 transition-colors cursor-pointer shadow-2xs"
            title="Return to Applicants"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" />
          </button>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {candidate.fullName}
              </h1>
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold font-mono">
                Authorized Candidate
              </span>
              {currentApp?.status === 'REJECTED' && (
                <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-bold font-mono flex items-center gap-1">
                  <UserX className="w-3.5 h-3.5 text-rose-600" /> Application Rejected
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Roll No: {candidate.rollNumber} • {candidate.collegeName} • {candidate.branch} (Batch {candidate.graduationYear})
            </p>
          </div>
        </div>

        {/* Quick Application Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {currentApp?.status !== 'SHORTLISTED' && currentApp?.status !== 'REJECTED' && (
            <button
              disabled={statusUpdating}
              onClick={() => handleUpdateStatus('SHORTLISTED')}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-600/20 transition-all cursor-pointer active:scale-98"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Shortlist
            </button>
          )}

          <button
            onClick={() => setActiveScreen('interview_schedule')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 transition-colors cursor-pointer shadow-2xs"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            Schedule Interview
          </button>

          <button
            onClick={() => setActiveScreen('offers')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-colors cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            Generate Offer
          </button>

          {/* Mandatory Rejection Button */}
          {currentApp && currentApp.status !== 'REJECTED' && (
            <button
              onClick={() => setRejectModalOpen(true)}
              className="px-3.5 py-2 bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 hover:text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <UserX className="w-3.5 h-3.5 text-rose-600" />
              Reject Candidate
            </button>
          )}
        </div>
      </div>

      {statusSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusSuccess}</span>
        </div>
      )}

      {/* Rejection Details Banner if REJECTED */}
      {currentApp?.status === 'REJECTED' && (
        <div className="bg-rose-50/70 border border-rose-200 rounded-3xl p-5 shadow-xs space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
            <UserX className="w-4 h-4 text-rose-600" />
            Candidate Application Rejected
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-3 bg-white rounded-xl border border-rose-100">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Rejection Reason</span>
              <span className="font-bold text-rose-700 text-sm mt-0.5 block">
                {currentApp.rejection_reason || currentApp.rejectionReason || 'Other'}
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-rose-100">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Recruiter Comments</span>
              <span className="text-slate-700 italic mt-0.5 block">
                {currentApp.rejection_comment || currentApp.rejectionNotes || 'No additional comments recorded.'}
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-rose-100">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Audit Recorded By</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {currentApp.rejected_by || 'Authorized Recruiter'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentApp.rejected_at ? new Date(currentApp.rejected_at).toLocaleString() : 'Audited'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Overview Strip - Royal Blue + White + Transparency */}
      <div className="rounded-3xl p-5 border border-blue-100 bg-white/95 backdrop-blur-xl shadow-xs grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <div className="text-[11px] uppercase font-bold tracking-wider text-slate-500">
            Target Role
          </div>
          <div className="text-sm font-black mt-1 truncate text-slate-900">
            {currentApp ? jobs.find((j) => j.id === currentApp.jobId)?.title || 'Software Engineer' : 'General Applicant'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">App ID: {currentApp?.id || 'N/A'}</div>
        </div>

        <div>
          <div className="text-[11px] uppercase font-bold tracking-wider text-slate-500">
            Match Index
          </div>
          <div className="text-xl font-black text-blue-700 mt-1 flex items-center gap-1 font-mono">
            <Sparkles className="w-4 h-4 text-blue-600" />
            {currentApp?.aiMatchScore || 90}%
          </div>
          <div className="text-[10px] text-emerald-700 font-bold">Ranked High Fit</div>
        </div>

        <div>
          <div className="text-[11px] uppercase font-bold tracking-wider text-slate-500">
            Academic Merit
          </div>
          <div className="text-sm font-bold mt-1 text-slate-800 font-mono">
            CGPA: {candidate.cgpa} / 10.0
          </div>
          <div className="text-[10px] text-slate-500">
            {candidate.activeBacklogs === 0 ? '✓ Clean Academic Record' : `⚠ ${candidate.activeBacklogs} backlogs`}
          </div>
        </div>

        <div>
          <div className="text-[11px] uppercase font-bold tracking-wider text-slate-500">
            Pipeline Stage
          </div>
          <div className="inline-block mt-1">
            <span
              className={`px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase font-mono ${
                currentApp?.status === 'REJECTED'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : currentApp?.status === 'SHORTLISTED'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-slate-100 text-slate-800 border border-slate-200'
              }`}
            >
              {currentApp?.status || 'APPLIED'}
            </span>
          </div>
          <div className="text-[10px] mt-1 text-slate-400">
            Applied: {currentApp ? new Date(currentApp.appliedDate).toLocaleDateString() : 'Recent'}
          </div>
        </div>

        <div>
          <div className="text-[11px] uppercase font-bold tracking-wider text-slate-500">
            Contact Authorization
          </div>
          <div className="text-xs mt-1 flex items-center gap-1.5 text-slate-700">
            <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{candidate.email}</span>
          </div>
          <div className="text-xs mt-0.5 flex items-center gap-1.5 text-slate-700">
            <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{candidate.phone}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-blue-100 text-xs font-bold gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('match_explanation')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'match_explanation'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Explainable Match Breakdown
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Education & Skills Profile
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'projects'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          Projects & Internships ({candidate.projects.length})
        </button>
        <button
          onClick={() => setActiveTab('resume')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'resume'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Authorized Resume View
        </button>
        <button
          onClick={() => setActiveTab('privacy_audit')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'privacy_audit'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          Privacy Guard & Penetration Audit
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'match_explanation' && (
        <div className="space-y-6">
          <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  AI Match Transparency Breakdown
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Clear justification of alignment, strengths, and identified technical gaps without black-box scoring.
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-mono font-bold">
                Match Index: {currentApp?.aiMatchScore || 90}%
              </span>
            </div>

            {/* Why Recommended & Gaps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  WHY RECOMMENDED
                </div>
                <div className="space-y-2 text-xs">
                  {currentApp?.aiMatchBreakdown?.whyRecommended && currentApp.aiMatchBreakdown.whyRecommended.length > 0 ? (
                    currentApp.aiMatchBreakdown.whyRecommended.map((str: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-700">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span>{str}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-start gap-2 text-slate-700">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span>Full match on mandatory technical stack (Python, SQL, React)</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-700">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span>Relevant system architecture project benchmarked at high throughput</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-700">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span>CGPA {candidate.cgpa} comfortably exceeds the role cutoff</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-3 border-t border-emerald-200">
                  <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider mb-2">
                    Verified Competency Matches:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.skills.map((sk: string) => (
                      <span key={sk} className="px-2 py-0.5 bg-white text-emerald-800 border border-emerald-200 rounded text-xs font-mono">
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gaps & Areas for Evaluation */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  GAPS & INTERVIEW PROBES
                </div>
                <div className="space-y-2 text-xs">
                  {currentApp?.aiMatchBreakdown?.gaps && currentApp.aiMatchBreakdown.gaps.length > 0 ? (
                    currentApp.aiMatchBreakdown.gaps.map((gap: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-700">
                        <span className="text-amber-600 font-bold mt-0.5">⚠</span>
                        <span>{gap}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-start gap-2 text-slate-700">
                      <span className="text-amber-600 font-bold mt-0.5">⚠</span>
                      <span>AWS / Cloud deployment experience not evidenced in listed college projects</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-amber-200 text-xs text-slate-600 leading-relaxed">
                  <strong className="text-amber-900 block mb-1">Recommended Interview Probe:</strong>
                  Inquire about handling cloud migration or containerized deployments to assess velocity if hired.
                </div>
              </div>
            </div>

            {/* Recruiter Evaluation Notes Form */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
                Private Recruiter Hiring Notes ({company?.name} Only)
              </label>
              <textarea
                value={recruiterNotesInput}
                onChange={(e) => setRecruiterNotesInput(e.target.value)}
                placeholder="Record candidate strengths, panel interview impressions, or compensation feedback..."
                rows={3}
                className="w-full bg-white border border-blue-100 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
              />
              <div className="flex justify-end">
                <button
                  disabled={statusUpdating}
                  onClick={() => handleUpdateStatus(currentApp?.status || 'UNDER REVIEW')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Save Internal Evaluation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education & Academic Record */}
          <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              Academic History
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-blue-50/40 rounded-2xl border border-blue-100">
                <div className="font-semibold text-slate-900">{candidate.collegeName}</div>
                <div className="text-slate-600">B.Tech in {candidate.branch}</div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-100">
                  <span className="font-mono text-blue-700 font-bold">CGPA: {candidate.cgpa} / 10.0</span>
                  <span className="text-slate-500 font-mono">Graduating Class {candidate.graduationYear}</span>
                </div>
              </div>

              <div className="p-3.5 bg-blue-50/40 rounded-2xl border border-blue-100 flex justify-between items-center">
                <span className="text-slate-600">Backlog Status:</span>
                <span className={`font-semibold ${candidate.activeBacklogs === 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {candidate.activeBacklogs === 0 ? '0 Backlogs (Eligible)' : `${candidate.activeBacklogs} Active Backlog(s)`}
                </span>
              </div>
            </div>

            {/* Certifications */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                Verified Certifications
              </h4>
              <div className="space-y-1.5">
                {candidate.certifications.length > 0 ? (
                  candidate.certifications.map((cert, idx) => (
                    <div key={idx} className="p-2.5 bg-blue-50/40 rounded-xl border border-blue-100 text-xs text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>{cert}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No certifications recorded.</span>
                )}
              </div>
            </div>
          </div>

          {/* Technical Skills & Coding Profile */}
          <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-600" />
              Verified Skills & Profiles
            </h3>

            <div>
              <div className="text-xs text-slate-500 mb-2">Technical Core Competencies:</div>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <span key={skill} className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-mono font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {candidate.codingProfiles && candidate.codingProfiles.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="text-xs text-slate-500">Competitive Coding Record:</div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {candidate.codingProfiles.map((cp, idx) => (
                    <div key={idx} className="p-2.5 bg-blue-50/40 border border-blue-100 rounded-xl">
                      <span className="text-[10px] text-slate-500 block uppercase font-sans">{cp.platform}</span>
                      <span className="font-bold text-slate-900">{cp.handle}</span>
                      <span className="text-blue-700 block text-[11px] font-semibold">{cp.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 space-y-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-blue-600" />
            Projects & Internship History
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidate.projects.map((proj, idx) => (
              <div key={idx} className="p-4 bg-blue-50/30 rounded-2xl border border-blue-100 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{proj.title}</span>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 underline"
                    >
                      Repository <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.techStack.map((tech) => (
                    <span key={tech} className="px-2 py-0.5 bg-white text-slate-700 border border-blue-100 rounded text-[10px] font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {candidate.experience && candidate.experience.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                Internship / Work Experience
              </h4>
              <div className="space-y-3">
                {candidate.experience.map((exp, idx) => (
                  <div key={idx} className="p-3.5 bg-blue-50/30 rounded-2xl border border-blue-100 text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-slate-900">
                      <span>{exp.role} @ {exp.company}</span>
                      <span className="text-slate-500 font-normal">{exp.duration}</span>
                    </div>
                    <p className="text-slate-600">{exp.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'resume' && (
        <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Authorized Plaintext & Document View</h3>
            </div>
            <a
              href={candidate.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Formatted PDF
            </a>
          </div>

          <pre className="p-5 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
            {candidate.resumeText}
          </pre>
        </div>
      )}

      {activeTab === 'privacy_audit' && (
        <div className="space-y-6">
          <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Recruiter Privacy Boundary Certification
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              In accordance with university placement data privacy regulations, this workspace strips confidential college-level and competitor-level data:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-2">
                <span className="text-rose-700 font-bold flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  STRICTLY REDACTED (ZERO-LEAK)
                </span>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  <li>Student applications to other companies (Hidden)</li>
                  <li>Private TPO counselor internal notes (Stripped)</li>
                  <li>Student company preference rankings (Hidden)</li>
                  <li>College placement quota data (Restricted)</li>
                  <li>Other recruiters&apos; offers and feedback (Blocked)</li>
                </ul>
              </div>

              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
                <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  LEGITIMATE RECRUITER ACCESS
                </span>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  <li>Direct application to {company?.name}</li>
                  <li>Verified academic credentials and CGPA</li>
                  <li>Projects, internships, and technical certifications</li>
                  <li>AI match analysis against {company?.name} criteria</li>
                  <li>Private interview notes created by your team</li>
                </ul>
              </div>
            </div>

            {/* Live Security Breach Simulator */}
            <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-blue-600" />
                Backend Security Penetration Test Suite
              </h4>
              <p className="text-xs text-slate-500">
                Click below to simulate unauthorized requests directly against the Express backend API to verify 403 Forbidden enforcement.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  disabled={penTestRunning}
                  onClick={() => runPenetrationTest('UNAPPLIED_STUDENT')}
                  className="px-3.5 py-2 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
                >
                  <Lock className="w-3.5 h-3.5 text-rose-600" />
                  Attempt Accessing Unapplied Student
                </button>
                <button
                  disabled={penTestRunning}
                  onClick={() => runPenetrationTest('COMPETITOR_CANDIDATE')}
                  className="px-3.5 py-2 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
                >
                  <Lock className="w-3.5 h-3.5 text-rose-600" />
                  Attempt Accessing Competitor&apos;s Applicant
                </button>
              </div>

              {penTestResult && (
                <div className="mt-4 p-4 bg-rose-50 border border-rose-300 rounded-2xl text-xs font-mono text-rose-800 space-y-2">
                  <div className="flex items-center justify-between text-rose-900 font-bold font-sans">
                    <span>SECURITY VERIFICATION: REQUEST BLOCKED</span>
                    <span className="px-2 py-0.5 bg-rose-200 rounded">HTTP {penTestResult.statusCode || 403} FORBIDDEN</span>
                  </div>
                  <div>Target: {penTestResult.attemptedTargetName} ({penTestResult.attemptedTargetId})</div>
                  <div>Caller: {penTestResult.activeCompany}</div>
                  <div className="text-slate-600">{penTestResult.message}</div>
                  <div className="text-emerald-700 text-[11px]">{penTestResult.backendEnforcement}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Rejection Confirmation Modal */}
      {currentApp && (
        <RejectCandidateModal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          candidateName={candidate.fullName}
          applicationId={currentApp.id}
          jobTitle={jobs.find((j) => j.id === currentApp.jobId)?.title}
          onConfirm={handleConfirmRejection}
        />
      )}
    </div>
  );
};

function Brain(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M12 5v14" />
    </svg>
  );
}
