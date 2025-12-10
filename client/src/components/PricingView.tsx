import { SubscriptionTier } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Shield, Zap } from 'lucide-react';

type PricingPlan = {
  id: SubscriptionTier;
  name: string;
  price: string;
  accent: string;
  features: string[];
  recommended?: boolean;
  description?: string;
};

const PLANS: PricingPlan[] = [
  {
    id: 'FREE',
    name: 'Starter',
    price: '$0',
    accent: 'bg-muted text-foreground',
    description: 'Great for quick scans and testing.',
    features: ['3 scans/day', 'Core strategies (DOW, CAN SLIM, SENTIMENT, VCP)', 'Grounding disabled'],
  },
  {
    id: 'PRO',
    name: 'Professional',
    price: '$29/mo',
    accent: 'bg-fin-accent text-white',
    recommended: true,
    description: 'Unlimited scans with full AI context.',
    features: ['Unlimited scans', 'Search grounding enabled', 'All strategies unlocked'],
  },
  {
    id: 'MAX',
    name: 'Institutional',
    price: '$99/mo',
    accent: 'bg-fin-bull text-black',
    description: 'For teams and power users.',
    features: ['Unlimited scans', 'Priority support', 'API access + webhooks'],
  },
];

interface PricingViewProps {
  currentTier: SubscriptionTier;
  onUpgrade: (tier: SubscriptionTier) => void;
}

export function PricingView({ currentTier, onUpgrade }: PricingViewProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center space-y-2">
        <Badge variant="outline" className="text-xs uppercase tracking-wide">
          Pricing
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-semibold">Choose your tier</h1>
        <p className="text-muted-foreground">
          Upgrade to unlock unlimited scans, grounding search, and institutional tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isActive = currentTier === plan.id;
          return (
            <Card
              key={plan.id}
              className={`p-6 flex flex-col gap-4 bg-card/70 border border-border/70 ${
                plan.recommended ? 'ring-2 ring-fin-accent shadow-lg shadow-fin-accent/20' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </div>
                <Badge className={plan.accent}>
                  {plan.recommended ? (
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Recommended
                    </span>
                  ) : plan.id === 'MAX' ? (
                    <Shield className="w-3 h-3" />
                  ) : (
                    <Zap className="w-3 h-3" />
                  )}
                </Badge>
              </div>

              <div className="text-3xl font-bold">{plan.price}</div>

              <ul className="space-y-2 text-sm text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-fin-accent shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="mt-auto"
                variant={plan.recommended ? 'default' : 'secondary'}
                disabled={isActive}
                onClick={() => onUpgrade(plan.id)}
              >
                {isActive ? 'Current Plan' : 'Upgrade'}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

