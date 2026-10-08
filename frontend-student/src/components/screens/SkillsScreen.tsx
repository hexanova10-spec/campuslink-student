import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StudentSkill } from '../../types/student';
import {
  Code2,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Layers,
  Award,
  Zap
} from 'lucide-react';

export const SkillsScreen: React.FC = () => {
  const [skills, setSkills] = useState<StudentSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState({
    skillName: '',
    category: 'backend',
    proficiencyLevel: 'Intermediate',
    yearsExperience: 1,
  });
  const [message, setMessage] = useState<string | null>(null);

  const fetchSkills = async () => {
    try {
      const res = await api.getSkills();
      setSkills(res);
    } catch (err) {
      console.error('Failed to load skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.skillName.trim()) return;
    try {
      const res = await api.addSkill(newSkill);
      setSkills(res.skills);
      setNewSkill({ skillName: '', category: 'backend', proficiencyLevel: 'Intermediate', yearsExperience: 1 });
      setMessage(`Added "${newSkill.skillName}". AI readiness and skill gap recalculated.`);
      setTimeout(() => setMessage(null), 3500);
    } catch (err: any) {
      alert('Failed: ' + err.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      const res = await api.deleteSkill(id);
      setSkills(res.skills);
      setMessage(`Removed "${name}".`);
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert('Failed: ' + err.message);
    }
  };

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'Expert':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30';
      case 'Advanced':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
      case 'Intermediate':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  if (loading) {
    return <div className="text-xs text-slate-500 dark:text-slate-400 p-8 text-center">Loading skills directory...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Technical Skills & Competency Matrix</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Your verified technical stack evaluated against recruiter job requirements.
          </p>
        </div>
        <div className="text-xs text-blue-700 dark:text-indigo-400 font-bold">
          {skills.length} Registered Skills
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Add Skill Form */}
      <form onSubmit={handleAdd} className="bg-white/85 dark:bg-[#070e22]/75 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-5 shadow-xl space-y-4 backdrop-blur-xl">
        <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4 text-blue-600 dark:text-indigo-400" />
          <span>Add New Competency</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              required
              placeholder="Skill name (e.g., Kubernetes, Kafka, TypeScript)"
              value={newSkill.skillName}
              onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
              className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
            >
              <option value="backend">Backend</option>
              <option value="frontend">Frontend</option>
              <option value="cloud">Cloud / DevOps</option>
              <option value="database">Database</option>
              <option value="core_cs">Core CS</option>
              <option value="tools">Tools / Git</option>
            </select>
          </div>

          <div>
            <select
              value={newSkill.proficiencyLevel}
              onChange={(e) => setNewSkill({ ...newSkill, proficiencyLevel: e.target.value })}
              className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/25 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Save & Recalculate AI Match</span>
          </button>
        </div>
      </form>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {skills.map((s) => (
          <div
            key={s.id}
            className="p-4 rounded-xl bg-white/80 dark:bg-[#070e22]/60 border border-blue-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-slate-700 transition-all flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-bold text-xs text-slate-900 dark:text-white">{s.skill_name}</span>
                <button
                  onClick={() => handleDelete(s.id, s.skill_name)}
                  className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Remove skill"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getProficiencyColor(s.proficiency_level)}`}>
                  {s.proficiency_level}
                </span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 capitalize">{s.category}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-blue-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              <span>{s.years_experience} yrs experience</span>
              {s.verified_by_test && (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
