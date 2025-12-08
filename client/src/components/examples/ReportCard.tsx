import ReportCard from '../ReportCard';
import { StrategyType } from '@/lib/types';

export default function ReportCardExample() {
  // todo: remove mock functionality
  const mockReport = {
    id: '1',
    timestamp: Date.now() - 3600000,
    ticker: 'AAPL',
    strategy: StrategyType.SMC,
    grade: 'A+',
    bias: 'BULLISH',
    data: {} as any,
    validation: { is_valid_chart: true, rejection_reason: null },
  };

  return (
    <div className="p-4 bg-background max-w-lg">
      <ReportCard
        report={mockReport}
        onView={() => console.log('View report')}
        onDelete={() => console.log('Delete report')}
      />
    </div>
  );
}
