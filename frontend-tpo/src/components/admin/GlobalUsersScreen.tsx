import React from 'react';
import { Users, Shield, CheckCircle, Clock } from 'lucide-react';
import { repo } from '../../services/storage';

export const GlobalUsersScreen: React.FC = () => {
  const users = [
    {
      id: 'usr-1',
      name: 'Dr. Rajesh Nair',
      email: 'tpo.apex@campuslink.edu',
      role: 'COLLEGE_TPO',
      institution: 'Apex Institute of Technology',
      status: 'ACTIVE',
      lastLogin: '2026-10-07T09:12:00Z'
    },
    {
      id: 'usr-2',
      name: 'Dr. Sunita Kulkarni',
      email: 'tpo.metro@campuslink.edu',
      role: 'COLLEGE_TPO',
      institution: 'Metro University of Engineering',
      status: 'ACTIVE',
      lastLogin: '2026-10-06T16:45:00Z'
    },
    {
      id: 'usr-3',
      name: 'Samantha Vance',
      email: 'admin.global@campuslink.edu',
      role: 'SYSTEM_ADMIN',
      institution: 'Global System Scope',
      status: 'ACTIVE',
      lastLogin: '2026-10-07T09:30:00Z'
    },
    {
      id: 'usr-4',
      name: 'Prof. Vikram Saxena',
      email: 'tpo.horizon@campuslink.edu',
      role: 'COLLEGE_TPO',
      institution: 'Horizon Technical Institute',
      status: 'ACTIVE',
      lastLogin: '2026-10-05T11:20:00Z'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
          Global RBAC User Directory
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage system administrators, college placement directors, and campus coordinators across institutions.
        </p>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
              <th className="py-3 px-4">User Name</th>
              <th className="py-3 px-3">Email Address</th>
              <th className="py-3 px-3">System Role</th>
              <th className="py-3 px-3">Institutional Binding</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4 text-right">Last Login</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-800/40 transition">
                <td className="py-3 px-4 font-semibold text-white">{u.name}</td>
                <td className="py-3 px-3 text-slate-300 font-mono">{u.email}</td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    u.role === 'SYSTEM_ADMIN'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-300">{u.institution}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    {u.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-slate-400 font-mono text-[11px]">
                  {new Date(u.lastLogin).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
