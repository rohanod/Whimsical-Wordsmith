AGENTS.md – Repository playbook for agentic contributors

Build/Lint/Test
- Dev server: pnpm dev (or npm run dev) — Next.js 15 + Turbopack
- Build: pnpm build (or npm run build)
- Start prod: pnpm start
- Lint: pnpm lint (ESLint flat config, next/core-web-vitals + typescript)
- Tests: none configured (no Jest/Vitest). To add tests, prefer Vitest + React Testing Library. Single-test example (after setup): pnpm vitest run path/to/file.test.ts --watch=false

Project Conventions
- Language/Types: TypeScript strict=true; no implicit any; prefer explicit function return types for exported APIs. Use unknown over any.
- Imports: Use path alias @/* for src/* (tsconfig paths). Group as: builtin, external, internal(@/*), then relative; no deep-imports from Next internals. Side-effect CSS imports allowed only in app entry points.
- Formatting: Follow ESLint + Prettier defaults (if added); 2-space indent; single quotes or project default; trailing commas where valid; keep lines ≤ 100 chars.
- React/Next: App Router (src/app). Use Server Components by default; mark Client Components with 'use client'. Co-locate components under src/app or src/components; keep components pure; avoid state unless needed.
- Naming: files kebab-case; React components PascalCase; hooks use camelCase starting with use; types/interfaces PascalCase (I- prefix not used); constants UPPER_SNAKE.
- Error handling: Never swallow errors. In API routes (src/app/api/**/route.ts) validate input, return typed JSON with appropriate HTTP status. Use try/catch at boundaries only; log with concise context; prefer Result-like return for library code.
- Async: Always await promises; avoid floating promises; use AbortController for fetch; timeouts for external calls.
- Security/Env: Secrets via .env.local; never commit. Validate required envs at startup; avoid exposing server-only envs to client.
- Accessibility: Use semantic HTML, alt text for images, focus states, and aria-* as needed. Interactive elements must be keyboard-navigable.
- Performance: Memoize expensive renders, prefer streaming where appropriate, lazy-load large client components, avoid unnecessary client JS.

Add a New App (mini-guide)
- Create folder: src/app/<slug>/page.tsx (+ optional loading.tsx).
- Include: brief description (hero/intro), small motion (e.g., subtle hover/opacity/transform; prefer CSS or requestAnimationFrame), and at least one AI action (call /api/generate or an LLM via ai SDK).
- Use Server Component by default; isolate client interactivity into a small 'use client' child.
- Add meta: export metadata or generateMetadata; ensure <title> and description.
- Styling: Tailwind v4 classes in globals.css layers or local styles; keep under ~15KB client JS.
- Accessibility: keyboard focus, aria labels, alt text; avoid onKeyPress (use onKeyDown).
- Wire API: if needed, add route under src/app/api/<name>/route.ts with validation and proper status codes.
- Naming guide: Prefer playful, alliterative, and fancy titles (e.g., “Magniloquent Mnemonics”). Use a short slug in kebab-case (e.g., magniloquent-mnemonics). Page title format: <Title> — <concise tagline>.

Notes
- No Cursor or Copilot rule files detected. If added later (.cursor/rules or .github/copilot-instructions.md), mirror them here.
- Stack: next 15.3.5, react 19, ai sdk; Tailwind v4 present.
