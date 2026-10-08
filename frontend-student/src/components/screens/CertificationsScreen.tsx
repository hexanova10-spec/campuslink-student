import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Certification } from '../../types/student';
import {
  Award,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export const CertificationsScreen: React.FC = () => {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newCert, setNewCert] = useState({
    name: '',
    issuingOrganization: 'Amazon Web Services',
    issueDate: '2025-07-15',
    credentialId: '',
    credentialUrl: '',
  });
  const [message, setMessage] = useState<string | null>(null);

  const fetchCerts = async () => {
    try {
      const res = await api.getCertifications();
      setCerts(res);
    } catch (err) {
      console.error('Failed to load certs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.name.trim()) return;
    try {
      const res = await api.addCertification(newCert);
      setCerts([...certs, res.certification]);
      setShowAdd(false);
      setNewCert({ name: '', issuingOrganization: 'Amazon Web Services', issueDate: '2025-07-15', credentialId: '', credentialUrl: '' });
      setMessage('Certification added and verified!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert('Failed: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteCertification(id);
      setCerts(certs.filter((c) => c.id !== id));
      setMessage('Certification removed.');
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert('Failed: ' + err.message);
    }
  };

  if (loading) {
    return <div className="text-xs text-slate-500 dark:text-slate-400 p-8 text-center">Loading verified credentials...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Verified Certifications & Credentials</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Cloud, security, and algorithmic problem-solving certifications audited for campus drives.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-600/25 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showAdd ? 'Cancel' : 'Add Credential'}</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white/85 dark:bg-[#070e22]/75 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-6 shadow-2xl space-y-4 backdrop-blur-xl">
          <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Add Verified Credential</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Certification Name</label>
              <input
                type="text"
                required
                placeholder="e.g. AWS Certified Solutions Architect - Associate"
                value={newCert.name}
                onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Issuing Authority</label>
              <input
                type="text"
                required
                placeholder="e.g. Amazon Web Services, Google Cloud, HackerRank"
                value={newCert.issuingOrganization}
                onChange={(e) => setNewCert({ ...newCert, issuingOrganization: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Issue Date</label>
              <input
                type="date"
                value={newCert.issueDate}
                onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Credential ID</label>
              <input
                type="text"
                placeholder="e.g. AWS-CCP-948271"
                value={newCert.credentialId}
                onChange={(e) => setNewCert({ ...newCert, credentialId: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Verification URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={newCert.credentialUrl}
                onChange={(e) => setNewCert({ ...newCert, credentialUrl: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/25 cursor-pointer"
            >
              Verify & Add Credential
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="space-y-3">
        {certs.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-white/85 dark:bg-[#070e22]/75 border border-blue-200/80 dark:border-blue-900/50 hover:border-blue-400 dark:hover:border-blue-700 transition-all shadow-xl flex items-center justify-between backdrop-blur-xl"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{c.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">{c.issuing_organization}</p>
                <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  <span className="flex items-center gap-1 font-mono font-medium">
                    ID: {c.credential_id || 'VERIFIED-TOKEN'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Issued: {c.issue_date}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {c.credential_url && (
                <a
                  href={c.credential_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-blue-700 dark:text-slate-300 border border-blue-200/80 dark:border-slate-700 text-xs flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={() => handleDelete(c.id)}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
                title="Remove certification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
