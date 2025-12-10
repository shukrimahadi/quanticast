import { useMemo } from "react";
import { useCoinGecko } from "@/hooks/useCoinGecko";

export function MarketPulse() {
  const { data, loading, error } = useCoinGecko(60000);

  const items = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.slice(0, 10).map((asset) => ({
      symbol: asset.symbol.toUpperCase(),
      change: asset.price_change_percentage_24h_in_currency ?? 0,
    }));
  }, [data]);

  return (
    <div className="w-full bg-[var(--bg-app,#0B0E11)] border-b border-gray-800 overflow-hidden py-2 flex items-center">
      <div className="px-4 text-xs font-bold text-gray-500 uppercase tracking-widest shrink-0">
        🔥 Market Pulse:
      </div>
      <div className="flex gap-8 whitespace-nowrap animate-marquee">
        {loading && <span className="text-xs text-gray-500">Loading market data…</span>}
        {error && <span className="text-xs text-[#FF2A55]">Data error: {error}</span>}
        {!loading && items.length === 0 && !error && (
          <span className="text-xs text-gray-500">No data available.</span>
        )}
        {items.map((item) => (
          <div key={item.symbol} className="flex items-center gap-2">
            <span className="font-mono font-bold text-white">{item.symbol}</span>
            <span
              className={`px-1.5 rounded text-xs font-mono ${
                item.change >= 0
                  ? "text-[#00FF94] bg-green-900/20"
                  : "text-[#FF2A55] bg-red-900/20"
              }`}
            >
              {item.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

