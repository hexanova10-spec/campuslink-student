import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Award, Users, Briefcase } from 'lucide-react';
import { repo } from '../../services/storage';

export const PlacementAnalyticsScreen: React.FC = () => {
  const institution = repo.getEffectiveInstitution();
  const students = repo.getStudents();
  const offers = repo.getOffers();
  const jobs = repo.getJobs();

  const ctcValues = offers.map(o => o.ctcLPA).sort((a, b) => a - b);
  const avgCtc = ctcValues.length > 0 ? (ctcValues.reduce((a, b) => a + b, 0) / ctcValues.length).toFixed(1) : '12.4';
  const medianCtc = ctcValues.length > 0 ? ctcValues[Math.floor(ctcValues.length / 2)].toFixed(1) : '12.0';
  const highestCtc = ctcValues.length > 0 ? Math.max(...ctcValues).toFixed(1) : '54.0';
  const lowestCtc = ctcValues.length > 0 ? Math.min(...ctcValues).toFixed(1) : '7.2';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
          Institutional Placement Analytics & Benchmarks
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Detailed salary metrics, branch-level conversion funnels, and recruiter talent acquisition indices for {institution.name}.
        </p>
      </div>

      {/* Salary Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-[10px] font-bold uppercase text-slate-400">Average CTC</div>
          <div className="text-2xl font-black text-white mt-1">₹{avgCtc} LPA</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">+14% vs Previous Year</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-[10px] font-bold uppercase text-slate-400">Median CTC</div>
          <div className="text-2xl font-black text-indigo-300 mt-1">₹{medianCtc} LPA</div>
          <div className="text-[10px] text-slate-500 mt-0.5">50th Percentile</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-[10px] font-bold uppercase text-slate-400">Highest Verified CTC</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">₹{highestCtc} LPA</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Google SDE Super Dream</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-[10px] font-bold uppercase text-slate-400">Base CTC Threshold</div>
          <div className="text-2xl font-black text-slate-300 mt-1">₹{lowestCtc} LPA</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Policy Compliant</div>
        </div>
      </div>

      {/* Branch Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <h3 className="font-bold text-sm text-white">Full Department Placement Funnel (Registered → Offered → Placed)</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
                <th className="py-2.5 px-3">Branch</th>
                <th className="py-2.5 px-3">Registered</th>
                <th className="py-2.5 px-3">Eligible</th>
                <th className="py-2.5 px-3">Interviewed</th>
                <th className="py-2.5 px-3">Offered</th>
                <th className="py-2.5 px-3">Placed</th>
                <th className="py-2.5 px-3 text-right">Conversion %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {[
                { branch: 'CSE', reg: 240, elig: 218, intv: 185, off: 98, pl: 92, conv: '84.4%' },
                { branch: 'IT', reg: 180, elig: 165, intv: 140, off: 72, pl: 68, conv: '81.9%' },
                { branch: 'ECE', reg: 190, elig: 154, intv: 110, off: 54, pl: 48, conv: '70.5%' },
                { branch: 'MECH', reg: 120, elig: 98, intv: 65, off: 32, pl: 28, conv: '64.0%' },
                { branch: 'EEE', reg: 110, elig: 88, intv: 52, off: 24, pl: 21, conv: '60.0%' }
              ].map(b => (
                <tr key={b.branch} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-sans font-bold text-white">{b.branch}</td>
                  <td className="py-2.5 px-3 text-slate-300">{b.reg}</td>
                  <td className="py-2.5 px-3 text-slate-300">{b.elig}</td>
                  <td className="py-2.5 px-3 text-slate-300">{b.intv}</td>
                  <td className="py-2.5 px-3 text-teal-400">{b.off}</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">{b.pl}</td>
                  <td className="py-2.5 px-3 text-right text-indigo-300 font-bold">{b.conv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
