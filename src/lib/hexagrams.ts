// Trigram encoding (3 lines bottom-to-top, yang=1 yin=0 → 3-bit number):
// The low bit is the bottom line and the high bit is the top line.
//   7 (111) = Ch'ien (Heaven)
//   0 (000) = K'un   (Earth)
//   1 (001) = Chên   (Thunder)
//   2 (010) = K'an   (Water)
//   4 (100) = Kên    (Mountain)
//   6 (110) = Sun    (Wind)
//   5 (101) = Li     (Fire)
//   3 (011) = Tui    (Lake)

// HEXAGRAM_LOOKUP[lower][upper] → hexagram number (1-64)
// Both indices are trigram bit values (0-7)
const HEXAGRAM_LOOKUP: number[][] = [
  //              K'un  Chên  K'an  Tui   Kên   Li    Sun   Ch'ien
  //  upper:       0     1     2     3     4     5     6     7
  // lower:
  /* 0 K'un   */ [2, 16, 8, 45, 23, 35, 20, 12],
  /* 1 Chên   */ [24, 51, 3, 17, 27, 21, 42, 25],
  /* 2 K'an   */ [7, 40, 29, 47, 4, 64, 59, 6],
  /* 3 Tui    */ [19, 54, 60, 58, 41, 38, 61, 10],
  /* 4 Kên    */ [15, 62, 39, 31, 52, 56, 53, 33],
  /* 5 Li     */ [36, 55, 63, 49, 22, 30, 37, 13],
  /* 6 Sun    */ [46, 32, 48, 28, 18, 50, 57, 44],
  /* 7 Ch'ien */ [11, 34, 5, 43, 26, 14, 9, 1],
];

const HEXAGRAM_NAMES: Record<number, string> = {
  1: "The Creative",
  2: "The Receptive",
  3: "Difficulty at the Beginning",
  4: "Youthful Folly",
  5: "Waiting",
  6: "Conflict",
  7: "The Army",
  8: "Holding Together",
  9: "The Taming Power of the Small",
  10: "Treading",
  11: "Peace",
  12: "Standstill",
  13: "Fellowship with Men",
  14: "Possession in Great Measure",
  15: "Modesty",
  16: "Enthusiasm",
  17: "Following",
  18: "Work on What Has Been Spoiled",
  19: "Approach",
  20: "Contemplation",
  21: "Biting Through",
  22: "Grace",
  23: "Splitting Apart",
  24: "Return",
  25: "Innocence",
  26: "The Taming Power of the Great",
  27: "The Corners of the Mouth",
  28: "Preponderance of the Great",
  29: "The Abysmal",
  30: "The Clinging",
  31: "Influence",
  32: "Duration",
  33: "Retreat",
  34: "The Power of the Great",
  35: "Progress",
  36: "Darkening of the Light",
  37: "The Family",
  38: "Opposition",
  39: "Obstruction",
  40: "Deliverance",
  41: "Decrease",
  42: "Increase",
  43: "Breakthrough",
  44: "Coming to Meet",
  45: "Gathering Together",
  46: "Pushing Upward",
  47: "Oppression",
  48: "The Well",
  49: "Revolution",
  50: "The Caldron",
  51: "The Arousing",
  52: "Keeping Still",
  53: "Development",
  54: "The Marrying Maiden",
  55: "Abundance",
  56: "The Wanderer",
  57: "The Gentle",
  58: "The Joyous",
  59: "Dispersion",
  60: "Limitation",
  61: "Inner Truth",
  62: "Preponderance of the Small",
  63: "After Completion",
  64: "Before Completion",
};

function trigramBits(lines: boolean[]): number {
  return (
    (lines[0] ? 1 : 0) |
    ((lines[1] ? 1 : 0) << 1) |
    ((lines[2] ? 1 : 0) << 2)
  );
}

export interface TrigramData {
  symbol: string;   // e.g. "☰"
  name: string;     // e.g. "Ch'ien"
  element: string;  // e.g. "Heaven"
  quality: string;  // e.g. "creative"
  inner: string;    // natural phrase when this trigram is lower (inner world)
  outer: string;    // natural phrase when this trigram is upper (outer world)
}

export const TRIGRAM_DATA: Record<number, TrigramData> = {
  7: { symbol: "☰", name: "Ch'ien", element: "Heaven",   quality: "creative",
       inner: "Heaven arises within — the creative impulse stirs",
       outer: "Heaven moves above — creative force descends" },
  0: { symbol: "☷", name: "K'un",   element: "Earth",    quality: "receptive",
       inner: "Earth holds within — patient, yielding, still",
       outer: "Earth receives above — the field is open" },
  1: { symbol: "☳", name: "Chên",   element: "Thunder",  quality: "arousing",
       inner: "Thunder stirs within — sudden awakening",
       outer: "Thunder moves above — arousal comes from outside" },
  2: { symbol: "☵", name: "K'an",   element: "Water",    quality: "abysmal",
       inner: "Water flows within — deep current, inner danger",
       outer: "Water moves above — the depths are outside" },
  4: { symbol: "☶", name: "Kên",    element: "Mountain", quality: "still",
       inner: "Mountain rests within — inner stillness, holding",
       outer: "Mountain stands above — the outer world is still" },
  6: { symbol: "☴", name: "Sun",    element: "Wind",     quality: "gentle",
       inner: "Wind moves within — gentle inner penetration",
       outer: "Wind passes above — subtle influence from outside" },
  5: { symbol: "☲", name: "Li",     element: "Fire",     quality: "clinging",
       inner: "Fire burns within — inner clarity and brightness",
       outer: "Fire illuminates above — clarity comes from without" },
  3: { symbol: "☱", name: "Tui",    element: "Lake",     quality: "joyful",
       inner: "Lake gathers within — inner joy, reflection",
       outer: "Lake opens above — joy and openness in the outer world" },
};

// Returns the lower and upper TrigramData for any 6-line hexagram
export function getTrigramPair(lines: boolean[]): { lower: TrigramData; upper: TrigramData } {
  const lowerBits = trigramBits(lines.slice(0, 3));
  const upperBits = trigramBits(lines.slice(3, 6));
  return {
    lower: TRIGRAM_DATA[lowerBits],
    upper: TRIGRAM_DATA[upperBits],
  };
}

export interface HexagramInfo {
  number: number;
  name: string;
  url: string;
}

export function getHexagramInfo(lines: boolean[]): HexagramInfo {
  const lower = trigramBits(lines.slice(0, 3));
  const upper = trigramBits(lines.slice(3, 6));
  const num = HEXAGRAM_LOOKUP[lower][upper];
  return {
    number: num,
    name: HEXAGRAM_NAMES[num],
    url: `https://jamesdekorne.com/GBCh/hex${num}.htm`,
  };
}

// Reverse lookup: given a hexagram number (1-64), return its 6-bit line array
// lines[0] = line 1 (bottom), lines[5] = line 6 (top)
export function hexagramNumberToLines(num: number): boolean[] {
  for (let lower = 0; lower < 8; lower++) {
    for (let upper = 0; upper < 8; upper++) {
      if (HEXAGRAM_LOOKUP[lower][upper] === num) {
        return [
          !!(lower & 1),
          !!(lower & 2),
          !!(lower & 4),
          !!(upper & 1),
          !!(upper & 2),
          !!(upper & 4),
        ];
      }
    }
  }
  throw new Error(`Invalid hexagram number: ${num}`);
}
