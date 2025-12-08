import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Terminal } from 'lucide-react';

interface AnalysisLogsProps {
  logs: string[];
}

export default function AnalysisLogs({ logs }: AnalysisLogsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Terminal className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Analysis Log
        </h3>
      </div>
      
      <div
        ref={scrollRef}
        className="h-40 overflow-y-auto bg-background rounded-md p-3 font-mono text-xs space-y-1"
      >
        {logs.length === 0 ? (
          <span className="text-muted-foreground">Waiting for analysis...</span>
        ) : (
          logs.map((log, index) => {
            const timestamp = new Date().toLocaleTimeString();
            return (
              <div key={index} className="flex gap-2 animate-fade-in">
                <span className="text-muted-foreground shrink-0">[{timestamp}]</span>
                <span className="text-foreground">{log}</span>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
