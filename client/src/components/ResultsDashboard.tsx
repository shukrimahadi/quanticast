import { useState } from 'react';
import { FinalAnalysis, StrategyType } from '@/lib/types';
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
import { Eye, Database, Users, Target, TrendingUp, RefreshCw, Download, Pencil, Loader2, ImageIcon } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface ResultsDashboardProps {
  analysis: FinalAnalysis;
  imagePreviewUrl: string | null;
  imageBase64?: string;
  imageMimeType?: string;
  onNewAnalysis: () => void;
}

export default function ResultsDashboard({ analysis, imagePreviewUrl, imageBase64, imageMimeType, onNewAnalysis }: ResultsDashboardProps) {
  const { grading, visual_analysis, trade_plan, external_data, confidence_score, final_verdict, meta } = analysis;
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [showAnnotated, setShowAnnotated] = useState(false);
  const [annotationError, setAnnotationError] = useState<string | null>(null);

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
      
      if (data.success && data.annotatedImage) {
        setAnnotatedImage(data.annotatedImage);
        setShowAnnotated(true);
      } else {
        setAnnotationError(data.message || "Annotation failed");
      }
    } catch (err) {
      setAnnotationError(err instanceof Error ? err.message : "Annotation failed");
    } finally {
      setIsAnnotating(false);
    }
  };

  const displayImage = showAnnotated && annotatedImage ? annotatedImage : imagePreviewUrl;

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
          {displayImage && (
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  {annotatedImage && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant={!showAnnotated ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowAnnotated(false)}
                        data-testid="button-show-original"
                      >
                        <ImageIcon className="w-4 h-4 mr-1" />
                        Original
                      </Button>
                      <Button
                        variant={showAnnotated ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowAnnotated(true)}
                        data-testid="button-show-annotated"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Annotated
                      </Button>
                    </div>
                  )}
                  {showAnnotated && annotatedImage && (
                    <Badge variant="secondary" className="text-xs">AI Annotated</Badge>
                  )}
                </div>
                {!annotatedImage && imageBase64 && (
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
                        Annotating...
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
              <img
                src={displayImage}
                alt={showAnnotated ? "AI Annotated chart" : "Analyzed chart"}
                className="w-full h-auto rounded-md"
                data-testid="img-chart-display"
              />
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
