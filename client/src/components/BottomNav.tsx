import { Link, useLocation } from "wouter";
import { TrendingUp, Newspaper, History, ShieldCheck, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home, testId: "nav-home" },
  { href: "/news", label: "News", icon: Newspaper, testId: "nav-news" },
  { href: "/history", label: "History", icon: History, testId: "nav-history" },
  { href: "/admin", label: "Admin", icon: ShieldCheck, testId: "nav-admin" },
  { href: "/analysis", label: "Market", icon: TrendingUp, testId: "nav-analysis" },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-3 inset-x-0 px-4 z-50 md:hidden">
      <div className="flex items-center justify-between rounded-2xl bg-card/80 border border-white/5 shadow-lg shadow-black/30 backdrop-blur-xl px-3 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location === item.href || (item.href === "/" && location === "/analysis");
          return (
            <Link key={item.href} href={item.href}>
              <a
                data-testid={item.testId}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-medium transition-colors",
                  active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

