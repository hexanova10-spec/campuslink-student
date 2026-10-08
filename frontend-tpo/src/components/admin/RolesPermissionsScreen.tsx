import React from 'react';
import { Lock, Shield, Check, X } from 'lucide-react';

export const RolesPermissionsScreen: React.FC = () => {
  const permissions = [
    { name: 'View Own College Students', tpo: true, admin: true, recruiter: false },
    { name: 'View Other College Students', tpo: false, admin: true, recruiter: false },
    { name: 'Approve / Reject Job Postings', tpo: true, admin: true, recruiter: false },
    { name: 'Release Candidates to Recruiters (CandidateAccess)', tpo: true, admin: true, recruiter: false },
    { name: 'Browse Global Unreleased Students', tpo: false, admin: false, recruiter: false },
    { name: 'Modify System Row-Level Security Rules', tpo: false, admin: true, recruiter: false },
    { name: 'Run Cross-College Analytics Benchmark', tpo: false, admin: true, recruiter: false },
    { name: 'Verify Academic Marks & NOC Documents', tpo: true, admin: true, recruiter: false },
    { name: 'Configure Platform AI Guardrails', tpo: false, admin: true, recruiter: false }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
          Role-Based Access Control (RBAC) Matrix
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Permission matrix illustrating non-bypassable object-level security boundaries across roles.
        </p>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
              <th className="py-3 px-4">Platform Capability / Operation</th>
              <th className="py-3 px-4 text-center">College TPO</th>
              <th className="py-3 px-4 text-center">System Admin</th>
              <th className="py-3 px-4 text-center">Corporate Recruiter</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {permissions.map((p, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40 transition">
                <td className="py-3 px-4 font-semibold text-slate-200">{p.name}</td>
                <td className="py-3 px-4 text-center">
                  {p.tpo ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-rose-500 mx-auto" />
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {p.admin ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-rose-500 mx-auto" />
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {p.recruiter ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-rose-500 mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
