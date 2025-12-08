import ConfidenceMeter from '../ConfidenceMeter';

export default function ConfidenceMeterExample() {
  return (
    <div className="p-4 bg-background max-w-sm">
      <ConfidenceMeter score={78} />
    </div>
  );
}
