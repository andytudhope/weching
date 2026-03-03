"use client";

import { useState, useRef } from "react";

function digitSum(ms: number): number {
  const s = (ms / 1000).toFixed(3); // e.g. "1.234"
  let sum = 0;
  for (const ch of s) {
    if (ch !== ".") sum += parseInt(ch, 10);
  }
  return sum;
}

const LINE_LABELS = [
  "Line 1 (bottom)",
  "Line 2",
  "Line 3",
  "Line 4",
  "Line 5",
  "Line 6 (top)",
  "The Changing Line",
];

type CastView = "ready" | "holding" | "revealed";

interface DigitalCastingProps {
  onComplete: (numbers: number[]) => void;
  onCancel: () => void;
}

export function DigitalCasting({ onComplete, onCancel }: DigitalCastingProps) {
  const [view, setView] = useState<CastView>("ready");
  const [lineIndex, setLineIndex] = useState(0);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [revealedSum, setRevealedSum] = useState(0);

  const pressStartRef = useRef<number | null>(null);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearAdvanceTimer() {
    if (advanceTimerRef.current !== null) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }

  function handlePointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    pressStartRef.current = Date.now();
    setView("holding");
  }

  function handlePointerUp() {
    if (pressStartRef.current === null) return;
    const duration = Date.now() - pressStartRef.current;
    pressStartRef.current = null;
    const sum = digitSum(duration);
    setRevealedSum(sum);
    setView("revealed");

    clearAdvanceTimer();
    const capturedIndex = lineIndex;
    const capturedNumbers = numbers;

    advanceTimerRef.current = setTimeout(() => {
      const newNumbers = [...capturedNumbers, sum];
      const nextIdx = capturedIndex + 1;
      if (nextIdx < 7) {
        setNumbers(newNumbers);
        setLineIndex(nextIdx);
        setView("ready");
      } else {
        // All 7 done — show summary then call onComplete
        setNumbers(newNumbers);
        onComplete(newNumbers);
      }
    }, 900);
  }

  const isChanging = lineIndex === 6;
  const isYang = revealedSum % 2 === 1;
  const changingLineNum = revealedSum % 6 === 0 ? 6 : revealedSum % 6;

  if (view === "ready") {
    return (
      <div className="space-y-8 text-center">
        <div className="space-y-2">
          <p className="text-sm font-serif text-muted-foreground uppercase tracking-widest">
            step {lineIndex + 1} of 7
          </p>
          <h3 className="text-xl font-serif font-semibold text-primary">
            {isChanging ? "Hold for the Changing Line" : LINE_LABELS[lineIndex]}
          </h3>
          <p className="text-sm font-serif text-muted-foreground">
            Touch and hold. Release when it feels complete.
          </p>
        </div>

        <div
          onPointerDown={handlePointerDown}
          className="mx-auto w-44 h-44 rounded-full bg-gradient-subtle border-2 border-border shadow-soft flex items-center justify-center cursor-pointer select-none touch-none hover:shadow-warm transition-shadow duration-300"
        >
          <span className="font-serif text-primary/50 text-sm select-none">touch</span>
        </div>

        <button
          onClick={() => {
            clearAdvanceTimer();
            onCancel();
          }}
          className="text-sm font-serif text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
        >
          ← cancel
        </button>
      </div>
    );
  }

  if (view === "holding") {
    return (
      <div className="space-y-8 text-center">
        <div className="space-y-2">
          <p className="text-sm font-serif text-muted-foreground uppercase tracking-widest">
            {isChanging ? "changing line" : LINE_LABELS[lineIndex]}
          </p>
          <h3 className="text-xl font-serif font-semibold text-primary">holding…</h3>
        </div>

        <div
          onPointerUp={handlePointerUp}
          className="mx-auto w-44 h-44 rounded-full bg-accent border-2 border-primary/30 shadow-meditation flex items-center justify-center cursor-pointer select-none touch-none animate-pulse"
        >
          <span className="font-serif text-primary/70 text-sm select-none">release</span>
        </div>
      </div>
    );
  }

  // revealed
  return (
    <div className="space-y-8 text-center">
      <p className="text-sm font-serif text-muted-foreground uppercase tracking-widest">
        {isChanging ? "changing line" : LINE_LABELS[lineIndex]}
      </p>

      {isChanging ? (
        <div className="space-y-2 py-6">
          <p className="text-4xl font-serif font-bold text-primary">Line {changingLineNum}</p>
          <p className="text-sm font-serif text-muted-foreground">changes</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="flex items-center gap-3">
            {isYang ? (
              <div className="h-2 w-28 rounded-full bg-primary" />
            ) : (
              <>
                <div className="h-2 w-12 rounded-full bg-primary" />
                <div className="h-2 w-12 rounded-full bg-primary" />
              </>
            )}
          </div>
          <p className="text-lg font-serif text-primary font-semibold">
            {isYang ? "yang" : "yin"}
          </p>
        </div>
      )}

      <p className="text-xs font-serif text-muted-foreground animate-pulse">
        {lineIndex < 6 ? "advancing…" : "completing…"}
      </p>
    </div>
  );
}
