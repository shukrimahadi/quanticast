import { Report } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReportCard from './ReportCard';
import { ArrowLeft, FileText } from 'lucide-react';

interface ReportHistoryProps {
  reports: Report[];
  onBack: () => void;
  onViewReport: (report: Report) => void;
  onDeleteReport: (id: string) => void;
}

export default function ReportHistory({ reports, onBack, onViewReport, onDeleteReport }: ReportHistoryProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back-history">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Analysis History</h2>
            <p className="text-sm text-muted-foreground">{reports.length} reports saved</p>
          </div>
        </div>
      </div>

      {reports.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">No reports yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your analyzed charts will appear here
              </p>
            </div>
            <Button onClick={onBack} data-testid="button-analyze-first">
              Analyze Your First Chart
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onView={() => onViewReport(report)}
              onDelete={() => onDeleteReport(report.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
