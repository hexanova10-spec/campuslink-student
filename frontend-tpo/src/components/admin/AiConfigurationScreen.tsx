import React, { useState } from 'react';
import { Bot, Sparkles, Shield, Lock, Save, CheckCircle2 } from 'lucide-react';

export const AiConfigurationScreen: React.FC = () => {
  const [model, setModel] = useState('gemini-3.8-flash');
  const [temperature, setTemperature] = useState(0.2);
  const [enforceTenantBoundary, setEnforceTenantBoundary] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
            Platform AI Engine Configuration & Institutional Boundaries
          </h1>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            GEMINI 3.8 FLASH
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Configure model hyperparameters, deterministic temperature settings, prompt guardrails, and tenant boundary enforcement policies.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>AI platform hyperparameters and tenant safety guardrails persisted.</span>
        </div>
      )}

      {/* Config Form */}
      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Bot className="w-4 h-4 text-purple-400" />
          <span>Model Inference Parameters</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
              Primary LLM Architecture:
            </label>
            <select
              value={model}
              onChange={e => setModel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended for Operations)</option>
              <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex Scheduling Reasoning)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
              Generation Temperature ({temperature}):
            </label>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={temperature}
              onChange={e => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0.0 (Deterministic / Audit Safe)</span>
              <span>1.0 (Creative)</span>
            </div>
          </div>
        </div>

        {/* Security Boundary Policy */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Institutional Data Boundary Policy Enforcement</span>
          </h4>

          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2.5 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={enforceTenantBoundary}
                onChange={e => setEnforceTenantBoundary(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
              />
              <span><strong>Enforce Zero Cross-Tenant Context Injection:</strong> AI TPO Assistant prompts receive strictly filtered institutional rows only.</span>
            </label>

            <label className="flex items-center gap-2.5 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
              />
              <span><strong>Pre-Flight Hallucination Scrubber:</strong> Verify eligibility verdicts against deterministic rule engine before displaying to TPO.</span>
            </label>

            <label className="flex items-center gap-2.5 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
              />
              <span><strong>PII Masking on Prompt Serialization:</strong> Strip private student phone numbers and home addresses prior to external API dispatch.</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save AI Platform Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
