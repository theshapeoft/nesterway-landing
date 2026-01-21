---
title: Spacing System
description: Spacing scale, layout grids, breakpoints, and container specifications
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ../style-guide.md
  - ./typography.md
status: approved
---

# Spacing System

## Overview

Travelama's spacing system uses a consistent 4px base unit to create visual rhythm and hierarchy. The system ensures proper breathing room for content while maintaining efficiency on mobile screens.

## Table of Contents

1. [Base Unit](#base-unit)
2. [Spacing Scale](#spacing-scale)
3. [Layout Grid](#layout-grid)
4. [Breakpoints](#breakpoints)
5. [Container System](#container-system)
6. [Common Patterns](#common-patterns)
7. [Usage Guidelines](#usage-guidelines)

---

## Base Unit

**Base unit: 4px**

All spacing values are multiples of 4px, ensuring:
- Consistent visual rhythm
- Easy mental math (2×, 4×, 6× base)
- Alignment with common design tools (8pt grids)
- Predictable responsive scaling

---

## Spacing Scale

### Core Scale

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `space-0` | 0 | 0px | No spacing |
| `space-px` | 1px | 1px | Hairline borders, dividers |
| `space-0.5` | 0.125rem | 2px | Micro spacing (icon adjustments) |
| `space-1` | 0.25rem | 4px | Tight spacing between related elements |
| `space-1.5` | 0.375rem | 6px | Compact internal padding |
| `space-2` | 0.5rem | 8px | Small gaps, compact layouts |
| `space-2.5` | 0.625rem | 10px | Slightly more breathing room |
| `space-3` | 0.75rem | 12px | Compact component padding |
| `space-3.5` | 0.875rem | 14px | Increased compact padding |
| `space-4` | 1rem | 16px | **Default spacing** |
| `space-5` | 1.25rem | 20px | Medium spacing |
| `space-6` | 1.5rem | 24px | Section gaps, card padding |
| `space-7` | 1.75rem | 28px | Increased section gaps |
| `space-8` | 2rem | 32px | Large gaps between sections |
| `space-9` | 2.25rem | 36px | Major section separations |
| `space-10` | 2.5rem | 40px | Large component margins |
| `space-11` | 2.75rem | 44px | Touch target size |
| `space-12` | 3rem | 48px | Page padding (mobile) |
| `space-14` | 3.5rem | 56px | Major separations |
| `space-16` | 4rem | 64px | Hero section spacing |
| `space-20` | 5rem | 80px | Large page sections |
| `space-24` | 6rem | 96px | Maximum content spacing |

### Named Tokens (Semantic)

| Token | Maps To | Usage |
|-------|---------|-------|
| `spacing-xs` | `space-1` (4px) | Micro spacing |
| `spacing-sm` | `space-2` (8px) | Small gaps |
| `spacing-md` | `space-4` (16px) | Default spacing |
| `spacing-lg` | `space-6` (24px) | Section gaps |
| `spacing-xl` | `space-8` (32px) | Large sections |
| `spacing-2xl` | `space-12` (48px) | Page padding |
| `spacing-3xl` | `space-16` (64px) | Hero sections |

---

## Layout Grid

### Mobile Grid (320px – 767px)

| Property | Value |
|----------|-------|
| Columns | 4 |
| Gutter | 16px |
| Margin | 16px |
| Container | 100% |

```css
.grid-mobile {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 0 16px;
}
```

### Tablet Grid (768px – 1023px)

| Property | Value |
|----------|-------|
| Columns | 8 |
| Gutter | 24px |
| Margin | 32px |
| Container | 100% (max 768px) |

```css
.grid-tablet {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 24px;
  padding: 0 32px;
  max-width: 768px;
  margin: 0 auto;
}
```

### Desktop Grid (1024px – 1439px)

| Property | Value |
|----------|-------|
| Columns | 12 |
| Gutter | 24px |
| Margin | 48px |
| Container | 100% (max 1024px) |

```css
.grid-desktop {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
  padding: 0 48px;
  max-width: 1024px;
  margin: 0 auto;
}
```

### Wide Grid (1440px+)

| Property | Value |
|----------|-------|
| Columns | 12 |
| Gutter | 32px |
| Margin | auto (centered) |
| Container | 1280px max |

```css
.grid-wide {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 32px;
  max-width: 1280px;
  margin: 0 auto;
}
```

---

## Breakpoints

| Name | Min Width | Target Device | Notes |
|------|-----------|---------------|-------|
| `xs` | 320px | Small phones | Minimum supported |
| `sm` | 640px | Large phones, small tablets | First responsive break |
| `md` | 768px | Tablets (portrait) | Tablet-optimized layouts |
| `lg` | 1024px | Tablets (landscape), laptops | Desktop layouts begin |
| `xl` | 1280px | Desktops | Full desktop experience |
| `2xl` | 1536px | Large screens | Maximum width layouts |

### Tailwind Breakpoints

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'xs': '320px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  }
}
```

### CSS Media Queries

```css
/* Mobile-first approach */
.component { /* Mobile styles */ }

@media (min-width: 640px) { /* sm and up */ }
@media (min-width: 768px) { /* md and up */ }
@media (min-width: 1024px) { /* lg and up */ }
@media (min-width: 1280px) { /* xl and up */ }
@media (min-width: 1536px) { /* 2xl and up */ }
```

---

## Container System

### Container Widths

| Breakpoint | Max Width | Padding |
|------------|-----------|---------|
| Mobile | 100% | 16px |
| Tablet | 768px | 32px |
| Desktop | 1024px | 48px |
| Wide | 1280px | auto-centered |

### Container CSS

```css
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 16px;
  padding-right: 16px;
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
    padding-left: 32px;
    padding-right: 32px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
    padding-left: 48px;
    padding-right: 48px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
    padding-left: 64px;
    padding-right: 64px;
  }
}
```

### Content Container (Narrow)

For optimal reading width on content-heavy pages:

```css
.container-content {
  max-width: 65ch; /* ~600px at 16px body */
  margin: 0 auto;
}
```

---

## Common Patterns

### Component Internal Spacing

| Component Type | Padding | Gap Between Items |
|----------------|---------|-------------------|
| Button | 12px 24px | — |
| Card | 16px | 12px |
| Form group | — | 16px |
| List item | 12px 16px | — |
| Modal | 24px | 16px |
| Section | 24px 0 | — |

### Section Spacing

| Section Type | Top Margin | Bottom Margin |
|--------------|------------|---------------|
| Page header | 0 | 24px |
| Content section | 32px | 32px |
| Card group | 24px | 24px |
| Footer | 48px | 0 |

### Inline Spacing

| Element | Space After |
|---------|-------------|
| Icon before text | 8px |
| Badge/tag | 8px |
| Avatar before name | 12px |
| Button in row | 12px |

---

## Usage Guidelines

### Margin vs. Padding

- **Margin**: Space between elements (external)
- **Padding**: Space within elements (internal)

```css
/* Card with internal padding and external margin */
.card {
  padding: 16px; /* Internal space */
  margin-bottom: 16px; /* Space from next element */
}
```

### Consistent Spacing Groups

Group related elements with smaller spacing, separate groups with larger spacing:

```
[Header Group]                    ← 8px internal
    Title
    Subtitle
                                  ← 24px between groups
[Content Group]                   ← 12px internal
    Paragraph 1
    Paragraph 2
                                  ← 24px between groups
[Action Group]                    ← 12px internal
    Button 1
    Button 2
```

### Touch Target Spacing

Ensure adequate spacing between interactive elements:

| Minimum Touch Target | 44×44px |
|---------------------|---------|
| Minimum Spacing Between | 8px |

```css
.button-group {
  display: flex;
  gap: 8px; /* Minimum between touch targets */
}

.button {
  min-height: 44px;
  min-width: 44px;
}
```

### Safe Areas

Account for device safe areas (notches, home indicators):

```css
.page {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

---

## CSS Custom Properties

```css
:root {
  /* Base */
  --space-unit: 4px;

  /* Scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* Semantic */
  --spacing-xs: var(--space-1);
  --spacing-sm: var(--space-2);
  --spacing-md: var(--space-4);
  --spacing-lg: var(--space-6);
  --spacing-xl: var(--space-8);
  --spacing-2xl: var(--space-12);
  --spacing-3xl: var(--space-16);

  /* Layout */
  --container-padding-mobile: 16px;
  --container-padding-tablet: 32px;
  --container-padding-desktop: 48px;
  --container-max-width: 1280px;
}
```

---

## Related Documentation

- [Typography System](typography.md)
- [Color System](colors.md)
- [Component Specifications](../components/README.md)
