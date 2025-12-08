import AnalysisProgress from '../AnalysisProgress';

export default function AnalysisProgressExample() {
  return (
    <div className="p-4 bg-background">
      <AnalysisProgress currentStep="ANALYZING" />
    </div>
  );
}
