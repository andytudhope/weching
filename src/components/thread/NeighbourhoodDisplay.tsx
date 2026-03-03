"use client";

import { useMemo, useState } from "react";
import {
  getTemporalTexture,
  describeNeighbourhood,
  getNeighbourhood,
  KING_WEN_SEQUENCE,
  KING_WEN_FOD,
  getFodDistributionSummary,
} from "@/lib/kingwen";
import { hexagramNumberToLines, getHexagramInfo, getTrigramPair } from "@/lib/hexagrams";
import { xorHexagrams, trigramCharacter } from "@/lib/operators";
import { TrigramGrid } from "@/components/TrigramGrid";

// ——— Sub-components ———

function MiniHex({ lines }: { lines: boolean[] }) {
  return (
    <div className="flex flex-col-reverse gap-[3px]">
      {lines.map((isYang, i) => (
        <div key={i} className="flex gap-[2px] w-10">
          {isYang ? (
            <div className="h-[3px] flex-1 rounded-full bg-primary" />
          ) : (
            <>
              <div className="h-[3px] flex-1 rounded-full bg-primary" />
              <div className="h-[3px] flex-1 rounded-full bg-primary" />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

// 6 dots arranged bottom-to-top showing which lines change in a transition.
// Amber = lower trigram (inner world), blue = upper trigram (outer world).
// Filled = changes, hollow = stable.
function OperatorColumn({ operator }: { operator: boolean[] }) {
  return (
    <div className="flex flex-col-reverse gap-1.5 items-center">
      {operator.map((changes, i) => {
        const isUpper = i >= 3;
        return (
          <div
            key={i}
            title={`Line ${i + 1}: ${changes ? "changes" : "stable"} (${isUpper ? "upper / outer" : "lower / inner"})`}
            className={`w-2.5 h-2.5 rounded-full border ${
              changes
                ? isUpper
                  ? "bg-sky-400 border-sky-500"
                  : "bg-amber-400 border-amber-500"
                : "border-muted-foreground/30 bg-transparent"
            }`}
          />
        );
      })}
    </div>
  );
}

// Arc showing progress through the 384-day cycle
function CycleArc({ cyclePosition }: { cyclePosition: number }) {
  const progress = cyclePosition / 384;
  const angle = progress * 2 * Math.PI;
  const r = 36;
  const cx = 50;
  const cy = 50;
  const startX = cx;
  const startY = cy - r;
  const endX = cx + r * Math.sin(angle);
  const endY = cy - r * Math.cos(angle);
  const largeArc = angle > Math.PI ? 1 : 0;
  const arcPath = `M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX.toFixed(2)} ${endY.toFixed(2)}`;

  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20">
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="hsl(42 40% 88%)"
        strokeWidth="6"
      />
      <path
        d={arcPath}
        fill="none"
        stroke="hsl(35 40% 25%)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx={endX} cy={endY} r="4" fill="hsl(40 80% 60%)" />
      <text
        x={cx}
        y={cy - 3}
        textAnchor="middle"
        fontSize="12"
        fill="hsl(35 40% 25%)"
        fontFamily="Georgia, serif"
        fontWeight="bold"
      >
        {cyclePosition}
      </text>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        fontSize="7"
        fill="hsl(30 8% 45%)"
        fontFamily="Georgia, serif"
      >
        of 384
      </text>
    </svg>
  );
}

// The 5 pairs centred on the current pair, shown as a mini journey strip
function SequenceStrip({ pairIndex }: { pairIndex: number }) {
  const offsets = [-2, -1, 0, 1, 2];

  return (
    <div className="flex gap-1.5 items-end justify-center">
      {offsets.map((offset) => {
        const idx = ((pairIndex + offset + 64) % 64);
        const fromNum = KING_WEN_SEQUENCE[idx];
        const toNum = KING_WEN_SEQUENCE[(idx + 1) % 64];
        const fod = KING_WEN_FOD[idx];
        const fromLines = hexagramNumberToLines(fromNum);
        const toLines = hexagramNumberToLines(toNum);
        const op = xorHexagrams(fromLines, toLines);
        const tc = trigramCharacter(op);
        const isCurrent = offset === 0;

        const colorMap: Record<string, string> = {
          lower: isCurrent ? "bg-amber-400" : "bg-amber-200",
          upper: isCurrent ? "bg-sky-400" : "bg-sky-200",
          both: isCurrent ? "bg-violet-400" : "bg-violet-200",
          none: isCurrent ? "bg-stone-400" : "bg-stone-200",
        };

        const heightPx = Math.round((fod / 6) * 40);

        return (
          <div key={idx} className={`flex flex-col items-center gap-1 ${isCurrent ? "" : "opacity-60"}`}>
            <div
              className={`w-7 rounded-t-sm ${colorMap[tc]} ${isCurrent ? "ring-1 ring-primary/40" : ""}`}
              style={{ height: `${heightPx}px` }}
            />
            <p className={`text-[9px] font-mono leading-none ${isCurrent ? "text-primary font-bold" : "text-muted-foreground"}`}>
              {fromNum}→{toNum}
            </p>
            <p className="text-[9px] font-serif text-muted-foreground leading-none">
              w={fod}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ——— Main component ———

interface NeighbourhoodDisplayProps {
  today: Date;
}

export function NeighbourhoodDisplay({ today }: NeighbourhoodDisplayProps) {
  const [expanded, setExpanded] = useState(false);

  const texture = useMemo(() => getTemporalTexture(today), [today]);
  const neighbourhood = useMemo(() => getNeighbourhood(today, 14), [today]);
  const prose = useMemo(() => describeNeighbourhood(neighbourhood), [neighbourhood]);

  const fromNum = KING_WEN_SEQUENCE[texture.hexagramPairIndex];
  const toNum = KING_WEN_SEQUENCE[(texture.hexagramPairIndex + 1) % 64];

  const fromLines = useMemo(() => hexagramNumberToLines(fromNum), [fromNum]);
  const toLines = useMemo(() => hexagramNumberToLines(toNum), [toNum]);
  const operator = useMemo(() => xorHexagrams(fromLines, toLines), [fromLines, toLines]);
  const fromInfo = useMemo(() => getHexagramInfo(fromLines), [fromLines]);
  const toInfo = useMemo(() => getHexagramInfo(toLines), [toLines]);
  const fromTrigrams = useMemo(() => getTrigramPair(fromLines), [fromLines]);
  const toTrigrams = useMemo(() => getTrigramPair(toLines), [toLines]);

  const fod = texture.fodValue;

  const trigramDesc: Record<string, string> = {
    lower: `${fromTrigrams.lower.element} (inner)`,
    upper: `${fromTrigrams.upper.element} (outer)`,
    both: `${fromTrigrams.lower.element} and ${fromTrigrams.upper.element}`,
    none: "neither trigram directly",
  };

  const operatorDesc: Record<string, string> = {
    identity: "unchanging",
    surgical: "precise single-line pivot",
    moderate: "moderate shift",
    substantial: "substantial transformation",
    total: "complete inversion",
  };

  return (
    <div className="rounded-2xl border border-border bg-gradient-subtle shadow-soft overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-2 text-center">
        <h3 className="font-serif font-semibold text-primary text-sm uppercase tracking-widest">
          the neighbourhood of now
        </h3>
        <p className="text-xs font-serif text-muted-foreground mt-1">
          The I Ching&apos;s 64 hexagrams form a 6-dimensional hypercube — a space of possible states.
          The King Wen sequence traces a specific path through it. This display shows
          where that cycle stands today, as an aid to sensing the current moment and crafting an
          enquiry resonant with it.
        </p>
      </div>

      {/* Cycle arc + Active pair */}
      <div className="px-5 py-3">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {/* Cycle position */}
          <div className="flex flex-col items-center gap-1">
            <CycleArc cyclePosition={texture.cyclePosition} />
            <p className="text-[10px] font-serif text-muted-foreground text-center leading-snug">
              day in the<br />384-day cycle
            </p>
          </div>

          {/* Active hexagram pair */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] font-serif text-muted-foreground uppercase tracking-wide">
              active pair
            </p>
            <div className="flex items-center gap-3">
              {/* From */}
              <div className="flex flex-col items-center gap-1">
                <MiniHex lines={fromLines} />
                <p className="text-[10px] font-mono text-primary">{fromNum}</p>
                <p className="text-[9px] font-serif text-muted-foreground leading-none">
                  {fromTrigrams.lower.symbol} {fromTrigrams.lower.element}
                </p>
                <p className="text-[9px] font-serif text-muted-foreground leading-none">
                  {fromTrigrams.upper.symbol} {fromTrigrams.upper.element}
                </p>
              </div>

              {/* Operator dots */}
              <div className="flex flex-col items-center gap-0.5">
                <OperatorColumn operator={operator} />
                <p className="text-[9px] font-serif text-muted-foreground mt-0.5">w={fod}</p>
              </div>

              {/* To */}
              <div className="flex flex-col items-center gap-1">
                <MiniHex lines={toLines} />
                <p className="text-[10px] font-mono text-primary">{toNum}</p>
                <p className="text-[9px] font-serif text-muted-foreground leading-none">
                  {toTrigrams.lower.symbol} {toTrigrams.lower.element}
                </p>
                <p className="text-[9px] font-serif text-muted-foreground leading-none">
                  {toTrigrams.upper.symbol} {toTrigrams.upper.element}
                </p>
              </div>
            </div>

            {/* Pair description */}
            <p className="text-[11px] font-serif text-foreground/70 text-center max-w-[200px] leading-snug">
              <span className="text-primary font-medium">{fromInfo.name}</span>
              {" → "}
              <span className="text-primary font-medium">{toInfo.name}</span>
            </p>
            <p className="text-[10px] font-serif text-muted-foreground text-center">
              {fod} line{fod !== 1 ? "s" : ""} change · {operatorDesc[texture.operatorClass]}
              {" · "}{trigramDesc[texture.trigramCharacter]}
            </p>
          </div>
        </div>
      </div>

      {/* Sequence strip: journey through nearby pairs */}
      <div className="px-5 pb-3">
        <p className="text-[9px] font-serif text-muted-foreground text-center mb-1.5 uppercase tracking-wide">
          path through the sequence (5 pairs)
        </p>
        <SequenceStrip pairIndex={texture.hexagramPairIndex} />
        <div className="flex justify-center gap-4 mt-1.5 text-[9px] font-serif text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-amber-300 inline-block" /> inner
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-sky-300 inline-block" /> outer
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-violet-300 inline-block" /> both
          </span>
        </div>
      </div>

      {/* Prose */}
      <div className="px-5 pb-4">
        <p className="text-sm font-serif text-foreground/70 leading-relaxed text-center">
          {prose}
        </p>
      </div>

      {/* Expandable context */}
      <div className="border-t border-border/40">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-5 py-3 text-xs font-serif text-muted-foreground hover:text-foreground transition-colors flex items-center justify-between"
        >
          <span>What is this? — hexagram space, the King Wen path, and why these numbers</span>
          <span className="shrink-0 ml-2">{expanded ? "▲" : "▼"}</span>
        </button>

        {expanded && (
          <div className="px-5 pb-6 space-y-4 text-xs font-serif text-foreground/70 leading-relaxed border-t border-border/20">
            <p className="pt-3">
              <strong className="text-primary">Hexagram space.</strong>{" "}
              Each hexagram is a point in a 6-dimensional binary space — a hypercube of 64 vertices,
              one per combination of six yin/yang lines. The distance between any two hexagrams is
              their Hamming distance: how many lines differ. Crucially, every hexagram is simultaneously
              a <em>state</em> (where you are in the space) and an <em>operator</em> (a transformation
              that can move any state to another, via bitwise XOR). The coloured dots above show
              exactly which lines the current transition changes:
              {" "}<span className="text-amber-600 font-medium">amber = lower trigram (lines 1–3)</span>,
              {" "}<span className="text-sky-600 font-medium">blue = upper trigram (lines 4–6)</span>.
            </p>

            <p>
              <strong className="text-primary">Lower and upper trigrams.</strong>{" "}
              Each hexagram is composed of two trigrams of three lines. The lower trigram (lines 1–3)
              is traditionally the inner world — your own state, what arises from within. The upper
              (lines 4–6) is the outer world — circumstances, environment, what comes from outside.
              When today&apos;s transition moves only in the lower trigram, inner conditions are in motion
              while the outer situation holds. When only the upper, the outer is in flux. When both,
              the shift is comprehensive. The prose description above tells you which it is today.
            </p>

            <p>
              <strong className="text-primary">The King Wen sequence.</strong>{" "}
              The I Ching&apos;s traditional arrangement of 64 hexagrams — attributed to King Wen —
              traces a specific path through this hypercube, visiting each vertex exactly once (a
              Hamiltonian path). The First Order of Difference (FOD) at each step is the number of
              lines that change. {getFodDistributionSummary()}
            </p>

            <div className="pt-1">
              <TrigramGrid today={today} />
            </div>

            <p>
              <strong className="text-primary">Why 384 days.</strong>{" "}
              There are 64 transitions in the King Wen sequence. Assigning 6 days to each — resonant
              with the hexagram having 6 lines — gives 64 × 6 = 384 days per full cycle. This is
              not a solar year (~365 days), so the cycle drifts through the seasons: it is its own
              rhythm, independent of the sun. The bar heights in the sequence strip above show the
              FOD (1 = short, 6 = tall) for each nearby pair; the colours show which trigram is active.
            </p>

            <p>
              <strong className="text-primary">Why January 1, 1970.</strong>{" "}
              The Unix epoch — midnight January 1, 1970 UTC — is the foundational time standard of
              digital systems worldwide. Since this reading is conducted in digital media, anchoring
              the cycle to the Unix epoch is coherent, transparent, and honest about its arbitrariness.
              It is not an eschatological date, not a countdown to anything, not predictive. The cycle
              repeats indefinitely. Its purpose is not to tell you what will happen, but to describe
              the structural quality of the transitions that characterize this moment in the sequence.
            </p>

            <p className="text-muted-foreground italic">
              This display is descriptive, not prescriptive. It offers a lens on the character of now,
              not a prescription for what to ask or how to act.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
