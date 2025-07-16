# Technology Stack

## Framework & Runtime
- **Next.js 15.3.5** with App Router architecture
- **React 19** with TypeScript
- **Node.js** runtime environment

## AI Integration
- **Vercel AI SDK** (`ai` package) for LLM integration
- **Google AI SDK** (`@ai-sdk/google`) with Gemini 2.0 Flash Lite model
- Custom API route at `/api/generate` for text generation

## Styling & UI
- **Tailwind CSS 4** for utility-first styling
- **Lucide React** for consistent iconography
- **EB Garamond** Google Font for serif typography
- **Geist Sans/Mono** fonts for system text

## Development Tools
- **TypeScript 5** for type safety
- **ESLint** with Next.js configuration
- **PostCSS** for CSS processing

## Common Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack
pnpm dev            # Alternative with pnpm

# Production
npm run build       # Build for production
npm run start       # Start production server

# Code Quality
npm run lint        # Run ESLint checks
```

## Environment Setup
- Requires `.env.local` for API keys (Google AI)
- Uses `next-env.d.ts` for Next.js type definitions
- Path aliases configured: `@/*` maps to `./src/*`

## Performance Features
- Turbopack for fast development builds
- Next.js automatic optimizations
- Font optimization with `next/font`