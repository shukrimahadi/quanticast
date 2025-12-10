import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TickerProvider } from "@/lib/TickerContext";
import { UserProvider, useUser } from "@/lib/UserContext";
import { Onboarding } from "@/components/Onboarding";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import News from "@/pages/news";
import HistoryPage from "@/pages/history";
import Landing from "@/pages/landing";
import Account from "@/pages/account";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin";

function AppRouter() {
  return (
    <Switch>
      <Route path="/app" component={Home} />
      <Route path="/news" component={News} />
      <Route path="/history" component={HistoryPage} />
      <Route path="/account" component={Account} />
      <Route path="/" component={Landing} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AdminRouter() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/console" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthenticatedApp() {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Onboarding />;
  }

  return (
    <TickerProvider>
      <AppRouter />
    </TickerProvider>
  );
}

function App() {
  const isAdminPath = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserProvider>
          <Toaster />
          {isAdminPath ? <AdminRouter /> : <AuthenticatedApp />}
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
