"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [notes, setNotes] = useState("");
  const [examDate, setExamDate] = useState("");
  const [inputMode, setInputMode] = useState<"text" | "pdf">("text");
  const [isParsing, setIsParsing] = useState(false);
  const [pdfInfo, setPdfInfo] = useState<{
    name: string;
    pages: number;
  } | null>(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handlePdfUpload = async (file: File) => {
    if (!file || file.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }

    setIsParsing(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to parse PDF.");
        return;
      }

      setNotes(data.text);
      setPdfInfo({ name: file.name, pages: data.pages });
      if (data.truncated) {
        setError(
          `Note: This PDF is very large. Only the first ~100,000 characters were loaded (${data.pages} pages detected).`
        );
      }
    } catch {
      setError("Something went wrong while parsing the PDF. Try again.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handlePdfUpload(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleSubmit = () => {
    if (!notes.trim()) {
      setError("Please provide your notes before continuing.");
      return;
    }
    if (notes.trim().length < 50) {
      setError("Your notes seem too short. Add more content for better results.");
      return;
    }

    // Store in sessionStorage and navigate to dashboard
    sessionStorage.setItem("study-notes", notes);
    sessionStorage.setItem("exam-date", examDate);
    router.push("/dashboard");
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* Header */}
      <div
        className="text-center mb-12 fade-up"
        style={{ animationDelay: "0ms" }}
      >
        <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-text-secondary text-xs font-body tracking-widest uppercase">
            Powered by Gemini AI
          </span>
        </div>
        <h1
          className="font-display text-5xl md:text-6xl font-semibold text-text-primary mb-4 leading-tight"
          style={{ fontFamily: "Fraunces, serif" }}
        >
          Your AI
          <br />
          <span className="text-accent italic">Study Coach</span>
        </h1>
        <p className="text-text-secondary font-body text-lg max-w-md mx-auto leading-relaxed">
          Paste your notes or upload a PDF. Get a study plan, flashcards, and
          quiz in seconds.
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
              onClick={() => {
                setInputMode(mode);
                setError("");
                if (mode === "text") setPdfInfo(null);
              }}
              className={`px-5 py-2 rounded-lg text-sm font-body font-medium transition-all ${
                inputMode === mode
                  ? "bg-surface text-text-primary shadow"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {mode === "text" ? "📝 Paste Text" : "📄 Upload PDF"}
            </button>
          ))}
        </div>

        {/* Input area */}
        {inputMode === "text" ? (
          <textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              setError("");
            }}
            placeholder="Paste your lecture notes, textbook summaries, or any study material here..."
            className="w-full h-56 bg-bg border border-border rounded-xl p-4 text-text-primary font-body text-sm resize-none focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted"
          />
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
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
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePdfUpload(file);
              }}
            />
            {isParsing ? (
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="loader-dot" />
                  <span className="loader-dot" />
                  <span className="loader-dot" />
                </div>
                <p className="text-text-secondary text-sm font-body">
                  Extracting text from PDF...
                </p>
              </div>
            ) : pdfInfo ? (
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="text-3xl">✅</span>
                <p className="text-text-primary font-body font-medium text-sm">
                  {pdfInfo.name}
                </p>
                <p className="text-text-secondary text-xs font-body">
                  {pdfInfo.pages} pages extracted · Click to replace
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center px-8">
                <span className="text-4xl mb-1">📄</span>
                <p className="text-text-primary font-body text-sm font-medium">
                  Drop your PDF here, or click to browse
                </p>
                <p className="text-text-muted font-body text-xs">
                  Supports any PDF — textbooks, lecture slides, research papers
                </p>
              </div>
            )}
          </div>
        )}

        {/* Error message */}
        {error && (
          <p className="mt-3 text-sm font-body text-amber-400/80">{error}</p>
        )}

        {/* Exam date */}
        <div className="mt-5">
          <label className="block text-text-secondary font-body text-xs uppercase tracking-widest mb-2">
            Exam Date{" "}
            <span className="normal-case tracking-normal text-text-muted">
              (optional — defaults to 7 days)
            </span>
          </label>
          <input
            type="date"
            value={examDate}
            min={today}
            onChange={(e) => setExamDate(e.target.value)}
            className="bg-bg border border-border rounded-xl px-4 py-2.5 text-text-primary font-body text-sm focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isParsing || (!notes && !pdfInfo)}
          className="mt-6 w-full bg-accent hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed text-bg font-body font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] text-sm tracking-wide"
        >
          Generate Study Materials →
        </button>
      </div>

      {/* Footer hint */}
      <p
        className="mt-8 text-text-muted text-xs font-body text-center fade-up"
        style={{ animationDelay: "200ms" }}
      >
        Study plan · Flashcards · Quiz — all generated instantly, all free
      </p>
    </main>
  );
}
