---
title: Android Platform Adaptations
description: Android-specific design guidelines for Chrome and PWA
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ./ios.md
  - ./web.md
  - ../style-guide.md
status: approved
---

# Android Platform Adaptations

## Overview

Android represents approximately 40% of expected Travelama users. These guidelines ensure the web experience works well across the diverse Android ecosystem.

---

## Device Considerations

### Screen Sizes

Android has a huge variety of screen sizes:

| Category | Width Range | Design Approach |
|----------|-------------|-----------------|
| Small | 320-360px | Compact layouts, scrolling |
| Medium | 360-400px | Standard mobile layouts |
| Large | 400-480px | Comfortable spacing |
| Tablet | 600px+ | Multi-column possible |

### Screen Cutouts

Handle notches and punch-hole cameras:

```css
.page {
  padding-top: env(safe-area-inset-top, 0);
  padding-left: env(safe-area-inset-left, 0);
  padding-right: env(safe-area-inset-right, 0);
}
```

### Display Modes

Account for different navigation styles:
- **3-button navigation**: Traditional back, home, recents
- **2-button navigation**: Pill home button + back
- **Gesture navigation**: Full-screen with gesture areas

---

## Chrome Specifics

### Address Bar Behavior

Chrome's address bar can hide on scroll:

```css
/* Account for variable viewport height */
.full-height {
  height: 100dvh; /* Dynamic viewport height */
}

/* Fallback for older browsers */
@supports not (height: 100dvh) {
  .full-height {
    height: 100vh;
  }
}
```

### Pull to Refresh

Control Chrome's pull-to-refresh:

```css
/* Disable on specific containers */
.scroll-container {
  overscroll-behavior-y: contain;
}

/* Completely disable (not recommended) */
html {
  overscroll-behavior: none;
}
```

### Theme Color

Set browser theme color:

```html
<meta name="theme-color" content="#0E7490">

<!-- Different for dark mode -->
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#0E7490">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#164E63">
```

---

## Material Design Alignment

While Travelama has its own design system, align with Material where it aids familiarity:

### Elevation & Shadows

```css
/* Similar to Material elevation levels */
.elevation-1 { box-shadow: 0 1px 3px rgba(0,0,0,0.12); }
.elevation-2 { box-shadow: 0 3px 6px rgba(0,0,0,0.15); }
.elevation-3 { box-shadow: 0 10px 20px rgba(0,0,0,0.15); }
```

### Touch Feedback

Provide ripple-like feedback on tap:

```css
.touchable {
  position: relative;
  overflow: hidden;
}

.touchable::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  transition: transform 0.3s, opacity 0.3s;
}

.touchable:active::after {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  transition: 0s;
}
```

---

## Back Button Behavior

Android's hardware/gesture back button should work correctly:

```javascript
// Handle back button for modals
window.addEventListener('popstate', (event) => {
  if (modalIsOpen) {
    closeModal();
    // Push state back to prevent navigation
    history.pushState(null, '', location.href);
  }
});

// When opening modal, push state
function openModal() {
  history.pushState({ modal: true }, '', location.href);
  // ... open modal
}
```

---

## TalkBack Support

### Content Descriptions

Ensure all interactive elements are announced properly:

```html
<button aria-label="Copy Wi-Fi password to clipboard">
  <svg aria-hidden="true">...</svg>
</button>
```

### Reading Order

TalkBack reads in DOM order, so ensure visual order matches:

```css
/* Avoid using CSS to reorder elements visually */
/* If needed, use order property carefully */
.flex-container {
  display: flex;
}

/* This changes visual order but TalkBack reads DOM order */
.visual-first {
  order: -1; /* Caution: accessibility issue */
}
```

### Live Regions

Announce dynamic content:

```html
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  Password copied to clipboard
</div>
```

---

## PWA Configuration

### Web App Manifest

```json
{
  "name": "Travelama",
  "short_name": "Travelama",
  "description": "Digital property guide",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F5F0E8",
  "theme_color": "#0E7490",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Install Prompt

Handle the app install banner:

```javascript
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Show custom install button if desired
});

async function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
  }
}
```

---

## Performance

### Viewport Optimization

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

### Touch Responsiveness

Remove touch delay:

```css
* {
  touch-action: manipulation;
}
```

### Hardware Acceleration

```css
.animated-element {
  transform: translateZ(0);
  will-change: transform;
}
```

---

## Font Considerations

### System Fonts

Use Roboto-compatible fallbacks:

```css
font-family: 'Inter', Roboto, 'Noto Sans', 'Segoe UI', sans-serif;
```

### Font Scaling

Android allows system-wide font scaling:

```css
/* Use relative units */
font-size: 1rem; /* Respects system settings */

/* Test at 200% font scale */
```

---

## Common Android Issues

### Issue: Keyboard pushes content up
**Solution**: Use `visual-viewport` API or CSS `interactive-widget`

### Issue: Different browser behaviors (Samsung Browser, etc.)
**Solution**: Test on Chrome, but verify on Samsung Internet

### Issue: Slow tap response on older devices
**Solution**: Ensure `touch-action: manipulation` is set

### Issue: Address bar covering fixed elements
**Solution**: Use `dvh` units and test with address bar hidden

---

## Testing Checklist

- [ ] Test on small screen (Galaxy A series)
- [ ] Test on medium screen (Pixel)
- [ ] Test on large screen (Samsung S series)
- [ ] Test TalkBack navigation
- [ ] Test with system dark mode
- [ ] Test with increased font size (200%)
- [ ] Test gesture navigation back
- [ ] Test 3-button navigation back
- [ ] Test PWA from home screen
- [ ] Test in Samsung Internet browser
- [ ] Test offline functionality

---

## Related Documentation

- [iOS Adaptations](ios.md)
- [Web Adaptations](web.md)
- [Accessibility Guidelines](../../accessibility/guidelines.md)
