"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginForm = LoginForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const card_1 = require("@/components/ui/card");
function LoginForm() {
    const router = (0, navigation_1.useRouter)();
    const [username, setUsername] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (res.ok) {
                router.push("/thread");
            }
            else {
                const data = await res.json();
                setError(data.error ?? "Login failed");
            }
        }
        catch {
            setError("Network error — please try again");
        }
        finally {
            setLoading(false);
        }
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen flex items-center justify-center px-4 bg-gradient-warm", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "w-full max-w-sm bg-card border-border shadow-meditation", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "font-serif text-primary text-center text-2xl", children: "Thread of Selves" }), (0, jsx_runtime_1.jsx)("p", { className: "text-center text-sm text-muted-foreground font-serif", children: "sign in to your record" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-serif text-foreground/80", children: "Username" }), (0, jsx_runtime_1.jsx)(input_1.Input, { value: username, onChange: (e) => setUsername(e.target.value), autoComplete: "username", required: true, className: "font-serif" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-serif text-foreground/80", children: "Password" }), (0, jsx_runtime_1.jsx)(input_1.Input, { type: "password", value: password, onChange: (e) => setPassword(e.target.value), autoComplete: "current-password", required: true, className: "font-serif" })] }), error && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-destructive font-serif", children: error })), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "submit", disabled: loading, className: "w-full font-serif shadow-warm hover:shadow-meditation transition-all duration-300", children: loading ? "Signing in…" : "Sign In" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-center text-sm text-muted-foreground font-serif", children: ["New here?", " ", (0, jsx_runtime_1.jsx)("a", { href: "/register", className: "underline underline-offset-4 hover:text-foreground transition-colors", children: "Create an account" })] })] }) })] }) }));
}
