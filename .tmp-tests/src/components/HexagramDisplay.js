"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HexagramDisplay = HexagramDisplay;
const jsx_runtime_1 = require("react/jsx-runtime");
function HexagramDisplay({ lines, title, changingLine, hexagramNumber, hexagramName, hexagramUrl, compact, }) {
    const lineWidth = compact ? "w-16" : "w-28";
    const changingStyle = "shadow-meditation animate-pulse";
    return ((0, jsx_runtime_1.jsxs)("div", { className: `flex flex-col items-center shadow-soft ${compact
            ? "space-y-2 p-3 bg-gradient-subtle rounded-xl"
            : "space-y-4 p-6 bg-gradient-subtle rounded-2xl"}`, children: [(0, jsx_runtime_1.jsx)("h3", { className: `font-serif font-semibold text-primary ${compact ? "text-sm mb-0" : "text-xl mb-2"}`, children: title }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-col-reverse space-y-1 space-y-reverse", children: lines.map((isYang, index) => {
                    const isChanging = changingLine === index;
                    const lineClass = `h-1 bg-primary rounded-full transition-all duration-300 ${isChanging ? changingStyle : ""}`;
                    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1", children: [!compact && ((0, jsx_runtime_1.jsx)("span", { className: "text-xs font-serif text-muted-foreground w-4", children: index + 1 })), (0, jsx_runtime_1.jsxs)("div", { className: `relative ${lineWidth}`, children: [isYang ? ((0, jsx_runtime_1.jsx)("div", { className: `w-full ${lineClass}` })) : ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-[44%] ${lineClass}` }), (0, jsx_runtime_1.jsx)("div", { className: `w-[44%] ${lineClass}` })] })), isChanging && ((0, jsx_runtime_1.jsx)("div", { className: "absolute -right-8 top-0 w-2 h-2 bg-accent rounded-full animate-pulse" }))] })] }, index));
                }) }), hexagramNumber && hexagramName && hexagramUrl && ((0, jsx_runtime_1.jsxs)("a", { href: hexagramUrl, target: "_blank", rel: "noopener noreferrer", className: `font-serif text-primary hover:text-accent transition-colors duration-200 underline underline-offset-2 ${compact ? "text-xs" : "text-sm"}`, children: ["Hexagram ", hexagramNumber, ": ", hexagramName] }))] }));
}
