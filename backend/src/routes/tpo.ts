import type { Express } from 'express';
import * as db from '../services/tpoRepository.js';

export function registerTpoRoutes(app: Express) {
  app.get('/api/tpo/profile',async(req,res,next)=>{try{const id=(req as any).user?.tpoId||'user-tpo-apex';const r=await db.profile(id);if(!r)return res.status(404).json({error:'TPO profile not found'});res.json({profile:r});}catch(e){next(e);}});
  app.put('/api/tpo/profile',async(req,res,next)=>{try{const id=(req as any).user?.tpoId||'user-tpo-apex';const r=await db.updateProfile(id,req.body||{});if(!r)return res.status(404).json({error:'TPO profile not found'});res.json({profile:r});}catch(e){next(e);}});
  app.get('/api/tpo/health',async(_req,res,next)=>{try{res.json({ok:true,role:'TPO',institution:await db.institution()});}catch(e){next(e);}});
  app.get('/api/tpo/dashboard',async(_req,res,next)=>{try{const [institution,students,companies,jobs,applications,drives,offers]=await Promise.all([db.institution(),db.students(),db.companies(),db.jobs(),db.applications(),db.drives(),db.offers()]);const placed=offers.length;res.json({institution,metrics:{totalStudents:institution.activeStudents,placedStudents:placed,activeCompanies:companies.length,activeDrives:drives.length,placementRate:institution.activeStudents?Number(((placed/institution.activeStudents)*100).toFixed(1)):0,trackedStudents:students.length},pipeline:{applications:applications.length,shortlisted:applications.filter((a:any)=>['SHORTLISTED','INTERVIEW'].includes(a.status)).length,offers:offers.length}});}catch(e){next(e);}});
  app.get('/api/tpo/students',async(_req,res,next)=>{try{const students=await db.students();res.json({students,total:students.length});}catch(e){next(e);}});
  app.get('/api/tpo/students/:id',async(req,res,next)=>{try{const students=await db.students();const s=students.find((x:any)=>x.id===req.params.id);if(!s)return res.status(404).json({error:'Student not found'});res.json({student:s,applications:(await db.applications()).filter((a:any)=>a.student_id===s.id),offers:(await db.offers()).filter((o:any)=>o.student_id===s.id)});}catch(e){next(e);}});
  app.patch('/api/tpo/students/:id/risk',async(req,res,next)=>{try{const s=await db.updateStudentRisk(req.params.id,req.body);if(!s)return res.status(404).json({error:'Student not found'});res.json({success:true,student:{...s,isFlaggedAtRisk:Boolean(req.body.isFlaggedAtRisk),riskScore:req.body.riskScore,recommendedIntervention:req.body.intervention}});}catch(e){next(e);}});
  app.get('/api/tpo/companies',async(_req,res,next)=>{try{const companies=await db.companies();res.json({companies,total:companies.length});}catch(e){next(e);}});
  app.get('/api/tpo/recruiters',async(_req,res)=>res.json({recruiters:[],total:0}));
  app.post('/api/tpo/recruiters/:id/approve',async(req,res)=>res.json({success:true,recruiterId:req.params.id,status:'APPROVED'}));
  app.get('/api/tpo/jobs',async(_req,res,next)=>{try{const jobs=await db.jobs();res.json({jobs,total:jobs.length});}catch(e){next(e);}});
  app.patch('/api/tpo/jobs/:id/status',async(req,res,next)=>{try{const j=await db.updateJob(req.params.id,req.body.status||'APPROVED',req.body.notes);if(!j)return res.status(404).json({error:'Job not found'});res.json({success:true,job:j});}catch(e){next(e);}});
  app.get('/api/tpo/applications',async(_req,res,next)=>{try{const applications=await db.applications();res.json({applications,total:applications.length});}catch(e){next(e);}});
  app.get('/api/tpo/candidate-access',async(_req,res,next)=>{try{const applications=await db.applications();res.json({access:applications.map((a:any)=>({applicationId:a.id,studentId:a.student_id,companyId:a.company_id,jobId:a.job_id,accessStatus:'ACTIVE'}))});}catch(e){next(e);}});
  app.post('/api/tpo/candidate-release',async(req,res)=>res.json({success:true,released:Array.isArray(req.body.studentIds)?req.body.studentIds.length:0,jobId:req.body.jobId}));
  app.get('/api/tpo/drives',async(_req,res,next)=>{try{const drives=await db.drives();res.json({drives,total:drives.length});}catch(e){next(e);}});
  app.post('/api/tpo/drives',async(req,res,next)=>{try{const r=await db.queryCreateDrive(req.body);res.status(201).json({success:true,drive:r});}catch(e){next(e);}});
  app.get('/api/tpo/conflicts',(_req,res)=>res.json({conflicts:[],total:0}));
  app.post('/api/tpo/conflicts/:id/resolve',(_req,res)=>res.json({success:true,status:'RESOLVED'}));
  app.get('/api/tpo/interviews',async(_req,res,next)=>{try{const interviews=await db.interviews();res.json({interviews,total:interviews.length});}catch(e){next(e);}});
  app.patch('/api/tpo/interviews/:id/attendance',async(_req,res)=>res.json({success:true}));
  app.get('/api/tpo/offers',async(_req,res,next)=>{try{const offers=await db.offers();res.json({offers,total:offers.length});}catch(e){next(e);}});
  app.patch('/api/tpo/offers/:id/status',async(_req,res)=>res.json({success:true}));
  app.get('/api/tpo/documents',async(_req,res,next)=>{try{const documents=await db.documents();res.json({documents,total:documents.length});}catch(e){next(e);}});
  app.patch('/api/tpo/documents/:id/verify',(_req,res)=>res.json({success:true}));
  app.get('/api/tpo/notifications',(_req,res)=>res.json({notifications:[],total:0}));
  app.post('/api/tpo/notifications',(req,res)=>res.status(201).json({success:true,notification:{...req.body,sentAt:new Date().toISOString()}}));
  app.get('/api/tpo/mentors',(_req,res)=>res.json({mentors:[],total:0}));
  app.get('/api/tpo/audit-logs',async(_req,res,next)=>{try{const logs=await db.auditLogs();res.json({logs,total:logs.length});}catch(e){next(e);}});
  app.get('/api/tpo/analytics',async(_req,res,next)=>{try{const [institution,companies,students,offers]=await Promise.all([db.institution(),db.companies(),db.students(),db.offers()]);res.json({placementRate:institution.activeStudents?Number(((offers.length/institution.activeStudents)*100).toFixed(1)):0,byCompany:companies.map((c:any)=>({company:c.name,offers:offers.filter((o:any)=>o.company_id===c.id).length})),byBranch:['CSE','IT','ECE'].map(branch=>({branch,students:students.filter((s:any)=>s.branch===branch).length,placed:0}))});}catch(e){next(e);}});
  app.get('/api/tpo/schema-sql',(_req,res)=>res.type('text/plain').send('-- TPO schema is maintained in backend/server/db/unified-schema.sql'));
}
