"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  StudyPlan as StudyPlanType,
  Flashcard,
  QuizQuestion,
} from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import StudyPlan from "@/components/StudyPlan";
import Flashcards from "@/components/Flashcards";
import Quiz from "@/components/Quiz";

type Tab = "plan" | "flashcards" | "quiz";
type Status = "idle" | "loading" | "done" | "error";

interface TabState<T> {
  status: Status;
  data: T | null;
  error: string;
}

function Loader({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5">
      <div className="flex gap-2">
        <span className="loader-dot" />
        <span className="loader-dot" />
        <span className="loader-dot" />
      </div>
      <p className="text-text-secondary font-body text-sm">{label}</p>
    </div>
  );
}

function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <span className="text-4xl">⚠️</span>
      <p className="text-text-secondary font-body text-sm max-w-sm">{message}</p>
      <button
        onClick={onRetry}
        className="mt-2 bg-surface border border-border hover:border-accent/50 text-text-secondary hover:text-text-primary font-body text-sm px-6 py-2.5 rounded-xl transition-all"
      >
        Try again
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t, language, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("plan");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const [planState, setPlanState] = useState<TabState<StudyPlanType>>({ status: "idle", data: null, error: "" });
  const [flashcardsState, setFlashcardsState] = useState<TabState<Flashcard[]>>({ status: "idle", data: null, error: "" });
  const [quizState, setQuizState] = useState<TabState<QuizQuestion[]>>({ status: "idle", data: null, error: "" });

  const generateContent = useCallback(async (type: Tab, notes: string, examDate: string) => {
    const setters = { plan: setPlanState, flashcards: setFlashcardsState, quiz: setQuizState };
    const setState = setters[type] as React.Dispatch<React.SetStateAction<TabState<unknown>>>;
    setState({ status: "loading", data: null, error: "" });

    const apiKey = localStorage.getItem("gemini-api-key") || undefined;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, type, examDate, apiKey, language }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState({ status: "error", data: null, error: data.error || "Generation failed." });
        return;
      }
      setState({ status: "done", data, error: "" });
    } catch {
      setState({ status: "error", data: null, error: "Network error. Please check your connection." });
    }
  }, [language]);

  useEffect(() => {
    const notes = sessionStorage.getItem("study-notes");
    const examDate = sessionStorage.getItem("exam-date") || "";

    if (!notes) { router.replace("/"); return; }

    // Check if restoring a saved session
    const savedPlan = sessionStorage.getItem("saved-plan");
    const savedFlashcards = sessionStorage.getItem("saved-flashcards");
    const savedQuiz = sessionStorage.getItem("saved-quiz");

    if (savedPlan && savedFlashcards && savedQuiz) {
      setPlanState({ status: "done", data: JSON.parse(savedPlan), error: "" });
      setFlashcardsState({ status: "done", data: JSON.parse(savedFlashcards), error: "" });
      setQuizState({ status: "done", data: JSON.parse(savedQuiz), error: "" });
      sessionStorage.removeItem("saved-plan");
      sessionStorage.removeItem("saved-flashcards");
      sessionStorage.removeItem("saved-quiz");
      return;
    }

    // Fresh generation
    generateContent("plan", notes, examDate);
    generateContent("flashcards", notes, examDate);
    generateContent("quiz", notes, examDate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = (tab: Tab) => {
    const notes = sessionStorage.getItem("study-notes") || "";
    const examDate = sessionStorage.getItem("exam-date") || "";
    generateContent(tab, notes, examDate);
  };

  const handleSave = async () => {
    if (!supabase || !user) return;
    if (planState.status !== "done" || flashcardsState.status !== "done" || quizState.status !== "done") return;

    setSaveStatus("saving");
    const notes = sessionStorage.getItem("study-notes") || "";
    const examDate = sessionStorage.getItem("exam-date") || "";

    await supabase.from("study_sessions").insert({
      user_id: user.id,
      title: notes.slice(0, 120).trim(),
      notes_preview: notes.slice(0, 500),
      exam_date: examDate,
      plan: planState.data,
      flashcards: flashcardsState.data,
      quiz: quizState.data,
      language,
    });

    setSaveStatus("saved");
  };

  const allDone =
    planState.status === "done" &&
    flashcardsState.status === "done" &&
    quizState.status === "done";

  const TAB_LABELS: { id: Tab; label: string; emoji: string }[] = [
    { id: "plan", label: t("studyPlan"), emoji: "📅" },
    { id: "flashcards", label: t("flashcards"), emoji: "🃏" },
    { id: "quiz", label: t("quiz"), emoji: "📝" },
  ];

  const currentTabStatus = { plan: planState.status, flashcards: flashcardsState.status, quiz: quizState.status }[activeTab];

  return (
    <main className="min-h-screen px-4 py-8 pt-20 md:pt-24" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 fade-up">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary" style={{ fontFamily: "Fraunces, serif" }}>
              {t("dashTitle")}
            </h1>
            <p className="text-text-muted font-body text-sm mt-0.5">
              {allDone ? t("dashSubtitle_done") : t("dashSubtitle_loading")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Save button — shown when logged in + all done */}
            {user && supabase && allDone && saveStatus === "idle" && (
              <button
                onClick={handleSave}
                className="text-text-muted hover:text-accent font-body text-xs border border-border hover:border-accent/50 px-3 py-2 rounded-xl transition-all"
              >
                {t("saveSession")}
              </button>
            )}
            {saveStatus === "saving" && (
              <span className="text-text-muted font-body text-xs px-3 py-2">{t("saving")}</span>
            )}
            {saveStatus === "saved" && (
              <span className="text-accent font-body text-xs px-3 py-2">{t("sessionSaved")}</span>
            )}

            <button
              onClick={() => router.push("/")}
              className="text-text-muted hover:text-text-secondary font-body text-sm border border-border hover:border-accent/40 px-4 py-2 rounded-xl transition-all"
            >
              {t("newNotes")}
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 bg-surface border border-border rounded-2xl p-1.5 mb-8 fade-up" style={{ animationDelay: "60ms" }}>
          {TAB_LABELS.map(({ id, label, emoji }) => {
            const status = { plan: planState, flashcards: flashcardsState, quiz: quizState }[id].status;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-body text-sm transition-all ${
                  activeTab === id ? "bg-bg text-text-primary shadow" : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <span>{emoji}</span>
                <span className="hidden sm:inline">{label}</span>
                {status === "loading" && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
                {status === "done" && activeTab !== id && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                {status === "error" && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="fade-up" style={{ animationDelay: "120ms" }} key={activeTab}>
          {activeTab === "plan" && (
            <>
              {planState.status === "loading" && <Loader label={t("loadingPlan")} />}
              {planState.status === "done" && planState.data && <StudyPlan data={planState.data} />}
              {planState.status === "error" && <ErrorCard message={planState.error} onRetry={() => handleRetry("plan")} />}
            </>
          )}
          {activeTab === "flashcards" && (
            <>
              {flashcardsState.status === "loading" && <Loader label={t("loadingFlashcards")} />}
              {flashcardsState.status === "done" && flashcardsState.data && <Flashcards cards={flashcardsState.data} />}
              {flashcardsState.status === "error" && <ErrorCard message={flashcardsState.error} onRetry={() => handleRetry("flashcards")} />}
            </>
          )}
          {activeTab === "quiz" && (
            <>
              {quizState.status === "loading" && <Loader label={t("loadingQuiz")} />}
              {quizState.status === "done" && quizState.data && <Quiz questions={quizState.data} />}
              {quizState.status === "error" && <ErrorCard message={quizState.error} onRetry={() => handleRetry("quiz")} />}
            </>
          )}
          {currentTabStatus === "idle" && <Loader label={t("loadingGeneric")} />}
        </div>
      </div>
    </main>
  );
}
