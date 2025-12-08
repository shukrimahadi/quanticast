import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Gauge } from 'lucide-react';

interface ConfidenceMeterProps {
  score: number;
}

export default function ConfidenceMeter({ score }: ConfidenceMeterProps) {
  const getConfidenceColor = () => {
    if (score >= 80) return 'text-fin-bull';
    if (score >= 60) return 'text-amber-400';
    return 'text-fin-bear';
  };

  const getConfidenceLabel = () => {
    if (score >= 80) return 'High Confidence';
    if (score >= 60) return 'Moderate';
    return 'Low Confidence';
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Confidence Score
          </h3>
        </div>
        <div className={`text-right ${getConfidenceColor()}`}>
          <span className="text-2xl font-mono font-bold">{score}%</span>
        </div>
      </div>
      
      <Progress value={score} className="h-2" />
      
      <p className={`text-xs text-center ${getConfidenceColor()}`}>
        {getConfidenceLabel()}
      </p>
    </Card>
  );
}
