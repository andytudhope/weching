"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ThreadPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const StepTransition_1 = require("@/components/StepTransition");
const ThreadWelcome_1 = require("@/components/thread/ThreadWelcome");
const TimingRitual_1 = require("@/components/thread/TimingRitual");
const ThreadAnalysis_1 = require("@/components/thread/ThreadAnalysis");
const ThreadReflection_1 = require("@/components/thread/ThreadReflection");
function threadReducer(state, action) {
    switch (action.type) {
        case "NEXT_STEP":
            return { ...state, currentStep: state.currentStep + 1 };
        case "PREV_STEP":
            return { ...state, currentStep: Math.max(0, state.currentStep - 1) };
        case "GO_TO_STEP":
            return { ...state, currentStep: action.step };
        case "SET_READINGS":
            return { ...state, readings: action.readings };
        case "ADD_READING":
            return { ...state, readings: [...state.readings, action.reading] };
        case "REMOVE_READING":
            return {
                ...state,
                readings: state.readings.filter((r) => r.id !== action.id),
            };
        case "SET_USERNAME":
            return { ...state, username: action.username };
        default:
            return state;
    }
}
function ThreadPage() {
    const router = (0, navigation_1.useRouter)();
    const [state, dispatch] = (0, react_1.useReducer)(threadReducer, {
        currentStep: 0,
        readings: [],
        username: "",
    });
    const [loading, setLoading] = (0, react_1.useState)(true);
    // On mount: verify auth and load readings
    (0, react_1.useEffect)(() => {
        async function init() {
            const res = await fetch("/api/readings");
            if (res.status === 401) {
                router.replace("/login");
                return;
            }
            // Get username from a simple profile endpoint or decode from the response
            // We'll use a cookie-based approach — fetch /api/auth/me
            const meRes = await fetch("/api/auth/me");
            if (meRes.ok) {
                const me = await meRes.json();
                dispatch({ type: "SET_USERNAME", username: me.username });
            }
            const readings = await res.json();
            dispatch({ type: "SET_READINGS", readings });
            setLoading(false);
        }
        init();
    }, [router]);
    async function handleSave(reading) {
        const res = await fetch("/api/readings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                inquiry: reading.inquiry,
                lines: reading.lines,
                changingLine: reading.changingLine,
                date: reading.date,
                label: reading.label,
                durations: reading.durations,
            }),
        });
        if (res.ok) {
            const { id } = await res.json();
            dispatch({ type: "ADD_READING", reading: { ...reading, id } });
        }
    }
    async function handleRemove(id) {
        const res = await fetch(`/api/readings/${id}`, { method: "DELETE" });
        if (res.ok) {
            dispatch({ type: "REMOVE_READING", id });
        }
    }
    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    }
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen flex items-center justify-center bg-gradient-warm", children: (0, jsx_runtime_1.jsx)("p", { className: "font-serif text-muted-foreground", children: "loading\u2026" }) }));
    }
    const { currentStep, readings, username } = state;
    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return ((0, jsx_runtime_1.jsx)(ThreadWelcome_1.ThreadWelcome, { onBegin: () => dispatch({ type: "NEXT_STEP" }), username: username }));
            case 1:
                return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-warm py-12", children: (0, jsx_runtime_1.jsx)(TimingRitual_1.TimingRitual, { readings: readings, onSave: handleSave, onRemove: handleRemove, onNext: () => dispatch({ type: "NEXT_STEP" }) }) }));
            case 2:
                return ((0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-warm", children: (0, jsx_runtime_1.jsx)(ThreadAnalysis_1.ThreadAnalysis, { readings: readings, onNext: () => dispatch({ type: "NEXT_STEP" }), onBack: () => dispatch({ type: "PREV_STEP" }) }) }));
            case 3:
                return ((0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-warm", children: (0, jsx_runtime_1.jsx)(ThreadReflection_1.ThreadReflection, { readings: readings, username: username, onBackToAnalysis: () => dispatch({ type: "PREV_STEP" }), onStartNewThread: () => dispatch({ type: "GO_TO_STEP", step: 1 }) }) }));
            default:
                return null;
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-warm", children: [renderStep() && ((0, jsx_runtime_1.jsx)(StepTransition_1.StepTransition, { stepKey: currentStep, children: renderStep() })), (0, jsx_runtime_1.jsx)("div", { className: "py-4 border-t border-border", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-2xl mx-auto flex items-center justify-between px-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground font-serif", children: "Thread of Selves \u00B7 weching" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleLogout, className: "text-xs font-serif text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4", children: "sign out" })] }) })] }));
}
