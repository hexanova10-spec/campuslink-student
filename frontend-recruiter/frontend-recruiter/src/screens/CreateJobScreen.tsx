import React, { useState, useEffect } from 'react';
import {
  FilePlus,
  Sparkles,
  Save,
  CheckCircle2,
  Briefcase,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useRecruiter } from '../context/RecruiterContext.tsx';
import { api } from '../services/api.ts';

export const CreateJobScreen: React.FC = () => {
  const { company, parsedJD, setActiveScreen, refreshData } = useRecruiter();

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Core Engineering');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [preferredSkills, setPreferredSkills] = useState('');
  const [minCgpa, setMinCgpa] = useState('8.0');
  const [eligibleBranches, setEligibleBranches] = useState('Computer Science & Engineering, Information Technology, Data Science & AI');
  const [graduationYear, setGraduationYear] = useState('2027');
  const [maxBacklogsAllowed, setMaxBacklogsAllowed] = useState('0');
  const [experienceLevel, setExperienceLevel] = useState('Fresher / Final Year B.Tech');
  const [requiredCertifications, setRequiredCertifications] = useState('');
  const [ctcMinLpa, setCtcMinLpa] = useState('16.0');
  const [ctcMaxLpa, setCtcMaxLpa] = useState('22.0');
  const [ctcBreakdown, setCtcBreakdown] = useState('Base: ₹16.0 LPA | Performance: ₹3.0 LPA | Joining Bonus: ₹3.0 LPA');
  const [location, setLocation] = useState('Bengaluru / Mumbai');
  const [workMode, setWorkMode] = useState<'On-site' | 'Hybrid' | 'Remote'>('Hybrid');
  const [openings, setOpenings] = useState('6');
  const [deadline, setDeadline] = useState('2026-11-20');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    if (parsedJD) {
      if (parsedJD.role) setTitle(parsedJD.role);
      if (parsedJD.department) setDepartment(parsedJD.department);
      if (parsedJD.summary) setDescription(parsedJD.summary);
      if (parsedJD.responsibilities?.length) setResponsibilities(parsedJD.responsibilities.join('\n'));
      if (parsedJD.requiredSkills?.length) setRequiredSkills(parsedJD.requiredSkills.join(', '));
      if (parsedJD.preferredSkills?.length) setPreferredSkills(parsedJD.preferredSkills.join(', '));
      if (parsedJD.experience) setExperienceLevel(parsedJD.experience);
    }
  }, [parsedJD]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = {
        title,
        department,
        description,
        responsibilities: responsibilities.split('\n').filter((r) => r.trim().length > 0),
        requiredSkills: requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        preferredSkills: preferredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        minCgpa: parseFloat(minCgpa),
        eligibleBranches: eligibleBranches.split(',').map((b) => b.trim()).filter(Boolean),
        graduationYear: parseInt(graduationYear, 10),
        maxBacklogsAllowed: parseInt(maxBacklogsAllowed, 10),
        experienceLevel,
        requiredCertifications: requiredCertifications ? requiredCertifications.split(',').map((c) => c.trim()) : [],
        ctcMinLpa: parseFloat(ctcMinLpa),
        ctcMaxLpa: parseFloat(ctcMaxLpa),
        ctcBreakdown,
        location,
        workMode,
        openings: parseInt(openings, 10),
        deadline
      };

      await api.createJob(payload);
      await refreshData();
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        setActiveScreen('jobs');
      }, 1200);
    } catch (err) {
      console.error('Failed to create job:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shadow-blue-600/30">
              <FilePlus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Create Campus Requisition
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Define role parameters, academic eligibility cutoffs, mandatory skills, and CTC package for {company?.name}.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveScreen('jd_upload')}
          className="px-4 py-2 rounded-xl bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Auto-Fill via AI JD Parser</span>
        </button>
      </div>

      {parsedJD && (
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between text-xs text-blue-800">
          <span className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-blue-600" /> Loaded parameters extracted by Gemini 3.8 Flash from uploaded JD.
          </span>
          <span className="text-[10px] font-mono text-blue-700 font-bold bg-white px-2 py-0.5 rounded-md border border-blue-200">
            PRE-FILLED
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
            1. Role Title &amp; Core Description
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Software Engineer - Full Stack & High Throughput"
                required
                className="w-full bg-white border border-blue-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Engineering Department *
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Core Trading Technologies"
                required
                className="w-full bg-white border border-blue-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Role Summary &amp; Engineering Mission *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe role scope and technology stack..."
                required
                className="w-full bg-white border border-blue-100 rounded-2xl p-3.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Responsibilities (One per line)
              </label>
              <textarea
                rows={3}
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                placeholder="Architect microservices in Python and React&#10;Write unit and integration tests&#10;Optimize database queries on PostgreSQL"
                className="w-full bg-white border border-blue-100 rounded-2xl p-3.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 resize-none font-mono"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
            2. Required &amp; Preferred Competencies
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Mandatory Required Skills (Comma separated) *
              </label>
              <input
                type="text"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                placeholder="Python, SQL, React, Data Structures & Algorithms"
                required
                className="w-full bg-white border border-blue-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Evaluated as non-negotiable filters in AI candidate match.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Preferred / Nice to Have Skills (Comma separated)
              </label>
              <input
                type="text"
                value={preferredSkills}
                onChange={(e) => setPreferredSkills(e.target.value)}
                placeholder="Kafka, Docker, AWS, Redis, TypeScript"
                className="w-full bg-white border border-blue-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Experience Level
              </label>
              <input
                type="text"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full bg-white border border-blue-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Preferred Certifications
              </label>
              <input
                type="text"
                value={requiredCertifications}
                onChange={(e) => setRequiredCertifications(e.target.value)}
                placeholder="e.g. AWS Cloud Practitioner, DeepLearning.AI"
                className="w-full bg-white border border-blue-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
            3. Academic Eligibility &amp; Branch Restrictions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Minimum CGPA (out of 10) *
              </label>
              <input
                type="number"
                step="0.1"
                min="5.0"
                max="10.0"
                value={minCgpa}
                onChange={(e) => setMinCgpa(e.target.value)}
                required
                className="w-full bg-white border border-blue-100 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Graduation Year *
              </label>
              <input
                type="number"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                required
                className="w-full bg-white border border-blue-100 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Max Active Backlogs Allowed
              </label>
              <select
                value={maxBacklogsAllowed}
                onChange={(e) => setMaxBacklogsAllowed(e.target.value)}
                className="w-full bg-white border border-blue-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
              >
                <option value="0">0 (Strict No Backlogs)</option>
                <option value="1">1 Allowed</option>
                <option value="2">2 Allowed</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Eligible Campus Branches (Comma separated) *
              </label>
              <input
                type="text"
                value={eligibleBranches}
                onChange={(e) => setEligibleBranches(e.target.value)}
                required
                className="w-full bg-white border border-blue-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
            4. Compensation, Location &amp; Openings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Min CTC (LPA) *
              </label>
              <input
                type="number"
                step="0.5"
                value={ctcMinLpa}
                onChange={(e) => setCtcMinLpa(e.target.value)}
                required
                className="w-full bg-white border border-blue-100 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Max CTC (LPA) *
              </label>
              <input
                type="number"
                step="0.5"
                value={ctcMaxLpa}
                onChange={(e) => setCtcMaxLpa(e.target.value)}
                required
                className="w-full bg-white border border-blue-100 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Total Openings / Target Hires *
              </label>
              <input
                type="number"
                min="1"
                value={openings}
                onChange={(e) => setOpenings(e.target.value)}
                required
                className="w-full bg-white border border-blue-100 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                CTC Structure Breakdown Text
              </label>
              <input
                type="text"
                value={ctcBreakdown}
                onChange={(e) => setCtcBreakdown(e.target.value)}
                className="w-full bg-white border border-blue-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Work Mode
              </label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as any)}
                className="w-full bg-white border border-blue-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Job Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white border border-blue-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Application Deadline *
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="w-full bg-white border border-blue-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          {successMsg && (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Requisition Published Successfully!
            </span>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Publishing Requisition...' : 'Publish Campus Requisition'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
