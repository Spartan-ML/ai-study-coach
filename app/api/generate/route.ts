// Generation is handled client-side (lib/gemini-client.ts) to avoid
// server-side network restrictions in some regions.
// This stub exists so the file path doesn't cause 404s during transition.
import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json(
    { error: "Generation is handled client-side. This route is unused." },
    { status: 410 }
  );
}
