import { useEffect, useRef, memo } from 'react';

interface Props {
  symbol?: string;
  feedMode?: 'symbol' | 'market';
}

export const TradingViewNews = memo(({ symbol = "NASDAQ:AAPL", feedMode = "symbol" }: Props) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.type = "text/javascript";
    script.async = true;
    
    const config: Record<string, unknown> = {
      "colorTheme": "dark",
      "isTransparent": true,
      "displayMode": "regular",
      "width": "100%",
      "height": "100%",
      "locale": "en"
    };

    if (feedMode === 'market') {
      config.feedMode = "market";
      config.market = "stock";
    } else {
      config.feedMode = "symbol";
      config.symbol = symbol;
    }
    
    script.innerHTML = JSON.stringify(config);
    
    container.current.appendChild(script);
  }, [symbol, feedMode]);

  return (
    <div 
      className="h-[600px] w-full bg-card border border-border rounded-md overflow-hidden" 
      ref={container}
      data-testid="tradingview-news"
    >
      <div className="tradingview-widget-container__widget h-full w-full"></div>
    </div>
  );
});

TradingViewNews.displayName = 'TradingViewNews';
