import {
  Company,
  Recruiter,
  JobRequisition,
  StudentProfile,
  CandidateAccess,
  Application,
  InterviewRecord,
  OfferRecord,
  PlacementDrive,
  NotificationItem,
  AuditLog
} from '../types/recruiter.ts';

export const POSTGRESQL_SCHEMA_SQL = `
-- ============================================================
-- CAMPUSLINK RECRUITER POSTGRESQL RELATIONAL SCHEMA
-- Multi-Tenant Zero-Leak Campus Recruitment Database
-- ============================================================

CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'RECRUITER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE companies (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(128) NOT NULL,
    website VARCHAR(255),
    logo_url TEXT,
    description TEXT,
    tier VARCHAR(32) DEFAULT 'Tier-1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recruiters (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    company_id VARCHAR(64) REFERENCES companies(id) ON DELETE CASCADE,
    designation VARCHAR(128) NOT NULL,
    phone VARCHAR(32),
    avatar_url TEXT,
    department VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(64) REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(128),
    description TEXT NOT NULL,
    min_cgpa NUMERIC(4,2) NOT NULL DEFAULT 6.50,
    eligible_branches TEXT[] NOT NULL,
    graduation_year INT NOT NULL,
    max_backlogs_allowed INT DEFAULT 0,
    experience_level VARCHAR(64) DEFAULT 'Freshers',
    ctc_min_lpa NUMERIC(6,2) NOT NULL,
    ctc_max_lpa NUMERIC(6,2) NOT NULL,
    ctc_breakdown TEXT,
    location VARCHAR(128) NOT NULL,
    work_mode VARCHAR(32) DEFAULT 'On-site',
    openings INT NOT NULL DEFAULT 1,
    deadline DATE NOT NULL,
    status VARCHAR(32) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE job_skills (
    id VARCHAR(64) PRIMARY KEY,
    job_id VARCHAR(64) REFERENCES jobs(id) ON DELETE CASCADE,
    skill_name VARCHAR(128) NOT NULL,
    is_mandatory BOOLEAN DEFAULT TRUE
);

-- Note: Students table is the University registry
CREATE TABLE students (
    id VARCHAR(64) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32),
    college_name VARCHAR(255) NOT NULL,
    roll_number VARCHAR(64) NOT NULL,
    branch VARCHAR(128) NOT NULL,
    graduation_year INT NOT NULL,
    cgpa NUMERIC(4,2) NOT NULL,
    active_backlogs INT DEFAULT 0,
    skills TEXT[] DEFAULT '{}',
    resume_url TEXT,
    resume_text TEXT,
    tpo_private_notes TEXT, -- SENSITIVE: Never select in recruiter queries!
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Explicit authorization bridge: Recruiter CANNOT view student without a row here or application
CREATE TABLE candidate_access (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(64) REFERENCES companies(id) ON DELETE CASCADE,
    student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
    drive_id VARCHAR(64),
    access_type VARCHAR(64) NOT NULL, -- 'JOB_APPLICATION', 'TPO_SHARED_DRIVE', 'SHORTLIST_REFERRAL'
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT unique_company_student_access UNIQUE(company_id, student_id)
);

CREATE TABLE applications (
    id VARCHAR(64) PRIMARY KEY,
    job_id VARCHAR(64) REFERENCES jobs(id) ON DELETE CASCADE,
    company_id VARCHAR(64) REFERENCES companies(id) ON DELETE CASCADE,
    student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
    applied_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(64) NOT NULL DEFAULT 'APPLIED',
    rejection_reason VARCHAR(255),
    rejection_comment TEXT,
    rejected_by VARCHAR(64),
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_notes TEXT,
    recruiter_notes TEXT,
    ai_match_score INT,
    ai_recommendation VARCHAR(64),
    ai_breakdown_json JSONB,
    CONSTRAINT unique_job_student UNIQUE(job_id, student_id)
);

CREATE TABLE placement_drives (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(64) REFERENCES companies(id) ON DELETE CASCADE,
    job_id VARCHAR(64) REFERENCES jobs(id) ON DELETE CASCADE,
    drive_title VARCHAR(255) NOT NULL,
    drive_date DATE NOT NULL,
    time_slot VARCHAR(64),
    duration_hours INT DEFAULT 8,
    campus_name VARCHAR(255) NOT NULL,
    interview_type VARCHAR(32) DEFAULT 'On-Campus',
    target_candidate_count INT DEFAULT 50,
    rounds TEXT[] DEFAULT '{}',
    special_requirements TEXT,
    tpo_approval_status VARCHAR(64) DEFAULT 'SUBMITTED_TO_TPO',
    tpo_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE interviews (
    id VARCHAR(64) PRIMARY KEY,
    application_id VARCHAR(64) REFERENCES applications(id) ON DELETE CASCADE,
    company_id VARCHAR(64) REFERENCES companies(id) ON DELETE CASCADE,
    job_id VARCHAR(64) REFERENCES jobs(id) ON DELETE CASCADE,
    student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
    round_name VARCHAR(64) NOT NULL,
    round_number INT DEFAULT 1,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INT DEFAULT 45,
    interviewer_name VARCHAR(255) NOT NULL,
    mode VARCHAR(64) DEFAULT 'Google Meet',
    meeting_link TEXT,
    status VARCHAR(64) DEFAULT 'SCHEDULED',
    score INT,
    notes TEXT,
    decision VARCHAR(64),
    ai_analysis_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE offers (
    id VARCHAR(64) PRIMARY KEY,
    application_id VARCHAR(64) REFERENCES applications(id) ON DELETE CASCADE,
    company_id VARCHAR(64) REFERENCES companies(id) ON DELETE CASCADE,
    job_id VARCHAR(64) REFERENCES jobs(id) ON DELETE CASCADE,
    student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
    role VARCHAR(255) NOT NULL,
    fixed_ctc_lpa NUMERIC(6,2) NOT NULL,
    variable_ctc_lpa NUMERIC(6,2) DEFAULT 0,
    joining_bonus_lpa NUMERIC(6,2) DEFAULT 0,
    total_ctc_lpa NUMERIC(6,2) NOT NULL,
    location VARCHAR(128) NOT NULL,
    joining_date DATE NOT NULL,
    valid_until DATE NOT NULL,
    status VARCHAR(64) DEFAULT 'ISSUED',
    letter_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(64) REFERENCES companies(id) ON DELETE CASCADE,
    type VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(64) REFERENCES companies(id) ON DELETE CASCADE,
    recruiter_id VARCHAR(64) REFERENCES recruiters(id) ON DELETE SET NULL,
    action VARCHAR(128) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    severity VARCHAR(32) DEFAULT 'INFO',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_applications_company ON applications(company_id);
CREATE INDEX idx_candidate_access_lookup ON candidate_access(company_id, student_id);
CREATE INDEX idx_jobs_company ON jobs(company_id);
CREATE INDEX idx_audit_logs_company ON audit_logs(company_id);
`;

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'company-apex-101',
    name: 'Apex Fintech Labs',
    logoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&auto=format&fit=crop&q=80',
    industry: 'Financial Technology & Algorithmic Trading',
    website: 'https://apexfintech.example.com',
    description: 'Tier-1 High Frequency Trading & Quantitative FinTech powerhouse engineering low-latency trading engines, distributed ledgers, and institutional asset solutions.',
    locations: ['Mumbai (BKC)', 'Bengaluru (Outer Ring Road)', 'Hyderabad (Hitec City)'],
    tier: 'Tier-1 Elite Campus Partner',
    recruiterContacts: [
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@apexfintech.example.com',
        phone: '+91 98201 44521',
        designation: 'Head of University Relations & Talent Acquisition'
      },
      {
        name: 'Sameer Kulkarni',
        email: 'sameer.k@apexfintech.example.com',
        phone: '+91 98201 44522',
        designation: 'Senior Technical Recruiter'
      }
    ]
  },
  {
    id: 'company-nova-102',
    name: 'Nova Cloud Systems',
    logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80',
    industry: 'Cloud Infrastructure & Kubernetes Platforms',
    website: 'https://novacloud.example.com',
    description: 'Hyperscale distributed cloud platform providing enterprise container orchestration and zero-trust edge networks.',
    locations: ['Hyderabad', 'Pune'],
    tier: 'Tier-1 Global Partner',
    recruiterContacts: [
      {
        name: 'Vikram Sen',
        email: 'vikram.sen@novacloud.example.com',
        phone: '+91 97112 33411',
        designation: 'Staff Campus Recruiter'
      }
    ]
  },
  {
    id: 'company-quantum-103',
    name: 'Quantum BioTech',
    logoUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=120&auto=format&fit=crop&q=80',
    industry: 'Healthcare AI & Genomic Analytics',
    website: 'https://quantumbio.example.com',
    description: 'Genomics and computational biology AI models revolutionizing clinical trial diagnostics and molecular synthesis.',
    locations: ['Gurugram (Cyber City)', 'Bengaluru'],
    tier: 'Specialized R&D Partner',
    recruiterContacts: [
      {
        name: 'Dr. Ananya Iyer',
        email: 'ananya.iyer@quantumbio.example.com',
        phone: '+91 99401 88290',
        designation: 'Director of Talent & Research Recruiting'
      }
    ]
  }
];

export const INITIAL_RECRUITERS: Recruiter[] = [
  {
    id: 'recruiter-apex-1',
    companyId: 'company-apex-101',
    name: 'Priya Sharma',
    email: 'priya.sharma@apexfintech.example.com',
    designation: 'Head of University Relations',
    phone: '+91 98201 44521',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'RECRUITER_ADMIN',
    department: 'Campus Talent Acquisition'
  },
  {
    id: 'recruiter-nova-2',
    companyId: 'company-nova-102',
    name: 'Vikram Sen',
    email: 'vikram.sen@novacloud.example.com',
    designation: 'Staff Campus Recruiter',
    phone: '+91 97112 33411',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'RECRUITER',
    department: 'Engineering Hiring'
  },
  {
    id: 'recruiter-quantum-3',
    companyId: 'company-quantum-103',
    name: 'Dr. Ananya Iyer',
    email: 'ananya.iyer@quantumbio.example.com',
    designation: 'Director of Research Recruiting',
    phone: '+91 99401 88290',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    role: 'RECRUITER_ADMIN',
    department: 'Applied Science Talent'
  }
];

export const INITIAL_JOBS: JobRequisition[] = [
  {
    id: 'job-apex-se-1',
    companyId: 'company-apex-101',
    title: 'Software Engineer - Full Stack & High Throughput',
    department: 'Core Trading Technologies',
    description: 'We are hiring elite final-year campus engineers to design and scale microservices processing over 150,000 transactions per second. You will build high-frequency pricing dashboards, event-driven trading queues with Kafka, and low-latency APIs.',
    responsibilities: [
      'Architect resilient full-stack web and backend services with React, TypeScript, and Java/Go/Python.',
      'Optimize database queries on PostgreSQL, Redis, and distributed cache engines.',
      'Implement real-time WebSocket pipelines for live market telemetry and risk monitors.',
      'Collaborate with Quantitative Traders and DevOps for zero-downtime campus rollouts.'
    ],
    requiredSkills: ['Python', 'SQL', 'React', 'Data Structures & Algorithms', 'REST APIs'],
    preferredSkills: ['Kafka', 'Docker', 'AWS', 'Redis', 'TypeScript'],
    minCgpa: 8.0,
    eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Electrical & Electronics', 'Data Science & AI'],
    graduationYear: 2027,
    maxBacklogsAllowed: 0,
    experienceLevel: 'Fresher / Final Year B.Tech or M.Tech',
    requiredCertifications: ['AWS Certified Cloud Practitioner or equivalent academic coursework'],
    ctcMinLpa: 18.0,
    ctcMaxLpa: 24.0,
    ctcBreakdown: 'Base CTC: ₹16.0 LPA | Performance Bonus: ₹4.0 LPA | Joining Bonus: ₹4.0 LPA | Comprehensive Health Cover & Relocation Allowance',
    location: 'Bengaluru / Mumbai (Hybrid: 3 days in office)',
    workMode: 'Hybrid',
    openings: 8,
    deadline: '2026-11-15',
    status: 'ACTIVE',
    createdAt: '2026-09-10T10:00:00Z'
  },
  {
    id: 'job-apex-quant-2',
    companyId: 'company-apex-101',
    title: 'Quantitative Trading Analyst',
    department: 'Quantitative Alpha Research',
    description: 'Seeking exceptional problem solvers with mathematical rigor to model financial time-series, backtest statistical arbitrage strategies, and deploy automated execution algorithms.',
    responsibilities: [
      'Formulate and test statistical hypotheses on global tick-by-tick financial market data.',
      'Develop robust risk management algorithms and machine learning feature pipelines.',
      'Write ultra-optimized Python/C++ numerical code for latency-critical execution.'
    ],
    requiredSkills: ['Python', 'Probability & Statistics', 'Linear Algebra', 'SQL', 'Pandas & NumPy'],
    preferredSkills: ['C++', 'Machine Learning', 'Time Series Analysis', 'Stochastic Calculus'],
    minCgpa: 8.5,
    eligibleBranches: ['Computer Science & Engineering', 'Mathematics & Computing', 'Electrical Engineering'],
    graduationYear: 2027,
    maxBacklogsAllowed: 0,
    experienceLevel: 'Fresher / Final Year B.Tech/Dual Degree',
    requiredCertifications: [],
    ctcMinLpa: 22.0,
    ctcMaxLpa: 28.0,
    ctcBreakdown: 'Base: ₹20.0 LPA | Guaranteed Bonus: ₹4.0 LPA | Performance Incentive: ₹4.0 LPA',
    location: 'Mumbai (BKC)',
    workMode: 'On-site',
    openings: 3,
    deadline: '2026-11-20',
    status: 'ACTIVE',
    createdAt: '2026-09-12T11:00:00Z'
  },
  {
    id: 'job-nova-cloud-3',
    companyId: 'company-nova-102',
    title: 'Cloud DevOps & Systems Engineer',
    department: 'Infrastructure Engineering',
    description: 'Build enterprise-scale Kubernetes orchestration, infrastructure as code, and CI/CD automation systems for global multi-region deployments.',
    responsibilities: [
      'Manage multi-cluster Kubernetes environments across AWS and GCP.',
      'Write Terraform modules and Helm charts for automated zero-trust deployments.',
      'Monitor cluster health using Prometheus, Grafana, and OpenTelemetry.'
    ],
    requiredSkills: ['Linux', 'Docker', 'Kubernetes', 'Python', 'Networking Basics'],
    preferredSkills: ['Terraform', 'Go', 'AWS', 'Prometheus'],
    minCgpa: 7.5,
    eligibleBranches: ['Computer Science', 'Information Technology', 'Electronics & Comm.'],
    graduationYear: 2027,
    maxBacklogsAllowed: 0,
    experienceLevel: 'Fresher',
    requiredCertifications: ['AWS Cloud Practitioner or Docker Basics'],
    ctcMinLpa: 14.0,
    ctcMaxLpa: 18.0,
    ctcBreakdown: 'Base: ₹13.0 LPA | Performance: ₹3.0 LPA | Stock Units: ₹2.0 LPA',
    location: 'Hyderabad / Pune',
    workMode: 'Hybrid',
    openings: 5,
    deadline: '2026-11-10',
    status: 'ACTIVE',
    createdAt: '2026-09-15T09:00:00Z'
  },
  {
    id: 'job-quantum-bio-4',
    companyId: 'company-quantum-103',
    title: 'Bioinformatics ML Research Fellow',
    department: 'Computational Genomics',
    description: 'Develop deep learning architectures for DNA sequence analysis, protein folding prediction, and biomarker discovery in clinical studies.',
    responsibilities: [
      'Train PyTorch vision and transformer models on multi-gigabyte genomic sequences.',
      'Perform high-performance compute pipeline runs using Nextflow and Slurm.',
      'Publish research findings and patent novel biological computational algorithms.'
    ],
    requiredSkills: ['PyTorch', 'Python', 'Bioinformatics Basics', 'Data Analysis'],
    preferredSkills: ['Transformers', 'Nextflow', 'R', 'Linux HPC'],
    minCgpa: 8.0,
    eligibleBranches: ['BioTechnology', 'Computer Science', 'Data Science & AI'],
    graduationYear: 2027,
    maxBacklogsAllowed: 0,
    experienceLevel: 'Fresher / M.Tech / B.Tech',
    requiredCertifications: ['NCBI or Bioinformatics AI Specialization'],
    ctcMinLpa: 16.0,
    ctcMaxLpa: 22.0,
    ctcBreakdown: 'Base: ₹15.0 LPA | Retention Bonus: ₹3.0 LPA | R&D Incentive: ₹4.0 LPA',
    location: 'Gurugram',
    workMode: 'Hybrid',
    openings: 4,
    deadline: '2026-11-25',
    status: 'ACTIVE',
    createdAt: '2026-09-18T14:00:00Z'
  }
];

export const GLOBAL_CAMPUS_STUDENTS: StudentProfile[] = [
  {
    id: 'stu-apex-01',
    fullName: 'Rahul Verma',
    email: 'rahul.verma27@college.edu',
    phone: '+91 98112 00192',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    collegeName: 'National Institute of Technology (NIT)',
    rollNumber: '23CS042',
    branch: 'Computer Science & Engineering',
    graduationYear: 2027,
    cgpa: 9.24,
    activeBacklogs: 0,
    skills: ['Python', 'SQL', 'React', 'TypeScript', 'Data Structures & Algorithms', 'Redis', 'Kafka', 'Docker'],
    projects: [
      {
        title: 'Distributed Order Matching Engine',
        techStack: ['Python', 'Redis', 'FastAPI', 'Docker'],
        description: 'Engineered a high-throughput limit order book simulator benchmarking 12,000 matches/sec with zero race conditions using Redis streams and asyncio.',
        link: 'https://github.com/rahulv/order-matcher'
      },
      {
        title: 'FinTelemetry Live Dashboard',
        techStack: ['React', 'TypeScript', 'WebSockets', 'Tailwind CSS'],
        description: 'Interactive analytics dashboard streaming real-time candlestick charts and transaction risk alerts with under 40ms render latency.'
      }
    ],
    experience: [
      {
        company: 'FinPulse Systems (Summer Intern)',
        role: 'Software Engineering Intern',
        duration: 'May 2026 - July 2026 (3 months)',
        summary: 'Optimized PostgreSQL batch settlement queries resulting in 34% reduction in peak pipeline latency.'
      }
    ],
    certifications: ['AWS Certified Cloud Practitioner', 'HackerRank 6-Star Python Specialist'],
    resumeUrl: 'https://cdn.college.edu/resumes/23CS042_Rahul_Verma.pdf',
    resumeText: 'Rahul Verma. B.Tech Computer Science, CGPA 9.24. Elite competitive programmer. Specialized in distributed systems, asynchronous Python, React frontend architecture, SQL query tuning, and Kafka queues. Interned at FinPulse Systems. Passionate about financial technology and low latency.',
    codingProfiles: [
      { platform: 'LeetCode', handle: 'rahul_v27', score: 'Knight (2180)' },
      { platform: 'Codeforces', handle: 'rahul_verma', score: 'Expert (1750)' }
    ],
    tpoPrivateNotes: 'CONFIDENTIAL TPO: Excellent academic record. Student was campus representative in 3rd year. Eligible for Day 1 Dream companies.',
    otherCompanyApplicationsCount: 2
  },
  {
    id: 'stu-apex-02',
    fullName: 'Priya Nair',
    email: 'priya.nair27@college.edu',
    phone: '+91 98223 11843',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    collegeName: 'National Institute of Technology (NIT)',
    rollNumber: '23CS088',
    branch: 'Computer Science & Engineering',
    graduationYear: 2027,
    cgpa: 9.10,
    activeBacklogs: 0,
    skills: ['Python', 'SQL', 'React', 'FastAPI', 'Pandas', 'PostgreSQL', 'Git', 'Data Structures & Algorithms'],
    projects: [
      {
        title: 'Algorithmic Portfolio Risk Evaluator',
        techStack: ['Python', 'Pandas', 'SQL', 'FastAPI'],
        description: 'Computed Value-at-Risk (VaR) and Sharpe ratios across 500 equity securities with Monte Carlo simulations in NumPy.'
      },
      {
        title: 'Campus Placement Portal UI',
        techStack: ['React', 'TypeScript', 'Tailwind CSS'],
        description: 'Built intuitive recruiting management interface used by over 1,200 students and 45 recruiters.'
      }
    ],
    experience: [
      {
        company: 'Algoverse Technologies (Research Intern)',
        role: 'Quantitative Software Intern',
        duration: 'June 2026 - Aug 2026',
        summary: 'Backtested momentum indicators and built automated reporting scripts in Python.'
      }
    ],
    certifications: ['DeepLearning.AI Machine Learning Specialization'],
    resumeUrl: 'https://cdn.college.edu/resumes/23CS088_Priya_Nair.pdf',
    resumeText: 'Priya Nair. B.Tech Computer Science, CGPA 9.10. Solid foundation in full stack development, Python, SQL, and quantitative data modeling. Strong communication skills and research publications.',
    codingProfiles: [
      { platform: 'LeetCode', handle: 'priya_n', score: 'Guardian (2210)' }
    ],
    tpoPrivateNotes: 'CONFIDENTIAL TPO: High integrity student, shortlisted for Google Summer of Code.',
    otherCompanyApplicationsCount: 1
  },
  {
    id: 'stu-apex-03',
    fullName: 'Aman Singh',
    email: 'aman.singh27@college.edu',
    phone: '+91 97118 44021',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    collegeName: 'National Institute of Technology (NIT)',
    rollNumber: '23IT019',
    branch: 'Information Technology',
    graduationYear: 2027,
    cgpa: 8.65,
    activeBacklogs: 0,
    skills: ['Python', 'SQL', 'React', 'REST APIs', 'PostgreSQL', 'Docker'],
    projects: [
      {
        title: 'Real-time Payment Webhook Gateway',
        techStack: ['Python', 'FastAPI', 'PostgreSQL', 'Stripe API'],
        description: 'Fault-tolerant idempotency engine preventing duplicate transactions during network retries.'
      }
    ],
    experience: [],
    certifications: ['Oracle Certified Associate, Java SE 8'],
    resumeUrl: 'https://cdn.college.edu/resumes/23IT019_Aman_Singh.pdf',
    resumeText: 'Aman Singh. B.Tech Information Technology, CGPA 8.65. Proficient in Python web backend, relational databases, REST APIs and React. Eager to solve challenging scale problems.',
    codingProfiles: [
      { platform: 'LeetCode', handle: 'amansingh_code', score: '1850' }
    ],
    tpoPrivateNotes: 'CONFIDENTIAL TPO: Regular attendance, no disciplinary issues.',
    otherCompanyApplicationsCount: 3
  },
  {
    id: 'stu-apex-04',
    fullName: 'Sneha Kulkarni',
    email: 'sneha.k27@college.edu',
    phone: '+91 98205 77120',
    avatarUrl: 'https://images.unsplash.com/photo-1534751516642-a171ed28a0e5?w=120&auto=format&fit=crop&q=80',
    collegeName: 'National Institute of Technology (NIT)',
    rollNumber: '23CS105',
    branch: 'Computer Science & Engineering',
    graduationYear: 2027,
    cgpa: 8.35,
    activeBacklogs: 0,
    skills: ['Python', 'SQL', 'React', 'HTML/CSS', 'JavaScript', 'Git'],
    projects: [
      {
        title: 'Micro-Invoicing SaaS',
        techStack: ['React', 'Express', 'SQL'],
        description: 'Client billing and PDF invoice automation system.'
      }
    ],
    experience: [],
    certifications: [],
    resumeUrl: 'https://cdn.college.edu/resumes/23CS105_Sneha_Kulkarni.pdf',
    resumeText: 'Sneha Kulkarni. B.Tech CSE, CGPA 8.35. Full stack enthusiast with projects in React and Python.',
    tpoPrivateNotes: 'CONFIDENTIAL TPO: Recommended for standard software roles.',
    otherCompanyApplicationsCount: 2
  },
  {
    id: 'stu-apex-05',
    fullName: 'Devansh Rao',
    email: 'devansh.rao27@college.edu',
    phone: '+91 99104 22899',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    collegeName: 'National Institute of Technology (NIT)',
    rollNumber: '23EE034',
    branch: 'Electrical & Electronics',
    graduationYear: 2027,
    cgpa: 8.12,
    activeBacklogs: 0,
    skills: ['Python', 'C++', 'Data Structures', 'MATLAB', 'Basic SQL'],
    projects: [
      {
        title: 'Embedded Sensor Telemetry Streamer',
        techStack: ['C++', 'Python', 'MQTT'],
        description: 'Low power transmission protocol over serial bus.'
      }
    ],
    experience: [],
    certifications: [],
    resumeUrl: 'https://cdn.college.edu/resumes/23EE034_Devansh_Rao.pdf',
    resumeText: 'Devansh Rao. Electrical Engineering, CGPA 8.12. Strong algorithmic problem solving and low-level code.',
    tpoPrivateNotes: 'CONFIDENTIAL TPO: Transitioning from hardware to software.',
    otherCompanyApplicationsCount: 1
  },
  {
    id: 'stu-apex-06',
    fullName: 'Tanvi Mehta',
    email: 'tanvi.m27@college.edu',
    phone: '+91 98450 66211',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    collegeName: 'National Institute of Technology (NIT)',
    rollNumber: '23CS140',
    branch: 'Computer Science & Engineering',
    graduationYear: 2027,
    cgpa: 7.82,
    activeBacklogs: 1,
    skills: ['Java', 'Spring Boot', 'MySQL', 'HTML'],
    projects: [
      {
        title: 'Library Catalog Management',
        techStack: ['Java', 'MySQL'],
        description: 'Traditional book issuing system.'
      }
    ],
    experience: [],
    certifications: [],
    resumeUrl: 'https://cdn.college.edu/resumes/23CS140_Tanvi_Mehta.pdf',
    resumeText: 'Tanvi Mehta. B.Tech Computer Science, CGPA 7.82, 1 active backlog in Discrete Mathematics.',
    tpoPrivateNotes: 'CONFIDENTIAL TPO: Student had medical leave in semester 5. Working on backlog clearance.',
    otherCompanyApplicationsCount: 4
  },
  {
    id: 'stu-apex-shared-07',
    fullName: 'Karthik Raja',
    email: 'karthik.raja27@college.edu',
    phone: '+91 98402 33190',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
    collegeName: 'National Institute of Technology (NIT)',
    rollNumber: '23CS012',
    branch: 'Computer Science & Engineering',
    graduationYear: 2027,
    cgpa: 9.38,
    activeBacklogs: 0,
    skills: ['Python', 'C++', 'Probability & Statistics', 'SQL', 'Linear Algebra', 'Pandas', 'NumPy', 'Financial Engineering'],
    projects: [
      {
        title: 'Tick-level High Frequency Backtester',
        techStack: ['C++', 'Python', 'Pandas'],
        description: 'Simulated market maker spread capturing with nanosecond timestamps across historical L2 order data.'
      }
    ],
    experience: [
      {
        company: 'QuantLab Bengaluru (Winter Fellow)',
        role: 'Research Fellow',
        duration: 'Dec 2025 - Jan 2026',
        summary: 'Analyzed autocorrelation of equity bid-ask spreads during market open auctions.'
      }
    ],
    certifications: ['CQF Institute Mathematical Finance Certificate'],
    resumeUrl: 'https://cdn.college.edu/resumes/23CS012_Karthik_Raja.pdf',
    resumeText: 'Karthik Raja. B.Tech CSE, CGPA 9.38. University Topper in Mathematics. Top 0.1% JEE Rank. Advanced quantitative research projects in C++ and statistical modeling.',
    codingProfiles: [
      { platform: 'Codeforces', handle: 'karthik_quant', score: 'Master (2140)' }
    ],
    tpoPrivateNotes: 'CONFIDENTIAL TPO: Released to Apex Fintech per TPO special fast-track quota for Quant Trading requisition.',
    otherCompanyApplicationsCount: 0
  },
  {
    id: 'stu-apex-shared-08',
    fullName: 'Anjali Deshmukh',
    email: 'anjali.d27@college.edu',
    phone: '+91 97665 44102',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=120&auto=format&fit=crop&q=80',
    collegeName: 'National Institute of Technology (NIT)',
    rollNumber: '23DS004',
    branch: 'Data Science & AI',
    graduationYear: 2027,
    cgpa: 8.92,
    activeBacklogs: 0,
    skills: ['Python', 'SQL', 'Probability & Statistics', 'Pandas', 'Machine Learning', 'Linear Algebra'],
    projects: [
      {
        title: 'Cryptocurrency Volatility Forecasting using GARCH',
        techStack: ['Python', 'Statsmodels', 'SQL'],
        description: 'Econometric time-series model forecasting intraday volatility spikes.'
      }
    ],
    experience: [],
    certifications: ['DeepLearning.AI Deep Learning Specialization'],
    resumeUrl: 'https://cdn.college.edu/resumes/23DS004_Anjali_Deshmukh.pdf',
    resumeText: 'Anjali Deshmukh. B.Tech Data Science & AI, CGPA 8.92. Strong mathematical analysis and statistical finance enthusiast.',
    tpoPrivateNotes: 'CONFIDENTIAL TPO: Released by TPO for Apex Quant pool.',
    otherCompanyApplicationsCount: 1
  },
  {
    id: 'stu-nova-01',
    fullName: 'Rohan Gupta',
    email: 'rohan.gupta27@college.edu',
    phone: '+91 98101 22334',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    collegeName: 'National Institute of Technology (NIT)',
    rollNumber: '23CS060',
    branch: 'Computer Science & Engineering',
    graduationYear: 2027,
    cgpa: 8.80,
    activeBacklogs: 0,
    skills: ['Linux', 'Docker', 'Kubernetes', 'Go', 'AWS'],
    projects: [
      {
        title: 'K8s Cluster Auto-Scaler',
        techStack: ['Go', 'Kubernetes API', 'Prometheus'],
        description: 'Custom Kubernetes controller dynamically resizing worker nodes based on p99 queue latency.'
      }
    ],
    experience: [],
    certifications: ['CKA: Certified Kubernetes Administrator'],
    resumeUrl: 'https://cdn.college.edu/resumes/23CS060_Rohan_Gupta.pdf',
    resumeText: 'Rohan Gupta. Cloud systems enthusiast applied strictly to Nova Cloud Systems.',
    tpoPrivateNotes: 'CONFIDENTIAL TPO: Candidate committed to cloud infrastructure companies.',
    otherCompanyApplicationsCount: 1
  },
  {
    id: 'stu-nova-02',
    fullName: 'Neha Reddy',
    email: 'neha.reddy27@college.edu',
    phone: '+91 98490 11982',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&auto=format&fit=crop&q=80',
    collegeName: 'National Institute of Technology (NIT)',
    rollNumber: '23IT044',
    branch: 'Information Technology',
    graduationYear: 2027,
    cgpa: 8.55,
    activeBacklogs: 0,
    skills: ['Linux', 'Docker', 'Python', 'Terraform', 'Prometheus'],
    projects: [
      {
        title: 'Multi-Cloud Terraform Blueprints',
        techStack: ['Terraform', 'Bash', 'AWS'],
        description: 'Automated provisioning of VPC and container subnets.'
      }
    ],
    experience: [],
    certifications: [],
    resumeUrl: 'https://cdn.college.edu/resumes/23IT044_Neha_Reddy.pdf',
    resumeText: 'Neha Reddy. DevOps engineer.',
    tpoPrivateNotes: 'CONFIDENTIAL TPO: No infractions.',
    otherCompanyApplicationsCount: 2
  },
  {
    id: 'stu-unapplied-99',
    fullName: 'Arjun Kapoor (Unapplied Campus Student)',
    email: 'arjun.kapoor27@college.edu',
    phone: '+91 98111 99999',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    collegeName: 'National Institute of Technology (NIT)',
    rollNumber: '23ME001',
    branch: 'Mechanical Engineering',
    graduationYear: 2027,
    cgpa: 7.20,
    activeBacklogs: 2,
    skills: ['SolidWorks', 'AutoCAD', 'Basic C'],
    projects: [],
    experience: [],
    certifications: [],
    resumeUrl: '',
    resumeText: 'Unapplied Mechanical student.',
    tpoPrivateNotes: 'RESTRICTED TPO INTERNAL ONLY: Student opted out of software drives.',
    otherCompanyApplicationsCount: 0
  }
];

export const INITIAL_CANDIDATE_ACCESS: CandidateAccess[] = [
  { id: 'acc-1', companyId: 'company-apex-101', studentId: 'stu-apex-01', accessType: 'JOB_APPLICATION', grantedAt: '2026-09-15T12:00:00Z' },
  { id: 'acc-2', companyId: 'company-apex-101', studentId: 'stu-apex-02', accessType: 'JOB_APPLICATION', grantedAt: '2026-09-15T12:30:00Z' },
  { id: 'acc-3', companyId: 'company-apex-101', studentId: 'stu-apex-03', accessType: 'JOB_APPLICATION', grantedAt: '2026-09-16T09:00:00Z' },
  { id: 'acc-4', companyId: 'company-apex-101', studentId: 'stu-apex-04', accessType: 'JOB_APPLICATION', grantedAt: '2026-09-16T10:15:00Z' },
  { id: 'acc-5', companyId: 'company-apex-101', studentId: 'stu-apex-05', accessType: 'JOB_APPLICATION', grantedAt: '2026-09-17T11:00:00Z' },
  { id: 'acc-6', companyId: 'company-apex-101', studentId: 'stu-apex-06', accessType: 'JOB_APPLICATION', grantedAt: '2026-09-17T14:20:00Z' },
  { id: 'acc-7', companyId: 'company-apex-101', studentId: 'stu-apex-shared-07', accessType: 'TPO_SHARED_DRIVE', grantedAt: '2026-09-20T08:00:00Z' },
  { id: 'acc-8', companyId: 'company-apex-101', studentId: 'stu-apex-shared-08', accessType: 'TPO_SHARED_DRIVE', grantedAt: '2026-09-20T08:00:00Z' },
  { id: 'acc-9', companyId: 'company-nova-102', studentId: 'stu-nova-01', accessType: 'JOB_APPLICATION', grantedAt: '2026-09-18T15:00:00Z' },
  { id: 'acc-10', companyId: 'company-nova-102', studentId: 'stu-nova-02', accessType: 'JOB_APPLICATION', grantedAt: '2026-09-18T16:00:00Z' }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-apex-01',
    jobId: 'job-apex-se-1',
    companyId: 'company-apex-101',
    studentId: 'stu-apex-01',
    appliedDate: '2026-09-15T12:00:00Z',
    status: 'INTERVIEW',
    recruiterNotes: 'Exceptional coder with live limit order book simulation. Cleared Round 1 Coding benchmark.',
    aiMatchScore: 94,
    aiRecommendation: 'Strong Hire',
    aiMatchBreakdown: {
      eligibilityScore: 100,
      skillMatchScore: 96,
      semanticSimilarity: 92,
      projectRelevance: 98,
      experienceScore: 88,
      certificationScore: 90,
      academicFit: 95,
      interviewReadiness: 94,
      whyRecommended: [
        '✓ High proficiency in mandatory stack: Python, SQL, React',
        '✓ Direct relevant project: Distributed Order Matching Engine in Redis & Python',
        '✓ CGPA 9.24 well exceeds minimum threshold of 8.00',
        '✓ Competitive programming rating (LeetCode Knight 2180)',
        '✓ Previous FinTech summer internship experience at FinPulse'
      ],
      gaps: [
        '⚠ AWS production deployment depth could be probed in technical interview'
      ],
      summary: 'Candidate Rahul Verma represents top 1% campus percentile for Full Stack & High Throughput role with proven algorithmic rigor and practical distributed systems projects.'
    }
  },
  {
    id: 'app-apex-02',
    jobId: 'job-apex-se-1',
    companyId: 'company-apex-101',
    studentId: 'stu-apex-02',
    appliedDate: '2026-09-15T12:30:00Z',
    status: 'SHORTLISTED',
    recruiterNotes: 'Strong quantitative instincts and very clean React + Python code style.',
    aiMatchScore: 91,
    aiRecommendation: 'Strong Hire',
    aiMatchBreakdown: {
      eligibilityScore: 100,
      skillMatchScore: 92,
      semanticSimilarity: 90,
      projectRelevance: 91,
      experienceScore: 85,
      certificationScore: 82,
      academicFit: 93,
      interviewReadiness: 90,
      whyRecommended: [
        '✓ Python, SQL, and React fully matched against requisition requirements',
        '✓ Algorithmic portfolio risk project demonstrates financial math intuition',
        '✓ CGPA 9.10 with zero active backlogs',
        '✓ LeetCode Guardian rank (2210)'
      ],
      gaps: [
        '⚠ Lacks Kafka queue streaming experience on resume'
      ],
      summary: 'Candidate Priya Nair exceeds academic and full-stack benchmarks with strong quantitative analytics foundation.'
    }
  },
  {
    id: 'app-apex-03',
    jobId: 'job-apex-se-1',
    companyId: 'company-apex-101',
    studentId: 'stu-apex-03',
    appliedDate: '2026-09-16T09:00:00Z',
    status: 'SHORTLISTED',
    recruiterNotes: 'Good understanding of backend transactions and idempotent payment gateways.',
    aiMatchScore: 86,
    aiRecommendation: 'Recommended',
    aiMatchBreakdown: {
      eligibilityScore: 100,
      skillMatchScore: 88,
      semanticSimilarity: 84,
      projectRelevance: 87,
      experienceScore: 70,
      certificationScore: 75,
      academicFit: 88,
      interviewReadiness: 85,
      whyRecommended: [
        '✓ Python, SQL, React and PostgreSQL verified',
        '✓ Practical payment webhook idempotency project',
        '✓ CGPA 8.65 meets cutoff comfortably'
      ],
      gaps: [
        '⚠ No prior formal industry internship experience',
        '⚠ Familiarity with high-frequency telemetry queues needs evaluation'
      ],
      summary: 'Solid full-stack engineering candidate with reliable systems architecture knowledge.'
    }
  },
  {
    id: 'app-apex-04',
    jobId: 'job-apex-se-1',
    companyId: 'company-apex-101',
    studentId: 'stu-apex-04',
    appliedDate: '2026-09-16T10:15:00Z',
    status: 'UNDER REVIEW',
    recruiterNotes: 'Generalist web engineer. Need to review algorithmic problem solving depth.',
    aiMatchScore: 82,
    aiRecommendation: 'Consider',
    aiMatchBreakdown: {
      eligibilityScore: 100,
      skillMatchScore: 84,
      semanticSimilarity: 80,
      projectRelevance: 78,
      experienceScore: 65,
      certificationScore: 60,
      academicFit: 85,
      interviewReadiness: 80,
      whyRecommended: [
        '✓ Core web stack (React, Python, SQL) present',
        '✓ CGPA 8.35 meets 8.00 requirement'
      ],
      gaps: [
        '⚠ Missing distributed systems experience (Kafka, Redis, Docker)',
        '⚠ Project scale is relatively basic (simple invoicing tool)'
      ],
      summary: 'Meets minimum baseline criteria, would benefit from technical screening before final interview panel.'
    }
  },
  {
    id: 'app-apex-05',
    jobId: 'job-apex-se-1',
    companyId: 'company-apex-101',
    studentId: 'stu-apex-05',
    appliedDate: '2026-09-17T11:00:00Z',
    status: 'UNDER REVIEW',
    recruiterNotes: 'Electrical engineering background. Strong C++ but lighter on React.',
    aiMatchScore: 74,
    aiRecommendation: 'Consider',
    aiMatchBreakdown: {
      eligibilityScore: 100,
      skillMatchScore: 70,
      semanticSimilarity: 72,
      projectRelevance: 68,
      experienceScore: 60,
      certificationScore: 55,
      academicFit: 82,
      interviewReadiness: 76,
      whyRecommended: [
        '✓ Strong algorithmic foundations in C++ & Python',
        '✓ CGPA 8.12 meets cutoff'
      ],
      gaps: [
        '⚠ Lacks React and modern frontend web experience',
        '⚠ Hardware/embedded focus may require ramp-up on microservice architecture'
      ],
      summary: 'Candidate shows high logical reasoning aptitude but has noticeable stack gaps for a Full Stack requisition.'
    }
  },
  {
    id: 'app-apex-06',
    jobId: 'job-apex-se-1',
    companyId: 'company-apex-101',
    studentId: 'stu-apex-06',
    appliedDate: '2026-09-17T14:20:00Z',
    status: 'REJECTED',
    rejectionReason: 'CGPA below cutoff',
    rejectionNotes: 'Candidate CGPA 7.82 is below mandatory cutoff 8.00 and has 1 active backlog in Discrete Math.',
    recruiterNotes: 'Screened out during eligibility automation check.',
    aiMatchScore: 54,
    aiRecommendation: 'Re-evaluate',
    aiMatchBreakdown: {
      eligibilityScore: 40,
      skillMatchScore: 60,
      semanticSimilarity: 58,
      projectRelevance: 55,
      experienceScore: 50,
      certificationScore: 45,
      academicFit: 52,
      interviewReadiness: 60,
      whyRecommended: [
        '✓ Familiar with Java and relational databases'
      ],
      gaps: [
        '⚠ Ineligible: CGPA 7.82 below minimum requirement of 8.00',
        '⚠ Ineligible: 1 active backlog violates zero backlog requirement',
        '⚠ Missing mandatory Python and modern React stack'
      ],
      summary: 'Fails mandatory eligibility threshold criteria established by Apex Fintech hiring policy.'
    }
  },
  {
    id: 'app-apex-quant-01',
    jobId: 'job-apex-quant-2',
    companyId: 'company-apex-101',
    studentId: 'stu-apex-shared-07',
    appliedDate: '2026-09-20T09:00:00Z',
    status: 'SELECTED',
    recruiterNotes: 'Phenomenal math intuition and C++ nanosecond backtester. Unanimous thumbs up from Head of Quant Trading.',
    aiMatchScore: 97,
    aiRecommendation: 'Strong Hire',
    aiMatchBreakdown: {
      eligibilityScore: 100,
      skillMatchScore: 98,
      semanticSimilarity: 96,
      projectRelevance: 99,
      experienceScore: 95,
      certificationScore: 92,
      academicFit: 99,
      interviewReadiness: 98,
      whyRecommended: [
        '✓ CGPA 9.38, Department Topper in Mathematics & Computing',
        '✓ Direct High Frequency Trading backtester in C++ on L2 order books',
        '✓ Research Fellow experience at QuantLab Bengaluru',
        '✓ Codeforces Master (2140) rating in top 0.2%'
      ],
      gaps: [],
      summary: 'Ideal candidate profile for Quantitative Trading Analyst with pristine mathematical and low-latency systems capability.'
    }
  },
  {
    id: 'app-apex-quant-02',
    jobId: 'job-apex-quant-2',
    companyId: 'company-apex-101',
    studentId: 'stu-apex-shared-08',
    appliedDate: '2026-09-20T09:15:00Z',
    status: 'INTERVIEW',
    recruiterNotes: 'Very solid time series analysis skills and econometric GARCH models.',
    aiMatchScore: 92,
    aiRecommendation: 'Strong Hire',
    aiMatchBreakdown: {
      eligibilityScore: 100,
      skillMatchScore: 93,
      semanticSimilarity: 90,
      projectRelevance: 92,
      experienceScore: 80,
      certificationScore: 88,
      academicFit: 94,
      interviewReadiness: 91,
      whyRecommended: [
        '✓ CGPA 8.92 in Data Science & AI',
        '✓ Econometric crypto volatility project directly aligns with quant alpha research',
        '✓ Proficient in Python, NumPy, Statsmodels and SQL'
      ],
      gaps: [
        '⚠ Limited C++ experience compared to other quant applicants'
      ],
      summary: 'Outstanding data science and statistical modeling talent with clear finance application.'
    }
  },
  {
    id: 'app-nova-01',
    jobId: 'job-nova-cloud-3',
    companyId: 'company-nova-102',
    studentId: 'stu-nova-01',
    appliedDate: '2026-09-18T15:00:00Z',
    status: 'INTERVIEW',
    aiMatchScore: 93,
    aiRecommendation: 'Strong Hire'
  },
  {
    id: 'app-nova-02',
    jobId: 'job-nova-cloud-3',
    companyId: 'company-nova-102',
    studentId: 'stu-nova-02',
    appliedDate: '2026-09-18T16:00:00Z',
    status: 'SHORTLISTED',
    aiMatchScore: 88,
    aiRecommendation: 'Recommended'
  }
];

export const INITIAL_INTERVIEWS: InterviewRecord[] = [
  {
    id: 'int-apex-01',
    applicationId: 'app-apex-01',
    jobId: 'job-apex-se-1',
    companyId: 'company-apex-101',
    studentId: 'stu-apex-01',
    roundName: 'Coding',
    roundNumber: 1,
    scheduledTime: '2026-09-22T10:00:00Z',
    durationMinutes: 60,
    interviewerName: 'Sameer Kulkarni (Senior Tech Lead)',
    mode: 'Coding Platform',
    meetingLink: 'https://meet.apexfintech.example.com/int-apex-01',
    status: 'COMPLETED',
    score: 95,
    notes: 'Solved dynamic programming problem in 22 mins with optimal O(N) space. Implemented clean asynchronous queue in Python with proper exception bubbling. Exceptional candidate.',
    decision: 'Pass to Next Round',
    aiAnalysis: {
      strengths: [
        'Optimal time and space complexity solution produced under 25 minutes',
        'Proactive edge case handling for thread race conditions',
        'Articulate communication throughout live code execution'
      ],
      weaknesses: [
        'Minor syntax query regarding Python async generators'
      ],
      technicalFit: '98/100 - Surpasses senior campus benchmark for algorithmic speed and distributed memory concepts.',
      communication: 'Very articulate, explains tradeoffs before writing code.',
      recommendation: 'Strong Recommendation to advance to Final Technical & System Design Round.',
      disclaimer: 'AI recommendation is an analytical aid. Recruiter and interview panel hold sole decision authority.'
    }
  },
  {
    id: 'int-apex-02',
    applicationId: 'app-apex-01',
    jobId: 'job-apex-se-1',
    companyId: 'company-apex-101',
    studentId: 'stu-apex-01',
    roundName: 'Technical',
    roundNumber: 2,
    scheduledTime: '2026-10-08T11:00:00Z',
    durationMinutes: 60,
    interviewerName: 'Priya Sharma & Arindam Bose (VP Trading Tech)',
    mode: 'Google Meet',
    meetingLink: 'https://meet.google.com/apex-hft-tech-rnd2',
    status: 'SCHEDULED'
  },
  {
    id: 'int-apex-03',
    applicationId: 'app-apex-quant-01',
    jobId: 'job-apex-quant-2',
    companyId: 'company-apex-101',
    studentId: 'stu-apex-shared-07',
    roundName: 'Technical',
    roundNumber: 1,
    scheduledTime: '2026-09-25T14:00:00Z',
    durationMinutes: 60,
    interviewerName: 'Dr. Nikhil Kothari (Head of Quant)',
    mode: 'On-Campus Room A',
    status: 'COMPLETED',
    score: 98,
    notes: 'Flawless stochastic calculus derivations and C++ memory management discussion. Solved order book fill problem with optimal mathematical rigor.',
    decision: 'Selected',
    aiAnalysis: {
      strengths: [
        'Instant mathematical intuition on martingale processes and probability',
        'Deep understanding of cache misses and zero-copy C++ buffers'
      ],
      weaknesses: [
        'None observed'
      ],
      technicalFit: '99/100 - Exemplary candidate matching Tier-1 global Quant researcher standards.',
      communication: 'Calm, precise, and academically rigorous.',
      recommendation: 'Immediate Offer Recommendation.',
      disclaimer: 'AI recommendation is an advisory summary. Recruiter confirms offer issuance.'
    }
  },
  {
    id: 'int-apex-04',
    applicationId: 'app-apex-quant-02',
    jobId: 'job-apex-quant-2',
    companyId: 'company-apex-101',
    studentId: 'stu-apex-shared-08',
    roundName: 'Technical',
    roundNumber: 1,
    scheduledTime: '2026-10-09T14:30:00Z',
    durationMinutes: 60,
    interviewerName: 'Dr. Nikhil Kothari (Head of Quant)',
    mode: 'Google Meet',
    meetingLink: 'https://meet.google.com/apex-quant-anjali',
    status: 'SCHEDULED'
  }
];

export const INITIAL_OFFERS: OfferRecord[] = [
  {
    id: 'off-apex-01',
    applicationId: 'app-apex-quant-01',
    jobId: 'job-apex-quant-2',
    companyId: 'company-apex-101',
    studentId: 'stu-apex-shared-07',
    role: 'Quantitative Trading Analyst',
    fixedCtcLpa: 20.0,
    variableCtcLpa: 4.0,
    joiningBonusLpa: 4.0,
    totalCtcLpa: 28.0,
    location: 'Mumbai (Bandra Kurla Complex)',
    joiningDate: '2027-07-01',
    validUntil: '2026-11-30',
    status: 'ISSUED',
    letterText: `APEX FINTECH LABS PRIVATE LIMITED
CAMPUS PLACEMENT APPOINTMENT LETTER

Dear Karthik Raja,

On behalf of Apex Fintech Labs, we are delighted to extend this formal offer of appointment for the position of Quantitative Trading Analyst within our Quantitative Alpha Research Group at our Mumbai Headquarters (BKC).

1. COMPENSATION & BENEFITS:
- Fixed Annual Gross Salary: ₹20,00,000 per annum
- Performance Variable Incentive: Up to ₹4,00,000 per annum
- Guaranteed One-Time Joining Relocation Bonus: ₹4,00,000
- Total Cost to Company (CTC): ₹28,00,000 LPA

2. COMMENCEMENT OF EMPLOYMENT:
Your expected date of joining will be July 1, 2027, subject to the successful completion of your B.Tech degree with no backlogs and maintenance of the requisite minimum academic standing.

3. ACCEPTANCE:
Please confirm your acceptance of this campus offer through the CampusLink Student Portal by November 30, 2026.

Warm congratulations and welcome to Apex Fintech Labs!

Sincerely,
Priya Sharma
Head of University Relations & Talent Acquisition
Apex Fintech Labs Pvt. Ltd.`,
    createdAt: '2026-09-28T10:00:00Z'
  }
];

export const INITIAL_DRIVES: PlacementDrive[] = [
  {
    id: 'drv-apex-01',
    companyId: 'company-apex-101',
    jobId: 'job-apex-se-1',
    driveTitle: 'Apex Fintech Autumn Campus Recruitment Drive 2026',
    driveDate: '2026-10-18',
    timeSlot: '09:00 AM - 06:00 PM IST',
    durationHours: 9,
    campusName: 'National Institute of Technology (Main Auditorium)',
    interviewType: 'Hybrid',
    targetCandidateCount: 40,
    rounds: ['Aptitude', 'Coding', 'Technical', 'HR'],
    specialRequirements: 'Quiet interview booths with high-speed 100Mbps Ethernet connectivity and dedicated projector for company presentation.',
    tpoApprovalStatus: 'APPROVED_BY_TPO',
    tpoFeedback: 'Drive approved. Auditorium and Interview Rooms 101-106 reserved for Apex Fintech team on October 18, 2026.',
    createdAt: '2026-09-10T14:00:00Z'
  },
  {
    id: 'drv-apex-02',
    companyId: 'company-apex-101',
    jobId: 'job-apex-quant-2',
    driveTitle: 'Apex Alpha Quant Super-Day Selection Drive',
    driveDate: '2026-11-04',
    timeSlot: '10:00 AM - 04:00 PM IST',
    durationHours: 6,
    campusName: 'National Institute of Technology (Virtual Drive)',
    interviewType: 'Virtual',
    targetCandidateCount: 15,
    rounds: ['Technical', 'Managerial', 'HR'],
    specialRequirements: 'Screen-sharing enabled with dual-camera setup for whiteboard mathematical derivations.',
    tpoApprovalStatus: 'APPROVED_BY_TPO',
    tpoFeedback: 'Approved by Dr. R. Ramanathan, TPO Chair.',
    createdAt: '2026-09-18T16:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    companyId: 'company-apex-101',
    type: 'NEW_APPLICATION',
    title: '42 Eligible Applicants Available for Software Engineer',
    message: '13 applicants have an AI Match Score above 80%. Rahul Verma is ranked #1 with 94% match.',
    timestamp: '15 mins ago',
    read: false,
    actionUrl: '/applicants'
  },
  {
    id: 'notif-2',
    companyId: 'company-apex-101',
    type: 'TPO_APPROVAL',
    title: 'Placement Drive Request Approved by TPO',
    message: 'NIT Training & Placement Cell approved "Apex Fintech Autumn Campus Recruitment Drive 2026" for Oct 18.',
    timestamp: '2 hours ago',
    read: false,
    actionUrl: '/drives'
  },
  {
    id: 'notif-3',
    companyId: 'company-apex-101',
    type: 'INTERVIEW_ALERT',
    title: 'Interview Round 2 Scheduled Tomorrow',
    message: 'Rahul Verma has Technical Round 2 scheduled with VP Trading Tech at 11:00 AM.',
    timestamp: '5 hours ago',
    read: true,
    actionUrl: '/interviews'
  },
  {
    id: 'notif-4',
    companyId: 'company-apex-101',
    type: 'OFFER_STATUS',
    title: 'Offer Letter Dispatched to Candidate',
    message: 'Offer of ₹28.0 LPA dispatched to Karthik Raja (Quant Trading Analyst). Awaiting student portal confirmation.',
    timestamp: '1 day ago',
    read: true,
    actionUrl: '/offers'
  },
  {
    id: 'notif-5',
    companyId: 'company-apex-101',
    type: 'SECURITY_ALERT',
    title: 'Zero-Leak Access Guard Active',
    message: 'Backend security filter successfully blocked 2 unauthorized candidate directory access attempts from external endpoints.',
    timestamp: '2 days ago',
    read: true,
    actionUrl: '/security'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-01',
    companyId: 'company-apex-101',
    recruiterId: 'recruiter-apex-1',
    action: 'JOB_CREATED',
    entityType: 'JOB',
    entityId: 'job-apex-se-1',
    details: 'Created job requisition: Software Engineer - Full Stack & High Throughput (₹18-24 LPA, Min CGPA 8.00)',
    ipAddress: '103.21.144.12',
    timestamp: '2026-09-10T10:00:00Z',
    severity: 'INFO'
  },
  {
    id: 'aud-02',
    companyId: 'company-apex-101',
    recruiterId: 'recruiter-apex-1',
    action: 'CANDIDATE_ACCESS_AUTHORIZED',
    entityType: 'APPLICATION',
    entityId: 'stu-apex-01',
    details: 'Access clearance granted for student Rahul Verma pursuant to formal job application #app-apex-01',
    ipAddress: '103.21.144.12',
    timestamp: '2026-09-15T12:00:00Z',
    severity: 'INFO'
  },
  {
    id: 'aud-03',
    companyId: 'company-apex-101',
    recruiterId: 'recruiter-apex-1',
    action: 'AI_RANKING_GENERATED',
    entityType: 'APPLICATION',
    entityId: 'job-apex-se-1',
    details: 'Evaluated 6 authorized applicants via Gemini Matching Engine. Rahul Verma (94%), Priya Nair (91%), Aman Singh (86%).',
    ipAddress: '103.21.144.12',
    timestamp: '2026-09-17T15:30:00Z',
    severity: 'INFO'
  },
  {
    id: 'aud-04',
    companyId: 'company-apex-101',
    recruiterId: 'recruiter-apex-1',
    action: 'APPLICATION_STATUS_UPDATED',
    entityType: 'APPLICATION',
    entityId: 'app-apex-06',
    details: 'Status changed to REJECTED. Reason: CGPA below cutoff (7.82 < 8.00, 1 active backlog).',
    ipAddress: '103.21.144.12',
    timestamp: '2026-09-18T09:00:00Z',
    severity: 'INFO'
  },
  {
    id: 'aud-05',
    companyId: 'company-apex-101',
    recruiterId: 'recruiter-apex-1',
    action: 'OFFER_GENERATED',
    entityType: 'OFFER',
    entityId: 'off-apex-01',
    details: 'Generated formal offer for Karthik Raja: ₹28.0 LPA total CTC (Role: Quant Trading Analyst)',
    ipAddress: '103.21.144.12',
    timestamp: '2026-09-28T10:00:00Z',
    severity: 'INFO'
  },
  {
    id: 'aud-06',
    companyId: 'company-apex-101',
    recruiterId: 'recruiter-apex-1',
    action: 'SECURITY_ACCESS_REJECTED',
    entityType: 'SECURITY',
    entityId: 'stu-unapplied-99',
    details: 'HTTP 403 Forbidden: Attempted request to unapplied student record #stu-unapplied-99 blocked by backend security model.',
    ipAddress: '103.21.144.12',
    timestamp: '2026-10-06T11:22:10Z',
    severity: 'CRITICAL_SECURITY'
  }
];
