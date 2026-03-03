"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const auth_1 = require("@/lib/auth");
async function GET() {
    const session = await (0, auth_1.getSession)();
    if (!session)
        return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return server_1.NextResponse.json({ userId: session.userId, username: session.username });
}
