import React from 'react';
import { Target, TrendingUp, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface MatchScoreProps {
  score: number;
}

export const MatchScore: React.FC<MatchScoreProps> = ({ score }) => {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));

  let matchTier = 'Strong Match';
  let tierColor = 'text-blue-600 dark:text-blue-400';
  let strokeColor = '#2563eb';
  let badgeBg = 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20';
  let TierIcon = CheckCircle2;

  if (normalizedScore < 40) {
    matchTier = 'Low Match';
    tierColor = 'text-rose-600 dark:text-rose-400';
    strokeColor = '#e11d48';
    badgeBg = 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20';
    TierIcon = ShieldAlert;
  } else if (normalizedScore < 60) {
    matchTier = 'Developing Match';
    tierColor = 'text-amber-600 dark:text-amber-400';
    strokeColor = '#d97706';
    badgeBg = 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20';
    TierIcon = TrendingUp;
  } else if (normalizedScore < 80) {
    matchTier = 'Good Match';
    tierColor = 'text-sky-600 dark:text-sky-400';
    strokeColor = '#0284c7';
    badgeBg = 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20';
    TierIcon = Target;
  }

  // SVG circle calculations
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-white/90 via-blue-50/40 to-white/70 dark:from-[#08122c]/90 dark:via-[#0c1a3d]/80 dark:to-[#060e22]/90 border border-blue-200/70 dark:border-blue-900/50 shadow-lg backdrop-blur-xl flex flex-col items-center text-center">
      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
        AI Match Score
      </div>

      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Background Track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            className="text-slate-200 dark:text-slate-800"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
          />
          {/* Progress Ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={strokeColor}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={`text-3xl sm:text-4xl font-black tracking-tight ${tierColor}`}>
            {normalizedScore}%
          </span>
        </div>
      </div>

      <div className={`mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${badgeBg}`}>
        <TierIcon className="w-3.5 h-3.5" />
        <span className={tierColor}>{matchTier}</span>
      </div>

      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 max-w-xs leading-relaxed">
        Calculated across academic eligibility, required skills coverage, project depth, and role alignment.
      </p>
    </div>
  );
};
