import { FinalAnalysis } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GradeBadge from './GradeBadge';
import TradeDNA from './TradeDNA';
import KeyLevels from './KeyLevels';
import { 
  RefreshCw, Download, AlertTriangle, 
  Eye, TrendingUp, ArrowDownRight, ExternalLink, Target, Crosshair,
  Search, Calendar, Newspaper, Activity, Shield, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';

interface ResultsDashboardProps {
  analysis: FinalAnalysis;
  imagePreviewUrl: string | null;
  onNewAnalysis: () => void;
}

export default function ResultsDashboard({ analysis, imagePreviewUrl, onNewAnalysis }: ResultsDashboardProps) {
  const { grading, visual_analysis, trade_plan, external_data, grounding_result, confidence_score, final_verdict, meta } = analysis;

  const isBullish = trade_plan.bias === 'BULLISH' || trade_plan.bias === 'LONG';
  const isBearish = trade_plan.bias === 'BEARISH' || trade_plan.bias === 'SHORT';
  const biasColor = isBullish ? 'text-fin-bull' : isBearish ? 'text-fin-bear' : 'text-muted-foreground';
  const actionColor = grading.action_plan.action.includes('BUY') ? 'text-fin-bull' : grading.action_plan.action.includes('SELL') ? 'text-fin-bear' : 'text-fin-accent';

  const riskPercent = Math.round(100 - confidence_score);
  const showCaution = riskPercent > 30;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex items-start gap-4 flex-1">
            <GradeBadge grade={grading.grade} size="lg" />
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold leading-tight mb-2">{grading.headline}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{grading.reasoning}</p>
              {showCaution && (
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="outline" className="text-fin-warning border-fin-warning bg-fin-warning/10">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    CAUTION: Reduce Risk by {riskPercent}%
                  </Badge>
                </div>
              )}
            </div>
          </div>
          <div className="lg:border-l lg:pl-6 lg:min-w-[180px]">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Action Plan</p>
            <p className={`text-lg font-bold font-mono ${actionColor}`}>{grading.action_plan.action}</p>
            <p className="text-2xl font-bold font-mono mt-1">{grading.action_plan.price}</p>
            <div className="flex gap-4 mt-2 text-xs">
              <div>
                <span className="text-muted-foreground">Stop</span>
                <p className="font-mono text-fin-bear">{grading.action_plan.stop_loss}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Target</span>
                <p className="font-mono text-fin-bull">{grading.action_plan.target}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onNewAnalysis} data-testid="button-new-analysis">
          <RefreshCw className="w-4 h-4 mr-2" />
          New Analysis
        </Button>
        <Button variant="outline" data-testid="button-export">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {imagePreviewUrl && (
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-sm font-medium">Market Context</span>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <div className="relative">
                <img src={imagePreviewUrl} alt="Analyzed chart" className="w-full h-auto rounded-md" data-testid="img-chart-display" />
              </div>
            </Card>
          )}

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-fin-accent" />
              <h3 className="font-semibold">Phase 1: Visual Intelligence</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {visual_analysis.chart_quality_check} The chart displays a <span className="text-foreground font-medium">{visual_analysis.trend.toLowerCase()}</span> trend 
              {visual_analysis.patterns_detected.length > 0 && (
                <> with detected patterns including <span className="text-foreground font-medium">{visual_analysis.patterns_detected.slice(0, 3).join(', ')}</span></>
              )}. {final_verdict}
            </p>
          </Card>

          {/* Phase 2: Market Grounding - Real-time catalyst search */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-fin-accent" />
                <h3 className="font-semibold">Phase 2: Market Grounding</h3>
              </div>
              {grounding_result?.search_performed ? (
                <Badge variant="outline" className="text-fin-bull border-fin-bull">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Live Data
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Offline
                </Badge>
              )}
            </div>

            {grounding_result?.search_performed ? (
              <div className="space-y-4">
                {/* Grade Adjustment Banner */}
                {grounding_result.grade_adjustment.original_grade !== grounding_result.grade_adjustment.adjusted_grade && (
                  <div className="bg-fin-warning/10 border border-fin-warning/30 rounded-md p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-fin-warning" />
                      <span className="font-medium text-fin-warning">Grade Adjusted:</span>
                      <span className="font-mono">{grounding_result.grade_adjustment.original_grade}</span>
                      <ArrowDownRight className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono font-bold">{grounding_result.grade_adjustment.adjusted_grade}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{grounding_result.grade_adjustment.adjustment_reason}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {/* Earnings */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="uppercase text-xs font-medium">Earnings</span>
                    </div>
                    {grounding_result.earnings.is_imminent ? (
                      <p className="text-fin-warning font-medium">
                        {grounding_result.earnings.next_date} ({grounding_result.earnings.days_until}d)
                      </p>
                    ) : grounding_result.earnings.next_date ? (
                      <p className="text-foreground">{grounding_result.earnings.next_date}</p>
                    ) : (
                      <p className="text-muted-foreground">No upcoming date</p>
                    )}
                  </div>

                  {/* Sentiment */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Newspaper className="w-3.5 h-3.5" />
                      <span className="uppercase text-xs font-medium">Sentiment</span>
                    </div>
                    <p className={
                      grounding_result.sentiment.news_sentiment === 'Bullish' ? 'text-fin-bull font-medium' :
                      grounding_result.sentiment.news_sentiment === 'Bearish' ? 'text-fin-bear font-medium' :
                      'text-foreground'
                    }>
                      {grounding_result.sentiment.news_sentiment}
                      {grounding_result.sentiment.analyst_rating && ` (${grounding_result.sentiment.analyst_rating})`}
                    </p>
                  </div>

                  {/* Catalyst Alignment */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Activity className="w-3.5 h-3.5" />
                      <span className="uppercase text-xs font-medium">Catalyst</span>
                    </div>
                    <p className={
                      grounding_result.risk_assessment.catalyst_alignment === 'Supports' ? 'text-fin-bull font-medium' :
                      grounding_result.risk_assessment.catalyst_alignment === 'Conflicts' ? 'text-fin-bear font-medium' :
                      'text-foreground'
                    }>
                      {grounding_result.risk_assessment.catalyst_alignment === 'Supports' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                      {grounding_result.risk_assessment.catalyst_alignment === 'Conflicts' && <XCircle className="w-3 h-3 inline mr-1" />}
                      {grounding_result.risk_assessment.catalyst_alignment}
                    </p>
                  </div>

                  {/* Binary Event Risk */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Shield className="w-3.5 h-3.5" />
                      <span className="uppercase text-xs font-medium">Event Risk</span>
                    </div>
                    {grounding_result.risk_assessment.binary_event_risk ? (
                      <p className="text-fin-warning font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Binary Event
                      </p>
                    ) : (
                      <p className="text-fin-bull font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Clear
                      </p>
                    )}
                  </div>
                </div>

                {/* Headlines */}
                {grounding_result.sentiment.recent_headlines.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground uppercase mb-2">Recent Headlines</p>
                    <ul className="space-y-1">
                      {grounding_result.sentiment.recent_headlines.slice(0, 2).map((headline, i) => (
                        <li key={i} className="text-xs text-muted-foreground truncate">{headline}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Risk Factors */}
                {grounding_result.risk_assessment.risk_factors.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground uppercase mb-2">Risk Factors</p>
                    <div className="flex flex-wrap gap-1">
                      {grounding_result.risk_assessment.risk_factors.slice(0, 3).map((factor, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sources */}
                {grounding_result.sources.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground uppercase mb-2">Sources ({grounding_result.sources.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {grounding_result.sources.slice(0, 3).map((source, i) => (
                        <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" 
                          className="text-xs text-fin-accent hover:underline flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          {source.title.slice(0, 30)}{source.title.length > 30 ? '...' : ''}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Market grounding search was not performed. Analysis based on visual patterns only.
              </p>
            )}
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-fin-accent" />
                <h3 className="font-semibold">Phase 3: Execution</h3>
              </div>
              <Badge className={isBullish ? 'bg-fin-bull text-white' : isBearish ? 'bg-fin-bear text-white' : 'bg-muted'}>
                {isBullish ? 'LONG' : isBearish ? 'SHORT' : 'NEUTRAL'}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">Entry Zone</p>
                <p className="text-xl font-bold font-mono">{trade_plan.entry_zone}</p>
                <p className="text-xs text-muted-foreground mt-1">{grading.action_plan.action}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">Target</p>
                <p className="text-xl font-bold font-mono text-fin-bull">{trade_plan.take_profit_1}</p>
                {trade_plan.take_profit_2 && trade_plan.take_profit_2 !== 'N/A' && (
                  <p className="text-xs text-muted-foreground">TP2: {trade_plan.take_profit_2}</p>
                )}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-fin-bear" />
                <span className="text-muted-foreground">Stop Loss:</span>
                <span className="font-mono font-medium text-fin-bear">{trade_plan.stop_loss}</span>
              </div>
            </div>
          </Card>

          {external_data && external_data.search_summary && (
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-fin-accent" />
                <h3 className="font-semibold">Market Intelligence</h3>
                <Badge variant="outline" className="ml-auto text-xs">
                  {external_data.market_sentiment}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{external_data.search_summary}</p>
              {external_data.sources && external_data.sources.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {external_data.sources.slice(0, 3).map((src, i) => (
                    <a key={i} href={src.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-fin-accent hover:underline flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      {src.title.slice(0, 30)}...
                    </a>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <TradeDNA
            visual={grading.visual_score}
            macro={grading.data_score}
            momentum={grading.momentum_score}
            sentiment={grading.sentiment_score}
            riskReward={grading.risk_reward_score}
          />
          
          <Card className="p-4">
            <h4 className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Confidence</h4>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold font-mono">{confidence_score}</span>
              <span className="text-muted-foreground mb-1">/100</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full transition-all ${confidence_score >= 70 ? 'bg-fin-bull' : confidence_score >= 40 ? 'bg-fin-warning' : 'bg-fin-bear'}`}
                style={{ width: `${confidence_score}%` }}
              />
            </div>
          </Card>

          <KeyLevels levels={visual_analysis.key_levels_visible} />

          <Card className="p-4">
            <h4 className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Detected Patterns</h4>
            <div className="flex flex-wrap gap-2">
              {visual_analysis.patterns_detected.length > 0 ? (
                visual_analysis.patterns_detected.map((pattern, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{pattern}</Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No significant patterns detected</span>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Analysis Info</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ticker</span>
                <span className="font-mono font-medium">{meta.ticker}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Strategy</span>
                <span className="font-mono text-xs">{meta.strategy_used}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timestamp</span>
                <span className="font-mono text-xs">{new Date(meta.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
