# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

**📚 For comprehensive documentation, code examples, and detailed patterns, see [AGENTS.md](./AGENTS.md)**

---

## Development Commands

```bash
npm run dev --turbopack    # Start dev server (port 3001) with Turbopack
npm run build              # Production build
npm run start              # Start production server
npm run lint               # ESLint check
npm run type-check         # TypeScript validation
```

## Project Overview

Travelama Landing Page is a TouchStay-inspired marketing site for Travelama, a digital property guide platform for vacation rental hosts. Guests scan QR codes to access WiFi passwords, house rules, local recommendations, and emergency contacts - no apps required.

**Core Sections:**
- Hero with animated background and dual CTAs
- Testimonial carousel (auto-rotating)
- Features grid (12+ capabilities)
- Interactive pricing calculator
- Integration showcase (auto-scrolling logos)
- Blog preview cards
- Comprehensive footer with newsletter

## Tech Stack

- **Framework**: Next.js 16.1.0 (App Router) + React 19.2.3 + TypeScript (strict)
- **Styling**: Tailwind CSS v4, shadcn/ui (Radix primitives), Lucide icons
- **Components**: embla-carousel-react, class-variance-authority
- **Notifications**: Sonner 2.0.7
- **Build**: Turbopack

## Architecture

### Directory Structure

```
src/
├── app/
│   ├── globals.css          # Global styles + animations
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main landing page
├── components/
│   ├── landing/             # All landing page sections
│   │   ├── navigation/      # Header, mobile menu, dropdowns
│   │   ├── hero/            # Hero section + animated background
│   │   ├── features/        # Features grid + capability highlights
│   │   ├── pricing/         # Interactive calculator
│   │   ├── social-proof/    # Testimonials carousel
│   │   ├── integrations/    # Partner logos
│   │   ├── content/         # Blog, CTA, quotes
│   │   ├── education/       # Process steps, "What Is" section
│   │   ├── footer/          # Footer with newsletter
│   │   └── shared/          # Reusable components (Section, CTAButton, etc.)
│   └── ui/                  # shadcn/ui components
├── hooks/
│   └── useInView.ts         # Scroll-triggered animations
└── lib/
    ├── utils.ts             # Utility functions (cn, etc.)
    └── data/                # All content (single source of truth)
        ├── landing-content.ts   # Hero, pricing, CTA
        ├── testimonials.ts      # Customer quotes
        ├── features.ts          # Feature cards
        ├── integrations.ts      # Partner logos
        └── blog.ts              # Blog preview articles
```

### Data Flow Pattern

Content is centralized in `src/lib/data/` and imported by components. This makes updates easy - change content in one place, and all components reflect the update.

```typescript
// Example: Using content
import { landingContent } from '@/lib/data/landing-content'

export function HeroSection() {
  const { hero } = landingContent
  return <h1>{hero.headline}</h1>
}
```

## Development Standards

### Content Management

**All content lives in `/src/lib/data/`**. Never hardcode strings in components.

```typescript
// ✅ Correct - content from data file
import { landingContent } from '@/lib/data/landing-content'
const { hero } = landingContent

// ❌ Wrong - hardcoded content
const headline = "Digital property guides that delight your guests"
```

### Notifications

**Always use Sonner for toast notifications:**

```tsx
import { toast } from 'sonner'

toast.success('Changes saved')  // ✅ Correct
toast.error('Failed to save')   // ✅ Correct

// ❌ Don't use inline state-based alerts
```

### Component Pattern

```tsx
// Order of code blocks in components:
// 1. Imports (external, internal, types)
// 2. Types/interfaces
// 3. Component definition
// 4. Hooks (useState, custom hooks)
// 5. Event handlers
// 6. Effects
// 7. Render helpers
// 8. Return JSX

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { landingContent } from '@/lib/data/landing-content'

interface Props {
  variant?: 'primary' | 'secondary'
}

export function CTAButton({ variant = 'primary' }: Props) {
  const [isHovered, setIsHovered] = useState(false)
  const { cta } = landingContent

  const handleClick = () => {
    toast.success('Redirecting...')
  }

  return (
    <Button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {cta.primaryButton}
    </Button>
  )
}
```

### Responsive Design

Mobile-first approach with Tailwind breakpoints:

```tsx
// ✅ Correct - mobile first, then larger screens
<div className="text-sm md:text-base lg:text-lg">

// ❌ Wrong - desktop first
<div className="text-lg md:text-base">
```

**Breakpoints:**
- Mobile: default (375px+)
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)
- Large: `xl:` (1280px+)

### Git Commits

Use conventional commit prefixes in lowercase:

| Prefix     | Purpose                  |
|------------|--------------------------|
| `fix`      | Bug fixes                |
| `feat`     | New features             |
| `perf`     | Performance improvements |
| `docs`     | Documentation changes    |
| `refactor` | Code refactoring         |
| `chore`    | Maintenance tasks        |
| `style`    | UI/styling changes       |

## Critical Rules

### ✅ Always Do
- Use Sonner for notifications (never inline alerts)
- Store content in `src/lib/data/` (never hardcode strings)
- Use TypeScript strict mode (no `any` without justification)
- Test responsive design at 375px, 768px, 1024px, 1280px
- Maintain component organization pattern
- Use mobile-first responsive approach

### 🚫 Never Do
- Hardcode content strings in components
- Skip TypeScript type checking
- Use `// @ts-ignore` without justification
- Create backwards-compatibility hacks (delete unused code)
- Add unnecessary abstractions for one-time use
- Commit .env files or secrets
- Force push to main branch

### ⚠️ Ask First
- Adding new npm dependencies (consider bundle size)
- Changing component structure (affects maintainability)
- Modifying animations (performance implications)
- Adding new sections to landing page (discuss design first)
- Changing color scheme (brand consistency)

## Design Tokens

**Colors:**
- Ocean Blue (Primary): `#0E7490` → `bg-cyan-700`
- Sand (Backgrounds): `#F5F0E8` → `bg-sand-50`
- Coral (Accents): `#F97316` → `bg-orange-500`

**Typography:**
- Headlines: System font stack
- Body: System font stack
- Monospace: For code snippets

## Code Philosophy

This codebase will outlive you. Every shortcut you take becomes someone else's burden. Every hack compounds into technical debt that slows the whole team down.

You are not just writing code. You are shaping the future of this project. The patterns you establish will be copied. The corners you cut will be cut again.

Fight entropy. Leave the codebase better than you found it.

## Path Aliases

`@/*` → `./src/*`

---

**Need more details?** Refer to [AGENTS.md](./AGENTS.md) for comprehensive patterns, examples, and workflows.
