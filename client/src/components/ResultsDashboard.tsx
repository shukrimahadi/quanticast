import { useState, useRef, useEffect } from 'react';
import { FinalAnalysis } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GradeBadge from './GradeBadge';
import ScoreCard from './ScoreCard';
import TradePlan from './TradePlan';
import KeyLevels from './KeyLevels';
import ConfidenceMeter from './ConfidenceMeter';
import PatternsList from './PatternsList';
import Verdict from './Verdict';
import { Eye, Database, Users, Target, TrendingUp, RefreshCw, Download, Pencil, Loader2, Layers } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

// Annotation types matching server response
interface ChartAnnotation {
  id: string;
  type: "line" | "rectangle" | "label" | "arrow" | "zone";
  color: string;
  x1: number;
  y1: number;
  x2?: number;
  y2?: number;
  label?: string;
  dashed?: boolean;
}

interface ResultsDashboardProps {
  analysis: FinalAnalysis;
  imagePreviewUrl: string | null;
  imageBase64?: string;
  imageMimeType?: string;
  onNewAnalysis: () => void;
}

// SVG Annotation Overlay Component
function AnnotationOverlay({ 
  annotations, 
  width, 
  height 
}: { 
  annotations: ChartAnnotation[]; 
  width: number; 
  height: number;
}) {
  return (
    <svg 
      className="absolute inset-0 pointer-events-none" 
      width={width} 
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
        </marker>
      </defs>
      {annotations.map((ann) => {
        const x1 = ann.x1 * width;
        const y1 = ann.y1 * height;
        const x2 = (ann.x2 ?? ann.x1) * width;
        const y2 = (ann.y2 ?? ann.y1) * height;

        switch (ann.type) {
          case "line":
            return (
              <g key={ann.id}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={ann.color}
                  strokeWidth={2}
                  strokeDasharray={ann.dashed ? "6,4" : undefined}
                  opacity={0.9}
                />
                {ann.label && (
                  <text
                    x={(x1 + x2) / 2}
                    y={(y1 + y2) / 2 - 8}
                    fill={ann.color}
                    fontSize="12"
                    fontWeight="600"
                    textAnchor="middle"
                    className="font-mono"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                  >
                    {ann.label}
                  </text>
                )}
              </g>
            );

          case "rectangle":
            return (
              <g key={ann.id}>
                <rect
                  x={Math.min(x1, x2)}
                  y={Math.min(y1, y2)}
                  width={Math.abs(x2 - x1)}
                  height={Math.abs(y2 - y1)}
                  fill={ann.color}
                  fillOpacity={0.15}
                  stroke={ann.color}
                  strokeWidth={2}
                  strokeDasharray={ann.dashed ? "6,4" : undefined}
                />
                {ann.label && (
                  <text
                    x={Math.min(x1, x2) + 4}
                    y={Math.min(y1, y2) + 16}
                    fill={ann.color}
                    fontSize="11"
                    fontWeight="600"
                    className="font-mono"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                  >
                    {ann.label}
                  </text>
                )}
              </g>
            );

          case "zone":
            return (
              <g key={ann.id}>
                <rect
                  x={0}
                  y={Math.min(y1, y2)}
                  width={width}
                  height={Math.abs(y2 - y1)}
                  fill={ann.color}
                  fillOpacity={0.1}
                  stroke={ann.color}
                  strokeWidth={1}
                  strokeDasharray="4,4"
                />
                {ann.label && (
                  <text
                    x={8}
                    y={(y1 + y2) / 2 + 4}
                    fill={ann.color}
                    fontSize="11"
                    fontWeight="600"
                    className="font-mono"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                  >
                    {ann.label}
                  </text>
                )}
              </g>
            );

          case "arrow":
            return (
              <g key={ann.id} style={{ color: ann.color }}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={ann.color}
                  strokeWidth={2}
                  markerEnd="url(#arrowhead)"
                />
                {ann.label && (
                  <text
                    x={x1}
                    y={y1 - 8}
                    fill={ann.color}
                    fontSize="11"
                    fontWeight="600"
                    textAnchor="middle"
                    className="font-mono"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                  >
                    {ann.label}
                  </text>
                )}
              </g>
            );

          case "label":
            return (
              <g key={ann.id}>
                <circle
                  cx={x1}
                  cy={y1}
                  r={14}
                  fill={ann.color}
                  fillOpacity={0.9}
                />
                <text
                  x={x1}
                  y={y1 + 4}
                  fill="white"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="font-mono"
                >
                  {ann.label || ""}
                </text>
              </g>
            );

          default:
            return null;
        }
      })}
    </svg>
  );
}

export default function ResultsDashboard({ analysis, imagePreviewUrl, imageBase64, imageMimeType, onNewAnalysis }: ResultsDashboardProps) {
  const { grading, visual_analysis, trade_plan, external_data, confidence_score, final_verdict, meta } = analysis;
  const [annotations, setAnnotations] = useState<ChartAnnotation[]>([]);
  const [annotationSummary, setAnnotationSummary] = useState<string | null>(null);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [annotationError, setAnnotationError] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      setImageDimensions({
        width: imageRef.current.clientWidth,
        height: imageRef.current.clientHeight,
      });
    }
  }, [imagePreviewUrl]);

  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageDimensions({
        width: imageRef.current.clientWidth,
        height: imageRef.current.clientHeight,
      });
    }
  };

  const handleAnnotate = async () => {
    if (!imageBase64 || !imageMimeType) {
      setAnnotationError("Image data not available for annotation");
      return;
    }
    
    setIsAnnotating(true);
    setAnnotationError(null);
    
    try {
      const response = await apiRequest('POST', '/api/annotate', {
        strategy: meta.strategy_used,
        imageBase64,
        imageMimeType,
      });
      const data = await response.json();
      
      if (data.success && data.annotations) {
        setAnnotations(data.annotations);
        setAnnotationSummary(data.summary || null);
        setShowAnnotations(true);
      } else {
        setAnnotationError(data.message || "Annotation failed");
      }
    } catch (err) {
      setAnnotationError(err instanceof Error ? err.message : "Annotation failed");
    } finally {
      setIsAnnotating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <GradeBadge grade={grading.grade} size="lg" />
          <div>
            <h2 className="text-2xl font-mono font-bold">{meta.ticker}</h2>
            <p className="text-sm text-muted-foreground">{meta.strategy_used} Analysis</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onNewAnalysis} data-testid="button-new-analysis">
            <RefreshCw className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
          <Button variant="outline" data-testid="button-export">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {imagePreviewUrl && (
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  {annotations.length > 0 && (
                    <Button
                      variant={showAnnotations ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowAnnotations(!showAnnotations)}
                      data-testid="button-toggle-annotations"
                    >
                      <Layers className="w-4 h-4 mr-1" />
                      {showAnnotations ? "Hide" : "Show"} Annotations ({annotations.length})
                    </Button>
                  )}
                  {showAnnotations && annotations.length > 0 && (
                    <Badge variant="secondary" className="text-xs">AI Overlay Active</Badge>
                  )}
                </div>
                {annotations.length === 0 && imageBase64 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAnnotate}
                    disabled={isAnnotating}
                    data-testid="button-annotate-chart"
                  >
                    {isAnnotating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Pencil className="w-4 h-4 mr-2" />
                        AI Annotate Chart
                      </>
                    )}
                  </Button>
                )}
              </div>
              {annotationError && (
                <p className="text-sm text-fin-bear">{annotationError}</p>
              )}
              {annotationSummary && showAnnotations && (
                <p className="text-sm text-muted-foreground">{annotationSummary}</p>
              )}
              <div className="relative">
                <img
                  ref={imageRef}
                  src={imagePreviewUrl}
                  alt="Analyzed chart"
                  className="w-full h-auto rounded-md"
                  data-testid="img-chart-display"
                  onLoad={handleImageLoad}
                />
                {showAnnotations && annotations.length > 0 && imageDimensions.width > 0 && (
                  <AnnotationOverlay 
                    annotations={annotations} 
                    width={imageDimensions.width} 
                    height={imageDimensions.height}
                  />
                )}
              </div>
            </Card>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <ScoreCard label="Visual" value={grading.visual_score} icon={Eye} />
            <ScoreCard label="Data" value={grading.data_score} icon={Database} />
            <ScoreCard label="Sentiment" value={grading.sentiment_score} icon={Users} />
            <ScoreCard label="Risk/Reward" value={grading.risk_reward_score} icon={Target} />
            <ScoreCard label="Momentum" value={grading.momentum_score} icon={TrendingUp} />
          </div>

          <Verdict
            headline={grading.headline}
            reasoning={grading.reasoning}
            verdict={final_verdict}
            externalData={external_data}
          />

          <PatternsList
            patterns={visual_analysis.patterns_detected}
            trend={visual_analysis.trend}
          />
        </div>

        <div className="space-y-6">
          <TradePlan tradePlan={trade_plan} actionPlan={grading.action_plan} />
          <ConfidenceMeter score={confidence_score} />
          <KeyLevels levels={visual_analysis.key_levels_visible} />
        </div>
      </div>
    </div>
  );
}
