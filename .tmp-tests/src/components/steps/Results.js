"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Results = Results;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const separator_1 = require("@/components/ui/separator");
const HexagramDisplay_1 = require("@/components/HexagramDisplay");
const exportSession_1 = require("@/lib/exportSession");
function Results({ inquiry, participants, groupLines, futureLines, changingLine, presentHexagram, futureHexagram, participantHexagrams, onNewCeremony, onModify, }) {
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen flex flex-col pt-4", children: (0, jsx_runtime_1.jsx)("div", { className: "flex-1 px-4 py-12", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-3xl mx-auto space-y-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { className: "bg-card border-border shadow-meditation", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "font-serif text-primary text-center flex items-center justify-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Stars, { className: "w-5 h-5 mr-2" }), "Co-Inquiry Results", (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "w-5 h-5 ml-2" })] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [inquiry && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-6 p-4 bg-meditation-glow rounded-lg", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-serif font-medium text-primary mb-2", children: "Your Inquiry:" }), (0, jsx_runtime_1.jsxs)("p", { className: "font-serif text-foreground/80 italic", children: ["\u201C", inquiry, "\u201D"] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "grid md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsx)(HexagramDisplay_1.HexagramDisplay, { lines: groupLines, title: "Present Situation", changingLine: changingLine - 1, hexagramNumber: presentHexagram.number, hexagramName: presentHexagram.name, hexagramUrl: presentHexagram.url }), (0, jsx_runtime_1.jsx)(HexagramDisplay_1.HexagramDisplay, { lines: futureLines, title: "Future Influence", changingLine: -1, hexagramNumber: futureHexagram.number, hexagramName: futureHexagram.name, hexagramUrl: futureHexagram.url })] }), (0, jsx_runtime_1.jsx)(separator_1.Separator, { className: "my-6" }), (0, jsx_runtime_1.jsx)("h4", { className: "font-serif font-medium text-primary text-center mb-4", children: "Individual Hexagrams" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6", children: participantHexagrams.map((ph, i) => ((0, jsx_runtime_1.jsx)(HexagramDisplay_1.HexagramDisplay, { lines: ph.lines, title: ph.name, changingLine: -1, hexagramNumber: ph.info.number, hexagramName: ph.info.name, hexagramUrl: ph.info.url, compact: true }, i))) }), (0, jsx_runtime_1.jsx)(separator_1.Separator, { className: "my-6" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center space-y-3", children: [(0, jsx_runtime_1.jsxs)("p", { className: "font-serif text-muted-foreground", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Changing Line:" }), " Line ", changingLine, " transforms the hexagram"] }), (0, jsx_runtime_1.jsxs)("p", { className: "font-serif text-sm text-muted-foreground", children: [participants.length, " participants contributed to this co-inquiry"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", onClick: () => {
                                                    const md = (0, exportSession_1.exportSession)({
                                                        inquiry,
                                                        participants,
                                                        presentHexagram,
                                                        futureHexagram,
                                                        groupLines,
                                                        futureLines,
                                                        changingLine,
                                                        participantHexagrams,
                                                    });
                                                    const date = new Date().toISOString().slice(0, 10);
                                                    (0, exportSession_1.downloadMarkdown)(md, `co-inquiry-${date}.md`);
                                                }, className: "font-serif", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "w-4 h-4 mr-2" }), "Export Session"] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between pt-4", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", onClick: onModify, className: "font-serif text-muted-foreground hover:text-foreground", children: "Modify Ceremony" }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: onNewCeremony, className: "font-serif shadow-warm hover:shadow-meditation transition-all duration-300", children: "New Ceremony" })] })] }) }) }));
}
