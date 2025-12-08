import { Activity, History, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onHistoryClick?: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export default function Header({ onHistoryClick, showBackButton, onBackClick }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {showBackButton && onBackClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              data-testid="button-back"
            >
              Back
            </Button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-fin-accent flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight">QUANTICAST</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground -mt-1">AI</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Chart Analysis Engine</span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onHistoryClick}
          data-testid="button-history"
        >
          <History className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
