"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressBar } from "@/components/ProgressBar";
import { StepTransition } from "@/components/StepTransition";
import { Preparation } from "@/components/steps/Preparation";
import { FormingTheQuestion } from "@/components/steps/FormingTheQuestion";
import { SeedMethod } from "@/components/steps/SeedMethod";
import { CountingProcess } from "@/components/steps/CountingProcess";

type View = "landing" | "intro" | "choice";

const INTRO_STEPS = 4;

export default function Home() {
  const router = useRouter();
  const [view, setView] = useState<View>("landing");
  const [introStep, setIntroStep] = useState(0);
  const [creating, setCreating] = useState(false);

  async function startCircle() {
    setCreating(true);
    try {
      const res = await fetch("/api/circle", { method: "POST" });
      const { id } = await res.json();
      router.push(`/circle/${id}`);
    } finally {
      setCreating(false);
    }
  }

  function nextIntroStep() {
    if (introStep < INTRO_STEPS - 1) {
      setIntroStep((s) => s + 1);
    } else {
      setView("choice");
    }
  }

  function prevIntroStep() {
    if (introStep > 0) {
      setIntroStep((s) => s - 1);
    } else {
      setView("landing");
    }
  }

  function skipToChoice() {
    setView("choice");
  }

  // ── LANDING ──
  if (view === "landing") {
    return (
      <div className="min-h-screen bg-gradient-warm flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 space-y-10">
          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-semibold text-primary lowercase tracking-wide">
              co-inquiry: group i ching
            </h1>
            <p className="text-sm font-serif text-muted-foreground">
              collective inquiry through ancient wisdom
            </p>
          </div>

          <div className="space-y-6 font-serif text-foreground/80 leading-relaxed max-w-sm">
            <p>
              There are two paths through this presentation of the I Ching. Both are collective.
            </p>
            <p>
              While approaching the I Ching is traditionally a solitary practice, our time calls
              for a return to deeper relating. We offer this co-inquiring method with great
              respect for those who walk before us.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => setView("intro")}
              className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-serif text-base shadow-warm hover:shadow-meditation transition-all duration-300"
            >
              Begin
            </button>
            <button
              onClick={skipToChoice}
              className="font-serif text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 decoration-muted-foreground/30"
            >
              Skip Introduction →
            </button>
          </div>
        </div>

        <div className="py-6 border-t border-border">
          <p className="text-center text-xs text-muted-foreground font-serif">
            Licensed under GNU AGPL v3.0
          </p>
        </div>
      </div>
    );
  }

  // ── INTRO STEPS ──
  if (view === "intro") {
    const renderIntroStep = () => {
      switch (introStep) {
        case 0: return <Preparation onContinue={nextIntroStep} onBack={prevIntroStep} onSkip={skipToChoice} />;
        case 1: return <FormingTheQuestion onContinue={nextIntroStep} onBack={prevIntroStep} onSkip={skipToChoice} />;
        case 2: return <SeedMethod onContinue={nextIntroStep} onBack={prevIntroStep} onSkip={skipToChoice} />;
        case 3: return <CountingProcess onContinue={nextIntroStep} onBack={prevIntroStep} onSkip={skipToChoice} />;
        default: return null;
      }
    };

    return (
      <div className="min-h-screen bg-gradient-warm">
        <ProgressBar currentStep={introStep + 1} totalSteps={INTRO_STEPS + 1} />
        <StepTransition stepKey={introStep}>{renderIntroStep()}</StepTransition>
        <div className="py-8 border-t border-border">
          <p className="text-center text-xs text-muted-foreground font-serif">
            Licensed under GNU AGPL v3.0
          </p>
        </div>
      </div>
    );
  }

  // ── CHOICE ──
  return (
    <div className="min-h-screen bg-gradient-warm flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 space-y-10">
        <div className="space-y-10 font-serif text-foreground/80 leading-relaxed max-w-sm">
          <div className="space-y-4">
            <p>
              The first kind of co-inquiry involves a collective of many different people at the same time.
            </p>
            <button
              onClick={startCircle}
              disabled={creating}
              className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-serif text-base shadow-warm hover:shadow-meditation transition-all duration-300 disabled:opacity-60"
            >
              {creating ? "creating…" : "Start a circle"}
            </button>
          </div>

          <div className="space-y-4">
            <p>
              The second kind of co-inquiry involves your many selves at different times.
            </p>
            <a
              href="/thread"
              className="inline-block px-8 py-3 rounded-xl bg-primary text-primary-foreground font-serif text-base shadow-warm hover:shadow-meditation transition-all duration-300"
            >
              Start a thread
            </a>
          </div>
        </div>
      </div>

      <div className="py-6 border-t border-border">
        <p className="text-center text-xs text-muted-foreground font-serif">
          Licensed under GNU AGPL v3.0
        </p>
      </div>
    </div>
  );
}
