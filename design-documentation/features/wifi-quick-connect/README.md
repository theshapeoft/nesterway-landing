---
title: Wi-Fi Quick Connect — Feature Design Overview
description: Design specifications for the Wi-Fi connection experience (F2)
feature: wifi-quick-connect
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ../property-digital-manual/README.md
  - ../../design-system/components/forms.md
  - ../../design-system/components/modals.md
dependencies:
  - ../property-digital-manual/README.md
status: approved
---

# Wi-Fi Quick Connect (F2)

## Feature Overview

Wi-Fi Quick Connect enables guests to connect to the property's Wi-Fi network in under 10 seconds. It's the most requested feature by guests and the first action most take after scanning the QR code.

## User Story

**As a** guest who just arrived,
**I want to** connect to Wi-Fi in under 10 seconds,
**So that** I can get online without typing a complex password.

## Success Metrics

| Metric | Target |
|--------|--------|
| Time to Wi-Fi connection | < 10 seconds from first tap |
| Password copy rate | 70%+ of Wi-Fi modal views |
| QR auto-connect attempts | 50%+ of Wi-Fi modal views |
| Connection success rate | 95%+ |

## Design Priorities

### P0 — Critical
1. One-tap password copy with haptic feedback
2. Large, readable password display
3. QR code for auto-connect (iOS/Android)
4. Clear network name display

### P1 — Important
1. Visual confirmation of copy action
2. "Having trouble?" fallback instructions
3. Multiple network support

### P2 — Nice to Have
1. Network type indicator (5G vs 2.4G)
2. Connection speed indication
3. Remember last viewed network

---

## User Journey

### Primary Flow: Copy Password

```
User taps Wi-Fi in quick access
        ↓
Bottom sheet slides up (300ms)
        ↓
Network name + password displayed
        ↓
User taps copy button
        ↓
Haptic feedback + toast "Copied!"
        ↓
User opens device Wi-Fi settings
        ↓
Pastes password → Connected!
```

### Alternative Flow: QR Auto-Connect

```
User taps Wi-Fi in quick access
        ↓
Bottom sheet slides up
        ↓
User opens device camera
        ↓
Points at QR code in modal
        ↓
Device prompts "Join network?"
        ↓
User confirms → Connected!
```

---

## Screen Specifications

### Wi-Fi Quick Access Button

| Property | Value |
|----------|-------|
| Position | First item in quick access bar |
| Icon | Wifi (24px) |
| Label | "Wi-Fi" |
| Container | 80px min-width, 52px icon circle |
| Icon Color | `ocean-600` |
| Background | `ocean-50` |

### Wi-Fi Bottom Sheet

| Property | Value |
|----------|-------|
| Type | Bottom sheet modal |
| Max Height | 90vh |
| Background | White |
| Border Radius | 24px 24px 0 0 |
| Animation | Slide up, 300ms ease-out |

### Content Layout

```
┌─────────────────────────────────────┐
│  ────────                    [×]    │
│            Wi-Fi Connection         │
├─────────────────────────────────────┤
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
│  │         [QR CODE]           │    │
│  │                             │    │
│  │   Scan to connect           │    │
│  │   automatically             │    │
│  └─────────────────────────────┘    │
│                                      │
│  ▶ Having trouble connecting?       │
│                                      │
└─────────────────────────────────────┘
```

### Element Specifications

| Element | Specifications |
|---------|----------------|
| Handle | 40×4px, `neutral-300`, 8px from top |
| Title | 18px, semibold, centered |
| Close Button | 44×44px, top-right, `neutral-500` |
| Label | 12px, uppercase, `neutral-500`, 0.05em tracking |
| Network Name | 20px, semibold, `neutral-800` |
| Password Field | See below |
| QR Container | `sand-50` bg, 24px padding, 12px radius |
| QR Code | 160×160px, centered |
| QR Label | 12px, `neutral-500`, centered |
| Help Section | Collapsible details element |

### Password Copy Field

| Property | Value |
|----------|-------|
| Container | Flex row, `sand-100` bg, 1px `sand-300` border |
| Border Radius | 8px |
| Input | Monospace font, 18px, 0.05em letter-spacing |
| Input Padding | 12px 16px |
| Input State | Read-only, user-select: all |
| Copy Button | 44×44px, border-left separator |
| Copy Icon | 20px, `ocean-600` |

### Copy Feedback

| State | Visual |
|-------|--------|
| Default | Copy icon visible |
| Hover | Button bg `sand-200` |
| Success | Check icon, `success-500`, 200ms |
| Success Toast | "Password copied" at bottom |

---

## Interaction Specifications

### Open Modal

| Property | Value |
|----------|-------|
| Trigger | Tap Wi-Fi quick access button |
| Animation | Slide up from bottom |
| Duration | 300ms |
| Easing | ease-out |
| Backdrop | Fade in, rgba(0,0,0,0.5) |

### Close Modal

| Trigger | Animation |
|---------|-----------|
| Tap close button | Slide down + fade backdrop |
| Tap backdrop | Slide down + fade backdrop |
| Swipe down (>100px) | Slide down + fade backdrop |
| Press Escape key | Slide down + fade backdrop |

### Copy Password

```
User taps copy button
        ↓
JavaScript: navigator.clipboard.writeText(password)
        ↓
Haptic feedback (if supported)
        ↓
Copy icon changes to check (200ms)
        ↓
Toast appears at bottom
        ↓
After 3 seconds, toast fades out
        ↓
Check icon returns to copy icon
```

### Haptic Feedback

```javascript
if ('vibrate' in navigator) {
  navigator.vibrate(50); // Short pulse
}
```

---

## QR Code Specifications

### Format

Standard Wi-Fi QR code format:
```
WIFI:T:WPA;S:{network_name};P:{password};;
```

| Parameter | Description |
|-----------|-------------|
| T | Security type (WPA, WEP, nopass) |
| S | Network SSID |
| P | Password |
| H | Hidden network (optional, true/false) |

### QR Visual

| Property | Value |
|----------|-------|
| Size | 160×160px |
| Error Correction | M (15%) |
| Quiet Zone | 12px (4 modules) |
| Foreground | `neutral-900` |
| Background | White |
| Module Shape | Square (standard) |

### Generation

QR code is generated client-side using a library like `qrcode`:

```javascript
import QRCode from 'qrcode';

const wifiString = `WIFI:T:WPA;S:${networkName};P:${password};;`;
const qrDataUrl = await QRCode.toDataURL(wifiString, {
  width: 160,
  margin: 2,
  errorCorrectionLevel: 'M'
});
```

---

## Multiple Networks Support

When a property has multiple networks (e.g., 5GHz and 2.4GHz):

### Layout

```
┌─────────────────────────────────────┐
│            Wi-Fi Connection         │
├─────────────────────────────────────┤
│                                      │
│  ┌─────────────────────────────┐    │
│  │ PropertyWiFi_5G          [>]│    │  ← Currently selected
│  │ Recommended for streaming   │    │
│  └─────────────────────────────┘    │
│                                      │
│  ┌─────────────────────────────┐    │
│  │ PropertyWiFi_2G          [>]│    │  ← Alternative
│  │ Better range, slower speed  │    │
│  └─────────────────────────────┘    │
│                                      │
│  Selected: PropertyWiFi_5G          │
│                                      │
│  PASSWORD                            │
│  ┌─────────────────────────┬────┐   │
│  │ SecurePass123           │ 📋 │   │
│  └─────────────────────────┴────┘   │
│                                      │
└─────────────────────────────────────┘
```

### Network Card

| Property | Value |
|----------|-------|
| Container | Tappable, 1px border, 8px radius |
| Active State | 2px `ocean-600` border |
| Network Name | 16px, semibold |
| Description | 12px, `neutral-500` |
| Chevron | 16px, `neutral-400` |

---

## Troubleshooting Section

### Collapsed State

```
▶ Having trouble connecting?
```

### Expanded State

```
▼ Having trouble connecting?

1. Open your device's Wi-Fi settings
2. Look for "PropertyWiFi_5G" in the list
3. Tap to connect
4. Enter the password shown above
5. If it still doesn't work, try restarting Wi-Fi

Still having issues? Contact your host.
```

| Property | Value |
|----------|-------|
| Container | Collapsible details element |
| Summary | 14px, medium, `ocean-600` |
| Content | 14px, `neutral-600`, ordered list |
| Padding | 16px when expanded |

---

## Accessibility Requirements

### Screen Reader

- Modal has `role="dialog"` and `aria-modal="true"`
- Title is linked via `aria-labelledby`
- Password field has accessible label
- Copy button has `aria-label="Copy password to clipboard"`
- Success state announced via `aria-live="polite"`

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move between interactive elements |
| Enter | Activate copy button |
| Escape | Close modal |
| Space | Toggle help section |

### Focus Management

1. Focus moves to modal on open
2. Focus trapped within modal
3. Focus returns to trigger on close

---

## Error States

### Clipboard API Unavailable

```
┌─────────────────────────────────────┐
│  PASSWORD                            │
│  ┌─────────────────────────┐        │
│  │ SecurePass123           │        │
│  └─────────────────────────┘        │
│                                      │
│  ℹ️ Tap and hold to select password │
│     Then copy from your keyboard    │
└─────────────────────────────────────┘
```

### Copy Failed

Toast message: "Couldn't copy. Try selecting the password manually."

---

## Analytics Events

| Event | Data | Purpose |
|-------|------|---------|
| `wifi_modal_opened` | - | Track engagement |
| `wifi_password_copied` | network_name | Primary success |
| `wifi_qr_viewed` | - | Alternative method usage |
| `wifi_help_expanded` | - | Troubleshooting needs |
| `wifi_modal_closed` | time_open | Engagement depth |

---

## Implementation Notes

### Client-Side QR Generation

Generate QR codes client-side to avoid server round-trips:

```typescript
// Password should never be logged or sent to analytics
const generateWifiQR = async (ssid: string, password: string) => {
  const wifiString = `WIFI:T:WPA;S:${ssid};P:${password};;`;
  return await QRCode.toDataURL(wifiString);
};
```

### Clipboard API

```typescript
const copyPassword = async (password: string) => {
  try {
    await navigator.clipboard.writeText(password);
    return true;
  } catch (err) {
    // Fallback: Select the input text
    const input = document.querySelector('.password-input');
    input?.select();
    return false;
  }
};
```

### Haptic Feedback

```typescript
const haptic = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
};
```

---

## Related Documentation

- [Property Digital Manual](../property-digital-manual/README.md)
- [Forms Component](../../design-system/components/forms.md)
- [Modals Component](../../design-system/components/modals.md)
- [Animations](../../design-system/tokens/animations.md)
