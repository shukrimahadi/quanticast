import { Link } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MarketPulse } from "@/components/MarketPulse";
import { SignalFeed } from "@/components/SignalFeed";
import { TradingViewTape } from "@/components/TradingViewTape";

const features = [
  {
    badge: "Pattern AI",
    title: "Pattern Recognition",
    text: "Spots flags, head & shoulders, and liquidity sweeps before the crowd.",
  },
  {
    badge: "SMC / ICT",
    title: "Smart Money Narratives",
    text: "Order blocks, MSS, displacement and Kill Zone precision in one tap.",
  },
  {
    badge: "Risk Engine",
    title: "Risk Management",
    text: "Dynamic stops and targets sized to your account and volatility.",
  },
];

const stats = [
  { label: "Avg. Response", value: "3.2s" },
  { label: "Signals / Day", value: "1,200+" },
  { label: "Win-Rate Boost", value: "+18%" },
];

const logos = ["Binance Labs", "Anchorage", "Quant Fund", "HFT Desk", "DeFi VC"];

const testimonials = [
  {
    quote: "The fastest way to vet setups before they hit our desk.",
    name: "Sarah K.",
    title: "VP Trading, Macro Desk",
  },
  {
    quote: "Pattern calls are scarily accurate. We shaved hours off prep.",
    name: "Leo M.",
    title: "Lead Quant, Digital Assets",
  },
  {
    quote: "Grounding + SMC narrative is unique. Great for junior analysts.",
    name: "Ava R.",
    title: "PM, Multi-Strategy Fund",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--bg-app,#0B0E11)] text-foreground">
      <Header />

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2962FF22,transparent_35%),radial-gradient(circle_at_bottom,#00FF9415,transparent_30%)] pointer-events-none" />

        <TradingViewTape />
        <MarketPulse />

        <section className="text-center px-5 py-20 md:py-24 relative">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-800 bg-white/5 text-xs uppercase tracking-[0.2em] text-[#00FF94]">
              Pump Parade Inspired
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white drop-shadow-[0_0_30px_rgba(41,98,255,0.3)]">
              Decode the Market with <br />
              <span className="text-[#00FF94]">Institutional-Grade AI</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Quanticast turns complex chart data into clear, actionable trading strategies in seconds. Upload a
              chart, get the playbook.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/app">
                <Button size="lg" className="px-8 py-4 text-base bg-[#2962FF] hover:bg-[#1f4ed1] shadow-[0_0_20px_rgba(41,98,255,0.4)]">
                  Analyze My First Chart
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-base border border-gray-800 text-white hover:border-[#00FF94] hover:text-[#00FF94]"
              >
                View Demo
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="px-4 py-3 rounded-lg border border-gray-800 bg-black/40 text-left min-w-[140px] backdrop-blur"
                >
                  <p className="text-xs uppercase tracking-wide text-gray-400">{stat.label}</p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="mt-16 rounded-xl mx-auto shadow-2xl relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(41,98,255,0.12), rgba(0,255,148,0.08))",
              border: "1px solid rgba(255,255,255,0.06)",
              height: "420px",
              maxWidth: "1100px",
              boxShadow: "0 0 40px rgba(41, 98, 255, 0.2)",
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,255,148,0.12),transparent_25%),radial-gradient(circle_at_80%_20%,rgba(41,98,255,0.18),transparent_30%)] pointer-events-none" />
            <div className="flex items-center justify-center h-full text-muted-foreground font-mono text-sm">
              [Interactive Chart Engine Mockup]
            </div>
          </div>
        </section>

        <section className="px-6 pb-12 relative" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="bg-black/30 border border-gray-800 rounded-xl p-4 backdrop-blur flex flex-wrap justify-center gap-4">
            {logos.map((logo) => (
              <span key={logo} className="text-sm font-semibold text-gray-400 tracking-wide">
                {logo}
              </span>
            ))}
          </div>
        </section>

        <section className="px-6 pb-16 relative" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((card) => (
              <div
                key={card.title}
                className="p-6 rounded-xl bg-[var(--bg-panel,#151A21)] border border-gray-800 shadow-[0_10px_40px_rgba(0,0,0,0.35)] hover:border-[#00FF94] transition-colors"
              >
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#00FF94] mb-2">{card.badge}</div>
                <h3 className="text-lg font-semibold mb-2 text-white">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 pb-16 relative" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SignalFeed />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">What teams say</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {testimonials.map((t) => (
                  <Card key={t.name} className="p-4 bg-[var(--bg-panel,#151A21)] border border-gray-800">
                    <p className="text-sm text-white mb-3 leading-relaxed">“{t.quote}”</p>
                    <p className="text-xs text-[#00FF94] font-semibold">{t.name}</p>
                    <p className="text-[11px] text-gray-400">{t.title}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

