import { useEffect, useState } from "react";

export type CoinGeckoAsset = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h_in_currency?: number;
  total_volume: number;
  market_cap: number;
  last_updated: string;
  image: string;
};

type State = {
  data: CoinGeckoAsset[];
  loading: boolean;
  error: string | null;
};

const ENDPOINT =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=false&price_change_percentage=1h,24h";

export function useCoinGecko(pollMs: number = 60000): State {
  const [state, setState] = useState<State>({ data: [], loading: true, error: null });

  useEffect(() => {
    let mounted = true;
    let timer: number;

    const fetchData = async () => {
      try {
        const res = await fetch(ENDPOINT, { method: "GET" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as CoinGeckoAsset[];
        if (mounted) {
          setState({ data: json, loading: false, error: null });
        }
      } catch (err) {
        if (mounted) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : "Failed to load market data",
          }));
        }
      } finally {
        if (mounted) {
          timer = window.setTimeout(fetchData, pollMs);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [pollMs]);

  return state;
}

