const signals = [
  { pair: "ETH/USDT", time: "1m ago", label: "Bull Flag", confidence: "85%", color: "blue" },
  { pair: "SOL/USDT", time: "3m ago", label: "Breakout Watch", confidence: "72%", color: "emerald" },
  { pair: "BTC/USDT", time: "5m ago", label: "Liquidity Sweep", confidence: "78%", color: "yellow" },
];

export function SignalFeed() {
  return (
    <div className="bg-[var(--bg-panel,#151A21)] rounded-xl border border-gray-800 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-white">📡 AI Signals</h3>
        <span className="text-xs text-[#00FF94] animate-pulse">● Live</span>
      </div>

      <div className="space-y-3">
        {signals.map((sig) => (
          <div
            key={sig.pair + sig.time}
            className="p-3 rounded-lg bg-[#0B0E11] border border-gray-700 hover:border-[#2962FF] transition-colors cursor-pointer group"
          >
            <div className="flex justify-between mb-1">
              <span className="font-bold text-white">{sig.pair}</span>
              <span className="text-xs text-gray-400">{sig.time}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-0.5 rounded bg-blue-900/30 text-blue-400 border border-blue-800">
                {sig.label}
              </span>
              <span className="text-xs font-mono text-[#00FF94]">{sig.confidence} Conf.</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

