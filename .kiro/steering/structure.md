# Project Structure

## Directory Organization

```
src/
├── app/                          # Next.js App Router
│   ├── api/generate/            # AI text generation endpoint
│   ├── delightfully-different-words/  # Word transformation tool
│   ├── eloquent-expressions/    # Phrase sophistication tool
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout component
│   └── page.tsx                # Homepage with tool navigation
public/                         # Static assets (SVG icons)
```

## Architecture Patterns

### Page Structure
- Each tool has its own route directory under `src/app/`
- Individual `page.tsx` files for each tool's UI
- Shared root layout with consistent theming and fonts

### Component Patterns
- **Client Components**: All interactive pages use `'use client'` directive
- **Custom Hooks**: `useTheme()` for consistent dark/light mode management
- **Typewriter Animation**: Reusable `TypewriterText` component for engaging text reveals

### API Design
- Single `/api/generate` endpoint handles all AI requests
- Request differentiation via `type` parameter
- Consistent error handling and response format

### Styling Conventions
- **Theme Colors**: `#1B1917` (dark), `#FAFAF9` (light), `#A8A29D` (accent)
- **Typography**: EB Garamond serif for headings, system fonts for UI
- **Animations**: Custom CSS keyframes for micro-interactions
- **Responsive**: Mobile-first approach with Tailwind utilities

### State Management
- Local component state with React hooks
- Theme persistence via localStorage (implied)
- Previous suggestions tracking for AI context

### File Naming
- `page.tsx` for route components
- `route.ts` for API endpoints
- Kebab-case for directory names
- PascalCase for React components

## Key Conventions
- All interactive components are client-side rendered
- Consistent header layout with back navigation and theme toggle
- Error states with user-friendly messaging
- Loading states with contextual feedback