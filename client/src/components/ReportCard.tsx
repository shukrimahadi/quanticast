import { Report } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import GradeBadge from './GradeBadge';
import { ChevronRight, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface ReportCardProps {
  report: Report;
  onView: () => void;
  onDelete: () => void;
}

export default function ReportCard({ report, onView, onDelete }: ReportCardProps) {
  const isBullish = report.bias.toLowerCase().includes('bull') || 
                    report.bias.toLowerCase().includes('long');
  
  const formattedDate = new Date(report.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Card className="p-4 hover-elevate">
      <div className="flex items-center gap-4">
        <GradeBadge grade={report.grade as any} size="md" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xl font-mono font-bold">{report.ticker}</span>
            <Badge 
              variant="outline" 
              className={isBullish ? 'text-fin-bull border-fin-bull/30' : 'text-fin-bear border-fin-bear/30'}
            >
              {isBullish ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {report.bias}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span>{report.strategy}</span>
            <span>·</span>
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            data-testid={`button-delete-report-${report.id}`}
          >
            <Trash2 className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onView}
            data-testid={`button-view-report-${report.id}`}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
