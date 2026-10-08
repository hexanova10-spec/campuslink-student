/**
 * CampusLink Student — Database Models & Data Contracts
 * PostgreSQL-ready data definitions matching schema.sql
 */

export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: 'student';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  roll_number: string;
  full_name: string;
  mobile: string;
  college_name: string;
  branch: string;
  degree: string;
  graduation_year: number;
  current_semester: number;
  avatar_url?: string;
  bio?: string;
  target_role: string;
  preferred_locations: string[];
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudentAcademics {
  id: string;
  student_id: string;
  tenth_percentage: number;
  tenth_board: string;
  twelfth_percentage: number;
  twelfth_board: string;
  cgpa: number;
  active_backlogs: number;
  cleared_backlogs: number;
  semester_grades: Record<string, number>;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'cloud' | 'database' | 'soft_skill' | 'core_cs';
  is_trending?: boolean;
}

export interface StudentSkill {
  id: string;
  student_id: string;
  skill_id?: string;
  skill_name: string;
  category: string;
  proficiency_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  verified_by_test: boolean;
  years_experience: number;
  created_at: string;
}

export interface Project {
  id: string;
  student_id: string;
  title: string;
  description: string;
  tech_stack: string[];
  github_url?: string;
  live_demo_url?: string;
  highlight_metric?: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  student_id: string;
  company_name: string;
  role: string;
  location?: string;
  employment_type: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  responsibilities: string;
  technologies_used: string[];
  created_at: string;
}

export interface Certification {
  id: string;
  student_id: string;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  verified: boolean;
  created_at: string;
}

export interface Resume {
  id: string;
  student_id: string;
  file_name: string;
  file_url: string;
  file_size_bytes: number;
  version_number: number;
  is_primary: boolean;
  ats_score: number;
  parsed_skills: string[];
  ai_suggestions?: {
    strengths: string[];
    improvements: string[];
    missing_sections: string[];
    summary: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  title: string;
  type: 'aptitude' | 'coding' | 'communication' | 'technical';
  total_questions: number;
  duration_minutes: number;
  created_at: string;
}

export interface AssessmentResult {
  id: string;
  student_id: string;
  assessment_id: string;
  score_percentage: number;
  status: 'Completed' | 'In Progress';
  breakdown: Record<string, number>;
  taken_at: string;
}

export interface MockInterview {
  id: string;
  student_id: string;
  role: string;
  difficulty: 'Junior' | 'Mid' | 'Senior';
  interview_type: 'Technical' | 'HR' | 'Behavioral' | 'System Design';
  score_overall: number; // 0-100
  technical_accuracy: number;
  communication: number;
  clarity: number;
  confidence: number;
  transcript: Array<{ role: 'ai' | 'student'; question?: string; answer?: string; feedback?: string }>;
  feedback: string;
  key_recommendations: string[];
  completed_at: string;
}

export interface ReadinessScore {
  id: string;
  student_id: string;
  overall_score: number; // 0 to 100
  category: 'NOT READY' | 'DEVELOPING' | 'READY' | 'HIGHLY EMPLOYABLE';
  academic_factor: number;
  skill_factor: number;
  project_factor: number;
  resume_factor: number;
  mock_interview_factor: number;
  strengths: string[];
  needs_improvement: string[];
  action_items: string[];
  calculated_at: string;
}

export interface SkillGap {
  id: string;
  student_id: string;
  target_role: string;
  coverage_percentage: number;
  matched_skills: string[];
  partial_skills: string[];
  missing_skills: string[];
  ai_learning_path: Array<{ skill: string; priority: 'High' | 'Medium' | 'Low'; estimatedHours: number; resource: string }>;
  evaluated_at: string;
}

export interface Application {
  id: string;
  student_id: string;
  job_id: string;
  company_name: string;
  role_title: string;
  ctc: string;
  location: string;
  status: 'ELIGIBLE' | 'APPLIED' | 'UNDER REVIEW' | 'SHORTLISTED' | 'REJECTED' | 'INTERVIEW' | 'SELECTED' | 'OFFERED' | 'ACCEPTED' | 'DECLINED';
  applied_at: string;
  updated_at: string;
  rejection_reason?: string;
  allow_withdrawal: boolean;
}

export interface Interview {
  id: string;
  student_id: string;
  application_id?: string;
  company_name: string;
  role_title: string;
  round_name: string;
  interview_date: string;
  interview_time: string;
  venue_or_meeting_url: string;
  instructions: string;
  reminder_24h_sent: boolean;
  reminder_1h_sent: boolean;
  status: 'SCHEDULED' | 'COMPLETED' | 'RESCHEDULED' | 'CANCELLED';
  created_at: string;
}

export interface Offer {
  id: string;
  student_id: string;
  company_name: string;
  role_title: string;
  ctc: string;
  offer_date: string;
  joining_date: string;
  location: string;
  offer_letter_url: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'DEFERRED' | 'WITHDRAWN';
  created_at: string;
  updated_at: string;
}

export interface DocumentRecord {
  id: string;
  student_id: string;
  title: string;
  document_type: 'Resume' | 'ID' | 'Marksheet' | 'Certificate' | 'Offer Document' | 'Joining Document';
  file_url: string;
  verification_status: 'Uploaded' | 'Pending Verification' | 'Verified' | 'Rejected';
  uploaded_at: string;
  rejection_notes?: string;
}

export interface NotificationRecord {
  id: string;
  student_id: string;
  title: string;
  message: string;
  category: 'shortlist' | 'interview' | 'document' | 'readiness' | 'job_match' | 'feedback';
  is_read: boolean;
  action_route?: string;
  created_at: string;
}

export interface AiConversation {
  id: string;
  student_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface AiMessage {
  id: string;
  conversation_id: string;
  student_id: string;
  sender: 'student' | 'assistant';
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface JobListing {
  id: string;
  company_name: string;
  logo_symbol: string;
  role_title: string;
  job_type: string;
  location: string;
  ctc: string;
  min_cgpa: number;
  allowed_branches: string[];
  max_backlogs: number;
  required_skills: string[];
  preferred_skills: string[];
  application_deadline: string;
  description: string;
  selection_rounds: string[];
  published: boolean;
  is_active: boolean;
}
