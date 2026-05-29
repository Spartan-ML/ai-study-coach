import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { GenerateRequest } from "@/lib/types";
import { Language } from "@/lib/i18n";

function buildPrompt(req: GenerateRequest): string {
  const { notes, type, examDate, language = "en" } = req;
  const inFarsi = language === "fa";
  const langInstruction = inFarsi
    ? "You MUST respond entirely in Farsi (Persian). All text, including topics, tasks, questions, answers, and explanations must be in Farsi."
    : "Respond in English.";

  if (type === "plan") {
    const dateStr = examDate ? `The exam is on ${examDate}.` : "The exam is in 7 days.";
    return `You are an expert study coach. ${langInstruction}
Based on the following notes, create a structured study plan. ${dateStr}

NOTES:
${notes}

Return ONLY a valid JSON object (no markdown, no explanation):
{
  "summary": "2-sentence overview of key topics",
  "totalDays": <integer>,
  "sessions": [
    {
      "day": 1,
      "topic": "Topic name",
      "duration": "2 hours",
      "focusArea": "What to focus on",
      "tasks": ["Task 1", "Task 2", "Task 3"]
    }
  ]
}`;
  }

  if (type === "flashcards") {
    return `You are an expert educator. ${langInstruction}
Based on the following notes, create 15 high-quality flashcards.

NOTES:
${notes}

Return ONLY a valid JSON array (no markdown, no explanation):
[
  {
    "id": "1",
    "front": "Clear question or concept prompt",
    "back": "Concise but complete answer"
  }
]`;
  }

  if (type === "quiz") {
    return `You are an expert educator. ${langInstruction}
Based on the following notes, create 10 multiple-choice questions.

NOTES:
${notes}

Return ONLY a valid JSON array (no markdown, no explanation):
[
  {
    "id": "1",
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A",
    "explanation": "Why this answer is correct"
  }
]

Rules:
- "answer" must be an exact copy of one of the strings in "options"
- One clearly correct answer and three plausible distractors`;
  }

  throw new Error(`Unknown generation type: ${type}`);
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();

    if (!body.notes || !body.type) {
      return NextResponse.json({ error: "Missing required fields: notes and type" }, { status: 400 });
    }
    if (body.notes.trim().length < 50) {
      return NextResponse.json({ error: "Notes are too short." }, { status: 400 });
    }

    // Use the user's API key if provided, otherwise fall back to the server key
    const apiKey = body.apiKey?.trim() || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "No Gemini API key configured." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
    });

    const prompt = buildPrompt({ ...body, language: body.language as Language });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("[/api/generate] Error:", error);
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
