import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  User,
  GraduationCap,
  Code2,
  FolderGit2,
  Briefcase,
  Award,
  FileText,
  Compass,
  Target,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Plus,
  Trash2
} from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const { student, setCurrentScreen, refreshStudentData } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 10;
  const [loading, setLoading] = useState(false);
  const [completionSummary, setCompletionSummary] = useState<any | null>(null);

  // Step 1: Personal
  const [personal, setPersonal] = useState({
    fullName: student?.full_name || 'Aarav Sharma',
    mobile: student?.mobile || '+91 98765 43210',
    collegeName: student?.college_name || 'National Institute of Technology',
    branch: student?.branch || 'Computer Science and Engineering',
    graduationYear: student?.graduation_year || 2026,
    bio: student?.bio || 'Passionate software engineering undergraduate eager to build scalable systems.',
  });

  // Step 2: Academics
  const [academic, setAcademic] = useState({
    cgpa: 8.7,
    tenthPercentage: 94.0,
    twelfthPercentage: 92.0,
    activeBacklogs: 0,
  });

  // Step 3: Skills
  const [skills, setSkills] = useState([
    { name: 'Python', category: 'backend', proficiency: 'Advanced' },
    { name: 'Data Structures & Algorithms', category: 'core_cs', proficiency: 'Advanced' },
    { name: 'SQL', category: 'database', proficiency: 'Advanced' },
    { name: 'React', category: 'frontend', proficiency: 'Advanced' },
    { name: 'Git', category: 'tools', proficiency: 'Advanced' },
    { name: 'Docker', category: 'cloud', proficiency: 'Intermediate' },
  ]);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'backend', proficiency: 'Intermediate' });

  // Step 4: Projects
  const [projects, setProjects] = useState([
    {
      title: 'Distributed Event-Driven Microservices Platform',
      techStack: 'Node.js, Redis, Docker, PostgreSQL',
      description: 'Engineered high-throughput event processing pipeline handling 12k req/sec with <50ms latency.',
      githubUrl: 'https://github.com/aaravsharma/distributed-platform',
      liveDemoUrl: 'https://demo.internal',
      highlightMetric: '42% lower latency',
    },
  ]);
  const [newProject, setNewProject] = useState({
    title: '',
    techStack: '',
    description: '',
    githubUrl: '',
    liveDemoUrl: '',
    highlightMetric: '',
  });

  // Step 5: Internships
  const [experiences, setExperiences] = useState([
    {
      companyName: 'CloudScale Technologies',
      role: 'Software Engineering Intern',
      startDate: '2025-06-01',
      endDate: '2025-08-31',
      responsibilities: 'Refactored backend microservices, optimized query latency, and authored unit tests.',
    },
  ]);

  // Step 6: Certifications
  const [certifications, setCertifications] = useState([
    {
      name: 'AWS Certified Cloud Practitioner',
      issuingOrganization: 'Amazon Web Services',
      issueDate: '2025-07-15',
      credentialId: 'AWS-CCP-948271',
    },
  ]);

  // Step 7: Resume
  const [resumeText, setResumeText] = useState(
    'Aarav Sharma | B.Tech CSE (8.7 CGPA) | Skills: Python, React, PostgreSQL, Docker, AWS | Experience: CloudScale Intern | Built Distributed order processing system with 12k req/sec.'
  );

  // Step 8: Career Interests
  const [interests, setInterests] = useState<string[]>([
    'Distributed Systems',
    'Cloud Architecture',
    'Full Stack Web Development',
    'High Frequency / Fintech Systems',
  ]);

  // Step 9: Target Job Roles
  const [targetRole, setTargetRole] = useState('Software Engineer');

  // Step 10: Preferred Locations
  const [locations, setLocations] = useState<string[]>(['Bangalore', 'Hyderabad', 'Pune', 'Remote']);

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;
    setSkills([...skills, { ...newSkill }]);
    setNewSkill({ name: '', category: 'backend', proficiency: 'Intermediate' });
  };

  const handleAddProject = () => {
    if (!newProject.title.trim()) return;
    setProjects([...projects, { ...newProject }]);
    setNewProject({ title: '', techStack: '', description: '', githubUrl: '', liveDemoUrl: '', highlightMetric: '' });
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        personal,
        academic,
        skills,
        projects,
        experiences,
        certifications,
        targetRole,
        preferredLocations: locations,
        bio: personal.bio,
      };

      const res = await api.submitOnboarding(payload);
      setCompletionSummary(res);
      await refreshStudentData();
    } catch (err: any) {
      alert('Error during onboarding: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = [
    'Personal Information',
    'Academic Performance',
    'Core Technical Skills',
    'Key Projects & Impact',
    'Internship Experience',
    'Certifications & Badges',
    'Resume Submission',
    'Career Interests',
    'Target Job Roles',
    'Preferred Locations',
  ];

  if (completionSummary) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white/90 dark:bg-[#070e22]/90 border border-blue-200/80 dark:border-blue-900/50 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 uppercase tracking-wider">
            AI Profile Initialized
          </span>

          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">Welcome to CampusLink Command Center!</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
            Your personalized dossier has been compiled. Here is your baseline AI readiness calculation:
          </p>

          <div className="grid grid-cols-2 gap-4 my-6">
            <div className="bg-blue-50/50 dark:bg-slate-950 p-4 rounded-2xl border border-blue-200/60 dark:border-slate-800 text-center">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Readiness Score</div>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {completionSummary.readinessScore?.overall_score || 82}/100
              </div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase mt-1">
                {completionSummary.readinessScore?.category || 'HIGHLY EMPLOYABLE'}
              </div>
            </div>

            <div className="bg-blue-50/50 dark:bg-slate-950 p-4 rounded-2xl border border-blue-200/60 dark:border-slate-800 text-center">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Skill Coverage</div>
              <div className="text-3xl font-extrabold text-blue-600 dark:text-indigo-400 mt-1">
                {completionSummary.skillGap?.coverage_percentage || 78}%
              </div>
              <div className="text-[10px] text-blue-700 dark:text-indigo-300 font-bold uppercase mt-1">
                For {targetRole}
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 rounded-2xl text-left mb-6">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">
              <Sparkles className="w-4 h-4 text-amber-500 dark:text-cyan-400" />
              <span>AI Placement Mentor Observation</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              "Strong algorithmic fundamentals and academic stability. Top campus drives like <strong>TechNova Solutions</strong> and <strong>Apex FinTech</strong> match your profile today."
            </p>
          </div>

          <button
            onClick={() => setCurrentScreen('dashboard')}
            className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Launch My Placement Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <span className="text-[11px] font-bold text-blue-600 dark:text-indigo-400 uppercase tracking-wider">
            Step {currentStep} of {totalSteps}
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{stepTitles[currentStep - 1]}</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Build your comprehensive student dossier to unlock verified placement drives and precision AI scoring.
          </p>
        </div>

        {/* Multi-step Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-900 h-2 rounded-full overflow-hidden mb-8 border border-slate-300 dark:border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Card Content */}
        <div className="bg-white/90 dark:bg-[#070e22]/90 border border-blue-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* STEP 1: Personal */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={personal.fullName}
                    onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                    className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile Contact</label>
                  <input
                    type="tel"
                    value={personal.mobile}
                    onChange={(e) => setPersonal({ ...personal, mobile: e.target.value })}
                    className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">University / Institute</label>
                <input
                  type="text"
                  value={personal.collegeName}
                  onChange={(e) => setPersonal({ ...personal, collegeName: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department / Branch</label>
                  <input
                    type="text"
                    value={personal.branch}
                    onChange={(e) => setPersonal({ ...personal, branch: e.target.value })}
                    className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Graduation Year</label>
                  <input
                    type="number"
                    value={personal.graduationYear}
                    onChange={(e) => setPersonal({ ...personal, graduationYear: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Elevator Bio / Career Objective</label>
                <textarea
                  rows={3}
                  value={personal.bio}
                  onChange={(e) => setPersonal({ ...personal, bio: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white resize-none focus:outline-none focus:border-blue-600"
                  placeholder="Share your technical interests and aspirations..."
                />
              </div>
            </div>
          )}

          {/* STEP 2: Academics */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Current CGPA (out of 10.0)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={academic.cgpa}
                    onChange={(e) => setAcademic({ ...academic, cgpa: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Active Backlogs</label>
                  <input
                    type="number"
                    value={academic.activeBacklogs}
                    onChange={(e) => setAcademic({ ...academic, activeBacklogs: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Class 10th Percentage (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={academic.tenthPercentage}
                    onChange={(e) => setAcademic({ ...academic, tenthPercentage: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Class 12th Percentage (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={academic.twelfthPercentage}
                    onChange={(e) => setAcademic({ ...academic, twelfthPercentage: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 dark:bg-slate-950 rounded-xl border border-blue-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                💡 Most Tier-1 campus recruiters set a hard cutoff of 7.0 or 7.5 CGPA with 0 active backlogs.
              </div>
            </div>
          )}

          {/* STEP 3: Skills */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-indigo-300 border border-blue-500/30 text-xs font-medium"
                  >
                    <span>{s.name} ({s.proficiency})</span>
                    <button
                      onClick={() => setSkills(skills.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="p-4 bg-blue-50/40 dark:bg-slate-950 rounded-2xl border border-blue-200/80 dark:border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-300">Add New Skill</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Skill name (e.g. AWS Cloud)"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="bg-white dark:bg-slate-900 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                  <select
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    className="bg-white dark:bg-slate-900 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="backend">Backend</option>
                    <option value="frontend">Frontend</option>
                    <option value="cloud">Cloud / DevOps</option>
                    <option value="database">Database</option>
                    <option value="core_cs">Core CS</option>
                  </select>
                  <select
                    value={newSkill.proficiency}
                    onChange={(e) => setNewSkill({ ...newSkill, proficiency: e.target.value })}
                    className="bg-white dark:bg-slate-900 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs text-white font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Projects */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-3">
                {projects.map((p, idx) => (
                  <div key={idx} className="p-3.5 bg-blue-50/40 dark:bg-slate-950 rounded-xl border border-blue-200/70 dark:border-slate-800 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-1">
                      <span>{p.title}</span>
                      <button
                        onClick={() => setProjects(projects.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-500 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] mb-1">{p.description}</p>
                    <span className="text-[10px] text-blue-700 dark:text-indigo-400 font-mono font-medium">Stack: {p.techStack}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-blue-50/40 dark:bg-slate-950 rounded-2xl border border-blue-200/80 dark:border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-300">Add Another Project</div>
                <input
                  type="text"
                  placeholder="Project Title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                />
                <input
                  type="text"
                  placeholder="Tech Stack (comma separated: React, Node, Redis)"
                  value={newProject.techStack}
                  onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                />
                <textarea
                  rows={2}
                  placeholder="Describe architecture & quantifiable impact..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 border border-blue-200/90 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white resize-none focus:outline-none focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs text-white font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Project</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Internships */}
          {currentStep === 5 && (
            <div className="space-y-4">
              {experiences.map((exp, idx) => (
                <div key={idx} className="p-4 bg-blue-50/40 dark:bg-slate-950 rounded-xl border border-blue-200/80 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>{exp.companyName} — {exp.role}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">{exp.startDate} to {exp.endDate}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">{exp.responsibilities}</p>
                </div>
              ))}
              <div className="p-3 bg-blue-50/60 dark:bg-slate-950 rounded-xl border border-blue-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                Internship experience adds up to +20 points to your overall Placement Project factor.
              </div>
            </div>
          )}

          {/* STEP 6: Certifications */}
          {currentStep === 6 && (
            <div className="space-y-4">
              {certifications.map((c, idx) => (
                <div key={idx} className="p-4 bg-blue-50/40 dark:bg-slate-950 rounded-xl border border-blue-200/80 dark:border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">{c.issuingOrganization} • Credential ID: {c.credentialId}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/30">Verified</span>
                </div>
              ))}
            </div>
          )}

          {/* STEP 7: Resume */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Paste / Preview Resume Text (Used for instant ATS verification)
              </label>
              <textarea
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white font-mono resize-none leading-relaxed focus:outline-none focus:border-blue-600"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                You can also upload structured PDF / DOCX versions in the dedicated Resume Locker.
              </p>
            </div>
          )}

          {/* STEP 8: Career Interests */}
          {currentStep === 8 && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Your Focus Areas</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Distributed Systems',
                  'Cloud Architecture',
                  'Full Stack Web Development',
                  'High Frequency / Fintech Systems',
                  'AI & Machine Learning',
                  'Cybersecurity',
                  'Data Engineering',
                  'Mobile Engineering',
                ].map((tag) => {
                  const selected = interests.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setInterests(
                          selected ? interests.filter((i) => i !== tag) : [...interests, tag]
                        )
                      }
                      className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                        selected
                          ? 'bg-blue-600 border-blue-600 text-white font-semibold shadow-sm'
                          : 'bg-white dark:bg-slate-950 border-blue-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 9: Target Job Roles */}
          {currentStep === 9 && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Primary Target Placement Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Software Engineer',
                  'Backend Developer',
                  'Frontend Developer',
                  'Full Stack Engineer',
                  'Cloud Engineer',
                  'Data Analyst',
                  'Data Scientist',
                ].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setTargetRole(role)}
                    className={`p-3.5 rounded-xl border text-xs text-left flex items-center justify-between transition-all cursor-pointer ${
                      targetRole === role
                        ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-md shadow-blue-600/25'
                        : 'bg-white dark:bg-slate-950 border-blue-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-blue-400'
                    }`}
                  >
                    <span>{role}</span>
                    {targetRole === role && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 10: Preferred Locations */}
          {currentStep === 10 && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Preferred Placement Locations
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Bangalore', 'Hyderabad', 'Pune', 'Gurugram', 'Mumbai', 'Chennai', 'Noida', 'Remote'].map((loc) => {
                  const isChecked = locations.includes(loc);
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() =>
                        setLocations(
                          isChecked ? locations.filter((l) => l !== loc) : [...locations, loc]
                        )
                      }
                      className={`p-3 rounded-xl border text-xs text-center transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                          : 'bg-white dark:bg-slate-950 border-blue-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                      }`}
                    >
                      {loc}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-blue-100 dark:border-slate-800">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-blue-200/80 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/25 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleFinalSubmit}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loading ? 'Synthesizing AI Dossier...' : 'Complete & Generate AI Readiness'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
