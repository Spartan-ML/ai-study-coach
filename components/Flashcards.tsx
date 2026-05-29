"use client";

import { useState } from "react";
import { Flashcard } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Flashcards({ cards }: { cards: Flashcard[] }) {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mastered, setMastered] = useState<Set<string>>(new Set());

  const card = cards[current];
  const total = cards.length;

  const goNext = () => { setFlipped(false); setTimeout(() => setCurrent((c) => (c + 1) % total), 150); };
  const goPrev = () => { setFlipped(false); setTimeout(() => setCurrent((c) => (c - 1 + total) % total), 150); };

  const toggleMastered = () => {
    setMastered((prev) => {
      const next = new Set(prev);
      if (next.has(card.id)) next.delete(card.id); else next.add(card.id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between text-xs font-body text-text-muted mb-2">
          <span>{t("card")} {current + 1} {t("of")} {total}</span>
          <span className="text-accent">{mastered.size} {t("mastered")}</span>
        </div>
        <div className="w-full h-1 bg-bg rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all duration-300" style={{ width: `${((current + 1) / total) * 100}%` }} />
        </div>
      </div>

      <div className="card-scene w-full" style={{ height: "260px" }}>
        <div className={`card-inner cursor-pointer ${flipped ? "flipped" : ""}`} onClick={() => setFlipped((f) => !f)}>
          <div className="card-face bg-surface border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <p className="text-text-muted font-body text-xs uppercase tracking-widest mb-4">{t("question")}</p>
            <p className="text-text-primary font-body text-lg leading-relaxed" style={{ fontFamily: "Fraunces, serif" }}>{card.front}</p>
            <p className="text-text-muted font-body text-xs mt-6 animate-pulse">{t("tapToReveal")}</p>
          </div>
          <div className="card-face card-back bg-accent/10 border border-accent/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <p className="text-accent font-body text-xs uppercase tracking-widest mb-4">{t("answer")}</p>
            <p className="text-text-primary font-body text-base leading-relaxed">{card.back}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button onClick={goPrev} className="flex-1 bg-bg border border-border hover:border-accent/50 text-text-secondary hover:text-text-primary font-body text-sm py-3 rounded-xl transition-all">
          {t("previous")}
        </button>
        <button onClick={toggleMastered} className={`px-5 py-3 rounded-xl font-body text-sm transition-all border ${mastered.has(card.id) ? "bg-accent/20 border-accent/40 text-accent" : "bg-bg border-border text-text-muted hover:text-text-secondary"}`}>
          {mastered.has(card.id) ? t("markedMastered") : t("markMastered")}
        </button>
        <button onClick={goNext} className="flex-1 bg-bg border border-border hover:border-accent/50 text-text-secondary hover:text-text-primary font-body text-sm py-3 rounded-xl transition-all">
          {t("next")}
        </button>
      </div>

      <div>
        <p className="text-text-muted font-body text-xs uppercase tracking-widest mb-3">{t("allCards")}</p>
        <div className="flex flex-wrap gap-2">
          {cards.map((c, i) => (
            <button key={c.id} onClick={() => { setFlipped(false); setCurrent(i); }}
              className={`w-8 h-8 rounded-lg text-xs font-body transition-all ${i === current ? "bg-accent text-bg font-medium" : mastered.has(c.id) ? "bg-accent/20 text-accent border border-accent/30" : "bg-bg border border-border text-text-muted hover:border-accent/50"}`}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
