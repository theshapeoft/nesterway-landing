---
title: Modal Components
description: Specifications for bottom sheets, dialogs, toasts, and overlay patterns
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ./buttons.md
  - ../tokens/animations.md
  - ../tokens/colors.md
status: approved
---

# Modal Components

## Overview

Modal components display content that requires user attention or action. In Travelama, they're primarily used for Wi-Fi details, confirmation messages, and detailed information views.

## Table of Contents

1. [Bottom Sheet](#bottom-sheet)
2. [Dialog Modal](#dialog-modal)
3. [Toast Notification](#toast-notification)
4. [Wi-Fi Modal](#wifi-modal)
5. [Backdrop Overlay](#backdrop-overlay)
6. [Accessibility](#accessibility)

---

## Bottom Sheet

Mobile-friendly modal that slides up from the bottom of the screen.

### Use Cases
- Wi-Fi connection details
- Property info expanded view
- Share options
- Quick actions menu

### Structure

```html
<div class="bottom-sheet-backdrop" aria-hidden="true"></div>
<div
  class="bottom-sheet"
  role="dialog"
  aria-modal="true"
  aria-labelledby="sheet-title"
>
  <div class="bottom-sheet__header">
    <div class="bottom-sheet__handle"></div>
    <h2 id="sheet-title" class="bottom-sheet__title">Wi-Fi Connection</h2>
    <button class="bottom-sheet__close" aria-label="Close">
      <XIcon />
    </button>
  </div>
  <div class="bottom-sheet__content">
    <!-- Content here -->
  </div>
</div>
```

### Specifications

| Element | Style |
|---------|-------|
| Container | White bg, top corners rounded 24px |
| Max Height | 90vh |
| Handle | 40px × 4px, `neutral-300`, centered |
| Header | 60px height, border-bottom |
| Title | 18px, semibold, centered |
| Close Button | 44×44px, top-right |
| Content | Scrollable, 16px padding |

### CSS

```css
.bottom-sheet-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 300ms ease-out;
  z-index: 40;
}

.bottom-sheet-backdrop[data-open="true"] {
  opacity: 1;
}

.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 90vh;
  background: white;
  border-radius: 24px 24px 0 0;
  transform: translateY(100%);
  transition: transform 300ms ease-out;
  z-index: 50;
  display: flex;
  flex-direction: column;
}

.bottom-sheet[data-open="true"] {
  transform: translateY(0);
}

.bottom-sheet__header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  border-bottom: 1px solid var(--sand-300);
  flex-shrink: 0;
}

.bottom-sheet__handle {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 4px;
  background: var(--neutral-300);
  border-radius: 2px;
}

.bottom-sheet__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--neutral-800);
  margin: 0;
}

.bottom-sheet__close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--neutral-500);
  cursor: pointer;
  border-radius: 8px;
}

.bottom-sheet__close:hover {
  background: var(--neutral-100);
}

.bottom-sheet__close:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.4);
}

.bottom-sheet__content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}
```

### Animation

```css
@keyframes slideUpSheet {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes slideDownSheet {
  from { transform: translateY(0); }
  to { transform: translateY(100%); }
}

.bottom-sheet--entering {
  animation: slideUpSheet 300ms ease-out forwards;
}

.bottom-sheet--exiting {
  animation: slideDownSheet 250ms ease-in forwards;
}
```

### Gesture Support

For a native feel, implement drag-to-dismiss:
- Drag down > 100px dismisses the sheet
- Velocity-based dismissal (fast swipe)
- Snap back if not dismissed

---

## Dialog Modal

Centered modal for confirmations and important information.

### Use Cases
- Confirmation dialogs
- Error messages
- Important notices
- Simple forms

### Structure

```html
<div class="dialog-backdrop" aria-hidden="true"></div>
<div
  class="dialog"
  role="alertdialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-desc"
>
  <div class="dialog__content">
    <div class="dialog__icon dialog__icon--success">
      <CheckCircleIcon />
    </div>
    <h2 id="dialog-title" class="dialog__title">
      Password Copied
    </h2>
    <p id="dialog-desc" class="dialog__description">
      The Wi-Fi password has been copied to your clipboard.
    </p>
    <div class="dialog__actions">
      <button class="button-primary">Done</button>
    </div>
  </div>
</div>
```

### Specifications

| Element | Style |
|---------|-------|
| Backdrop | 50% black, blur optional |
| Container | White, 16px radius, max-width 400px |
| Padding | 24px |
| Icon | 48px, semantic color |
| Title | 20px, semibold, centered |
| Description | 16px, `neutral-600`, centered |
| Actions | Flex row, gap 12px, full-width buttons |

### CSS

```css
.dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  opacity: 0;
  transition: opacity 200ms ease-out;
  z-index: 40;
}

.dialog-backdrop[data-open="true"] {
  opacity: 1;
}

.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.95);
  width: calc(100% - 32px);
  max-width: 400px;
  background: white;
  border-radius: 16px;
  opacity: 0;
  transition: all 200ms ease-out;
  z-index: 50;
}

.dialog[data-open="true"] {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}

.dialog__content {
  padding: 24px;
  text-align: center;
}

.dialog__icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.dialog__icon--success {
  background: var(--success-50);
  color: var(--success-500);
}

.dialog__icon--error {
  background: var(--error-50);
  color: var(--error-500);
}

.dialog__icon--warning {
  background: var(--warning-50);
  color: var(--warning-500);
}

.dialog__icon--info {
  background: var(--info-50);
  color: var(--info-500);
}

.dialog__title {
  font-size: 20px;
  font-weight: 600;
  color: var(--neutral-800);
  margin: 0 0 8px;
}

.dialog__description {
  font-size: 16px;
  color: var(--neutral-600);
  margin: 0 0 24px;
  line-height: 1.5;
}

.dialog__actions {
  display: flex;
  gap: 12px;
}

.dialog__actions .button {
  flex: 1;
}
```

---

## Toast Notification

Brief, non-blocking feedback message.

### Use Cases
- "Copied to clipboard"
- "Saved successfully"
- Error notifications
- Status updates

### Structure

```html
<div
  class="toast toast--success"
  role="status"
  aria-live="polite"
>
  <CheckCircleIcon class="toast__icon" />
  <span class="toast__message">Password copied to clipboard</span>
  <button class="toast__dismiss" aria-label="Dismiss">
    <XIcon />
  </button>
</div>
```

### Specifications

| Element | Style |
|---------|-------|
| Position | Fixed, bottom center, 16px from edge |
| Container | Dark bg (`neutral-800`), white text |
| Border Radius | 8px |
| Padding | 12px 16px |
| Min Width | 280px |
| Max Width | calc(100% - 32px) |
| Duration | 3-5 seconds auto-dismiss |

### Variants

| Variant | Icon Color | Left Border |
|---------|------------|-------------|
| Success | `success-400` | 4px `success-500` |
| Error | `error-400` | 4px `error-500` |
| Warning | `warning-400` | 4px `warning-500` |
| Info | `info-400` | 4px `info-500` |
| Neutral | `neutral-400` | none |

### CSS

```css
.toast {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 280px;
  max-width: calc(100% - 32px);
  padding: 12px 16px;
  background: var(--neutral-800);
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transition: all 300ms ease-out;
  z-index: 60;
}

.toast[data-visible="true"] {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

/* Account for safe area on mobile */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .toast {
    bottom: calc(16px + env(safe-area-inset-bottom));
  }
}

.toast--success {
  border-left: 4px solid var(--success-500);
}

.toast--error {
  border-left: 4px solid var(--error-500);
}

.toast--warning {
  border-left: 4px solid var(--warning-500);
}

.toast--info {
  border-left: 4px solid var(--info-500);
}

.toast__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.toast--success .toast__icon { color: var(--success-400); }
.toast--error .toast__icon { color: var(--error-400); }
.toast--warning .toast__icon { color: var(--warning-400); }
.toast--info .toast__icon { color: var(--info-400); }

.toast__message {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
}

.toast__dismiss {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--neutral-400);
  cursor: pointer;
  border-radius: 4px;
  flex-shrink: 0;
}

.toast__dismiss:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}
```

### Animation

```css
@keyframes toastIn {
  from {
    transform: translateX(-50%) translateY(100px);
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
    transform: translateX(-50%) translateY(100px);
    opacity: 0;
  }
}

.toast--entering {
  animation: toastIn 300ms ease-out forwards;
}

.toast--exiting {
  animation: toastOut 200ms ease-in forwards;
}
```

---

## Wi-Fi Modal

Specialized bottom sheet for Wi-Fi details.

### Structure

```html
<div class="bottom-sheet" role="dialog" aria-labelledby="wifi-title">
  <div class="bottom-sheet__header">
    <div class="bottom-sheet__handle"></div>
    <h2 id="wifi-title" class="bottom-sheet__title">Wi-Fi Connection</h2>
    <button class="bottom-sheet__close" aria-label="Close">
      <XIcon />
    </button>
  </div>
  <div class="bottom-sheet__content">
    <div class="wifi-modal">
      <!-- Network Name -->
      <div class="wifi-modal__field">
        <label class="wifi-modal__label">Network Name</label>
        <div class="wifi-modal__value">PropertyWiFi_5G</div>
      </div>

      <!-- Password with Copy -->
      <div class="wifi-modal__field">
        <label class="wifi-modal__label">Password</label>
        <div class="copy-field">
          <input value="SecurePass123" readonly />
          <button aria-label="Copy password">
            <CopyIcon />
          </button>
        </div>
      </div>

      <!-- QR Code -->
      <div class="wifi-modal__qr">
        <div class="wifi-modal__qr-code">
          <!-- QR Code SVG -->
        </div>
        <p class="wifi-modal__qr-hint">
          Point your camera at the QR code to connect automatically
        </p>
      </div>

      <!-- Help Section -->
      <details class="wifi-modal__help">
        <summary>Having trouble connecting?</summary>
        <ol>
          <li>Open your Wi-Fi settings</li>
          <li>Select "PropertyWiFi_5G"</li>
          <li>Enter the password above</li>
          <li>If issues persist, try restarting your device</li>
        </ol>
      </details>
    </div>
  </div>
</div>
```

### Specifications

| Element | Style |
|---------|-------|
| Network Name | 20px, semibold, `neutral-800` |
| Password Field | Monospace, 18px, copy button |
| QR Code | 160×160px, centered |
| QR Hint | 12px, `neutral-500`, centered |
| Help | Collapsible details, 14px |

### CSS

```css
.wifi-modal {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.wifi-modal__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wifi-modal__label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--neutral-500);
}

.wifi-modal__value {
  font-size: 20px;
  font-weight: 600;
  color: var(--neutral-800);
}

.wifi-modal__qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background: var(--sand-50);
  border-radius: 12px;
}

.wifi-modal__qr-code {
  width: 160px;
  height: 160px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  margin-bottom: 12px;
}

.wifi-modal__qr-code svg {
  width: 100%;
  height: 100%;
}

.wifi-modal__qr-hint {
  font-size: 12px;
  color: var(--neutral-500);
  text-align: center;
  margin: 0;
}

.wifi-modal__help {
  padding: 16px;
  background: var(--sand-50);
  border-radius: 12px;
}

.wifi-modal__help summary {
  font-size: 14px;
  font-weight: 500;
  color: var(--ocean-600);
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.wifi-modal__help summary::before {
  content: '+';
  font-size: 18px;
}

.wifi-modal__help[open] summary::before {
  content: '−';
}

.wifi-modal__help ol {
  margin: 12px 0 0;
  padding-left: 20px;
  font-size: 14px;
  color: var(--neutral-600);
  line-height: 1.6;
}
```

---

## Backdrop Overlay

Shared backdrop component for modals.

### Specifications

| Property | Value |
|----------|-------|
| Background | `rgba(0, 0, 0, 0.5)` |
| Blur | Optional 2-4px backdrop-filter |
| z-index | 40 (below modal at 50) |
| Click Action | Closes modal |

### CSS

```css
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;
}

.backdrop--blur {
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}
```

---

## Accessibility

### Focus Management

1. **Focus trap**: Tab should cycle within modal
2. **Initial focus**: First focusable element or close button
3. **Return focus**: Return to trigger element on close

```javascript
// Focus trap implementation concept
function trapFocus(modal) {
  const focusable = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Escape` | Close modal |
| `Tab` | Move focus forward |
| `Shift+Tab` | Move focus backward |
| `Enter` | Activate focused element |

### ARIA Requirements

- `role="dialog"` or `role="alertdialog"`
- `aria-modal="true"`
- `aria-labelledby` pointing to title
- `aria-describedby` pointing to description (optional)
- Backdrop should have `aria-hidden="true"`

### Screen Reader Announcements

- Modal open: Title is read automatically
- Toast: Use `role="status"` with `aria-live="polite"`
- Errors: Use `role="alert"` for immediate announcement

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .bottom-sheet,
  .dialog,
  .toast {
    transition: opacity 0.01ms;
  }

  .bottom-sheet[data-open="true"] {
    transform: translateY(0);
  }
}
```

---

## Related Documentation

- [Buttons](buttons.md) — Button components for actions
- [Forms](forms.md) — Form elements for inputs
- [Animations](../tokens/animations.md) — Animation specifications
