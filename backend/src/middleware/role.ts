import type { NextFunction, Response } from 'express';
import type { AuthenticatedRequest, CampusRole } from './auth';

export function requireRole(...roles: CampusRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden', requiredRoles: roles });
    }
    next();
  };
}
