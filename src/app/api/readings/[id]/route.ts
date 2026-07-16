import { NextResponse } from "next/server";

export async function DELETE() {
  return NextResponse.json(
    { error: "Readings cannot be deleted after they are cast." },
    { status: 405 }
  );
}
