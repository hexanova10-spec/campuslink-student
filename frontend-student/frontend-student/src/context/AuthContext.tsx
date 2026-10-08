import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, User, ScreenType } from '../types/student';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  student: Student | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    mobile: string;
    college: string;
    branch: string;
    graduationYear: number;
  }) => Promise<void>;
  logout: () => void;
  refreshStudentData: () => Promise<void>;
  loginAsDemoStudent: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [token, setToken] = useState<string | null>(api.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    async function initAuth() {
      const storedToken = api.getToken();
      if (storedToken) {
        try {
          const res = await api.getMe();
          setUser({ id: res.user.id, email: res.user.email, role: 'student' });
          setStudent(res.student);
          if (!res.student.onboarding_completed) {
            setCurrentScreen('onboarding');
          }
        } catch (err) {
          console.warn('Session verification failed, logging in as default student:', err);
          await loginAsDemoStudent();
        }
      } else {
        // Automatically sign in as default pre-seeded student for seamless instant exploration
        await loginAsDemoStudent();
      }
      setIsLoading(false);
    }
    initAuth();
  }, []);

  const loginAsDemoStudent = async () => {
    try {
      const res = await api.login('aarav.sharma@campus.edu', 'student@123');
      setUser({ id: res.student.user_id, email: 'aarav.sharma@campus.edu', role: 'student' });
      setStudent(res.student);
      setToken(res.token);
      setCurrentScreen(res.student.onboarding_completed ? 'dashboard' : 'onboarding');
    } catch (err) {
      console.error('Demo login failed:', err);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      setUser({ id: res.student.user_id, email, role: 'student' });
      setStudent(res.student);
      setToken(res.token);
      if (!res.student.onboarding_completed) {
        setCurrentScreen('onboarding');
      } else {
        setCurrentScreen('dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    fullName: string;
    email: string;
    password: string;
    mobile: string;
    college: string;
    branch: string;
    graduationYear: number;
  }) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      setUser({ id: res.student.user_id, email: data.email, role: 'student' });
      setStudent(res.student);
      setToken(res.token);
      setCurrentScreen('onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
    setStudent(null);
    setToken(null);
    setCurrentScreen('login');
  };

  const refreshStudentData = async () => {
    try {
      const res = await api.getMe();
      setStudent(res.student);
    } catch (err) {
      console.error('Failed to refresh student profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        token,
        isLoading,
        isAuthenticated: !!token && !!student,
        currentScreen,
        setCurrentScreen,
        selectedJobId,
        setSelectedJobId,
        login,
        register,
        logout,
        refreshStudentData,
        loginAsDemoStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
