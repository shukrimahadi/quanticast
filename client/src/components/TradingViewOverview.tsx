import { useEffect, useRef } from "react";

export function TradingViewOverview() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      dateRange: "12M",
      showChart: true,
      locale: "en",
      isTransparent: true,
      width: "100%",
      height: "560",
      plotLineColorGrowing: "rgba(0, 255, 148, 1)",
      plotLineColorFalling: "rgba(255, 42, 85, 1)",
      gridLineColor: "rgba(42, 46, 57, 0)",
      scaleFontColor: "rgba(120, 123, 134, 1)",
      belowLineFillColorGrowing: "rgba(0, 255, 148, 0.05)",
      belowLineFillColorFalling: "rgba(255, 42, 85, 0.05)",
      symbolActiveColor: "rgba(41, 98, 255, 0.2)",
      tabs: [
        {
          title: "Indices",
          symbols: [
            { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
            { s: "NASDAQ:NDX", d: "Nasdaq 100" },
            { s: "DJ:DJI", d: "Dow Jones" },
            { s: "INDEX:DAX", d: "DAX" },
            { s: "INDEX:FTSE", d: "FTSE 100" },
            { s: "INDEX:NKY", d: "Nikkei 225" },
          ],
        },
        {
          title: "FX",
          symbols: [
            { s: "FX:EURUSD", d: "EUR/USD" },
            { s: "FX:GBPUSD", d: "GBP/USD" },
            { s: "FX:USDJPY", d: "USD/JPY" },
            { s: "FX:AUDUSD", d: "AUD/USD" },
            { s: "TVC:DXY", d: "DXY" },
          ],
        },
        {
          title: "Commodities",
          symbols: [
            { s: "TVC:GOLD", d: "Gold" },
            { s: "TVC:SILVER", d: "Silver" },
            { s: "TVC:USOIL", d: "WTI" },
            { s: "TVC:UKOIL", d: "Brent" },
            { s: "COMEX:HG1!", d: "Copper" },
            { s: "NYMEX:NG1!", d: "NatGas" },
          ],
        },
        {
          title: "Crypto",
          symbols: [
            { s: "BINANCE:BTCUSDT", d: "BTC" },
            { s: "BINANCE:ETHUSDT", d: "ETH" },
            { s: "BINANCE:SOLUSDT", d: "SOL" },
            { s: "BINANCE:XRPUSDT", d: "XRP" },
            { s: "BINANCE:ADAUSDT", d: "ADA" },
          ],
        },
      ],
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

