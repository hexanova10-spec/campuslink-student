import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { mockDb, MASTER_JOBS, ROLE_SKILL_REQUIREMENTS } from './server/services/mockDb';
import {
  parseResumeWithGemini,
  generateInterviewQuestion,
  evaluateInterviewSession,
  askAiCareerAssistant,
  analyzeJobDescriptionWithGemini
} from './server/services/geminiService';

dotenv.config();

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'campuslink-student-jwt-secret-2026';

app.use(express.json({ limit: '15mb' }));

// ---------------------------------------------------------
// JWT Authorization Middleware
// Strictly extracts studentId from authenticated JWT
// Never trusts client-passed student_id
// ---------------------------------------------------------
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    studentId: string;
    email: string;
  };
}

function authenticateStudent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      studentId: string;
      email: string;
    };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Token has expired or is invalid' });
  }
}

// ---------------------------------------------------------
// 1. AUTHENTICATION ROUTES
// ---------------------------------------------------------

// Register Student
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { fullName, email, password, mobile, college, branch, graduationYear } = req.body;

    if (!fullName || !email || !password || !mobile || !college || !branch) {
      return res.status(400).json({ error: 'Please provide all required registration fields' });
    }

    const studentData = mockDb.registerStudent({
      fullName,
      email,
      password,
      mobile,
      college,
      branch,
      graduationYear: Number(graduationYear) || 2026
    });

    const token = jwt.sign(
      {
        userId: studentData.user.id,
        studentId: studentData.student.id,
        email: studentData.user.email
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Student registered successfully',
      token,
      student: studentData.student,
      onboardingCompleted: studentData.student.onboarding_completed
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
});

// Login Student
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = mockDb.getUserByEmail(email);
  if (!user || user.password_hash !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const studentData = mockDb.getStudentByUserId(user.id);
  if (!studentData) {
    return res.status(404).json({ error: 'Student profile not found for this account' });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      studentId: studentData.student.id,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    message: 'Login successful',
    token,
    student: studentData.student,
    onboardingCompleted: studentData.student.onboarding_completed
  });
});

// Forgot Password
app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = mockDb.getUserByEmail(email);
  if (!user) {
    // Standard security practice: Don't disclose email existence
    return res.json({ message: 'If this student email exists, a password reset link has been dispatched.' });
  }
  res.json({
    message: 'If this student email exists, a password reset link has been dispatched.',
    demoResetToken: 'demo-reset-campuslink-2026'
  });
});

// Reset Password
app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  const user = mockDb.getUserByEmail(email);
  if (user && newPassword) {
    user.password_hash = newPassword;
  }
  res.json({ message: 'Password has been reset successfully. Please log in with your new credentials.' });
});

// Current Authenticated User & Student Check
app.get('/api/auth/me', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const studentData = mockDb.getStudentById(req.user!.studentId);
  if (!studentData) {
    return res.status(404).json({ error: 'Student record not found' });
  }
  res.json({
    user: { id: studentData.user.id, email: studentData.user.email },
    student: studentData.student,
    onboardingCompleted: studentData.student.onboarding_completed
  });
});

// ---------------------------------------------------------
// 2. STUDENT ONBOARDING (10 STEPS)
// ---------------------------------------------------------
app.post('/api/student/onboarding', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });

  const {
    personal,
    academic,
    skills,
    projects,
    experiences,
    certifications,
    targetRole,
    preferredLocations,
    bio
  } = req.body;

  if (personal?.fullName) data.student.full_name = personal.fullName;
  if (personal?.mobile) data.student.mobile = personal.mobile;
  if (personal?.collegeName) data.student.college_name = personal.collegeName;
  if (personal?.branch) data.student.branch = personal.branch;
  if (personal?.graduationYear) data.student.graduation_year = Number(personal.graduationYear);
  if (bio) data.student.bio = bio;

  if (academic) {
    data.academics.cgpa = Number(academic.cgpa) || data.academics.cgpa;
    data.academics.tenth_percentage = Number(academic.tenthPercentage) || data.academics.tenth_percentage;
    data.academics.twelfth_percentage = Number(academic.twelfthPercentage) || data.academics.twelfth_percentage;
    data.academics.active_backlogs = Number(academic.activeBacklogs) || 0;
  }

  if (Array.isArray(skills) && skills.length > 0) {
    data.skills = skills.map((s: any, idx: number) => ({
      id: `sk-${Date.now()}-${idx}`,
      student_id: data.student.id,
      skill_name: s.name,
      category: s.category || 'tech',
      proficiency_level: s.proficiency || 'Intermediate',
      verified_by_test: false,
      years_experience: 1.0,
      created_at: new Date().toISOString()
    }));
  }

  if (Array.isArray(projects) && projects.length > 0) {
    data.projects = projects.map((p: any, idx: number) => ({
      id: `proj-${Date.now()}-${idx}`,
      student_id: data.student.id,
      title: p.title,
      description: p.description,
      tech_stack: Array.isArray(p.techStack) ? p.techStack : (p.techStack || '').split(',').map((x: string) => x.trim()),
      github_url: p.githubUrl,
      live_demo_url: p.liveDemoUrl,
      highlight_metric: p.highlightMetric || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  }

  if (Array.isArray(experiences) && experiences.length > 0) {
    data.experiences = experiences.map((e: any, idx: number) => ({
      id: `exp-${Date.now()}-${idx}`,
      student_id: data.student.id,
      company_name: e.companyName,
      role: e.role,
      location: e.location || 'Remote',
      employment_type: 'Internship',
      start_date: e.startDate || '2025-06-01',
      end_date: e.endDate,
      is_current: false,
      responsibilities: e.responsibilities || '',
      technologies_used: e.technologiesUsed || [],
      created_at: new Date().toISOString()
    }));
  }

  if (Array.isArray(certifications) && certifications.length > 0) {
    data.certifications = certifications.map((c: any, idx: number) => ({
      id: `cert-${Date.now()}-${idx}`,
      student_id: data.student.id,
      name: c.name,
      issuing_organization: c.issuingOrganization,
      issue_date: c.issueDate || '2025-01-01',
      credential_id: c.credentialId,
      credential_url: c.credentialUrl,
      verified: true,
      created_at: new Date().toISOString()
    }));
  }

  if (targetRole) data.student.target_role = targetRole;
  if (Array.isArray(preferredLocations)) data.student.preferred_locations = preferredLocations;

  data.student.onboarding_completed = true;

  // Recalculate AI readiness and skill gap
  mockDb.recalculateReadiness(data.student.id);
  mockDb.recalculateSkillGap(data.student.id, data.student.target_role);

  res.json({
    message: 'Onboarding completed successfully',
    student: data.student,
    readinessScore: data.readinessScore,
    skillGap: data.skillGap
  });
});

// ---------------------------------------------------------
// 3. STUDENT DASHBOARD COMMAND CENTER
// ---------------------------------------------------------
app.get('/api/student/dashboard', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student record not found' });

  // Calculate profile completion percentage
  let completedSections = 0;
  const totalSections = 8;
  if (data.student.full_name && data.student.mobile) completedSections++;
  if (data.academics.cgpa) completedSections++;
  if (data.skills.length >= 3) completedSections++;
  if (data.projects.length >= 1) completedSections++;
  if (data.experiences.length >= 1) completedSections++;
  if (data.certifications.length >= 1) completedSections++;
  if (data.resume.file_name) completedSections++;
  if (data.student.target_role) completedSections++;
  const profileCompletion = Math.round((completedSections / totalSections) * 100);

  // Match jobs against student
  const studentSkillNames = new Set(data.skills.map(s => s.skill_name.toLowerCase()));
  const recommendedJobs = MASTER_JOBS.map(job => {
    const requiredTotal = job.required_skills.length;
    let matchedCount = 0;
    const missingSkills: string[] = [];

    job.required_skills.forEach(skill => {
      if (studentSkillNames.has(skill.toLowerCase())) {
        matchedCount++;
      } else {
        missingSkills.push(skill);
      }
    });

    const isCgpaEligible = data.academics.cgpa >= job.min_cgpa;
    const isBacklogEligible = data.academics.active_backlogs <= job.max_backlogs;
    const isBranchEligible = job.allowed_branches.includes(data.student.branch);
    const isEligible = isCgpaEligible && isBacklogEligible && isBranchEligible;

    const skillMatchRatio = (matchedCount / Math.max(1, requiredTotal)) * 100;
    const matchPercentage = Math.round(isEligible ? Math.min(99, skillMatchRatio * 0.9 + (data.academics.cgpa / 10) * 10) : skillMatchRatio * 0.6);

    const isApplied = data.applications.some(a => a.job_id === job.id);

    return {
      ...job,
      matchPercentage,
      isEligible,
      isApplied,
      matchedSkillsCount: matchedCount,
      missingSkills,
      whySummary: [
        isCgpaEligible ? `CGPA ${data.academics.cgpa} meets cutoff (${job.min_cgpa})` : `CGPA ${data.academics.cgpa} is below cutoff (${job.min_cgpa})`,
        `${matchedCount}/${requiredTotal} required technical skills present`,
        data.projects.length > 0 ? 'Verified project portfolio in relevant stack' : 'Additional relevant projects recommended'
      ]
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);

  // Upcoming interviews
  const upcomingInterviews = data.interviews.filter(i => i.status === 'SCHEDULED');
  const pendingOffers = data.offers.filter(o => o.status === 'PENDING');
  const pendingDocuments = data.documents.filter(d => d.verification_status !== 'Verified');
  const unreadNotifications = data.notifications.filter(n => !n.is_read);

  // AI Insight
  const topSkills = data.skills.slice(0, 3).map(s => s.skill_name).join(', ');
  const missingTop = data.skillGap.missing_skills.slice(0, 2).join(' & ');
  const aiInsight = `Your strongest technical assets are ${topSkills || 'foundational CS'}. Your highest-leverage improvement opportunity is ${missingTop || 'cloud deployment and system design'} to unlock 90+ match tier.`;

  res.json({
    student: data.student,
    readinessScore: data.readinessScore,
    profileCompletion,
    resumeScore: data.resume.ats_score,
    skillCoverage: data.skillGap.coverage_percentage,
    applicationsCount: data.applications.length,
    upcomingInterviewsCount: upcomingInterviews.length,
    upcomingInterviews,
    offersCount: data.offers.length,
    pendingOffers,
    pendingDocumentsCount: pendingDocuments.length,
    unreadNotificationsCount: unreadNotifications.length,
    aiInsight,
    recommendedJobs: recommendedJobs.slice(0, 4),
    targetRole: data.student.target_role
  });
});

// ---------------------------------------------------------
// 4. STUDENT PROFILE & EDITING
// ---------------------------------------------------------
app.get('/api/student/profile', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });
  res.json({
    student: data.student,
    academics: data.academics,
    skills: data.skills,
    projects: data.projects,
    experiences: data.experiences,
    certifications: data.certifications,
    resume: data.resume
  });
});

app.put('/api/student/profile', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });

  const { fullName, mobile, bio, targetRole, preferredLocations, rollNumber, avatarUrl } = req.body;
  if (fullName) data.student.full_name = fullName;
  if (mobile) data.student.mobile = mobile;
  if (bio !== undefined) data.student.bio = bio;
  if (rollNumber) data.student.roll_number = rollNumber;
  if (avatarUrl) data.student.avatar_url = avatarUrl;
  if (preferredLocations) data.student.preferred_locations = preferredLocations;

  if (targetRole && targetRole !== data.student.target_role) {
    data.student.target_role = targetRole;
    mockDb.recalculateSkillGap(data.student.id, targetRole);
  }

  data.student.updated_at = new Date().toISOString();
  mockDb.recalculateReadiness(data.student.id);

  res.json({
    message: 'Profile updated successfully',
    student: data.student,
    readinessScore: data.readinessScore
  });
});

// ---------------------------------------------------------
// 5. ACADEMIC PROFILE
// ---------------------------------------------------------
app.get('/api/student/academics', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });
  res.json(data.academics);
});

app.put('/api/student/academics', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });

  const { cgpa, activeBacklogs, clearedBacklogs, tenthPercentage, twelfthPercentage, semesterGrades } = req.body;
  if (cgpa !== undefined) data.academics.cgpa = Number(cgpa);
  if (activeBacklogs !== undefined) data.academics.active_backlogs = Number(activeBacklogs);
  if (clearedBacklogs !== undefined) data.academics.cleared_backlogs = Number(clearedBacklogs);
  if (tenthPercentage !== undefined) data.academics.tenth_percentage = Number(tenthPercentage);
  if (twelfthPercentage !== undefined) data.academics.twelfth_percentage = Number(twelfthPercentage);
  if (semesterGrades) data.academics.semester_grades = semesterGrades;

  data.academics.updated_at = new Date().toISOString();
  mockDb.recalculateReadiness(data.student.id);

  res.json({
    message: 'Academic profile updated',
    academics: data.academics,
    readinessScore: data.readinessScore
  });
});

// ---------------------------------------------------------
// 6. SKILLS
// ---------------------------------------------------------
app.get('/api/student/skills', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });
  res.json(data.skills);
});

app.post('/api/student/skills', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });

  const { skillName, category, proficiencyLevel, yearsExperience } = req.body;
  if (!skillName) return res.status(400).json({ error: 'Skill name is required' });

  // Check if exists
  const existing = data.skills.find(s => s.skill_name.toLowerCase() === skillName.toLowerCase());
  if (existing) {
    existing.proficiency_level = proficiencyLevel || existing.proficiency_level;
    existing.category = category || existing.category;
    existing.years_experience = Number(yearsExperience) || existing.years_experience;
  } else {
    data.skills.push({
      id: `sk-${Date.now()}`,
      student_id: data.student.id,
      skill_name: skillName,
      category: category || 'tech',
      proficiency_level: proficiencyLevel || 'Intermediate',
      verified_by_test: false,
      years_experience: Number(yearsExperience) || 1,
      created_at: new Date().toISOString()
    });
  }

  mockDb.recalculateReadiness(data.student.id);
  mockDb.recalculateSkillGap(data.student.id, data.student.target_role);

  res.json({
    message: 'Skill updated successfully',
    skills: data.skills,
    readinessScore: data.readinessScore,
    skillGap: data.skillGap
  });
});

app.delete('/api/student/skills/:id', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });

  data.skills = data.skills.filter(s => s.id !== req.params.id);
  mockDb.recalculateReadiness(data.student.id);
  mockDb.recalculateSkillGap(data.student.id, data.student.target_role);

  res.json({
    message: 'Skill deleted',
    skills: data.skills,
    readinessScore: data.readinessScore,
    skillGap: data.skillGap
  });
});

// ---------------------------------------------------------
// 7. PROJECTS
// ---------------------------------------------------------
app.get('/api/student/projects', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });
  res.json(data.projects);
});

app.post('/api/student/projects', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });

  const { title, description, techStack, githubUrl, liveDemoUrl, highlightMetric } = req.body;
  if (!title || !description) return res.status(400).json({ error: 'Title and description are required' });

  const newProject = {
    id: `proj-${Date.now()}`,
    student_id: data.student.id,
    title,
    description,
    tech_stack: Array.isArray(techStack) ? techStack : (techStack || '').split(',').map((x: string) => x.trim()),
    github_url: githubUrl,
    live_demo_url: liveDemoUrl,
    highlight_metric: highlightMetric,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  data.projects.push(newProject);
  mockDb.recalculateReadiness(data.student.id);

  res.status(201).json({
    message: 'Project added successfully',
    project: newProject,
    readinessScore: data.readinessScore
  });
});

app.delete('/api/student/projects/:id', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });

  data.projects = data.projects.filter(p => p.id !== req.params.id);
  mockDb.recalculateReadiness(data.student.id);

  res.json({ message: 'Project removed', readinessScore: data.readinessScore });
});

// ---------------------------------------------------------
// 8. CERTIFICATIONS & EXPERIENCES
// ---------------------------------------------------------
app.get('/api/student/certifications', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });
  res.json(data.certifications);
});

app.post('/api/student/certifications', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });

  const { name, issuingOrganization, issueDate, credentialId, credentialUrl } = req.body;
  const newCert = {
    id: `cert-${Date.now()}`,
    student_id: data.student.id,
    name,
    issuing_organization: issuingOrganization,
    issue_date: issueDate || new Date().toISOString().split('T')[0],
    credential_id: credentialId,
    credential_url: credentialUrl,
    verified: true,
    created_at: new Date().toISOString()
  };
  data.certifications.push(newCert);
  mockDb.recalculateReadiness(data.student.id);
  res.status(201).json({ message: 'Certification added', certification: newCert, readinessScore: data.readinessScore });
});

app.delete('/api/student/certifications/:id', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });
  data.certifications = data.certifications.filter(c => c.id !== req.params.id);
  mockDb.recalculateReadiness(data.student.id);
  res.json({ message: 'Certification removed', readinessScore: data.readinessScore });
});

// ---------------------------------------------------------
// 9. RESUME MODULE & AI RESUME PARSER
// ---------------------------------------------------------
app.get('/api/student/resume', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });
  res.json(data.resume);
});

app.post('/api/student/resume/parse', authenticateStudent, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required for AI parsing' });
    }

    const parseResult = await parseResumeWithGemini(resumeText);
    res.json(parseResult);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'AI Resume Parsing error' });
  }
});

app.post('/api/student/resume/apply-parsed-data', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });

  const { parsedData, fileName } = req.body;
  if (!parsedData) return res.status(400).json({ error: 'No parsed data provided' });

  // Update resume record
  data.resume.file_name = fileName || data.resume.file_name;
  data.resume.ats_score = parsedData.resume_score || 85;
  data.resume.parsed_skills = (parsedData.skills || []).map((s: any) => s.name);
  data.resume.ai_suggestions = {
    strengths: parsedData.ats_observations || [],
    improvements: parsedData.recommended_improvements || [],
    missing_sections: parsedData.weak_sections || [],
    summary: parsedData.professional_summary || ''
  };
  data.resume.version_number += 1;
  data.resume.updated_at = new Date().toISOString();

  // If student confirms merging skills/projects
  if (Array.isArray(parsedData.skills) && parsedData.skills.length > 0) {
    for (const sk of parsedData.skills) {
      if (!data.skills.some(s => s.skill_name.toLowerCase() === sk.name.toLowerCase())) {
        data.skills.push({
          id: `sk-${Date.now()}-${Math.random()}`,
          student_id: data.student.id,
          skill_name: sk.name,
          category: sk.category || 'tech',
          proficiency_level: sk.proficiency || 'Intermediate',
          verified_by_test: false,
          years_experience: 1,
          created_at: new Date().toISOString()
        });
      }
    }
  }

  mockDb.recalculateReadiness(data.student.id);
  mockDb.recalculateSkillGap(data.student.id, data.student.target_role);

  res.json({
    message: 'Resume analysis applied successfully',
    resume: data.resume,
    readinessScore: data.readinessScore
  });
});

// ---------------------------------------------------------
// 10 & 11. READINESS SCORE & EXPLANATION
// ---------------------------------------------------------
app.get('/api/student/readiness', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });
  res.json(data.readinessScore);
});

app.post('/api/student/readiness/recalculate', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });

  const updated = mockDb.recalculateReadiness(data.student.id);
  res.json(updated);
});

// ---------------------------------------------------------
// 12. SKILL GAP ANALYSIS
// ---------------------------------------------------------
app.get('/api/student/skill-gap', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });
  res.json({
    skillGap: data.skillGap,
    availableRoles: Object.keys(ROLE_SKILL_REQUIREMENTS)
  });
});

app.post('/api/student/skill-gap/target-role', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });

  const { targetRole } = req.body;
  if (!targetRole) return res.status(400).json({ error: 'targetRole is required' });

  const gap = mockDb.recalculateSkillGap(data.student.id, targetRole);
  res.json(gap);
});

// ---------------------------------------------------------
// 13 & 14. RECOMMENDED JOBS & DETAILS
// ---------------------------------------------------------
app.get('/api/student/jobs', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });

  const studentSkillNames = new Set(data.skills.map(s => s.skill_name.toLowerCase()));

  const list = MASTER_JOBS.map(job => {
    const requiredTotal = job.required_skills.length;
    let matchedCount = 0;
    const missingSkills: string[] = [];

    job.required_skills.forEach(skill => {
      if (studentSkillNames.has(skill.toLowerCase())) {
        matchedCount++;
      } else {
        missingSkills.push(skill);
      }
    });

    const isCgpaEligible = data.academics.cgpa >= job.min_cgpa;
    const isBacklogEligible = data.academics.active_backlogs <= job.max_backlogs;
    const isBranchEligible = job.allowed_branches.includes(data.student.branch);
    const isEligible = isCgpaEligible && isBacklogEligible && isBranchEligible;

    const skillRatio = (matchedCount / Math.max(1, requiredTotal)) * 100;
    const matchPercentage = Math.round(isEligible ? Math.min(99, skillRatio * 0.9 + (data.academics.cgpa / 10) * 10) : skillRatio * 0.6);

    const userApp = data.applications.find(a => a.job_id === job.id);

    return {
      ...job,
      matchPercentage,
      isEligible,
      isApplied: !!userApp,
      applicationStatus: userApp ? userApp.status : null,
      matchedSkillsCount: matchedCount,
      missingSkills,
      eligibilityReasons: {
        cgpa: { eligible: isCgpaEligible, required: job.min_cgpa, actual: data.academics.cgpa },
        backlogs: { eligible: isBacklogEligible, max: job.max_backlogs, actual: data.academics.active_backlogs },
        branch: { eligible: isBranchEligible, allowed: job.allowed_branches, actual: data.student.branch }
      }
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);

  res.json(list);
});

app.get('/api/student/jobs/:id', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });

  const job = MASTER_JOBS.find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Job drive not found' });

  const studentSkillNames = new Set(data.skills.map(s => s.skill_name.toLowerCase()));
  const missingSkills = job.required_skills.filter(s => !studentSkillNames.has(s.toLowerCase()));
  const matchedSkills = job.required_skills.filter(s => studentSkillNames.has(s.toLowerCase()));

  const isCgpaEligible = data.academics.cgpa >= job.min_cgpa;
  const isBacklogEligible = data.academics.active_backlogs <= job.max_backlogs;
  const isBranchEligible = job.allowed_branches.includes(data.student.branch);
  const isEligible = isCgpaEligible && isBacklogEligible && isBranchEligible;

  const appRecord = data.applications.find(a => a.job_id === job.id);

  res.json({
    ...job,
    matchedSkills,
    missingSkills,
    isEligible,
    isApplied: !!appRecord,
    application: appRecord || null
  });
});

// AI Job Description Analysis Endpoint
// Authenticates student from JWT, retrieves student profile & selected job, evaluates with Gemini
app.post('/api/student/jobs/:jobId/analyze', authenticateStudent, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = mockDb.getStudentById(req.user!.studentId);
    if (!data) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const job = MASTER_JOBS.find(j => j.id === req.params.jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job drive not found' });
    }

    if (!job.published || !job.is_active) {
      return res.status(403).json({ error: 'This campus drive is currently inactive' });
    }

    const analysis = await analyzeJobDescriptionWithGemini(data, job);
    res.json(analysis);
  } catch (err: any) {
    console.error('Job Description Analysis error:', err);
    res.status(500).json({ error: 'Unable to analyze this job description right now.' });
  }
});

// ---------------------------------------------------------
// 15 & 16. APPLICATIONS & EXPLAINABLE REJECTION
// ---------------------------------------------------------
app.get('/api/student/applications', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });
  res.json(data.applications);
});

app.post('/api/student/applications/apply', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });

  const { jobId } = req.body;
  const job = MASTER_JOBS.find(j => j.id === jobId);
  if (!job) return res.status(404).json({ error: 'Job drive not found' });

  // Check if already applied
  if (data.applications.some(a => a.job_id === jobId)) {
    return res.status(400).json({ error: 'You have already applied for this placement drive' });
  }

  const newApp = {
    id: `app-${Date.now()}`,
    student_id: data.student.id,
    job_id: job.id,
    company_name: job.company_name,
    role_title: job.role_title,
    ctc: job.ctc,
    location: job.location,
    status: 'APPLIED' as const,
    applied_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    allow_withdrawal: true
  };

  data.applications.push(newApp);

  // Add notification
  data.notifications.unshift({
    id: `notif-${Date.now()}`,
    student_id: data.student.id,
    title: `Application Submitted: ${job.company_name}`,
    message: `Your application for ${job.role_title} has been logged. Next step: Application Review.`,
    category: 'shortlist',
    is_read: false,
    action_route: 'applications',
    created_at: new Date().toISOString()
  });

  res.status(201).json({ message: 'Application submitted successfully', application: newApp });
});

app.post('/api/student/applications/:id/withdraw', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });

  const appIndex = data.applications.findIndex(a => a.id === req.params.id);
  if (appIndex === -1) return res.status(404).json({ error: 'Application not found' });

  const targetApp = data.applications[appIndex];
  if (!targetApp.allow_withdrawal || targetApp.status === 'INTERVIEW' || targetApp.status === 'OFFERED') {
    return res.status(400).json({ error: 'Applications cannot be withdrawn after interview scheduling or offer stage.' });
  }

  data.applications.splice(appIndex, 1);
  res.json({ message: 'Application successfully withdrawn' });
});

// ---------------------------------------------------------
// 17. INTERVIEW SCHEDULE
// ---------------------------------------------------------
app.get('/api/student/interviews', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });
  res.json(data.interviews);
});

// ---------------------------------------------------------
// 18. AI MOCK INTERVIEW
// ---------------------------------------------------------
app.get('/api/student/mock-interviews', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });
  res.json(data.mockInterviews);
});

app.post('/api/student/mock-interviews/generate-question', authenticateStudent, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role, difficulty, interviewType, history } = req.body;
    const question = await generateInterviewQuestion(
      role || 'Software Engineer',
      difficulty || 'Mid',
      interviewType || 'Technical',
      history || []
    );
    res.json(question);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate interview question' });
  }
});

app.post('/api/student/mock-interviews/evaluate', authenticateStudent, async (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });

  try {
    const { role, difficulty, interviewType, qaPairs } = req.body;
    const evaluation = await evaluateInterviewSession(
      role || data.student.target_role,
      difficulty || 'Mid',
      interviewType || 'Technical',
      qaPairs || []
    );

    const mockRecord = {
      id: `mock-${Date.now()}`,
      student_id: data.student.id,
      role: role || data.student.target_role,
      difficulty: difficulty || 'Mid',
      interview_type: interviewType || 'Technical',
      score_overall: evaluation.score_overall,
      technical_accuracy: evaluation.technical_accuracy,
      communication: evaluation.communication,
      clarity: evaluation.clarity,
      confidence: evaluation.confidence,
      transcript: qaPairs.map((p: any) => ({ role: 'student' as const, question: p.question, answer: p.answer })),
      feedback: evaluation.detailed_feedback,
      key_recommendations: evaluation.areas_for_improvement,
      completed_at: new Date().toISOString()
    };

    data.mockInterviews.unshift(mockRecord);
    mockDb.recalculateReadiness(data.student.id);

    res.json({
      evaluation,
      record: mockRecord,
      updatedReadiness: data.readinessScore
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Evaluation failed' });
  }
});

// ---------------------------------------------------------
// 19 & 20. AI CAREER COACH & CHAT SECURITY
// ---------------------------------------------------------
app.get('/api/student/ai/messages', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });
  res.json(data.messages);
});

app.post('/api/student/ai/chat', authenticateStudent, async (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message content required' });

  // Add student message to conversation
  const studentMsg = {
    id: `msg-${Date.now()}-usr`,
    conversation_id: data.conversations[0]?.id || 'conv-1',
    student_id: data.student.id,
    sender: 'student' as const,
    content: message,
    created_at: new Date().toISOString()
  };
  data.messages.push(studentMsg);

  try {
    // ONLY send logged-in student's context! Never any other student data!
    const studentContext = {
      fullName: data.student.full_name,
      branch: data.student.branch,
      college: data.student.college_name,
      cgpa: data.academics.cgpa,
      skills: data.skills.map(s => s.skill_name),
      targetRole: data.student.target_role,
      readinessScore: data.readinessScore.overall_score,
      applicationsCount: data.applications.length,
      upcomingInterviewsCount: data.interviews.filter(i => i.status === 'SCHEDULED').length,
      offersCount: data.offers.length
    };

    const conversationHistory = data.messages.slice(-8).map(m => ({
      role: m.sender,
      content: m.content
    }));

    const aiReplyText = await askAiCareerAssistant(studentContext, message, conversationHistory);

    const assistantMsg = {
      id: `msg-${Date.now()}-ai`,
      conversation_id: data.conversations[0]?.id || 'conv-1',
      student_id: data.student.id,
      sender: 'assistant' as const,
      content: aiReplyText,
      created_at: new Date().toISOString()
    };
    data.messages.push(assistantMsg);

    res.json({ message: assistantMsg });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'AI Assistant processing error' });
  }
});

// ---------------------------------------------------------
// 21. OFFERS
// ---------------------------------------------------------
app.get('/api/student/offers', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });
  res.json(data.offers);
});

app.post('/api/student/offers/:id/decision', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });

  const { decision } = req.body; // 'ACCEPTED' | 'DECLINED'
  const offer = data.offers.find(o => o.id === req.params.id);
  if (!offer) return res.status(404).json({ error: 'Offer not found' });

  if (decision === 'ACCEPTED') {
    offer.status = 'ACCEPTED';
    // If student accepts, update application state as well
    const appRecord = data.applications.find(a => a.company_name === offer.company_name);
    if (appRecord) appRecord.status = 'ACCEPTED';

    data.notifications.unshift({
      id: `notif-${Date.now()}`,
      student_id: data.student.id,
      title: `Offer Accepted: ${offer.company_name}!`,
      message: `Congratulations! You accepted the placement offer of ${offer.ctc}. Please upload pre-joining verification documents.`,
      category: 'document',
      is_read: false,
      action_route: 'documents',
      created_at: new Date().toISOString()
    });
  } else if (decision === 'DECLINED') {
    offer.status = 'DECLINED';
    const appRecord = data.applications.find(a => a.company_name === offer.company_name);
    if (appRecord) appRecord.status = 'DECLINED';
  }

  offer.updated_at = new Date().toISOString();
  res.json({ message: `Offer marked as ${offer.status}`, offer });
});

// ---------------------------------------------------------
// 22. DOCUMENTS LOCKER
// ---------------------------------------------------------
app.get('/api/student/documents', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });
  res.json(data.documents);
});

app.post('/api/student/documents/upload', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });

  const { title, documentType, fileUrl } = req.body;
  if (!title || !documentType) return res.status(400).json({ error: 'Title and document type are required' });

  const newDoc = {
    id: `doc-${Date.now()}`,
    student_id: data.student.id,
    title,
    document_type: documentType,
    file_url: fileUrl || `/documents/${encodeURIComponent(title)}.pdf`,
    verification_status: 'Pending Verification' as const,
    uploaded_at: new Date().toISOString()
  };

  data.documents.unshift(newDoc);
  res.status(201).json({ message: 'Document uploaded for verification', document: newDoc });
});

app.delete('/api/student/documents/:id', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });

  data.documents = data.documents.filter(d => d.id !== req.params.id);
  res.json({ message: 'Document deleted' });
});

// ---------------------------------------------------------
// 23. NOTIFICATIONS
// ---------------------------------------------------------
app.get('/api/student/notifications', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });
  res.json(data.notifications);
});

app.post('/api/student/notifications/:id/read', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });

  const notif = data.notifications.find(n => n.id === req.params.id);
  if (notif) notif.is_read = true;
  res.json({ message: 'Marked as read' });
});

app.post('/api/student/notifications/read-all', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });

  data.notifications.forEach(n => { n.is_read = true; });
  res.json({ message: 'All notifications marked as read' });
});

// ---------------------------------------------------------
// 24. PERSONAL ANALYTICS (STUDENT-ONLY)
// ---------------------------------------------------------
app.get('/api/student/analytics', authenticateStudent, (req: AuthenticatedRequest, res: Response) => {
  const data = mockDb.getStudentById(req.user!.studentId);
  if (!data) return res.status(404).json({ error: 'Student not found' });

  // Historical readiness score trend simulation
  const readinessTrend = [
    { month: 'Jul 2026', score: 62 },
    { month: 'Aug 2026', score: 71 },
    { month: 'Sep 2026', score: 78 },
    { month: 'Oct 2026', score: data.readinessScore.overall_score }
  ];

  // Competency breakdown
  const competencyRadar = [
    { subject: 'Academics', score: data.readinessScore.academic_factor, fullMark: 100 },
    { subject: 'Tech Skills', score: data.readinessScore.skill_factor, fullMark: 100 },
    { subject: 'Projects', score: data.readinessScore.project_factor, fullMark: 100 },
    { subject: 'Resume ATS', score: data.readinessScore.resume_factor, fullMark: 100 },
    { subject: 'Mock Interview', score: data.readinessScore.mock_interview_factor, fullMark: 100 }
  ];

  // Application conversion funnel
  const appliedCount = data.applications.length;
  const shortlistedCount = data.applications.filter(a => ['SHORTLISTED', 'INTERVIEW', 'SELECTED', 'OFFERED', 'ACCEPTED'].includes(a.status)).length;
  const interviewCount = data.applications.filter(a => ['INTERVIEW', 'SELECTED', 'OFFERED', 'ACCEPTED'].includes(a.status)).length;
  const offeredCount = data.applications.filter(a => ['OFFERED', 'ACCEPTED'].includes(a.status)).length;

  res.json({
    readinessTrend,
    competencyRadar,
    funnel: [
      { stage: 'Applied', count: appliedCount, rate: 100 },
      { stage: 'Shortlisted', count: shortlistedCount, rate: appliedCount > 0 ? Math.round((shortlistedCount / appliedCount) * 100) : 0 },
      { stage: 'Interviewed', count: interviewCount, rate: shortlistedCount > 0 ? Math.round((interviewCount / shortlistedCount) * 100) : 0 },
      { stage: 'Offers Won', count: offeredCount, rate: interviewCount > 0 ? Math.round((offeredCount / interviewCount) * 100) : 0 }
    ],
    mockInterviewsHistory: data.mockInterviews
  });
});

// ---------------------------------------------------------
// 25. POSTGRESQL SCHEMA CONTRACT VIEWER (Section 26)
// ---------------------------------------------------------
app.get('/api/db/schema', (req: Request, res: Response) => {
  try {
    const schemaPath = path.resolve(__dirname, 'server/db/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sqlContent = fs.readFileSync(schemaPath, 'utf-8');
      return res.type('text/plain').send(sqlContent);
    }
    res.status(404).json({ error: 'Schema file not found' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------
// Shared API health check
// ---------------------------------------------------------
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    ok: true,
    service: 'campuslink-backend',
    port: Number(PORT),
    timestamp: new Date().toISOString(),
  });
});

export { app };
