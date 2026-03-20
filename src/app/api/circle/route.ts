import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const method = body.method === "seeds" ? "seeds" : "timing";
  const parentIds = Array.isArray(body.parentIds) ? body.parentIds.filter((p: unknown) => typeof p === "string") : [];

  // Anonymous seed fragments from parent circles (no author field)
  const fragments = Array.isArray(body.fragments)
    ? body.fragments
        .filter((f: unknown) => f && typeof (f as { text?: unknown }).text === "string")
        .map((f: { text: string; addedAt?: number }) => ({
          text: f.text.trim(),
          addedAt: typeof f.addedAt === "number" ? f.addedAt : Date.now(),
        }))
        .filter((f: { text: string }) => f.text.length > 0)
    : [];

  const inquiry =
    typeof body.inquiry === "string" && body.inquiry.trim()
      ? body.inquiry.trim()
      : null;

  const id = randomBytes(6).toString("hex");
  const createdAt = Date.now();

  db.prepare(
    "INSERT INTO circles (id, created_at, method, parent_ids, inquiry, fragments, participants) VALUES (?, ?, ?, ?, ?, ?, '[]')"
  ).run(id, createdAt, method, JSON.stringify(parentIds), inquiry, JSON.stringify(fragments));

  return NextResponse.json({ id }, { status: 201 });
}
