# The Shao Yong / Fu Xi Binary Sequence and Leibniz

## Two Distinct Hexagram Arrangements

The I Ching has two completely different orderings of the 64 hexagrams that are often confused:

1. **King Wen sequence** — the "received" classical arrangement (~1100 BCE), the one McKenna worked with for Timewave Zero. Organised in 32 oppositional pairs. Its internal structure is non-trivial and contested (see HISTORY.md).

2. **Shao Yong / Fu Xi sequence** — a Song dynasty arrangement attributed to the legendary sage Fu Xi but actually systematised by the philosopher **Shao Yong** (邵雍, 1011–1077 CE). This is the one Leibniz encountered and the one that looks like binary arithmetic.

## The Shao Yong Arrangement: What It Is

Shao Yong produced two famous diagrams:

- **Xiantian tu** (先天圖, "Before Heaven" diagram) — a circular arrangement of all 64 hexagrams
- **Fu Xi liushisi gua fangwei tu** (伏羲六十四卦方位圖) — a square grid version

In both, the hexagrams are arranged by treating broken lines as 0 and unbroken lines as 1, reading from the bottom line upward. Reading the hexagrams in the circular Xiantian diagram from right to left across the bottom half gives the sequence 0, 1, 2, 3, 4... in straight binary (with bottom line as least significant bit). The full 64-hexagram arrangement is a complete enumeration of all 6-bit binary strings, ordered by value.

Shao Yong did not describe this in arithmetical terms. For him it was a cosmological diagram showing the generative unfolding of the universe from pure yang (☰, hexagram 1 = 111111 = 63) through every combination to pure yin (☷, hexagram 2 = 000000 = 0). It expressed a metaphysics of differentiation: from unity, the two modes (yin/yang), then four images, eight trigrams, sixty-four hexagrams — a doubling sequence Shao Yong called the "before heaven" order.

## The Leibniz Connection

Gottfried Wilhelm Leibniz independently invented binary arithmetic around **1679**, using 0 and 1. He was interested in it for multiple reasons: a universal language of thought, a proof of creation ex nihilo (1 = God, 0 = void), and mechanical computation.

For over two decades it remained a private curiosity. Then came the Jesuit connection.

**Joachim Bouvet** (白晋, 1656–1730) was a French Jesuit missionary in Beijing at the court of the Kangxi Emperor. Bouvet had been studying Shao Yong's Xiantian diagram and began corresponding with Leibniz in 1697. On **4 November 1701**, Bouvet wrote to Leibniz enclosing a copy of the Fu Xi/Shao Yong diagrams — including the 64-hexagram square.

Leibniz did not receive this letter until **1 April 1703**.

On **7 April 1703** — six days later — he sent a revised version of his binary arithmetic paper to the secretary of the Académie royale des sciences. On **5 May 1703**, his only published paper on binary arithmetic appeared:

> "Explication de l'Arithmétique binaire, qui se sert des seuls caractères 0 & 1, avec des remarques sur son utilité, et sur ce qu'elle donne le sens des anciennes figures Chinoises de Fohy"
> (*Explanation of Binary Arithmetic, which uses only the characters 0 and 1, with remarks on its usefulness, and on the light it throws on the ancient Chinese figures of Fu Xi*)

In the paper, Leibniz explicitly compared his binary system to the Fu Xi hexagram arrangement and declared them equivalent. He interpreted the Chinese diagrams as confirmation that his arithmetic had been independently discovered thousands of years earlier — what he called a sign of a deep universal truth.

## The Scholarly Debate: Influence or Coincidence?

Three positions have been argued:

**1. Pure coincidence / independent discovery**
Leibniz had completed binary arithmetic ~24 years before seeing Bouvet's letter. The chronology rules out any generative influence. Modern scholarship largely confirms this: Leibniz invented binary on his own.

**2. The letter triggered publication (not invention)**
The dominant view now: Bouvet's diagram did not create binary arithmetic in Leibniz's mind, but it did motivate him to publish. Without the Chinese connection, the paper might never have appeared in 1703. The Fu Xi diagram gave him a rhetorical and philosophical frame — ancient wisdom confirming modern mathematics.

**3. Shao Yong's diagram is not truly binary**
A 2020 paper in *Science in Context* (Cambridge) asks whether the Fu Xi diagram is actually binary. The answer: it generates a binary-like structure but Shao Yong never framed it as arithmetic. He had no concept of positional notation or zero. The analogy is real but the interpretation (that the Chinese "knew" binary) is a Leibniz projection, later enthusiastically adopted by sinologists.

## History of Mathematical Treatments

| Period | Who | What |
|--------|-----|-------|
| ~1679 | Leibniz | Invents binary arithmetic independently |
| 1703 | Leibniz | Publishes *Explication*, draws analogy with Fu Xi diagram |
| 1900s | Various sinologists | Debate whether Shao Yong "anticipated" binary; generally uncritical |
| 1973 | Schroeder, others | Note that the Fu Xi sequence is equivalent to counting in binary from 0 to 63 |
| 1986 | Various | Connection to Gray code formalised: a circular/reflected binary code where adjacent entries differ in exactly one bit — a better description of some arrangements than straight binary |
| 2003 | Ryan (*Stuart Journal of East Asian Studies*) | Careful analysis: Leibniz's analogy is philosophically significant but mathematically imprecise; he misread which lines correspond to which digits |
| 2010s | Computer scientists | Fu Xi sequence used in pedagogy to demonstrate binary enumeration; Gray code version appears in some formulations |
| 2020 | Ngo Thi Lan (*Science in Context*) | Rigorous argument that calling Shao Yong's diagram "binary" conflates a structural isomorphism with an intentional numerical system |

## The Gray Code Point

The most mathematically interesting modern observation is that the circular Fu Xi arrangement is a **Gray code** — a sequence of binary strings where consecutive entries differ by exactly one bit. This means: moving one step around the Fu Xi circle changes exactly one line of the hexagram. This property has real uses in error-correcting codes and digital circuit design.

The King Wen sequence is explicitly not a Gray code. Its transitions vary wildly (FOD values of 1–6). McKenna's FOD analysis only makes sense against the King Wen backdrop — if he had worked with the Fu Xi/binary sequence, the FOD would always equal 1 and there would be nothing to analyse.

## The Deeper Contrast

| | Fu Xi / Shao Yong | King Wen |
|-|-----------------|----------|
| Order principle | Binary enumeration (cosmological unfolding) | Paired opposites, narrative logic |
| Mathematical property | Perfect binary counting / Gray code | FOD ratio 3:1, no-fives, closure |
| Historical attribution | Legendary Fu Xi; systematised by Shao Yong ~1050 CE | Attributed to King Wen ~1100 BCE |
| Leibniz connection | Yes — direct analogy to binary arithmetic | No |
| McKenna connection | Incidental mention only | Central — entire Timewave derives from it |

The irony McKenna noted: the sequence Leibniz recognised as binary is not the sequence McKenna found interesting. The two arrangements encode completely different things. Shao Yong's order is cosmologically tidy — a perfect unfolding. King Wen's order is cosmologically meaningful — a structured narrative with the statistical anomalies McKenna obsessed over.

## Key Sources

- [Leibniz Binary Arithmetic Development vs. Xiantiantu (ResearchGate)](https://www.researchgate.net/publication/361177486_THE_DEVELOPMENT_OF_BINARY_ARITHMETIC_BY_LEIBNIZ_INFLUENCE_OR_INDEPENDENCE_REGARDING_THE_XIANTIANTU_OF_SHAO_YONG)
- [Is the Fu Xi diagram truly binary? — Cambridge Science in Context](https://www.cambridge.org/core/journals/science-in-context/article/abs/is-the-Fuxi-liushisi-gua-fangwei-diagram-attributed-to-shao-yong-binary-clarifying-a-consequence-of-its-analogy-with-the-binary-arithmetic-of-leibniz/9BA1DB9CFF13D5BEADCAF8FF954108AC)
- [James A. Ryan — Leibniz's Binary System and Shao Yong's Yijing (PhilPapers)](https://philpapers.org/rec/RYALBS)
- [Yijing Dao — Shao Yong square, Xiantian diagram, sequences](https://www.biroco.com/yijing/sequence.htm)
- [Binary Arithmetic: From Leibniz to von Neumann (PDF)](https://houseoftao.org/wp-content/uploads/2022/02/from-leibniz-to-von-neumann.pdf)
