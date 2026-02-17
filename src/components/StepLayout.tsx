import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepLayoutProps {
  children: ReactNode;
  onBack?: () => void;
  onContinue?: () => void;
  onSkip?: () => void;
  continueLabel?: string;
  backLabel?: string;
  showBack?: boolean;
  showContinue?: boolean;
  showSkip?: boolean;
}

export function StepLayout({
  children,
  onBack,
  onContinue,
  onSkip,
  continueLabel = "Continue",
  backLabel = "Back",
  showBack = true,
  showContinue = true,
  showSkip = true,
}: StepLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col pt-4">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl mx-auto w-full">
          <div className="text-base leading-relaxed space-y-6">{children}</div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="order-3 sm:order-1 sm:w-1/3">
              {showBack && onBack && (
                <Button
                  variant="ghost"
                  onClick={onBack}
                  className="font-serif text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {backLabel}
                </Button>
              )}
            </div>

            <div className="order-1 sm:order-2 sm:w-1/3 flex justify-center">
              {showContinue && onContinue && (
                <Button
                  onClick={onContinue}
                  size="lg"
                  className="px-8 font-serif shadow-warm hover:shadow-meditation transition-all duration-300"
                >
                  {continueLabel}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>

            <div className="order-2 sm:order-3 sm:w-1/3 flex justify-center sm:justify-end">
              {showSkip && onSkip && (
                <button
                  onClick={onSkip}
                  className="font-serif text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 underline underline-offset-4 decoration-muted-foreground/30 whitespace-nowrap"
                >
                  Skip to Ceremony &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
