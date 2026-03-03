import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import db from "@/lib/db";

export async function POST() {
  const id = randomBytes(6).toString("hex");
  const createdAt = Date.now();

  db.prepare(
    "INSERT INTO circles (id, created_at, fragments, participants) VALUES (?, ?, '[]', '[]')"
  ).run(id, createdAt);

  return NextResponse.json({ id }, { status: 201 });
}
