import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

type MarketData = {
  last_updated: string;
  metrics: {
    fear_greed: { value: number; label: string; trend: "up" | "down" | "flat" };
    volume: { formatted: string; change_24h: string };
    defi_tvl: { formatted: string; trend: "up" | "down" | "flat" };
    market_cycle: { phase: string; confidence: number };
    risk_assessment: { level: string; percent: number; summary: string };
    ai_summary: string;
  };
};

const mockData: MarketData = {
  last_updated: new Date().toISOString(),
  metrics: {
    fear_greed: { value: 26, label: "Fear", trend: "down" },
    volume: { formatted: "$236.0B", change_24h: "-1.1" },
    defi_tvl: { formatted: "$123.6B", trend: "up" },
    market_cycle: { phase: "Early Recovery", confidence: 72 },
    risk_assessment: {
      level: "Low Risk",
      percent: 15,
      summary: "Low volatility (15%) suggests stable market conditions with reduced risk; favorable environment for position building.",
    },
    ai_summary:
      "Extreme fear dominates market sentiment, creating potential accumulation opportunities. Smart money positioning for recovery while retail sentiment remains pessimistic.",
  },
};

export function MarketIntelligenceDashboard() {
  const [data, setData] = useState<MarketData | null>(mockData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/market-data");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as MarketData;
        if (mounted && json?.metrics) setData(json);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Failed to load live data");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const metrics = data?.metrics ?? mockData.metrics;

  return (
    <div className="bg-[var(--bg-panel,#151A21)] border border-gray-800 rounded-2xl p-4 md:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">AI Market Intelligence</p>
          <p className="text-xs text-gray-500">
            Last updated: {new Date(data?.last_updated || Date.now()).toLocaleTimeString()}
          </p>
        </div>
        <Badge variant="outline" className="border-[#00FF94] text-[#00FF94] bg-[#00ff9420]">
          Live Data
        </Badge>
      </div>

      {error && <p className="text-xs text-rose-400">Live data error: {error}. Showing cached data.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4 bg-slate-900 border-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Fear & Greed</span>
            <span className={metrics.fear_greed.trend === "up" ? "text-emerald-400" : "text-rose-400"}>
              {metrics.fear_greed.trend === "up" ? "↑" : metrics.fear_greed.trend === "down" ? "↓" : "→"}
            </span>
          </div>
          <div className="mt-2 text-3xl font-bold text-white">{metrics.fear_greed.value}</div>
          <div className="text-sm text-gray-300">{metrics.fear_greed.label}</div>
          <div className="mt-3 h-2 w-full rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 overflow-hidden">
            <div
              className="h-full bg-white/30"
              style={{ width: `${Math.min(metrics.fear_greed.value, 100)}%` }}
            />
          </div>
        </Card>

        <Card className="p-4 bg-slate-900 border-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Volume (24h)</span>
            <span className={Number(metrics.volume.change_24h) >= 0 ? "text-emerald-400" : "text-rose-400"}>
              {metrics.volume.change_24h}%
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{metrics.volume.formatted}</div>
          <p className="text-xs text-gray-400">Across covered assets</p>
        </Card>

        <Card className="p-4 bg-slate-900 border-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>DeFi TVL</span>
            <span className={metrics.defi_tvl.trend === "up" ? "text-emerald-400" : "text-rose-400"}>
              {metrics.defi_tvl.trend === "up" ? "Up" : "Down"}
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{metrics.defi_tvl.formatted}</div>
          <p className="text-xs text-gray-400">Chain & protocol aggregate</p>
        </Card>

        <Card className="p-4 bg-slate-900 border-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Market Cycle</span>
            <span className="text-blue-400">{metrics.market_cycle.confidence}%</span>
          </div>
          <div className="mt-2 text-lg font-semibold text-white">{metrics.market_cycle.phase}</div>
          <Progress value={metrics.market_cycle.confidence} className="mt-3" />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 bg-slate-900 border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Risk Assessment</p>
              <p className="text-xs text-gray-400">Current market risk analysis</p>
            </div>
            <Badge variant="outline" className="border-emerald-500 text-emerald-400">
              {metrics.risk_assessment.level}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Risk Level</p>
            <Progress value={metrics.risk_assessment.percent} />
            <p className="text-[11px] text-gray-500 mt-1">{metrics.risk_assessment.percent}%</p>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{metrics.risk_assessment.summary}</p>
        </Card>

        <Card className="p-4 bg-slate-900 border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">AI Market Summary</p>
              <p className="text-xs text-gray-400">Intelligent market analysis</p>
            </div>
            {loading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
          </div>
          <div className="bg-slate-800/60 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 leading-relaxed">
            {metrics.ai_summary}
          </div>
        </Card>
      </div>
    </div>
  );
}

