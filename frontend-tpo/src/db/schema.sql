-- =====================================================================
-- CAMPUSLINK ENTERPRISE PLACEMENT OPERATIONS PLATFORM
-- PRODUCTION POSTGRESQL DDL SCHEMA WITH OBJECT-LEVEL SECURITY (RLS)
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. INSTITUTIONS & CAMPUSES
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(64) NOT NULL,
    city VARCHAR(128) NOT NULL,
    state VARCHAR(128) NOT NULL,
    established_year INT NOT NULL,
    accreditation VARCHAR(64),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE campuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(32) NOT NULL,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(32) NOT NULL
);

CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(32) NOT NULL
);

-- 2. USERS, ROLES & PERMISSIONS
CREATE TYPE user_role_enum AS ENUM ('SYSTEM_ADMIN', 'COLLEGE_TPO', 'CAMPUS_COORDINATOR', 'RECRUITER');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'COLLEGE_TPO',
    institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
    campus_id UUID REFERENCES campuses(id) ON DELETE SET NULL,
    phone VARCHAR(32),
    avatar_url TEXT,
    status VARCHAR(32) DEFAULT 'ACTIVE',
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(128) NOT NULL UNIQUE,
    category VARCHAR(64) NOT NULL,
    description TEXT
);

CREATE TABLE role_permissions (
    role user_role_enum NOT NULL,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role, permission_id)
);

-- 3. SKILLS
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL UNIQUE,
    category VARCHAR(64) NOT NULL,
    demand_tier VARCHAR(32) DEFAULT 'HIGH'
);

-- 4. MENTORS
CREATE TABLE mentors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    department VARCHAR(128) NOT NULL,
    designation VARCHAR(128) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STUDENTS & ACADEMICS
CREATE TYPE readiness_level_enum AS ENUM ('PLACEMENT_READY', 'HIGHLY_EMPLOYABLE', 'DEVELOPING', 'AT_RISK');
CREATE TYPE placement_status_enum AS ENUM ('UNPLACED', 'APPLIED', 'SHORTLISTED', 'INTERVIEWING', 'OFFERED', 'PLACED', 'OPTED_OUT');

CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    campus_id UUID REFERENCES campuses(id) ON DELETE SET NULL,
    roll_number VARCHAR(64) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    gender VARCHAR(16),
    department VARCHAR(128) NOT NULL,
    branch VARCHAR(32) NOT NULL,
    graduation_year INT NOT NULL,
    mentor_id UUID REFERENCES mentors(id) ON DELETE SET NULL,
    readiness_level readiness_level_enum DEFAULT 'DEVELOPING',
    placement_status placement_status_enum DEFAULT 'UNPLACED',
    is_flagged_at_risk BOOLEAN DEFAULT FALSE,
    risk_score NUMERIC(5,2) DEFAULT 0.0,
    placement_willingness BOOLEAN DEFAULT TRUE,
    profile_completion_pct INT DEFAULT 0,
    resume_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uk_student_roll_inst UNIQUE(institution_id, roll_number),
    CONSTRAINT uk_student_email UNIQUE(email)
);

CREATE TABLE student_academics (
    student_id UUID PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
    cgpa NUMERIC(4,2) NOT NULL,
    tenth_percentage NUMERIC(5,2),
    twelfth_percentage NUMERIC(5,2),
    active_backlogs INT DEFAULT 0,
    history_of_backlogs INT DEFAULT 0,
    attendance_pct NUMERIC(5,2) DEFAULT 85.0
);

CREATE TABLE student_skills (
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(32) DEFAULT 'INTERMEDIATE',
    is_primary BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (student_id, skill_id)
);

-- 6. COMPANIES & RECRUITERS
CREATE TYPE company_tier_enum AS ENUM ('TIER_1_SUPER_DREAM', 'TIER_2_DREAM', 'TIER_3_MASS', 'TIER_CORE');

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    industry VARCHAR(128) NOT NULL,
    tier company_tier_enum DEFAULT 'TIER_2_DREAM',
    website VARCHAR(255),
    status VARCHAR(32) DEFAULT 'APPROVED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE recruiters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(32),
    designation VARCHAR(128),
    status VARCHAR(32) DEFAULT 'APPROVED',
    approved_by_tpo_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. JOBS
CREATE TYPE job_status_enum AS ENUM ('PENDING_TPO_REVIEW', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED', 'CLOSED');

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    role_type VARCHAR(64) DEFAULT 'FULL_TIME',
    ctc_lpa NUMERIC(6,2) NOT NULL,
    stipend_per_month NUMERIC(10,2),
    location VARCHAR(255) NOT NULL,
    description TEXT,
    min_cgpa NUMERIC(4,2) DEFAULT 6.0,
    max_backlogs INT DEFAULT 0,
    tenth_min_pct NUMERIC(5,2) DEFAULT 60.0,
    twelfth_min_pct NUMERIC(5,2) DEFAULT 60.0,
    status job_status_enum DEFAULT 'PENDING_TPO_REVIEW',
    review_notes TEXT,
    reviewed_by_tpo_id UUID REFERENCES users(id),
    application_deadline TIMESTAMPTZ,
    openings INT DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE job_branches (
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    branch_code VARCHAR(32) NOT NULL,
    PRIMARY KEY(job_id, branch_code)
);

CREATE TABLE job_skills (
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT TRUE,
    PRIMARY KEY(job_id, skill_id)
);

-- 8. APPLICATIONS & CANDIDATE ACCESS CONTROL
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    is_eligible BOOLEAN DEFAULT TRUE,
    ineligibility_reason TEXT,
    ai_match_score NUMERIC(5,2),
    tpo_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(64) DEFAULT 'APPLIED',
    CONSTRAINT uk_student_job_app UNIQUE(student_id, job_id)
);

-- CRITICAL OBJECT-LEVEL ACCESS RECORD FOR CANDIDATE EXPOSURE
CREATE TABLE candidate_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    granted_by_tpo_id UUID NOT NULL REFERENCES users(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    access_status VARCHAR(32) DEFAULT 'ACTIVE',
    data_visibility_scope VARCHAR(64) DEFAULT 'FULL_VERIFIED_PROFILE',
    revocation_reason TEXT,
    CONSTRAINT uk_candidate_access UNIQUE(job_id, student_id)
);

-- 9. DRIVES, VENUES, PANELS & SCHEDULING
CREATE TYPE drive_status_enum AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED');

CREATE TABLE placement_drives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    campus_id UUID REFERENCES campuses(id) ON DELETE SET NULL,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    drive_name VARCHAR(255) NOT NULL,
    drive_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    venue VARCHAR(255),
    status drive_status_enum DEFAULT 'SCHEDULED',
    panelists_count INT DEFAULT 4,
    infrastructure_capacity INT DEFAULT 120,
    coordinating_tpo_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    campus_id UUID REFERENCES campuses(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(64) NOT NULL,
    capacity INT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE
);

CREATE TABLE interview_panels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    lead_panelist VARCHAR(255) NOT NULL,
    specialization VARCHAR(128)
);

CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    drive_id UUID NOT NULL REFERENCES placement_drives(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
    panel_id UUID REFERENCES interview_panels(id) ON DELETE SET NULL,
    round_name VARCHAR(128) NOT NULL,
    schedule_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INT DEFAULT 60
);

CREATE TABLE schedule_conflicts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    conflict_type VARCHAR(64) NOT NULL,
    severity VARCHAR(16) DEFAULT 'HIGH',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    affected_drives JSONB,
    affected_students_count INT DEFAULT 0,
    suggested_resolution TEXT,
    status VARCHAR(32) DEFAULT 'UNRESOLVED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. INTERVIEWS & OFFERS
CREATE TABLE interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    drive_id UUID NOT NULL REFERENCES placement_drives(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    round_number INT DEFAULT 1,
    round_name VARCHAR(128) NOT NULL,
    scheduled_time TIMESTAMPTZ NOT NULL,
    venue_or_room VARCHAR(128),
    panelist_name VARCHAR(255),
    attendance_status VARCHAR(32) DEFAULT 'SCHEDULED',
    result_status VARCHAR(32) DEFAULT 'PENDING',
    feedback_notes TEXT
);

CREATE TYPE offer_status_enum AS ENUM ('OFFERED', 'ACCEPTED', 'DECLINED', 'DEFERRED', 'WITHDRAWN', 'JOINED', 'NOT_JOINED');

CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    designation VARCHAR(255) NOT NULL,
    ctc_lpa NUMERIC(6,2) NOT NULL,
    offer_date DATE NOT NULL,
    acceptance_deadline DATE NOT NULL,
    status offer_status_enum DEFAULT 'OFFERED',
    is_dream_offer BOOLEAN DEFAULT FALSE,
    joining_date DATE,
    joining_location VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. DOCUMENTS & NOTIFICATIONS
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    document_type VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'PENDING',
    verified_by_tpo_id UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(64) NOT NULL,
    target_audience VARCHAR(64) NOT NULL,
    target_branch VARCHAR(32),
    recipient_count INT DEFAULT 0,
    channels JSONB,
    sent_by_tpo_id UUID REFERENCES users(id),
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AUDIT LOGS (IMMUTABLE SECURITY TRAIL)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
    user_id UUID NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_role VARCHAR(64) NOT NULL,
    action VARCHAR(64) NOT NULL,
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(128) NOT NULL,
    details TEXT,
    ip_address VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. AI CONVERSATIONS & PREDICTIONS
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    sender VARCHAR(32) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- POSTGRESQL ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy: TPO only accesses their own institution students
CREATE POLICY tpo_institution_isolation ON students
    FOR ALL
    USING (
        institution_id = NULLIF(current_setting('app.current_institution_id', true), '')::uuid
        OR current_setting('app.current_user_role', true) = 'SYSTEM_ADMIN'
    );
