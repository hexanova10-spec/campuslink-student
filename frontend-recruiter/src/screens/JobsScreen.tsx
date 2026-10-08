import React from 'react';
import {
  Briefcase,
  Users,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Plus,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useRecruiter } from '../context/RecruiterContext.tsx';

export const JobsScreen: React.FC = () => {
  const { jobs, company, setActiveScreen, setSelectedJobId, theme } = useRecruiter();
  const isLight = theme === 'light';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-xl lg:text-2xl font-black flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <Briefcase className="w-6 h-6 text-blue-600" /> Active Job Requisitions
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
              {jobs.length} Active
            </span>
          </div>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Requisitions published for <strong className={isLight ? 'text-slate-900' : 'text-white'}>{company?.name}</strong> campus drives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen('jd_upload')}
            className={`px-4 py-2 rounded-xl border font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
              isLight
                ? 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50'
                : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Auto-Fill via AI JD
          </button>

          <button
            onClick={() => setActiveScreen('create_job')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/25 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Requisition
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {jobs.map((job) => (
          <div
            key={job.id}
            className={`rounded-3xl p-6 space-y-4 transition-all shadow-lg flex flex-col justify-between border ${
              isLight
                ? 'bg-white/80 backdrop-blur-xl border-slate-200/90 text-slate-800'
                : 'bg-slate-900/60 backdrop-blur-xl border-white/10 text-white'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                    {job.department}
                  </span>
                  <h3 className={`text-lg font-black mt-1.5 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {job.title}
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shrink-0">
                  {job.status}
                </span>
              </div>

              <p className={`text-xs line-clamp-2 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {job.description}
              </p>

              <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                <div className={`p-2.5 rounded-xl text-center ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/40 border border-white/10'}`}>
                  <span className={`text-[10px] uppercase font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>CTC Package</span>
                  <p className={`text-xs font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    ₹{job.ctcMinLpa}-{job.ctcMaxLpa} LPA
                  </p>
                </div>

                <div className={`p-2.5 rounded-xl text-center ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/40 border border-white/10'}`}>
                  <span className={`text-[10px] uppercase font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Min CGPA</span>
                  <p className={`text-xs font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {job.minCgpa.toFixed(1)}+
                  </p>
                </div>

                <div className={`p-2.5 rounded-xl text-center ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/40 border border-white/10'}`}>
                  <span className={`text-[10px] uppercase font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Openings</span>
                  <p className={`text-xs font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {job.openings} Seats
                  </p>
                </div>

                <div className={`p-2.5 rounded-xl text-center ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/40 border border-white/10'}`}>
                  <span className={`text-[10px] uppercase font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Work Mode</span>
                  <p className={`text-xs font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {job.workMode}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Mandatory Stack:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {job.requiredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${
                        isLight ? 'bg-slate-100 text-slate-800 border-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className={`pt-4 border-t flex items-center justify-between gap-3 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <div className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Deadline: <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>{job.deadline}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedJobId(job.id);
                    setActiveScreen('applicants');
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  Applicants ({job.stats?.totalApplicants || 0})
                </button>

                <button
                  onClick={() => {
                    setSelectedJobId(job.id);
                    setActiveScreen('candidate_ranking');
                  }}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> AI Rank
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
