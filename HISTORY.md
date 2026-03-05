# Terence McKenna's Novelty Theory and Timewave Zero

## 1. The Original Theory: Novelty Theory

### Background and Origin

Terence Kemp McKenna (November 16, 1946 - April 3, 2000) was an American ethnobotanist, philosopher, and lecturer. The genesis of Novelty Theory came from his experience at La Chorrera, Colombia in 1971, where he and his brother Dennis (along with three companions) conducted a self-described psychedelic experiment involving high-dose psilocybin mushrooms (*Psilocybe cubensis*). The brothers attempted what they described as an experiment to "bond harmine DNA with their own neural DNA" through specific vocal techniques. The resulting altered states of consciousness inspired McKenna to closely study the King Wen sequence of the I Ching in the years that followed.

The theory was first formally published in the 1975 book *The Invisible Landscape: Mind, Hallucinogens, and the I Ching*, co-authored by Terence and Dennis McKenna. A substantially revised second edition appeared in 1993 (HarperCollins), which for the first time named December 21, 2012 as the specific zero date.

### Core Claims

Novelty Theory proposes that:

1. **Time is not a neutral container** but has qualitative properties. It flows between two poles: "novelty" (increased connectivity, complexity, and ingression of new forms) and "habit" (the preservation of existing patterns and resistance to change).

2. **The universe is an engine for the production and conservation of novelty.** As the universe ages, novelty increases, complexity increases, and the density of causal connectivity rises.

3. **This process is fractal and self-similar.** Patterns of novelty and habit repeat at multiple scales of time, from minutes to billions of years, in a self-similar (though not identical) way.

4. **The process has a terminal endpoint: an "Eschaton" or "concrescence."** McKenna predicted that novelty would reach a theoretical maximum — an infinite "density of connectedness" — at a specific point in time, which he eventually fixed at December 21, 2012 (the end of the 13th b'ak'tun of the Maya Long Count calendar).

5. **This endpoint is the "Transcendental Object at the End of Time."** McKenna described it as a strange attractor pulling history forward, an event horizon where all possibilities converge.

### Philosophical Basis

The theory draws heavily from several sources:

- **Alfred North Whitehead's Process Philosophy**: McKenna explicitly grounded his ontology in Whitehead's "organismic philosophy." Whitehead's concept of "concrescence" (the process by which actual entities achieve definiteness by integrating possibilities) is central. McKenna took Whitehead's phrase "the formality of actually occurring" as a key touchstone. The key inversion from Newtonian mechanics: the universe is "drawn from the future" rather than "pushed from behind."

- **Teilhard de Chardin's Omega Point**: The Jesuit philosopher's concept of a final telos that attracts evolution toward ultimate convergence directly parallels McKenna's eschaton. McKenna described his concrescence as a "shock wave of eschatology" backwashing through time.

- **The I Ching**: McKenna treated the I Ching not merely as a divination text but as an ancient model of time's qualitative structure. He believed the King Wen sequence encoded a map of temporal flux.

- **Traditional eschatologies**: McKenna synthesized the theory with Christ's Second Coming, the Hindu Kalki avatar, and Norse Ragnarokkr, arguing that the same attractor was sensed cross-culturally.

McKenna stated: "What is happening to our world is ingression of novelty toward what Whitehead called 'concrescence', a tightening gyre."

## 2. The I Ching Connection: How McKenna Derived the Timewave

### The King Wen Sequence

The King Wen sequence (also called the "received" or "classical" sequence) is the standard arrangement of the 64 hexagrams in the I Ching, attributed to King Wen of Zhou (c. 1100 BCE). Each hexagram is composed of six lines, each either broken (yin) or unbroken (yang), giving 2^6 = 64 possible figures.

The 64 hexagrams are arranged in 32 pairs. For 28 pairs, the second hexagram is obtained by rotating the first 180 degrees (inverting it). For the remaining 8 pairs (the 8 "palindrome" hexagrams that are identical when inverted — like hexagrams 1 and 2, the pure yin and pure yang), the pair partner is obtained by complementing every line (turning all yang into yin and vice versa).

### The First Order of Difference (FOD)

McKenna's mathematical entry point was the **First Order of Difference (FOD)**: counting how many lines change as you move from one hexagram to the next in the King Wen sequence, proceeding from hexagram 1 through hexagram 64. Since each hexagram has 6 lines and each line is either yin or yang, the number of differing lines between any two consecutive hexagrams is always an integer from 1 to 6.

This generates a sequence of 64 numbers (one for each transition, treating the sequence as cyclic — from hexagram 64 back to hexagram 1).

### Statistical Properties McKenna Claimed Were Unique

McKenna analyzed this FOD sequence and claimed several non-random properties:

1. **3:1 ratio of even to odd transitions**: Of the 64 transitions, exactly 48 are even-valued changes and 16 are odd-valued changes — a precise 3-to-1 ratio.

2. **No transitions of value 5**: No consecutive hexagram pair in the King Wen sequence differs by exactly 5 lines.

3. **Closure property**: The sequence, when "rotated 180 degrees within the plane and superimposed upon itself," achieves closure — that is, the forward-running sequence and its reverse are complementary.

4. **Odd transitions only between pairs**: All instances of an odd FOD (1 or 3) occur at transitions between hexagram pairs (i.e., from the second hexagram of one pair to the first of the next). Within-pair transitions are always even.

To test the uniqueness of these properties, McKenna ran computer simulations generating over 27,000 random hexagram sequences. Of these, only 4 were found to share all three properties (3:1 ratio, no fives, closure). McKenna took this extreme rarity as evidence that the King Wen sequence was intentionally constructed to encode a specific mathematical property.

### From 64 FOD Values to 384 Numbers

1. The sequence of 64 hexagrams can be treated as cyclic, with the 64 transitions forming a closed ring.
2. The FOD sequence is then **doubled**: the forward sequence is appended to its reverse, creating a sequence of 128 values.
3. This 128-value sequence then undergoes further transformations involving the **half-twist**, multiplication, and hierarchical overlaying.
4. The final result is a sequence of **384 numbers** ranging in value from 0 to 79. The number 384 = 6 × 64 corresponds to the total line count of all 64 hexagrams.
5. The original computation was performed in 1974 by **Royce Kelley and Leon Taylor**, recruited by McKenna and working at UC Berkeley on a CDC 6400 mainframe using FORTRAN. These became the **Kelley number set**.

## 3. The Algorithm: Timewave Zero Mathematics

### The Wave Function

The timewave function **w(x)** is defined as a doubly-infinite series:

```
w(x) = sum over all integers i of: v(x / 64^i) * 64^i
```

Where:
- **x** is days prior to the zero point
- **64** is the wave factor (corresponding to the 64 hexagrams)
- **v(x)** is the base function derived from the 384 numbers, with linear interpolation between integer values

This construction creates a function self-similar at multiple scales.

### Temporal Scales and Resonance

The wave factor of 64 creates a hierarchy of temporal cycles:

- **384 days** (fundamental period)
- **~67.29 years** (384 × 64)
- **~4,306 years** (384 × 64²)
- **~275,000 years** (384 × 64³)
- **~17.6 million years** (384 × 64⁴)
- **~1.125 billion years** (384 × 64⁵)

Any two periods separated by a factor of exactly 64 are "in resonance" — the same shape of novelty curve applies at different scales.

### The Half-Twist

A crucial and contested step is the **"half-twist"**: a manipulation of the sign of approximately half the values in the intermediate construction. The source code contained only this comment: *"This is the mysterious 'half twist'. The reason for this is not well understood at present and is a question which awaits further research."*

## 4. Software Implementations

- **1974 — Berkeley FORTRAN**: Royce Kelley and Leon Taylor on a CDC 6400 mainframe.
- **1978–79 — Apple II+ (Peter Broadwell)**: First graphical display, written in Applesoft BASIC.
- **1987 — First Peter Meyer version**: Formalized mathematical treatment.
- **1989 — MS-DOS C version**: First to extend calculation back 4.5 billion years.
- **1997–98 — Fractal Time Software**: Introduced multiple number sets (Watkins, Sheliak, Huang Ti, Kelley).
- **Modern**: [Timewave Explorer](https://twz-doc.noonian.io/) (web-based); open-source implementations on GitHub.

## 5. Reception and Criticism

### Scientific Classification

Novelty Theory is classified as **pseudoscience**. Never published in a peer-reviewed journal.

### The Date-Fixing Problem

1. The date was not predicted; it was selected. McKenna anchored the final 67.29-year cycle to the Hiroshima bombing (August 6, 1945), which yields mid-November 2012 — not December 21.
2. The date was adjusted post-hoc to match the Maya Long Count calendar end-date, which McKenna learned about from the 4th edition of Morley's *The Ancient Maya* (published 1983).
3. Prior to 1990, McKenna had consistently stated the zero date was December 22, not December 21.
4. The formal mathematics does not imply any particular zero date — any anchor produces different historical correspondences.

### Empirical Failure

December 21, 2012 passed without the predicted singularity occurring.

### McKenna's Own Skepticism

McKenna expressed private skepticism about his own theory. When directly asked whether he believed the apocalypse would occur on December 21, 2012, he answered "No." He described himself as a "visionary fool" and characterised the theory as "a weak case, because history is not a mathematically defined entity." He stated that his function was "largely pedagogical" and that he delivered ideas "with a wink."

## 6. John Sheliak's Version ("Timewave One")

John Sheliak used vector algebra to formally delineate each step in the construction, independently confirming the Watkins finding of a procedural error, then correcting it. McKenna called this "Timewave One" and announced it as "Novelty Theory Bombshell!" in November 1997. However, Peter Meyer regarded Sheliak's construction as unfounded and erroneous, arguing it departed from the original I Ching-based methodology.

## 7. The Watkins Objection

In 1994, British mathematician **Matthew Watkins** published a rigorous critique ([fourmilab.ch](https://www.fourmilab.ch/rpkp/autopsy.html)) that McKenna named "The Watkins Objection."

### Core Problems

1. **The half-twist lacks justification.** McKenna admitted he could not remember why it was added 20 years earlier.
2. **The half-twist does the opposite of what McKenna claimed.** Watkins demonstrated it actually *prevents* rather than preserves the property McKenna referenced.
3. **The wave is not truly fractal.** It is "a complex piecewise linear progression" — self-similar only at discrete scales (powers of 64), but composed of straight line segments at fine resolution.
4. **The mathematical procedure is arbitrary throughout**, with no justification given for many steps.

### Conclusion

Watkins concluded the "timewave cannot be taken to be what McKenna claims it is." Peter Meyer acknowledged the force of the objection but argued it was "not fatal," since removing the half-twist produces the Watkins number set, which generates a wave that is "quite similar, though not identical."

## 8. The Fractal Claim

The wave is **weakly self-similar** (same shape at scales differing by powers of 64) but **not a mathematical fractal** in the strict sense. True fractals exhibit infinite detail at all scales. The timewave, being composed of piecewise linear functions, resolves into straight line segments at fine enough scales. The claim of being a "genuine fractal" is an overstatement.

## 9. Post-McKenna Work

McKenna died April 3, 2000. Peter Meyer continued developing the mathematics at [fractal-timewave.com](https://www.fractal-timewave.com/). Post-2012, various practitioners proposed alternative zero dates anchored to different events (September 11 attacks, Nixon's gold decoupling, etc.) — none attracting scholarly attention.

## 10. The I Ching Mathematics: King Wen Sequence Properties

The King Wen sequence should be distinguished from the **Shao Yong / Fu Xi binary sequence** (the one Leibniz recognised as a precursor to binary arithmetic). McKenna worked with the King Wen sequence specifically.

**FOD properties confirmed:**
- 32 within-pair transitions, all even
- 48 even transitions, 16 odd = 3:1 ratio
- No transition of value 5 anywhere
- All odd transitions occur exclusively at between-pair boundaries
- McKenna's simulation of 27,000+ random sequences found only 4 with all three properties

**Richard S. Cook's 2006 work** represents the most rigorous modern mathematical analysis, classifying hexagrams into 36 hexagram equivalency classes (HECs) using "n-gram science."

## Summary of the Four Number Sets

| Set | Year | Origin | Notes |
|-----|------|--------|-------|
| **Kelley** | 1974 | UC Berkeley FORTRAN | Original; includes the half-twist |
| **Watkins** | 1994 | Peter Meyer | Kelley minus the half-twist |
| **Sheliak** | 1997 | John Sheliak, vector algebra | Corrects procedural error; Meyer disputes its validity |
| **Huang Ti** | 1997 | Unknown | "No relation to Kelley and Watkins sets" (Meyer) |

---

## Key Sources

- [The Watkins Objection (fourmilab.ch)](https://www.fourmilab.ch/rpkp/autopsy.html)
- [fractal-timewave.com](https://www.fractal-timewave.com/) — Peter Meyer's complete archive
- [The Mathematics of Timewave Zero (Academia.edu)](https://www.academia.edu/34005943/The_Mathematics_of_Timewave_Zero)
- [Grand Theories, Feeble Foundations (Academia.edu)](https://www.academia.edu/33984468/Grand_Theories_Feeble_Foundations_on_Terence_McKennas_Timewave_Theory_)
- [Timewave Explorer](https://twz-doc.noonian.io/) — modern web implementation
- [Time Wave Zero — Internet Archive](https://archive.org/details/twz_20200405) — Peter Meyer's original software
- [Novelty Theory Bombshell! (levity.com)](http://www.levity.com/eschaton/bombshell.html) — McKenna on Sheliak
- [John Sheliak TWZ Formalization (Scribd)](https://www.scribd.com/document/36168974/John-Sheliak-TWZ-Formalization)
