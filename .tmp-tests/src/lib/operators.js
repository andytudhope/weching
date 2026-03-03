"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LINE_POSITION_MEANINGS = void 0;
exports.changedLinePositions = changedLinePositions;
exports.xorHexagrams = xorHexagrams;
exports.hammingWeight = hammingWeight;
exports.trigramCharacter = trigramCharacter;
exports.operatorClass = operatorClass;
exports.netOperator = netOperator;
exports.stableLines = stableLines;
exports.volatileLines = volatileLines;
exports.describeTransition = describeTransition;
exports.analyzeThread = analyzeThread;
const hexagrams_1 = require("./hexagrams");
// Traditional positional meanings for each line (1-indexed)
exports.LINE_POSITION_MEANINGS = {
    1: "Line 1 — the root. What is just beginning; the situation at its foundation.",
    2: "Line 2 — inner alignment. The central position of the lower trigram; what is genuinely held within.",
    3: "Line 3 — the threshold. The uppermost of the inner trigram, straining toward the outer world, not yet arrived.",
    4: "Line 4 — proximity. The lowest of the outer trigram; where inner conditions meet external circumstance.",
    5: "Line 5 — the ruling position. Centre of the outer trigram; clarity, authority, right place in the situation.",
    6: "Line 6 — beyond. Above the ruling position; completion, extremity, what has moved past the moment's form.",
};
// Which line positions (1-indexed) are changed in an operator
function changedLinePositions(operator) {
    return operator.map((changed, i) => (changed ? i + 1 : -1)).filter((v) => v !== -1);
}
function xorHexagrams(a, b) {
    return a.map((v, i) => v !== b[i]);
}
function hammingWeight(op) {
    return op.filter(Boolean).length;
}
function trigramCharacter(op) {
    const lowerChanged = op.slice(0, 3).some(Boolean);
    const upperChanged = op.slice(3, 6).some(Boolean);
    if (lowerChanged && upperChanged)
        return "both";
    if (lowerChanged)
        return "lower";
    if (upperChanged)
        return "upper";
    return "none";
}
function operatorClass(w) {
    if (w === 0)
        return "identity";
    if (w === 1)
        return "surgical";
    if (w <= 3)
        return "moderate";
    if (w <= 5)
        return "substantial";
    return "total";
}
// XOR of first and last hexagram in the readings array
function netOperator(readings) {
    if (readings.length < 2)
        return [false, false, false, false, false, false];
    return xorHexagrams(readings[0].lines, readings[readings.length - 1].lines);
}
// Line positions (1-indexed) that never changed across any transition
function stableLines(readings) {
    if (readings.length < 2)
        return [1, 2, 3, 4, 5, 6];
    const stable = [true, true, true, true, true, true];
    for (let i = 0; i < readings.length - 1; i++) {
        const op = xorHexagrams(readings[i].lines, readings[i + 1].lines);
        op.forEach((changed, idx) => {
            if (changed)
                stable[idx] = false;
        });
    }
    return stable
        .map((s, i) => (s ? i + 1 : -1))
        .filter((v) => v !== -1);
}
// Line positions (1-indexed) that changed in ≥50% of transitions
function volatileLines(readings) {
    if (readings.length < 2)
        return [];
    const changeCounts = [0, 0, 0, 0, 0, 0];
    const transitions = readings.length - 1;
    for (let i = 0; i < transitions; i++) {
        const op = xorHexagrams(readings[i].lines, readings[i + 1].lines);
        op.forEach((changed, idx) => {
            if (changed)
                changeCounts[idx]++;
        });
    }
    return changeCounts
        .map((count, i) => (count / transitions >= 0.5 ? i + 1 : -1))
        .filter((v) => v !== -1);
}
function describeTransition(t, readings) {
    const from = readings[t.fromIndex];
    const to = readings[t.toIndex];
    const fromInfo = (0, hexagrams_1.getHexagramInfo)(from.lines);
    const toInfo = (0, hexagrams_1.getHexagramInfo)(to.lines);
    const classDesc = {
        identity: "No change — the same hexagram recurs.",
        surgical: "A single line shifts — precise, minimal transformation.",
        moderate: `${t.hammingWeight} lines shift — a meaningful adjustment, structure mostly preserved.`,
        substantial: `${t.hammingWeight} lines shift — significant transformation, much is altered.`,
        total: "All six lines invert — complete reversal, the complement hexagram.",
    };
    const trigramDesc = {
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
function analyzeThread(readings) {
    const transitions = [];
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
    const presentHex = (0, hexagrams_1.getHexagramInfo)(lastReading.lines);
    let resultingHexagram = null;
    if (lastReading.changingLine !== null) {
        const futureLines = [...lastReading.lines];
        futureLines[lastReading.changingLine - 1] =
            !futureLines[lastReading.changingLine - 1];
        resultingHexagram = (0, hexagrams_1.getHexagramInfo)(futureLines);
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
