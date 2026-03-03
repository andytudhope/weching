"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepTransition = StepTransition;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function StepTransition({ stepKey, children }) {
    const [phase, setPhase] = (0, react_1.useState)("enter");
    const [displayedKey, setDisplayedKey] = (0, react_1.useState)(stepKey);
    const [displayedChildren, setDisplayedChildren] = (0, react_1.useState)(children);
    // Always keep displayed children in sync when the step hasn't changed
    // This ensures controlled inputs (textareas, inputs) reflect current state
    (0, react_1.useEffect)(() => {
        if (stepKey === displayedKey) {
            setDisplayedChildren(children);
        }
    }, [children, stepKey, displayedKey]);
    (0, react_1.useEffect)(() => {
        if (stepKey === displayedKey)
            return;
        // Exit current
        setPhase("exit");
        const breathTimer = setTimeout(() => {
            setDisplayedKey(stepKey);
            setDisplayedChildren(children);
            setPhase("enter");
            // Scroll to top when transitioning to a new step
            window.scrollTo(0, 0);
            const visibleTimer = setTimeout(() => {
                setPhase("visible");
            }, 50);
            return () => clearTimeout(visibleTimer);
        }, 600); // 400ms exit + 200ms breath
        return () => clearTimeout(breathTimer);
    }, [stepKey, children, displayedKey]);
    // On first mount, become visible
    (0, react_1.useEffect)(() => {
        const timer = setTimeout(() => setPhase("visible"), 50);
        return () => clearTimeout(timer);
    }, []);
    return ((0, jsx_runtime_1.jsx)("div", { className: `step-transition ${phase === "exit"
            ? "step-exit"
            : phase === "enter"
                ? "step-enter"
                : "step-visible"}`, children: displayedChildren }));
}
