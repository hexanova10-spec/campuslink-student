import type { Express } from 'express';

export function registerTpoRoutes(app: Express) {
  app.get('/api/tpo/health', (_req,res) => res.json({ ok:true, role:'TPO' }));
  app.get('/api/tpo/dashboard', (_req,res) => res.json({ metrics:{ totalStudents:0, placedStudents:0, activeCompanies:0, activeDrives:0, placementRate:0 }, pipeline:[] }));
  app.get('/api/tpo/students', (_req,res) => res.json({ students:[], total:0 }));
  app.get('/api/tpo/companies', (_req,res) => res.json({ companies:[], total:0 }));
  app.get('/api/tpo/drives', (_req,res) => res.json({ drives:[], total:0 }));
  app.get('/api/tpo/applications', (_req,res) => res.json({ applications:[], total:0 }));
  app.get('/api/tpo/analytics', (_req,res) => res.json({ placementRate:0, byCompany:[], byBranch:[] }));
}
