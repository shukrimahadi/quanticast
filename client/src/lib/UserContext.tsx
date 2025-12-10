import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserProfile, ExperienceLevel, TradingGoal, RiskTolerance, SubscriptionTier } from '@shared/schema';

interface UserContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, displayName: string, photoUrl?: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  completeOnboarding: (
    experience: ExperienceLevel,
    goal: TradingGoal,
    risk: RiskTolerance,
    dob: string,
    nationality: string,
    address: string,
    phone: string
  ) => void;
  upgradeTier: (tier: SubscriptionTier) => void;
  incrementUsage: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'quanticast_user';
const TODAY = () => new Date().toISOString().slice(0, 10);
const DEFAULT_TIER: SubscriptionTier = 'FREE';
const EMPTY_PROFILE_FIELDS = {
  dob: '',
  nationality: '',
  address: '',
  phone: '',
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UserProfile;
        const hydrated: UserProfile = {
          ...parsed,
          subscriptionTier: parsed.subscriptionTier ?? DEFAULT_TIER,
          dailyUsageCount: parsed.dailyUsageCount ?? 0,
          lastUsageDate: parsed.lastUsageDate ?? TODAY(),
          dob: parsed.dob ?? '',
          nationality: parsed.nationality ?? '',
          address: parsed.address ?? '',
          phone: parsed.phone ?? '',
        };
        setUser(hydrated);
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const today = TODAY();
    if (user.lastUsageDate !== today) {
      setUser({
        ...user,
        dailyUsageCount: 0,
        lastUsageDate: today,
      });
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
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
      subscriptionTier: DEFAULT_TIER,
      dailyUsageCount: 0,
      lastUsageDate: TODAY(),
      ...EMPTY_PROFILE_FIELDS,
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

  const completeOnboarding = (
    experience: ExperienceLevel,
    goal: TradingGoal,
    risk: RiskTolerance,
    dob: string,
    nationality: string,
    address: string,
    phone: string
  ) => {
    if (user) {
      setUser({
        ...user,
        experienceLevel: experience,
        tradingGoal: goal,
        riskTolerance: risk,
        onboardingCompleted: true,
        dob,
        nationality,
        address,
        phone,
      });
    }
  };

  const upgradeTier = (tier: SubscriptionTier) => {
    if (user) {
      setUser({
        ...user,
        subscriptionTier: tier,
      });
    }
  };

  const incrementUsage = () => {
    if (user) {
      setUser({
        ...user,
        dailyUsageCount: user.dailyUsageCount + 1,
        lastUsageDate: TODAY(),
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
      upgradeTier,
      incrementUsage,
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
