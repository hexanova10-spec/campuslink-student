import React, { useState } from 'react';
import {
  FileUp,
  FileText,
  Sparkles,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useRecruiter } from '../context/RecruiterContext.tsx';
import { api } from '../services/api.ts';

const SAMPLE_JDS = [
  {
    title: 'FinTech Full Stack & Low Latency Engineer',
    category: 'Quantitative Trading Tech',
    text: `Job Title: Graduate Software Engineer - Low Latency & Microservices
Company: Apex Fintech Labs
Department: Core Trading Infrastructure
Location: Bengaluru / Mumbai (Hybrid)
CTC: ₹18,00,000 - ₹24,00,000 per annum
Openings: 8

About Us:
Apex Fintech Labs builds world-class algorithmic trading execution engines processing over 150,000 orders/second. We are seeking elite campus engineering graduates from the Class of 2027.

Responsibilities:
- Build fault-tolerant microservices using asynchronous Python and high-performance React web interfaces.
- Design normalized schemas and high-speed query indexing on PostgreSQL and Redis.
- Architect real-time WebSocket market telemetry dashboards.
- Write robust unit tests, benchmarks, and participate in peer code reviews.

Eligibility & Academic Criteria:
- Degree: B.Tech / B.E. / M.Tech in Computer Science, Information Technology, or allied branches (Graduation Year: 2027).
- Minimum CGPA: 8.00 out of 10.00.
- Backlogs: Strict zero active backlogs permitted.

Required Core Skills:
- Strong proficiency in Python, SQL, and modern React.
- Solid understanding of Data Structures, Algorithms, and Object-Oriented Design.
- Practical knowledge of REST APIs and relational database transactions.

Preferred Bonus Skills:
- Exposure to Kafka message brokers, Docker containers, and AWS Cloud.
- Competitive programming experience on LeetCode or Codeforces.`
  },
  {
    title: 'Quantitative Alpha Research Analyst',
    category: 'Financial Engineering',
    text: `Job Title: Quantitative Trading Research Analyst
Department: Quantitative Strategies & Alpha Research
Location: Mumbai (BKC)
CTC: ₹22.0 - ₹28.0 LPA (Base + Guaranteed + Performance Bonus)

Role Overview:
Analyze tick-by-tick financial market data, backtest statistical arbitrage models, and design automated execution signals.

Key Requirements:
- B.Tech or Dual Degree in Computer Science, Mathematics & Computing, or Electrical Engineering.
- Minimum CGPA 8.50.
- Mandatory Skills: Python, Probability & Statistics, Linear Algebra, SQL, Pandas, NumPy.
- Preferred: C++, Machine Learning, Time Series Analysis (GARCH, ARIMA).
- Prior research project in mathematical modeling or financial backtesting is heavily preferred.`
  }
];

export const JDUploadScreen: React.FC = () => {
  const { setParsedJD, setActiveScreen } = useRecruiter();
  const [jdText, setJdText] = useState(SAMPLE_JDS[0].text);
  const [fileName, setFileName] = useState<string | null>('Apex_Graduate_Software_Engineer_2027.pdf');
  const [isParsing, setIsParsing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) setJdText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleParseJD = async () => {
    if (!jdText || jdText.trim().length < 20) {
      setErrorMsg('Please paste or upload a detailed Job Description.');
      return;
    }

    try {
      setIsParsing(true);
      setErrorMsg(null);
      const res = await api.parseJD(jdText);
      if (res.success && res.parsed) {
        setParsedJD(res.parsed);
        setActiveScreen('ai_jd_analysis');
      } else {
        setErrorMsg('Failed to parse JD. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Parsing error: ' + (err.message || 'Check server connection.'));
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shadow-blue-600/30">
              <FileUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              AI Job Description Parser
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Gemini 3.8 Flash
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload any PDF or Word JD file, or paste raw text. Gemini extracts role, skills, eligibility cutoffs, and compensation.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider font-mono">
          Try Ready-to-Use Sample Campus JDs:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SAMPLE_JDS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setJdText(sample.text);
                setFileName(`${sample.title.replace(/\s+/g, '_')}.pdf`);
              }}
              className="p-3.5 rounded-2xl bg-white hover:bg-blue-50/60 border border-blue-100 hover:border-blue-300 text-left transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                  {sample.title}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md font-mono bg-blue-50 text-blue-700 border border-blue-100 font-semibold">
                  {sample.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                Click to load sample requirements into parser...
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-xl border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-3xl p-7 text-center transition-colors shadow-2xs">
        <input
          type="file"
          id="jd-file-input"
          accept=".pdf,.docx,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
        <label
          htmlFor="jd-file-input"
          className="flex flex-col items-center justify-center cursor-pointer space-y-2"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
            <UploadCloud className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900">
              {fileName ? `Loaded: ${fileName}` : 'Choose PDF, DOCX, or Text file'}
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Drag &amp; drop or browse campus requisition document
            </p>
          </div>
        </label>
      </div>

      <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 sm:p-7 space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800">
            Raw Job Description Text
          </label>
          <span className="text-[11px] text-slate-400 font-mono">
            {jdText.length} characters
          </span>
        </div>

        <textarea
          rows={10}
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste full Job Description text here..."
          className="w-full bg-slate-50/60 border border-blue-100 rounded-2xl p-4 text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none leading-relaxed"
        />

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" /> {errorMsg}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-500">
            Model: <strong className="text-blue-700 font-mono font-bold">Gemini 3.8 Flash</strong> with JSON Schema extraction
          </span>

          <button
            onClick={handleParseJD}
            disabled={isParsing}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <span>{isParsing ? 'Analyzing JD with Gemini...' : 'Analyze & Extract JD'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
