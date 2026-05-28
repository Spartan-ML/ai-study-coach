import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "File must be a PDF" },
        { status: 400 }
      );
    }

    // 20MB limit
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 20MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await pdfParse(buffer);

    if (!data.text || data.text.trim().length < 50) {
      return NextResponse.json(
        {
          error:
            "Could not extract readable text from this PDF. Try pasting the text manually.",
        },
        { status: 422 }
      );
    }

    // Trim to ~100k characters to avoid hitting context limits
    const trimmedText = data.text.slice(0, 100_000);

    return NextResponse.json({
      text: trimmedText,
      pages: data.numpages,
      truncated: data.text.length > 100_000,
    });
  } catch (error) {
    console.error("[/api/parse-pdf] Error:", error);
    return NextResponse.json(
      { error: "Failed to parse PDF. Make sure it is a valid, readable PDF." },
      { status: 500 }
    );
  }
}
