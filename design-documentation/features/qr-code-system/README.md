---
title: QR Code System — Feature Design Overview
description: Design specifications for QR code generation and usage (F6)
feature: qr-code-system
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ../property-digital-manual/README.md
status: approved
---

# QR Code System (F6)

## Feature Overview

The QR Code System enables hosts to generate and print QR codes that link to their property page. It's the primary entry point for the guest experience.

## User Story

**As a** host,
**I want to** print QR codes that link to my property page,
**So that** guests can easily access information on arrival.

## Priority

**P1** — Required for host self-service

---

## QR Code Specifications

### Visual Design

| Property | Value |
|----------|-------|
| Minimum Size | 2cm × 2cm (print) |
| Recommended Size | 4cm × 4cm |
| Error Correction | Level M (15%) |
| Module Style | Square (standard) |
| Foreground | Black or brand color |
| Background | White |
| Quiet Zone | 4 modules minimum |

### Branding

```
┌─────────────────────────────────────┐
│                                      │
│         ▓▓▓▓▓▓▓▓▓▓▓▓                │
│         ▓▓▓▓▓▓▓▓▓▓▓▓                │
│         ▓▓▓▓▓▓▓▓▓▓▓▓                │
│         ▓▓▓▓▓▓▓▓▓▓▓▓                │
│         ▓▓▓▓▓▓▓▓▓▓▓▓                │
│         ▓▓▓▓▓▓▓▓▓▓▓▓                │
│                                      │
│         travelama.com                │
│       /stay/property-name            │
│                                      │
│         Scan for property info       │
│                                      │
└─────────────────────────────────────┘
```

### Download Formats

| Format | Use Case |
|--------|----------|
| PNG (300dpi) | Digital display, web |
| PDF (vector) | Professional printing |
| SVG | Scalable, custom printing |

---

## Placement Guidelines

### Recommended Locations

1. **Entry Area** — Near the door, eye level
2. **Living Room** — Coffee table tent card
3. **Kitchen** — Fridge magnet or counter stand
4. **Bedroom** — Nightstand or desk
5. **Welcome Card** — Part of welcome pack

### Design Templates

**Tent Card** (for tables)
```
┌───────────────────┐
│                   │
│   [QR CODE]       │
│                   │
│   Scan for        │
│   Property Info   │
│                   │
│   WiFi, Rules,    │
│   Local Tips      │
│                   │
└───────────────────┘
```

**Wall/Door Sign**
```
┌─────────────────────────┐
│                         │
│  Welcome!               │
│                         │
│  [QR CODE]              │
│                         │
│  Scan for everything    │
│  you need to know       │
│                         │
└─────────────────────────┘
```

---

## Error Handling

### Broken/Invalid QR

When QR links to non-existent property:

```
┌─────────────────────────────────────┐
│                                      │
│            ⚠️                        │
│                                      │
│     Property Not Found               │
│                                      │
│  This property page is no longer    │
│  available. Please contact your     │
│  host directly.                     │
│                                      │
│  ─────────────────────────────────  │
│                                      │
│  Looking for a different property?  │
│  Check your booking confirmation    │
│  for the correct link.              │
│                                      │
└─────────────────────────────────────┘
```

---

## Analytics

### Scan Tracking

| Event | Data |
|-------|------|
| `qr_scan` | property_id, timestamp, referrer |
| `first_scan` | property_id, timestamp |
| `return_scan` | property_id, session_count |

---

## Related Documentation

- [Property Digital Manual](../property-digital-manual/README.md)
