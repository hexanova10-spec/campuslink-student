import React, { useState } from 'react';
import { Settings, Shield, Award, CheckCircle2, Save } from 'lucide-react';
import { repo } from '../../services/storage';

export const CollegeSettingsScreen: React.FC = () => {
  const institution = repo.getEffectiveInstitution();
  const [dreamThreshold, setDreamThreshold] = useState(25.0);
  const [maxOffersAllowed, setMaxOffersAllowed] = useState(2);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
          Institutional Placement Policies & Rules
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure multi-offer policies, Dream offer thresholds, and eligibility rounding guidelines for {institution.name}.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Institutional placement policy rules saved successfully.</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-400" />
          <span>Placement Regulations & Offer Cap Policy</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
              "Super Dream" Tier Minimum CTC (LPA):
            </label>
            <input
              type="number"
              step="0.5"
              value={dreamThreshold}
              onChange={e => setDreamThreshold(parseFloat(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
            <p className="text-[10px] text-slate-500 mt-1">Offers above this threshold do not disqualify candidates under the single-offer rule.</p>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
              Maximum Concurrent Offers per Student:
            </label>
            <input
              type="number"
              value={maxOffersAllowed}
              onChange={e => setMaxOffersAllowed(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
            <p className="text-[10px] text-slate-500 mt-1">Strict ceiling before candidate profile is automatically removed from further drives.</p>
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
          <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
            Institutional Standard Rules:
          </div>
          <div className="space-y-2">
            {[
              'Enforce strict zero-backlog policy for Super Dream recruitment drives',
              'Mandatory 3 hard copies of TPO-attested resumes for physical interview rounds',
              'Automated de-registration of candidates with > 1 unexcused drive no-show',
              'Require signed Letter of Intent acceptance within 7 calendar days of receipt'
            ].map((rule, idx) => (
              <label key={idx} className="flex items-center gap-2.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
                />
                <span>{rule}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Placement Policies</span>
          </button>
        </div>
      </form>
    </div>
  );
};
