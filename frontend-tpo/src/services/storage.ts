const TPO_TOKEN_KEY = 'campuslink_tpo_jwt';

async function tpoFetch(path: string, init: RequestInit = {}) {
  let token = localStorage.getItem(TPO_TOKEN_KEY);
  if (!token) {
    const session = await fetch('/api/tpo/auth/dev-session', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({tpoId:'user-tpo-apex',institutionId:'campuslink'}) });
    if (!session.ok) throw new Error(`TPO session bootstrap failed: ${session.status}`);
    const data = await session.json(); token = data.token; localStorage.setItem(TPO_TOKEN_KEY, token);
  }
  const headers = new Headers(init.headers || {}); headers.set('Authorization', `Bearer ${token}`);
  let res = await fetch(path, {...init,headers});
  if (res.status === 401) {
    localStorage.removeItem(TPO_TOKEN_KEY);
    const session = await fetch('/api/tpo/auth/dev-session', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({tpoId:'user-tpo-apex',institutionId:'campuslink'}) });
    if (!session.ok) throw new Error(`TPO session bootstrap failed: ${session.status}`);
    const data = await session.json();
    token = data.token;
    localStorage.setItem(TPO_TOKEN_KEY, token);
    headers.set('Authorization', `Bearer ${token}`);
    res = await fetch(path, {...init,headers});
  }
  if (!res.ok) throw new Error(`TPO API ${res.status}: ${path}`);
  return res;
}

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

const STORAGE_KEY = 'campuslink_tpo_state_v2';

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
    void this.hydrateFromBackend();
    window.setInterval(() => void this.hydrateFromBackend(), 3000);
    window.addEventListener('focus', () => void this.hydrateFromBackend());
  }

  private async hydrateFromBackend() {
    try {
      const [students, companies, jobs, applications, drives, interviews, offers, logs, documents, profile] = await Promise.all([
        tpoFetch('/api/tpo/students').then(r=>r.json()), tpoFetch('/api/tpo/companies').then(r=>r.json()),
        tpoFetch('/api/tpo/jobs').then(r=>r.json()), tpoFetch('/api/tpo/applications').then(r=>r.json()),
        tpoFetch('/api/tpo/drives').then(r=>r.json()), tpoFetch('/api/tpo/interviews').then(r=>r.json()),
        tpoFetch('/api/tpo/offers').then(r=>r.json()), tpoFetch('/api/tpo/audit-logs').then(r=>r.json()), tpoFetch('/api/tpo/documents').then(r=>r.json()), tpoFetch('/api/tpo/profile').then(r=>r.json())
      ]);
      const collegeId='inst-apex-01';
      this.state.students=(students.students||[]).map((s:any)=>({id:s.id,collegeId,campusId:collegeId,rollNumber:s.rollNumber||'',fullName:s.fullName||'',email:s.email||'',phone:s.phone||'',gender:s.gender||'OTHER',department:s.branch||'',branch:s.branch||'',graduationYear:s.graduationYear||0,cgpa:Number(s.cgpa||0),tenthPercentage:0,twelfthPercentage:0,activeBacklogs:0,historyOfBacklogs:0,readinessLevel:'PLACEMENT_READY',placementStatus:'UNPLACED',primarySkills:[],secondarySkills:[],certifications:[],isFlaggedAtRisk:false,riskScore:0,totalApplications:0,totalRejections:0,totalInterviews:0,profileCompletion:0,resumeVerified:false,placementWillingness:true,optedDreamJob:false} as Student));
      this.state.companies=(companies.companies||[]).map((x:any)=>({id:x.id,name:x.name,industry:x.industry||'',tier:'TIER_3_MASS',website:x.website||'',hqLocation:(x.locations||[])[0]||'',status:'APPROVED',minCgpaPreference:0,averagePackageLPA:0,highestPackageLPA:0,totalHiredOverall:0,totalHiredCurrentBatch:0,partnerSince:new Date().getFullYear(),collegePartnerships:[collegeId]} as Company));
      this.state.jobs=(jobs.jobs||[]).map((j:any)=>({id:j.id,companyId:j.company_id,collegeId,title:j.title,roleType:'FULL_TIME',ctcLPA:Number(j.ctc_max_lpa||j.ctc_min_lpa||0),location:j.location||'',description:j.description||'',eligibilityCriteria:{minCgpa:Number(j.min_cgpa||0),eligibleBranches:j.eligible_branches||[],allowedGraduationYears:j.graduation_year?[j.graduation_year]:[],maxBacklogs:Number(j.max_backlogs_allowed||0),tenthMinPercent:0,twelfthMinPercent:0,requiredSkills:j.required_skills||[],preferredSkills:j.preferred_skills||[]},openings:Number(j.openings||1),status:j.status||'PENDING_TPO_REVIEW',applicationDeadline:j.deadline||'',totalApplied:0,totalShortlisted:0,totalOffered:0} as Job));
      this.state.applications=(applications.applications||[]).map((a:any)=>({id:a.id,studentId:a.student_id,jobId:a.job_id,collegeId,companyId:a.company_id,appliedAt:a.applied_at,isEligible:true,aiMatchScore:0,skillMatchPercentage:0,skillGaps:[],tpoVerified:true,status:a.status==='INTERVIEW'?'INTERVIEW_SCHEDULED':a.status} as Application));
      this.state.drives=(drives.drives||[]).map((d:any)=>({id:d.id,collegeId,campusId:collegeId,companyId:d.company_id,jobId:d.job_id||'',driveName:d.drive_title,date:d.drive_date||'',startTime:d.time_slot||'',endTime:'',venue:d.campus_name||'',status:d.tpo_approval_status==='APPROVED'?'APPROVED':'PENDING_APPROVAL',rounds:[],panelistsCount:0,infrastructureCapacity:0,registeredCandidatesCount:d.target_candidate_count||0,shortlistedCandidatesCount:0,offersMadeCount:0,coordinatingTpoId:'user-tpo-apex'} as PlacementDrive));
      this.state.interviews=(interviews.interviews||[]).map((i:any)=>({id:i.id,collegeId,driveId:'',jobId:i.job_id||'',studentId:i.student_id||'',roundNumber:i.round_number||1,roundName:i.round_name||'Interview',scheduledTime:i.scheduled_time||'',venueOrRoom:i.meeting_link||i.mode||'',panelistName:i.interviewer_name||'',attendanceStatus:'SCHEDULED',resultStatus:i.decision==='CLEARED'?'CLEARED':i.decision==='REJECTED'?'REJECTED':'PENDING',feedbackNotes:i.notes||''} as Interview));
      this.state.offers=(offers.offers||[]).map((o:any)=>({id:o.id,collegeId,studentId:o.student_id,companyId:o.company_id,jobId:o.job_id||'',designation:o.role||o.jobTitle||'',ctcLPA:Number(o.total_ctc_lpa||o.fixed_ctc_lpa||0),offerDate:o.created_at,acceptanceDeadline:o.valid_until||'',status:o.status==='ISSUED'?'OFFERED':o.status,statusUpdatedAt:o.created_at,isDreamOffer:false,joiningDate:o.joining_date||'',joiningLocation:o.location||''} as Offer));
      this.state.documents=(documents.documents||[]).map((d:any)=>({id:d.id,collegeId:'inst-apex-01',studentId:d.studentId,documentType:(d.documentType||'RESUME').toUpperCase().replace(' ','_') as any,title:d.title,fileSize:'',fileUrl:d.fileUrl,uploadDate:d.uploadedAt,status:d.status==='Verified'?'VERIFIED':d.status==='Rejected'?'REJECTED':'PENDING',rejectionReason:d.rejectionReason} as PlacementDocument));
      const p=profile.profile;
      const current=this.state.users.find(u=>u.id===this.state.currentUserId);
      if(p&&current){current.name=p.name||current.name;current.email=p.email||current.email;current.avatar=p.avatarUrl||current.avatar;current.department=p.department||current.department;}
      this.state.auditLogs=(logs.logs||[]).map((l:any)=>({id:l.id,collegeId,userId:l.recruiter_id||'',userName:'CampusLink',userRole:'COLLEGE_TPO',action:'ADMIN_CONFIG_UPDATE',resourceType:l.entity_type||'Audit',resourceId:l.entity_id||'',details:l.details||'',ipAddress:'backend',timestamp:l.created_at} as AuditLog));
      this.save();
    } catch (error) { console.warn('TPO backend unavailable; retaining local development data', error); }
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
  public async updateTpoProfile(updates: {name?:string;email?:string;phone?:string;department?:string;bio?:string;avatarUrl?:string}) {
    const token = localStorage.getItem(TPO_TOKEN_KEY);
    if (!token) throw new Error('TPO session is not initialized');
    const res = await tpoFetch('/api/tpo/profile', {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(updates)});
    const data = await res.json();
    const p=data.profile;
    const user=this.state.users.find(u=>u.id===this.state.currentUserId);
    if(user&&p){user.name=p.name||user.name;user.email=p.email||user.email;user.avatar=p.avatarUrl||user.avatar;user.department=p.department||user.department;}
    this.save();
    return p;
  }

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
    void (async () => {
      try {
        const session = await fetch('/api/tpo/auth/dev-session', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({tpoId:userId,institutionId:user.institutionId||'campuslink'})
        });
        if (session.ok) {
          const data=await session.json();
          localStorage.setItem(TPO_TOKEN_KEY,data.token);
          await this.hydrateFromBackend();
        }
      } catch (error) { console.warn('TPO session switch sync failed', error); }
    })();
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
    // /api/tpo/jobs is already scoped by the authenticated TPO session.
    // Do not re-filter hydrated backend jobs against legacy demo institution IDs.
    if (this.state.jobs.length) return this.state.jobs;
    return [];
  }

  public async updateJobStatus(jobId: string, status: JobStatus, notes?: string) {
    const user = this.getCurrentUser();
    const job = this.state.jobs.find(j => j.id === jobId);
    if (!job) return;
    try {
      await tpoFetch('/api/tpo/jobs/' + encodeURIComponent(jobId) + '/status', {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status: status === 'APPROVED' ? 'ACTIVE' : status, notes})});
      await this.hydrateFromBackend();
      return;
    } catch {}
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

  public async verifyDocument(docId: string, status: VerificationStatus, reason?: string) {
    const user = this.getCurrentUser();
    const doc = this.state.documents.find(d => d.id === docId);
    if (doc) {
      doc.status = status;
      doc.verifiedByTpoId = user.id;
      doc.verifiedAt = new Date().toISOString();
      doc.rejectionReason = reason;

      try {
        await tpoFetch(`/api/tpo/documents/${docId}/verify`, {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status,reason})});
      } catch (error) {
        console.error('Document verification sync failed', error);
        return;
      }
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
