import {
  Institution,
  User,
  Student,
  Company,
  Recruiter,
  Job,
  Application,
  CandidateAccess,
  PlacementDrive,
  Venue,
  InterviewPanel,
  ScheduleConflict,
  Interview,
  Offer,
  PlacementDocument,
  NotificationBroadcast,
  Mentor,
  AuditLog,
  JobStatus,
  OfferStatus,
  VerificationStatus,
  UserRole
} from '../types';
import {
  INITIAL_INSTITUTIONS,
  INITIAL_USERS,
  INITIAL_COMPANIES,
  INITIAL_RECRUITERS,
  INITIAL_STUDENTS,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
  INITIAL_CANDIDATE_ACCESS,
  INITIAL_VENUES,
  INITIAL_PANELS,
  INITIAL_DRIVES,
  INITIAL_CONFLICTS,
  INITIAL_INTERVIEWS,
  INITIAL_OFFERS,
  INITIAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_MENTORS,
  INITIAL_AUDIT_LOGS
} from '../data/initialData';

const STORAGE_KEY = 'campuslink_tpo_state_v1';

export interface StorageState {
  institutions: Institution[];
  users: User[];
  currentUserId: string;
  selectedCollegeIdFilter?: string; // For Admin view filtering
  companies: Company[];
  recruiters: Recruiter[];
  students: Student[];
  jobs: Job[];
  applications: Application[];
  candidateAccess: CandidateAccess[];
  venues: Venue[];
  panels: InterviewPanel[];
  drives: PlacementDrive[];
  conflicts: ScheduleConflict[];
  interviews: Interview[];
  offers: Offer[];
  documents: PlacementDocument[];
  notifications: NotificationBroadcast[];
  mentors: Mentor[];
  auditLogs: AuditLog[];
}

function getInitialState(): StorageState {
  return {
    institutions: INITIAL_INSTITUTIONS,
    users: INITIAL_USERS,
    currentUserId: 'user-tpo-apex', // Default to TPO Dr. Rajesh Nair
    companies: INITIAL_COMPANIES,
    recruiters: INITIAL_RECRUITERS,
    students: INITIAL_STUDENTS,
    jobs: INITIAL_JOBS,
    applications: INITIAL_APPLICATIONS,
    candidateAccess: INITIAL_CANDIDATE_ACCESS,
    venues: INITIAL_VENUES,
    panels: INITIAL_PANELS,
    drives: INITIAL_DRIVES,
    conflicts: INITIAL_CONFLICTS,
    interviews: INITIAL_INTERVIEWS,
    offers: INITIAL_OFFERS,
    documents: INITIAL_DOCUMENTS,
    notifications: INITIAL_NOTIFICATIONS,
    mentors: INITIAL_MENTORS,
    auditLogs: INITIAL_AUDIT_LOGS
  };
}

class RepositoryService {
  private state: StorageState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.load();
  }

  private load(): StorageState {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (serialized) {
        return JSON.parse(serialized);
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage, using defaults', e);
    }
    return getInitialState();
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to persist state to localStorage', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  public resetAll() {
    this.state = getInitialState();
    this.save();
  }

  // Current session & auth context
  public getCurrentUser(): User {
    const user = this.state.users.find(u => u.id === this.state.currentUserId);
    return user || this.state.users[0];
  }

  public setCurrentUser(userId: string) {
    this.state.currentUserId = userId;
    const user = this.getCurrentUser();
    this.logAudit({
      action: 'LOGIN',
      resourceType: 'Session',
      resourceId: user.id,
      details: `Switched session to ${user.name} (${user.role})`
    });
    this.save();
  }

  public setSelectedCollegeFilter(collegeId?: string) {
    this.state.selectedCollegeIdFilter = collegeId;
    this.save();
  }

  public getSelectedCollegeFilter(): string | undefined {
    return this.state.selectedCollegeIdFilter;
  }

  // Effective Institution Scope
  public getEffectiveCollegeId(): string | undefined {
    const user = this.getCurrentUser();
    if (user.role === 'COLLEGE_TPO') {
      return user.institutionId;
    }
    // Admin can view specific college or undefined for global
    return this.state.selectedCollegeIdFilter || this.state.institutions[0].id;
  }

  public getInstitutions(): Institution[] {
    return this.state.institutions;
  }

  public getEffectiveInstitution(): Institution {
    const effId = this.getEffectiveCollegeId();
    return this.state.institutions.find(i => i.id === effId) || this.state.institutions[0];
  }

  // 1. STUDENTS (OBJECT-LEVEL TENANT ISOLATION)
  public getStudents(): Student[] {
    const user = this.getCurrentUser();
    if (user.role === 'COLLEGE_TPO') {
      // STRICT FILTER BY TPO'S INSTITUTION
      return this.state.students.filter(s => s.collegeId === user.institutionId);
    }
    if (this.state.selectedCollegeIdFilter) {
      return this.state.students.filter(s => s.collegeId === this.state.selectedCollegeIdFilter);
    }
    return this.state.students;
  }

  public getStudentById(id: string): Student | undefined {
    const students = this.getStudents();
    return students.find(s => s.id === id);
  }

  public updateStudent(id: string, updates: Partial<Student>) {
    this.state.students = this.state.students.map(s => {
      if (s.id === id) {
        return { ...s, ...updates };
      }
      return s;
    });
    this.save();
  }

  public flagStudentAtRisk(studentId: string, isFlagged: boolean, riskScore?: number, intervention?: string) {
    const student = this.state.students.find(s => s.id === studentId);
    if (!student) return;

    student.isFlaggedAtRisk = isFlagged;
    if (riskScore !== undefined) student.riskScore = riskScore;
    if (intervention) student.recommendedIntervention = intervention;
    if (isFlagged && student.readinessLevel === 'HIGHLY_EMPLOYABLE') {
      student.readinessLevel = 'DEVELOPING';
    }

    this.logAudit({
      action: 'AI_RECOMMENDATION',
      resourceType: 'StudentRisk',
      resourceId: studentId,
      details: `${isFlagged ? 'Flagged' : 'Cleared'} risk status for ${student.fullName}. Score: ${riskScore ?? student.riskScore}`
    });
    this.save();
  }

  public assignMentor(studentId: string, mentorId?: string) {
    const student = this.state.students.find(s => s.id === studentId);
    if (student) {
      student.mentorId = mentorId;
      const mentor = this.state.mentors.find(m => m.id === mentorId);
      this.logAudit({
        action: 'ROLE_CHANGE',
        resourceType: 'StudentMentor',
        resourceId: studentId,
        details: `Assigned mentor ${mentor?.fullName || 'None'} to ${student.fullName}`
      });
      this.save();
    }
  }

  // 2. JOBS & REVIEWS
  public getJobs(): Job[] {
    const user = this.getCurrentUser();
    if (user.role === 'COLLEGE_TPO') {
      return this.state.jobs.filter(j => j.collegeId === user.institutionId);
    }
    if (this.state.selectedCollegeIdFilter) {
      return this.state.jobs.filter(j => j.collegeId === this.state.selectedCollegeIdFilter);
    }
    return this.state.jobs;
  }

  public updateJobStatus(jobId: string, status: JobStatus, notes?: string) {
    const user = this.getCurrentUser();
    const job = this.state.jobs.find(j => j.id === jobId);
    if (!job) return;

    job.status = status;
    job.reviewNotes = notes;
    job.reviewedByTpoId = user.id;
    job.reviewedAt = new Date().toISOString();

    this.logAudit({
      action: status === 'APPROVED' ? 'JOB_APPROVAL' : 'JOB_REJECTION',
      resourceType: 'Job',
      resourceId: jobId,
      details: `Job "${job.title}" marked as ${status}. Notes: ${notes || 'None'}`
    });
    this.save();
  }

  // 3. CANDIDATE ACCESS CONTROL (CRITICAL)
  public getCandidateAccessRecords(): CandidateAccess[] {
    const user = this.getCurrentUser();
    if (user.role === 'COLLEGE_TPO') {
      return this.state.candidateAccess.filter(ca => ca.collegeId === user.institutionId);
    }
    return this.state.candidateAccess;
  }

  public releaseCandidatesToRecruiter(
    jobId: string,
    studentIds: string[],
    scope: 'FULL_VERIFIED_PROFILE' | 'MASKED_ANONYMIZED' = 'FULL_VERIFIED_PROFILE'
  ) {
    const user = this.getCurrentUser();
    const job = this.state.jobs.find(j => j.id === jobId);
    if (!job) return;

    let releasedCount = 0;
    studentIds.forEach(stuId => {
      // Check if already released
      const existing = this.state.candidateAccess.find(
        ca => ca.jobId === jobId && ca.studentId === stuId
      );
      if (existing) {
        existing.accessStatus = 'ACTIVE';
        existing.dataVisibilityScope = scope;
      } else {
        const app = this.state.applications.find(a => a.jobId === jobId && a.studentId === stuId);
        const newAccess: CandidateAccess = {
          id: `cacc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          collegeId: job.collegeId,
          companyId: job.companyId,
          jobId: job.id,
          studentId: stuId,
          applicationId: app?.id || `app-temp-${stuId}`,
          grantedByTpoId: user.id,
          grantedAt: new Date().toISOString(),
          accessStatus: 'ACTIVE',
          dataVisibilityScope: scope
        };
        this.state.candidateAccess.push(newAccess);
        releasedCount++;
      }
    });

    this.logAudit({
      action: 'CANDIDATE_RELEASE',
      resourceType: 'CandidateAccessPool',
      resourceId: jobId,
      details: `TPO released ${studentIds.length} candidate(s) for job "${job.title}". Scope: ${scope}`
    });
    this.save();
  }

  public revokeCandidateAccess(accessId: string, reason: string) {
    const acc = this.state.candidateAccess.find(ca => ca.id === accessId);
    if (acc) {
      acc.accessStatus = 'REVOKED';
      acc.revocationReason = reason;
      this.logAudit({
        action: 'CANDIDATE_REVOKE',
        resourceType: 'CandidateAccess',
        resourceId: accessId,
        details: `Revoked candidate access for student ID ${acc.studentId}. Reason: ${reason}`
      });
      this.save();
    }
  }

  // 4. DRIVES & SCHEDULING
  public getDrives(): PlacementDrive[] {
    const user = this.getCurrentUser();
    if (user.role === 'COLLEGE_TPO') {
      return this.state.drives.filter(d => d.collegeId === user.institutionId);
    }
    if (this.state.selectedCollegeIdFilter) {
      return this.state.drives.filter(d => d.collegeId === this.state.selectedCollegeIdFilter);
    }
    return this.state.drives;
  }

  public addDrive(drive: Omit<PlacementDrive, 'id'>): PlacementDrive {
    const newDrive: PlacementDrive = {
      ...drive,
      id: `drv-${Date.now()}`
    };
    this.state.drives.push(newDrive);
    this.logAudit({
      action: 'SCHEDULE_CHANGE',
      resourceType: 'PlacementDrive',
      resourceId: newDrive.id,
      details: `Created new placement drive "${newDrive.driveName}" scheduled for ${newDrive.date}`
    });
    this.save();
    return newDrive;
  }

  public getConflicts(): ScheduleConflict[] {
    const user = this.getCurrentUser();
    if (user.role === 'COLLEGE_TPO') {
      return this.state.conflicts.filter(c => c.collegeId === user.institutionId);
    }
    return this.state.conflicts;
  }

  public resolveConflict(conflictId: string, note?: string) {
    const conflict = this.state.conflicts.find(c => c.id === conflictId);
    if (conflict) {
      conflict.status = 'RESOLVED';
      this.logAudit({
        action: 'SCHEDULE_CHANGE',
        resourceType: 'ScheduleConflict',
        resourceId: conflictId,
        details: `Resolved conflict "${conflict.title}". ${note || ''}`
      });
      this.save();
    }
  }

  // 5. INTERVIEWS
  public getInterviews(): Interview[] {
    const user = this.getCurrentUser();
    if (user.role === 'COLLEGE_TPO') {
      return this.state.interviews.filter(i => i.collegeId === user.institutionId);
    }
    return this.state.interviews;
  }

  public updateInterviewAttendance(interviewId: string, attendance: 'PRESENT' | 'NO_SHOW', result?: 'CLEARED' | 'REJECTED') {
    const intv = this.state.interviews.find(i => i.id === interviewId);
    if (intv) {
      intv.attendanceStatus = attendance;
      if (result) intv.resultStatus = result;
      this.save();
    }
  }

  // 6. OFFERS
  public getOffers(): Offer[] {
    const user = this.getCurrentUser();
    if (user.role === 'COLLEGE_TPO') {
      return this.state.offers.filter(o => o.collegeId === user.institutionId);
    }
    if (this.state.selectedCollegeIdFilter) {
      return this.state.offers.filter(o => o.collegeId === this.state.selectedCollegeIdFilter);
    }
    return this.state.offers;
  }

  public updateOfferStatus(offerId: string, status: OfferStatus, remarks?: string) {
    const offer = this.state.offers.find(o => o.id === offerId);
    if (offer) {
      offer.status = status;
      offer.statusUpdatedAt = new Date().toISOString();
      if (remarks) offer.joiningRemarks = remarks;
      
      // Sync student status if ACCEPTED or JOINED
      if (status === 'ACCEPTED' || status === 'JOINED') {
        const student = this.state.students.find(s => s.id === offer.studentId);
        const comp = this.state.companies.find(c => c.id === offer.companyId);
        if (student) {
          student.placementStatus = 'PLACED';
          student.placedCompany = comp?.name;
          student.placedPackageLPA = offer.ctcLPA;
        }
      }

      this.logAudit({
        action: 'OFFER_STATUS_UPDATE',
        resourceType: 'Offer',
        resourceId: offerId,
        details: `Updated offer status to ${status} for student ID ${offer.studentId}`
      });
      this.save();
    }
  }

  // 7. DOCUMENTS
  public getDocuments(): PlacementDocument[] {
    const user = this.getCurrentUser();
    if (user.role === 'COLLEGE_TPO') {
      return this.state.documents.filter(d => d.collegeId === user.institutionId);
    }
    return this.state.documents;
  }

  public verifyDocument(docId: string, status: VerificationStatus, reason?: string) {
    const user = this.getCurrentUser();
    const doc = this.state.documents.find(d => d.id === docId);
    if (doc) {
      doc.status = status;
      doc.verifiedByTpoId = user.id;
      doc.verifiedAt = new Date().toISOString();
      doc.rejectionReason = reason;

      this.logAudit({
        action: 'DOCUMENT_VERIFICATION',
        resourceType: 'Document',
        resourceId: docId,
        details: `Document "${doc.title}" verified as ${status}. ${reason ? `Reason: ${reason}` : ''}`
      });
      this.save();
    }
  }

  // 8. NOTIFICATIONS
  public getNotifications(): NotificationBroadcast[] {
    const user = this.getCurrentUser();
    if (user.role === 'COLLEGE_TPO') {
      return this.state.notifications.filter(n => n.collegeId === user.institutionId);
    }
    return this.state.notifications;
  }

  public broadcastNotification(broadcast: Omit<NotificationBroadcast, 'id' | 'sentAt' | 'sentByTpoId' | 'deliveryRate'>): NotificationBroadcast {
    const user = this.getCurrentUser();
    const newNotif: NotificationBroadcast = {
      ...broadcast,
      id: `notif-${Date.now()}`,
      sentAt: new Date().toISOString(),
      sentByTpoId: user.id,
      deliveryRate: 99.2
    };
    this.state.notifications.unshift(newNotif);
    this.save();
    return newNotif;
  }

  // 9. COMPANIES & RECRUITERS
  public getCompanies(): Company[] {
    return this.state.companies;
  }

  public getRecruiters(): Recruiter[] {
    return this.state.recruiters;
  }

  public approveRecruiter(recruiterId: string) {
    const user = this.getCurrentUser();
    const rec = this.state.recruiters.find(r => r.id === recruiterId);
    if (rec) {
      rec.status = 'APPROVED';
      rec.approvedByTpoId = user.id;
      rec.approvedAt = new Date().toISOString();
      this.save();
    }
  }

  // 10. MENTORS
  public getMentors(): Mentor[] {
    const user = this.getCurrentUser();
    if (user.role === 'COLLEGE_TPO') {
      return this.state.mentors.filter(m => m.collegeId === user.institutionId);
    }
    return this.state.mentors;
  }

  // 11. AUDIT LOGS
  public getAuditLogs(): AuditLog[] {
    const user = this.getCurrentUser();
    if (user.role === 'COLLEGE_TPO') {
      return this.state.auditLogs.filter(a => !a.collegeId || a.collegeId === user.institutionId);
    }
    return this.state.auditLogs;
  }

  public logAudit(entry: {
    action: AuditLog['action'];
    resourceType: string;
    resourceId: string;
    details: string;
  }) {
    const user = this.getCurrentUser();
    const log: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 3)}`,
      collegeId: user.institutionId,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: entry.action,
      resourceType: entry.resourceType,
      resourceId: entry.resourceId,
      details: entry.details,
      ipAddress: '192.168.1.108 (Campus Intranet)',
      timestamp: new Date().toISOString()
    };
    this.state.auditLogs.unshift(log);
    if (this.state.auditLogs.length > 200) {
      this.state.auditLogs = this.state.auditLogs.slice(0, 200);
    }
  }

  // 12. APPLICATIONS
  public getApplications(): Application[] {
    const user = this.getCurrentUser();
    if (user.role === 'COLLEGE_TPO') {
      return this.state.applications.filter(a => a.collegeId === user.institutionId);
    }
    return this.state.applications;
  }

  public getVenues(): Venue[] {
    const user = this.getCurrentUser();
    if (user.role === 'COLLEGE_TPO') {
      return this.state.venues.filter(v => v.collegeId === user.institutionId);
    }
    return this.state.venues;
  }

  public getPanels(): InterviewPanel[] {
    const user = this.getCurrentUser();
    if (user.role === 'COLLEGE_TPO') {
      return this.state.panels.filter(p => p.collegeId === user.institutionId);
    }
    return this.state.panels;
  }
}

export const repo = new RepositoryService();
