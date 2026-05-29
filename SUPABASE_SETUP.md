# Setting up Supabase (Auth + Sessions)

Auth and saved sessions are **optional**. The app works fully without them — just skip this if you don't need it.

## 1. Create a free Supabase project

Go to https://supabase.com → New project (free tier is enough).

## 2. Run this SQL to create the sessions table

In your Supabase dashboard → **SQL Editor**, paste and run:

```sql
create table study_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  title       text,
  notes_preview text,
  exam_date   text,
  plan        jsonb,
  flashcards  jsonb,
  quiz        jsonb,
  language    text default 'en',
  created_at  timestamptz default now()
);

-- Only the owner can read/write their own sessions
alter table study_sessions enable row level security;

create policy "Users can manage own sessions"
  on study_sessions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

## 3. Add your keys to .env.local

Go to **Project Settings → API** and copy:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

That's it! Restart `npm run dev` and the Sign In / Sign Up buttons will appear in the navbar.
