import {
  DashboardData,
  Student,
  StudentAcademics,
  StudentSkill,
  Project,
  Certification,
  Resume,
  ReadinessScore,
  SkillGap,
  JobListing,
  Application,
  Interview,
  Offer,
  DocumentRecord,
  NotificationRecord,
  MockInterviewRecord,
  AiMessage,
  JobDescriptionAnalysisResult
} from '../types/student';

const TOKEN_KEY = 'campuslink_student_jwt';

export const api = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const raw = await response.text();
    let data: any = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(data?.error || raw || `Server error (${response.status})`);
    }

    if (data === null) {
      throw new Error('Server returned an empty or invalid JSON response.');
    }

    return data as T;
  },

  // Auth endpoints
  async login(email: string, password: string) {
    const res = await this.request<{
      message: string;
      token: string;
      student: Student;
      onboardingCompleted: boolean;
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(res.token);
    return res;
  },

  async register(params: {
    fullName: string;
    email: string;
    password: string;
    mobile: string;
    college: string;
    branch: string;
    graduationYear: number;
  }) {
    const res = await this.request<{
      message: string;
      token: string;
      student: Student;
      onboardingCompleted: boolean;
    }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    this.setToken(res.token);
    return res;
  },

  async forgotPassword(email: string) {
    return this.request<{ message: string; demoResetToken?: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(email: string, newPassword: string) {
    return this.request<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword }),
    });
  },

  async getMe() {
    return this.request<{
      user: { id: string; email: string };
      student: Student;
      onboardingCompleted: boolean;
    }>('/api/auth/me');
  },

  // Onboarding
  async submitOnboarding(payload: any) {
    return this.request<{
      message: string;
      student: Student;
      readinessScore: ReadinessScore;
      skillGap: SkillGap;
    }>('/api/student/onboarding', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Dashboard
  async getDashboard(): Promise<DashboardData> {
    return this.request<DashboardData>('/api/student/dashboard');
  },

  // Profile & Academics
  async getProfile() {
    return this.request<{
      student: Student;
      academics: StudentAcademics;
      skills: StudentSkill[];
      projects: Project[];
      experiences: any[];
      certifications: Certification[];
      resume: Resume;
    }>('/api/student/profile');
  },

  async updateProfile(updates: Partial<Student>) {
    return this.request<{ message: string; student: Student; readinessScore: ReadinessScore }>(
      '/api/student/profile',
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      }
    );
  },

  async getAcademics(): Promise<StudentAcademics> {
    return this.request<StudentAcademics>('/api/student/academics');
  },

  async updateAcademics(updates: Partial<StudentAcademics>) {
    return this.request<{ message: string; academics: StudentAcademics; readinessScore: ReadinessScore }>(
      '/api/student/academics',
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      }
    );
  },

  // Skills
  async getSkills(): Promise<StudentSkill[]> {
    return this.request<StudentSkill[]>('/api/student/skills');
  },

  async addSkill(skill: { skillName: string; category?: string; proficiencyLevel?: string; yearsExperience?: number }) {
    return this.request<{ message: string; skills: StudentSkill[]; readinessScore: ReadinessScore; skillGap: SkillGap }>(
      '/api/student/skills',
      {
        method: 'POST',
        body: JSON.stringify(skill),
      }
    );
  },

  async deleteSkill(id: string) {
    return this.request<{ message: string; skills: StudentSkill[]; readinessScore: ReadinessScore }>(
      `/api/student/skills/${id}`,
      {
        method: 'DELETE',
      }
    );
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>('/api/student/projects');
  },

  async addProject(project: Partial<Project>) {
    return this.request<{ message: string; project: Project; readinessScore: ReadinessScore }>(
      '/api/student/projects',
      {
        method: 'POST',
        body: JSON.stringify(project),
      }
    );
  },

  async deleteProject(id: string) {
    return this.request<{ message: string; readinessScore: ReadinessScore }>(
      `/api/student/projects/${id}`,
      {
        method: 'DELETE',
      }
    );
  },

  // Certifications
  async getCertifications(): Promise<Certification[]> {
    return this.request<Certification[]>('/api/student/certifications');
  },

  async addCertification(cert: any) {
    return this.request<{ message: string; certification: Certification; readinessScore: ReadinessScore }>(
      '/api/student/certifications',
      {
        method: 'POST',
        body: JSON.stringify(cert),
      }
    );
  },

  async deleteCertification(id: string) {
    return this.request<{ message: string; readinessScore: ReadinessScore }>(
      `/api/student/certifications/${id}`,
      {
        method: 'DELETE',
      }
    );
  },

  // Resume & AI Parsing
  async getResume(): Promise<Resume> {
    return this.request<Resume>('/api/student/resume');
  },

  async parseResumeAi(resumeText: string) {
    return this.request<any>('/api/student/resume/parse', {
      method: 'POST',
      body: JSON.stringify({ resumeText }),
    });
  },

  async applyParsedResume(parsedData: any, fileName?: string) {
    return this.request<{ message: string; resume: Resume; readinessScore: ReadinessScore }>(
      '/api/student/resume/apply-parsed-data',
      {
        method: 'POST',
        body: JSON.stringify({ parsedData, fileName }),
      }
    );
  },

  // Readiness Score
  async getReadiness(): Promise<ReadinessScore> {
    return this.request<ReadinessScore>('/api/student/readiness');
  },

  async recalculateReadiness(): Promise<ReadinessScore> {
    return this.request<ReadinessScore>('/api/student/readiness/recalculate', {
      method: 'POST',
    });
  },

  // Skill Gap
  async getSkillGap(): Promise<{ skillGap: SkillGap; availableRoles: string[] }> {
    return this.request<{ skillGap: SkillGap; availableRoles: string[] }>('/api/student/skill-gap');
  },

  async setTargetRole(targetRole: string): Promise<SkillGap> {
    return this.request<SkillGap>('/api/student/skill-gap/target-role', {
      method: 'POST',
      body: JSON.stringify({ targetRole }),
    });
  },

  // Jobs
  async getJobs(): Promise<JobListing[]> {
    return this.request<JobListing[]>('/api/student/jobs');
  },

  async getJobDetails(id: string): Promise<JobListing & { matchedSkills: string[]; missingSkills: string[] }> {
    return this.request<JobListing & { matchedSkills: string[]; missingSkills: string[] }>(`/api/student/jobs/${id}`);
  },

  async analyzeJobDescription(jobId: string): Promise<JobDescriptionAnalysisResult> {
    return this.request<JobDescriptionAnalysisResult>(`/api/student/jobs/${jobId}/analyze`, {
      method: 'POST',
    });
  },

  // Applications
  async getApplications(): Promise<Application[]> {
    return this.request<Application[]>('/api/student/applications');
  },

  async applyToJob(jobId: string) {
    return this.request<{ message: string; application: Application }>('/api/student/applications/apply', {
      method: 'POST',
      body: JSON.stringify({ jobId }),
    });
  },

  async withdrawApplication(appId: string) {
    return this.request<{ message: string }>(`/api/student/applications/${appId}/withdraw`, {
      method: 'POST',
    });
  },

  // Interviews & Mock Interviews
  async getInterviews(): Promise<Interview[]> {
    return this.request<Interview[]>('/api/student/interviews');
  },

  async getMockInterviews(): Promise<MockInterviewRecord[]> {
    return this.request<MockInterviewRecord[]>('/api/student/mock-interviews');
  },

  async generateMockQuestion(payload: {
    role: string;
    difficulty: string;
    interviewType: string;
    history: Array<{ question: string; answer: string }>;
  }) {
    return this.request<{
      questionNumber: number;
      question: string;
      category: string;
      hint: string;
      expectedKeywords: string[];
    }>('/api/student/mock-interviews/generate-question', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async evaluateMockInterview(payload: {
    role: string;
    difficulty: string;
    interviewType: string;
    qaPairs: Array<{ question: string; answer: string }>;
  }) {
    return this.request<{
      evaluation: {
        score_overall: number;
        technical_accuracy: number;
        communication: number;
        clarity: number;
        confidence: number;
        detailed_feedback: string;
        strengths: string[];
        areas_for_improvement: string[];
        ideal_answer_outline: string;
      };
      record: MockInterviewRecord;
      updatedReadiness: ReadinessScore;
    }>('/api/student/mock-interviews/evaluate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Offers
  async getOffers(): Promise<Offer[]> {
    return this.request<Offer[]>('/api/student/offers');
  },

  async decideOffer(offerId: string, decision: 'ACCEPTED' | 'DECLINED') {
    return this.request<{ message: string; offer: Offer }>(`/api/student/offers/${offerId}/decision`, {
      method: 'POST',
      body: JSON.stringify({ decision }),
    });
  },

  // Documents
  async getDocuments(): Promise<DocumentRecord[]> {
    return this.request<DocumentRecord[]>('/api/student/documents');
  },

  async uploadDocument(doc: { title: string; documentType: string; fileUrl?: string }) {
    return this.request<{ message: string; document: DocumentRecord }>('/api/student/documents/upload', {
      method: 'POST',
      body: JSON.stringify(doc),
    });
  },

  async deleteDocument(id: string) {
    return this.request<{ message: string }>(`/api/student/documents/${id}`, {
      method: 'DELETE',
    });
  },

  // Notifications
  async getNotifications(): Promise<NotificationRecord[]> {
    return this.request<NotificationRecord[]>('/api/student/notifications');
  },

  async markNotificationRead(id: string) {
    return this.request<{ message: string }>(`/api/student/notifications/${id}/read`, {
      method: 'POST',
    });
  },

  async markAllNotificationsRead() {
    return this.request<{ message: string }>('/api/student/notifications/read-all', {
      method: 'POST',
    });
  },

  // AI Assistant Chat
  async getAiMessages(): Promise<AiMessage[]> {
    return this.request<AiMessage[]>('/api/student/ai/messages');
  },

  async sendAiMessage(message: string): Promise<{ message: AiMessage }> {
    return this.request<{ message: AiMessage }>('/api/student/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  // Analytics
  async getAnalytics() {
    return this.request<{
      readinessTrend: Array<{ month: string; score: number }>;
      competencyRadar: Array<{ subject: string; score: number; fullMark: number }>;
      funnel: Array<{ stage: string; count: number; rate: number }>;
      mockInterviewsHistory: MockInterviewRecord[];
    }>('/api/student/analytics');
  },

  // Schema viewer
  async getDbSchemaSql(): Promise<string> {
    const res = await fetch('/api/db/schema');
    return res.text();
  },
};
