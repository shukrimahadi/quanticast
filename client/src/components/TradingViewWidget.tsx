import { useEffect, useRef, memo } from 'react';

interface Props {
  symbol?: string;
}

export const TradingViewWidget = memo(({ symbol = "NASDAQ:AAPL" }: Props) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "${symbol}",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "backgroundColor": "rgba(10, 10, 12, 1)",
        "gridColor": "rgba(39, 39, 42, 1)",
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": false,
        "calendar": false,
        "hide_volume": true,
        "support_host": "https://www.tradingview.com"
      }`;
    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div 
      className="h-[400px] w-full bg-fin-panel border border-fin-border rounded-md overflow-hidden relative" 
      ref={container}
      data-testid="tradingview-widget"
    >
      <div className="tradingview-widget-container__widget h-[calc(100%-32px)] w-full"></div>
    </div>
  );
});

TradingViewWidget.displayName = 'TradingViewWidget';
