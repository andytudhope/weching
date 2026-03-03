"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { HexagramDisplay } from "@/components/HexagramDisplay";
import { NeighbourhoodDisplay } from "./NeighbourhoodDisplay";
import { getHexagramInfo } from "@/lib/hexagrams";
import type { TemporalReading } from "@/types/thread";

// ——— Timing math ———
// Express the duration as seconds to 3 decimal places (e.g. "3.456"),
// sum all decimal digits, and take the parity. This distributes yin/yang
// evenly regardless of whether humans tend to release on round-second marks.
function digitSum(ms: number): number {
  const s = (ms / 1000).toFixed(3); // "3.456"
  let sum = 0;
  for (const ch of s) {
    if (ch !== ".") sum += parseInt(ch, 10);
  }
  return sum;
}

function durationToYang(ms: number): boolean {
  return digitSum(ms) % 2 === 1;
}

function durationToChangingLine(ms: number): number {
  const sum = digitSum(ms);
  return sum % 6 === 0 ? 6 : sum % 6;
}

function derivedFromDurations(durations: number[]) {
  const lines = durations.slice(0, 6).map(durationToYang);
  const changingLine = durationToChangingLine(durations[6]);
  return { lines, changingLine };
}

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
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

type View = "list" | "inquiry" | "ready" | "holding" | "revealed" | "complete";

interface TimingRitualProps {
  readings: TemporalReading[];
  onSave: (reading: Omit<TemporalReading, "id">) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  onNext: () => void;
}

export function TimingRitual({
  readings,
  onSave,
  onRemove,
  onNext,
}: TimingRitualProps) {
  const today = new Date();

  const [view, setView] = useState<View>("list");
  const [lineIndex, setLineIndex] = useState(0);
  const [durations, setDurations] = useState<number[]>([]);
  const [revealedDuration, setRevealedDuration] = useState(0);

  // Inquiry is captured BEFORE casting begins
  const [inquiry, setInquiry] = useState("");
  const [date, setDate] = useState(todayString());
  const [label, setLabel] = useState("");
  const [saving, setSaving] = useState(false);

  const pressStartRef = useRef<number | null>(null);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearAdvanceTimer() {
    if (advanceTimerRef.current !== null) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }

  function startRitual() {
    clearAdvanceTimer();
    setDurations([]);
    setLineIndex(0);
    setView("ready");
  }

  function retry() {
    // Re-cast with same inquiry
    clearAdvanceTimer();
    setDurations([]);
    setLineIndex(0);
    setView("ready");
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
    setRevealedDuration(duration);
    setView("revealed");

    clearAdvanceTimer();
    // Capture current state values in closure
    const capturedLineIndex = lineIndex;
    const capturedDurations = durations;

    advanceTimerRef.current = setTimeout(() => {
      const newDurations = [...capturedDurations, duration];
      const nextIdx = capturedLineIndex + 1;
      if (nextIdx < 7) {
        setDurations(newDurations);
        setLineIndex(nextIdx);
        setView("ready");
      } else {
        setDurations(newDurations);
        setView("complete");
      }
    }, 900);
  }

  async function handleAccept(completeDurations: number[]) {
    setSaving(true);
    try {
      const { lines, changingLine } = derivedFromDurations(completeDurations);
      await onSave({
        date,
        inquiry: inquiry.trim() || undefined,
        label: label.trim() || undefined,
        lines,
        changingLine,
        durations: completeDurations,
      });
      setDurations([]);
      setLineIndex(0);
      setInquiry("");
      setLabel("");
      setDate(todayString());
      setView("list");
    } finally {
      setSaving(false);
    }
  }

  // ——— Views ———

  if (view === "list") {
    return (
      <div className="max-w-lg mx-auto w-full space-y-6 px-4">
        <NeighbourhoodDisplay today={today} />

        {readings.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-serif font-semibold text-primary text-sm uppercase tracking-widest text-center">
              your readings
            </h3>
            {readings.map((r) => {
              const info = getHexagramInfo(r.lines);
              return (
                <div
                  key={r.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-gradient-subtle border border-border shadow-soft"
                >
                  <div className="shrink-0">
                    <HexagramDisplay
                      lines={r.lines}
                      title=""
                      changingLine={r.changingLine !== null ? r.changingLine - 1 : -1}
                      compact
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-serif text-primary font-semibold">{r.date}</p>
                    <p className="text-xs font-serif text-muted-foreground truncate">
                      {info.number}: {info.name}
                    </p>
                    {r.inquiry && (
                      <p className="text-xs font-serif text-foreground/60 italic truncate">
                        &ldquo;{r.inquiry}&rdquo;
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => onRemove(r.id)}
                    className="text-xs font-serif text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  >
                    remove
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-col items-center gap-3">
          <Button
            onClick={() => {
              setInquiry("");
              setDate(todayString());
              setLabel("");
              setView("inquiry");
            }}
            size="lg"
            className="font-serif shadow-warm hover:shadow-meditation transition-all duration-300"
          >
            Add a Reading
          </Button>
          {readings.length >= 2 && (
            <Button variant="outline" onClick={onNext} className="font-serif">
              Proceed to Analysis →
            </Button>
          )}
          {readings.length === 1 && (
            <p className="text-xs font-serif text-muted-foreground text-center">
              Add one more reading to unlock analysis
            </p>
          )}
        </div>
      </div>
    );
  }

  // ——— INQUIRY (must come before casting) ———
  if (view === "inquiry") {
    return (
      <div className="max-w-lg mx-auto w-full space-y-6 px-4">
        <div className="text-center space-y-2">
          <p className="text-sm font-serif text-muted-foreground uppercase tracking-widest">
            before you cast
          </p>
          <h3 className="text-2xl font-serif font-semibold text-primary">
            Form your inquiry
          </h3>
          <p className="text-sm font-serif text-foreground/70 leading-relaxed max-w-sm mx-auto">
            The oracle reads the structure of this moment. Hold your question
            clearly in mind as you cast — the hexagram will describe the
            nature of what you bring, not answer it directly.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-serif text-foreground/80 font-medium">
              What is your inquiry?
            </label>
            <Textarea
              value={inquiry}
              onChange={(e) => setInquiry(e.target.value)}
              placeholder="The question or theme you bring to this moment…"
              rows={3}
              className="font-serif resize-none"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-serif text-foreground/80">Date</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="font-serif"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-serif text-foreground/80">
                Context{" "}
                <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="brief note…"
                className="font-serif"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Button
            onClick={startRitual}
            size="lg"
            className="font-serif shadow-warm hover:shadow-meditation transition-all duration-300"
          >
            Begin Casting →
          </Button>
          <button
            onClick={() => setView("list")}
            className="text-sm font-serif text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            ← back
          </button>
        </div>
      </div>
    );
  }

  // ——— READY ———
  if (view === "ready") {
    const isChanging = lineIndex === 6;
    return (
      <div className="max-w-lg mx-auto w-full space-y-8 px-4 text-center">
        <div className="space-y-2">
          <p className="text-sm font-serif text-muted-foreground uppercase tracking-widest">
            step {lineIndex + 1} of 7
          </p>
          <h3 className="text-xl font-serif font-semibold text-primary">
            {isChanging ? "Hold for the Changing Line" : `Begin ${LINE_LABELS[lineIndex]}`}
          </h3>
          {inquiry && (
            <p className="text-xs font-serif text-foreground/50 italic max-w-xs mx-auto truncate">
              &ldquo;{inquiry}&rdquo;
            </p>
          )}
          <p className="text-sm font-serif text-muted-foreground">
            Touch and hold. Release when it feels complete.
          </p>
        </div>

        <div
          onPointerDown={handlePointerDown}
          className="mx-auto w-48 h-48 rounded-full bg-gradient-subtle border-2 border-border shadow-soft flex items-center justify-center cursor-pointer select-none touch-none hover:shadow-warm transition-shadow duration-300"
        >
          <span className="font-serif text-primary/50 text-sm select-none">touch</span>
        </div>

        <button
          onClick={() => {
            clearAdvanceTimer();
            setDurations([]);
            setLineIndex(0);
            setView("inquiry");
          }}
          className="text-sm font-serif text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
        >
          ← change inquiry
        </button>
      </div>
    );
  }

  // ——— HOLDING ———
  if (view === "holding") {
    const isChanging = lineIndex === 6;
    return (
      <div className="max-w-lg mx-auto w-full space-y-8 px-4 text-center">
        <div className="space-y-2">
          <p className="text-sm font-serif text-muted-foreground uppercase tracking-widest">
            {isChanging ? "changing line" : LINE_LABELS[lineIndex]}
          </p>
          <h3 className="text-xl font-serif font-semibold text-primary">
            holding…
          </h3>
        </div>

        <div
          onPointerUp={handlePointerUp}
          className="mx-auto w-48 h-48 rounded-full bg-accent border-2 border-primary/30 shadow-meditation flex items-center justify-center cursor-pointer select-none touch-none animate-pulse"
        >
          <span className="font-serif text-primary/70 text-sm select-none">release</span>
        </div>
      </div>
    );
  }

  // ——— REVEALED ———
  if (view === "revealed") {
    const isChanging = lineIndex === 6;
    const isYang = durationToYang(revealedDuration);
    const changingLineNum = isChanging ? durationToChangingLine(revealedDuration) : null;

    return (
      <div className="max-w-lg mx-auto w-full space-y-8 px-4 text-center">
        <p className="text-sm font-serif text-muted-foreground uppercase tracking-widest">
          {isChanging ? "changing line" : LINE_LABELS[lineIndex]}
        </p>

        {isChanging ? (
          <div className="space-y-2 py-6">
            <p className="text-4xl font-serif font-bold text-primary">
              Line {changingLineNum}
            </p>
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

  // ——— COMPLETE ———
  const { lines, changingLine } = derivedFromDurations(durations);
  const info = getHexagramInfo(lines);

  return (
    <div className="max-w-lg mx-auto w-full space-y-6 px-4 text-center">
      <div className="space-y-1">
        <p className="text-sm font-serif text-muted-foreground uppercase tracking-widest">
          reading complete
        </p>
        <h3 className="text-2xl font-serif font-semibold text-primary">
          {info.name}
        </h3>
        {inquiry && (
          <p className="text-sm font-serif text-foreground/60 italic">
            &ldquo;{inquiry}&rdquo;
          </p>
        )}
      </div>

      <div className="flex justify-center">
        <HexagramDisplay
          lines={lines}
          title={`Hexagram ${info.number}`}
          changingLine={changingLine - 1}
          hexagramNumber={info.number}
          hexagramName={info.name}
          hexagramUrl={info.url}
        />
      </div>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={retry} className="font-serif">
          Try Again
        </Button>
        <Button
          onClick={() => handleAccept(durations)}
          disabled={saving}
          className="font-serif shadow-warm"
        >
          {saving ? "Saving…" : "Accept & Save"}
        </Button>
      </div>
    </div>
  );
}
