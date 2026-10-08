import React from 'react';
import { Briefcase, CheckCircle, Clock, AlertTriangle, ArrowRight, DollarSign, MapPin } from 'lucide-react';
import { repo } from '../../services/storage';

interface JobsScreenProps {
  onSelectScreen: (screenId: number) => void;
}

export const JobsScreen: React.FC<JobsScreenProps> = ({ onSelectScreen }) => {
  const jobs = repo.getJobs();
  const companies = repo.getCompanies();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
            Campus Jobs Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            All enterprise opportunities posted for this college and their current status.
          </p>
        </div>

        <button
          onClick={() => onSelectScreen(10)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-semibold transition"
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Job Review Queue ({jobs.filter(j => j.status === 'PENDING_TPO_REVIEW').length})</span>
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map(job => {
          const comp = companies.find(c => c.id === job.companyId);
          return (
            <div
              key={job.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                    {comp?.name || 'Enterprise'}
                  </span>
                  <h3 className="font-extrabold text-base text-white mt-0.5">{job.title}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  job.status === 'APPROVED'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : job.status === 'PENDING_TPO_REVIEW'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}>
                  {job.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400">CTC Package</div>
                  <div className="font-extrabold text-emerald-400 text-sm mt-0.5">₹{job.ctcLPA} LPA</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Min CGPA</div>
                  <div className="font-extrabold text-white text-sm mt-0.5 font-mono">
                    {job.eligibilityCriteria.minCgpa.toFixed(1)}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Openings</div>
                  <div className="font-extrabold text-indigo-400 text-sm mt-0.5 font-mono">{job.openings}</div>
                </div>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{job.location}</span>
                </div>
                <div>Eligible Branches: <strong className="text-white">{job.eligibilityCriteria.eligibleBranches.join(', ')}</strong></div>
                <div>Application Deadline: <span className="font-mono text-slate-300">{new Date(job.applicationDeadline).toLocaleDateString()}</span></div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">Total Applied: {job.totalApplied}</span>
                <button
                  onClick={() => onSelectScreen(12)}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <span>Candidate Pool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
