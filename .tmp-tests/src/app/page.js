"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ProgressBar_1 = require("@/components/ProgressBar");
const StepTransition_1 = require("@/components/StepTransition");
const Welcome_1 = require("@/components/steps/Welcome");
const FormingTheQuestion_1 = require("@/components/steps/FormingTheQuestion");
const Preparation_1 = require("@/components/steps/Preparation");
const SeedMethod_1 = require("@/components/steps/SeedMethod");
const CountingProcess_1 = require("@/components/steps/CountingProcess");
const GroupCalculation_1 = require("@/components/steps/GroupCalculation");
const Ceremony_1 = require("@/components/steps/Ceremony");
const Results_1 = require("@/components/steps/Results");
const hexagrams_1 = require("@/lib/hexagrams");
const TOTAL_STEPS = 8;
const CEREMONY_STEP = 6;
function ceremonyReducer(state, action) {
    switch (action.type) {
        case "NEXT_STEP":
            return {
                ...state,
                currentStep: Math.min(state.currentStep + 1, TOTAL_STEPS - 1),
            };
        case "PREV_STEP":
            return { ...state, currentStep: Math.max(state.currentStep - 1, 0) };
        case "GO_TO_STEP":
            return { ...state, currentStep: action.step };
        case "SET_INQUIRY":
            return { ...state, inquiry: action.inquiry };
        case "SET_PARTICIPANTS":
            return { ...state, participants: action.participants };
        case "RESET":
            return { currentStep: 0, inquiry: "", participants: [] };
        default:
            return state;
    }
}
function Home() {
    const [state, dispatch] = (0, react_1.useReducer)(ceremonyReducer, {
        currentStep: 0,
        inquiry: "",
        participants: [],
    });
    const [isReturning, setIsReturning] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (typeof window !== "undefined") {
            setIsReturning(localStorage.getItem("hasCompletedGuidance") === "true");
        }
    }, []);
    // Mark guidance as completed when reaching ceremony step
    (0, react_1.useEffect)(() => {
        if (state.currentStep === CEREMONY_STEP && typeof window !== "undefined") {
            localStorage.setItem("hasCompletedGuidance", "true");
            setIsReturning(true);
        }
    }, [state.currentStep]);
    const { inquiry, participants, currentStep } = state;
    const groupLines = (0, react_1.useMemo)(() => {
        if (participants.length === 0)
            return [false, false, false, false, false, false];
        const lines = [];
        for (let i = 0; i < 6; i++) {
            const sum = participants.reduce((acc, p) => acc + p.numbers[i], 0);
            lines.push(sum % 2 === 1);
        }
        return lines;
    }, [participants]);
    const changingLine = (0, react_1.useMemo)(() => {
        if (participants.length === 0)
            return 0;
        const total = participants.reduce((sum, p) => sum + p.numbers[6], 0) % 6;
        return total === 0 ? 6 : total;
    }, [participants]);
    const futureLines = (0, react_1.useMemo)(() => {
        const lines = [...groupLines];
        lines[changingLine - 1] = !lines[changingLine - 1];
        return lines;
    }, [groupLines, changingLine]);
    const presentHexagram = (0, react_1.useMemo)(() => (0, hexagrams_1.getHexagramInfo)(groupLines), [groupLines]);
    const futureHexagram = (0, react_1.useMemo)(() => (0, hexagrams_1.getHexagramInfo)(futureLines), [futureLines]);
    const participantHexagrams = (0, react_1.useMemo)(() => participants.map((p) => {
        const lines = p.numbers.slice(0, 6).map((n) => n % 2 === 1);
        return { name: p.name, lines, info: (0, hexagrams_1.getHexagramInfo)(lines) };
    }), [participants]);
    const canGenerate = participants.length >= 2 && inquiry.trim().length > 0;
    const next = () => dispatch({ type: "NEXT_STEP" });
    const prev = () => dispatch({ type: "PREV_STEP" });
    const goTo = (step) => dispatch({ type: "GO_TO_STEP", step });
    const skipToCeremony = () => goTo(CEREMONY_STEP);
    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return ((0, jsx_runtime_1.jsx)(Welcome_1.Welcome, { onBegin: next, onSkip: skipToCeremony, isReturning: isReturning }));
            case 1:
                return ((0, jsx_runtime_1.jsx)(Preparation_1.Preparation, { onContinue: next, onBack: prev, onSkip: skipToCeremony }));
            case 2:
                return ((0, jsx_runtime_1.jsx)(FormingTheQuestion_1.FormingTheQuestion, { onContinue: next, onBack: prev, onSkip: skipToCeremony }));
            case 3:
                return ((0, jsx_runtime_1.jsx)(SeedMethod_1.SeedMethod, { onContinue: next, onBack: prev, onSkip: skipToCeremony }));
            case 4:
                return ((0, jsx_runtime_1.jsx)(CountingProcess_1.CountingProcess, { onContinue: next, onBack: prev, onSkip: skipToCeremony }));
            case 5:
                return ((0, jsx_runtime_1.jsx)(GroupCalculation_1.GroupCalculation, { onContinue: next, onBack: prev }));
            case 6:
                return ((0, jsx_runtime_1.jsx)(Ceremony_1.Ceremony, { inquiry: inquiry, participants: participants, onInquiryChange: (v) => dispatch({ type: "SET_INQUIRY", inquiry: v }), onParticipantsChange: (p) => dispatch({ type: "SET_PARTICIPANTS", participants: p }), onGenerate: next, onBack: prev, canGenerate: canGenerate }));
            case 7:
                return ((0, jsx_runtime_1.jsx)(Results_1.Results, { inquiry: inquiry, participants: participants, groupLines: groupLines, futureLines: futureLines, changingLine: changingLine, presentHexagram: presentHexagram, futureHexagram: futureHexagram, participantHexagrams: participantHexagrams, onNewCeremony: () => dispatch({ type: "RESET" }), onModify: () => goTo(CEREMONY_STEP) }));
            default:
                return null;
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-warm", children: [(0, jsx_runtime_1.jsx)(ProgressBar_1.ProgressBar, { currentStep: currentStep, totalSteps: TOTAL_STEPS }), (0, jsx_runtime_1.jsx)(StepTransition_1.StepTransition, { stepKey: currentStep, children: renderStep() }), (0, jsx_runtime_1.jsx)("div", { className: "py-8 border-t border-border", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center space-y-2", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-muted-foreground font-serif", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Co-Inquiry: Group I Ching" }), " \u2014 collective inquiry through ancient wisdom"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "Licensed under GNU AGPL v3.0" })] }) })] }));
}
