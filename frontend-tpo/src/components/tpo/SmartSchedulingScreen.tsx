import React from 'react';
import { CalendarClock, MapPin, Users, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';
import { repo } from '../../services/storage';

interface SmartSchedulingScreenProps {
  onSelectScreen: (screenId: number) => void;
}

export const SmartSchedulingScreen: React.FC<SmartSchedulingScreenProps> = ({ onSelectScreen }) => {
  const drives = repo.getDrives();
  const venues = repo.getVenues();
  const conflicts = repo.getConflicts().filter(c => c.status === 'UNRESOLVED');

  const timeSlots = [
    '09:00 - 10:30',
    '10:30 - 12:00',
    '12:00 - 13:30',
    '13:30 - 15:00',
    '15:00 - 16:30',
    '16:30 - 18:00'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
            Smart Scheduling Matrix & Venue Grid
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-track schedule calendar across campus auditoriums, computer proctoring labs, and interview cabins.
          </p>
        </div>

        <button
          onClick={() => onSelectScreen(17)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition"
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Inspect Conflicts ({conflicts.length})</span>
        </button>
      </div>

      {/* Visual Venue x Time Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Campus Venue Time-Slot Matrix (Scheduled Date: 2026-10-18)
          </span>
          <span className="text-xs text-slate-500 font-mono">Multi-Company Shared Facilities</span>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[700px] space-y-3">
            {venues.map(venue => (
              <div key={venue.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    <span className="font-bold text-xs text-white">{venue.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      Capacity: {venue.capacity}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">Available Hardware OK</span>
                </div>

                {/* Slots */}
                <div className="grid grid-cols-6 gap-2 text-[10px]">
                  {timeSlots.map((slot, idx) => {
                    const isCollisionVenue = venue.name.includes('Auditorium') && (idx === 1 || idx === 2);
                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg border text-center transition ${
                          isCollisionVenue
                            ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="font-mono text-[9px] text-slate-500">{slot}</div>
                        <div className="font-bold mt-1">
                          {isCollisionVenue ? 'COLLISION' : 'Booked / Free'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
