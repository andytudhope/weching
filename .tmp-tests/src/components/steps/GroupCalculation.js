"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupCalculation = GroupCalculation;
const jsx_runtime_1 = require("react/jsx-runtime");
const StepLayout_1 = require("@/components/StepLayout");
function GroupCalculation({ onContinue, onBack, }) {
    return ((0, jsx_runtime_1.jsxs)(StepLayout_1.StepLayout, { onContinue: onContinue, onBack: onBack, showSkip: false, continueLabel: "Proceed to Ceremony", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-serif tracking-wide text-primary text-center", children: "Group Calculation" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-foreground/80 font-serif", children: "We add together each individual's line. If the result is even, we have a yin line (broken). If the result is odd, we have a yang line (solid). This creates our group hexagram." }), (0, jsx_runtime_1.jsx)("p", { className: "text-foreground/80 font-serif", children: "We add together each individual's moving line and divide by six. The remainder is the moving line for the group. If the remainder is zero, we have a moving line at position 6." }), (0, jsx_runtime_1.jsx)("div", { className: "bg-meditation-glow p-4 rounded-lg", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground font-serif italic", children: "Individual hexagrams are meaningful bonus by-products, but the group hexagram is the primary focus of the co-inquiry." }) })] })] }));
}
