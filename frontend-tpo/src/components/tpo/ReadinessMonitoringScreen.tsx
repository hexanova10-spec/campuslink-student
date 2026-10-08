import React, { useState } from 'react';
import { Activity, ArrowRight, AlertTriangle, CheckCircle, Clock, Users, Sparkles, Filter } from 'lucide-react';
import { repo } from '../../services/storage';

interface ReadinessMonitoringScreenProps {
  onSelectStudent: (studentId: string) => void;
  onSelectScreen: (screenId: number) => void;
}

export const ReadinessMonitoringScreen: React.FC<ReadinessMonitoringScreenProps> = ({
  onSelectStudent,
  onSelectScreen
}) => {
  const students = repo.getStudents();
  const institution = repo.getEffectiveInstitution();
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('ALL');

  const branches = ['CSE', 'ECE', 'IT', 'MECH', 'EEE'];

  const branchBreakdown = branches.map(branch => {
    const branchStudents = students.filter(s => s.branch === branch);
    const total = branchStudents.length;
    if (total === 0) return { branch, total: 0, ready: 0, developing: 0, atRisk: 0, readyPct: 0, devPct: 0, riskPct: 0 };

    const ready = branchStudents.filter(s => s.readinessLevel === 'HIGHLY_EMPLOYABLE' || s.readinessLevel === 'PLACEMENT_READY').length;
    const developing = branchStudents.filter(s => s.readinessLevel === 'DEVELOPING').length;
    const atRisk = branchStudents.filter(s => s.readinessLevel === 'AT_RISK' || s.isFlaggedAtRisk).length;

    return {
      branch,
      total,
      ready,
      developing,
      atRisk,
      readyPct: Math.round((ready / total) * 100),
      devPct: Math.round((developing / total) * 100),
      riskPct: Math.round((atRisk / total) * 100)
    };
  });

  const displayStudents = selectedBranchFilter === 'ALL'
    ? students
    : students.filter(s => s.branch === selectedBranchFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
              Aggregate Student Readiness Monitoring
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {institution.code}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Institutional distribution of Placement Ready, Developing, and At-Risk candidate cohorts.
          </p>
        </div>

        <button
          onClick={() => onSelectScreen(6)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition"
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Launch AI At-Risk Engine</span>
        </button>
      </div>

      {/* Aggregate Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {branchBreakdown.map(b => (
          <div
            key={b.branch}
            onClick={() => setSelectedBranchFilter(b.branch === selectedBranchFilter ? 'ALL' : b.branch)}
            className={`p-5 rounded-2xl border transition cursor-pointer shadow-lg ${
              selectedBranchFilter === b.branch
                ? 'bg-slate-800/90 border-indigo-500 ring-2 ring-indigo-500/30'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-extrabold text-base text-white">{b.branch} Engineering</span>
                <div className="text-[11px] text-slate-400 mt-0.5">{b.total} Active Enrolled</div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono font-bold">
                {b.readyPct}% Ready
              </span>
            </div>

            {/* Segmented Progress Bar */}
            <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex mb-3">
              <div
                style={{ width: `${b.readyPct}%` }}
                className="bg-emerald-500 transition-all duration-500"
                title={`Ready: ${b.readyPct}%`}
              />
              <div
                style={{ width: `${b.devPct}%` }}
                className="bg-sky-500 transition-all duration-500"
                title={`Developing: ${b.devPct}%`}
              />
              <div
                style={{ width: `${b.riskPct}%` }}
                className="bg-rose-500 transition-all duration-500"
                title={`At Risk: ${b.riskPct}%`}
              />
            </div>

            {/* Metric Pills */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
                <div className="text-[10px] text-emerald-400 font-bold">READY</div>
                <div className="font-extrabold text-white mt-0.5">{b.readyPct}%</div>
                <div className="text-[10px] text-slate-500">({b.ready})</div>
              </div>
              <div className="p-2 rounded-xl bg-sky-950/30 border border-sky-800/40">
                <div className="text-[10px] text-sky-400 font-bold">DEVELOPING</div>
                <div className="font-extrabold text-white mt-0.5">{b.devPct}%</div>
                <div className="text-[10px] text-slate-500">({b.developing})</div>
              </div>
              <div className="p-2 rounded-xl bg-rose-950/30 border border-rose-800/40">
                <div className="text-[10px] text-rose-400 font-bold">AT RISK</div>
                <div className="font-extrabold text-white mt-0.5">{b.riskPct}%</div>
                <div className="text-[10px] text-slate-500">({b.atRisk})</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Drill-Down Cohort Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-white">
              Candidate Drill-Down: {selectedBranchFilter === 'ALL' ? 'All Engineering Departments' : `${selectedBranchFilter} Department`}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Click any candidate to inspect assessment performance, skill gaps, and placement history.</p>
          </div>
          {selectedBranchFilter !== 'ALL' && (
            <button
              onClick={() => setSelectedBranchFilter('ALL')}
              className="text-xs text-indigo-400 hover:underline"
            >
              Clear Branch Filter
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-800/60">
          {displayStudents.map(student => (
            <div
              key={student.id}
              onClick={() => onSelectStudent(student.id)}
              className="py-3 flex items-center justify-between hover:bg-slate-800/40 px-3 rounded-xl transition cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 group-hover:bg-indigo-600/30 flex items-center justify-center text-xs font-bold text-slate-200 border border-slate-700">
                  {student.fullName.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-xs text-slate-200 group-hover:text-indigo-300 transition">
                    {student.fullName}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {student.rollNumber} • {student.branch} • CGPA {student.cgpa.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  student.readinessLevel === 'HIGHLY_EMPLOYABLE'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    : student.readinessLevel === 'PLACEMENT_READY'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : student.readinessLevel === 'DEVELOPING'
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                }`}>
                  {student.readinessLevel.replace('_', ' ')}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
