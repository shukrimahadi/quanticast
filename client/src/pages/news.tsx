import { useState } from 'react';
import { Link } from 'wouter';
import { useTicker } from '@/lib/TickerContext';
import { TradingViewNews } from '@/components/TradingViewNews';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Newspaper, Search, ArrowLeft, TrendingUp } from 'lucide-react';

export default function News() {
  const { activeTicker, setActiveTicker } = useTicker();
  const [tickerInput, setTickerInput] = useState<string>('');

  const handleTickerSearch = () => {
    const val = tickerInput.trim().toUpperCase();
    if (val) {
      const formatted = val.includes(':') ? val : `NASDAQ:${val}`;
      setActiveTicker(formatted);
      setTickerInput('');
    }
  };

  const handleTickerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTickerSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton onBackClick={() => {}} />
      
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Newspaper className="w-6 h-6 text-fin-accent" />
            <h1 className="text-2xl font-semibold">Market News</h1>
            <span className="text-sm text-muted-foreground">({activeTicker})</span>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Link href="/">
              <Button variant="outline" size="sm" data-testid="link-back-analysis">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Analysis
              </Button>
            </Link>
          </div>
        </div>

        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>Showing news for: <strong className="text-foreground">{activeTicker}</strong></span>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Enter ticker (e.g., AAPL, BTCUSD)"
                value={tickerInput}
                onChange={(e) => setTickerInput(e.target.value)}
                onKeyDown={handleTickerKeyDown}
                className="w-64"
                data-testid="input-news-ticker"
              />
              <Button variant="outline" size="icon" onClick={handleTickerSearch} data-testid="button-news-search">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        <TradingViewNews symbol={activeTicker} />

        <p className="text-xs text-muted-foreground text-center">
          News timeline powered by TradingView. Updates automatically based on selected ticker.
        </p>
      </main>
    </div>
  );
}
