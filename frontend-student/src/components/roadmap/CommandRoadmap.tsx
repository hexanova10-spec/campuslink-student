import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Zap,
  ChevronRight
} from 'lucide-react';

interface MilestoneItem {
  id: string;
  title: string;
  subtitle: string;
  phase: string;
  estimatedDays: string;
  completed: boolean;
  category: 'resume' | 'dsa' | 'cloud' | 'interview' | 'offers';
}

export const CommandRoadmap: React.FC = () => {
  const [items, setItems] = useState<MilestoneItem[]>([
    {
      id: 'm-1',
      title: 'Complete 10-Step Student Onboarding & Bio',
      subtitle: 'Locks in baseline CGPA, skills, projects, and target role.',
      phase: 'Week 1',
      estimatedDays: 'Day 1-2',
      completed: true,
      category: 'resume',
    },
    {
      id: 'm-2',
      title: 'Pass ATS Resume Audit with 80%+ Score',
      subtitle: 'Quantify project results with latency metrics, add live GitHub repo links.',
      phase: 'Week 1',
      estimatedDays: 'Day 3-5',
      completed: true,
      category: 'resume',
    },
    {
      id: 'm-3',
      title: 'Core DSA Master Patterns Drill',
      subtitle: 'Complete 14 blind patterns: Sliding Window, Trees, and Dynamic Programming.',
      phase: 'Week 2',
      estimatedDays: 'Day 6-12',
      completed: true,
      category: 'dsa',
    },
    {
      id: 'm-4',
      title: 'Address Critical Cloud Skill Gap (AWS / Docker)',
      subtitle: 'Deploy a containerized microservice to AWS ECS with GitHub Actions CI/CD.',
      phase: 'Week 3',
      estimatedDays: 'Day 13-18',
      completed: false,
      category: 'cloud',
    },
    {
      id: 'm-5',
      title: 'Pass 3 Full AI Mock Interviews with 85+ Score',
      subtitle: 'Simulate high-stakes System Design and behavioral STAR questions.',
      phase: 'Week 3',
      estimatedDays: 'Day 19-24',
      completed: false,
      category: 'interview',
    },
    {
      id: 'm-6',
      title: 'Convert Shortlists into Dream Offers (₹ 18+ LPA)',
      subtitle: 'Review compensation breakdown, joining documents, and accept top offer.',
      phase: 'Week 4',
      estimatedDays: 'Day 25-30',
      completed: false,
      category: 'offers',
    },
  ]);

  const toggleMilestone = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  return (
    <div className="bg-white/80 dark:bg-[#070e22]/75 backdrop-blur-xl border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Interactive 30-Day Placement Sprint Roadmap</h3>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20">
              Personalized
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dynamic milestones tailored to your target role: <strong>Software Engineer</strong>. Click any checkpoint to toggle completion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sprint Progress</div>
            <div className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
              {completedCount}/{items.length} Milestones ({progressPercent}%)
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-blue-500/40 bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center font-black text-xs text-blue-700 dark:text-blue-300 shadow-sm">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Royal Blue Gradient Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-6">
        <div
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Interactive Milestone Checkpoints */}
      <div className="space-y-3">
        {items.map((m) => {
          return (
            <div
              key={m.id}
              onClick={() => toggleMilestone(m.id)}
              className={`group flex items-start justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                m.completed
                  ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50'
                  : 'bg-blue-50/40 dark:bg-[#040814]/70 border-blue-100 dark:border-slate-800 hover:border-blue-400 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <button
                  type="button"
                  className="mt-0.5 text-slate-400 group-hover:scale-110 transition-transform"
                >
                  {m.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                  )}
                </button>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs font-bold ${
                        m.completed ? 'text-emerald-700 dark:text-emerald-300 line-through opacity-85' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {m.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100/80 dark:bg-slate-800 text-blue-800 dark:text-slate-400 font-mono font-medium">
                      {m.phase} • {m.estimatedDays}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{m.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    m.completed
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {m.completed ? 'Completed' : 'Pending'}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
