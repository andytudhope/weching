import { NextResponse } from "next/server";
import db from "@/lib/db";

interface CircleRow {
  id: string;
  created_at: number;
  method: string;
  parent_ids: string;
  inquiry: string | null;
  fragments: string;
  participants: string;
}

export async function GET() {
  const rows = db
    .prepare(
      "SELECT id, created_at, method, parent_ids, inquiry, fragments, participants FROM circles ORDER BY created_at DESC"
    )
    .all() as CircleRow[];

  const circles = rows.map((row) => {
    const fragments = JSON.parse(row.fragments) as { text: string; author?: string; addedAt: number }[];
    const participants = JSON.parse(row.participants) as { deviceId: string }[];
    return {
      id: row.id,
      createdAt: row.created_at,
      method: (row.method === "seeds" ? "seeds" : "timing") as "seeds" | "timing",
      parentIds: JSON.parse(row.parent_ids ?? "[]") as string[],
      inquiry: row.inquiry ?? undefined,
      // Strip author — these are the public-facing anonymous seeds
      fragments: fragments.map((f) => ({ text: f.text, addedAt: f.addedAt })),
      participantCount: participants.length,
    };
  });

  return NextResponse.json({ circles });
}
