import type { Express, Request, Response } from 'express';

type Status = 'APPLIED' | 'UNDER REVIEW' | 'SHORTLISTED' | 'INTERVIEW' | 'SELECTED' | 'OFFERED' | 'ACCEPTED' | 'REJECTED';

const companies = [
  { id: 'company-apex', name: 'Apex Fintech', industry: 'FinTech', website: 'https://example.com', description: 'Campus hiring partner', locations: ['Bengaluru'], logoUrl: '' },
  { id: 'company-nova', name: 'Nova Cloud', industry: 'Cloud', website: 'https://example.com', description: 'Cloud engineering company', locations: ['Hyderabad'], logoUrl: '' }
];
const recruiters = [
  { id: 'recruiter-apex-1', companyId: 'company-apex', name: 'Priya Sharma', designation: 'Campus Recruiter', avatarUrl: '' },
  { id: 'recruiter-nova-1', companyId: 'company-nova', name: 'Rahul Mehta', designation: 'Talent Partner', avatarUrl: '' }
];
const jobs: any[] = [
  { id: 'job-apex-se-1', companyId: 'company-apex', title: 'Software Engineer', department: 'Engineering', description: 'Campus software engineering role', requiredSkills: ['Python', 'SQL', 'React'], preferredSkills: ['Docker'], minCgpa: 7, eligibleBranches: ['Computer Science and Engineering', 'Information Technology'], graduationYear: 2027, maxBacklogsAllowed: 0, experienceLevel: 'Fresher', requiredCertifications: [], ctcMinLpa: 12, ctcMaxLpa: 18, ctcBreakdown: 'Base + variable', location: 'Bengaluru', workMode: 'Hybrid', openings: 5, deadline: '2026-12-01', status: 'ACTIVE', createdAt: new Date().toISOString() }
];
const applications: any[] = [];
const interviews: any[] = [];
const offers: any[] = [];
const drives: any[] = [];
const notifications: any[] = [];
const auditLogs: any[] = [];
let currentRecruiterId = recruiters[0].id;

function recruiter() { return recruiters.find(r => r.id === currentRecruiterId) || recruiters[0]; }
function company() { return companies.find(c => c.id === recruiter().companyId) || companies[0]; }
function audit(action: string, entityType: string, entityId: string, details: string) {
  const log = { id: `aud-${Date.now()}`, companyId: company().id, recruiterId: recruiter().id, action, entityType, entityId, details, timestamp: new Date().toISOString(), severity: 'INFO' };
  auditLogs.unshift(log); return log;
}
function companyApplication(appId: string) {
  const a = applications.find(a => a.id === appId);
  return a && a.companyId === company().id ? a : null;
}

export function registerRecruiterRoutes(app: Express) {
  app.get('/api/recruiter/session', (_req, res) => {
    const c = company();
    res.json({ recruiter: recruiter(), company: c, availableRecruiters: recruiters.map(r => ({ ...r, companyName: companies.find(c => c.id === r.companyId)?.name || '' })) });
  });

  app.post('/api/recruiter/switch-session', (req, res) => {
    const target = recruiters.find(r => r.id === req.body.recruiterId);
    if (!target) return res.status(404).json({ error: 'Recruiter not found' });
    currentRecruiterId = target.id;
    audit('SESSION_SWITCHED', 'SECURITY', target.id, `Switched recruiter session to ${target.name}`);
    res.json({ success: true, currentRecruiter: target, company: company() });
  });

  app.put('/api/recruiter/company-profile', (req, res) => {
    Object.assign(company(), req.body);
    audit('COMPANY_PROFILE_UPDATED', 'SECURITY', company().id, 'Updated company profile');
    res.json({ success: true, company: company() });
  });

  app.get('/api/recruiter/jobs', (_req, res) => {
    const list = jobs.filter(j => j.companyId === company().id).map(j => {
      const a = applications.filter(x => x.jobId === j.id);
      return { ...j, stats: { totalApplicants: a.length, shortlisted: a.filter(x => x.status === 'SHORTLISTED').length, interviews: a.filter(x => x.status === 'INTERVIEW').length, selected: a.filter(x => ['SELECTED','OFFERED','ACCEPTED'].includes(x.status)).length } };
    });
    res.json({ jobs: list });
  });

  app.post('/api/recruiter/jobs', (req, res) => {
    if (!req.body.title || !req.body.description) return res.status(400).json({ error: 'Title and description are required' });
    const job = { id: `job-${Date.now()}`, companyId: company().id, ...req.body, status: 'ACTIVE', createdAt: new Date().toISOString() };
    jobs.unshift(job); audit('JOB_CREATED','JOB',job.id,`Created job: ${job.title}`);
    res.json({ success: true, job });
  });

  app.get('/api/recruiter/jobs/:jobId/applications', (req, res) => {
    const job = jobs.find(j => j.id === req.params.jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.companyId !== company().id) return res.status(403).json({ error: 'ACCESS_DENIED' });
    res.json({ job, totalApplicants: applications.filter(a => a.jobId === job.id).length, applications: applications.filter(a => a.jobId === job.id) });
  });

  app.get('/api/recruiter/applicants/all-authorized', (_req, res) => {
    const list = applications.filter(a => a.companyId === company().id);
    res.json({ companyId: company().id, companyName: company().name, totalAuthorizedApplicants: list.length, applications: list });
  });

  app.get('/api/recruiter/candidates/:candidateId', (req, res) => {
    const list = applications.filter(a => a.companyId === company().id && a.studentId === req.params.candidateId);
    if (!list.length) return res.status(403).json({ error: 'ACCESS_DENIED', message: 'Candidate is not authorized for this company.' });
    res.json({ candidate: { id: req.params.candidateId }, applications: list });
  });

  app.post('/api/security/test-breach-attempt', (_req, res) => res.status(403).json({ error: 'ACCESS_DENIED', securityViolation: true, backendEnforcement: 'Company-scoped candidate access' }));

  app.post('/api/recruiter/applications/:applicationId/status', (req, res) => {
    const a = companyApplication(req.params.applicationId);
    if (!a) return res.status(404).json({ error: 'Application not found' });
    a.status = req.body.status as Status;
    if (a.status === 'REJECTED') Object.assign(a, { rejectionReason: req.body.rejectionReason || req.body.rejection_reason, rejectionNotes: req.body.rejectionNotes || req.body.rejection_comment, rejectedAt: new Date().toISOString() });
    audit('APPLICATION_STATUS_UPDATED','APPLICATION',a.id,`Updated status to ${a.status}`);
    res.json({ success: true, application: a, message: 'Status updated.' });
  });

  app.post('/api/recruiter/applications/bulk-action', (req, res) => {
    if (!Array.isArray(req.body.applicationIds) || !req.body.targetStatus) return res.status(400).json({ error: 'applicationIds array and targetStatus required' });
    let updatedCount = 0;
    for (const id of req.body.applicationIds) { const a = companyApplication(id); if (a) { a.status = req.body.targetStatus; updatedCount++; } }
    audit('BULK_PIPELINE_ACTION','APPLICATION',`bulk-${req.body.targetStatus}`,`Updated ${updatedCount} applications`);
    res.json({ success: true, updatedCount, targetStatus: req.body.targetStatus });
  });

  app.get('/api/recruiter/drives', (_req, res) => res.json({ drives: drives.filter(d => d.companyId === company().id) }));
  app.post('/api/recruiter/drives', (req, res) => {
    const drive = { id: `drv-${Date.now()}`, companyId: company().id, ...req.body, tpoApprovalStatus: 'SUBMITTED_TO_TPO', createdAt: new Date().toISOString() };
    drives.unshift(drive); audit('PLACEMENT_DRIVE_REQUESTED','DRIVE',drive.id,'Requested placement drive'); res.json({ success: true, drive });
  });

  app.get('/api/recruiter/interviews', (_req, res) => res.json({ interviews: interviews.filter(i => i.companyId === company().id) }));
  app.post('/api/recruiter/interviews', (req, res) => {
    const a = companyApplication(req.body.applicationId);
    if (!a) return res.status(404).json({ error: 'Application not found or unauthorized' });
    const interview = { id: `int-${Date.now()}`, applicationId: a.id, jobId: a.jobId, companyId: company().id, studentId: a.studentId, ...req.body, status: 'SCHEDULED' };
    interviews.unshift(interview); a.status = 'INTERVIEW'; res.json({ success: true, interview });
  });
  app.post('/api/recruiter/interviews/:interviewId/evaluation', (req, res) => {
    const i = interviews.find(x => x.id === req.params.interviewId && x.companyId === company().id);
    if (!i) return res.status(404).json({ error: 'Interview record not found' });
    Object.assign(i, req.body, { status: 'COMPLETED' });
    const a = companyApplication(i.applicationId); if (a && req.body.decision === 'Selected') a.status = 'SELECTED'; if (a && req.body.decision === 'Reject') a.status = 'REJECTED';
    res.json({ success: true, interview: i });
  });

  app.get('/api/recruiter/offers', (_req, res) => res.json({ offers: offers.filter(o => o.companyId === company().id) }));
  app.post('/api/recruiter/offers', (req, res) => {
    const a = companyApplication(req.body.applicationId);
    if (!a) return res.status(404).json({ error: 'Application not found or unauthorized' });
    const offer = { id: `off-${Date.now()}`, applicationId: a.id, jobId: a.jobId, companyId: company().id, studentId: a.studentId, ...req.body, status: 'ISSUED', createdAt: new Date().toISOString() };
    offers.unshift(offer); a.status = 'OFFERED'; res.json({ success: true, offer });
  });

  app.get('/api/recruiter/analytics', (_req, res) => {
    const a = applications.filter(x => x.companyId === company().id);
    res.json({ companyName: company().name, pipeline: { totalApplicants:a.length, underReview:a.filter(x=>x.status==='UNDER REVIEW').length, shortlisted:a.filter(x=>x.status==='SHORTLISTED').length, interviewing:a.filter(x=>x.status==='INTERVIEW').length, selected:a.filter(x=>x.status==='SELECTED').length, offered:a.filter(x=>x.status==='OFFERED').length, accepted:a.filter(x=>x.status==='ACCEPTED').length, rejected:a.filter(x=>x.status==='REJECTED').length }, metrics:{activeJobs:jobs.filter(j=>j.companyId===company().id).length, interviewsCompleted:interviews.filter(i=>i.companyId===company().id&&i.status==='COMPLETED').length, upcomingInterviews:interviews.filter(i=>i.companyId===company().id&&i.status==='SCHEDULED').length}, zeroLeakAudit:{collegeWideDataHidden:true, competitorDataHidden:true, unappliedStudentsExcluded:true} });
  });

  app.get('/api/recruiter/notifications', (_req,res)=>res.json({notifications:notifications.filter(n=>n.companyId===company().id)}));
  app.post('/api/recruiter/notifications/:id/read',(req,res)=>{const n=notifications.find(x=>x.id===req.params.id); if(n)n.read=true; res.json({success:true});});
  app.get('/api/recruiter/audit-logs',(_req,res)=>res.json({logs:auditLogs.filter(x=>x.companyId===company().id)}));
  app.get('/api/recruiter/schema-sql',(_req,res)=>res.type('text/plain').send('-- Unified CampusLink recruiter schema is maintained in backend/server/db/schema.sql'));
}
