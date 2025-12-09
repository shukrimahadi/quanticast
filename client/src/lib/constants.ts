import { StrategyType, StrategyInfo, StrategyBucket } from './types';

export const STRATEGIES: StrategyInfo[] = [
  {
    id: StrategyType.SMC,
    name: 'Smart Money Concepts',
    style: 'Intraday Scalping',
    description: 'Liquidity sweeps, FVGs, and market structure shifts',
    bucket: StrategyBucket.INTRADAY,
  },
  {
    id: StrategyType.ICT_2022,
    name: 'ICT 2022 Model',
    style: 'Precision Day Trading',
    description: 'Liquidity sweeps, MSS with displacement, FVGs, Kill Zones',
    bucket: StrategyBucket.INTRADAY,
  },
  {
    id: StrategyType.LIQUIDITY_FLOW,
    name: 'Liquidity Flow',
    style: 'Day Trading',
    description: 'Failed breakouts, Bart patterns, liquidity sweeps',
    bucket: StrategyBucket.INTRADAY,
  },
  {
    id: StrategyType.VCP,
    name: 'VCP Pattern',
    style: 'Momentum Swing',
    description: 'Volatility contraction and volume dry-up setups',
    bucket: StrategyBucket.SWING,
  },
  {
    id: StrategyType.CAN_SLIM,
    name: 'CAN SLIM',
    style: 'Growth Swing',
    description: 'Cup & handle, volume spikes on up-days',
    bucket: StrategyBucket.SWING,
  },
  {
    id: StrategyType.ELLIOTT,
    name: 'Elliott Wave',
    style: 'Cycle Analysis',
    description: '5-wave motive and 3-wave corrective structures',
    bucket: StrategyBucket.SWING,
  },
  {
    id: StrategyType.DOW,
    name: 'Dow Theory',
    style: 'Macro Trend',
    description: 'Primary trend analysis with volume confirmation',
    bucket: StrategyBucket.MACRO,
  },
  {
    id: StrategyType.GANN,
    name: 'Gann Analysis',
    style: 'Geometric',
    description: 'Square of 9 levels, time/price relationships',
    bucket: StrategyBucket.SWING, // can straddle swing/position
  },
  {
    id: StrategyType.WYCKOFF,
    name: 'Wyckoff Method',
    style: 'Institutional',
    description: 'Accumulation/distribution phases, springs & upthrusts',
    bucket: StrategyBucket.SWING,
  },
  {
    id: StrategyType.INVESTMENT_CLOCK,
    name: 'Investment Clock',
    style: 'Macro Cycle',
    description: 'GDP/CPI cycles and Fed policy positioning',
    bucket: StrategyBucket.MACRO,
  },
  {
    id: StrategyType.LPPL,
    name: 'LPPL Model',
    style: 'Crash Prediction',
    description: 'Log-periodic power law for bubble detection',
    bucket: StrategyBucket.RISK,
  },
  {
    id: StrategyType.INTERMARKET,
    name: 'Intermarket',
    style: 'Correlation',
    description: 'Cross-asset correlation and real yield analysis',
    bucket: StrategyBucket.MACRO,
  },
  {
    id: StrategyType.FRACTAL,
    name: 'Fractal Analysis',
    style: 'Regime Forecast',
    description: 'Hurst exponent and market texture analysis',
    bucket: StrategyBucket.MACRO,
  },
  {
    id: StrategyType.SENTIMENT,
    name: 'Sentiment',
    style: 'Contrarian',
    description: 'AAII sentiment, put/call ratios, capitulation',
    bucket: StrategyBucket.MACRO,
  }
];
