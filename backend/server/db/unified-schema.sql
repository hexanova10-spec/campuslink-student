-- =====================================================================
-- CAMPUSLINK UNIFIED DATABASE SCHEMA
-- Student + Recruiter + TPO domains
-- Safe to run on a fresh campuslink database.
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Base student/auth schema.
-- This must come first because recruitment/TPO tables reference users/students.

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Students Profile Table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    roll_number VARCHAR(100) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    college_name VARCHAR(255) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    degree VARCHAR(100) NOT NULL DEFAULT 'B.Tech',
    graduation_year INT NOT NULL,
    current_semester INT NOT NULL DEFAULT 8,
    avatar_url TEXT,
    bio TEXT,
    target_role VARCHAR(150),
    preferred_locations TEXT[],
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Student Academics
CREATE TABLE IF NOT EXISTS student_academics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    tenth_percentage NUMERIC(5,2) NOT NULL,
    tenth_board VARCHAR(100) NOT NULL,
    twelfth_percentage NUMERIC(5,2) NOT NULL,
    twelfth_board VARCHAR(100) NOT NULL,
    cgpa NUMERIC(4,2) NOT NULL,
    active_backlogs INT NOT NULL DEFAULT 0,
    cleared_backlogs INT NOT NULL DEFAULT 0,
    semester_grades JSONB, -- e.g. {"sem1": 8.5, "sem2": 8.4, ...}
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Master Skills Directory
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'frontend', 'backend', 'cloud', 'database', 'soft_skill', 'core_cs'
    is_trending BOOLEAN DEFAULT FALSE
);

-- 5. Student Skills (Ownership Link)
CREATE TABLE IF NOT EXISTS student_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
    skill_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    proficiency_level VARCHAR(50) NOT NULL, -- 'Beginner', 'Intermediate', 'Advanced', 'Expert'
    verified_by_test BOOLEAN DEFAULT FALSE,
    years_experience NUMERIC(3,1) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT[] NOT NULL,
    github_url TEXT,
    live_demo_url TEXT,
    highlight_metric TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Experiences / Internships
CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    role VARCHAR(150) NOT NULL,
    location VARCHAR(100),
    employment_type VARCHAR(50) DEFAULT 'Internship',
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    responsibilities TEXT NOT NULL,
    technologies_used TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Certifications
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    credential_id VARCHAR(150),
    credential_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Resumes
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size_bytes INT NOT NULL,
    version_number INT NOT NULL DEFAULT 1,
    is_primary BOOLEAN DEFAULT TRUE,
    ats_score INT DEFAULT 0,
    parsed_skills TEXT[],
    ai_suggestions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Assessments
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'aptitude', 'coding', 'communication', 'technical'
    total_questions INT NOT NULL,
    duration_minutes INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Assessment Results
CREATE TABLE IF NOT EXISTS assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES assessments(id) ON DELETE SET NULL,
    score_percentage NUMERIC(5,2) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'Completed', 'In Progress'
    breakdown JSONB,
    taken_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Mock Interviews
CREATE TABLE IF NOT EXISTS mock_interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    role VARCHAR(150) NOT NULL,
    difficulty VARCHAR(50) NOT NULL, -- 'Junior', 'Mid', 'Senior'
    interview_type VARCHAR(50) NOT NULL, -- 'Technical', 'HR', 'Behavioral', 'System Design'
    score_overall INT NOT NULL,
    technical_accuracy INT NOT NULL,
    communication INT NOT NULL,
    clarity INT NOT NULL,
    confidence INT NOT NULL,
    transcript JSONB,
    feedback TEXT,
    key_recommendations TEXT[],
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Readiness Scores
CREATE TABLE IF NOT EXISTS readiness_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    overall_score INT NOT NULL, -- 0 to 100
    category VARCHAR(50) NOT NULL, -- 'NOT READY', 'DEVELOPING', 'READY', 'HIGHLY EMPLOYABLE'
    academic_factor INT NOT NULL,
    skill_factor INT NOT NULL,
    project_factor INT NOT NULL,
    resume_factor INT NOT NULL,
    mock_interview_factor INT NOT NULL,
    strengths TEXT[] NOT NULL,
    needs_improvement TEXT[] NOT NULL,
    action_items TEXT[] NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Skill Gaps
CREATE TABLE IF NOT EXISTS skill_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    target_role VARCHAR(150) NOT NULL,
    coverage_percentage NUMERIC(5,2) NOT NULL,
    matched_skills TEXT[] NOT NULL,
    partial_skills TEXT[] NOT NULL,
    missing_skills TEXT[] NOT NULL,
    ai_learning_path JSONB,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Applications
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    job_id VARCHAR(100) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    role_title VARCHAR(255) NOT NULL,
    ctc VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'APPLIED',
    -- 'ELIGIBLE', 'APPLIED', 'UNDER REVIEW', 'SHORTLISTED', 'REJECTED', 'INTERVIEW', 'SELECTED', 'OFFERED', 'ACCEPTED', 'DECLINED'
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    rejection_reason TEXT,
    allow_withdrawal BOOLEAN DEFAULT TRUE
);

-- 16. Interviews
CREATE TABLE IF NOT EXISTS interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    role_title VARCHAR(255) NOT NULL,
    round_name VARCHAR(100) NOT NULL,
    interview_date DATE NOT NULL,
    interview_time TIME NOT NULL,
    venue_or_meeting_url TEXT NOT NULL,
    instructions TEXT,
    reminder_24h_sent BOOLEAN DEFAULT FALSE,
    reminder_1h_sent BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'SCHEDULED', -- 'SCHEDULED', 'COMPLETED', 'RESCHEDULED', 'CANCELLED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. Offers
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    role_title VARCHAR(255) NOT NULL,
    ctc VARCHAR(100) NOT NULL,
    offer_date DATE NOT NULL,
    joining_date DATE NOT NULL,
    location VARCHAR(150) NOT NULL,
    offer_letter_url TEXT,
    status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'ACCEPTED', 'DECLINED', 'DEFERRED', 'WITHDRAWN'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. Documents
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL, -- 'Resume', 'ID', 'Marksheet', 'Certificate', 'Offer Document', 'Joining Document'
    file_url TEXT NOT NULL,
    verification_status VARCHAR(50) DEFAULT 'Pending Verification', -- 'Uploaded', 'Pending Verification', 'Verified', 'Rejected'
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    rejection_notes TEXT
);

-- 19. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'shortlist', 'interview', 'document', 'readiness', 'job_match', 'feedback'
    is_read BOOLEAN DEFAULT FALSE,
    action_route VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 20. AI Conversations
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'Placement Mentorship',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 21. AI Messages
CREATE TABLE IF NOT EXISTS ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL, -- 'student' or 'assistant'
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 22. Indexes for High-Performance Student Domain Queries
CREATE INDEX IF NOT EXISTS idx_students_user ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_academics_student ON student_academics(student_id);
CREATE INDEX IF NOT EXISTS idx_student_skills_student ON student_skills(student_id);
CREATE INDEX IF NOT EXISTS idx_projects_student ON projects(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_student ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_interviews_student ON interviews(student_id);
CREATE INDEX IF NOT EXISTS idx_offers_student ON offers(student_id);
CREATE INDEX IF NOT EXISTS idx_docs_student ON documents(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_student ON notifications(student_id, is_read);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conv ON ai_messages(conversation_id);

-- Shared recruitment/TPO schema.

-- CampusLink shared recruitment/TPO domain.
-- This is additive to the existing student schema and is safe to apply after it.

CREATE TABLE IF NOT EXISTS companies (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(150),
  website TEXT,
  description TEXT,
  locations TEXT[],
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recruiters (
  id VARCHAR(100) PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  company_id VARCHAR(100) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  designation VARCHAR(150),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
  id VARCHAR(100) PRIMARY KEY,
  company_id VARCHAR(100) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  department VARCHAR(150),
  description TEXT NOT NULL,
  responsibilities TEXT[],
  required_skills TEXT[],
  preferred_skills TEXT[],
  min_cgpa NUMERIC(4,2),
  eligible_branches TEXT[],
  graduation_year INT,
  max_backlogs_allowed INT DEFAULT 0,
  experience_level VARCHAR(100),
  required_certifications TEXT[],
  ctc_min_lpa NUMERIC(8,2),
  ctc_max_lpa NUMERIC(8,2),
  ctc_breakdown TEXT,
  location VARCHAR(255),
  work_mode VARCHAR(50),
  openings INT DEFAULT 1,
  deadline DATE,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS candidate_access (
  company_id VARCHAR(100) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  granted_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (company_id, student_id)
);

CREATE TABLE IF NOT EXISTS recruitment_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  job_id VARCHAR(100) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  company_id VARCHAR(100) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'APPLIED',
  rejection_reason TEXT,
  rejection_notes TEXT,
  recruiter_notes TEXT,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, job_id)
);

CREATE TABLE IF NOT EXISTS placement_drives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id VARCHAR(100) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  job_id VARCHAR(100) REFERENCES jobs(id) ON DELETE SET NULL,
  drive_title VARCHAR(255) NOT NULL,
  drive_date DATE,
  time_slot VARCHAR(100),
  duration_hours NUMERIC(5,2),
  campus_name VARCHAR(255),
  interview_type VARCHAR(100),
  target_candidate_count INT,
  rounds TEXT[],
  special_requirements TEXT,
  tpo_approval_status VARCHAR(50) DEFAULT 'SUBMITTED_TO_TPO',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recruitment_interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES recruitment_applications(id) ON DELETE CASCADE,
  job_id VARCHAR(100) REFERENCES jobs(id) ON DELETE SET NULL,
  company_id VARCHAR(100) REFERENCES companies(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  round_name VARCHAR(150),
  round_number INT DEFAULT 1,
  scheduled_time TIMESTAMPTZ,
  duration_minutes INT DEFAULT 45,
  interviewer_name VARCHAR(255),
  mode VARCHAR(100),
  meeting_link TEXT,
  status VARCHAR(50) DEFAULT 'SCHEDULED',
  score INT,
  notes TEXT,
  decision VARCHAR(50),
  ai_analysis JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recruitment_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES recruitment_applications(id) ON DELETE CASCADE,
  job_id VARCHAR(100) REFERENCES jobs(id) ON DELETE SET NULL,
  company_id VARCHAR(100) REFERENCES companies(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  role VARCHAR(255),
  fixed_ctc_lpa NUMERIC(8,2),
  variable_ctc_lpa NUMERIC(8,2),
  joining_bonus_lpa NUMERIC(8,2),
  total_ctc_lpa NUMERIC(8,2),
  location VARCHAR(255),
  joining_date DATE,
  valid_until DATE,
  status VARCHAR(50) DEFAULT 'ISSUED',
  letter_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications_global (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_id VARCHAR(100) REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  category VARCHAR(100),
  is_read BOOLEAN DEFAULT FALSE,
  action_route VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id VARCHAR(100) REFERENCES companies(id) ON DELETE SET NULL,
  recruiter_id VARCHAR(100) REFERENCES recruiters(id) ON DELETE SET NULL,
  action VARCHAR(150) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(150),
  details TEXT,
  severity VARCHAR(50) DEFAULT 'INFO',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_applications_company ON recruitment_applications(company_id);
CREATE INDEX IF NOT EXISTS idx_applications_student ON recruitment_applications(student_id);
CREATE INDEX IF NOT EXISTS idx_interviews_company ON recruitment_interviews(company_id);
CREATE INDEX IF NOT EXISTS idx_offers_student ON recruitment_offers(student_id);


CREATE TABLE IF NOT EXISTS tpo_users (
  id VARCHAR(100) PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  institution_id VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_recruiters_user ON recruiters(user_id);
CREATE INDEX IF NOT EXISTS idx_tpo_users_user ON tpo_users(user_id);
