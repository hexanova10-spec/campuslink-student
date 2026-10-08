import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  AlertTriangle,
  Database,
  FileCode,
  CheckCircle2,
  Copy,
  Terminal,
  Activity,
  UserX
} from 'lucide-react';
import { useRecruiter } from '../context/RecruiterContext.tsx';
import { api } from '../services/api.ts';

export const SecuritySettingsScreen: React.FC = () => {
  const { company, recruiter, auditLogs, refreshData } = useRecruiter();

  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [schemaSql, setSchemaSql] = useState<string>('');
  const [copiedSql, setCopiedSql] = useState(false);

  const handleTestUnauthorizedAccess = async (type: 'UNAPPLIED_STUDENT' | 'COMPETITOR_CANDIDATE') => {
    try {
      setIsTesting(true);
      const res = await api.testUnauthorizedAccess(type);
      setTestResult(res.data);
      await refreshData();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsTesting(false);
    }
  };

  const handleLoadSchema = async () => {
    const res = await api.getSchemaSql();
    setSchemaSql(res.schemaSql);
  };

  const handleCopySchema = () => {
    if (!schemaSql) return;
    navigator.clipboard.writeText(schemaSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shadow-blue-600/30">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Security, Privacy &amp; PostgreSQL Architecture
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Zero-Leak Enforced
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Institutional verification of row-level candidate privacy, security audit logs, and PostgreSQL relational schema.
          </p>
        </div>
      </div>

      {/* Security Clearance Inspector Card - Royal Blue + White + Transparency */}
      <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
          <span>Active Recruiter Access Clearance</span>
          <span className="text-xs text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            STRICT_FERPA_ISOLATION
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-1">
            <span className="text-slate-400 block uppercase text-[10px] font-sans font-bold">Active Organization</span>
            <p className="font-bold text-slate-900 text-sm">{company?.name}</p>
            <p className="text-slate-500 text-[11px] font-sans">Tenant ID: {company?.id}</p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-1">
            <span className="text-slate-400 block uppercase text-[10px] font-sans font-bold">Authenticated Recruiter</span>
            <p className="font-bold text-slate-900 text-sm">{recruiter?.name}</p>
            <p className="text-slate-500 text-[11px] font-sans">{recruiter?.designation}</p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-1">
            <span className="text-slate-400 block uppercase text-[10px] font-sans font-bold">Data Boundary Rule</span>
            <p className="font-bold text-blue-700 text-sm">ROW_LEVEL_APPLICATION_JOIN</p>
            <p className="text-slate-500 text-[11px] font-sans">Unapplied directory strictly blocked</p>
          </div>
        </div>

        {/* Live Boundary Testing Suite */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Interactive Privacy Boundary Tester
            </h4>
            <p className="text-[11px] text-slate-500">
              Trigger simulated backend access attempts to verify that unauthorized candidate queries are halted with HTTP 403 Forbidden.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleTestUnauthorizedAccess('UNAPPLIED_STUDENT')}
              disabled={isTesting}
              className="px-4 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <UserX className="w-4 h-4 text-rose-600" />
              <span>Simulate Query: Unapplied Student (#stu-unapplied-99)</span>
            </button>

            <button
              onClick={() => handleTestUnauthorizedAccess('COMPETITOR_CANDIDATE')}
              disabled={isTesting}
              className="px-4 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <Lock className="w-4 h-4 text-rose-600" />
              <span>Simulate Query: Competitor Applicant (#stu-nova-01)</span>
            </button>
          </div>

          {testResult && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-rose-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> HTTP 403 FORBIDDEN CONFIRMED
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Target: {testResult.attemptedTargetName}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed font-mono text-[11px]">
                {testResult.message}
              </p>
              <div className="text-[10px] text-emerald-700 font-mono font-bold">
                Enforcement mechanism: {testResult.backendEnforcement}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Audit Logs Stream */}
      <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-mono flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" /> Institutional Security Audit Trail ({auditLogs.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            IP: 103.21.144.12
          </span>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className={`p-3.5 rounded-2xl border text-xs flex items-start justify-between gap-3 ${
                log.severity === 'CRITICAL_SECURITY'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-blue-50/40 border-blue-100 text-slate-800'
              }`}
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2 font-mono">
                  <span
                    className={`font-bold text-[11px] ${
                      log.severity === 'CRITICAL_SECURITY'
                        ? 'text-rose-600'
                        : 'text-blue-700'
                    }`}
                  >
                    [{log.action}]
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed truncate max-w-2xl text-slate-700">
                  {log.details}
                </p>
              </div>

              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white border border-blue-100 text-slate-600 shrink-0">
                {log.entityType}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* PostgreSQL Schema Definition */}
      <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-mono">
              Production PostgreSQL Relational DDL Schema
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {!schemaSql && (
              <button
                onClick={handleLoadSchema}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Inspect Schema DDL
              </button>
            )}

            {schemaSql && (
              <button
                onClick={handleCopySchema}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSql ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy SQL
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {schemaSql && (
          <pre className="p-4 rounded-2xl bg-slate-900 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-96 leading-relaxed">
            {schemaSql}
          </pre>
        )}
      </div>
    </div>
  );
};
