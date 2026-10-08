import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { JobDescriptionAnalysisResult } from '../../types/student';
import { MatchScore } from './MatchScore';
import { EligibilityAnalysis } from './EligibilityAnalysis';
import { SkillMatchSection } from './SkillMatchSection';
import {
  X,
  Sparkles,
  Loader2,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Lightbulb,
  Target,
  FileText,
  Briefcase
} from 'lucide-react';

interface JobDescriptionAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  companyName: string;
  roleTitle: string;
  onNavigateToSkillGap?: () => void;
}

export const JobDescriptionAnalysisModal: React.FC<JobDescriptionAnalysisModalProps> = ({
  isOpen,
  onClose,
  jobId,
  companyName,
  roleTitle,
  onNavigateToSkillGap
}) => {
  const [analysis, setAnalysis] = useState<JobDescriptionAnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.analyzeJobDescription(jobId);
      setAnalysis(data);
    } catch (err: any) {
      console.error('Job Description Analysis error:', err);
      // Requirement 16: Professional error state, never expose API keys or technical errors
      setError('Unable to analyze this job description right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && jobId) {
      fetchAnalysis();
    }
  }, [isOpen, jobId]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Glass Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-3xl my-auto bg-white/95 dark:bg-[#070e22]/95 border border-blue-200/90 dark:border-blue-900/60 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-blue-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-gradient-to-r from-blue-50/70 via-transparent to-blue-50/30 dark:from-[#0b1638]/70 dark:via-transparent dark:to-[#08112e]/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                AI Job Description Analysis
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Understand how well your profile matches this opportunity.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-300 pt-1">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                {companyName}
              </span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span>{roleTitle}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* 15. Loading State */}
          {loading && (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 shadow-inner">
                <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  AI Job Description Analysis
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  Analyzing this opportunity against your profile...
                </p>
              </div>
              <div className="w-48 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-2/3 animate-pulse rounded-full" />
              </div>
            </div>
          )}

          {/* 16. Error State */}
          {!loading && error && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50">
                <AlertTriangle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Analysis Unavailable
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm">
                  {error}
                </p>
              </div>
              <button
                type="button"
                onClick={fetchAnalysis}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          )}

          {/* Analysis Data Available */}
          {!loading && !error && analysis && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* TOP: 6. AI Match Score */}
              <MatchScore score={analysis.matchScore} />

              {/* 7. Role Summary */}
              <div className="p-4 rounded-2xl bg-blue-50/40 dark:bg-[#060c1d]/60 border border-blue-200/60 dark:border-blue-900/40 backdrop-blur-xl space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Role Summary
                  </h3>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {analysis.roleSummary}
                </p>
              </div>

              {/* 8. Eligibility */}
              <EligibilityAnalysis eligibility={analysis.eligibility} />

              {/* 9, 10, 11. Matching Skills, Partial Skills & Skill Gaps */}
              <SkillMatchSection
                matchingSkills={analysis.matchingSkills}
                partialSkills={analysis.partialSkills}
                skillGaps={analysis.skillGaps}
                onNavigateToSkillGap={onNavigateToSkillGap}
              />

              {/* 12. Why You Match */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Why You Match
                  </h3>
                </div>

                <div className="space-y-2">
                  {analysis.whyYouMatch.map((reason, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/40 flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200 font-medium"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-1.5 flex-shrink-0" />
                      <span className="leading-relaxed">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 13. AI Recommendations */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    AI Recommendations
                  </h3>
                </div>

                <div className="space-y-2">
                  {analysis.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-800 dark:text-slate-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 shadow-sm mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed font-medium">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 14. Interview Focus */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Interview Focus
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {analysis.interviewFocus.map((topic, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/30 flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200 font-medium"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-blue-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-[#070e22]/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
