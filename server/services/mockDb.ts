import {
  User,
  Student,
  StudentAcademics,
  StudentSkill,
  Project,
  Experience,
  Certification,
  Resume,
  MockInterview,
  ReadinessScore,
  SkillGap,
  Application,
  Interview,
  Offer,
  DocumentRecord,
  NotificationRecord,
  AiConversation,
  AiMessage,
  JobListing
} from '../db/models';

export interface StudentFullData {
  user: User;
  student: Student;
  academics: StudentAcademics;
  skills: StudentSkill[];
  projects: Project[];
  experiences: Experience[];
  certifications: Certification[];
  resume: Resume;
  mockInterviews: MockInterview[];
  readinessScore: ReadinessScore;
  skillGap: SkillGap;
  applications: Application[];
  interviews: Interview[];
  offers: Offer[];
  documents: DocumentRecord[];
  notifications: NotificationRecord[];
  conversations: AiConversation[];
  messages: AiMessage[];
}

// Master Jobs published for campus placement
export const MASTER_JOBS: JobListing[] = [
  {
    id: 'job-1',
    company_name: 'TechNova Solutions',
    logo_symbol: 'TN',
    role_title: 'Software Development Engineer - I',
    job_type: 'Full Time',
    location: 'Bangalore, India (Hybrid)',
    ctc: '₹ 18.5 LPA',
    min_cgpa: 7.5,
    allowed_branches: ['Computer Science and Engineering', 'Information Technology', 'Electronics and Communication'],
    max_backlogs: 0,
    required_skills: ['Python', 'SQL', 'Data Structures & Algorithms', 'System Design', 'Git', 'React'],
    preferred_skills: ['Docker', 'AWS Cloud', 'PostgreSQL'],
    application_deadline: '2026-10-15',
    description: 'TechNova is hiring top-tier Software Engineers to build hyper-scale distributed commerce engines. You will collaborate with principal architects to deploy fault-tolerant microservices, optimize low-latency storage engines, and ship customer-facing web platforms.',
    selection_rounds: ['Online Coding Assessment (90 mins)', 'Technical Round 1 (Data Structures & Algos)', 'Technical Round 2 (System Design & Core CS)', 'Leadership & Culture Fit'],
    published: true,
    is_active: true
  },
  {
    id: 'job-2',
    company_name: 'Apex Financial Technologies',
    logo_symbol: 'AF',
    role_title: 'Backend Systems Engineer',
    job_type: 'Full Time',
    location: 'Hyderabad, India (On-site)',
    ctc: '₹ 22.0 LPA',
    min_cgpa: 8.0,
    allowed_branches: ['Computer Science and Engineering', 'Information Technology'],
    max_backlogs: 0,
    required_skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Microservices', 'Git'],
    preferred_skills: ['Kafka', 'Docker', 'Kubernetes'],
    application_deadline: '2026-10-18',
    description: 'Join Apex FinTech to engineer mission-critical algorithmic transaction pipelines processing over $4B daily. High emphasis on memory efficiency, thread safety, and sub-millisecond execution times.',
    selection_rounds: ['HackerEarth Coding Challenge', 'System Concurrency & DB Deep-Dive', 'Architectural Whiteboarding', 'Director Interview'],
    published: true,
    is_active: true
  },
  {
    id: 'job-3',
    company_name: 'CloudPulse Systems',
    logo_symbol: 'CP',
    role_title: 'Cloud & DevOps Associate',
    job_type: 'Full Time',
    location: 'Pune, India (Hybrid)',
    ctc: '₹ 14.0 LPA',
    min_cgpa: 7.0,
    allowed_branches: ['Computer Science and Engineering', 'Information Technology', 'Electronics and Communication', 'Electrical Engineering'],
    max_backlogs: 0,
    required_skills: ['Linux', 'Docker', 'AWS Cloud', 'Git', 'Python'],
    preferred_skills: ['Terraform', 'Kubernetes', 'CI/CD Pipelines'],
    application_deadline: '2026-10-22',
    description: 'CloudPulse automates multi-cloud infrastructure for Fortune 500 enterprises. As an associate, you will configure automated deployment pipelines, observe telemetry metrics, and build disaster recovery playbooks.',
    selection_rounds: ['DevOps & Cloud Quiz', 'Hands-on Infrastructure Lab', 'Hiring Manager Discussion'],
    published: true,
    is_active: true
  },
  {
    id: 'job-4',
    company_name: 'DataVerve Analytics',
    logo_symbol: 'DV',
    role_title: 'Associate Data Scientist & ML Engineer',
    job_type: 'Full Time',
    location: 'Gurugram, India (Hybrid)',
    ctc: '₹ 16.5 LPA',
    min_cgpa: 7.8,
    allowed_branches: ['Computer Science and Engineering', 'Information Technology', 'Data Science', 'Mathematics & Computing'],
    max_backlogs: 0,
    required_skills: ['Python', 'SQL', 'Machine Learning', 'Data Analysis', 'Statistics'],
    preferred_skills: ['TensorFlow', 'FastAPI', 'MLOps'],
    application_deadline: '2026-10-25',
    description: 'Deploy predictive models and computer vision pipelines across large-scale retail supply networks. You will work closely with research scientists to productionize Gemini-based LLM assistants and automated forecasting engines.',
    selection_rounds: ['ML Aptitude & Case Study', 'Kaggle-style Coding Challenge', 'Research Presentation', 'HR Discussion'],
    published: true,
    is_active: true
  },
  {
    id: 'job-5',
    company_name: 'Nexus Security Labs',
    logo_symbol: 'NS',
    role_title: 'Full Stack Web Engineer',
    job_type: 'Full Time',
    location: 'Bangalore, India (Remote-friendly)',
    ctc: '₹ 15.0 LPA',
    min_cgpa: 7.0,
    allowed_branches: ['Computer Science and Engineering', 'Information Technology'],
    max_backlogs: 1,
    required_skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    preferred_skills: ['WebSockets', 'GraphQL', 'Next.js'],
    application_deadline: '2026-10-28',
    description: 'Nexus builds next-generation threat intelligence dashboards. Craft responsive, accessible, real-time reactive user interfaces and resilient backend API gateways.',
    selection_rounds: ['Frontend Take-home Task', 'Live Pair Programming', 'System Architecture & Culture'],
    published: true,
    is_active: true
  }
];

// Target role skill matrix for deterministic skill-gap calculation
export const ROLE_SKILL_REQUIREMENTS: Record<string, { required: string[]; weights: Record<string, number> }> = {
  'Software Engineer': {
    required: ['Data Structures & Algorithms', 'Python', 'SQL', 'System Design', 'Git', 'PostgreSQL', 'Docker', 'AWS Cloud'],
    weights: { 'Data Structures & Algorithms': 20, Python: 15, SQL: 15, 'System Design': 15, Git: 10, PostgreSQL: 10, Docker: 10, 'AWS Cloud': 5 }
  },
  'Backend Developer': {
    required: ['Python', 'SQL', 'PostgreSQL', 'System Design', 'Docker', 'Git', 'Node.js', 'AWS Cloud'],
    weights: { Python: 15, SQL: 15, PostgreSQL: 15, 'System Design': 20, Docker: 15, Git: 10, 'Node.js': 5, 'AWS Cloud': 5 }
  },
  'Frontend Developer': {
    required: ['React', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'Git', 'System Design'],
    weights: { React: 25, TypeScript: 20, 'Tailwind CSS': 15, JavaScript: 20, Git: 10, 'System Design': 10 }
  },
  'Full Stack Engineer': {
    required: ['React', 'Node.js', 'PostgreSQL', 'Python', 'Git', 'Docker', 'System Design'],
    weights: { React: 20, 'Node.js': 20, PostgreSQL: 15, Python: 15, Git: 10, Docker: 10, 'System Design': 10 }
  },
  'Cloud Engineer': {
    required: ['AWS Cloud', 'Docker', 'Linux', 'Git', 'Python', 'System Design'],
    weights: { 'AWS Cloud': 30, Docker: 25, Linux: 15, Git: 10, Python: 10, 'System Design': 10 }
  },
  'Data Analyst': {
    required: ['SQL', 'Python', 'Data Analysis', 'Power BI / Tableau', 'Statistics'],
    weights: { SQL: 35, Python: 25, 'Data Analysis': 20, Statistics: 10, 'Power BI / Tableau': 10 }
  },
  'Data Scientist': {
    required: ['Python', 'Machine Learning', 'SQL', 'Data Structures & Algorithms', 'Statistics'],
    weights: { Python: 25, 'Machine Learning': 30, SQL: 15, Statistics: 15, 'Data Structures & Algorithms': 15 }
  }
};

class MockDatabase {
  private users: Map<string, User> = new Map();
  private studentData: Map<string, StudentFullData> = new Map();

  constructor() {
    this.seedDefaultStudent();
  }

  private seedDefaultStudent() {
    const userId = 'usr-aarav-sharma-2026';
    const studentId = 'std-aarav-sharma-2026';

    const defaultUser: User = {
      id: userId,
      email: 'aarav.sharma@campus.edu',
      password_hash: 'student@123', // Demo hashed password
      role: 'student',
      is_active: true,
      created_at: '2026-08-01T10:00:00Z',
      updated_at: '2026-10-07T08:00:00Z'
    };

    const defaultStudent: Student = {
      id: studentId,
      user_id: userId,
      roll_number: '22CS8042',
      full_name: 'Siddharth Das',
      mobile: '+91 98765 43210',
      college_name: 'KIIT University, Bhubaneswar',
      branch: 'Computer Science and Engineering',
      degree: 'B.Tech',
      graduation_year: 2026,
      current_semester: 8,
      avatar_url: '',
      bio: 'Final-year Computer Science student from Bhubaneswar focused on full-stack engineering, scalable systems, cloud technologies, and campus placement readiness.',
      target_role: 'Software Engineer',
      preferred_locations: ['Bhubaneswar', 'Bangalore', 'Hyderabad', 'Pune', 'Remote'],
      onboarding_completed: true,
      created_at: '2026-08-01T10:00:00Z',
      updated_at: '2026-10-07T08:00:00Z'
    };

    const defaultAcademics: StudentAcademics = {
      id: 'acad-1',
      student_id: studentId,
      tenth_percentage: 94.6,
      tenth_board: 'CBSE',
      twelfth_percentage: 92.4,
      twelfth_board: 'CBSE',
      cgpa: 8.72,
      active_backlogs: 0,
      cleared_backlogs: 0,
      semester_grades: {
        sem1: 8.6,
        sem2: 8.5,
        sem3: 8.8,
        sem4: 8.7,
        sem5: 8.9,
        sem6: 8.8,
        sem7: 8.7
      },
      is_verified: true,
      created_at: '2026-08-01T10:00:00Z',
      updated_at: '2026-09-15T10:00:00Z'
    };

    const defaultSkills: StudentSkill[] = [
      { id: 'sk-1', student_id: studentId, skill_name: 'Python', category: 'backend', proficiency_level: 'Advanced', verified_by_test: true, years_experience: 2.5, created_at: '2026-08-01T10:00:00Z' },
      { id: 'sk-2', student_id: studentId, skill_name: 'Data Structures & Algorithms', category: 'core_cs', proficiency_level: 'Advanced', verified_by_test: true, years_experience: 3.0, created_at: '2026-08-01T10:00:00Z' },
      { id: 'sk-3', student_id: studentId, skill_name: 'SQL', category: 'database', proficiency_level: 'Advanced', verified_by_test: true, years_experience: 2.0, created_at: '2026-08-01T10:00:00Z' },
      { id: 'sk-4', student_id: studentId, skill_name: 'PostgreSQL', category: 'database', proficiency_level: 'Intermediate', verified_by_test: false, years_experience: 1.5, created_at: '2026-08-01T10:00:00Z' },
      { id: 'sk-5', student_id: studentId, skill_name: 'React', category: 'frontend', proficiency_level: 'Advanced', verified_by_test: true, years_experience: 2.0, created_at: '2026-08-01T10:00:00Z' },
      { id: 'sk-6', student_id: studentId, skill_name: 'Git', category: 'tools', proficiency_level: 'Advanced', verified_by_test: true, years_experience: 3.0, created_at: '2026-08-01T10:00:00Z' },
      { id: 'sk-7', student_id: studentId, skill_name: 'System Design', category: 'core_cs', proficiency_level: 'Intermediate', verified_by_test: false, years_experience: 1.0, created_at: '2026-08-01T10:00:00Z' },
      { id: 'sk-8', student_id: studentId, skill_name: 'Docker', category: 'cloud', proficiency_level: 'Intermediate', verified_by_test: false, years_experience: 1.0, created_at: '2026-08-01T10:00:00Z' },
      { id: 'sk-9', student_id: studentId, skill_name: 'Node.js', category: 'backend', proficiency_level: 'Intermediate', verified_by_test: false, years_experience: 1.5, created_at: '2026-08-01T10:00:00Z' },
      { id: 'sk-10', student_id: studentId, skill_name: 'AWS Cloud', category: 'cloud', proficiency_level: 'Beginner', verified_by_test: false, years_experience: 0.5, created_at: '2026-08-01T10:00:00Z' }
    ];

    const defaultProjects: Project[] = [
      {
        id: 'proj-1',
        student_id: studentId,
        title: 'Distributed Event-Driven Order Processing System',
        description: 'Architected high-concurrency order pipeline with idempotent transaction delivery and Redis caching. Handled failure cascades with dead-letter queue retry policies.',
        tech_stack: ['Python', 'PostgreSQL', 'Redis', 'Docker', 'FastAPI'],
        github_url: 'https://github.com/aaravsharma/distributed-order-stream',
        live_demo_url: 'https://order-stream-demo.internal',
        highlight_metric: 'Processed 12,000 req/sec with <45ms p99 response time',
        start_date: '2025-01-10',
        end_date: '2025-04-20',
        created_at: '2026-08-01T10:00:00Z',
        updated_at: '2026-09-01T10:00:00Z'
      },
      {
        id: 'proj-2',
        student_id: studentId,
        title: 'CampusLink Placement Command Center & Match Engine',
        description: 'Engineered responsive placement management portal with explainable recommendation diagnostics, deterministic readiness calculation, and real-time application trackers.',
        tech_stack: ['React', 'TypeScript', 'Tailwind CSS', 'Express', 'PostgreSQL'],
        github_url: 'https://github.com/aaravsharma/campuslink-student',
        live_demo_url: 'https://campuslink-demo.internal',
        highlight_metric: 'Adopted by 850+ departmental peers with 98% positive audit',
        start_date: '2025-05-01',
        end_date: '2025-08-15',
        created_at: '2026-08-01T10:00:00Z',
        updated_at: '2026-09-01T10:00:00Z'
      }
    ];

    const defaultExperiences: Experience[] = [
      {
        id: 'exp-1',
        student_id: studentId,
        company_name: 'CloudScale Technologies',
        role: 'Software Engineering Intern',
        location: 'Bangalore, India (Hybrid)',
        employment_type: 'Internship',
        start_date: '2025-06-01',
        end_date: '2025-08-31',
        is_current: false,
        responsibilities: 'Refactored backend microservices, optimized database query execution time by 34%, authored comprehensive unit test suites, and streamlined GitHub Actions CI/CD workflows.',
        technologies_used: ['Python', 'PostgreSQL', 'Docker', 'AWS'],
        created_at: '2026-08-01T10:00:00Z'
      }
    ];

    const defaultCertifications: Certification[] = [
      {
        id: 'cert-1',
        student_id: studentId,
        name: 'AWS Certified Cloud Practitioner',
        issuing_organization: 'Amazon Web Services',
        issue_date: '2025-07-15',
        expiry_date: '2028-07-15',
        credential_id: 'AWS-CCP-948271',
        credential_url: 'https://aws.amazon.com/verification/AWS-CCP-948271',
        verified: true,
        created_at: '2026-08-01T10:00:00Z'
      },
      {
        id: 'cert-2',
        student_id: studentId,
        name: 'HackerRank Problem Solving (Gold 5-Star)',
        issuing_organization: 'HackerRank',
        issue_date: '2025-03-10',
        credential_id: 'HR-PS-5STAR-881',
        credential_url: 'https://hackerrank.com/certificates/881',
        verified: true,
        created_at: '2026-08-01T10:00:00Z'
      }
    ];

    const defaultResume: Resume = {
      id: 'res-1',
      student_id: studentId,
      file_name: 'Siddharth_Das_Resume_2026.pdf',
      file_url: '/uploads/resumes/Aarav_Sharma_Resume_2026.pdf',
      file_size_bytes: 425600,
      version_number: 3,
      is_primary: true,
      ats_score: 84,
      parsed_skills: ['Python', 'SQL', 'PostgreSQL', 'React', 'Git', 'Data Structures & Algorithms', 'System Design', 'Docker', 'AWS Cloud'],
      ai_suggestions: {
        strengths: [
          'High ATS readability with standard sans-serif structure',
          'Excellent quantifiable project metrics (12,000 req/sec, <45ms latency)',
          'Clear chronological career progression and validated certifications'
        ],
        improvements: [
          'Add measurable production results with dollar/time savings for your internship',
          'Include live GitHub links and architecture diagrams for your projects',
          'Elevate AWS Cloud fundamentals to include container orchestration (ECS/EKS)',
          'Refine the professional summary to highlight system resilience'
        ],
        missing_sections: ['Honors & Hackathon Awards section', 'Open source contributions list'],
        summary: 'Resume Score: 84%. Outstanding technical foundation with high ATS compliance. Minor enhancements in cloud infrastructure and open-source validation will push it to the top 5% bracket.'
      },
      created_at: '2026-08-01T10:00:00Z',
      updated_at: '2026-10-06T14:30:00Z'
    };

    const defaultMockInterviews: MockInterview[] = [
      {
        id: 'mock-1',
        student_id: studentId,
        role: 'Software Engineer',
        difficulty: 'Mid',
        interview_type: 'Technical',
        score_overall: 82,
        technical_accuracy: 86,
        communication: 78,
        clarity: 82,
        confidence: 84,
        transcript: [
          { role: 'ai', question: 'How do you prevent race conditions when updating inventory count across microservices?', answer: 'We implemented optimistic locking using version numbers in PostgreSQL, backed by Redis distributed locks for burst protection.' },
          { role: 'ai', question: 'Explain how B-Tree indexes work in relational databases and when a full table scan is faster?', answer: 'B-Trees maintain a balanced tree with log(N) lookup. Full table scans are faster when querying a small table or when cardinality is extremely low like booleans.' }
        ],
        feedback: 'Demonstrated strong command of database concurrency and indexing. Communication was concise and well-grounded in practical experience.',
        key_recommendations: [
          'Practice 3 mock interviews under strict timed pressure',
          'Refine depth in AWS serverless vs containerized trade-offs',
          'Improve verbal structuring using the STAR framework during behavioral follow-ups'
        ],
        completed_at: '2026-10-04T16:00:00Z'
      }
    ];

    const defaultReadiness: ReadinessScore = {
      id: 'readiness-1',
      student_id: studentId,
      overall_score: 82,
      category: 'HIGHLY EMPLOYABLE',
      academic_factor: 88,
      skill_factor: 85,
      project_factor: 84,
      resume_factor: 84,
      mock_interview_factor: 82,
      strengths: [
        'Strong technical and core computer science fundamentals (DSA, SQL, System Design)',
        'Relevant production-grade projects with verifiable latency metrics',
        'Strong academic performance (8.72 CGPA with zero active backlogs)'
      ],
      needs_improvement: [
        'Mock interview communication under high pressure',
        'Advanced AWS cloud deployment and orchestration',
        'Behavioral STAR structure elaboration'
      ],
      action_items: [
        'Practice 3 mock interviews in the Mock Interview simulator',
        'Learn AWS fundamentals & ECS container deployment',
        'Improve communication score with concise STAR summaries'
      ],
      calculated_at: '2026-10-07T08:00:00Z'
    };

    const defaultSkillGap: SkillGap = {
      id: 'gap-1',
      student_id: studentId,
      target_role: 'Software Engineer',
      coverage_percentage: 78,
      matched_skills: ['Python', 'SQL', 'React', 'Git', 'Data Structures & Algorithms', 'PostgreSQL'],
      partial_skills: ['System Design', 'Docker', 'AWS Cloud'],
      missing_skills: ['Kubernetes', 'CI/CD Pipelines (Jenkins/ArgoCD)', 'Kafka Streaming'],
      ai_learning_path: [
        { skill: 'AWS Cloud Fundamentals', priority: 'High', estimatedHours: 8, resource: 'AWS SkillBuilder Cloud Practitioner Essentials' },
        { skill: 'Docker Multi-Stage Builds', priority: 'High', estimatedHours: 4, resource: 'Hands-on Container Architecture Lab' },
        { skill: 'Kafka Distributed Streaming', priority: 'Medium', estimatedHours: 6, resource: 'Confluent Developer Fundamentals' }
      ],
      evaluated_at: '2026-10-07T08:00:00Z'
    };

    const defaultApplications: Application[] = [
      {
        id: 'app-1',
        student_id: studentId,
        job_id: 'job-1',
        company_name: 'TechNova Solutions',
        role_title: 'Software Development Engineer - I',
        ctc: '₹ 18.5 LPA',
        location: 'Bangalore, India (Hybrid)',
        status: 'INTERVIEW',
        applied_at: '2026-09-20T10:00:00Z',
        updated_at: '2026-10-05T12:00:00Z',
        allow_withdrawal: false
      },
      {
        id: 'app-2',
        student_id: studentId,
        job_id: 'job-2',
        company_name: 'Apex Financial Technologies',
        role_title: 'Backend Systems Engineer',
        ctc: '₹ 22.0 LPA',
        location: 'Hyderabad, India (On-site)',
        status: 'SHORTLISTED',
        applied_at: '2026-09-24T14:30:00Z',
        updated_at: '2026-10-04T10:15:00Z',
        allow_withdrawal: true
      },
      {
        id: 'app-3',
        student_id: studentId,
        job_id: 'job-3',
        company_name: 'CloudPulse Systems',
        role_title: 'Cloud & DevOps Associate',
        ctc: '₹ 14.0 LPA',
        location: 'Pune, India (Hybrid)',
        status: 'OFFERED',
        applied_at: '2026-09-10T09:00:00Z',
        updated_at: '2026-10-02T16:00:00Z',
        allow_withdrawal: false
      },
      {
        id: 'app-4',
        student_id: studentId,
        job_id: 'job-5',
        company_name: 'Nexus Security Labs',
        role_title: 'Full Stack Web Engineer',
        ctc: '₹ 15.0 LPA',
        location: 'Bangalore, India (Remote-friendly)',
        status: 'REJECTED',
        applied_at: '2026-09-05T11:00:00Z',
        updated_at: '2026-09-18T18:00:00Z',
        rejection_reason: 'Not shortlisted because the role requires AWS container deployments and current profile has not completed cloud verification threshold.',
        allow_withdrawal: false
      }
    ];

    const defaultInterviews: Interview[] = [
      {
        id: 'int-1',
        student_id: studentId,
        application_id: 'app-1',
        company_name: 'TechNova Solutions',
        role_title: 'Software Development Engineer - I',
        round_name: 'Round 2: Technical Architecture & System Design',
        interview_date: '2026-10-08',
        interview_time: '10:00 AM IST',
        venue_or_meeting_url: 'https://meet.google.com/technova-campus-interview',
        instructions: 'Please join 5 minutes early with your primary laptop. Ensure working webcam, microphone, and have a code editor ready for live architecture whiteboarding.',
        reminder_24h_sent: true,
        reminder_1h_sent: false,
        status: 'SCHEDULED',
        created_at: '2026-10-05T12:00:00Z'
      }
    ];

    const defaultOffers: Offer[] = [
      {
        id: 'off-1',
        student_id: studentId,
        company_name: 'CloudPulse Systems',
        role_title: 'Cloud & DevOps Associate',
        ctc: '₹ 14.0 LPA (₹ 12.0 LPA Fixed + ₹ 2.0 LPA Retention Bonus)',
        offer_date: '2026-10-02',
        joining_date: '2026-07-01',
        location: 'Pune, India (Hybrid)',
        offer_letter_url: '/documents/offers/CloudPulse_Offer_Letter_Aarav.pdf',
        status: 'PENDING',
        created_at: '2026-10-02T16:00:00Z',
        updated_at: '2026-10-02T16:00:00Z'
      }
    ];

    const defaultDocuments: DocumentRecord[] = [
      {
        id: 'doc-1',
        student_id: studentId,
        title: 'Primary Placement Resume — Siddharth Das',
        document_type: 'Resume',
        file_url: '/documents/Siddharth_Das_Resume_2026.pdf',
        verification_status: 'Verified',
        uploaded_at: '2026-10-06T14:30:00Z'
      },
      {
        id: 'doc-2',
        student_id: studentId,
        title: 'Government Identity Proof — Siddharth Das',
        document_type: 'ID',
        file_url: '/documents/Aarav_Govt_ID.pdf',
        verification_status: 'Verified',
        uploaded_at: '2026-08-05T10:00:00Z'
      },
      {
        id: 'doc-3',
        student_id: studentId,
        title: 'B.Tech Consolidated Semester 1-7 Marksheet',
        document_type: 'Marksheet',
        file_url: '/documents/Aarav_BTech_Marksheets_1to7.pdf',
        verification_status: 'Verified',
        uploaded_at: '2026-08-10T12:00:00Z'
      },
      {
        id: 'doc-4',
        student_id: studentId,
        title: 'CloudPulse Pre-Joining Medical Declaration',
        document_type: 'Joining Document',
        file_url: '/documents/CloudPulse_Medical_Form.pdf',
        verification_status: 'Pending Verification',
        uploaded_at: '2026-10-05T09:30:00Z'
      }
    ];

    const defaultNotifications: NotificationRecord[] = [
      {
        id: 'notif-1',
        student_id: studentId,
        title: 'Interview Tomorrow at 10:00 AM IST',
        message: 'TechNova Solutions Round 2 Technical Architecture interview is scheduled for tomorrow. Be ready with Google Meet link.',
        category: 'interview',
        is_read: false,
        action_route: 'interview-schedule',
        created_at: '2026-10-07T08:00:00Z'
      },
      {
        id: 'notif-2',
        student_id: studentId,
        title: 'You have been shortlisted!',
        message: 'Apex Financial Technologies shortlisted you for the Backend Systems Engineer role (₹ 22 LPA). Round 1 invites will follow shortly.',
        category: 'shortlist',
        is_read: false,
        action_route: 'applications',
        created_at: '2026-10-06T18:00:00Z'
      },
      {
        id: 'notif-3',
        student_id: studentId,
        title: 'Readiness Score Updated to 82/100',
        message: 'Your AI Employability score is now HIGHLY EMPLOYABLE after syncing your recent mock interview results.',
        category: 'readiness',
        is_read: false,
        action_route: 'readiness-score',
        created_at: '2026-10-05T14:00:00Z'
      },
      {
        id: 'notif-4',
        student_id: studentId,
        title: 'Joining Document Pending Verification',
        message: 'Your CloudPulse Medical Declaration form has been uploaded and is pending verification with the TPO desk.',
        category: 'document',
        is_read: true,
        action_route: 'documents',
        created_at: '2026-10-05T10:00:00Z'
      },
      {
        id: 'notif-5',
        student_id: studentId,
        title: 'New High-Match Job Drive Opened',
        message: 'DataVerve Analytics opened applications for Associate Data Scientist & ML Engineer (94% Match for your profile).',
        category: 'job_match',
        is_read: true,
        action_route: 'recommended-jobs',
        created_at: '2026-10-04T12:00:00Z'
      }
    ];

    const defaultConversation: AiConversation = {
      id: 'conv-1',
      student_id: studentId,
      title: 'Placement Strategy & Readiness Mentorship',
      created_at: '2026-10-01T10:00:00Z',
      updated_at: '2026-10-06T15:00:00Z'
    };

    const defaultMessages: AiMessage[] = [
      {
        id: 'msg-1',
        conversation_id: 'conv-1',
        student_id: studentId,
        sender: 'assistant',
        content: `Welcome back, Aarav! I am your private AI Placement Command Assistant.
Your current AI Employability Score stands at **82/100 (HIGHLY EMPLOYABLE)**.
You have an upcoming **TechNova Solutions Round 2** interview tomorrow at 10:00 AM.
How can I assist your placement preparation today?`,
        created_at: '2026-10-06T14:00:00Z'
      }
    ];

    this.users.set(defaultUser.email.toLowerCase(), defaultUser);
    this.studentData.set(studentId, {
      user: defaultUser,
      student: defaultStudent,
      academics: defaultAcademics,
      skills: defaultSkills,
      projects: defaultProjects,
      experiences: defaultExperiences,
      certifications: defaultCertifications,
      resume: defaultResume,
      mockInterviews: defaultMockInterviews,
      readinessScore: defaultReadiness,
      skillGap: defaultSkillGap,
      applications: defaultApplications,
      interviews: defaultInterviews,
      offers: defaultOffers,
      documents: defaultDocuments,
      notifications: defaultNotifications,
      conversations: [defaultConversation],
      messages: defaultMessages
    });
  }

  public getUserByEmail(email: string): User | undefined {
    return this.users.get(email.toLowerCase());
  }

  public getUserById(id: string): User | undefined {
    for (const u of this.users.values()) {
      if (u.id === id) return u;
    }
    return undefined;
  }

  public getStudentByUserId(userId: string): StudentFullData | undefined {
    for (const data of this.studentData.values()) {
      if (data.student.user_id === userId) return data;
    }
    return undefined;
  }

  public getStudentById(studentId: string): StudentFullData | undefined {
    return this.studentData.get(studentId);
  }

  public registerStudent(params: {
    fullName: string;
    email: string;
    password: string;
    mobile: string;
    college: string;
    branch: string;
    graduationYear: number;
  }): StudentFullData {
    const existing = this.getUserByEmail(params.email);
    if (existing) {
      throw new Error('A student account with this email already exists.');
    }

    const userId = `usr-${Date.now()}`;
    const studentId = `std-${Date.now()}`;
    const now = new Date().toISOString();

    const newUser: User = {
      id: userId,
      email: params.email.toLowerCase(),
      password_hash: params.password, // In real app: bcrypt hashed
      role: 'student',
      is_active: true,
      created_at: now,
      updated_at: now
    };

    const newStudent: Student = {
      id: studentId,
      user_id: userId,
      roll_number: `ROLL-${Math.floor(1000 + Math.random() * 9000)}`,
      full_name: params.fullName,
      mobile: params.mobile,
      college_name: params.college,
      branch: params.branch,
      degree: 'B.Tech',
      graduation_year: params.graduationYear,
      current_semester: 7,
      bio: '',
      target_role: 'Software Engineer',
      preferred_locations: ['Bangalore', 'Hyderabad', 'Pune'],
      onboarding_completed: false,
      created_at: now,
      updated_at: now
    };

    const newAcademics: StudentAcademics = {
      id: `acad-${Date.now()}`,
      student_id: studentId,
      tenth_percentage: 88.0,
      tenth_board: 'CBSE',
      twelfth_percentage: 86.0,
      twelfth_board: 'CBSE',
      cgpa: 8.0,
      active_backlogs: 0,
      cleared_backlogs: 0,
      semester_grades: { sem1: 8.0, sem2: 8.0 },
      is_verified: false,
      created_at: now,
      updated_at: now
    };

    const defaultSkills: StudentSkill[] = [
      { id: `sk-${Date.now()}-1`, student_id: studentId, skill_name: 'Python', category: 'backend', proficiency_level: 'Intermediate', verified_by_test: false, years_experience: 1, created_at: now },
      { id: `sk-${Date.now()}-2`, student_id: studentId, skill_name: 'Data Structures & Algorithms', category: 'core_cs', proficiency_level: 'Intermediate', verified_by_test: false, years_experience: 1, created_at: now }
    ];

    const defaultResume: Resume = {
      id: `res-${Date.now()}`,
      student_id: studentId,
      file_name: `${params.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
      file_url: '/uploads/resumes/default.pdf',
      file_size_bytes: 312000,
      version_number: 1,
      is_primary: true,
      ats_score: 72,
      parsed_skills: ['Python', 'Data Structures & Algorithms'],
      ai_suggestions: {
        strengths: ['Clear academic foundation'],
        improvements: ['Add production projects and measurable metrics', 'Add verified certifications'],
        missing_sections: ['Work experience', 'Certifications'],
        summary: 'Resume initialized. Complete onboarding to enhance your ATS score.'
      },
      created_at: now,
      updated_at: now
    };

    const defaultReadiness: ReadinessScore = {
      id: `readiness-${Date.now()}`,
      student_id: studentId,
      overall_score: 58,
      category: 'DEVELOPING',
      academic_factor: 80,
      skill_factor: 60,
      project_factor: 45,
      resume_factor: 65,
      mock_interview_factor: 50,
      strengths: ['Clean academic record with no backlogs'],
      needs_improvement: ['Add more complex technical projects', 'Take mock interviews', 'Upload certifications'],
      action_items: ['Complete your 10-step student onboarding', 'Add at least 2 technical projects', 'Practice your first mock interview'],
      calculated_at: now
    };

    const defaultGap: SkillGap = {
      id: `gap-${Date.now()}`,
      student_id: studentId,
      target_role: 'Software Engineer',
      coverage_percentage: 50,
      matched_skills: ['Python', 'Data Structures & Algorithms'],
      partial_skills: ['SQL'],
      missing_skills: ['System Design', 'Git', 'Docker', 'AWS Cloud', 'PostgreSQL'],
      ai_learning_path: [
        { skill: 'SQL & Database Design', priority: 'High', estimatedHours: 10, resource: 'Interactive SQL Tutorial' },
        { skill: 'Git & Version Control', priority: 'High', estimatedHours: 4, resource: 'Git Branching Visualizer' }
      ],
      evaluated_at: now
    };

    const welcomeNotif: NotificationRecord = {
      id: `notif-${Date.now()}`,
      student_id: studentId,
      title: 'Welcome to CampusLink Student!',
      message: 'Your placement command center is ready. Complete onboarding to unlock personalized job recommendations.',
      category: 'readiness',
      is_read: false,
      action_route: 'onboarding',
      created_at: now
    };

    const conv: AiConversation = {
      id: `conv-${Date.now()}`,
      student_id: studentId,
      title: 'Placement Onboarding Guidance',
      created_at: now,
      updated_at: now
    };

    const initialMsg: AiMessage = {
      id: `msg-${Date.now()}`,
      conversation_id: conv.id,
      student_id: studentId,
      sender: 'assistant',
      content: `Hello ${params.fullName}! Welcome to CAMPUSLINK STUDENT. I am your private placement mentor. Start by completing the onboarding wizard so I can calculate your baseline readiness score and find your top job matches.`,
      created_at: now
    };

    const fullData: StudentFullData = {
      user: newUser,
      student: newStudent,
      academics: newAcademics,
      skills: defaultSkills,
      projects: [],
      experiences: [],
      certifications: [],
      resume: defaultResume,
      mockInterviews: [],
      readinessScore: defaultReadiness,
      skillGap: defaultGap,
      applications: [],
      interviews: [],
      offers: [],
      documents: [],
      notifications: [welcomeNotif],
      conversations: [conv],
      messages: [initialMsg]
    };

    this.users.set(newUser.email, newUser);
    this.studentData.set(studentId, fullData);
    return fullData;
  }

  // Recalculate deterministic readiness score based on actual student data
  public recalculateReadiness(studentId: string): ReadinessScore {
    const data = this.studentData.get(studentId);
    if (!data) throw new Error('Student not found');

    const academics = data.academics;
    const skills = data.skills;
    const projects = data.projects;
    const experiences = data.experiences;
    const certifications = data.certifications;
    const mockInterviews = data.mockInterviews;
    const resume = data.resume;

    // 1. Academic factor (0-100)
    let academicScore = Math.min(100, (academics.cgpa / 10) * 100);
    if (academics.active_backlogs > 0) academicScore -= academics.active_backlogs * 15;
    academicScore = Math.max(20, Math.min(100, Math.round(academicScore)));

    // 2. Skill factor (0-100)
    const skillCount = skills.length;
    const advancedCount = skills.filter(s => s.proficiency_level === 'Advanced' || s.proficiency_level === 'Expert').length;
    let skillScore = Math.min(100, skillCount * 8 + advancedCount * 6);
    skillScore = Math.max(30, Math.min(100, skillScore));

    // 3. Project factor (0-100)
    let projectScore = projects.length * 35;
    if (experiences.length > 0) projectScore += experiences.length * 20;
    projectScore = Math.max(20, Math.min(100, projectScore));

    // 4. Resume factor (0-100)
    const resumeScore = resume?.ats_score || 70;

    // 5. Mock Interview factor (0-100)
    let mockScore = 70;
    if (mockInterviews.length > 0) {
      const avg = mockInterviews.reduce((acc, m) => acc + m.score_overall, 0) / mockInterviews.length;
      mockScore = Math.round(avg);
    }

    // Weighted Overall Score
    // Academic (20%), Skills (25%), Projects (20%), Resume (15%), Mock Interviews (20%)
    const weighted = Math.round(
      academicScore * 0.20 +
      skillScore * 0.25 +
      projectScore * 0.20 +
      resumeScore * 0.15 +
      mockScore * 0.20
    );

    const overall = Math.max(10, Math.min(99, weighted));

    let category: ReadinessScore['category'] = 'NOT READY';
    if (overall >= 80) category = 'HIGHLY EMPLOYABLE';
    else if (overall >= 60) category = 'READY';
    else if (overall >= 40) category = 'DEVELOPING';
    else category = 'NOT READY';

    const strengths: string[] = [];
    if (skillScore >= 80) strengths.push('Strong technical and core programming skills');
    if (academicScore >= 80) strengths.push(`Consistent academic track record (${academics.cgpa} CGPA, 0 backlogs)`);
    if (projectScore >= 75) strengths.push('Relevant multi-tier projects with measurable results');
    if (resumeScore >= 80) strengths.push('High ATS resume compliance and clear role alignment');
    if (strengths.length === 0) strengths.push('Solid motivation and growing baseline foundational skills');

    const needsImprovement: string[] = [];
    if (mockScore < 80) needsImprovement.push('Mock interview performance and behavioral communication');
    if (!skills.some(s => s.skill_name.toLowerCase().includes('cloud') || s.skill_name.toLowerCase().includes('aws'))) {
      needsImprovement.push('Cloud deployment (AWS / Docker) hands-on verification');
    }
    if (projects.length < 2) needsImprovement.push('Expand project portfolio with a live production deployment');
    if (needsImprovement.length === 0) needsImprovement.push('Advanced system architecture optimization and stress testing');

    const actionItems: string[] = [];
    if (mockInterviews.length < 3) actionItems.push('Practice 3 mock interviews in the Mock Interview simulator');
    if (needsImprovement.some(n => n.includes('Cloud'))) actionItems.push('Learn AWS fundamentals and containerization');
    actionItems.push('Fine-tune resume keywords to match targeted company job profiles');

    const updatedReadiness: ReadinessScore = {
      id: `readiness-${Date.now()}`,
      student_id: studentId,
      overall_score: overall,
      category,
      academic_factor: academicScore,
      skill_factor: skillScore,
      project_factor: projectScore,
      resume_factor: resumeScore,
      mock_interview_factor: mockScore,
      strengths,
      needs_improvement: needsImprovement,
      action_items: actionItems,
      calculated_at: new Date().toISOString()
    };

    data.readinessScore = updatedReadiness;
    return updatedReadiness;
  }

  // Recalculate skill gap for targeted role
  public recalculateSkillGap(studentId: string, targetRole: string): SkillGap {
    const data = this.studentData.get(studentId);
    if (!data) throw new Error('Student not found');

    const roleConfig = ROLE_SKILL_REQUIREMENTS[targetRole] || ROLE_SKILL_REQUIREMENTS['Software Engineer'];
    const studentSkillNames = new Set(data.skills.map(s => s.skill_name.toLowerCase()));

    const matched: string[] = [];
    const partial: string[] = [];
    const missing: string[] = [];

    let totalWeight = 0;
    let earnedWeight = 0;

    for (const req of roleConfig.required) {
      const weight = roleConfig.weights[req] || 10;
      totalWeight += weight;
      const lower = req.toLowerCase();

      const studentSkill = data.skills.find(s => s.skill_name.toLowerCase() === lower);
      if (studentSkill) {
        if (studentSkill.proficiency_level === 'Advanced' || studentSkill.proficiency_level === 'Expert') {
          matched.push(req);
          earnedWeight += weight;
        } else if (studentSkill.proficiency_level === 'Intermediate') {
          matched.push(req);
          earnedWeight += weight * 0.85;
        } else {
          partial.push(req);
          earnedWeight += weight * 0.5;
        }
      } else {
        missing.push(req);
      }
    }

    const coverage = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 60;

    const learningPath = missing.slice(0, 3).map((sk, idx) => ({
      skill: sk,
      priority: (idx === 0 ? 'High' : idx === 1 ? 'Medium' : 'Low') as 'High' | 'Medium' | 'Low',
      estimatedHours: 6 + idx * 4,
      resource: `${sk} Crash Course & Hands-on Placement Lab`
    }));

    const gap: SkillGap = {
      id: `gap-${Date.now()}`,
      student_id: studentId,
      target_role: targetRole,
      coverage_percentage: coverage,
      matched_skills: matched,
      partial_skills: partial,
      missing_skills: missing,
      ai_learning_path: learningPath,
      evaluated_at: new Date().toISOString()
    };

    data.skillGap = gap;
    data.student.target_role = targetRole;
    return gap;
  }
}

export const mockDb = new MockDatabase();
