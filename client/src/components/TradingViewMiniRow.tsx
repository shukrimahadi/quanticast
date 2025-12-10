import { TradingViewMiniTile } from "./TradingViewMiniTile";

export function TradingViewMiniRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <TradingViewMiniTile symbol="NASDAQ:AAPL" title="Active Stocks" />
      <TradingViewMiniTile symbol="TVC:GOLD" title="Active Commodities" />
      <TradingViewMiniTile symbol="FX:EURUSD" title="Active FX" />
      <TradingViewMiniTile symbol="BINANCE:BTCUSDT" title="Active Crypto" />
      <TradingViewMiniTile symbol="FOREXCOM:SPXUSD" title="Active Indices" />
    </div>
  );
}

