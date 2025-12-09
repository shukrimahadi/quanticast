import { useState } from 'react';
import { Link } from 'wouter';
import { useTicker } from '@/lib/TickerContext';
import { TradingViewNews } from '@/components/TradingViewNews';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Newspaper, Search, ArrowLeft, TrendingUp, Globe } from 'lucide-react';

const SYMBOL_ALIASES: Record<string, string> = {
  'BITCOIN': 'BINANCE:BTCUSDT',
  'BTC': 'BINANCE:BTCUSDT',
  'BTCUSD': 'BITSTAMP:BTCUSD',
  'ETHEREUM': 'BINANCE:ETHUSDT',
  'ETH': 'BINANCE:ETHUSDT',
  'ETHUSD': 'BITSTAMP:ETHUSD',
  'SOL': 'BINANCE:SOLUSDT',
  'XRP': 'BINANCE:XRPUSDT',
  'DOGE': 'BINANCE:DOGEUSDT',
  'GOLD': 'TVC:GOLD',
  'XAUUSD': 'OANDA:XAUUSD',
  'SILVER': 'TVC:SILVER',
  'XAGUSD': 'OANDA:XAGUSD',
  'OIL': 'TVC:USOIL',
  'USOIL': 'TVC:USOIL',
  'CRUDE': 'TVC:USOIL',
  'BRENT': 'TVC:UKOIL',
  'NATGAS': 'TVC:NATGAS',
  'EURUSD': 'OANDA:EURUSD',
  'GBPUSD': 'OANDA:GBPUSD',
  'USDJPY': 'OANDA:USDJPY',
  'USDCHF': 'OANDA:USDCHF',
  'AUDUSD': 'OANDA:AUDUSD',
  'USDCAD': 'OANDA:USDCAD',
  'NZDUSD': 'OANDA:NZDUSD',
  'EURGBP': 'OANDA:EURGBP',
  'EURJPY': 'OANDA:EURJPY',
  'GBPJPY': 'OANDA:GBPJPY',
  'DXY': 'TVC:DXY',
  'SPX': 'SP:SPX',
  'SPY': 'AMEX:SPY',
  'QQQ': 'NASDAQ:QQQ',
  'DJI': 'DJ:DJI',
  'DOW': 'DJ:DJI',
  'NDX': 'NASDAQ:NDX',
  'VIX': 'CBOE:VIX',
};

function normalizeSymbol(input: string): string {
  const upper = input.trim().toUpperCase();
  
  if (upper.includes(':')) {
    return upper;
  }
  
  if (SYMBOL_ALIASES[upper]) {
    return SYMBOL_ALIASES[upper];
  }
  
  return `NASDAQ:${upper}`;
}

export default function News() {
  const { activeTicker, setActiveTicker } = useTicker();
  const [tickerInput, setTickerInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('market');

  const handleTickerSearch = () => {
    const val = tickerInput.trim();
    if (val) {
      const formatted = normalizeSymbol(val);
      setActiveTicker(formatted);
      setTickerInput('');
      setActiveTab('symbol');
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
              <span>Search for symbol-specific news or view general market updates</span>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="AAPL, BTC, GOLD, OIL..."
                value={tickerInput}
                onChange={(e) => setTickerInput(e.target.value)}
                onKeyDown={handleTickerKeyDown}
                className="w-48"
                data-testid="input-news-ticker"
              />
              <Button variant="outline" size="icon" onClick={handleTickerSearch} data-testid="button-news-search">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="market" className="gap-2" data-testid="tab-market-news">
              <Globe className="w-4 h-4" />
              Market News
            </TabsTrigger>
            <TabsTrigger value="symbol" className="gap-2" data-testid="tab-symbol-news">
              <TrendingUp className="w-4 h-4" />
              {activeTicker.split(':').pop()}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="market" className="mt-4">
            <TradingViewNews feedMode="market" />
          </TabsContent>
          <TabsContent value="symbol" className="mt-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Showing news for: <strong className="text-foreground">{activeTicker}</strong>
              </p>
              <TradingViewNews symbol={activeTicker} feedMode="symbol" />
              <p className="text-xs text-muted-foreground">
                Supports stocks (AAPL, TSLA), crypto (BTC, ETH), commodities (GOLD, OIL), forex (EURUSD), and indices (SPX, VIX).
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-muted-foreground text-center">
          News timeline powered by TradingView. Updates automatically.
        </p>
      </main>
    </div>
  );
}
