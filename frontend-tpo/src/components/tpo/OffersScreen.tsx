import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, Clock, DollarSign, Calendar, ChevronRight } from 'lucide-react';
import { repo } from '../../services/storage';
import { Offer, OfferStatus } from '../../types';

export const OffersScreen: React.FC = () => {
  const offers = repo.getOffers();
  const students = repo.getStudents();
  const companies = repo.getCompanies();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filtered = filterStatus === 'ALL' ? offers : offers.filter(o => o.status === filterStatus);

  const handleUpdateStatus = (offerId: string, status: OfferStatus) => {
    repo.updateOfferStatus(offerId, status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
            Corporate Offer & Joining Tracking Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track letters of intent, compensation annexures, acceptance confirmations, deferrals, and joining onboarding statuses.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          {['ALL', 'OFFERED', 'ACCEPTED', 'JOINED', 'DECLINED', 'DEFERRED'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
              <th className="py-3 px-4">Student & Roll No</th>
              <th className="py-3 px-3">Company & Role</th>
              <th className="py-3 px-3">CTC Package</th>
              <th className="py-3 px-3">Offer Date / Deadline</th>
              <th className="py-3 px-3">Offer Lifecycle Status</th>
              <th className="py-3 px-4 text-right">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map(offer => {
              const stu = students.find(s => s.id === offer.studentId);
              const comp = companies.find(c => c.id === offer.companyId);

              return (
                <tr key={offer.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200">{stu?.fullName || 'Student'}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{stu?.rollNumber} • {stu?.branch}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-indigo-300">{comp?.name || 'Company'}</div>
                    <div className="text-[11px] text-slate-400">{offer.designation}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-emerald-400 font-mono text-sm">₹{offer.ctcLPA} LPA</div>
                    {offer.isDreamOffer && (
                      <span className="text-[9px] font-bold text-purple-300 px-1 py-0.2 rounded bg-purple-950 border border-purple-800">
                        DREAM OFFER
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                    <div>Offered: {offer.offerDate}</div>
                    <div className="text-[10px] text-slate-500">Deadline: {offer.acceptanceDeadline}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      offer.status === 'ACCEPTED' || offer.status === 'JOINED'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : offer.status === 'OFFERED'
                        ? 'bg-pink-500/20 text-pink-300 border-pink-500/30'
                        : offer.status === 'DECLINED'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {offer.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <select
                      value={offer.status}
                      onChange={e => handleUpdateStatus(offer.id, e.target.value as OfferStatus)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 font-semibold"
                    >
                      <option value="OFFERED">OFFERED</option>
                      <option value="ACCEPTED">ACCEPTED</option>
                      <option value="JOINED">JOINED</option>
                      <option value="DECLINED">DECLINED</option>
                      <option value="DEFERRED">DEFERRED</option>
                      <option value="WITHDRAWN">WITHDRAWN</option>
                      <option value="NOT_JOINED">NOT JOINED</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
