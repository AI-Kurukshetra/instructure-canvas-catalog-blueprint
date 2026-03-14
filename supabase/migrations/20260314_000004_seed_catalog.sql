-- Seed catalog data so public deployments have content by default.

insert into public.categories (name, slug)
values
  ('Tech skills', 'tech-skills'),
  ('Finance', 'finance'),
  ('Healthcare', 'healthcare'),
  ('Leadership', 'leadership'),
  ('Compliance', 'compliance')
on conflict (slug) do update
set name = excluded.name;

with seed as (
  select *
  from (
    values
      (
        'typescript-for-busy-professionals',
        'TypeScript for Busy Professionals',
        'Write safer JavaScript with TypeScript fundamentals, practical patterns, and a refactor-driven workflow you can ship immediately.',
        'A. Patel',
        array['Basic JavaScript']::text[],
        'tech-skills',
        'Beginner',
        270,
        5900,
        'USD',
        null,
        'published',
        1840,
        4.7,
        312
      ),
      (
        'modern-react-patterns-hooks-to-architecture',
        'Modern React Patterns: Hooks to Architecture',
        'Build resilient UI systems with composition patterns, state boundaries, and performance-minded React techniques.',
        'K. Shah',
        array['React basics', 'JavaScript fundamentals']::text[],
        'tech-skills',
        'Intermediate',
        320,
        7900,
        'USD',
        null,
        'published',
        980,
        4.6,
        204
      ),
      (
        'cash-flow-and-forecasting-for-operators',
        'Cash Flow and Forecasting for Operators',
        'Understand cash flow, build forecasts, and make decisions with simple, repeatable models that survive real-world complexity.',
        'M. Rivera',
        array['Basic accounting']::text[],
        'finance',
        'Intermediate',
        210,
        7900,
        'USD',
        null,
        'published',
        620,
        4.6,
        128
      ),
      (
        'excel-modeling-from-spreadsheets-to-decisions',
        'Excel Modeling: From Spreadsheets to Decisions',
        'Create clean models, avoid common spreadsheet traps, and communicate assumptions with confidence.',
        'R. Singh',
        array['Comfort with Excel']::text[],
        'finance',
        'Beginner',
        180,
        4900,
        'USD',
        null,
        'published',
        480,
        4.5,
        96
      ),
      (
        'healthcare-documentation-and-privacy-essentials',
        'Healthcare Documentation and Privacy Essentials',
        'Learn practical privacy and documentation workflows, and understand what audits look for in healthcare environments.',
        'S. Nguyen',
        array[]::text[],
        'healthcare',
        'Beginner',
        165,
        4900,
        'USD',
        null,
        'published',
        410,
        4.5,
        89
      ),
      (
        'leadership-feedback-clarity-and-trust',
        'Leadership: Feedback, Clarity, and Trust',
        'Run effective 1:1s, give feedback that lands, set expectations, and build trust through systems over heroics.',
        'J. Kim',
        array['People management experience']::text[],
        'leadership',
        'Advanced',
        200,
        9900,
        'USD',
        null,
        'published',
        980,
        4.8,
        201
      ),
      (
        'compliance-101-policies-proof-and-practice',
        'Compliance 101: Policies, Proof, and Practice',
        'Understand the basics of compliance programs: policies, evidence, risk, and how teams stay audit-ready.',
        'D. Morgan',
        array[]::text[],
        'compliance',
        'Beginner',
        150,
        5900,
        'USD',
        null,
        'published',
        360,
        4.4,
        72
      ),
      (
        'gdpr-for-product-teams',
        'GDPR for Product Teams',
        'Translate GDPR concepts into product requirements, consent flows, data retention, and user rights workflows.',
        'L. Chen',
        array['Basic product development']::text[],
        'compliance',
        'Intermediate',
        190,
        7900,
        'USD',
        null,
        'published',
        520,
        4.6,
        118
      )
  ) as v(
    slug,
    title,
    description,
    instructor_name,
    prerequisites,
    category_slug,
    level,
    duration_minutes,
    price_cents,
    currency,
    thumbnail_url,
    status,
    enrolled_count,
    rating,
    rating_count
  )
)
insert into public.courses (
  slug,
  title,
  description,
  instructor_name,
  prerequisites,
  category_id,
  level,
  duration_minutes,
  price_cents,
  currency,
  thumbnail_url,
  status,
  enrolled_count,
  rating,
  rating_count
)
select
  s.slug,
  s.title,
  s.description,
  s.instructor_name,
  s.prerequisites,
  c.id as category_id,
  s.level,
  s.duration_minutes,
  s.price_cents,
  s.currency,
  s.thumbnail_url,
  s.status,
  s.enrolled_count,
  s.rating,
  s.rating_count
from seed s
left join public.categories c on c.slug = s.category_slug
on conflict (slug) do update
set
  title = excluded.title,
  description = excluded.description,
  instructor_name = excluded.instructor_name,
  prerequisites = excluded.prerequisites,
  category_id = excluded.category_id,
  level = excluded.level,
  duration_minutes = excluded.duration_minutes,
  price_cents = excluded.price_cents,
  currency = excluded.currency,
  thumbnail_url = excluded.thumbnail_url,
  status = excluded.status,
  enrolled_count = excluded.enrolled_count,
  rating = excluded.rating,
  rating_count = excluded.rating_count;

with lesson_seed as (
  select *
  from (
    values
      ('typescript-for-busy-professionals', 1, 'Setup and project structure', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 1080, true),
      ('typescript-for-busy-professionals', 2, 'Types you actually use', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 1440, false),
      ('typescript-for-busy-professionals', 3, 'Narrowing and inference', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 1680, false),
      ('modern-react-patterns-hooks-to-architecture', 1, 'Hooks deep dive', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 1200, true),
      ('modern-react-patterns-hooks-to-architecture', 2, 'Composition patterns', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 1500, false),
      ('cash-flow-and-forecasting-for-operators', 1, 'Cash flow basics', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 900, true),
      ('cash-flow-and-forecasting-for-operators', 2, 'Forecasting models', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 1200, false),
      ('excel-modeling-from-spreadsheets-to-decisions', 1, 'Model structure', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 960, true),
      ('healthcare-documentation-and-privacy-essentials', 1, 'Privacy and documentation', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 1020, true),
      ('healthcare-documentation-and-privacy-essentials', 2, 'Policies and workflows', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 1320, false),
      ('healthcare-documentation-and-privacy-essentials', 3, 'Audits and reporting', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 1140, false),
      ('leadership-feedback-clarity-and-trust', 1, 'Clarity: goals and expectations', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 1260, true),
      ('leadership-feedback-clarity-and-trust', 2, 'Feedback frameworks', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 1440, false),
      ('leadership-feedback-clarity-and-trust', 3, 'Trust: systems over heroics', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 1140, false),
      ('compliance-101-policies-proof-and-practice', 1, 'Compliance basics', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 840, true),
      ('compliance-101-policies-proof-and-practice', 2, 'Proof and evidence', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 1020, false),
      ('gdpr-for-product-teams', 1, 'Consent and legal basis', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 960, true),
      ('gdpr-for-product-teams', 2, 'Data retention and rights', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 1140, false)
  ) as v(course_slug, order_index, title, video_url, duration_seconds, is_preview)
),
resolved as (
  select v.course_slug, v.order_index, v.title, v.video_url, v.duration_seconds, v.is_preview, c.id as course_id
  from lesson_seed v
  join public.courses c on c.slug = v.course_slug
)
insert into public.lessons (course_id, title, video_url, duration, "order", is_preview)
select course_id, title, video_url, duration_seconds, order_index, is_preview
from resolved
on conflict (course_id, "order") do update
set
  title = excluded.title,
  video_url = excluded.video_url,
  duration = excluded.duration,
  is_preview = excluded.is_preview;
