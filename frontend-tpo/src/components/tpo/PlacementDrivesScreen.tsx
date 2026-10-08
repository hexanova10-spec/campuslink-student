import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { repo } from '../../services/storage';
import { PlacementDrive } from '../../types';

interface PlacementDrivesScreenProps {
  onSelectScreen: (screenId: number) => void;
}

export const PlacementDrivesScreen: React.FC<PlacementDrivesScreenProps> = ({ onSelectScreen }) => {
  const drives = repo.getDrives();
  const companies = repo.getCompanies();
  const venues = repo.getVenues();
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const filtered = selectedFilter === 'ALL' ? drives : drives.filter(d => d.status === selectedFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
            Placement Drive Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end drive lifecycle, multi-round assessment tracking, capacity allocation, and panelist logistics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onSelectScreen(16)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Scheduling Grid</span>
          </button>
          <button
            onClick={() => onSelectScreen(17)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Conflicts Check</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['ALL', 'SCHEDULED', 'LIVE', 'COMPLETED', 'PENDING_APPROVAL', 'DRAFT'].map(status => (
          <button
            key={status}
            onClick={() => setSelectedFilter(status)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 ${
              selectedFilter === status
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {status.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Drives Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map(drive => {
          const comp = companies.find(c => c.id === drive.companyId);
          return (
            <div
              key={drive.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-slate-700 transition"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
                      {comp?.name || 'Recruiter'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {drive.campusId}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-0.5">{drive.driveName}</h3>
                  <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1.5 text-slate-300 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {drive.date} ({drive.startTime} - {drive.endTime})
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {drive.venue}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    drive.status === 'SCHEDULED'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : drive.status === 'LIVE'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse'
                      : drive.status === 'COMPLETED'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {drive.status}
                  </span>
                </div>
              </div>

              {/* Assessment Rounds Timeline */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Drive Assessment Stages ({drive.rounds.length} Rounds):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {drive.rounds.map(round => (
                    <div
                      key={round.roundNumber}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1"
                    >
                      <div className="font-bold text-slate-200">
                        R{round.roundNumber}: {round.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {round.scheduledTime} ({round.durationMins} mins)
                      </div>
                      <div className="text-[10px] text-indigo-400 truncate">{round.venueOrLink}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drive Logistics & Conversion Numbers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2 border-t border-slate-800/80 text-center">
                <div className="p-2 rounded-xl bg-slate-950/50">
                  <div className="text-[10px] text-slate-500">Registered Pool</div>
                  <div className="font-extrabold text-white mt-0.5">{drive.registeredCandidatesCount}</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/50">
                  <div className="text-[10px] text-slate-500">Shortlisted</div>
                  <div className="font-extrabold text-teal-400 mt-0.5">{drive.shortlistedCandidatesCount}</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/50">
                  <div className="text-[10px] text-slate-500">Offers Issued</div>
                  <div className="font-extrabold text-pink-400 mt-0.5">{drive.offersMadeCount}</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/50">
                  <div className="text-[10px] text-slate-500">Lab Capacity</div>
                  <div className="font-extrabold text-indigo-400 mt-0.5">{drive.infrastructureCapacity} Workstations</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
