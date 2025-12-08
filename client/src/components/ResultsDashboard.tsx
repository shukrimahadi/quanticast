import { FinalAnalysis } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import GradeBadge from './GradeBadge';
import ScoreCard from './ScoreCard';
import TradePlan from './TradePlan';
import KeyLevels from './KeyLevels';
import ConfidenceMeter from './ConfidenceMeter';
import PatternsList from './PatternsList';
import Verdict from './Verdict';
import { Eye, Database, Users, Target, TrendingUp, RefreshCw, Download } from 'lucide-react';

interface ResultsDashboardProps {
  analysis: FinalAnalysis;
  imagePreviewUrl: string | null;
  onNewAnalysis: () => void;
}

export default function ResultsDashboard({ analysis, imagePreviewUrl, onNewAnalysis }: ResultsDashboardProps) {
  const { grading, visual_analysis, trade_plan, external_data, confidence_score, final_verdict, meta } = analysis;

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
            <Card className="p-4">
              <img
                src={imagePreviewUrl}
                alt="Analyzed chart"
                className="w-full h-auto rounded-md"
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
