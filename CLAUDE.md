# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Travelama is a digital guest guide and local attraction guide that owners of short-let properties can curate and serve to their guests

## Tech Stack

- **Framework**: Next.js 16.1.0 with App Router and Turbopack
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4.x with shadcn/ui components (New York style)
- **Icons**: Phosphor Icons (primary), Lucide React (secondary)
- **Database**: PostgreSQL 17 via Supabase
- **Auth**: Supabase Auth with email verification via Resend
- **Fonts**: Public Sans (primary), Geist Mono (monospace)

## Development Commands

```bash
npm run dev          # Start dev server with Turbopack on port 3000
npm run build        # Production build with Turbopack
npm run start        # Start production server
npm run lint         # Run ESLint
supabase start       # Start local Supabase (ports 54321-54327)
```

## Architecture

### Route Structure

- `/` - Landing page
- `/stay/[slug]` - Public property pages (guest view via QR scan)
- `/[country]/[area]` - Destination guide pages
- `/dashboard/*` - Protected host routes (properties, account)
- `/api/auth/send-confirmation` - Email verification endpoint
- Auth routes in `(auth)` group: login, signup, verify-email, forgot-password, reset-password

### Key Directories

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── ui/                 # shadcn/ui base components
│   ├── auth/               # Authentication components
│   ├── property/           # Property page components
│   ├── area/               # Area guide components
│   └── dashboard/          # Host dashboard components
├── lib/
│   ├── supabase/           # Client (client.ts), Server (server.ts), Middleware (middleware.ts)
│   ├── content/            # Data loaders for properties, areas, countries
│   ├── email/              # Resend setup and email templates
│   └── actions/            # Server Actions
├── content/                # Static content data (TypeScript objects)
├── hooks/                  # Custom React hooks
└── types/                  # Centralized TypeScript definitions
```

### Authentication Flow

1. Supabase SSR middleware handles session management in `src/middleware.ts`
2. Protected routes redirect to `/login` if unauthenticated
3. Session refresh handled automatically for Server Components
4. JWT tokens managed via httpOnly cookies

### Data Model

Content is defined as TypeScript objects in `/src/content/`:

- **Properties**: WiFi networks, emergency contacts, appliances, house rules, checkout times
- **Areas**: Recommendations, local insights, categorized places
- **Countries**: Area summaries, travel tips

## Conventions

- Module alias: `@/*` maps to `./src/*`
- Components: PascalCase files, feature folders in kebab-case
- Types: Centralized in `/src/types/index.ts`
- Client components: Use `'use client'` directive only where interactivity needed
- Class merging: Use `cn()` utility from `@/lib/utils`

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
RESEND_FROM
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY  # Google Places API for location autocomplete
```

## Email (IMPORTANT)

**All emails in this application MUST be sent via Resend.** Do not use Supabase's built-in email functionality.

### Email Service Location
- `src/lib/email/index.ts` - Centralized email service
- `src/lib/email/templates.ts` - Branded HTML email templates

### How to Send Emails

```typescript
import { sendBrandedEmail, sendConfirmationEmail } from "@/lib/email";

// Use pre-built templates for common emails
await sendConfirmationEmail(email, confirmationLink);
await sendPasswordResetEmail(email, resetLink);

// Or send custom branded emails
await sendBrandedEmail({
  to: "user@example.com",
  subject: "Your Subject",
  category: "notification",
  template: {
    heading: "Hello!",
    paragraphs: ["Your message here."],
    button: { label: "Click Me", url: "https://..." },
  },
});
```

### Auth Emails
Auth-related emails (confirmation, password reset) are handled by server actions in `src/lib/actions/auth.ts`. These use Supabase Admin API to generate secure links, then send via Resend.

### Why Not Supabase Email?
- Full control over email design and branding
- Better deliverability tracking via Resend dashboard
- Consistent email experience across all app emails
- Supabase's `enable_confirmations` is set to `false` in `supabase/config.toml`

## Documentation

- `/design-documentation/` - Design system, tokens, component specs, accessibility guidelines
- `/docs/architecture-output.md` - Full system architecture
- `/docs/prd-host-dashboard.md` - Dashboard feature requirements
