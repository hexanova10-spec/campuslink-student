import React, { useState } from 'react';
import {
  CalendarClock,
  Plus,
  Clock,
  Video,
  User,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  ClipboardCheck,
  FileText
} from 'lucide-react';
import { useRecruiter } from '../context/RecruiterContext.tsx';
import { api } from '../services/api.ts';

export const InterviewScheduleScreen: React.FC = () => {
  const {
    company,
    interviews,
    applications,
    viewCandidate,
    openInterviewEval,
    refreshData
  } = useRecruiter();

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [applicationId, setApplicationId] = useState(applications[0]?.id || '');
  const [roundName, setRoundName] = useState('Technical Round 1 (System Design & Code)');
  const [roundNumber, setRoundNumber] = useState(1);
  const [scheduledTime, setScheduledTime] = useState('Tomorrow, 11:00 AM - 12:00 PM');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [interviewerName, setInterviewerName] = useState('Vikram Sen (VP Architecture)');
  const [mode, setMode] = useState<'Google Meet' | 'In-Person' | 'Zoom'>('Google Meet');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/campus-interview-apex');

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.scheduleInterview({
        applicationId,
        roundName,
        roundNumber: Number(roundNumber),
        scheduledTime,
        durationMinutes: Number(durationMinutes),
        interviewerName,
        mode,
        meetingLink
      });

      setSuccessMsg('Interview successfully booked. Candidate invitation and calendar invites dispatched.');
      setShowScheduleModal(false);
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
              <CalendarClock className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Interview Scheduling &amp; Slot Management
            </h1>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Coordinate panel rounds, Google Meet virtual rooms, evaluator assignments, and scorecards.
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm shadow-blue-600/20 transition-all cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Schedule New Interview Round</span>
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

      {/* Stats Header Bar - Royal Blue + White + Transparency */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-5 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Scheduled</div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">{interviews.length}</div>
          <div className="text-[10px] text-slate-400">Across {company?.name} roles</div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-5 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Upcoming Slots</div>
          <div className="text-2xl font-black text-blue-700 font-mono mt-1">
            {interviews.filter((i) => i.status === 'SCHEDULED').length}
          </div>
          <div className="text-[10px] text-slate-400">Awaiting evaluation</div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-5 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Completed &amp; Scored</div>
          <div className="text-2xl font-black text-emerald-700 font-mono mt-1">
            {interviews.filter((i) => i.status === 'COMPLETED').length}
          </div>
          <div className="text-[10px] text-slate-400">Evaluations archived</div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-5 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Data Boundary</div>
          <div className="text-xs font-bold text-emerald-700 mt-2 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Zero-Leak Enforced
          </div>
          <div className="text-[10px] text-slate-400">No competitor notes visible</div>
        </div>
      </div>

      {/* Interviews List */}
      <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-4 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Interview Rosters &amp; Active Slots
          </h3>
          <span className="text-xs text-slate-500 font-semibold">{interviews.length} Scheduled Sessions</span>
        </div>

        <div className="divide-y divide-blue-50">
          {interviews.map((intv) => (
            <div
              key={intv.id}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-blue-50/30 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-mono font-semibold">
                    Round {intv.roundNumber}
                  </span>
                  <button
                    onClick={() => viewCandidate(intv.studentId)}
                    className="font-bold text-slate-900 hover:text-blue-700 transition-colors cursor-pointer text-left text-sm"
                  >
                    {intv.studentName}
                  </button>
                  <span className="text-slate-300 text-xs">•</span>
                  <span className="text-xs text-slate-500 font-medium">{intv.jobTitle}</span>
                </div>

                <div className="text-xs text-slate-700 font-medium">{intv.roundName}</div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 font-mono">
                  <span className="flex items-center gap-1.5 font-sans">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    {intv.scheduledTime} ({intv.durationMinutes} mins)
                  </span>
                  <span className="flex items-center gap-1.5 font-sans">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    Interviewer: {intv.interviewerName}
                  </span>
                  {intv.meetingLink && (
                    <a
                      href={intv.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-[11px] font-sans font-semibold underline"
                    >
                      <Video className="w-3.5 h-3.5" />
                      Virtual Meeting Link
                    </a>
                  )}
                </div>

                {intv.status === 'COMPLETED' && (
                  <div className="pt-2 flex items-center gap-3 text-xs">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold font-mono">
                      Score: {intv.score} / 100
                    </span>
                    <span className="text-slate-700 font-semibold">Decision: {intv.decision}</span>
                    {intv.notes && <span className="text-slate-500 italic text-[11px] truncate max-w-md">&quot;{intv.notes}&quot;</span>}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-start md:self-center">
                <button
                  onClick={() => openInterviewEval(intv.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs ${
                    intv.status === 'COMPLETED'
                      ? 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                  }`}
                >
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  <span>{intv.status === 'COMPLETED' ? 'View Scorecard' : 'Evaluate Round'}</span>
                </button>
                <button
                  onClick={() => viewCandidate(intv.studentId)}
                  className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-blue-100 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Dossier</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Schedule Interview */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-blue-100 max-w-md w-full p-6 sm:p-7 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-blue-600" />
                Schedule Interview Slot
              </h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSchedule} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Select Candidate</label>
                <select
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  className="w-full bg-white border border-blue-100 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                >
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.student?.fullName || 'Candidate'} ({app.student?.collegeName || 'Campus'}) — {app.status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Round Title</label>
                <input
                  type="text"
                  value={roundName}
                  onChange={(e) => setRoundName(e.target.value)}
                  required
                  className="w-full bg-white border border-blue-100 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Round Number</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={roundNumber}
                    onChange={(e) => setRoundNumber(Number(e.target.value))}
                    required
                    className="w-full bg-white border border-blue-100 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    required
                    className="w-full bg-white border border-blue-100 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Date &amp; Time Slot</label>
                <input
                  type="text"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  required
                  placeholder="e.g. Oct 14, 2026 at 2:00 PM IST"
                  className="w-full bg-white border border-blue-100 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Assigned Evaluator</label>
                <input
                  type="text"
                  value={interviewerName}
                  onChange={(e) => setInterviewerName(e.target.value)}
                  required
                  className="w-full bg-white border border-blue-100 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Meeting Link or Campus Room</label>
                <input
                  type="text"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full bg-white border border-blue-100 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  {isSubmitting ? 'Scheduling...' : 'Confirm Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
