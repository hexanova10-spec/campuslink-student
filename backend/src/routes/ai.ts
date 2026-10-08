import type { Express } from 'express';

export function registerAiRoutes(app: Express) {
  app.get('/api/ai/health', (_req,res) => res.json({ ok:true, service:'campuslink-ai' }));
}
