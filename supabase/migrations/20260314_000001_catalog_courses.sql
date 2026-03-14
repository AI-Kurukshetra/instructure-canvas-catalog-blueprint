-- Catalog MVP: categories + courses with public read on published courses and admin write access.

create extension if not exists pgcrypto;

-- Helper: updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  instructor_name text not null,
  prerequisites text[] not null default '{}'::text[],
  category_id uuid references public.categories(id) on delete set null,
  level text not null default 'Beginner',
  duration_minutes integer not null default 0,
  price_cents integer not null default 0,
  currency text not null default 'USD',
  thumbnail_url text,
  status text not null default 'draft',
  enrolled_count integer not null default 0,
  rating numeric(3,2) not null default 0,
  rating_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists courses_category_id_idx on public.courses (category_id);
create index if not exists courses_status_idx on public.courses (status);

drop trigger if exists set_courses_updated_at on public.courses;
create trigger set_courses_updated_at
before update on public.courses
for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.courses enable row level security;

-- Public reads
drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories"
on public.categories
for select
to anon, authenticated
using (true);

drop policy if exists "Public read published courses" on public.courses;
create policy "Public read published courses"
on public.courses
for select
to anon, authenticated
using (status = 'published');

-- Admin writes: assumes `app_metadata.role = 'admin'` is present in the JWT.
drop policy if exists "Admin manage categories" on public.categories;
create policy "Admin manage categories"
on public.categories
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admin manage courses" on public.courses;
create policy "Admin manage courses"
on public.courses
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

