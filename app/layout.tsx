import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyCoach AI",
  description:
    "Turn your notes into a personalized study plan, flashcards, and quiz — powered by AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
