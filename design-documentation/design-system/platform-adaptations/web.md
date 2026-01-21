---
title: Web Platform Adaptations
description: Desktop web-specific design guidelines
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ./ios.md
  - ./android.md
  - ../style-guide.md
status: approved
---

# Web Platform Adaptations

## Overview

While Travelama is mobile-first, approximately 5% of users access via desktop browsers. This may increase for hosts managing their properties.

---

## Progressive Enhancement

### Core Content First

Ensure content works without JavaScript:

```html
<!-- Content visible without JS -->
<section class="wifi-section">
  <h2>Wi-Fi</h2>
  <p>Network: PropertyWiFi_5G</p>
  <p>Password: SecurePass123</p>
</section>

<!-- Enhanced with JS -->
<script>
  // Add copy button, QR code, etc.
</script>
```

### CSS Feature Queries

```css
/* Base styles work everywhere */
.grid {
  display: block;
}

/* Enhanced for modern browsers */
@supports (display: grid) {
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}
```

---

## Desktop-Specific Enhancements

### Hover States

Add hover effects for desktop:

```css
@media (hover: hover) {
  .button:hover {
    background-color: var(--ocean-700);
  }

  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .link:hover {
    text-decoration: underline;
  }
}
```

### Pointer Precision

Desktop users have more precise pointing devices:

```css
@media (pointer: fine) {
  /* Can use smaller touch targets on desktop */
  .small-button {
    min-height: 32px;
    min-width: 32px;
  }
}

@media (pointer: coarse) {
  /* Maintain large targets for touch */
  .small-button {
    min-height: 44px;
    min-width: 44px;
  }
}
```

### Cursor Styles

Use appropriate cursors:

```css
.button { cursor: pointer; }
.disabled { cursor: not-allowed; }
.draggable { cursor: grab; }
.dragging { cursor: grabbing; }
.text-selectable { cursor: text; }
.loading { cursor: wait; }
```

---

## Keyboard Navigation

### Full Keyboard Support

All functionality must be keyboard accessible:

| Key | Action |
|-----|--------|
| `Tab` | Navigate forward |
| `Shift+Tab` | Navigate backward |
| `Enter` | Activate buttons/links |
| `Space` | Activate buttons, scroll |
| `Escape` | Close modals, cancel |
| `Arrow keys` | Navigate within components |

### Skip Links

```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<nav>...</nav>

<main id="main-content" tabindex="-1">
  ...
</main>
```

### Focus Management

```javascript
// Focus modal on open
function openModal(modal) {
  const firstFocusable = modal.querySelector(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  firstFocusable?.focus();
}

// Return focus on close
function closeModal(modal, trigger) {
  modal.hidden = true;
  trigger?.focus();
}
```

---

## Responsive Breakpoints

### Desktop Layout Adjustments

```css
/* Mobile-first base */
.container {
  max-width: 100%;
  padding: 16px;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
    margin: 0 auto;
    padding: 24px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
    padding: 32px;
  }
}

/* Wide */
@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}
```

### Multi-Column Layouts

```css
/* Cards grid */
.card-grid {
  display: grid;
  gap: 16px;
}

@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## Browser Support

### Target Browsers

| Browser | Versions |
|---------|----------|
| Chrome | Last 2 |
| Firefox | Last 2 |
| Safari | Last 2 |
| Edge | Last 2 |

### CSS Fallbacks

```css
/* Fallback for older browsers */
.container {
  max-width: 1200px;
}

/* Modern browsers */
@supports (max-width: min(1200px, 90vw)) {
  .container {
    max-width: min(1200px, 90vw);
  }
}
```

### JavaScript Feature Detection

```javascript
// Check clipboard API
const hasClipboard = 'clipboard' in navigator;

// Check for intersection observer
const hasIntersectionObserver = 'IntersectionObserver' in window;

// Provide fallbacks when features are missing
```

---

## Print Styles

For hosts who may print property information:

```css
@media print {
  /* Hide interactive elements */
  .button,
  .modal,
  .navigation {
    display: none;
  }

  /* Ensure readability */
  body {
    font-size: 12pt;
    color: black;
    background: white;
  }

  /* Show URLs for links */
  a[href]::after {
    content: " (" attr(href) ")";
  }

  /* Avoid page breaks in cards */
  .card {
    page-break-inside: avoid;
  }
}
```

---

## Performance

### Resource Loading

```html
<!-- Preconnect to external resources -->
<link rel="preconnect" href="https://fonts.googleapis.com">

<!-- Preload critical resources -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>

<!-- Defer non-critical JS -->
<script src="/app.js" defer></script>
```

### Lazy Loading

```html
<!-- Native lazy loading for images -->
<img src="image.jpg" loading="lazy" alt="Description">

<!-- Intersection Observer for custom lazy loading -->
```

### Core Web Vitals

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |

---

## Screen Reader Testing

Test with major screen readers:

| Screen Reader | Browser |
|---------------|---------|
| NVDA | Chrome/Firefox (Windows) |
| JAWS | Chrome (Windows) |
| VoiceOver | Safari (macOS) |
| Narrator | Edge (Windows) |

---

## Common Desktop Issues

### Issue: Content too wide on large screens
**Solution**: Use max-width containers

### Issue: Tiny text on high-DPI displays
**Solution**: Use relative units, test at various zoom levels

### Issue: Elements too small to click
**Solution**: Use pointer queries for context-aware sizing

### Issue: Focus not visible
**Solution**: Never remove focus styles, use `:focus-visible`

---

## Testing Checklist

- [ ] Test in Chrome, Firefox, Safari
- [ ] Test keyboard-only navigation
- [ ] Test with NVDA or VoiceOver
- [ ] Test at 400%, 200%, 100%, 50% zoom
- [ ] Test at 1920×1080, 1366×768, 1024×768
- [ ] Test print preview
- [ ] Test with JavaScript disabled
- [ ] Test with slow network (throttled)
- [ ] Test Core Web Vitals

---

## Related Documentation

- [iOS Adaptations](ios.md)
- [Android Adaptations](android.md)
- [Accessibility Guidelines](../../accessibility/guidelines.md)
