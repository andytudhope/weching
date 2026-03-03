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
    const user = db_1.default
        .prepare("SELECT id, password_hash FROM users WHERE username = ?")
        .get(username);
    if (!user) {
        return server_1.NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }
    const valid = await bcryptjs_1.default.compare(password, user.password_hash);
    if (!valid) {
        return server_1.NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }
    const token = await (0, auth_1.createToken)(user.id, username);
    const res = server_1.NextResponse.json({ ok: true });
    res.cookies.set((0, auth_1.sessionCookieOptions)(token));
    return res;
}
