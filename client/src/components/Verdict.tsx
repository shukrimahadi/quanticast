import { Card } from '@/components/ui/card';
import { FileText, ExternalLink } from 'lucide-react';
import { ExternalData } from '@/lib/types';

interface VerdictProps {
  headline: string;
  reasoning: string;
  verdict: string;
  externalData?: ExternalData;
}

export default function Verdict({ headline, reasoning, verdict, externalData }: VerdictProps) {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Analysis Summary
        </h3>
      </div>

      <div className="space-y-3">
        <h4 className="text-lg font-semibold">{headline}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{reasoning}</p>
        
        <div className="p-3 bg-muted/50 rounded-md">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Final Verdict</span>
          <p className="font-medium mt-1">{verdict}</p>
        </div>
      </div>

      {externalData && externalData.sources.length > 0 && (
        <div className="border-t border-border pt-4 space-y-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Sources</span>
          <div className="space-y-1">
            {externalData.sources.slice(0, 3).map((source, index) => (
              <a
                key={index}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-fin-accent hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                <span className="truncate">{source.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
