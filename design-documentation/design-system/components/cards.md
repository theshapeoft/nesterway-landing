---
title: Card Components
description: Specifications for info cards, recommendation cards, section cards, and collapsible sections
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ./buttons.md
  - ../tokens/colors.md
  - ../tokens/spacing.md
status: approved
---

# Card Components

## Overview

Cards are the primary containers for content in Travelama. They group related information and create visual hierarchy on the page.

## Table of Contents

1. [Base Card](#base-card)
2. [Info Card](#info-card)
3. [Section Card](#section-card)
4. [Collapsible Section](#collapsible-section)
5. [Recommendation Card](#recommendation-card)
6. [Category Card](#category-card)
7. [Quick Access Card](#quick-access-card)
8. [Accessibility](#accessibility)

---

## Base Card

Foundation styles shared by all card variants.

### Base Specifications

| Property | Value |
|----------|-------|
| Background | `sand-50` (#FEFDFB) or `white` |
| Border | 1px solid `sand-300` (#EBE4D8) |
| Border Radius | 12px (`rounded-md`) |
| Padding | 16px (`space-4`) |
| Shadow | none or `shadow-sm` for elevation |

### CSS

```css
.card {
  background: var(--sand-50);
  border: 1px solid var(--sand-300);
  border-radius: 12px;
  padding: 16px;
}

.card--elevated {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

---

## Info Card

For displaying key information with an icon and label.

### Use Cases
- Wi-Fi quick access
- Check-out time
- Emergency contact
- Parking info

### Structure

```html
<div class="info-card">
  <div class="info-card__icon">
    <WifiIcon />
  </div>
  <div class="info-card__content">
    <span class="info-card__label">Wi-Fi</span>
    <span class="info-card__value">PropertyNetwork_5G</span>
  </div>
  <button class="info-card__action" aria-label="Copy Wi-Fi details">
    <CopyIcon />
  </button>
</div>
```

### Specifications

| Element | Style |
|---------|-------|
| Container | 44px min-height, flex row, center aligned |
| Icon | 24px, `ocean-600`, in 40px container |
| Label | 12px caption, `neutral-500` |
| Value | 16px semibold, `neutral-800` |
| Action | 44×44px touch target, icon button |

### CSS

```css
.info-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--sand-50);
  border: 1px solid var(--sand-300);
  border-radius: 12px;
  min-height: 44px;
}

.info-card__icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ocean-50);
  border-radius: 8px;
  color: var(--ocean-600);
}

.info-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-card__label {
  font-size: 12px;
  color: var(--neutral-500);
}

.info-card__value {
  font-size: 16px;
  font-weight: 600;
  color: var(--neutral-800);
}

.info-card__action {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ocean-600);
  border-radius: 8px;
  transition: background 150ms ease-out;
}

.info-card__action:hover {
  background: var(--ocean-50);
}
```

---

## Section Card

Container for grouped content with a title.

### Use Cases
- House Rules section
- Appliances section
- Check-in Instructions

### Structure

```html
<section class="section-card" aria-labelledby="rules-heading">
  <header class="section-card__header">
    <div class="section-card__icon">
      <ClipboardListIcon />
    </div>
    <h2 id="rules-heading" class="section-card__title">
      House Rules
    </h2>
  </header>
  <div class="section-card__content">
    <!-- Content here -->
  </div>
</section>
```

### Specifications

| Element | Style |
|---------|-------|
| Container | Full card styling, 24px padding |
| Header | Flex row, 16px gap, 24px bottom margin |
| Icon | 28px, `ocean-600` |
| Title | h2 styling (24px, 600 weight) |
| Content | Standard body text styling |

### CSS

```css
.section-card {
  background: white;
  border: 1px solid var(--sand-300);
  border-radius: 12px;
  padding: 24px;
}

.section-card__header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.section-card__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ocean-50);
  border-radius: 12px;
  color: var(--ocean-600);
}

.section-card__title {
  font-size: 24px;
  font-weight: 600;
  color: var(--neutral-800);
  margin: 0;
}

.section-card__content {
  color: var(--neutral-600);
  line-height: 1.6;
}
```

---

## Collapsible Section

Accordion-style section that expands/collapses.

### Use Cases
- Property information sections
- FAQs
- Detailed instructions

### Structure

```html
<div class="accordion">
  <button
    class="accordion__trigger"
    aria-expanded="false"
    aria-controls="rules-content"
  >
    <div class="accordion__icon">
      <ClipboardListIcon />
    </div>
    <span class="accordion__title">House Rules</span>
    <ChevronDownIcon class="accordion__chevron" />
  </button>
  <div
    id="rules-content"
    class="accordion__content"
    hidden
  >
    <div class="accordion__inner">
      <!-- Content here -->
    </div>
  </div>
</div>
```

### Specifications

| Element | Style |
|---------|-------|
| Trigger | Full width button, 60px height, flex row |
| Icon | 24px, in 40px container with bg |
| Title | 18px, semibold |
| Chevron | 20px, rotates 180° when open |
| Content | Animated height, 16px padding |

### CSS

```css
.accordion {
  border: 1px solid var(--sand-300);
  border-radius: 12px;
  overflow: hidden;
}

.accordion + .accordion {
  margin-top: 12px;
}

.accordion__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--sand-50);
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 150ms ease-out;
}

.accordion__trigger:hover {
  background: var(--sand-100);
}

.accordion__trigger:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 2px var(--ocean-600);
}

.accordion__icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ocean-50);
  border-radius: 8px;
  color: var(--ocean-600);
  flex-shrink: 0;
}

.accordion__title {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: var(--neutral-800);
}

.accordion__chevron {
  width: 20px;
  height: 20px;
  color: var(--neutral-500);
  transition: transform 300ms ease-in-out;
}

.accordion[data-open="true"] .accordion__chevron {
  transform: rotate(180deg);
}

.accordion__content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 300ms ease-in-out;
}

.accordion[data-open="true"] .accordion__content {
  grid-template-rows: 1fr;
}

.accordion__inner {
  overflow: hidden;
  padding: 0 16px;
}

.accordion[data-open="true"] .accordion__inner {
  padding: 16px;
  padding-top: 0;
  border-top: 1px solid var(--sand-300);
}
```

### Animation Notes

Use CSS Grid animation for smooth height transitions:

```css
/* Grid-based height animation */
.accordion__content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 300ms ease-in-out;
}

.accordion__content[data-open="true"] {
  grid-template-rows: 1fr;
}

.accordion__inner {
  overflow: hidden;
}
```

---

## Recommendation Card

For displaying a recommended place with details.

### Use Cases
- Restaurant recommendations
- Activity suggestions
- Nearby attractions

### Structure

```html
<article class="recommendation-card">
  <div class="recommendation-card__image">
    <img src="..." alt="Restaurant exterior" />
    <span class="recommendation-card__badge">Must Try</span>
  </div>
  <div class="recommendation-card__content">
    <h3 class="recommendation-card__title">
      Ta' Kris Restaurant
    </h3>
    <p class="recommendation-card__category">
      Maltese Traditional
    </p>
    <p class="recommendation-card__description">
      Authentic Maltese cuisine in a cozy setting. Try the rabbit stew.
    </p>
    <div class="recommendation-card__meta">
      <span class="recommendation-card__price">€€</span>
      <span class="recommendation-card__distance">5 min walk</span>
    </div>
    <a
      href="https://maps.google.com/..."
      class="recommendation-card__link"
      target="_blank"
      rel="noopener"
    >
      <MapPinIcon />
      Get Directions
    </a>
  </div>
</article>
```

### Specifications

| Element | Style |
|---------|-------|
| Container | White bg, 12px radius, shadow-sm |
| Image | Aspect ratio 16:9, object-fit cover |
| Badge | Absolute positioned, coral-500 bg |
| Title | 18px, semibold, `neutral-800` |
| Category | 14px, `ocean-600` |
| Description | 14px, `neutral-600`, 2-line clamp |
| Meta | 12px, `neutral-500`, flex row |
| Link | Ghost button style, `ocean-600` |

### CSS

```css
.recommendation-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.recommendation-card__image {
  position: relative;
  aspect-ratio: 16 / 9;
}

.recommendation-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recommendation-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 12px;
  background: var(--coral-500);
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
}

.recommendation-card__content {
  padding: 16px;
}

.recommendation-card__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--neutral-800);
  margin: 0 0 4px;
}

.recommendation-card__category {
  font-size: 14px;
  color: var(--ocean-600);
  margin: 0 0 8px;
}

.recommendation-card__description {
  font-size: 14px;
  color: var(--neutral-600);
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recommendation-card__meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--neutral-500);
  margin-bottom: 12px;
}

.recommendation-card__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--ocean-600);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
}

.recommendation-card__link:hover {
  text-decoration: underline;
}
```

### Responsive Layout

- **Mobile**: Single column, full-width cards
- **Tablet+**: 2-column grid
- **Desktop**: 3-column grid for category pages

```css
.recommendation-grid {
  display: grid;
  gap: 16px;
}

@media (min-width: 768px) {
  .recommendation-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media (min-width: 1024px) {
  .recommendation-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## Category Card

For browsing categories on area/country pages.

### Use Cases
- Food & Drink category
- Things to Do category
- Beaches category

### Structure

```html
<a href="/malta/sliema/food-drink" class="category-card">
  <div class="category-card__icon">
    <UtensilsIcon />
  </div>
  <span class="category-card__title">Food & Drink</span>
  <span class="category-card__count">12 places</span>
  <ChevronRightIcon class="category-card__arrow" />
</a>
```

### Specifications

| Element | Style |
|---------|-------|
| Container | 72px height, flex row, clickable |
| Icon | 32px, in 48px container |
| Title | 16px, semibold |
| Count | 14px, `neutral-500` |
| Arrow | 20px, `neutral-400` |

### CSS

```css
.category-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: white;
  border: 1px solid var(--sand-300);
  border-radius: 12px;
  text-decoration: none;
  transition: all 150ms ease-out;
}

.category-card:hover {
  background: var(--sand-50);
  border-color: var(--ocean-300);
}

.category-card:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.4);
}

.category-card__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ocean-50);
  border-radius: 12px;
  color: var(--ocean-600);
}

.category-card__title {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: var(--neutral-800);
}

.category-card__count {
  font-size: 14px;
  color: var(--neutral-500);
}

.category-card__arrow {
  width: 20px;
  height: 20px;
  color: var(--neutral-400);
}
```

---

## Quick Access Card

Compact card for essential information on property page.

### Use Cases
- Wi-Fi credentials
- Check-out time
- Emergency contact

### Structure

```html
<button class="quick-access-card" aria-label="Copy Wi-Fi password">
  <div class="quick-access-card__icon">
    <WifiIcon />
  </div>
  <span class="quick-access-card__label">Wi-Fi</span>
</button>
```

### Specifications

| Element | Style |
|---------|-------|
| Container | 80px width, vertical layout, clickable |
| Icon | 28px, in 56px circle |
| Label | 12px, medium weight |

### CSS

```css
.quick-access-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: white;
  border: 1px solid var(--sand-300);
  border-radius: 16px;
  cursor: pointer;
  transition: all 150ms ease-out;
  min-width: 80px;
}

.quick-access-card:hover {
  background: var(--ocean-50);
  border-color: var(--ocean-300);
}

.quick-access-card:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.4);
}

.quick-access-card__icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ocean-50);
  border-radius: 50%;
  color: var(--ocean-600);
}

.quick-access-card__label {
  font-size: 12px;
  font-weight: 500;
  color: var(--neutral-700);
}
```

---

## Accessibility

### Semantic Structure

- Use `<article>` for recommendation cards
- Use `<section>` with `aria-labelledby` for section cards
- Use appropriate heading levels (h2, h3)

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move between cards/buttons |
| `Enter` | Activate card/link |
| `Space` | Toggle accordion |

### Screen Reader

- Include descriptive text for images (`alt`)
- Announce accordion state (`aria-expanded`)
- Use `aria-label` for icon-only actions

### Focus Indicators

All interactive cards must have visible focus indicators:

```css
.card:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.4);
}
```

---

## Related Documentation

- [Buttons](buttons.md) — Button components
- [Colors](../tokens/colors.md) — Color tokens
- [Spacing](../tokens/spacing.md) — Spacing scale
- [Animations](../tokens/animations.md) — Accordion animations
