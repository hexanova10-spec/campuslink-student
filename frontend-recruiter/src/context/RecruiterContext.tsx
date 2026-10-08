import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api.ts';
import {
  Company,
  Recruiter,
  JobRequisition,
  Application,
  InterviewRecord,
  OfferRecord,
  PlacementDrive,
  NotificationItem,
  AuditLog,
  ParsedJDResult
} from '../types/recruiter.ts';

export type ScreenId =
  | 'login'
  | 'dashboard'
  | 'company_profile'
  | 'jobs'
  | 'create_job'
  | 'jd_upload'
  | 'ai_jd_analysis'
  | 'applicants'
  | 'candidate_matching'
  | 'candidate_ranking'
  | 'candidate_details'
  | 'shortlist'
  | 'drives'
  | 'interview_schedule'
  | 'interview_evaluation'
  | 'offers'
  | 'analytics'
  | 'notifications'
  | 'ai_assistant'
  | 'security_settings';

interface RecruiterContextType {
  activeScreen: ScreenId;
  setActiveScreen: (screen: ScreenId) => void;
  recruiter: Recruiter | null;
  company: Company | null;
  availableRecruiters: {
    id: string;
    name: string;
    companyName: string;
    designation: string;
    companyId: string;
    avatarUrl: string;
  }[];
  jobs: (JobRequisition & {
    stats: {
      totalApplicants: number;
      shortlisted: number;
      interviews: number;
      selected: number;
    };
  })[];
  applications: (Application & {
    jobTitle: string;
    student: any;
  })[];
  interviews: (InterviewRecord & {
    studentName: string;
    studentEmail: string;
    studentRoll: string;
    jobTitle: string;
  })[];
  offers: (OfferRecord & {
    studentName: string;
    studentEmail: string;
    jobTitle: string;
  })[];
  drives: PlacementDrive[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  selectedCandidateId: string | null;
  setSelectedCandidateId: (id: string | null) => void;
  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;
  selectedInterviewId: string | null;
  setSelectedInterviewId: (id: string | null) => void;
  parsedJD: ParsedJDResult | null;
  setParsedJD: (parsed: ParsedJDResult | null) => void;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  switchRecruiterSession: (recruiterId: string) => Promise<void>;
  viewCandidate: (candidateId: string) => void;
  openInterviewEval: (interviewId: string) => void;
  unreadNotificationsCount: number;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const RecruiterContext = createContext<RecruiterContextType | undefined>(undefined);

export const RecruiterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard');
  const [recruiter, setRecruiter] = useState<Recruiter | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [availableRecruiters, setAvailableRecruiters] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>('stu-apex-01');
  const [selectedJobId, setSelectedJobId] = useState<string | null>('job-apex-se-1');
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>('int-apex-01');
  const [parsedJD, setParsedJD] = useState<ParsedJDResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Theme: Professional Royal Blue + White + Transparency (default light)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('campuslink_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'light';
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        localStorage.setItem('campuslink_theme', next);
      }
      return next;
    });
  };

  // Sidebar toggle state (user requests sidebar not open always, only when requested)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const sessionData = await api.getSession();
      setRecruiter(sessionData.recruiter);
      setCompany(sessionData.company);
      setAvailableRecruiters(sessionData.availableRecruiters);

      const [jobsData, appsData, intvsData, offersData, drivesData, notifsData, logsData] =
        await Promise.all([
          api.getJobs(),
          api.getAllAuthorizedApplicants(),
          api.getInterviews(),
          api.getOffers(),
          api.getDrives(),
          api.getNotifications(),
          api.getAuditLogs()
        ]);

      setJobs(jobsData.jobs || []);
      setApplications(appsData.applications || []);
      setInterviews(intvsData.interviews || []);
      setOffers(offersData.offers || []);
      setDrives(drivesData.drives || []);
      setNotifications(notifsData.notifications || []);
      setAuditLogs(logsData.logs || []);

      if (jobsData.jobs?.length && !selectedJobId) {
        setSelectedJobId(jobsData.jobs[0].id);
      }
    } catch (err) {
      console.error('Failed to load recruiter data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const switchRecruiterSession = async (recruiterId: string) => {
    try {
      setIsLoading(true);
      await api.switchSession(recruiterId);
      await refreshData();
      setActiveScreen('dashboard');
    } catch (err) {
      console.error('Failed to switch recruiter session:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const viewCandidate = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setActiveScreen('candidate_details');
  };

  const openInterviewEval = (interviewId: string) => {
    setSelectedInterviewId(interviewId);
    setActiveScreen('interview_evaluation');
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <RecruiterContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        recruiter,
        company,
        availableRecruiters,
        jobs,
        applications,
        interviews,
        offers,
        drives,
        notifications,
        auditLogs,
        selectedCandidateId,
        setSelectedCandidateId,
        selectedJobId,
        setSelectedJobId,
        selectedInterviewId,
        setSelectedInterviewId,
        parsedJD,
        setParsedJD,
        isLoading,
        refreshData,
        switchRecruiterSession,
        viewCandidate,
        openInterviewEval,
        unreadNotificationsCount,
        theme,
        setTheme,
        toggleTheme,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar
      }}
    >
      {children}
    </RecruiterContext.Provider>
  );
};

export const useRecruiter = () => {
  const context = useContext(RecruiterContext);
  if (!context) {
    throw new Error('useRecruiter must be used within a RecruiterProvider');
  }
  return context;
};
