import React from 'react';
import {
  Bell,
  CheckCircle2,
  Calendar,
  Award,
  AlertCircle,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useRecruiter } from '../context/RecruiterContext.tsx';
import { api } from '../services/api.ts';

export const NotificationsScreen: React.FC = () => {
  const { notifications, company, refreshData, setActiveScreen } = useRecruiter();

  const handleMarkAsRead = async (id: string) => {
    await api.markNotificationRead(id);
    await refreshData();
  };

  return (
    <div className="w-full space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shadow-blue-600/30">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Recruiter Notification Hub
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {notifications.filter((n) => !n.read).length} Unread
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time recruitment pipeline alerts, College TPO drive confirmations, and candidate milestones for {company?.name}.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 sm:p-5 rounded-3xl border transition-all flex items-start justify-between gap-4 shadow-xs ${
              notif.read
                ? 'bg-white/80 backdrop-blur-md border-blue-100 text-slate-600'
                : 'bg-white/95 backdrop-blur-xl border-blue-200 text-slate-900 shadow-sm shadow-blue-900/5'
            }`}
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div
                className={`p-2.5 rounded-2xl shrink-0 mt-0.5 border ${
                  notif.type === 'TPO_APPROVAL'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : notif.type === 'INTERVIEW_ALERT'
                    ? 'bg-blue-50 text-blue-600 border-blue-200'
                    : notif.type === 'OFFER_STATUS'
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                    : notif.type === 'SECURITY_ALERT'
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-blue-50 text-blue-600 border-blue-200'
                }`}
              >
                {notif.type === 'TPO_APPROVAL' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : notif.type === 'INTERVIEW_ALERT' ? (
                  <Clock className="w-5 h-5" />
                ) : notif.type === 'OFFER_STATUS' ? (
                  <Award className="w-5 h-5" />
                ) : notif.type === 'SECURITY_ALERT' ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {notif.title}
                  </h4>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {notif.message}
                </p>
                <span className="text-[10px] text-slate-400 font-mono block">
                  {notif.timestamp}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!notif.read && (
                <button
                  onClick={() => handleMarkAsRead(notif.id)}
                  className="px-3 py-1.5 text-xs font-bold bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-xl transition-colors cursor-pointer shadow-2xs"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
