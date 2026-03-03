"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimingRitual = TimingRitual;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const textarea_1 = require("@/components/ui/textarea");
const input_1 = require("@/components/ui/input");
const HexagramDisplay_1 = require("@/components/HexagramDisplay");
const NeighbourhoodDisplay_1 = require("./NeighbourhoodDisplay");
const hexagrams_1 = require("@/lib/hexagrams");
// ——— Timing math ———
// Express the duration as seconds to 3 decimal places (e.g. "3.456"),
// sum all decimal digits, and take the parity. This distributes yin/yang
// evenly regardless of whether humans tend to release on round-second marks.
function digitSum(ms) {
    const s = (ms / 1000).toFixed(3); // "3.456"
    let sum = 0;
    for (const ch of s) {
        if (ch !== ".")
            sum += parseInt(ch, 10);
    }
    return sum;
}
function durationToYang(ms) {
    return digitSum(ms) % 2 === 1;
}
function durationToChangingLine(ms) {
    const sum = digitSum(ms);
    return sum % 6 === 0 ? 6 : sum % 6;
}
function derivedFromDurations(durations) {
    const lines = durations.slice(0, 6).map(durationToYang);
    const changingLine = durationToChangingLine(durations[6]);
    return { lines, changingLine };
}
function todayString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
const LINE_LABELS = [
    "Line 1 (bottom)",
    "Line 2",
    "Line 3",
    "Line 4",
    "Line 5",
    "Line 6 (top)",
    "The Changing Line",
];
function TimingRitual({ readings, onSave, onRemove, onNext, }) {
    const today = new Date();
    const [view, setView] = (0, react_1.useState)("list");
    const [lineIndex, setLineIndex] = (0, react_1.useState)(0);
    const [durations, setDurations] = (0, react_1.useState)([]);
    const [revealedDuration, setRevealedDuration] = (0, react_1.useState)(0);
    // Inquiry is captured BEFORE casting begins
    const [inquiry, setInquiry] = (0, react_1.useState)("");
    const [date, setDate] = (0, react_1.useState)(todayString());
    const [label, setLabel] = (0, react_1.useState)("");
    const [saving, setSaving] = (0, react_1.useState)(false);
    const pressStartRef = (0, react_1.useRef)(null);
    const advanceTimerRef = (0, react_1.useRef)(null);
    function clearAdvanceTimer() {
        if (advanceTimerRef.current !== null) {
            clearTimeout(advanceTimerRef.current);
            advanceTimerRef.current = null;
        }
    }
    function startRitual() {
        clearAdvanceTimer();
        setDurations([]);
        setLineIndex(0);
        setView("ready");
    }
    function retry() {
        // Re-cast with same inquiry
        clearAdvanceTimer();
        setDurations([]);
        setLineIndex(0);
        setView("ready");
    }
    function handlePointerDown(e) {
        e.currentTarget.setPointerCapture(e.pointerId);
        pressStartRef.current = Date.now();
        setView("holding");
    }
    function handlePointerUp() {
        if (pressStartRef.current === null)
            return;
        const duration = Date.now() - pressStartRef.current;
        pressStartRef.current = null;
        setRevealedDuration(duration);
        setView("revealed");
        clearAdvanceTimer();
        // Capture current state values in closure
        const capturedLineIndex = lineIndex;
        const capturedDurations = durations;
        advanceTimerRef.current = setTimeout(() => {
            const newDurations = [...capturedDurations, duration];
            const nextIdx = capturedLineIndex + 1;
            if (nextIdx < 7) {
                setDurations(newDurations);
                setLineIndex(nextIdx);
                setView("ready");
            }
            else {
                setDurations(newDurations);
                setView("complete");
            }
        }, 900);
    }
    async function handleAccept(completeDurations) {
        setSaving(true);
        try {
            const { lines, changingLine } = derivedFromDurations(completeDurations);
            await onSave({
                date,
                inquiry: inquiry.trim() || undefined,
                label: label.trim() || undefined,
                lines,
                changingLine,
                durations: completeDurations,
            });
            setDurations([]);
            setLineIndex(0);
            setInquiry("");
            setLabel("");
            setDate(todayString());
            setView("list");
        }
        finally {
            setSaving(false);
        }
    }
    // ——— Views ———
    if (view === "list") {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-lg mx-auto w-full space-y-6 px-4", children: [(0, jsx_runtime_1.jsx)(NeighbourhoodDisplay_1.NeighbourhoodDisplay, { today: today }), readings.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-serif font-semibold text-primary text-sm uppercase tracking-widest text-center", children: "your readings" }), readings.map((r) => {
                            const info = (0, hexagrams_1.getHexagramInfo)(r.lines);
                            return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 p-3 rounded-xl bg-gradient-subtle border border-border shadow-soft", children: [(0, jsx_runtime_1.jsx)("div", { className: "shrink-0", children: (0, jsx_runtime_1.jsx)(HexagramDisplay_1.HexagramDisplay, { lines: r.lines, title: "", changingLine: r.changingLine !== null ? r.changingLine - 1 : -1, compact: true }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-serif text-primary font-semibold", children: r.date }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs font-serif text-muted-foreground truncate", children: [info.number, ": ", info.name] }), r.inquiry && ((0, jsx_runtime_1.jsxs)("p", { className: "text-xs font-serif text-foreground/60 italic truncate", children: ["\u201C", r.inquiry, "\u201D"] }))] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => onRemove(r.id), className: "text-xs font-serif text-muted-foreground hover:text-destructive transition-colors shrink-0", children: "remove" })] }, r.id));
                        })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center gap-3", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { onClick: () => {
                                setInquiry("");
                                setDate(todayString());
                                setLabel("");
                                setView("inquiry");
                            }, size: "lg", className: "font-serif shadow-warm hover:shadow-meditation transition-all duration-300", children: "Add a Reading" }), readings.length >= 2 && ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: onNext, className: "font-serif", children: "Proceed to Analysis \u2192" })), readings.length === 1 && ((0, jsx_runtime_1.jsx)("p", { className: "text-xs font-serif text-muted-foreground text-center", children: "Add one more reading to unlock analysis" }))] })] }));
    }
    // ——— INQUIRY (must come before casting) ———
    if (view === "inquiry") {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-lg mx-auto w-full space-y-6 px-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center space-y-2", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-serif text-muted-foreground uppercase tracking-widest", children: "before you cast" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-serif font-semibold text-primary", children: "Form your inquiry" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm font-serif text-foreground/70 leading-relaxed max-w-sm mx-auto", children: "The oracle reads the structure of this moment. Hold your question clearly in mind as you cast \u2014 the hexagram will describe the nature of what you bring, not answer it directly." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-1.5", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-serif text-foreground/80 font-medium", children: "What is your inquiry?" }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { value: inquiry, onChange: (e) => setInquiry(e.target.value), placeholder: "The question or theme you bring to this moment\u2026", rows: 3, className: "font-serif resize-none", autoFocus: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-serif text-foreground/80", children: "Date" }), (0, jsx_runtime_1.jsx)(input_1.Input, { type: "date", value: date, onChange: (e) => setDate(e.target.value), className: "font-serif" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("label", { className: "text-sm font-serif text-foreground/80", children: ["Context", " ", (0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground text-xs", children: "(optional)" })] }), (0, jsx_runtime_1.jsx)(input_1.Input, { value: label, onChange: (e) => setLabel(e.target.value), placeholder: "brief note\u2026", className: "font-serif" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center gap-3", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { onClick: startRitual, size: "lg", className: "font-serif shadow-warm hover:shadow-meditation transition-all duration-300", children: "Begin Casting \u2192" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setView("list"), className: "text-sm font-serif text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4", children: "\u2190 back" })] })] }));
    }
    // ——— READY ———
    if (view === "ready") {
        const isChanging = lineIndex === 6;
        return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-lg mx-auto w-full space-y-8 px-4 text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-sm font-serif text-muted-foreground uppercase tracking-widest", children: ["step ", lineIndex + 1, " of 7"] }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-serif font-semibold text-primary", children: isChanging ? "Hold for the Changing Line" : `Begin ${LINE_LABELS[lineIndex]}` }), inquiry && ((0, jsx_runtime_1.jsxs)("p", { className: "text-xs font-serif text-foreground/50 italic max-w-xs mx-auto truncate", children: ["\u201C", inquiry, "\u201D"] })), (0, jsx_runtime_1.jsx)("p", { className: "text-sm font-serif text-muted-foreground", children: "Touch and hold. Release when it feels complete." })] }), (0, jsx_runtime_1.jsx)("div", { onPointerDown: handlePointerDown, className: "mx-auto w-48 h-48 rounded-full bg-gradient-subtle border-2 border-border shadow-soft flex items-center justify-center cursor-pointer select-none touch-none hover:shadow-warm transition-shadow duration-300", children: (0, jsx_runtime_1.jsx)("span", { className: "font-serif text-primary/50 text-sm select-none", children: "touch" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                        clearAdvanceTimer();
                        setDurations([]);
                        setLineIndex(0);
                        setView("inquiry");
                    }, className: "text-sm font-serif text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4", children: "\u2190 change inquiry" })] }));
    }
    // ——— HOLDING ———
    if (view === "holding") {
        const isChanging = lineIndex === 6;
        return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-lg mx-auto w-full space-y-8 px-4 text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-serif text-muted-foreground uppercase tracking-widest", children: isChanging ? "changing line" : LINE_LABELS[lineIndex] }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-serif font-semibold text-primary", children: "holding\u2026" })] }), (0, jsx_runtime_1.jsx)("div", { onPointerUp: handlePointerUp, className: "mx-auto w-48 h-48 rounded-full bg-accent border-2 border-primary/30 shadow-meditation flex items-center justify-center cursor-pointer select-none touch-none animate-pulse", children: (0, jsx_runtime_1.jsx)("span", { className: "font-serif text-primary/70 text-sm select-none", children: "release" }) })] }));
    }
    // ——— REVEALED ———
    if (view === "revealed") {
        const isChanging = lineIndex === 6;
        const isYang = durationToYang(revealedDuration);
        const changingLineNum = isChanging ? durationToChangingLine(revealedDuration) : null;
        return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-lg mx-auto w-full space-y-8 px-4 text-center", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-serif text-muted-foreground uppercase tracking-widest", children: isChanging ? "changing line" : LINE_LABELS[lineIndex] }), isChanging ? ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 py-6", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-4xl font-serif font-bold text-primary", children: ["Line ", changingLineNum] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm font-serif text-muted-foreground", children: "changes" })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center gap-3 py-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-3", children: isYang ? ((0, jsx_runtime_1.jsx)("div", { className: "h-2 w-28 rounded-full bg-primary" })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "h-2 w-12 rounded-full bg-primary" }), (0, jsx_runtime_1.jsx)("div", { className: "h-2 w-12 rounded-full bg-primary" })] })) }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg font-serif text-primary font-semibold", children: isYang ? "yang" : "yin" })] })), (0, jsx_runtime_1.jsx)("p", { className: "text-xs font-serif text-muted-foreground animate-pulse", children: lineIndex < 6 ? "advancing…" : "completing…" })] }));
    }
    // ——— COMPLETE ———
    const { lines, changingLine } = derivedFromDurations(durations);
    const info = (0, hexagrams_1.getHexagramInfo)(lines);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-lg mx-auto w-full space-y-6 px-4 text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-serif text-muted-foreground uppercase tracking-widest", children: "reading complete" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-serif font-semibold text-primary", children: info.name }), inquiry && ((0, jsx_runtime_1.jsxs)("p", { className: "text-sm font-serif text-foreground/60 italic", children: ["\u201C", inquiry, "\u201D"] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-center", children: (0, jsx_runtime_1.jsx)(HexagramDisplay_1.HexagramDisplay, { lines: lines, title: `Hexagram ${info.number}`, changingLine: changingLine - 1, hexagramNumber: info.number, hexagramName: info.name, hexagramUrl: info.url }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-center gap-4", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: retry, className: "font-serif", children: "Try Again" }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: () => handleAccept(durations), disabled: saving, className: "font-serif shadow-warm", children: saving ? "Saving…" : "Accept & Save" })] })] }));
}
