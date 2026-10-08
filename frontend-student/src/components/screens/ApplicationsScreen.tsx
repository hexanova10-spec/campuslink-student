import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Application } from '../../types/student';
import {
  Layers,
  CalendarCheck2,
  Trophy,
  Info,
  XCircle,
  FileText,
  Sparkles,
  X
} from 'lucide-react';

export const ApplicationsScreen: React.FC = () => {
  const { setCurrentScreen } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRejection, setActiveRejection] = useState<Application | null>(null);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const fetchApps = async () => {
    try {
      const res = await api.getApplications();
      setApps(res);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleWithdraw = async (id: string) => {
    if (!confirm('Are you sure you want to withdraw your application?')) return;
    setWithdrawingId(id);
    try {
      await api.withdrawApplication(id);
      setApps(apps.filter((a) => a.id !== id));
    } catch (err: any) {
      alert('Withdrawal error: ' + err.message);
    } finally {
      setWithdrawingId(null);
    }
  };

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'OFFERED':
      case 'ACCEPTED':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
      case 'INTERVIEW':
      case 'SELECTED':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30';
      case 'SHORTLISTED':
        return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30';
      case 'REJECTED':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30';
      case 'DECLINED':
        return 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600';
      default:
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30';
    }
  };

  if (loading) {
    return <div className="text-xs text-slate-500 dark:text-slate-400 p-8 text-center">Loading applications tracker...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">My Campus Applications Tracker</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Strictly partitioned: You are viewing only your private student applications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
            {apps.length} Active Records
          </span>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {apps.map((app) => (
          <div
            key={app.id}
            className="p-5 sm:p-6 rounded-2xl bg-white/85 dark:bg-[#070e22]/75 backdrop-blur-xl border border-blue-200/80 dark:border-blue-900/50 hover:border-blue-400 dark:hover:border-blue-700 transition-all shadow-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">{app.company_name}</h2>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${getStatusBadge(app.status)}`}>
                    {app.status}
                  </span>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-300 font-semibold mt-0.5">{app.role_title}</p>
                <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{app.ctc}</span>
                  <span>{app.location}</span>
                  <span>Applied: {new Date(app.applied_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {app.status === 'REJECTED' && (
                  <button
                    onClick={() => setActiveRejection(app)}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    <span>View Rejection Reason</span>
                  </button>
                )}

                {app.status === 'INTERVIEW' && (
                  <button
                    onClick={() => setCurrentScreen('interview-schedule')}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-colors cursor-pointer"
                  >
                    <CalendarCheck2 className="w-3.5 h-3.5" />
                    <span>View Interview Schedule</span>
                  </button>
                )}

                {app.status === 'OFFERED' && (
                  <button
                    onClick={() => setCurrentScreen('offers')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/25 transition-colors cursor-pointer"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>View Offer Letter</span>
                  </button>
                )}

                {app.allow_withdrawal && app.status === 'APPLIED' && (
                  <button
                    onClick={() => handleWithdraw(app.id)}
                    disabled={withdrawingId === app.id}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    {withdrawingId === app.id ? 'Withdrawing...' : 'Withdraw'}
                  </button>
                )}
              </div>
            </div>

            {/* Stage Progress Funnel & Timeline */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 font-bold">
                <span>Application Lifecycle</span>
                <span className={app.status === 'REJECTED' ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-blue-600 dark:text-blue-400 font-bold'}>
                  {app.status}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {['APPLIED', 'UNDER REVIEW', 'SHORTLISTED', 'INTERVIEW', 'OFFERED'].map((st, sIdx) => {
                  const stageIndex = ['APPLIED', 'UNDER REVIEW', 'SHORTLISTED', 'INTERVIEW', 'OFFERED'].indexOf(app.status);
                  const isPassed = stageIndex >= sIdx || app.status === 'ACCEPTED';
                  const isCurrent = app.status === st;

                  return (
                    <div
                      key={st}
                      className={`h-2 rounded-full transition-all ${
                        app.status === 'REJECTED'
                          ? sIdx === 0
                            ? 'bg-rose-500'
                            : 'bg-slate-200 dark:bg-slate-800'
                          : isPassed
                          ? isCurrent
                            ? 'bg-blue-600 shadow-md shadow-blue-500/50'
                            : 'bg-blue-500'
                          : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                      title={st}
                    />
                  );
                })}
              </div>

              {/* Rejection Reason in Timeline when status is REJECTED */}
              {app.status === 'REJECTED' && (
                <div className="mt-3 p-3.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 text-xs flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold text-rose-700 dark:text-rose-300">Rejection Reason: </span>
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {app.rejection_reason || 'Your application was not selected for this opportunity. No additional feedback was provided.'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Rejection Reason Modal */}
      {activeRejection && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white/95 dark:bg-[#0c142b]/95 border border-blue-200/90 dark:border-blue-900/60 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Rejection Reason</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{activeRejection.company_name} • {activeRejection.role_title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveRejection(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-[#040814]/70 border border-blue-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <p className="font-bold text-slate-900 dark:text-white mb-1.5">Official Student-Facing Remark:</p>
              <p className="font-medium text-slate-800 dark:text-slate-200 italic">
                "{activeRejection.rejection_reason || 'Your application was not selected for this opportunity. No additional feedback was provided.'}"
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveRejection(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-md shadow-blue-600/20 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
