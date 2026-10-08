import React from 'react';
import { ClipboardList, CheckCircle2, XCircle, Clock, AlertCircle, UserCheck } from 'lucide-react';
import { repo } from '../../services/storage';

export const InterviewsScreen: React.FC = () => {
  const interviews = repo.getInterviews();
  const students = repo.getStudents();

  const handleUpdateAttendance = (id: string, att: 'PRESENT' | 'NO_SHOW', res?: 'CLEARED' | 'REJECTED') => {
    repo.updateInterviewAttendance(id, att, res);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
          Live Interview Round Operations & Attendance Check-in
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor scheduled candidate interview slots, record attendance check-ins, flag no-shows, and log panelist feedback.
        </p>
      </div>

      {/* Interviews Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
              <th className="py-3 px-4">Candidate & Branch</th>
              <th className="py-3 px-3">Round & Panelist</th>
              <th className="py-3 px-3">Slot Time & Cabin</th>
              <th className="py-3 px-3">Attendance Check-in</th>
              <th className="py-3 px-3">Round Result</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {interviews.map(intv => {
              const stu = students.find(s => s.id === intv.studentId);
              return (
                <tr key={intv.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200">{stu?.fullName || 'Candidate'}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{stu?.rollNumber} • {stu?.branch}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-indigo-300">R{intv.roundNumber}: {intv.roundName}</div>
                    <div className="text-[10px] text-slate-500">Panel: {intv.panelistName}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-mono">
                    <div>{new Date(intv.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="text-[10px] text-slate-500">{intv.venueOrRoom}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      intv.attendanceStatus === 'PRESENT'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : intv.attendanceStatus === 'NO_SHOW'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {intv.attendanceStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      intv.resultStatus === 'CLEARED'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : intv.resultStatus === 'REJECTED'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {intv.resultStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleUpdateAttendance(intv.id, 'PRESENT', 'CLEARED')}
                        className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30"
                        title="Mark Present & Cleared"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleUpdateAttendance(intv.id, 'NO_SHOW', 'REJECTED')}
                        className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30"
                        title="Mark No Show"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
