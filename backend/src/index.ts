import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { app } from '../server.js';
import { databaseHealth } from './config/db.js';
import { registerRecruiterRoutes } from './routes/recruiter.js';
import { registerTpoRoutes } from './routes/tpo.js';
import { registerAiRoutes } from './routes/ai.js';
import { authenticate } from './middleware/auth.js';
import { requireRole } from './middleware/role.js';

dotenv.config();

// Development-only session bootstraps. Production authentication must come from the real identity provider.
if (process.env.NODE_ENV !== 'production') {
  app.post('/api/tpo/auth/dev-session', (req, res) => {
    const tpoId = req.body?.tpoId || 'user-tpo-apex';
    const institutionId = req.body?.institutionId || 'campuslink';
    const token = jwt.sign(
      { userId: tpoId, tpoId, institutionId, email: `${tpoId}@campuslink.local`, role: 'TPO' },
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
