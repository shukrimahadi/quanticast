import KeyLevels from '../KeyLevels';

export default function KeyLevelsExample() {
  // todo: remove mock functionality
  const mockLevels = {
    'resistance_1': '$195.50',
    'resistance_2': '$210.00',
    'support_1': '$182.00',
    'support_2': '$175.50',
    'pivot': '$188.00',
  };

  return (
    <div className="p-4 bg-background max-w-md">
      <KeyLevels levels={mockLevels} />
    </div>
  );
}
