CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
