# 🎓 StudyCoach AI

Turn your notes into a personalized **study plan**, **flashcards**, and **quiz** — powered by Google Gemini AI. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 📄 **PDF Upload** — Upload any PDF (textbook, lecture slides, notes) and extract text automatically
- 📝 **Text Paste** — Or just paste your notes directly
- 📅 **Study Plan** — Day-by-day plan tailored to your exam date
- 🃏 **Flashcards** — 15 Q&A cards with a 3D flip animation and mastery tracking
- 📝 **Quiz** — 10 multiple choice questions with scoring and explanations
- 🆓 **Completely Free** — Uses Google Gemini's free API tier (no credit card required)

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd ai-study-coach
npm install
```

### 2. Get your free Gemini API key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and paste your API key:

```
GEMINI_API_KEY=your_actual_key_here
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
ai-study-coach/
├── app/
│   ├── page.tsx              # Landing page — upload notes
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard — study plan, flashcards, quiz
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts      # Gemini API integration
│   │   └── parse-pdf/
│   │       └── route.ts      # PDF text extraction
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── StudyPlan.tsx         # Study plan UI
│   ├── Flashcards.tsx        # Flashcard viewer with flip animation
│   └── Quiz.tsx              # Quiz with scoring
├── lib/
│   └── types.ts              # Shared TypeScript types
├── .env.example
└── README.md
```

---

## How It Works

1. User pastes notes or uploads a PDF on the landing page
2. PDF uploads are sent to `/api/parse-pdf` which uses `pdf-parse` to extract the text server-side
3. Notes are saved to `sessionStorage` and the user is redirected to `/dashboard`
4. The dashboard fires 3 parallel requests to `/api/generate` (one for each type)
5. Each request sends the notes to the **Gemini 2.5 Flash** model with a structured prompt
6. Gemini returns valid JSON which is parsed and rendered in the appropriate component

---

## Deployment (Vercel — Free)

```bash
npm install -g vercel
vercel
```

Add your `GEMINI_API_KEY` in the Vercel dashboard under **Settings → Environment Variables**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | Google Gemini 2.5 Flash |
| PDF Parsing | pdf-parse |
| Hosting | Vercel (free tier) |
| Cost | **$0** |
