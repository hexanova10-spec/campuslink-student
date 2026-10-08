import React from 'react';
import {
  Brain,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Tag,
  Briefcase,
  GraduationCap,
  ListChecks,
  AlertTriangle
} from 'lucide-react';
import { useRecruiter } from '../context/RecruiterContext.tsx';

export const AIJDAnalysisScreen: React.FC = () => {
  const { parsedJD, setActiveScreen } = useRecruiter();

  if (!parsedJD) {
    return (
      <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-10 text-center space-y-4 max-w-xl mx-auto my-12 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto">
          <Brain className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No Extracted JD Data Available</h3>
        <p className="text-xs text-slate-500">
          Upload or paste a Job Description document to trigger Gemini AI extraction.
        </p>
        <button
          onClick={() => setActiveScreen('jd_upload')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-md shadow-blue-600/20"
        >
          Go to JD Upload &amp; Parser
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shadow-blue-600/30">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Extracted Requisition Intelligence
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Gemini 3.8 Flash Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review parsed requirements before saving. You can modify any criteria in the requisition form.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveScreen('jd_upload')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-blue-50 text-slate-700 border border-blue-200 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-600" /> Re-Upload
          </button>

          <button
            onClick={() => setActiveScreen('create_job')}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Confirm &amp; Load into Job Creator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 sm:p-7 space-y-2 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 font-mono">
          Executive Requisition Summary
        </span>
        <p className="text-sm text-slate-800 leading-relaxed font-medium">
          {parsedJD.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider font-mono">
            <Briefcase className="w-4 h-4 text-blue-600" /> Role &amp; Team
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Designation:</span>
              <p className="text-base font-bold text-slate-900">{parsedJD.role}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Department:</span>
              <p className="text-sm text-slate-700">{parsedJD.department}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider font-mono">
            <GraduationCap className="w-4 h-4 text-emerald-600" /> Academic Eligibility &amp; Degree
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Eligibility Cutoff:</span>
              <p className="text-sm font-bold text-slate-900">{parsedJD.eligibility}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Education Requirement:</span>
              <p className="text-xs text-slate-700">{parsedJD.education}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Experience Level:</span>
              <p className="text-xs text-slate-700">{parsedJD.experience}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider font-mono">
            <ListChecks className="w-4 h-4 text-blue-600" /> Mandatory Required Skills ({parsedJD.requiredSkills.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {parsedJD.requiredSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200"
              >
                ✓ {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider font-mono">
            <Sparkles className="w-4 h-4 text-indigo-600" /> Preferred / Bonus Skills ({parsedJD.preferredSkills.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {parsedJD.preferredSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200"
              >
                + {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 space-y-3 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
            Key Responsibilities ({parsedJD.responsibilities.length})
          </span>
          <ul className="space-y-2">
            {parsedJD.responsibilities.map((resp, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                <span className="text-blue-600 font-bold shrink-0">•</span>
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2 bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider font-mono">
            <Tag className="w-4 h-4 text-blue-600" /> High-Impact Search Keywords
          </div>
          <div className="flex flex-wrap gap-2">
            {parsedJD.keywords.map((kw, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-blue-50/70 text-blue-800 border border-blue-200"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
