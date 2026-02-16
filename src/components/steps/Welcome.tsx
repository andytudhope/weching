import { Button } from "@/components/ui/button";

interface WelcomeProps {
  onBegin: () => void;
  onSkip: () => void;
  isReturning: boolean;
}

export function Welcome({ onBegin, onSkip, isReturning }: WelcomeProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-serif font-bold text-primary tracking-wide">
            co-inquiry: group i ching
          </h1>
          <p className="text-lg text-muted-foreground font-serif leading-relaxed">
            collective inquiry through ancient wisdom
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <p className="text-base text-foreground/80 font-serif leading-relaxed max-w-lg mx-auto">
            This ritual guides a group through the seed method of I Ching
            divination. While approaching the I Ching is traditionally a solitary practice, 
            our time calls for a return to deeper relating. We offer this co-inquiring method 
            with great respect for those who walk before us.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 pt-8">
          <Button
            onClick={onBegin}
            size="lg"
            className="px-10 py-6 font-serif text-lg shadow-warm hover:shadow-meditation transition-all duration-300"
          >
            Begin the Ritual
          </Button>
          {isReturning ? (
            <Button
              variant="secondary"
              onClick={onSkip}
              className="font-serif"
            >
              Skip to Ceremony &rarr;
            </Button>
          ) : (
            <button
              onClick={onSkip}
              className="font-serif text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 underline underline-offset-4 decoration-muted-foreground/30"
            >
              Skip to Ceremony &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
