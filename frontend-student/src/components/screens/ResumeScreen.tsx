import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Resume } from '../../types/student';
import {
  FileText,
  Upload,
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  ScanEye,
  ArrowRight,
  ShieldCheck,
  FileCode
} from 'lucide-react';

export const ResumeScreen: React.FC = () => {
  const { student, setCurrentScreen } = useAuth();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [showPaster, setShowPaster] = useState(false);

  const fetchResume = async () => {
    try {
      const res = await api.getResume();
      setResume(res);
    } catch (err) {
      console.error('Failed to load resume:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);
    setTimeout(() => {
      setUploading(false);
      setMessage(`"${file.name}" uploaded successfully as Version ${(resume?.version_number || 1) + 1}.`);
      if (resume) {
        setResume({
          ...resume,
          file_name: file.name,
          version_number: resume.version_number + 1,
          updated_at: new Date().toISOString(),
        });
      }
    }, 1200);
  };

  if (loading || !resume) {
    return <div className="text-xs text-slate-500 dark:text-slate-400 p-8 text-center">Loading resume locker...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Student Resume Locker & Version Control</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Store, audit, and preview placement resumes for campus recruiters.
          </p>
        </div>
        <button
          onClick={() => setCurrentScreen('ai-resume-analysis')}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-600/25 cursor-pointer"
        >
          <ScanEye className="w-4 h-4 text-cyan-200" />
          <span>Launch AI Resume Audit & Parser</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Main Resume Card */}
      <div className="bg-white/85 dark:bg-[#070e22]/75 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-6 shadow-xl space-y-6 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-blue-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center flex-shrink-0">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">{resume.file_name}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-semibold">
                  Primary Version {resume.version_number}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Last Updated: {new Date(resume.updated_at).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>{(resume.file_size_bytes / 1024).toFixed(0)} KB PDF</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">ATS Audit Score</div>
              <div className="text-2xl font-extrabold text-blue-600 dark:text-cyan-400">{resume.ats_score}%</div>
            </div>
          </div>
        </div>

        {/* Upload Zone */}
        <div className="p-6 rounded-2xl border-2 border-dashed border-blue-200 dark:border-slate-800 hover:border-blue-500 bg-blue-50/40 dark:bg-slate-950/60 transition-all text-center">
          <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white">Upload Updated Resume (PDF, DOC, DOCX)</h3>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Maximum file size: 10 MB. Updates will automatically trigger an ATS audit recalculation.
          </p>

          <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-xs font-semibold text-blue-700 dark:text-slate-200 border border-blue-200/80 dark:border-slate-700 cursor-pointer transition-colors shadow-xs">
            <span>{uploading ? 'Processing Document...' : 'Choose Resume File'}</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleSimulatedFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Quick Extracted Skills Preview */}
        <div>
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-2">
            Skills Automatically Extracted from Current Resume
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {resume.parsed_skills.map((sk, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-slate-950 border border-blue-200/80 dark:border-slate-800 text-xs text-blue-700 dark:text-indigo-300 font-mono font-medium"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* AI Recommendations Callout */}
        {resume.ai_suggestions && (
          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-slate-950 border border-blue-100 dark:border-blue-900/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-800 dark:text-blue-300">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>AI Resume Recommendations</span>
            </div>
            <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
              {resume.ai_suggestions.improvements.map((imp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 mt-0.5">•</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
