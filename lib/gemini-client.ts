import { GenerateRequest } from "./types";
import { Language } from "./i18n";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

function buildPrompt(req: GenerateRequest): string {
  const { notes, type, examDate, language = "en" } = req;
  const langInstruction =
    language === "fa"
      ? "You MUST respond entirely in Farsi (Persian). All text including topics, tasks, questions, answers, and explanations must be in Farsi."
      : "Respond in English.";

  if (type === "plan") {
    const dateStr = examDate
      ? `The exam is on ${examDate}.`
      : "The exam is in 7 days.";
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

export async function generateWithGemini(
  req: GenerateRequest,
  apiKey: string
): Promise<unknown> {
  const prompt = buildPrompt({ ...req, language: req.language as Language });

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg =
      (err as { error?: { message?: string } })?.error?.message ||
      `HTTP ${response.status}`;
    throw new Error(msg);
  }

  const data = await response.json();
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  if (!text) throw new Error("Empty response from Gemini");

  return JSON.parse(text);
}
