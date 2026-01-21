---
title: Host Dashboard & Property Editor — Feature Design Overview
description: Design specifications for the host property management experience (F5)
feature: host-dashboard
last-updated: 2025-12-22
version: 1.0.0
related-files:
  - ../host-authentication/README.md
  - ../property-digital-manual/README.md
  - ../../design-system/components/forms.md
status: draft
---

# Host Dashboard & Property Editor (F5)

## Feature Overview

The Host Dashboard enables property owners to create, edit, and manage their digital property manuals through a self-service interface. Hosts can manage multiple properties, edit all content sections, and generate QR codes for guest access.

## User Stories

### Primary User Story

**As a** property owner,
**I want to** create and manage my property's digital manual,
**So that** my guests have all the information they need without contacting me.

### Supporting User Stories

**As a** host with multiple properties,
**I want to** manage all my listings from one dashboard,
**So that** I can efficiently update information across properties.

**As a** host preparing a new listing,
**I want to** preview my property page before publishing,
**So that** I can ensure everything looks correct for guests.

**As a** host,
**I want to** auto-save my changes as I edit,
**So that** I never lose work due to browser issues or interruptions.

## Success Metrics

| Metric | Target |
|--------|--------|
| Time to create first property | < 10 minutes |
| Property completion rate | > 80% of sections filled |
| Host return rate (30 days) | > 60% return to edit |
| Auto-save reliability | 99.9% changes persisted |
| Mobile editor usability | > 4.0 satisfaction rating |

## Design Priorities

### P0 — Critical
1. Property list view with quick actions
2. Property editor with tabbed navigation
3. Basic info editing (name, welcome, checkout)
4. Wi-Fi network management
5. House rules management
6. Auto-save with visual feedback
7. Publish/unpublish toggle

### P1 — Important
1. Appliances section editor
2. Custom sections editor
3. Emergency contact management
4. QR code generation and download
5. Live preview in new tab
6. Image upload for host photo

### P2 — Nice to Have
1. Drag-and-drop reordering
2. Rich text formatting
3. Property templates
4. Duplicate property
5. Property analytics

---

## Information Architecture

```
/dashboard
├── / (Property List)
│   ├── Property cards grid
│   ├── "Add Property" button
│   └── Empty state (first-time hosts)
│
├── /properties/new (Create Property)
│   ├── Property name input
│   ├── Area selection
│   └── Create button
│
├── /properties/[id] (Property Editor)
│   ├── Header (back nav, property name, preview, menu)
│   ├── Tab Navigation
│   │   ├── Basic Info
│   │   ├── Wi-Fi
│   │   ├── House Rules
│   │   ├── Appliances
│   │   ├── Sections
│   │   ├── Emergency
│   │   └── QR Code
│   ├── Tab Content Area
│   └── Footer (status, save indicator, publish button)
│
└── /account (Account Settings)
    ├── Profile editing
    ├── Password change
    └── Account deletion
```

---

## Screen Specifications

### Dashboard — Property List

```
┌─────────────────────────────────────────────────────────────┐
│  ┌─────┐                                                    │
│  │ 🏠  │  Travelama                    [Profile ▼]         │
│  └─────┘                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Your Properties                        [+ Add Property]    │
│                                                              │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │  Sliema Sanctuary       │  │  Valletta Views         │  │
│  │  Sliema, Malta          │  │  Valletta, Malta        │  │
│  │                         │  │                         │  │
│  │  ● Published            │  │  ○ Draft                │  │
│  │  Updated 2 days ago     │  │  Updated 5 mins ago     │  │
│  │                         │  │                         │  │
│  │  [Edit] [View] [⋮]      │  │  [Edit] [Preview] [⋮]   │  │
│  └─────────────────────────┘  └─────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

| Element | Specifications |
|---------|----------------|
| Header | Fixed, white bg, shadow-sm |
| Logo | 32px height, links to dashboard |
| Profile Menu | Dropdown with account, logout |
| Page Title | 24px, semibold, foreground |
| Add Button | Primary button, accent color |
| Property Card | card bg, rounded-xl, shadow-sm |
| Card Title | 18px, semibold |
| Card Subtitle | 14px, muted-foreground |
| Status Badge | 12px, dot indicator + text |
| Actions | Ghost buttons, 14px |

### Dashboard — Empty State

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                         🏡                                   │
│                                                              │
│              Welcome to Travelama!                          │
│                                                              │
│         Create your first property to get started.          │
│         Your guests will thank you.                         │
│                                                              │
│              ┌──────────────────────┐                       │
│              │  + Add Your First    │                       │
│              │     Property         │                       │
│              └──────────────────────┘                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

| Element | Specifications |
|---------|----------------|
| Icon | 64px, muted-foreground |
| Heading | 24px, semibold, foreground |
| Description | 16px, muted-foreground, max-w-md |
| CTA Button | accent variant, size lg |

### Create Property Modal/Page

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  Create New Property                              [×]       │
│                                                              │
│  ─────────────────────────────────────────────────          │
│                                                              │
│  Property Name *                                             │
│  ┌─────────────────────────────────────────────────┐        │
│  │ e.g., Sliema Sanctuary                          │        │
│  └─────────────────────────────────────────────────┘        │
│                                                              │
│  Location *                                                  │
│  ┌─────────────────────────────────────────────────┐        │
│  │ Select area...                               ▼  │        │
│  └─────────────────────────────────────────────────┘        │
│                                                              │
│                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │      Cancel         │  │   Create Property   │          │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

| Element | Specifications |
|---------|----------------|
| Modal | max-w-md, card bg, rounded-2xl |
| Title | 20px, semibold |
| Labels | 14px, medium, foreground |
| Inputs | Standard form field styling |
| Cancel | secondary variant button |
| Create | accent variant button |

---

### Property Editor — Header

```
┌─────────────────────────────────────────────────────────────┐
│  ← Properties    Sliema Sanctuary         [Preview] [⋮]    │
├─────────────────────────────────────────────────────────────┤
```

| Element | Specifications |
|---------|----------------|
| Back Link | Ghost button with arrow, muted-foreground |
| Property Name | 18px, semibold, truncate |
| Preview Button | secondary variant, opens new tab |
| Menu | Dropdown: Duplicate, Delete, View Live |

### Property Editor — Tab Navigation

```
┌─────────────────────────────────────────────────────────────┐
│  Basic │ Wi-Fi │ Rules │ Appliances │ Sections │ Emergency │
└─────────────────────────────────────────────────────────────┘
```

| Element | Specifications |
|---------|----------------|
| Container | Horizontal scroll on mobile |
| Tab | 14px, medium, muted-foreground |
| Active Tab | primary color, 2px bottom border |
| Tab Padding | 12px vertical, 16px horizontal |

### Property Editor — Basic Info Tab

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  Property Name *                                             │
│  ┌─────────────────────────────────────────────────┐        │
│  │ Sliema Sanctuary                                │        │
│  └─────────────────────────────────────────────────┘        │
│                                                              │
│  Welcome Message                                             │
│  ┌─────────────────────────────────────────────────┐        │
│  │ Welcome to our home! We're thrilled to have    │        │
│  │ you stay with us. Make yourself comfortable... │        │
│  │                                                 │        │
│  └─────────────────────────────────────────────────┘        │
│  120/500 characters                                          │
│                                                              │
│  ─────────────────────────────────────────────────          │
│                                                              │
│  Host Details                                                │
│                                                              │
│  Your Name                                                   │
│  ┌─────────────────────────────────────────────────┐        │
│  │ Maria                                           │        │
│  └─────────────────────────────────────────────────┘        │
│                                                              │
│  Host Photo                                                  │
│  ┌────────────┐                                             │
│  │   [📷]     │  [Upload Photo]                             │
│  │            │                                             │
│  └────────────┘                                             │
│                                                              │
│  ─────────────────────────────────────────────────          │
│                                                              │
│  Checkout Time *                                             │
│  ┌───────────┐                                              │
│  │ 11:00 AM  │                                              │
│  └───────────┘                                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

| Element | Specifications |
|---------|----------------|
| Section Divider | 1px border, my-6 |
| Labels | 14px, medium, mb-2 |
| Text Inputs | Full width, standard styling |
| Textarea | min-h-24, resize-y |
| Character Count | 12px, muted-foreground |
| Photo Upload | 80x80px preview, rounded-lg |
| Time Picker | Native or custom dropdown |

### Property Editor — Wi-Fi Tab

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  Wi-Fi Networks                          [+ Add Network]    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ≡  PropertyWiFi_5G                    ★ Primary    │    │
│  │                                                      │    │
│  │     Password: ••••••••••••         [👁] [Copy]      │    │
│  │     Security: WPA2                                  │    │
│  │     Note: Best for streaming                        │    │
│  │                                                      │    │
│  │     [Edit]                              [Delete]    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ≡  PropertyWiFi_2.4G                               │    │
│  │                                                      │    │
│  │     Password: ••••••••••••         [👁] [Copy]      │    │
│  │     Security: WPA2                                  │    │
│  │     Note: Better range, slower speed                │    │
│  │                                                      │    │
│  │     [Edit]  [Set as Primary]            [Delete]    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

| Element | Specifications |
|---------|----------------|
| Network Card | card bg, rounded-xl, p-4 |
| Drag Handle | ≡ icon, muted-foreground |
| Network Name | 16px, semibold |
| Primary Badge | Small badge, primary color |
| Password Field | Masked by default, toggle to show |
| Actions | Ghost buttons, muted colors |

### Property Editor — House Rules Tab

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  House Rules                                [+ Add Rule]    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ≡  No smoking inside                    🔴 Critical │    │
│  │                                          [Edit] [×]  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ≡  Quiet hours: 10pm - 8am              ⚪ Normal   │    │
│  │                                          [Edit] [×]  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ≡  Maximum 4 guests                     ⚪ Normal   │    │
│  │                                          [Edit] [×]  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ─────────────────────────────────────────────────          │
│                                                              │
│  💡 Suggested rules you might want to add:                  │
│                                                              │
│  ┌──────────────────┐ ┌──────────────────┐                 │
│  │ + No pets        │ │ + No parties     │                 │
│  └──────────────────┘ └──────────────────┘                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

| Element | Specifications |
|---------|----------------|
| Rule Card | card bg, flex row, align-center |
| Drag Handle | ≡ icon, cursor-grab |
| Rule Text | 14px, flex-1 |
| Severity Badge | Dot + text, red for critical |
| Suggestions | secondary bg, rounded-lg, dashed border |

### Property Editor — Footer

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  ○ Draft  •  ✓ All changes saved              [Publish →]  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

| Element | Specifications |
|---------|----------------|
| Container | Sticky bottom, card bg, border-t, py-4, px-6 |
| Status | Dot indicator + text, 14px |
| Save Indicator | Checkmark + text when saved, spinner when saving |
| Publish Button | accent variant, prominent |

### Property Editor — QR Code Tab

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  Your QR Code                                                │
│                                                              │
│  Guests can scan this code to access your property manual.  │
│                                                              │
│        ┌─────────────────────────────────┐                  │
│        │                                 │                  │
│        │       [QR CODE IMAGE]          │                  │
│        │                                 │                  │
│        │        Sliema Sanctuary        │                  │
│        │        travelama.com/stay/...  │                  │
│        │                                 │                  │
│        └─────────────────────────────────┘                  │
│                                                              │
│  ─────────────────────────────────────────────────          │
│                                                              │
│  Download                                                    │
│                                                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                     │
│  │   PNG   │  │   SVG   │  │   PDF   │                     │
│  └─────────┘  └─────────┘  └─────────┘                     │
│                                                              │
│  Size                                                        │
│  ○ Small (200px)  ● Medium (400px)  ○ Large (800px)        │
│                                                              │
│  ☑ Include Travelama branding                               │
│                                                              │
│  ─────────────────────────────────────────────────          │
│                                                              │
│  Direct Link                                                 │
│  ┌─────────────────────────────────────────────────┐        │
│  │ https://travelama.com/stay/sliema-sanctuary     │ [Copy] │
│  └─────────────────────────────────────────────────┘        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

| Element | Specifications |
|---------|----------------|
| QR Preview | 200px, centered, card bg, shadow |
| Property Name | 14px, semibold, below QR |
| URL | 12px, muted-foreground, truncated |
| Format Buttons | Outline style, 3-column grid |
| Size Options | Radio group |
| Branding Checkbox | Standard checkbox |
| Link Input | Readonly, with copy button |

---

## Interaction Patterns

### Auto-Save

```
User types → Debounce 500ms → API call → Update UI

States:
1. Idle: "All changes saved" ✓
2. Pending: "Saving..." (spinner)
3. Saved: "All changes saved" ✓ (brief green flash)
4. Error: "Failed to save. Retry?" (red, with retry button)
```

### Drag and Drop Reordering

```
1. User grabs drag handle (≡)
2. Item lifts with shadow, opacity 0.9
3. Placeholder shows drop position
4. Release snaps item into place
5. Auto-save triggers
```

### Publish Flow

```
1. User clicks "Publish"
2. If incomplete sections:
   - Show warning modal listing missing items
   - "Publish Anyway" or "Complete Setup"
3. If complete:
   - Confirmation modal
   - "Your property is now live!"
   - Show QR code prompt
```

### Delete Confirmation

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  ⚠️ Delete Property                                         │
│                                                              │
│  Are you sure you want to delete "Sliema Sanctuary"?        │
│                                                              │
│  This will:                                                  │
│  • Remove the property from your dashboard                   │
│  • Make the QR code stop working                            │
│  • Move data to trash for 30 days                           │
│                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │      Cancel         │  │   Delete Property   │          │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Responsive Behavior

### Mobile (< 640px)
- Single column layout
- Tab navigation: horizontal scroll
- Property cards: full width, stacked
- Footer: fixed bottom
- Modals: bottom sheet style

### Tablet (640-1023px)
- Property cards: 2-column grid
- Editor: centered, max-w-2xl
- Tab navigation: all visible

### Desktop (≥ 1024px)
- Property cards: 3-column grid
- Editor: side-by-side preview option
- Tab navigation: horizontal bar
- Max content width: 1280px

---

## Error States

### Form Validation

```
Property Name *
┌─────────────────────────────────────────────────┐
│                                                  │  ← Red border
└─────────────────────────────────────────────────┘
⚠ Property name is required                         ← 12px, destructive
```

### Network Error

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  ⚠️ Connection Lost                                         │
│                                                              │
│  Your changes couldn't be saved. Please check your          │
│  internet connection and try again.                         │
│                                                              │
│  Your unsaved changes are stored locally.                   │
│                                                              │
│              ┌──────────────────────┐                       │
│              │       Retry          │                       │
│              └──────────────────────┘                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Accessibility

### Keyboard Navigation
- Tab through all form fields in logical order
- Arrow keys for tab navigation
- Enter/Space to activate buttons
- Escape to close modals
- Drag-and-drop has keyboard alternative (move up/down buttons)

### Screen Readers
- Form fields have proper labels
- Error messages linked to inputs with aria-describedby
- Status changes announced with aria-live
- Tab panel state communicated

### Focus Management
- Focus trapped in modals
- Focus returns to trigger after modal close
- Skip link to main content
- Visible focus indicators

---

## Analytics Events

| Event | Data |
|-------|------|
| `dashboard_viewed` | property_count |
| `property_created` | property_id |
| `property_edited` | property_id, section |
| `property_published` | property_id |
| `property_unpublished` | property_id |
| `property_deleted` | property_id |
| `qr_downloaded` | property_id, format, size |
| `preview_opened` | property_id |

---

## Related Documentation

- [Host Authentication](../host-authentication/README.md)
- [Property Digital Manual](../property-digital-manual/README.md)
- [QR Code System](../qr-code-system/README.md)
- [Forms Component](../../design-system/components/forms.md)
