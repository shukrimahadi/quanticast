import { Check, Loader2 } from 'lucide-react';
import { AppStep } from '@/lib/types';

interface AnalysisProgressProps {
  currentStep: AppStep;
}

const steps = [
  { id: 'UPLOAD', label: 'Upload' },
  { id: 'VALIDATING', label: 'Validating' },
  { id: 'ANALYZING', label: 'Analyzing' },
  { id: 'RESULTS', label: 'Results' },
];

export default function AnalysisProgress({ currentStep }: AnalysisProgressProps) {
  const getCurrentIndex = () => {
    if (currentStep === 'ERROR') return -1;
    if (currentStep === 'REPORTS') return -1;
    return steps.findIndex(s => s.id === currentStep);
  };
  
  const currentIndex = getCurrentIndex();
  
  if (currentIndex === -1) return null;

  return (
    <div className="py-4">
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                    ${isCompleted 
                      ? 'bg-fin-bull text-white' 
                      : isCurrent 
                        ? 'bg-fin-accent text-white' 
                        : 'bg-muted text-muted-foreground'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`
                  text-xs mt-1 
                  ${isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'}
                `}>
                  {step.label}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div 
                  className={`
                    w-12 h-0.5 mx-2 transition-colors
                    ${isCompleted ? 'bg-fin-bull' : 'bg-muted'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
