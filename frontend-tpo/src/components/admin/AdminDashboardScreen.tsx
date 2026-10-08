import React from 'react';
import {
  LayoutDashboard,
  Building,
  Users,
  Briefcase,
  ShieldAlert,
  Database,
  TrendingUp,
  Award,
  ArrowRight,
  Sparkles,
  Network
} from 'lucide-react';
import { repo } from '../../services/storage';

interface AdminDashboardScreenProps {
  onSelectScreen: (screenId: number) => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ onSelectScreen }) => {
  const institutions = repo.getInstitutions();
  const allStudents = repo.getStudents();
  const companies = repo.getCompanies();
  const auditLogs = repo.getAuditLogs();

  const totalStudents = institutions.reduce((sum, i) => sum + i.activeStudents, 0);
  const totalPlaced = institutions.reduce((sum, i) => sum + i.totalPlaced, 0);
  const globalPlacementRate = totalStudents > 0 ? Math.round((totalPlaced / totalStudents) * 100) : 74;

  return (
    <div className="space-y-6">
      {/* Admin Hero */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-900/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SYSTEM ADMINISTRATOR OVERSIGHT
              </span>
              <span className="text-xs text-slate-400 font-mono">GLOBAL TENANCY: 3 ACCREDITED COLLEGES</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              CampusLink Global Multi-Campus Command Center
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Cross-institutional governance, platform security compliance, Row-Level Security policy enforcement, and university-wide placement benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onSelectScreen(35)}
              className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 text-xs font-semibold flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI System Config</span>
            </button>
            <button
              onClick={() => onSelectScreen(36)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition"
            >
              <Database className="w-4 h-4" />
              <span>Audit Logs & DDL</span>
            </button>
          </div>
        </div>

        {/* Global Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-emerald-900/40">
          <div>
            <div className="text-xs text-slate-400">Total Enrolled System-Wide</div>
            <div className="text-2xl font-black text-white mt-0.5 font-mono">{totalStudents.toLocaleString()} Students</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Multi-College Placement Rate</div>
            <div className="text-2xl font-black text-emerald-400 mt-0.5 font-mono">{globalPlacementRate}% ({totalPlaced})</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Enterprise Corporate Partners</div>
            <div className="text-2xl font-black text-cyan-400 mt-0.5 font-mono">{companies.length} Companies</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Security Audit Logs</div>
            <div className="text-2xl font-black text-purple-400 mt-0.5 font-mono">{auditLogs.length} Events</div>
          </div>
        </div>
      </div>

      {/* Colleges Overview Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Connected Participating Institutions ({institutions.length})
          </h2>
          <button
            onClick={() => onSelectScreen(29)}
            className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Manage Colleges</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {institutions.map(inst => (
            <div
              key={inst.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    {inst.code}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{inst.accreditation}</span>
                </div>
                <h3 className="font-extrabold text-base text-white mt-1.5">{inst.name}</h3>
                <div className="text-xs text-slate-400 mt-0.5">{inst.city}, {inst.state}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-center">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-500">Placement %</div>
                  <div className="font-extrabold text-emerald-400 text-sm mt-0.5">
                    {Math.round((inst.totalPlaced / inst.activeStudents) * 100)}%
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-500">Avg Package</div>
                  <div className="font-extrabold text-white text-sm mt-0.5">₹{inst.averagePackageLPA} LPA</div>
                </div>
              </div>

              <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800">
                <div>TPO Lead: <strong className="text-slate-200">{inst.tpoHeadName}</strong></div>
                <div>Campuses: <span className="text-slate-300 font-mono">{inst.campuses.join(', ')}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
