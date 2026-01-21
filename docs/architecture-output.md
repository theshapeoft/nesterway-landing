# Travelama — Technical Architecture Document

**Version**: 1.0
**Last Updated**: 21 December 2025
**Status**: Ready for Implementation

---

## Executive Summary

### Project Overview

Travelama is a digital house manual and destination guide platform that enables short-term rental guests to access property information and local recommendations via QR code scanning. The system separates "how does this place work" (property-specific) from "what should I do here" (destination-shared), creating a scalable content architecture.

### Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | **Next.js 15.5.7+ (App Router)** | Static generation for speed, React for interactivity, excellent DX. **Note:** Must use patched version due to CVE-2025-66478 |
| Styling | **Tailwind CSS** | Rapid development, design system alignment, small bundle size |
| Content Management | **MDX in repository** | Simple MVP, version controlled, no external dependencies |
| Database (Future) | **PostgreSQL via Supabase** | Relational data model, auth built-in, generous free tier |
| Hosting | **Vercel** | Edge deployment, automatic CI/CD, Next.js optimization |
| PWA | **next-pwa** | Offline capability for critical property info |

### Technology Stack Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Next.js    │  │  Tailwind   │  │  Service Worker (PWA)   │  │
│  │  App Router │  │    CSS      │  │  Offline Caching        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                      APPLICATION LAYER                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  React      │  │  MDX        │  │  QR Generation          │  │
│  │  Components │  │  Content    │  │  (Client-side)          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                        DATA LAYER (MVP)                         │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Static MDX/JSON Content in Repository                      ││
│  │  /content/properties/*.mdx                                  ││
│  │  /content/areas/*.mdx                                       ││
│  │  /content/countries/*.mdx                                   ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│                    DATA LAYER (Future)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Supabase   │  │  Supabase   │  │  Cloudinary/Vercel Blob │  │
│  │  PostgreSQL │  │  Auth       │  │  Image Storage          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                      INFRASTRUCTURE                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Vercel     │  │  Vercel     │  │  Vercel Analytics       │  │
│  │  Hosting    │  │  Edge CDN   │  │  Speed Insights         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Critical Technical Constraints

| Constraint | Target | Implementation |
|------------|--------|----------------|
| Page Load | < 2 seconds | Static generation, edge CDN, optimized images |
| Page Weight | < 500KB | Tailwind purging, lazy loading, WebP images |
| Offline Access | Critical content cached | Service Worker with stale-while-revalidate |
| Mobile First | 95%+ mobile users | Responsive design, touch targets 44px+ |
| Browser Support | iOS Safari, Android Chrome (last 3 versions) | Modern CSS, progressive enhancement |

### Security Advisory: CVE-2025-66478

**CRITICAL (CVSS 10.0)**: A vulnerability in the React Server Components (RSC) protocol affects Next.js applications using the App Router.

| Aspect | Details |
|--------|---------|
| **Vulnerability** | Untrusted inputs can influence server-side execution, potentially leading to RCE |
| **Origin** | Upstream React issue (CVE-2025-55182) |
| **Affected Versions** | Next.js 15.x (all unpatched), 16.x (all unpatched), 14.3.0-canary.77+ |
| **Not Affected** | Next.js 13.x stable, 14.x stable, Pages Router apps, Edge Runtime deployments |
| **Required Action** | **Upgrade to Next.js 15.5.7 or later** — no workaround exists |

**Post-deployment checklist:**
- [ ] Rotate all application secrets and environment variables
- [ ] Review server logs for suspicious RSC requests
- [ ] Verify deployment uses patched version

---

## For Backend Engineers

### System Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        URL ROUTING                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  /stay/{property-slug}     →  Property Page (Semi-private)      │
│  /{country}                →  Country Overview (Public)          │
│  /{country}/{area}         →  Area Guide (Public)                │
│  /{country}/{area}/{cat}   →  Category Page (Public)            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### API Endpoint Specifications

For MVP, content is statically generated. The following API structure is designed for future host dashboard functionality.

#### Properties API

##### GET /api/properties

List all properties (authenticated, host-only).

**Request Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "properties": [
    {
      "id": "uuid",
      "slug": "sliema-sanctuary",
      "name": "Sliema Sanctuary",
      "area_id": "uuid",
      "area_name": "Sliema",
      "country_name": "Malta",
      "is_active": true,
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-20T14:22:00Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "per_page": 20
  }
}
```

##### GET /api/properties/{slug}

Get single property details.

**Response (200 OK):**
```json
{
  "id": "uuid",
  "slug": "sliema-sanctuary",
  "name": "Sliema Sanctuary",
  "area": {
    "id": "uuid",
    "slug": "sliema",
    "name": "Sliema",
    "country": {
      "id": "uuid",
      "slug": "malta",
      "name": "Malta"
    }
  },
  "host": {
    "name": "Maria",
    "photo_url": "https://..."
  },
  "welcome_message": "Welcome! We're so happy to have you...",
  "wifi": {
    "networks": [
      {
        "name": "PropertyWiFi_5G",
        "password": "SecurePass123",
        "type": "WPA",
        "description": "Recommended for streaming"
      }
    ]
  },
  "checkout_time": "11:00",
  "emergency_contact": {
    "name": "Maria",
    "phone": "+356 1234 5678",
    "email": "maria@example.com"
  },
  "sections": [
    {
      "id": "house-rules",
      "title": "House Rules",
      "icon": "clipboard-list",
      "content": [
        { "type": "rule", "text": "No smoking inside", "severity": "critical" },
        { "type": "rule", "text": "Quiet hours: 10pm - 8am", "severity": "normal" },
        { "type": "rule", "text": "Maximum 4 guests", "severity": "normal" }
      ]
    },
    {
      "id": "appliances",
      "title": "Appliances & How-Tos",
      "icon": "plug",
      "content": [
        {
          "type": "appliance",
          "name": "Washing Machine",
          "location": "Kitchen",
          "instructions": "Standard cycle on dial 3..."
        }
      ]
    }
  ],
  "is_active": true,
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-20T14:22:00Z"
}
```

**Error Responses:**

```json
// 404 Not Found
{
  "error": "property_not_found",
  "message": "Property with slug 'invalid-slug' not found"
}

// 403 Forbidden (for inactive properties)
{
  "error": "property_inactive",
  "message": "This property is currently not active"
}
```

##### POST /api/properties

Create new property (authenticated).

**Request Body:**
```json
{
  "name": "Valletta Views",
  "area_id": "uuid",
  "wifi": {
    "networks": [
      {
        "name": "VallettaWiFi",
        "password": "password123",
        "type": "WPA"
      }
    ]
  },
  "checkout_time": "10:00",
  "emergency_contact": {
    "name": "John",
    "phone": "+356 9876 5432"
  }
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "slug": "valletta-views",
  "name": "Valletta Views",
  "qr_url": "/api/properties/valletta-views/qr",
  "page_url": "/stay/valletta-views"
}
```

##### PUT /api/properties/{slug}

Update property (authenticated, owner-only).

##### DELETE /api/properties/{slug}

Soft-delete property (sets `is_active: false`).

---

#### Areas API (Read-only for MVP)

##### GET /api/areas

List all areas.

**Response (200 OK):**
```json
{
  "areas": [
    {
      "id": "uuid",
      "slug": "sliema",
      "name": "Sliema",
      "country_slug": "malta",
      "tagline": "Malta's modern waterfront",
      "hero_image": "https://...",
      "vibe": "Relaxed beach town with modern seafront promenade",
      "best_for": ["Beach", "Dining", "Walking"],
      "categories": ["food-drink", "things-to-do", "beaches", "nightlife", "shopping"]
    }
  ]
}
```

##### GET /api/areas/{country}/{area}

Get area with recommendations.

**Response (200 OK):**
```json
{
  "id": "uuid",
  "slug": "sliema",
  "name": "Sliema",
  "country": {
    "id": "uuid",
    "slug": "malta",
    "name": "Malta"
  },
  "tagline": "Malta's modern waterfront",
  "hero_image": "https://...",
  "vibe": "Relaxed beach town with modern seafront promenade",
  "best_for": ["Beach", "Dining", "Walking"],
  "getting_around": "Easy walking, buses to Valletta every 15 minutes",
  "categories": [
    {
      "slug": "food-drink",
      "name": "Food & Drink",
      "icon": "utensils",
      "recommendation_count": 7
    }
  ],
  "recommendations": [
    {
      "id": "uuid",
      "name": "Ta' Kris Restaurant",
      "category": "food-drink",
      "cuisine": "Maltese Traditional",
      "description": "Authentic rabbit stew and fresh ftira in a cozy setting...",
      "price_range": "€€",
      "distance": "5 min walk",
      "image_url": "https://...",
      "google_maps_query": "Ta' Kris Restaurant, Sliema, Malta",
      "badge": "Must Try"
    }
  ],
  "local_insights": [
    "The best sunset spot is at Independence Gardens, not the crowded promenade",
    "Skip the tourist restaurants on Tower Road - head one block inland for authentic prices"
  ]
}
```

---

#### QR Code API

##### GET /api/properties/{slug}/qr

Generate QR code for property.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| format | string | "png" | Output format: png, svg, pdf |
| size | number | 200 | Size in pixels (png/svg) |
| include_branding | boolean | true | Include Travelama branding |

**Response (200 OK):**
- Content-Type: `image/png`, `image/svg+xml`, or `application/pdf`
- Binary image/PDF data

---

#### Analytics API (Simple)

##### POST /api/analytics/event

Track page view or interaction event.

**Request Body:**
```json
{
  "event": "page_view",
  "property_id": "uuid",
  "timestamp": "2025-01-20T14:22:00Z",
  "metadata": {
    "source": "qr_scan",
    "user_agent": "Mozilla/5.0...",
    "referrer": null
  }
}
```

**Response (204 No Content)**

---

### Database Schema

```sql
-- Countries table
CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    hero_image_url TEXT,
    practical_info JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for URL routing
CREATE INDEX idx_countries_slug ON countries(slug);

-- Areas table
CREATE TABLE areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    slug VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    tagline VARCHAR(200),
    description TEXT,
    hero_image_url TEXT,
    vibe TEXT,
    best_for TEXT[] DEFAULT '{}',
    getting_around TEXT,
    local_insights TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(country_id, slug)
);

-- Indexes
CREATE INDEX idx_areas_country ON areas(country_id);
CREATE INDEX idx_areas_slug ON areas(slug);

-- Hosts table (Future)
CREATE TABLE hosts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    photo_url TEXT,
    subscription_tier VARCHAR(20) DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hosts_email ON hosts(email);

-- Properties table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    area_id UUID NOT NULL REFERENCES areas(id) ON DELETE RESTRICT,
    host_id UUID REFERENCES hosts(id) ON DELETE SET NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    welcome_message TEXT,
    host_name VARCHAR(100),
    host_photo_url TEXT,
    checkout_time TIME DEFAULT '11:00',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_properties_slug ON properties(slug);
CREATE INDEX idx_properties_area ON properties(area_id);
CREATE INDEX idx_properties_host ON properties(host_id);
CREATE INDEX idx_properties_active ON properties(is_active) WHERE is_active = true;

-- WiFi Networks table
CREATE TABLE wifi_networks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    security_type VARCHAR(20) DEFAULT 'WPA',
    description VARCHAR(200),
    is_primary BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wifi_property ON wifi_networks(property_id);

-- Emergency Contacts table
CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    is_primary BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_emergency_property ON emergency_contacts(property_id);

-- Property Sections table (flexible content blocks)
CREATE TABLE property_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    section_type VARCHAR(50) NOT NULL, -- 'house-rules', 'appliances', 'checkin', 'parking', 'emergency', 'notes'
    title VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    content JSONB NOT NULL DEFAULT '[]',
    display_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sections_property ON property_sections(property_id);
CREATE INDEX idx_sections_type ON property_sections(section_type);

-- Recommendation Categories table
CREATE TABLE recommendation_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    display_order INT DEFAULT 0
);

-- Recommendations table
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    area_id UUID NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES recommendation_categories(id) ON DELETE RESTRICT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    cuisine_type VARCHAR(100), -- for restaurants
    price_range VARCHAR(10), -- €, €€, €€€, €€€€
    distance VARCHAR(50),
    image_url TEXT,
    google_maps_query VARCHAR(300),
    badge VARCHAR(50), -- 'Must Try', 'Hidden Gem', etc.
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_recommendations_area ON recommendations(area_id);
CREATE INDEX idx_recommendations_category ON recommendations(category_id);
CREATE INDEX idx_recommendations_active ON recommendations(is_active) WHERE is_active = true;

-- Analytics Events table (Simple)
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    area_id UUID REFERENCES areas(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partitioned by month for efficient querying
CREATE INDEX idx_analytics_property ON analytics_events(property_id);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);
CREATE INDEX idx_analytics_type ON analytics_events(event_type);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_countries_updated
    BEFORE UPDATE ON countries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_areas_updated
    BEFORE UPDATE ON areas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_properties_updated
    BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_sections_updated
    BEFORE UPDATE ON property_sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_recommendations_updated
    BEFORE UPDATE ON recommendations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### Entity Relationship Diagram

```
┌─────────────────┐
│    countries    │
├─────────────────┤
│ id (PK)         │
│ slug            │◄─────────────────────────────────────┐
│ name            │                                      │
│ description     │                                      │
│ hero_image_url  │                                      │
│ practical_info  │                                      │
└────────┬────────┘                                      │
         │                                               │
         │ 1:N                                           │
         ▼                                               │
┌─────────────────┐                                      │
│     areas       │                                      │
├─────────────────┤                                      │
│ id (PK)         │                                      │
│ country_id (FK) │──────────────────────────────────────┘
│ slug            │◄─────────────────────────────────────┐
│ name            │                                      │
│ tagline         │                                      │
│ vibe            │                                      │
│ best_for[]      │                                      │
│ local_insights[]│                                      │
└────────┬────────┘                                      │
         │                                               │
         │ 1:N                         1:N               │
         ▼                              ▼                │
┌─────────────────┐         ┌─────────────────────┐      │
│   properties    │         │   recommendations   │      │
├─────────────────┤         ├─────────────────────┤      │
│ id (PK)         │         │ id (PK)             │      │
│ area_id (FK)    │─────────│ area_id (FK)        │──────┘
│ host_id (FK)    │         │ category_id (FK)    │──────┐
│ slug            │         │ name                │      │
│ name            │         │ description         │      │
│ welcome_message │         │ price_range         │      │
│ checkout_time   │         │ badge               │      │
│ is_active       │         └─────────────────────┘      │
└────────┬────────┘                                      │
         │                                               │
         │ 1:N                                           │
    ┌────┴────┬────────────────┐                         │
    ▼         ▼                ▼                         │
┌────────┐ ┌──────────┐ ┌───────────────┐                │
│ wifi   │ │emergency │ │property       │                │
│networks│ │contacts  │ │sections       │                │
└────────┘ └──────────┘ └───────────────┘                │
                                                         │
┌───────────────────────────┐                            │
│ recommendation_categories │                            │
├───────────────────────────┤                            │
│ id (PK)                   │◄───────────────────────────┘
│ slug                      │
│ name                      │
│ icon                      │
└───────────────────────────┘
```

---

### Business Logic Organization

```
/src
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes group
│   │   ├── [country]/
│   │   │   ├── page.tsx          # Country overview
│   │   │   └── [area]/
│   │   │       ├── page.tsx      # Area guide
│   │   │       └── [category]/
│   │   │           └── page.tsx  # Category page
│   │   └── stay/
│   │       └── [slug]/
│   │           └── page.tsx      # Property page
│   ├── api/                      # API routes (future)
│   │   ├── properties/
│   │   ├── areas/
│   │   └── analytics/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Accordion.tsx
│   │   ├── BottomSheet.tsx
│   │   ├── Toast.tsx
│   │   └── ...
│   ├── property/                 # Property page components
│   │   ├── PropertyHeader.tsx
│   │   ├── QuickAccessBar.tsx
│   │   ├── WiFiModal.tsx
│   │   ├── PropertySection.tsx
│   │   └── ExploreCTA.tsx
│   ├── area/                     # Area guide components
│   │   ├── AreaHero.tsx
│   │   ├── QuickStats.tsx
│   │   ├── CategoryNav.tsx
│   │   ├── RecommendationCard.tsx
│   │   └── LocalInsights.tsx
│   └── country/                  # Country page components
│       ├── CountryHero.tsx
│       ├── AreaGrid.tsx
│       └── CountryTips.tsx
├── lib/
│   ├── content/                  # Content fetching
│   │   ├── properties.ts
│   │   ├── areas.ts
│   │   └── countries.ts
│   ├── utils/
│   │   ├── qr.ts                 # QR code generation
│   │   ├── clipboard.ts          # Clipboard API
│   │   └── analytics.ts          # Analytics helpers
│   └── constants/
│       └── index.ts
├── content/                      # MDX content (MVP)
│   ├── properties/
│   │   └── sliema-sanctuary.mdx
│   ├── areas/
│   │   └── malta/
│   │       └── sliema.mdx
│   └── countries/
│       └── malta.mdx
├── types/
│   ├── property.ts
│   ├── area.ts
│   ├── country.ts
│   └── index.ts
└── hooks/
    ├── useClipboard.ts
    ├── useOffline.ts
    └── useAnalytics.ts
```

---

### Authentication & Authorization (Future)

For MVP, authentication is not required. Future implementation:

```typescript
// lib/auth/config.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Middleware for protected routes
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect /dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/properties/:path*'],
};
```

### Error Handling Strategy

```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ErrorCodes = {
  PROPERTY_NOT_FOUND: 'property_not_found',
  PROPERTY_INACTIVE: 'property_inactive',
  AREA_NOT_FOUND: 'area_not_found',
  COUNTRY_NOT_FOUND: 'country_not_found',
  UNAUTHORIZED: 'unauthorized',
  VALIDATION_ERROR: 'validation_error',
} as const;

// API error response format
export interface ErrorResponse {
  error: string;
  message: string;
  details?: Record<string, string[]>;
}

// Usage in API routes
export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.code, message: error.message },
      { status: error.statusCode }
    );
  }

  console.error('Unexpected error:', error);
  return NextResponse.json(
    { error: 'internal_error', message: 'An unexpected error occurred' },
    { status: 500 }
  );
}
```

---

## For Frontend Engineers

### Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT HIERARCHY                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Property Page (/stay/[slug])                                   │
│  ├── PropertyHeader                                             │
│  │   ├── HostPhoto                                              │
│  │   ├── PropertyTitle                                          │
│  │   └── WelcomeMessage                                         │
│  ├── QuickAccessBar                                             │
│  │   ├── QuickAccessButton (Wi-Fi)                              │
│  │   ├── QuickAccessButton (Checkout)                           │
│  │   ├── QuickAccessButton (Emergency)                          │
│  │   └── QuickAccessButton (Explore)                            │
│  ├── PropertySections                                           │
│  │   └── Accordion[] (House Rules, Appliances, etc.)            │
│  ├── ExploreCTA                                                 │
│  └── WiFiModal (Bottom Sheet)                                   │
│      ├── NetworkSelector (if multiple)                          │
│      ├── PasswordCopyField                                      │
│      ├── WiFiQRCode                                             │
│      └── TroubleshootingSection                                 │
│                                                                  │
│  Area Guide (/{country}/{area})                                 │
│  ├── AreaHero                                                   │
│  ├── QuickStats                                                 │
│  │   ├── VibeStat                                               │
│  │   ├── BestForTags                                            │
│  │   └── GettingAroundStat                                      │
│  ├── CategoryNav                                                │
│  ├── RecommendationsGrid                                        │
│  │   └── RecommendationCard[]                                   │
│  ├── LocalInsights                                              │
│  └── CountryLink                                                │
│                                                                  │
│  Country Overview (/{country})                                  │
│  ├── CountryHero                                                │
│  ├── AreasGrid                                                  │
│  │   └── AreaCard[]                                             │
│  └── CountryTips                                                │
│      └── TipCard[]                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### State Management Approach

For MVP, use React's built-in state management:

```typescript
// No global state library needed for MVP
// Use React Context for cross-cutting concerns only

// contexts/OfflineContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface OfflineContextType {
  isOffline: boolean;
  hasCache: boolean;
}

const OfflineContext = createContext<OfflineContextType>({
  isOffline: false,
  hasCache: false,
});

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);
  const [hasCache, setHasCache] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if service worker has cached content
    if ('caches' in window) {
      caches.has('travelama-v1').then(setHasCache);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <OfflineContext.Provider value={{ isOffline, hasCache }}>
      {children}
    </OfflineContext.Provider>
  );
}

export const useOffline = () => useContext(OfflineContext);
```

### Component State Patterns

```typescript
// components/property/WiFiModal.tsx
'use client';

import { useState, useCallback } from 'react';
import { useClipboard } from '@/hooks/useClipboard';

interface WiFiNetwork {
  name: string;
  password: string;
  type: 'WPA' | 'WEP' | 'nopass';
  description?: string;
}

interface WiFiModalProps {
  networks: WiFiNetwork[];
  isOpen: boolean;
  onClose: () => void;
}

export function WiFiModal({ networks, isOpen, onClose }: WiFiModalProps) {
  const [selectedNetwork, setSelectedNetwork] = useState(0);
  const { copy, hasCopied, error } = useClipboard();

  const handleCopy = useCallback(() => {
    copy(networks[selectedNetwork].password);
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [copy, networks, selectedNetwork]);

  if (!isOpen) return null;

  const network = networks[selectedNetwork];

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-center mb-6">
          Wi-Fi Connection
        </h2>

        {networks.length > 1 && (
          <NetworkSelector
            networks={networks}
            selected={selectedNetwork}
            onSelect={setSelectedNetwork}
          />
        )}

        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase text-neutral-500 tracking-wide">
              Network Name
            </label>
            <p className="text-xl font-semibold text-neutral-800">
              {network.name}
            </p>
          </div>

          <div>
            <label className="text-xs uppercase text-neutral-500 tracking-wide">
              Password
            </label>
            <PasswordCopyField
              password={network.password}
              onCopy={handleCopy}
              hasCopied={hasCopied}
            />
          </div>

          <WiFiQRCode
            ssid={network.name}
            password={network.password}
            type={network.type}
          />
        </div>

        <TroubleshootingSection networkName={network.name} />
      </div>
    </BottomSheet>
  );
}
```

### API Integration Patterns

```typescript
// lib/content/properties.ts
import { Property } from '@/types';
import { notFound } from 'next/navigation';

// MVP: Static content from MDX files
export async function getProperty(slug: string): Promise<Property> {
  try {
    const { default: content, frontmatter } = await import(
      `@/content/properties/${slug}.mdx`
    );

    return {
      slug,
      ...frontmatter,
      content,
    };
  } catch {
    notFound();
  }
}

export async function getAllPropertySlugs(): Promise<string[]> {
  // For static generation
  const fs = await import('fs/promises');
  const path = await import('path');

  const contentDir = path.join(process.cwd(), 'content/properties');
  const files = await fs.readdir(contentDir);

  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace('.mdx', ''));
}

// Future: API-based fetching
export async function getPropertyFromAPI(slug: string): Promise<Property> {
  const res = await fetch(`${process.env.API_URL}/api/properties/${slug}`, {
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!res.ok) {
    if (res.status === 404) notFound();
    throw new Error('Failed to fetch property');
  }

  return res.json();
}
```

### Routing and Navigation Architecture

```typescript
// app/(public)/stay/[slug]/page.tsx
import { Metadata } from 'next';
import { getProperty, getAllPropertySlugs } from '@/lib/content/properties';
import { PropertyPage } from '@/components/property/PropertyPage';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllPropertySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getProperty(params.slug);

  return {
    title: `${property.name} — Travelama`,
    description: `Property guide for ${property.name}`,
    robots: {
      index: false, // Property pages are unlisted
      follow: false,
    },
  };
}

export default async function Page({ params }: Props) {
  const property = await getProperty(params.slug);

  return <PropertyPage property={property} />;
}
```

### Performance Optimization Strategies

```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 420, 768, 1024],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  experimental: {
    optimizeCss: true,
  },
};

module.exports = withPWA(nextConfig);
```

```typescript
// Image optimization component
// components/ui/OptimizedImage.tsx
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  aspectRatio?: '16:9' | '16:10' | '4:3' | '1:1';
  priority?: boolean;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  aspectRatio = '16:9',
  priority = false,
  className,
}: OptimizedImageProps) {
  const ratioMap = {
    '16:9': 'aspect-video',
    '16:10': 'aspect-[16/10]',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
  };

  return (
    <div className={`relative ${ratioMap[aspectRatio]} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}
```

### Build and Development Setup

```json
// package.json (key dependencies)
{
  "name": "travelama",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "^15.5.7",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^3.4.0",
    "@tailwindcss/typography": "^0.5.0",
    "next-pwa": "^5.6.0",
    "qrcode": "^1.5.3",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0",
    "@playwright/test": "^1.40.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.0.0",
    "prettier-plugin-tailwindcss": "^0.5.0"
  }
}
```

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#FDFCFA',
          100: '#FAF7F2',
          200: '#F5F0E8',
          300: '#E8DFD3',
        },
        ocean: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          500: '#06B6D4',
          600: '#0E7490',
          700: '#155E75',
        },
        coral: {
          500: '#F97316',
          600: '#EA580C',
        },
        neutral: {
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-cal-sans)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      animation: {
        'slide-up': 'slideUp 300ms ease-out',
        'fade-in': 'fadeIn 300ms ease-out',
        shimmer: 'shimmer 1.5s linear infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
```

---

## For QA Engineers

### Testable Component Boundaries

| Component | Test Type | Key Assertions |
|-----------|-----------|----------------|
| PropertyPage | Integration | Renders all sections, quick access works |
| WiFiModal | Unit | Opens/closes, copy works, QR generates |
| Accordion | Unit | Expands/collapses, animation timing |
| PasswordCopyField | Unit | Clipboard API, fallback behavior |
| QuickAccessBar | Unit | All buttons navigate correctly |
| RecommendationCard | Unit | Displays all fields, map link works |
| AreaHero | Unit | Image loads, back navigation works |

### Data Validation Requirements

| Field | Validation | Edge Cases |
|-------|------------|------------|
| Property slug | URL-safe, unique | Dashes, numbers, unicode |
| Wi-Fi password | Non-empty | Special characters, very long |
| Phone numbers | Valid format | International formats |
| URLs | Valid, HTTPS | Trailing slashes, query params |
| Checkout time | Valid time format | 24hr vs 12hr |
| Price range | €, €€, €€€, or €€€€ | Empty, invalid values |

### Integration Points Requiring Testing

```
┌─────────────────────────────────────────────────────────────────┐
│                    CRITICAL TEST PATHS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. QR Scan → Property Page Load                                │
│     ├── Page loads < 2 seconds                                  │
│     ├── All content renders                                     │
│     └── Offline cache populated                                 │
│                                                                  │
│  2. Wi-Fi Quick Connect Flow                                    │
│     ├── Modal opens on tap                                      │
│     ├── Password copies to clipboard                            │
│     ├── Toast appears and dismisses                             │
│     ├── QR code generates correctly                             │
│     └── Works offline (cached)                                  │
│                                                                  │
│  3. Property → Area Navigation                                  │
│     ├── "Explore" link navigates correctly                      │
│     ├── Back navigation returns to property                     │
│     └── Area content loads                                      │
│                                                                  │
│  4. Offline Mode                                                │
│     ├── Offline banner appears                                  │
│     ├── Critical content available                              │
│     ├── Non-cached content shows placeholder                    │
│     └── Returns to normal when online                           │
│                                                                  │
│  5. Error States                                                │
│     ├── 404 shows friendly error                                │
│     ├── Network error shows retry option                        │
│     └── Host contact info displayed                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Performance Benchmarks

| Metric | Target | Measurement Tool |
|--------|--------|------------------|
| First Contentful Paint | < 1.0s | Lighthouse |
| Largest Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 2.0s | Lighthouse |
| Total Blocking Time | < 150ms | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| Page Weight (gzipped) | < 500KB | DevTools Network |
| Lighthouse Performance Score | > 90 | Lighthouse |
| Lighthouse Accessibility Score | > 95 | Lighthouse |

### Security Testing Considerations

| Test Area | Check |
|-----------|-------|
| XSS Prevention | All user content escaped |
| CORS | API restricts origins |
| HTTPS | Enforced on all routes |
| Sensitive Data | Wi-Fi passwords not in HTML source |
| Robots.txt | Property pages excluded |
| CSP Headers | Properly configured |

### Accessibility Testing Checklist

| Requirement | Test Method |
|-------------|-------------|
| WCAG 2.1 AA Compliance | axe DevTools |
| Keyboard Navigation | Manual testing |
| Screen Reader | VoiceOver/NVDA testing |
| Color Contrast (4.5:1) | Contrast checker |
| Touch Targets (44px) | DevTools measurement |
| Focus Indicators | Visual inspection |
| Alt Text | HTML inspection |
| Heading Hierarchy | WAVE tool |

### Test Data Sets

```typescript
// tests/fixtures/properties.ts
export const validProperty = {
  slug: 'sliema-sanctuary',
  name: 'Sliema Sanctuary',
  wifi: {
    networks: [
      {
        name: 'PropertyWiFi_5G',
        password: 'SecurePass123',
        type: 'WPA',
      },
    ],
  },
  checkoutTime: '11:00',
  emergencyContact: {
    name: 'Maria',
    phone: '+356 1234 5678',
  },
  sections: [...],
};

export const propertyWithMultipleWifi = {
  ...validProperty,
  wifi: {
    networks: [
      { name: 'PropertyWiFi_5G', password: 'Fast5G!', type: 'WPA' },
      { name: 'PropertyWiFi_2.4G', password: 'Slower24', type: 'WPA' },
    ],
  },
};

export const propertyWithSpecialChars = {
  ...validProperty,
  wifi: {
    networks: [
      { name: 'Café WiFi', password: 'p@ss!word#123', type: 'WPA' },
    ],
  },
};

export const inactiveProperty = {
  ...validProperty,
  isActive: false,
};
```

---

## For Security Analysts

### Authentication Flow (Future)

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Guest Access (No Auth Required)                                │
│  ├── /stay/{slug}           Property page (unlisted)            │
│  ├── /{country}             Country overview (public)           │
│  └── /{country}/{area}      Area guide (public)                 │
│                                                                  │
│  Host Access (Auth Required - Future)                           │
│  ├── /login                 Email/password auth                 │
│  ├── /dashboard             Host property list                  │
│  ├── /dashboard/properties  Property management                 │
│  └── /api/properties/*      Protected API endpoints             │
│                                                                  │
│  Auth Flow (Supabase):                                          │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐      │
│  │  Host   │───►│  Login  │───►│Supabase │───►│  JWT    │      │
│  │ (Email) │    │  Form   │    │  Auth   │    │ Token   │      │
│  └─────────┘    └─────────┘    └─────────┘    └────┬────┘      │
│                                                     │           │
│                                              ┌──────▼──────┐    │
│                                              │  Dashboard  │    │
│                                              │  Access     │    │
│                                              └─────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Security Model

| Layer | Implementation |
|-------|----------------|
| Transport | HTTPS enforced (Vercel handles TLS) |
| Authentication | Supabase Auth (JWT, httpOnly cookies) |
| Authorization | Row-level security in PostgreSQL |
| Input Validation | Zod schemas on API routes |
| Output Encoding | React automatic XSS prevention |
| CORS | Strict origin whitelist |
| CSP | Restrictive Content-Security-Policy |
| Rate Limiting | Vercel Edge middleware |

### Data Protection

```typescript
// Security headers configuration
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self';
      connect-src 'self' https://*.supabase.co;
      frame-ancestors 'none';
    `.replace(/\n/g, ''),
  },
];
```

### Sensitive Data Handling

| Data Type | Storage | Transmission | Display |
|-----------|---------|--------------|---------|
| Wi-Fi Password | Encrypted at rest (Supabase) | HTTPS only | Masked until tap, never in URL |
| Host Email | Supabase Auth | HTTPS only | Admin only |
| Phone Numbers | Encrypted field | HTTPS only | Formatted display |
| Analytics | Anonymized | HTTPS only | Aggregated only |

### Privacy Considerations

- **No guest PII collection**: Guests never enter personal data
- **Anonymous analytics**: Session IDs are random, no fingerprinting
- **GDPR compliance**: EU hosting (Vercel EU region), no cookies for guests
- **Data minimization**: Only store what's necessary
- **Right to deletion**: Hosts can delete all property data

---

## Appendix A: MVP Implementation Checklist

### Phase 1: Foundation (Week 1)
- [ ] Initialize Next.js 14 project with App Router
- [ ] Configure Tailwind CSS with design tokens
- [ ] Set up TypeScript strict mode
- [ ] Create base component library (Button, Card, Accordion, Modal)
- [ ] Configure PWA with next-pwa
- [ ] Set up Vercel deployment

### Phase 2: Property Page (Week 2)
- [ ] Build PropertyHeader component
- [ ] Build QuickAccessBar component
- [ ] Build PropertySection (Accordion) components
- [ ] Build WiFiModal with QR generation
- [ ] Implement clipboard API with fallback
- [ ] Create property MDX content structure
- [ ] Build "Sliema Sanctuary" property page

### Phase 3: Destination Content (Week 3)
- [ ] Build AreaHero component
- [ ] Build QuickStats component
- [ ] Build CategoryNav component
- [ ] Build RecommendationCard component
- [ ] Build LocalInsights component
- [ ] Create area MDX content structure
- [ ] Build "Sliema" area guide
- [ ] Build "Malta" country overview

### Phase 4: Polish & Launch (Week 4)
- [ ] Implement offline caching strategy
- [ ] Add loading states and skeletons
- [ ] Implement error boundaries
- [ ] Add analytics tracking
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Cross-browser testing
- [ ] Generate QR codes for property

---

## Appendix B: Future Enhancements

### Phase 2 Features (Post-MVP)
1. **Host Dashboard**: Property CRUD operations
2. **Supabase Integration**: Database and auth
3. **Multi-property Support**: Host manages multiple listings
4. **Analytics Dashboard**: QR scan metrics, popular sections

### Phase 3 Features
1. **Additional Areas**: Valletta, Mdina, St. Julian's
2. **Map Integration**: Embedded maps for recommendations
3. **Content Translation**: Multi-language support
4. **Real-time Updates**: Live editing with preview

### Technical Debt to Address
1. Migrate from MDX to database when host dashboard is built
2. Add comprehensive E2E tests with Playwright
3. Implement image optimization pipeline
4. Add structured data (JSON-LD) for SEO

---

*Architecture document prepared for development team handoff. Implementation should follow the defined patterns and specifications to ensure consistency and maintainability.*
