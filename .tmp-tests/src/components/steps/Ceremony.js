"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ceremony = Ceremony;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const InquiryFormation_1 = require("@/components/InquiryFormation");
const Participants_1 = require("@/components/Participants");
function Ceremony({ inquiry, participants, onInquiryChange, onParticipantsChange, onGenerate, onBack, canGenerate, }) {
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen flex flex-col pt-4", children: (0, jsx_runtime_1.jsx)("div", { className: "flex-1 px-4 py-12", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-3xl mx-auto space-y-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-serif tracking-wide text-primary text-center", children: "The Ceremony" }), (0, jsx_runtime_1.jsx)(InquiryFormation_1.InquiryFormation, { inquiry: inquiry, onInquiryChange: onInquiryChange }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "bg-card border-border shadow-soft", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "font-serif text-primary flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "w-5 h-5 mr-2" }), "Participants"] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(Participants_1.Participants, { participants: participants, onParticipantsChange: onParticipantsChange }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4 pt-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "order-2 sm:order-1", children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", onClick: onBack, className: "font-serif text-muted-foreground hover:text-foreground", children: "Review Guidance" }) }), canGenerate && ((0, jsx_runtime_1.jsx)("div", { className: "order-1 sm:order-2", children: (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: onGenerate, size: "lg", className: "px-8 font-serif text-lg shadow-warm hover:shadow-meditation transition-all duration-300", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { className: "w-5 h-5 mr-2" }), "Generate Co-Inquiry"] }) }))] })] }) }) }));
}
