"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadReflection = ThreadReflection;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const operators_1 = require("@/lib/operators");
const exportThread_1 = require("@/lib/exportThread");
const hexagrams_1 = require("@/lib/hexagrams");
function ThreadReflection({ readings, username, onBackToAnalysis, onStartNewThread, }) {
    const analysis = (0, react_1.useMemo)(() => (0, operators_1.analyzeThread)(readings), [readings]);
    const firstInfo = (0, react_1.useMemo)(() => (0, hexagrams_1.getHexagramInfo)(readings[0].lines), [readings]);
    function handleDownload() {
        const md = (0, exportThread_1.exportThread)(readings);
        const date = new Date().toISOString().slice(0, 10);
        (0, exportThread_1.downloadMarkdown)(md, `thread-of-selves-${username}-${date}.md`);
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen flex flex-col pt-4", children: (0, jsx_runtime_1.jsx)("div", { className: "flex-1 px-4 py-12", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-2xl mx-auto space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center space-y-2", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-serif font-bold text-primary", children: "reflection" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm font-serif text-muted-foreground", children: [username, " \u00B7 ", readings.length, " readings"] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "bg-card border-border shadow-soft", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "font-serif text-primary text-lg", children: "Summary" }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-3 font-serif text-sm text-foreground/80", children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "First reading:" }), " ", readings[0].date, " \u00B7", " ", "Hexagram ", firstInfo.number, ": ", firstInfo.name] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Most recent:" }), " ", readings[readings.length - 1].date, " \u00B7", " ", "Hexagram ", analysis.presentHexagram.number, ": ", analysis.presentHexagram.name] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Net transformation:" }), " Hamming weight", " ", analysis.netHammingWeight, " (", analysis.netTrigramCharacter, " trigram)"] }), analysis.stableLines.length > 0 && ((0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Stable through all transitions:" }), " ", analysis.stableLines.map((l) => `line ${l}`).join(", ")] })), analysis.volatileLines.length > 0 && ((0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Most volatile:" }), " ", analysis.volatileLines.map((l) => `line ${l}`).join(", ")] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 rounded-2xl bg-meditation-glow border border-border/40 text-center space-y-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-serif text-foreground/70 leading-relaxed text-sm max-w-md mx-auto", children: "The thread does not predict. It maps the path you have already walked \u2014 the character of each moment, the geometry of the movement between them." }), (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: handleDownload, variant: "outline", className: "font-serif", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "w-4 h-4 mr-2" }), "Export Thread as Markdown"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between pt-4", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", onClick: onBackToAnalysis, className: "font-serif text-muted-foreground hover:text-foreground", children: "\u2190 Back to Analysis" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: onStartNewThread, className: "font-serif", children: "Add Another Reading" })] })] }) }) }));
}
