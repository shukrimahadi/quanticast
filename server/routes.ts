import type { Express } from "express";
import type { Server } from "http";
import { randomUUID } from "crypto";
import { storage } from "./storage";
import { validateChart, analyzeChartWithStrategy, annotateChart } from "./gemini";
import { analyzeRequestSchema, StrategyType } from "@shared/schema";
import type { Report } from "@shared/schema";

export async function registerRoutes(httpServer: Server, app: Express): Promise<void> {
  
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

      const { strategy, imageBase64, imageMimeType } = parseResult.data;

      // Step 1: Validate the chart
      const validation = await validateChart(imageBase64, imageMimeType);

      if (!validation.is_valid_chart) {
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

      // Step 3: Create and save the report
      const report: Report = {
        id: randomUUID(),
        timestamp: Date.now(),
        ticker: metadata.ticker,
        strategy: strategy,
        grade: analysis.grading.grade,
        bias: analysis.trade_plan.bias,
        data: analysis,
        validation,
      };

      await storage.saveReport(report);

      return res.json({
        success: true,
        report,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      return res.status(500).json({
        error: "Analysis failed",
        message: error instanceof Error ? error.message : "Unknown error",
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

  // Annotate chart endpoint - returns structured annotation data for SVG overlay
  app.post("/api/annotate", async (req, res) => {
    try {
      const { strategy, imageBase64, imageMimeType } = req.body;
      
      if (!strategy || !imageBase64 || !imageMimeType) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const annotationResult = await annotateChart(imageBase64, imageMimeType, strategy);
      
      return res.json({
        success: true,
        annotations: annotationResult.annotations,
        summary: annotationResult.summary,
      });
    } catch (error) {
      console.error("Annotation error:", error);
      return res.status(500).json({
        error: "Annotation failed",
        message: error instanceof Error ? error.message : "Unknown error",
      });
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
