"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/lib/i18n";

export default function Navbar() {
  const { user, signOut, isConfigured } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur-md border-b border-border">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-6 h-6 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-xs">
            ✦
          </span>
          <span
            className="text-text-primary font-body text-sm font-medium hidden sm:block"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            StudyCoach
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <div className="flex gap-0.5 bg-surface border border-border rounded-lg p-0.5">
            {(["en", "fa"] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1 rounded-md text-xs font-body transition-all ${
                  language === lang
                    ? "bg-accent text-bg font-semibold"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {lang === "en" ? "EN" : "FA"}
              </button>
            ))}
          </div>

          {/* Auth controls — only shown when Supabase is configured */}
          {isConfigured && (
            <>
              {user ? (
                <div className="flex items-center gap-1.5">
                  <Link
                    href="/sessions"
                    className="text-text-muted hover:text-text-secondary font-body text-xs border border-border hover:border-accent/40 px-3 py-1.5 rounded-lg transition-all hidden sm:block"
                  >
                    {t("nav_sessions")}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-text-muted hover:text-text-secondary font-body text-xs border border-border hover:border-red-400/40 hover:text-red-400 px-3 py-1.5 rounded-lg transition-all"
                  >
                    {t("nav_signOut")}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    href="/auth?mode=signin"
                    className="text-text-muted hover:text-text-secondary font-body text-xs border border-border hover:border-accent/40 px-3 py-1.5 rounded-lg transition-all"
                  >
                    {t("nav_signIn")}
                  </Link>
                  <Link
                    href="/auth?mode=signup"
                    className="bg-accent hover:bg-accent/90 text-bg font-body text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                  >
                    {t("nav_signUp")}
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
