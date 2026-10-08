import React, { useState } from 'react';
import { Sparkles, Send, CheckCircle2, Copy, FileText, Briefcase } from 'lucide-react';
import { repo } from '../../services/storage';
import { generateCommunicationDraft } from '../../services/geminiService';

export const AiCommunicationScreen: React.FC = () => {
  const jobs = repo.getJobs();
  const [commType, setCommType] = useState<any>('DRIVE_ANNOUNCEMENT');
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftSubject, setDraftSubject] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    const draft = await generateCommunicationDraft(commType, {
      companyName: 'Corporate Partner',
      jobTitle: selectedJob?.title,
      date: selectedJob?.driveDate || 'Upcoming',
      venue: 'Campus Main Auditorium'
    });
    setDraftSubject(draft.subject);
    setDraftBody(draft.body);
    setIsGenerating(false);
  };

  const handleSendBroadcast = () => {
    if (!draftSubject || !draftBody) return;
    repo.broadcastNotification({
      collegeId: repo.getEffectiveInstitution().id,
      title: draftSubject,
      content: draftBody,
      type: commType,
      targetAudience: 'ALL_STUDENTS',
      recipientCount: 840,
      channels: ['EMAIL', 'PORTAL']
    });
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
            AI Communication Automation & Messaging Desk
          </h1>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI DRAFTER
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Draft authoritative placement notifications, interview reminders, shortlisting alerts, and offer announcements with TPO oversight.
        </p>
      </div>

      {sentSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Notification published to students and logged in institutional audit stream.</span>
        </div>
      )}

      {/* Generator Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <h3 className="font-bold text-sm text-white">Select Communication Category</h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[
            { id: 'DRIVE_ANNOUNCEMENT', label: 'Drive Announcement' },
            { id: 'SHORTLISTING', label: 'Shortlisting Message' },
            { id: 'INTERVIEW_REMINDER', label: 'Interview Reminder' },
            { id: 'DOCUMENT_REMINDER', label: 'Document Reminder' },
            { id: 'OFFER_NOTICE', label: 'Offer Notification' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setCommType(t.id)}
              className={`p-3 rounded-xl border text-xs font-semibold text-center transition ${
                commType === t.id
                  ? 'bg-purple-600/20 border-purple-500 text-purple-200 ring-1 ring-purple-500/30'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleGenerateDraft}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
            <span>{isGenerating ? 'Drafting with Gemini AI...' : 'Generate Contextual Draft'}</span>
          </button>
        </div>
      </div>

      {/* Review & Edit Workspace */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white">TPO Review & Approval Editor</h3>
          <span className="text-xs text-amber-400 font-semibold">TPO Verification Required Prior to Dispatch</span>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Subject Line:</label>
          <input
            type="text"
            value={draftSubject}
            onChange={e => setDraftSubject(e.target.value)}
            placeholder="Subject line will be drafted here..."
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Message Body:</label>
          <textarea
            rows={8}
            value={draftBody}
            onChange={e => setDraftBody(e.target.value)}
            placeholder="Official broadcast draft will appear here for your review and edits..."
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-sans"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={handleSendBroadcast}
            disabled={!draftSubject || !draftBody}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition ${
              draftSubject && draftBody
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Approve & Dispatch Notification</span>
          </button>
        </div>
      </div>
    </div>
  );
};
