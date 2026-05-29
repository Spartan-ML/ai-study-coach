import { Language } from "./i18n";

export interface StudySession {
  day: number;
  topic: string;
  duration: string;
  focusArea: string;
  tasks: string[];
}

export interface StudyPlan {
  summary: string;
  totalDays: number;
  sessions: StudySession[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export type GenerateType = "plan" | "flashcards" | "quiz";

export interface GenerateRequest {
  notes: string;
  type: GenerateType;
  examDate?: string;
  apiKey?: string;
  language?: Language;
}

export interface SavedSession {
  id: string;
  user_id: string;
  title: string;
  notes_preview: string;
  exam_date: string;
  plan: StudyPlan | null;
  flashcards: Flashcard[] | null;
  quiz: QuizQuestion[] | null;
  language: Language;
  created_at: string;
}
