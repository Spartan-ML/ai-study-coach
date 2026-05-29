"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HomePage() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [notes, setNotes] = useState("");
  const [examDate, setExamDate] = useState("");
  const [inputMode, setInputMode] = useState<"text" | "pdf">("text");
  const [isParsing, setIsParsing] = useState(false);
  const [pdfInfo, setPdfInfo] = useState<{ name: string; pages: number } | null>(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Advanced settings
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("gemini-api-key");
    if (saved) setApiKey(saved);
  }, []);

  const handleApiKeyChange = (val: string) => {
    setApiKey(val);
    if (val.trim()) {
      localStorage.setItem("gemini-api-key", val.trim());
    } else {
      localStorage.removeItem("gemini-api-key");
    }
  };

  const handlePdfUpload = async (file: File) => {
    if (!file || file.type !== "application/pdf") {
      setError(t("errorPdf"));
      return;
    }
    setIsParsing(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/parse-pdf", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) { setError(data.error || t("errorPdf")); return; }
      setNotes(data.text);
      setPdfInfo({ name: file.name, pages: data.pages });
      if (data.truncated) {
        setError(`Note: Only the first ~100,000 characters were loaded (${data.pages} pages detected).`);
      }
    } catch {
      setError(t("errorPdf"));
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handlePdfUpload(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    if (!notes.trim()) { setError(t("errorEmpty")); return; }
    if (notes.trim().length < 50) { setError(t("errorShort")); return; }
    sessionStorage.setItem("study-notes", notes);
    sessionStorage.setItem("exam-date", examDate);
    // Remove any leftover saved session data
    sessionStorage.removeItem("saved-plan");
    sessionStorage.removeItem("saved-flashcards");
    sessionStorage.removeItem("saved-quiz");
    router.push("/dashboard");
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 pt-24"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="text-center mb-12 fade-up" style={{ animationDelay: "0ms" }}>
        <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-text-secondary text-xs font-body tracking-widest uppercase">
            {t("tagline")}
          </span>
        </div>
        <h1
          className="font-display text-5xl md:text-6xl font-semibold text-text-primary mb-4 leading-tight"
          style={{ fontFamily: "Fraunces, serif" }}
        >
          {t("title1")}
          <br />
          <span className="text-accent italic">{t("title2")}</span>
        </h1>
        <p className="text-text-secondary font-body text-lg max-w-md mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-2xl bg-surface border border-border rounded-2xl p-8 fade-up"
        style={{ animationDelay: "100ms" }}
      >
        {/* Input mode toggle */}
        <div className="flex gap-1 bg-bg rounded-xl p-1 mb-6 w-fit">
          {(["text", "pdf"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => { setInputMode(mode); setError(""); if (mode === "text") setPdfInfo(null); }}
              className={`px-5 py-2 rounded-lg text-sm font-body font-medium transition-all ${
                inputMode === mode
                  ? "bg-surface text-text-primary shadow"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {mode === "text" ? t("pasteText") : t("uploadPdf")}
            </button>
          ))}
        </div>

        {/* Input area */}
        {inputMode === "text" ? (
          <textarea
            value={notes}
            onChange={(e) => { setNotes(e.target.value); setError(""); }}
            placeholder={t("notesPlaceholder")}
            className="w-full h-56 bg-bg border border-border rounded-xl p-4 text-text-primary font-body text-sm resize-none focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted"
          />
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full h-56 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
              isDragging
                ? "border-accent bg-accent/5"
                : "border-border hover:border-accent/50 hover:bg-bg/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePdfUpload(f); }}
            />
            {isParsing ? (
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="loader-dot" /><span className="loader-dot" /><span className="loader-dot" />
                </div>
                <p className="text-text-secondary text-sm font-body">{t("extracting")}</p>
              </div>
            ) : pdfInfo ? (
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="text-3xl">✅</span>
                <p className="text-text-primary font-body font-medium text-sm">{pdfInfo.name}</p>
                <p className="text-text-secondary text-xs font-body">
                  {pdfInfo.pages} {t("pagesExtracted")}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center px-8">
                <span className="text-4xl mb-1">📄</span>
                <p className="text-text-primary font-body text-sm font-medium">{t("dropPdf")}</p>
                <p className="text-text-muted font-body text-xs">{t("pdfSupport")}</p>
              </div>
            )}
          </div>
        )}

        {error && <p className="mt-3 text-sm font-body text-amber-400/80">{error}</p>}

        {/* Exam date */}
        <div className="mt-5">
          <label className="block text-text-secondary font-body text-xs uppercase tracking-widest mb-2">
            {t("examDateLabel")}{" "}
            <span className="normal-case tracking-normal text-text-muted">{t("examDateHint")}</span>
          </label>
          <input
            type="date"
            value={examDate}
            min={today}
            onChange={(e) => setExamDate(e.target.value)}
            className="bg-bg border border-border rounded-xl px-4 py-2.5 text-text-primary font-body text-sm focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Advanced settings (API key) */}
        <div className="mt-5 border-t border-border pt-4">
          <button
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex items-center gap-2 text-text-muted hover:text-text-secondary font-body text-xs transition-colors"
          >
            <span className={`transition-transform ${showAdvanced ? "rotate-90" : ""}`}>▶</span>
            {t("advancedToggle")}
          </button>

          {showAdvanced && (
            <div className="mt-3 space-y-1.5 fade-up">
              <label className="block text-text-secondary font-body text-xs uppercase tracking-widest">
                {t("apiKeyLabel")}
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder={t("apiKeyPlaceholder")}
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-text-primary font-body text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted"
              />
              <p className="text-text-muted font-body text-xs leading-relaxed">{t("apiKeyHint")}</p>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isParsing || (!notes && !pdfInfo)}
          className="mt-6 w-full bg-accent hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed text-bg font-body font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] text-sm tracking-wide"
        >
          {t("generate")}
        </button>
      </div>

      <p className="mt-8 text-text-muted text-xs font-body text-center fade-up" style={{ animationDelay: "200ms" }}>
        {t("footerHint")}
      </p>
    </main>
  );
}
