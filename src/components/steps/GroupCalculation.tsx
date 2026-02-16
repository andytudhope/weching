import { StepLayout } from "@/components/StepLayout";

interface GroupCalculationProps {
  onContinue: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function GroupCalculation({
  onContinue,
  onBack,
  onSkip,
}: GroupCalculationProps) {
  return (
    <StepLayout
      onContinue={onContinue}
      onBack={onBack}
      onSkip={onSkip}
      continueLabel="Proceed to Ceremony"
    >
      <h2 className="text-2xl font-serif tracking-wide text-primary text-center">
        Group Calculation
      </h2>

      <div className="space-y-6">
        <p className="text-foreground/80 font-serif">
          We add together each individual's line. If the result is even, we have a 
          yin line (broken). If the result is odd, we have a yang line (solid). 
          This creates our group hexagram.
        </p>
        <p className="text-foreground/80 font-serif">
          We add together each individual's moving line and divide by six. The remainder 
          is the moving line for the group. If the remainder is zero, we have a moving line at position 6.
        </p>
        <div className="bg-meditation-glow p-4 rounded-lg">
          <p className="text-sm text-muted-foreground font-serif italic">
            Individual hexagrams are meaningful bonus by-products, but the group
            hexagram is the primary focus of the co-inquiry.
          </p>
        </div>
      </div>
    </StepLayout>
  );
}
