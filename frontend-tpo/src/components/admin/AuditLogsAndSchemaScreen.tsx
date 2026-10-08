import React, { useState } from 'react';
import { Database, ShieldCheck, Code, Download, FileText, CheckCircle2, Copy } from 'lucide-react';
import { repo } from '../../services/storage';

export const AuditLogsAndSchemaScreen: React.FC = () => {
  const auditLogs = repo.getAuditLogs();
  const [activeTab, setActiveTab] = useState<'AUDIT_LOGS' | 'POSTGRES_DDL' | 'SQLALCHEMY_MODELS' | 'API_CONTRACTS'>('AUDIT_LOGS');
  const [copiedSuccess, setCopiedSuccess] = useState<string | null>(null);

  const sampleSqlDdl = `-- Production PostgreSQL DDL with Row-Level Security
CREATE TABLE candidate_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    granted_by_tpo_id UUID NOT NULL REFERENCES users(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    access_status VARCHAR(32) DEFAULT 'ACTIVE',
    data_visibility_scope VARCHAR(64) DEFAULT 'FULL_VERIFIED_PROFILE'
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
CREATE POLICY tpo_institution_isolation ON students
    FOR ALL
    USING (
        institution_id = current_setting('app.current_institution_id', true)::uuid
        OR current_setting('app.current_user_role', true) = 'SYSTEM_ADMIN'
    );`;

  const sampleSqlAlchemy = `from sqlalchemy import Column, String, Integer, Numeric, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class CandidateAccess(Base):
    __tablename__ = "candidate_access"
    id = Column(UUID(as_uuid=True), primary_key=True)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"), nullable=False)
    granted_by_tpo_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    access_status = Column(String(32), default="ACTIVE")`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSuccess(label);
    setTimeout(() => setCopiedSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
              Audit Logs & Database Schema Architecture
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              PostgreSQL & SQLAlchemy Ready
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Immutable administrative audit trail (Who, What, When, Where) and production PostgreSQL DDL & ORM schemas for instant database pluggability.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('AUDIT_LOGS')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${
              activeTab === 'AUDIT_LOGS' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Logs ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('POSTGRES_DDL')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${
              activeTab === 'POSTGRES_DDL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            PostgreSQL DDL Schema
          </button>
          <button
            onClick={() => setActiveTab('SQLALCHEMY_MODELS')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${
              activeTab === 'SQLALCHEMY_MODELS' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            SQLAlchemy 2.0 ORM
          </button>
        </div>
      </div>

      {copiedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{copiedSuccess} copied to clipboard!</span>
        </div>
      )}

      {/* TAB 1: AUDIT LOGS TABLE */}
      {activeTab === 'AUDIT_LOGS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-3">Who (Actor & Role)</th>
                <th className="py-3 px-3">What (Action)</th>
                <th className="py-3 px-3">Resource Target</th>
                <th className="py-3 px-4">Audit Details & Rationale</th>
                <th className="py-3 px-3 text-right">From Where (IP Address)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <div className="font-semibold text-white">{log.userName}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{log.userRole}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.action.includes('APPROVAL') || log.action.includes('RELEASE')
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : log.action.includes('REJECT') || log.action.includes('REVOKE')
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-indigo-500/20 text-indigo-300'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {log.resourceType}: {log.resourceId.slice(0, 12)}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-300 max-w-sm truncate">
                    {log.details}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: POSTGRESQL DDL SCHEMA */}
      {activeTab === 'POSTGRES_DDL' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white">PostgreSQL Production DDL (src/db/schema.sql)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Includes UUID extensions, RLS policies, indexes, and foreign key cascades.</p>
            </div>
            <button
              onClick={() => handleCopy(sampleSqlDdl, 'PostgreSQL Schema')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy SQL</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
            {sampleSqlDdl}
          </pre>
        </div>
      )}

      {/* TAB 3: SQLALCHEMY 2.0 ORM */}
      {activeTab === 'SQLALCHEMY_MODELS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white">SQLAlchemy 2.0 Models (src/db/sqlalchemy_models.py)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Ready for FastAPI, Flask, or async Alembic migrations.</p>
            </div>
            <button
              onClick={() => handleCopy(sampleSqlAlchemy, 'SQLAlchemy Models')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Python</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
            {sampleSqlAlchemy}
          </pre>
        </div>
      )}
    </div>
  );
};
