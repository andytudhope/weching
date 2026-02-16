import { Calculator } from "lucide-react";
import { StepLayout } from "@/components/StepLayout";

interface CountingProcessProps {
  onContinue: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function CountingProcess({
  onContinue,
  onBack,
  onSkip,
}: CountingProcessProps) {
  return (
    <StepLayout onContinue={onContinue} onBack={onBack} onSkip={onSkip}>
      <h2 className="text-2xl font-serif tracking-wide text-primary flex items-center justify-center">
        <Calculator className="w-6 h-6 mr-3" />
        Counting Process
      </h2>

      <div className="space-y-6">
        <p className="text-foreground/80 font-serif">
          Count carefully while maintaining contemplative mode. Group seeds in
          pairs or sets of five to quickly determine odd/even for each pile.
        </p>
        <p className="text-foreground/80 font-serif">
          Keep each pile distinct throughout the process. Record your 7 numbers
          (6 pile counts + 1 changing line pile) and enter them in the next step.
        </p>
      </div>
    </StepLayout>
  );
}
