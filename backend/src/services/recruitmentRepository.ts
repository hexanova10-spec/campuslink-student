import { query } from '../config/db.js';

export async function getCompany(companyId: string) {
  const r = await query('SELECT id, name, industry, website, description, locations, logo_url AS "logoUrl" FROM companies WHERE id=$1', [companyId]);
  return r.rows[0] || null;
}
export async function listCompanies() {
  const r = await query('SELECT id, name, industry, website, description, locations, logo_url AS "logoUrl" FROM companies ORDER BY name');
  return r.rows;
}
export async function updateCompany(companyId:string, patch:Record<string,unknown>) {
  const allowed=['name','industry','website','description','locations','logo_url'];
  const entries=Object.entries(patch).filter(([k])=>allowed.includes(k));
  if(!entries.length) return getCompany(companyId);
  const sets=entries.map(([k],i)=>`${k}=$${i+2}`).join(', ');
  const r=await query(`UPDATE companies SET ${sets} WHERE id=$1 RETURNING id,name,industry,website,description,locations,logo_url AS "logoUrl"`,[companyId,...entries.map(([,v])=>v)]);
  return r.rows[0]||null;
}
export async function listJobs(companyId:string) {
  const r=await query(`SELECT j.*, COALESCE(json_agg(ra) FILTER (WHERE ra.id IS NOT NULL),'[]') AS applications
    FROM jobs j LEFT JOIN recruitment_applications ra ON ra.job_id=j.id
    WHERE j.company_id=$1 GROUP BY j.id ORDER BY j.created_at DESC`,[companyId]);
  return r.rows.map((j:any)=>({...j,stats:{totalApplicants:j.applications.length,shortlisted:j.applications.filter((a:any)=>a.status==='SHORTLISTED').length,interviews:j.applications.filter((a:any)=>a.status==='INTERVIEW').length,selected:j.applications.filter((a:any)=>['SELECTED','OFFERED','ACCEPTED'].includes(a.status)).length}}));
}
export async function createJob(companyId:string,b:any) {
  const r=await query(`INSERT INTO jobs (id,company_id,title,department,description,responsibilities,required_skills,preferred_skills,min_cgpa,eligible_branches,graduation_year,max_backlogs_allowed,experience_level,required_certifications,ctc_min_lpa,ctc_max_lpa,ctc_breakdown,location,work_mode,openings,deadline,status)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,'ACTIVE') RETURNING *`,
    [b.id||`job-${Date.now()}`,companyId,b.title,b.department,b.description,b.responsibilities||[],b.requiredSkills||b.required_skills||[],b.preferredSkills||b.preferred_skills||[],b.minCgpa||null,b.eligibleBranches||b.eligible_branches||[],b.graduationYear||null,b.maxBacklogsAllowed||0,b.experienceLevel||'Fresher',b.requiredCertifications||[],b.ctcMinLpa||null,b.ctcMaxLpa||null,b.ctcBreakdown||null,b.location||null,b.workMode||null,b.openings||1,b.deadline||null]);
  return r.rows[0];
}
export async function getJobApplications(companyId:string,jobId:string) {
  const r=await query(`SELECT ra.*, s.full_name AS "studentName", s.branch, s.graduation_year AS "graduationYear"
    FROM recruitment_applications ra JOIN students s ON s.id=ra.student_id
    WHERE ra.company_id=$1 AND ra.job_id=$2 ORDER BY ra.applied_at DESC`,[companyId,jobId]);
  return r.rows;
}
export async function listApplications(companyId:string) {
  const r=await query(`SELECT ra.*, s.full_name AS "studentName", s.branch, s.graduation_year AS "graduationYear", j.title AS "jobTitle"
    FROM recruitment_applications ra JOIN students s ON s.id=ra.student_id JOIN jobs j ON j.id=ra.job_id
    WHERE ra.company_id=$1 ORDER BY ra.applied_at DESC`,[companyId]);
  return r.rows;
}
export async function getApplication(companyId:string,id:string) {
  const r=await query('SELECT * FROM recruitment_applications WHERE company_id=$1 AND id=$2',[companyId,id]); return r.rows[0]||null;
}
export async function updateApplication(companyId:string,id:string,b:any) {
  const r=await query(`UPDATE recruitment_applications SET status=$3,rejection_reason=$4,rejection_notes=$5,updated_at=CURRENT_TIMESTAMP WHERE company_id=$1 AND id=$2 RETURNING *`,[companyId,id,b.status,b.rejectionReason||b.rejection_reason||null,b.rejectionNotes||b.rejection_comment||null]); const a=r.rows[0];
  if (a && ['SHORTLISTED','REJECTED','SELECTED','OFFERED','ACCEPTED'].includes(a.status)) {
    await query(`INSERT INTO notifications_global (user_id,company_id,title,message,category,action_route) SELECT u.id,$2,$3,$4,'application','applications' FROM users u WHERE u.id=(SELECT user_id FROM students WHERE id=$1)`,[a.student_id,companyId,'Application status updated','Your application status is now '+a.status+'.']);
  }
  return a||null;
}
export async function createDrive(companyId:string,b:any) {
  const r=await query(`INSERT INTO placement_drives (company_id,job_id,drive_title,drive_date,time_slot,duration_hours,campus_name,interview_type,target_candidate_count,rounds,special_requirements)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,[companyId,b.jobId||null,b.driveTitle||b.driveName||'Placement Drive',b.date||b.driveDate||null,b.timeSlot||null,b.durationHours||null,b.campusName||null,b.interviewType||null,b.targetCandidateCount||null,b.rounds||[],b.specialRequirements||null]); return r.rows[0];
}
export async function listDrives(companyId:string){const r=await query('SELECT * FROM placement_drives WHERE company_id=$1 ORDER BY created_at DESC',[companyId]);return r.rows;}
export async function createInterview(companyId:string,b:any){
 const a=await getApplication(companyId,b.applicationId); if(!a)return null;
 const r=await query(`INSERT INTO recruitment_interviews (application_id,job_id,company_id,student_id,round_name,round_number,scheduled_time,duration_minutes,interviewer_name,mode,meeting_link)
 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,[a.id,a.job_id,companyId,a.student_id,b.roundName||b.round_name||'Interview',b.roundNumber||1,b.scheduledTime||null,b.durationMinutes||45,b.interviewerName||null,b.mode||null,b.meetingLink||null]); await query(`UPDATE recruitment_applications SET status='INTERVIEW',updated_at=CURRENT_TIMESTAMP WHERE id=$1`,[a.id]); return r.rows[0];
}
export async function listInterviews(companyId:string){const r=await query('SELECT * FROM recruitment_interviews WHERE company_id=$1 ORDER BY created_at DESC',[companyId]);return r.rows;}
export async function evaluateInterview(companyId:string,id:string,b:any){const r=await query(`UPDATE recruitment_interviews SET score=$3,notes=$4,decision=$5,ai_analysis=$6,status='COMPLETED' WHERE company_id=$1 AND id=$2 RETURNING *`,[companyId,id,b.score||null,b.notes||null,b.decision||null,b.aiAnalysis||null]); if(r.rows[0]?.application_id&&b.decision) await query(`UPDATE recruitment_applications SET status=$2,updated_at=CURRENT_TIMESTAMP WHERE id=$1`,[r.rows[0].application_id,b.decision==='Selected'?'SELECTED':b.decision==='Reject'?'REJECTED':'INTERVIEW']); return r.rows[0]||null;}
export async function createOffer(companyId:string,b:any){const a=await getApplication(companyId,b.applicationId);if(!a)return null;const r=await query(`INSERT INTO recruitment_offers (application_id,job_id,company_id,student_id,role,fixed_ctc_lpa,variable_ctc_lpa,joining_bonus_lpa,total_ctc_lpa,location,joining_date,valid_until,letter_text) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,[a.id,a.job_id,companyId,a.student_id,b.role||null,b.fixedCtcLpa||null,b.variableCtcLpa||null,b.joiningBonusLpa||null,b.totalCtcLpa||null,b.location||null,b.joiningDate||null,b.validUntil||null,b.letterText||null]);await query(`UPDATE recruitment_applications SET status='OFFERED',updated_at=CURRENT_TIMESTAMP WHERE id=$1`,[a.id]);return r.rows[0];}
export async function listOffers(companyId:string){const r=await query('SELECT * FROM recruitment_offers WHERE company_id=$1 ORDER BY created_at DESC',[companyId]);return r.rows;}
export async function listNotifications(companyId:string){const r=await query('SELECT * FROM notifications_global WHERE company_id=$1 ORDER BY created_at DESC',[companyId]);return r.rows;}
export async function markNotificationRead(companyId:string,id:string){const r=await query('UPDATE notifications_global SET is_read=true WHERE company_id=$1 AND id=$2 RETURNING *',[companyId,id]);return r.rows[0]||null;}
export async function listAuditLogs(companyId:string){const r=await query('SELECT * FROM audit_logs WHERE company_id=$1 ORDER BY created_at DESC',[companyId]);return r.rows;}
export async function analytics(companyId:string){const r=await query(`SELECT status,count(*)::int AS count FROM recruitment_applications WHERE company_id=$1 GROUP BY status`,[companyId]);const j=await query('SELECT count(*)::int AS count FROM jobs WHERE company_id=$1 AND status=\'ACTIVE\'',[companyId]);const i=await query(`SELECT count(*) FILTER (WHERE status='COMPLETED')::int AS completed,count(*) FILTER (WHERE status='SCHEDULED')::int AS upcoming FROM recruitment_interviews WHERE company_id=$1`,[companyId]);return {pipeline:Object.fromEntries(r.rows.map((x:any)=>[x.status,x.count])),metrics:{activeJobs:j.rows[0].count,interviewsCompleted:i.rows[0].completed,upcomingInterviews:i.rows[0].upcoming}};}


export async function createStudentApplication(studentId:string, jobId:string) {
  const job = await query(`SELECT j.*, c.name AS company_name FROM jobs j JOIN companies c ON c.id=j.company_id WHERE j.id=$1 AND j.status='ACTIVE'`,[jobId]);
  if (!job.rows[0]) return { error: 'JOB_NOT_FOUND' as const };
  const j:any = job.rows[0];
  const student = await query(`SELECT s.*, sa.cgpa, sa.active_backlogs FROM students s LEFT JOIN student_academics sa ON sa.student_id=s.id WHERE s.id=$1`,[studentId]);
  if (!student.rows[0]) return { error: 'STUDENT_NOT_FOUND' as const };
  const s:any=student.rows[0];
  if (j.min_cgpa != null && Number(s.cgpa||0) < Number(j.min_cgpa)) return { error:'INELIGIBLE_CGPA' as const, required:Number(j.min_cgpa), actual:Number(s.cgpa||0) };
  if (j.max_backlogs_allowed != null && Number(s.active_backlogs||0) > Number(j.max_backlogs_allowed)) return { error:'INELIGIBLE_BACKLOGS' as const };
  if (Array.isArray(j.eligible_branches) && j.eligible_branches.length && !j.eligible_branches.includes(s.branch)) return { error:'INELIGIBLE_BRANCH' as const };
  if (j.graduation_year != null && Number(s.graduation_year) !== Number(j.graduation_year)) return { error:'INELIGIBLE_GRADUATION_YEAR' as const };
  try {
    const r=await query(`INSERT INTO recruitment_applications (student_id,job_id,company_id,status) VALUES ($1,$2,$3,'APPLIED') RETURNING *`,[studentId,j.id,j.company_id]);
    return { application:r.rows[0], job:j };
  } catch(e:any) {
    if(e?.code==='23505') return { error:'ALREADY_APPLIED' as const };
    throw e;
  }
}
export async function listStudentApplications(studentId:string) {
  const r=await query(`SELECT ra.*, c.name AS company_name, j.title AS role_title, j.ctc_min_lpa, j.ctc_max_lpa, j.location, j.status AS job_status FROM recruitment_applications ra JOIN companies c ON c.id=ra.company_id JOIN jobs j ON j.id=ra.job_id WHERE ra.student_id=$1 ORDER BY ra.applied_at DESC`,[studentId]);
  return r.rows;
}
export async function withdrawStudentApplication(studentId:string,id:string) {
  const r=await query(`DELETE FROM recruitment_applications WHERE id=$1 AND student_id=$2 AND status IN ('APPLIED','UNDER_REVIEW','SHORTLISTED') RETURNING *`,[id,studentId]);
  return r.rows[0]||null;
}

export async function studentInterviews(studentId:string){ return (await query(`SELECT ri.*,c.name AS company_name,j.title AS role_title FROM recruitment_interviews ri JOIN companies c ON c.id=ri.company_id LEFT JOIN jobs j ON j.id=ri.job_id WHERE ri.student_id=$1 ORDER BY ri.scheduled_time ASC NULLS LAST`,[studentId])).rows; }
export async function studentOffers(studentId:string){ return (await query(`SELECT ro.*,c.name AS company_name,j.title AS job_title FROM recruitment_offers ro JOIN companies c ON c.id=ro.company_id LEFT JOIN jobs j ON j.id=ro.job_id WHERE ro.student_id=$1 ORDER BY ro.created_at DESC`,[studentId])).rows; }
export async function studentNotifications(studentId:string){ return (await query(`SELECT ng.* FROM notifications_global ng JOIN users u ON u.id=ng.user_id JOIN students s ON s.user_id=u.id WHERE s.id=$1 ORDER BY ng.created_at DESC`,[studentId])).rows; }
