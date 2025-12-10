import { useEffect, useRef } from "react";

type MiniTileProps = {
  symbol: string;
  title?: string;
  width?: number | string;
  height?: number | string;
};

export function TradingViewMiniTile({
  symbol,
  title,
  width = "100%",
  height = 220,
}: MiniTileProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol,
      width,
      height,
      locale: "en",
      dateRange: "1D",
      colorTheme: "dark",
      trendLineColor: "rgba(0, 255, 148, 1)",
      underLineColor: "rgba(0, 255, 148, 0.15)",
      underLineBottomColor: "rgba(0, 0, 0, 0)",
      isTransparent: true,
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [symbol, width, height]);

  return (
    <div className="bg-[var(--bg-panel,#151A21)] border border-gray-800 rounded-xl p-3">
      {title && <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">{title}</p>}
      <div className="tradingview-widget-container" ref={containerRef}>
        <div className="tradingview-widget-container__widget" />
      </div>
    </div>
  );
}

