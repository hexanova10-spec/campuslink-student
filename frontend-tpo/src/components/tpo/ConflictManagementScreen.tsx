import React, { useState } from 'react';
import {
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  MapPin,
  Users,
  Check,
  RotateCcw
} from 'lucide-react';
import { repo } from '../../services/storage';
import { optimizeScheduleWithAI } from '../../services/geminiService';
import { ScheduleConflict } from '../../types';

export const ConflictManagementScreen: React.FC = () => {
  const drives = repo.getDrives();
  const conflicts = repo.getConflicts();
  const unresolvedConflicts = conflicts.filter(c => c.status === 'UNRESOLVED');

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [aiProposal, setAiProposal] = useState<{
    suggestedSchedule: string;
    detectedConflictsExplanation: string;
    resolutionPlan: string;
  } | null>(null);
  const [confirmedSuccess, setConfirmedSuccess] = useState(false);

  const handleRunAiOptimizer = async () => {
    setIsOptimizing(true);
    const result = await optimizeScheduleWithAI(drives, unresolvedConflicts);
    setAiProposal(result);
    setIsOptimizing(false);
  };

  const handleConfirmAiSchedule = () => {
    // Resolve all active conflicts with audit log
    unresolvedConflicts.forEach(c => {
      repo.resolveConflict(c.id, 'Resolved via AI Placement Optimizer with TPO sign-off.');
    });
    setConfirmedSuccess(true);
    setAiProposal(null);
    setTimeout(() => setConfirmedSuccess(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="blue-banner-card rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                SCHEDULE INTEGRITY ENGINE
              </span>
              <span className="text-xs text-blue-200/80 font-mono">
                {unresolvedConflicts.length} UNRESOLVED COLLISIONS
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight text-white-force">
              Schedule Conflict & Resource Collision Management
            </h1>
            <p className="text-xs text-slate-200 mt-1 max-w-2xl">
              Automatic detection of overlapping venue reservations, panel overbooking, computer lab infrastructure deficits, and student double-booking clashes.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleRunAiOptimizer}
              disabled={isOptimizing || unresolvedConflicts.length === 0}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition cursor-pointer ${
                unresolvedConflicts.length > 0
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
              <span>{isOptimizing ? 'Analyzing Optimal Slots...' : 'Optimize Schedule (AI)'}</span>
            </button>
          </div>
        </div>
      </div>

      {confirmedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>All conflicts successfully resolved! Drives staggered and candidate slots reconciled.</span>
        </div>
      )}

      {/* AI Optimization Proposal Modal / Card */}
      {aiProposal && (
        <div className="bg-purple-950/30 border border-purple-500/40 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-300">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h2 className="font-extrabold text-base text-white">AI Schedule Optimization Proposal</h2>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              Requires TPO Confirmation
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/40 text-xs text-slate-200 whitespace-pre-line font-sans leading-relaxed">
            {aiProposal.detectedConflictsExplanation}
          </div>

          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-slate-200 space-y-2">
            <div className="font-bold text-indigo-300 uppercase tracking-wider">
              {aiProposal.suggestedSchedule}
            </div>
            <div className="whitespace-pre-line text-slate-300">
              {aiProposal.resolutionPlan}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setAiProposal(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Discard Proposal
            </button>
            <button
              onClick={handleConfirmAiSchedule}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Confirm & Apply Optimized Schedule</span>
            </button>
          </div>
        </div>
      )}

      {/* Detected Conflicts List */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Active Resource Collisions ({unresolvedConflicts.length} Unresolved)
        </h2>

        {unresolvedConflicts.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="font-bold text-white text-sm">Schedule is in pristine state</div>
            <p className="text-slate-500">Zero venue overlaps, panel overbooking, or student double-booking collisions detected.</p>
          </div>
        ) : (
          unresolvedConflicts.map(conflict => (
            <div
              key={conflict.id}
              className="bg-slate-900 border border-rose-900/40 rounded-2xl p-5 shadow-lg space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-xs">
                    !
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">{conflict.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      Type: {conflict.conflictType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {conflict.severity} SEVERITY
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {conflict.affectedStudentsCount} Students Impacted
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 font-sans">
                {conflict.description}
              </div>

              <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/30 text-xs text-indigo-200">
                <strong className="text-indigo-400">Engine Recommendation:</strong> {conflict.suggestedResolution}
              </div>

              <div className="flex items-center justify-end pt-1">
                <button
                  onClick={() => repo.resolveConflict(conflict.id, 'Manually signed off by TPO')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
