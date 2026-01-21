---
title: Travelama Design System Overview
description: Foundation of the Travelama visual language, component library, and interaction patterns
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ./style-guide.md
  - ./tokens/colors.md
  - ./tokens/typography.md
  - ./tokens/spacing.md
  - ./tokens/animations.md
  - ./components/README.md
status: approved
---

# Travelama Design System

## Overview

The Travelama Design System provides a cohesive visual language for creating intuitive, accessible, and performant user experiences across the platform. Built mobile-first with accessibility at its core.

## Design Philosophy

### Bold Simplicity
Every element serves a purpose. We eliminate decorative elements that don't contribute to user goals, creating interfaces that feel effortless and look beautiful.

### Breathable Layouts
Strategic negative space gives content room to breathe, reducing cognitive load and improving comprehension — especially important for tired travelers arriving at a new property.

### Content-First
Information architecture prioritizes user objectives over visual flourish. The fastest path to Wi-Fi, the clearest house rules, the most useful recommendations.

### Accessible by Default
Accessibility isn't an afterthought. Every component is designed to meet WCAG AA standards from the start, with color contrast, keyboard navigation, and screen reader support built in.

## System Architecture

```
Design System
├── Design Tokens (Foundation)
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Animations
├── Components (Building Blocks)
│   ├── Atoms (buttons, inputs, icons)
│   ├── Molecules (cards, list items, form groups)
│   └── Organisms (headers, sections, navigation)
├── Patterns (Compositions)
│   ├── Page layouts
│   ├── Navigation patterns
│   └── Content templates
└── Platform Adaptations
    ├── iOS
    ├── Android
    └── Web
```

## Quick Reference

### Primary Colors
| Name | Value | Usage |
|------|-------|-------|
| Ocean | `#0E7490` | Primary actions, links, brand accent |
| Sand | `#F5F0E8` | Primary backgrounds, warmth |
| Coral | `#F97316` | Secondary accent, highlights |

### Typography Scale
| Name | Size | Weight | Usage |
|------|------|--------|-------|
| Display | 36px | 700 | Page titles |
| Heading 1 | 30px | 600 | Section headers |
| Heading 2 | 24px | 600 | Subsections |
| Body | 16px | 400 | Standard text |
| Small | 14px | 400 | Secondary info |

### Spacing Scale
| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Micro spacing |
| sm | 8px | Small gaps |
| md | 16px | Default spacing |
| lg | 24px | Section gaps |
| xl | 32px | Major sections |
| 2xl | 48px | Page padding |

## Component Categories

### Core Components (MVP)
- [Buttons](components/buttons.md) — Primary, secondary, ghost, icon buttons
- [Cards](components/cards.md) — Info cards, recommendation cards, section cards
- [Forms](components/forms.md) — Inputs, copy fields, toggles
- [Navigation](components/navigation.md) — Headers, tabs, breadcrumbs
- [Modals](components/modals.md) — Bottom sheets, dialogs, toasts

### Specialized Components
- Wi-Fi display with QR code and copy button
- Collapsible section accordions
- Quick access bar with icon buttons
- Recommendation cards with map links
- Category filter pills

## Implementation Guidelines

### Tailwind Configuration
All design tokens map directly to Tailwind CSS configuration. See [design-tokens.json](../assets/design-tokens.json) for the complete token export.

```javascript
// tailwind.config.js example
module.exports = {
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          // ... full scale
          600: '#0E7490', // Primary
          700: '#0F766E',
        },
        sand: {
          50: '#FEFDFB',
          100: '#FBF8F3',
          200: '#F5F0E8', // Primary background
          // ...
        }
      }
    }
  }
}
```

### Component Naming Convention
- Use semantic, descriptive names
- Prefix with component type: `ButtonPrimary`, `CardRecommendation`
- State suffixes: `ButtonPrimary-disabled`, `InputText-error`

### Responsive Breakpoints
| Name | Width | Target Device |
|------|-------|--------------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

**Mobile-first**: All base styles target mobile (320px+). Add complexity at larger breakpoints.

## Quality Checklist

Before implementing any component:

- [ ] Meets WCAG AA color contrast requirements
- [ ] Touch targets are minimum 44×44px
- [ ] Keyboard navigation is logical and complete
- [ ] Screen reader labels are meaningful
- [ ] Loading and error states are defined
- [ ] Responsive behavior is specified
- [ ] Animation respects `prefers-reduced-motion`

## Related Documentation

- [Complete Style Guide](style-guide.md) — Full specification details
- [Accessibility Guidelines](../accessibility/guidelines.md) — WCAG compliance requirements
- [Platform Adaptations](platform-adaptations/README.md) — iOS, Android, Web specifics

---

*The design system is a living document. Updates should be versioned and communicated to all implementation teams.*
