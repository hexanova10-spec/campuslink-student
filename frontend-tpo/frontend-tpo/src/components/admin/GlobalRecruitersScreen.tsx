import React from 'react';
import { Briefcase, Building, CheckCircle, ExternalLink } from 'lucide-react';
import { repo } from '../../services/storage';

export const GlobalRecruitersScreen: React.FC = () => {
  const companies = repo.getCompanies();
  const recruiters = repo.getRecruiters();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
          Global Enterprise Recruiter Directory
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Master registry of verified corporate employers authorized across all participating universities.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map(c => (
          <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base text-white">{c.name}</h3>
                <div className="text-xs text-slate-400">{c.industry}</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                {c.tier}
              </span>
            </div>

            <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800">
              <div>HQ: <span className="text-slate-200">{c.hqLocation}</span></div>
              <div>Connected Colleges: <strong className="text-indigo-400">{c.collegePartnerships.length} Institutions</strong></div>
              <div>Global Hired: <strong className="text-emerald-400">{c.totalHiredOverall} Candidates</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
