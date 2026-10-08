import React, { useState } from 'react';
import {
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Info
} from 'lucide-react';

interface SkillMatchSectionProps {
  matchingSkills: string[];
  partialSkills: string[];
  skillGaps: string[];
  onNavigateToSkillGap?: () => void;
}

export const SkillMatchSection: React.FC<SkillMatchSectionProps> = ({
  matchingSkills,
  partialSkills,
  skillGaps,
  onNavigateToSkillGap
}) => {
  const [selectedTip, setSelectedTip] = useState<{ skill: string; tip: string } | null>(null);

  const handleLearnClick = (skill: string) => {
    setSelectedTip({
      skill,
      tip: `Focus on foundational concepts and practical repository implementations for ${skill}. You can also practice this in the Skill Gap module.`
    });
  };

  return (
    <div className="space-y-5">
      {/* 9. Your Matching Skills */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Your Matching Skills
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            {matchingSkills.length} verified
          </span>
        </div>

        {matchingSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {matchingSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 border border-blue-200/80 dark:border-blue-800/50 text-xs font-semibold backdrop-blur-md shadow-sm flex items-center gap-1.5 hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No direct matching skills recorded.</p>
        )}
      </div>

      {/* 10. Skills to Strengthen */}
      {partialSkills && partialSkills.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Skills to Strengthen
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              {partialSkills.length} partial
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {partialSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border border-amber-200/80 dark:border-amber-800/50 text-xs font-semibold backdrop-blur-md shadow-sm flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 11. Skill Gaps */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Skill Gaps
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20">
              {skillGaps.length} missing
            </span>
          </div>

          {onNavigateToSkillGap && (
            <button
              type="button"
              onClick={onNavigateToSkillGap}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Skill Matrix</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {skillGaps.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skillGaps.map((skill, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/40 text-xs font-semibold backdrop-blur-md shadow-sm flex items-center gap-2"
              >
                <span className="text-rose-500">•</span>
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleLearnClick(skill)}
                  className="ml-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 border border-blue-200 dark:border-slate-700 transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                  title={`Tips to improve ${skill}`}
                >
                  <BookOpen className="w-2.5 h-2.5" />
                  <span>Improve</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            No critical skill gaps found for this role!
          </p>
        )}

        {/* Tip Popover / Guidance message */}
        {selectedTip && (
          <div className="p-3 rounded-xl bg-blue-50/90 dark:bg-blue-950/50 border border-blue-200/90 dark:border-blue-800/60 flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200 animate-in fade-in duration-200">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">{selectedTip.skill} Strategy: </span>
              <span>{selectedTip.tip}</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedTip(null)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
