import { useState, useCallback, useEffect } from 'react';
import { AppStep, StrategyType, FinalAnalysis, Report } from '@/lib/types';
import Header from '@/components/Header';
import ChartUpload from '@/components/ChartUpload';
import StrategySelector from '@/components/StrategySelector';
import AnalysisProgress from '@/components/AnalysisProgress';
import AnalysisLogs from '@/components/AnalysisLogs';
import ResultsDashboard from '@/components/ResultsDashboard';
import ReportHistory from '@/components/ReportHistory';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle, Play } from 'lucide-react';

// todo: remove mock functionality
const createMockAnalysis = (ticker: string, strategy: string): FinalAnalysis => ({
  meta: {
    ticker,
    strategy_used: strategy,
    timestamp: new Date().toISOString(),
  },
  grading: {
    grade: 'A+',
    headline: 'Premium Setup: Liquidity Sweep + FVG Confluence',
    visual_score: 92,
    data_score: 85,
    sentiment_score: 78,
    risk_reward_score: 88,
    momentum_score: 82,
    action_plan: {
      action: 'BUY STOP',
      price: '$186.50',
      stop_loss: '$182.00',
      target: '$195.00',
    },
    reasoning: 'Clear institutional footprint with liquidity grab below Asian session low, followed by aggressive bullish displacement creating a clean Fair Value Gap. No earnings or FOMC in next 72 hours.',
  },
  visual_analysis: {
    trend: 'BULLISH',
    patterns_detected: ['Fair Value Gap', 'Order Block', 'Liquidity Sweep', 'Break of Structure'],
    key_levels_visible: {
      'resistance_1': '$195.50',
      'support_1': '$182.00',
      'pivot': '$188.00',
      'fvg_zone': '$184.20 - $185.80',
    },
    chart_quality_check: 'High quality, all elements visible',
  },
  agent_grounding: {
    search_queries_run: ['AAPL earnings date', 'FOMC schedule'],
    critical_findings: 'No binary events in next 72 hours',
    divergence_warning: false,
  },
  trade_plan: {
    bias: 'BULLISH',
    entry_zone: '$185.50 - $186.20',
    stop_loss: '$182.00',
    take_profit_1: '$195.00',
    take_profit_2: '$210.00',
  },
  external_data: {
    search_summary: 'Strong institutional accumulation detected',
    market_sentiment: 'Risk-On',
    sources: [
      { title: 'Technical Analysis Report', uri: 'https://example.com/1' },
      { title: 'Market Sentiment Dashboard', uri: 'https://example.com/2' },
    ],
  },
  confidence_score: 87,
  final_verdict: 'EXECUTE: High probability long setup. Enter at $186.50 with SL at $182.00. This is a Grade A+ institutional setup.',
});

export default function Home() {
  const [step, setStep] = useState<AppStep>('UPLOAD');
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>(StrategyType.SMC);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysisData, setAnalysisData] = useState<FinalAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [history, setHistory] = useState<Report[]>([]);

  const addLog = useCallback((message: string) => {
    setLogs(prev => [...prev, message]);
  }, []);

  const handleImageSelect = (file: File, url: string) => {
    setImageFile(file);
    setImagePreviewUrl(url);
    setError(null);
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
  };

  // todo: remove mock functionality - replace with real API call
  const runAnalysis = async () => {
    if (!imageFile) return;

    setStep('VALIDATING');
    setLogs([]);
    setError(null);

    addLog('Starting chart validation...');
    await new Promise(r => setTimeout(r, 800));
    addLog('Chart validated successfully');
    addLog(`Ticker detected: AAPL`);
    addLog(`Timeframe: 4H`);

    setStep('ANALYZING');
    await new Promise(r => setTimeout(r, 600));
    addLog(`Initializing ${selectedStrategy} analysis pipeline...`);
    await new Promise(r => setTimeout(r, 500));
    addLog('Detecting liquidity zones...');
    await new Promise(r => setTimeout(r, 700));
    addLog('Found 3 Fair Value Gaps');
    await new Promise(r => setTimeout(r, 600));
    addLog('Analyzing market structure...');
    await new Promise(r => setTimeout(r, 800));
    addLog('Grounding with real-time data...');
    await new Promise(r => setTimeout(r, 700));
    addLog('Checking economic calendar...');
    await new Promise(r => setTimeout(r, 500));
    addLog('Generating trade plan...');
    await new Promise(r => setTimeout(r, 600));
    addLog('Analysis complete!');

    const mockResult = createMockAnalysis('AAPL', selectedStrategy);
    setAnalysisData(mockResult);

    const newReport: Report = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      ticker: mockResult.meta.ticker,
      strategy: selectedStrategy,
      grade: mockResult.grading.grade,
      bias: mockResult.trade_plan.bias,
      data: mockResult,
      validation: { is_valid_chart: true, rejection_reason: null },
    };
    setHistory(prev => [newReport, ...prev]);

    setStep('RESULTS');
  };

  const handleNewAnalysis = () => {
    setStep('UPLOAD');
    setImageFile(null);
    setImagePreviewUrl(null);
    setAnalysisData(null);
    setLogs([]);
    setError(null);
  };

  const handleViewHistory = () => {
    setStep('REPORTS');
  };

  const handleBackFromHistory = () => {
    if (analysisData) {
      setStep('RESULTS');
    } else {
      setStep('UPLOAD');
    }
  };

  const handleViewReport = (report: Report) => {
    setAnalysisData(report.data);
    setStep('RESULTS');
  };

  const handleDeleteReport = (id: string) => {
    setHistory(prev => prev.filter(r => r.id !== id));
  };

  if (step === 'REPORTS') {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          onHistoryClick={handleBackFromHistory}
          showBackButton
          onBackClick={handleBackFromHistory}
        />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <ReportHistory
            reports={history}
            onBack={handleBackFromHistory}
            onViewReport={handleViewReport}
            onDeleteReport={handleDeleteReport}
          />
        </main>
      </div>
    );
  }

  if (step === 'RESULTS' && analysisData) {
    return (
      <div className="min-h-screen bg-background">
        <Header onHistoryClick={handleViewHistory} />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <ResultsDashboard
            analysis={analysisData}
            imagePreviewUrl={imagePreviewUrl}
            onNewAnalysis={handleNewAnalysis}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onHistoryClick={handleViewHistory} />
      
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {(step === 'VALIDATING' || step === 'ANALYZING') && (
          <AnalysisProgress currentStep={step} />
        )}

        {step === 'ERROR' && error && (
          <Card className="p-4 border-fin-bear/30 bg-fin-bear/5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-fin-bear shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-fin-bear">Analysis Failed</h3>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleNewAnalysis}>
                Try Again
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Upload Chart</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a financial chart image for AI-powered analysis
              </p>
              <ChartUpload
                imagePreviewUrl={imagePreviewUrl}
                onImageSelect={handleImageSelect}
                onClearImage={handleClearImage}
                isProcessing={step === 'VALIDATING' || step === 'ANALYZING'}
              />
            </div>

            {(step === 'VALIDATING' || step === 'ANALYZING') && (
              <AnalysisLogs logs={logs} />
            )}
          </div>

          <div className="space-y-6">
            <StrategySelector
              selected={selectedStrategy}
              onSelect={setSelectedStrategy}
            />

            <div className="flex justify-end">
              <Button
                size="lg"
                disabled={!imageFile || step === 'VALIDATING' || step === 'ANALYZING'}
                onClick={runAnalysis}
                className="w-full sm:w-auto"
                data-testid="button-analyze"
              >
                {(step === 'VALIDATING' || step === 'ANALYZING') ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Analyze Chart
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
