export type Language = "en" | "fa";

export const translations = {
  en: {
    // Navbar
    nav_sessions: "Saved Sessions",
    nav_signIn: "Sign In",
    nav_signUp: "Sign Up",
    nav_signOut: "Sign Out",

    // Landing
    tagline: "Powered by Gemini AI",
    title1: "Your AI",
    title2: "Study Coach",
    subtitle:
      "Paste your notes or upload a PDF. Get a study plan, flashcards, and quiz in seconds.",
    pasteText: "📝 Paste Text",
    uploadPdf: "📄 Upload PDF",
    notesPlaceholder:
      "Paste your lecture notes, textbook summaries, or any study material here...",
    examDateLabel: "Exam Date",
    examDateHint: "(optional — defaults to 7 days)",
    generate: "Generate Study Materials →",
    footerHint: "Study plan · Flashcards · Quiz — all generated instantly, all free",
    advancedToggle: "⚙ Advanced Settings",
    apiKeyLabel: "Your Gemini API Key",
    apiKeyPlaceholder: "AIza...",
    apiKeyHint:
      "Optional — if left empty the app's shared key is used. Get yours free at aistudio.google.com",

    // Dashboard
    dashTitle: "Your Study Materials",
    dashSubtitle_loading: "Generating your materials...",
    dashSubtitle_done: "Everything is ready — let's get studying.",
    newNotes: "← New Notes",
    saveSession: "Save Session",
    sessionSaved: "✓ Saved",
    saving: "Saving...",

    // Tabs
    studyPlan: "Study Plan",
    flashcards: "Flashcards",
    quiz: "Quiz",

    // Study Plan
    overview: "Overview",
    dayPlan: "day study plan",
    sessions: "sessions",

    // Flashcards
    card: "Card",
    of: "of",
    mastered: "mastered",
    markMastered: "Mark as mastered",
    markedMastered: "✓ Mastered",
    allCards: "All cards",
    question: "Question",
    answer: "Answer",
    tapToReveal: "Tap to reveal answer",
    previous: "← Previous",
    next: "Next →",

    // Quiz
    yourScore: "Your Score",
    excellent: "Excellent work! 🎉",
    goodEffort: "Good effort — review the missed ones.",
    keepStudying: "Keep studying — you'll get there!",
    submitQuiz: "Submit Quiz →",
    retakeQuiz: "Retake Quiz ↺",
    answered: "answered",
    explanation: "Explanation",

    // Loading
    loadingPlan: "Building your personalized study plan...",
    loadingFlashcards: "Creating flashcards from your notes...",
    loadingQuiz: "Writing quiz questions for you...",
    loadingGeneric: "Getting things ready...",

    // Auth
    signIn: "Sign In",
    signUp: "Sign Up",
    email: "Email",
    password: "Password",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    checkEmail: "Account created! Check your email to confirm, then sign in.",

    // Sessions page
    sessionsTitle: "Saved Sessions",
    sessionsEmpty:
      "No saved sessions yet. Generate some study materials to get started!",
    restore: "Open",
    deleteSession: "Delete",
    english: "English",
    farsi: "Farsi",

    // Errors & misc
    errorEmpty: "Please provide your notes before continuing.",
    errorShort: "Your notes seem too short. Add more content for better results.",
    errorPdf: "Please upload a valid PDF file.",
    retry: "Try again",
    extracting: "Extracting text from PDF...",
    dropPdf: "Drop your PDF here, or click to browse",
    pdfSupport: "Supports any PDF — textbooks, lecture slides, research papers",
    pagesExtracted: "pages extracted · Click to replace",
  },

  fa: {
    // Navbar
    nav_sessions: "جلسات ذخیره‌شده",
    nav_signIn: "ورود",
    nav_signUp: "ثبت‌نام",
    nav_signOut: "خروج",

    // Landing
    tagline: "با قدرت Gemini AI",
    title1: "دستیار مطالعه",
    title2: "هوشمند شما",
    subtitle:
      "یادداشت‌های خود را وارد کنید یا PDF آپلود کنید. در چند ثانیه برنامه مطالعه، فلش‌کارت و آزمون دریافت کنید.",
    pasteText: "📝 وارد کردن متن",
    uploadPdf: "📄 آپلود PDF",
    notesPlaceholder:
      "یادداشت‌های کلاسی، خلاصه کتاب یا هر محتوای مطالعاتی خود را اینجا وارد کنید...",
    examDateLabel: "تاریخ امتحان",
    examDateHint: "(اختیاری — پیش‌فرض ۷ روز)",
    generate: "تولید محتوای مطالعه ←",
    footerHint: "برنامه مطالعه · فلش‌کارت · آزمون — همه رایگان، همه فوری",
    advancedToggle: "⚙ تنظیمات پیشرفته",
    apiKeyLabel: "کلید Gemini API شما",
    apiKeyPlaceholder: "AIza...",
    apiKeyHint:
      "اختیاری — اگر خالی باشد از کلید مشترک برنامه استفاده می‌شود. کلید رایگان از aistudio.google.com",

    // Dashboard
    dashTitle: "محتوای مطالعاتی شما",
    dashSubtitle_loading: "در حال تولید محتوا...",
    dashSubtitle_done: "همه چیز آماده است — بزن بریم مطالعه!",
    newNotes: "یادداشت‌های جدید →",
    saveSession: "ذخیره جلسه",
    sessionSaved: "✓ ذخیره شد",
    saving: "در حال ذخیره...",

    // Tabs
    studyPlan: "برنامه مطالعه",
    flashcards: "فلش‌کارت",
    quiz: "آزمون",

    // Study Plan
    overview: "مرور کلی",
    dayPlan: "روز برنامه مطالعه",
    sessions: "جلسه",

    // Flashcards
    card: "کارت",
    of: "از",
    mastered: "تسلط یافته",
    markMastered: "علامت‌گذاری تسلط‌یافته",
    markedMastered: "✓ تسلط یافتم",
    allCards: "همه کارت‌ها",
    question: "سوال",
    answer: "جواب",
    tapToReveal: "برای نمایش جواب بزنید",
    previous: "قبلی →",
    next: "← بعدی",

    // Quiz
    yourScore: "امتیاز شما",
    excellent: "عالی بود! 🎉",
    goodEffort: "تلاش خوبی — موارد از دست رفته را مرور کن.",
    keepStudying: "به مطالعه ادامه بده — موفق می‌شی!",
    submitQuiz: "ارسال آزمون ←",
    retakeQuiz: "تکرار آزمون ↺",
    answered: "پاسخ داده شده",
    explanation: "توضیح",

    // Loading
    loadingPlan: "در حال ساخت برنامه مطالعه شخصی‌سازی‌شده...",
    loadingFlashcards: "در حال ساخت فلش‌کارت از یادداشت‌های شما...",
    loadingQuiz: "در حال نوشتن سوالات آزمون برای شما...",
    loadingGeneric: "در حال آماده‌سازی...",

    // Auth
    signIn: "ورود",
    signUp: "ثبت‌نام",
    email: "ایمیل",
    password: "رمز عبور",
    noAccount: "حساب کاربری ندارید؟",
    haveAccount: "قبلاً ثبت‌نام کرده‌اید؟",
    checkEmail: "حساب ایجاد شد! ایمیل خود را برای تأیید بررسی کنید.",

    // Sessions page
    sessionsTitle: "جلسات ذخیره‌شده",
    sessionsEmpty:
      "هنوز جلسه‌ای ذخیره نشده. برای شروع، محتوای مطالعاتی تولید کنید!",
    restore: "باز کردن",
    deleteSession: "حذف",
    english: "انگلیسی",
    farsi: "فارسی",

    // Errors & misc
    errorEmpty: "لطفاً یادداشت‌های خود را وارد کنید.",
    errorShort: "یادداشت‌ها خیلی کوتاه هستند. محتوای بیشتری اضافه کنید.",
    errorPdf: "لطفاً یک فایل PDF معتبر آپلود کنید.",
    retry: "تلاش مجدد",
    extracting: "در حال استخراج متن از PDF...",
    dropPdf: "PDF خود را اینجا رها کنید یا کلیک کنید",
    pdfSupport: "هر PDF — جزوه، اسلاید، مقاله — پشتیبانی می‌شود",
    pagesExtracted: "صفحه استخراج شد · برای تغییر کلیک کنید",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
