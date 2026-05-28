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
}
