"use client";

import { useState } from "react";
import { QuizQuestion } from "@/lib/types";

type AnswerMap = Record<string, string>;

export default function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [current, setCurrent] = useState(0);

  const question = questions[current];
  const total = questions.length;

  const score = submitted
    ? questions.filter((q) => answers[q.id] === q.answer).length
    : 0;

  const scorePercent = Math.round((score / total) * 100);

  const handleSelect = (option: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [question.id]: option }));
  };

  const isCorrect = (q: QuizQuestion, option: string) =>
    submitted && option === q.answer;
  const isWrong = (q: QuizQuestion, option: string) =>
    submitted && answers[q.id] === option && option !== q.answer;

  const allAnswered = questions.every((q) => answers[q.id]);

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setCurrent(0);
  };

  return (
    <div className="space-y-6">
      {/* Score banner (after submit) */}
      {submitted && (
        <div
          className={`rounded-2xl p-5 border fade-up ${
            scorePercent >= 80
              ? "bg-green-900/20 border-green-700/40"
              : scorePercent >= 50
              ? "bg-accent/10 border-accent/30"
              : "bg-red-900/20 border-red-700/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted font-body text-xs uppercase tracking-widest mb-1">
                Your Score
              </p>
              <p
                className="text-4xl font-display font-semibold text-text-primary"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                {score}
                <span className="text-text-secondary text-2xl">/{total}</span>
              </p>
              <p className="text-text-secondary font-body text-sm mt-1">
                {scorePercent >= 80
                  ? "Excellent work! 🎉"
                  : scorePercent >= 50
                  ? "Good effort — review the missed ones."
                  : "Keep studying — you'll get there!"}
              </p>
            </div>
            <div
              className="w-20 h-20 rounded-full border-4 flex items-center justify-center text-xl font-body font-bold"
              style={{
                borderColor:
                  scorePercent >= 80
                    ? "#4ade80"
                    : scorePercent >= 50
                    ? "#f0b429"
                    : "#f87171",
                color:
                  scorePercent >= 80
                    ? "#4ade80"
                    : scorePercent >= 50
                    ? "#f0b429"
                    : "#f87171",
              }}
            >
              {scorePercent}%
            </div>
          </div>
        </div>
      )}

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs font-body text-text-muted mb-2">
          <span>
            Question {current + 1} of {total}
          </span>
          {!submitted && (
            <span>
              {Object.keys(answers).length} answered
            </span>
          )}
        </div>
        <div className="w-full h-1 bg-bg rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-surface border border-border rounded-2xl p-6">
        <p className="text-text-primary font-body text-base leading-relaxed mb-5">
          {question.question}
        </p>

        <div className="space-y-2.5">
          {question.options.map((option) => {
            const selected = answers[question.id] === option;
            const correct = isCorrect(question, option);
            const wrong = isWrong(question, option);

            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-4 py-3.5 rounded-xl font-body text-sm transition-all border ${
                  correct
                    ? "bg-green-900/30 border-green-600/50 text-green-300"
                    : wrong
                    ? "bg-red-900/30 border-red-600/50 text-red-300"
                    : selected
                    ? "bg-accent/15 border-accent/50 text-text-primary"
                    : "bg-bg border-border text-text-secondary hover:border-accent/40 hover:text-text-primary"
                } ${submitted ? "cursor-default" : "cursor-pointer"}`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 ${
                      correct
                        ? "border-green-500 bg-green-600 text-white"
                        : wrong
                        ? "border-red-500 bg-red-600 text-white"
                        : selected
                        ? "border-accent bg-accent text-bg"
                        : "border-border"
                    }`}
                  >
                    {correct ? "✓" : wrong ? "✗" : ""}
                  </span>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation (after submit) */}
        {submitted && (
          <div className="mt-4 pt-4 border-t border-border fade-up">
            <p className="text-accent font-body text-xs uppercase tracking-widest mb-1.5">
              Explanation
            </p>
            <p className="text-text-secondary font-body text-sm leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="flex-1 bg-bg border border-border hover:border-accent/50 disabled:opacity-30 text-text-secondary font-body text-sm py-3 rounded-xl transition-all"
        >
          ← Previous
        </button>

        {current < total - 1 ? (
          <button
            onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
            className="flex-1 bg-bg border border-border hover:border-accent/50 text-text-secondary font-body text-sm py-3 rounded-xl transition-all"
          >
            Next →
          </button>
        ) : !submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            disabled={!allAnswered}
            className="flex-1 bg-accent hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed text-bg font-body font-semibold text-sm py-3 rounded-xl transition-all"
          >
            Submit Quiz →
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="flex-1 bg-bg border border-border hover:border-accent/50 text-text-secondary font-body text-sm py-3 rounded-xl transition-all"
          >
            Retake Quiz ↺
          </button>
        )}
      </div>

      {/* Question dots */}
      <div className="flex flex-wrap gap-2">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrent(i)}
            className={`w-8 h-8 rounded-lg text-xs font-body transition-all ${
              i === current
                ? "bg-accent text-bg font-medium"
                : submitted
                ? answers[q.id] === q.answer
                  ? "bg-green-900/40 text-green-400 border border-green-700/40"
                  : "bg-red-900/40 text-red-400 border border-red-700/40"
                : answers[q.id]
                ? "bg-accent/20 text-accent border border-accent/30"
                : "bg-bg border border-border text-text-muted hover:border-accent/50"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
