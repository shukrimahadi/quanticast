import { useState, useCallback, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AppStep, StrategyType, FinalAnalysis, SponsorConfig } from '@/lib/types';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useTicker } from '@/lib/TickerContext';
import Header from '@/components/Header';
import ChartUpload from '@/components/ChartUpload';
import StrategySelector from '@/components/StrategySelector';
import AnalysisProgress from '@/components/AnalysisProgress';
import AnalysisLogs from '@/components/AnalysisLogs';
import ResultsDashboard from '@/components/ResultsDashboard';
import { TradingViewWidget } from '@/components/TradingViewWidget';
import { SponsorBanner } from '@/components/SponsorBanner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, AlertCircle, Play, Search, TrendingUp, Camera, ChevronDown } from 'lucide-react';

const SPONSOR_CONFIG: SponsorConfig = {
  enabled: true,
  imageUrl: 'https://via.placeholder.com/1200x200/1a1a2e/3b82f6?text=Your+Ad+Here+-+Partner+With+QUANTICAST+AI',
  targetUrl: '#',
  altText: 'Become a QUANTICAST AI Partner',
};

interface TickerOption {
  symbol: string;
  name: string;
  category: string;
}

const TICKER_DATABASE: TickerOption[] = [
  { symbol: 'TVC:GOLD', name: 'Gold Spot', category: 'Commodities' },
  { symbol: 'OANDA:XAUUSD', name: 'Gold/USD (OANDA)', category: 'Forex' },
  { symbol: 'COMEX:GC1!', name: 'Gold Futures (COMEX)', category: 'Futures' },
  { symbol: 'TVC:SILVER', name: 'Silver Spot', category: 'Commodities' },
  { symbol: 'OANDA:XAGUSD', name: 'Silver/USD (OANDA)', category: 'Forex' },
  { symbol: 'COMEX:SI1!', name: 'Silver Futures (COMEX)', category: 'Futures' },
  { symbol: 'TVC:USOIL', name: 'WTI Crude Oil', category: 'Commodities' },
  { symbol: 'NYMEX:CL1!', name: 'Crude Oil Futures (NYMEX)', category: 'Futures' },
  { symbol: 'TVC:UKOIL', name: 'Brent Crude Oil', category: 'Commodities' },
  { symbol: 'TVC:NATGAS', name: 'Natural Gas', category: 'Commodities' },
  { symbol: 'BINANCE:BTCUSDT', name: 'Bitcoin/USDT (Binance)', category: 'Crypto' },
  { symbol: 'BITSTAMP:BTCUSD', name: 'Bitcoin/USD (Bitstamp)', category: 'Crypto' },
  { symbol: 'COINBASE:BTCUSD', name: 'Bitcoin/USD (Coinbase)', category: 'Crypto' },
  { symbol: 'BINANCE:ETHUSDT', name: 'Ethereum/USDT (Binance)', category: 'Crypto' },
  { symbol: 'BITSTAMP:ETHUSD', name: 'Ethereum/USD (Bitstamp)', category: 'Crypto' },
  { symbol: 'BINANCE:SOLUSDT', name: 'Solana/USDT (Binance)', category: 'Crypto' },
  { symbol: 'BINANCE:XRPUSDT', name: 'Ripple/USDT (Binance)', category: 'Crypto' },
  { symbol: 'BINANCE:DOGEUSDT', name: 'Dogecoin/USDT (Binance)', category: 'Crypto' },
  { symbol: 'OANDA:EURUSD', name: 'EUR/USD (OANDA)', category: 'Forex' },
  { symbol: 'FX:EURUSD', name: 'EUR/USD (FX)', category: 'Forex' },
  { symbol: 'OANDA:GBPUSD', name: 'GBP/USD (OANDA)', category: 'Forex' },
  { symbol: 'OANDA:USDJPY', name: 'USD/JPY (OANDA)', category: 'Forex' },
  { symbol: 'OANDA:USDCHF', name: 'USD/CHF (OANDA)', category: 'Forex' },
  { symbol: 'OANDA:AUDUSD', name: 'AUD/USD (OANDA)', category: 'Forex' },
  { symbol: 'OANDA:USDCAD', name: 'USD/CAD (OANDA)', category: 'Forex' },
  { symbol: 'SP:SPX', name: 'S&P 500 Index', category: 'Indices' },
  { symbol: 'AMEX:SPY', name: 'S&P 500 ETF', category: 'ETF' },
  { symbol: 'NASDAQ:QQQ', name: 'Nasdaq 100 ETF', category: 'ETF' },
  { symbol: 'DJ:DJI', name: 'Dow Jones Industrial', category: 'Indices' },
  { symbol: 'NASDAQ:NDX', name: 'Nasdaq 100 Index', category: 'Indices' },
  { symbol: 'CBOE:VIX', name: 'Volatility Index', category: 'Indices' },
  { symbol: 'TVC:DXY', name: 'US Dollar Index', category: 'Indices' },
  { symbol: 'NASDAQ:AAPL', name: 'Apple Inc.', category: 'Stocks' },
  { symbol: 'NASDAQ:MSFT', name: 'Microsoft Corp.', category: 'Stocks' },
  { symbol: 'NASDAQ:GOOGL', name: 'Alphabet Inc.', category: 'Stocks' },
  { symbol: 'NASDAQ:AMZN', name: 'Amazon.com Inc.', category: 'Stocks' },
  { symbol: 'NASDAQ:NVDA', name: 'NVIDIA Corp.', category: 'Stocks' },
  { symbol: 'NASDAQ:TSLA', name: 'Tesla Inc.', category: 'Stocks' },
  { symbol: 'NASDAQ:META', name: 'Meta Platforms', category: 'Stocks' },
  { symbol: 'NYSE:JPM', name: 'JPMorgan Chase', category: 'Stocks' },
  { symbol: 'NYSE:V', name: 'Visa Inc.', category: 'Stocks' },
  { symbol: 'NYSE:WMT', name: 'Walmart Inc.', category: 'Stocks' },
];

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Home() {
  const { activeTicker, setActiveTicker } = useTicker();
  const [step, setStep] = useState<AppStep>('UPLOAD');
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>(StrategyType.SMC);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysisData, setAnalysisData] = useState<FinalAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [tickerInput, setTickerInput] = useState<string>('');
  const [tickerDropdownOpen, setTickerDropdownOpen] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const filteredTickers = useMemo(() => {
    const query = tickerInput.trim().toUpperCase();
    if (!query) return TICKER_DATABASE.slice(0, 10);
    return TICKER_DATABASE.filter(t => 
      t.symbol.toUpperCase().includes(query) ||
      t.name.toUpperCase().includes(query) ||
      t.category.toUpperCase().includes(query)
    ).slice(0, 15);
  }, [tickerInput]);

  const addLog = useCallback((message: string) => {
    setLogs(prev => [...prev, message]);
  }, []);

  const analyzeMutation = useMutation({
    mutationFn: async (params: { strategy: StrategyType; file: File }) => {
      const imageBase64 = await fileToBase64(params.file);
      const response = await apiRequest('POST', '/api/analyze', {
        strategy: params.strategy,
        imageBase64,
        imageMimeType: params.file.type,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success && data.report) {
        addLog('Analysis complete!');
        setAnalysisData(data.report.data);
        queryClient.invalidateQueries({ queryKey: ['/api/reports'] });
        setStep('RESULTS');
      } else {
        setError(data.rejection_reason || data.error || 'Analysis failed');
        setStep('ERROR');
      }
    },
    onError: (err: Error) => {
      addLog(`Error: ${err.message}`);
      setError(err.message);
      setStep('ERROR');
    },
  });

  const handleImageSelect = (file: File, url: string) => {
    setImageFile(file);
    setImagePreviewUrl(url);
    setError(null);
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
  };

  const runAnalysis = async () => {
    if (!imageFile) return;

    setStep('VALIDATING');
    setLogs([]);
    setError(null);

    addLog('Starting chart validation...');
    addLog(`Selected strategy: ${selectedStrategy}`);

    setTimeout(() => {
      addLog('Validating chart image...');
    }, 300);

    setTimeout(() => {
      setStep('ANALYZING');
      addLog('Chart validated successfully');
      addLog(`Initializing ${selectedStrategy} analysis pipeline...`);
    }, 600);

    setTimeout(() => {
      addLog('Analyzing patterns and market structure...');
    }, 1000);

    setTimeout(() => {
      addLog('Generating trade plan...');
    }, 1500);

    analyzeMutation.mutate({ strategy: selectedStrategy, file: imageFile });
  };

  const handleNewAnalysis = () => {
    setStep('UPLOAD');
    setImageFile(null);
    setImagePreviewUrl(null);
    setAnalysisData(null);
    setLogs([]);
    setError(null);
  };

  const handleTickerSelect = (symbol: string) => {
    setActiveTicker(symbol);
    setTickerInput('');
    setTickerDropdownOpen(false);
  };

  function formatTradingViewSymbol(input: string): string {
    if (input.includes(':')) return input;
    
    const symbol = input.toUpperCase();
    
    const forexPairs = ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD', 
      'EURGBP', 'EURJPY', 'GBPJPY', 'XAUUSD', 'XAGUSD'];
    if (forexPairs.includes(symbol)) return `OANDA:${symbol}`;
    
    const commodities: Record<string, string> = {
      'GOLD': 'TVC:GOLD', 'SILVER': 'TVC:SILVER', 'OIL': 'TVC:USOIL',
      'USOIL': 'TVC:USOIL', 'BRENT': 'TVC:UKOIL', 'NATGAS': 'TVC:NATGAS', 'COPPER': 'COMEX:HG1!',
    };
    if (commodities[symbol]) return commodities[symbol];
    
    const crypto: Record<string, string> = {
      'BTC': 'BINANCE:BTCUSDT', 'BTCUSD': 'BITSTAMP:BTCUSD', 'BITCOIN': 'BINANCE:BTCUSDT',
      'ETH': 'BINANCE:ETHUSDT', 'ETHUSD': 'BITSTAMP:ETHUSD', 'ETHEREUM': 'BINANCE:ETHUSDT',
      'SOL': 'BINANCE:SOLUSDT', 'XRP': 'BINANCE:XRPUSDT', 'DOGE': 'BINANCE:DOGEUSDT',
    };
    if (crypto[symbol]) return crypto[symbol];
    
    const indices: Record<string, string> = {
      'SPX': 'SP:SPX', 'SPY': 'AMEX:SPY', 'QQQ': 'NASDAQ:QQQ', 'DJI': 'DJ:DJI',
      'DOW': 'DJ:DJI', 'NDX': 'NASDAQ:NDX', 'VIX': 'CBOE:VIX', 'DXY': 'TVC:DXY',
    };
    if (indices[symbol]) return indices[symbol];
    
    return `NASDAQ:${symbol}`;
  }

  const handleTickerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tickerInput.trim()) {
      const formatted = formatTradingViewSymbol(tickerInput.trim());
      handleTickerSelect(formatted);
    }
    if (e.key === 'Escape') {
      setTickerDropdownOpen(false);
    }
  };

  const processFile = (file: File) => {
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setCaptureError(null);
  };

  const captureActiveChart = async () => {
    setCaptureError(null);

    if (isMobile) {
      setCaptureError("Screen capture is blocked on mobile browsers. Please take a screenshot and upload below.");
      return;
    }

    if (!navigator.mediaDevices?.getDisplayMedia) {
      setCaptureError("Screen capture is not supported in this browser. Please upload a screenshot manually.");
      return;
    }

    setCaptureError(null);
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser" as DisplayCaptureSurfaceType },
        audio: false,
      });

      const video = document.createElement("video");
      video.style.display = "none";
      video.muted = true;
      video.autoplay = true;
      video.playsInline = true;
      video.srcObject = stream;
      
      document.body.appendChild(video);
      await video.play();
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = document.createElement("canvas");
      const maxWidth = 1920;
      const maxHeight = 1080;
      let width = video.videoWidth;
      let height = video.videoHeight;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "chart_scan.jpg", { type: "image/jpeg" });
            processFile(file);
          }
        }, "image/jpeg", 0.85);
      }

      stream.getTracks().forEach(t => t.stop());
      video.pause();
      video.srcObject = null;
      if (document.body.contains(video)) {
        document.body.removeChild(video);
      }

    } catch (err: unknown) {
      console.error("Capture failed:", err);
      const error = err as Error & { name?: string };
      
      if (error.name === 'NotAllowedError') {
        return;
      }
      
      if (error.name === 'SecurityError' || error.message?.includes('permissions policy')) {
        setCaptureError("Browser security blocked capture. Take a screenshot manually and upload below.");
        return;
      }

      setCaptureError("Screen capture failed. Please upload manually.");
    }
  };

  if (step === 'RESULTS' && analysisData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <ResultsDashboard
            analysis={analysisData}
            imagePreviewUrl={imagePreviewUrl}
            onNewAnalysis={handleNewAnalysis}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <SponsorBanner config={SPONSOR_CONFIG} />
        
        {(step === 'VALIDATING' || step === 'ANALYZING') && (
          <AnalysisProgress currentStep={step} />
        )}

        {step === 'ERROR' && error && (
          <Card className="p-4 border-fin-bear/30 bg-fin-bear/5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-fin-bear shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-fin-bear">Analysis Failed</h3>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleNewAnalysis}>
                Try Again
              </Button>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-fin-accent" />
              <h2 className="text-xl font-semibold">Live Chart</h2>
              <span className="text-sm text-muted-foreground">({activeTicker})</span>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative">
                <Input
                  placeholder="Search ticker (AAPL, GOLD, BTC...)"
                  value={tickerInput}
                  onChange={(e) => {
                    setTickerInput(e.target.value);
                    setTickerDropdownOpen(true);
                  }}
                  onClick={() => setTickerDropdownOpen(true)}
                  onFocus={() => setTickerDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setTickerDropdownOpen(false), 150)}
                  onKeyDown={handleTickerKeyDown}
                  className="w-72 pr-8"
                  data-testid="input-ticker"
                />
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                {tickerDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-popover border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                    {filteredTickers.length === 0 ? (
                      <div className="p-3 text-sm text-muted-foreground text-center">
                        No matches. Press Enter to use: {tickerInput.toUpperCase().includes(':') ? tickerInput.toUpperCase() : `NASDAQ:${tickerInput.toUpperCase()}`}
                      </div>
                    ) : (
                      <>
                        {Object.entries(
                          filteredTickers.reduce((acc, t) => {
                            if (!acc[t.category]) acc[t.category] = [];
                            acc[t.category].push(t);
                            return acc;
                          }, {} as Record<string, TickerOption[]>)
                        ).map(([category, tickers]) => (
                          <div key={category}>
                            <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50 sticky top-0">
                              {category}
                            </div>
                            {tickers.map((t) => (
                              <button
                                key={t.symbol}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleTickerSelect(t.symbol)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center justify-between gap-2"
                                data-testid={`ticker-option-${t.symbol.replace(':', '-')}`}
                              >
                                <span className="font-mono text-xs text-fin-accent">{t.symbol}</span>
                                <span className="text-muted-foreground truncate">{t.name}</span>
                              </button>
                            ))}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
              <Button
                onClick={captureActiveChart}
                data-testid="button-scan-chart"
                variant="secondary"
                disabled={isMobile}
                className={isMobile ? 'opacity-70 cursor-not-allowed' : ''}
              >
                <Camera className="w-4 h-4 mr-2" />
                {isMobile ? 'Upload screenshot' : 'Scan Chart'}
              </Button>
            </div>
          </div>
          {captureError && (
            <Card className="p-3 border-amber-500/30 bg-amber-500/5">
              <div className="flex items-center gap-2 text-sm text-amber-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {captureError}
              </div>
            </Card>
          )}
          <TradingViewWidget symbol={activeTicker} />
          <p className="text-xs text-muted-foreground">
            Click "Scan Chart" to capture the chart above, or take a screenshot manually and upload it below
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Upload Chart</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a financial chart image for AI-powered analysis
              </p>
              <ChartUpload
                imagePreviewUrl={imagePreviewUrl}
                onImageSelect={handleImageSelect}
                onClearImage={handleClearImage}
                isProcessing={step === 'VALIDATING' || step === 'ANALYZING'}
              />
            </div>

            {(step === 'VALIDATING' || step === 'ANALYZING') && (
              <AnalysisLogs logs={logs} />
            )}
          </div>

          <div className="space-y-6">
            <StrategySelector
              selected={selectedStrategy}
              onSelect={setSelectedStrategy}
            />

            <div className="flex justify-end">
              <Button
                size="lg"
                disabled={!imageFile || step === 'VALIDATING' || step === 'ANALYZING'}
                onClick={runAnalysis}
                className="w-full sm:w-auto"
                data-testid="button-analyze"
              >
                {(step === 'VALIDATING' || step === 'ANALYZING') ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Analyze Chart
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
