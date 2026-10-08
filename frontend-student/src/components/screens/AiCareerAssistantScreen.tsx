import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { AiMessage } from '../../types/student';
import {
  Sparkles,
  Send,
  User,
  ShieldCheck,
  Zap,
  Target,
  FileText,
  CalendarCheck2,
  BookOpen
} from 'lucide-react';

export const AiCareerAssistantScreen: React.FC = () => {
  const { student } = useAuth();
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Create a 30-day placement sprint plan for me.',
    'Why is my readiness score 82 and how do I reach 90+?',
    'What specific cloud skills should I learn for TechNova?',
    'How do I improve my resume for ATS parsers?',
    'Give me 5 behavioral STAR questions to practice.',
  ];

  const fetchMessages = async () => {
    try {
      const res = await api.getAiMessages();
      setMessages(res);
    } catch (err) {
      console.error('Failed to load AI messages:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    setInputMessage('');
    const tempUserMsg: AiMessage = {
      id: `temp-${Date.now()}`,
      conversation_id: 'conv-1',
      student_id: student?.id || '',
      sender: 'student',
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const res = await api.sendAiMessage(text);
      setMessages((prev) => [...prev, res.message]);
    } catch (err: any) {
      alert('AI Assistant Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8.5rem)] flex flex-col space-y-4 animate-in fade-in duration-200">
      {/* Header in Transparent Glass */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-[#070e22]/75 backdrop-blur-xl border border-blue-200/80 dark:border-blue-900/50 shadow-xl flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/25 text-white">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 dark:text-white">Private AI Placement Mentor & Coach</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                Authorized Context Only
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Coaching student: <strong>{student?.full_name}</strong> ({student?.target_role})
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Prompts Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-shrink-0 select-none">
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-[#070e22]/75 backdrop-blur-md border border-blue-200/80 dark:border-blue-900/50 hover:border-blue-500 text-[11px] text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white whitespace-nowrap transition-colors flex items-center gap-1.5 flex-shrink-0 shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-blue-500" />
            <span>{p}</span>
          </button>
        ))}
      </div>

      {/* Conversation Stream */}
      <div className="flex-1 bg-white/70 dark:bg-[#070e22]/70 backdrop-blur-xl border border-blue-200/80 dark:border-blue-900/50 rounded-3xl p-4 sm:p-6 overflow-y-auto space-y-4 shadow-2xl">
        {messages.map((m) => {
          const isUser = m.sender === 'student';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-md'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/20'
                    : 'bg-blue-50/70 dark:bg-[#040814]/80 border border-blue-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {m.content}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-blue-50/70 dark:bg-[#040814]/80 border border-blue-100 dark:border-slate-800 p-3.5 rounded-2xl text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>Synthesizing placement strategy with Gemini AI...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 p-2 bg-white/80 dark:bg-[#070e22]/80 backdrop-blur-xl border border-blue-200/80 dark:border-blue-900/50 rounded-2xl shadow-xl flex-shrink-0"
      >
        <input
          type="text"
          placeholder="Ask placement advice, request a 30-day plan, interview question prep..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || loading}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-600/25 disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
