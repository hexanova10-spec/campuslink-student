-- Development seed for the shared recruiter/TPO domain.
-- Run after schema.sql and unified-schema.sql.
INSERT INTO companies (id,name,industry,website,description,locations)
VALUES
('company-apex','Apex Fintech','FinTech','https://example.com','Campus hiring partner',ARRAY['Bengaluru']),
('company-nova','Nova Cloud','Cloud','https://example.com','Cloud engineering company',ARRAY['Hyderabad'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO recruiters (id,company_id,name,designation)
VALUES
('recruiter-apex-1','company-apex','Priya Sharma','Campus Recruiter'),
('recruiter-nova-1','company-nova','Rahul Mehta','Talent Partner')
ON CONFLICT (id) DO NOTHING;

INSERT INTO jobs (id,company_id,title,department,description,required_skills,preferred_skills,min_cgpa,eligible_branches,graduation_year,max_backlogs_allowed,experience_level,openings,status,location,work_mode)
VALUES
('job-apex-se-1','company-apex','Software Engineer','Engineering','Campus software engineering role',ARRAY['Python','SQL','React'],ARRAY['Docker'],7,ARRAY['Computer Science and Engineering','Information Technology'],2027,0,'Fresher',5,'ACTIVE','Bengaluru','Hybrid')
ON CONFLICT (id) DO NOTHING;
