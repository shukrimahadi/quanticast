import { GoogleGenAI } from "@google/genai";
import type {
  ValidationResponse,
  FinalAnalysis,
  StrategyType,
} from "@shared/schema";
import { finalAnalysisSchema } from "@shared/schema";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const STRATEGY_DESCRIPTIONS: Record<string, string> = {
  SMC: "Smart Money Concepts (SMC) - Analyze order blocks, liquidity pools, fair value gaps, breaker blocks, mitigation blocks, and institutional order flow",
  LIQUIDITY_FLOW: "Liquidity Flow Analysis - Track where liquidity is being swept, stop hunts, liquidity grabs, and smart money accumulation/distribution",
  CAN_SLIM: "CAN SLIM Strategy - Evaluate Current earnings, Annual earnings, New products/management, Supply/demand, Leader/laggard, Institutional sponsorship, Market direction",
  VCP: "Volatility Contraction Pattern - Identify price consolidations with decreasing volatility, pivot points, and breakout setups with volume confirmation",
  DOW: "Dow Theory - Analyze primary/secondary/minor trends, accumulation/distribution phases, trend confirmation across indices",
  ELLIOTT: "Elliott Wave Theory - Count impulse waves (1-5) and corrective waves (A-B-C), identify wave degree, Fibonacci relationships",
  GANN: "Gann Analysis - Apply Gann angles, time cycles, square of nine, fan lines, and geometric price/time relationships",
  WYCKOFF: "Wyckoff Method - Identify accumulation/distribution phases, springs, upthrusts, sign of strength/weakness, composite operator activity",
  INVESTMENT_CLOCK: "Investment Clock - Assess economic cycle position (recovery, expansion, slowdown, recession) and sector rotation implications",
  LPPL: "Log-Periodic Power Law (LPPL) - Detect bubble formation, crash prediction patterns, and critical time estimation",
  INTERMARKET: "Intermarket Analysis - Evaluate correlations between stocks, bonds, commodities, currencies, and cross-market signals",
  FRACTAL: "Fractal Analysis - Identify self-similar patterns across timeframes, fractal breakouts, and multi-timeframe confluence",
  SENTIMENT: "Sentiment Analysis - Evaluate market sentiment indicators, fear/greed levels, positioning data, and contrarian signals",
};

export async function validateChart(
  imageBase64: string,
  mimeType: string
): Promise<ValidationResponse> {
  const systemPrompt = `You are a financial chart validation expert. Your task is to:
1. Determine if this image is a valid financial/trading chart
2. Extract metadata if it's a valid chart

A valid chart must show:
- Price data (candlesticks, bars, or line chart)
- Time axis
- Price axis
- Clear readable data

Respond with JSON in this exact format:
{
  "is_valid_chart": boolean,
  "rejection_reason": string or null,
  "metadata": {
    "ticker": "string (symbol/ticker visible or 'UNKNOWN')",
    "timeframe": "string (e.g., '1H', '4H', 'D', 'W' or 'UNKNOWN')",
    "current_price": number (approximate last visible price, use 0 if unclear),
    "chart_type": "string (candlestick, bar, line, etc.)"
  }
}

If the image is NOT a valid chart, set is_valid_chart to false and provide rejection_reason.
Do not include metadata if the chart is invalid.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
      contents: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        },
        "Validate this chart image and extract metadata.",
      ],
    });

    const rawJson = response.text;
    
    if (rawJson) {
      return JSON.parse(rawJson) as ValidationResponse;
    }
    return {
      is_valid_chart: false,
      rejection_reason: "Failed to parse validation response",
    };
  } catch (error) {
    console.error("Chart validation error:", error);
    return {
      is_valid_chart: false,
      rejection_reason: `Validation error: ${error}`,
    };
  }
}

export async function analyzeChartWithStrategy(
  imageBase64: string,
  mimeType: string,
  strategy: StrategyType,
  metadata: { ticker: string; timeframe: string; current_price: number }
): Promise<FinalAnalysis> {
  const strategyDescription = STRATEGY_DESCRIPTIONS[strategy] || strategy;

  const systemPrompt = `You are an elite trading analyst specializing in ${strategyDescription}.

Analyze this ${metadata.ticker} chart (${metadata.timeframe} timeframe, current price ~${metadata.current_price}) using the ${strategy} methodology.

Provide a comprehensive analysis in this exact JSON format:
{
  "meta": {
    "ticker": "${metadata.ticker}",
    "strategy_used": "${strategy}",
    "timestamp": "${new Date().toISOString()}"
  },
  "grading": {
    "grade": "A+" | "A" | "B" | "C",
    "headline": "One-line trade thesis (max 15 words)",
    "visual_score": 0-100 (chart pattern clarity and setup quality),
    "data_score": 0-100 (technical indicator confluence),
    "sentiment_score": 0-100 (market sentiment alignment),
    "risk_reward_score": 0-100 (risk/reward ratio quality),
    "momentum_score": 0-100 (trend strength and momentum),
    "action_plan": {
      "action": "BUY STOP" | "SELL STOP" | "LIMIT ORDER" | "WAIT" | "NO TRADE",
      "price": "entry price or zone as string",
      "stop_loss": "stop loss level as string",
      "target": "primary target as string"
    },
    "reasoning": "2-3 sentences explaining the grade and action"
  },
  "visual_analysis": {
    "trend": "BULLISH" | "BEARISH" | "NEUTRAL" | "CONSOLIDATING",
    "patterns_detected": ["array of pattern names found"],
    "key_levels_visible": {
      "resistance_1": "price level",
      "resistance_2": "price level or N/A",
      "support_1": "price level",
      "support_2": "price level or N/A",
      "pivot": "pivot point if applicable"
    },
    "chart_quality_check": "Brief assessment of chart readability"
  },
  "agent_grounding": {
    "search_queries_run": ["queries that would validate this analysis"],
    "critical_findings": "Key ${strategy}-specific insights from the chart",
    "divergence_warning": false (set true if signals conflict)
  },
  "trade_plan": {
    "bias": "LONG" | "SHORT" | "NEUTRAL",
    "entry_zone": "specific price range for entry",
    "stop_loss": "stop loss price with reasoning",
    "take_profit_1": "first target with reasoning",
    "take_profit_2": "second target with reasoning"
  },
  "confidence_score": 0-100 (overall confidence in this analysis),
  "final_verdict": "2-3 sentence summary of the trade opportunity and recommendation"
}

GRADING CRITERIA:
- A+: Exceptional setup with multiple confirmations, clear structure, excellent R:R (>3:1), high probability
- A: Strong setup with good confluence, clear levels, good R:R (>2:1), favorable conditions
- B: Decent setup but missing some confirmations, acceptable R:R (>1.5:1), proceed with caution
- C: Weak setup, unclear structure, poor R:R, or conflicting signals - avoid or wait

Be specific with price levels. Use the ${strategy} methodology strictly.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
      contents: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        },
        `Analyze this chart using ${strategy} methodology and provide a graded trade recommendation.`,
      ],
    });

    const rawJson = response.text;
    
    if (rawJson) {
      const parsed = JSON.parse(rawJson);
      
      const validationResult = finalAnalysisSchema.safeParse(parsed);
      
      if (validationResult.success) {
        return validationResult.data;
      }
      
      console.warn("Gemini response didn't match schema exactly, using defaults for missing fields");
      
      return {
        meta: parsed.meta || {
          ticker: metadata.ticker,
          strategy_used: strategy,
          timestamp: new Date().toISOString(),
        },
        grading: {
          grade: parsed.grading?.grade || "C",
          headline: parsed.grading?.headline || "Analysis complete",
          visual_score: parsed.grading?.visual_score ?? 50,
          data_score: parsed.grading?.data_score ?? 50,
          sentiment_score: parsed.grading?.sentiment_score ?? 50,
          risk_reward_score: parsed.grading?.risk_reward_score ?? 50,
          momentum_score: parsed.grading?.momentum_score ?? 50,
          action_plan: parsed.grading?.action_plan || {
            action: "WAIT",
            price: "N/A",
            stop_loss: "N/A",
            target: "N/A",
          },
          reasoning: parsed.grading?.reasoning || "See detailed analysis",
        },
        visual_analysis: parsed.visual_analysis || {
          trend: "NEUTRAL",
          patterns_detected: [],
          key_levels_visible: {},
          chart_quality_check: "Analysis complete",
        },
        agent_grounding: parsed.agent_grounding || {
          search_queries_run: [],
          critical_findings: "See visual analysis",
          divergence_warning: false,
        },
        trade_plan: parsed.trade_plan || {
          bias: "NEUTRAL",
          entry_zone: "N/A",
          stop_loss: "N/A",
          take_profit_1: "N/A",
          take_profit_2: "N/A",
        },
        confidence_score: parsed.confidence_score ?? 50,
        final_verdict: parsed.final_verdict || "Analysis complete. Review trade plan for details.",
      } as FinalAnalysis;
    }
    throw new Error("Empty response from model");
  } catch (error) {
    console.error("Chart analysis error:", error);
    throw new Error(`Analysis failed: ${error}`);
  }
}

const ANNOTATION_INSTRUCTIONS: Record<string, string> = {
  SMC: "Draw boxes around Fair Value Gaps (FVG) in RED. Mark Liquidity Sweeps (X) at swing highs/lows. Draw Order Blocks as rectangles in BLUE.",
  LIQUIDITY_FLOW: "Draw horizontal rays at major Swing Highs (Buy Side Liquidity) and Swing Lows (Sell Side Liquidity). Mark Stop Hunts with circles.",
  ELLIOTT: "Draw the Elliott Wave count (1-2-3-4-5) in BLUE and correction (A-B-C) in YELLOW. Connect pivots with lines.",
  WYCKOFF: "Label the Wyckoff Phases (PS, SC, AR, ST, Spring). Circle the Spring/Upthrust in GREEN/RED.",
  VCP: "Draw curved lines underneath the volatility contractions. Draw a straight line at the breakout pivot point.",
  CAN_SLIM: "Mark the cup-and-handle or base pattern. Draw the pivot/buy point. Mark volume spikes.",
  DOW: "Draw trend lines connecting Higher Highs and Higher Lows (or Lower Highs and Lower Lows). Mark trend reversals.",
  GANN: "Draw Gann fan angles from major pivots. Mark key time/price squares.",
  INVESTMENT_CLOCK: "Mark the current economic cycle phase. Label sector rotation indicators.",
  LPPL: "Draw the parabolic curve fit. Mark oscillation points and potential crash zone.",
  INTERMARKET: "Mark correlation signals and divergences between markets.",
  FRACTAL: "Mark fractal patterns at different scales. Connect self-similar structures.",
  SENTIMENT: "Mark extreme sentiment zones. Draw sentiment divergences from price.",
};

export async function annotateChart(
  imageBase64: string,
  mimeType: string,
  strategy: StrategyType
): Promise<string> {
  const drawingInstruction = ANNOTATION_INSTRUCTIONS[strategy] || 
    "Draw key technical levels (Support/Resistance) in RED and GREEN. Mark important price zones.";

  const prompt = `You are a professional technical analyst and chart annotator.

Task: Annotate this trading chart image visually based on the ${strategy} framework.

Instructions: ${drawingInstruction}

Important:
- Draw directly on the chart image
- Use clear, visible colors that contrast with the chart
- Add text labels where appropriate
- Keep annotations clean and professional
- Do NOT cover important price data

Output: Return the IMAGE with these annotations drawn directly on it.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      config: {
        responseModalities: ["image", "text"],
      },
      contents: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        },
        prompt,
      ],
    });

    const candidates = response.candidates;
    if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No annotated image generated by model");
  } catch (error) {
    console.error("Chart annotation error:", error);
    throw new Error(`Annotation failed: ${error}`);
  }
}
