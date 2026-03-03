"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadWelcome = ThreadWelcome;
const jsx_runtime_1 = require("react/jsx-runtime");
const link_1 = __importDefault(require("next/link"));
const button_1 = require("@/components/ui/button");
function ThreadWelcome({ onBegin, username }) {
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen flex items-center justify-center px-4 bg-gradient-warm", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-2xl mx-auto text-center space-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-serif font-bold text-primary tracking-wide", children: "thread of selves" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-lg text-muted-foreground font-serif", children: ["welcome, ", username] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-5 text-base text-foreground/80 font-serif leading-relaxed max-w-lg mx-auto", children: [(0, jsx_runtime_1.jsx)("p", { children: "This is a different kind of collective reading. The participants are your many selves at different moments \u2014 each with its own question, each receiving its own hexagram." }), (0, jsx_runtime_1.jsx)("p", { children: "The I Ching is not consulted here as a prediction machine. It is approached as an operator: the hexagram you receive describes the structural quality of your inquiry at this moment. Across time, the sequence of hexagrams traces a path through a 64-dimensional space \u2014 and that path has its own geometry." }), (0, jsx_runtime_1.jsx)("p", { children: "Your thread is not oriented toward an outcome. It is a record of where you have stood, and the shape of the movement between those standings." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center gap-4 pt-4", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { onClick: onBegin, size: "lg", className: "px-10 py-6 font-serif text-lg shadow-warm hover:shadow-meditation transition-all duration-300", children: "Enter the Thread" }), (0, jsx_runtime_1.jsx)(link_1.default, { href: "/", className: "font-serif text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 underline underline-offset-4 decoration-muted-foreground/30", children: "\u2190 group ceremony" })] })] }) }));
}
