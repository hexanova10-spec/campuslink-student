export type UserRole = 'SYSTEM_ADMIN' | 'COLLEGE_TPO' | 'CAMPUS_COORDINATOR' | 'RECRUITER';

export interface Institution {
  id: string;
  name: string;
  code: string;
  type: 'University' | 'Engineering College' | 'Institute of Technology';
  campuses: string[];
  departments: string[];
  city: string;
  state: string;
  establishedYear: number;
  accreditation: string;
  activeStudents: number;
  totalPlaced: number;
  averagePackageLPA: number;
  highestPackageLPA: number;
  tpoHeadName: string;
  tpoEmail: string;
  tpoPhone: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institutionId?: string; // TPOs bound to their college
  campusId?: string;
  avatar?: string;
  department?: string;
  lastLogin: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'INVITED';
}

export interface Skill {
  id: string;
  name: string;
  category: 'Languages' | 'Frameworks' | 'Cloud/DevOps' | 'Data/AI' | 'Core CS' | 'Soft Skills';
  demandTier: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'EMERGING';
}

export type ReadinessLevel = 'PLACEMENT_READY' | 'HIGHLY_EMPLOYABLE' | 'DEVELOPING' | 'AT_RISK';
export type PlacementStatus = 'UNPLACED' | 'APPLIED' | 'SHORTLISTED' | 'INTERVIEWING' | 'OFFERED' | 'PLACED' | 'OPTED_OUT';

export interface Student {
  id: string;
  collegeId: string;
  campusId: string;
  rollNumber: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  department: string;
  branch: string; // e.g. CSE, ECE, MECH, IT, EEE
  graduationYear: number;
  cgpa: number;
  tenthPercentage: number;
  twelfthPercentage: number;
  activeBacklogs: number;
  historyOfBacklogs: number;
  readinessLevel: ReadinessLevel;
  placementStatus: PlacementStatus;
  primarySkills: string[];
  secondarySkills: string[];
  certifications: string[];
  mentorId?: string;
  isFlaggedAtRisk: boolean;
  riskScore: number; // 0 - 100 (higher = greater risk)
  riskFactors?: string[];
  recommendedIntervention?: string;
  totalApplications: number;
  totalRejections: number;
  totalInterviews: number;
  profileCompletion: number; // percentage
  resumeVerified: boolean;
  placementWillingness: boolean;
  optedDreamJob: boolean;
  placedCompany?: string;
  placedPackageLPA?: number;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  tier: 'TIER_1_SUPER_DREAM' | 'TIER_2_DREAM' | 'TIER_3_MASS' | 'TIER_CORE';
  website: string;
  hqLocation: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'BLACKLISTED';
  minCgpaPreference: number;
  averagePackageLPA: number;
  highestPackageLPA: number;
  totalHiredOverall: number;
  totalHiredCurrentBatch: number;
  partnerSince: number;
  collegePartnerships: string[]; // college IDs
}

export interface Recruiter {
  id: string;
  companyId: string;
  fullName: string;
  email: string;
  phone: string;
  designation: string;
  status: 'APPROVED' | 'PENDING_APPROVAL' | 'SUSPENDED';
  approvedByTpoId?: string;
  approvedAt?: string;
  lastActive: string;
  assignedCollegeIds: string[];
}

export type JobStatus = 'PENDING_TPO_REVIEW' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED' | 'CLOSED';

export interface Job {
  id: string;
  companyId: string;
  collegeId: string; // Institutional scope
  title: string;
  roleType: 'FULL_TIME' | 'INTERNSHIP' | 'INTERN_TO_FTE';
  ctcLPA: number;
  stipendPerMonth?: number;
  location: string;
  description: string;
  eligibilityCriteria: {
    minCgpa: number;
    eligibleBranches: string[];
    allowedGraduationYears: number[];
    maxBacklogs: number;
    tenthMinPercent: number;
    twelfthMinPercent: number;
    requiredSkills: string[];
    preferredSkills: string[];
  };
  openings: number;
  status: JobStatus;
  reviewNotes?: string;
  reviewedByTpoId?: string;
  reviewedAt?: string;
  applicationDeadline: string;
  driveDate?: string;
  totalApplied: number;
  totalShortlisted: number;
  totalOffered: number;
}

export interface Application {
  id: string;
  studentId: string;
  jobId: string;
  collegeId: string;
  companyId: string;
  appliedAt: string;
  isEligible: boolean;
  ineligibilityReason?: string;
  aiMatchScore: number; // 0-100
  skillMatchPercentage: number;
  skillGaps: string[];
  tpoVerified: boolean;
  status: 'APPLIED' | 'VERIFIED' | 'SHORTLISTED' | 'ASSESSMENT_CLEARED' | 'INTERVIEW_SCHEDULED' | 'OFFERED' | 'REJECTED';
}

export interface CandidateAccess {
  id: string;
  collegeId: string;
  companyId: string;
  jobId: string;
  studentId: string;
  applicationId: string;
  grantedByTpoId: string;
  grantedAt: string;
  accessStatus: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  dataVisibilityScope: 'MASKED_ANONYMIZED' | 'FULL_VERIFIED_PROFILE' | 'INTERVIEW_ONLY';
  revocationReason?: string;
}

export type DriveStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';

export interface PlacementDrive {
  id: string;
  collegeId: string;
  campusId: string;
  companyId: string;
  jobId: string;
  driveName: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  status: DriveStatus;
  rounds: {
    roundNumber: number;
    name: string;
    type: 'ONLINE_TEST' | 'CODING_ROUND' | 'TECHNICAL_INTERVIEW' | 'HR_INTERVIEW' | 'GD';
    scheduledTime: string;
    durationMins: number;
    venueOrLink: string;
  }[];
  panelistsCount: number;
  infrastructureCapacity: number;
  registeredCandidatesCount: number;
  shortlistedCandidatesCount: number;
  offersMadeCount: number;
  coordinatingTpoId: string;
}

export interface Venue {
  id: string;
  collegeId: string;
  campusId: string;
  name: string;
  type: 'AUDITORIUM' | 'COMPUTER_LAB' | 'INTERVIEW_ROOM' | 'SEMINAR_HALL';
  capacity: number;
  facilities: string[];
  isAvailable: boolean;
}

export interface InterviewPanel {
  id: string;
  collegeId: string;
  name: string;
  leadPanelist: string;
  companyId: string;
  specialization: string;
  capacityPerDay: number;
}

export interface ScheduleSlot {
  id: string;
  collegeId: string;
  driveId: string;
  companyId: string;
  roundName: string;
  date: string;
  startTime: string;
  endTime: string;
  venueId: string;
  panelId?: string;
  assignedStudentIds: string[];
  maxCapacity: number;
}

export interface ScheduleConflict {
  id: string;
  collegeId: string;
  conflictType: 'VENUE_OVERLAP' | 'PANEL_CLASH' | 'STUDENT_DOUBLE_BOOKING' | 'INFRASTRUCTURE_LIMIT' | 'DRIVE_OVERLAP';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  affectedDrives: string[];
  affectedStudentsCount: number;
  suggestedResolution: string;
  status: 'UNRESOLVED' | 'RESOLVED' | 'IGNORED';
}

export interface Interview {
  id: string;
  collegeId: string;
  driveId: string;
  jobId: string;
  studentId: string;
  roundNumber: number;
  roundName: string;
  scheduledTime: string;
  venueOrRoom: string;
  panelistName: string;
  attendanceStatus: 'SCHEDULED' | 'PRESENT' | 'NO_SHOW' | 'CANCELLED';
  resultStatus: 'PENDING' | 'CLEARED' | 'REJECTED' | 'ON_HOLD';
  feedbackNotes?: string;
}

export type OfferStatus = 'OFFERED' | 'ACCEPTED' | 'DECLINED' | 'DEFERRED' | 'WITHDRAWN' | 'JOINED' | 'NOT_JOINED';

export interface Offer {
  id: string;
  collegeId: string;
  studentId: string;
  companyId: string;
  jobId: string;
  designation: string;
  ctcLPA: number;
  stipendPerMonth?: number;
  offerDate: string;
  acceptanceDeadline: string;
  status: OfferStatus;
  statusUpdatedAt: string;
  offerLetterUrl?: string;
  isDreamOffer: boolean;
  joiningDate?: string;
  joiningLocation?: string;
  joiningRemarks?: string;
}

export type DocumentType = 'OFFER_LETTER' | 'MARKSHEET' | 'RESUME' | 'BONAFIDE' | 'IDENTITY_PROOF' | 'NOC';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface PlacementDocument {
  id: string;
  collegeId: string;
  studentId: string;
  documentType: DocumentType;
  title: string;
  fileSize: string;
  uploadDate: string;
  status: VerificationStatus;
  verifiedByTpoId?: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface NotificationBroadcast {
  id: string;
  collegeId: string;
  title: string;
  content: string;
  type: 'DRIVE_ANNOUNCEMENT' | 'ELIGIBILITY_ALERT' | 'INTERVIEW_SCHEDULE' | 'DOCUMENT_REMINDER' | 'OFFER_LETTER' | 'JOINING_NOTICE';
  targetAudience: 'ALL_STUDENTS' | 'SPECIFIC_BRANCH' | 'ELIGIBLE_CANDIDATES' | 'SHORTLISTED' | 'SINGLE_STUDENT';
  targetBranch?: string;
  targetJobId?: string;
  recipientCount: number;
  sentAt: string;
  sentByTpoId: string;
  channels: ('EMAIL' | 'SMS' | 'PORTAL' | 'WHATSAPP')[];
  deliveryRate: number;
}

export interface Mentor {
  id: string;
  collegeId: string;
  fullName: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  assignedStudentIds: string[];
  activeInterventionsCount: number;
  successRate: number;
}

export interface AuditLog {
  id: string;
  collegeId?: string; // Optional for system-wide events
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 'LOGIN' | 'JOB_APPROVAL' | 'JOB_REJECTION' | 'CANDIDATE_RELEASE' | 'CANDIDATE_REVOKE' | 'SCHEDULE_CHANGE' | 'OFFER_STATUS_UPDATE' | 'DOCUMENT_VERIFICATION' | 'ROLE_CHANGE' | 'AI_RECOMMENDATION' | 'ADMIN_CONFIG_UPDATE';
  resourceType: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  contextScope: 'COLLEGE_RESTRICTED' | 'GLOBAL_SYSTEM';
  suggestedActions?: string[];
}
