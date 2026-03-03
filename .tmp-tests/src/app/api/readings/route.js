"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const db_1 = __importDefault(require("@/lib/db"));
const auth_1 = require("@/lib/auth");
async function GET() {
    const session = await (0, auth_1.getSession)();
    if (!session)
        return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const rows = db_1.default
        .prepare("SELECT id, inquiry, lines, changing_line, date, label, durations, created_at FROM readings WHERE user_id = ? ORDER BY date ASC, created_at ASC")
        .all(session.userId);
    const readings = rows.map((r) => ({
        id: String(r.id),
        inquiry: r.inquiry ?? undefined,
        lines: JSON.parse(r.lines),
        changingLine: r.changing_line ?? null,
        date: r.date,
        label: r.label ?? undefined,
        durations: r.durations ? JSON.parse(r.durations) : undefined,
    }));
    return server_1.NextResponse.json(readings);
}
async function POST(req) {
    const session = await (0, auth_1.getSession)();
    if (!session)
        return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { inquiry, lines, changingLine, date, label, durations } = await req.json();
    if (!lines || !Array.isArray(lines) || lines.length !== 6) {
        return server_1.NextResponse.json({ error: "lines must be boolean[6]" }, { status: 400 });
    }
    if (!date) {
        return server_1.NextResponse.json({ error: "date is required" }, { status: 400 });
    }
    const result = db_1.default
        .prepare("INSERT INTO readings (user_id, inquiry, lines, changing_line, date, label, durations, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
        .run(session.userId, inquiry ?? null, JSON.stringify(lines), changingLine ?? null, date, label ?? null, durations ? JSON.stringify(durations) : null, Date.now());
    return server_1.NextResponse.json({ id: String(result.lastInsertRowid) }, { status: 201 });
}
