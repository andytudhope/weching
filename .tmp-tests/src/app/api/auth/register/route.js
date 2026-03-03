"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("@/lib/db"));
const auth_1 = require("@/lib/auth");
async function POST(req) {
    const { username, password } = await req.json();
    if (!username || username.length < 3) {
        return server_1.NextResponse.json({ error: "Username must be at least 3 characters" }, { status: 400 });
    }
    if (!password || password.length < 8) {
        return server_1.NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }
    const existing = db_1.default
        .prepare("SELECT id FROM users WHERE username = ?")
        .get(username);
    if (existing) {
        return server_1.NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }
    const password_hash = await bcryptjs_1.default.hash(password, 12);
    const result = db_1.default
        .prepare("INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)")
        .run(username, password_hash, Date.now());
    const token = await (0, auth_1.createToken)(result.lastInsertRowid, username);
    const res = server_1.NextResponse.json({ ok: true });
    res.cookies.set((0, auth_1.sessionCookieOptions)(token));
    return res;
}
