---
title: Platform Adaptations Overview
description: Platform-specific design guidelines for iOS, Android, and Web
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ./ios.md
  - ./android.md
  - ./web.md
status: approved
---

# Platform Adaptations

## Overview

While Travelama is primarily a web application accessed via browser, understanding platform conventions ensures a native-feeling experience on each device type.

## Platform Distribution (Expected)

| Platform | Expected Usage |
|----------|----------------|
| iOS Safari | 55% |
| Android Chrome | 40% |
| Desktop Browsers | 5% |

## Core Philosophy

**Web-first, platform-aware**: Build for the web but respect platform conventions where they enhance usability.

## Documentation

| Platform | Key Considerations |
|----------|-------------------|
| [iOS](ios.md) | Safe areas, haptics, Safari-specific behaviors |
| [Android](android.md) | Material patterns, back button, Chrome behaviors |
| [Web](web.md) | Progressive enhancement, keyboard navigation |

## Universal Requirements

These apply across all platforms:

- **Touch targets**: 44×44px minimum
- **Contrast ratios**: WCAG AA compliant
- **Loading states**: Immediate visual feedback
- **Error handling**: Clear, actionable messages
- **Offline support**: PWA caching for critical content
