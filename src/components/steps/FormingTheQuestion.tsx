import { MessageCircle, Pencil } from "lucide-react";
import { StepLayout } from "@/components/StepLayout";

interface FormingTheQuestionProps {
  onContinue: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function FormingTheQuestion({
  onContinue,
  onBack,
  onSkip,
}: FormingTheQuestionProps) {
  return (
    <StepLayout onContinue={onContinue} onBack={onBack} onSkip={onSkip}>
      <h2 className="text-2xl font-serif tracking-wide text-primary flex items-center justify-center">
        <MessageCircle className="w-6 h-6 mr-3" />
        Forming the Question
      </h2>

      <div className="space-y-6">
        <p className="text-foreground/80 font-serif">
          Approaching the I Ching requires that you ask a question. What do you, deep 
          down, really want more clarity on? What is truly on your heart? 
        </p>

        <p className="text-foreground/80 font-serif">
          This inquiry is the heart of the ritual. Everything that follows — the
          seeds, the counting, the hexagram — serves as a response to the
          question you bring. Give this step the time it deserves.
        </p>

        <div className="space-y-4">
          <h3 className="text-lg font-serif font-medium text-primary flex items-center">
            <MessageCircle className="w-4 h-4 mr-2" />
            Group Process
          </h3>
          <p className="text-foreground/80 font-serif">
            Each participant should first handwrite their individual inquiry in
            their journal. Then share and discuss to form a collective question.
          </p>
          <p className="text-foreground/80 font-serif">
            The process is intentionally messy and non-linear — conversation and
            synthesis are key.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-serif font-medium text-primary flex items-center">
            <Pencil className="w-4 h-4 mr-2" />
            Crafting Your Inquiry
          </h3>
          <p className="text-foreground/80 font-serif">
            Your inquiry can be a question, statement, observation, or image.
            Poetry reflecting on your situation is also effective.
          </p>
          <p className="text-foreground/80 font-serif">
            The more specific and heartfelt, the more profound and precisely
            tailored the response will be.
          </p>
        </div>

        <div className="bg-meditation-glow p-4 rounded-lg">
          <p className="text-sm text-muted-foreground font-serif italic">
            The hardest part is arriving at the shared inquiry — this is where
            the real work begins. Take your time with this crucial step before
            proceeding to the seed ritual.
          </p>
        </div>
      </div>
    </StepLayout>
  );
}
