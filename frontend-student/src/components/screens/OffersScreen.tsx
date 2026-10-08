import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Offer } from '../../types/student';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Building,
  Calendar,
  MapPin,
  Download,
  Clock,
  Sparkles,
  FileCheck
} from 'lucide-react';

export const OffersScreen: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [decidingId, setDecidingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchOffers = async () => {
    try {
      const res = await api.getOffers();
      setOffers(res);
    } catch (err) {
      console.error('Failed to load offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleDecision = async (id: string, decision: 'ACCEPTED' | 'DECLINED') => {
    setDecidingId(id);
    try {
      const res = await api.decideOffer(id, decision);
      setOffers(offers.map((o) => (o.id === id ? res.offer : o)));
      setMessage(`Offer status updated to ${decision}.`);
      setTimeout(() => setMessage(null), 3500);
    } catch (err: any) {
      alert('Error updating decision: ' + err.message);
    } finally {
      setDecidingId(null);
    }
  };

  if (loading) {
    return <div className="text-xs text-slate-500 dark:text-slate-400 p-8 text-center">Loading placement offers...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Campus Placement Offers Dossier</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Verified corporate offer letters, CTC compensation structures, and joining dates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            {offers.length} Offer Records
          </span>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {offers.length === 0 ? (
        <div className="bg-white/85 dark:bg-[#070e22]/75 border border-blue-200/80 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-600 dark:text-slate-400 space-y-3 shadow-xl backdrop-blur-xl">
          <Trophy className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Offers Logged Yet</h3>
          <p className="text-xs max-w-sm mx-auto">
            Applications are in progress. Once recruiters publish selections, official offer packages appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((off) => (
            <div
              key={off.id}
              className="p-6 rounded-3xl bg-white/85 dark:bg-[#070e22]/75 backdrop-blur-xl border border-blue-200/80 dark:border-blue-900/50 hover:border-blue-400 dark:hover:border-blue-700 transition-all shadow-xl space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">{off.company_name}</h2>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${
                          off.status === 'ACCEPTED'
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                            : off.status === 'DECLINED'
                            ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {off.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-300 mt-0.5">{off.role_title}</p>
                    <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">{off.ctc}</div>
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <div>Offer Date: {off.offer_date}</div>
                  <div className="text-blue-600 dark:text-cyan-400 font-semibold">Joining: {off.joining_date}</div>
                  <div>Location: {off.location}</div>
                </div>
              </div>

              {/* Offer Letter Action & Decision Buttons */}
              <div className="pt-4 border-t border-blue-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  onClick={() => alert(`Opening Offer Letter Document for ${off.company_name}`)}
                  className="text-xs text-blue-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 font-semibold cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Download Verified Corporate Offer Letter (.pdf)</span>
                </button>

                {off.status === 'PENDING' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecision(off.id, 'DECLINED')}
                      disabled={decidingId === off.id}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                      Decline Offer
                    </button>
                    <button
                      onClick={() => handleDecision(off.id, 'ACCEPTED')}
                      disabled={decidingId === off.id}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/25 flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Accept Placement Offer</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
