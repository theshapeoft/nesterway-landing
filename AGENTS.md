---
description: Instructions for AI coding agents working on Travelama
globs:
  - "**/*"
alwaysApply: true
---

# Travelama - Digital Guest Guide Platform

A digital guest guide and local attraction guide for short-let property owners. Hosts curate property information and area guides that guests access via QR code scan.

## Quick Start Commands

```bash
# Installation & Setup
npm install

# Development
npm run dev                  # Starts dev server on port 3000 with Turbopack
npm run build                # Production build
npm start                    # Start production server
npm run kill                 # Kill processes on ports 3000-3005

# Code Quality
npm run lint                 # ESLint check

# Database (Supabase)
supabase start               # Start local Supabase (ports 54321-54327)
supabase stop                # Stop local Supabase
supabase migration new name  # Create timestamped migration
supabase db reset            # Reset local DB, run all migrations
supabase db push             # Push to remote project
supabase migration list      # Show migration status
```

## Tech Stack (Exact Versions)

- **Framework**: Next.js 16.1.0 (App Router) + React 19.2.3 + TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS v4 + Shadcn/ui (New York style) + Phosphor Icons (primary) + Lucide React (secondary)
- **Database**: Supabase PostgreSQL 17 with Row Level Security (RLS)
- **Auth**: Supabase Auth (email/password), middleware-protected routes
- **Email**: Resend 6.1 (NEVER use Supabase email)
- **Rich Text**: TipTap 3.16 (with character count, starter kit)
- **Maps**: Google Maps API 2.20.8
- **Drag & Drop**: DnD Kit 6.3.1 (core, sortable, modifiers, utilities)
- **PDF**: jsPDF 4.0.0
- **QR Codes**: qrcode.react 4.2.0
- **Notifications**: Sonner 2.0.7
- **Carousels**: Embla Carousel 8.6.0
- **Fonts**: Public Sans (primary), Geist Mono (monospace)

## Core Features

- **Property Guides**: WiFi networks, emergency contacts, appliances, house rules, checkout times
- **Area Guides**: Local recommendations, restaurants, attractions, categorized places
- **Interactive Maps**: Google Maps integration with custom markers
- **QR Code Access**: Public or registration-required access modes
- **Guest Registration**: Guests can register and request access to private guides
- **Guest Invites**: Hosts can send invite codes to specific guests
- **Rich Text Editing**: TipTap editor with character limits
- **PDF Generation**: Generate downloadable property guides
- **Drag & Drop**: Reorder content sections, photos, recommendations
- **Host Dashboard**: Property management, guest management, analytics

## Architecture

### Directory Structure

```
src/
├── app/
│   ├── (auth)/              # Auth pages (middleware excluded)
│   │   ├── login/           # Login page
│   │   ├── signup/          # Signup page
│   │   ├── verify-email/    # Email verification
│   │   ├── forgot-password/ # Password reset request
│   │   └── reset-password/  # Password reset
│   ├── dashboard/           # Protected host routes (middleware-secured)
│   │   ├── properties/      # Property CRUD
│   │   │   ├── [id]/        # Edit property
│   │   │   └── new/         # Create property
│   │   └── account/         # Account settings
│   ├── stay/[slug]/         # Public property pages (guest view via QR)
│   ├── [country]/[area]/    # Destination guide pages
│   ├── page.tsx             # Landing page
│   └── api/
│       └── auth/
│           └── send-confirmation/ # Email verification endpoint
├── components/
│   ├── ui/                  # Shadcn/ui components (Button, Input, Dialog, etc.)
│   ├── auth/                # AuthForm, PasswordInput, etc.
│   ├── property/            # PropertyHeader, WiFiCard, ApplianceGrid, etc.
│   ├── area/                # AreaCard, PlaceList, CategoryFilter, etc.
│   ├── dashboard/           # PropertyCard, PropertyForm, StatsCard, etc.
│   ├── editor/              # RichTextEditor (TipTap)
│   ├── landing/             # Landing page sections (Hero, Features, etc.)
│   │   ├── hero/
│   │   ├── features/
│   │   ├── pricing/
│   │   ├── social-proof/
│   │   └── ...
│   └── shared/              # Shared components (Navbar, Footer, etc.)
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # Client-side Supabase (anon key)
│   │   ├── server.ts        # Server-side Supabase (service role)
│   │   └── middleware.ts    # Session management
│   ├── content/             # Data loaders
│   │   ├── properties.ts    # Load property data
│   │   ├── areas.ts         # Load area data
│   │   └── countries.ts     # Load country data
│   ├── email/               # Resend setup
│   │   ├── index.ts         # Email service functions
│   │   └── templates.ts     # Branded HTML templates
│   ├── actions/             # Server Actions
│   │   ├── auth.ts          # Auth actions (signup, confirm, reset)
│   │   └── properties.ts    # Property actions
│   └── utils.ts             # Utility functions (cn, etc.)
├── content/                 # Static content data (TypeScript objects)
│   ├── properties/          # Property data files
│   │   └── example.ts       # Example: { wifi: [], appliances: [], ... }
│   ├── areas/               # Area guide data files
│   │   └── example.ts       # Example: { places: [], recommendations: [] }
│   └── countries/           # Country data files
│       └── example.ts       # Example: { areas: [], travelTips: [] }
├── hooks/                   # Custom React hooks
│   ├── useInView.ts         # Intersection Observer hook
│   └── ...
├── types/                   # TypeScript type definitions
│   └── index.ts             # Property, Area, Country, Guest, etc.
└── middleware.ts            # Next.js middleware (auth + session refresh)
```

**Path Alias**: `@/*` → `./src/*`

### Data Flow Pattern

1. **Static Content**: Defined as TypeScript objects in `/src/content/`
   - Properties, areas, countries are exported as typed objects
   - Loaded via functions in `/src/lib/content/`
2. **Database**: Stores user accounts, properties metadata, guest data
3. **Server Actions**: Handle mutations (create property, register guest, etc.)
4. **RLS Policies**: Ensure hosts can only access their own properties
5. **Middleware**: Protects `/dashboard/*` routes, refreshes sessions

```typescript
// Example: Loading property data
// 1. Content file (src/content/properties/villa-santorini.ts)
export const villaSantorini: Property = {
  id: 'villa-santorini',
  name: 'Villa Santorini',
  wifi: [{ network: 'VillaSantorini_5G', password: 'welcome123' }],
  // ...
}

// 2. Loader function (src/lib/content/properties.ts)
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  // Dynamic import based on slug
  const property = await import(`@/content/properties/${slug}`)
  return property.default
}

// 3. Server Component (src/app/stay/[slug]/page.tsx)
const property = await getPropertyBySlug(params.slug)
```

### Multi-Tenancy Model

- **Core Tenant**: `properties` table with `user_id` (host)
- **Guest Data**: `guests` and `guest_invites` tables linked to properties
- **RLS Enforcement**: Policies filter by `user_id` for hosts
- **Data Isolation**: Hosts can only access/modify their own properties

## Code Style & Patterns

### Notifications (ALWAYS use Sonner)

```typescript
import { toast } from 'sonner'

// ✅ Correct - transient success/error messages
toast.success('Property saved')
toast.error('Failed to save property')
toast.info('Processing...')
toast.warning('This action cannot be undone')

// ❌ Never use inline state-based alerts for transient messages
```

### Email (CRITICAL - ALWAYS use Resend)

**NEVER use Supabase's built-in email functionality. ALL emails MUST be sent via Resend.**

```typescript
// src/lib/email/index.ts
import { sendBrandedEmail, sendConfirmationEmail, sendPasswordResetEmail } from '@/lib/email'

// ✅ Correct - Pre-built templates
await sendConfirmationEmail(email, confirmationLink)
await sendPasswordResetEmail(email, resetLink)

// ✅ Correct - Custom branded email
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

// ❌ NEVER use Supabase email
// Supabase enable_confirmations is set to false in supabase/config.toml
```

### Server Actions Pattern

```typescript
// src/lib/actions/properties.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProperty(formData: FormData) {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  // Insert property (RLS enforces user_id)
  const { data, error } = await supabase
    .from('properties')
    .insert({
      name: formData.get('name'),
      slug: formData.get('slug'),
      user_id: user.id
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/properties')
  return { success: true, data }
}
```

### Form Validation with TipTap

```typescript
// src/components/editor/RichTextEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CharacterCount from '@tiptap/extension-character-count'

const editor = useEditor({
  extensions: [
    StarterKit,
    CharacterCount.configure({
      limit: 5000
    })
  ],
  content: initialContent,
  onUpdate: ({ editor }) => {
    onChange(editor.getHTML())
  }
})

// Display character count
<div>
  {editor.storage.characterCount.characters()}/{5000}
</div>
```

### Supabase RLS Pattern

```sql
-- Example RLS policy for properties table
CREATE POLICY "Users can view their own properties"
ON properties FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own properties"
ON properties FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties"
ON properties FOR UPDATE
USING (auth.uid() = user_id);
```

### Icons Convention

```typescript
// Prefer Phosphor Icons (primary)
import { House, MapPin, WifiHigh } from '@phosphor-icons/react'

// Use Lucide React as fallback for missing icons
import { Settings } from 'lucide-react'
```

### Component Organization

```typescript
// Order of code blocks in components:
// 1. Imports (external, internal, types, styles)
// 2. Types/interfaces
// 3. Component definition
// 4. Hooks (useState, useEditor, etc.)
// 5. Event handlers
// 6. Effects
// 7. Render helpers
// 8. Return JSX

// Example:
'use client'

import { useState } from 'react'
import { House } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Property } from '@/types'

interface Props {
  property: Property
}

export function PropertyCard({ property }: Props) {
  const [expanded, setExpanded] = useState(false)

  const handleExpand = () => {
    setExpanded(!expanded)
    toast.info(expanded ? 'Collapsed' : 'Expanded')
  }

  if (!property) return <div>Property not found</div>

  return (
    <div>
      <House size={24} />
      <h2>{property.name}</h2>
      <Button onClick={handleExpand}>
        {expanded ? 'Collapse' : 'Expand'}
      </Button>
    </div>
  )
}
```

## Git Workflow

### Commit Message Convention

Use lowercase conventional commit prefixes:

```bash
# Format: <prefix>: <description>

fix: resolve WiFi password display bug
feat: add guest registration flow
feat(qr): implement dynamic QR code generation
docs: update email setup guide
refactor: simplify property loader logic
chore: update dependencies
```

| Prefix     | Purpose                  |
|------------|--------------------------|
| `fix`      | Bug fixes                |
| `feat`     | New features             |
| `docs`     | Documentation changes    |
| `refactor` | Code refactoring         |
| `chore`    | Maintenance tasks        |

### Branch Strategy

- **Main branch**: `master` (production)
- **Feature branches**: `feature/descriptive-name` or `fix/issue-description`

### Pull Request Guidelines

1. **Title format**: Use conventional commit format
2. **Pre-merge checklist**:
   - [ ] `npm run lint` passes
   - [ ] All TypeScript errors resolved
   - [ ] Manual testing completed
   - [ ] No console errors in browser
   - [ ] Email templates render correctly (if changed)
   - [ ] QR codes generate correctly (if changed)

## Database Migrations

### Migration Rules

1. **Always use timestamps**: Generated automatically by `supabase migration new`
2. **One concern per migration**: Don't mix schema changes with data changes
3. **Test locally first**: Use `supabase db reset` before pushing
4. **Naming convention**: `YYYYMMDDHHMMSS_descriptive_name.sql`
   - Use lowercase with underscores
   - Prefix with action: `create_`, `add_`, `fix_`, `alter_`
   - Example: `20250123000000_add_guest_registration.sql`

### Migration Workflow

```bash
# 1. Create new migration
supabase migration new add_property_images

# 2. Edit the generated SQL file in supabase/migrations/

# 3. Test locally
supabase db reset  # Runs all migrations from scratch

# 4. Verify
supabase migration list

# 5. Push to production
supabase db push
```

### Existing Migrations

- `20241222000000_create_hosts_and_properties.sql` - Initial schema
- `20250114000000_add_hero_image.sql` - Hero images for properties
- `20250114000001_create_storage_buckets.sql` - File storage setup
- `20250114000002_add_location_fields.sql` - Geolocation data
- `20250123000000_add_access_mode.sql` - Public vs registration-required
- `20250123000001_add_guest_registration.sql` - Guest accounts
- `20250123000002_add_guest_invites.sql` - Invite codes
- `20250123000003_add_access_requests.sql` - Guest access requests
- `20250123000004_add_interactive_maps.sql` - Map markers and routes

## Boundaries & Constraints

### ✅ Always Do

- **Use Sonner for notifications** - Never use inline state-based alerts
- **Use Resend for ALL emails** - NEVER use Supabase email functionality
- **Use Phosphor Icons as primary** - Lucide React as secondary fallback
- **Include character counts** - TipTap editors must show character limits
- **Validate access modes** - Check if property requires guest registration
- **Test QR codes** - Verify QR codes link to correct property pages
- **Follow RLS patterns** - All property queries must respect `user_id`
- **Use TypeScript strict mode** - No `any` types without justification
- **Revalidate paths** - Use `revalidatePath()` after mutations in Server Actions
- **Sanitize HTML** - Use DOMPurify for user-generated HTML content

### ⚠️ Ask First

- **Modifying RLS policies** - Security implications, requires careful review
- **Adding new Supabase migrations** - Discuss schema design before creating
- **Changing email templates** - Affects user communication, review branding
- **Modifying authentication flow** - Security-critical, needs thorough testing
- **Altering access control** - Affects guest vs host permissions
- **Adding new integrations** - Consider API limits, costs, reliability
- **Changing QR code behavior** - Affects guest onboarding experience

### 🚫 Never Do

- **Modify applied migrations** - Create new migrations to fix issues instead
- **Rename migration files** - Supabase tracks by filename, will break history
- **Use Supabase email** - ALWAYS use Resend instead
- **Skip RLS checks** - Security vulnerability, exposes cross-user data
- **Commit secrets or .env files** - Use environment variables
- **Use `// @ts-ignore` without justification** - Fix types properly
- **Create backwards-compatibility hacks** - Delete unused code completely
- **Skip email template testing** - Always preview emails before sending
- **Hardcode API keys** - Use environment variables for all credentials
- **Force push to master** - Destructive, loses history

## Testing & Quality

### Pre-Deployment Checklist

```bash
# 1. Lint check
npm run lint

# 2. TypeScript check
npx tsc --noEmit

# 3. Build test
npm run build
```

### Manual Testing Areas

- **Authentication**: Test login, signup, email verification, password reset
- **Property Access**: Test QR code scanning, public vs registration modes
- **Guest Registration**: Test guest signup, access requests, invite codes
- **Rich Text Editor**: Test character limits, HTML sanitization, formatting
- **PDF Generation**: Test PDF downloads, content rendering
- **Drag & Drop**: Test reordering sections, photos, recommendations
- **Email Delivery**: Test all email templates render correctly
- **Responsive Design**: Test on mobile, tablet, desktop viewports
- **Maps Integration**: Test Google Maps markers, routes, custom styling

## Common Tasks

### Adding a New Property Feature

1. **Update types**: Add field to `Property` type in `src/types/index.ts`
2. **Update content files**: Add field to example content files
3. **Create UI component**: Add component to display/edit new field
4. **Update property form**: Add input field in dashboard form
5. **Update database migration**: Add column to `properties` table (if needed)
6. **Test locally**: Create test property with new field

### Creating a New Email Template

1. **Create template function**: Add to `src/lib/email/templates.ts`
2. **Use branded email wrapper**: Include logo, footer, styling
3. **Test template**: Send test email to verify rendering
4. **Add to email service**: Export function from `src/lib/email/index.ts`
5. **Document usage**: Add example to this file

### Adding a New Area Guide

1. **Create content file**: `src/content/areas/new-area.ts`
2. **Define area object**: Follow `Area` type structure
3. **Add to country**: Reference in parent country's areas list
4. **Create route**: Add dynamic route in `src/app/[country]/[area]/page.tsx`
5. **Test loading**: Verify area loads correctly via URL

### Debugging Multi-Tenant Issues

```typescript
// Check current user and property ownership
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

// Verify property ownership
const { data: property } = await supabase
  .from('properties')
  .select('*')
  .eq('id', propertyId)
  .single()

if (property.user_id !== user.id) {
  throw new Error('Unauthorized: Property does not belong to user')
}
```

## Project-Specific Conventions

### File Naming

- **Components**: PascalCase (e.g., `PropertyCard.tsx`)
- **Content files**: kebab-case (e.g., `villa-santorini.ts`)
- **Hooks**: camelCase with `use` prefix (e.g., `useInView.ts`)
- **Types**: PascalCase for type names, kebab-case for files
- **Actions**: camelCase functions in kebab-case files (e.g., `properties.ts`)

### Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM=
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=
```

### Port Management

Dev server uses ports 3000-3005. The `predev` script automatically kills processes on these ports to prevent conflicts.

## Resources

- **Documentation**: See `/docs` directory for feature-specific docs
  - `/docs/architecture-output.md` - Full system architecture
  - `/docs/prd-host-dashboard.md` - Dashboard feature requirements
- **Design Documentation**: `/design-documentation` for design system
- **PRDs**: `/docs/archived-prds/` for historical requirements
- **Competitor Research**: `/project-documentation/competitor-research.md`

## Code Philosophy

This codebase will outlive you. Every shortcut you take becomes someone else's burden. Every hack compounds into technical debt that slows the whole team down.

You are not just writing code. You are shaping the future of this project. The patterns you establish will be copied. The corners you cut will be cut again.

Fight entropy. Leave the codebase better than you found it.

---

**For Claude Code**: This file provides comprehensive guidance for AI coding agents. Follow these patterns and constraints to maintain code quality and security. When in doubt, ask before proceeding with significant architectural changes.
