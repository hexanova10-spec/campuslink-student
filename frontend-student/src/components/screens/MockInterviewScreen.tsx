import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MockInterviewRecord } from '../../types/student';
import {
  BotMessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
  RotateCcw,
  BookOpen
} from 'lucide-react';

export const MockInterviewScreen: React.FC = () => {
  const { student, refreshStudentData } = useAuth();
  const [history, setHistory] = useState<MockInterviewRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Session Config
  const [role, setRole] = useState(student?.target_role || 'Software Engineer');
  const [difficulty, setDifficulty] = useState<'Junior' | 'Mid' | 'Senior'>('Mid');
  const [interviewType, setInterviewType] = useState<'Technical' | 'HR' | 'Behavioral' | 'System Design'>('Technical');

  // Active Session State
  const [inSession, setInSession] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [qaPairs, setQaPairs] = useState<Array<{ question: string; answer: string }>>([]);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);

  const fetchHistory = async () => {
    try {
      const res = await api.getMockInterviews();
      setHistory(res);
    } catch (err) {
      console.error('Failed to load mock interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const startInterview = async () => {
    setInSession(true);
    setQaPairs([]);
    setUserAnswer('');
    setEvaluationResult(null);
    await loadNextQuestion([]);
  };

  const loadNextQuestion = async (existingPairs: Array<{ question: string; answer: string }>) => {
    try {
      const q = await api.generateMockQuestion({
        role,
        difficulty,
        interviewType,
        history: existingPairs,
      });
      setCurrentQuestion(q);
      setUserAnswer('');
    } catch (err: any) {
      alert('Error generating question: ' + err.message);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim() || !currentQuestion) return;
    const newPairs = [...qaPairs, { question: currentQuestion.question, answer: userAnswer }];
    setQaPairs(newPairs);

    // If 2 questions answered, evaluate session!
    if (newPairs.length >= 2) {
      await finishAndEvaluate(newPairs);
    } else {
      await loadNextQuestion(newPairs);
    }
  };

  const finishAndEvaluate = async (finalPairs: Array<{ question: string; answer: string }>) => {
    setEvaluating(true);
    try {
      const res = await api.evaluateMockInterview({
        role,
        difficulty,
        interviewType,
        qaPairs: finalPairs,
      });
      setEvaluationResult(res.evaluation);
      setHistory([res.record, ...history]);
      await refreshStudentData();
    } catch (err: any) {
      alert('Evaluation error: ' + err.message);
    } finally {
      setEvaluating(false);
      setInSession(false);
      setCurrentQuestion(null);
    }
  };

  if (loading) {
    return <div className="text-xs text-slate-500 dark:text-slate-400 p-8 text-center">Loading mock interview simulator...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Placement Mock Interview Simulator</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Real-time multi-question simulation powered by Gemini AI with deterministic rubric scoring.
          </p>
        </div>
        {!inSession && (
          <button
            onClick={startInterview}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/25 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Launch New Mock Interview</span>
          </button>
        )}
      </div>

      {/* Simulator Interface */}
      {inSession ? (
        <div className="bg-white/85 dark:bg-[#070e22]/75 border border-blue-200/80 dark:border-blue-900/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-blue-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-700 dark:text-cyan-300 flex items-center justify-center font-bold text-sm border border-blue-200 dark:border-blue-800">
                Q{qaPairs.length + 1}
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                  {role} • {difficulty} Level
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{interviewType} Round</h3>
              </div>
            </div>
            <button
              onClick={() => finishAndEvaluate(qaPairs.length > 0 ? qaPairs : [{ question: currentQuestion?.question || '', answer: 'Skipped' }])}
              className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
            >
              End Session Early
            </button>
          </div>

          {currentQuestion ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-[#040814]/70 border border-blue-100 dark:border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-mono font-bold">Interviewer Prompt:</span>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                  "{currentQuestion.question}"
                </p>
                {currentQuestion.hint && (
                  <div className="text-[11px] text-blue-700 dark:text-blue-300 pt-1 border-t border-blue-200/60 dark:border-slate-800/80 flex items-center gap-1.5 font-medium">
                    <span>💡 Hint:</span>
                    <span>{currentQuestion.hint}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Answer (Type response or articulate architecture & trade-offs):
                </label>
                <textarea
                  rows={6}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Outline requirements, architecture components, concurrency considerations, and practical experience..."
                  className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 resize-none focus:outline-none focus:border-blue-600 font-sans leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Question {qaPairs.length + 1} of 2 for this sprint
                </span>
                <button
                  onClick={submitAnswer}
                  disabled={!userAnswer.trim()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/25 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <span>{qaPairs.length >= 1 ? 'Submit & Generate Evaluation' : 'Submit Answer & Next Question'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-500 dark:text-slate-400">
              Generating contextual question with Gemini AI...
            </div>
          )}
        </div>
      ) : evaluationResult ? (
        /* Evaluation Results Card */
        <div className="bg-white/85 dark:bg-[#070e22]/75 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-blue-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 uppercase">
                Mock Interview Audited
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-2">Overall Score: {evaluationResult.score_overall} / 100</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Your AI Readiness score has been updated with these results.
              </p>
            </div>
            <button
              onClick={() => setEvaluationResult(null)}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-xs font-semibold text-blue-700 dark:text-slate-200 border border-blue-200/80 dark:border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Dismiss & Back to Dashboard</span>
            </button>
          </div>

          {/* 4 Rubric Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-blue-50/60 dark:bg-slate-950 rounded-xl border border-blue-100 dark:border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Technical Accuracy</div>
              <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">{evaluationResult.technical_accuracy}%</div>
            </div>
            <div className="p-3 bg-blue-50/60 dark:bg-slate-950 rounded-xl border border-blue-100 dark:border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Communication</div>
              <div className="text-xl font-black text-blue-600 dark:text-cyan-400 mt-1">{evaluationResult.communication}%</div>
            </div>
            <div className="p-3 bg-blue-50/60 dark:bg-slate-950 rounded-xl border border-blue-100 dark:border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Clarity & Depth</div>
              <div className="text-xl font-black text-blue-600 dark:text-indigo-400 mt-1">{evaluationResult.clarity}%</div>
            </div>
            <div className="p-3 bg-blue-50/60 dark:bg-slate-950 rounded-xl border border-blue-100 dark:border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Confidence</div>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{evaluationResult.confidence}%</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-slate-950 border border-blue-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">Detailed Placement Feedback:</span>
            <p>{evaluationResult.detailed_feedback}</p>
          </div>

          {/* Strengths & Improvement */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-slate-950 border border-blue-100 dark:border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Observed Strengths</span>
              </span>
              <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                {(evaluationResult.strengths || []).map((s: string, idx: number) => (
                  <li key={idx}>• {s}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-slate-950 border border-blue-100 dark:border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Areas to Polish</span>
              </span>
              <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                {(evaluationResult.areas_for_improvement || []).map((a: string, idx: number) => (
                  <li key={idx}>• {a}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* Configuration Card before session starts */
        <div className="bg-white/85 dark:bg-[#070e22]/75 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-6 shadow-xl space-y-4 backdrop-blur-xl">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Configure Simulation Parameters</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Engineering Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="Backend Developer">Backend Systems Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Cloud Engineer">Cloud & DevOps Engineer</option>
                <option value="Data Scientist">Data Scientist & ML</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Seniority Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              >
                <option value="Junior">Junior (Campus Fresher)</option>
                <option value="Mid">Mid Level (Tier-1 Bar)</option>
                <option value="Senior">Senior (High Complexity)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Interview Round Type</label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value as any)}
                className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              >
                <option value="Technical">Technical Deep-Dive</option>
                <option value="System Design">System Architecture & Design</option>
                <option value="HR">HR & Cultural Alignment</option>
                <option value="Behavioral">Behavioral (STAR Method)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Historical Sessions */}
      <div className="bg-white/85 dark:bg-[#070e22]/75 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-6 shadow-xl space-y-4 backdrop-blur-xl">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-blue-600 dark:text-indigo-400" />
          <span>Completed Mock Interview History</span>
        </h3>

        {history.length > 0 ? (
          <div className="space-y-3">
            {history.map((h) => (
              <div
                key={h.id}
                className="p-4 rounded-xl bg-blue-50/60 dark:bg-slate-950 border border-blue-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{h.role}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold">
                      {h.interview_type}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {new Date(h.completed_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-1 line-clamp-1">{h.feedback}</p>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{h.score_overall}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400"> / 100</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-3 text-center">No mock sessions completed yet.</p>
        )}
      </div>
    </div>
  );
};
