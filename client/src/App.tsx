import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TickerProvider } from "@/lib/TickerContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import News from "@/pages/news";
import HistoryPage from "@/pages/history";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/news" component={News} />
      <Route path="/history" component={HistoryPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TickerProvider>
          <Toaster />
          <Router />
        </TickerProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
