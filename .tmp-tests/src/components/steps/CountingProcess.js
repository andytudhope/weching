"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountingProcess = CountingProcess;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const StepLayout_1 = require("@/components/StepLayout");
function CountingProcess({ onContinue, onBack, onSkip, }) {
    return ((0, jsx_runtime_1.jsxs)(StepLayout_1.StepLayout, { onContinue: onContinue, onBack: onBack, onSkip: onSkip, children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-serif tracking-wide text-primary flex items-center justify-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calculator, { className: "w-6 h-6 mr-3" }), "Counting Process"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-foreground/80 font-serif", children: "Count carefully while maintaining contemplative mode. Group seeds in pairs or sets of five to quickly determine odd/even for each pile." }), (0, jsx_runtime_1.jsx)("p", { className: "text-foreground/80 font-serif", children: "Keep each pile distinct throughout the process. Record your 7 numbers (6 pile counts + 1 changing line pile) and enter them when prompted." })] })] }));
}
