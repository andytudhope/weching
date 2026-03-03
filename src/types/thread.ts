export interface TemporalReading {
  id: string;
  date: string;              // "YYYY-MM-DD"
  label?: string;
  inquiry?: string;
  lines: boolean[];          // [6] — lines[0] = line 1 (bottom)
  changingLine: number | null; // 1-6 (1=bottom) or null
  durations?: number[];      // [7] raw ms — stored but not required for analysis
}

export interface ReadingTransition {
  fromIndex: number;
  toIndex: number;
  operator: boolean[];       // XOR mask
  hammingWeight: number;     // 0-6
  trigramCharacter: "lower" | "upper" | "both" | "none";
  operatorClass: "identity" | "surgical" | "moderate" | "substantial" | "total";
}

export interface ThreadState {
  currentStep: number;
  readings: TemporalReading[];
}

export interface ThreadAnalysis {
  transitions: ReadingTransition[];
  netOperator: boolean[];
  netHammingWeight: number;
  stableLines: number[];     // 1-indexed line positions never changed
  volatileLines: number[];   // 1-indexed line positions changed most
  netTrigramCharacter: string;
  presentHexagram: { number: number; name: string; url: string };
  resultingHexagram: { number: number; name: string; url: string } | null;
}

export interface TemporalTexture {
  date: string;              // "YYYY-MM-DD"
  cyclePosition: number;     // 0–383 within the 384-day King Wen cycle
  hexagramPairIndex: number; // 0–63 (which of the 64 KW transitions is active)
  fodValue: number;          // 1–6 (Hamming weight of this KW transition)
  operatorClass: string;
  trigramCharacter: string;
}
