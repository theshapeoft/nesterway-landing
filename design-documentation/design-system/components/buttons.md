---
title: Button Components
description: Specifications for primary, secondary, ghost, and icon button variants
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ../tokens/colors.md
  - ../tokens/typography.md
  - ../tokens/spacing.md
  - ../tokens/animations.md
status: approved
---

# Button Components

## Overview

Buttons are the primary interactive elements for user actions. They communicate importance through visual hierarchy and provide clear feedback through state changes.

## Table of Contents

1. [Button Variants](#button-variants)
2. [Button Sizes](#button-sizes)
3. [Button States](#button-states)
4. [Icon Buttons](#icon-buttons)
5. [Button Groups](#button-groups)
6. [Accessibility](#accessibility)
7. [Usage Guidelines](#usage-guidelines)

---

## Button Variants

### Primary Button

The most prominent button for primary actions (e.g., "Copy Password", "Get Directions").

| Property | Value |
|----------|-------|
| Background | `ocean-600` (#0E7490) |
| Text Color | `white` (#FFFFFF) |
| Border | none |
| Border Radius | 8px (`rounded`) |
| Font Weight | 600 (semibold) |
| Shadow | `shadow-sm` |

```css
.button-primary {
  background-color: var(--ocean-600);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: background-color 150ms ease-out, transform 100ms ease-out;
}
```

### Secondary Button

For secondary actions that need visibility but shouldn't compete with primary.

| Property | Value |
|----------|-------|
| Background | `sand-100` (#FBF8F3) |
| Text Color | `ocean-600` (#0E7490) |
| Border | 1px solid `sand-300` (#EBE4D8) |
| Border Radius | 8px |
| Font Weight | 600 |

```css
.button-secondary {
  background-color: var(--sand-100);
  color: var(--ocean-600);
  border: 1px solid var(--sand-300);
  border-radius: 8px;
  font-weight: 600;
}
```

### Ghost Button

For tertiary actions, in toolbars, or when space is limited.

| Property | Value |
|----------|-------|
| Background | transparent |
| Text Color | `ocean-600` (#0E7490) |
| Border | none |
| Border Radius | 8px |
| Font Weight | 500 (medium) |

```css
.button-ghost {
  background-color: transparent;
  color: var(--ocean-600);
  border: none;
  border-radius: 8px;
  font-weight: 500;
}
```

### Destructive Button

For dangerous actions (rarely used in Travelama — guest-facing is read-only).

| Property | Value |
|----------|-------|
| Background | `error-500` (#EF4444) |
| Text Color | `white` |
| Border | none |
| Border Radius | 8px |
| Font Weight | 600 |

```css
.button-destructive {
  background-color: var(--error-500);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
}
```

---

## Button Sizes

### Small (sm)

For compact spaces, inline actions, or less important controls.

| Property | Value |
|----------|-------|
| Height | 32px |
| Padding | 8px 16px |
| Font Size | 14px (`body-sm`) |
| Min Width | 64px |

### Medium (md) — Default

Standard button size for most use cases.

| Property | Value |
|----------|-------|
| Height | 44px |
| Padding | 12px 24px |
| Font Size | 16px (`body`) |
| Min Width | 80px |

### Large (lg)

For prominent CTAs, hero sections, or full-width mobile buttons.

| Property | Value |
|----------|-------|
| Height | 52px |
| Padding | 16px 32px |
| Font Size | 18px (`body-lg`) |
| Min Width | 120px |

### Size Reference Table

| Size | Height | Padding H | Padding V | Font Size | Touch Target |
|------|--------|-----------|-----------|-----------|--------------|
| `sm` | 32px | 16px | 8px | 14px | 44×44px* |
| `md` | 44px | 24px | 12px | 16px | 44×44px |
| `lg` | 52px | 32px | 16px | 18px | 52×52px |

*Small buttons should have additional padding/margin to meet 44px touch target.

---

## Button States

### Default State

The resting state of the button.

### Hover State (Desktop Only)

Triggered on mouse hover. Not applied on touch devices.

| Variant | Hover Change |
|---------|--------------|
| Primary | Background → `ocean-700` |
| Secondary | Background → `sand-200` |
| Ghost | Background → `ocean-50` |
| Destructive | Background → `error-600` |

```css
@media (hover: hover) {
  .button-primary:hover {
    background-color: var(--ocean-700);
  }
}
```

### Focus State

Visible keyboard focus indicator for accessibility.

| Property | Value |
|----------|-------|
| Outline | none |
| Box Shadow | `0 0 0 3px rgba(14, 116, 144, 0.4)` |

```css
.button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.4);
}
```

### Active/Pressed State

Visual feedback during click/tap.

| Property | Change |
|----------|--------|
| Transform | `scale(0.98)` |
| Transition | 100ms ease-out |

```css
.button:active {
  transform: scale(0.98);
}
```

### Disabled State

Non-interactive state.

| Property | Value |
|----------|-------|
| Background | `neutral-200` |
| Text Color | `neutral-400` |
| Cursor | `not-allowed` |
| Opacity | 1 (use color change, not opacity) |

```css
.button:disabled {
  background-color: var(--neutral-200);
  color: var(--neutral-400);
  cursor: not-allowed;
  box-shadow: none;
}
```

### Loading State

For async operations (e.g., copying to clipboard).

| Property | Value |
|----------|-------|
| Pointer Events | none |
| Spinner | Replaces icon or added left of text |
| Text | Can change to "Copying..." |

```css
.button-loading {
  pointer-events: none;
  position: relative;
}

.button-loading .spinner {
  animation: spin 1000ms linear infinite;
}
```

---

## Icon Buttons

Square buttons with only an icon, used in toolbars and quick actions.

### Icon Button Specifications

| Size | Dimensions | Icon Size | Touch Target |
|------|------------|-----------|--------------|
| `sm` | 32×32px | 16px | 44×44px* |
| `md` | 44×44px | 20px | 44×44px |
| `lg` | 52×52px | 24px | 52×52px |

*Small icon buttons need invisible padding to meet touch target.

### Icon Button Variants

| Variant | Background | Icon Color | Border |
|---------|------------|------------|--------|
| Primary | `ocean-600` | `white` | none |
| Secondary | `sand-100` | `ocean-600` | 1px `sand-300` |
| Ghost | transparent | `ocean-600` | none |
| Ghost Neutral | transparent | `neutral-600` | none |

### Implementation

```tsx
<button
  className="icon-button icon-button--ghost"
  aria-label="Copy Wi-Fi password"
>
  <CopyIcon className="w-5 h-5" />
</button>
```

### Accessibility Requirement

Icon buttons MUST have an `aria-label` describing the action:

```html
<!-- Correct -->
<button aria-label="Copy to clipboard">
  <svg>...</svg>
</button>

<!-- Incorrect - no accessible name -->
<button>
  <svg>...</svg>
</button>
```

---

## Button Groups

### Inline Button Group

Multiple buttons in a horizontal row.

```html
<div class="button-group" role="group" aria-label="Actions">
  <button class="button-secondary">Cancel</button>
  <button class="button-primary">Save</button>
</div>
```

| Property | Value |
|----------|-------|
| Gap | 12px (`space-3`) |
| Alignment | flex-end (right-aligned) |

### Stacked Button Group (Mobile)

Full-width stacked buttons for mobile CTAs.

```html
<div class="button-stack">
  <button class="button-primary w-full">Primary Action</button>
  <button class="button-ghost w-full">Secondary Action</button>
</div>
```

| Property | Value |
|----------|-------|
| Gap | 12px (`space-3`) |
| Button Width | 100% |

---

## Accessibility

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move focus to next button |
| `Shift+Tab` | Move focus to previous button |
| `Enter` | Activate button |
| `Space` | Activate button |

### Screen Reader Considerations

1. Use semantic `<button>` elements, not divs with click handlers
2. Include descriptive text or `aria-label`
3. Announce loading states with `aria-live`
4. Disabled buttons should have `aria-disabled="true"` for screen readers

```html
<!-- Loading state announcement -->
<button aria-busy="true" aria-live="polite">
  <span class="spinner" aria-hidden="true"></span>
  Copying...
</button>
```

### Color Contrast

| Combination | Ratio | Pass |
|-------------|-------|------|
| White on `ocean-600` | 5.2:1 | AA |
| `ocean-600` on `sand-100` | 5.0:1 | AA |
| White on `error-500` | 4.6:1 | AA |

---

## Usage Guidelines

### Do

- Use primary buttons for the main action on a screen
- Limit to one primary button per section
- Use verb-based labels ("Copy", "Save", "Submit")
- Ensure buttons are large enough for touch (44px minimum)
- Provide loading feedback for async actions

### Don't

- Don't use multiple primary buttons competing for attention
- Don't use vague labels ("Click here", "Submit")
- Don't disable buttons without explanation
- Don't use buttons for navigation (use links)
- Don't nest buttons inside other buttons

### Button vs Link

| Use Button | Use Link |
|------------|----------|
| Actions that change state | Navigation to another page |
| Submit forms | External URLs |
| Trigger modals/dialogs | Anchor links within page |
| Copy to clipboard | Download files (sometimes) |

---

## Implementation Examples

### React Component

```tsx
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const variants = {
  primary: 'bg-ocean-600 text-white hover:bg-ocean-700 shadow-sm',
  secondary: 'bg-sand-100 text-ocean-600 border border-sand-300 hover:bg-sand-200',
  ghost: 'bg-transparent text-ocean-600 hover:bg-ocean-50',
  destructive: 'bg-error-500 text-white hover:bg-error-600',
};

const sizes = {
  sm: 'h-8 px-4 text-sm min-w-16',
  md: 'h-11 px-6 text-base min-w-20',
  lg: 'h-13 px-8 text-lg min-w-30',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold',
        'transition-colors duration-150 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-600/40',
        'active:scale-[0.98] disabled:opacity-100 disabled:cursor-not-allowed',
        'disabled:bg-neutral-200 disabled:text-neutral-400',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
```

### Tailwind Classes

```html
<!-- Primary Button -->
<button class="h-11 px-6 bg-ocean-600 text-white font-semibold rounded-lg shadow-sm
               hover:bg-ocean-700 focus-visible:ring-2 focus-visible:ring-ocean-600/40
               active:scale-[0.98] transition-all duration-150">
  Copy Password
</button>

<!-- Secondary Button -->
<button class="h-11 px-6 bg-sand-100 text-ocean-600 font-semibold rounded-lg
               border border-sand-300 hover:bg-sand-200
               focus-visible:ring-2 focus-visible:ring-ocean-600/40">
  View Details
</button>

<!-- Icon Button -->
<button class="w-11 h-11 flex items-center justify-center rounded-lg
               text-ocean-600 hover:bg-ocean-50
               focus-visible:ring-2 focus-visible:ring-ocean-600/40"
        aria-label="Copy to clipboard">
  <svg class="w-5 h-5">...</svg>
</button>
```

---

## Related Documentation

- [Forms](forms.md) — Input components and form patterns
- [Color System](../tokens/colors.md) — Color tokens
- [Typography](../tokens/typography.md) — Font specifications
- [Animations](../tokens/animations.md) — Transition timings
