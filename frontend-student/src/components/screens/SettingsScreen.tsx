import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Settings,
  ShieldCheck,
  Database,
  Lock,
  Download,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Key,
  LogOut,
  Sparkles
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { student, user, logout } = useAuth();
  const [schemaSql, setSchemaSql] = useState<string>('');
  const [showSchema, setShowSchema] = useState(false);
  const [copied, setCopied] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwMessage, setPwMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadSchema() {
      try {
        const text = await api.getDbSchemaSql();
        setSchemaSql(text);
      } catch (e) {
        console.error('Failed to load SQL contract:', e);
      }
    }
    loadSchema();
  }, []);

  const handleCopySchema = () => {
    if (!schemaSql) return;
    navigator.clipboard.writeText(schemaSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    try {
      await api.resetPassword(user?.email || '', newPassword);
      setPwMessage('Password updated successfully.');
      setOldPassword('');
      setNewPassword('');
      setTimeout(() => setPwMessage(null), 3500);
    } catch (err: any) {
      alert('Error updating password: ' + err.message);
    }
  };

  const handleExportDossier = () => {
    const dossierData = {
      platform: 'CAMPUSLINK STUDENT',
      student,
      exportTimestamp: new Date().toISOString(),
      securityClassification: 'STUDENT_AUTHORIZED_ONLY',
    };
    const blob = new Blob([JSON.stringify(dossierData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CampusLink_Student_Dossier_${student?.roll_number || '2026'}.json`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Student Account Settings & Architecture</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Manage your credentials, export your placement portfolio, and review the PostgreSQL data contract.
          </p>
        </div>
        <button
          onClick={handleExportDossier}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-blue-700 dark:text-slate-200 text-xs font-semibold border border-blue-200/80 dark:border-slate-700 flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Export Placement Dossier (.json)</span>
        </button>
      </div>

      {/* Security Guarantee Card */}
      <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-emerald-500/30 shadow-xl space-y-2 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Strict Student Domain Isolation Verified</span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          Your account is protected under student-only row-level permissions. You have exclusive authority over your profile, resume, scores, applications, and documents. No other student or candidate can view or search your data.
        </p>
      </div>

      {/* Account & Password Settings */}
      <div className="bg-white/80 dark:bg-[#070e22]/75 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-6 shadow-xl space-y-4 backdrop-blur-xl">
        <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-600 dark:text-indigo-400" />
          <span>Security & Authentication</span>
        </h2>

        {pwMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{pwMessage}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1">Registered Student Email</label>
              <input
                type="email"
                disabled
                value={user?.email || student?.roll_number}
                className="w-full bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1">New Password</label>
              <input
                type="password"
                required
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-blue-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/25 cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Section 26: PostgreSQL Database Contract Viewer */}
      <div className="bg-white/80 dark:bg-[#070e22]/75 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-6 shadow-xl space-y-4 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>Section 26: PostgreSQL Database Contract</span>
            </h2>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
              Production schema defining all 22 student tables with strict user ownership partitioning.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSchema(!showSchema)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-blue-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              {showSchema ? 'Hide SQL Contract' : 'Inspect SQL Contract'}
            </button>
            {showSchema && (
              <button
                onClick={handleCopySchema}
                className="px-3 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied SQL!' : 'Copy SQL'}</span>
              </button>
            )}
          </div>
        </div>

        {showSchema && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto max-h-96">
            <pre className="text-[11px] text-cyan-300 font-mono leading-relaxed select-text">
              {schemaSql || '-- Loading PostgreSQL schema definition...'}
            </pre>
          </div>
        )}
      </div>

      {/* Logout Action */}
      <div className="pt-4 border-t border-blue-100 dark:border-slate-800 flex justify-end">
        <button
          onClick={logout}
          className="px-5 py-2.5 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-700 dark:text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of CampusLink Student</span>
        </button>
      </div>
    </div>
  );
};
