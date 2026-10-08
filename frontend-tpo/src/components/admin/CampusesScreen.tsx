import React from 'react';
import { Network, Building, MapPin, ChevronRight } from 'lucide-react';
import { repo } from '../../services/storage';

export const CampusesScreen: React.FC = () => {
  const institutions = repo.getInstitutions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
          Campuses, Departments & Branch Hierarchy
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          University physical campus branches, academic faculties, and degree accreditation structures.
        </p>
      </div>

      {/* Campuses Tree */}
      <div className="space-y-4">
        {institutions.map(inst => (
          <div key={inst.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Building className="w-5 h-5 text-indigo-400" />
                <h3 className="font-extrabold text-base text-white">{inst.name}</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">{inst.campuses.length} Campuses</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {inst.campuses.map((camp, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="font-bold text-slate-200 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{camp}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Departments: {inst.departments.slice(0, 3).join(', ')}...
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
