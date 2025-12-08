import { Card } from '@/components/ui/card';
import { Layers } from 'lucide-react';

interface KeyLevelsProps {
  levels: { [key: string]: string };
}

export default function KeyLevels({ levels }: KeyLevelsProps) {
  const entries = Object.entries(levels);
  
  if (entries.length === 0) return null;

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Layers className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Key Levels
        </h3>
      </div>
      
      <div className="space-y-2">
        {entries.map(([label, value], index) => (
          <div 
            key={label}
            className={`
              flex items-center justify-between py-2 px-3 rounded-md text-sm
              ${index % 2 === 0 ? 'bg-muted/50' : 'bg-background'}
            `}
          >
            <span className="text-muted-foreground capitalize">
              {label.replace(/_/g, ' ')}
            </span>
            <span className="font-mono font-medium">{value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
