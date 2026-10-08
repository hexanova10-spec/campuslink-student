/**
 * CAMPUSLINK STUDENT — AI CAREER & PLACEMENT PLATFORM
 * "Know Your Readiness. Discover Your Opportunity. Get Placement Ready."
 * Prototype 1: 100% Student-Only Experience
 * Royal Blue & White Glassmorphic Aesthetic with Dark / Light Mode Support
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';

// 24 Student Screens
import { LoginScreen } from './components/screens/LoginScreen';
import { RegisterScreen } from './components/screens/RegisterScreen';
import { ForgotPasswordScreen } from './components/screens/ForgotPasswordScreen';
import { OnboardingWizard } from './components/screens/OnboardingWizard';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { AcademicProfileScreen } from './components/screens/AcademicProfileScreen';
import { SkillsScreen } from './components/screens/SkillsScreen';
import { ProjectsScreen } from './components/screens/ProjectsScreen';
import { CertificationsScreen } from './components/screens/CertificationsScreen';
import { ResumeScreen } from './components/screens/ResumeScreen';
import { AiResumeAnalysisScreen } from './components/screens/AiResumeAnalysisScreen';
import { ReadinessScoreScreen } from './components/screens/ReadinessScoreScreen';
import { SkillGapScreen } from './components/screens/SkillGapScreen';
import { RecommendedJobsScreen } from './components/screens/RecommendedJobsScreen';
import { JobDetailsScreen } from './components/screens/JobDetailsScreen';
import { ApplicationsScreen } from './components/screens/ApplicationsScreen';
import { InterviewScheduleScreen } from './components/screens/InterviewScheduleScreen';
import { MockInterviewScreen } from './components/screens/MockInterviewScreen';
import { OffersScreen } from './components/screens/OffersScreen';
import { DocumentsScreen } from './components/screens/DocumentsScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { AiCareerAssistantScreen } from './components/screens/AiCareerAssistantScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { Menu, Compass } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, currentScreen, setCurrentScreen } = useAuth();
  const { isDark } = useTheme();
  const [unreadCount] = useState<number>(3);
  // Requirement: "the side bar sholu not open always it shoud be one if we want ro open"
  // Default is false (closed).
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // If user is not authenticated, render auth screens
  if (!isAuthenticated) {
    if (currentScreen === 'register') {
      return <RegisterScreen />;
    }
    if (currentScreen === 'forgot-password') {
      return <ForgotPasswordScreen />;
    }
    return <LoginScreen />;
  }

  // If student needs to complete onboarding
  if (currentScreen === 'onboarding') {
    return <OnboardingWizard />;
  }

  // Render appropriate screen based on state
  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'academics':
        return <AcademicProfileScreen />;
      case 'skills':
        return <SkillsScreen />;
      case 'projects':
        return <ProjectsScreen />;
      case 'certifications':
        return <CertificationsScreen />;
      case 'resume':
        return <ResumeScreen />;
      case 'ai-resume-analysis':
        return <AiResumeAnalysisScreen />;
      case 'readiness-score':
        return <ReadinessScoreScreen />;
      case 'skill-gap':
        return <SkillGapScreen />;
      case 'recommended-jobs':
        return <RecommendedJobsScreen />;
      case 'job-details':
        return <JobDetailsScreen />;
      case 'applications':
        return <ApplicationsScreen />;
      case 'interview-schedule':
        return <InterviewScheduleScreen />;
      case 'mock-interview':
        return <MockInterviewScreen />;
      case 'offers':
        return <OffersScreen />;
      case 'documents':
        return <DocumentsScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'ai-career-assistant':
        return <AiCareerAssistantScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div
      className={`min-h-screen relative flex flex-col font-sans antialiased transition-colors duration-300 selection:bg-blue-600 selection:text-white ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute -top-40 left-1/4 w-96 h-96 rounded-full filter blur-[120px] transition-opacity ${
          isDark ? 'bg-blue-700/20 opacity-30' : 'bg-blue-100/60 opacity-70'
        }`} />
        <div className={`absolute top-1/2 -right-20 w-96 h-96 rounded-full filter blur-[140px] transition-opacity ${
          isDark ? 'bg-blue-600/15 opacity-20' : 'bg-blue-50/80 opacity-60'
        }`} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          onOpenNotifications={() => setCurrentScreen('notifications')}
          unreadCount={unreadCount}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          isSidebarOpen={isSidebarOpen}
        />

        <div className="flex-1 flex max-w-[1720px] w-full mx-auto relative">
          <Sidebar
            currentScreen={currentScreen}
            onNavigate={(screen) => setCurrentScreen(screen)}
            unreadCount={unreadCount}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`fixed bottom-6 left-6 z-40 px-3.5 py-2.5 rounded-full border shadow-2xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer hover:scale-105 ${
                isDark
                  ? 'bg-slate-900/90 backdrop-blur-xl border-blue-500/40 text-blue-300 shadow-blue-900/40 hover:bg-slate-800'
                  : 'bg-white/90 backdrop-blur-xl border-blue-200 text-blue-700 shadow-blue-500/15 hover:bg-blue-50'
              }`}
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4 text-blue-500" />
              <span>Navigation Menu</span>
            </button>
          )}

          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-full">
            {renderScreen()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
