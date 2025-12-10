import { Link } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        <section className="text-center px-5 py-20 md:py-24">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Decode the Market with <br />
              <span style={{ color: "var(--brand-primary)" }}>Institutional-Grade AI</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stop guessing. Quanticast turns complex chart data into clear, actionable trading strategies in seconds.
              Upload a chart, get a plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/app">
                <Button size="lg" className="px-8 py-4 text-base">
                  Analyze My First Chart
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-base border-[1px] border-[color:var(--border-subtle,hsla(0,0%,100%,0.16))]"
              >
                View Demo
              </Button>
            </div>
          </div>

          <div
            className="mt-16 rounded-xl mx-auto shadow-2xl"
            style={{
              background: "var(--bg-card, hsl(var(--card)))",
              border: "1px solid var(--border-subtle, hsl(var(--border)))",
              height: "400px",
              maxWidth: "1100px",
              boxShadow: "0 0 40px rgba(41, 98, 255, 0.1)",
            }}
          >
            <div className="flex items-center justify-center h-full text-muted-foreground">
              [Interactive Chart Engine Mockup]
            </div>
          </div>
        </section>

        <section className="px-6 pb-16" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "📉",
                title: "Pattern Recognition",
                text: "Instantly identifies Bullish Flags, Head & Shoulders, and Liquidity Sweeps invisible to the naked eye.",
              },
              {
                icon: "🧠",
                title: "SMC & ICT Concepts",
                text: "Understand the narrative. Get strategies based on Smart Money Concepts and Order Blocks.",
              },
              {
                icon: "🛡️",
                title: "Risk Management",
                text: "The AI suggests precise stop-losses and take-profit levels tailored to your account size.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="p-6 rounded-xl"
                style={{
                  background: "var(--bg-card, hsl(var(--card)))",
                  border: "1px solid var(--border-subtle, hsl(var(--border)))",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                }}
              >
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

