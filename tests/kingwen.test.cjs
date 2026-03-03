const test = require("node:test");
const assert = require("node:assert/strict");

const {
  FOD_COUNTS,
  KING_WEN_FOD,
  KING_WEN_SEQUENCE,
  fodNoteForWeight,
  fodRarityNote,
  getFodDistributionSummary,
} = require("../.tmp-tests/src/lib/kingwen.js");
const { hexagramNumberToLines } = require("../.tmp-tests/src/lib/hexagrams.js");
const { hammingWeight, xorHexagrams } = require("../.tmp-tests/src/lib/operators.js");

function recomputeFod() {
  return KING_WEN_SEQUENCE.map((_, i) => {
    const a = hexagramNumberToLines(KING_WEN_SEQUENCE[i]);
    const b = hexagramNumberToLines(KING_WEN_SEQUENCE[(i + 1) % 64]);
    return hammingWeight(xorHexagrams(a, b));
  });
}

test("KING_WEN_FOD matches independent recomputation and totals 64", () => {
  const recomputed = recomputeFod();
  assert.deepEqual(KING_WEN_FOD, recomputed);
  assert.equal(KING_WEN_FOD.length, 64);
});

test("FOD_COUNTS matches KING_WEN_FOD frequencies", () => {
  const expected = {};
  for (const w of KING_WEN_FOD) expected[w] = (expected[w] ?? 0) + 1;

  assert.deepEqual(FOD_COUNTS, expected);
  const total = Object.values(FOD_COUNTS).reduce((sum, n) => sum + n, 0);
  assert.equal(total, 64);
});

test("distribution summary text is derived from live counts", () => {
  const summary = getFodDistributionSummary();
  assert.match(summary, new RegExp(`w=2 appears ${FOD_COUNTS[2] ?? 0} times`));
  assert.match(summary, new RegExp(`w=4 appears ${FOD_COUNTS[4] ?? 0} times`));
  assert.match(summary, new RegExp(`w=3 appears ${FOD_COUNTS[3] ?? 0} times`));
  assert.match(
    summary,
    new RegExp(`w=6 \\(complement pairs\\) appears ${FOD_COUNTS[6] ?? 0} times`)
  );
  assert.match(
    summary,
    new RegExp(
      `w=5 appears ${FOD_COUNTS[5] ?? 0} ${((FOD_COUNTS[5] ?? 0) === 1) ? "time" : "times"}`
    )
  );
  assert.match(
    summary,
    new RegExp(
      `w=1 appears ${FOD_COUNTS[1] ?? 0} ${((FOD_COUNTS[1] ?? 0) === 1) ? "time" : "times"}`
    )
  );
});

test("w=5 notes are internally consistent with computed count", () => {
  const count5 = FOD_COUNTS[5] ?? 0;
  const note = fodNoteForWeight(5);
  const rarity = fodRarityNote(5);

  if (count5 === 0) {
    assert.match(note, /does not appear|never appears/i);
    assert.match(rarity, /never appears/i);
  } else {
    assert.match(note, new RegExp(`appears ${count5}`));
  }
});
