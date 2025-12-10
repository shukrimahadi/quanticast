import { useState } from 'react';
import { StrategyType, StrategyInfo, TIER_LIMITS, SubscriptionTier } from '@/lib/types';
import { STRATEGIES } from '@/lib/constants';
import { Card } from '@/components/ui/card';
import { TrendingUp, Waves, BarChart2, LineChart, Activity, CircleDot, Target, Layers, Clock, AlertTriangle, GitBranch, Sparkles, Users, Crosshair, Lock } from 'lucide-react';

interface StrategySelectorProps {
  selected: StrategyType;
  onSelect: (strategy: StrategyType) => void;
  userTier: SubscriptionTier;
  onUpgradeClick: (tier: SubscriptionTier) => void;
}

const strategyIcons: Record<StrategyType, typeof TrendingUp> = {
  [StrategyType.SMC]: Target,
  [StrategyType.ICT_2022]: Crosshair,
  [StrategyType.LIQUIDITY_FLOW]: Waves,
  [StrategyType.VCP]: BarChart2,
  [StrategyType.CAN_SLIM]: TrendingUp,
  [StrategyType.ELLIOTT]: LineChart,
  [StrategyType.DOW]: Activity,
  [StrategyType.GANN]: CircleDot,
  [StrategyType.WYCKOFF]: Layers,
  [StrategyType.INVESTMENT_CLOCK]: Clock,
  [StrategyType.LPPL]: AlertTriangle,
  [StrategyType.INTERMARKET]: GitBranch,
  [StrategyType.FRACTAL]: Sparkles,
  [StrategyType.SENTIMENT]: Users,
};

export default function StrategySelector({ selected, onSelect, userTier, onUpgradeClick }: StrategySelectorProps) {
  const [hoveredId, setHoveredId] = useState<StrategyType | null>(null);
  const allowedStrategies = TIER_LIMITS[userTier].allowedStrategies;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Select Strategy
        </h3>
        <span className="text-xs text-muted-foreground">
          {STRATEGIES.length} available
        </span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {STRATEGIES.map((strategy) => {
          const Icon = strategyIcons[strategy.id];
          const isSelected = selected === strategy.id;
          const isHovered = hoveredId === strategy.id;
          const isLocked = !allowedStrategies.includes(strategy.id);
          const lockedClasses = isLocked ? 'opacity-50 saturate-75' : '';
          
          return (
            <Card
              key={strategy.id}
              className={`
                p-3 cursor-pointer transition-all duration-200 hover-elevate
                ${isSelected 
                  ? 'ring-2 ring-fin-accent bg-fin-accent/10' 
                  : 'bg-card'
                }
                ${isLocked ? 'border-dashed border-border/70' : ''}
              `}
              onClick={() => {
                if (isLocked) {
                  onUpgradeClick(userTier);
                  return;
                }
                onSelect(strategy.id);
              }}
              onMouseEnter={() => setHoveredId(strategy.id)}
              onMouseLeave={() => setHoveredId(null)}
              data-testid={`strategy-card-${strategy.id}`}
            >
              <div className={`flex flex-col gap-2 ${lockedClasses}`}>
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-fin-accent' : 'text-muted-foreground'}`} />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {strategy.style}
                  </span>
                  {isLocked && (
                    <div className="ml-auto flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-sm leading-tight">{strategy.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {strategy.description}
                  </p>
                  {isLocked && (
                    <p className="text-[11px] text-fin-accent mt-2">
                      Upgrade to unlock this strategy
                    </p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
