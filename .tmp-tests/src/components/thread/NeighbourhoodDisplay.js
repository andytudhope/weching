"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeighbourhoodDisplay = NeighbourhoodDisplay;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const kingwen_1 = require("@/lib/kingwen");
const hexagrams_1 = require("@/lib/hexagrams");
const operators_1 = require("@/lib/operators");
// ——— Sub-components ———
function MiniHex({ lines }) {
    return ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-col-reverse gap-[3px]", children: lines.map((isYang, i) => ((0, jsx_runtime_1.jsx)("div", { className: "flex gap-[2px] w-10", children: isYang ? ((0, jsx_runtime_1.jsx)("div", { className: "h-[3px] flex-1 rounded-full bg-primary" })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "h-[3px] flex-1 rounded-full bg-primary" }), (0, jsx_runtime_1.jsx)("div", { className: "h-[3px] flex-1 rounded-full bg-primary" })] })) }, i))) }));
}
// 6 dots arranged bottom-to-top showing which lines change in a transition.
// Amber = lower trigram (inner world), blue = upper trigram (outer world).
// Filled = changes, hollow = stable.
function OperatorColumn({ operator }) {
    return ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-col-reverse gap-1.5 items-center", children: operator.map((changes, i) => {
            const isUpper = i >= 3;
            return ((0, jsx_runtime_1.jsx)("div", { title: `Line ${i + 1}: ${changes ? "changes" : "stable"} (${isUpper ? "upper / outer" : "lower / inner"})`, className: `w-2.5 h-2.5 rounded-full border ${changes
                    ? isUpper
                        ? "bg-sky-400 border-sky-500"
                        : "bg-amber-400 border-amber-500"
                    : "border-muted-foreground/30 bg-transparent"}` }, i));
        }) }));
}
// Arc showing progress through the 384-day cycle
function CycleArc({ cyclePosition }) {
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
    return ((0, jsx_runtime_1.jsxs)("svg", { viewBox: "0 0 100 100", className: "w-20 h-20", children: [(0, jsx_runtime_1.jsx)("circle", { cx: cx, cy: cy, r: r, fill: "none", stroke: "hsl(42 40% 88%)", strokeWidth: "6" }), (0, jsx_runtime_1.jsx)("path", { d: arcPath, fill: "none", stroke: "hsl(35 40% 25%)", strokeWidth: "6", strokeLinecap: "round" }), (0, jsx_runtime_1.jsx)("circle", { cx: endX, cy: endY, r: "4", fill: "hsl(40 80% 60%)" }), (0, jsx_runtime_1.jsx)("text", { x: cx, y: cy - 3, textAnchor: "middle", fontSize: "12", fill: "hsl(35 40% 25%)", fontFamily: "Georgia, serif", fontWeight: "bold", children: cyclePosition }), (0, jsx_runtime_1.jsx)("text", { x: cx, y: cy + 10, textAnchor: "middle", fontSize: "7", fill: "hsl(30 8% 45%)", fontFamily: "Georgia, serif", children: "of 384" })] }));
}
// The 5 pairs centred on the current pair, shown as a mini journey strip
function SequenceStrip({ pairIndex }) {
    const offsets = [-2, -1, 0, 1, 2];
    return ((0, jsx_runtime_1.jsx)("div", { className: "flex gap-1.5 items-end justify-center", children: offsets.map((offset) => {
            const idx = ((pairIndex + offset + 64) % 64);
            const fromNum = kingwen_1.KING_WEN_SEQUENCE[idx];
            const toNum = kingwen_1.KING_WEN_SEQUENCE[(idx + 1) % 64];
            const fod = kingwen_1.KING_WEN_FOD[idx];
            const fromLines = (0, hexagrams_1.hexagramNumberToLines)(fromNum);
            const toLines = (0, hexagrams_1.hexagramNumberToLines)(toNum);
            const op = (0, operators_1.xorHexagrams)(fromLines, toLines);
            const tc = (0, operators_1.trigramCharacter)(op);
            const isCurrent = offset === 0;
            const colorMap = {
                lower: isCurrent ? "bg-amber-400" : "bg-amber-200",
                upper: isCurrent ? "bg-sky-400" : "bg-sky-200",
                both: isCurrent ? "bg-violet-400" : "bg-violet-200",
                none: isCurrent ? "bg-stone-400" : "bg-stone-200",
            };
            const heightPx = Math.round((fod / 6) * 40);
            return ((0, jsx_runtime_1.jsxs)("div", { className: `flex flex-col items-center gap-1 ${isCurrent ? "" : "opacity-60"}`, children: [(0, jsx_runtime_1.jsx)("div", { className: `w-7 rounded-t-sm ${colorMap[tc]} ${isCurrent ? "ring-1 ring-primary/40" : ""}`, style: { height: `${heightPx}px` } }), (0, jsx_runtime_1.jsxs)("p", { className: `text-[9px] font-mono leading-none ${isCurrent ? "text-primary font-bold" : "text-muted-foreground"}`, children: [fromNum, "\u2192", toNum] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-[9px] font-serif text-muted-foreground leading-none", children: ["w=", fod] })] }, idx));
        }) }));
}
function NeighbourhoodDisplay({ today }) {
    const [expanded, setExpanded] = (0, react_1.useState)(false);
    const texture = (0, react_1.useMemo)(() => (0, kingwen_1.getTemporalTexture)(today), [today]);
    const neighbourhood = (0, react_1.useMemo)(() => (0, kingwen_1.getNeighbourhood)(today, 14), [today]);
    const prose = (0, react_1.useMemo)(() => (0, kingwen_1.describeNeighbourhood)(neighbourhood), [neighbourhood]);
    const fromNum = kingwen_1.KING_WEN_SEQUENCE[texture.hexagramPairIndex];
    const toNum = kingwen_1.KING_WEN_SEQUENCE[(texture.hexagramPairIndex + 1) % 64];
    const fromLines = (0, react_1.useMemo)(() => (0, hexagrams_1.hexagramNumberToLines)(fromNum), [fromNum]);
    const toLines = (0, react_1.useMemo)(() => (0, hexagrams_1.hexagramNumberToLines)(toNum), [toNum]);
    const operator = (0, react_1.useMemo)(() => (0, operators_1.xorHexagrams)(fromLines, toLines), [fromLines, toLines]);
    const fromInfo = (0, react_1.useMemo)(() => (0, hexagrams_1.getHexagramInfo)(fromLines), [fromLines]);
    const toInfo = (0, react_1.useMemo)(() => (0, hexagrams_1.getHexagramInfo)(toLines), [toLines]);
    const fod = texture.fodValue;
    const trigramDesc = {
        lower: "inner world (lower trigram)",
        upper: "outer world (upper trigram)",
        both: "inner and outer worlds",
        none: "neither trigram directly",
    };
    const operatorDesc = {
        identity: "unchanging",
        surgical: "precise single-line pivot",
        moderate: "moderate shift",
        substantial: "substantial transformation",
        total: "complete inversion",
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-2xl border border-border bg-gradient-subtle shadow-soft overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "px-5 pt-5 pb-2 text-center", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-serif font-semibold text-primary text-sm uppercase tracking-widest", children: "the neighbourhood of now" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs font-serif text-muted-foreground mt-1", children: "where you stand in the King Wen cycle today and how it informs resonant enquiries" })] }), (0, jsx_runtime_1.jsx)("div", { className: "px-5 py-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center gap-6 flex-wrap", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center gap-1", children: [(0, jsx_runtime_1.jsx)(CycleArc, { cyclePosition: texture.cyclePosition }), (0, jsx_runtime_1.jsxs)("p", { className: "text-[10px] font-serif text-muted-foreground text-center leading-snug", children: ["day in the", (0, jsx_runtime_1.jsx)("br", {}), "384-day cycle"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center gap-2", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[10px] font-serif text-muted-foreground uppercase tracking-wide", children: "active pair" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center gap-1", children: [(0, jsx_runtime_1.jsx)(MiniHex, { lines: fromLines }), (0, jsx_runtime_1.jsx)("p", { className: "text-[10px] font-mono text-primary", children: fromNum })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center gap-0.5", children: [(0, jsx_runtime_1.jsx)(OperatorColumn, { operator: operator }), (0, jsx_runtime_1.jsxs)("p", { className: "text-[9px] font-serif text-muted-foreground mt-0.5", children: ["w=", fod] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center gap-1", children: [(0, jsx_runtime_1.jsx)(MiniHex, { lines: toLines }), (0, jsx_runtime_1.jsx)("p", { className: "text-[10px] font-mono text-primary", children: toNum })] })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-[11px] font-serif text-foreground/70 text-center max-w-[200px] leading-snug", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-primary font-medium", children: fromInfo.name }), " → ", (0, jsx_runtime_1.jsx)("span", { className: "text-primary font-medium", children: toInfo.name })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-[10px] font-serif text-muted-foreground text-center", children: [fod, " line", fod !== 1 ? "s" : "", " change \u00B7 ", operatorDesc[texture.operatorClass], " · ", trigramDesc[texture.trigramCharacter]] })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "px-5 pb-3", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[9px] font-serif text-muted-foreground text-center mb-1.5 uppercase tracking-wide", children: "path through the sequence (5 pairs)" }), (0, jsx_runtime_1.jsx)(SequenceStrip, { pairIndex: texture.hexagramPairIndex }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-center gap-4 mt-1.5 text-[9px] font-serif text-muted-foreground", children: [(0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "w-2 h-2 rounded-sm bg-amber-300 inline-block" }), " inner"] }), (0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "w-2 h-2 rounded-sm bg-sky-300 inline-block" }), " outer"] }), (0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "w-2 h-2 rounded-sm bg-violet-300 inline-block" }), " both"] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "px-5 pb-4", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm font-serif text-foreground/70 leading-relaxed text-center", children: prose }) }), (0, jsx_runtime_1.jsxs)("div", { className: "border-t border-border/40", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => setExpanded(!expanded), className: "w-full px-5 py-3 text-xs font-serif text-muted-foreground hover:text-foreground transition-colors flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "What is this? \u2014 hexagram space, the King Wen path, and why these numbers" }), (0, jsx_runtime_1.jsx)("span", { className: "shrink-0 ml-2", children: expanded ? "▲" : "▼" })] }), expanded && ((0, jsx_runtime_1.jsxs)("div", { className: "px-5 pb-6 space-y-4 text-xs font-serif text-foreground/70 leading-relaxed border-t border-border/20", children: [(0, jsx_runtime_1.jsxs)("p", { className: "pt-3", children: [(0, jsx_runtime_1.jsx)("strong", { className: "text-primary", children: "Hexagram space." }), " ", "Each hexagram is a point in a 6-dimensional binary space \u2014 a hypercube of 64 vertices, one per combination of six yin/yang lines. The distance between any two hexagrams is their Hamming distance: how many lines differ. Crucially, every hexagram is simultaneously a ", (0, jsx_runtime_1.jsx)("em", { children: "state" }), " (where you are in the space) and an ", (0, jsx_runtime_1.jsx)("em", { children: "operator" }), " (a transformation that can move any state to another, via bitwise XOR). The coloured dots above show exactly which lines the current transition changes:", " ", (0, jsx_runtime_1.jsx)("span", { className: "text-amber-600 font-medium", children: "amber = lower trigram (lines 1\u20133)" }), ",", " ", (0, jsx_runtime_1.jsx)("span", { className: "text-sky-600 font-medium", children: "blue = upper trigram (lines 4\u20136)" }), "."] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { className: "text-primary", children: "Lower and upper trigrams." }), " ", "Each hexagram is composed of two trigrams of three lines. The lower trigram (lines 1\u20133) is traditionally the inner world \u2014 your own state, what arises from within. The upper (lines 4\u20136) is the outer world \u2014 circumstances, environment, what comes from outside. When today's transition moves only in the lower trigram, inner conditions are in motion while the outer situation holds. When only the upper, the outer is in flux. When both, the shift is comprehensive. The prose description above tells you which it is today."] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { className: "text-primary", children: "The King Wen sequence." }), " ", "The I Ching's traditional arrangement of 64 hexagrams \u2014 attributed to King Wen \u2014 traces a specific path through this hypercube, visiting each vertex exactly once (a Hamiltonian path). The First Order of Difference (FOD) at each step is the number of lines that change. ", (0, kingwen_1.getFodDistributionSummary)()] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { className: "text-primary", children: "Why 384 days." }), " ", "There are 64 transitions in the King Wen sequence. Assigning 6 days to each \u2014 resonant with the hexagram having 6 lines \u2014 gives 64 \u00D7 6 = 384 days per full cycle. This is not a solar year (~365 days), so the cycle drifts through the seasons: it is its own rhythm, independent of the sun. The bar heights in the sequence strip above show the FOD (1 = short, 6 = tall) for each nearby pair; the colours show which trigram is active."] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { className: "text-primary", children: "Why January 1, 1970." }), " ", "The Unix epoch \u2014 midnight January 1, 1970 UTC \u2014 is the foundational time standard of digital systems worldwide. Since this reading is conducted in digital media, anchoring the cycle to the Unix epoch is coherent, transparent, and honest about its arbitrariness. It is not an eschatological date, not a countdown to anything, not predictive. The cycle repeats indefinitely. Its purpose is not to tell you what will happen, but to describe the structural quality of the transitions that characterize this moment in the sequence."] }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground italic", children: "This display is descriptive, not prescriptive. It offers a lens on the character of now, not a prescription for what to ask or how to act." })] }))] })] }));
}
