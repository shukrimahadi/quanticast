import { GoogleGenAI } from "@google/genai";
import type {
  ValidationResponse,
  FinalAnalysis,
  StrategyType,
  GroundingResult,
} from "@shared/schema";
import { finalAnalysisSchema, groundingResultSchema } from "@shared/schema";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const STRATEGY_DESCRIPTIONS: Record<string, string> = {
  SMC: "Smart Money Concepts (SMC) - Analyze order blocks, liquidity pools, fair value gaps, breaker blocks, mitigation blocks, and institutional order flow",
  ICT_2022: "ICT 2022 Mentorship Model - Identify Liquidity Sweeps (raids above/below swing highs/lows), Market Structure Shift (MSS) with Displacement, Fair Value Gaps (FVG), and Kill Zone timing (NY AM 8:30-11:00). Look for stop hunts followed by aggressive displacement candles creating imbalances",
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

/**
 * Grounding Agent: Real-time web search for market catalysts
 * Uses Gemini's Google Search grounding to fetch:
 * - Earnings calendar
 * - Economic events (CPI, FOMC, NFP)
 * - News sentiment
 * - Options flow / implied volatility
 */
export async function runGroundingSearch(
  ticker: string,
  bias: string,
  originalGrade: "A+" | "A" | "B" | "C"
): Promise<GroundingResult> {
  console.log(`[GROUNDING] Starting search for ${ticker}, bias: ${bias}, grade: ${originalGrade}`);
  
  const searchQuery = `${ticker} stock upcoming earnings date economic calendar news sentiment analyst ratings recent headlines`;
  
  const systemPrompt = `You are a professional market research analyst. Your task is to gather REAL-TIME data for trading decisions.

For ticker: ${ticker}
Current trade bias: ${bias}
Current technical grade: ${originalGrade}

Search for and analyze:
1. EARNINGS: When is the next earnings date? Is it within 5 trading days (imminent)?
2. ECONOMIC CALENDAR: Any high-impact events (CPI, FOMC, NFP) within 3 days?
3. NEWS SENTIMENT: What's the recent news tone? Bullish, bearish, neutral, or mixed?
4. VOLATILITY: Any unusual options activity or high implied volatility?
5. RISK ASSESSMENT: Are there binary event risks that could invalidate the trade?

After gathering data, determine if the grade should be ADJUSTED:
- If earnings/CPI/FOMC is imminent (within 3 days): Downgrade by 1 level (binary event risk)
- If news sentiment CONFLICTS with trade bias: Downgrade by 1 level
- If news sentiment SUPPORTS trade bias AND no binary events: Keep or upgrade
- Grade floor is C, ceiling is A+

Provide your analysis in the following format. Be specific with dates and percentages.`;

  try {
    // Use Gemini with Google Search grounding tool
    // Combine system prompt and query into a single user message for grounding
    const fullPrompt = `${systemPrompt}\n\nNow search for real-time information about: ${searchQuery}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        tools: [{ googleSearch: {} }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
    });

    const rawText = response.text ?? "";
    console.log(`[GROUNDING] Raw search response (${rawText.length} chars)`);
    
    // Extract grounding metadata if available
    const sources: { title: string; uri: string }[] = [];
    
    // Check for grounding metadata in the response
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      for (const chunk of response.candidates[0].groundingMetadata.groundingChunks) {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "Source",
            uri: chunk.web.uri || "",
          });
        }
      }
    }
    
    console.log(`[GROUNDING] Found ${sources.length} sources`);

    // Now parse the response with a second call to structure it
    const structurePrompt = `Based on this market research for ${ticker}:

${rawText}

Parse and structure this into the following JSON format. Use the actual data from the research above:
{
  "ticker": "${ticker}",
  "search_performed": true,
  "earnings": {
    "next_date": "YYYY-MM-DD or null if unknown",
    "days_until": number or null,
    "is_imminent": boolean (true if within 5 trading days),
    "last_surprise": "beat/miss percentage or null"
  },
  "economic_calendar": {
    "upcoming_events": ["array of upcoming high-impact events with dates"],
    "high_impact_soon": boolean (true if CPI/FOMC/NFP within 3 days)
  },
  "sentiment": {
    "news_sentiment": "Bullish" | "Bearish" | "Neutral" | "Mixed",
    "recent_headlines": ["up to 3 recent headlines"],
    "analyst_rating": "Buy/Hold/Sell or null"
  },
  "volatility": {
    "implied_volatility_percentile": number (0-100) or null,
    "options_unusual_activity": boolean
  },
  "risk_assessment": {
    "binary_event_risk": boolean (true if earnings/CPI/FOMC imminent),
    "risk_factors": ["list of specific risks"],
    "catalyst_alignment": "Supports" | "Conflicts" | "Neutral" (relative to ${bias} bias)
  },
  "grade_adjustment": {
    "original_grade": "${originalGrade}",
    "adjusted_grade": "A+" | "A" | "B" | "C",
    "adjustment_reason": "Brief explanation of why grade was kept or changed"
  }
}

Apply these grading rules:
- Binary event (earnings/major economic) within 3 days: Downgrade by 1 (A+ -> A, A -> B, B -> C)
- News sentiment conflicts with ${bias} bias: Downgrade by 1
- News sentiment supports ${bias} bias + no binary events: May upgrade by 1
- Multiple negative factors can stack
- Grade cannot go above A+ or below C`;

    const structuredResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: "You are a JSON formatter. Output only valid JSON, no markdown.",
        responseMimeType: "application/json",
      },
      contents: [
        {
          role: "user",
          parts: [{ text: structurePrompt }],
        },
      ],
    });

    const structuredJson = structuredResponse.text ?? "{}";
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(structuredJson);
    } catch (parseError) {
      console.error("[GROUNDING] JSON parse error:", parseError);
      console.log("[GROUNDING] Raw JSON:", structuredJson.slice(0, 500));
      parsed = {};
    }
    
    // Validate and return
    const parsedAny = parsed as Record<string, any>;
    const result: GroundingResult = {
      ticker: (parsedAny.ticker as string) || ticker,
      search_performed: true,
      earnings: {
        next_date: parsedAny.earnings?.next_date || null,
        days_until: parsedAny.earnings?.days_until ?? null,
        is_imminent: parsedAny.earnings?.is_imminent ?? false,
        last_surprise: parsedAny.earnings?.last_surprise || null,
      },
      economic_calendar: {
        upcoming_events: parsedAny.economic_calendar?.upcoming_events || [],
        high_impact_soon: parsedAny.economic_calendar?.high_impact_soon ?? false,
      },
      sentiment: {
        news_sentiment: parsedAny.sentiment?.news_sentiment || "Neutral",
        recent_headlines: parsedAny.sentiment?.recent_headlines || [],
        analyst_rating: parsedAny.sentiment?.analyst_rating || null,
      },
      volatility: {
        implied_volatility_percentile: parsedAny.volatility?.implied_volatility_percentile ?? null,
        options_unusual_activity: parsedAny.volatility?.options_unusual_activity ?? false,
      },
      risk_assessment: {
        binary_event_risk: parsedAny.risk_assessment?.binary_event_risk ?? false,
        risk_factors: parsedAny.risk_assessment?.risk_factors || [],
        catalyst_alignment: parsedAny.risk_assessment?.catalyst_alignment || "Neutral",
      },
      grade_adjustment: {
        original_grade: originalGrade,
        adjusted_grade: parsedAny.grade_adjustment?.adjusted_grade || originalGrade,
        adjustment_reason: parsedAny.grade_adjustment?.adjustment_reason || "No adjustment needed",
      },
      sources: sources.slice(0, 5), // Limit to 5 sources
      raw_search_response: rawText.slice(0, 2000), // Truncate for storage
    };

    console.log(`[GROUNDING] Grade: ${result.grade_adjustment.original_grade} -> ${result.grade_adjustment.adjusted_grade}`);
    console.log(`[GROUNDING] Reason: ${result.grade_adjustment.adjustment_reason}`);
    
    return result;
  } catch (error) {
    console.error("[GROUNDING] Search error:", error);
    
    // Return a fallback result if grounding fails
    return {
      ticker,
      search_performed: false,
      earnings: {
        next_date: null,
        days_until: null,
        is_imminent: false,
        last_surprise: null,
      },
      economic_calendar: {
        upcoming_events: [],
        high_impact_soon: false,
      },
      sentiment: {
        news_sentiment: "Neutral",
        recent_headlines: [],
        analyst_rating: null,
      },
      volatility: {
        implied_volatility_percentile: null,
        options_unusual_activity: false,
      },
      risk_assessment: {
        binary_event_risk: false,
        risk_factors: ["Grounding search unavailable"],
        catalyst_alignment: "Neutral",
      },
      grade_adjustment: {
        original_grade: originalGrade,
        adjusted_grade: originalGrade,
        adjustment_reason: "Search unavailable - using visual analysis grade only",
      },
      sources: [],
      raw_search_response: `Error: ${error}`,
    };
  }
}

// Annotation data structure for SVG overlay
export interface ChartAnnotation {
  id: string;
  type: "line" | "rectangle" | "label" | "arrow" | "zone";
  color: string;
  // Normalized coordinates (0-1 range relative to image dimensions)
  x1: number;
  y1: number;
  x2?: number;
  y2?: number;
  label?: string;
  dashed?: boolean;
}

export interface AnnotationResult {
  annotations: ChartAnnotation[];
  summary: string;
}

const ANNOTATION_PROMPTS: Record<string, string> = {
  SMC: `Identify and locate: Fair Value Gaps (FVG) as rectangles, Order Blocks as rectangles, Liquidity Sweeps as labels at swing points. Use RED for bearish, GREEN for bullish elements.`,
  ICT_2022: `Identify ICT 2022 Model elements: 1) Mark Swing Highs with "BSL" (Buy Side Liquidity) labels and Swing Lows with "SSL" (Sell Side Liquidity) labels. 2) Draw rectangles around Fair Value Gaps (FVG) - bullish FVG in green, bearish FVG in red. 3) Mark the Liquidity Sweep point where price raids above/below a swing. 4) Draw a line at Market Structure Shift (MSS) level. 5) Mark Displacement candles with arrows. 6) If visible, note Kill Zone timing.`,
  LIQUIDITY_FLOW: `Identify: Buy Side Liquidity zones (swing highs) and Sell Side Liquidity zones (swing lows). Mark liquidity sweeps and stop hunts.`,
  ELLIOTT: `Count and label Elliott Waves: Impulse waves 1-2-3-4-5 and corrective waves A-B-C. Draw lines connecting wave pivots.`,
  WYCKOFF: `Identify Wyckoff phases and events: PS (Preliminary Support), SC (Selling Climax), AR (Automatic Rally), ST (Secondary Test), Spring, SOS (Sign of Strength). Label key points.`,
  VCP: `Identify Volatility Contraction Pattern: Mark each contraction as the price range narrows. Draw the pivot/breakout level as a horizontal line.`,
  CAN_SLIM: `Identify: Cup and handle patterns, flat bases, pivot/buy points. Mark volume characteristics if visible.`,
  DOW: `Draw trend lines: Connect Higher Highs and Higher Lows for uptrend, Lower Highs and Lower Lows for downtrend. Mark trend reversals.`,
  GANN: `Identify Gann elements: Key angles from major pivots (1x1, 2x1, 1x2), time/price squares, support/resistance levels.`,
  INVESTMENT_CLOCK: `Mark economic cycle indicators visible in the chart. Identify sector rotation signals.`,
  LPPL: `Identify bubble/crash patterns: Mark accelerating price curve, oscillation peaks, potential critical points.`,
  INTERMARKET: `Identify correlation signals: Mark divergences, convergences, and cross-market confirmation signals.`,
  FRACTAL: `Identify fractal patterns: Mark self-similar structures at different scales, fractal breakout points.`,
  SENTIMENT: `Identify sentiment extremes: Mark overbought/oversold zones, sentiment divergences from price action.`,
};

export async function annotateChart(
  imageBase64: string,
  mimeType: string,
  strategy: StrategyType
): Promise<AnnotationResult> {
  const strategyPrompt = ANNOTATION_PROMPTS[strategy] || 
    "Identify key support and resistance levels, trend lines, and important price zones.";

  const systemPrompt = `You are an expert technical chart analyst. Analyze this trading chart and provide structured annotation data.

STRATEGY: ${strategy}
TASK: ${strategyPrompt}

Return a JSON object with annotations to be drawn as an SVG overlay on the chart.
All coordinates must be NORMALIZED (0.0 to 1.0) where:
- x=0 is left edge, x=1 is right edge
- y=0 is TOP edge, y=1 is bottom edge

IMPORTANT: Be precise with coordinates. Look at where price patterns actually occur on the chart.

JSON Format:
{
  "annotations": [
    {
      "id": "unique_id",
      "type": "line" | "rectangle" | "label" | "arrow" | "zone",
      "color": "#RRGGBB (use #22c55e for bullish, #ef4444 for bearish, #3b82f6 for neutral, #eab308 for warning)",
      "x1": 0.0-1.0 (start x position),
      "y1": 0.0-1.0 (start y position),
      "x2": 0.0-1.0 (end x for lines/rectangles, optional),
      "y2": 0.0-1.0 (end y for lines/rectangles, optional),
      "label": "text label (optional)",
      "dashed": boolean (optional, for potential/unconfirmed levels)
    }
  ],
  "summary": "Brief 1-2 sentence summary of the annotations"
}

ANNOTATION TYPES:
- "line": Draw from (x1,y1) to (x2,y2) - use for trend lines, support/resistance
- "rectangle": Draw box from (x1,y1) to (x2,y2) - use for zones, FVGs, order blocks
- "label": Place text at (x1,y1) - use for wave counts, phase labels
- "arrow": Draw arrow from (x1,y1) pointing toward (x2,y2) - use for direction indicators
- "zone": Horizontal zone from y1 to y2 spanning full width - use for price levels

Provide 5-15 meaningful annotations. Focus on the most significant patterns for the ${strategy} methodology.`;

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
        `Analyze this chart using ${strategy} methodology and provide structured annotation coordinates.`,
      ],
    });

    const rawJson = response.text;
    
    if (rawJson) {
      const parsed = JSON.parse(rawJson);
      
      // Validate and sanitize annotations
      const annotations: ChartAnnotation[] = (parsed.annotations || [])
        .filter((a: ChartAnnotation) => 
          a.type && 
          typeof a.x1 === 'number' && 
          typeof a.y1 === 'number' &&
          a.x1 >= 0 && a.x1 <= 1 &&
          a.y1 >= 0 && a.y1 <= 1
        )
        .map((a: ChartAnnotation, i: number) => ({
          id: a.id || `ann_${i}`,
          type: a.type,
          color: a.color || '#3b82f6',
          x1: Math.max(0, Math.min(1, a.x1)),
          y1: Math.max(0, Math.min(1, a.y1)),
          x2: a.x2 !== undefined ? Math.max(0, Math.min(1, a.x2)) : undefined,
          y2: a.y2 !== undefined ? Math.max(0, Math.min(1, a.y2)) : undefined,
          label: a.label,
          dashed: a.dashed,
        }));

      return {
        annotations,
        summary: parsed.summary || `${annotations.length} annotations generated for ${strategy} analysis.`,
      };
    }
    
    throw new Error("Empty response from model");
  } catch (error) {
    console.error("Chart annotation error:", error);
    throw new Error(`Annotation failed: ${error}`);
  }
}
