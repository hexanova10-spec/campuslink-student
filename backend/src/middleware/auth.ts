import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
import type { NextFunction, Request, Response } from 'express';

export type CampusRole = 'STUDENT' | 'RECRUITER' | 'TPO';

export interface CampusUser {
  userId: string;
  email: string;
  role: CampusRole;
  studentId?: string;
  recruiterId?: string;
  tpoId?: string;
  companyId?: string;
  institutionId?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: CampusUser;
}

const JWT_SECRET = process.env.JWT_SECRET || 'campuslink-student-jwt-secret-2026';

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  try {
    const decoded = jwt.verify(header.slice(7), JWT_SECRET) as Partial<CampusUser> & { userId?: string; email?: string };
    req.user = {
      userId: decoded.userId || '',
      email: decoded.email || '',
      role: (decoded.role || 'STUDENT') as CampusRole,
      studentId: decoded.studentId,
      recruiterId: decoded.recruiterId,
      tpoId: decoded.tpoId,
      companyId: (decoded as any).companyId,
      institutionId: (decoded as any).institutionId,
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized: Token has expired or is invalid' });
  }
}
