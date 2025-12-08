import { Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Report } from '@/lib/types';
import { apiRequest, queryClient } from '@/lib/queryClient';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  FileText, Trash2, Eye, TrendingUp, TrendingDown, Minus, Info, ArrowLeft, History 
} from 'lucide-react';

export default function HistoryPage() {
  const { data: history = [], isLoading } = useQuery<Report[]>({
    queryKey: ['/api/reports'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/reports/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reports'] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-muted-foreground">Loading history...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center animate-fade-in">
            <Card className="p-12 max-w-md">
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <FileText className="w-10 h-10 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">No Reports Archived</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Your analysis history is empty. Run a new strategy on the Dashboard to see it archived here.
                  </p>
                </div>
                <Link href="/">
                  <Button data-testid="button-go-analyze">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go to Analysis
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <History className="w-8 h-8 text-fin-accent" />
                  Analysis History
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded border font-medium">FIFO</span>
                </h1>
                <p className="text-muted-foreground mt-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-fin-accent" />
                  Archive of your most recent technical assessments.
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Storage Capacity</div>
                <div className="text-2xl font-mono font-bold">
                  <span className={history.length === 10 ? "text-destructive" : "text-fin-accent"}>{history.length}</span>
                  <span className="text-muted-foreground text-lg">/10</span>
                </div>
              </div>
            </div>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b text-xs uppercase tracking-wider text-muted-foreground font-bold">
                      <th className="px-6 py-4">Ticker / Strategy</th>
                      <th className="px-6 py-4 text-center">Grade</th>
                      <th className="px-6 py-4 text-center">Bias</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {history.map((report) => (
                      <tr key={report.id} className="hover-elevate group" data-testid={`row-report-${report.id}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-md bg-muted border flex items-center justify-center font-bold text-lg text-muted-foreground group-hover:border-fin-accent group-hover:text-fin-accent transition-all">
                              {report.ticker.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-base" data-testid={`text-ticker-${report.id}`}>{report.ticker}</div>
                              <div className="text-xs text-muted-foreground font-mono mt-0.5">{report.strategy}</div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center justify-center w-10 h-10 rounded-md font-bold text-sm border ${
                            report.grade.includes('A') ? 'bg-fin-bull/10 text-fin-bull border-fin-bull/20' : 
                            report.grade.includes('B') ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                            'bg-destructive/10 text-destructive border-destructive/20'
                          }`} data-testid={`text-grade-${report.id}`}>
                            {report.grade}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                            report.bias === 'LONG' ? 'bg-fin-bull/5 text-fin-bull border-fin-bull/20' : 
                            report.bias === 'SHORT' ? 'bg-destructive/5 text-destructive border-destructive/20' : 
                            'bg-muted text-muted-foreground border-border'
                          }`} data-testid={`text-bias-${report.id}`}>
                            {report.bias === 'LONG' && <TrendingUp className="w-3 h-3" />}
                            {report.bias === 'SHORT' && <TrendingDown className="w-3 h-3" />}
                            {report.bias !== 'LONG' && report.bias !== 'SHORT' && <Minus className="w-3 h-3" />}
                            {report.bias}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col text-sm">
                            <span className="font-medium">{new Date(report.timestamp).toLocaleDateString()}</span>
                            <span className="text-muted-foreground text-xs font-mono">
                              {new Date(report.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Link href={`/?view=${report.id}`}>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                data-testid={`button-view-${report.id}`}
                              >
                                <Eye className="w-5 h-5" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(report.id)}
                              disabled={deleteMutation.isPending}
                              data-testid={`button-delete-${report.id}`}
                            >
                              <Trash2 className="w-5 h-5 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="flex justify-center">
              <Link href="/">
                <Button variant="outline" data-testid="button-back-to-analysis">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Analysis
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
