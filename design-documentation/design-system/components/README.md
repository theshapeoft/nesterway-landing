---
title: Component Library Overview
description: Complete component specifications for the Travelama design system
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ./buttons.md
  - ./forms.md
  - ./cards.md
  - ./navigation.md
  - ./modals.md
status: approved
---

# Component Library

## Overview

The Travelama component library provides consistent, accessible building blocks for creating the user interface. All components are designed mobile-first with accessibility built in.

## Component Index

### Core Components
| Component | Description | Documentation |
|-----------|-------------|---------------|
| Buttons | Primary actions, secondary actions, icon buttons | [buttons.md](buttons.md) |
| Forms | Text inputs, select, checkbox, copy field | [forms.md](forms.md) |
| Cards | Info cards, recommendation cards, section cards | [cards.md](cards.md) |
| Navigation | Header, tabs, breadcrumbs, back button | [navigation.md](navigation.md) |
| Modals | Bottom sheets, dialogs, toasts | [modals.md](modals.md) |

### Specialized Components
| Component | Description | Location |
|-----------|-------------|----------|
| Wi-Fi Display | Password with copy button and QR code | [forms.md#wifi-display](forms.md#wifi-display) |
| Quick Access Bar | Icon buttons for key actions | [navigation.md#quick-access-bar](navigation.md#quick-access-bar) |
| Collapsible Section | Accordion for property info | [cards.md#collapsible-section](cards.md#collapsible-section) |
| Recommendation Card | Place card with map link | [cards.md#recommendation-card](cards.md#recommendation-card) |

## Component Architecture

### Atomic Design Methodology

Components are organized following atomic design principles:

```
Atoms (Base Elements)
├── Button
├── Input
├── Icon
├── Badge
└── Avatar

Molecules (Combinations)
├── Form Field (Label + Input + Error)
├── Card Header (Title + Badge)
├── List Item (Icon + Text + Action)
└── Copy Field (Input + Button)

Organisms (Complex Components)
├── Property Header
├── Section Accordion
├── Recommendation List
├── Navigation Bar
└── Quick Access Bar

Templates (Page Layouts)
├── Property Page Template
├── Area Guide Template
└── Country Page Template
```

## Component Standards

### Accessibility Requirements

All components must:
- [ ] Meet WCAG AA color contrast (4.5:1 text, 3:1 UI)
- [ ] Have minimum 44×44px touch targets
- [ ] Support keyboard navigation
- [ ] Include appropriate ARIA labels
- [ ] Work with screen readers (VoiceOver, TalkBack)
- [ ] Support browser zoom to 200%

### State Coverage

Every interactive component must define:
- **Default**: Normal resting state
- **Hover**: Pointer/cursor over (desktop only)
- **Focus**: Keyboard focus indicator
- **Active/Pressed**: During interaction
- **Disabled**: Non-interactive state
- **Loading**: Async operation in progress (if applicable)
- **Error**: Validation failure (if applicable)

### Responsive Behavior

Components must work across all breakpoints:
- **Mobile**: 320px – 767px (primary target)
- **Tablet**: 768px – 1023px
- **Desktop**: 1024px+

## Naming Conventions

### Component Names
- Use PascalCase: `ButtonPrimary`, `CardRecommendation`
- Descriptive and specific: `InputCopyField` not `Input2`

### Variant Names
- Use camelCase: `primary`, `secondary`, `ghost`
- Describe the visual treatment

### State Names
- Use lowercase: `default`, `hover`, `focus`, `active`, `disabled`

### CSS Class Names (BEM-style)
```
.component                  /* Block */
.component--variant         /* Modifier */
.component__element         /* Element */
.component__element--state  /* Element state */
```

## Implementation Guidelines

### React Component Structure

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children,
}: ButtonProps) {
  // Implementation
}
```

### CSS-in-Tailwind Pattern

```tsx
const variants = {
  primary: 'bg-ocean-600 text-white hover:bg-ocean-700',
  secondary: 'bg-sand-100 text-ocean-600 border border-sand-300',
  ghost: 'bg-transparent text-ocean-600 hover:bg-ocean-50',
};

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-11 px-6 text-base',
  lg: 'h-13 px-8 text-lg',
};
```

## Quality Checklist

Before using any component in production:

### Design Review
- [ ] Matches design system specifications
- [ ] All states implemented and tested
- [ ] Responsive behavior verified
- [ ] Animations smooth at 60fps

### Accessibility Review
- [ ] Color contrast verified
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Focus indicators visible
- [ ] Touch targets adequate

### Code Review
- [ ] Props are typed correctly
- [ ] Default values make sense
- [ ] Error boundaries in place
- [ ] Performance optimized

---

## Related Documentation

- [Style Guide](../style-guide.md)
- [Color System](../tokens/colors.md)
- [Typography](../tokens/typography.md)
- [Spacing](../tokens/spacing.md)
- [Animations](../tokens/animations.md)
