import PatternsList from '../PatternsList';

export default function PatternsListExample() {
  // todo: remove mock functionality
  const mockPatterns = [
    'Fair Value Gap',
    'Order Block',
    'Liquidity Sweep',
    'Break of Structure',
    'Change of Character'
  ];

  return (
    <div className="p-4 bg-background max-w-md">
      <PatternsList patterns={mockPatterns} trend="BULLISH" />
    </div>
  );
}
