import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DocumentRecord } from '../../types/student';
import {
  FolderLock,
  Upload,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Plus,
  ShieldCheck
} from 'lucide-react';

export const DocumentsScreen: React.FC = () => {
  const [docs, setDocs] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: '',
    documentType: 'Marksheet',
  });
  const [message, setMessage] = useState<string | null>(null);

  const fetchDocs = async () => {
    try {
      const res = await api.getDocuments();
      setDocs(res);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title.trim()) return;
    try {
      const res = await api.uploadDocument({
        title: newDoc.title,
        documentType: newDoc.documentType,
        fileUrl: `/documents/${encodeURIComponent(newDoc.title)}.pdf`,
      });
      setDocs([res.document, ...docs]);
      setShowUpload(false);
      setNewDoc({ title: '', documentType: 'Marksheet' });
      setMessage('Document uploaded for TPO verification.');
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteDocument(id);
      setDocs(docs.filter((d) => d.id !== id));
      setMessage('Document removed.');
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert('Delete error: ' + err.message);
    }
  };

  const getStatusBadge = (status: DocumentRecord['verification_status']) => {
    switch (status) {
      case 'Verified':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Pending Verification':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Rejected':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  if (loading) {
    return <div className="text-xs text-slate-500 dark:text-slate-400 p-8 text-center">Loading document vault...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Placement Document Locker</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Encrypted vault for marksheets, government identity, and pre-joining verification.
          </p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-600/25 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showUpload ? 'Cancel' : 'Upload Document'}</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {showUpload && (
        <form onSubmit={handleUpload} className="bg-white/85 dark:bg-[#070e22]/75 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-6 shadow-2xl space-y-4 backdrop-blur-xl">
          <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Upload New Document</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Document Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Semester 8 Grade Card, PAN Card"
                value={newDoc.title}
                onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-blue-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Document Classification</label>
              <select
                value={newDoc.documentType}
                onChange={(e) => setNewDoc({ ...newDoc, documentType: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-blue-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Marksheet">Marksheet / Transcript</option>
                <option value="ID">Government Identity (Aadhaar / Passport)</option>
                <option value="Certificate">Technical Certificate</option>
                <option value="Offer Document">Offer Acceptance Form</option>
                <option value="Joining Document">Pre-Joining Medical / Undertaking</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/25 cursor-pointer"
            >
              Upload for Verification
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {docs.map((d) => (
          <div
            key={d.id}
            className="p-5 rounded-2xl bg-white/80 dark:bg-[#070e22]/75 border border-blue-200/80 dark:border-blue-900/50 hover:border-blue-400 dark:hover:border-blue-700 transition-all shadow-md flex items-center justify-between backdrop-blur-xl"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{d.title}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getStatusBadge(d.verification_status)}`}>
                    {d.verification_status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{d.document_type}</p>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Uploaded: {new Date(d.uploaded_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDelete(d.id)}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                title="Delete document"
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
