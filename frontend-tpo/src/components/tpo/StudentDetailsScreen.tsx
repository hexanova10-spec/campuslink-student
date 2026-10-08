import React, { useState } from 'react';
import {
  ArrowLeft,
  AlertTriangle,
  GraduationCap,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  FileText,
  UserCheck,
  Send,
  Building,
  Briefcase
} from 'lucide-react';
import { repo } from '../../services/storage';
import { analyzeStudentRiskWithAI } from '../../services/geminiService';

interface StudentDetailsScreenProps {
  studentId: string;
  onBack: () => void;
  onSelectScreen: (screenId: number) => void;
}

export const StudentDetailsScreen: React.FC<StudentDetailsScreenProps> = ({ studentId, onBack, onSelectScreen }) => {
  const student = repo.getStudentById(studentId);
  const mentors = repo.getMentors();
  const applications = repo.getApplications().filter(a => a.studentId === studentId);
  const offers = repo.getOffers().filter(o => o.studentId === studentId);
  const documents = repo.getDocuments().filter(d => d.studentId === studentId);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(student?.mentorId || '');

  if (!student) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Student profile not found or outside your authorized college jurisdiction.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs">
          Return to Students Roster
        </button>
      </div>
    );
  }

  const assignedMentor = mentors.find(m => m.id === student.mentorId);

  const handleMentorChange = (mentorId: string) => {
    setSelectedMentor(mentorId);
    repo.assignMentor(student.id, mentorId || undefined);
  };

  const handleToggleRisk = () => {
    repo.flagStudentAtRisk(student.id, !student.isFlaggedAtRisk, student.isFlaggedAtRisk ? 10 : 75);
  };

  const handleRunAiRiskEngine = async () => {
    setIsAnalyzing(true);
    const result = await analyzeStudentRiskWithAI(student);
    repo.flagStudentAtRisk(student.id, result.riskScore > 50, result.riskScore, result.recommendedIntervention);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students Roster</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRunAiRiskEngine}
            disabled={isAnalyzing}
            className="btn-ai-diagnostics flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>{isAnalyzing ? 'Analyzing Factors...' : 'Run AI Risk Diagnostics'}</span>
          </button>
          <button
            onClick={handleToggleRisk}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition ${
              student.isFlaggedAtRisk
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-rose-400'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>{student.isFlaggedAtRisk ? 'Flagged At-Risk' : 'Flag At-Risk'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-600/30">
              {student.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{student.fullName}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {student.branch} Department
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {student.rollNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Batch of {student.graduationYear} • Campus: {student.campusId} • Institutional Verification Complete
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  student.readinessLevel === 'HIGHLY_EMPLOYABLE'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    : student.readinessLevel === 'PLACEMENT_READY'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : student.readinessLevel === 'DEVELOPING'
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}>
                  {student.readinessLevel.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  CGPA: <strong className="text-white">{student.cgpa.toFixed(2)}</strong> (0 Backlogs)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center shrink-0">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">Applications</div>
              <div className="text-lg font-black text-white mt-0.5">{student.totalApplications}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">Rejections</div>
              <div className="text-lg font-black text-rose-400 mt-0.5">{student.totalRejections}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">Interviews</div>
              <div className="text-lg font-black text-emerald-400 mt-0.5">{student.totalInterviews}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Academics, Risk Engine & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Academic & Readiness */}
        <div className="space-y-6">
          {/* Institutional Academic Record */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Institutional Academic Records</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Cumulative GPA (CGPA)</span>
                <span className="font-bold text-white font-mono">{student.cgpa.toFixed(2)} / 10.0</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Class 10th Percentage</span>
                <span className="font-bold text-slate-300 font-mono">{student.tenthPercentage}%</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Class 12th / Inter Percentage</span>
                <span className="font-bold text-slate-300 font-mono">{student.twelfthPercentage}%</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Active Backlogs</span>
                <span className={`font-bold font-mono ${student.activeBacklogs > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {student.activeBacklogs}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">History of Arrears</span>
                <span className="font-bold text-slate-300 font-mono">{student.historyOfBacklogs}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Profile Completion</span>
                <span className="font-bold text-emerald-400 font-mono">{student.profileCompletion}%</span>
              </div>
            </div>
          </div>

          {/* Mentor Assignment */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Assigned Faculty Mentor</span>
            </h3>
            <p className="text-xs text-slate-400">
              Mentors provide 1:1 guidance for mock interviews and skill recovery.
            </p>

            <select
              value={selectedMentor}
              onChange={e => handleMentorChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">No Mentor Assigned</option>
              {mentors.map(m => (
                <option key={m.id} value={m.id}>
                  {m.fullName} ({m.department})
                </option>
              ))}
            </select>

            {assignedMentor && (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                <div className="font-semibold text-slate-200">{assignedMentor.fullName}</div>
                <div className="text-[11px] text-slate-400">{assignedMentor.designation}</div>
                <div className="text-[11px] text-indigo-400 mt-1">{assignedMentor.email}</div>
              </div>
            )}
          </div>
        </div>

        {/* Center & Right Column: Risk Engine, Applications & Offers */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Risk Assessment Card */}
          {student.isFlaggedAtRisk && (
            <div className="bg-rose-950/20 border border-rose-800/40 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <h3 className="font-bold text-sm text-rose-200">AI At-Risk Diagnostic Alert</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-bold">
                  Risk Score: {student.riskScore}%
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Causal Failure Factors Identified:
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs text-rose-300/90">
                  {student.riskFactors?.map((f, i) => (
                    <li key={i}>{f}</li>
                  )) || <li>Consecutive assessment clearing failures.</li>}
                </ul>
              </div>

              <div className="pt-2 border-t border-rose-900/40">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Recommended TPO Intervention:
                </div>
                <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-rose-900/30">
                  {student.recommendedIntervention || 'Enroll in remedial DSA clinic and schedule weekly check-in.'}
                </p>
              </div>
            </div>
          )}

          {/* Technical Skills & Certifications */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="font-bold text-sm text-white">Technical Competencies & Certifications</h3>

            <div>
              <div className="text-xs font-bold text-slate-400 mb-2">Primary Domain Skills:</div>
              <div className="flex flex-wrap gap-1.5">
                {student.primarySkills.map((sk, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-200 text-xs font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-400 mb-2">Secondary / Auxiliary Skills:</div>
              <div className="flex flex-wrap gap-1.5">
                {student.secondarySkills.map((sk, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-400 mb-2">Verified Professional Certifications:</div>
              {student.certifications.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No external certifications registered.</p>
              ) : (
                <div className="space-y-1.5">
                  {student.certifications.map((cert, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Placement Drive Application History */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Application & Placement History</h3>
              <span className="text-xs text-slate-400">{applications.length} Drives Applied</span>
            </div>

            {applications.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No applications submitted for this cohort yet.</p>
            ) : (
              <div className="space-y-2">
                {applications.map(app => (
                  <div
                    key={app.id}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">Job ID: {app.jobId}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Match Score: <strong className="text-purple-300 font-mono">{app.aiMatchScore}%</strong> • Applied: {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      app.status === 'OFFERED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : app.status === 'REJECTED'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
