---
title: Form Components
description: Specifications for inputs, select, checkbox, toggle, and specialized form elements
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ./buttons.md
  - ../tokens/colors.md
  - ../tokens/typography.md
status: approved
---

# Form Components

## Overview

Form components in Travelama are primarily used in the host management interface (future) and for interactive elements like the Wi-Fi password copy field. Guest-facing forms are minimal — no login required.

## Table of Contents

1. [Text Input](#text-input)
2. [Copy Field](#copy-field)
3. [Wi-Fi Display](#wifi-display)
4. [Select/Dropdown](#selectdropdown)
5. [Checkbox](#checkbox)
6. [Toggle Switch](#toggle-switch)
7. [Form Field Layout](#form-field-layout)
8. [Validation States](#validation-states)
9. [Accessibility](#accessibility)

---

## Text Input

Standard text input for forms.

### Base Specifications

| Property | Value |
|----------|-------|
| Height | 44px (meets touch target) |
| Padding | 12px 16px |
| Background | `white` or `sand-50` |
| Border | 1px solid `sand-300` |
| Border Radius | 8px (`rounded`) |
| Font Size | 16px (`body`) — prevents iOS zoom |
| Font Color | `neutral-700` |
| Placeholder Color | `neutral-400` |

### States

**Default**
```css
.input {
  height: 44px;
  padding: 12px 16px;
  background: white;
  border: 1px solid var(--sand-300);
  border-radius: 8px;
  font-size: 16px;
  color: var(--neutral-700);
  transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
}
```

**Focus**
```css
.input:focus {
  outline: none;
  border-color: var(--ocean-600);
  box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.15);
}
```

**Disabled**
```css
.input:disabled {
  background: var(--neutral-100);
  color: var(--neutral-400);
  cursor: not-allowed;
}
```

**Error**
```css
.input--error {
  border-color: var(--error-500);
}

.input--error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}
```

### Input Types

| Type | Usage |
|------|-------|
| `text` | General text input |
| `email` | Email addresses (future host login) |
| `password` | Password fields |
| `tel` | Phone numbers |
| `url` | Website URLs |
| `search` | Search fields |

---

## Copy Field

A read-only input with a copy button, used for Wi-Fi passwords and codes.

### Specifications

| Property | Value |
|----------|-------|
| Height | 44px |
| Background | `sand-100` |
| Border | 1px solid `sand-300` |
| Border Radius | 8px |
| Font Family | Monospace (`JetBrains Mono`) |
| Font Size | 18px (larger for readability) |
| Letter Spacing | 0.05em |
| User Select | all (easy selection) |

### Structure

```html
<div class="copy-field">
  <input
    type="text"
    value="MyWiFiPassword123"
    readonly
    class="copy-field__input"
    aria-describedby="copy-hint"
  />
  <button
    class="copy-field__button"
    aria-label="Copy to clipboard"
  >
    <CopyIcon />
  </button>
  <span id="copy-hint" class="sr-only">
    Click the copy button or select all text to copy
  </span>
</div>
```

### Visual Specifications

```css
.copy-field {
  display: flex;
  align-items: center;
  background: var(--sand-100);
  border: 1px solid var(--sand-300);
  border-radius: 8px;
  overflow: hidden;
}

.copy-field__input {
  flex: 1;
  height: 44px;
  padding: 12px 16px;
  background: transparent;
  border: none;
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  letter-spacing: 0.05em;
  color: var(--neutral-800);
  user-select: all;
}

.copy-field__button {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-left: 1px solid var(--sand-300);
  color: var(--ocean-600);
  cursor: pointer;
  transition: background 150ms ease-out;
}

.copy-field__button:hover {
  background: var(--sand-200);
}
```

### Copy Feedback

After successful copy, show visual feedback:

```css
.copy-field__button--success {
  color: var(--success-500);
}

.copy-field__button--success svg {
  animation: copySuccess 200ms ease-out;
}

@keyframes copySuccess {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
```

---

## Wi-Fi Display

A specialized component showing Wi-Fi network name, password, and QR code.

### Structure

```html
<div class="wifi-display">
  <div class="wifi-display__header">
    <WifiIcon class="wifi-display__icon" />
    <span class="wifi-display__label">Wi-Fi</span>
  </div>

  <div class="wifi-display__network">
    <span class="wifi-display__network-label">Network</span>
    <span class="wifi-display__network-name">PropertyWiFi_5G</span>
  </div>

  <div class="wifi-display__password">
    <span class="wifi-display__password-label">Password</span>
    <div class="copy-field">
      <input value="SecurePass123" readonly />
      <button aria-label="Copy password">
        <CopyIcon />
      </button>
    </div>
  </div>

  <div class="wifi-display__qr">
    <div class="wifi-display__qr-code">
      <!-- QR Code SVG -->
    </div>
    <span class="wifi-display__qr-label">
      Scan to connect
    </span>
  </div>

  <details class="wifi-display__help">
    <summary>Having trouble?</summary>
    <ol>
      <li>Open your phone's Wi-Fi settings</li>
      <li>Select "PropertyWiFi_5G"</li>
      <li>Enter the password above</li>
    </ol>
  </details>
</div>
```

### Visual Specifications

| Element | Style |
|---------|-------|
| Container | `sand-50` background, 16px padding, 12px radius |
| Header Icon | 24px, `ocean-600` |
| Network Name | 18px, semibold, `neutral-800` |
| Password Field | Monospace, 18px, copy button |
| QR Code | 120×120px, centered |
| QR Label | 12px caption, `neutral-500` |
| Help Section | Collapsible, 14px body text |

### QR Code Format

Wi-Fi QR codes use the standard format:
```
WIFI:T:WPA;S:{network_name};P:{password};;
```

---

## Select/Dropdown

Native select element for accessibility and mobile compatibility.

### Specifications

| Property | Value |
|----------|-------|
| Height | 44px |
| Padding | 12px 40px 12px 16px |
| Background | white with arrow icon |
| Border | 1px solid `sand-300` |
| Border Radius | 8px |
| Font Size | 16px |

### Implementation

```css
.select {
  appearance: none;
  height: 44px;
  padding: 12px 40px 12px 16px;
  background-color: white;
  background-image: url("data:image/svg+xml,..."); /* Chevron icon */
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;
  border: 1px solid var(--sand-300);
  border-radius: 8px;
  font-size: 16px;
  color: var(--neutral-700);
  cursor: pointer;
}

.select:focus {
  outline: none;
  border-color: var(--ocean-600);
  box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.15);
}
```

---

## Checkbox

Standard checkbox for boolean selections.

### Specifications

| Property | Value |
|----------|-------|
| Size | 20×20px (visual), 44×44px (touch target) |
| Border | 2px solid `sand-400` |
| Border Radius | 4px |
| Check Color | `ocean-600` |
| Checked Background | `ocean-600` |

### Implementation

```html
<label class="checkbox">
  <input type="checkbox" class="checkbox__input" />
  <span class="checkbox__indicator">
    <CheckIcon class="checkbox__check" />
  </span>
  <span class="checkbox__label">Accept house rules</span>
</label>
```

```css
.checkbox {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  min-height: 44px; /* Touch target */
}

.checkbox__input {
  position: absolute;
  opacity: 0;
  width: 44px;
  height: 44px;
  cursor: pointer;
}

.checkbox__indicator {
  width: 20px;
  height: 20px;
  border: 2px solid var(--sand-400);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms ease-out;
}

.checkbox__check {
  width: 14px;
  height: 14px;
  color: white;
  opacity: 0;
  transform: scale(0.8);
  transition: all 100ms ease-out;
}

.checkbox__input:checked + .checkbox__indicator {
  background: var(--ocean-600);
  border-color: var(--ocean-600);
}

.checkbox__input:checked + .checkbox__indicator .checkbox__check {
  opacity: 1;
  transform: scale(1);
}

.checkbox__input:focus-visible + .checkbox__indicator {
  box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.4);
}
```

---

## Toggle Switch

For on/off settings, more visual than checkbox.

### Specifications

| Property | Value |
|----------|-------|
| Track Width | 44px |
| Track Height | 24px |
| Thumb Size | 20px |
| Off Background | `neutral-300` |
| On Background | `ocean-600` |
| Thumb Color | white |

### Implementation

```html
<label class="toggle">
  <input type="checkbox" class="toggle__input" role="switch" />
  <span class="toggle__track">
    <span class="toggle__thumb"></span>
  </span>
  <span class="toggle__label">Enable notifications</span>
</label>
```

```css
.toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.toggle__input {
  position: absolute;
  opacity: 0;
}

.toggle__track {
  width: 44px;
  height: 24px;
  background: var(--neutral-300);
  border-radius: 12px;
  position: relative;
  transition: background 150ms ease-out;
}

.toggle__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 150ms ease-out;
}

.toggle__input:checked + .toggle__track {
  background: var(--ocean-600);
}

.toggle__input:checked + .toggle__track .toggle__thumb {
  transform: translateX(20px);
}

.toggle__input:focus-visible + .toggle__track {
  box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.4);
}
```

---

## Form Field Layout

Standard layout for form fields with labels.

### Structure

```html
<div class="form-field">
  <label for="wifi-name" class="form-field__label">
    Network Name
  </label>
  <input
    type="text"
    id="wifi-name"
    class="form-field__input"
    placeholder="Enter network name"
  />
  <span class="form-field__hint">
    The name guests will see when connecting
  </span>
</div>
```

### Specifications

| Element | Style |
|---------|-------|
| Label | 12px, medium weight, uppercase, 0.05em tracking |
| Gap (label to input) | 8px |
| Hint | 12px, `neutral-500`, margin-top 4px |
| Error Message | 12px, `error-600`, margin-top 4px |

```css
.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field__label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--neutral-600);
}

.form-field__hint {
  font-size: 12px;
  color: var(--neutral-500);
  margin-top: -4px; /* Bring closer to input */
}

.form-field__error {
  font-size: 12px;
  color: var(--error-600);
  display: flex;
  align-items: center;
  gap: 4px;
}
```

---

## Validation States

### Error State

```html
<div class="form-field form-field--error">
  <label for="email">Email</label>
  <input
    type="email"
    id="email"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <span id="email-error" class="form-field__error" role="alert">
    <AlertIcon aria-hidden="true" />
    Please enter a valid email address
  </span>
</div>
```

### Success State

```html
<div class="form-field form-field--success">
  <label for="email">Email</label>
  <input
    type="email"
    id="email"
    aria-describedby="email-success"
  />
  <span id="email-success" class="form-field__success">
    <CheckIcon aria-hidden="true" />
    Email verified
  </span>
</div>
```

---

## Accessibility

### Labels

- Every input must have an associated `<label>`
- Use `for` attribute matching input `id`
- Required fields should indicate with `aria-required="true"`

### Error Messages

- Use `aria-describedby` to link input to error message
- Use `aria-invalid="true"` on invalid inputs
- Error messages should have `role="alert"` for screen reader announcement

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move between form fields |
| `Space` | Toggle checkbox/switch |
| `Arrow Up/Down` | Navigate select options |
| `Enter` | Submit form (when in input) |

### Focus Management

- Focus should move to first error field on validation failure
- Clear focus indicators on all interactive elements
- Don't trap focus inside form fields

---

## Related Documentation

- [Buttons](buttons.md) — Button components for form submission
- [Color System](../tokens/colors.md) — Color tokens for states
- [Typography](../tokens/typography.md) — Font specifications
