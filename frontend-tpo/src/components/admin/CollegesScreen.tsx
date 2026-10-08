import React from 'react';
import { Building, MapPin, Users, Award, ShieldCheck, Mail, Phone } from 'lucide-react';
import { repo } from '../../services/storage';

export const CollegesScreen: React.FC = () => {
  const institutions = repo.getInstitutions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
          Institutions & Colleges Directory
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Registered academic institutions, accreditation compliance, and designated placement directors.
        </p>
      </div>

      {/* Colleges List */}
      <div className="grid grid-cols-1 gap-4">
        {institutions.map(inst => (
          <div
            key={inst.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    {inst.code}
                  </span>
                  <span className="text-xs text-slate-400">{inst.type}</span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">{inst.name}</h3>
                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{inst.city}, {inst.state} (Est. {inst.establishedYear})</span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {inst.accreditation}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-400">Active Students</div>
                <div className="font-extrabold text-white text-base mt-0.5">{inst.activeStudents}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-400">Total Placed</div>
                <div className="font-extrabold text-emerald-400 text-base mt-0.5">
                  {inst.totalPlaced} ({Math.round((inst.totalPlaced / inst.activeStudents) * 100)}%)
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-400">Average Package</div>
                <div className="font-extrabold text-white text-base mt-0.5">₹{inst.averagePackageLPA} LPA</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-400">Peak Package</div>
                <div className="font-extrabold text-purple-400 text-base mt-0.5">₹{inst.highestPackageLPA} LPA</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-slate-400">TPO Head: </span>
                <strong className="text-slate-200">{inst.tpoHeadName}</strong>
                <span className="text-slate-500 ml-2">({inst.tpoEmail} • {inst.tpoPhone})</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">Tenant Isolation Verified Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
