export type UserRole = 'RECRUITER' | 'HIRING_MANAGER' | 'RECRUITER_ADMIN';

export type ApplicationStatus =
  | 'APPLIED'
  | 'UNDER REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'SELECTED'
  | 'REJECTED'
  | 'OFFERED'
  | 'ACCEPTED'
  | 'DECLINED';

export type RejectionReason =
  | 'Does not meet eligibility criteria'
  | 'Skills mismatch'
  | 'Insufficient experience'
  | 'Academic criteria not met'
  | 'Interview performance'
  | 'Assessment performance'
  | 'Position filled'
  | 'Other'
  | 'CGPA below cutoff'
  | 'Missing mandatory tech stack'
  | 'Graduation year or branch mismatch'
  | 'Active backlogs detected'
  | 'Failed coding / technical benchmark'
  | 'High compensation expectations'
  | 'Cultural or communication mismatch'
  | 'Offer declined by candidate'
  | 'Position filled / Requisition closed';

export type InterviewRoundType = 'Aptitude' | 'Technical' | 'Coding' | 'Managerial' | 'HR';
export type InterviewDecision = 'Pass to Next Round' | 'Selected' | 'On Hold' | 'Reject';
export type DriveStatus = 'DRAFT' | 'SUBMITTED_TO_TPO' | 'APPROVED_BY_TPO' | 'COMPLETED' | 'CANCELLED';

export interface Company {
  id: string;
  name: string;
  logoUrl: string;
  industry: string;
  website: string;
  description: string;
  locations: string[];
  recruiterContacts: {
    name: string;
    email: string;
    phone: string;
    designation: string;
  }[];
  tier: string;
}

export interface Recruiter {
  id: string;
  companyId: string;
  name: string;
  email: string;
  designation: string;
  phone: string;
  avatarUrl: string;
  role: UserRole;
  department: string;
}

export interface JobRequisition {
  id: string;
  companyId: string;
  title: string;
  department: string;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  minCgpa: number;
  eligibleBranches: string[];
  graduationYear: number;
  maxBacklogsAllowed: number;
  experienceLevel: string;
  requiredCertifications: string[];
  ctcMinLpa: number;
  ctcMaxLpa: number;
  ctcBreakdown: string;
  location: string;
  workMode: 'On-site' | 'Hybrid' | 'Remote';
  openings: number;
  deadline: string;
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT';
  createdAt: string;
}

// Student entity in college registry
// Recruiter CAN ONLY access if student applied to this company's job OR has explicit candidate_access
export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  collegeName: string;
  rollNumber: string;
  branch: string;
  graduationYear: number;
  cgpa: number;
  activeBacklogs: number;
  skills: string[];
  projects: {
    title: string;
    techStack: string[];
    description: string;
    link?: string;
  }[];
  experience: {
    company: string;
    role: string;
    duration: string;
    summary: string;
  }[];
  certifications: string[];
  resumeUrl: string;
  resumeText: string;
  codingProfiles?: {
    platform: string;
    handle: string;
    score: string;
  }[];
  tpoPrivateNotes?: string; // SENSITIVE: Hidden from recruiters
  otherCompanyApplicationsCount?: number; // SENSITIVE: Hidden from recruiters
}

export interface CandidateAccess {
  id: string;
  companyId: string;
  studentId: string;
  driveId?: string;
  accessType: 'JOB_APPLICATION' | 'TPO_SHARED_DRIVE' | 'SHORTLIST_REFERRAL';
  grantedAt: string;
  expiresAt?: string;
}

export interface Application {
  id: string;
  jobId: string;
  companyId: string;
  studentId: string;
  appliedDate: string;
  status: ApplicationStatus;
  rejectionReason?: RejectionReason;
  rejectionNotes?: string;
  // PostgreSQL Compatible Fields
  rejection_reason?: string;
  rejection_comment?: string;
  rejected_by?: string;
  rejected_at?: string;
  recruiterNotes?: string;
  aiMatchScore?: number;
  aiRecommendation?: 'Strong Hire' | 'Recommended' | 'Consider' | 'Re-evaluate';
  aiMatchBreakdown?: {
    eligibilityScore: number;
    skillMatchScore: number;
    semanticSimilarity: number;
    projectRelevance: number;
    experienceScore: number;
    certificationScore: number;
    academicFit: number;
    interviewReadiness: number;
    whyRecommended: string[];
    gaps: string[];
    summary: string;
  };
}

export interface InterviewRecord {
  id: string;
  applicationId: string;
  jobId: string;
  companyId: string;
  studentId: string;
  roundName: InterviewRoundType;
  roundNumber: number;
  scheduledTime: string;
  durationMinutes: number;
  interviewerName: string;
  mode: 'Google Meet' | 'On-Campus Room A' | 'Phone Screening' | 'Coding Platform';
  meetingLink?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  score?: number;
  notes?: string;
  decision?: InterviewDecision;
  aiAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    technicalFit: string;
    communication: string;
    recommendation: string;
    disclaimer: string;
  };
}

export interface OfferRecord {
  id: string;
  applicationId: string;
  jobId: string;
  companyId: string;
  studentId: string;
  role: string;
  fixedCtcLpa: number;
  variableCtcLpa: number;
  joiningBonusLpa: number;
  totalCtcLpa: number;
  location: string;
  joiningDate: string;
  validUntil: string;
  status: 'ISSUED' | 'ACCEPTED' | 'DECLINED' | 'REVOKED';
  letterText: string;
  createdAt: string;
}

export interface PlacementDrive {
  id: string;
  companyId: string;
  jobId: string;
  driveTitle: string;
  driveDate: string;
  timeSlot: string;
  durationHours: number;
  campusName: string;
  interviewType: 'On-Campus' | 'Virtual' | 'Hybrid';
  targetCandidateCount: number;
  rounds: InterviewRoundType[];
  specialRequirements: string;
  tpoApprovalStatus: DriveStatus;
  tpoFeedback?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  companyId: string;
  type: 'NEW_APPLICATION' | 'TPO_APPROVAL' | 'DEADLINE_REMINDER' | 'INTERVIEW_ALERT' | 'OFFER_STATUS' | 'SECURITY_ALERT';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface AuditLog {
  id: string;
  companyId: string;
  recruiterId: string;
  action: string;
  entityType: 'JOB' | 'APPLICATION' | 'INTERVIEW' | 'OFFER' | 'SECURITY' | 'DRIVE';
  entityId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL_SECURITY';
}

export interface ParsedJDResult {
  role: string;
  department: string;
  experience: string;
  education: string;
  eligibility: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  keywords: string[];
  summary: string;
}
