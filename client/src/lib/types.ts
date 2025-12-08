export enum StrategyType {
  SMC = 'SMC',
  LIQUIDITY_FLOW = 'LIQUIDITY_FLOW',
  CAN_SLIM = 'CAN_SLIM',
  VCP = 'VCP',
  DOW = 'DOW',
  ELLIOTT = 'ELLIOTT',
  GANN = 'GANN',
  WYCKOFF = 'WYCKOFF',
  INVESTMENT_CLOCK = 'INVESTMENT_CLOCK',
  LPPL = 'LPPL',
  INTERMARKET = 'INTERMARKET',
  FRACTAL = 'FRACTAL',
  SENTIMENT = 'SENTIMENT',
}

export interface ChartMetadata {
  ticker: string;
  timeframe: string;
  current_price: number;
  chart_type: string;
}

export interface ValidationResponse {
  is_valid_chart: boolean;
  rejection_reason: string | null;
  metadata?: ChartMetadata;
}

export interface VisualAnalysis {
  trend: string;
  patterns_detected: string[];
  key_levels_visible: { [key: string]: string };
  chart_quality_check: string;
}

export interface AgentGrounding {
  search_queries_run: string[];
  critical_findings: string;
  divergence_warning: boolean;
}

export interface TradePlanData {
  bias: string;
  entry_zone: string;
  stop_loss: string;
  take_profit_1: string;
  take_profit_2: string;
}

export interface ExternalData {
  search_summary: string;
  market_sentiment: 'Risk-On' | 'Risk-Off' | 'Neutral';
  sources: Array<{ title: string; uri: string }>;
}

export interface GradingData {
  grade: "A+" | "A" | "B" | "C";
  headline: string;
  visual_score: number;
  data_score: number;
  sentiment_score: number;
  risk_reward_score: number;
  momentum_score: number;
  action_plan: {
    action: "BUY STOP" | "SELL STOP" | "LIMIT ORDER" | "WAIT" | "NO TRADE";
    price: string;
    stop_loss: string;
    target: string;
  };
  reasoning: string;
}

export interface FinalAnalysis {
  meta: {
    ticker: string;
    strategy_used: string;
    timestamp: string;
  };
  grading: GradingData;
  visual_findings?: string;
  grounding_findings?: string;
  visual_analysis: VisualAnalysis;
  agent_grounding: AgentGrounding;
  trade_plan: TradePlanData;
  external_data?: ExternalData;
  confidence_score: number;
  final_verdict: string;
}

export interface Report {
  id: string;
  timestamp: number;
  ticker: string;
  strategy: StrategyType;
  grade: string;
  bias: string;
  data: FinalAnalysis;
  validation: ValidationResponse;
}

export type AppStep = 'UPLOAD' | 'VALIDATING' | 'ANALYZING' | 'RESULTS' | 'ERROR' | 'REPORTS';

export interface AppState {
  step: AppStep;
  selectedStrategy: StrategyType;
  imageFile: File | null;
  imagePreviewUrl: string | null;
  validationData: ValidationResponse | null;
  analysisData: FinalAnalysis | null;
  error: string | null;
  logs: string[];
  history: Report[];
}

export interface StrategyInfo {
  id: StrategyType;
  name: string;
  style: string;
  description: string;
}
