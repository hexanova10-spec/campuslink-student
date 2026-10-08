import React from 'react';
import {
  UserCog,
  Building2,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Lock,
  Sparkles
} from 'lucide-react';
import { useRecruiter } from '../context/RecruiterContext.tsx';

export const LoginScreen: React.FC = () => {
  const {
    availableRecruiters,
    recruiter,
    switchRecruiterSession,
    setActiveScreen
  } = useRecruiter();

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-600/30">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
          Recruiter Authentication &amp; Tenant Isolation
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Switch active recruiter identity to inspect row-level multi-tenant isolation and verify zero candidate data leakage across competing employers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
        {availableRecruiters.map((r) => {
          const isActive = r.id === recruiter?.id;

          return (
            <div
              key={r.id}
              className={`rounded-3xl border p-6 flex flex-col justify-between space-y-4 transition-all shadow-xs ${
                isActive
                  ? 'bg-blue-50/70 border-blue-500 shadow-md shadow-blue-500/10'
                  : 'bg-white/95 backdrop-blur-xl border-blue-100 hover:border-blue-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isActive ? 'ACTIVE SESSION' : 'OFFLINE'}
                  </span>
                  {isActive && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <img
                    src={r.avatarUrl}
                    alt={r.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{r.name}</h3>
                    <p className="text-[11px] text-slate-500">{r.designation}</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-blue-100 space-y-1 text-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block font-bold">Organization</span>
                  <p className="font-bold text-blue-700">{r.companyName}</p>
                </div>
              </div>

              <div>
                {isActive ? (
                  <button
                    onClick={() => setActiveScreen('dashboard')}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-blue-600/20 active:scale-98"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => switchRecruiterSession(r.id)}
                    className="w-full py-2.5 rounded-xl bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer shadow-2xs"
                  >
                    Switch to {r.name}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-blue-100 text-xs text-slate-600 flex items-center justify-between shadow-2xs">
        <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Multi-Tenant Row Security
        </span>
        <span>
          Switching to Nova Cloud completely isolates Apex Fintech applications from view.
        </span>
      </div>
    </div>
  );
};
