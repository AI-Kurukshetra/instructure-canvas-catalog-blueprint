-- Allow admin checks via either app_metadata.role or user_metadata.role.

drop policy if exists "Admin manage categories" on public.categories;
create policy "Admin manage categories"
on public.categories
for all
to authenticated
using (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
)
with check (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

drop policy if exists "Admin manage courses" on public.courses;
create policy "Admin manage courses"
on public.courses
for all
to authenticated
using (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
)
with check (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

