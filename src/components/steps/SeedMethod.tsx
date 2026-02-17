import { Hand } from "lucide-react";
import { StepLayout } from "@/components/StepLayout";

interface SeedMethodProps {
  onContinue: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function SeedMethod({ onContinue, onBack, onSkip }: SeedMethodProps) {
  return (
    <StepLayout onContinue={onContinue} onBack={onBack} onSkip={onSkip}>
      <h2 className="text-2xl font-serif tracking-wide text-primary flex items-center justify-center">
        <Hand className="w-6 h-6 mr-3" />
        The Seed Method
      </h2>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-serif font-medium text-primary">
            Pinch Technique
          </h3>
          <p className="text-foreground/80 font-serif">
            The core action: focused, contemplative gathering of piles in a flow
            state. Take each pinch with thumb, index, and middle fingers (other
            fingers supporting).
          </p>
          <ul className="text-foreground/80 font-serif space-y-2 ml-6">
            <li>Not too small, not too large</li>
            <li>Relaxed, without stress</li>
            <li>Gentle, slow, rhythmic movements</li>
            <li>Maintain attention on the shared inquiry</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-serif font-medium text-primary">
            Hexagram Formation
          </h3>
          <p className="text-foreground/80 font-serif">
            Form 6 piles of seeds in a column. Each pile creates a line based on
            odd or even count:
          </p>
          <ul className="text-foreground/80 font-serif space-y-2 ml-6">
            <li className="flex items-center gap-2 flex-wrap">
              <strong>Odd number</strong> = Yang (solid line)
              <span className="inline-block w-8 h-0.5 bg-primary rounded-full" />
            </li>
            <li className="flex items-center gap-2 flex-wrap">
              <strong>Even number</strong> = Yin (broken line)
              <span className="inline-flex items-center gap-1">
                <span className="inline-block w-3 h-0.5 bg-primary rounded-full" />
                <span className="inline-block w-3 h-0.5 bg-primary rounded-full" />
              </span>
            </li>
            <li>Line 1 at bottom, counting up to Line 6 at top</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-serif font-medium text-primary">
            Changing Line
          </h3>
          <p className="text-foreground/80 font-serif">
            Form a 7th pile to the right of your column. This determines the
            changing line:
          </p>
          <ul className="text-foreground/80 font-serif space-y-2 ml-6">
            <li>Count seeds in 7th pile</li>
            <li>Divide by 6, remainder = changing line</li>
            <li>If remainder is 0, changing line is 6</li>
          </ul>
        </div>
      </div>
    </StepLayout>
  );
}
