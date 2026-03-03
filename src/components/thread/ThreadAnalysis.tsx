"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HexagramDisplay } from "@/components/HexagramDisplay";
import { analyzeThread, describeTransition, changedLinePositions, LINE_POSITION_MEANINGS } from "@/lib/operators";
import { fodRarityNote, fodNoteForWeight } from "@/lib/kingwen";
import { getHexagramInfo, getTrigramPair } from "@/lib/hexagrams";
import type { ReadingTransition, TemporalReading } from "@/types/thread";

// ——— Inquiry reflection prompts ———
// These are structural invitations, not interpretations. They use the geometry
// of the operator to frame a question the reader can apply to their own inquiry.

function inquiryPrompt(
  w: number,
  changedLines: number[],
  fromName: string,
  toName: string
): string {
  switch (w) {
    case 1: {
      const lineNum = changedLines[0];
      const meaning = LINE_POSITION_MEANINGS[lineNum] ?? "";
      const brief = meaning.split("—")[1]?.trim() ?? meaning;
      return `One line moves: line ${lineNum}. ${brief} In your inquiry — what is the singular pivot? The one thing that, shifted, produces this new configuration?`;
    }
    case 2: {
      const [a, b] = changedLines;
      const aInner = a <= 3, bInner = b <= 3;
      const both = aInner !== bInner
        ? "one line in the inner trigram and one in the outer"
        : aInner
          ? "both lines in the inner trigram (your own state)"
          : "both lines in the outer trigram (the outer situation)";
      return `Two lines move — ${both}. In your inquiry, what pair of conditions shifts together? What moves as a unit?`;
    }
    case 3:
      return `Half the structure changes. Three lines move — the threshold between continuity and transformation. In your inquiry, what holds constant even as much of the context shifts?`;
    case 4:
      return `Four lines move — more than half the structure changes, yet two lines hold. In your inquiry, what persists? What is the stable core around which transformation happens?`;
    case 5:
      return `Five lines move — this operator never appears in the King Wen sequence. You have arrived at a structurally singular moment. What, in your inquiry, is the one thing that could not change?`;
    case 6:
      return `All six lines invert: ${fromName} becomes its complement, ${toName}. Not a shift within the situation — a reversal of the situation's polarity. In your inquiry, what has become its opposite?`;
    default:
      return "";
  }
}

// ——— Operator card ———

interface OperatorCardProps {
  transition: ReadingTransition;
  readings: TemporalReading[];
  fromIndex: number;
  toIndex: number;
}

function OperatorCard({ transition, readings, fromIndex, toIndex }: OperatorCardProps) {
  const fromReading = readings[fromIndex];
  const toReading = readings[toIndex];
  const fromInfo = getHexagramInfo(fromReading.lines);
  const toInfo = getHexagramInfo(toReading.lines);
  const changedLines = changedLinePositions(transition.operator);
  const w = transition.hammingWeight;
  const trigramPair = getTrigramPair(fromReading.lines);
  const toTrigramPair = getTrigramPair(toReading.lines);
  const prompt = inquiryPrompt(w, changedLines, fromInfo.name, toInfo.name);
  // Use the destination reading's inquiry as the primary reference —
  // that's the question the person was holding when they arrived at the new hexagram.
  const inquiry = toReading.inquiry ?? fromReading.inquiry;

  return (
    <div className="bg-meditation-glow rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-serif text-xs text-muted-foreground uppercase tracking-wide">
          operator: reading {fromIndex + 1} → {toIndex + 1}
        </p>
        <p className="font-serif text-xs text-muted-foreground">
          {fromInfo.number} → {toInfo.number}
        </p>
      </div>

      {/* Operator bits */}
      <p className="font-mono text-sm text-primary tracking-widest">
        {transition.operator.map((b) => (b ? "▲" : "▽")).join(" ")}
      </p>

      {/* Main description */}
      <p className="font-serif text-sm text-foreground/80 whitespace-pre-line">
        {describeTransition(transition, readings)}
      </p>

      {/* Statistical rarity */}
      <div className="border-t border-border/30 pt-2 space-y-2">
        <p className="font-serif text-xs text-foreground/60 leading-relaxed">
          <span className="text-primary font-medium">In the King Wen sequence: </span>
          {fodRarityNote(w)}
        </p>

        {/* Changed line meanings (shown for w ≤ 3 where specificity is informative) */}
        {w <= 3 && changedLines.length > 0 && (
          <div className="space-y-1">
            <p className="font-serif text-xs text-muted-foreground uppercase tracking-wide">
              {w === 1 ? "the line that moves" : "lines that move"}
            </p>
            {changedLines.map((lineNum) => {
              const isLower = lineNum <= 3;
              const fromTrigram = isLower ? trigramPair.lower : trigramPair.upper;
              const toTrigram = isLower ? toTrigramPair.lower : toTrigramPair.upper;
              const worldLabel = isLower ? "inner" : "outer";
              return (
                <div key={lineNum} className="space-y-0.5">
                  <p className="font-serif text-xs text-foreground/70 leading-relaxed">
                    {LINE_POSITION_MEANINGS[lineNum]}
                  </p>
                  <div className="flex items-center gap-1.5 font-serif text-xs text-muted-foreground">
                    <span>{worldLabel}:</span>
                    <span>{fromTrigram.symbol} {fromTrigram.element}</span>
                    <span className="leading-none">→</span>
                    <span>{toTrigram.symbol} {toTrigram.element}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Inquiry reflection */}
        {prompt && (
          <div className="border-t border-border/20 pt-2">
            <p className="font-serif text-xs text-muted-foreground uppercase tracking-wide mb-1">
              structural reflection
            </p>
            <p className="font-serif text-xs text-foreground/70 leading-relaxed italic">
              {prompt}
            </p>
            {inquiry && (
              <p className="font-serif text-xs text-primary/70 mt-1.5 leading-relaxed">
                Your inquiry: &ldquo;{inquiry}&rdquo;
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ——— Main component ———

interface ThreadAnalysisProps {
  readings: TemporalReading[];
  onNext: () => void;
  onBack: () => void;
}

export function ThreadAnalysis({ readings, onNext, onBack }: ThreadAnalysisProps) {
  const analysis = useMemo(() => analyzeThread(readings), [readings]);
  const firstInfo = useMemo(() => getHexagramInfo(readings[0].lines), [readings]);
  const lastReading = readings[readings.length - 1];
  const derivedReadings = useMemo(() =>
    readings.flatMap((r) => {
      if (!r.changingLine) return [];
      const fl = [...r.lines];
      fl[r.changingLine - 1] = !fl[r.changingLine - 1];
      return [{ reading: r, derivedLines: fl, derivedInfo: getHexagramInfo(fl) }];
    }),
    [readings]
  );

  return (
    <div className="min-h-screen flex flex-col pt-4">
      <div className="flex-1 px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-serif font-bold text-primary">
              the path through hexagram space
            </h2>
            <p className="text-sm font-serif text-muted-foreground">
              {readings.length} readings · {analysis.transitions.length} transitions
            </p>
          </div>

          {/* Timeline */}
          <Card className="bg-card border-border shadow-soft">
            <CardHeader>
              <CardTitle className="font-serif text-primary text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {readings.map((r, i) => {
                const info = getHexagramInfo(r.lines);
                const transition = analysis.transitions[i]; // transition from reading i to i+1

                return (
                  <div key={r.id}>
                    {/* Reading card */}
                    <div className="flex items-start gap-4">
                      <div className="shrink-0">
                        <HexagramDisplay
                          lines={r.lines}
                          title=""
                          changingLine={r.changingLine !== null ? r.changingLine - 1 : -1}
                          compact
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-serif font-semibold text-primary text-sm">
                          {r.date}{r.label ? ` — ${r.label}` : ""}
                        </p>
                        <a
                          href={info.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-serif text-sm text-primary hover:text-accent underline underline-offset-2 transition-colors"
                        >
                          Hexagram {info.number}: {info.name}
                        </a>
                        {r.inquiry && (
                          <p className="font-serif text-sm text-foreground/60 italic">
                            &ldquo;{r.inquiry}&rdquo;
                          </p>
                        )}
                        {r.changingLine && (
                          <p className="font-serif text-xs text-muted-foreground">
                            changing line {r.changingLine}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Operator card between readings */}
                    {transition && (
                      <div className="ml-4 my-4 pl-4 border-l-2 border-accent/40">
                        <OperatorCard
                          transition={transition}
                          readings={readings}
                          fromIndex={i}
                          toIndex={i + 1}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Net transformation */}
          <Card className="bg-card border-border shadow-soft">
            <CardHeader>
              <CardTitle className="font-serif text-primary text-lg">Net Transformation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1 text-center">
                  <p className="text-xs font-serif text-muted-foreground uppercase tracking-wide">from</p>
                  <HexagramDisplay
                    lines={readings[0].lines}
                    title={`Hexagram ${firstInfo.number}`}
                    changingLine={readings[0].changingLine !== null ? readings[0].changingLine - 1 : -1}
                    hexagramNumber={firstInfo.number}
                    hexagramName={firstInfo.name}
                    hexagramUrl={firstInfo.url}
                  />
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-xs font-serif text-muted-foreground uppercase tracking-wide">to</p>
                  <HexagramDisplay
                    lines={lastReading.lines}
                    title={`Hexagram ${analysis.presentHexagram.number}`}
                    changingLine={lastReading.changingLine !== null ? (lastReading.changingLine ?? 1) - 1 : -1}
                    hexagramNumber={analysis.presentHexagram.number}
                    hexagramName={analysis.presentHexagram.name}
                    hexagramUrl={analysis.presentHexagram.url}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <p className="font-serif text-sm text-muted-foreground w-32 shrink-0">Net operator</p>
                  <p className="font-mono text-primary tracking-widest">
                    {analysis.netOperator.map((b) => (b ? "▲" : "▽")).join(" ")}
                  </p>
                  <p className="font-serif text-sm text-foreground/70">
                    weight {analysis.netHammingWeight} · {analysis.netTrigramCharacter} trigram
                  </p>
                </div>
                {analysis.stableLines.length > 0 && (
                  <p className="font-serif text-sm text-foreground/70">
                    <strong>Stable lines:</strong>{" "}
                    {analysis.stableLines.map((l) => `line ${l}`).join(", ")} — held throughout every transition.
                  </p>
                )}
                {analysis.volatileLines.length > 0 && (
                  <p className="font-serif text-sm text-foreground/70">
                    <strong>Volatile lines:</strong>{" "}
                    {analysis.volatileLines.map((l) => `line ${l}`).join(", ")} — changed in more than half of transitions.
                  </p>
                )}
                <p className="font-serif text-xs text-muted-foreground italic">
                  {fodNoteForWeight(analysis.netHammingWeight)}
                </p>
              </div>

              {derivedReadings.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <p className="font-serif text-sm font-semibold text-primary">
                      Changing lines point toward:
                    </p>
                    <div className="flex flex-wrap gap-6 justify-center">
                      {derivedReadings.map(({ reading, derivedLines, derivedInfo }) => (
                        <div key={reading.id} className="flex flex-col items-center gap-1 text-center">
                          <HexagramDisplay
                            lines={derivedLines}
                            title={`Hexagram ${derivedInfo.number}`}
                            changingLine={-1}
                            compact
                          />
                          <a
                            href={derivedInfo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-serif text-sm text-primary hover:text-accent underline underline-offset-2 transition-colors"
                          >
                            {derivedInfo.name}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="font-serif text-muted-foreground hover:text-foreground"
            >
              ← Back
            </Button>
            <Button
              onClick={onNext}
              className="font-serif shadow-warm hover:shadow-meditation transition-all duration-300"
            >
              Reflect & Export →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
