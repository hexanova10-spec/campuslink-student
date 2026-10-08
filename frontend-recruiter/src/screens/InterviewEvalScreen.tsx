import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  Sparkles,
  Save,
  CheckCircle2,
  AlertTriangle,
  User,
  Star,
  Brain,
  ShieldCheck,
  ChevronRight,
  UserX
} from 'lucide-react';
import { useRecruiter } from '../context/RecruiterContext.tsx';
import { api } from '../services/api.ts';
import { InterviewDecision } from '../types/recruiter.ts';
import { RejectCandidateModal } from '../components/RejectCandidateModal.tsx';

export const InterviewEvalScreen: React.FC = () => {
  const {
    interviews,
    selectedInterviewId,
    setSelectedInterviewId,
    refreshData,
    setActiveScreen,
    recruiter
  } = useRecruiter();

  const currentInterview = interviews.find((i) => i.id === selectedInterviewId) || interviews[0];

  const [score, setScore] = useState(currentInterview?.score?.toString() || '88');
  const [decision, setDecision] = useState<InterviewDecision>(currentInterview?.decision || 'Pass to Next Round');
  const [notes, setNotes] = useState(currentInterview?.notes || 'Candidate showed strong intuition on asynchronous queues and thread safety. Solved the dynamic programming algorithm in optimal O(N) space.');
  const [aiAnalysis, setAiAnalysis] = useState<any>(currentInterview?.aiAnalysis || null);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Rejection modal state if Reject decision is chosen
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  useEffect(() => {
    if (currentInterview) {
      setScore(currentInterview.score?.toString() || '88');
      setDecision(currentInterview.decision || 'Pass to Next Round');
      setNotes(currentInterview.notes || '');
      setAiAnalysis(currentInterview.aiAnalysis || null);
    }
  }, [currentInterview]);

  const handleRunAIAnalysis = async () => {
    if (!notes || notes.trim().length < 10) return;
    try {
      setIsAnalyzingAI(true);
      const res = await api.evaluateInterviewAI({
        interviewId: currentInterview.id,
        notes,
        candidateName: currentInterview.studentName,
        role: currentInterview.jobTitle
      });
      if (res.success && res.analysis) {
        setAiAnalysis(res.analysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  const handleDecisionChange = (newDecision: InterviewDecision) => {
    setDecision(newDecision);
    if (newDecision === 'Reject') {
      setRejectModalOpen(true);
    }
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

    await api.submitInterviewEvaluation(currentInterview.id, {
      score: parseInt(score, 10),
      notes: notes + (data.rejectionComment ? ` [Rejection reason: ${data.rejectionReason} - ${data.rejectionComment}]` : ` [Rejection reason: ${data.rejectionReason}]`),
      decision: 'Reject',
      aiAnalysis
    });

    await refreshData();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleSaveEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (decision === 'Reject') {
      setRejectModalOpen(true);
      return;
    }

    try {
      setIsSaving(true);
      await api.submitInterviewEvaluation(currentInterview.id, {
        score: parseInt(score, 10),
        notes,
        decision,
        aiAnalysis
      });
      await refreshData();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shadow-blue-600/30">
              <ClipboardCheck className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Interview Scorecard &amp; Synthesis
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Round {currentInterview?.roundNumber}: {currentInterview?.roundName}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Record interview scorecard notes. Human decision authority is mandatory for all hiring outcomes.
          </p>
        </div>

        <select
          value={currentInterview?.id || ''}
          onChange={(e) => setSelectedInterviewId(e.target.value)}
          className="bg-white text-slate-900 text-xs py-2 px-3.5 rounded-xl border border-blue-100 focus:outline-none focus:border-blue-500 cursor-pointer font-medium shadow-2xs"
        >
          {interviews.map((intv) => (
            <option key={intv.id} value={intv.id}>
              {intv.studentName} — {intv.roundName} (Round {intv.roundNumber})
            </option>
          ))}
        </select>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Interview evaluation and candidate scorecard saved successfully!</span>
        </div>
      )}

      {/* Candidate Session Header - Royal Blue + White + Transparency */}
      <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Evaluation Session
          </span>
          <h3 className="text-lg font-bold text-slate-900">
            {currentInterview?.studentName}
          </h3>
          <p className="text-xs text-slate-500">
            {currentInterview?.jobTitle} • Interviewer: <span className="text-blue-700 font-semibold">{currentInterview?.interviewerName}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 text-center min-w-[100px]">
            <span className="text-[10px] text-slate-500 block uppercase font-sans font-semibold">Mode</span>
            <span className="text-xs font-bold text-slate-900">{currentInterview?.mode}</span>
          </div>
          <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 text-center min-w-[100px]">
            <span className="text-[10px] text-slate-500 block uppercase font-sans font-semibold">Scheduled</span>
            <span className="text-xs font-bold text-slate-900">
              {new Date(currentInterview?.scheduledTime || '').toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveEvaluation} className="space-y-6">
        {/* Recruiter Evaluation Form */}
        <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
            Panel Evaluation &amp; Technical Score
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Candidate Score (0 - 100) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                required
                className="w-full bg-white border border-blue-100 rounded-xl px-3.5 py-2.5 text-sm font-bold font-mono text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Human Hiring Decision *
              </label>
              <select
                value={decision}
                onChange={(e) => handleDecisionChange(e.target.value as InterviewDecision)}
                className="w-full bg-white border border-blue-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer font-semibold"
              >
                <option value="Pass to Next Round">Pass to Next Round</option>
                <option value="Selected">Selected (Final Selection)</option>
                <option value="On Hold">On Hold (Pending Other Candidates)</option>
                <option value="Reject">Reject (Opens Mandatory Reason Dialog)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Panel Interview Notes &amp; Technical Feedback *
                </label>
                <button
                  type="button"
                  onClick={handleRunAIAnalysis}
                  disabled={isAnalyzingAI}
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-blue-600" />
                  <span>{isAnalyzingAI ? 'Synthesizing...' : 'Generate AI Synthesis'}</span>
                </button>
              </div>

              <textarea
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter live interview observations, code quality comments, communication assessment..."
                required
                className="w-full bg-white border border-blue-100 rounded-2xl p-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-none leading-relaxed font-mono"
              />
            </div>
          </div>
        </div>

        {/* AI Interview Analysis Summary */}
        {aiAnalysis && (
          <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Interview Competency Synthesis
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                AI Advisory Aid
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-1.5">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider font-mono block">
                  Identified Strengths
                </span>
                <ul className="space-y-1 text-slate-700">
                  {aiAnalysis.strengths?.map((str: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-1.5">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider font-mono block">
                  Growth Areas / Probing Notes
                </span>
                <ul className="space-y-1 text-slate-700">
                  {aiAnalysis.weaknesses?.map((w: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase font-mono block">
                  Technical Fit Evaluation
                </span>
                <p className="text-slate-800">{aiAnalysis.technicalFit}</p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase font-mono block">
                  Communication &amp; Demeanor
                </span>
                <p className="text-slate-800">{aiAnalysis.communication}</p>
              </div>
            </div>

            {/* Mandatory Human Decision Disclaimer */}
            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 text-[11px] text-slate-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
              <div>
                <strong className="text-slate-900">Human-in-the-Loop Governance:</strong> {aiAnalysis.disclaimer || 'AI recommendations do not make autonomous hiring decisions. The human recruiter and interviewing panel retain sole authority.'}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Scorecard...' : 'Save Evaluation Scorecard'}</span>
          </button>
        </div>
      </form>

      {/* Rejection Modal */}
      {currentInterview && (
        <RejectCandidateModal
          isOpen={rejectModalOpen}
          onClose={() => {
            setRejectModalOpen(false);
            if (decision === 'Reject') setDecision('On Hold');
          }}
          candidateName={currentInterview.studentName}
          applicationId={currentInterview.applicationId}
          jobTitle={currentInterview.jobTitle}
          onConfirm={handleConfirmRejection}
        />
      )}
    </div>
  );
};
