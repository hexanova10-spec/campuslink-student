import React, { useState } from 'react';
import {
  Award,
  Plus,
  FileText,
  CheckCircle2,
  Calendar,
  Building2,
  DollarSign,
  Download,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useRecruiter } from '../context/RecruiterContext.tsx';
import { api } from '../services/api.ts';

export const OffersScreen: React.FC = () => {
  const { offers, applications, company, refreshData } = useRecruiter();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOfferForPreview, setSelectedOfferForPreview] = useState<any>(offers[0] || null);

  const [applicationId, setApplicationId] = useState(applications[0]?.id || '');
  const [role, setRole] = useState('Software Engineer - Full Stack');
  const [fixedCtcLpa, setFixedCtcLpa] = useState('18.0');
  const [variableCtcLpa, setVariableCtcLpa] = useState('4.0');
  const [joiningBonusLpa, setJoiningBonusLpa] = useState('3.0');
  const [location, setLocation] = useState('Bengaluru (Outer Ring Road)');
  const [joiningDate, setJoiningDate] = useState('2027-07-01');
  const [validUntil, setValidUntil] = useState('2026-11-30');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.createOffer({
        applicationId,
        role,
        fixedCtcLpa: parseFloat(fixedCtcLpa),
        variableCtcLpa: parseFloat(variableCtcLpa),
        joiningBonusLpa: parseFloat(joiningBonusLpa),
        location,
        joiningDate,
        validUntil
      });
      await refreshData();
      setShowCreateModal(false);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shadow-blue-600/30">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Campus Offer Management &amp; Letter Generator
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {offers.length} Offers Dispatched
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate formal compensation packages and binding campus appointment letters transmitted to candidates via Student Portal.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Issue Campus Offer</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-bold shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Formal offer letter generated and dispatched to student portal!</span>
        </div>
      )}

      {/* Two Column Layout: Offers List & Offer Letter Preview - Royal Blue + White + Transparency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Offers Table */}
        <div className="lg:col-span-2 bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl overflow-hidden shadow-xs">
          <div className="p-4 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
              Issued Campus Offers
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              {offers.length} Active Records
            </span>
          </div>

          <div className="divide-y divide-blue-50">
            {offers.map((off) => {
              const isSelected = selectedOfferForPreview?.id === off.id;

              return (
                <div
                  key={off.id}
                  onClick={() => setSelectedOfferForPreview(off)}
                  className={`p-4 flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                    isSelected ? 'bg-blue-50/80 border-l-4 border-l-blue-600' : 'hover:bg-blue-50/30'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {off.studentName}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {off.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {off.location} • Joining {off.joiningDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right font-mono">
                      <span className="text-base font-extrabold text-blue-700">
                        ₹{off.totalCtcLpa.toFixed(1)} LPA
                      </span>
                      <p className="text-[10px] text-slate-400">
                        Base: ₹{off.fixedCtcLpa} LPA
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                        off.status === 'ACCEPTED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : off.status === 'ISSUED'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {off.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Appointment Letter Preview */}
        <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-5 space-y-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" /> Letter Preview
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                CAMPUSLINK CERTIFIED
              </span>
            </div>

            {selectedOfferForPreview ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-800 space-y-3 whitespace-pre-wrap leading-relaxed max-h-[460px] overflow-y-auto">
                {selectedOfferForPreview.letterText}
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400 text-xs">
                Select an offer to preview formal letter text.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              Valid Until: {selectedOfferForPreview?.validUntil}
            </span>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Issue Campus Offer */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white border border-blue-100 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Issue Formal Campus Offer Letter
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generates compensation breakdown and dispatches notification to candidate.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Candidate Selection *
                </label>
                <select
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  required
                  className="w-full bg-white border border-blue-100 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                >
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.student?.fullName} ({app.jobTitle} - Match {app.aiMatchScore}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Offer Role Title *
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="w-full bg-white border border-blue-100 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Fixed Base (LPA) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={fixedCtcLpa}
                    onChange={(e) => setFixedCtcLpa(e.target.value)}
                    required
                    className="w-full bg-white border border-blue-100 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Variable Bonus (LPA)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={variableCtcLpa}
                    onChange={(e) => setVariableCtcLpa(e.target.value)}
                    className="w-full bg-white border border-blue-100 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Joining Bonus (LPA)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={joiningBonusLpa}
                    onChange={(e) => setJoiningBonusLpa(e.target.value)}
                    className="w-full bg-white border border-blue-100 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Work Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white border border-blue-100 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Expected Joining Date
                  </label>
                  <input
                    type="date"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="w-full bg-white border border-blue-100 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Offer Letter Valid Until
                </label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full bg-white border border-blue-100 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-xs"
                >
                  {isSubmitting ? 'Generating...' : 'Dispatch Formal Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
