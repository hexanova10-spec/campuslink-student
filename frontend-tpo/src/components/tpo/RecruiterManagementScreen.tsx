import React from 'react';
import { Briefcase, CheckCircle, Clock, ShieldCheck, Mail, Phone, Building } from 'lucide-react';
import { repo } from '../../services/storage';

export const RecruiterManagementScreen: React.FC = () => {
  const recruiters = repo.getRecruiters();
  const companies = repo.getCompanies();

  const handleApprove = (id: string) => {
    repo.approveRecruiter(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
          Recruiter Management & Approvals
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review, authenticate, and manage corporate recruiter accounts authorized to conduct drives on campus.
        </p>
      </div>

      {/* Recruiter Roster */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">Recruiter Name & Title</th>
                <th className="py-3 px-3">Company</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Approval Status</th>
                <th className="py-3 px-3">Last Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recruiters.map(rec => {
                const comp = companies.find(c => c.id === rec.companyId);
                return (
                  <tr key={rec.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{rec.fullName}</div>
                      <div className="text-[11px] text-slate-400">{rec.designation}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-indigo-300">{comp?.name || 'Enterprise'}</div>
                      <div className="text-[10px] text-slate-500">{comp?.industry}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      <div>{rec.email}</div>
                      <div className="text-[11px] text-slate-500">{rec.phone}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        rec.status === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {new Date(rec.lastActive).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {rec.status === 'PENDING_APPROVAL' ? (
                        <button
                          onClick={() => handleApprove(rec.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                        >
                          Approve Recruiter
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-medium">Verified Active</span>
                      )}
                    </td>
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
