# AGENTS.md

This file provides instructions for AI agents (Codex CLI) working in this repository.

---

# Project Overview

This is a **Next.js application using Supabase as the backend**.

The project uses:
- Next.js App Router
- TypeScript
- Supabase (Auth + Database + Storage)
- Tailwind CSS for styling

The goal is to maintain **clean, maintainable, and scalable code**.

---

# Tech Stack

Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

Backend / Services
- Supabase
- Supabase Auth
- Supabase Postgres Database
- Supabase Storage

Tooling
- ESLint
- Prettier
- npm

Runtime
- Node.js >= 18

---

# Development Commands

Install dependencies

npm install

Run development server

npm run dev

Build project

npm run build

Start production server

npm run start

Lint project

npm run lint

---

# Environment Variables

All environment variables must be stored in:

.env.local

Required variables:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

Never commit secret keys to the repository.

---

# Project Structure

src/
  app/                → Next.js routes and pages
  components/         → reusable UI components
  lib/                → shared utilities and clients
  hooks/              → custom React hooks
  services/           → API and Supabase service logic
  types/              → TypeScript types
  utils/              → helper functions

public/               → static assets

---

# Supabase Client

Supabase client should be initialized inside:

src/lib/supabaseClient.ts

Example structure:

- Create a reusable client instance
- Import it in services or components

Never create multiple Supabase client instances unnecessarily.

---

# Coding Standards

General
- Always use TypeScript
- Avoid using `any`
- Prefer functional components
- Use async/await instead of promise chains

React
- Use hooks instead of class components
- Keep components small and reusable
- Extract reusable UI into `/components`

Imports
- Prefer absolute imports using `@/`

Example:

import Button from "@/components/Button"

---

# Styling Rules

Use Tailwind CSS for styling.

Rules:
- Avoid inline styles
- Use Tailwind utility classes
- Extract reusable UI patterns into components

---

# Supabase Guidelines

Authentication
- Use Supabase Auth
- Store user session securely
- Do not expose service role keys

Database
- Use Supabase Postgres tables
- Always validate inputs before database calls

Storage
- Use Supabase Storage for file uploads
- Avoid storing files in the repository

---

# Error Handling

All async operations must have error handling.

Example:

try {
  // logic
} catch (error) {
  console.error(error)
}

Return clear error messages.

---

# Security Rules

- Never commit secrets
- Never expose Supabase service role key
- Validate all user input
- Sanitize database queries

---

# Code Generation Rules for Codex

When modifying this project:

1. Follow the existing folder structure
2. Prefer editing existing files instead of creating new ones
3. Do not introduce new libraries unless necessary
4. Follow TypeScript best practices
5. Ensure code compiles successfully
6. Ensure ESLint passes

---

# Testing (Future)

Testing framework will be added later.

Recommended stack:
- Jest
- React Testing Library

Tests should be placed in:

tests/

---

# Commit Guidelines

Use clear commit messages.

Examples:

feat: add user authentication
fix: resolve login redirect bug
refactor: simplify Supabase query logic

---

# Documentation

If major changes are made:

- Update README.md
- Add comments explaining complex logic

---

# Notes for Codex

- Always prefer simple and readable solutions.
- Avoid over-engineering.
- Maintain consistent code style across the project.