import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { NotificationRecord, ScreenType } from '../../types/student';
import {
  Bell,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Award,
  Briefcase,
  Sparkles,
  ArrowRight,
  CheckCheck
} from 'lucide-react';

export const NotificationsScreen: React.FC = () => {
  const { setCurrentScreen } = useAuth();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const fetchNotifs = async () => {
    try {
      const res = await api.getNotifications();
      setNotifications(res);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id: string, route?: ScreenType) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
      if (route) {
        setCurrentScreen(route);
      }
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.is_read;
    return true;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'interview':
        return Calendar;
      case 'shortlist':
        return Award;
      case 'job_match':
        return Briefcase;
      case 'readiness':
        return Sparkles;
      default:
        return Bell;
    }
  };

  if (loading) {
    return <div className="text-xs text-slate-500 dark:text-slate-400 p-8 text-center">Loading notifications center...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Student Placement Notifications</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Real-time updates regarding interview schedules, shortlists, and document status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-blue-50/80 dark:bg-slate-900 border border-blue-200/80 dark:border-slate-800 p-1 shadow-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'unread'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-white'
              }`}
            >
              Unread
            </button>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="px-3 py-2 rounded-xl bg-white/90 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-blue-700 dark:text-slate-200 text-xs font-semibold border border-blue-200/80 dark:border-slate-700 flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((n) => {
          const Icon = getCategoryIcon(n.category);
          return (
            <div
              key={n.id}
              onClick={() => handleMarkRead(n.id, n.action_route)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md flex items-start gap-4 backdrop-blur-xl ${
                n.is_read
                  ? 'bg-white/70 dark:bg-[#070e22]/60 border-blue-100/90 dark:border-slate-800/80 hover:border-blue-300 dark:hover:border-slate-700'
                  : 'bg-white/95 dark:bg-[#091538]/90 border-blue-300 dark:border-blue-700/80 hover:border-blue-500 shadow-blue-500/5'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  n.is_read
                    ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-slate-400 border border-blue-100 dark:border-slate-700'
                    : 'bg-blue-600/10 dark:bg-blue-500/20 text-blue-700 dark:text-cyan-300 border border-blue-500/30 shadow-xs'
                }`}
              >
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`text-xs font-bold ${n.is_read ? 'text-slate-700 dark:text-slate-300' : 'text-blue-950 dark:text-white'}`}>
                    {n.title}
                  </h3>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex-shrink-0">
                    {new Date(n.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{n.message}</p>
              </div>

              {!n.is_read && (
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-cyan-400 flex-shrink-0 mt-2 shadow-xs shadow-blue-600 dark:shadow-cyan-400 animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
