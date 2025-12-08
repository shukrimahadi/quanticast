import ScoreCard from '../ScoreCard';
import { Eye, Database, Users, Target, TrendingUp } from 'lucide-react';

export default function ScoreCardExample() {
  return (
    <div className="p-4 bg-background grid grid-cols-2 gap-3 max-w-md">
      <ScoreCard label="Visual" value={85} icon={Eye} />
      <ScoreCard label="Data" value={72} icon={Database} />
      <ScoreCard label="Sentiment" value={90} icon={Users} />
      <ScoreCard label="Risk/Reward" value={45} icon={Target} />
    </div>
  );
}
