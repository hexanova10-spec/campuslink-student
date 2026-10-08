import React from 'react';
import { BarChart3, TrendingUp, Award, Building, Globe } from 'lucide-react';
import { repo } from '../../services/storage';

export const GlobalAnalyticsScreen: React.FC = () => {
  const institutions = repo.getInstitutions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
          University-Wide Cross-Campus Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Comparative benchmarks across universities, regional placement velocity, and CTC distribution.
        </p>
      </div>

      {/* Comparative Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-white">Cross-Institutional Placement Benchmark</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
                <th className="py-2.5 px-3">Institution Name</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Active Pool</th>
                <th className="py-2.5 px-3">Placed</th>
                <th className="py-2.5 px-3">Average CTC</th>
                <th className="py-2.5 px-3">Peak CTC</th>
                <th className="py-2.5 px-3 text-right">Placement Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {institutions.map(inst => {
                const rate = Math.round((inst.totalPlaced / inst.activeStudents) * 100);
                return (
                  <tr key={inst.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-sans font-bold text-white">{inst.name}</td>
                    <td className="py-3 px-3 text-slate-300 font-sans">{inst.city}, {inst.state}</td>
                    <td className="py-3 px-3 text-slate-300">{inst.activeStudents}</td>
                    <td className="py-3 px-3 text-emerald-400">{inst.totalPlaced}</td>
                    <td className="py-3 px-3 text-white">₹{inst.averagePackageLPA} LPA</td>
                    <td className="py-3 px-3 text-purple-300 font-bold">₹{inst.highestPackageLPA} LPA</td>
                    <td className="py-3 px-3 text-right text-emerald-400 font-bold">{rate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
