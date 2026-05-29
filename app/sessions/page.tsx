"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { SavedSession } from "@/lib/types";

export default function SessionsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { t, isRTL } = useLanguage();
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/auth?mode=signin");
      return;
    }
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const fetchSessions = async () => {
    if (!supabase || !user) return;
    const { data } = await supabase
      .from("study_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setSessions(data || []);
    setLoading(false);
  };

  const handleOpen = (session: SavedSession) => {
    // Store the full session data for the dashboard to restore
    sessionStorage.setItem("study-notes", session.notes_preview || "");
    sessionStorage.setItem("exam-date", session.exam_date || "");
    sessionStorage.setItem("saved-plan", JSON.stringify(session.plan));
    sessionStorage.setItem(
      "saved-flashcards",
      JSON.stringify(session.flashcards)
    );
    sessionStorage.setItem("saved-quiz", JSON.stringify(session.quiz));
    router.push("/dashboard");
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    await supabase.from("study_sessions").delete().eq("id", id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="flex gap-2">
          <span className="loader-dot" />
          <span className="loader-dot" />
          <span className="loader-dot" />
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen px-4 pt-20 pb-12"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 fade-up">
          <h1
            className="text-2xl font-semibold text-text-primary"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            {t("sessionsTitle")}
          </h1>
          <button
            onClick={() => router.push("/")}
            className="text-text-muted hover:text-text-secondary font-body text-sm border border-border hover:border-accent/40 px-4 py-2 rounded-xl transition-all"
          >
            ← New
          </button>
        </div>

        {/* Sessions list */}
        {sessions.length === 0 ? (
          <div
            className="text-center py-24 fade-up"
            style={{ animationDelay: "60ms" }}
          >
            <p className="text-text-muted font-body text-sm leading-relaxed max-w-xs mx-auto">
              {t("sessionsEmpty")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session, i) => (
              <div
                key={session.id}
                className="bg-surface border border-border rounded-2xl p-5 fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-text-primary font-body text-sm font-medium leading-snug line-clamp-2 mb-2">
                      {session.title}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-text-muted font-body text-xs">
                        {new Date(session.created_at).toLocaleDateString()}
                      </span>
                      <span className="text-text-muted font-body text-xs bg-bg border border-border rounded-full px-2 py-0.5">
                        {session.language === "fa"
                          ? t("farsi")
                          : t("english")}
                      </span>
                      {session.exam_date && (
                        <span className="text-text-muted font-body text-xs">
                          📅 {session.exam_date}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleOpen(session)}
                      className="bg-accent hover:bg-accent/90 text-bg font-body text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    >
                      {t("restore")}
                    </button>
                    <button
                      onClick={() => handleDelete(session.id)}
                      className="text-text-muted hover:text-red-400 font-body text-xs border border-border hover:border-red-400/40 px-3 py-1.5 rounded-lg transition-all"
                    >
                      {t("deleteSession")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
