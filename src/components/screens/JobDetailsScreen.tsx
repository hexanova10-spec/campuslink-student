import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { JobListing, Application } from '../../types/student';
import { JobDescriptionAnalysisModal } from '../job-analysis/JobDescriptionAnalysisModal';
import {
  Building,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Briefcase,
  ShieldCheck,
  Send,
  Sparkles,
  Check,
  X,
  XCircle,
  FileText
} from 'lucide-react';

export const JobDetailsScreen: React.FC = () => {
  const { selectedJobId, setCurrentScreen } = useAuth();
  const [job, setJob] = useState<(JobListing & { matchedSkills: string[]; missingSkills: string[]; application?: Application | null }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);

  const fetchJob = async () => {
    const targetId = selectedJobId || 'job-1';
    try {
      const res = await api.getJobDetails(targetId);
      setJob(res);
    } catch (err) {
      console.error('Failed to load drive details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [selectedJobId]);

  const handleApply = async () => {
    if (!job) return;
    setApplying(true);
    try {
      await api.applyToJob(job.id);
      setJob({ ...job, isApplied: true, applicationStatus: 'APPLIED' });
      setMessage('Application submitted successfully! Your dossier is forwarded to the recruiter desk.');
    } catch (err: any) {
      alert('Application failed: ' + err.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading || !job) {
    return <div className="text-xs text-slate-500 dark:text-slate-400 p-8 text-center">Loading drive dossier...</div>;
  }

  const isRejected = job.application?.status === 'REJECTED' || job.applicationStatus === 'REJECTED';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <button
        onClick={() => setCurrentScreen('recommended-jobs')}
        className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 transition-colors font-semibold cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Recommended Drives</span>
      </button>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Main Drive Header */}
      <div className="bg-white/80 dark:bg-[#070e22]/75 backdrop-blur-xl border border-blue-200/80 dark:border-blue-900/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-blue-100 dark:border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center text-lg shadow-xl shadow-blue-600/30 flex-shrink-0">
              {job.logo_symbol}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">{job.company_name}</h1>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                  Campus Drive 2026
                </span>
              </div>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-300 mt-1">{job.role_title}</p>
              <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 mt-2 flex-wrap font-medium">
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {job.ctc}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Deadline: {job.application_deadline}
                </span>
              </div>
            </div>
          </div>

          {/* Action Area: Application Status + Rejection Reason + Job Description Analysis */}
          <div className="flex-shrink-0 flex flex-col gap-2.5 w-full sm:w-auto">
            {isRejected ? (
              <div className="flex flex-col gap-2">
                <div className="px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>Application Status: Rejected</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRejectionModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>View Rejection Reason</span>
                </button>
              </div>
            ) : job.isApplied ? (
              <div className="px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Application Active ({job.applicationStatus || 'Applied'})</span>
              </div>
            ) : (
              <button
                onClick={handleApply}
                disabled={applying || !job.isEligible}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{applying ? 'Submitting...' : 'Submit Placement Application'}</span>
              </button>
            )}

            {/* Directly BELOW button: Secondary Action Job Description Analysis */}
            <button
              type="button"
              onClick={() => setIsAnalysisModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-50/90 hover:bg-blue-100/90 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-300/80 dark:border-blue-700/60 text-xs font-bold transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              <span>Job Description Analysis</span>
            </button>
          </div>
        </div>

        {/* Eligibility Verification Card */}
        <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-[#040814]/70 border border-blue-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Campus Placement Eligibility Audit</span>
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                job.isEligible ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
              }`}
            >
              {job.isEligible ? 'Eligible' : 'Not Eligible'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-200/60 dark:border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase">CGPA Cutoff</div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">Minimum {job.min_cgpa} CGPA</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Meets Cutoff</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-200/60 dark:border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase">Backlog Limit</div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">Max {job.max_backlogs} Active Backlog(s)</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>0 Active Backlogs</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-200/60 dark:border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase">Department Authorization</div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">CSE / IT / ECE</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Approved for Branch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Role Overview & Expectations</h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{job.description}</p>
        </div>

        {/* Selection Process Rounds */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Campus Selection Rounds</h2>
          <div className="space-y-2">
            {job.selection_rounds.map((rnd, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-blue-50/50 dark:bg-[#040814]/70 border border-blue-100 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-800 dark:text-slate-200"
              >
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 shadow-sm">
                  {idx + 1}
                </span>
                <span className="font-medium">{rnd}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Comparison */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Required Skills Audit</h2>
          <div className="flex flex-wrap gap-2">
            {job.required_skills.map((sk, idx) => {
              const hasSkill = job.matchedSkills?.includes(sk);
              return (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${
                    hasSkill
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {hasSkill ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-rose-500" />}
                  <span>{sk}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Job Description Analysis Modal */}
      <JobDescriptionAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        jobId={job.id}
        companyName={job.company_name}
        roleTitle={job.role_title}
        onNavigateToSkillGap={() => {
          setIsAnalysisModalOpen(false);
          setCurrentScreen('skill-gap');
        }}
      />

      {/* Rejection Reason Modal */}
      {isRejectionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white/95 dark:bg-[#0c142b]/95 border border-blue-200/90 dark:border-blue-900/60 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Rejection Reason</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{job.company_name} • {job.role_title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRejectionModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-[#040814]/70 border border-blue-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <p className="font-bold text-slate-900 dark:text-white mb-1.5">Official Student-Facing Remark:</p>
              <p className="font-medium text-slate-800 dark:text-slate-200 italic">
                "{job.application?.rejection_reason || 'Your application was not selected for this opportunity. No additional feedback was provided.'}"
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsRejectionModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-md shadow-blue-600/20 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

