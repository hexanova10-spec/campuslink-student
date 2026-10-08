import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Interview } from '../../types/student';
import {
  CalendarCheck2,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BotMessageSquare,
  Building,
  Bell,
  Sparkles
} from 'lucide-react';

export const InterviewScheduleScreen: React.FC = () => {
  const { setCurrentScreen } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInterviews = async () => {
    try {
      const res = await api.getInterviews();
      setInterviews(res);
    } catch (err) {
      console.error('Failed to load interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  if (loading) {
    return <div className="text-xs text-slate-500 dark:text-slate-400 p-8 text-center">Loading interview schedule...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Interview Schedule & Reminders</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Active campus interviews with 24h & 1h automatic countdown notifications.
          </p>
        </div>
        <button
          onClick={() => setCurrentScreen('mock-interview')}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-600/25 cursor-pointer"
        >
          <BotMessageSquare className="w-4 h-4 text-cyan-200" />
          <span>Warm Up with AI Mock Interview</span>
        </button>
      </div>

      <div className="space-y-4">
        {interviews.map((int) => (
          <div
            key={int.id}
            className="p-6 rounded-2xl bg-white/85 dark:bg-[#070e22]/75 backdrop-blur-xl border border-blue-200/80 dark:border-blue-900/50 hover:border-blue-400 dark:hover:border-blue-700 transition-all shadow-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">{int.company_name}</h2>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 uppercase">
                    {int.status}
                  </span>
                </div>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-300 mt-0.5">{int.role_title}</p>
                <div className="text-xs font-bold text-blue-700 dark:text-cyan-400 mt-1">{int.round_name}</div>
              </div>

              {/* Time Badges & Reminders */}
              <div className="flex flex-col items-start sm:items-end gap-1.5 flex-shrink-0">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white bg-blue-50/80 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-blue-200/80 dark:border-slate-800">
                  <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{int.interview_date} at {int.interview_time}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  {int.reminder_24h_sent && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                      ✓ 24h Alert Sent
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-semibold">
                    1h Alarm Active
                  </span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-[#040814]/70 border border-blue-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <span className="font-semibold text-slate-900 dark:text-slate-400 block text-[11px] uppercase tracking-wider">
                Recruiter Instructions & Equipment Checklist:
              </span>
              <p className="leading-relaxed">{int.instructions}</p>
            </div>

            {/* Join & Prep Bar */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 truncate">
                <Video className="w-4 h-4 text-blue-600 dark:text-slate-400 flex-shrink-0" />
                <span className="truncate">{int.venue_or_meeting_url}</span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setCurrentScreen('mock-interview')}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-blue-700 dark:text-slate-300 border border-blue-200/80 dark:border-slate-700 text-xs font-medium transition-colors cursor-pointer"
                >
                  Practice Interview Questions
                </button>
                <a
                  href={int.venue_or_meeting_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/25 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Join Meeting</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
