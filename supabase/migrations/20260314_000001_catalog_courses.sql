-- ===============================
-- CATALOG DEMO SEED DATA
-- ===============================

-- Insert categories
insert into public.categories (name, slug)
values
  ('Tech Skills', 'tech-skills'),
  ('Finance', 'finance'),
  ('Healthcare', 'healthcare'),
  ('Leadership', 'leadership'),
  ('Compliance', 'compliance')
on conflict (slug) do update
set name = excluded.name;


-- ===============================
-- COURSES
-- ===============================

with seed as (
select *
from (
values

-- TECH SKILLS
(
'typescript-for-busy-professionals',
'TypeScript for Busy Professionals',
'Learn practical TypeScript patterns for building safer JavaScript applications.',
'A. Patel',
array['Basic JavaScript']::text[],
'tech-skills',
'Beginner',
270,
5900,
'USD',
'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
'published',
1840,
4.7,
312
),

(
'modern-react-patterns-hooks-to-architecture',
'Modern React Patterns',
'Advanced composition patterns, performance optimization, and scalable UI architecture.',
'K. Shah',
array['React basics']::text[],
'tech-skills',
'Intermediate',
320,
7900,
'USD',
'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
'published',
980,
4.6,
204
),

(
'nextjs-fullstack-production',
'Next.js Fullstack Production Apps',
'Build fullstack applications using server components, caching, and deployment best practices.',
'D. Verma',
array['React basics']::text[],
'tech-skills',
'Advanced',
360,
9900,
'USD',
'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
'published',
1420,
4.8,
301
),

(
'nodejs-api-design-scalability',
'Node.js API Design and Scalability',
'Design robust REST APIs with authentication, caching, and observability.',
'S. Mehta',
array['JavaScript fundamentals']::text[],
'tech-skills',
'Intermediate',
300,
7900,
'USD',
'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
'published',
880,
4.6,
156
),

-- FINANCE
(
'cash-flow-and-forecasting-for-operators',
'Cash Flow and Forecasting for Operators',
'Build simple financial forecasting models and understand operational cash flow.',
'M. Rivera',
array['Basic accounting']::text[],
'finance',
'Intermediate',
210,
7900,
'USD',
'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c',
'published',
620,
4.6,
128
),

(
'excel-modeling-from-spreadsheets-to-decisions',
'Excel Modeling: From Spreadsheets to Decisions',
'Create financial models and make confident business decisions using Excel.',
'R. Singh',
array['Basic Excel knowledge']::text[],
'finance',
'Beginner',
180,
4900,
'USD',
'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
'published',
480,
4.5,
96
),

(
'corporate-financial-analysis',
'Corporate Financial Analysis',
'Understand financial statements, profitability, and capital allocation decisions.',
'P. Desai',
array['Basic accounting']::text[],
'finance',
'Intermediate',
270,
7900,
'USD',
'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
'published',
690,
4.6,
133
),

(
'product-finance-for-founders',
'Product Finance for Startup Founders',
'Understand CAC, LTV, runway planning, and startup financial models.',
'N. Alvarez',
array['Basic accounting']::text[],
'finance',
'Intermediate',
240,
8900,
'USD',
'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
'published',
540,
4.7,
120
),

-- HEALTHCARE
(
'healthcare-documentation-and-privacy-essentials',
'Healthcare Documentation and Privacy Essentials',
'Learn documentation workflows and privacy regulations in healthcare.',
'S. Nguyen',
array[]::text[],
'healthcare',
'Beginner',
165,
4900,
'USD',
'https://images.unsplash.com/photo-1580281658629-4a7c1f84f2a1',
'published',
410,
4.5,
89
),

(
'clinical-workflow-optimization',
'Clinical Workflow Optimization',
'Improve patient workflows and operational efficiency in healthcare systems.',
'Dr. A. Kapoor',
array[]::text[],
'healthcare',
'Intermediate',
210,
6900,
'USD',
'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5',
'published',
350,
4.4,
67
),

(
'patient-data-security-healthcare',
'Patient Data Security in Healthcare Systems',
'Understand patient data protection, encryption, and compliance frameworks.',
'Dr. L. Park',
array['Basic IT knowledge']::text[],
'healthcare',
'Intermediate',
190,
6900,
'USD',
'https://images.unsplash.com/photo-1579684385127-1ef15d508118',
'published',
420,
4.5,
82
),

-- LEADERSHIP
(
'leadership-feedback-clarity-and-trust',
'Leadership: Feedback, Clarity, and Trust',
'Run effective 1:1 meetings and build trust through structured leadership.',
'J. Kim',
array['People management experience']::text[],
'leadership',
'Advanced',
200,
9900,
'USD',
'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
'published',
980,
4.8,
201
),

(
'high-performance-team-management',
'High Performance Team Management',
'Build high performing teams through accountability frameworks.',
'C. Walker',
array['People management experience']::text[],
'leadership',
'Intermediate',
210,
8900,
'USD',
'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
'published',
680,
4.6,
110
),

(
'strategic-decision-making-leaders',
'Strategic Decision Making for Leaders',
'Develop structured decision frameworks and strategic planning methods.',
'A. Banerjee',
array['People management experience']::text[],
'leadership',
'Advanced',
230,
9900,
'USD',
'https://images.unsplash.com/photo-1551836022-d5d88e9218df',
'published',
760,
4.7,
140
),

-- COMPLIANCE
(
'compliance-101-policies-proof-and-practice',
'Compliance 101',
'Understand policies, audits, and regulatory compliance basics.',
'D. Morgan',
array[]::text[],
'compliance',
'Beginner',
150,
5900,
'USD',
'https://images.unsplash.com/photo-1554224154-26032ffc0d07',
'published',
360,
4.4,
72
),

(
'gdpr-for-product-teams',
'GDPR for Product Teams',
'Implement GDPR compliant data flows inside product architecture.',
'L. Chen',
array['Basic product development']::text[],
'compliance',
'Intermediate',
190,
7900,
'USD',
'https://images.unsplash.com/photo-1581093588401-16ecf6f08e6b',
'published',
520,
4.6,
118
),

(
'enterprise-risk-management',
'Enterprise Risk Management',
'Learn operational risk frameworks and governance practices.',
'M. Thornton',
array[]::text[],
'compliance',
'Intermediate',
220,
7900,
'USD',
'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
'published',
510,
4.5,
93
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
c.id,
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
category_id = excluded.category_id;