import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserProfile, ExperienceLevel, TradingGoal, RiskTolerance } from '@shared/schema';

interface UserContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, displayName: string, photoUrl?: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  completeOnboarding: (experience: ExperienceLevel, goal: TradingGoal, risk: RiskTolerance) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'quanticast_user';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (email: string, displayName: string, photoUrl?: string) => {
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      email,
      displayName,
      photoUrl,
      experienceLevel: 'Beginner',
      tradingGoal: 'Growth',
      riskTolerance: 'Moderate',
      onboardingCompleted: false,
      createdAt: Date.now(),
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const completeOnboarding = (experience: ExperienceLevel, goal: TradingGoal, risk: RiskTolerance) => {
    if (user) {
      setUser({
        ...user,
        experienceLevel: experience,
        tradingGoal: goal,
        riskTolerance: risk,
        onboardingCompleted: true,
      });
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      isAuthenticated: !!user && user.onboardingCompleted,
      isLoading,
      login,
      logout,
      updateProfile,
      completeOnboarding,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
