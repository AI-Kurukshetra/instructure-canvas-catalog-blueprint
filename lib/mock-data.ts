export type Course = {
  id: string;
  title: string;
  description: string;
  category: "Tech" | "Finance" | "Health" | "Leadership" | "Compliance";
  level: "Beginner" | "Intermediate" | "Advanced";
  durationHours: number;
  priceUsd: number;
  rating: number;
  ratingCount: number;
  enrolledCount: number;
  instructorName: string;
  prerequisites: string[];
  thumbnailGradient: string;
  lessonIds: string[];
};

export type Lesson = {
  id: string;
  courseId: string;
  title: string;
  durationMinutes: number;
  order: number;
  isPreview: boolean;
};

export type Certificate = {
  id: string;
  uid: string;
  courseId: string;
  courseTitle: string;
  learnerName: string;
  issuedAtIso: string;
};

export const categories = ["Tech", "Finance", "Health", "Leadership", "Compliance"] as const;

export const courses: Course[] = [
  {
    id: "ts-101",
    title: "TypeScript for Busy Professionals",
    description:
      "Write safer JavaScript with types, modern tooling, and practical patterns you can ship.",
    category: "Tech",
    level: "Beginner",
    durationHours: 4.5,
    priceUsd: 59,
    rating: 4.7,
    ratingCount: 312,
    enrolledCount: 1840,
    instructorName: "A. Patel",
    prerequisites: ["Basic JavaScript"],
    thumbnailGradient:
      "radial-gradient(800px 320px at 20% 20%, rgba(56,189,248,.35), transparent 60%), radial-gradient(800px 320px at 90% 80%, rgba(244,63,94,.22), transparent 60%)",
    lessonIds: ["ls-ts-1", "ls-ts-2", "ls-ts-3", "ls-ts-4", "ls-ts-5"],
  },
  {
    id: "fin-201",
    title: "Finance Fundamentals: Cash Flow and Forecasting",
    description:
      "Understand cash flow, build forecasts, and make decisions with simple, repeatable models.",
    category: "Finance",
    level: "Intermediate",
    durationHours: 3.25,
    priceUsd: 79,
    rating: 4.6,
    ratingCount: 128,
    enrolledCount: 620,
    instructorName: "M. Rivera",
    prerequisites: ["Basic accounting"],
    thumbnailGradient:
      "radial-gradient(820px 360px at 20% 20%, rgba(34,197,94,.28), transparent 60%), radial-gradient(820px 360px at 90% 80%, rgba(251,191,36,.18), transparent 60%)",
    lessonIds: ["ls-fin-1", "ls-fin-2", "ls-fin-3", "ls-fin-4"],
  },
  {
    id: "hlth-110",
    title: "Healthcare Compliance Essentials",
    description:
      "Learn the fundamentals of compliance, documentation, and privacy in healthcare settings.",
    category: "Health",
    level: "Beginner",
    durationHours: 2.75,
    priceUsd: 49,
    rating: 4.5,
    ratingCount: 89,
    enrolledCount: 410,
    instructorName: "S. Nguyen",
    prerequisites: [],
    thumbnailGradient:
      "radial-gradient(820px 360px at 20% 20%, rgba(148,163,184,.22), transparent 60%), radial-gradient(820px 360px at 90% 80%, rgba(56,189,248,.18), transparent 60%)",
    lessonIds: ["ls-hlth-1", "ls-hlth-2", "ls-hlth-3"],
  },
  {
    id: "ldr-301",
    title: "Leadership: Feedback, Clarity, and Trust",
    description:
      "Run 1:1s, give feedback that lands, and set expectations your team can execute against.",
    category: "Leadership",
    level: "Advanced",
    durationHours: 3.0,
    priceUsd: 99,
    rating: 4.8,
    ratingCount: 201,
    enrolledCount: 980,
    instructorName: "J. Kim",
    prerequisites: ["People management experience"],
    thumbnailGradient:
      "radial-gradient(820px 360px at 20% 20%, rgba(168,85,247,.24), transparent 60%), radial-gradient(820px 360px at 90% 80%, rgba(244,63,94,.16), transparent 60%)",
    lessonIds: ["ls-ldr-1", "ls-ldr-2", "ls-ldr-3", "ls-ldr-4"],
  },
];

export const lessons: Lesson[] = [
  { id: "ls-ts-1", courseId: "ts-101", title: "Setup and project structure", durationMinutes: 18, order: 1, isPreview: true },
  { id: "ls-ts-2", courseId: "ts-101", title: "Types you actually use", durationMinutes: 24, order: 2, isPreview: false },
  { id: "ls-ts-3", courseId: "ts-101", title: "Narrowing and inference", durationMinutes: 28, order: 3, isPreview: false },
  { id: "ls-ts-4", courseId: "ts-101", title: "APIs and validation", durationMinutes: 22, order: 4, isPreview: false },
  { id: "ls-ts-5", courseId: "ts-101", title: "Refactor a real feature", durationMinutes: 30, order: 5, isPreview: false },

  { id: "ls-fin-1", courseId: "fin-201", title: "Cash flow in plain terms", durationMinutes: 20, order: 1, isPreview: true },
  { id: "ls-fin-2", courseId: "fin-201", title: "Forecasting basics", durationMinutes: 26, order: 2, isPreview: false },
  { id: "ls-fin-3", courseId: "fin-201", title: "Scenario planning", durationMinutes: 22, order: 3, isPreview: false },
  { id: "ls-fin-4", courseId: "fin-201", title: "Decision-making with constraints", durationMinutes: 18, order: 4, isPreview: false },

  { id: "ls-hlth-1", courseId: "hlth-110", title: "Privacy and documentation", durationMinutes: 17, order: 1, isPreview: true },
  { id: "ls-hlth-2", courseId: "hlth-110", title: "Policies and workflows", durationMinutes: 22, order: 2, isPreview: false },
  { id: "ls-hlth-3", courseId: "hlth-110", title: "Audits and reporting", durationMinutes: 19, order: 3, isPreview: false },

  { id: "ls-ldr-1", courseId: "ldr-301", title: "Clarity: goals and expectations", durationMinutes: 21, order: 1, isPreview: true },
  { id: "ls-ldr-2", courseId: "ldr-301", title: "Feedback frameworks", durationMinutes: 24, order: 2, isPreview: false },
  { id: "ls-ldr-3", courseId: "ldr-301", title: "Hard conversations", durationMinutes: 23, order: 3, isPreview: false },
  { id: "ls-ldr-4", courseId: "ldr-301", title: "Trust: systems over heroics", durationMinutes: 19, order: 4, isPreview: false },
];

export const sampleCertificates: Certificate[] = [
  {
    id: "cert-1",
    uid: "CC-TS-101-9F32A",
    courseId: "ts-101",
    courseTitle: "TypeScript for Busy Professionals",
    learnerName: "Sam Taylor",
    issuedAtIso: "2026-03-11T10:15:00.000Z",
  },
];

export const findCourse = (courseId: string) => courses.find((c) => c.id === courseId) ?? null;
export const findLesson = (lessonId: string) => lessons.find((l) => l.id === lessonId) ?? null;
export const lessonsForCourse = (courseId: string) =>
  lessons
    .filter((l) => l.courseId === courseId)
    .sort((a, b) => a.order - b.order);

