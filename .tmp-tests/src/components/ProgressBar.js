"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressBar = ProgressBar;
const jsx_runtime_1 = require("react/jsx-runtime");
function ProgressBar({ currentStep, totalSteps }) {
    const progress = (currentStep / (totalSteps - 1)) * 100;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed top-0 left-0 right-0 h-1 z-50 bg-border/40", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full bg-gradient-to-r from-meditation-glow to-accent transition-all duration-700 ease-out", style: { width: `${progress}%` } }) }));
}
