---
title: Design Tokens Overview
description: Foundation design tokens for colors, typography, spacing, and motion
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ./colors.md
  - ./typography.md
  - ./spacing.md
  - ./animations.md
  - ../../assets/design-tokens.json
status: approved
---

# Design Tokens

## Overview

Design tokens are the atomic values that form the foundation of the Travelama design system. They ensure consistency across all components and platforms while enabling efficient updates and theming.

## Token Categories

### [Colors](colors.md)
Complete color palette including primary, secondary, accent, semantic, and neutral colors with accessibility guidelines.

### [Typography](typography.md)
Font families, weights, size scale, line heights, and responsive typography specifications.

### [Spacing](spacing.md)
Spacing scale, layout grids, breakpoints, and container specifications.

### [Animations](animations.md)
Timing functions, duration scale, and common animation patterns.

## Token Naming Convention

```
{category}-{property}-{variant}-{state}
```

**Examples:**
- `color-ocean-600` — Color category, ocean hue, 600 shade
- `space-4` — Spacing category, scale step 4
- `font-size-body` — Typography category, body size
- `duration-200` — Animation category, 200ms duration

## Token Format

All tokens are available in:
- **JSON** — [design-tokens.json](../../assets/design-tokens.json) for build tools
- **CSS Custom Properties** — For direct use in stylesheets
- **Tailwind Config** — Pre-configured for Tailwind CSS

## Usage Guidelines

### Do
- Always use tokens instead of hardcoded values
- Reference tokens by their semantic name when possible
- Use the closest token value rather than custom values

### Don't
- Create one-off values outside the token system
- Override token values without documenting the reason
- Use color tokens without verifying accessibility contrast

## Token Implementation

### CSS Custom Properties
```css
:root {
  --color-ocean-600: #0E7490;
  --space-4: 1rem;
  --font-size-body: 1rem;
  --duration-200: 200ms;
}
```

### Tailwind Config
```javascript
module.exports = {
  theme: {
    extend: {
      colors: require('./design-tokens.json').colors,
      spacing: require('./design-tokens.json').spacing,
      // ...
    }
  }
}
```

### JavaScript/TypeScript
```typescript
import tokens from './design-tokens.json';

const primaryColor = tokens.colors.ocean[600];
const defaultSpacing = tokens.spacing[4];
```

## Related Documentation

- [Complete Style Guide](../style-guide.md)
- [Component Library](../components/README.md)
- [Accessibility Guidelines](../../accessibility/guidelines.md)
