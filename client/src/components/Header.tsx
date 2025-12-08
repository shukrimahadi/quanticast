import { Link, useLocation } from 'wouter';
import { Activity, History, BarChart3, Newspaper, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export default function Header({ showBackButton, onBackClick }: HeaderProps) {
  const [location] = useLocation();

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
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-md bg-fin-accent flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold tracking-tight">QUANTICAST</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground -mt-1">AI</span>
              </div>
            </div>
          </Link>
        </div>

        <nav className="hidden sm:flex items-center gap-1">
          <Link href="/">
            <Button
              variant={location === '/' ? 'secondary' : 'ghost'}
              size="sm"
              className="gap-2"
              data-testid="nav-analysis"
            >
              <TrendingUp className="w-4 h-4" />
              Analysis
            </Button>
          </Link>
          <Link href="/news">
            <Button
              variant={location === '/news' ? 'secondary' : 'ghost'}
              size="sm"
              className="gap-2"
              data-testid="nav-news"
            >
              <Newspaper className="w-4 h-4" />
              News
            </Button>
          </Link>
          <Link href="/history">
            <Button
              variant={location === '/history' ? 'secondary' : 'ghost'}
              size="sm"
              className="gap-2"
              data-testid="nav-history"
            >
              <History className="w-4 h-4" />
              History
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Chart Analysis Engine</span>
          </div>
          <Link href="/history" className="sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              data-testid="button-history-mobile"
            >
              <History className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
