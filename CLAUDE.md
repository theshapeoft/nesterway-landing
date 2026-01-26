# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

**📚 For comprehensive documentation, code examples, and detailed patterns, see [AGENTS.md](./AGENTS.md)**

---

## Development Commands

```bash
npm run dev          # Start dev server (port 3000) with Turbopack
npm run build        # Production build with Turbopack
npm run start        # Start production server
npm run lint         # ESLint check
npm run kill         # Kill processes on ports 3000-3005
```

### Supabase Commands

```bash
supabase start                   # Start local Supabase (ports 54321-54327)
supabase stop                    # Stop local Supabase
supabase migration new name      # Create timestamped migration
supabase db reset                # Reset local DB, run all migrations
supabase db push                 # Push to remote project
supabase migration list          # Show migration status
```

## Project Overview

Travelama is a digital guest guide and local attraction guide for short-let property owners. Hosts curate property information and area guides that guests access via QR code scan.

**Core Features:**
- Digital property guides (WiFi, appliances, house rules, checkout)
- Local area recommendations with interactive maps
- QR code access for guests (public or registration-required)
- Guest registration & invite system
- Host dashboard for property management
- Rich text editing with TipTap
- PDF guide generation
- Drag-and-drop content organization

## Tech Stack

- **Framework**: Next.js 16.1.0 (App Router) + React 19.2.3 + TypeScript 5 (strict)
- **Styling**: Tailwind CSS v4, Shadcn/ui (New York style), Phosphor Icons (primary), Lucide React (secondary)
- **Database**: Supabase (PostgreSQL 17 with RLS)
- **Auth**: Supabase Auth (email/password), middleware-protected routes
- **Email**: Resend (NEVER use Supabase email)
- **Rich Text**: TipTap (with character count)
- **Maps**: Google Maps API (@react-google-maps/api)
- **Drag & Drop**: DnD Kit
- **PDF**: jsPDF
- **QR Codes**: qrcode.react
- **Notifications**: Sonner

## Architecture

### Directory Structure

```
src/
├── app/
│   ├── (auth)/              # Auth pages (login, signup, verify-email, etc.)
│   ├── dashboard/           # Protected host routes
│   │   ├── properties/      # Property management
│   │   └── account/         # Account settings
│   ├── stay/[slug]/         # Public property pages (guest view)
│   ├── [country]/[area]/    # Destination guide pages
│   └── api/
│       └── auth/            # Email verification endpoint
├── components/
│   ├── ui/                  # Shadcn/ui base components
│   ├── auth/                # Authentication components
│   ├── property/            # Property page components
│   ├── area/                # Area guide components
│   ├── dashboard/           # Host dashboard components
│   ├── editor/              # TipTap rich text editor
│   └── landing/             # Landing page sections
├── lib/
│   ├── supabase/            # Client/server/middleware Supabase setup
│   ├── content/             # Data loaders (properties, areas, countries)
│   ├── email/               # Resend setup + branded templates
│   └── actions/             # Server Actions (auth, properties, etc.)
├── content/                 # Static content data (TypeScript objects)
│   ├── properties/          # Property data files
│   ├── areas/               # Area guide data files
│   └── countries/           # Country data files
├── hooks/                   # Custom React hooks
└── types/                   # TypeScript type definitions
```

### Data Flow Pattern

1. **Content Data**: Defined as TypeScript objects in `/src/content/`
2. **Database**: User accounts, properties metadata, guest registrations, access requests
3. **Supabase RLS**: Enforces host can only manage their properties
4. **Server Actions**: Handle mutations (create property, send invites, etc.)
5. **Middleware**: Protects `/dashboard/*` routes, manages session

### Multi-Tenancy

Properties are owned by hosts (users). RLS policies ensure hosts can only access/modify their own properties via `user_id` foreign key.

## Development Standards

### Notifications (ALWAYS use Sonner)

```typescript
import { toast } from 'sonner'

toast.success('Property saved')  // ✅ Correct
toast.error('Failed to save')    // ✅ Correct

// ❌ Don't use inline state-based alerts for transient messages
```

### Email (CRITICAL)

**All emails MUST be sent via Resend, NEVER Supabase email:**

```typescript
import { sendBrandedEmail, sendConfirmationEmail } from '@/lib/email'

// Pre-built templates
await sendConfirmationEmail(email, confirmationLink)
await sendPasswordResetEmail(email, resetLink)

// Custom emails
await sendBrandedEmail({
  to: 'user@example.com',
  subject: 'Your Subject',
  category: 'notification',
  template: {
    heading: 'Hello!',
    paragraphs: ['Your message here.'],
    button: { label: 'Click Me', url: 'https://...' }
  }
})
```

### Git Commits

Use conventional commit prefixes in lowercase:

| Prefix     | Purpose                  |
|------------|--------------------------|
| `fix`      | Bug fixes                |
| `feat`     | New features             |
| `docs`     | Documentation changes    |
| `refactor` | Code refactoring         |
| `chore`    | Maintenance tasks        |

### Database Migrations

- **Use timestamps** (generated by `supabase migration new`)
- **Never modify applied migrations** — create new ones to fix issues
- **Never rename migration files** — tracked by filename
- **One concern per migration**
- **Test locally first** with `supabase db reset`

Naming: lowercase with underscores, prefix with action (`create_`, `add_`, `fix_`)

## Critical Rules

### ✅ Always Do
- Use Sonner for notifications (never inline alerts)
- Use Resend for ALL emails (never Supabase email)
- Respect RLS policies in all queries
- Test migrations locally with `supabase db reset`
- Use Phosphor Icons as primary icon library
- Include character counts in rich text editors (TipTap)
- Validate QR code access modes (public vs registration-required)

### 🚫 Never Do
- Modify applied migrations (create new ones instead)
- Rename migration files (breaks Supabase tracking)
- Use Supabase email (use Resend instead)
- Skip RLS in database queries (security vulnerability)
- Commit secrets or .env files
- Force push to main branch
- Use `// @ts-ignore` without justification

### ⚠️ Ask First
- Modifying RLS policies (security implications)
- Adding new Supabase migrations (discuss schema design)
- Changing email templates (affects user communication)
- Modifying authentication flow (security-critical)
- Altering property access modes (affects guest experience)

## Code Philosophy

This codebase will outlive you. Every shortcut you take becomes someone else's burden. Every hack compounds into technical debt that slows the whole team down.

You are not just writing code. You are shaping the future of this project. The patterns you establish will be copied. The corners you cut will be cut again.

Fight entropy. Leave the codebase better than you found it.

## Path Aliases

`@/*` → `./src/*`

---

**Need more details?** Refer to [AGENTS.md](./AGENTS.md) for comprehensive patterns, examples, and workflows.
