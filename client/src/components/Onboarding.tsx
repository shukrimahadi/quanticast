import { useState } from 'react';
import { useUser } from '@/lib/UserContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Shield, Target, ChevronRight, ChevronLeft, Check, Loader2, Info } from 'lucide-react';
import { SiGoogle } from 'react-icons/si';
import { Input } from '@/components/ui/input';
import type { ExperienceLevel, TradingGoal, RiskTolerance } from '@shared/schema';

type OnboardingStep = 'LOGIN' | 'SURVEY_INFO' | 'SURVEY_1' | 'SURVEY_2' | 'SURVEY_3' | 'COMPLETE';

const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string; description: string }[] = [
  { value: 'Beginner', label: 'Beginner', description: 'New to trading, learning the basics' },
  { value: 'Intermediate', label: 'Intermediate', description: '1-3 years experience, understand key concepts' },
  { value: 'Advanced', label: 'Advanced', description: '3-10 years, profitable track record' },
  { value: 'Professional', label: 'Professional', description: '10+ years, institutional background' },
];

const GOAL_OPTIONS: { value: TradingGoal; label: string; description: string }[] = [
  { value: 'Income', label: 'Income Generation', description: 'Consistent cash flow from trading' },
  { value: 'Growth', label: 'Capital Growth', description: 'Long-term wealth accumulation' },
  { value: 'Preservation', label: 'Capital Preservation', description: 'Protect existing wealth' },
  { value: 'Speculation', label: 'Speculation', description: 'High-risk, high-reward opportunities' },
];

const RISK_OPTIONS: { value: RiskTolerance; label: string; description: string }[] = [
  { value: 'Conservative', label: 'Conservative', description: 'Minimal risk, steady returns' },
  { value: 'Moderate', label: 'Moderate', description: 'Balanced risk-reward approach' },
  { value: 'Aggressive', label: 'Aggressive', description: 'Higher risk for higher returns' },
  { value: 'Very Aggressive', label: 'Very Aggressive', description: 'Maximum risk tolerance' },
];

export function Onboarding() {
  const { login, completeOnboarding } = useUser();
  const [step, setStep] = useState<OnboardingStep>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const [experience, setExperience] = useState<ExperienceLevel>('Beginner');
  const [goal, setGoal] = useState<TradingGoal>('Growth');
  const [risk, setRisk] = useState<RiskTolerance>('Moderate');
  const [dob, setDob] = useState('');
  const [nationality, setNationality] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    login('trader@quanticast.ai', 'Quanticast Trader', undefined);
    setStep('SURVEY_INFO');
    setIsLoading(false);
  };

  const handleComplete = () => {
    completeOnboarding(experience, goal, risk, dob, nationality, address, phone);
    setStep('COMPLETE');
  };

  const getProgress = () => {
    switch (step) {
      case 'LOGIN': return 0;
      case 'SURVEY_INFO': return 25;
      case 'SURVEY_1': return 50;
      case 'SURVEY_2': return 75;
      case 'SURVEY_3': return 100;
      default: return 100;
    }
  };

  if (step === 'LOGIN') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="w-8 h-8 text-fin-accent" />
              <span className="text-2xl font-bold tracking-tight">QUANTICAST</span>
            </div>
            <h1 className="text-xl font-semibold">Welcome to QUANTICAST AI</h1>
            <p className="text-muted-foreground text-sm">
              AI-powered chart analysis with professional trading strategies
            </p>
          </div>

          <div className="space-y-4">
            <Button
              className="w-full"
              size="lg"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              data-testid="button-google-login"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <SiGoogle className="w-5 h-5 mr-2" />
              )}
              Continue with Google
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (step === 'SURVEY_INFO') {
    const infoComplete = dob && nationality && address && phone;
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-fin-accent">
              <Info className="w-5 h-5" />
              <span className="text-sm font-medium">Step 1 of 4</span>
            </div>
            <Progress value={getProgress()} className="h-2" />
            <h2 className="text-xl font-semibold mt-4">Tell us about you</h2>
            <p className="text-muted-foreground text-sm">
              We use this info to personalize onboarding and compliance checks.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="dob">Date of birth</Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="e.g., Malaysian"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="address">Home address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, city, country"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+60 12 345 6789"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => setStep('SURVEY_1')}
              disabled={!infoComplete}
              data-testid="button-next-info"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (step === 'SURVEY_1') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-fin-accent">
              <Target className="w-5 h-5" />
              <span className="text-sm font-medium">Step 2 of 4</span>
            </div>
            <Progress value={getProgress()} className="h-2" />
            <h2 className="text-xl font-semibold mt-4">What's your trading experience?</h2>
            <p className="text-muted-foreground text-sm">
              This helps us tailor AI analysis to your skill level
            </p>
          </div>

          <RadioGroup
            value={experience}
            onValueChange={(v) => setExperience(v as ExperienceLevel)}
            className="space-y-3"
          >
            {EXPERIENCE_OPTIONS.map((option) => (
              <Label
                key={option.value}
                htmlFor={`exp-${option.value}`}
                className="flex items-center gap-4 p-4 rounded-md border cursor-pointer hover-elevate data-[state=checked]:border-fin-accent"
                data-state={experience === option.value ? 'checked' : 'unchecked'}
              >
                <RadioGroupItem value={option.value} id={`exp-${option.value}`} />
                <div className="flex-1">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
              </Label>
            ))}
          </RadioGroup>

          <div className="flex justify-end">
            <Button onClick={() => setStep('SURVEY_2')} data-testid="button-next-step">
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (step === 'SURVEY_2') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-fin-accent">
              <Target className="w-5 h-5" />
              <span className="text-sm font-medium">Step 3 of 4</span>
            </div>
            <Progress value={getProgress()} className="h-2" />
            <h2 className="text-xl font-semibold mt-4">What's your primary trading goal?</h2>
            <p className="text-muted-foreground text-sm">
              We'll prioritize setups that align with your objectives
            </p>
          </div>

          <RadioGroup
            value={goal}
            onValueChange={(v) => setGoal(v as TradingGoal)}
            className="space-y-3"
          >
            {GOAL_OPTIONS.map((option) => (
              <Label
                key={option.value}
                htmlFor={`goal-${option.value}`}
                className="flex items-center gap-4 p-4 rounded-md border cursor-pointer hover-elevate data-[state=checked]:border-fin-accent"
                data-state={goal === option.value ? 'checked' : 'unchecked'}
              >
                <RadioGroupItem value={option.value} id={`goal-${option.value}`} />
                <div className="flex-1">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
              </Label>
            ))}
          </RadioGroup>

          <div className="flex justify-between gap-4">
            <Button variant="outline" onClick={() => setStep('SURVEY_1')} data-testid="button-prev-step">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <Button onClick={() => setStep('SURVEY_3')} data-testid="button-next-step">
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (step === 'SURVEY_3') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-fin-accent">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Step 4 of 4</span>
            </div>
            <Progress value={getProgress()} className="h-2" />
            <h2 className="text-xl font-semibold mt-4">What's your risk tolerance?</h2>
            <p className="text-muted-foreground text-sm">
              This affects how we grade setups and warn about volatility
            </p>
          </div>

          <RadioGroup
            value={risk}
            onValueChange={(v) => setRisk(v as RiskTolerance)}
            className="space-y-3"
          >
            {RISK_OPTIONS.map((option) => (
              <Label
                key={option.value}
                htmlFor={`risk-${option.value}`}
                className="flex items-center gap-4 p-4 rounded-md border cursor-pointer hover-elevate data-[state=checked]:border-fin-accent"
                data-state={risk === option.value ? 'checked' : 'unchecked'}
              >
                <RadioGroupItem value={option.value} id={`risk-${option.value}`} />
                <div className="flex-1">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
              </Label>
            ))}
          </RadioGroup>

          <div className="flex justify-between gap-4">
            <Button variant="outline" onClick={() => setStep('SURVEY_2')} data-testid="button-prev-step">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <Button onClick={handleComplete} data-testid="button-complete-onboarding">
              Complete Setup
              <Check className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
