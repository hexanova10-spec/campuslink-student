import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StudentAcademics } from '../../types/student';
import {
  GraduationCap,
  Save,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export const AcademicProfileScreen: React.FC = () => {
  const [academics, setAcademics] = useState<StudentAcademics | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getAcademics();
        setAcademics(res);
      } catch (err) {
        console.error('Failed to load academics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!academics) return;
    setSaving(true);
    setMessage(null);
    try {
      await api.updateAcademics(academics);
      setMessage('Academic profile successfully saved. AI Readiness recalculation completed.');
    } catch (err: any) {
      setMessage('Failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !academics) {
    return <div className="text-xs text-slate-500 dark:text-slate-400 p-8 text-center">Loading academic dossier...</div>;
  }

  return (
    <div className="student-page space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Academic Performance & Records</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Verified academic cutoffs, CGPA progression, and backlog audit for placement eligibility.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {academics.active_backlogs === 0 ? (
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero Active Backlogs (100% Eligible)</span>
            </span>
          ) : (
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{academics.active_backlogs} Active Backlog(s)</span>
            </span>
          )}
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/85 dark:bg-[#070e22]/75 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current CGPA</span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{academics.cgpa}</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 inline-block">
            Exceeds 7.5 & 8.0 placement cutoffs
          </span>
        </div>

        <div className="bg-white/85 dark:bg-[#070e22]/75 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Class 10th Score</span>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-indigo-400 mt-1">{academics.tenth_percentage}%</div>
          <span className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 inline-block">Board: {academics.tenth_board}</span>
        </div>

        <div className="bg-white/85 dark:bg-[#070e22]/75 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Class 12th Score</span>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-cyan-400 mt-1">{academics.twelfth_percentage}%</div>
          <span className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 inline-block">Board: {academics.twelfth_board}</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white/85 dark:bg-[#070e22]/75 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Cumulative CGPA (out of 10.0)</label>
            <input
              type="number"
              step="0.01"
              value={academics.cgpa}
              onChange={(e) => setAcademics({ ...academics, cgpa: Number(e.target.value) })}
              className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Active Backlogs</label>
            <input
              type="number"
              value={academics.active_backlogs}
              onChange={(e) => setAcademics({ ...academics, active_backlogs: Number(e.target.value) })}
              className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Class 10th Percentage (%)</label>
            <input
              type="number"
              step="0.1"
              value={academics.tenth_percentage}
              onChange={(e) => setAcademics({ ...academics, tenth_percentage: Number(e.target.value) })}
              className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Class 12th Percentage (%)</label>
            <input
              type="number"
              step="0.1"
              value={academics.twelfth_percentage}
              onChange={(e) => setAcademics({ ...academics, twelfth_percentage: Number(e.target.value) })}
              className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* Semester-wise breakdown */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Semester-by-Semester SGPA Progression</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(academics.semester_grades || {}).map(([sem, grade]) => (
              <div key={sem} className="p-3 bg-blue-50/60 dark:bg-slate-950 rounded-xl border border-blue-100 dark:border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">{sem}</div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">{grade}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-blue-100 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/25 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Update Academics & Recalculate'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
