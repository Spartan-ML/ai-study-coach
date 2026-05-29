-- Run this in your Supabase project under SQL Editor

create table if not exists public.study_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  title       text not null,
  notes_preview text,
  exam_date   text,
  plan        jsonb,
  flashcards  jsonb,
  quiz        jsonb,
  language    text default 'en',
  created_at  timestamptz default now()
);

-- Only the owner can read/write their sessions
alter table public.study_sessions enable row level security;

create policy "Users can manage their own sessions"
  on public.study_sessions
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
