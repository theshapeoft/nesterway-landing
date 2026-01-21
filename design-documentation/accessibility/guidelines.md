---
title: Accessibility Guidelines
description: Comprehensive accessibility standards and implementation requirements for Travelama
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ./testing.md
  - ./compliance.md
  - ../design-system/style-guide.md
status: approved
---

# Accessibility Guidelines

## Table of Contents

1. [Standards & Targets](#standards--targets)
2. [Visual Accessibility](#visual-accessibility)
3. [Motor Accessibility](#motor-accessibility)
4. [Cognitive Accessibility](#cognitive-accessibility)
5. [Screen Reader Support](#screen-reader-support)
6. [Keyboard Navigation](#keyboard-navigation)
7. [Motion & Animation](#motion--animation)
8. [Forms & Inputs](#forms--inputs)
9. [Error Handling](#error-handling)
10. [Testing Checklist](#testing-checklist)

---

## Standards & Targets

### WCAG Compliance

| Level | Target | Notes |
|-------|--------|-------|
| A | Required | All success criteria must pass |
| AA | Required | Primary compliance target |
| AAA | Encouraged | For critical interactions |

### Browser & Device Support

| Platform | Requirement |
|----------|-------------|
| iOS Safari | Last 3 versions + VoiceOver |
| Android Chrome | Last 3 versions + TalkBack |
| Desktop Chrome | Last 2 versions |
| Desktop Firefox | Last 2 versions |
| Desktop Safari | Last 2 versions |

---

## Visual Accessibility

### Color Contrast

**Minimum Ratios (WCAG AA)**

| Context | Minimum Ratio | Example |
|---------|---------------|---------|
| Normal text (< 18px) | 4.5:1 | Body copy |
| Large text (≥ 18px or 14px bold) | 3:1 | Headings |
| UI components | 3:1 | Buttons, icons |
| Focus indicators | 3:1 | Focus rings |

**Verified Color Combinations**

| Foreground | Background | Ratio | Pass |
|------------|------------|-------|------|
| `ocean-600` (#0E7490) | `sand-50` (#FEFDFB) | 5.2:1 | AA |
| `neutral-800` (#262626) | `sand-50` (#FEFDFB) | 14.5:1 | AAA |
| `neutral-600` (#525252) | `sand-100` (#FBF8F3) | 5.9:1 | AA |
| `white` (#FFFFFF) | `ocean-600` (#0E7490) | 5.2:1 | AA |
| `coral-500` (#F97316) | `sand-50` (#FEFDFB) | 3.1:1 | Large only |

### Color Independence

Never rely on color alone to convey meaning:

**Do:**
- Use icons alongside colored indicators
- Pair color with text labels
- Use patterns or shapes for distinction

**Don't:**
- Use red/green alone for success/error
- Indicate required fields only with color
- Use color as the only link indicator

### Text Sizing

| Requirement | Implementation |
|-------------|----------------|
| Base size | 16px minimum (prevents iOS zoom) |
| Scalable units | Use rem/em, not fixed px |
| Browser zoom | Support up to 200% |
| Reflow | Content reflows without horizontal scroll at 320px |

### Focus Indicators

All interactive elements must have visible focus:

```css
/* Focus ring specification */
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.4);
}

/* Never remove focus entirely */
:focus {
  /* Use :focus-visible for keyboard only */
}
```

| Element | Focus Style |
|---------|-------------|
| Buttons | 3px ocean-600 ring |
| Links | 3px ocean-600 ring |
| Inputs | 2px ocean-600 border + shadow |
| Cards | 3px ocean-600 ring |

---

## Motor Accessibility

### Touch Targets

**Minimum Size: 44×44px**

All interactive elements must have a minimum touch target of 44×44px, even if the visual element is smaller.

```css
/* Icon button with proper touch target */
.icon-button {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-button svg {
  width: 20px;
  height: 20px;
}
```

### Touch Target Spacing

| Requirement | Value |
|-------------|-------|
| Minimum spacing between targets | 8px |
| Recommended spacing | 12px |

### Gesture Alternatives

Every gesture must have a tap alternative:

| Gesture | Alternative |
|---------|-------------|
| Swipe to dismiss modal | Tap close button or backdrop |
| Pull to refresh | Refresh button |
| Pinch to zoom | Zoom controls (if applicable) |

### Single Pointer Operation

All functionality must be operable with a single pointer:
- No multi-touch requirements
- No path-dependent gestures
- Drag operations have button alternatives

---

## Cognitive Accessibility

### Information Architecture

- **2-tap maximum** to any information
- **Clear headings** in logical hierarchy
- **Consistent navigation** across pages
- **Predictable patterns** throughout

### Language & Content

| Guideline | Implementation |
|-----------|----------------|
| Reading level | 8th grade or below |
| Sentence length | 20 words average |
| Jargon | Avoided or explained |
| Instructions | Clear, step-by-step |

### Error Prevention

- Confirm destructive actions
- Provide undo where possible
- Validate input in real-time
- Show clear error messages

### Time & Timeouts

- No time limits on core functionality
- Auto-dismiss toasts: minimum 3 seconds
- Session timeouts: warning before expiry
- Allow extended time for complex tasks

---

## Screen Reader Support

### Semantic HTML

Use semantic elements for structure:

```html
<!-- Correct -->
<nav aria-label="Main navigation">...</nav>
<main id="main-content">...</main>
<section aria-labelledby="rules-heading">
  <h2 id="rules-heading">House Rules</h2>
</section>

<!-- Incorrect -->
<div class="nav">...</div>
<div class="main">...</div>
<div class="section">
  <div class="heading">House Rules</div>
</div>
```

### ARIA Landmarks

| Landmark | Usage |
|----------|-------|
| `<header>` / `banner` | Page header |
| `<nav>` / `navigation` | Navigation menus |
| `<main>` / `main` | Primary content |
| `<aside>` / `complementary` | Related content |
| `<footer>` / `contentinfo` | Page footer |

### ARIA Labels

**Required for:**
- Icon-only buttons: `aria-label="Close"`
- Form fields without visible labels
- Images conveying meaning: descriptive `alt`
- Regions needing identification: `aria-labelledby`

**Avoid:**
- Redundant labels (button text is sufficient)
- Labels that duplicate visible text
- Using ARIA when HTML semantics suffice

### Live Regions

For dynamic content updates:

```html
<!-- Toast notifications -->
<div role="status" aria-live="polite">
  Password copied to clipboard
</div>

<!-- Error alerts -->
<div role="alert" aria-live="assertive">
  Connection failed. Please try again.
</div>
```

| Politeness | Usage |
|------------|-------|
| `polite` | Non-urgent updates (toasts, status) |
| `assertive` | Important alerts, errors |

### Headings

Maintain logical heading hierarchy:

```html
<h1>Sliema Sanctuary</h1>
  <h2>Wi-Fi & Essentials</h2>
  <h2>House Rules</h2>
    <h3>Quiet Hours</h3>
    <h3>Smoking Policy</h3>
  <h2>Check-in / Check-out</h2>
```

**Rules:**
- Single h1 per page
- Never skip levels (h1 → h3)
- Headings describe content that follows

---

## Keyboard Navigation

### Tab Order

Follow visual reading order (top-to-bottom, left-to-right in LTR):

1. Skip link
2. Navigation
3. Main content (in logical order)
4. Footer

### Focus Management

| Scenario | Focus Behavior |
|----------|----------------|
| Page load | Focus on skip link or first heading |
| Modal open | Focus on modal (first focusable or title) |
| Modal close | Focus returns to trigger element |
| Accordion expand | Focus remains on trigger |
| Toast appear | No focus change (announced via live region) |

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Move to next focusable element |
| `Shift+Tab` | Move to previous focusable element |
| `Enter` | Activate buttons, links |
| `Space` | Activate buttons, toggle checkboxes |
| `Escape` | Close modals, cancel operations |
| `Arrow Keys` | Navigate within components (tabs, menus) |

### Skip Links

Provide skip link for keyboard users:

```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<main id="main-content" tabindex="-1">
  ...
</main>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px 16px;
  background: var(--ocean-600);
  color: white;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

---

## Motion & Animation

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
    scroll-behavior: auto !important;
  }
}
```

### Safe Animation Guidelines

| Guideline | Implementation |
|-----------|----------------|
| Duration | < 500ms for most animations |
| Distance | < 100px movement |
| Flashing | Never flash more than 3 times/second |
| Parallax | Avoid or make optional |
| Auto-play | No auto-playing video/audio |

---

## Forms & Inputs

### Labels

Every input must have an associated label:

```html
<!-- Explicit association -->
<label for="wifi-password">Wi-Fi Password</label>
<input type="text" id="wifi-password" />

<!-- Or implicit -->
<label>
  Wi-Fi Password
  <input type="text" />
</label>
```

### Required Fields

```html
<label for="email">
  Email
  <span aria-hidden="true">*</span>
</label>
<input
  type="email"
  id="email"
  required
  aria-required="true"
/>
```

### Error States

```html
<label for="email">Email</label>
<input
  type="email"
  id="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">
  Please enter a valid email address
</span>
```

### Autocomplete

Use appropriate autocomplete attributes:

```html
<input type="email" autocomplete="email" />
<input type="tel" autocomplete="tel" />
<input type="text" autocomplete="name" />
```

---

## Error Handling

### Error Messages

| Requirement | Implementation |
|-------------|----------------|
| Visibility | Near the error source |
| Clarity | Explain what went wrong |
| Actionable | Tell user how to fix |
| Announced | Use `role="alert"` |

### Error Prevention

- Validate in real-time where possible
- Confirm before destructive actions
- Provide clear constraints before input
- Allow recovery from errors

---

## Testing Checklist

### Automated Testing

- [ ] Run axe-core on all pages
- [ ] Check color contrast with WebAIM
- [ ] Validate HTML semantics
- [ ] Test with Lighthouse accessibility audit

### Manual Testing

- [ ] Navigate entire site with keyboard only
- [ ] Test with VoiceOver (iOS Safari)
- [ ] Test with TalkBack (Android Chrome)
- [ ] Test with NVDA (Windows Chrome)
- [ ] Test at 200% zoom
- [ ] Test with reduced motion enabled
- [ ] Test on real devices, not just emulators

### User Testing

- [ ] Include users with disabilities in testing
- [ ] Test with actual assistive technology users
- [ ] Gather feedback on cognitive accessibility
- [ ] Test in realistic contexts (varied lighting, etc.)

---

## Related Documentation

- [Testing Procedures](testing.md)
- [WCAG Compliance](compliance.md)
- [Style Guide](../design-system/style-guide.md)
- [Color System](../design-system/tokens/colors.md)
