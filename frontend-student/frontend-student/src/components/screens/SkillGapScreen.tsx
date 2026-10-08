import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { SkillGap } from '../../types/student';
import {
  Target,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';

export const SkillGapScreen: React.FC = () => {
  const [data, setData] = useState<SkillGap | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchGap = async () => {
    try {
      const res = await api.getSkillGap();
      setData(res.skillGap);
      setRoles(res.availableRoles);
      setSelectedRole(res.skillGap.target_role);
    } catch (err) {
      console.error('Failed to load skill gap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGap();
  }, []);

  const handleRoleChange = async (newRole: string) => {
    setSelectedRole(newRole);
    setUpdating(true);
    try {
      const updated = await api.setTargetRole(newRole);
      setData(updated);
    } catch (err: any) {
      alert('Error updating role: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !data) {
    return <div className="text-xs text-slate-500 dark:text-slate-400 p-8 text-center">Calculating skill gap matrices...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Target Role Skill-Gap Analysis</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time comparison of your skills against standard industry requirements for target roles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Target Role:</span>
          <select
            value={selectedRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            disabled={updating}
            className="bg-white/80 dark:bg-[#0b1428] border border-blue-200 dark:border-blue-900/60 rounded-xl px-3 py-1.5 text-xs text-blue-700 dark:text-blue-300 font-bold focus:outline-none focus:border-blue-500 shadow-sm"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main KPI Card in Royal Blue & White Glass */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 backdrop-blur-xl">
        <div>
          <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
            Role Skill Coverage
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl sm:text-5xl font-black text-white">{data.coverage_percentage}%</span>
            <span className="text-xs text-blue-200 font-semibold">for {data.target_role}</span>
          </div>
          <p className="text-xs text-blue-100 mt-2 max-w-lg leading-relaxed">
            {data.matched_skills.length} matched competencies, {data.partial_skills.length} intermediate, and {data.missing_skills.length} critical gaps identified.
          </p>
        </div>

        <div className="w-full sm:w-56 bg-blue-950/40 p-4 rounded-2xl border border-white/20 space-y-2 backdrop-blur-md">
          <div className="text-[11px] font-bold text-blue-200 uppercase">Coverage Level</div>
          <div className="w-full bg-blue-900/60 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-white h-full rounded-full"
              style={{ width: `${data.coverage_percentage}%` }}
            />
          </div>
          <div className="text-[10px] text-right text-blue-200 font-mono font-medium">
            Benchmark: 85%+ recommended
          </div>
        </div>
      </div>

      {/* 3 Columns: Matched, Partial, Missing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Matched */}
        <div className="bg-white/80 dark:bg-[#070e22]/75 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Matched ({data.matched_skills.length})</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 font-bold">
              ✓ Verified
            </span>
          </div>
          <div className="space-y-1.5">
            {data.matched_skills.map((s, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-[#040814]/70 border border-blue-100 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between"
              >
                <span>{s}</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Ready</span>
              </div>
            ))}
          </div>
        </div>

        {/* Partial */}
        <div className="bg-white/80 dark:bg-[#070e22]/75 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Partial ({data.partial_skills.length})</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300 font-bold">
              ⚠ Progress
            </span>
          </div>
          <div className="space-y-1.5">
            {data.partial_skills.length > 0 ? (
              data.partial_skills.map((s, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-[#040814]/70 border border-blue-100 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between"
                >
                  <span>{s}</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Deepen</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-2">No partial competencies.</p>
            )}
          </div>
        </div>

        {/* Missing / Critical Gaps */}
        <div className="bg-white/80 dark:bg-[#070e22]/75 backdrop-blur-xl border border-rose-500/30 rounded-2xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              <XCircle className="w-4 h-4" />
              <span>Critical Gaps ({data.missing_skills.length})</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-300 font-bold">
              ✕ Missing
            </span>
          </div>
          <div className="space-y-1.5">
            {data.missing_skills.map((s, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-[#040814]/70 border border-blue-100 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between"
              >
                <span>{s}</span>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">High Priority</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Learning Roadmap */}
      <div className="p-6 bg-white/80 dark:bg-[#070e22]/75 backdrop-blur-xl border border-blue-200/80 dark:border-blue-500/30 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span>AI Learning Path: Critical Gap Closures</span>
          </div>
          <span className="text-[10px] text-blue-600 dark:text-blue-300 font-mono font-bold">Curated Roadmap</span>
        </div>

        <div className="space-y-3">
          {data.ai_learning_path.map((path, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-blue-50/50 dark:bg-[#040814]/70 border border-blue-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{path.skill}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      path.priority === 'High'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-300'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-300'
                    }`}
                  >
                    {path.priority} Priority
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-slate-400" />
                    Resource: {path.resource}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono text-blue-600 dark:text-blue-300">
                    <Clock className="w-3 h-3 text-slate-400" />
                    ~{path.estimatedHours} Hours
                  </span>
                </div>
              </div>

              <button
                onClick={() => alert(`Starting learning module for: ${path.skill}`)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1 flex-shrink-0 shadow-sm"
              >
                <span>Start Lab</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
