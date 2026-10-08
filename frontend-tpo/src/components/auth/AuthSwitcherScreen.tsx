import React from 'react';
import { Shield, UserCheck, Lock, CheckCircle2, Building, ArrowRight, Database } from 'lucide-react';
import { repo } from '../../services/storage';

interface AuthSwitcherScreenProps {
  onSelectScreen: (screenId: number) => void;
}

export const AuthSwitcherScreen: React.FC<AuthSwitcherScreenProps> = ({ onSelectScreen }) => {
  const currentUser = repo.getCurrentUser();
  const institutions = repo.getInstitutions();

  const handleSelectUser = (userId: string, targetScreen: number) => {
    repo.setCurrentUser(userId);
    onSelectScreen(targetScreen);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 inline-flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          MULTI-TENANT RBAC AUTHORIZATION LAYER
        </span>
        <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
          Role-Based Access & Tenant Context Switcher
        </h1>
        <p className="text-xs text-slate-400 max-w-2xl mx-auto">
          CampusLink implements institutional tenant isolation. College Placement Officers (TPOs) only access their specific college's data. System Administrators govern multi-campus infrastructure globally.
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* TPO 1 */}
        <div
          onClick={() => handleSelectUser('user-tpo-apex', 2)}
          className={`p-5 rounded-2xl border transition cursor-pointer shadow-xl flex flex-col justify-between ${
            currentUser.id === 'user-tpo-apex'
              ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                COLLEGE TPO
              </span>
              {currentUser.id === 'user-tpo-apex' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Dr. Rajesh Nair</h3>
              <div className="text-xs text-slate-400 mt-0.5">Apex Institute of Technology (Pune)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div>• <strong>Access Scope:</strong> Apex Students & Jobs Only</div>
              <div>• <strong>Status:</strong> Active TPO Lead</div>
              <div>• <strong>Enforced:</strong> Zero Access to Metro Univ Data</div>
            </div>
          </div>

          <button
            onClick={() => handleSelectUser('user-tpo-apex', 2)}
            className="mt-4 w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <span>Enter as Apex TPO</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* TPO 2 */}
        <div
          onClick={() => handleSelectUser('user-tpo-metro', 2)}
          className={`p-5 rounded-2xl border transition cursor-pointer shadow-xl flex flex-col justify-between ${
            currentUser.id === 'user-tpo-metro'
              ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                COLLEGE TPO
              </span>
              {currentUser.id === 'user-tpo-metro' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Dr. Sunita Kulkarni</h3>
              <div className="text-xs text-slate-400 mt-0.5">Metro University of Engineering (BLR)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div>• <strong>Access Scope:</strong> Metro Univ Students & Jobs Only</div>
              <div>• <strong>Status:</strong> Active TPO Lead</div>
              <div>• <strong>Enforced:</strong> Zero Access to Apex Inst Data</div>
            </div>
          </div>

          <button
            onClick={() => handleSelectUser('user-tpo-metro', 2)}
            className="mt-4 w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <span>Enter as Metro TPO</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* SYSTEM ADMIN */}
        <div
          onClick={() => handleSelectUser('user-sysadmin', 28)}
          className={`p-5 rounded-2xl border transition cursor-pointer shadow-xl flex flex-col justify-between ${
            currentUser.id === 'user-sysadmin'
              ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                GLOBAL SYSTEM ADMIN
              </span>
              {currentUser.id === 'user-sysadmin' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Samantha Vance</h3>
              <div className="text-xs text-slate-400 mt-0.5">CampusLink Platform Operations</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div>• <strong>Access Scope:</strong> Cross-College Multi-Tenant Authority</div>
              <div>• <strong>Permissions:</strong> Global Users, DB Schemas, Audit Logs</div>
              <div>• <strong>Security:</strong> System Role Master</div>
            </div>
          </div>

          <button
            onClick={() => handleSelectUser('user-sysadmin', 28)}
            className="mt-4 w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <span>Enter Global Admin Suite</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
