import Verdict from '../Verdict';

export default function VerdictExample() {
  // todo: remove mock functionality
  return (
    <div className="p-4 bg-background max-w-lg">
      <Verdict
        headline="Strong Bullish Setup with High Probability"
        reasoning="The chart shows a clear break of market structure with a clean Fair Value Gap forming at the $185 level. Volume confirms institutional interest, and there are no major events in the next 48 hours that could invalidate this setup."
        verdict="EXECUTE: Enter long position at $186.50 with defined risk parameters. This is a Grade A+ setup."
        externalData={{
          search_summary: 'No major events found',
          market_sentiment: 'Risk-On',
          sources: [
            { title: 'Apple Inc. Technical Analysis', uri: 'https://example.com/1' },
            { title: 'Market Sentiment Report', uri: 'https://example.com/2' },
          ]
        }}
      />
    </div>
  );
}
