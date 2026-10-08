import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { useRecruiter } from '../context/RecruiterContext.tsx';

export const PrivacyBanner: React.FC = () => {
  const { company, setActiveScreen, theme } = useRecruiter();
  const isLight = theme === 'light';

  return (
    <div
      className={`px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 transition-colors ${
        isLight
          ? 'bg-blue-50/70 backdrop-blur-md border-b border-blue-200/70 text-slate-700'
          : 'bg-blue-950/25 backdrop-blur-md border-b border-blue-500/20 text-slate-300'
      }`}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Zero-Leak Isolation Active
        </span>
        <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>|</span>
        <span>
          Authorized Scope: <strong className={isLight ? 'text-blue-900 font-bold' : 'text-white'}>{company?.name || 'Your Company'}</strong>
        </span>
        <span className={`hidden md:inline ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          • Unapplied candidates & competitor student data are strictly blocked.
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveScreen('security_settings')}
          className={`text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
            isLight ? 'text-blue-700 hover:text-blue-800 underline' : 'text-blue-400 hover:text-blue-300 underline'
          }`}
        >
          <Lock className="w-3 h-3" /> Audit Privacy Boundary
        </button>
      </div>
    </div>
  );
};
