import AnalysisLogs from '../AnalysisLogs';

export default function AnalysisLogsExample() {
  // todo: remove mock functionality
  const mockLogs = [
    'Starting chart validation...',
    'Chart validated: AAPL 4H timeframe',
    'Initializing SMC analysis pipeline...',
    'Detecting liquidity zones...',
    'Found 3 Fair Value Gaps',
    'Analyzing market structure...',
    'Grounding with real-time data...',
  ];

  return (
    <div className="p-4 bg-background max-w-lg">
      <AnalysisLogs logs={mockLogs} />
    </div>
  );
}
