import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  User,
  Bot,
  ShieldCheck,
  RotateCcw,
  HelpCircle,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useRecruiter } from '../context/RecruiterContext.tsx';
import { api } from '../services/api.ts';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  'Show my top candidates.',
  'Why is Rahul ranked #1?',
  'How many applicants meet all mandatory requirements?',
  'Which candidates have AWS?',
  'Which interviews are pending?',
  'Which offers are awaiting acceptance?',
  'Summarize my hiring pipeline.'
];

export const AIAssistantScreen: React.FC = () => {
  const { company, recruiter } = useRecruiter();

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: `Hello ${recruiter?.name}! I am your private CampusLink Recruitment Copilot. I have analyzed your active requisitions, authorized applicants, scheduled interviews, and compensation packages for ${company?.name}. How can I assist your candidate evaluation today?`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isSending) return;

    const userMsg: Message = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsSending(true);

    try {
      const res = await api.askAIAssistant(query);
      const botMsg: Message = {
        sender: 'assistant',
        text: res.reply || 'Analysis completed for your authorized pool.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Unable to reach assistant engine. Please verify connection.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full space-y-6 flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-blue-100 shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shadow-blue-600/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Private Recruiter AI Copilot
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Scoped to {company?.name}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Gemini 3.8 Flash technical copilot querying ONLY your company&apos;s authorized candidates, jobs, and interviews.
          </p>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                sender: 'assistant',
                text: `Session reset. Ready to answer questions on your ${company?.name} recruitment drive.`,
                timestamp: 'Just now'
              }
            ])
          }
          className="text-xs text-slate-500 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto cursor-pointer font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Clear History
        </button>
      </div>

      {/* Suggested Prompts Carousel */}
      <div className="shrink-0 space-y-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
          Frequently Asked Talent Queries:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={isSending}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white hover:bg-blue-50/80 border border-blue-100 text-slate-700 hover:text-blue-700 transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
            >
              &quot;{prompt}&quot;
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log - Royal Blue + White + Transparency */}
      <div className="flex-1 bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-5 overflow-y-auto space-y-4 shadow-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-blue-700" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-4 space-y-1.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-sm shadow-blue-600/20'
                  : 'bg-blue-50/50 border border-blue-100 text-slate-800 rounded-tl-none whitespace-pre-wrap'
              }`}
            >
              <div className="flex items-center justify-between gap-4 text-[10px] opacity-75 font-mono">
                <span>{msg.sender === 'user' ? recruiter?.name : 'CampusLink AI'}</span>
                <span>{msg.timestamp}</span>
              </div>
              <p className={msg.sender === 'user' ? 'text-white' : 'text-slate-800'}>{msg.text}</p>
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex items-center gap-2 text-xs text-blue-700 p-2 font-medium">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
            <span>Analyzing authorized applicant database with Gemini...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="shrink-0 flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about applicants, rankings, skills, pending interviews, or offers..."
            className="w-full bg-white border border-blue-100 rounded-2xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50 active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
