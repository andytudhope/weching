interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / (totalSteps - 1)) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-border/40">
      <div
        className="h-full bg-gradient-to-r from-meditation-glow to-accent transition-all duration-700 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
