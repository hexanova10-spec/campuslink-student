import type { Express } from 'express';

const institution = { id:'inst-apex-01', name:'Apex Institute of Technology', code:'AIT-PUN', city:'Pune', state:'Maharashtra', activeStudents:840, totalPlaced:628, averagePackageLPA:12.4, highestPackageLPA:54 };
const students:any[] = [
  { id:'stu-001', collegeId:institution.id, rollNumber:'2023-CSE-001', fullName:'Aarav Singhania', branch:'CSE', cgpa:9.42, readinessLevel:'HIGHLY_EMPLOYABLE', placementStatus:'OFFERED', isFlaggedAtRisk:false, placedCompany:'Google LLC', placedPackageLPA:54 },
  { id:'stu-002', collegeId:institution.id, rollNumber:'2023-CSE-014', fullName:'Diya Krishnan', branch:'CSE', cgpa:8.95, readinessLevel:'PLACEMENT_READY', placementStatus:'INTERVIEWING', isFlaggedAtRisk:false },
  { id:'stu-004', collegeId:institution.id, rollNumber:'2023-CSE-088', fullName:'Kavya Murthy', branch:'CSE', cgpa:6.82, readinessLevel:'AT_RISK', placementStatus:'UNPLACED', isFlaggedAtRisk:true, riskScore:78.4 },
  { id:'stu-005', collegeId:institution.id, rollNumber:'2023-ECE-041', fullName:'Harsh Vardhan', branch:'ECE', cgpa:6.4, readinessLevel:'AT_RISK', placementStatus:'UNPLACED', isFlaggedAtRisk:true, riskScore:84 },
  { id:'stu-006', collegeId:institution.id, rollNumber:'2023-IT-018', fullName:'Tanvi Agarwal', branch:'IT', cgpa:8.74, readinessLevel:'PLACEMENT_READY', placementStatus:'PLACED', placedCompany:'Deloitte USI', placedPackageLPA:12 }
];
const companies:any[] = [
  { id:'comp-google', name:'Google LLC', industry:'Cloud & Consumer Internet', tier:'TIER_1_SUPER_DREAM', status:'APPROVED', averagePackageLPA:42, highestPackageLPA:54 },
  { id:'comp-msft', name:'Microsoft Corp', industry:'Enterprise Software & Cloud', tier:'TIER_1_SUPER_DREAM', status:'APPROVED', averagePackageLPA:38.5, highestPackageLPA:50 },
  { id:'comp-deloitte', name:'Deloitte USI', industry:'Consulting & Technology Advisory', tier:'TIER_2_DREAM', status:'APPROVED', averagePackageLPA:11.5, highestPackageLPA:16 },
  { id:'comp-oracle', name:'Oracle Systems', industry:'Database & Cloud Applications', tier:'TIER_1_SUPER_DREAM', status:'APPROVED', averagePackageLPA:24, highestPackageLPA:32 }
];
const jobs:any[] = [
  { id:'job-goog-sde', companyId:'comp-google', collegeId:institution.id, title:'Software Development Engineer - Campus 2027', ctcLPA:42.5, status:'APPROVED', totalApplied:42, totalShortlisted:14, totalOffered:2 },
  { id:'job-msft-swe', companyId:'comp-msft', collegeId:institution.id, title:'Software Engineer - Azure Core', ctcLPA:38, status:'APPROVED', totalApplied:56, totalShortlisted:18, totalOffered:4 },
  { id:'job-oracle-dev', companyId:'comp-oracle', collegeId:institution.id, title:'Member of Technical Staff - Oracle Cloud Infrastructure', ctcLPA:24, status:'PENDING_TPO_REVIEW', totalApplied:38, totalShortlisted:0, totalOffered:0 },
  { id:'job-deloitte-consultant', companyId:'comp-deloitte', collegeId:institution.id, title:'Analyst - Technology Consulting (Cloud & AI)', ctcLPA:11.5, status:'APPROVED', totalApplied:180, totalShortlisted:45, totalOffered:16 }
];
const applications:any[] = [
  { id:'app-001', studentId:'stu-001', jobId:'job-goog-sde', companyId:'comp-google', collegeId:institution.id, isEligible:true, aiMatchScore:96, skillMatchPercentage:94, tpoVerified:true, status:'OFFERED' },
  { id:'app-002', studentId:'stu-002', jobId:'job-goog-sde', companyId:'comp-google', collegeId:institution.id, isEligible:true, aiMatchScore:84, skillMatchPercentage:78, tpoVerified:true, status:'INTERVIEW_SCHEDULED' },
  { id:'app-004', studentId:'stu-004', jobId:'job-goog-sde', companyId:'comp-google', collegeId:institution.id, isEligible:false, aiMatchScore:28, skillMatchPercentage:30, tpoVerified:true, status:'REJECTED' },
  { id:'app-006', studentId:'stu-006', jobId:'job-deloitte-consultant', companyId:'comp-deloitte', collegeId:institution.id, isEligible:true, aiMatchScore:92, skillMatchPercentage:95, tpoVerified:true, status:'OFFERED' }
];
const drives:any[] = [
  { id:'drv-goog-01', companyId:'comp-google', jobId:'job-goog-sde', driveName:'Google Campus On-Site Drive 2026', date:'2026-10-18', status:'SCHEDULED', registeredCandidatesCount:42, shortlistedCandidatesCount:14, offersMadeCount:2 },
  { id:'drv-msft-02', companyId:'comp-msft', jobId:'job-msft-swe', driveName:'Microsoft Azure Campus Drive', date:'2026-10-18', status:'SCHEDULED', registeredCandidatesCount:56, shortlistedCandidatesCount:18, offersMadeCount:4 },
  { id:'drv-deloitte-03', companyId:'comp-deloitte', jobId:'job-deloitte-consultant', driveName:'Deloitte USI Consulting Mega Drive', date:'2026-10-10', status:'COMPLETED', registeredCandidatesCount:180, shortlistedCandidatesCount:45, offersMadeCount:16 }
];
const conflicts:any[] = [{ id:'conf-001', severity:'HIGH', title:'Main Auditorium Simultaneous Booking', status:'UNRESOLVED', affectedDrives:['drv-goog-01','drv-msft-02'] }];
const interviews:any[] = [
  { id:'int-001', driveId:'drv-goog-01', jobId:'job-goog-sde', studentId:'stu-001', roundNumber:2, roundName:'System Architecture & Algorithmic Scalability', attendanceStatus:'PRESENT', resultStatus:'CLEARED' },
  { id:'int-002', driveId:'drv-goog-01', jobId:'job-goog-sde', studentId:'stu-002', roundNumber:1, roundName:'Technical Round 1', attendanceStatus:'SCHEDULED', resultStatus:'PENDING' }
];
const offers:any[] = [
  { id:'off-001', studentId:'stu-001', companyId:'comp-google', jobId:'job-goog-sde', designation:'Software Development Engineer I', ctcLPA:54, status:'OFFERED' },
  { id:'off-002', studentId:'stu-006', companyId:'comp-deloitte', jobId:'job-deloitte-consultant', designation:'Analyst - Cloud & AI Consulting', ctcLPA:12, status:'ACCEPTED' }
];
const documents:any[] = [
  { id:'doc-001', studentId:'stu-001', title:'Google SDE Official Offer Letter & Annexure', status:'VERIFIED' },
  { id:'doc-002', studentId:'stu-004', title:'Semester 5 Consolidated Marksheet', status:'REJECTED' },
  { id:'doc-003', studentId:'stu-002', title:'Institutional Placement Bonafide & NOC Certificate', status:'PENDING' }
];
const auditLogs:any[] = [];
const notifications:any[] = [];
const mentors:any[] = [
  { id:'men-1', fullName:'Prof. Arvind Kulkarni', department:'Computer Science & Eng', assignedStudentIds:['stu-004','stu-007','stu-010'], successRate:88.5 },
  { id:'men-2', fullName:'Dr. Meenakshi Sundaram', department:'Electronics & Comm', assignedStudentIds:['stu-005','stu-009'], successRate:92 }
];

export function registerTpoRoutes(app: Express) {
  const scoped = <T extends { collegeId?: string }>(items:T[]) => items.filter(x => !x.collegeId || x.collegeId === institution.id);

  app.get('/api/tpo/health', (_req,res) => res.json({ ok:true, role:'TPO', institution }));
  app.get('/api/tpo/dashboard', (_req,res) => {
    const placed = students.filter(s=>s.placementStatus==='PLACED' || s.placementStatus==='OFFERED').length;
    res.json({ institution, metrics:{ totalStudents:institution.activeStudents, placedStudents:institution.totalPlaced, activeCompanies:companies.length, activeDrives:drives.filter(d=>d.status==='SCHEDULED').length, placementRate:Number(((institution.totalPlaced/institution.activeStudents)*100).toFixed(1)), trackedStudents:students.length, localPlaced:placed }, pipeline:{applications:applications.length, shortlisted:applications.filter(a=>['SHORTLISTED','INTERVIEW_SCHEDULED','OFFERED'].includes(a.status)).length, offers:offers.length} });
  });
  app.get('/api/tpo/students', (_req,res)=>res.json({ students:scoped(students), total:students.length }));
  app.get('/api/tpo/students/:id', (req,res)=>{const s=students.find(x=>x.id===req.params.id); if(!s)return res.status(404).json({error:'Student not found'}); res.json({student:s, applications:applications.filter(a=>a.studentId===s.id), offers:offers.filter(o=>o.studentId===s.id)});});
  app.patch('/api/tpo/students/:id/risk', (req,res)=>{const s=students.find(x=>x.id===req.params.id);if(!s)return res.status(404).json({error:'Student not found'});Object.assign(s,{isFlaggedAtRisk:Boolean(req.body.isFlaggedAtRisk),riskScore:req.body.riskScore,recommendedIntervention:req.body.intervention});res.json({success:true,student:s});});
  app.get('/api/tpo/companies', (_req,res)=>res.json({companies,total:companies.length}));
  app.get('/api/tpo/recruiters', (_req,res)=>res.json({recruiters:[],total:0}));
  app.post('/api/tpo/recruiters/:id/approve', (req,res)=>res.json({success:true,recruiterId:req.params.id,status:'APPROVED'}));
  app.get('/api/tpo/jobs', (_req,res)=>res.json({jobs:scoped(jobs),total:jobs.length}));
  app.patch('/api/tpo/jobs/:id/status', (req,res)=>{const j=jobs.find(x=>x.id===req.params.id);if(!j)return res.status(404).json({error:'Job not found'});j.status=req.body.status||j.status;j.reviewNotes=req.body.notes;res.json({success:true,job:j});});
  app.get('/api/tpo/applications', (_req,res)=>res.json({applications:scoped(applications),total:applications.length}));
  app.get('/api/tpo/candidate-access', (_req,res)=>res.json({access:applications.map(a=>({applicationId:a.id,studentId:a.studentId,companyId:a.companyId,jobId:a.jobId,accessStatus:a.tpoVerified?'ACTIVE':'PENDING'}))}));
  app.post('/api/tpo/candidate-release', (req,res)=>res.json({success:true,released: req.body.studentIds?.length || 0, jobId:req.body.jobId}));
  app.get('/api/tpo/drives', (_req,res)=>res.json({drives,total:drives.length}));
  app.post('/api/tpo/drives', (req,res)=>{const d={id:`drv-${Date.now()}`,...req.body,status:req.body.status||'SCHEDULED'};drives.push(d);res.status(201).json({success:true,drive:d});});
  app.get('/api/tpo/conflicts', (_req,res)=>res.json({conflicts,total:conflicts.length}));
  app.post('/api/tpo/conflicts/:id/resolve', (req,res)=>{const c=conflicts.find(x=>x.id===req.params.id);if(!c)return res.status(404).json({error:'Conflict not found'});c.status='RESOLVED';c.resolutionNote=req.body.note;res.json({success:true,conflict:c});});
  app.get('/api/tpo/interviews', (_req,res)=>res.json({interviews,total:interviews.length}));
  app.patch('/api/tpo/interviews/:id/attendance', (req,res)=>{const i=interviews.find(x=>x.id===req.params.id);if(!i)return res.status(404).json({error:'Interview not found'});Object.assign(i,{attendanceStatus:req.body.attendance,resultStatus:req.body.result||i.resultStatus});res.json({success:true,interview:i});});
  app.get('/api/tpo/offers', (_req,res)=>res.json({offers,total:offers.length}));
  app.patch('/api/tpo/offers/:id/status', (req,res)=>{const o=offers.find(x=>x.id===req.params.id);if(!o)return res.status(404).json({error:'Offer not found'});o.status=req.body.status||o.status;res.json({success:true,offer:o});});
  app.get('/api/tpo/documents', (_req,res)=>res.json({documents,total:documents.length}));
  app.patch('/api/tpo/documents/:id/verify', (req,res)=>{const d=documents.find(x=>x.id===req.params.id);if(!d)return res.status(404).json({error:'Document not found'});d.status=req.body.status||d.status;d.rejectionReason=req.body.reason;res.json({success:true,document:d});});
  app.get('/api/tpo/notifications', (_req,res)=>res.json({notifications,total:notifications.length}));
  app.post('/api/tpo/notifications', (req,res)=>{const n={id:`notif-${Date.now()}`,...req.body,sentAt:new Date().toISOString(),deliveryRate:99.2};notifications.unshift(n);res.status(201).json({success:true,notification:n});});
  app.get('/api/tpo/mentors', (_req,res)=>res.json({mentors,total:mentors.length}));
  app.get('/api/tpo/audit-logs', (_req,res)=>res.json({logs:auditLogs,total:auditLogs.length}));
  app.get('/api/tpo/analytics', (_req,res)=>res.json({placementRate:Number(((institution.totalPlaced/institution.activeStudents)*100).toFixed(1)),byCompany:companies.map(c=>({company:c.name,offers:offers.filter(o=>o.companyId===c.id).length})),byBranch:['CSE','IT','ECE'].map(branch=>({branch,students:students.filter(s=>s.branch===branch).length,placed:students.filter(s=>s.branch===branch&&['PLACED','OFFERED'].includes(s.placementStatus)).length}))}));
  app.get('/api/tpo/schema-sql',(_req,res)=>res.type('text/plain').send('-- TPO schema is maintained in backend/server/db/unified-schema.sql'));
}
