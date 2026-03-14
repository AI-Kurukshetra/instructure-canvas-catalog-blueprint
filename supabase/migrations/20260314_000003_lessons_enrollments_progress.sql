-- Video content delivery: lessons, enrollments, lesson_progress.

-- Enrollments: learners enrolled in courses
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique(user_id, course_id)
);

create index if not exists enrollments_user_id_idx on public.enrollments (user_id);
create index if not exists enrollments_course_id_idx on public.enrollments (course_id);

-- Lessons: video content per course
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  video_url text not null,
  duration integer not null default 0,
  "order" integer not null default 0,
  is_preview boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists lessons_course_id_idx on public.lessons (course_id);
create unique index if not exists lessons_course_order_idx on public.lessons (course_id, "order");

-- Lesson progress: last watched position and completion
create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  last_position_seconds integer not null default 0,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

create index if not exists lesson_progress_user_lesson_idx on public.lesson_progress (user_id, lesson_id);

-- RLS
alter table public.enrollments enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;

-- Enrollments: users see and create own; admins manage all
drop policy if exists "Users read own enrollments" on public.enrollments;
create policy "Users read own enrollments"
on public.enrollments for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users insert own enrollment" on public.enrollments;
create policy "Users insert own enrollment"
on public.enrollments for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Admin manage enrollments" on public.enrollments;
create policy "Admin manage enrollments"
on public.enrollments for all to authenticated
using (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
)
with check (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Lessons: public read (we enforce access in API: enrolled or preview)
drop policy if exists "Public read lessons" on public.lessons;
create policy "Public read lessons"
on public.lessons for select to anon, authenticated
using (true);

drop policy if exists "Admin manage lessons" on public.lessons;
create policy "Admin manage lessons"
on public.lessons for all to authenticated
using (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
)
with check (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Lesson progress: users manage own
drop policy if exists "Users manage own progress" on public.lesson_progress;
create policy "Users manage own progress"
on public.lesson_progress for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
