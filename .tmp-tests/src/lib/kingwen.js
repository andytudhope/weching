"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FOD_COUNTS = exports.FOD_STATS = exports.KING_WEN_FOD = exports.KING_WEN_SEQUENCE = void 0;
exports.getFodDistributionSummary = getFodDistributionSummary;
exports.fodRarityNote = fodRarityNote;
exports.fodNoteForWeight = fodNoteForWeight;
exports.getTemporalTexture = getTemporalTexture;
exports.getNeighbourhood = getNeighbourhood;
exports.describeNeighbourhood = describeNeighbourhood;
const hexagrams_1 = require("./hexagrams");
const operators_1 = require("./operators");
// The King Wen sequence: hexagram numbers in order (1–64)
exports.KING_WEN_SEQUENCE = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
    17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
    33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
    49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64,
];
// FOD (First Order of Difference) = Hamming weight of XOR between consecutive
// hexagrams in the King Wen sequence. 64 values, one per transition.
// Transition i = KW[i] → KW[(i+1) % 64]
exports.KING_WEN_FOD = exports.KING_WEN_SEQUENCE.map((_, i) => {
    const a = (0, hexagrams_1.hexagramNumberToLines)(exports.KING_WEN_SEQUENCE[i]);
    const b = (0, hexagrams_1.hexagramNumberToLines)(exports.KING_WEN_SEQUENCE[(i + 1) % 64]);
    return (0, operators_1.hammingWeight)((0, operators_1.xorHexagrams)(a, b));
});
// Pre-computed statistics (verified from the FOD array)
exports.FOD_STATS = {
    evenCount: exports.KING_WEN_FOD.filter((v) => v % 2 === 0).length,
    oddCount: exports.KING_WEN_FOD.filter((v) => v % 2 === 1).length,
    neverOccurs: [0, 5].filter((v) => !exports.KING_WEN_FOD.includes(v)),
};
// How many times each FOD weight occurs across the 64 King Wen transitions
exports.FOD_COUNTS = exports.KING_WEN_FOD.reduce((acc, v) => ({ ...acc, [v]: (acc[v] ?? 0) + 1 }), {});
function countAndPct(w) {
    const count = exports.FOD_COUNTS[w] ?? 0;
    const pct = Math.round((count / 64) * 100);
    return { count, pct };
}
function getFodDistributionSummary() {
    const c = (w) => exports.FOD_COUNTS[w] ?? 0;
    return `The distribution is: w=2 appears ${c(2)} times, w=4 appears ${c(4)} times, w=3 appears ${c(3)} times, w=6 (complement pairs) appears ${c(6)} times, w=5 appears ${c(5)} ${c(5) === 1 ? "time" : "times"}, and w=1 appears ${c(1)} ${c(1) === 1 ? "time" : "times"}. w=0 (identity, no change) never appears.`;
}
// Statistical rarity note — more precise than fodNoteForWeight
function fodRarityNote(w) {
    const { count, pct } = countAndPct(w);
    switch (w) {
        case 0:
            return "A 0-change operator never appears in the King Wen sequence — the sequence always moves.";
        case 1:
            return `Only ${count} of the 64 King Wen transitions (${pct}%) are single-line changes. They appear exclusively at structural pair boundaries — the exact thresholds where the sequence crosses from one qualitative region to another.`;
        case 2:
            return `${count} of 64 King Wen transitions (${pct}%) are 2-line changes — the most common. This is the signature of natural pairing: most hexagram pairs differ by exactly two lines.`;
        case 3:
            return `${count} of 64 King Wen transitions (${pct}%) are 3-line changes — moderate, appearing frequently throughout the sequence.`;
        case 4:
            return `${count} of 64 King Wen transitions (${pct}%) are 4-line changes — substantial. More than half the structure shifts.`;
        case 5:
            return "A 5-change operator never appears in the King Wen sequence — structurally excluded, like the identity.";
        case 6:
            return `Only ${count} of 64 King Wen transitions (${pct}%) are complete inversions — complement pairs where all six lines reverse. The rarest transformation.`;
        default:
            return "";
    }
}
// Human-readable note for a given Hamming weight in the KW context
function fodNoteForWeight(w) {
    const { count } = countAndPct(w);
    switch (w) {
        case 0:
            return "An identity — this operator never appears in the King Wen sequence.";
        case 1:
            return `A single-line change: appears ${count} ${count === 1 ? "time" : "times"} in the King Wen sequence — the most precise move possible, a threshold crossing at a structural pair boundary.`;
        case 2:
            return `A 2-line change: appears ${count} of 64 times in the King Wen sequence — the signature of natural pairing.`;
        case 3:
            return `A 3-line change: moderate, appearing ${count} of 64 times in the King Wen sequence.`;
        case 4:
            return `A 4-line change: substantial, appearing ${count} of 64 times — relatively common in the King Wen sequence.`;
        case 5:
            return count === 0
                ? "A 5-line change: does not appear in the King Wen sequence."
                : `A 5-line change: appears ${count} ${count === 1 ? "time" : "times"} in the King Wen sequence — rare, near-total transformation, one line from a complete inversion.`;
        case 6:
            return `A 6-line change (complement): total inversion, appearing ${count} of 64 times — the complement pair relationship.`;
        default:
            return "";
    }
}
// --- Neighbourhood of Now ---
// Anchor: Unix epoch (Jan 1 1970 = cycle day 0)
// Period: 384 days = 64 hexagrams × 6 days each
const CYCLE_LENGTH_DAYS = 384;
const DAYS_PER_HEXAGRAM = 6;
const EPOCH_MS = 0; // Unix epoch
function dateToMs(date) {
    // Use UTC midnight to avoid timezone drift
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}
function getTemporalTexture(date) {
    const ms = dateToMs(date);
    const daysSinceEpoch = Math.floor((ms - EPOCH_MS) / (1000 * 60 * 60 * 24));
    // Handle dates before epoch
    const positiveDays = ((daysSinceEpoch % CYCLE_LENGTH_DAYS) + CYCLE_LENGTH_DAYS) %
        CYCLE_LENGTH_DAYS;
    const cyclePosition = positiveDays; // 0–383
    const hexagramPairIndex = Math.floor(cyclePosition / DAYS_PER_HEXAGRAM); // 0–63
    const fodValue = exports.KING_WEN_FOD[hexagramPairIndex];
    const a = (0, hexagrams_1.hexagramNumberToLines)(exports.KING_WEN_SEQUENCE[hexagramPairIndex]);
    const b = (0, hexagrams_1.hexagramNumberToLines)(exports.KING_WEN_SEQUENCE[(hexagramPairIndex + 1) % 64]);
    const op = (0, operators_1.xorHexagrams)(a, b);
    return {
        date: date.toISOString().slice(0, 10),
        cyclePosition,
        hexagramPairIndex,
        fodValue,
        operatorClass: (0, operators_1.operatorClass)(fodValue),
        trigramCharacter: (0, operators_1.trigramCharacter)(op),
    };
}
function getNeighbourhood(centreDate, radiusDays = 14) {
    const result = [];
    for (let offset = -radiusDays; offset <= radiusDays; offset++) {
        const d = new Date(dateToMs(centreDate) + offset * 24 * 60 * 60 * 1000);
        result.push(getTemporalTexture(d));
    }
    return result;
}
function describeNeighbourhood(neighbourhood) {
    const today = neighbourhood[Math.floor(neighbourhood.length / 2)];
    const todayClass = today.operatorClass;
    const todayFod = today.fodValue;
    // Find any nearby class shifts (within ±5 days)
    const centre = Math.floor(neighbourhood.length / 2);
    const upcoming = neighbourhood.slice(centre + 1, centre + 6);
    const different = upcoming.find((t) => t.operatorClass !== todayClass);
    const classDescriptions = {
        identity: "perfect stillness — the same hexagram persists",
        surgical: "precise, singular shifts — a time for discernment and exact adjustments",
        moderate: "steady, moderate movement — gradual adjustment rather than rupture",
        substantial: "substantial transformation — much is in motion",
        total: "total inversion — complete reversal of the present configuration",
    };
    const trigramDescriptions = {
        lower: "inner",
        upper: "outer",
        both: "inner and outer",
        none: "",
    };
    const trigramNote = today.trigramCharacter !== "none"
        ? ` affecting the ${trigramDescriptions[today.trigramCharacter]} world`
        : "";
    let desc = `The quality of these days is ${classDescriptions[todayClass]}${trigramNote}`;
    if (todayFod === 1 || todayFod === 2) {
        desc += ` — ${fodNoteForWeight(todayFod).split(":")[0].toLowerCase()}`;
    }
    desc += ".";
    if (different) {
        const daysAway = upcoming.indexOf(different) + 1;
        const dayWord = daysAway === 1 ? "Tomorrow" : `In ${daysAway} days`;
        desc += ` ${dayWord} the quality shifts toward ${classDescriptions[different.operatorClass]}.`;
    }
    return desc;
}
