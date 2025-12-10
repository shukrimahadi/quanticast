import type { Express } from "express";
import type { Server } from "http";
import { randomUUID } from "crypto";
import { storage } from "./storage";
import { validateChart, analyzeChartWithStrategy, runGroundingSearch } from "./gemini";
import { analyzeRequestSchema, StrategyType } from "@shared/schema";
import type { Report } from "@shared/schema";

export async function registerRoutes(httpServer: Server, app: Express): Promise<void> {
  const isRateLimitError = (message?: string) => {
    if (!message) return false;
    const m = message.toLowerCase();
    return (
      m.includes("429") ||
      m.includes("resource_exhausted") ||
      m.includes("rate limit") ||
      m.includes("quota")
    );
  };
  
  // Analyze chart endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const parseResult = analyzeRequestSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({
          error: "Invalid request",
          details: parseResult.error.errors,
        });
      }

      const { strategy, imageBase64, imageMimeType, subscriptionTier = 'FREE' } = parseResult.data;

      // Step 1: Validate the chart
      const validation = await validateChart(imageBase64, imageMimeType);

      if (!validation.is_valid_chart) {
        if (isRateLimitError(validation.rejection_reason || "")) {
          return res.status(429).json({
            error: "Rate limit",
            message: "AI quota temporarily exceeded. Please wait a minute and try again.",
            validation,
          });
        }
        return res.status(400).json({
          error: "Invalid chart",
          rejection_reason: validation.rejection_reason,
          validation,
        });
      }

      // Step 2: Analyze the chart with the selected strategy
      const metadata = validation.metadata || {
        ticker: "UNKNOWN",
        timeframe: "UNKNOWN",
        current_price: 0,
      };

      const analysis = await analyzeChartWithStrategy(
        imageBase64,
        imageMimeType,
        strategy,
        metadata
      );

      // Step 3: Run Grounding Search for market catalysts
      console.log(`[PIPELINE] Running grounding search for ${metadata.ticker}...`);
      const groundingResult = await runGroundingSearch(
        metadata.ticker,
        analysis.trade_plan.bias,
        analysis.grading.grade as "A+" | "A" | "B" | "C",
        subscriptionTier
      );

      // Step 4: Apply grade adjustment based on grounding confluence
      const finalGrade = groundingResult.grade_adjustment.adjusted_grade;
      const gradeChanged = finalGrade !== analysis.grading.grade;
      
      if (gradeChanged) {
        console.log(`[PIPELINE] Grade adjusted: ${analysis.grading.grade} -> ${finalGrade}`);
        console.log(`[PIPELINE] Reason: ${groundingResult.grade_adjustment.adjustment_reason}`);
      }

      // Update analysis with grounding results
      const enrichedAnalysis = {
        ...analysis,
        grading: {
          ...analysis.grading,
          grade: finalGrade, // Use the adjusted grade
        },
        grounding_result: groundingResult,
        grounding_findings: groundingResult.search_performed
          ? `Catalyst Analysis: ${groundingResult.risk_assessment.catalyst_alignment} | ` +
            `Binary Event Risk: ${groundingResult.risk_assessment.binary_event_risk ? "YES" : "NO"} | ` +
            `Sentiment: ${groundingResult.sentiment.news_sentiment}`
          : "Grounding search unavailable",
      };

      // Step 5: Create and save the report
      const report: Report = {
        id: randomUUID(),
        timestamp: Date.now(),
        ticker: metadata.ticker,
        strategy: strategy,
        grade: finalGrade, // Use adjusted grade
        bias: analysis.trade_plan.bias,
        data: enrichedAnalysis,
        validation,
      };

      await storage.saveReport(report);

      return res.json({
        success: true,
        report,
        grounding: {
          performed: groundingResult.search_performed,
          grade_adjusted: gradeChanged,
          original_grade: groundingResult.grade_adjustment.original_grade,
          final_grade: finalGrade,
          reason: groundingResult.grade_adjustment.adjustment_reason,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (isRateLimitError(message)) {
        return res.status(429).json({
          error: "Rate limit",
          message: "AI quota temporarily exceeded. Please wait and retry shortly.",
        });
      }
      console.error("Analysis error:", error);
      return res.status(500).json({
        error: "Analysis failed",
        message,
      });
    }
  });

  // Get all reports
  app.get("/api/reports", async (_req, res) => {
    try {
      const reports = await storage.getReports();
      return res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      return res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  // Get single report
  app.get("/api/reports/:id", async (req, res) => {
    try {
      const report = await storage.getReport(req.params.id);
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      return res.json(report);
    } catch (error) {
      console.error("Error fetching report:", error);
      return res.status(500).json({ error: "Failed to fetch report" });
    }
  });

  // Delete report
  app.delete("/api/reports/:id", async (req, res) => {
    try {
      const success = await storage.deleteReport(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Report not found" });
      }
      return res.json({ success: true });
    } catch (error) {
      console.error("Error deleting report:", error);
      return res.status(500).json({ error: "Failed to delete report" });
    }
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      gemini_configured: !!process.env.GEMINI_API_KEY,
    });
  });
}
