"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const auth_1 = require("@/lib/auth");
async function POST() {
    const res = server_1.NextResponse.json({ ok: true });
    res.cookies.set((0, auth_1.clearCookieOptions)());
    return res;
}
