import React, { useState } from 'react';
import { FileText, CheckCircle2, XCircle, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { repo } from '../../services/storage';
import { PlacementDocument, VerificationStatus } from '../../types';

export const DocumentsScreen: React.FC = () => {
  const documents = repo.getDocuments();
  const students = repo.getStudents();
  const [rejectModalDoc, setRejectModalDoc] = useState<PlacementDocument | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleVerify = (docId: string) => {
    repo.verifyDocument(docId, 'VERIFIED');
  };

  const handleConfirmReject = () => {
    if (rejectModalDoc) {
      repo.verifyDocument(rejectModalDoc.id, 'REJECTED', rejectionReason);
      setRejectModalDoc(null);
      setRejectionReason('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
          Document Verification & Institutional Attestation
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Authenticate student marks cards, consolidated transcripts, NOC declarations, and corporate offer letters.
        </p>
      </div>

      {/* Documents Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
              <th className="py-3 px-4">Student & Roll No</th>
              <th className="py-3 px-3">Document Title & Type</th>
              <th className="py-3 px-3">Upload Date & Size</th>
              <th className="py-3 px-3">Verification Status</th>
              <th className="py-3 px-3">Audit Details</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {documents.map(doc => {
              const stu = students.find(s => s.id === doc.studentId);
              return (
                <tr key={doc.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200">{stu?.fullName || 'Student'}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{stu?.rollNumber} • {stu?.branch}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white">{doc.title}</div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-indigo-300 font-mono font-bold">
                      {doc.documentType}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                    <div>{new Date(doc.uploadDate).toLocaleDateString()}</div>
                    <div className="text-[10px] text-slate-500">{doc.fileSize}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      doc.status === 'VERIFIED'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : doc.status === 'REJECTED'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    {doc.verifiedAt ? (
                      <div>
                        <div>Verified: {new Date(doc.verifiedAt).toLocaleDateString()}</div>
                        {doc.rejectionReason && (
                          <div className="text-rose-400 text-[10px] truncate max-w-xs">{doc.rejectionReason}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">Pending TPO Review</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {doc.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setRejectModalDoc(doc);
                            setRejectionReason('Academic record marks discrepancy identified against Examination Cell roster.');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-semibold"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleVerify(doc.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                        >
                          Verify
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Logged</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {rejectModalDoc && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              <span>Reject Document: {rejectModalDoc.title}</span>
            </h3>
            <p className="text-xs text-slate-400">
              Provide an audited rejection reason explaining the discrepancy to the candidate.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectModalDoc(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
