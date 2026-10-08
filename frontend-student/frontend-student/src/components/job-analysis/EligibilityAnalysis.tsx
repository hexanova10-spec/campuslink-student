import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, ShieldCheck } from 'lucide-react';

interface EligibilityAnalysisProps {
  eligibility: {
    status: 'Eligible' | 'Not Eligible' | 'Partially Eligible';
    reason: string;
  };
}

export const EligibilityAnalysis: React.FC<EligibilityAnalysisProps> = ({ eligibility }) => {
  const { status, reason } = eligibility;

  let Icon = CheckCircle2;
  let statusBadgeClass = 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
  let cardBorderClass = 'border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20';

  if (status === 'Not Eligible') {
    Icon = XCircle;
    statusBadgeClass = 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30';
    cardBorderClass = 'border-rose-200/60 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20';
  } else if (status === 'Partially Eligible') {
    Icon = AlertCircle;
    statusBadgeClass = 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
    cardBorderClass = 'border-amber-200/60 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20';
  }

  return (
    <div className={`p-4 rounded-2xl border backdrop-blur-xl transition-all ${cardBorderClass}`}>
      <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Eligibility
          </h3>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusBadgeClass}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{status}</span>
        </div>
      </div>
      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
        {reason}
      </p>
    </div>
  );
};
