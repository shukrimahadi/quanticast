import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Report } from "@/lib/types";

type State = {
  data: Report[];
  loading: boolean;
  error: string | null;
};

export function RecentAnalysesLanding() {
  const [state, setState] = useState<State>({ data: [], loading: true, error: null });

  useEffect(() => {
    let mounted = true;
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/reports");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as Report[];
        if (mounted) setState({ data: json, loading: false, error: null });
      } catch (err) {
        if (mounted)
          setState({
            data: [],
            loading: false,
            error: err instanceof Error ? err.message : "Failed to load analyses",
          });
      }
    };
    fetchReports();
    return () => {
      mounted = false;
    };
  }, []);

  const recent = useMemo(() => {
    return [...state.data]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  }, [state.data]);

  return (
    <div className="bg-[var(--bg-panel,#151A21)] rounded-xl border border-gray-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Recent Analyses</h3>
        <Badge variant="outline" className="border-[#00FF94] text-[#00FF94] bg-[#00ff9415]">
          FIFO
        </Badge>
      </div>

      {state.loading && <p className="text-xs text-gray-500">Loading recent analyses…</p>}
      {state.error && <p className="text-xs text-rose-400">Error: {state.error}</p>}

      <div className="space-y-3">
        {recent.map((r) => (
          <Card
            key={r.id}
            className="p-3 bg-[#0B0E11] border border-gray-800 hover:border-[#2962FF] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-[#2962FF1a] text-[#00FF94] uppercase text-[11px]">
                  {r.strategy}
                </Badge>
                <span className="text-sm font-semibold text-white">{r.ticker}</span>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
              <span className="truncate">
                {r.data?.grading?.headline || r.data?.final_verdict || "Analysis completed"}
              </span>
              {r.data?.grading?.grade && (
                <Badge variant="outline" className="border-[#00FF94] text-[#00FF94]">
                  {r.data.grading.grade}
                </Badge>
              )}
            </div>
          </Card>
        ))}

        {!state.loading && !state.error && recent.length === 0 && (
          <p className="text-xs text-gray-500">No analyses yet.</p>
        )}
      </div>
    </div>
  );
}

