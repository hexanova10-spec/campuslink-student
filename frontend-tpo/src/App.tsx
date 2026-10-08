/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { repo } from './services/storage';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Navigation & Global UI
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { CommandPalette } from './components/CommandPalette';

// Screen 1: Auth & Role Switcher
import { AuthSwitcherScreen } from './components/auth/AuthSwitcherScreen';

// Screens 2 - 27: TPO College Screens
import { TpoDashboard } from './components/tpo/TpoDashboard';
import { StudentsScreen } from './components/tpo/StudentsScreen';
import { StudentDetailsScreen } from './components/tpo/StudentDetailsScreen';
import { ReadinessMonitoringScreen } from './components/tpo/ReadinessMonitoringScreen';
import { AtRiskEngineScreen } from './components/tpo/AtRiskEngineScreen';
import { RecruiterManagementScreen } from './components/tpo/RecruiterManagementScreen';
import { CompaniesScreen } from './components/tpo/CompaniesScreen';
import { JobsScreen } from './components/tpo/JobsScreen';
import { JobApprovalScreen } from './components/tpo/JobApprovalScreen';
import { EligibilityEngineScreen } from './components/tpo/EligibilityEngineScreen';
import { CandidatePoolScreen } from './components/tpo/CandidatePoolScreen';
import { CandidateReleaseScreen } from './components/tpo/CandidateReleaseScreen';
import { MatchingOversightScreen } from './components/tpo/MatchingOversightScreen';
import { PlacementDrivesScreen } from './components/tpo/PlacementDrivesScreen';
import { SmartSchedulingScreen } from './components/tpo/SmartSchedulingScreen';
import { ConflictManagementScreen } from './components/tpo/ConflictManagementScreen';
import { InterviewsScreen } from './components/tpo/InterviewsScreen';
import { OffersScreen } from './components/tpo/OffersScreen';
import { DocumentsScreen } from './components/tpo/DocumentsScreen';
import { NotificationCenterScreen } from './components/tpo/NotificationCenterScreen';
import { AiCommunicationScreen } from './components/tpo/AiCommunicationScreen';
import { PlacementAnalyticsScreen } from './components/tpo/PlacementAnalyticsScreen';
import { PredictiveAnalyticsScreen } from './components/tpo/PredictiveAnalyticsScreen';
import { AiTpoAssistantScreen } from './components/tpo/AiTpoAssistantScreen';
import { MentorsScreen } from './components/tpo/MentorsScreen';
import { CollegeSettingsScreen } from './components/tpo/CollegeSettingsScreen';

// Screens 28 - 36: System Administrator Screens
import { AdminDashboardScreen } from './components/admin/AdminDashboardScreen';
import { CollegesScreen } from './components/admin/CollegesScreen';
import { CampusesScreen } from './components/admin/CampusesScreen';
import { GlobalUsersScreen } from './components/admin/GlobalUsersScreen';
import { RolesPermissionsScreen } from './components/admin/RolesPermissionsScreen';
import { GlobalRecruitersScreen } from './components/admin/GlobalRecruitersScreen';
import { GlobalAnalyticsScreen } from './components/admin/GlobalAnalyticsScreen';
import { AiConfigurationScreen } from './components/admin/AiConfigurationScreen';
import { AuditLogsAndSchemaScreen } from './components/admin/AuditLogsAndSchemaScreen';

function MainAppContent() {
  const { theme } = useTheme();
  const [currentScreen, setCurrentScreen] = useState<number>(2); // Default to Command Center
  const [selectedStudentId, setSelectedStudentId] = useState<string>('stu-001');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [, setTick] = useState(0);

  // Subscribe to reactive repository state changes
  useEffect(() => {
    const unsubscribe = repo.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsubscribe;
  }, []);

  // Keyboard shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectStudent = (id: string) => {
    setSelectedStudentId(id);
    setCurrentScreen(4); // Screen 4 is Student Details
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 1:
        return <AuthSwitcherScreen onSelectScreen={setCurrentScreen} />;
      case 2:
        return <TpoDashboard onSelectScreen={setCurrentScreen} />;
      case 3:
        return <StudentsScreen onSelectStudent={handleSelectStudent} onSelectScreen={setCurrentScreen} />;
      case 4:
        return <StudentDetailsScreen studentId={selectedStudentId} onBack={() => setCurrentScreen(3)} onSelectScreen={setCurrentScreen} />;
      case 5:
        return <ReadinessMonitoringScreen onSelectStudent={handleSelectStudent} onSelectScreen={setCurrentScreen} />;
      case 6:
        return <AtRiskEngineScreen onSelectStudent={handleSelectStudent} onSelectScreen={setCurrentScreen} />;
      case 7:
        return <RecruiterManagementScreen />;
      case 8:
        return <CompaniesScreen />;
      case 9:
        return <JobsScreen onSelectScreen={setCurrentScreen} />;
      case 10:
        return <JobApprovalScreen />;
      case 11:
        return <EligibilityEngineScreen />;
      case 12:
        return <CandidatePoolScreen onSelectScreen={setCurrentScreen} onSelectStudent={handleSelectStudent} />;
      case 13:
        return <CandidateReleaseScreen />;
      case 14:
        return <MatchingOversightScreen />;
      case 15:
        return <PlacementDrivesScreen onSelectScreen={setCurrentScreen} />;
      case 16:
        return <SmartSchedulingScreen onSelectScreen={setCurrentScreen} />;
      case 17:
        return <ConflictManagementScreen />;
      case 18:
        return <InterviewsScreen />;
      case 19:
        return <OffersScreen />;
      case 20:
        return <DocumentsScreen />;
      case 21:
        return <NotificationCenterScreen onSelectScreen={setCurrentScreen} />;
      case 22:
        return <AiCommunicationScreen />;
      case 23:
        return <PlacementAnalyticsScreen />;
      case 24:
        return <PredictiveAnalyticsScreen />;
      case 25:
        return <AiTpoAssistantScreen />;
      case 26:
        return <MentorsScreen />;
      case 27:
        return <CollegeSettingsScreen />;
      case 28:
        return <AdminDashboardScreen onSelectScreen={setCurrentScreen} />;
      case 29:
        return <CollegesScreen />;
      case 30:
        return <CampusesScreen />;
      case 31:
        return <GlobalUsersScreen />;
      case 32:
        return <RolesPermissionsScreen />;
      case 33:
        return <GlobalRecruitersScreen />;
      case 34:
        return <GlobalAnalyticsScreen />;
      case 35:
        return <AiConfigurationScreen />;
      case 36:
        return <AuditLogsAndSchemaScreen />;
      default:
        return <TpoDashboard onSelectScreen={setCurrentScreen} />;
    }
  };

  return (
    <div
      data-theme={theme}
      className={`min-h-screen theme-bg flex flex-col font-sans transition-colors duration-300 ${
        theme === 'dark'
          ? 'selection:bg-blue-600/30 selection:text-blue-200'
          : 'selection:bg-blue-500/20 selection:text-blue-800'
      }`}
    >
      {/* Top Header */}
      <TopBar
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        openPalette={() => setIsPaletteOpen(true)}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex relative">
        <Sidebar
          currentScreen={currentScreen}
          onSelectScreen={setCurrentScreen}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 max-w-full">
          <div className="tpo-page-shell">
            {renderActiveScreen()}
          </div>
        </main>
      </div>

      {/* Instant Command Palette Modal (Cmd+K) */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onSelectScreen={setCurrentScreen}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainAppContent />
    </ThemeProvider>
  );
}
