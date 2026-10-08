import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { app } from '../server.js';
import { databaseHealth, query } from './config/db.js';
import { registerRecruiterRoutes } from './routes/recruiter.js';
import { registerTpoRoutes } from './routes/tpo.js';
import { registerAiRoutes } from './routes/ai.js';
import { authenticate } from './middleware/auth.js';
import { requireRole } from './middleware/role.js';

dotenv.config();

// Development-only session bootstraps. Production authentication must come from the real identity provider.
if (process.env.NODE_ENV !== 'production') {
  app.post('/api/tpo/auth/dev-session', async (req, res) => {
    const tpoId = req.body?.tpoId || 'user-tpo-apex';
    const institutionId = req.body?.institutionId || 'campuslink';
    const profile = tpoId === 'user-tpo-metro'
      ? { name: 'Sisira Kanta Padhi', email: 'tpo2@campuslink.local', phone: '+91 98765 10002', department: 'Training & Placement' }
      : tpoId === 'user-sysadmin'
        ? { name: 'Ronali Mohanty', email: 'admin@campuslink.local', phone: '+91 98765 10003', department: 'Platform Operations' }
        : { name: 'Mrutyunjya Dash', email: 'tpo@campuslink.local', phone: '+91 98765 10001', department: 'Placement & Career Services' };
    try {
      await query('INSERT INTO tpo_users (id,institution_id,name,email,phone,department) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name,email=EXCLUDED.email,phone=EXCLUDED.phone,department=EXCLUDED.department,updated_at=CURRENT_TIMESTAMP',
        [tpoId,institutionId,profile.name,profile.email,profile.phone,profile.department]);
    } catch (error) {
      console.warn('[CampusLink DB] TPO profile bootstrap skipped:', error instanceof Error ? error.message : error);
    }
    const token = jwt.sign(
      { userId: tpoId, tpoId, institutionId, ...profile, role: 'TPO' },
      process.env.JWT_SECRET || 'campuslink-student-jwt-secret-2026',
      { expiresIn: '8h' }
    );
    res.json({ token, tpoId, institutionId });
  });

  app.post('/api/recruiter/auth/dev-session', (req, res) => {
    const recruiterId = req.body?.recruiterId || 'recruiter-apex-1';
    const companyId = req.body?.companyId || (recruiterId === 'recruiter-nova-1' ? 'company-nova' : 'company-apex');
    const token = jwt.sign(
      { userId: recruiterId, recruiterId, companyId, email: `${recruiterId}@campuslink.local`, name: 'Rajashree Sahoo', role: 'RECRUITER' },
      process.env.JWT_SECRET || 'campuslink-student-jwt-secret-2026',
      { expiresIn: '8h' }
    );
    res.json({ token, recruiterId, companyId });
  });
}

app.use('/api/recruiter', authenticate, requireRole('RECRUITER'));
app.use('/api/tpo', authenticate, requireRole('TPO'));
registerRecruiterRoutes(app);
registerTpoRoutes(app);
registerAiRoutes(app);

const PORT = Number(process.env.PORT || 5000);

app.get('/api/system/health', async (_req, res) => {
  const database = await databaseHealth();
  res.json({ ok: true, service: 'campuslink-backend', database, roles: ['STUDENT', 'RECRUITER', 'TPO'], port: PORT, timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[CampusLink Backend] Unified API active on port ${PORT}`);
});
