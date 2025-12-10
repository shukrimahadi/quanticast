import { useMemo } from "react";
import { useCoinGecko } from "@/hooks/useCoinGecko";

export function SignalFeed() {
  const { data, loading, error } = useCoinGecko(60000);

  const signals = useMemo(() => {
    if (!data || data.length === 0) return [];
    // Sort by 1h change desc to surface hottest moves
    return [...data]
      .filter((d) => typeof d.price_change_percentage_1h_in_currency === "number")
      .sort((a, b) => (b.price_change_percentage_1h_in_currency || 0) - (a.price_change_percentage_1h_in_currency || 0))
      .slice(0, 6)
      .map((d) => ({
        pair: d.symbol.toUpperCase(),
        time: d.last_updated,
        label: d.price_change_percentage_24h_in_currency && d.price_change_percentage_24h_in_currency > 5 ? "Momentum" : "Watch",
        confidence: Math.min(99, Math.max(60, Math.abs(d.price_change_percentage_1h_in_currency || 0) * 5)).toFixed(0) + "%",
        change1h: d.price_change_percentage_1h_in_currency ?? 0,
      }));
  }, [data]);

  return (
    <div className="bg-[var(--bg-panel,#151A21)] rounded-xl border border-gray-800 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-white">📡 AI Signals</h3>
        <span className="text-xs text-[#00FF94] animate-pulse">● Live</span>
      </div>

      {loading && <p className="text-xs text-gray-500">Loading signals…</p>}
      {error && <p className="text-xs text-[#FF2A55]">Failed to load signals: {error}</p>}

      <div className="space-y-3">
        {signals.map((sig) => (
          <div
            key={sig.pair + sig.time}
            className="p-3 rounded-lg bg-[#0B0E11] border border-gray-700 hover:border-[#2962FF] transition-colors cursor-pointer group"
          >
            <div className="flex justify-between mb-1">
              <span className="font-bold text-white">{sig.pair}</span>
              <span className="text-xs text-gray-400">1h {sig.change1h.toFixed(2)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-0.5 rounded bg-blue-900/30 text-blue-400 border border-blue-800">
                {sig.label}
              </span>
              <span className="text-xs font-mono text-[#00FF94]">{sig.confidence} Conf.</span>
            </div>
          </div>
        ))}
        {!loading && !error && signals.length === 0 && (
          <p className="text-xs text-gray-500">No live signals right now.</p>
        )}
      </div>
    </div>
  );
}

