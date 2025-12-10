import { useEffect, useRef } from "react";

type Tab = {
  title: string;
  symbols: { s: string; d?: string }[];
};

const tabs: Tab[] = [
  {
    title: "Active Stocks",
    symbols: [
      { s: "NASDAQ:AAPL", d: "AAPL" },
      { s: "NASDAQ:MSFT", d: "MSFT" },
      { s: "NASDAQ:NVDA", d: "NVDA" },
      { s: "NASDAQ:AMZN", d: "AMZN" },
      { s: "NASDAQ:META", d: "META" },
    ],
  },
  {
    title: "Active Commodities",
    symbols: [
      { s: "TVC:GOLD", d: "Gold" },
      { s: "TVC:SILVER", d: "Silver" },
      { s: "TVC:USOIL", d: "WTI" },
      { s: "TVC:UKOIL", d: "Brent" },
      { s: "COMEX:HG1!", d: "Copper" },
    ],
  },
  {
    title: "Active FX",
    symbols: [
      { s: "FX:EURUSD", d: "EUR/USD" },
      { s: "FX:GBPUSD", d: "GBP/USD" },
      { s: "FX:USDJPY", d: "USD/JPY" },
      { s: "FX:AUDUSD", d: "AUD/USD" },
      { s: "TVC:DXY", d: "DXY" },
    ],
  },
  {
    title: "Active Crypto",
    symbols: [
      { s: "BINANCE:BTCUSDT", d: "BTC" },
      { s: "BINANCE:ETHUSDT", d: "ETH" },
      { s: "BINANCE:SOLUSDT", d: "SOL" },
      { s: "BINANCE:XRPUSDT", d: "XRP" },
      { s: "BINANCE:ADAUSDT", d: "ADA" },
    ],
  },
  {
    title: "Active Indices",
    symbols: [
      { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
      { s: "NASDAQ:NDX", d: "Nasdaq 100" },
      { s: "DJ:DJI", d: "Dow Jones" },
      { s: "INDEX:DAX", d: "DAX" },
      { s: "INDEX:NKY", d: "Nikkei 225" },
    ],
  },
];

export function TradingViewMiniGrid() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: 480,
      symbolsGroups: tabs.map((t) => ({ name: t.title, symbols: t.symbols })),
      showSymbolLogo: true,
      colorTheme: "dark",
      isTransparent: true,
      locale: "en",
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div className="bg-[var(--bg-panel,#151A21)] rounded-xl border border-gray-800 p-3">
      <div className="tradingview-widget-container" ref={containerRef}>
        <div className="tradingview-widget-container__widget" />
      </div>
    </div>
  );
}

