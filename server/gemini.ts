import { GoogleGenAI } from "@google/genai";
import type {
  ValidationResponse,
  FinalAnalysis,
  StrategyType,
  GroundingResult,
} from "@shared/schema";
import { finalAnalysisSchema, groundingResultSchema } from "@shared/schema";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Grounding cache: 1-hour TTL per ticker to reduce Google Search costs
interface CachedGrounding {
  data: GroundingResult;
  timestamp: number;
}
const groundingCache = new Map<string, CachedGrounding>();
const GROUNDING_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCachedGrounding(ticker: string): GroundingResult | null {
  const key = ticker.toUpperCase();
  const cached = groundingCache.get(key);
  if (cached && Date.now() - cached.timestamp < GROUNDING_CACHE_TTL_MS) {
    console.log(`[GROUNDING CACHE] Hit for ${key} (age: ${Math.round((Date.now() - cached.timestamp) / 60000)}min)`);
    return cached.data;
  }
  if (cached) {
    groundingCache.delete(key); // Expired
  }
  return null;
}

function setCachedGrounding(ticker: string, data: GroundingResult): void {
  const key = ticker.toUpperCase();
  groundingCache.set(key, { data, timestamp: Date.now() });
  console.log(`[GROUNDING CACHE] Stored ${key}, cache size: ${groundingCache.size}`);
}

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
      model: "gemini-2.5-flash-lite",
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
 * Asset Classification for dynamic search strategies
 */
function classifyAsset(ticker: string): { 
  assetClass: "EQUITY" | "CRYPTO" | "FOREX" | "COMMODITY" | "INDEX"; 
  searchQueries: string[];
} {
  const t = ticker.toUpperCase();
  
  // Crypto detection
  const cryptoPatterns = ['BTC', 'ETH', 'SOL', 'XRP', 'DOGE', 'ADA', 'AVAX', 'MATIC', 'LINK', 'DOT', 'USDT', 'USDC', 'BINANCE:', 'COINBASE:', 'BITSTAMP:'];
  if (cryptoPatterns.some(p => t.includes(p))) {
    return {
      assetClass: "CRYPTO",
      searchQueries: [
        `${ticker} regulatory news SEC government today`,
        `Crypto market sentiment Fear and Greed Index today`,
        `${ticker} protocol upgrades or security issues last 7 days`,
        `Bitcoin dominance trend and crypto market outlook today`,
      ],
    };
  }
  
  // Forex detection
  const forexPatterns = ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD', 'XAUUSD', 'XAGUSD', 'OANDA:', 'FX:'];
  if (forexPatterns.some(p => t.includes(p))) {
    const currencies = extractCurrencyPair(t);
    return {
      assetClass: "FOREX",
      searchQueries: [
        `Economic calendar high impact events ${currencies} next 48 hours`,
        `Central Bank interest rate decision Fed ECB BOJ latest`,
        `Geopolitical news affecting currency markets today`,
        `${currencies} technical outlook and analyst forecast today`,
      ],
    };
  }
  
  // Commodity detection  
  const commodityPatterns = ['GOLD', 'SILVER', 'OIL', 'USOIL', 'UKOIL', 'NATGAS', 'COPPER', 'WHEAT', 'CORN', 'TVC:', 'COMEX:', 'NYMEX:', 'CL1!', 'GC1!', 'SI1!'];
  if (commodityPatterns.some(p => t.includes(p))) {
    return {
      assetClass: "COMMODITY",
      searchQueries: [
        `${ticker} supply demand report inventory data today`,
        `US Dollar Index DXY strength trend today`,
        `${ticker} futures positioning COT report latest`,
        `Geopolitical risks affecting commodity prices today`,
      ],
    };
  }
  
  // Index detection
  const indexPatterns = ['SPX', 'SPY', 'QQQ', 'NDX', 'DJI', 'VIX', 'RUT', 'IWM', 'SP:', 'DJ:', 'NASDAQ:', 'CBOE:'];
  if (indexPatterns.some(p => t.includes(p))) {
    return {
      assetClass: "INDEX",
      searchQueries: [
        `VIX volatility index level and trend today`,
        `US 10 Year Treasury yield trend today`,
        `Stock market breadth advance decline line today`,
        `S&P 500 sector performance leaders laggards today`,
      ],
    };
  }
  
  // Default to Equity
  return {
    assetClass: "EQUITY",
    searchQueries: [
      `${ticker} next earnings date and expectations`,
      `${ticker} analyst upgrades downgrades last 7 days`,
      `${ticker} institutional insider buying selling activity`,
      `${ticker} major news headlines today`,
    ],
  };
}

function extractCurrencyPair(ticker: string): string {
  const t = ticker.toUpperCase();
  if (t.includes('EURUSD')) return 'EUR USD';
  if (t.includes('GBPUSD')) return 'GBP USD';
  if (t.includes('USDJPY')) return 'USD JPY';
  if (t.includes('AUDUSD')) return 'AUD USD';
  if (t.includes('USDCAD')) return 'USD CAD';
  if (t.includes('XAUUSD')) return 'Gold USD';
  if (t.includes('XAGUSD')) return 'Silver USD';
  return ticker;
}

/**
 * Asset-Aware Grounding Agent: Real-time web search for market catalysts
 * Dynamically adjusts search strategy based on asset class:
 * - EQUITIES: Earnings, analyst ratings, insider activity
 * - CRYPTO: Regulatory news, on-chain data, sentiment
 * - FOREX: Central bank policy, economic calendar
 * - COMMODITIES: Supply/demand, USD strength
 * - INDICES: VIX, yields, market breadth
 */
export async function runGroundingSearch(
  ticker: string,
  bias: string,
  originalGrade: "A+" | "A" | "B" | "C"
): Promise<GroundingResult> {
  // Check cache first to save Google Search costs ($0.035/query)
  const cachedResult = getCachedGrounding(ticker);
  if (cachedResult) {
    // Update the grade adjustment for the current analysis
    return {
      ...cachedResult,
      grade_adjustment: {
        ...cachedResult.grade_adjustment,
        original_grade: originalGrade,
        adjusted_grade: cachedResult.grade_adjustment.adjusted_grade,
      },
    };
  }

  const { assetClass, searchQueries } = classifyAsset(ticker);
  console.log(`[GROUNDING] Asset: ${assetClass} | Ticker: ${ticker} | Bias: ${bias} | Grade: ${originalGrade}`);
  console.log(`[GROUNDING] Search queries:`, searchQueries);
  
  const systemPrompt = `You are a Senior Macro Strategist & Risk Manager. Your goal is to validate a technical ${bias} setup for ${ticker} by cross-referencing with REAL-TIME fundamental data.

---
### PHASE 1: ASSET CLASSIFICATION
Identified Asset Class: ${assetClass}

${assetClass === 'EQUITY' ? `**EQUITY SEARCH FOCUS:**
- EARNINGS DATE: Is earnings within 48 hours? (CRITICAL BINARY EVENT)
- ANALYST ACTIVITY: Any upgrades/downgrades last 7 days?
- INSIDER TRADING: Net buying or selling trend?
- NEWS SENTIMENT: Recent headlines positive or negative?` : ''}

${assetClass === 'CRYPTO' ? `**CRYPTO SEARCH FOCUS:**
- REGULATORY: Any SEC/government actions or statements?
- SENTIMENT: Fear & Greed Index level (0-100)?
- PROTOCOL RISKS: Any hacks, exploits, or upgrade issues?
- MACRO CRYPTO: Bitcoin dominance trend affecting altcoins?` : ''}

${assetClass === 'FOREX' ? `**FOREX SEARCH FOCUS:**
- CENTRAL BANKS: Fed/ECB/BOJ rate decisions imminent?
- ECONOMIC DATA: CPI, NFP, GDP releases within 48h? (BINARY EVENT)
- GEOPOLITICAL: Conflicts or trade tensions affecting currencies?
- CARRY TRADE: Interest rate differentials supporting trade?` : ''}

${assetClass === 'COMMODITY' ? `**COMMODITY SEARCH FOCUS:**
- SUPPLY/DEMAND: Inventory reports or production data?
- USD CORRELATION: Dollar Index (DXY) strength/weakness?
- GEOPOLITICAL: Supply disruption risks?
- SEASONALITY: Seasonal demand patterns?` : ''}

${assetClass === 'INDEX' ? `**INDEX SEARCH FOCUS:**
- VIX LEVEL: Above 20 = elevated fear, below 15 = complacency
- BOND YIELDS: 10Y Treasury trend (rising = headwind for stocks)
- BREADTH: Advance/Decline line confirming or diverging?
- SECTOR ROTATION: Which sectors leading/lagging?` : ''}

---
### PHASE 2: THE BINARY EVENT CHECK (CRITICAL)
After searching, you MUST determine if a BINARY EVENT is imminent:
- Earnings call within 48 hours
- CPI/NFP/FOMC announcement within 48 hours
- Major regulatory decision for crypto
- Central bank rate decision

**BINARY EVENT GRADING RULES:**
- Event within 12 hours: MAX GRADE = "C" (regardless of chart quality)
- Event within 48 hours: MAX GRADE = "B" (one grade cap)
- No imminent events: Normal grading applies

---
### PHASE 3: DIVERGENCE ANALYSIS
Compare Technical Bias (${bias}) with Fundamental Data:
- **CONFLUENCE**: Technicals + Fundamentals align → Consider upgrade
- **DIVERGENCE**: Technicals say BUY but news is bearish → DOWNGRADE by 1 level
- **CONFLICT**: Multiple negative factors → Can downgrade by 2 levels

Current technical grade: ${originalGrade}
Apply adjustments based on your findings.

---
Execute the search queries and synthesize findings.`;

  try {
    // Use Gemini with Google Search grounding tool
    // Combine system prompt with asset-specific queries
    const fullPrompt = `${systemPrompt}\n\nExecute these searches:\n${searchQueries.map((q, i) => `${i + 1}. ${q}`).join('\n')}`;
    
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
  "narrative_summary": "A comprehensive 3-5 sentence paragraph summarizing the fundamental outlook. Write like a senior macro strategist explaining whether external data supports or conflicts with the ${bias} technical bias. Include specific data points: earnings dates, economic events, analyst ratings, news sentiment, and any imminent binary events. Mention the current time context for any scheduled events.",
  "critical_insight": "A 1-2 sentence italic summary for traders. Start with whether there's an imminent event or not. Then provide the key takeaway about the fundamental-technical confluence. Example: 'No imminent Fed event. Strong bullish macro sentiment for tech driven by AI demand and Fed rate cut expectations. Some analysts caution about valuation concerns.'",
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
      narrative_summary: parsedAny.narrative_summary || `External data analysis for ${ticker} based on ${bias} technical bias.`,
      critical_insight: parsedAny.critical_insight || "Analysis based on available market data.",
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
    
    // Cache the result for 1 hour to reduce API costs
    setCachedGrounding(ticker, result);
    
    return result;
  } catch (error) {
    console.error("[GROUNDING] Search error:", error);
    
    // Return a fallback result if grounding fails
    return {
      ticker,
      search_performed: false,
      narrative_summary: "Market grounding search was not performed. Analysis is based on visual chart patterns only.",
      critical_insight: "No external data available. Rely on technical analysis.",
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
