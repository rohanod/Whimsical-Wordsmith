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
- Include: brief description (hero/intro), small motion (e.g., subtle hover/opacity/transform; prefer CSS or requestAnimationFrame), and at least one AI action (call /api/generate or an LLM via ai SDK). Compose the UI using reusable components from `@/app/components` (e.g., `TopBar`, `Description`, `MainInputContainer`, inputs, `ResultContainer`, `RetryButton`, `LoadingContainer`).
- Use Server Component by default; if you need state/effects (theme toggle, typing, inputs), either mark a small child component with 'use client' or make the page a Client Component. Keep client JS small.
- Add meta: export metadata or generateMetadata; ensure <title> and description.
- Styling: Tailwind v4 classes in globals.css layers or local styles; keep under ~15KB client JS.
- Accessibility: keyboard focus, aria labels, alt text; avoid onKeyPress (use onKeyDown).
- Wire API: if needed, add route under src/app/api/<name>/route.ts with validation and proper status codes.
- Naming guide: Prefer playful, alliterative, and fancy titles (e.g., “Magniloquent Mnemonics”). Use a short slug in kebab-case (e.g., magniloquent-mnemonics). Page title format: <Title> — <concise tagline>.
- Action button hover: use `transition-all duration-300` with `hover:scale-110 hover:rotate-12` on icon
  buttons for subtle motion feedback.
- Global CSS utilities: use `muted`, `border-muted`, `bg-muted-5`, `bg-muted-10`; motions
  `animate-fade-in-up`, `animate-slide-in-left`, `animate-scale-in`. Keep page-specific keyframes in
  `<style jsx global>`.
- API call to `/api/generate`: body JSON includes `prompt`, `schemaDescription`, `exampleFormat`,
  optional `temperature` (defaults to 0.3).
- Response shape: success returns your structured object; errors return `{ error: string }` with
  appropriate status. Define types matching your app’s schema (e.g., Eloquent: `transformed`,
  `original`, `annotations[{ word, reasoning }]`; Delight: `word`, `definition`, `original`). Treat
  the response as already-structured JSON (no markdown code fences) and parse/validate accordingly.
- Loading/disabled states: use `animate-spin` on loading icons; add `disabled` and
  `opacity-50 cursor-not-allowed` or `disabled:opacity-50` for disabled buttons.
- Keyboard interactions: submit on Enter via `onKeyDown`. For textareas, Enter submits and
  Shift+Enter inserts a newline.
- Theme toggle: default to dark; toggle `document.documentElement.classList.toggle('dark', isDark)`;
  use `transition-colors duration-300` on the root container.
- Hover cards: wrap tiles in a `group` and use `group-hover:scale-105` with small rotation
  (`group-hover:rotate-1`/`-rotate-1`) and `group-hover:shadow-2xl`.
- Staggered animations: set `style={{ animationDelay: '0.Xs' }}` on elements to stagger entrance.
- Error state: show a short message with a local `animate-shake` keyframe and use `#EF4444` color.
- Copy feedback: swap to a check icon and show a brief "Copied!" label with `animate-pulse`.
- Prompt diversity: when refreshing, pass previous outputs in the prompt to encourage variety.
- Inputs: prefer `border-muted`, `bg-transparent`, and rely on global placeholder styles.
- Icons: use lucide-react at `w-5 h-5`; add `aria-label` for icon-only buttons.

Component Architecture
The app uses a reusable component system located in `src/app/components/`:

## Universal Components
- **Description**: Displays app description text with consistent styling
- **TopBar**: Header with back button (conditional), title, and theme toggle

## Individual App Page Components
- **MainInputContainer**: Wrapper for input sections with animation
- **DelightfullyDifferentWordsInput**: "Very" label + short text input with search button
- **EloquentExpressionsInput**: Long textarea with submit button
- **SubmitButton**: Icon button with rotate animation on hover
- **LoadingContainer**: Text with rotating sparkle icon
- **ResultContainer**: Wrapper for result display with animation
- **RetryButton**: Icon button with 180° rotate animation on hover
- **HoverableText**: Typewriter text with hover tooltips for annotations

## Main Page Components
- **AppCardsContainer**: Grid layout for app cards
- **AppCard**: Individual app card with hover animations, color highlights, and scaling

Usage tips
- To change the app card title color on hover, pass `titleHoverColour` (CSS color or hex, e.g., `#8B5CF6`) to `AppCard`. The title will smoothly transition to that color on card hover.
- Use `animationDelay` (in seconds) on `AppCard` to stagger entrances.

## Usage Guidelines
- Import components from `@/app/components`
- All components include built-in animations where appropriate
- Components are designed to be reusable across different contexts
- Follow the existing prop interfaces for consistent behavior

Notes
- No Cursor or Copilot rule files detected. If added later (.cursor/rules or .github/copilot-instructions.md), mirror them here.
- Stack: next 15.3.5, react 19, ai sdk; Tailwind v4 present.
- AI provider: Google via `@ai-sdk/google` (model: `gemini-2.5-flash`). Set `GOOGLE_GENERATIVE_AI_API_KEY` in `.env.local` and never commit it.
