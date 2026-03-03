import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import type { InquiryFragment, CircleParticipant } from "@/types/circle";

interface CircleRow {
  id: string;
  created_at: number;
  inquiry: string | null;
  fragments: string;
  participants: string;
}

type PatchBody =
  | { type: "fragment"; text: string; author?: string }
  | { type: "participant"; deviceId: string; name?: string; numbers: number[] }
  | { type: "inquiry"; text: string };

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const row = db
    .prepare("SELECT id, created_at, inquiry, fragments, participants FROM circles WHERE id = ?")
    .get(id) as CircleRow | undefined;

  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    id: row.id,
    createdAt: row.created_at,
    inquiry: row.inquiry ?? undefined,
    fragments: JSON.parse(row.fragments) as InquiryFragment[],
    participants: JSON.parse(row.participants) as CircleParticipant[],
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const row = db
    .prepare("SELECT fragments, participants FROM circles WHERE id = ?")
    .get(id) as Pick<CircleRow, "fragments" | "participants"> | undefined;

  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = (await req.json()) as PatchBody;

  if (body.type === "fragment") {
    if (!body.text || typeof body.text !== "string" || !body.text.trim()) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }
    const fragments = JSON.parse(row.fragments) as InquiryFragment[];
    fragments.push({
      text: body.text.trim(),
      author: body.author?.trim() || undefined,
      addedAt: Date.now(),
    });
    db.prepare("UPDATE circles SET fragments = ? WHERE id = ?").run(
      JSON.stringify(fragments),
      id
    );
    return NextResponse.json({ ok: true });
  }

  if (body.type === "inquiry") {
    if (typeof body.text !== "string") {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }
    db.prepare("UPDATE circles SET inquiry = ? WHERE id = ?").run(
      body.text.trim() || null,
      id
    );
    return NextResponse.json({ ok: true });
  }

  if (body.type === "participant") {
    if (
      !body.deviceId ||
      !Array.isArray(body.numbers) ||
      body.numbers.length !== 7
    ) {
      return NextResponse.json(
        { error: "deviceId and numbers[7] are required" },
        { status: 400 }
      );
    }
    const participants = JSON.parse(row.participants) as CircleParticipant[];
    const idx = participants.findIndex((p) => p.deviceId === body.deviceId);
    const entry: CircleParticipant = {
      deviceId: body.deviceId,
      name: body.name?.trim() || undefined,
      numbers: body.numbers,
      submittedAt: Date.now(),
    };
    if (idx >= 0) {
      participants[idx] = entry;
    } else {
      participants.push(entry);
    }
    db.prepare("UPDATE circles SET participants = ? WHERE id = ?").run(
      JSON.stringify(participants),
      id
    );
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown patch type" }, { status: 400 });
}
