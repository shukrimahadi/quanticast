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

// Real-time grounding search results
export const groundingResultSchema = z.object({
  ticker: z.string(),
  search_performed: z.boolean(),
  narrative_summary: z.string(),
  critical_insight: z.string(),
  earnings: z.object({
    next_date: z.string().nullable(),
    days_until: z.number().nullable(),
    is_imminent: z.boolean(), // Within 5 trading days
    last_surprise: z.string().nullable(),
  }),
  economic_calendar: z.object({
    upcoming_events: z.array(z.string()),
    high_impact_soon: z.boolean(), // CPI, FOMC, NFP within 3 days
  }),
  sentiment: z.object({
    news_sentiment: z.enum(['Bullish', 'Bearish', 'Neutral', 'Mixed']),
    recent_headlines: z.array(z.string()),
    analyst_rating: z.string().nullable(),
  }),
  volatility: z.object({
    implied_volatility_percentile: z.number().nullable(),
    options_unusual_activity: z.boolean(),
  }),
  risk_assessment: z.object({
    binary_event_risk: z.boolean(),
    risk_factors: z.array(z.string()),
    catalyst_alignment: z.enum(['Supports', 'Conflicts', 'Neutral']),
  }),
  grade_adjustment: z.object({
    original_grade: z.enum(["A+", "A", "B", "C"]),
    adjusted_grade: z.enum(["A+", "A", "B", "C"]),
    adjustment_reason: z.string(),
  }),
  sources: z.array(z.object({
    title: z.string(),
    uri: z.string(),
  })),
  raw_search_response: z.string(),
});

export type GroundingResult = z.infer<typeof groundingResultSchema>;

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
  grounding_result: groundingResultSchema.optional(),
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
  userProfile: z.object({
    experienceLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Professional']).optional(),
    tradingGoal: z.enum(['Income', 'Growth', 'Preservation', 'Speculation']).optional(),
    riskTolerance: z.enum(['Conservative', 'Moderate', 'Aggressive', 'Very Aggressive']).optional(),
  }).optional(),
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

export const experienceLevelSchema = z.enum(['Beginner', 'Intermediate', 'Advanced', 'Professional']);
export const tradingGoalSchema = z.enum(['Income', 'Growth', 'Preservation', 'Speculation']);
export const riskToleranceSchema = z.enum(['Conservative', 'Moderate', 'Aggressive', 'Very Aggressive']);

export const userProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  photoUrl: z.string().optional(),
  experienceLevel: experienceLevelSchema,
  tradingGoal: tradingGoalSchema,
  riskTolerance: riskToleranceSchema,
  onboardingCompleted: z.boolean(),
  createdAt: z.number(),
});

export type ExperienceLevel = z.infer<typeof experienceLevelSchema>;
export type TradingGoal = z.infer<typeof tradingGoalSchema>;
export type RiskTolerance = z.infer<typeof riskToleranceSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
