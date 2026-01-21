---
title: Color System
description: Complete color palette with accessibility guidelines and usage specifications
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ../style-guide.md
  - ../../accessibility/guidelines.md
status: approved
---

# Color System

## Overview

Travelama's color palette draws inspiration from Mediterranean destinations — warm sand, ocean blues, and coral sunsets. The palette is designed for high readability in varied lighting conditions while maintaining a welcoming, professional aesthetic.

## Table of Contents

1. [Primary Colors](#primary-colors)
2. [Accent Colors](#accent-colors)
3. [Semantic Colors](#semantic-colors)
4. [Neutral Palette](#neutral-palette)
5. [Gradients](#gradients)
6. [Dark Mode Considerations](#dark-mode-considerations)
7. [Accessibility Guidelines](#accessibility-guidelines)
8. [Usage Examples](#usage-examples)

---

## Primary Colors

### Ocean

The primary brand color representing trust, clarity, and the sea. Used for primary actions, links, and brand elements.

| Token | Hex | RGB | HSL |
|-------|-----|-----|-----|
| `ocean-50` | `#ECFEFF` | 236, 254, 255 | 186°, 100%, 96% |
| `ocean-100` | `#CFFAFE` | 207, 250, 254 | 185°, 96%, 90% |
| `ocean-200` | `#A5F3FC` | 165, 243, 252 | 186°, 94%, 82% |
| `ocean-300` | `#67E8F9` | 103, 232, 249 | 187°, 92%, 69% |
| `ocean-400` | `#22D3EE` | 34, 211, 238 | 188°, 85%, 53% |
| `ocean-500` | `#06B6D4` | 6, 182, 212 | 189°, 94%, 43% |
| `ocean-600` | `#0E7490` | 14, 116, 144 | 193°, 82%, 31% |
| `ocean-700` | `#0F766E` | 15, 118, 110 | 175°, 77%, 26% |
| `ocean-800` | `#155E75` | 21, 94, 117 | 194°, 70%, 27% |
| `ocean-900` | `#164E63` | 22, 78, 99 | 196°, 64%, 24% |

**Primary Usage:** `ocean-600` is the main brand color for CTAs, links, and interactive elements.

### Sand

The primary background color creating warmth and a sense of hospitality. Evokes Mediterranean warmth and natural comfort.

| Token | Hex | RGB | HSL |
|-------|-----|-----|-----|
| `sand-50` | `#FEFDFB` | 254, 253, 251 | 40°, 50%, 99% |
| `sand-100` | `#FBF8F3` | 251, 248, 243 | 38°, 50%, 97% |
| `sand-200` | `#F5F0E8` | 245, 240, 232 | 37°, 41%, 94% |
| `sand-300` | `#EBE4D8` | 235, 228, 216 | 38°, 36%, 88% |
| `sand-400` | `#D9CFC0` | 217, 207, 192 | 36°, 28%, 80% |
| `sand-500` | `#BFB5A5` | 191, 181, 165 | 37°, 18%, 70% |

**Primary Usage:** `sand-200` is the main background color for pages and sections.

---

## Accent Colors

### Coral

Secondary accent color for highlights, important notifications, and visual interest. Use sparingly for maximum impact.

| Token | Hex | RGB | HSL |
|-------|-----|-----|-----|
| `coral-300` | `#FDBA74` | 253, 186, 116 | 31°, 97%, 72% |
| `coral-400` | `#FB923C` | 251, 146, 60 | 27°, 96%, 61% |
| `coral-500` | `#F97316` | 249, 115, 22 | 25°, 95%, 53% |
| `coral-600` | `#EA580C` | 234, 88, 12 | 21°, 90%, 48% |
| `coral-700` | `#C2410C` | 194, 65, 12 | 17°, 88%, 40% |

**Primary Usage:** `coral-500` for secondary buttons, badges, and highlights.

**Accessibility Note:** Coral colors have lower contrast ratios. Use only for:
- Large text (18px+ regular, 14px+ bold)
- Icons with accompanying text labels
- Decorative elements (not conveying meaning alone)

---

## Semantic Colors

### Success

Used for positive actions, confirmations, and success states.

| Token | Hex | Usage |
|-------|-----|-------|
| `success-50` | `#F0FDF4` | Success backgrounds, subtle |
| `success-100` | `#DCFCE7` | Success backgrounds, emphasis |
| `success-500` | `#22C55E` | Success icons, text, badges |
| `success-600` | `#16A34A` | Success dark text, emphasis |
| `success-700` | `#15803D` | Success on light backgrounds |

**Use Cases:**
- "Copied to clipboard" confirmation
- Successful check-in/check-out
- Available amenities
- Connected to Wi-Fi

### Warning

Used for caution states, alerts, and important notices that aren't errors.

| Token | Hex | Usage |
|-------|-----|-------|
| `warning-50` | `#FFFBEB` | Warning backgrounds, subtle |
| `warning-100` | `#FEF3C7` | Warning backgrounds, emphasis |
| `warning-500` | `#F59E0B` | Warning icons, text, badges |
| `warning-600` | `#D97706` | Warning dark text, emphasis |
| `warning-700` | `#B45309` | Warning on light backgrounds |

**Use Cases:**
- House rules emphasis
- Check-out reminders
- Parking restrictions
- Time-sensitive information

### Error

Used for errors, destructive actions, and critical alerts.

| Token | Hex | Usage |
|-------|-----|-------|
| `error-50` | `#FEF2F2` | Error backgrounds, subtle |
| `error-100` | `#FEE2E2` | Error backgrounds, emphasis |
| `error-500` | `#EF4444` | Error icons, text, badges |
| `error-600` | `#DC2626` | Error dark text, emphasis |
| `error-700` | `#B91C1C` | Error on light backgrounds |

**Use Cases:**
- Emergency contact information
- Form validation errors
- Broken links or missing content
- Critical house rules (no smoking, etc.)

### Info

Used for informational messages and neutral notifications.

| Token | Hex | Usage |
|-------|-----|-------|
| `info-50` | `#EFF6FF` | Info backgrounds, subtle |
| `info-100` | `#DBEAFE` | Info backgrounds, emphasis |
| `info-500` | `#3B82F6` | Info icons, text, badges |
| `info-600` | `#2563EB` | Info dark text, emphasis |
| `info-700` | `#1D4ED8` | Info on light backgrounds |

**Use Cases:**
- Helpful tips
- "Pro tip" callouts
- Informational notes
- Transport information

---

## Neutral Palette

Used for text, borders, backgrounds, and UI elements that don't require semantic meaning.

| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-50` | `#FAFAFA` | Subtle backgrounds, hover states |
| `neutral-100` | `#F5F5F5` | Light backgrounds, disabled |
| `neutral-200` | `#E5E5E5` | Borders, dividers |
| `neutral-300` | `#D4D4D4` | Disabled borders, inactive |
| `neutral-400` | `#A3A3A3` | Placeholder text, icons |
| `neutral-500` | `#737373` | Secondary text, captions |
| `neutral-600` | `#525252` | Body text |
| `neutral-700` | `#404040` | Primary text |
| `neutral-800` | `#262626` | Headings, emphasis |
| `neutral-900` | `#171717` | Maximum contrast text |

---

## Gradients

### Sunset Gradient

Used for hero elements and special features sparingly.

```css
background: linear-gradient(135deg, #F97316 0%, #EC4899 100%);
```

| Token | Start | End |
|-------|-------|-----|
| `gradient-sunset` | `coral-500` (#F97316) | `#EC4899` (pink-500) |

### Ocean Gradient

For CTAs and premium features.

```css
background: linear-gradient(135deg, #0E7490 0%, #0F766E 100%);
```

| Token | Start | End |
|-------|-------|-----|
| `gradient-ocean` | `ocean-600` (#0E7490) | `ocean-700` (#0F766E) |

**Usage Guidelines:**
- Use gradients sparingly — maximum 1-2 per screen
- Never use gradients for body text backgrounds
- Ensure text on gradients meets contrast requirements at all points

---

## Dark Mode Considerations

*Dark mode is out of scope for MVP but the color system is designed to support it.*

### Future Dark Mode Mapping

| Light Mode | Dark Mode Equivalent |
|------------|---------------------|
| `sand-50` (background) | `neutral-900` |
| `sand-200` (cards) | `neutral-800` |
| `neutral-800` (text) | `neutral-100` |
| `ocean-600` (primary) | `ocean-400` |

---

## Accessibility Guidelines

### Contrast Ratios

All color combinations must meet WCAG AA standards:
- **Normal text** (< 18px): Minimum 4.5:1
- **Large text** (≥ 18px or 14px bold): Minimum 3:1
- **UI components**: Minimum 3:1

### Verified Combinations

| Foreground | Background | Ratio | Pass |
|------------|------------|-------|------|
| `ocean-600` | `sand-50` | 5.2:1 | AA |
| `ocean-600` | `sand-200` | 4.8:1 | AA (large) |
| `neutral-800` | `sand-50` | 14.5:1 | AAA |
| `neutral-700` | `sand-100` | 10.2:1 | AAA |
| `neutral-600` | `sand-100` | 5.9:1 | AA |
| `neutral-500` | `sand-50` | 4.6:1 | AA |
| `coral-600` | `sand-50` | 3.4:1 | AA (large) |
| `white` | `ocean-600` | 5.2:1 | AA |
| `white` | `coral-500` | 3.1:1 | AA (large) |

### Color Blindness Considerations

The palette has been tested for deuteranopia, protanopia, and tritanopia:

- **Ocean vs. Sand**: Distinguishable by luminance difference
- **Success vs. Error**: Different hues (green vs. red) plus luminance
- **Never rely on color alone**: Always pair with icons, text, or patterns

---

## Usage Examples

### Primary Backgrounds
```css
.page { background-color: var(--sand-200); }
.card { background-color: var(--sand-50); }
.header { background-color: var(--ocean-600); }
```

### Text Hierarchy
```css
.heading { color: var(--neutral-800); }
.body { color: var(--neutral-600); }
.caption { color: var(--neutral-500); }
.link { color: var(--ocean-600); }
```

### Interactive States
```css
.button-primary {
  background-color: var(--ocean-600);
  color: white;
}
.button-primary:hover {
  background-color: var(--ocean-700);
}
.button-primary:focus {
  box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.4);
}
```

### Semantic Feedback
```css
.success-message {
  background-color: var(--success-50);
  color: var(--success-700);
  border-left: 4px solid var(--success-500);
}
```

---

## Related Documentation

- [Typography System](typography.md)
- [Component Specifications](../components/README.md)
- [Accessibility Guidelines](../../accessibility/guidelines.md)
