import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ReadinessScore } from '../../types/student';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Zap,
  Award,
  BookOpen,
  BotMessageSquare,
  Target
} from 'lucide-react';

export const ReadinessScoreScreen: React.FC = () => {
  const { setCurrentScreen } = useAuth();
  const [readiness, setReadiness] = useState<ReadinessScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);

  const fetchScore = async () => {
    try {
      const res = await api.getReadiness();
      setReadiness(res);
    } catch (err) {
      console.error('Failed to load readiness:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScore();
  }, []);

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      const updated = await api.recalculateReadiness();
      setReadiness(updated);
    } catch (err: any) {
      alert('Recalculation error: ' + err.message);
    } finally {
      setRecalculating(false);
    }
  };

  if (loading || !readiness) {
    return <div className="text-xs text-slate-500 dark:text-slate-400 p-8 text-center">Auditing employability factors...</div>;
  }

  const score = readiness.overall_score;

  const factors = [
    { name: 'Core Technical Skills', score: readiness.skill_factor, weight: '25% Weight', icon: Zap },
    { name: 'Academic Records (CGPA & Backlogs)', score: readiness.academic_factor, weight: '20% Weight', icon: BookOpen },
    { name: 'Project & Production Work', score: readiness.project_factor, weight: '20% Weight', icon: Award },
    { name: 'Mock Interview Performance', score: readiness.mock_interview_factor, weight: '20% Weight', icon: BotMessageSquare },
    { name: 'ATS Resume Compliance', score: readiness.resume_factor, weight: '15% Weight', icon: Target },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Employability & Readiness Score</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Transparent, deterministic scoring synthesizing your entire academic and technical dossier.
          </p>
        </div>
        <button
          onClick={handleRecalculate}
          disabled={recalculating}
          className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-700 dark:text-slate-200 text-xs font-semibold border border-blue-200/80 dark:border-slate-700 flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${recalculating ? 'animate-spin' : ''}`} />
          <span>{recalculating ? 'Syncing...' : 'Recalculate Deterministic Score'}</span>
        </button>
      </div>

      {/* Main Score Hero Card in Royal Blue & White Glass */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 uppercase tracking-wider backdrop-blur-md">
              {readiness.category}
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl font-black text-white">{score}</span>
              <span className="text-lg text-blue-200 font-bold">/ 100</span>
            </div>
            <p className="text-xs text-blue-100 max-w-lg leading-relaxed">
              Based on {factors.length} quantitative factors: Academic consistency, skill coverage, verifiable production projects, ATS compliance, and mock interview communication.
            </p>
          </div>

          <div className="p-4 bg-blue-950/40 rounded-2xl border border-white/20 space-y-2 text-xs sm:w-64 backdrop-blur-md">
            <div className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">Rating Scale</div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between text-white font-bold">
                <span>80 – 100</span>
                <span>HIGHLY EMPLOYABLE</span>
              </div>
              <div className="flex justify-between text-blue-200">
                <span>60 – 79</span>
                <span>READY</span>
              </div>
              <div className="flex justify-between text-blue-300">
                <span>40 – 59</span>
                <span>DEVELOPING</span>
              </div>
              <div className="flex justify-between text-rose-300">
                <span>0 – 39</span>
                <span>NOT READY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Factors Breakdown */}
      <div className="bg-white/80 dark:bg-[#070e22]/75 backdrop-blur-xl border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Visual Factor Breakdown</h2>

        <div className="space-y-4">
          {factors.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                    <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>{f.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{f.weight}</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{f.score} / 100</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      f.score >= 80 ? 'bg-emerald-500' : f.score >= 60 ? 'bg-blue-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${f.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WHY YOUR SCORE IS 82 Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-6 bg-white/80 dark:bg-[#070e22]/75 backdrop-blur-xl border border-blue-200/80 dark:border-blue-900/50 rounded-2xl space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Strengths Boosting Your Score</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {readiness.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Needs Improvement */}
        <div className="p-6 bg-white/80 dark:bg-[#070e22]/75 backdrop-blur-xl border border-blue-200/80 dark:border-blue-900/50 rounded-2xl space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Opportunities for Improvement</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {readiness.needs_improvement.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-amber-500 font-bold">⚠</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Next Actions Checklist */}
      <div className="p-6 bg-white/80 dark:bg-[#070e22]/75 backdrop-blur-xl border border-blue-200/80 dark:border-blue-500/30 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span>Prescribed Next Tactical Actions</span>
          </div>
          <span className="text-[10px] text-blue-600 dark:text-blue-300 font-mono font-bold">
            Deterministic Next Steps
          </span>
        </div>

        <div className="space-y-2.5">
          {readiness.action_items.map((act, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-[#040814]/70 border border-blue-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-800 dark:text-slate-200"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-sm">
                  {idx + 1}
                </span>
                <span>{act}</span>
              </div>
              <button
                onClick={() => {
                  if (act.toLowerCase().includes('mock')) setCurrentScreen('mock-interview');
                  else if (act.toLowerCase().includes('resume')) setCurrentScreen('ai-resume-analysis');
                  else setCurrentScreen('skill-gap');
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1"
              >
                <span>Execute</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
