---
title: Property Digital Manual — Feature Design Overview
description: Design specifications for the core property page experience (F1)
feature: property-digital-manual
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ./user-journey.md
  - ./screen-states.md
  - ./interactions.md
  - ./accessibility.md
  - ./implementation.md
dependencies:
  - ../../design-system/style-guide.md
  - ../../design-system/components/cards.md
  - ../../design-system/components/navigation.md
status: approved
---

# Property Digital Manual (F1)

## Feature Overview

The Property Digital Manual is the core feature of Travelama — a mobile-first digital guide that guests access by scanning a QR code. It provides immediate access to essential property information, eliminating the need to message the host for common questions.

## User Story

**As a** guest arriving at a rental property,
**I want to** scan a QR code and immediately see essential property information,
**So that** I can get settled without messaging the host.

## Success Metrics

| Metric | Target |
|--------|--------|
| QR scan rate | 80%+ of guests scan within first 24 hours |
| Time to find Wi-Fi | < 10 seconds from scan |
| Page load time | < 2 seconds |
| Click-through to area guide | > 30% |

## Design Priorities

### P0 — Critical
1. Wi-Fi credentials with one-tap copy
2. House rules clearly visible
3. Emergency contact accessible
4. Check-out time prominent
5. Mobile-first responsive design

### P1 — Important
1. Welcome message from host
2. Collapsible sections for organization
3. Smooth transitions and animations
4. Offline access for critical info

### P2 — Nice to Have
1. Host photo personalization
2. Property images
3. Language detection hints

## Information Architecture

```
Property Page (/stay/{slug})
├── Header Section
│   ├── Property name
│   ├── Welcome message (optional)
│   └── Host info (optional)
├── Quick Access Bar
│   ├── Wi-Fi (tap to view/copy)
│   ├── Check-out time
│   ├── Emergency contact
│   └── Explore area CTA
├── Content Sections (Collapsible)
│   ├── House Rules
│   ├── Appliances & How-Tos
│   ├── Check-in / Check-out
│   ├── Parking & Transport
│   ├── Emergency Information
│   └── Property Notes
└── Footer
    └── "Explore [Area]" CTA
```

## Key Design Decisions

### 1. Mobile-First Layout
95%+ of users access via QR scan on mobile. The entire experience is designed for one-handed phone use.

### 2. Two-Tap Maximum
Any piece of information is accessible within 2 taps from the main page. Quick access bar provides one-tap access to essentials.

### 3. Collapsible Sections
Content is organized into collapsible accordions to reduce scroll length while keeping all information accessible.

### 4. High Contrast
Designed for readability in varied lighting conditions — bright sunlight, dim apartments, late-night arrivals.

### 5. Offline-First Critical Info
Wi-Fi credentials, house rules, and emergency contacts are cached for offline access after first load.

## Visual Design Summary

### Layout
- Single column, full-width on mobile
- Maximum content width: 640px on desktop
- Page padding: 16px mobile, 24px tablet+

### Color Usage
- Background: `sand-200` (#F5F0E8)
- Cards: `white` or `sand-50`
- Primary actions: `ocean-600` (#0E7490)
- Accent/CTA: `coral-500` (#F97316)

### Typography
- Page title: Display (28px mobile, 36px desktop)
- Section headers: H2 (20px mobile, 24px desktop)
- Body text: Body (16px)
- Captions: Caption (12px)

## Component Usage

| Component | Usage |
|-----------|-------|
| Property Header | Welcome section with host info |
| Quick Access Bar | Essential info shortcuts |
| Collapsible Section | Organized content sections |
| Info Card | Structured information display |
| Copy Field | Wi-Fi password display |
| Explore CTA | Link to area guide |

## Related Documentation

- [User Journey](user-journey.md) — Detailed user flow analysis
- [Screen States](screen-states.md) — All screen states and specifications
- [Interactions](interactions.md) — Interaction patterns and animations
- [Accessibility](accessibility.md) — A11y requirements
- [Implementation](implementation.md) — Developer handoff notes

## Quick Reference Links

- [Style Guide](../../design-system/style-guide.md)
- [Cards Component](../../design-system/components/cards.md)
- [Navigation Component](../../design-system/components/navigation.md)
- [Forms Component](../../design-system/components/forms.md)
