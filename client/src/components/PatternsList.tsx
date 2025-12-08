import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface PatternsListProps {
  patterns: string[];
  trend: string;
}

export default function PatternsList({ patterns, trend }: PatternsListProps) {
  const isBullish = trend.toLowerCase().includes('bull') || 
                    trend.toLowerCase().includes('up');

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Detected Patterns
          </h3>
        </div>
        <Badge 
          variant="outline" 
          className={isBullish ? 'text-fin-bull border-fin-bull/30' : 'text-fin-bear border-fin-bear/30'}
        >
          {trend}
        </Badge>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {patterns.length === 0 ? (
          <span className="text-sm text-muted-foreground">No patterns detected</span>
        ) : (
          patterns.map((pattern, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {pattern}
            </Badge>
          ))
        )}
      </div>
    </Card>
  );
}
