import { Link, useLocation } from 'wouter';
import { Activity, History, BarChart3, Newspaper, TrendingUp, LogOut, User, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/lib/UserContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
}

function UserMenu() {
  const { user, logout } = useUser();
  
  if (!user) return null;

  const initials = user.displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" data-testid="button-user-menu">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs bg-fin-accent text-white">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            {user.nationality && (
              <p className="text-[11px] leading-none text-muted-foreground">
                {user.nationality} {user.phone ? `• ${user.phone}` : ''}
              </p>
            )}
            {user.dob && (
              <p className="text-[11px] leading-none text-muted-foreground">
                DOB: {user.dob}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xs text-muted-foreground cursor-default" disabled>
          <User className="w-3.5 h-3.5 mr-2" />
          {user.experienceLevel} / {user.riskTolerance}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} data-testid="button-logout">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
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
          <Link href="/admin">
            <Button
              variant={location === '/admin' ? 'secondary' : 'ghost'}
              size="sm"
              className="gap-2"
              data-testid="nav-admin"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
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
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
