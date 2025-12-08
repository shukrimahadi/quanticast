import { z } from "zod";

export enum StrategyType {
  SMC = 'SMC',
  ICT_2022 = 'ICT_2022',
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

export const chartMetadataSchema = z.object({
  ticker: z.string(),
  timeframe: z.string(),
  current_price: z.number(),
  chart_type: z.string(),
});

export const validationResponseSchema = z.object({
  is_valid_chart: z.boolean(),
  rejection_reason: z.string().nullable(),
  metadata: chartMetadataSchema.optional(),
});

export const visualAnalysisSchema = z.object({
  trend: z.string(),
  patterns_detected: z.array(z.string()),
  key_levels_visible: z.record(z.string(), z.string()),
  chart_quality_check: z.string(),
});

export const agentGroundingSchema = z.object({
  search_queries_run: z.array(z.string()),
  critical_findings: z.string(),
  divergence_warning: z.boolean(),
});

export const tradePlanSchema = z.object({
  bias: z.string(),
  entry_zone: z.string(),
  stop_loss: z.string(),
  take_profit_1: z.string(),
  take_profit_2: z.string(),
});

export const actionPlanSchema = z.object({
  action: z.enum(["BUY STOP", "SELL STOP", "LIMIT ORDER", "WAIT", "NO TRADE"]),
  price: z.string(),
  stop_loss: z.string(),
  target: z.string(),
});

export const externalDataSchema = z.object({
  search_summary: z.string(),
  market_sentiment: z.enum(['Risk-On', 'Risk-Off', 'Neutral']),
  sources: z.array(z.object({
    title: z.string(),
    uri: z.string(),
  })),
});

export const gradingDataSchema = z.object({
  grade: z.enum(["A+", "A", "B", "C"]),
  headline: z.string(),
  visual_score: z.number(),
  data_score: z.number(),
  sentiment_score: z.number(),
  risk_reward_score: z.number(),
  momentum_score: z.number(),
  action_plan: actionPlanSchema,
  reasoning: z.string(),
});

export const finalAnalysisSchema = z.object({
  meta: z.object({
    ticker: z.string(),
    strategy_used: z.string(),
    timestamp: z.string(),
  }),
  grading: gradingDataSchema,
  visual_findings: z.string().optional(),
  grounding_findings: z.string().optional(),
  visual_analysis: visualAnalysisSchema,
  agent_grounding: agentGroundingSchema,
  trade_plan: tradePlanSchema,
  external_data: externalDataSchema.optional(),
  confidence_score: z.number(),
  final_verdict: z.string(),
});

export const reportSchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  ticker: z.string(),
  strategy: z.nativeEnum(StrategyType),
  grade: z.string(),
  bias: z.string(),
  data: finalAnalysisSchema,
  validation: validationResponseSchema,
});

export const analyzeRequestSchema = z.object({
  strategy: z.nativeEnum(StrategyType),
  imageBase64: z.string(),
  imageMimeType: z.string(),
});

export type ChartMetadata = z.infer<typeof chartMetadataSchema>;
export type ValidationResponse = z.infer<typeof validationResponseSchema>;
export type VisualAnalysis = z.infer<typeof visualAnalysisSchema>;
export type AgentGrounding = z.infer<typeof agentGroundingSchema>;
export type TradePlanData = z.infer<typeof tradePlanSchema>;
export type ExternalData = z.infer<typeof externalDataSchema>;
export type GradingData = z.infer<typeof gradingDataSchema>;
export type FinalAnalysis = z.infer<typeof finalAnalysisSchema>;
export type Report = z.infer<typeof reportSchema>;
export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

export const users = {} as any;
export const insertUserSchema = z.object({ username: z.string(), password: z.string() });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = { id: string; username: string; password: string };
