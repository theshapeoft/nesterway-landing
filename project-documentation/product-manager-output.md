# Travelama — Product Requirements Document

**Version**: 1.0
**Last Updated**: 21 December 2025
**Status**: Draft for Stakeholder Review

---

## Executive Summary

### Elevator Pitch
Travelama is a digital house manual and destination guide that guests access by scanning a QR code — telling them how the property works and what to do nearby.

### Problem Statement
**For guests**: Arriving at a short-term rental is frustrating. Paper manuals are outdated, Wi-Fi passwords are scribbled on sticky notes, and finding reliable local recommendations means wading through generic travel blogs or outdated TripAdvisor reviews.

**For hosts**: Every guest asks the same questions. Hosts repeat themselves endlessly, struggle to maintain consistent information across properties, and have no scalable way to deliver a premium guest experience.

### Target Audience

| Segment | Description | Primary Need |
|---------|-------------|--------------|
| **Primary: Short-term rental guests** | Travellers staying 2-14 nights in Airbnb/VRBO properties | Immediate access to property info + curated local tips |
| **Secondary: Property hosts** | Individual Airbnb hosts managing 1-10 properties | Reduce guest questions, improve reviews, save time |
| **Future: Portfolio managers** | Property management companies with 10+ listings | Standardised guest experience, brand consistency, analytics |

### Unique Selling Proposition
Unlike static PDFs or generic travel apps, Travelama cleanly separates "how does this place work" from "what should I do here" — delivering the right information at the right moment, with destination content that scales across properties.

### Success Metrics (MVP)

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Guest question reduction | 50% fewer repetitive questions | Host self-report survey |
| QR scan rate | 70%+ of guests scan within first 24 hours | Analytics (scan timestamps) |
| Time to find Wi-Fi | < 10 seconds from scan | User testing |
| Guest satisfaction | 4.5+ stars on "arrival experience" | Post-stay micro-survey |
| Host NPS | 50+ | Quarterly survey |

---

## Problem Analysis

### The Guest Journey Pain Points

```
ARRIVAL (First 30 minutes)
├── "What's the Wi-Fi password?" → Paper manual is missing/outdated
├── "How do I use the coffee machine?" → No instructions
├── "What are the house rules?" → Buried in Airbnb message thread
└── "Is there parking?" → Host didn't mention it

EXPLORATION (Days 1-N)
├── "Where should we eat?" → Google reviews are overwhelming
├── "What's worth seeing?" → Generic "Top 10" lists
├── "Is this area safe at night?" → No honest local context
└── "How do buses work here?" → Conflicting online info
```

### Why Existing Solutions Fail

| Solution | Problem |
|----------|---------|
| Paper manuals | Outdated instantly, not searchable, environmentally wasteful |
| Airbnb's built-in guide | Buried in app, generic, poor UX for in-stay use |
| WhatsApp/messages | Scattered, unsearchable, hosts repeat themselves |
| Generic travel apps | Not property-specific, overwhelming, lack local nuance |
| PDF in listing | Guests don't download, can't update easily |

### The Core Insight
Guests operate in two distinct mental modes:

1. **Arrival Mode** (first 2 hours): "How does this specific apartment work?"
   - Urgent, practical, property-specific
   - Needs: Wi-Fi, rules, appliances, checkout

2. **Exploration Mode** (ongoing): "What should I do around here?"
   - Leisurely, discovery-oriented, location-based
   - Needs: Restaurants, activities, transport, local tips

**Current solutions conflate these.** Travelama separates them cleanly while connecting them seamlessly.

---

## Product Architecture

### Information Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                    DESTINATION LAYER                     │
│                      (Public/Shared)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │   /malta    │  │  /portugal  │  │   /spain    │ ...  │
│  └──────┬──────┘  └─────────────┘  └─────────────┘      │
│         │                                                │
│  ┌──────┴──────┐  ┌─────────────┐                       │
│  │/malta/sliema│  │/malta/valletta│ ...                 │
│  └──────┬──────┘  └─────────────┘                       │
└─────────┼───────────────────────────────────────────────┘
          │ links to
┌─────────┴───────────────────────────────────────────────┐
│                    PROPERTY LAYER                        │
│                   (Private/Semi-Private)                 │
│  ┌───────────────────────┐  ┌───────────────────────┐   │
│  │/stay/sliema-sanctuary │  │/stay/valletta-views   │   │
│  └───────────────────────┘  └───────────────────────┘   │
│              ▲                                           │
│              │ QR code scan                              │
│         ┌────┴────┐                                      │
│         │  Guest  │                                      │
│         └─────────┘                                      │
└─────────────────────────────────────────────────────────┘
```

### URL Structure

| Layer | Pattern | Example | Visibility |
|-------|---------|---------|------------|
| Country | `/{country}` | `/malta` | Public |
| Area | `/{country}/{area}` | `/malta/sliema` | Public |
| Property | `/stay/{property-slug}` | `/stay/sliema-sanctuary` | Semi-private (unlisted) |

### Data Relationships

```
Property (1) ──────► Area (1)
                        │
                        ▼
                    Country (1)

Area (1) ◄────────── Property (many)
Country (1) ◄──────── Area (many)
```

---

## Feature Specifications

### F1: Property Digital Manual

**User Story**
As a *guest arriving at a rental property*, I want to *scan a QR code and immediately see essential property information*, so that I can *get settled without messaging the host*.

**Acceptance Criteria**

| Scenario | Given | When | Then |
|----------|-------|------|------|
| QR Scan | Guest is in property with phone | Scans QR code | Property page loads in < 2 seconds |
| Wi-Fi Access | Property page is open | Guest taps Wi-Fi section | Wi-Fi credentials display with copy button AND QR code for auto-connect |
| Offline Access | Guest has visited page once | Device is offline | Critical info (Wi-Fi, rules, emergency) still accessible |
| Deep Linking | Guest is on property page | Taps "Explore Sliema" | Navigates to `/malta/sliema` area guide |

**Priority**: P0 (Core MVP functionality)

**Content Structure**
```
Property Page
├── Header
│   ├── Property name
│   ├── Welcome message (optional)
│   └── Host photo/name (optional)
├── Quick Access Bar
│   ├── Wi-Fi (one-tap copy + QR)
│   ├── Check-out time
│   └── Emergency contact
├── Sections (collapsible)
│   ├── House Rules
│   ├── Appliances & How-Tos
│   ├── Check-in/Check-out
│   ├── Parking & Transport
│   ├── Emergency Info
│   └── Property-Specific Notes
└── Footer
    └── "Explore [Area Name]" CTA
```

**UX Considerations**
- Mobile-first design (95%+ of scans will be mobile)
- Maximum 2 taps to any information
- Large touch targets (minimum 44px)
- High contrast for readability in varied lighting
- No login required

**Technical Constraints**
- Must work on iOS Safari, Android Chrome (last 3 versions)
- Page weight < 500KB for fast mobile load
- PWA-capable for offline access

**Dependencies**
- None (this is the foundation)

---

### F2: Wi-Fi Quick Connect

**User Story**
As a *guest who just arrived*, I want to *connect to Wi-Fi in under 10 seconds*, so that I can *get online without typing a complex password*.

**Acceptance Criteria**

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Copy Password | Wi-Fi section is visible | Guest taps password | Password copies to clipboard with confirmation toast |
| QR Connect (iOS) | Guest is on iPhone | Opens camera on Wi-Fi QR | Auto-joins network (iOS 11+) |
| QR Connect (Android) | Guest is on Android | Scans Wi-Fi QR | Prompts to join network |
| Manual Fallback | QR doesn't work | Guest needs manual entry | Network name + password clearly displayed |

**Priority**: P0 (Most requested feature by guests)

**Technical Specification**
- Wi-Fi QR format: `WIFI:T:WPA;S:{network_name};P:{password};;`
- QR generated client-side (no server round-trip)
- Password field uses `user-select: all` for easy selection

**UX Considerations**
- Wi-Fi should be the first/most prominent element
- Show network name clearly (some properties have multiple networks)
- Include "Having trouble?" expandable with manual steps

---

### F3: Area Destination Guide

**User Story**
As a *guest exploring the local area*, I want to *read curated recommendations from someone who knows the area*, so that I can *discover great places without research fatigue*.

**Acceptance Criteria**

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Area Access | Guest is on property page | Taps "Explore [Area]" | Area guide loads with relevant content |
| Direct Access | Anyone has area URL | Visits `/malta/sliema` | Area guide is publicly accessible |
| Category Browse | Guest is on area page | Taps "Food & Drink" | Sees curated restaurant/café list |
| Map View | Guest is browsing places | Taps map icon | Sees locations on interactive map |

**Priority**: P1 (Important but not blocking MVP launch)

**Content Structure**
```
Area Guide Page
├── Header
│   ├── Area name + country
│   ├── Hero image
│   └── Brief description
├── Quick Stats
│   ├── Vibe description
│   ├── Best for (beach, nightlife, families, etc.)
│   └── Getting around
├── Categories
│   ├── Things to See & Do
│   ├── Food & Drink
│   ├── Beaches (if applicable)
│   ├── Nightlife
│   ├── Shopping
│   └── Practical Tips
├── Local Insights
│   └── "Things locals know" section
└── Navigation
    └── Link to country page
```

**UX Considerations**
- Content should feel curated, not exhaustive
- Maximum 5-7 recommendations per category
- Include "why it's good" not just "what it is"
- Opening hours / practical info for each place
- One-tap to Google Maps directions

**Dependencies**
- F1 (Property Manual) should link to this

---

### F4: Country Overview Page

**User Story**
As a *guest planning activities*, I want to *see what areas and attractions exist in this country*, so that I can *plan day trips or explore beyond my immediate area*.

**Acceptance Criteria**

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Country Access | Guest is on area page | Taps country name | Country overview page loads |
| Area Discovery | Guest is on country page | Browses areas | Sees all documented areas with descriptions |
| Cross-area Planning | Guest is in Sliema | Views Malta page | Can discover Valletta, Mdina, etc. |

**Priority**: P2 (Enhances experience but not essential for MVP)

**Content Structure**
```
Country Page
├── Header
│   ├── Country name
│   ├── Hero image
│   └── Brief description
├── Areas Grid
│   └── Cards for each documented area
├── Country-Wide Tips
│   ├── Transport overview
│   ├── Currency & payments
│   ├── Language basics
│   └── Cultural notes
└── Featured Experiences
    └── Day trips, major attractions
```

**Dependencies**
- F3 (Area Guides) must exist first

---

### F5: Host Property Management (MVP)

**User Story**
As a *property host*, I want to *create and edit my property's digital manual*, so that I can *keep information current without technical skills*.

**Acceptance Criteria**

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Property Creation | Host is logged in | Completes property form | Property page is generated with unique URL |
| QR Generation | Property is created | Host clicks "Get QR Code" | Downloadable QR code (PNG, PDF) is generated |
| Content Edit | Host views their property | Edits any section | Changes are live immediately |
| Preview | Host is editing | Clicks "Preview" | Sees guest view of property page |

**Priority**: P1 (Required for host self-service, but can be manual for MVP)

**MVP Simplification**
For initial launch with single property, this can be:
- Hardcoded content in codebase
- Edited via code/CMS by developer
- No host login required

**Future State**
- Full host dashboard
- Multi-property management
- Team access controls
- Analytics per property

**Dependencies**
- F1 (Property Manual) for the guest-facing output

---

### F6: QR Code System

**User Story**
As a *host*, I want to *print QR codes that link to my property page*, so that *guests can easily access information on arrival*.

**Acceptance Criteria**

| Scenario | Given | When | Then |
|----------|-------|------|------|
| QR Generation | Property exists | Host requests QR | QR code generated linking to property URL |
| Print Formats | QR is generated | Host downloads | Available in PNG (screen) and PDF (print) |
| Scan Tracking | Guest scans QR | Page loads | Scan is logged with timestamp (anonymously) |
| Broken QR | QR links to deleted property | Guest scans | Friendly error page with host contact |

**Priority**: P1

**Design Specifications**
- QR should include Travelama branding subtly
- Minimum print size: 2cm x 2cm
- Error correction level: M (15%)
- Include human-readable URL below QR

**UX Considerations**
- Provide placement suggestions for hosts
- Consider tent-card template for tabletop display
- Weather-resistant options for outdoor properties

---

## User Flows

### Primary Flow: Guest Arrival

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Guest     │     │  Scans QR   │     │  Property   │
│   Arrives   │────►│   Code      │────►│   Page      │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    │                          │                          │
                    ▼                          ▼                          ▼
            ┌───────────────┐         ┌───────────────┐         ┌───────────────┐
            │   Wi-Fi QR    │         │  House Rules  │         │  Explore Area │
            │   (10 sec)    │         │   (30 sec)    │         │    (later)    │
            └───────────────┘         └───────────────┘         └───────┬───────┘
                                                                        │
                                                                        ▼
                                                                ┌───────────────┐
                                                                │  Area Guide   │
                                                                └───────────────┘
```

### Secondary Flow: Exploration Mode

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Guest     │     │   Taps      │     │   Area      │     │   Selects   │
│   Settled   │────►│  "Explore"  │────►│   Guide     │────►│  Category   │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                   │
                                        ┌──────────────────────────┤
                                        │                          │
                                        ▼                          ▼
                                ┌───────────────┐         ┌───────────────┐
                                │   Views       │         │   Opens in    │
                                │   Details     │         │  Google Maps  │
                                └───────────────┘         └───────────────┘
```

---

## Non-Functional Requirements

### Performance

| Metric | Target | Rationale |
|--------|--------|-----------|
| Time to First Byte | < 200ms | QR scans happen on arrival when patience is low |
| Largest Contentful Paint | < 1.5s | Mobile networks may be slow (roaming) |
| Total Page Weight | < 500KB | Guests may have limited data |
| Offline Capability | Core content cached | Property info must work without connection |

### Scalability (Future)

| Metric | MVP Target | Year 1 Target |
|--------|------------|---------------|
| Properties | 1 | 100 |
| Monthly page views | 100 | 50,000 |
| Concurrent users | 10 | 500 |
| Destination areas | 2-3 | 50 |

### Security

| Requirement | Implementation |
|-------------|----------------|
| Property URLs | Unlisted (not indexed) but not authenticated |
| No PII collection | Guests never enter personal data |
| Host authentication | Email + password (future) |
| HTTPS | Required for all pages |
| Data residency | EU hosting (GDPR compliance) |

### Accessibility

| Standard | Target |
|----------|--------|
| WCAG Level | AA compliance |
| Screen reader | Full compatibility |
| Colour contrast | Minimum 4.5:1 |
| Touch targets | Minimum 44x44px |
| Text scaling | Support up to 200% |

### Internationalisation (Future)

| Capability | MVP | Future |
|------------|-----|--------|
| UI Language | English only | Multi-language UI |
| Content Translation | Manual | AI-assisted translation |
| RTL Support | No | Yes |
| Currency/Units | Manual in content | Auto-localisation |

---

## Technical Considerations

### Recommended Technology Approach

Given the requirements (fast, lightweight, SEO-friendly for destination pages, minimal backend for MVP):

**Frontend**
- Next.js or Astro (static generation for destination pages)
- Tailwind CSS (rapid, consistent styling)
- PWA capabilities for offline access

**Backend (MVP)**
- Static site with markdown/MDX content
- OR lightweight CMS (Sanity, Contentful, Strapi)
- No database required initially

**Backend (Future)**
- PostgreSQL for property/host data
- Authentication via Supabase or Auth0
- Analytics pipeline for QR tracking

**Hosting**
- Vercel or Cloudflare Pages (edge-deployed, fast globally)
- CDN for images and assets

### Data Model (Conceptual)

```
Country
├── id: UUID
├── slug: string (unique) // "malta"
├── name: string
├── description: text
├── hero_image: url
├── practical_info: json
└── created_at: timestamp

Area
├── id: UUID
├── country_id: FK → Country
├── slug: string (unique within country) // "sliema"
├── name: string
├── description: text
├── hero_image: url
├── vibe: string[]
├── categories: json // nested recommendations
└── created_at: timestamp

Property
├── id: UUID
├── area_id: FK → Area
├── slug: string (unique) // "sliema-sanctuary"
├── name: string
├── host_id: FK → Host (future)
├── wifi_name: string
├── wifi_password: string (encrypted)
├── sections: json // flexible content blocks
├── is_active: boolean
└── created_at: timestamp

Host (Future)
├── id: UUID
├── email: string
├── name: string
├── properties: Property[]
└── subscription_tier: enum
```

---

## MVP Scope Definition

### In Scope (Build This)

| Feature | Description |
|---------|-------------|
| Single property page | `/stay/sliema-sanctuary` with full content |
| Wi-Fi QR code | Auto-connect functionality |
| Sliema area guide | `/malta/sliema` with curated content |
| Malta country page | `/malta` with overview |
| Mobile-first design | Responsive, fast, accessible |
| QR code generation | Printable QR for the property |
| Basic analytics | Page views, QR scan tracking |

### Out of Scope (Future)

| Feature | Reason for Deferral |
|---------|---------------------|
| Host dashboard | Single property doesn't need it |
| User accounts (guests) | Adds friction, not needed |
| Payments/subscriptions | Monetisation comes after validation |
| Multi-language | English sufficient for Malta test |
| Booking integration | Complex, not core to value prop |
| Reviews/ratings | Adds complexity, needs scale |
| Push notifications | Not essential for MVP value |

### Minimum Viable Content

**Property: Sliema Sanctuary**
- [ ] Wi-Fi credentials + QR
- [ ] House rules (5-7 key rules)
- [ ] Check-in/check-out procedures
- [ ] Appliance guides (washing machine, coffee, AC)
- [ ] Emergency contacts
- [ ] Parking information
- [ ] 3-5 property-specific tips

**Area: Sliema**
- [ ] Area description and vibe
- [ ] 5-7 restaurant recommendations
- [ ] 3-5 café recommendations
- [ ] Beach access information
- [ ] Transport tips (buses, ferry, walking)
- [ ] 3-5 things to do
- [ ] Safety/noise notes (honest local perspective)

**Country: Malta**
- [ ] Brief country overview
- [ ] Link to Sliema area
- [ ] Placeholder for Valletta (future)
- [ ] General transport overview
- [ ] Currency and tipping notes

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Guests don't scan QR | Medium | High | Strategic placement, mention in check-in message, compelling design |
| Content goes stale | Medium | Medium | Quarterly review reminders, easy edit process |
| Destination content is too generic | Medium | Medium | Focus on local insider knowledge, not tourist clichés |
| Mobile performance issues | Low | High | Performance budget, testing on low-end devices |
| QR code damaged/removed | Low | Low | Provide multiple QRs to host, URL also in Airbnb listing |
| Scope creep | High | Medium | Strict MVP definition, resist feature requests until validated |

---

## Success Criteria for MVP Launch

### Quantitative (4-week post-launch)

| Metric | Target |
|--------|--------|
| QR scans | 80%+ of guest stays result in scan |
| Time on property page | Average > 45 seconds |
| Click-through to area guide | > 30% of property page visitors |
| Host-reported question reduction | > 40% fewer repetitive questions |

### Qualitative

- [ ] 3+ guests mention positive arrival experience in reviews
- [ ] Host feels confident recommending to other hosts
- [ ] Zero critical usability issues reported
- [ ] Content feels genuinely useful, not generic

---

## Open Questions Requiring Decision

| Question | Options | Recommendation |
|----------|---------|----------------|
| Should property URLs be truly private? | (A) Public but unlisted, (B) Require token/PIN | A - Simplicity wins, low risk |
| How to handle property with no area guide yet? | (A) Block creation, (B) Show generic message | B - Don't block host onboarding |
| Analytics approach? | (A) Full analytics suite, (B) Simple page views only | B for MVP - avoid complexity |
| Content management? | (A) Markdown in repo, (B) Headless CMS | A for MVP - fastest to build |

---

## Next Steps

### Immediate (Week 1-2)
1. Technical architecture decision and setup
2. Design system / component library foundation
3. Property page template build
4. Content creation for Sliema Sanctuary

### Short-term (Week 3-4)
5. Area guide template and Sliema content
6. Wi-Fi QR functionality
7. QR code generation and printing
8. Mobile optimisation and testing

### Pre-launch (Week 5)
9. Analytics implementation
10. Performance testing
11. Accessibility audit
12. Content review and polish
13. Deploy and generate production QR

### Post-launch (Week 6+)
14. Monitor analytics and gather feedback
15. Iterate based on guest behaviour
16. Begin documenting for multi-property expansion

---

## Appendix A: Competitive Landscape

| Competitor | Strengths | Weaknesses | Travelama Differentiation |
|------------|-----------|------------|--------------------------|
| **Airbnb Guidebook** | Built-in, familiar | Buried in app, generic, poor mobile UX | Standalone, QR-accessible, better UX |
| **Hostfully Digital Guidebooks** | Feature-rich, established | Expensive, complex, US-focused | Simpler, destination-first, affordable |
| **Touch Stay** | Good UX, professional | Subscription model, no destination layer | Shared destination content, scalable |
| **Paper manuals** | No tech required | Outdated, not searchable, waste | Digital, always current, sustainable |

## Appendix B: Persona Deep Dives

### Persona 1: The Arriving Guest (Primary)

**Name**: Sarah, 34
**Context**: Just landed after a 3-hour flight, taxi to apartment, it's 10 PM
**Tech comfort**: High (uses apps daily)
**Emotional state**: Tired, slightly stressed, wants to settle in
**Primary need**: Wi-Fi, where to put bags, basic orientation
**Secondary need**: Quick dinner option nearby

**Jobs to be Done**:
1. Connect to internet (message family we arrived safely)
2. Understand the space (which room is ours, how does AC work)
3. Know the rules (can we be noisy, where's the trash)
4. Find food (quick, nearby, open now)

### Persona 2: The Exploring Guest (Secondary)

**Name**: Marcus, 29
**Context**: Day 2 of a week-long stay, settled in, ready to explore
**Tech comfort**: High
**Emotional state**: Relaxed, curious, open to discovery
**Primary need**: Curated recommendations (not overwhelmed)
**Secondary need**: Practical tips (how to get around, what to avoid)

**Jobs to be Done**:
1. Find highly-rated, not-too-touristy restaurant
2. Understand transport options
3. Discover hidden gems
4. Know what's actually worth the time

### Persona 3: The Host (Future User)

**Name**: Elena, 45
**Context**: Manages 3 Airbnb properties in Sliema
**Tech comfort**: Medium (uses Airbnb app, basic computer skills)
**Emotional state**: Busy, wants efficiency
**Primary need**: Stop answering same questions repeatedly
**Secondary need**: Professional guest experience, better reviews

**Jobs to be Done**:
1. Create digital manual without technical skills
2. Update info easily when things change
3. Present professional, branded experience
4. Reduce time spent on guest communication

---

## Appendix C: Content Guidelines

### Property Content Principles
- **Be specific**: "The washing machine is the white Bosch in the kitchen" not "There's a washing machine"
- **Be honest**: "The walls are thin, please keep noise down after 10 PM"
- **Be helpful**: Include the WHY ("Separate recycling because Malta has strict rules")
- **Be concise**: Bullet points over paragraphs
- **Be current**: Include dates when info might change

### Destination Content Principles
- **Be local**: Recommendations a local would give a friend
- **Be honest**: "Touristy but worth it" or "Skip this, overrated"
- **Be practical**: Opening hours, price range, how to get there
- **Be curated**: 5 great options beats 50 mediocre ones
- **Be personal**: "We love this because..." creates connection

---

*Document prepared for stakeholder review. Please provide feedback on scope, priorities, and any missing requirements before development begins.*
