"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InquiryFormation = InquiryFormation;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const card_1 = require("@/components/ui/card");
const textarea_1 = require("@/components/ui/textarea");
function InquiryFormation({ inquiry, onInquiryChange, }) {
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "bg-card border-border shadow-soft", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "font-serif text-primary flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MessageCircle, { className: "w-5 h-5 mr-2" }), "Shared Inquiry"] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(textarea_1.Textarea, { placeholder: "Enter your group's shared inquiry... (questions, statements, observations, or poetic reflections)", value: inquiry, onChange: (e) => onInquiryChange(e.target.value), className: "min-h-[120px] font-serif text-foreground placeholder:text-muted-foreground border-border focus:border-ring resize-none" }), (0, jsx_runtime_1.jsx)("div", { className: "bg-meditation-glow p-3 rounded-lg", children: (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground font-serif italic", children: "The more specific and heartfelt your inquiry, the more profound the response will be." }) })] }) })] }));
}
