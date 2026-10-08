import React from 'react';
import { Building, Award, ExternalLink, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { repo } from '../../services/storage';

export const CompaniesScreen: React.FC = () => {
  const companies = repo.getCompanies();
  const jobs = repo.getJobs();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
          Corporate Partner Directory
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Registered corporate recruiters, tiering policies, and historical hiring statistics.
        </p>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map(comp => {
          const compJobs = jobs.filter(j => j.companyId === comp.id);
          return (
            <div
              key={comp.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-base text-white">{comp.name}</h3>
                  <div className="text-xs text-slate-400">{comp.industry}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  comp.tier === 'TIER_1_SUPER_DREAM'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    : comp.tier === 'TIER_2_DREAM'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                    : comp.tier === 'TIER_CORE'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {comp.tier.replace('TIER_', '').replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Average CTC</div>
                  <div className="font-extrabold text-white text-sm mt-0.5">₹{comp.averagePackageLPA} LPA</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Max CTC</div>
                  <div className="font-extrabold text-emerald-400 text-sm mt-0.5">₹{comp.highestPackageLPA} LPA</div>
                </div>
              </div>

              <div className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span>Minimum CGPA Preference:</span>
                  <span className="font-bold text-slate-200 font-mono">{comp.minCgpaPreference.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Batch Hires:</span>
                  <span className="font-bold text-white font-mono">{comp.totalHiredCurrentBatch} students</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Campus Openings:</span>
                  <span className="font-bold text-indigo-400 font-mono">{compJobs.length} roles</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Partner Since {comp.partnerSince}</span>
                <a
                  href={comp.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Careers</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
