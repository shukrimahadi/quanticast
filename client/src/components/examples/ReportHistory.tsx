import ReportHistory from '../ReportHistory';
import { StrategyType } from '@/lib/types';

export default function ReportHistoryExample() {
  // todo: remove mock functionality
  const mockReports = [
    {
      id: '1',
      timestamp: Date.now() - 3600000,
      ticker: 'AAPL',
      strategy: StrategyType.SMC,
      grade: 'A+',
      bias: 'BULLISH',
      data: {} as any,
      validation: { is_valid_chart: true, rejection_reason: null },
    },
    {
      id: '2',
      timestamp: Date.now() - 7200000,
      ticker: 'TSLA',
      strategy: StrategyType.VCP,
      grade: 'B',
      bias: 'BEARISH',
      data: {} as any,
      validation: { is_valid_chart: true, rejection_reason: null },
    },
  ];

  return (
    <div className="p-4 bg-background max-w-2xl">
      <ReportHistory
        reports={mockReports}
        onBack={() => console.log('Back')}
        onViewReport={(r) => console.log('View report:', r.id)}
        onDeleteReport={(id) => console.log('Delete report:', id)}
      />
    </div>
  );
}
