---
title: Country Overview — Feature Design Overview
description: Design specifications for the country overview page (F4)
feature: country-overview
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ../area-destination-guide/README.md
  - ../../design-system/components/cards.md
status: approved
---

# Country Overview (F4)

## Feature Overview

The Country Overview page provides a high-level view of all documented areas within a country, plus country-wide practical information. It helps guests plan day trips and discover areas beyond their immediate location.

## User Story

**As a** guest planning activities,
**I want to** see what areas and attractions exist in this country,
**So that** I can plan day trips or explore beyond my immediate area.

## Priority

**P2** — Enhances experience but not essential for MVP launch

## Success Metrics

| Metric | Target |
|--------|--------|
| Navigation from area pages | 20%+ |
| Area card clicks | 60%+ of country page visitors |
| Average areas viewed | 2+ per session |

---

## Information Architecture

```
Country Page (/{country})
├── Hero Header
│   ├── Country name
│   ├── Flag
│   └── Brief description
├── Areas Grid
│   └── Area cards (all documented areas)
├── Country-Wide Tips
│   ├── Transport overview
│   ├── Currency & payments
│   ├── Language basics
│   └── Cultural notes
└── Featured Experiences
    └── Day trips, major attractions
```

---

## Screen Specifications

### Hero Header

```
┌─────────────────────────────────────┐
│                                      │
│            [HERO IMAGE]              │
│                                      │
│         ░░░░░░░░░░░░░░░             │
│                                      │
│      🇲🇹 Malta                       │ ← Flag + name
│   Mediterranean island nation        │
└─────────────────────────────────────┘
```

### Area Grid

```
┌─────────────────────────────────────┐
│                                      │
│  Explore Malta                       │
│                                      │
│  ┌───────────────┐ ┌───────────────┐│
│  │   [SLIEMA]    │ │  [VALLETTA]   ││
│  │               │ │               ││
│  │ Sliema        │ │ Valletta      ││
│  │ Modern coast  │ │ Historic cap  ││
│  └───────────────┘ └───────────────┘│
│  ┌───────────────┐ ┌───────────────┐│
│  │   [MDINA]     │ │  [ST JULIANS]││
│  │               │ │               ││
│  │ Mdina         │ │ St Julian's   ││
│  │ Silent city   │ │ Nightlife hub ││
│  └───────────────┘ └───────────────┘│
│                                      │
└─────────────────────────────────────┘
```

### Area Card Specifications

| Element | Style |
|---------|-------|
| Image | 16:10 aspect, object-fit cover |
| Container | White bg, 12px radius, shadow-sm |
| Name | 18px, semibold |
| Description | 14px, `neutral-500`, 1 line |
| Hover | Slight scale (1.02), shadow increase |

### Country Tips Section

```
┌─────────────────────────────────────┐
│                                      │
│  🇲🇹 Good to Know                    │
│                                      │
│  ┌─────────────────────────────┐    │
│  │ 🚌 Getting Around            │    │
│  │                             │    │
│  │ Buses connect all major      │    │
│  │ areas. €1.50 single, €21    │    │
│  │ weekly Tallinja card.       │    │
│  └─────────────────────────────┘    │
│                                      │
│  ┌─────────────────────────────┐    │
│  │ 💶 Money                     │    │
│  │                             │    │
│  │ Euro (€). Cards widely      │    │
│  │ accepted. Tip 5-10% at      │    │
│  │ restaurants.                │    │
│  └─────────────────────────────┘    │
│                                      │
│  ┌─────────────────────────────┐    │
│  │ 🗣️ Language                  │    │
│  │                             │    │
│  │ Maltese and English are     │    │
│  │ official. Everyone speaks   │    │
│  │ English.                    │    │
│  └─────────────────────────────┘    │
│                                      │
└─────────────────────────────────────┘
```

---

## Responsive Layout

| Breakpoint | Area Grid | Tips Grid |
|------------|-----------|-----------|
| Mobile | 1 column | 1 column |
| Tablet | 2 columns | 2 columns |
| Desktop | 3-4 columns | 3 columns |

---

## Related Documentation

- [Area Destination Guide](../area-destination-guide/README.md)
- [Cards Component](../../design-system/components/cards.md)
