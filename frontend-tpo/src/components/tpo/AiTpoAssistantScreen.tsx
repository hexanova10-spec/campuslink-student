import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Shield, User, CornerDownLeft, Lock } from 'lucide-react';
import { repo } from '../../services/storage';
import { queryCollegeAIAssistant } from '../../services/geminiService';
import { AIMessage } from '../../types';

export const AiTpoAssistantScreen: React.FC = () => {
  const institution = repo.getEffectiveInstitution();
  const students = repo.getStudents();
  const jobs = repo.getJobs();
  const drives = repo.getDrives();
  const conflicts = repo.getConflicts();
  const offers = repo.getOffers();

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      content: `Hello! I am your private Placement Operations AI Advisor for ${institution.name} (${institution.code}).\n\nI am securely bound to your authorized institutional data and cannot access other institutions' student records. How can I assist your placement operations today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextScope: 'COLLEGE_RESTRICTED',
      suggestedActions: [
        'Which students are currently at risk?',
        'Which branch has the lowest placement rate?',
        'Which upcoming drives have scheduling conflicts?',
        'Show summary of active job offers'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSendMessage = async (textToSend?: string) => {
    const q = textToSend || inputText;
    if (!q.trim() || isThinking) return;

    const userMsg: AIMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextScope: 'COLLEGE_RESTRICTED'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      const responseText = await queryCollegeAIAssistant(q, {
        institution,
        students,
        jobs,
        drives,
        conflicts,
        offers
      });

      const assistantMsg: AIMessage = {
        id: `msg-resp-${Date.now()}`,
        sender: 'assistant',
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        contextScope: 'COLLEGE_RESTRICTED'
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-tight">
              AI Placement Directorate Co-Pilot
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              TENANT ISOLATED: {institution.code}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Grounded strictly in {institution.name} student academics, drive logs, offers, and audit records.
          </p>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-600/30">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl rounded-2xl p-4 text-xs space-y-2 ${
              msg.sender === 'user'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900 border border-slate-800 text-slate-200 shadow-xl'
            }`}>
              <div className="whitespace-pre-line leading-relaxed">{msg.content}</div>

              {msg.suggestedActions && (
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Suggested Inquiries:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(action)}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-indigo-300 text-[11px] transition text-left"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className={`text-[10px] text-right font-mono ${
                msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'
              }`}>
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 border border-slate-700">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
              <span>Querying authorized institutional databases...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="pt-2">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-slate-900 border border-slate-700 p-2 rounded-2xl shadow-xl focus-within:border-indigo-500"
        >
          <input
            type="text"
            placeholder="Ask about at-risk students, drive conflicts, branch placements, active offers..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-xs text-slate-100 placeholder-slate-500 px-2"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className={`p-2 rounded-xl transition ${
              inputText.trim() && !isThinking
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
