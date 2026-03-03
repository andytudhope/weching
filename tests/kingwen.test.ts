import { test } from "node:test";
import assert from "node:assert/strict";

import {
  FOD_COUNTS,
  KING_WEN_FOD,
  KING_WEN_SEQUENCE,
  fodNoteForWeight,
  fodRarityNote,
  getFodDistributionSummary,
} from "../src/lib/kingwen.js";
import { hexagramNumberToLines } from "../src/lib/hexagrams.js";
import { hammingWeight, xorHexagrams } from "../src/lib/operators.js";

function recomputeFod(): number[] {
  return KING_WEN_SEQUENCE.map((_, i) => {
    const a = hexagramNumberToLines(KING_WEN_SEQUENCE[i]);
    const b = hexagramNumberToLines(KING_WEN_SEQUENCE[(i + 1) % 64]);
    return hammingWeight(xorHexagrams(a, b));
  });
}

test("KING_WEN_FOD matches independent recomputation and totals 64", () => {
  assert.deepEqual(KING_WEN_FOD, recomputeFod());
  assert.equal(KING_WEN_FOD.length, 64);
});

test("FOD_COUNTS matches KING_WEN_FOD frequencies", () => {
  const expected: Record<number, number> = {};
  for (const w of KING_WEN_FOD) expected[w] = (expected[w] ?? 0) + 1;
  assert.deepEqual(FOD_COUNTS, expected);
  assert.equal(Object.values(FOD_COUNTS).reduce((s, n) => s + n, 0), 64);
});

test("distribution summary is derived from live counts", () => {
  const s = getFodDistributionSummary();
  const c = (w: number) => FOD_COUNTS[w] ?? 0;
  const times = (n: number) => (n === 1 ? "time" : "times");
  assert.match(s, new RegExp(`w=2 appears ${c(2)} times`));
  assert.match(s, new RegExp(`w=4 appears ${c(4)} times`));
  assert.match(s, new RegExp(`w=3 appears ${c(3)} times`));
  assert.match(s, new RegExp(`w=6 \\(complement pairs\\) appears ${c(6)} times`));
  assert.match(s, new RegExp(`w=5 appears ${c(5)} ${times(c(5))}`));
  assert.match(s, new RegExp(`w=1 appears ${c(1)} ${times(c(1))}`));
});

test("w=5 notes are consistent with computed count", () => {
  const count5 = FOD_COUNTS[5] ?? 0;
  if (count5 === 0) {
    assert.match(fodNoteForWeight(5), /does not appear|never appears/i);
    assert.match(fodRarityNote(5), /never appears/i);
  } else {
    assert.match(fodNoteForWeight(5), new RegExp(`appears ${count5}`));
  }
});
