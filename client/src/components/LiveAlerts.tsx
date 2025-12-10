import { useMemo } from "react";
import { useCoinGecko } from "@/hooks/useCoinGecko";
import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

const MOVE_THRESHOLD = 2; // % in 1h

export function LiveAlerts() {
  const { data, loading, error } = useCoinGecko(60000);

  const alerts = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data
      .filter((d) => typeof d.price_change_percentage_1h_in_currency === "number")
      .filter((d) => Math.abs(d.price_change_percentage_1h_in_currency || 0) >= MOVE_THRESHOLD)
      .sort(
        (a, b) =>
          Math.abs((b.price_change_percentage_1h_in_currency || 0)) -
          Math.abs((a.price_change_percentage_1h_in_currency || 0))
      )
      .slice(0, 12)
      .map((d) => ({
        symbol: d.symbol.toUpperCase(),
        move: d.price_change_percentage_1h_in_currency || 0,
        last: d.current_price,
        volume: d.total_volume,
      }));
  }, [data]);

  return (
    <div className="bg-[var(--bg-panel,#151A21)] rounded-xl border border-gray-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#FF2A55]" />
          <h3 className="text-sm font-semibold text-white">Live Market Alerts</h3>
        </div>
        <span className="text-[11px] text-gray-500">1h moves ≥ {MOVE_THRESHOLD}%</span>
      </div>

      {loading && <p className="text-xs text-gray-500">Scanning markets…</p>}
      {error && <p className="text-xs text-[#FF2A55]">Failed to load alerts: {error}</p>}

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {alerts.map((a) => (
          <div
            key={a.symbol}
            className="flex items-center justify-between rounded-lg border border-gray-800 bg-[#0B0E11] px-3 py-2"
          >
            <div className="flex items-center gap-2">
              {a.move >= 0 ? (
                <TrendingUp className="w-4 h-4 text-[#00FF94]" />
              ) : (
                <TrendingDown className="w-4 h-4 text-[#FF2A55]" />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">{a.symbol}</span>
                <span className="text-[11px] text-gray-500">Vol ${Math.round(a.volume / 1e6)}M</span>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-sm font-mono ${
                  a.move >= 0 ? "text-[#00FF94]" : "text-[#FF2A55]"
                }`}
              >
                {a.move.toFixed(2)}%
              </div>
              <div className="text-[11px] text-gray-400">${a.last.toLocaleString()}</div>
            </div>
          </div>
        ))}
        {!loading && !error && alerts.length === 0 && (
          <p className="text-xs text-gray-500">No significant moves in the last hour.</p>
        )}
      </div>
    </div>
  );
}

