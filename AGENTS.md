---
description: Instructions for AI coding agents working on Travelama Landing Page
globs:
  - "**/*"
alwaysApply: true
---

# Travelama Landing Page - Marketing Site

TouchStay-inspired marketing landing page for Travelama. A comprehensive, production-ready landing page with full interactivity, animations, and Travelama-specific content.

**What is Travelama?** A digital property guide platform for vacation rental hosts. Guests scan QR codes to instantly access WiFi passwords, house rules, local recommendations, and emergency contacts - no app downloads required.

## Quick Start Commands

```bash
# Installation & Setup
npm install

# Development
npm run dev --turbopack    # Starts dev server on port 3001 with Turbopack
npm run build              # Production build with Turbopack
npm start                  # Start production server on port 3001

# Code Quality
npm run lint               # ESLint check
npm run type-check         # TypeScript validation (no emit)
```

**Port Configuration:**
- Landing page: `3001` (this project)
- Main app: `3000` (separate project at `/Users/tyrelsmythe/travelama`)

## Tech Stack (Exact Versions)

- **Framework**: Next.js 16.1.0 (App Router) + React 19.2.3 + TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS v4 + @tailwindcss/typography + Lucide icons
- **UI Components**:
  - shadcn/ui (Radix primitives)
  - @radix-ui/react-accordion 1.2.12
  - @radix-ui/react-dialog 1.1.15
  - @radix-ui/react-slot 1.2.4
- **Carousel**: embla-carousel-react 8.5.2
- **Utilities**:
  - class-variance-authority 0.7.1
  - clsx 2.1.1
  - tailwind-merge 3.4.0
- **Theming**: next-themes 0.4.6
- **Notifications**: Sonner 2.0.7
- **Build Tool**: Turbopack (built into Next.js 16)
- **Animations**: tw-animate-css 1.4.0

## Core Features

- **Navigation**: Sticky header with feature dropdowns + mobile hamburger menu
- **Hero Section**: Animated gradient background, dual CTAs, social proof badge
- **Testimonials**: Auto-rotating carousel with 6 customer quotes
- **Features Grid**: 12 feature cards with icons and descriptions
- **Pricing Calculator**: Interactive slider to calculate costs by property count
- **Integrations**: Auto-scrolling partner logo carousel
- **Blog Preview**: 3 article cards with featured images
- **Footer**: Comprehensive link sections + newsletter signup
- **Animations**: Scroll-triggered fade-ins using IntersectionObserver
- **Responsive**: Mobile-first design (375px → 1920px+)

## Architecture

### Directory Structure

```
src/
├── app/
│   ├── globals.css          # Global styles, animations, custom utilities
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main landing page composition
├── components/
│   ├── landing/             # All landing page components
│   │   ├── navigation/      # Header, mobile nav, dropdowns
│   │   │   ├── LandingNav.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── NavDropdown.tsx
│   │   │   └── index.ts
│   │   ├── hero/            # Hero section + animated background
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AnimatedBackground.tsx
│   │   │   └── index.ts
│   │   ├── features/        # Features grid + capability highlights
│   │   │   ├── FeaturesGrid.tsx
│   │   │   ├── FeatureCard.tsx
│   │   │   ├── CapabilityHighlights.tsx
│   │   │   └── index.ts
│   │   ├── pricing/         # Interactive pricing calculator
│   │   │   ├── PricingCalculator.tsx
│   │   │   └── index.ts
│   │   ├── social-proof/    # Testimonials carousel
│   │   │   ├── TestimonialCarousel.tsx
│   │   │   ├── TestimonialCard.tsx
│   │   │   ├── StarRating.tsx
│   │   │   └── index.ts
│   │   ├── integrations/    # Partner logo carousel
│   │   │   ├── IntegrationCarousel.tsx
│   │   │   └── index.ts
│   │   ├── content/         # Blog, CTA sections, customer quotes
│   │   │   ├── BlogPreview.tsx
│   │   │   ├── BlogCard.tsx
│   │   │   ├── CTASection.tsx
│   │   │   ├── CustomerQuote.tsx
│   │   │   └── index.ts
│   │   ├── education/       # Process steps, "What Is" section
│   │   │   ├── ProcessSteps.tsx
│   │   │   ├── WhatIsSection.tsx
│   │   │   └── index.ts
│   │   ├── footer/          # Footer with newsletter
│   │   │   ├── LandingFooter.tsx
│   │   │   └── index.ts
│   │   └── shared/          # Reusable components
│   │       ├── Section.tsx
│   │       ├── SectionHeader.tsx
│   │       ├── CTAButton.tsx
│   │       ├── AnimatedSection.tsx
│   │       └── index.ts
│   └── ui/                  # shadcn/ui components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Accordion.tsx
│       ├── dialog.tsx
│       ├── sheet.tsx
│       ├── BottomSheet.tsx
│       ├── Toast.tsx
│       ├── sonner.tsx
│       └── index.ts
├── hooks/
│   └── useInView.ts         # Scroll animation hook (IntersectionObserver)
└── lib/
    ├── utils.ts             # Utility functions (cn, etc.)
    └── data/                # All content (single source of truth)
        ├── landing-content.ts   # Hero, pricing, CTA, capabilities
        ├── testimonials.ts      # Customer testimonials
        ├── features.ts          # Feature cards data
        ├── integrations.ts      # Partner logos
        └── blog.ts              # Blog article previews
```

**Path Alias**: `@/*` → `./src/*`

### Data Flow Pattern

All content is centralized in `src/lib/data/` files. Components import content and render it. This makes updates trivial - change content once, all components reflect the update automatically.

```typescript
// Content definition (src/lib/data/landing-content.ts)
export const landingContent = {
  hero: {
    headline: "Digital property guides that delight your guests",
    primaryCTA: { text: "Start Free Trial", href: "/signup" }
  }
}

// Component usage (src/components/landing/hero/HeroSection.tsx)
import { landingContent } from '@/lib/data/landing-content'

export function HeroSection() {
  const { hero } = landingContent

  return (
    <div>
      <h1>{hero.headline}</h1>
      <Button href={hero.primaryCTA.href}>
        {hero.primaryCTA.text}
      </Button>
    </div>
  )
}
```

**No Database**: This is a static marketing site. All content is in TypeScript files, committed to git.

**No Authentication**: No login, no user state. Pure marketing landing page.

## Code Style & Patterns

### Content Management Pattern

```typescript
// ✅ Correct - content from data file
// src/lib/data/features.ts
export const features = [
  {
    id: 'wifi-access',
    title: 'WiFi Access',
    description: 'Share network credentials instantly',
    icon: 'wifi'
  }
]

// src/components/landing/features/FeaturesGrid.tsx
import { features } from '@/lib/data/features'

export function FeaturesGrid() {
  return (
    <div>
      {features.map(feature => (
        <FeatureCard key={feature.id} {...feature} />
      ))}
    </div>
  )
}

// ❌ Wrong - hardcoded content in component
export function FeaturesGrid() {
  return (
    <div>
      <div>
        <h3>WiFi Access</h3>
        <p>Share network credentials instantly</p>
      </div>
    </div>
  )
}
```

### Component Organization Pattern

```typescript
// Order of code blocks in components:
// 1. Imports (external → internal → types)
// 2. Types/interfaces
// 3. Component definition
// 4. Hooks (useState, useEffect, custom hooks)
// 5. Event handlers
// 6. Effects
// 7. Render helpers
// 8. Return JSX

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { landingContent } from '@/lib/data/landing-content'
import { cn } from '@/lib/utils'

interface CTAButtonProps {
  variant?: 'primary' | 'secondary'
  className?: string
}

export function CTAButton({ variant = 'primary', className }: CTAButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { cta } = landingContent

  const handleClick = () => {
    toast.success('Redirecting to signup...')
  }

  return (
    <Button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'transition-transform',
        isHovered && 'scale-105',
        className
      )}
    >
      {cta.primaryButton}
    </Button>
  )
}
```

### Responsive Design Pattern

Mobile-first approach using Tailwind breakpoints:

```tsx
// ✅ Correct - mobile first, then scale up
<div className="text-sm md:text-base lg:text-lg xl:text-xl">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
<div className="p-4 md:p-6 lg:p-8">

// ❌ Wrong - desktop first, scale down
<div className="text-xl lg:text-lg md:text-base">
```

**Breakpoints:**
- Mobile: default (375px+)
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)
- Large: `xl:` (1280px+)
- Extra large: `2xl:` (1536px+)

### Animation Pattern (Scroll-Triggered)

```typescript
// src/hooks/useInView.ts
import { useEffect, useRef, useState } from 'react'

export function useInView(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

// Component usage
import { useInView } from '@/hooks/useInView'

export function AnimatedSection({ children }) {
  const { ref, isInView } = useInView()

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      )}
    >
      {children}
    </div>
  )
}
```

### Notifications Pattern

```typescript
import { toast } from 'sonner'

// ✅ Correct - transient user feedback
function handleNewsletterSignup() {
  try {
    // API call...
    toast.success('Thanks for subscribing!')
  } catch (error) {
    toast.error('Failed to subscribe. Please try again.')
  }
}

// ✅ Correct - informational toasts
toast.info('Scroll down to see pricing')
toast.warning('Limited time offer ends soon')

// ❌ Never use inline state-based alerts for transient messages
const [showAlert, setShowAlert] = useState(false)
{showAlert && <div>Success!</div>}
```

## Design System

### Color Palette

```typescript
// Primary colors (from landing-content)
const colors = {
  ocean: '#0E7490',      // Tailwind: bg-cyan-700, text-cyan-700
  sand: '#F5F0E8',       // Tailwind: bg-sand-50 (custom)
  coral: '#F97316'       // Tailwind: bg-orange-500
}

// Usage in components
<Button className="bg-cyan-700 hover:bg-cyan-800">
<Section className="bg-sand-50">
<Badge className="bg-orange-500">
```

### Typography Scale

```tsx
// Headlines
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
<h3 className="text-2xl md:text-3xl font-semibold">

// Body text
<p className="text-base md:text-lg">
<p className="text-sm text-gray-600">

// Labels
<span className="text-xs uppercase tracking-wide">
```

### Spacing System

```tsx
// Section padding
<section className="py-12 md:py-16 lg:py-24">

// Container max-width
<div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">

// Card spacing
<div className="p-6 md:p-8">

// Grid gaps
<div className="grid gap-6 md:gap-8 lg:gap-12">
```

## Git Workflow

### Commit Message Convention

Use lowercase conventional commit prefixes:

```bash
# Format: <prefix>: <description> (or <prefix>(<scope>): <description>)

fix: resolve testimonial carousel auto-play bug
feat: add newsletter signup to footer
feat(hero): implement animated gradient background
perf: optimize image loading with next/image
docs: update setup instructions in README
refactor: simplify pricing calculator logic
style: update hero section button colors
chore: update dependencies
```

| Prefix     | Purpose                  |
|------------|--------------------------|
| `fix`      | Bug fixes                |
| `feat`     | New features             |
| `perf`     | Performance improvements |
| `docs`     | Documentation changes    |
| `refactor` | Code refactoring         |
| `style`    | UI/styling changes       |
| `chore`    | Maintenance tasks        |

### Pull Request Guidelines

1. **Title format**: Use conventional commit format
2. **Pre-merge checklist**:
   - [ ] `npm run lint` passes
   - [ ] `npm run type-check` passes
   - [ ] All TypeScript errors resolved
   - [ ] Tested at 375px, 768px, 1024px, 1280px viewports
   - [ ] All animations working smoothly
   - [ ] No console errors in browser
   - [ ] Links navigate correctly

## Boundaries & Constraints

### ✅ Always Do

- **Use Sonner for notifications** - Never inline state-based alerts for transient messages
- **Store content in data files** - All strings in `src/lib/data/`, never hardcoded in components
- **Follow component organization** - Imports → Types → Component → Hooks → Handlers → JSX
- **Mobile-first responsive** - Default styles for mobile, scale up with `md:`, `lg:`, `xl:`
- **Use TypeScript strict mode** - No `any` types without explicit justification
- **Test responsive design** - Verify at 375px, 768px, 1024px, 1280px
- **Maintain path alias** - Use `@/*` for all imports from src
- **Include Co-Authored-By in commits** - Add AI attribution when applicable

### ⚠️ Ask First

- **Adding new npm dependencies** - Consider bundle size, maintenance burden, alternatives
- **Changing component structure** - Affects maintainability and developer experience
- **Modifying animations** - Performance implications, especially on mobile
- **Adding new landing sections** - Discuss design, placement, and content strategy first
- **Changing color scheme** - Brand consistency, affects entire site
- **Altering layout patterns** - May affect responsive behavior across all sections
- **Modifying content structure** - Changes to data files affect multiple components

### 🚫 Never Do

- **Hardcode content strings in components** - All content belongs in `src/lib/data/`
- **Skip TypeScript type checking** - Strict mode enforced, fix types properly
- **Use `// @ts-ignore` without justification** - Fix types or document why it's necessary
- **Create backwards-compatibility hacks** - Delete unused code, don't rename to `_unused`
- **Add unnecessary abstractions** - Three similar lines > premature abstraction
- **Commit .env files or secrets** - Use environment variables, never hardcode
- **Force push to main branch** - Destructive, loses history
- **Use desktop-first responsive** - Always mobile-first with Tailwind

## Testing & Quality

### Pre-Deployment Checklist

```bash
# 1. Lint check
npm run lint

# 2. TypeScript validation
npm run type-check

# 3. Build test
npm run build

# 4. Visual inspection
npm run dev
# Then test at: 375px, 768px, 1024px, 1280px, 1920px
```

### Manual Testing Checklist

- [ ] **Navigation**
  - [ ] Hover "Features" → dropdown appears
  - [ ] Click hamburger icon → mobile menu opens
  - [ ] All navigation links work
  - [ ] Sticky header works on scroll

- [ ] **Animations**
  - [ ] Hero background gradient animates smoothly
  - [ ] Testimonial carousel auto-rotates every 5 seconds
  - [ ] Scroll animations trigger on viewport entry
  - [ ] Integration logos scroll automatically

- [ ] **Interactive Elements**
  - [ ] Pricing calculator slider updates price
  - [ ] Newsletter signup shows toast on submit
  - [ ] All CTA buttons navigate correctly
  - [ ] Mobile menu closes on link click

- [ ] **Responsive Design**
  - [ ] Mobile (375px): All content readable, buttons tappable
  - [ ] Tablet (768px): Grid layouts adjust properly
  - [ ] Desktop (1024px+): Content centered, max-width enforced
  - [ ] No horizontal scroll at any viewport

- [ ] **Performance**
  - [ ] No console errors or warnings
  - [ ] Images load without layout shift
  - [ ] Animations don't cause jank
  - [ ] Time to Interactive < 3s on fast 3G

## Common Tasks

### Adding a New Landing Section

1. **Create content data file** (if needed):
   ```typescript
   // src/lib/data/my-section.ts
   export const mySectionData = {
     title: "Section Title",
     items: [...]
   }
   ```

2. **Create component**:
   ```typescript
   // src/components/landing/my-section/MySection.tsx
   import { mySectionData } from '@/lib/data/my-section'

   export function MySection() {
     return <section>...</section>
   }
   ```

3. **Export from index**:
   ```typescript
   // src/components/landing/my-section/index.ts
   export * from './MySection'
   ```

4. **Add to main page**:
   ```typescript
   // src/app/page.tsx
   import { MySection } from '@/components/landing/my-section'

   export default function LandingPage() {
     return (
       <>
         {/* ... other sections ... */}
         <MySection />
       </>
     )
   }
   ```

### Updating Content

All content lives in `src/lib/data/`. Simply edit the appropriate file:

- **Hero text, CTAs, stats**: `landing-content.ts`
- **Customer testimonials**: `testimonials.ts`
- **Feature cards**: `features.ts`
- **Partner logos**: `integrations.ts`
- **Blog articles**: `blog.ts`

Changes appear immediately in dev mode (hot reload).

### Adding a New Feature Card

```typescript
// src/lib/data/features.ts
export const features = [
  // ... existing features ...
  {
    id: 'new-feature',
    title: 'New Feature',
    description: 'Description of what this feature does for hosts',
    icon: 'icon-name' // Lucide icon name
  }
]
```

Component automatically renders new feature - no component changes needed.

### Modifying Animations

Animations use CSS transitions + `useInView` hook:

```typescript
// To adjust animation timing
<div className="transition-all duration-700"> // Change duration-700

// To adjust scroll trigger threshold
const { ref, isInView } = useInView(0.2) // Change 0.1 to 0.2
```

## Port Management

This project uses port 3001 to avoid conflicts with the main Travelama app (port 3000).

To change port:
```json
// package.json
{
  "scripts": {
    "dev": "next dev --turbopack -p 3002", // Change 3001 to 3002
    "start": "next start -p 3002"
  }
}
```

## Project-Specific Conventions

### File Naming

- **Components**: PascalCase (e.g., `HeroSection.tsx`, `PricingCalculator.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useInView.ts`)
- **Data files**: kebab-case (e.g., `landing-content.ts`, `testimonials.ts`)
- **Utilities**: kebab-case (e.g., `utils.ts`)

### Import Order

```typescript
// 1. External dependencies (React, Next.js, etc.)
import { useState } from 'react'
import Image from 'next/image'

// 2. Internal UI components
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

// 3. Internal custom components
import { HeroSection } from '@/components/landing/hero'

// 4. Data and utilities
import { landingContent } from '@/lib/data/landing-content'
import { cn } from '@/lib/utils'

// 5. Types (if not inline)
import type { FeatureCardProps } from './types'
```

### Export Pattern

Use barrel exports (`index.ts`) for cleaner imports:

```typescript
// src/components/landing/hero/index.ts
export * from './HeroSection'
export * from './AnimatedBackground'

// Then import like this:
import { HeroSection, AnimatedBackground } from '@/components/landing/hero'
```

## Performance Targets

Target Lighthouse scores:
- **Performance**: 90+ (mobile), 95+ (desktop)
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 90+

### Optimization Checklist

- [ ] All images use Next.js `<Image>` component
- [ ] Images have explicit width/height (no layout shift)
- [ ] Animations use CSS transforms (not layout properties)
- [ ] Third-party scripts loaded async/defer
- [ ] Font loading optimized (system fonts preferred)
- [ ] No unused CSS (Tailwind purges automatically)

## Resources

- **Main app**: `/Users/tyrelsmythe/travelama` (separate Next.js project on port 3000)
- **Landing page implementation docs**: `/Users/tyrelsmythe/travelama/LANDING_PAGE_IMPLEMENTATION.md`
- **Market research**: `MARKET_RESEARCH_REPORT.md` (in this repo)
- **Setup notes**: `SETUP_COMPLETE.md` (in this repo)

## Code Philosophy

This codebase will outlive you. Every shortcut you take becomes someone else's burden. Every hack compounds into technical debt that slows the whole team down.

You are not just writing code. You are shaping the future of this project. The patterns you establish will be copied. The corners you cut will be cut again.

Fight entropy. Leave the codebase better than you found it.

---

**For Claude Code**: This file provides comprehensive guidance for AI coding agents. Follow these patterns and constraints to maintain code quality, consistency, and brand integrity. When in doubt, ask before proceeding with significant changes.
