import { useState } from 'react';
import { StrategyType, StrategyInfo } from '@/lib/types';
import { STRATEGIES } from '@/lib/constants';
import { Card } from '@/components/ui/card';
import { TrendingUp, Waves, BarChart2, LineChart, Activity, CircleDot, Target, Layers, Clock, AlertTriangle, GitBranch, Sparkles, Users, Crosshair } from 'lucide-react';

interface StrategySelectorProps {
  selected: StrategyType;
  onSelect: (strategy: StrategyType) => void;
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

export default function StrategySelector({ selected, onSelect }: StrategySelectorProps) {
  const [hoveredId, setHoveredId] = useState<StrategyType | null>(null);

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
          
          return (
            <Card
              key={strategy.id}
              className={`
                p-3 cursor-pointer transition-all duration-200 hover-elevate
                ${isSelected 
                  ? 'ring-2 ring-fin-accent bg-fin-accent/10' 
                  : 'bg-card'
                }
              `}
              onClick={() => onSelect(strategy.id)}
              onMouseEnter={() => setHoveredId(strategy.id)}
              onMouseLeave={() => setHoveredId(null)}
              data-testid={`strategy-card-${strategy.id}`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-fin-accent' : 'text-muted-foreground'}`} />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {strategy.style}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-sm leading-tight">{strategy.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {strategy.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
