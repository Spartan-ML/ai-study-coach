import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { GenerateRequest } from "@/lib/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function buildPrompt(req: GenerateRequest): string {
  const { notes, type, examDate } = req;

  if (type === "plan") {
    const dateStr = examDate
      ? `The exam is on ${examDate}.`
      : "The exam is in 7 days.";

    return `You are an expert study coach. Based on the following notes, create a structured study plan.
${dateStr}

NOTES:
${notes}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "summary": "A 2-sentence overview of the key topics to master",
  "totalDays": <integer: number of days until exam>,
  "sessions": [
    {
      "day": 1,
      "topic": "Topic name",
      "duration": "2 hours",
      "focusArea": "What specifically to focus on this day",
      "tasks": ["Specific task 1", "Specific task 2", "Specific task 3"]
    }
  ]
}

Create one session per day. Be specific, actionable, and realistic.`;
  }

  if (type === "flashcards") {
    return `You are an expert educator. Based on the following notes, create 15 high-quality flashcards covering key concepts.

NOTES:
${notes}

Return ONLY a valid JSON array with this exact structure (no markdown, no explanation):
[
  {
    "id": "1",
    "front": "Clear, specific question or concept prompt",
    "back": "Concise but complete answer or explanation"
  }
]

Prioritize: definitions, key facts, relationships between concepts, and common exam topics.`;
  }

  if (type === "quiz") {
    return `You are an expert educator. Based on the following notes, create 10 multiple-choice questions that test genuine understanding.

NOTES:
${notes}

Return ONLY a valid JSON array with this exact structure (no markdown, no explanation):
[
  {
    "id": "1",
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A",
    "explanation": "Brief explanation of why this answer is correct and others are not"
  }
]

Rules:
- The "answer" field must be an exact copy of one of the strings in "options"
- Include one clearly correct answer and three plausible distractors
- Test understanding, not just memorization`;
  }

  throw new Error(`Unknown generation type: ${type}`);
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();

    if (!body.notes || !body.type) {
      return NextResponse.json(
        { error: "Missing required fields: notes and type" },
        { status: 400 }
      );
    }

    if (body.notes.trim().length < 50) {
      return NextResponse.json(
        { error: "Notes are too short. Please provide more content." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const prompt = buildPrompt(body);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Parse and validate JSON
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("[/api/generate] Error:", error);
    const message =
      error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
