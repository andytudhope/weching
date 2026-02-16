import { Flower2 } from "lucide-react";
import { StepLayout } from "@/components/StepLayout";

interface PreparationProps {
  onContinue: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function Preparation({ onContinue, onBack, onSkip }: PreparationProps) {
  return (
    <StepLayout onContinue={onContinue} onBack={onBack} onSkip={onSkip}>
      <h2 className="text-2xl font-serif tracking-wide text-primary flex items-center justify-center">
        <Flower2 className="w-6 h-6 mr-3" />
        Preparation
      </h2>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-serif font-medium text-primary">
            Creating Space
          </h3>
          <p className="text-foreground/80 font-serif">
            Create a centered and centering space, uncluttered and unfettered
            from outside distractions. Shut off devices and notifications.
          </p>
          <p className="text-foreground/80 font-serif">
            Set up an altar — a flat space with cloth to prevent seeds from
            rolling or mixing. Decorate with meaningful objects: crystals,
            stones, driftwood, or natural pieces.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-serif font-medium text-primary">
            Seed Selection
          </h3>
          <p className="text-foreground/80 font-serif">
            Prepare a small dish with seeds approximately the size of rice
            grains. Rice works well, or any seeds that are easy to manipulate and
            count without difficulty.
          </p>
          <p className="text-foreground/80 font-serif">
            Seeds that are too small make counting challenging. Focus on odd/even
            totals rather than exact counts.
          </p>
        </div>
      </div>
    </StepLayout>
  );
}
