---
title: Area Destination Guide — Feature Design Overview
description: Design specifications for the area guide experience (F3)
feature: area-destination-guide
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ../property-digital-manual/README.md
  - ../../design-system/components/cards.md
  - ../../design-system/components/navigation.md
status: approved
---

# Area Destination Guide (F3)

## Feature Overview

The Area Destination Guide provides curated local recommendations for guests exploring the neighborhood. It's accessible from the property page and designed to feel like getting tips from a knowledgeable local friend.

## User Story

**As a** guest exploring the local area,
**I want to** read curated recommendations from someone who knows the area,
**So that** I can discover great places without research fatigue.

## Success Metrics

| Metric | Target |
|--------|--------|
| Click-through from property | 30%+ of property page visitors |
| Category engagement | 2+ categories viewed per session |
| Map link clicks | 40%+ of recommendation views |
| Time on page | > 90 seconds average |

## Design Priorities

### P0 — Critical
1. Hero image + area name for visual appeal
2. Quick stats (vibe, best for, getting around)
3. Category navigation
4. Recommendation cards with actionable info

### P1 — Important
1. Map integration for directions
2. "Local insights" section
3. Back navigation to property

### P2 — Nice to Have
1. Save favorites
2. Filter by distance
3. Operating hours real-time status

---

## Information Architecture

```
Area Guide (/malta/{area})
├── Hero Header
│   ├── Back to property link
│   ├── Hero image
│   ├── Area name
│   └── Brief tagline
├── Quick Stats Bar
│   ├── Vibe description
│   ├── Best for (tags)
│   └── Getting around summary
├── Category Navigation
│   ├── Things to See & Do
│   ├── Food & Drink
│   ├── Beaches (contextual)
│   ├── Nightlife
│   ├── Shopping
│   └── Practical Tips
├── Recommendations Grid
│   └── Recommendation Cards (5-7 per category)
├── Local Insights Section
│   └── Insider tips
└── Footer
    └── Link to country page
```

---

## Screen Specifications

### Hero Header

```
┌─────────────────────────────────────┐
│ ← Malta                             │ ← Back nav (white)
│                                      │
│                                      │
│            [HERO IMAGE]              │ ← Aspect 16:9
│                                      │
│         ░░░░░░░░░░░░░░░             │ ← Gradient overlay
│                                      │
│            Sliema                    │ ← 36px, bold, white
│     Malta's modern waterfront       │ ← 18px, white 90%
└─────────────────────────────────────┘
```

| Element | Specifications |
|---------|----------------|
| Height | 240px mobile, 320px tablet+ |
| Image | object-fit: cover |
| Overlay | linear-gradient, bottom 60% |
| Back Link | White text, positioned top-left |
| Title | 36px display, white, shadow |
| Tagline | 18px, white, 90% opacity |

### Quick Stats

```
┌─────────────────────────────────────┐
│                                      │
│  😎 VIBE                             │
│  Relaxed beach town with modern     │
│  seafront promenade                 │
│                                      │
│  ⭐ BEST FOR                         │
│  ┌────────┐ ┌───────┐ ┌────────┐   │
│  │ Beach  │ │ Dining│ │ Walking│   │
│  └────────┘ └───────┘ └────────┘   │
│                                      │
│  🚌 GETTING AROUND                   │
│  Easy walking, buses to Valletta    │
│  every 15 minutes                   │
│                                      │
└─────────────────────────────────────┘
```

| Element | Specifications |
|---------|----------------|
| Container | `sand-50` bg, 24px padding |
| Section Label | 12px, uppercase, `neutral-500` |
| Section Title | Emoji + label combo |
| Content | 16px, `neutral-700`, line-height 1.5 |
| Tags | Pill buttons, `ocean-50` bg, `ocean-700` text |

### Category Navigation

Horizontal scrollable tabs or grid of category cards.

```
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ 🍽️     │ │ 🎭     │ │ 🏖️     │ │ 🛍️     │
│ Food   │ │ Things │ │ Beach  │ │ Shop   │
│ & Drink│ │ to Do  │ │        │ │        │
└────────┘ └────────┘ └────────┘ └────────┘
```

| Element | Specifications |
|---------|----------------|
| Layout | Horizontal scroll or 2×2 grid |
| Card | 80px width, vertical icon + label |
| Icon | 32px emoji or icon |
| Label | 12px, `neutral-700` |
| Active State | 2px bottom border `ocean-600` |

### Recommendation Card

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │     [RESTAURANT IMAGE]     │    │
│  │                             │    │
│  │  ┌──────────┐              │    │ ← Badge (optional)
│  │  │ Must Try │              │    │
│  │  └──────────┘              │    │
│  └─────────────────────────────┘    │
│                                      │
│  Ta' Kris Restaurant                 │ ← 18px, semibold
│  Maltese Traditional                 │ ← 14px, ocean-600
│                                      │
│  Authentic rabbit stew and fresh    │ ← 14px, neutral-600
│  ftira in a cozy setting...         │    2-line clamp
│                                      │
│  €€ · 5 min walk                    │ ← 12px, neutral-500
│                                      │
│  📍 Get Directions                   │ ← Ghost link
│                                      │
└─────────────────────────────────────┘
```

| Element | Specifications |
|---------|----------------|
| Container | White bg, 12px radius, shadow-sm |
| Image | Aspect 16:9, object-fit cover |
| Badge | `coral-500` bg, white text, 12px |
| Name | 18px, semibold, `neutral-800` |
| Category | 14px, `ocean-600` |
| Description | 14px, `neutral-600`, 2-line clamp |
| Meta | 12px, `neutral-500`, flex row |
| Direction Link | Ghost button style, `ocean-600` |

### Grid Layout

| Breakpoint | Columns | Gap |
|------------|---------|-----|
| Mobile | 1 | 16px |
| Tablet | 2 | 24px |
| Desktop | 3 | 24px |

### Local Insights Section

```
┌─────────────────────────────────────┐
│                                      │
│  💡 Local Insights                   │
│                                      │
│  Things only locals know about      │
│  Sliema that'll make your stay      │
│  better...                           │
│                                      │
│  • The best sunset spot is at       │
│    Independence Gardens, not the    │
│    crowded promenade                 │
│                                      │
│  • Skip the tourist restaurants     │
│    on Tower Road - head one block   │
│    inland for authentic prices      │
│                                      │
│  • The ferry to Valletta is faster  │
│    and cheaper than Uber            │
│                                      │
└─────────────────────────────────────┘
```

| Element | Specifications |
|---------|----------------|
| Container | `sand-50` bg, 24px padding, 16px radius |
| Icon | 💡 emoji, 24px |
| Title | 20px, semibold, `neutral-800` |
| Intro | 16px, `neutral-600` |
| Tips | Bullet list, 14px |

---

## Navigation Patterns

### Back to Property

When accessed from a property page, show contextual back navigation:

```
← Back to Sliema Sanctuary
```

| Property | Value |
|----------|-------|
| Position | Fixed top or inline |
| Style | Ghost link with chevron |
| Text | "Back to [Property Name]" |

### Breadcrumb (Desktop)

```
Malta > Sliema > Food & Drink
```

### Footer Navigation

```
┌─────────────────────────────────────┐
│                                      │
│  Explore more of Malta               │
│                                      │
│  ┌────────────────────────────┐     │
│  │ 🇲🇹 Malta Overview       →  │     │
│  └────────────────────────────┘     │
│                                      │
└─────────────────────────────────────┘
```

---

## Category Page Specifications

When user taps a category (e.g., "Food & Drink"):

```
/malta/sliema/food-drink
```

### Layout

```
┌─────────────────────────────────────┐
│ ← Sliema                            │
│                                      │
│  🍽️ Food & Drink                    │ ← 28px, bold
│                                      │
│  12 curated recommendations         │ ← 14px, neutral-500
│                                      │
│  ┌───────────────────┐              │
│  │    [CARD 1]       │              │
│  └───────────────────┘              │
│  ┌───────────────────┐              │
│  │    [CARD 2]       │              │
│  └───────────────────┘              │
│           ...                        │
│                                      │
└─────────────────────────────────────┘
```

---

## Map Integration

### Google Maps Link

Each recommendation includes a one-tap link to Google Maps:

```javascript
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName + ', ' + area)}`;
```

### Future: Embedded Map View

For future enhancement, a map view showing all recommendations:

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │        [MAP VIEW]          │    │
│  │                             │    │
│  │    📍  📍   📍              │    │
│  │         📍      📍         │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                      │
│  ┌─────────────────────────────┐    │
│  │ 📍 Ta' Kris · Maltese      │    │ ← Selected pin
│  │    €€ · 5 min walk     [→] │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

---

## Content Guidelines

### Recommendation Count
- **Per category**: 5-7 recommendations (curated, not exhaustive)
- **Total per area**: 20-40 recommendations across all categories

### Recommendation Content
Each recommendation should include:
- Name
- Category/cuisine type
- 1-2 sentence description (focus on "why it's good")
- Price range (€/€€/€€€/€€€€)
- Distance from typical property location
- Google Maps link

### Tone
- Like a friend sharing their favorite spots
- Honest: "touristy but worth it" is acceptable
- Specific: "best for sunset drinks" not just "nice bar"
- Practical: mention what to order, when to go

---

## Responsive Behavior

### Mobile (320-639px)
- Hero: 240px height
- Quick stats: stacked
- Categories: horizontal scroll
- Recommendations: single column

### Tablet (640-1023px)
- Hero: 280px height
- Quick stats: 3-column grid
- Categories: 2×2 grid
- Recommendations: 2 columns

### Desktop (1024px+)
- Hero: 320px height
- Quick stats: horizontal row
- Categories: horizontal tabs
- Recommendations: 3 columns
- Max content width: 1024px

---

## Accessibility

### Landmarks
- `<header>` for hero
- `<nav>` for category navigation
- `<main>` for recommendations
- `<aside>` for local insights
- `<footer>` for country link

### Images
- All images have descriptive alt text
- Decorative images use `alt=""`
- Background images have foreground text alternatives

### Navigation
- Skip link to main content
- Logical heading hierarchy (h1, h2, h3)
- Tab navigation through categories
- Focus management on category change

---

## Analytics Events

| Event | Data |
|-------|------|
| `area_page_view` | area_slug |
| `category_selected` | category_name |
| `recommendation_viewed` | recommendation_id, category |
| `map_link_clicked` | recommendation_id |
| `local_insights_viewed` | area_slug |

---

## Related Documentation

- [Property Digital Manual](../property-digital-manual/README.md)
- [Country Overview](../country-overview/README.md)
- [Cards Component](../../design-system/components/cards.md)
- [Navigation Component](../../design-system/components/navigation.md)
