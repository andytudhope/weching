"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Participants = Participants;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const button_1 = require("@/components/ui/button");
function Participants({ participants, onParticipantsChange, }) {
    const [name, setName] = (0, react_1.useState)("");
    const addParticipant = () => {
        if (name.trim()) {
            const participant = {
                name: name.trim(),
                numbers: [0, 0, 0, 0, 0, 0, 0],
            };
            onParticipantsChange([...participants, participant]);
            setName("");
        }
    };
    const removeParticipant = (index) => {
        onParticipantsChange(participants.filter((_, i) => i !== index));
    };
    const updateNumber = (participantIndex, numberIndex, value) => {
        const num = parseInt(value) || 0;
        const updated = [...participants];
        updated[participantIndex].numbers[numberIndex] = num;
        onParticipantsChange(updated);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)(input_1.Input, { placeholder: "Participant name", value: name, onChange: (e) => setName(e.target.value), onKeyDown: (e) => e.key === "Enter" && addParticipant(), className: "flex-1" }), (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: addParticipant, className: "px-6", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserPlus, { className: "w-4 h-4 mr-2" }), "Add"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-meditation-glow p-3 rounded-lg", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-muted-foreground font-serif", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Note:" }), " Each participant enters 7 numbers from their seed ritual: 6 pile counts (for hexagram lines) + 1 changing line pile. Individual hexagrams are meaningful bonus by-products, but the group hexagram is the primary focus."] }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid gap-4", children: participants.map((participant, pIndex) => ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "bg-card border-border shadow-soft", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { className: "pb-3", children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center justify-between text-lg font-serif", children: [(0, jsx_runtime_1.jsx)("span", { children: participant.name }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: () => removeParticipant(pIndex), className: "h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) })] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-4 sm:grid-cols-7 gap-2", children: participant.numbers.map((num, nIndex) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center space-y-1", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-xs font-medium text-muted-foreground", children: nIndex < 6 ? `Line ${nIndex + 1}` : "Change" }), (0, jsx_runtime_1.jsx)(input_1.Input, { type: "number", min: "0", value: num || "", onChange: (e) => updateNumber(pIndex, nIndex, e.target.value), className: "w-16 text-center h-10", placeholder: "0" })] }, nIndex))) }) })] }, pIndex))) }), participants.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-8 text-muted-foreground", children: (0, jsx_runtime_1.jsx)("p", { className: "font-serif", children: "Add participants to begin the reading" }) }))] }));
}
