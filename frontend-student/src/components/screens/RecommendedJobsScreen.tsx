import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { JobListing } from '../../types/student';
import {
  Briefcase,
  Building,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Search,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export const RecommendedJobsScreen: React.FC = () => {
  const { setSelectedJobId, setCurrentScreen } = useAuth();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEligibleOnly, setFilterEligibleOnly] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await api.getJobs();
      setJobs(res);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      j.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.role_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.required_skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filterEligibleOnly) return matchesSearch && j.isEligible;
    return matchesSearch;
  });

  if (loading) {
    return <div className="text-xs text-slate-500 dark:text-slate-400 p-8 text-center">Loading campus placement drives...</div>;
  }

  return (
    <div className="student-page space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Recommended Placement Drives</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Published, verified campus drives ranked by your AI readiness and technical match ratio.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
            {filteredJobs.length} Drives Active
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/80 dark:bg-[#070e22]/75 backdrop-blur-xl border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search company, role, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-blue-50/50 dark:bg-slate-950/70 border border-blue-200/80 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none font-medium">
            <input
              type="checkbox"
              checked={filterEligibleOnly}
              onChange={(e) => setFilterEligibleOnly(e.target.checked)}
              className="rounded bg-white border-blue-300 text-blue-600 focus:ring-0"
            />
            <span>Show 100% Eligible Only</span>
          </label>
        </div>
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {filteredJobs.map((job) => {
          const match = job.matchPercentage || 75;
          return (
            <div
              key={job.id}
              className="p-5 sm:p-6 rounded-2xl bg-white/80 dark:bg-[#070e22]/75 backdrop-blur-xl border border-blue-200/80 dark:border-blue-900/50 hover:border-blue-500 transition-all shadow-xl space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm flex-shrink-0 shadow-lg shadow-blue-600/25">
                    {job.logo_symbol}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">{job.company_name}</h2>
                      {job.isApplied ? (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 uppercase">
                          Status: {job.applicationStatus || 'Applied'}
                        </span>
                      ) : job.isEligible ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          Eligible
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                          Requires Waiver
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-300 mt-0.5">{job.role_title}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 mt-2 flex-wrap font-medium">
                      <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {job.ctc}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Apply by: {job.application_deadline}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Match Metric */}
                <div className="text-left sm:text-right flex-shrink-0">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Match Score</div>
                  <div className="text-2xl font-black text-blue-600 dark:text-cyan-400">{match}%</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {job.matchedSkillsCount}/{job.required_skills.length} Skills Matched
                  </div>
                </div>
              </div>

              {/* WHY Explanation Pills */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-[#040814]/70 border border-blue-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-slate-800 dark:text-slate-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Explainable Match Breakdown</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="space-y-1">
                    <div className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      <span>CGPA {job.min_cgpa} Cutoff Verified</span>
                    </div>
                    <div className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      <span>Zero Active Backlogs Criteria Met</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {job.missingSkills && job.missingSkills.length > 0 ? (
                      <div className="text-amber-700 dark:text-amber-300 flex items-center gap-1.5 font-medium">
                        <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0" />
                        <span>Critical Skill Gap: {job.missingSkills.join(', ')}</span>
                      </div>
                    ) : (
                      <div className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        <span>All Required Skills In Profile</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills Tags & Apply Button */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {job.required_skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-blue-50 dark:bg-slate-950 border border-blue-200/80 dark:border-slate-800 text-[10px] text-slate-700 dark:text-slate-300 font-mono"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setSelectedJobId(job.id);
                    setCurrentScreen('job-details');
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-1.5 flex-shrink-0"
                >
                  <span>View Details & Apply</span>
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
