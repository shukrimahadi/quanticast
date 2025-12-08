import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AppStep, StrategyType, FinalAnalysis, Report } from '@/lib/types';
import { apiRequest, queryClient } from '@/lib/queryClient';
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

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Home() {
  const [step, setStep] = useState<AppStep>('UPLOAD');
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>(StrategyType.SMC);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysisData, setAnalysisData] = useState<FinalAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const { data: history = [] } = useQuery<Report[]>({
    queryKey: ['/api/reports'],
  });

  const addLog = useCallback((message: string) => {
    setLogs(prev => [...prev, message]);
  }, []);

  const analyzeMutation = useMutation({
    mutationFn: async (params: { strategy: StrategyType; file: File }) => {
      const imageBase64 = await fileToBase64(params.file);
      const response = await apiRequest('POST', '/api/analyze', {
        strategy: params.strategy,
        imageBase64,
        imageMimeType: params.file.type,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success && data.report) {
        addLog('Analysis complete!');
        setAnalysisData(data.report.data);
        queryClient.invalidateQueries({ queryKey: ['/api/reports'] });
        setStep('RESULTS');
      } else {
        setError(data.rejection_reason || data.error || 'Analysis failed');
        setStep('ERROR');
      }
    },
    onError: (err: Error) => {
      addLog(`Error: ${err.message}`);
      setError(err.message);
      setStep('ERROR');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/reports/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reports'] });
    },
  });

  const handleImageSelect = (file: File, url: string) => {
    setImageFile(file);
    setImagePreviewUrl(url);
    setError(null);
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
  };

  const runAnalysis = async () => {
    if (!imageFile) return;

    setStep('VALIDATING');
    setLogs([]);
    setError(null);

    addLog('Starting chart validation...');
    addLog(`Selected strategy: ${selectedStrategy}`);

    setTimeout(() => {
      addLog('Validating chart image...');
    }, 300);

    setTimeout(() => {
      setStep('ANALYZING');
      addLog('Chart validated successfully');
      addLog(`Initializing ${selectedStrategy} analysis pipeline...`);
    }, 600);

    setTimeout(() => {
      addLog('Analyzing patterns and market structure...');
    }, 1000);

    setTimeout(() => {
      addLog('Generating trade plan...');
    }, 1500);

    analyzeMutation.mutate({ strategy: selectedStrategy, file: imageFile });
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
    deleteMutation.mutate(id);
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
