---
title: Property Digital Manual — Screen States
description: All screen states and visual specifications for the property page
feature: property-digital-manual
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ./README.md
  - ./user-journey.md
  - ./interactions.md
status: approved
---

# Screen States — Property Digital Manual

## Page States Overview

| State | Description | Trigger |
|-------|-------------|---------|
| Loading | Skeleton placeholder | Initial page load |
| Default | Main content view | Load complete |
| Section Expanded | Accordion open | Section tap |
| Wi-Fi Modal Open | Bottom sheet visible | Wi-Fi icon tap |
| Password Copied | Toast notification | Copy button tap |
| Offline | Cached content | No network |
| Error | Error message | Load failure |

---

## State 1: Loading

Displayed during initial page load and data fetching.

### Visual Specifications

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐    │
│  │ ████████████████            │    │  ← Skeleton header
│  │ ████████████                │    │
│  └─────────────────────────────┘    │
│                                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐        │  ← Skeleton quick access
│  │░░░░│ │░░░░│ │░░░░│ │░░░░│        │
│  │░░░░│ │░░░░│ │░░░░│ │░░░░│        │
│  └────┘ └────┘ └────┘ └────┘        │
│                                      │
│  ┌─────────────────────────────┐    │
│  │ ░░░░░░░░░░ ████████████     │    │  ← Skeleton sections
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ ░░░░░░░░░░ ████████████     │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ ░░░░░░░░░░ ████████████     │    │
│  └─────────────────────────────┘    │
│                                      │
└─────────────────────────────────────┘
```

### Element Specifications

| Element | Style |
|---------|-------|
| Skeleton Background | `sand-200` with shimmer animation |
| Shimmer | 1.5s linear infinite |
| Title Skeleton | 60% width, 28px height |
| Subtitle Skeleton | 40% width, 20px height |
| Icon Skeleton | 52px circle |
| Text Line Skeleton | Various widths, 16px height |

### CSS

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--sand-200) 25%,
    var(--sand-100) 50%,
    var(--sand-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s linear infinite;
  border-radius: 4px;
}
```

### Duration

- Maximum display: 3 seconds
- If exceeds 3s, show minimal content with loading indicator
- Skeleton should never flash (minimum 200ms display)

---

## State 2: Default (Sections Collapsed)

Main content view with all sections in collapsed state.

### Visual Specifications

```
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │ [Photo] Welcome to               │ │
│ │         Sliema Sanctuary         │ │
│ │         Your host: Maria         │ │
│ │                                   │ │
│ │  Welcome! We're so happy to have │ │
│ │  you. Make yourself at home.     │ │
│ └─────────────────────────────────┘ │
│                                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐        │
│  │ 📶 │ │ 🕐 │ │ 📞 │ │ 🧭 │        │
│  │WiFi│ │Out │ │Emrg│ │Expl│        │
│  └────┘ └────┘ └────┘ └────┘        │
│  ─────────────────────────────────  │
│                                      │
│  ┌─────────────────────────────┐    │
│  │ 📋 House Rules            ▼ │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ 🔌 Appliances & How-Tos   ▼ │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ 🚪 Check-in / Check-out   ▼ │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ 🚗 Parking & Transport    ▼ │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ 🆘 Emergency Info         ▼ │    │
│  └─────────────────────────────┘    │
│                                      │
│  ┌─────────────────────────────┐    │
│  │  🧭 Explore Sliema    →     │    │ ← Coral gradient
│  │     Discover what's nearby   │    │
│  └─────────────────────────────┘    │
│                                      │
└─────────────────────────────────────┘
```

### Layout Specifications

| Section | Specifications |
|---------|----------------|
| Page Background | `sand-200` (#F5F0E8) |
| Header Section | `sand-50` bg, 24px padding, border-bottom |
| Host Photo | 56px circle, 2px white border, shadow |
| Property Title | 24px, bold, `neutral-800` |
| Host Name | 14px, `ocean-600` |
| Welcome Message | 16px, `neutral-600`, line-height 1.5 |
| Quick Access | White bg, 16px padding, gap 12px |
| Quick Access Item | 80px min-width, 52px icon circle |
| Section Accordion | `sand-50` bg, 12px padding, 12px radius |
| Section Gap | 12px between accordions |
| Explore CTA | Coral gradient, 16px radius, 20px padding |
| Page Padding | 16px horizontal |

### Responsive Behavior

**Mobile (320-639px)**
- Single column
- Quick access horizontal scroll if needed
- Full-width sections

**Tablet+ (640px+)**
- Centered content, max-width 640px
- Quick access fits without scroll
- Increased spacing (24px gaps)

---

## State 3: Section Expanded

One or more accordion sections in open state.

### Visual Specifications

```
┌─────────────────────────────────────┐
│                                      │
│  ┌─────────────────────────────┐    │
│  │ 📋 House Rules            ▲ │    │  ← Active state
│  ├─────────────────────────────┤    │
│  │                             │    │
│  │  • No smoking inside        │    │
│  │  • Quiet hours: 10pm - 8am  │    │
│  │  • Maximum 4 guests         │    │
│  │  • No parties or events     │    │
│  │  • Pets welcome (fee applies)│   │
│  │  • Please separate recycling │   │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                      │
│  ┌─────────────────────────────┐    │
│  │ 🔌 Appliances & How-Tos   ▼ │    │
│  └─────────────────────────────┘    │
│                                      │
└─────────────────────────────────────┘
```

### Expanded Section Specifications

| Element | Style |
|---------|-------|
| Header Background | `ocean-50` (active indication) |
| Chevron | Rotated 180° |
| Divider | 1px `sand-300` below header |
| Content Padding | 16px |
| Content Background | White |
| List Style | Bullet points, `neutral-600` |
| List Item Gap | 12px |

### Animation

```css
.accordion__content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 300ms ease-in-out;
}

.accordion--open .accordion__content {
  grid-template-rows: 1fr;
}

.accordion__chevron {
  transition: transform 300ms ease-in-out;
}

.accordion--open .accordion__chevron {
  transform: rotate(180deg);
}
```

---

## State 4: Wi-Fi Modal Open

Bottom sheet displaying Wi-Fi connection details.

### Visual Specifications

```
┌─────────────────────────────────────┐
│                                      │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │ ← Backdrop 50% black
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
├─────────────────────────────────────┤
│  ────────                    [×]    │ ← Handle + close
│            Wi-Fi Connection         │
│  ─────────────────────────────────  │
│                                      │
│  NETWORK NAME                        │
│  PropertyWiFi_5G                     │
│                                      │
│  PASSWORD                            │
│  ┌─────────────────────────┬────┐   │
│  │ SecurePass123           │ 📋 │   │
│  └─────────────────────────┴────┘   │
│                                      │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │      ▓▓▓▓▓▓▓▓▓▓▓▓         │    │
│  │      ▓▓▓▓▓▓▓▓▓▓▓▓         │    │ ← QR Code
│  │      ▓▓▓▓▓▓▓▓▓▓▓▓         │    │
│  │      ▓▓▓▓▓▓▓▓▓▓▓▓         │    │
│  │                             │    │
│  │  Scan to connect automatically  │
│  └─────────────────────────────┘    │
│                                      │
│  ▶ Having trouble connecting?       │
│                                      │
└─────────────────────────────────────┘
```

### Modal Specifications

| Element | Style |
|---------|-------|
| Backdrop | `rgba(0,0,0,0.5)`, full screen |
| Sheet Background | White |
| Sheet Border Radius | 24px 24px 0 0 |
| Handle | 40px × 4px, `neutral-300`, centered |
| Title | 18px, semibold, centered |
| Close Button | 44px touch target, top-right |
| Label | 12px, uppercase, `neutral-500` |
| Network Name | 20px, semibold, `neutral-800` |
| Password Field | Monospace, 18px, copy button |
| QR Container | `sand-50` bg, 24px padding, 12px radius |
| QR Size | 160px × 160px |
| QR Hint | 12px, `neutral-500`, centered |

### Animation

```css
/* Entry */
.bottom-sheet {
  transform: translateY(100%);
  transition: transform 300ms ease-out;
}

.bottom-sheet--open {
  transform: translateY(0);
}

/* Backdrop */
.backdrop {
  opacity: 0;
  transition: opacity 300ms ease-out;
}

.backdrop--open {
  opacity: 1;
}
```

---

## State 5: Password Copied

Toast notification confirming clipboard action.

### Visual Specifications

```
┌─────────────────────────────────────┐
│                                      │
│            [Page Content]            │
│                                      │
│                                      │
│                                      │
│                                      │
│                                      │
│                                      │
│                                      │
│  ┌─────────────────────────────┐    │
│  │ ✓ Password copied           │    │ ← Toast
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### Toast Specifications

| Element | Style |
|---------|-------|
| Position | Fixed, bottom 16px, centered |
| Background | `neutral-800` |
| Text Color | White |
| Left Border | 4px `success-500` |
| Padding | 12px 16px |
| Border Radius | 8px |
| Shadow | `0 4px 12px rgba(0,0,0,0.15)` |
| Icon | ✓ checkmark, `success-400` |
| Duration | 3 seconds, then auto-dismiss |

### Animation

```css
@keyframes toastIn {
  from {
    transform: translateX(-50%) translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

@keyframes toastOut {
  from {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
  to {
    transform: translateX(-50%) translateY(20px);
    opacity: 0;
  }
}
```

---

## State 6: Offline Mode

Cached content displayed when network unavailable.

### Visual Specifications

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐    │
│  │  ☁️ You're offline           │    │ ← Subtle banner
│  │  Showing saved information   │    │
│  └─────────────────────────────┘    │
│                                      │
│  [Normal page content...]            │
│                                      │
│  [Images may show placeholders]     │
│                                      │
└─────────────────────────────────────┘
```

### Offline Specifications

| Element | Style |
|---------|-------|
| Banner Background | `warning-50` |
| Banner Border | 1px `warning-200` |
| Banner Text | 14px, `warning-700` |
| Banner Icon | Cloud-off, `warning-500` |
| Banner Position | Sticky top, below any header |
| Image Placeholders | `sand-200` with icon |

### Cached Content

- Wi-Fi credentials ✓
- House rules ✓
- Emergency contacts ✓
- Check-in/out times ✓
- Property notes ✓
- Images × (placeholder shown)
- Area guide × (link disabled)

---

## State 7: Error State

Displayed when page fails to load.

### Visual Specifications

```
┌─────────────────────────────────────┐
│                                      │
│                                      │
│          ┌─────────┐                │
│          │   ⚠️    │                │
│          └─────────┘                │
│                                      │
│        Something went wrong          │
│                                      │
│   We couldn't load this property.    │
│   Please check your connection       │
│   and try again.                     │
│                                      │
│        ┌─────────────────┐          │
│        │    Try Again    │          │
│        └─────────────────┘          │
│                                      │
│   ─────────────────────────────     │
│                                      │
│   Need help? Contact the host:       │
│   📧 host@example.com               │
│   📞 +356 1234 5678                 │
│                                      │
└─────────────────────────────────────┘
```

### Error Specifications

| Element | Style |
|---------|-------|
| Icon | 48px, `warning-500` |
| Title | 24px, semibold, `neutral-800` |
| Message | 16px, `neutral-600`, centered |
| Retry Button | Primary button, full width |
| Divider | 1px `sand-300` |
| Contact Section | 14px, `neutral-600` |
| Contact Links | `ocean-600`, tappable |

---

## Responsive States Summary

### Mobile (320-639px)

| Element | Adaptation |
|---------|------------|
| Page title | 24px (reduced from 28px) |
| Quick access | Horizontal scroll if 5+ items |
| Section padding | 12px |
| Modal | Full-width bottom sheet |

### Tablet+ (640px+)

| Element | Adaptation |
|---------|------------|
| Page title | 28-36px |
| Content max-width | 640px, centered |
| Quick access | Always fits, no scroll |
| Section padding | 16px |
| Modal | Bottom sheet or centered dialog |

---

## Related Documentation

- [User Journey](user-journey.md) — Flow context
- [Interactions](interactions.md) — Animation specifications
- [Accessibility](accessibility.md) — A11y requirements
