"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE = DELETE;
const server_1 = require("next/server");
const db_1 = __importDefault(require("@/lib/db"));
const auth_1 = require("@/lib/auth");
async function DELETE(_req, { params }) {
    const session = await (0, auth_1.getSession)();
    if (!session)
        return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
        return server_1.NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    // Only allow deleting own readings
    const row = db_1.default
        .prepare("SELECT user_id FROM readings WHERE id = ?")
        .get(numId);
    if (!row) {
        return server_1.NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (row.user_id !== session.userId) {
        return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    db_1.default.prepare("DELETE FROM readings WHERE id = ?").run(numId);
    return server_1.NextResponse.json({ ok: true });
}
