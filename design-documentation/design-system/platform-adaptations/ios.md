---
title: iOS Platform Adaptations
description: iOS-specific design guidelines for Safari and PWA
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ./android.md
  - ./web.md
  - ../style-guide.md
status: approved
---

# iOS Platform Adaptations

## Overview

iOS represents approximately 55% of expected Travelama users. These guidelines ensure the web experience feels native on iPhone and iPad.

---

## Safe Areas

### Notch & Dynamic Island

Account for device safe areas:

```css
.page {
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

.bottom-sheet,
.toast {
  padding-bottom: env(safe-area-inset-bottom);
}
```

### Home Indicator

Bottom-positioned elements need extra padding:

```css
.bottom-nav,
.bottom-sheet__content {
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}
```

---

## iOS Safari Specifics

### Viewport Configuration

Prevent zoom on input focus (use 16px+ font):

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```

**Important**: Don't set `user-scalable=no` as it harms accessibility.

### Input Styling

iOS Safari has specific input behaviors:

```css
/* Remove default iOS styling */
input, button, select, textarea {
  -webkit-appearance: none;
  border-radius: 0; /* iOS adds rounded corners */
}

/* Prevent zoom on focus */
input, select, textarea {
  font-size: 16px; /* Minimum to prevent zoom */
}
```

### Bounce Scroll

Control overscroll behavior:

```css
html {
  overscroll-behavior: none; /* Prevent pull-to-refresh in PWA */
}

.scroll-container {
  -webkit-overflow-scrolling: touch; /* Momentum scrolling */
}
```

### Position Fixed

Fixed positioning works in iOS Safari but has quirks:

```css
.fixed-element {
  position: fixed;
  /* Works well for headers and footers */
}

/* Avoid fixed positioning inside scrollable containers */
```

---

## Haptic Feedback

Provide haptic feedback for key interactions:

```javascript
// Light feedback for taps
const lightHaptic = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(10);
  }
};

// Medium feedback for copy actions
const mediumHaptic = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
};
```

### When to Use Haptics

| Interaction | Haptic Type |
|-------------|-------------|
| Copy to clipboard | Medium (50ms) |
| Toggle switch | Light (10ms) |
| Button press | None (system handles) |
| Error occurrence | None |

---

## VoiceOver Support

### Accessibility Labels

Ensure all elements have proper labels:

```html
<button aria-label="Copy Wi-Fi password">
  <svg aria-hidden="true">...</svg>
</button>
```

### Rotor Navigation

Structure content for rotor navigation:
- Use semantic headings (h1-h6)
- Mark landmarks (`<nav>`, `<main>`, etc.)
- Group related content with `<section aria-labelledby>`

### Gestures

VoiceOver users rely on:
- Single tap: Select element
- Double tap: Activate element
- Swipe left/right: Navigate elements
- Two-finger scrub: Go back

---

## PWA Considerations

### Add to Home Screen

Configure for iOS home screen:

```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Travelama">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
```

### Splash Screens

Provide appropriate splash screens:

```html
<link rel="apple-touch-startup-image" href="/splash/splash-1125x2436.png"
      media="(device-width: 375px) and (device-height: 812px)">
<!-- Add for all supported sizes -->
```

### Status Bar

```css
/* Account for status bar in standalone mode */
@media (display-mode: standalone) {
  .header {
    padding-top: calc(20px + env(safe-area-inset-top));
  }
}
```

---

## Dark Mode (Future)

Respect system dark mode preference:

```css
@media (prefers-color-scheme: dark) {
  /* Dark mode styles */
  :root {
    --background: #1a1a1a;
    --text-primary: #ffffff;
  }
}
```

---

## Performance

### 60fps Scrolling

```css
/* Hardware acceleration for smooth scrolling */
.scroll-container {
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}

/* Avoid repainting during scroll */
.fixed-header {
  will-change: transform;
}
```

### Image Optimization

iOS Safari supports WebP and AVIF:

```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>
```

---

## Common iOS Issues

### Issue: Input zoom on focus
**Solution**: Use 16px+ font size on inputs

### Issue: Fixed elements jump during scroll
**Solution**: Use transform instead of top/bottom for animations

### Issue: 300ms tap delay (old devices)
**Solution**: Modern iOS doesn't have this; ensure `touch-action` is set

### Issue: Overscroll rubber-banding
**Solution**: Use `overscroll-behavior: none` where needed

---

## Testing Checklist

- [ ] Test on iPhone SE (small screen)
- [ ] Test on iPhone 15 Pro (Dynamic Island)
- [ ] Test on iPad (larger viewport)
- [ ] Test VoiceOver navigation
- [ ] Test with system dark mode
- [ ] Test PWA from home screen
- [ ] Test landscape orientation
- [ ] Test with increased text size

---

## Related Documentation

- [Android Adaptations](android.md)
- [Web Adaptations](web.md)
- [Accessibility Guidelines](../../accessibility/guidelines.md)
