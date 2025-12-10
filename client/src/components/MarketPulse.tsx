const sampleItems = [
  { symbol: "BTC", change: "+4.2%", isUp: true },
  { symbol: "SOL", change: "-1.8%", isUp: false },
  { symbol: "ETH", change: "+2.5%", isUp: true },
  { symbol: "NVDA", change: "+1.2%", isUp: true },
  { symbol: "GOLD", change: "-0.6%", isUp: false },
];

export function MarketPulse() {
  return (
    <div className="w-full bg-[var(--bg-app,#0B0E11)] border-b border-gray-800 overflow-hidden py-2 flex items-center">
      <div className="px-4 text-xs font-bold text-gray-500 uppercase tracking-widest shrink-0">
        🔥 Market Pulse:
      </div>
      <div className="flex gap-8 whitespace-nowrap animate-marquee">
        {sampleItems.map((item) => (
          <div key={item.symbol} className="flex items-center gap-2">
            <span className="font-mono font-bold text-white">{item.symbol}</span>
            <span
              className={`px-1.5 rounded text-xs font-mono ${
                item.isUp
                  ? "text-[#00FF94] bg-green-900/20"
                  : "text-[#FF2A55] bg-red-900/20"
              }`}
            >
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

