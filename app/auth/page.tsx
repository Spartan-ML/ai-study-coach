"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signUp, user, isConfigured } = useAuth();
  const { t, isRTL } = useLanguage();

  const [mode, setMode] = useState<"signin" | "signup">(
    searchParams.get("mode") === "signup" ? "signup" : "signin"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  useEffect(() => {
    if (!isConfigured) router.replace("/");
  }, [isConfigured, router]);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    const { error } =
      mode === "signin"
        ? await signIn(email, password)
        : await signUp(email, password);

    if (error) {
      setError(error);
    } else if (mode === "signup") {
      setSuccess(t("checkEmail"));
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-sm fade-up">
        {/* Header */}
        <div className="text-center mb-8">
          <span
            className="text-3xl font-semibold text-text-primary block mb-1"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            StudyCoach
          </span>
          <p className="text-text-muted font-body text-sm">
            {mode === "signin" ? t("noAccount") : t("haveAccount")}{" "}
            <button
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError("");
                setSuccess("");
              }}
              className="text-accent hover:underline"
            >
              {mode === "signin" ? t("signUp") : t("signIn")}
            </button>
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-1 bg-surface border border-border rounded-2xl p-1.5 mb-5">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2.5 rounded-xl font-body text-sm transition-all ${
                mode === m
                  ? "bg-bg text-text-primary shadow"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {m === "signin" ? t("signIn") : t("signUp")}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-text-secondary font-body text-xs uppercase tracking-widest mb-1.5">
              {t("email")}
            </label>
            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-text-primary font-body text-sm focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-text-secondary font-body text-xs uppercase tracking-widest mb-1.5">
              {t("password")}
            </label>
            <input
              type="password"
              value={password}
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-text-primary font-body text-sm focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 font-body text-xs leading-relaxed">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-400 font-body text-xs leading-relaxed">
              {success}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-bg font-body font-semibold py-3 rounded-xl transition-all text-sm mt-2"
          >
            {loading
              ? "..."
              : mode === "signin"
              ? t("signIn")
              : t("signUp")}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
