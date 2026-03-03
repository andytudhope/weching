import { getHexagramInfo } from "./hexagrams";
import type {
  TemporalReading,
  ReadingTransition,
  ThreadAnalysis,
} from "@/types/thread";

// Traditional positional meanings for each line (1-indexed)
export const LINE_POSITION_MEANINGS: Record<number, string> = {
  1: "Line 1 — the root. What is just beginning; the situation at its foundation.",
  2: "Line 2 — inner alignment. The central position of the lower trigram; what is genuinely held within.",
  3: "Line 3 — the threshold. The uppermost of the inner trigram, straining toward the outer world, not yet arrived.",
  4: "Line 4 — proximity. The lowest of the outer trigram; where inner conditions meet external circumstance.",
  5: "Line 5 — the ruling position. Centre of the outer trigram; clarity, authority, right place in the situation.",
  6: "Line 6 — beyond. Above the ruling position; completion, extremity, what has moved past the moment's form.",
};

// Which line positions (1-indexed) are changed in an operator
export function changedLinePositions(operator: boolean[]): number[] {
  return operator.map((changed, i) => (changed ? i + 1 : -1)).filter((v) => v !== -1);
}

export function xorHexagrams(a: boolean[], b: boolean[]): boolean[] {
  return a.map((v, i) => v !== b[i]);
}

export function hammingWeight(op: boolean[]): number {
  return op.filter(Boolean).length;
}

export function trigramCharacter(
  op: boolean[]
): "lower" | "upper" | "both" | "none" {
  const lowerChanged = op.slice(0, 3).some(Boolean);
  const upperChanged = op.slice(3, 6).some(Boolean);
  if (lowerChanged && upperChanged) return "both";
  if (lowerChanged) return "lower";
  if (upperChanged) return "upper";
  return "none";
}

export function operatorClass(
  w: number
): "identity" | "surgical" | "moderate" | "substantial" | "total" {
  if (w === 0) return "identity";
  if (w === 1) return "surgical";
  if (w <= 3) return "moderate";
  if (w <= 5) return "substantial";
  return "total";
}

// XOR of first and last hexagram in the readings array
export function netOperator(readings: TemporalReading[]): boolean[] {
  if (readings.length < 2) return [false, false, false, false, false, false];
  return xorHexagrams(readings[0].lines, readings[readings.length - 1].lines);
}

// Line positions (1-indexed) that never changed across any transition
export function stableLines(readings: TemporalReading[]): number[] {
  if (readings.length < 2) return [1, 2, 3, 4, 5, 6];
  const stable: boolean[] = [true, true, true, true, true, true];
  for (let i = 0; i < readings.length - 1; i++) {
    const op = xorHexagrams(readings[i].lines, readings[i + 1].lines);
    op.forEach((changed, idx) => {
      if (changed) stable[idx] = false;
    });
  }
  return stable
    .map((s, i) => (s ? i + 1 : -1))
    .filter((v) => v !== -1);
}

// Line positions (1-indexed) that changed in ≥50% of transitions
export function volatileLines(readings: TemporalReading[]): number[] {
  if (readings.length < 2) return [];
  const changeCounts = [0, 0, 0, 0, 0, 0];
  const transitions = readings.length - 1;
  for (let i = 0; i < transitions; i++) {
    const op = xorHexagrams(readings[i].lines, readings[i + 1].lines);
    op.forEach((changed, idx) => {
      if (changed) changeCounts[idx]++;
    });
  }
  return changeCounts
    .map((count, i) => (count / transitions >= 0.5 ? i + 1 : -1))
    .filter((v) => v !== -1);
}

export function describeTransition(t: ReadingTransition, readings: TemporalReading[]): string {
  const from = readings[t.fromIndex];
  const to = readings[t.toIndex];
  const fromInfo = getHexagramInfo(from.lines);
  const toInfo = getHexagramInfo(to.lines);

  const classDesc: Record<string, string> = {
    identity: "No change — the same hexagram recurs.",
    surgical: "A single line shifts — precise, minimal transformation.",
    moderate: `${t.hammingWeight} lines shift — a meaningful adjustment, structure mostly preserved.`,
    substantial: `${t.hammingWeight} lines shift — significant transformation, much is altered.`,
    total: "All six lines invert — complete reversal, the complement hexagram.",
  };

  const trigramDesc: Record<string, string> = {
    lower: "The lower trigram (inner world) transforms.",
    upper: "The upper trigram (outer world) transforms.",
    both: "Both trigrams transform.",
    none: "",
  };

  const parts = [
    `Hexagram ${fromInfo.number} → ${toInfo.number}`,
    classDesc[t.operatorClass],
  ];
  if (t.trigramCharacter !== "none") {
    parts.push(trigramDesc[t.trigramCharacter]);
  }
  return parts.join(" ");
}

export function analyzeThread(readings: TemporalReading[]): ThreadAnalysis {
  const transitions: ReadingTransition[] = [];

  for (let i = 0; i < readings.length - 1; i++) {
    const op = xorHexagrams(readings[i].lines, readings[i + 1].lines);
    const w = hammingWeight(op);
    transitions.push({
      fromIndex: i,
      toIndex: i + 1,
      operator: op,
      hammingWeight: w,
      trigramCharacter: trigramCharacter(op),
      operatorClass: operatorClass(w),
    });
  }

  const net = netOperator(readings);
  const netW = hammingWeight(net);

  const lastReading = readings[readings.length - 1];
  const presentHex = getHexagramInfo(lastReading.lines);

  let resultingHexagram = null;
  if (lastReading.changingLine !== null) {
    const futureLines = [...lastReading.lines];
    futureLines[lastReading.changingLine - 1] =
      !futureLines[lastReading.changingLine - 1];
    resultingHexagram = getHexagramInfo(futureLines);
  }

  return {
    transitions,
    netOperator: net,
    netHammingWeight: netW,
    stableLines: stableLines(readings),
    volatileLines: volatileLines(readings),
    netTrigramCharacter: trigramCharacter(net),
    presentHexagram: presentHex,
    resultingHexagram,
  };
}
