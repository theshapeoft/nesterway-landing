# Product Requirements Document: Travelama Feature Completion

**Version:** 1.0  
**Date:** 2026-01-21  
**Author:** Product Team  
**Status:** Draft

---

## 1. Executive Summary

This PRD covers the completion of documented but unimplemented features for Travelama, a digital guest guide platform for short-let property owners. The scope includes **P1 priority gaps** in the Host Dashboard and QR Code System, plus **P2 nice-to-have features** for authentication and property management enhancements.

**Target Users:** Both solo hosts (1-3 properties) and property managers (5+ properties)  
**Implementation Approach:** Feature-by-feature independent releases  
**Technical Constraints:** Stay within current stack (Next.js, Supabase, Tailwind, shadcn/ui) while open to new libraries; must perform well on low-end devices/slow networks

---

## 2. Feature List & User Stories

### 2.1 Drag-and-Drop Reordering (P1)

**User Story:**  
As a host, I want to reorder Wi-Fi networks, house rules, and appliances by dragging them, so that I can prioritize the most important items for my guests.

**Acceptance Criteria:**
- [ ] Drag handle (≡) appears on left side of each list item
- [ ] Items can be dragged to reorder within their list
- [ ] Visual feedback: lifted item has shadow, opacity 0.9; placeholder shows drop position
- [ ] Keyboard alternative: Up/Down buttons for accessibility
- [ ] Order persists via auto-save after drop
- [ ] Works on touch devices (mobile/tablet)

**Applies to:**
- Wi-Fi networks (`/dashboard/properties/[id]` → Wi-Fi tab)
- House rules (`/dashboard/properties/[id]` → Rules tab)
- Appliances (`/dashboard/properties/[id]` → Appliances tab)
- Custom sections (`/dashboard/properties/[id]` → Sections tab)

**Technical Notes:**
- Recommend `@dnd-kit/core` for drag-and-drop (lightweight, accessible, touch-friendly)
- Store `order` field in database, update via optimistic UI

---

### 2.2 Host Photo Upload (P1)

**User Story:**  
As a host, I want to upload my photo to the Basic Info tab, so that guests see a personal touch when viewing my property page.

**Acceptance Criteria:**
- [ ] Upload button in Basic Info tab under "Host Details" section
- [ ] 80x80px circular preview with rounded-lg styling
- [ ] Accepts JPG, PNG, WebP (max 5MB)
- [ ] Image cropped/resized to 200x200px on upload
- [ ] Stored in Supabase Storage bucket
- [ ] Remove/replace photo option
- [ ] Placeholder icon when no photo uploaded

**Technical Notes:**
- ImageUpload component exists — integrate with Supabase Storage
- Use `sharp` or client-side canvas for resize/crop

---

### 2.3 QR Code Download Formats (P1)

**User Story:**  
As a host, I want to download my QR code in PNG, SVG, and PDF formats at different sizes, so that I can use it for digital displays and professional printing.

**Acceptance Criteria:**
- [ ] Three download buttons: PNG, SVG, PDF
- [ ] Size selector: Small (200px), Medium (400px), Large (800px)
- [ ] PNG: 300dpi for print quality
- [ ] SVG: Vector format, scalable
- [ ] PDF: Vector, A4/Letter page with QR centered
- [ ] All formats include property name and URL below QR
- [ ] Downloads trigger immediately on click

**Technical Notes:**
- Use `qrcode` library for generation (already installed)
- Use `jspdf` for PDF generation
- SVG can be generated natively

---

### 2.4 QR Code Branding Toggle (P1)

**User Story:**  
As a host, I want to optionally include Travelama branding on my QR code downloads, so that I can choose between branded and clean versions.

**Acceptance Criteria:**
- [ ] Checkbox: "Include Travelama branding" (default: checked)
- [ ] Branded version: Includes "travelama.com" text and logo watermark
- [ ] Unbranded version: QR code, property name, and direct URL only
- [ ] Preview updates in real-time based on toggle

---

### 2.5 Print-Ready Templates (P1)

**User Story:**  
As a host, I want to download print-ready templates (tent cards, wall signs), so that I can professionally display QR codes in my property.

**Acceptance Criteria:**
- [ ] Template selector with preview thumbnails
- [ ] **Tent Card Template:** Foldable design, QR + "Scan for Property Info" + feature list
- [ ] **Wall/Door Sign Template:** Portrait orientation, "Welcome!" heading + QR + instructions
- [ ] Templates available in PDF format (print-ready, with bleed marks)
- [ ] Customizable property name on templates

**Template Designs:** (per design documentation)
```
Tent Card:
┌───────────────────┐
│   [QR CODE]       │
│   Scan for        │
│   Property Info   │
│   WiFi, Rules,    │
│   Local Tips      │
└───────────────────┘

Wall Sign:
┌─────────────────────────┐
│  Welcome!               │
│  [QR CODE]              │
│  Scan for everything    │
│  you need to know       │
└─────────────────────────┘
```

---

### 2.6 Live Preview Side-by-Side (P1)

**User Story:**  
As a host on desktop, I want to see a live preview of my property page alongside the editor, so that I can see changes in real-time without switching tabs.

**Acceptance Criteria:**
- [ ] Desktop only (≥1024px): Split-screen view with editor left, preview right
- [ ] Preview updates as user types (debounced 500ms)
- [ ] Toggle button to show/hide preview panel
- [ ] Preview uses iframe or component rendering of guest view
- [ ] Mobile/tablet: Keep existing "Preview" button that opens new tab

---

### 2.7 Property Duplication (P1)

**User Story:**  
As a host with multiple similar properties, I want to duplicate an existing property, so that I can quickly create new listings without re-entering common information.

**Acceptance Criteria:**
- [ ] "Duplicate" option in property card menu (⋮)
- [ ] "Duplicate" option in property editor header menu
- [ ] Creates copy with name "[Original Name] (Copy)"
- [ ] Copies all content: Wi-Fi networks, rules, appliances, sections, emergency contacts
- [ ] New property starts as Draft (unpublished)
- [ ] User redirected to new property editor after duplication
- [ ] Confirmation toast: "Property duplicated successfully"

---

### 2.8 Google OAuth Login (P2)

**User Story:**  
As a host, I want to sign up and log in with my Google account, so that I don't need to remember another password.

**Acceptance Criteria:**
- [ ] "Continue with Google" button on signup page
- [ ] "Continue with Google" button on login page
- [ ] Uses Supabase Auth Google provider
- [ ] On first OAuth login, creates account and redirects to dashboard
- [ ] On subsequent logins, signs in and redirects to dashboard
- [ ] Existing email/password users can link Google account in settings

**Design:**
```
┌────────────────────────────────────────────┐
│  🔵 Continue with Google                    │
└────────────────────────────────────────────┘
                    or
────────────────────────────────────────────
```

---

### 2.9 Password Strength Indicator (P2)

**User Story:**  
As a host creating an account, I want to see password strength feedback, so that I can create a secure password.

**Acceptance Criteria:**
- [ ] 4-segment progress bar below password field
- [ ] Color-coded levels: Weak (red), Fair (orange), Good (yellow), Strong (green)
- [ ] Text feedback with suggestions: "Weak · Add uppercase, number"
- [ ] Requirements: 8+ chars, 1 uppercase, 1 number
- [ ] Appears on: Signup, Reset Password, Change Password pages

**Visual per design docs:**
```
Password
┌────────────────────────────────────────────┐
│ ••••••••••••                          [👁] │
└────────────────────────────────────────────┘
░░░░░░░░░░░░░░░░░░░░                          ← 2/4 segments filled
Fair · Add uppercase letter
```

---

### 2.10 Rich Text Formatting (P2)

**User Story:**  
As a host, I want to format text in my welcome message and custom sections with bold, italic, and lists, so that I can make important information stand out.

**Acceptance Criteria:**
- [ ] Toolbar with: Bold, Italic, Bullet list, Numbered list
- [ ] Applies to: Welcome message, Custom section content
- [ ] Stored as HTML/Markdown in database
- [ ] Renders correctly on guest property page
- [ ] Character count accounts for formatting characters
- [ ] Mobile-friendly toolbar

**Technical Notes:**
- Recommend `tiptap` or `lexical` for lightweight rich text
- Store as HTML, sanitize on render

---

### 2.11 Property Templates (P2)

**User Story:**  
As a new host, I want to start from a template when creating a property, so that I have a helpful starting point with common rules and sections.

**Acceptance Criteria:**
- [ ] Template selection step when creating new property
- [ ] Templates available:
  - **Blank** — Start from scratch
  - **Apartment** — Common apartment rules, typical appliances
  - **House** — Outdoor space rules, garage/parking info
  - **Studio** — Compact layout, essential info only
- [ ] Template pre-fills: House rules, Appliances, Custom sections
- [ ] User can edit all pre-filled content
- [ ] "Skip" option to start blank

---

### 2.12 Analytics Events Integration (P2)

**User Story:**  
As the product team, we want to track user behavior events, so that we can measure feature adoption and improve the product.

**Acceptance Criteria:**
- [ ] Event tracking utility function created
- [ ] Events tracked (per design docs):
  - `dashboard_viewed` (property_count)
  - `property_created` (property_id)
  - `property_edited` (property_id, section)
  - `property_published` / `property_unpublished` (property_id)
  - `property_deleted` (property_id)
  - `qr_downloaded` (property_id, format, size)
  - `preview_opened` (property_id)
  - `qr_scan` (property_id, timestamp)
  - Auth events: `signup_*`, `login_*`, `logout`, `password_reset_*`
- [ ] Console logging in development
- [ ] Ready for analytics provider integration (Posthog, Mixpanel, etc.)

---

### 2.13 Offline Caching for Guest Pages (P2)

**User Story:**  
As a guest, I want critical property info (Wi-Fi, emergency contacts) to work offline, so that I can access it even with poor connectivity.

**Acceptance Criteria:**
- [ ] Service worker caches property page on first visit
- [ ] Offline indicator shown when connection lost
- [ ] Cached data: Wi-Fi credentials, emergency contacts, house rules
- [ ] Cache invalidation when property updated (via ETag or version)
- [ ] Works on: `/stay/[slug]` pages only

**Technical Notes:**
- Use `next-pwa` or custom service worker
- Cache API for offline storage

---

## 3. Technical Architecture

### 3.1 New Dependencies

| Feature | Library | Purpose |
|---------|---------|---------|
| Drag-and-drop | `@dnd-kit/core`, `@dnd-kit/sortable` | Accessible drag-and-drop |
| PDF generation | `jspdf` | QR code PDF export |
| Rich text | `tiptap` | Lightweight rich text editor |
| Offline | `workbox` / `next-pwa` | Service worker management |

### 3.2 Database Schema Changes

```sql
-- Add order column to existing tables
ALTER TABLE wifi_networks ADD COLUMN order_index INTEGER DEFAULT 0;
ALTER TABLE house_rules ADD COLUMN order_index INTEGER DEFAULT 0;
ALTER TABLE appliances ADD COLUMN order_index INTEGER DEFAULT 0;
ALTER TABLE custom_sections ADD COLUMN order_index INTEGER DEFAULT 0;

-- Add host photo to properties or profiles
ALTER TABLE profiles ADD COLUMN avatar_url TEXT;

-- Analytics events table (optional, if self-hosted)
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  event_data JSONB,
  user_id UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.3 Storage Buckets

- `avatars` — Host profile photos (public read, authenticated write)
- Already exists: `property-images` — Reuse if needed

---

## 4. Implementation Phases

Since features are independent, implement in priority order:

### Phase 1: QR Code Enhancements
1. QR Code Download Formats (PNG, SVG, PDF)
2. QR Code Branding Toggle
3. Print-Ready Templates

### Phase 2: Dashboard UX
4. Drag-and-Drop Reordering
5. Host Photo Upload
6. Property Duplication

### Phase 3: Desktop Enhancement
7. Live Preview Side-by-Side

### Phase 4: Authentication & Polish
8. Password Strength Indicator
9. Google OAuth Login

### Phase 5: Content & Analytics
10. Rich Text Formatting
11. Property Templates
12. Analytics Events Integration

### Phase 6: Performance
13. Offline Caching for Guest Pages

---

## 5. Success Metrics

| Metric | Target | Measured By |
|--------|--------|-------------|
| QR download usage | 50%+ hosts download at least once | `qr_downloaded` events |
| Drag-drop adoption | 30%+ hosts reorder items | `property_edited` with reorder |
| Property duplication | 20%+ multi-property hosts use | `property_created` with source |
| Google OAuth adoption | 25%+ new signups | `signup_completed` with method |
| Offline cache hits | 10%+ guest page views | Service worker analytics |

---

## 6. Out of Scope

- Two-factor authentication
- Session management (view/revoke devices)
- Multi-language support
- White-label/custom domains
- Mobile native app

---

## 7. Open Questions

1. **Analytics provider** — Which service to integrate? (Posthog, Mixpanel, Amplitude)
2. **Template content** — Should templates be user-editable or hardcoded?
3. **Offline scope** — Cache entire property page or just critical sections?

---

## 8. Appendix: Design References

- Host Dashboard wireframes: `/design-documentation/features/host-dashboard/README.md`
- QR Code specifications: `/design-documentation/features/qr-code-system/README.md`
- Authentication flows: `/design-documentation/features/host-authentication/README.md`