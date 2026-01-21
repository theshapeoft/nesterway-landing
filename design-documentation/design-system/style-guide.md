---
title: Travelama Complete Style Guide
description: Comprehensive design specifications including colors, typography, spacing, components, and interaction patterns
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ./tokens/colors.md
  - ./tokens/typography.md
  - ./tokens/spacing.md
  - ./tokens/animations.md
  - ./components/README.md
status: approved
---

# Travelama Complete Style Guide

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography System](#typography-system)
4. [Spacing & Layout System](#spacing--layout-system)
5. [Elevation & Shadows](#elevation--shadows)
6. [Border & Radius System](#border--radius-system)
7. [Iconography](#iconography)
8. [Motion & Animation](#motion--animation)
9. [Component Specifications](#component-specifications)
10. [Responsive Design](#responsive-design)
11. [Accessibility Standards](#accessibility-standards)

---

## Design Philosophy

Travelama's design embodies the experience of arriving at a new destination — welcoming, clear, and immediately useful. Our visual language draws inspiration from Mediterranean hospitality: warm, airy, and unpretentious.

### Core Principles

1. **Bold Simplicity** — Every element earns its place. No decorative clutter.
2. **Breathable Space** — Generous whitespace reduces cognitive load for tired travelers.
3. **Intuitive Navigation** — Two taps to any information. Always.
4. **High Readability** — Works in bright sunlight or dim apartments.
5. **Warm Professionalism** — Friendly without being casual. Trustworthy without being corporate.

---

## Color System

### Primary Colors

**Ocean** — Primary brand color, used for CTAs, links, and brand elements.
| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `ocean-50` | `#ECFEFF` | 236, 254, 255 | Subtle backgrounds, hover states |
| `ocean-100` | `#CFFAFE` | 207, 250, 254 | Light backgrounds, selected states |
| `ocean-200` | `#A5F3FC` | 165, 243, 252 | Decorative elements |
| `ocean-300` | `#67E8F9` | 103, 232, 249 | Icons, illustrations |
| `ocean-400` | `#22D3EE` | 34, 211, 238 | Secondary interactive |
| `ocean-500` | `#06B6D4` | 6, 182, 212 | Interactive hover |
| `ocean-600` | `#0E7490` | 14, 116, 144 | **Primary — CTAs, links** |
| `ocean-700` | `#0F766E` | 15, 118, 110 | Primary hover/active |
| `ocean-800` | `#155E75` | 21, 94, 117 | Emphasis text |
| `ocean-900` | `#164E63` | 22, 78, 99 | Deep accent |

**Sand** — Primary background, creates warmth and hospitality feel.
| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `sand-50` | `#FEFDFB` | 254, 253, 251 | Pure backgrounds |
| `sand-100` | `#FBF8F3` | 251, 248, 243 | Card backgrounds |
| `sand-200` | `#F5F0E8` | 245, 240, 232 | **Primary background** |
| `sand-300` | `#EBE4D8` | 235, 228, 216 | Dividers, borders |
| `sand-400` | `#D9CFC0` | 217, 207, 192 | Disabled states |
| `sand-500` | `#BFB5A5` | 191, 181, 165 | Placeholder text |

### Accent Colors

**Coral** — Secondary accent for highlights and emphasis.
| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `coral-400` | `#FB923C` | 251, 146, 60 | Light accent |
| `coral-500` | `#F97316` | 249, 115, 22 | **Primary accent** |
| `coral-600` | `#EA580C` | 234, 88, 12 | Accent hover |

**Sunset** — Warm gradient elements.
| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `sunset-start` | `#F97316` | 249, 115, 22 | Gradient start |
| `sunset-end` | `#EC4899` | 236, 72, 153 | Gradient end |

### Semantic Colors

**Success**
| Token | Hex | Usage |
|-------|-----|-------|
| `success-50` | `#F0FDF4` | Success background |
| `success-500` | `#22C55E` | Success icons, text |
| `success-600` | `#16A34A` | Success emphasis |

**Warning**
| Token | Hex | Usage |
|-------|-----|-------|
| `warning-50` | `#FFFBEB` | Warning background |
| `warning-500` | `#F59E0B` | Warning icons, text |
| `warning-600` | `#D97706` | Warning emphasis |

**Error**
| Token | Hex | Usage |
|-------|-----|-------|
| `error-50` | `#FEF2F2` | Error background |
| `error-500` | `#EF4444` | Error icons, text |
| `error-600` | `#DC2626` | Error emphasis |

**Info**
| Token | Hex | Usage |
|-------|-----|-------|
| `info-50` | `#EFF6FF` | Info background |
| `info-500` | `#3B82F6` | Info icons, text |
| `info-600` | `#2563EB` | Info emphasis |

### Neutral Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-50` | `#FAFAFA` | Subtle backgrounds |
| `neutral-100` | `#F5F5F5` | Light backgrounds |
| `neutral-200` | `#E5E5E5` | Borders, dividers |
| `neutral-300` | `#D4D4D4` | Disabled borders |
| `neutral-400` | `#A3A3A3` | Placeholder text |
| `neutral-500` | `#737373` | Secondary text |
| `neutral-600` | `#525252` | Body text |
| `neutral-700` | `#404040` | Primary text |
| `neutral-800` | `#262626` | Headings |
| `neutral-900` | `#171717` | Maximum contrast |

### Accessibility Notes

| Combination | Contrast Ratio | WCAG Level |
|-------------|----------------|------------|
| `ocean-600` on `sand-50` | 5.2:1 | AA (normal text) |
| `ocean-600` on `sand-200` | 4.8:1 | AA (large text) |
| `neutral-800` on `sand-50` | 14.5:1 | AAA |
| `neutral-600` on `sand-100` | 5.9:1 | AA |
| `coral-500` on `sand-50` | 3.1:1 | AA (large text only) |

**Important**: Coral accent should only be used for large text (18px+) or icons with accompanying text due to contrast limitations.

---

## Typography System

### Font Stack

**Primary Font**: Inter
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

**Monospace Font** (for Wi-Fi passwords, codes):
```css
font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', Consolas, monospace;
```

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text, descriptions |
| Medium | 500 | Emphasis, labels |
| Semibold | 600 | Subheadings, buttons |
| Bold | 700 | Headings, strong emphasis |

### Type Scale

| Token | Size | Line Height | Weight | Letter Spacing | Usage |
|-------|------|-------------|--------|----------------|-------|
| `display` | 36px / 2.25rem | 1.2 (43px) | 700 | -0.025em | Hero titles |
| `h1` | 30px / 1.875rem | 1.2 (36px) | 700 | -0.02em | Page titles |
| `h2` | 24px / 1.5rem | 1.25 (30px) | 600 | -0.015em | Section headers |
| `h3` | 20px / 1.25rem | 1.3 (26px) | 600 | -0.01em | Subsection headers |
| `h4` | 18px / 1.125rem | 1.35 (24px) | 600 | 0 | Card titles |
| `h5` | 16px / 1rem | 1.4 (22px) | 600 | 0 | Minor headers |
| `body-lg` | 18px / 1.125rem | 1.6 (29px) | 400 | 0 | Primary reading |
| `body` | 16px / 1rem | 1.5 (24px) | 400 | 0 | Standard UI text |
| `body-sm` | 14px / 0.875rem | 1.5 (21px) | 400 | 0 | Secondary info |
| `caption` | 12px / 0.75rem | 1.4 (17px) | 400 | 0.01em | Metadata, timestamps |
| `label` | 12px / 0.75rem | 1.4 (17px) | 500 | 0.05em | Form labels (uppercase) |
| `code` | 14px / 0.875rem | 1.5 (21px) | 400 | 0 | Wi-Fi passwords, codes |

### Responsive Typography

**Mobile (< 640px)**
| Token | Base Size | Adjusted |
|-------|-----------|----------|
| `display` | 36px | 28px |
| `h1` | 30px | 24px |
| `h2` | 24px | 20px |
| `h3` | 20px | 18px |
| `body-lg` | 18px | 16px |

**Tablet+ (≥ 640px)**: Use base sizes as defined.

### Text Colors

| Token | Usage |
|-------|-------|
| `text-primary` = `neutral-800` | Headings, important text |
| `text-body` = `neutral-600` | Body text, descriptions |
| `text-secondary` = `neutral-500` | Secondary information |
| `text-muted` = `neutral-400` | Placeholder, disabled |
| `text-inverse` = `sand-50` | Text on dark backgrounds |
| `text-link` = `ocean-600` | Hyperlinks |

---

## Spacing & Layout System

### Base Unit

**Base unit**: 4px

All spacing values are multiples of 4px to ensure consistent visual rhythm.

### Spacing Scale

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `space-0` | 0 | 0px | No spacing |
| `space-px` | 1px | 1px | Hairline borders |
| `space-0.5` | 0.125rem | 2px | Micro spacing |
| `space-1` | 0.25rem | 4px | Tight spacing |
| `space-2` | 0.5rem | 8px | Small gaps |
| `space-3` | 0.75rem | 12px | Compact spacing |
| `space-4` | 1rem | 16px | **Default spacing** |
| `space-5` | 1.25rem | 20px | Medium spacing |
| `space-6` | 1.5rem | 24px | Section gaps |
| `space-8` | 2rem | 32px | Large gaps |
| `space-10` | 2.5rem | 40px | Major sections |
| `space-12` | 3rem | 48px | Page padding |
| `space-16` | 4rem | 64px | Hero sections |
| `space-20` | 5rem | 80px | Large separations |
| `space-24` | 6rem | 96px | Maximum spacing |

### Layout Grid

**Mobile (320px – 767px)**
- Columns: 4
- Gutter: 16px
- Margin: 16px
- Container max-width: 100%

**Tablet (768px – 1023px)**
- Columns: 8
- Gutter: 24px
- Margin: 32px
- Container max-width: 768px

**Desktop (1024px – 1439px)**
- Columns: 12
- Gutter: 24px
- Margin: 48px
- Container max-width: 1024px

**Wide (1440px+)**
- Columns: 12
- Gutter: 32px
- Margin: auto (centered)
- Container max-width: 1280px

### Breakpoints

| Name | Min Width | Target |
|------|-----------|--------|
| `xs` | 320px | Small phones |
| `sm` | 640px | Large phones, small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

---

## Elevation & Shadows

Shadows create depth and hierarchy. Use sparingly to maintain the clean, airy feel.

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-none` | none | Flat elements |
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift, buttons |
| `shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)` | Cards, dropdowns |
| `shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)` | Modals, popovers |
| `shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)` | Large modals |
| `shadow-inner` | `inset 0 2px 4px rgba(0,0,0,0.05)` | Pressed states, inputs |

### Focus Rings

| Token | Value | Usage |
|-------|-------|-------|
| `ring-focus` | `0 0 0 3px rgba(14, 116, 144, 0.4)` | Focus indicator (ocean-600 at 40%) |
| `ring-focus-error` | `0 0 0 3px rgba(239, 68, 68, 0.4)` | Error focus (error-500 at 40%) |

---

## Border & Radius System

### Border Widths

| Token | Value | Usage |
|-------|-------|-------|
| `border-0` | 0px | No border |
| `border` | 1px | Standard borders |
| `border-2` | 2px | Emphasis borders |
| `border-4` | 4px | Strong borders |

### Border Colors

| Token | Value | Usage |
|-------|-------|-------|
| `border-default` | `sand-300` | Standard borders |
| `border-emphasis` | `neutral-300` | Emphasis borders |
| `border-interactive` | `ocean-600` | Interactive focus |
| `border-error` | `error-500` | Error states |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-none` | 0 | Sharp corners |
| `rounded-sm` | 4px | Subtle rounding |
| `rounded` | 8px | **Default rounding** |
| `rounded-md` | 12px | Cards, buttons |
| `rounded-lg` | 16px | Large elements |
| `rounded-xl` | 24px | Hero elements |
| `rounded-2xl` | 32px | Feature cards |
| `rounded-full` | 9999px | Pills, avatars |

---

## Iconography

### Icon System

**Library**: Lucide React (recommended)
- Consistent 24×24 viewBox
- 2px stroke width
- Rounded joins and caps

### Icon Sizes

| Token | Size | Usage |
|-------|------|-------|
| `icon-xs` | 12px | Inline with small text |
| `icon-sm` | 16px | Inline with body text |
| `icon-md` | 20px | Buttons, list items |
| `icon-lg` | 24px | **Standard icons** |
| `icon-xl` | 32px | Feature icons |
| `icon-2xl` | 48px | Hero/empty state icons |

### Icon Colors

Icons inherit text color by default. Use semantic colors for meaning:

| State | Color |
|-------|-------|
| Default | `neutral-600` |
| Primary action | `ocean-600` |
| Success | `success-500` |
| Warning | `warning-500` |
| Error | `error-500` |
| Disabled | `neutral-400` |

### Touch Target Requirement

All interactive icons must have a minimum touch target of 44×44px, even if the visual icon is smaller.

```css
/* Example: 24px icon with 44px touch target */
.icon-button {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## Motion & Animation

### Timing Functions

| Token | Value | Usage |
|-------|-------|-------|
| `ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | General transitions |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exit animations |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Enter animations |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Symmetrical transitions |
| `ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful bounces |

### Duration Scale

| Token | Value | Usage |
|-------|-------|-------|
| `duration-75` | 75ms | Micro-interactions |
| `duration-100` | 100ms | Quick state changes |
| `duration-150` | 150ms | Button hovers, toggles |
| `duration-200` | 200ms | **Default transitions** |
| `duration-300` | 300ms | Dropdowns, small modals |
| `duration-500` | 500ms | Page transitions, large modals |
| `duration-700` | 700ms | Complex animations |

### Common Animations

**Fade In**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
animation: fadeIn 200ms ease-out;
```

**Slide Up**
```css
@keyframes slideUp {
  from { transform: translateY(16px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
animation: slideUp 300ms ease-out;
```

**Scale In**
```css
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
animation: scaleIn 200ms ease-out;
```

**Bottom Sheet**
```css
@keyframes slideUpSheet {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
animation: slideUpSheet 300ms ease-out;
```

### Reduced Motion

Always respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Component Specifications

### Buttons

See [components/buttons.md](components/buttons.md) for full specifications.

**Quick Reference**:

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| Primary | `ocean-600` | `white` | none |
| Secondary | `sand-100` | `ocean-600` | `sand-300` |
| Ghost | transparent | `ocean-600` | none |
| Destructive | `error-500` | `white` | none |

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| Small | 32px | 12px 16px | 14px |
| Medium | 44px | 16px 24px | 16px |
| Large | 52px | 20px 32px | 18px |

### Cards

See [components/cards.md](components/cards.md) for full specifications.

**Quick Reference**:
- Background: `sand-50` or `white`
- Border: 1px `sand-300`
- Radius: `rounded-md` (12px)
- Padding: `space-4` (16px)
- Shadow: `shadow-sm` (subtle) or `shadow-md` (elevated)

### Form Elements

See [components/forms.md](components/forms.md) for full specifications.

**Quick Reference**:
- Input height: 44px (meets touch target)
- Border: 1px `sand-300`, 2px `ocean-600` on focus
- Radius: `rounded` (8px)
- Padding: 12px 16px

---

## Responsive Design

### Mobile-First Approach

All base styles target mobile (320px+). Add complexity at larger breakpoints.

```css
/* Mobile base */
.component { padding: 16px; }

/* Tablet+ */
@media (min-width: 768px) {
  .component { padding: 24px; }
}
```

### Touch vs. Pointer

| Device | Touch Target | Hover States |
|--------|-------------|--------------|
| Touch (mobile) | Minimum 44×44px | No hover effects |
| Pointer (desktop) | Minimum 32×32px | Full hover effects |

```css
@media (hover: hover) {
  .button:hover { background: var(--ocean-700); }
}
```

### Safe Areas

Always account for device safe areas (notches, home indicators):

```css
.page-container {
  padding-bottom: env(safe-area-inset-bottom);
}
```

---

## Accessibility Standards

### Color Contrast Requirements

| Context | Minimum Ratio | Standard |
|---------|---------------|----------|
| Normal text (< 18px) | 4.5:1 | WCAG AA |
| Large text (≥ 18px or 14px bold) | 3:1 | WCAG AA |
| UI components, graphics | 3:1 | WCAG AA |
| Focus indicators | 3:1 | WCAG AA |

### Keyboard Navigation

- All interactive elements must be focusable
- Logical tab order following visual layout
- Visible focus indicators (see Focus Rings above)
- Escape key closes modals/dropdowns
- Enter/Space activates buttons

### Screen Reader Support

- Semantic HTML elements (`button`, `nav`, `main`, etc.)
- Meaningful alt text for images
- ARIA labels for icon-only buttons
- Live regions for dynamic content updates
- Proper heading hierarchy (h1 → h2 → h3)

### Touch Targets

- Minimum size: 44×44px
- Minimum spacing between targets: 8px
- Larger targets for primary actions

### Text Sizing

- Base font size: 16px (prevents zoom on iOS)
- Support browser zoom up to 200%
- Use relative units (rem, em) for typography

---

## Implementation Notes

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ocean-600: #0E7490;
  --color-sand-200: #F5F0E8;
  --color-coral-500: #F97316;

  /* Typography */
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --space-4: 1rem;
  --space-6: 1.5rem;

  /* Transitions */
  --transition-default: 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Tailwind Integration

All tokens are configured for direct use in Tailwind. See [../assets/design-tokens.json](../assets/design-tokens.json) for the exportable token file.

---

## Quality Assurance Checklist

### Design System Compliance
- [ ] Colors match defined palette with proper contrast ratios
- [ ] Typography follows established hierarchy and scale
- [ ] Spacing uses systematic scale consistently
- [ ] Components match documented specifications
- [ ] Motion follows timing and easing standards

### Accessibility Compliance
- [ ] WCAG AA compliance verified for all interactions
- [ ] Keyboard navigation complete and logical
- [ ] Screen reader experience optimized
- [ ] Color contrast ratios verified
- [ ] Touch targets meet minimum size requirements
- [ ] Focus indicators visible and consistent
- [ ] Motion respects `prefers-reduced-motion`

---

*This style guide is the authoritative source for all Travelama design specifications. All implementations should reference this document.*
