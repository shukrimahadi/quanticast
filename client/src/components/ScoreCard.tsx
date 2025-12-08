import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';

interface ScoreCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  maxValue?: number;
}

export default function ScoreCard({ label, value, icon: Icon, maxValue = 100 }: ScoreCardProps) {
  const percentage = (value / maxValue) * 100;
  
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-fin-bull';
    if (percentage >= 60) return 'text-amber-400';
    return 'text-fin-bear';
  };

  return (
    <Card className="p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
        </div>
        <span className={`text-lg font-mono font-bold ${getScoreColor()}`}>
          {value}
        </span>
      </div>
      <Progress value={percentage} className="h-1.5" />
    </Card>
  );
}
