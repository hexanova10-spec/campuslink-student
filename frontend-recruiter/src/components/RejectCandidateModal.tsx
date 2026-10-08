import React, { useState, useEffect } from 'react';
import { AlertCircle, X, ShieldAlert, CheckCircle2, UserX } from 'lucide-react';

export const REJECTION_REASONS = [
  'Does not meet eligibility criteria',
  'Skills mismatch',
  'Insufficient experience',
  'Academic criteria not met',
  'Interview performance',
  'Assessment performance',
  'Position filled',
  'Other'
] as const;

interface RejectCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  applicationId: string;
  jobTitle?: string;
  onConfirm: (data: {
    applicationId: string;
    rejectionReason: string;
    rejectionComment: string;
  }) => Promise<void>;
}

export const RejectCandidateModal: React.FC<RejectCandidateModalProps> = ({
  isOpen,
  onClose,
  candidateName,
  applicationId,
  jobTitle,
  onConfirm
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [comments, setComments] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Reset form when modal opens or candidate changes
  useEffect(() => {
    if (isOpen) {
      setSelectedReason('');
      setComments('');
      setErrorMsg(null);
      setIsSubmitting(false);
    }
  }, [isOpen, applicationId]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason.trim()) {
      setErrorMsg('Please select a rejection reason before confirming.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      await onConfirm({
        applicationId,
        rejectionReason: selectedReason,
        rejectionComment: comments.trim()
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to reject candidate. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-candidate-title"
    >
      {/* Click outside backdrop to close */}
      <div
        className="fixed inset-0"
        onClick={() => !isSubmitting && onClose()}
        aria-hidden="true"
      />

      {/* Modal Dialog Card - Professional Royal Blue + White + Transparency */}
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl border border-blue-100 shadow-2xl shadow-blue-900/15 overflow-hidden z-10 transition-all">
        {/* Top Header with Royal Blue Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600" />

        <div className="p-6 sm:p-7 space-y-5">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 shadow-sm">
                <UserX className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3
                  id="reject-candidate-title"
                  className="text-lg font-bold text-slate-900 tracking-tight"
                >
                  Reject Candidate
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Please provide a reason for rejecting this candidate.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Candidate Context Pill */}
          <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono tracking-wider">
                Candidate
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {candidateName}
              </span>
            </div>
            {jobTitle && (
              <div className="text-right">
                <span className="text-slate-500 block text-[10px] uppercase font-mono tracking-wider">
                  Requisition
                </span>
                <span className="font-semibold text-blue-700 truncate max-w-[180px] block">
                  {jobTitle}
                </span>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rejection Reason (Mandatory Dropdown) */}
            <div>
              <label
                htmlFor="rejection-reason-select"
                className="block text-xs font-bold text-slate-800 mb-1.5"
              >
                Rejection Reason <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="relative">
                <select
                  id="rejection-reason-select"
                  value={selectedReason}
                  onChange={(e) => {
                    setSelectedReason(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  required
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-medium border bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 transition-all cursor-pointer ${
                    !selectedReason
                      ? 'border-blue-200 text-slate-500'
                      : 'border-blue-300 text-slate-900 font-semibold'
                  }`}
                >
                  <option value="" disabled>
                    -- Select a rejection reason --
                  </option>
                  {REJECTION_REASONS.map((reason) => (
                    <option key={reason} value={reason} className="text-slate-900 font-medium">
                      {reason}
                    </option>
                  ))}
                </select>
              </div>
              {!selectedReason && (
                <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Selecting a rejection reason is required before confirming.
                </p>
              )}
            </div>

            {/* Additional Comments (Optional Textarea) */}
            <div>
              <label
                htmlFor="rejection-comments-textarea"
                className="block text-xs font-bold text-slate-800 mb-1.5"
              >
                Additional comments <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="rejection-comments-textarea"
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Provide internal notes, specific assessment feedback, or context for placement audit..."
                className="w-full rounded-xl p-3 text-xs border border-blue-100 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Privacy & Audit Notice */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Zero-Leak Privacy: This rejection reason and note will be logged to your company&apos;s private audit trail. No confidential student or competitor data is exposed.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!selectedReason || isSubmitting}
                className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                  !selectedReason || isSubmitting
                    ? 'bg-rose-300 cursor-not-allowed shadow-none'
                    : 'bg-rose-600 hover:bg-rose-700 active:scale-98 shadow-rose-600/25'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <UserX className="w-3.5 h-3.5 text-white" />
                    <span>Confirm Rejection</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
