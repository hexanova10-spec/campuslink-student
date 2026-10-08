import React, { useState } from 'react';
import { Bell, Send, Users, CheckCircle2, MessageSquare, Mail, Sparkles, Filter } from 'lucide-react';
import { repo } from '../../services/storage';

interface NotificationCenterScreenProps {
  onSelectScreen: (screenId: number) => void;
}

export const NotificationCenterScreen: React.FC<NotificationCenterScreenProps> = ({ onSelectScreen }) => {
  const notifications = repo.getNotifications();
  const students = repo.getStudents();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState<any>('ALL_STUDENTS');
  const [targetBranch, setTargetBranch] = useState('CSE');
  const [channels, setChannels] = useState<('EMAIL' | 'SMS' | 'PORTAL')[]>(['EMAIL', 'PORTAL']);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    repo.broadcastNotification({
      collegeId: repo.getEffectiveInstitution().id,
      title,
      content,
      type: 'DRIVE_ANNOUNCEMENT',
      targetAudience,
      targetBranch: targetAudience === 'SPECIFIC_BRANCH' ? targetBranch : undefined,
      recipientCount: targetAudience === 'ALL_STUDENTS' ? students.length : 140,
      channels
    });

    setTitle('');
    setContent('');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
            Institutional Notification Broadcast Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch multi-channel alerts (Portal, Email, SMS) targeted by branch, eligibility cohort, or individual student.
          </p>
        </div>

        <button
          onClick={() => onSelectScreen(22)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 text-xs font-semibold transition"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>AI Communication Drafter</span>
        </button>
      </div>

      {sentSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Broadcast successfully transmitted across all selected delivery channels!</span>
        </div>
      )}

      {/* Broadcast Composer */}
      <form onSubmit={handleSendBroadcast} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Send className="w-4 h-4 text-indigo-400" />
          <span>Compose Placement Broadcast</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
              Broadcast Title / Subject Line:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mandatory Briefing for Google SDE Drive Candidates"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
              Target Recipient Audience:
            </label>
            <select
              value={targetAudience}
              onChange={e => setTargetAudience(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL_STUDENTS">All Registered Students</option>
              <option value="SPECIFIC_BRANCH">Specific Engineering Branch</option>
              <option value="ELIGIBLE_CANDIDATES">Eligible Drive Candidates Only</option>
              <option value="SHORTLISTED">Shortlisted Round Candidates</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
            Announcement Message Body:
          </label>
          <textarea
            rows={4}
            required
            placeholder="Type official placement instructions, venue guidelines, reporting times..."
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Delivery Channels:</span>
            <span className="font-bold text-slate-200">Portal Notification • Intranet Email • SMS</span>
          </div>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Transmit Announcement</span>
          </button>
        </div>
      </form>

      {/* Broadcast History */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
          Broadcast Dispatch Log
        </h3>
        <div className="space-y-2.5">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2 text-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-white">{notif.title}</h4>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Target: <strong className="text-indigo-400">{notif.targetAudience.replace(/_/g, ' ')}</strong> • Delivered: <strong className="text-emerald-400 font-mono">{notif.deliveryRate}%</strong>
                  </div>
                </div>
                <span className="text-slate-500 font-mono text-[11px]">
                  {new Date(notif.sentAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 font-sans">
                {notif.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
