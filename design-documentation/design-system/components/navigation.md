---
title: Navigation Components
description: Specifications for headers, quick access bar, breadcrumbs, back button, and tabs
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ./buttons.md
  - ../tokens/colors.md
  - ../tokens/spacing.md
status: approved
---

# Navigation Components

## Overview

Navigation components help users understand where they are and move through the Travelama application. They're designed for mobile-first interaction with clear visual hierarchy.

## Table of Contents

1. [Page Header](#page-header)
2. [Property Header](#property-header)
3. [Quick Access Bar](#quick-access-bar)
4. [Back Button](#back-button)
5. [Breadcrumbs](#breadcrumbs)
6. [Tab Navigation](#tab-navigation)
7. [Bottom Navigation](#bottom-navigation)
8. [Explore CTA](#explore-cta)
9. [Accessibility](#accessibility)

---

## Page Header

Standard header for content pages (Area, Country).

### Structure

```html
<header class="page-header">
  <nav class="page-header__nav" aria-label="Page navigation">
    <a href="/malta" class="page-header__back">
      <ChevronLeftIcon />
      <span>Malta</span>
    </a>
  </nav>
  <div class="page-header__hero">
    <img
      src="..."
      alt="Sliema waterfront at sunset"
      class="page-header__image"
    />
    <div class="page-header__overlay"></div>
    <div class="page-header__content">
      <h1 class="page-header__title">Sliema</h1>
      <p class="page-header__subtitle">Malta's modern waterfront town</p>
    </div>
  </div>
</header>
```

### Specifications

| Element | Style |
|---------|-------|
| Hero Height | 240px (mobile), 320px (tablet+) |
| Image | Object-fit cover, full width |
| Overlay | Linear gradient, bottom 60% |
| Back Link | White text, positioned top-left |
| Title | 36px, bold, white |
| Subtitle | 18px, white, 80% opacity |

### CSS

```css
.page-header {
  position: relative;
}

.page-header__nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 16px;
  z-index: 10;
}

.page-header__back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.page-header__back:hover {
  text-decoration: underline;
}

.page-header__hero {
  position: relative;
  height: 240px;
  overflow: hidden;
}

@media (min-width: 768px) {
  .page-header__hero {
    height: 320px;
  }
}

.page-header__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.page-header__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.2) 50%,
    transparent 100%
  );
}

.page-header__content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 16px;
  color: white;
}

.page-header__title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 4px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.page-header__subtitle {
  font-size: 18px;
  margin: 0;
  opacity: 0.9;
}
```

---

## Property Header

Header for property pages with host welcome.

### Structure

```html
<header class="property-header">
  <div class="property-header__welcome">
    <img
      src="..."
      alt="Photo of Maria"
      class="property-header__host-image"
    />
    <div class="property-header__text">
      <h1 class="property-header__title">Welcome to Sliema Sanctuary</h1>
      <p class="property-header__host">Your host: Maria</p>
    </div>
  </div>
  <p class="property-header__message">
    Welcome! We're so happy to have you. Make yourself at home.
  </p>
</header>
```

### Specifications

| Element | Style |
|---------|-------|
| Container | `sand-50` background, 24px padding |
| Host Image | 56px circle, object-fit cover |
| Title | 24px, bold |
| Host Name | 14px, `ocean-600` |
| Welcome Message | 16px, `neutral-600` |

### CSS

```css
.property-header {
  background: var(--sand-50);
  padding: 24px 16px;
  border-bottom: 1px solid var(--sand-300);
}

.property-header__welcome {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.property-header__host-image {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.property-header__text {
  flex: 1;
}

.property-header__title {
  font-size: 24px;
  font-weight: 700;
  color: var(--neutral-800);
  margin: 0 0 4px;
}

.property-header__host {
  font-size: 14px;
  color: var(--ocean-600);
  margin: 0;
}

.property-header__message {
  font-size: 16px;
  color: var(--neutral-600);
  margin: 0;
  line-height: 1.5;
}
```

---

## Quick Access Bar

Horizontal scrollable bar of quick action buttons.

### Structure

```html
<nav class="quick-access" aria-label="Quick access">
  <ul class="quick-access__list">
    <li>
      <button class="quick-access__item" aria-label="View Wi-Fi details">
        <div class="quick-access__icon">
          <WifiIcon />
        </div>
        <span class="quick-access__label">Wi-Fi</span>
      </button>
    </li>
    <li>
      <button class="quick-access__item">
        <div class="quick-access__icon">
          <ClockIcon />
        </div>
        <span class="quick-access__label">Check-out</span>
      </button>
    </li>
    <li>
      <button class="quick-access__item">
        <div class="quick-access__icon">
          <PhoneIcon />
        </div>
        <span class="quick-access__label">Emergency</span>
      </button>
    </li>
    <li>
      <a href="/malta/sliema" class="quick-access__item">
        <div class="quick-access__icon quick-access__icon--accent">
          <CompassIcon />
        </div>
        <span class="quick-access__label">Explore</span>
      </a>
    </li>
  </ul>
</nav>
```

### Specifications

| Element | Style |
|---------|-------|
| Container | Horizontal scroll, hide scrollbar |
| List | Flex row, 12px gap |
| Item | 80px width, vertical layout |
| Icon | 28px, in 52px circle |
| Label | 12px, medium weight |

### CSS

```css
.quick-access {
  padding: 16px 0;
  border-bottom: 1px solid var(--sand-300);
  background: white;
}

.quick-access__list {
  display: flex;
  gap: 12px;
  padding: 0 16px;
  margin: 0;
  list-style: none;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.quick-access__list::-webkit-scrollbar {
  display: none;
}

.quick-access__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  min-width: 80px;
  background: var(--sand-50);
  border: 1px solid var(--sand-300);
  border-radius: 16px;
  cursor: pointer;
  text-decoration: none;
  scroll-snap-align: start;
  transition: all 150ms ease-out;
}

.quick-access__item:hover {
  background: var(--ocean-50);
  border-color: var(--ocean-300);
}

.quick-access__item:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.4);
}

.quick-access__icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ocean-50);
  border-radius: 50%;
  color: var(--ocean-600);
}

.quick-access__icon--accent {
  background: var(--coral-500);
  color: white;
}

.quick-access__label {
  font-size: 12px;
  font-weight: 500;
  color: var(--neutral-700);
  white-space: nowrap;
}
```

---

## Back Button

Simple back navigation for internal pages.

### Structure

```html
<a href="/malta/sliema" class="back-button">
  <ChevronLeftIcon />
  <span>Back to Sliema</span>
</a>
```

### Specifications

| Property | Value |
|----------|-------|
| Height | 44px (touch target) |
| Padding | 0 16px |
| Font Size | 14px |
| Color | `ocean-600` |

### CSS

```css
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 44px;
  padding: 0 16px;
  margin-left: -16px; /* Align text with content */
  color: var(--ocean-600);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  border-radius: 8px;
  transition: background 150ms ease-out;
}

.back-button:hover {
  background: var(--ocean-50);
}

.back-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.4);
}

.back-button svg {
  width: 20px;
  height: 20px;
}
```

---

## Breadcrumbs

For showing page hierarchy on larger screens.

### Structure

```html
<nav class="breadcrumbs" aria-label="Breadcrumb">
  <ol class="breadcrumbs__list">
    <li class="breadcrumbs__item">
      <a href="/malta">Malta</a>
    </li>
    <li class="breadcrumbs__item">
      <a href="/malta/sliema">Sliema</a>
    </li>
    <li class="breadcrumbs__item" aria-current="page">
      Food & Drink
    </li>
  </ol>
</nav>
```

### Specifications

| Element | Style |
|---------|-------|
| Container | Hidden on mobile, visible on tablet+ |
| Separator | `/` character, `neutral-400` |
| Links | 14px, `ocean-600` |
| Current | 14px, `neutral-600`, no link |

### CSS

```css
.breadcrumbs {
  display: none;
  padding: 16px 0;
}

@media (min-width: 768px) {
  .breadcrumbs {
    display: block;
  }
}

.breadcrumbs__list {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 14px;
}

.breadcrumbs__item:not(:last-child)::after {
  content: '/';
  margin-left: 8px;
  color: var(--neutral-400);
}

.breadcrumbs__item a {
  color: var(--ocean-600);
  text-decoration: none;
}

.breadcrumbs__item a:hover {
  text-decoration: underline;
}

.breadcrumbs__item[aria-current="page"] {
  color: var(--neutral-600);
}
```

---

## Tab Navigation

For switching between content sections.

### Structure

```html
<nav class="tabs" aria-label="Categories">
  <ul class="tabs__list" role="tablist">
    <li role="presentation">
      <button
        role="tab"
        aria-selected="true"
        aria-controls="food-panel"
        class="tabs__tab tabs__tab--active"
      >
        Food & Drink
      </button>
    </li>
    <li role="presentation">
      <button
        role="tab"
        aria-selected="false"
        aria-controls="activities-panel"
        class="tabs__tab"
      >
        Activities
      </button>
    </li>
    <li role="presentation">
      <button
        role="tab"
        aria-selected="false"
        aria-controls="beaches-panel"
        class="tabs__tab"
      >
        Beaches
      </button>
    </li>
  </ul>
</nav>
```

### Specifications

| Element | Style |
|---------|-------|
| Container | Horizontal scroll on mobile |
| Tab | 44px height, 16px horizontal padding |
| Active | `ocean-600` text, bottom border |
| Inactive | `neutral-500` text |

### CSS

```css
.tabs {
  border-bottom: 1px solid var(--sand-300);
  background: white;
}

.tabs__list {
  display: flex;
  margin: 0;
  padding: 0 16px;
  list-style: none;
  overflow-x: auto;
  scrollbar-width: none;
}

.tabs__list::-webkit-scrollbar {
  display: none;
}

.tabs__tab {
  height: 44px;
  padding: 0 16px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 14px;
  font-weight: 500;
  color: var(--neutral-500);
  cursor: pointer;
  white-space: nowrap;
  transition: all 150ms ease-out;
}

.tabs__tab:hover {
  color: var(--ocean-600);
}

.tabs__tab:focus-visible {
  outline: none;
  background: var(--ocean-50);
}

.tabs__tab--active {
  color: var(--ocean-600);
  border-bottom-color: var(--ocean-600);
}
```

---

## Bottom Navigation

Fixed bottom nav for key actions (future feature).

### Structure

```html
<nav class="bottom-nav" aria-label="Main navigation">
  <a href="/stay/sliema-sanctuary" class="bottom-nav__item bottom-nav__item--active">
    <HomeIcon />
    <span>Property</span>
  </a>
  <a href="/malta/sliema" class="bottom-nav__item">
    <CompassIcon />
    <span>Explore</span>
  </a>
</nav>
```

### Specifications

| Element | Style |
|---------|-------|
| Container | Fixed bottom, safe-area padding |
| Height | 64px + safe area |
| Item | Vertical layout, equal width |
| Active | `ocean-600` color |
| Inactive | `neutral-500` color |

### CSS

```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  height: 64px;
  padding-bottom: env(safe-area-inset-bottom);
  background: white;
  border-top: 1px solid var(--sand-300);
  z-index: 50;
}

.bottom-nav__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--neutral-500);
  text-decoration: none;
  font-size: 12px;
}

.bottom-nav__item svg {
  width: 24px;
  height: 24px;
}

.bottom-nav__item--active {
  color: var(--ocean-600);
}
```

---

## Explore CTA

Call-to-action linking from property to area guide.

### Structure

```html
<a href="/malta/sliema" class="explore-cta">
  <div class="explore-cta__content">
    <span class="explore-cta__label">Discover what's nearby</span>
    <span class="explore-cta__title">Explore Sliema</span>
  </div>
  <div class="explore-cta__icon">
    <CompassIcon />
    <ChevronRightIcon />
  </div>
</a>
```

### Specifications

| Element | Style |
|---------|-------|
| Container | `coral-500` gradient, 16px radius |
| Label | 14px, white, 80% opacity |
| Title | 20px, bold, white |
| Icon | 24px, white |

### CSS

```css
.explore-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: linear-gradient(135deg, var(--coral-500) 0%, #EC4899 100%);
  border-radius: 16px;
  text-decoration: none;
  color: white;
  margin: 24px 16px;
  transition: transform 150ms ease-out;
}

.explore-cta:hover {
  transform: scale(1.02);
}

.explore-cta:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.5);
}

.explore-cta__content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.explore-cta__label {
  font-size: 14px;
  opacity: 0.9;
}

.explore-cta__title {
  font-size: 20px;
  font-weight: 700;
}

.explore-cta__icon {
  display: flex;
  align-items: center;
  gap: 4px;
}

.explore-cta__icon svg {
  width: 24px;
  height: 24px;
}
```

---

## Accessibility

### Skip Links

Add skip link at the top of the page:

```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
```

```css
.skip-link {
  position: absolute;
  top: -100px;
  left: 16px;
  padding: 12px 24px;
  background: var(--ocean-600);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 16px;
}
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move between nav items |
| `Enter` | Activate link/button |
| `Arrow Left/Right` | Navigate tabs |
| `Escape` | Close mobile menu (if applicable) |

### ARIA Requirements

- Use `role="navigation"` or `<nav>` elements
- Include `aria-label` for multiple nav elements
- Use `aria-current="page"` for current page
- Tabs need `role="tablist"`, `role="tab"`, `aria-selected`

---

## Related Documentation

- [Buttons](buttons.md) — Button components
- [Colors](../tokens/colors.md) — Color tokens
- [Spacing](../tokens/spacing.md) — Spacing scale
