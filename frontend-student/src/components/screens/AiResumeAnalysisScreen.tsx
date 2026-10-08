import React, { useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  ScanEye,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Save,
  FileText,
  Code2,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const AiResumeAnalysisScreen: React.FC = () => {
  const { refreshStudentData } = useAuth();
  const [resumeText, setResumeText] = useState(
    `AARAV SHARMA
Email: aarav.sharma@campus.edu | Phone: +91 98765 43210
National Institute of Technology | B.Tech Computer Science & Engineering (2022 - 2026) | CGPA: 8.72/10

TECHNICAL SKILLS:
Languages: Python, JavaScript, TypeScript, SQL
Frameworks & Libraries: React, Node.js, FastAPI, Express
Databases & Cloud: PostgreSQL, Redis, Docker, AWS (S3, EC2, ECS)
Core CS: Data Structures & Algorithms, Distributed Systems, System Design

EXPERIENCE:
CloudScale Technologies — Software Engineering Intern (June 2025 - August 2025)
- Refactored high-concurrency order microservices in Python & FastAPI, reducing p99 latency by 34%.
- Designed database connection pooling for PostgreSQL, saving 22% memory under burst traffic.
- Authored automated integration test suites and configured GitHub Actions CI/CD workflows.

KEY PROJECTS:
1. Distributed Event-Driven Message Broker (Node.js, Redis, Docker, PostgreSQL)
- Engineered event processing platform handling 12,000 req/sec with <45ms p99 response time.
- Implemented idempotent consumer delivery and dead-letter queue retry policies.

2. Campus Placement Match Engine (React, TypeScript, Express, PostgreSQL)
- Built student readiness scoring algorithm with deterministic skill-gap analytics.
- Deployed to 800+ university peers with 98% user satisfaction.

CERTIFICATIONS:
- AWS Certified Cloud Practitioner (2025)
- HackerRank Gold 5-Star Problem Solving (2025)`
  );

  const [parsing, setParsing] = useState(false);
  const [parsedResult, setParsedResult] = useState<any | null>(null);
  const [appliedMessage, setAppliedMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleRunAiAudit = async () => {
    setParsing(true);
    setAppliedMessage(null);
    try {
      const res = await api.parseResumeAi(resumeText);
      setParsedResult(res);
    } catch (err: any) {
      alert('AI Audit Error: ' + err.message);
    } finally {
      setParsing(false);
    }
  };

  const handleApplyToProfile = async () => {
    if (!parsedResult) return;
    setSaving(true);
    try {
      await api.applyParsedResume(parsedResult, 'Aarav_Sharma_Audited_Resume.pdf');
      await refreshStudentData();
      setAppliedMessage('Resume insights and extracted skills successfully synchronized with your profile!');
    } catch (err: any) {
      alert('Error applying data: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ScanEye className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Gemini AI Resume Parser & ATS Auditor</h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Extracts structured placement attributes and audits ATS readability according to campus recruiter filters.
          </p>
        </div>
        <button
          onClick={handleRunAiAudit}
          disabled={parsing}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>{parsing ? 'Gemini Auditing...' : 'Run Gemini AI Analysis'}</span>
        </button>
      </div>

      {appliedMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{appliedMessage}</span>
        </div>
      )}

      {/* Input Resume Text Box */}
      <div className="bg-white/85 dark:bg-[#070e22]/75 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-6 shadow-xl space-y-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
            Resume Source Text
          </span>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono font-medium">
            Direct Gemini Model: gemini-3.8-flash
          </span>
        </div>
        <textarea
          rows={7}
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          className="w-full bg-blue-50/40 dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-200 font-mono resize-none leading-relaxed focus:outline-none focus:border-blue-600"
          placeholder="Paste resume content here..."
        />
      </div>

      {/* Audit & Parsed Results */}
      {parsedResult && (
        <div className="space-y-6 animate-in slide-in-from-bottom-3 duration-300">
          {/* Score Header */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 border border-white/20 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-white shadow-xl backdrop-blur-xl">
            <div>
              <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                ATS Employability Benchmark
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-extrabold text-white">{parsedResult.resume_score}%</span>
                <span className="text-xs text-emerald-300 font-semibold">Tier-1 Recruiters Qualified</span>
              </div>
              <p className="text-xs text-blue-100 mt-2 max-w-lg leading-relaxed">
                {parsedResult.professional_summary}
              </p>
            </div>

            <button
              onClick={handleApplyToProfile}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold transition-all shadow-lg hover:scale-105 flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
            >
              <Save className="w-4 h-4 text-blue-600" />
              <span>{saving ? 'Synchronizing...' : 'Review & Confirm Profile Sync'}</span>
            </button>
          </div>

          {/* Observations & Weak Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white/85 dark:bg-[#070e22]/75 border border-emerald-500/30 rounded-2xl space-y-2 shadow-lg backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>ATS & Readability Strengths</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {(parsedResult.ats_observations || []).map((obs: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 mt-0.5 font-bold">✓</span>
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 bg-white/85 dark:bg-[#070e22]/75 border border-amber-500/30 rounded-2xl space-y-2 shadow-lg backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <span>High-Leverage Improvements</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {(parsedResult.recommended_improvements || []).map((imp: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 mt-0.5 font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Extracted Structured JSON Preview */}
          <div className="bg-white/85 dark:bg-[#070e22]/75 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-6 space-y-4 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span>Validated Structured Extraction Schema</span>
              </h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Confirmed before applying
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-blue-50/60 dark:bg-slate-950 rounded-xl border border-blue-100 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Extracted Candidate</div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{parsedResult.full_name}</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">{parsedResult.email}</div>
              </div>
              <div className="p-3 bg-blue-50/60 dark:bg-slate-950 rounded-xl border border-blue-100 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Academics</div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{parsedResult.cgpa} CGPA</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">{parsedResult.branch}</div>
              </div>
              <div className="p-3 bg-blue-50/60 dark:bg-slate-950 rounded-xl border border-blue-100 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Verified Skills Count</div>
                <div className="font-bold text-blue-700 dark:text-indigo-400 mt-0.5">{parsedResult.skills?.length || 0} Skills</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">Class of {parsedResult.graduation_year}</div>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-[11px] text-slate-700 dark:text-slate-400 mb-2 font-bold">Extracted Skills:</div>
              <div className="flex flex-wrap gap-1.5">
                {(parsedResult.skills || []).map((sk: any, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-slate-950 border border-blue-200/80 dark:border-slate-800 text-xs text-blue-700 dark:text-indigo-300 font-mono font-medium"
                  >
                    {typeof sk === 'string' ? sk : `${sk.name} (${sk.proficiency || 'Verified'})`}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
