import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

interface ReadingRow {
  id: number;
  inquiry: string | null;
  lines: string;
  changing_line: number | null;
  date: string;
  label: string | null;
  durations: string | null;
  created_at: number;
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = db
    .prepare(
      "SELECT id, inquiry, lines, changing_line, date, label, durations, created_at FROM readings WHERE user_id = ? ORDER BY date ASC, created_at ASC"
    )
    .all(session.userId) as ReadingRow[];

  const readings = rows.map((r) => ({
    id: String(r.id),
    inquiry: r.inquiry ?? undefined,
    lines: JSON.parse(r.lines) as boolean[],
    changingLine: r.changing_line ?? null,
    date: r.date,
    label: r.label ?? undefined,
    durations: r.durations ? (JSON.parse(r.durations) as number[]) : undefined,
  }));

  return NextResponse.json(readings);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { inquiry, lines, changingLine, date, label, durations } =
    await req.json();

  if (!lines || !Array.isArray(lines) || lines.length !== 6) {
    return NextResponse.json({ error: "lines must be boolean[6]" }, { status: 400 });
  }
  if (!date) {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }

  const result = db
    .prepare(
      "INSERT INTO readings (user_id, inquiry, lines, changing_line, date, label, durations, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .run(
      session.userId,
      inquiry ?? null,
      JSON.stringify(lines),
      changingLine ?? null,
      date,
      label ?? null,
      durations ? JSON.stringify(durations) : null,
      Date.now()
    ) as { lastInsertRowid: number };

  return NextResponse.json({ id: String(result.lastInsertRowid) }, { status: 201 });
}
