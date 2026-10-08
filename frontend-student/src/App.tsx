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
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/50 to-slate-100/60 dark:from-[#050c22] dark:via-[#08153b] dark:to-[#040816] text-slate-900 dark:text-slate-100 flex flex-col relative overflow-x-clip transition-colors duration-300">
      {/* Radiant Royal Blue Transparent Orbs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/15 dark:bg-blue-600/25 blur-[150px] rounded-full pointer-events-none -z-10 royal-glow" />
      <div className="fixed bottom-10 right-1/4 w-[500px] h-[500px] bg-indigo-600/15 dark:bg-blue-500/20 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="fixed top-1/2 left-10 w-[350px] h-[350px] bg-cyan-500/10 dark:bg-blue-700/15 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Top Navbar */}
      <Navbar
        onOpenNotifications={() => setCurrentScreen('notifications')}
        unreadCount={unreadCount}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Conditionally rendered Sidebar Drawer (only open if user requests) */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        unreadCount={unreadCount}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <main className="w-full">
          {renderScreen()}
        </main>
      </div>

      {/* Quick Floating Navigator Button when sidebar is closed */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed bottom-6 left-6 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white font-bold text-xs shadow-xl shadow-blue-600/40 hover:scale-105 transition-all border border-white/30 backdrop-blur-xl"
          title="Open Navigation Menu"
        >
          <Compass className="w-4 h-4 text-cyan-200 animate-spin-slow" />
          <span>Menu (24 Modules)</span>
        </button>
      )}
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
