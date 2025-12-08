import ResultsDashboard from '../ResultsDashboard';
import { FinalAnalysis } from '@/lib/types';

export default function ResultsDashboardExample() {
  // todo: remove mock functionality
  const mockAnalysis: FinalAnalysis = {
    meta: {
      ticker: 'AAPL',
      strategy_used: 'Smart Money Concepts',
      timestamp: new Date().toISOString(),
    },
    grading: {
      grade: 'A+',
      headline: 'Premium Setup: Liquidity Sweep + FVG Confluence',
      visual_score: 92,
      data_score: 85,
      sentiment_score: 78,
      risk_reward_score: 88,
      momentum_score: 82,
      action_plan: {
        action: 'BUY STOP',
        price: '$186.50',
        stop_loss: '$182.00',
        target: '$195.00',
      },
      reasoning: 'Clear institutional footprint with liquidity grab below Asian session low, followed by aggressive bullish displacement creating a clean Fair Value Gap. No earnings or FOMC in next 72 hours.',
    },
    visual_analysis: {
      trend: 'BULLISH',
      patterns_detected: ['Fair Value Gap', 'Order Block', 'Liquidity Sweep', 'Break of Structure'],
      key_levels_visible: {
        'resistance_1': '$195.50',
        'support_1': '$182.00',
        'pivot': '$188.00',
        'fvg_zone': '$184.20 - $185.80',
      },
      chart_quality_check: 'High quality, all elements visible',
    },
    agent_grounding: {
      search_queries_run: ['AAPL earnings date', 'FOMC schedule'],
      critical_findings: 'No binary events in next 72 hours',
      divergence_warning: false,
    },
    trade_plan: {
      bias: 'BULLISH',
      entry_zone: '$185.50 - $186.20',
      stop_loss: '$182.00',
      take_profit_1: '$195.00',
      take_profit_2: '$210.00',
    },
    external_data: {
      search_summary: 'Apple showing strong institutional accumulation',
      market_sentiment: 'Risk-On',
      sources: [
        { title: 'AAPL Technical Analysis Report', uri: 'https://example.com/1' },
        { title: 'Market Sentiment Dashboard', uri: 'https://example.com/2' },
      ],
    },
    confidence_score: 87,
    final_verdict: 'EXECUTE: High probability long setup. Enter at $186.50 with SL at $182.00. This is a Grade A+ institutional setup.',
  };

  return (
    <div className="p-4 bg-background">
      <ResultsDashboard
        analysis={mockAnalysis}
        imagePreviewUrl={null}
        onNewAnalysis={() => console.log('New analysis')}
      />
    </div>
  );
}
