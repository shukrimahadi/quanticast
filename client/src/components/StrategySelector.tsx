import { useMemo, useState } from 'react';
import { StrategyType, StrategyInfo, StrategyBucket } from '@/lib/types';
import { STRATEGIES } from '@/lib/constants';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Waves, BarChart2, LineChart, Activity, CircleDot, Target, Layers, Clock, AlertTriangle, GitBranch, Sparkles, Users, Crosshair } from 'lucide-react';

interface StrategySelectorProps {
  selected: StrategyType;
  onSelect: (strategy: StrategyType) => void;
}

const BUCKET_FILTERS: Array<{ key: StrategyBucket | 'ALL'; label: string }> = [
  { key: 'ALL', label: 'All' },
  { key: StrategyBucket.INTRADAY, label: 'Intraday/Day' },
  { key: StrategyBucket.SWING, label: 'Swing/Momentum' },
  { key: StrategyBucket.MACRO, label: 'Macro/Position' },
  { key: StrategyBucket.RISK, label: 'Risk Overlay' },
];

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
  const [filter, setFilter] = useState<StrategyBucket | 'ALL'>('ALL');

  const filteredStrategies = useMemo(() => {
    return filter === 'ALL' ? STRATEGIES : STRATEGIES.filter((s) => s.bucket === filter);
  }, [filter]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Select Strategy
          </h3>
          <Badge variant="outline" className="text-[11px] text-muted-foreground border-white/10">
            {filteredStrategies.length} shown / {STRATEGIES.length} total
          </Badge>
        </div>
        <div className="flex flex-wrap gap-1 text-xs">
          {BUCKET_FILTERS.map((b) => (
            <button
              key={b.key}
              onClick={() => setFilter(b.key)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] transition-colors ${
                filter === b.key
                  ? 'border-fin-accent text-fin-accent bg-fin-accent/10'
                  : 'border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {filteredStrategies.map((strategy) => {
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
                  : 'bg-card/80'
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
                    {strategy.bucket}
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
