---
title: Animation System
description: Timing functions, duration scale, and common animation patterns for motion design
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ../style-guide.md
  - ../components/README.md
status: approved
---

# Animation System

## Overview

Motion in Travelama is purposeful and subtle, guiding users through interactions without distraction. Animations communicate state changes, provide feedback, and create spatial relationships between elements.

## Table of Contents

1. [Animation Principles](#animation-principles)
2. [Timing Functions](#timing-functions)
3. [Duration Scale](#duration-scale)
4. [Common Animations](#common-animations)
5. [Micro-interactions](#micro-interactions)
6. [Page Transitions](#page-transitions)
7. [Accessibility](#accessibility)
8. [Implementation](#implementation)

---

## Animation Principles

### 1. Purpose-Driven
Every animation serves a functional purpose:
- Providing feedback on user actions
- Indicating state changes
- Guiding attention to important elements
- Creating spatial continuity during navigation

### 2. Performance-First
- Target 60fps for all animations
- Use hardware-accelerated properties (transform, opacity)
- Avoid animating layout-triggering properties (width, height, top, left)
- Keep animations brief to minimize perceived latency

### 3. Subtle and Natural
- Animations should feel natural and unobtrusive
- Avoid bouncy or overly playful effects for core UI
- Match the calm, welcoming brand personality
- Quick transitions for tired travelers who want information fast

### 4. Consistent
- Similar actions use similar animations
- Duration and easing are consistent across the system
- Predictable motion builds user confidence

---

## Timing Functions

### Easing Curves

| Token | Value | Usage |
|-------|-------|-------|
| `ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default for most transitions |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exit animations (element leaving) |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Enter animations (element appearing) |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Symmetrical, balanced transitions |
| `ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful, bouncy (use sparingly) |
| `ease-linear` | `linear` | Continuous progress indicators |

### When to Use Each

**Ease-Out (Deceleration)**
- Enter animations
- Dropdowns opening
- Modals appearing
- Content fading in
- Natural "arrival" feeling

**Ease-In (Acceleration)**
- Exit animations
- Elements leaving the screen
- Closing modals
- Collapsing accordions
- Quick "departure" feeling

**Ease-In-Out**
- Transformations (scale, rotation)
- Toggle switches
- Tab transitions
- Symmetrical movements

**Linear**
- Loading progress bars
- Spinning indicators
- Continuous animations

---

## Duration Scale

| Token | Value | Usage |
|-------|-------|-------|
| `duration-0` | 0ms | Instant, no animation |
| `duration-75` | 75ms | Micro-interactions, state indicators |
| `duration-100` | 100ms | Quick state changes, checkboxes |
| `duration-150` | 150ms | Button hovers, toggles, small feedback |
| `duration-200` | 200ms | **Default** — most UI transitions |
| `duration-300` | 300ms | Dropdowns, small modals, accordions |
| `duration-400` | 400ms | Larger modals, complex transitions |
| `duration-500` | 500ms | Page transitions, hero animations |
| `duration-700` | 700ms | Complex multi-step animations |
| `duration-1000` | 1000ms | Extended animations (rare) |

### Duration Guidelines

| Animation Type | Recommended Duration |
|----------------|---------------------|
| Hover effects | 150ms |
| Button feedback | 100–150ms |
| Toggle/checkbox | 100–150ms |
| Dropdown/menu | 200–300ms |
| Accordion expand | 200–300ms |
| Modal enter | 300–400ms |
| Modal exit | 200–300ms |
| Page transition | 400–500ms |
| Loading skeleton | 1500–2000ms (loop) |

---

## Common Animations

### Fade In

Simple opacity transition for appearing elements.

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 200ms ease-out forwards;
}
```

### Fade Out

```css
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

.fade-out {
  animation: fadeOut 150ms ease-in forwards;
}
```

### Slide Up (Enter)

Content appearing from below with fade.

```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up {
  animation: slideUp 300ms ease-out forwards;
}
```

### Slide Down (Exit)

```css
@keyframes slideDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(16px);
  }
}

.slide-down {
  animation: slideDown 200ms ease-in forwards;
}
```

### Scale In

For modals, popovers, and focused elements.

```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.scale-in {
  animation: scaleIn 200ms ease-out forwards;
}
```

### Scale Out

```css
@keyframes scaleOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

.scale-out {
  animation: scaleOut 150ms ease-in forwards;
}
```

### Bottom Sheet (Mobile)

Full-height slide up for mobile modals.

```css
@keyframes bottomSheetIn {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes bottomSheetOut {
  from { transform: translateY(0); }
  to { transform: translateY(100%); }
}

.bottom-sheet-enter {
  animation: bottomSheetIn 300ms ease-out forwards;
}

.bottom-sheet-exit {
  animation: bottomSheetOut 250ms ease-in forwards;
}
```

### Accordion Expand/Collapse

```css
.accordion-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 300ms ease-in-out;
}

.accordion-content.open {
  grid-template-rows: 1fr;
}

.accordion-inner {
  overflow: hidden;
}
```

---

## Micro-interactions

### Button Press

```css
.button {
  transition: transform 100ms ease-out, background-color 150ms ease-out;
}

.button:hover {
  background-color: var(--ocean-700);
}

.button:active {
  transform: scale(0.98);
}
```

### Checkbox Toggle

```css
.checkbox-indicator {
  transition: background-color 150ms ease-out, border-color 150ms ease-out;
}

.checkbox-check {
  transition: opacity 100ms ease-out, transform 100ms ease-out;
  transform: scale(0.8);
  opacity: 0;
}

.checkbox:checked + .checkbox-indicator .checkbox-check {
  transform: scale(1);
  opacity: 1;
}
```

### Copy to Clipboard Feedback

```css
@keyframes copySuccess {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.copy-button.success {
  animation: copySuccess 200ms ease-out;
}
```

### Focus Ring

```css
.focusable {
  transition: box-shadow 150ms ease-out;
}

.focusable:focus-visible {
  box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.4);
}
```

### Loading Spinner

```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1000ms linear infinite;
}
```

### Skeleton Loading

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--sand-200) 25%,
    var(--sand-100) 50%,
    var(--sand-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1500ms linear infinite;
}
```

---

## Page Transitions

### Route Change

For navigation between pages:

```css
/* Exit animation */
.page-exit {
  animation: fadeOut 200ms ease-in forwards;
}

/* Enter animation */
.page-enter {
  animation: fadeIn 300ms ease-out forwards;
}
```

### Staggered List Items

For lists that load items sequentially:

```css
.list-item {
  opacity: 0;
  animation: slideUp 300ms ease-out forwards;
}

.list-item:nth-child(1) { animation-delay: 0ms; }
.list-item:nth-child(2) { animation-delay: 50ms; }
.list-item:nth-child(3) { animation-delay: 100ms; }
.list-item:nth-child(4) { animation-delay: 150ms; }
/* Max 200ms total stagger */
```

---

## Accessibility

### Reduced Motion

Always respect user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Alternative for Reduced Motion Users

When animations convey meaning, provide alternative feedback:

```css
/* Normal mode: animated checkmark */
.success-indicator {
  animation: scaleIn 200ms ease-out;
}

/* Reduced motion: instant appearance */
@media (prefers-reduced-motion: reduce) {
  .success-indicator {
    opacity: 1; /* Just show it */
  }
}
```

### Avoiding Motion Sickness

- Avoid large-scale motion across the screen
- Limit parallax effects
- Keep movements small and localized
- Avoid infinite looping animations (except spinners)

---

## Implementation

### CSS Custom Properties

```css
:root {
  /* Easing */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Durations */
  --duration-75: 75ms;
  --duration-100: 100ms;
  --duration-150: 150ms;
  --duration-200: 200ms;
  --duration-300: 300ms;
  --duration-400: 400ms;
  --duration-500: 500ms;
  --duration-700: 700ms;
  --duration-1000: 1000ms;

  /* Common transitions */
  --transition-default: var(--duration-200) var(--ease-default);
  --transition-fast: var(--duration-150) var(--ease-default);
  --transition-slow: var(--duration-300) var(--ease-default);
}
```

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      transitionTimingFunction: {
        'default': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'in': 'cubic-bezier(0.4, 0, 1, 1)',
        'out': 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out forwards',
        'slide-up': 'slideUp 300ms ease-out forwards',
        'scale-in': 'scaleIn 200ms ease-out forwards',
        'spin': 'spin 1000ms linear infinite',
        'shimmer': 'shimmer 1500ms linear infinite',
      },
    },
  },
}
```

### React/Framer Motion

For complex animations, consider Framer Motion:

```tsx
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 16 },
  transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }
};

function Card() {
  return (
    <motion.div {...fadeInUp}>
      Content
    </motion.div>
  );
}
```

---

## Performance Checklist

- [ ] All animations use transform and/or opacity only
- [ ] No layout-triggering properties animated (width, height, top, left)
- [ ] Animation duration is appropriate (not too slow)
- [ ] Reduced motion is respected via `prefers-reduced-motion`
- [ ] No animations block user interaction
- [ ] Loading spinners don't cause layout shifts
- [ ] Animations are tested on low-end devices

---

## Related Documentation

- [Component Specifications](../components/README.md)
- [Accessibility Guidelines](../../accessibility/guidelines.md)
- [Style Guide](../style-guide.md)
