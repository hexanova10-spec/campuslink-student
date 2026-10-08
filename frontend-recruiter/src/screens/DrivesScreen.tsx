import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Users,
  Layers,
  Sparkles,
  ShieldCheck,
  Send,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useRecruiter } from '../context/RecruiterContext.tsx';
import { api } from '../services/api.ts';
import { InterviewRoundType } from '../types/recruiter.ts';

export const DrivesScreen: React.FC = () => {
  const { company, jobs, drives, refreshData } = useRecruiter();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [jobId, setJobId] = useState(jobs[0]?.id || '');
  const [driveTitle, setDriveTitle] = useState('');
  const [driveDate, setDriveDate] = useState('2026-11-15');
  const [timeSlot, setTimeSlot] = useState('09:00 AM - 05:00 PM');
  const [durationHours, setDurationHours] = useState(8);
  const [campusName, setCampusName] = useState('National Institute of Technology');
  const [interviewType, setInterviewType] = useState<'On-Campus' | 'Virtual' | 'Hybrid'>('Hybrid');
  const [targetCandidateCount, setTargetCandidateCount] = useState(25);
  const [rounds, setRounds] = useState('Aptitude, Coding, Technical, HR');
  const [specialRequirements, setSpecialRequirements] = useState('4 private breakout rooms, projector for pre-placement talk, high-speed Wi-Fi');

  const handleCreateDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const parsedRounds = rounds
        .split(',')
        .map((r) => r.trim())
        .filter((r): r is InterviewRoundType => ['Aptitude', 'Technical', 'Coding', 'Managerial', 'HR'].includes(r));

      await api.createDrive({
        jobId,
        driveTitle: driveTitle || `${company?.name} Campus Recruitment Drive 2026`,
        driveDate,
        timeSlot,
        durationHours: Number(durationHours),
        campusName,
        interviewType,
        targetCandidateCount: Number(targetCandidateCount),
        rounds: parsedRounds.length ? parsedRounds : ['Coding', 'Technical', 'HR'],
        specialRequirements
      });

      setSuccessMsg('Campus Recruitment Drive proposed and dispatched to College TPO desk.');
      setShowCreateModal(false);
      await refreshData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shadow-blue-600/30">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Campus Placement Drives
            </h1>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Coordinate recruitment drives, logistics, schedule slots, and TPO authorization requests.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm shadow-blue-600/20 transition-all cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Propose New Campus Drive</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center justify-between font-bold shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer font-bold text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* Drives Grid - Royal Blue + White + Transparency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {drives.map((drive) => {
          const associatedJob = jobs.find((j) => j.id === drive.jobId);
          return (
            <div
              key={drive.id}
              className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 shadow-xs space-y-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold font-mono">
                    {drive.interviewType} Drive
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">{drive.driveTitle}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Target Role: {associatedJob?.title || 'Engineering Requisition'}</span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border font-mono ${
                    drive.tpoApprovalStatus === 'APPROVED_BY_TPO'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : drive.tpoApprovalStatus === 'SUBMITTED_TO_TPO'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {drive.tpoApprovalStatus.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-blue-50/40 p-4 rounded-2xl border border-blue-100">
                <div className="space-y-1">
                  <div className="text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Drive Date</span>
                  </div>
                  <div className="text-slate-900 font-bold font-mono">{drive.driveDate}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Window</span>
                  </div>
                  <div className="text-slate-900 font-bold font-mono">{drive.timeSlot} ({drive.durationHours} hrs)</div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Campus Venue</span>
                  </div>
                  <div className="text-slate-900 font-bold">{drive.campusName}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-500 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>Target Cohort</span>
                  </div>
                  <div className="text-slate-900 font-bold">{drive.targetCandidateCount} Shortlisted Candidates</div>
                </div>
              </div>

              {/* Selection Rounds */}
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  Structured Rounds
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {drive.rounds.map((round, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-white border border-blue-100 rounded-lg text-xs font-mono font-medium text-slate-700 shadow-2xs"
                    >
                      Round {idx + 1}: {round}
                    </span>
                  ))}
                </div>
              </div>

              {drive.specialRequirements && (
                <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <strong className="text-slate-800">Campus Facilities Requested:</strong> {drive.specialRequirements}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: Create Campus Drive */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-blue-100 max-w-xl w-full p-6 sm:p-7 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-blue-600" />
                Propose Campus Recruitment Drive
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDrive} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Target Requisition</label>
                <select
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  className="w-full bg-white border border-blue-100 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} ({j.openings} Openings)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Drive Title</label>
                <input
                  type="text"
                  value={driveTitle}
                  onChange={(e) => setDriveTitle(e.target.value)}
                  placeholder="e.g. Apex 2026 Annual Campus Placement Sprint"
                  className="w-full bg-white border border-blue-100 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Campus Name</label>
                  <input
                    type="text"
                    value={campusName}
                    onChange={(e) => setCampusName(e.target.value)}
                    required
                    className="w-full bg-white border border-blue-100 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Drive Format</label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value as any)}
                    className="w-full bg-white border border-blue-100 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="Hybrid">Hybrid (Online coding + On-site interviews)</option>
                    <option value="On-Campus">On-Campus (In-Person)</option>
                    <option value="Virtual">Fully Virtual (Video Rounds)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Date</label>
                  <input
                    type="date"
                    value={driveDate}
                    onChange={(e) => setDriveDate(e.target.value)}
                    required
                    className="w-full bg-white border border-blue-100 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    required
                    className="w-full bg-white border border-blue-100 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Target Candidates</label>
                  <input
                    type="number"
                    value={targetCandidateCount}
                    onChange={(e) => setTargetCandidateCount(Number(e.target.value))}
                    className="w-full bg-white border border-blue-100 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Rounds (comma-separated)</label>
                <input
                  type="text"
                  value={rounds}
                  onChange={(e) => setRounds(e.target.value)}
                  className="w-full bg-white border border-blue-100 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Special Logistics / Lab Requirements</label>
                <textarea
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  rows={2}
                  className="w-full bg-white border border-blue-100 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                  <span>{isSubmitting ? 'Submitting...' : 'Dispatch to TPO'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
