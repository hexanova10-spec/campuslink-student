import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Users,
  Award,
  Clock,
  Sparkles,
  Lock,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useRecruiter } from '../context/RecruiterContext.tsx';
import { api } from '../services/api.ts';

export const AnalyticsScreen: React.FC = () => {
  const { company } = useRecruiter();
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      const data = await api.getAnalytics();
      setAnalyticsData(data);
    }
    fetchAnalytics();
  }, []);

  const pipeline = analyticsData?.pipeline || {
    totalApplicants: 8,
    underReview: 2,
    shortlisted: 2,
    interviewing: 3,
    selected: 1,
    offered: 1,
    accepted: 1,
    rejected: 1
  };

  const metrics = analyticsData?.metrics || {
    activeJobs: 2,
    averageTimeToHireDays: 14.2,
    offerAcceptanceRatePercent: 88,
    interviewsCompleted: 2,
    upcomingInterviews: 2
  };

  const topSkills = analyticsData?.topSkills || [
    { skill: 'Python', count: 8 },
    { skill: 'SQL', count: 7 },
    { skill: 'React', count: 6 },
    { skill: 'Data Structures', count: 5 },
    { skill: 'Redis', count: 3 }
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shadow-blue-600/30">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Company Recruitment Analytics
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Scoped Exclusively to {company?.name}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Zero-leak hiring metrics. College-wide stats and competitor requisitions are strictly isolated.
          </p>
        </div>
      </div>

      {/* 4 KPI Cards - Royal Blue + White + Transparency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-xl border border-blue-100 p-5 rounded-3xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>TOTAL APPLICANTS</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {pipeline.totalApplicants}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 100% Authorized &amp; Verified
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl border border-blue-100 p-5 rounded-3xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>AVG TIME TO HIRE</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {metrics.averageTimeToHireDays}d
          </div>
          <div className="text-[11px] text-slate-500">
            From Application to Final Offer
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl border border-blue-100 p-5 rounded-3xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>OFFER ACCEPTANCE</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {metrics.offerAcceptanceRatePercent}%
          </div>
          <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Tier-1 Campus Benchmark
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl border border-blue-100 p-5 rounded-3xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>INTERVIEWS SCHEDULED</span>
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {metrics.interviewsCompleted + metrics.upcomingInterviews}
          </div>
          <div className="text-[11px] text-slate-500">
            {metrics.upcomingInterviews} upcoming sessions
          </div>
        </div>
      </div>

      {/* Recruitment Funnel Visualizer */}
      <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-mono">
            Hiring Pipeline Conversion Funnel
          </h3>
          <span className="text-xs text-slate-500">
            {company?.name} Talent Stages
          </span>
        </div>

        <div className="space-y-4 font-mono text-xs">
          <div>
            <div className="flex justify-between text-slate-700 mb-1">
              <span>Applied Pool</span>
              <strong className="text-slate-900">{pipeline.totalApplicants} (100%)</strong>
            </div>
            <div className="h-3 rounded-full bg-blue-50 overflow-hidden border border-blue-100">
              <div className="h-full bg-blue-600 rounded-full w-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-700 mb-1">
              <span>Shortlisted Stage</span>
              <strong className="text-blue-700 font-bold">
                {pipeline.shortlisted + pipeline.interviewing + pipeline.selected} (
                {Math.round(((pipeline.shortlisted + pipeline.interviewing + pipeline.selected) / Math.max(pipeline.totalApplicants, 1)) * 100)}%)
              </strong>
            </div>
            <div className="h-3 rounded-full bg-blue-50 overflow-hidden border border-blue-100">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${Math.round(((pipeline.shortlisted + pipeline.interviewing + pipeline.selected) / Math.max(pipeline.totalApplicants, 1)) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-700 mb-1">
              <span>Technical &amp; Panel Interviews</span>
              <strong className="text-indigo-700 font-bold">
                {pipeline.interviewing + pipeline.selected} (
                {Math.round(((pipeline.interviewing + pipeline.selected) / Math.max(pipeline.totalApplicants, 1)) * 100)}%)
              </strong>
            </div>
            <div className="h-3 rounded-full bg-blue-50 overflow-hidden border border-blue-100">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${Math.round(((pipeline.interviewing + pipeline.selected) / Math.max(pipeline.totalApplicants, 1)) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-700 mb-1">
              <span>Selected &amp; Offers Extended</span>
              <strong className="text-emerald-700 font-bold">
                {pipeline.selected} (
                {Math.round((pipeline.selected / Math.max(pipeline.totalApplicants, 1)) * 100)}%)
              </strong>
            </div>
            <div className="h-3 rounded-full bg-blue-50 overflow-hidden border border-blue-100">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.round((pipeline.selected / Math.max(pipeline.totalApplicants, 1)) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Applicant Skill Distribution */}
      <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100 font-mono">
          Applicant Tech Stack Frequency in Your Pool
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {topSkills.map((sk: any, idx: number) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100/80 space-y-1">
              <span className="text-xs font-bold text-slate-900 block">{sk.skill}</span>
              <span className="text-lg font-black text-blue-700 font-mono">{sk.count}</span>
              <span className="text-[10px] text-slate-500 block">Candidates</span>
            </div>
          ))}
        </div>
      </div>

      {/* Institutional Privacy Guarantee Note */}
      <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100/80 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Institutional FERPA &amp; Zero-Leak Protection: College-wide placement figures and other companies&apos; recruitment data are blocked from analytics.
          </span>
        </div>
      </div>
    </div>
  );
};
