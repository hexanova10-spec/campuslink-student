import React from 'react';
import { GraduationCap, Users, Award, TrendingUp, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { repo } from '../../services/storage';

export const MentorsScreen: React.FC = () => {
  const mentors = repo.getMentors();
  const students = repo.getStudents();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
          Faculty Mentors & Intervention Directory
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Faculty advisors assigned to guide at-risk candidates through technical problem-solving remediation and interview preparation.
        </p>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mentors.map(mentor => {
          const mentees = students.filter(s => s.mentorId === mentor.id);

          return (
            <div
              key={mentor.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold text-base">
                    {mentor.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{mentor.fullName}</h3>
                    <div className="text-[11px] text-slate-400">{mentor.designation}</div>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  {mentor.successRate}% Success
                </span>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <div>Department: <strong className="text-slate-200">{mentor.department}</strong></div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-indigo-400">{mentor.email}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Assigned Mentees ({mentees.length}):</span>
                  <span className="text-amber-400 font-mono text-[11px]">{mentor.activeInterventionsCount} Active Remedials</span>
                </div>

                <div className="space-y-1">
                  {mentees.map(m => (
                    <div
                      key={m.id}
                      className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] flex items-center justify-between"
                    >
                      <span className="font-semibold text-slate-200">{m.fullName}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                        m.isFlaggedAtRisk ? 'text-rose-400 font-bold' : 'text-slate-400'
                      }`}>
                        {m.branch} • Risk {m.riskScore}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
