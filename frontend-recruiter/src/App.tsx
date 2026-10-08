/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RecruiterProvider, useRecruiter } from './context/RecruiterContext.tsx';
import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { PrivacyBanner } from './components/PrivacyBanner.tsx';
import { PanelLeft } from 'lucide-react';

// All 20 Screens
import { LoginScreen } from './screens/LoginScreen.tsx';
import { DashboardScreen } from './screens/DashboardScreen.tsx';
import { CompanyProfileScreen } from './screens/CompanyProfileScreen.tsx';
import { JobsScreen } from './screens/JobsScreen.tsx';
import { CreateJobScreen } from './screens/CreateJobScreen.tsx';
import { JDUploadScreen } from './screens/JDUploadScreen.tsx';
import { AIJDAnalysisScreen } from './screens/AIJDAnalysisScreen.tsx';
import { ApplicantsScreen } from './screens/ApplicantsScreen.tsx';
import { CandidateMatchingScreen } from './screens/CandidateMatchingScreen.tsx';
import { CandidateRankingScreen } from './screens/CandidateRankingScreen.tsx';
import { CandidateDetailScreen } from './screens/CandidateDetailScreen.tsx';
import { ShortlistScreen } from './screens/ShortlistScreen.tsx';
import { DrivesScreen } from './screens/DrivesScreen.tsx';
import { InterviewScheduleScreen } from './screens/InterviewScheduleScreen.tsx';
import { InterviewEvalScreen } from './screens/InterviewEvalScreen.tsx';
import { OffersScreen } from './screens/OffersScreen.tsx';
import { AnalyticsScreen } from './screens/AnalyticsScreen.tsx';
import { NotificationsScreen } from './screens/NotificationsScreen.tsx';
import { AIAssistantScreen } from './screens/AIAssistantScreen.tsx';
import { SecuritySettingsScreen } from './screens/SecuritySettingsScreen.tsx';

const AppContent: React.FC = () => {
  const { activeScreen, theme, sidebarOpen, toggleSidebar } = useRecruiter();
  const isLight = theme === 'light';

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'login':
        return <LoginScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'company_profile':
        return <CompanyProfileScreen />;
      case 'jobs':
        return <JobsScreen />;
      case 'create_job':
        return <CreateJobScreen />;
      case 'jd_upload':
        return <JDUploadScreen />;
      case 'ai_jd_analysis':
        return <AIJDAnalysisScreen />;
      case 'applicants':
        return <ApplicantsScreen />;
      case 'candidate_matching':
        return <CandidateMatchingScreen />;
      case 'candidate_ranking':
        return <CandidateRankingScreen />;
      case 'candidate_details':
        return <CandidateDetailScreen />;
      case 'shortlist':
        return <ShortlistScreen />;
      case 'drives':
        return <DrivesScreen />;
      case 'interview_schedule':
        return <InterviewScheduleScreen />;
      case 'interview_evaluation':
        return <InterviewEvalScreen />;
      case 'offers':
        return <OffersScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'ai_assistant':
        return <AIAssistantScreen />;
      case 'security_settings':
        return <SecuritySettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div
      className={`min-h-screen relative flex flex-col font-sans antialiased transition-colors duration-300 selection:bg-blue-600 selection:text-white ${
        isLight
          ? 'bg-[#F8FAFC] text-slate-900'
          : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Ambient Royal Blue Translucent Backdrop Highlights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className={`absolute -top-40 left-1/4 w-96 h-96 rounded-full filter blur-[120px] transition-opacity ${
            isLight ? 'bg-blue-100/60 opacity-70' : 'bg-blue-700/20 opacity-30'
          }`}
        />
        <div
          className={`absolute top-1/2 -right-20 w-96 h-96 rounded-full filter blur-[140px] transition-opacity ${
            isLight ? 'bg-blue-50/80 opacity-60' : 'bg-blue-600/15 opacity-20'
          }`}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <PrivacyBanner />

        <div className="flex-1 flex max-w-[1720px] w-full mx-auto relative">
          <Sidebar />

          {/* Quick Floating Tab to open sidebar when it is closed */}
          {!sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className={`fixed bottom-6 left-6 z-40 px-3.5 py-2.5 rounded-full border shadow-2xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer hover:scale-105 ${
                isLight
                  ? 'bg-white/90 backdrop-blur-xl border-blue-200 text-blue-700 shadow-blue-500/15 hover:bg-blue-50'
                  : 'bg-slate-900/90 backdrop-blur-xl border-blue-500/40 text-blue-300 shadow-blue-900/40 hover:bg-slate-800'
              }`}
              title="Open Navigation Menu"
            >
              <PanelLeft className="w-4 h-4 text-blue-500" />
              <span>Navigation Menu</span>
            </button>
          )}

          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-full">
            {renderActiveScreen()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <RecruiterProvider>
      <AppContent />
    </RecruiterProvider>
  );
}
