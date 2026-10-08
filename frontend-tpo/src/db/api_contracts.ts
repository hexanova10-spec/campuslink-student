/**
 * CAMPUSLINK ENTERPRISE BACKEND REST API CONTRACTS
 * All endpoints enforce institutional context and object-level permissions.
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    totalCount?: number;
    institutionId?: string;
    generatedAt: string;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export const API_ENDPOINTS = {
  // Authentication & Session
  AUTH_ME: '/api/v1/auth/me',
  AUTH_SWITCH_ROLE: '/api/v1/auth/switch-context',

  // TPO College Scoped Endpoints (Auto-filtered by current_user.institution_id)
  TPO_STUDENTS: '/api/v1/tpo/students',
  TPO_STUDENT_BY_ID: (id: string) => `/api/v1/tpo/students/${id}`,
  TPO_STUDENTS_READINESS: '/api/v1/tpo/students/readiness-summary',
  TPO_STUDENTS_AT_RISK: '/api/v1/tpo/students/at-risk',
  TPO_FLAG_RISK: (id: string) => `/api/v1/tpo/students/${id}/flag-risk`,
  TPO_ASSIGN_MENTOR: (id: string) => `/api/v1/tpo/students/${id}/assign-mentor`,
  
  // Job & Drive Approvals
  TPO_JOBS: '/api/v1/tpo/jobs',
  TPO_JOB_REVIEW: (id: string) => `/api/v1/tpo/jobs/${id}/review`, // Approve/Reject/Request changes
  TPO_DRIVES: '/api/v1/tpo/placement-drives',
  TPO_DRIVE_BY_ID: (id: string) => `/api/v1/tpo/placement-drives/${id}`,
  
  // Candidate Access Control (CRITICAL)
  TPO_CANDIDATE_POOL: (jobId: string) => `/api/v1/tpo/jobs/${jobId}/candidate-pool`,
  TPO_RELEASE_CANDIDATES: '/api/v1/tpo/candidates/release-access',
  TPO_REVOKE_CANDIDATE_ACCESS: (accessId: string) => `/api/v1/tpo/candidates/access/${accessId}/revoke`,
  
  // Deterministic Eligibility & AI Matching
  TPO_TEST_ELIGIBILITY: '/api/v1/tpo/eligibility/evaluate',
  TPO_MATCHING_OVERSIGHT: (jobId: string) => `/api/v1/tpo/matching-oversight/${jobId}`,

  // Scheduling & Conflicts
  TPO_SCHEDULES: '/api/v1/tpo/schedules',
  TPO_SCHEDULE_CONFLICTS: '/api/v1/tpo/schedules/conflicts',
  TPO_AI_RESOLVE_CONFLICTS: '/api/v1/tpo/schedules/ai-optimize',
  
  // Operations: Interviews, Offers, Documents
  TPO_INTERVIEWS: '/api/v1/tpo/interviews',
  TPO_OFFERS: '/api/v1/tpo/offers',
  TPO_OFFER_STATUS: (id: string) => `/api/v1/tpo/offers/${id}/status`,
  TPO_DOCUMENTS: '/api/v1/tpo/documents',
  TPO_VERIFY_DOCUMENT: (id: string) => `/api/v1/tpo/documents/${id}/verify`,
  TPO_NOTIFICATIONS_BROADCAST: '/api/v1/tpo/notifications/broadcast',

  // AI Assistant (Grounded solely in College Context)
  TPO_AI_CHAT: '/api/v1/tpo/ai/chat',

  // System Administrator Scoped Endpoints (Requires SYSTEM_ADMIN role)
  ADMIN_COLLEGES: '/api/v1/admin/colleges',
  ADMIN_CAMPUSES: '/api/v1/admin/campuses',
  ADMIN_USERS: '/api/v1/admin/users',
  ADMIN_ROLES_PERMISSIONS: '/api/v1/admin/roles-permissions',
  ADMIN_GLOBAL_RECRUITERS: '/api/v1/admin/recruiters',
  ADMIN_GLOBAL_ANALYTICS: '/api/v1/admin/analytics/global',
  ADMIN_AI_CONFIG: '/api/v1/admin/ai/config',
  ADMIN_AUDIT_LOGS: '/api/v1/admin/audit-logs',
  ADMIN_AI_CHAT: '/api/v1/admin/ai/chat'
};
