---
title: Typography System
description: Font families, weights, size scale, line heights, and responsive typography specifications
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ../style-guide.md
  - ./colors.md
status: approved
---

# Typography System

## Overview

Travelama's typography prioritizes readability across devices and lighting conditions. The system uses Inter as the primary typeface for its excellent screen legibility and extensive character support.

## Table of Contents

1. [Font Stack](#font-stack)
2. [Font Weights](#font-weights)
3. [Type Scale](#type-scale)
4. [Line Heights](#line-heights)
5. [Letter Spacing](#letter-spacing)
6. [Responsive Typography](#responsive-typography)
7. [Text Colors](#text-colors)
8. [Usage Guidelines](#usage-guidelines)

---

## Font Stack

### Primary Font

**Inter** — A highly legible sans-serif typeface designed for computer screens.

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

**Why Inter:**
- Designed specifically for screen readability
- Excellent at small sizes (important for mobile)
- Variable font support for optimal performance
- Wide character and language support
- Free and open source

**Loading Strategy:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Monospace Font

**JetBrains Mono** — For Wi-Fi passwords, codes, and technical information.

```css
font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', Consolas, Monaco, 'Courier New', monospace;
```

**Why JetBrains Mono:**
- Clear character distinction (0 vs O, 1 vs l)
- Easy to read at small sizes
- Excellent for passwords and codes
- Free and open source

**Loading Strategy:**
```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## Font Weights

| Token | Weight | CSS Value | Usage |
|-------|--------|-----------|-------|
| `font-regular` | Regular | 400 | Body text, descriptions, paragraphs |
| `font-medium` | Medium | 500 | Emphasis, labels, captions |
| `font-semibold` | Semibold | 600 | Subheadings, buttons, card titles |
| `font-bold` | Bold | 700 | Headings, strong emphasis, page titles |

### Weight Usage Guidelines

- **Regular (400)**: Default weight for body content. Use for paragraphs, descriptions, and general reading text.
- **Medium (500)**: For subtle emphasis without being too heavy. Form labels, metadata, and interactive element labels.
- **Semibold (600)**: For clear visual hierarchy. Subheadings, buttons, and card titles.
- **Bold (700)**: Reserved for primary headings and the most important text on screen.

---

## Type Scale

Based on a 1.25 ratio (Major Third) for harmonious progression.

### Heading Styles

| Token | Size (px) | Size (rem) | Weight | Line Height | Letter Spacing |
|-------|-----------|------------|--------|-------------|----------------|
| `display` | 36px | 2.25rem | 700 | 1.2 | -0.025em |
| `h1` | 30px | 1.875rem | 700 | 1.2 | -0.02em |
| `h2` | 24px | 1.5rem | 600 | 1.25 | -0.015em |
| `h3` | 20px | 1.25rem | 600 | 1.3 | -0.01em |
| `h4` | 18px | 1.125rem | 600 | 1.35 | 0 |
| `h5` | 16px | 1rem | 600 | 1.4 | 0 |

### Body Styles

| Token | Size (px) | Size (rem) | Weight | Line Height | Letter Spacing |
|-------|-----------|------------|--------|-------------|----------------|
| `body-lg` | 18px | 1.125rem | 400 | 1.6 | 0 |
| `body` | 16px | 1rem | 400 | 1.5 | 0 |
| `body-sm` | 14px | 0.875rem | 400 | 1.5 | 0 |

### Utility Styles

| Token | Size (px) | Size (rem) | Weight | Line Height | Letter Spacing |
|-------|-----------|------------|--------|-------------|----------------|
| `caption` | 12px | 0.75rem | 400 | 1.4 | 0.01em |
| `label` | 12px | 0.75rem | 500 | 1.4 | 0.05em |
| `code` | 14px | 0.875rem | 400 | 1.5 | 0 |

---

## Line Heights

Line height is expressed as a unitless multiplier for flexibility.

| Token | Value | Calculation | Usage |
|-------|-------|-------------|-------|
| `leading-tight` | 1.2 | Size × 1.2 | Headings, display text |
| `leading-snug` | 1.25 | Size × 1.25 | Subheadings |
| `leading-normal` | 1.5 | Size × 1.5 | Body text, default |
| `leading-relaxed` | 1.6 | Size × 1.6 | Long-form reading |
| `leading-loose` | 2 | Size × 2 | Large spacing |

### Line Height Guidelines

- **Headings (1.2-1.25)**: Tight line heights for impact and to avoid awkward gaps in short text.
- **Body text (1.5)**: Standard spacing for comfortable reading across paragraph lengths.
- **Long-form content (1.6)**: Slightly more generous for extended reading sessions.

---

## Letter Spacing

Letter spacing (tracking) adjustments for optical balance.

| Size Range | Letter Spacing | Reason |
|------------|----------------|--------|
| Display (36px+) | -0.025em | Large text needs tightening |
| H1 (30px) | -0.02em | Moderate tightening |
| H2-H3 (20-24px) | -0.01em to -0.015em | Subtle tightening |
| Body (14-18px) | 0 | Default spacing |
| Caption (12px) | +0.01em | Small text needs loosening |
| Labels (12px) | +0.05em | Uppercase needs loosening |

---

## Responsive Typography

Typography scales down on mobile to maintain proportions within the smaller viewport.

### Mobile Scale (< 640px)

| Token | Desktop | Mobile | Reduction |
|-------|---------|--------|-----------|
| `display` | 36px | 28px | 78% |
| `h1` | 30px | 24px | 80% |
| `h2` | 24px | 20px | 83% |
| `h3` | 20px | 18px | 90% |
| `body-lg` | 18px | 16px | 89% |
| `body` | 16px | 16px | 100% |
| `body-sm` | 14px | 14px | 100% |
| `caption` | 12px | 12px | 100% |

### Implementation

```css
/* Mobile-first approach */
.display {
  font-size: 1.75rem; /* 28px */
}

@media (min-width: 640px) {
  .display {
    font-size: 2.25rem; /* 36px */
  }
}
```

### Tailwind Configuration

```javascript
// tailwind.config.js
fontSize: {
  'display': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.025em', fontWeight: '700' }],
  'display-mobile': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
  // ... etc
}
```

---

## Text Colors

### Primary Text Colors

| Token | Color | Hex | Usage |
|-------|-------|-----|-------|
| `text-primary` | `neutral-800` | `#262626` | Headings, important text |
| `text-body` | `neutral-600` | `#525252` | Body text, descriptions |
| `text-secondary` | `neutral-500` | `#737373` | Secondary information |
| `text-muted` | `neutral-400` | `#A3A3A3` | Placeholder, disabled |

### Semantic Text Colors

| Token | Color | Hex | Usage |
|-------|-------|-----|-------|
| `text-link` | `ocean-600` | `#0E7490` | Hyperlinks |
| `text-success` | `success-600` | `#16A34A` | Success messages |
| `text-warning` | `warning-600` | `#D97706` | Warning messages |
| `text-error` | `error-600` | `#DC2626` | Error messages |
| `text-info` | `info-600` | `#2563EB` | Info messages |

### Inverse Text Colors

| Token | Color | Hex | Usage |
|-------|-------|-----|-------|
| `text-inverse` | `sand-50` | `#FEFDFB` | Text on dark backgrounds |
| `text-inverse-muted` | `sand-300` | `#EBE4D8` | Secondary text on dark |

---

## Usage Guidelines

### Heading Hierarchy

Always maintain a logical heading structure for accessibility:

```html
<!-- Correct -->
<h1>Property Name</h1>
  <h2>Wi-Fi & Essentials</h2>
  <h2>House Rules</h2>
    <h3>Quiet Hours</h3>
    <h3>Parking</h3>

<!-- Incorrect - skipping levels -->
<h1>Property Name</h1>
  <h3>Wi-Fi & Essentials</h3> <!-- Skipped h2 -->
```

### Maximum Line Length

For optimal readability:
- **Body text**: 65-75 characters per line (approx. 600px)
- **Headings**: No limit, but consider breaking long titles

```css
.content {
  max-width: 65ch; /* Character-based max-width */
}
```

### Text Alignment

| Context | Alignment |
|---------|-----------|
| Body text | Left |
| Headings | Left |
| CTAs in cards | Center |
| Numbers/prices | Right |
| Form labels | Left |

**Exception**: Hero sections may use centered text for visual impact.

### Truncation

For long text that must be truncated:

```css
/* Single line */
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Multi-line (3 lines) */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### Password & Code Display

For Wi-Fi passwords and codes, use monospace font with enhanced visibility:

```css
.password {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.125rem; /* 18px - slightly larger */
  letter-spacing: 0.05em; /* More spacing for clarity */
  user-select: all; /* Easy selection */
}
```

---

## CSS Custom Properties

```css
:root {
  /* Font Families */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;

  /* Font Sizes */
  --font-size-display: 2.25rem;
  --font-size-h1: 1.875rem;
  --font-size-h2: 1.5rem;
  --font-size-h3: 1.25rem;
  --font-size-h4: 1.125rem;
  --font-size-h5: 1rem;
  --font-size-body-lg: 1.125rem;
  --font-size-body: 1rem;
  --font-size-body-sm: 0.875rem;
  --font-size-caption: 0.75rem;

  /* Font Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Line Heights */
  --line-height-tight: 1.2;
  --line-height-snug: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.6;
}
```

---

## Accessibility Requirements

### Minimum Font Sizes
- **Body text**: 16px minimum (prevents iOS zoom on focus)
- **Small text**: 12px absolute minimum, 14px preferred
- **Touch labels**: 16px minimum for tap targets

### Text Scaling
- Support browser zoom up to 200%
- Use relative units (rem, em) not fixed pixels
- Test with browser font size set to "Large"

### Contrast Ratios
- Normal text (< 18px): 4.5:1 minimum
- Large text (≥ 18px or 14px bold): 3:1 minimum
- See [Colors documentation](colors.md) for verified combinations

---

## Related Documentation

- [Color System](colors.md)
- [Spacing System](spacing.md)
- [Accessibility Guidelines](../../accessibility/guidelines.md)
