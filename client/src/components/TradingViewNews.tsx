import { useEffect, useRef, memo } from 'react';

interface Props {
  symbol?: string;
}

export const TradingViewNews = memo(({ symbol = "NASDAQ:AAPL" }: Props) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.type = "text/javascript";
    script.async = true;
    
    script.innerHTML = JSON.stringify({
      "feedMode": "symbol",
      "symbol": symbol,
      "colorTheme": "dark",
      "isTransparent": true,
      "displayMode": "regular",
      "width": "100%",
      "height": "100%",
      "locale": "en"
    });
    
    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div 
      className="h-[600px] w-full bg-fin-panel border border-fin-border rounded-md overflow-hidden" 
      ref={container}
      data-testid="tradingview-news"
    >
      <div className="tradingview-widget-container__widget h-full w-full"></div>
    </div>
  );
});

TradingViewNews.displayName = 'TradingViewNews';
