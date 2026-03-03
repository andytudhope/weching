"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadAnalysis = ThreadAnalysis;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const separator_1 = require("@/components/ui/separator");
const HexagramDisplay_1 = require("@/components/HexagramDisplay");
const operators_1 = require("@/lib/operators");
const kingwen_1 = require("@/lib/kingwen");
const hexagrams_1 = require("@/lib/hexagrams");
// ——— Inquiry reflection prompts ———
// These are structural invitations, not interpretations. They use the geometry
// of the operator to frame a question the reader can apply to their own inquiry.
function inquiryPrompt(w, changedLines, fromName, toName) {
    switch (w) {
        case 1: {
            const lineNum = changedLines[0];
            const meaning = operators_1.LINE_POSITION_MEANINGS[lineNum] ?? "";
            const brief = meaning.split("—")[1]?.trim() ?? meaning;
            return `One line moves: line ${lineNum}. ${brief} In your inquiry — what is the singular pivot? The one thing that, shifted, produces this new configuration?`;
        }
        case 2: {
            const [a, b] = changedLines;
            const aInner = a <= 3, bInner = b <= 3;
            const both = aInner !== bInner
                ? "one line in the inner trigram and one in the outer"
                : aInner
                    ? "both lines in the inner trigram (your own state)"
                    : "both lines in the outer trigram (the outer situation)";
            return `Two lines move — ${both}. In your inquiry, what pair of conditions shifts together? What moves as a unit?`;
        }
        case 3:
            return `Half the structure changes. Three lines move — the threshold between continuity and transformation. In your inquiry, what holds constant even as much of the context shifts?`;
        case 4:
            return `Four lines move — more than half the structure changes, yet two lines hold. In your inquiry, what persists? What is the stable core around which transformation happens?`;
        case 5:
            return `Five lines move — this operator never appears in the King Wen sequence. You have arrived at a structurally singular moment. What, in your inquiry, is the one thing that could not change?`;
        case 6:
            return `All six lines invert: ${fromName} becomes its complement, ${toName}. Not a shift within the situation — a reversal of the situation's polarity. In your inquiry, what has become its opposite?`;
        default:
            return "";
    }
}
function OperatorCard({ transition, readings, fromIndex, toIndex }) {
    const fromReading = readings[fromIndex];
    const toReading = readings[toIndex];
    const fromInfo = (0, hexagrams_1.getHexagramInfo)(fromReading.lines);
    const toInfo = (0, hexagrams_1.getHexagramInfo)(toReading.lines);
    const changedLines = (0, operators_1.changedLinePositions)(transition.operator);
    const w = transition.hammingWeight;
    const prompt = inquiryPrompt(w, changedLines, fromInfo.name, toInfo.name);
    // Use the destination reading's inquiry as the primary reference —
    // that's the question the person was holding when they arrived at the new hexagram.
    const inquiry = toReading.inquiry ?? fromReading.inquiry;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-meditation-glow rounded-lg p-4 space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-baseline justify-between gap-2", children: [(0, jsx_runtime_1.jsxs)("p", { className: "font-serif text-xs text-muted-foreground uppercase tracking-wide", children: ["operator: reading ", fromIndex + 1, " \u2192 ", toIndex + 1] }), (0, jsx_runtime_1.jsxs)("p", { className: "font-serif text-xs text-muted-foreground", children: [fromInfo.number, " \u2192 ", toInfo.number] })] }), (0, jsx_runtime_1.jsx)("p", { className: "font-mono text-sm text-primary tracking-widest", children: transition.operator.map((b) => (b ? "▲" : "▽")).join(" ") }), (0, jsx_runtime_1.jsx)("p", { className: "font-serif text-sm text-foreground/80", children: (0, operators_1.describeTransition)(transition, readings) }), (0, jsx_runtime_1.jsxs)("div", { className: "border-t border-border/30 pt-2 space-y-2", children: [(0, jsx_runtime_1.jsxs)("p", { className: "font-serif text-xs text-foreground/60 leading-relaxed", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-primary font-medium", children: "In the King Wen sequence: " }), (0, kingwen_1.fodRarityNote)(w)] }), w <= 3 && changedLines.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-serif text-xs text-muted-foreground uppercase tracking-wide", children: w === 1 ? "the line that moves" : "lines that move" }), changedLines.map((lineNum) => ((0, jsx_runtime_1.jsx)("p", { className: "font-serif text-xs text-foreground/70 leading-relaxed", children: operators_1.LINE_POSITION_MEANINGS[lineNum] }, lineNum)))] })), prompt && ((0, jsx_runtime_1.jsxs)("div", { className: "border-t border-border/20 pt-2", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-serif text-xs text-muted-foreground uppercase tracking-wide mb-1", children: "structural reflection" }), (0, jsx_runtime_1.jsx)("p", { className: "font-serif text-xs text-foreground/70 leading-relaxed italic", children: prompt }), inquiry && ((0, jsx_runtime_1.jsxs)("p", { className: "font-serif text-xs text-primary/70 mt-1.5 leading-relaxed", children: ["Your inquiry: \u201C", inquiry, "\u201D"] }))] }))] })] }));
}
function ThreadAnalysis({ readings, onNext, onBack }) {
    const analysis = (0, react_1.useMemo)(() => (0, operators_1.analyzeThread)(readings), [readings]);
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen flex flex-col pt-4", children: (0, jsx_runtime_1.jsx)("div", { className: "flex-1 px-4 py-12", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-3xl mx-auto space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center space-y-2", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-serif font-bold text-primary", children: "the path through hexagram space" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm font-serif text-muted-foreground", children: [readings.length, " readings \u00B7 ", analysis.transitions.length, " transitions"] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "bg-card border-border shadow-soft", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "font-serif text-primary text-lg", children: "Timeline" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "space-y-6", children: readings.map((r, i) => {
                                    const info = (0, hexagrams_1.getHexagramInfo)(r.lines);
                                    const transition = analysis.transitions[i]; // transition from reading i to i+1
                                    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "shrink-0", children: (0, jsx_runtime_1.jsx)(HexagramDisplay_1.HexagramDisplay, { lines: r.lines, title: "", changingLine: r.changingLine !== null ? r.changingLine - 1 : -1, compact: true }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 space-y-1", children: [(0, jsx_runtime_1.jsxs)("p", { className: "font-serif font-semibold text-primary text-sm", children: [r.date, r.label ? ` — ${r.label}` : ""] }), (0, jsx_runtime_1.jsxs)("a", { href: info.url, target: "_blank", rel: "noopener noreferrer", className: "font-serif text-sm text-primary hover:text-accent underline underline-offset-2 transition-colors", children: ["Hexagram ", info.number, ": ", info.name] }), r.inquiry && ((0, jsx_runtime_1.jsxs)("p", { className: "font-serif text-sm text-foreground/60 italic", children: ["\u201C", r.inquiry, "\u201D"] })), r.changingLine && ((0, jsx_runtime_1.jsxs)("p", { className: "font-serif text-xs text-muted-foreground", children: ["changing line ", r.changingLine] }))] })] }), transition && ((0, jsx_runtime_1.jsx)("div", { className: "ml-4 my-4 pl-4 border-l-2 border-accent/40", children: (0, jsx_runtime_1.jsx)(OperatorCard, { transition: transition, readings: readings, fromIndex: i, toIndex: i + 1 }) }))] }, r.id));
                                }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "bg-card border-border shadow-soft", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "font-serif text-primary text-lg", children: "Net Transformation" }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid sm:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-1 text-center", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-serif text-muted-foreground uppercase tracking-wide", children: "from" }), (0, jsx_runtime_1.jsx)(HexagramDisplay_1.HexagramDisplay, { lines: readings[0].lines, title: `Hexagram ${(0, hexagrams_1.getHexagramInfo)(readings[0].lines).number}`, changingLine: -1, hexagramNumber: (0, hexagrams_1.getHexagramInfo)(readings[0].lines).number, hexagramName: (0, hexagrams_1.getHexagramInfo)(readings[0].lines).name, hexagramUrl: (0, hexagrams_1.getHexagramInfo)(readings[0].lines).url })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1 text-center", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-serif text-muted-foreground uppercase tracking-wide", children: "to" }), (0, jsx_runtime_1.jsx)(HexagramDisplay_1.HexagramDisplay, { lines: readings[readings.length - 1].lines, title: `Hexagram ${analysis.presentHexagram.number}`, changingLine: readings[readings.length - 1].changingLine !== null
                                                            ? (readings[readings.length - 1].changingLine ?? 1) - 1
                                                            : -1, hexagramNumber: analysis.presentHexagram.number, hexagramName: analysis.presentHexagram.name, hexagramUrl: analysis.presentHexagram.url })] })] }), (0, jsx_runtime_1.jsx)(separator_1.Separator, {}), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-serif text-sm text-muted-foreground w-32 shrink-0", children: "Net operator" }), (0, jsx_runtime_1.jsx)("p", { className: "font-mono text-primary tracking-widest", children: analysis.netOperator.map((b) => (b ? "▲" : "▽")).join(" ") }), (0, jsx_runtime_1.jsxs)("p", { className: "font-serif text-sm text-foreground/70", children: ["weight ", analysis.netHammingWeight, " \u00B7 ", analysis.netTrigramCharacter, " trigram"] })] }), analysis.stableLines.length > 0 && ((0, jsx_runtime_1.jsxs)("p", { className: "font-serif text-sm text-foreground/70", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Stable lines:" }), " ", analysis.stableLines.map((l) => `line ${l}`).join(", "), " \u2014 held throughout every transition."] })), analysis.volatileLines.length > 0 && ((0, jsx_runtime_1.jsxs)("p", { className: "font-serif text-sm text-foreground/70", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Volatile lines:" }), " ", analysis.volatileLines.map((l) => `line ${l}`).join(", "), " \u2014 changed in more than half of transitions."] })), (0, jsx_runtime_1.jsx)("p", { className: "font-serif text-xs text-muted-foreground italic", children: (0, kingwen_1.fodNoteForWeight)(analysis.netHammingWeight) })] }), analysis.resultingHexagram && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(separator_1.Separator, {}), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-serif text-sm font-semibold text-primary", children: "Current changing line points toward:" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(HexagramDisplay_1.HexagramDisplay, { lines: (() => {
                                                                    const last = readings[readings.length - 1];
                                                                    const fl = [...last.lines];
                                                                    if (last.changingLine)
                                                                        fl[last.changingLine - 1] = !fl[last.changingLine - 1];
                                                                    return fl;
                                                                })(), title: `Hexagram ${analysis.resultingHexagram.number}`, changingLine: -1, hexagramNumber: analysis.resultingHexagram.number, hexagramName: analysis.resultingHexagram.name, hexagramUrl: analysis.resultingHexagram.url, compact: true }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "font-serif text-sm text-primary font-semibold", children: analysis.resultingHexagram.name }), (0, jsx_runtime_1.jsxs)("a", { href: analysis.resultingHexagram.url, target: "_blank", rel: "noopener noreferrer", className: "font-serif text-xs text-muted-foreground hover:text-primary underline underline-offset-2", children: ["Hexagram ", analysis.resultingHexagram.number] })] })] })] })] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between pt-4", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", onClick: onBack, className: "font-serif text-muted-foreground hover:text-foreground", children: "\u2190 Back" }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: onNext, className: "font-serif shadow-warm hover:shadow-meditation transition-all duration-300", children: "Reflect & Export \u2192" })] })] }) }) }));
}
