import React, { useState } from 'react';
import {
  AlertTriangle,
  Sparkles,
  UserCheck,
  GraduationCap,
  ArrowRight,
  ShieldAlert,
  Send,
  CheckCircle,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { repo } from '../../services/storage';
import { Student } from '../../types';
import { analyzeStudentRiskWithAI } from '../../services/geminiService';

interface AtRiskEngineScreenProps {
  onSelectStudent: (studentId: string) => void;
  onSelectScreen: (screenId: number) => void;
}

export const AtRiskEngineScreen: React.FC<AtRiskEngineScreenProps> = ({
  onSelectStudent,
  onSelectScreen
}) => {
  const students = repo.getStudents();
  const mentors = repo.getMentors();
  const atRiskStudents = students.filter(s => s.isFlaggedAtRisk || s.readinessLevel === 'AT_RISK');

  const [analyzingStudentId, setAnalyzingStudentId] = useState<string | null>(null);
  const [selectedStudentForAction, setSelectedStudentForAction] = useState<Student | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const handleRunAIDiagnostics = async (student: Student) => {
    setAnalyzingStudentId(student.id);
    const result = await analyzeStudentRiskWithAI(student);
    repo.flagStudentAtRisk(student.id, true, result.riskScore, result.recommendedIntervention);
    setAnalyzingStudentId(null);
  };

  const handleAssignMentor = (studentId: string, mentorId: string) => {
    repo.assignMentor(studentId, mentorId);
    setActionSuccessMsg('Mentor successfully assigned.');
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
     <div className="bg-gradient-to-r from-blue-800/80 via-blue-950 to-slate-900 border border-blue-500/60 rounded-2xl p-6 shadow-xl relative overflow-hidden">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                EARLY WARNING INTELLIGENCE
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {atRiskStudents.length} Candidates At-Risk
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              AI At-Risk Student Intervention Engine
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Multi-factor risk indexing evaluating academic standing, backlog arrears, assessment rejections, skill deficits, and mock interview communication gaps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectScreen(26)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>Mentors Directory</span>
            </button>
          </div>
        </div>

        {/* 8 Risk Factors Analyzed */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mt-5 pt-4 border-t border-rose-900/30 text-[10px] text-center">
          {[
            'Readiness Index',
            'Skill Deficits',
            'Applications Count',
            'Rejection Velocity',
            'Interview Cleared',
            'Academic CGPA',
            'Communication',
            'Projects Portfolio'
          ].map((f, i) => (
            <div key={i} className="p-2 rounded-lg bg-slate-950/60 border border-rose-950 text-slate-300 font-medium">
              {f}
            </div>
          ))}
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Identified At-Risk Candidates */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Identified At-Risk Candidates & Intervention Action Plans
        </h2>

        {atRiskStudents.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs">
            No students currently flagged at risk.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {atRiskStudents.map(student => {
              const assignedMentor = mentors.find(m => m.id === student.mentorId);
              return (
                <div
                  key={student.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg space-y-4 transition"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-300 font-bold text-base shrink-0">
                        {student.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h3 className="font-bold text-sm text-white">{student.fullName}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                            {student.rollNumber}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                            {student.branch}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                          <span>CGPA: <strong className="text-white font-mono">{student.cgpa.toFixed(2)}</strong></span>
                          <span>• Backlogs: <strong className="text-rose-400 font-mono">{student.activeBacklogs}</strong></span>
                          <span>• Applications: <strong className="text-slate-200">{student.totalApplications}</strong></span>
                          <span>• Rejections: <strong className="text-rose-400">{student.totalRejections}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Risk Severity</div>
                        <div className="text-lg font-black text-rose-400 font-mono">{student.riskScore}%</div>
                      </div>
                      <button
                        onClick={() => handleRunAIDiagnostics(student)}
                        disabled={analyzingStudentId === student.id}
                        className="btn-ai-diagnostics px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{analyzingStudentId === student.id ? 'Analyzing...' : 'Re-Evaluate AI'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Reasons & Causal Factors */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
                    <div className="font-bold text-slate-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Causal Risk Drivers & Root Causes:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                      {student.riskFactors && student.riskFactors.length > 0 ? (
                        student.riskFactors.map((factor, idx) => (
                          <li key={idx} className="text-slate-300">{factor}</li>
                        ))
                      ) : (
                        <li>Sub-threshold assessment passing velocity and lack of competitive portfolio artifacts.</li>
                      )}
                    </ul>
                  </div>

                  {/* Recommended Intervention Plan */}
                  <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-900/30 text-xs space-y-2">
                    <div className="font-bold text-indigo-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Recommended TPO Intervention Plan:</span>
                    </div>
                    <p className="text-slate-300">
                      {student.recommendedIntervention ||
                        'Assign dedicated mentor, mandate 30-day DSA bootcamp, and restrict from high-cut-off Super Dream drives until cleared.'}
                    </p>
                  </div>

                  {/* Action Bar: Assign Mentor & Open Profile */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Assigned Mentor:</span>
                      <select
                        value={student.mentorId || ''}
                        onChange={e => handleAssignMentor(student.id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200"
                      >
                        <option value="">Unassigned</option>
                        {mentors.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.fullName} ({m.department})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectStudent(student.id)}
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <span>Open Detailed Profile</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
