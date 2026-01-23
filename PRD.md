# Travelama Feature Completion PRD

**Version:** 1.0
**Last Updated:** 2026-01-21
**Status:** Draft
**Owner:** Product Team

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Goals & Non-Goals](#2-goals--non-goals)
3. [Features by Area](#3-features-by-area)
   - [QR Code System](#31-qr-code-system-p1)
   - [Dashboard Editor](#32-dashboard-editor-p1)
   - [Content Management](#33-content-management)
   - [Authentication](#34-authentication-p2)
   - [Analytics & Performance](#35-analytics--performance-p2)
   - [Guest Access Control & Invites](#36-guest-access-control--invites-p0)
   - [Interactive Maps System](#37-interactive-maps-system-p0)
4. [Technical Architecture](#4-technical-architecture)
5. [Implementation Phases](#5-implementation-phases)
6. [Success Metrics](#6-success-metrics)
7. [Risks & Mitigations](#7-risks--mitigations)
8. [Out of Scope](#8-out-of-scope)
9. [Open Questions](#9-open-questions)

---

## 1. Executive Summary

This PRD covers the completion of documented but unimplemented features for Travelama, a digital guest guide platform for short-let property owners.

**Scope:** P1 priority gaps in the Host Dashboard and QR Code System, plus P2 nice-to-have features for authentication and property management enhancements.

**Target Users:**
- Solo hosts (1-3 properties)
- Property managers (5+ properties)

**Approach:** Feature-by-feature independent releases

**Constraints:**
- Stay within current stack (Next.js, Supabase, Tailwind, shadcn/ui)
- Must perform well on low-end devices and slow networks

---

## 2. Goals & Non-Goals

### Goals
- Enable hosts to create more professional, personalized property guides
- Reduce friction in property setup and management
- Provide flexible QR code output for various print/display needs
- Improve guest experience with offline access to critical info

### Non-Goals
- Building a mobile native app
- Multi-language/i18n support
- White-label or custom domain features
- Two-factor authentication

---

## 3. Features by Area

### 3.1 QR Code System `P1`

#### 3.1.1 QR Code Download Formats

**User Story:** As a host, I want to download my QR code in PNG, SVG, and PDF formats at different sizes, so that I can use it for digital displays and professional printing.

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

#### 3.1.2 QR Code Branding Toggle

**User Story:** As a host, I want to optionally include Travelama branding on my QR code downloads, so that I can choose between branded and clean versions.

**Acceptance Criteria:**
- [ ] Checkbox: "Include Travelama branding" (default: checked)
- [ ] Branded version: Includes "travelama.com" text and logo watermark
- [ ] Unbranded version: QR code, property name, and direct URL only
- [ ] Preview updates in real-time based on toggle

---

#### 3.1.3 Print-Ready Templates

**User Story:** As a host, I want to download print-ready templates (tent cards, wall signs), so that I can professionally display QR codes in my property.

**Acceptance Criteria:**
- [ ] Template selector with preview thumbnails
- [ ] **Tent Card Template:** Foldable design, QR + "Scan for Property Info" + feature list
- [ ] **Wall/Door Sign Template:** Portrait orientation, "Welcome!" heading + QR + instructions
- [ ] Templates available in PDF format (print-ready, with bleed marks)
- [ ] Customizable property name on templates

**Template Designs:**
```
Tent Card:                      Wall Sign:
┌───────────────────┐           ┌─────────────────────────┐
│   [QR CODE]       │           │  Welcome!               │
│   Scan for        │           │  [QR CODE]              │
│   Property Info   │           │  Scan for everything    │
│   WiFi, Rules,    │           │  you need to know       │
│   Local Tips      │           └─────────────────────────┘
└───────────────────┘
```

---

#### 3.1.4 Full Guide PDF Export

**User Story:** As a host, I want to download a complete PDF version of my guide with professional design, so I can email it to guests or print physical copies.

**Acceptance Criteria:**
- [ ] "Quick Share" tab in property editor navigation
- [ ] Section: "GENERATE PDF VERSION OF GUIDE"
- [ ] "Generate & Download" button with loading indicator
- [ ] "Customization Options" button opens modal:
  - Checkboxes to include/exclude: WiFi, Rules, Appliances, Emergency Contacts, Custom Sections, Map
  - Header/footer options: Property name, host contact, page numbers
  - Branding toggle: Include Travelama logo
- [ ] PDF includes:
  - Professional cover page: Property hero image, name, address, host details
  - Table of contents with page numbers
  - All enabled sections with preserved formatting
  - Embedded map image if map exists
  - Styled headers, icons, proper spacing
  - Footer: "Generated by Travelama.com" (if branding enabled)
- [ ] Filename: `[property-slug]-guide-[YYYY-MM-DD].pdf`
- [ ] Generation time: 3-5 seconds with progress indicator
- [ ] Max file size: 10MB
- [ ] Analytics event: `pdf_downloaded` (property_id, sections_included, branded)

**Technical Notes:**
- Server-side generation via API route `/api/properties/[id]/export-pdf`
- Use `puppeteer` / `puppeteer-core` for high-quality output
- Custom React PDF template component
- Print-optimized CSS with page breaks
- Error handling for generation failures

**Quick Share Tab Layout:**
```
┌─────────────────────────────────────────────┐
│ SHARE YOUR GUIDE                            │
│ ├─ Guide Link [Copy]                        │
│ └─ QR Code (with download PNG/SVG/PDF)      │
│                                             │
│ GENERATE ONE-PAGE ACCESS FLYER              │
│ ├─ [Generate & Download]                    │
│ └─ [Customization Options]                  │
│                                             │
│ GENERATE PDF VERSION OF GUIDE               │
│ ├─ [Generate & Download] ⏳ Generating...   │
│ └─ [Customization Options]                  │
└─────────────────────────────────────────────┘
```

---

### 3.2 Dashboard Editor `P1`

#### 3.2.1 Drag-and-Drop Reordering

**User Story:** As a host, I want to reorder Wi-Fi networks, house rules, and appliances by dragging them, so that I can prioritize the most important items for my guests.

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

#### 3.2.2 Live Preview Side-by-Side

**User Story:** As a host on desktop, I want to see a live preview of my property page alongside the editor, so that I can see changes in real-time without switching tabs.

**Acceptance Criteria:**
- [x] Desktop only (≥1024px): Split-screen view with editor left, preview right
- [x] Preview updates as user types (debounced 500ms)
- [x] Toggle button to show/hide preview panel
- [x] Preview uses iframe or component rendering of guest view
- [x] Mobile/tablet: Keep existing "Preview" button that opens new tab

---

#### 3.2.3 Property Duplication

**User Story:** As a host with multiple similar properties, I want to duplicate an existing property, so that I can quickly create new listings without re-entering common information.

**Acceptance Criteria:**
- [x] "Duplicate" option in property card menu (⋮)
- [x] "Duplicate" option in property editor header menu
- [x] Creates copy with name "[Original Name] (Copy)"
- [x] Copies all content: Wi-Fi networks, rules, appliances, sections, emergency contacts
- [x] New property starts as Draft (unpublished)
- [x] User redirected to new property editor after duplication
- [x] Confirmation toast: "Property duplicated successfully"

---

### 3.3 Content Management

#### 3.3.1 Host Photo Upload `P1`

**User Story:** As a host, I want to upload my photo to the Basic Info tab, so that guests see a personal touch when viewing my property page.

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

#### 3.3.2 Rich Text Formatting `P2`

**User Story:** As a host, I want to format text in my welcome message and custom sections with bold, italic, and lists, so that I can make important information stand out.

**Acceptance Criteria:**
- [x] Toolbar with: Bold, Italic, Bullet list, Numbered list
- [x] Applies to: Welcome message, Custom section content
- [x] Stored as HTML/Markdown in database
- [x] Renders correctly on guest property page
- [x] Character count accounts for formatting characters
- [x] Mobile-friendly toolbar

**Technical Notes:**
- Recommend `tiptap` or `lexical` for lightweight rich text
- Store as HTML, sanitize on render

---

#### 3.3.3 Property Templates `P2`

**User Story:** As a new host, I want to start from a template when creating a property, so that I have a helpful starting point with common rules and sections.

**Acceptance Criteria:**
- [x] Template selection step when creating new property
- [x] Templates available:
  - **Blank** — Start from scratch
  - **Apartment** — Common apartment rules, typical appliances
  - **House** — Outdoor space rules, garage/parking info
  - **Studio** — Compact layout, essential info only
- [x] Template pre-fills: House rules, Appliances, Custom sections
- [x] User can edit all pre-filled content
- [x] "Skip" option to start blank

---

### 3.4 Authentication `P2`

#### 3.4.1 Google OAuth Login

**User Story:** As a host, I want to sign up and log in with my Google account, so that I don't need to remember another password.

**Acceptance Criteria:**
- [x] "Continue with Google" button on signup page
- [x] "Continue with Google" button on login page
- [x] Uses Supabase Auth Google provider
- [x] On first OAuth login, creates account and redirects to dashboard
- [x] On subsequent logins, signs in and redirects to dashboard
- [x] Existing email/password users can link Google account in settings

**Design:**
```
┌────────────────────────────────────────────┐
│  🔵 Continue with Google                   │
└────────────────────────────────────────────┘
                    or
────────────────────────────────────────────
```

---

#### 3.4.2 Password Strength Indicator

**User Story:** As a host creating an account, I want to see password strength feedback, so that I can create a secure password.

**Acceptance Criteria:**
- [x] 4-segment progress bar below password field
- [x] Color-coded levels: Weak (red), Fair (orange), Good (yellow), Strong (green)
- [x] Text feedback with suggestions: "Weak · Add uppercase, number"
- [x] Requirements: 8+ chars, 1 uppercase, 1 number
- [x] Appears on: Signup, Reset Password, Change Password pages

**Visual:**
```
Password
┌────────────────────────────────────────────┐
│ ••••••••••••                          [👁] │
└────────────────────────────────────────────┘
░░░░░░░░░░░░░░░░░░░░                          ← 2/4 segments filled
Fair · Add uppercase letter
```

---

### 3.5 Analytics & Performance `P2`

#### 3.5.1 Analytics Events Integration

**User Story:** As the product team, we want to track user behavior events, so that we can measure feature adoption and improve the product.

**Acceptance Criteria:**
- [x] Event tracking utility function created
- [x] Events tracked:
  - `dashboard_viewed` (property_count)
  - `property_created` (property_id)
  - `property_edited` (property_id, section)
  - `property_published` / `property_unpublished` (property_id)
  - `property_deleted` (property_id)
  - `qr_downloaded` (property_id, format, size)
  - `preview_opened` (property_id)
  - `qr_scan` (property_id, timestamp)
  - Auth events: `signup_*`, `login_*`, `logout`, `password_reset_*`
- [x] Console logging in development
- [x] Ready for analytics provider integration (Posthog, Mixpanel, etc.)

---

#### 3.5.2 Offline Caching for Guest Pages

**User Story:** As a guest, I want critical property info (Wi-Fi, emergency contacts) to work offline, so that I can access it even with poor connectivity.

**Acceptance Criteria:**
- [x] Service worker caches property page on first visit
- [x] Offline indicator shown when connection lost
- [x] Cached data: Wi-Fi credentials, emergency contacts, house rules
- [x] Cache invalidation when property updated (via ETag or version)
- [x] Works on: `/stay/[slug]` pages only

**Technical Notes:**
- Use `next-pwa` or custom service worker
- Cache API for offline storage

---

### 3.6 Guest Access Control & Invites `P0`

#### 3.6.1 Public vs Invite-Only Mode

**User Story:** As a host, I want to control whether my guide is publicly accessible or invite-only, so I can manage who views my property information.

**Acceptance Criteria:**
- [x] Property settings → "Access Control" section
- [x] Radio toggle: Public / Invite-Only (default: Public)
- [x] When Invite-Only selected:
  - Public URL shows "Access Restricted" page
  - Options: "Enter Access Code" or "Contact Host for Access"
- [x] Current mode indicator in property editor header
- [x] Mode persists per property

**Database Changes:**
```sql
ALTER TABLE properties ADD COLUMN access_mode TEXT DEFAULT 'public'
  CHECK (access_mode IN ('public', 'invite_only'));
```

---

#### 3.6.2 Forced Guest Registration

**User Story:** As a host, I want to optionally require guests to register before viewing my guide, so I can collect contact information for remarketing.

**Acceptance Criteria:**
- [x] Property settings: "Require Guest Registration" toggle (default: OFF)
- [x] When enabled, first-time visitors see registration gate
- [x] Registration form collects:
  - Full name (required)
  - Email (required)
  - Number of additional guests (optional)
- [x] After registration: Immediate guide access
- [x] Cookie persists registration for 30 days (no re-entry)
- [x] Purpose statement: "This allows the host to collect contact info for newsletters, updates, etc."
- [x] Privacy compliance: Link to privacy policy
- [x] GDPR compliant: Data stored long-term with user consent

**Database Changes:**
```sql
CREATE TABLE guest_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  additional_guests INTEGER DEFAULT 0,
  registered_at TIMESTAMPTZ DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX idx_guest_registrations_property ON guest_registrations(property_id);
CREATE INDEX idx_guest_registrations_email ON guest_registrations(email);
```

---

#### 3.6.3 Guest Invite Management

**User Story:** As a host, I want to create time-limited invites for specific guests with check-in/out dates, so I can control when and how long they access my guide.

**Acceptance Criteria:**
- [x] New "Invites" tab in main navigation (Dashboard, Guides, **Invites**, Help Center)
- [x] "Create Invite" button opens form:
  - Guest name (required)
  - Guest email (required)
  - Property selection (dropdown)
  - Check-in date (required)
  - Check-out date (required)
  - Lead time before check-in (days, default: 7)
  - Access duration after checkout (days, default: 3)
  - Custom welcome message (optional, 500 chars)
- [x] Auto-generated 8-character access code (e.g., "XJ8K2P9M")
- [x] Email sent to guest via Resend:
  - Welcome message
  - Access code
  - Guide link with code pre-filled
  - Access window dates
  - Host contact info
- [x] Invite list displays:
  - Guest name, email
  - Property name
  - Check-in / Check-out dates
  - Access window: "[date] to [date]"
  - Status badge: Pending (gray) / Active (green) / Expired (red) / Revoked (red)
  - Actions dropdown: Resend Email, Edit, Delete
- [x] Resend limit: Max 2 resends per 24 hours per invite
- [x] Dashboard widget: "Invites Created" count
- [x] Empty state: "No invites yet. Create your first invite to get started."

**Email Template:**
```
Subject: Welcome to [Property Name] - Your Digital Guide

Hi [Guest Name],

Your digital guide for [Property Name] is ready!

📅 Your Stay: [Check-in] to [Check-out]
🔑 Access Code: XJ8K2P9M
🔗 View Guide: [URL with code]

Your guide will be available starting [lead time date] and
accessible until [expiry date].

[Custom Message if provided]

Need help? Contact [Host Name] at [Host Email]

Welcome!
```

**Database Changes:**
```sql
CREATE TABLE guest_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  lead_time_days INTEGER DEFAULT 7,
  post_checkout_days INTEGER DEFAULT 3,
  access_code TEXT UNIQUE NOT NULL,
  custom_message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'revoked')),
  email_sent_at TIMESTAMPTZ,
  email_resend_count INTEGER DEFAULT 0,
  last_resend_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_guest_invites_property ON guest_invites(property_id);
CREATE INDEX idx_guest_invites_code ON guest_invites(access_code);
CREATE INDEX idx_guest_invites_email ON guest_invites(guest_email);

-- Access code generator
CREATE OR REPLACE FUNCTION generate_access_code()
RETURNS TEXT AS $$
BEGIN
  RETURN UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
END;
$$ LANGUAGE plpgsql;
```

---

#### 3.6.4 Invite Status Automation

**User Story:** As a host, I want invites to automatically update status based on dates, so I don't manually manage access windows.

**Acceptance Criteria:**
- [x] Scheduled job runs daily (or on page load):
  - Pending → Active: When current_date >= (check_in - lead_time)
  - Active → Expired: When current_date > (check_out + post_checkout)
- [x] Real-time validation on guest page access
- [x] Expired invites show distinct styling in list (strikethrough, red badge)
- [ ] Optional: Email guest 1 day before expiry (future enhancement)

**Technical Notes:**
- Vercel Cron or Supabase Edge Function scheduled job
- Alternative: Status check on page load (acceptable for MVP)

---

#### 3.6.5 Guest Registration Data Export

**User Story:** As a host, I want to export guest registration data as CSV, so I can add contacts to my email marketing system.

**Acceptance Criteria:**
- [x] "Data" tab in property editor shows registrations table:
  - Columns: Name, Email, Additional Guests, Registration Date
  - Sortable by date
  - Search filter by name/email
- [x] "Export CSV" button above table
- [x] CSV includes: Full Name, Email, Additional Guests, Registration Date, IP Address
- [x] Filename: `[property-slug]-registrations-[YYYY-MM-DD].csv`
- [x] Empty state: "No guest registrations yet. Enable forced registration in property settings."
- [x] Privacy note: "Guest data stored securely. Export and use data in compliance with privacy laws."

**CSV Format:**
```csv
Full Name,Email,Additional Guests,Registration Date,IP Address
John Doe,john@example.com,2,2026-01-15 14:30:00,192.168.1.1
```

---

#### 3.6.6 Contact Host Form (Blocked Access)

**User Story:** As a guest without an invite code, I want to request access from the host, so I can view the guide if needed.

**Acceptance Criteria:**
- [x] Blocked access page shows:
  - Heading: "Access Restricted"
  - Message: "This guide is invite-only. To request access, contact the host or enter your access code below."
  - Two options:
    1. "Enter Access Code" input + Submit button
    2. "Contact Host for Access" button
- [x] Contact form modal:
  - Your name (required)
  - Your email (required)
  - Message (optional, 500 chars max)
  - [Send Request] button
- [x] Form submission:
  - Sends email to host via Resend
  - Success message: "Your request sent. Host will contact you directly."
  - Rate limit: 1 request per email per 24 hours
- [x] Email to host:
  - Subject: "Access Request for [Property Name]"
  - Guest details + message
  - Quick action link: "Create Invite" (pre-fills email)
  - Reply-to: Guest email

**Email Template to Host:**
```
Subject: Access Request for [Property Name]

Hi [Host Name],

A guest requested access to your property guide.

Name: [Guest Name]
Email: [Guest Email]
Message: [Guest Message]

Create invite for this guest:
[Link to Invites page with email pre-filled]

Or reply directly to this email.
```

---

### 3.7 Interactive Maps System `P0`

#### 3.7.1 Map Creation & Category Management

**User Story:** As a host, I want to create reusable maps with categorized pins, so I can show guests local recommendations organized by type.

**Acceptance Criteria:**
- [x] New "Map" tab in property editor navigation
- [x] "Add Map" button opens creation modal
- [x] Map creation form:
  - Map title (internal use, required)
  - "Show Guide Address on Map?" toggle (default: Yes)
  - Pin Categories section:
    - Category title (required)
    - Pin color dropdown: Blue, Red, Yellow, Green, Purple, Orange
    - [Add Category] button for multiple categories
    - Remove category (X icon)
  - [Create Map] button
- [x] Account-level maps list:
  - Map title
  - Pin count: "45/100 pins"
  - Actions: Edit, Delete
- [x] Map assignment section:
  - "Set Active Map For This Guide" dropdown
  - Lists all user's maps
  - [Save] button
- [x] One map reusable across multiple properties
- [x] Warning at 90 pins: "Approaching pin limit (90/100)"
- [x] Block at 100 pins: "Pin limit reached. Remove pins or contact support."

**Database Changes:**
```sql
CREATE TABLE maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  show_property_address BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE map_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  map_id UUID REFERENCES maps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  color TEXT NOT NULL CHECK (color IN ('blue', 'red', 'yellow', 'green', 'purple', 'orange')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE map_pins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES map_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  place_id TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE properties ADD COLUMN active_map_id UUID REFERENCES maps(id) ON DELETE SET NULL;

CREATE INDEX idx_maps_user ON maps(user_id);
CREATE INDEX idx_map_categories_map ON map_categories(map_id);
CREATE INDEX idx_map_pins_category ON map_pins(category_id);
```

**Map Pricing & Limits:**
- Google Maps API budget: $50/month (~7,000 map loads, ~17,500 autocomplete requests)
- Pin limit: 100 per map
- Categories: Unlimited per map
- Maps per user: Unlimited

---

#### 3.7.2 Pin Management with Location Search

**User Story:** As a host, I want to add pins to my map by searching for locations, so I can easily add restaurants, attractions, and landmarks.

**Acceptance Criteria:**
- [x] Map editing interface displays:
  - Google Maps embed (centered on property address or default) — Deferred to 3.7.3
  - [Add Map Pin] button
  - [Filter Map] button (filter by category)
  - Current pins list grouped by category
- [x] Add pin modal:
  - Pin title (required)
  - Pin location: Search field with Google Places Autocomplete
    - Dropdown suggestions as user types
    - Selects: Name, address, lat/lng, place_id
  - Map preview updates with selected location — Deferred to 3.7.3
  - Alternative: Manual pin drop on map — Deferred to 3.7.3
  - Pin description (optional, 500 chars)
  - Categorize this pin: Dropdown of map's categories (required)
  - [Add Map Pin] button
- [x] Pin list shows:
  - Category headers with color indicator dot
  - Pin title, address (truncated)
  - Edit / Delete icons
- [x] Edit pin: Same modal, pre-filled values
- [x] Delete pin: Confirmation dialog
- [x] Empty state: "No map pins exist. Try adding a new map pin."
- [x] Pin counter updates: "45/100 pins"

**Technical Notes:**
- Google Places Autocomplete: `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`
- Google Maps JavaScript API for display
- Store place_id for future Google data sync

---

#### 3.7.3 Guest View - Interactive Map Tab

**User Story:** As a guest, I want to view an interactive map with categorized recommendations, so I can explore nearby places organized by type.

**Acceptance Criteria:**
- [ ] Guest guide navigation shows "Map" tab (only if property.active_map_id set)
- [ ] Map tab displays:
  - Full-height interactive Google Map
  - Property location pin (if show_property_address = true)
  - All pins color-coded by category
  - Category filter legend (floating panel):
    - Checkboxes for each category
    - Category name + color dot
    - Pin count per category
    - Toggle category visibility
- [ ] Pin interaction:
  - Click pin: Info window with title, description, address
  - "Get Directions" button (opens Google Maps in new tab)
- [ ] Filter functionality:
  - Unchecked categories: Pins hidden
  - Filter state persists in localStorage during session
  - "Show All" / "Hide All" quick buttons
- [ ] Mobile optimizations:
  - Touch-friendly map controls
  - Collapsible filter panel (bottom sheet)
  - Swipe to expand/collapse
- [ ] Tab hidden if no active map assigned

**Guest Map UI:**
```
┌─────────────────────────────────────────┐
│  Home | Info | Map | Contact            │
├─────────────────────────────────────────┤
│  📍 Map Tab                             │
│                                         │
│  ┌──────────────┐                       │
│  │ Filters      │  [Interactive Map]    │
│  │ ☑ Restaurants│   with pins          │
│  │ ☑ Beach Clubs│                       │
│  │ ☑ Attractions│                       │
│  │ [Show All]   │                       │
│  └──────────────┘                       │
└─────────────────────────────────────────┘
```

---

#### 3.7.4 Category Filter System

**User Story:** As a guest, I want to filter map pins by category, so I can focus on specific types of recommendations.

**Acceptance Criteria:**
- [ ] Category legend displays:
  - Category name
  - Color indicator (matching pin color)
  - Pin count: "Restaurants (12)"
  - Checkbox to toggle visibility
- [ ] Interaction:
  - Uncheck category: Hide all pins in that category
  - Check category: Show all pins in that category
  - Filter state persists during session (localStorage)
- [ ] Quick actions:
  - "Show All" button: Check all categories
  - "Hide All" button: Uncheck all categories
- [ ] Mobile: Bottom sheet with categories, swipe to open/close
- [ ] Accessible: Keyboard navigation, ARIA labels

---

## 4. Technical Architecture

### 4.1 New Dependencies

| Feature | Library | Purpose |
|---------|---------|---------|
| Drag-and-drop | `@dnd-kit/core`, `@dnd-kit/sortable` | Accessible drag-and-drop |
| PDF generation (simple) | `jspdf` | QR code PDF export |
| PDF generation (full guide) | `puppeteer`, `puppeteer-core` | High-quality server-side PDF |
| Rich text | `tiptap` | Lightweight rich text editor |
| Offline | `workbox` / `next-pwa` | Service worker management |
| Google Maps | `@googlemaps/js-api-loader` | Map display and interactions |
| CSV export | Native JS | Generate CSV files from data |

### 4.2 Database Schema Changes

```sql
-- Add order column to existing tables
ALTER TABLE wifi_networks ADD COLUMN order_index INTEGER DEFAULT 0;
ALTER TABLE house_rules ADD COLUMN order_index INTEGER DEFAULT 0;
ALTER TABLE appliances ADD COLUMN order_index INTEGER DEFAULT 0;
ALTER TABLE custom_sections ADD COLUMN order_index INTEGER DEFAULT 0;

-- Add host photo to profiles
ALTER TABLE profiles ADD COLUMN avatar_url TEXT;

-- Guest access control
ALTER TABLE properties ADD COLUMN access_mode TEXT DEFAULT 'public'
  CHECK (access_mode IN ('public', 'invite_only'));

-- Guest registrations
CREATE TABLE guest_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  additional_guests INTEGER DEFAULT 0,
  registered_at TIMESTAMPTZ DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX idx_guest_registrations_property ON guest_registrations(property_id);
CREATE INDEX idx_guest_registrations_email ON guest_registrations(email);

-- Guest invites
CREATE TABLE guest_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  lead_time_days INTEGER DEFAULT 7,
  post_checkout_days INTEGER DEFAULT 3,
  access_code TEXT UNIQUE NOT NULL,
  custom_message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'revoked')),
  email_sent_at TIMESTAMPTZ,
  email_resend_count INTEGER DEFAULT 0,
  last_resend_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_guest_invites_property ON guest_invites(property_id);
CREATE INDEX idx_guest_invites_code ON guest_invites(access_code);
CREATE INDEX idx_guest_invites_email ON guest_invites(guest_email);

CREATE OR REPLACE FUNCTION generate_access_code()
RETURNS TEXT AS $$
BEGIN
  RETURN UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
END;
$$ LANGUAGE plpgsql;

-- Interactive maps
CREATE TABLE maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  show_property_address BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE map_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  map_id UUID REFERENCES maps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  color TEXT NOT NULL CHECK (color IN ('blue', 'red', 'yellow', 'green', 'purple', 'orange')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE map_pins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES map_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  place_id TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE properties ADD COLUMN active_map_id UUID REFERENCES maps(id) ON DELETE SET NULL;

CREATE INDEX idx_maps_user ON maps(user_id);
CREATE INDEX idx_map_categories_map ON map_categories(map_id);
CREATE INDEX idx_map_pins_category ON map_pins(category_id);

-- Analytics events table (optional, if self-hosted)
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  event_data JSONB,
  user_id UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 4.3 Storage Buckets

- `avatars` — Host profile photos (public read, authenticated write)
- `property-images` — Already exists, reuse if needed
- `pdf-exports` — Temporary storage for generated PDFs (24hr auto-delete, private)

### 4.4 External Services

- **Resend** — Email delivery for invites, access requests, notifications
- **Google Maps JavaScript API** — Map display and interactions
- **Google Places API** — Location autocomplete for pin search
- **Puppeteer** — Server-side PDF generation (runs in API route)

### 4.5 Environment Variables

```env
# Existing
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
RESEND_FROM
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

# New (if needed)
GOOGLE_MAPS_API_KEY  # Can reuse NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
PDF_GENERATION_TIMEOUT_MS=30000  # 30 second timeout
MAX_CONCURRENT_PDF_GENERATIONS=3
```

---

## 5. Implementation Phases

### Phase 1: QR Code Enhancements (Already Completed in existing PRD)
1. QR Code Download Formats (PNG, SVG, PDF)
2. QR Code Branding Toggle
3. Print-Ready Templates

### Phase 2: Dashboard UX (Already Completed in existing PRD)
4. Drag-and-Drop Reordering
5. Host Photo Upload
6. Property Duplication
7. Live Preview Side-by-Side

### Phase 3: Authentication & Polish (Already Completed in existing PRD)
8. Password Strength Indicator
9. Google OAuth Login
10. Rich Text Formatting
11. Property Templates
12. Analytics Events Integration
13. Offline Caching for Guest Pages

### Phase 4: Guest Access Control Foundation (2 weeks) **NEW**
14. Database schema: properties.access_mode, guest_invites table
15. Public/Invite-Only mode toggle in property settings
16. Access code generation & validation
17. Blocked access page with "Enter Code" form
18. Contact Host form for access requests

### Phase 5: Invite Management (2 weeks) **NEW**
19. Invites tab in main navigation
20. Create invite form (guest details, dates, lead time, post-checkout)
21. Invite list view with status indicators
22. Email templates via Resend for invites
23. Resend/Edit/Delete invite actions (2 resends per 24hrs limit)

### Phase 6: Registration & Data Export (1 week) **NEW**
24. Forced registration toggle & form
25. Guest registrations database table
26. Registration submissions in Data tab
27. CSV export functionality
28. Privacy compliance messaging

### Phase 7: Invite Automation (1 week) **NEW**
29. Scheduled job for status updates (pending → active → expired)
30. Real-time access validation on guest pages
31. Expiry notifications (optional)

### Phase 8: Enhanced PDF Export (2 weeks) **NEW**
32. Server-side Puppeteer setup
33. PDF generation API route
34. Custom PDF template design (cover, TOC, sections)
35. Customization options modal
36. Loading states & progress indicators

### Phase 9: Interactive Maps Foundation (2 weeks) **NEW**
37. Database schema: maps, map_categories, map_pins tables
38. Map tab in property editor
39. Map creation form with categories
40. Account-level maps management
41. Map assignment to properties

### Phase 10: Map Pin Management (2 weeks) **NEW**
42. Google Places API integration
43. Add pin modal with location search
44. Map display with pins
45. Pin editing & deletion
46. Pin limit enforcement (100 per map)
47. Category color coding

### Phase 11: Guest Map Experience (1 week) **NEW**
48. Guest map tab in property view
49. Interactive map with color-coded pins
50. Category filter legend
51. Pin info windows with directions link
52. Mobile-responsive map UI

**Phases 4-11 Total: 13-14 weeks**

---

## 6. Success Metrics

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| QR download usage | 0% | 50%+ hosts download at least once | `qr_downloaded` events |
| Drag-drop adoption | 0% | 30%+ hosts reorder items | `property_edited` with reorder |
| Property duplication | 0% | 20%+ multi-property hosts use | `property_created` with source |
| Google OAuth adoption | 0% | 25%+ new signups | `signup_completed` with method |
| Offline cache hits | 0% | 10%+ guest page views | Service worker analytics |
| **Invite feature adoption** | 0% | 30%+ hosts create invites | `guest_invites` count |
| **PDF export usage** | 0% | 40%+ hosts generate PDF | `pdf_downloaded` events |
| **Maps created** | 0% | 25%+ hosts create maps | `maps` count |
| **Average pins per map** | 0 | 5+ pins | `map_pins` / `maps` |
| **Guest map engagement** | 0% | 60%+ guests view map tab | Analytics: map tab clicks |
| **Forced registration adoption** | 0% | 15%+ hosts enable | Properties with registration enabled |
| **CSV exports** | 0 | 50+ exports/month | `csv_export` events |

---

## 7. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Drag-drop performance on large lists | Medium | Low | Virtualize lists with 20+ items |
| PDF generation slow (Puppeteer) | Medium | Medium | Generate server-side with queue, show progress |
| Service worker cache conflicts | High | Low | Version cache, clear on update |
| Rich text XSS vulnerabilities | High | Medium | Sanitize HTML on save and render |
| Google OAuth config complexity | Low | Medium | Document setup steps clearly |
| **Google Maps API costs exceed budget** | High | Medium | Monitor usage, set alerts at $40, cap at $50/month |
| **Invite email delivery failures** | Medium | Low | Use Resend with retry logic, show status in UI |
| **Access code brute force attempts** | Medium | Low | Rate limit access attempts (5 per hour per IP) |
| **GDPR compliance for guest data** | High | Low | Privacy policy, data retention documented, user consent |
| **Pin limit circumvention** | Low | Low | Enforce server-side validation on pin creation |
| **PDF generation server memory issues** | Medium | Medium | Limit concurrent PDF generations to 3, queue others |
| **Map search quota exhaustion** | Medium | Medium | Cache autocomplete results, debounce search input |

---

## 8. Out of Scope

- Two-factor authentication
- Session management (view/revoke devices)
- Multi-language support
- White-label/custom domains
- Mobile native app
- **Guest-suggested pins** (moderated by host) — Future enhancement
- **Automatic invite expiry emails** — Future enhancement
- **Map collaboration** (multiple hosts editing same map) — Future enhancement
- **Advanced map analytics** (pin click tracking, popular pins) — Future enhancement
- **SMS invite delivery** (in addition to email) — Future enhancement
- **Bulk invite creation** (CSV upload) — Future enhancement
- **Recurring guests** (auto-extend access for repeat visitors) — Future enhancement

---

## 9. Open Questions

| Question | Options | Decision Owner | Status |
|----------|---------|----------------|--------|
| Analytics provider | Posthog, Mixpanel, Amplitude | Product | TBD |
| Template content source | Hardcoded vs user-editable | Product | TBD |
| Offline cache scope | Full page vs critical sections only | Engineering | TBD |
| **Invite email delivery** | Resend custom templates | Product | ✅ RESOLVED: Use existing Resend |
| **Google Maps budget** | $50/month starter | Product | ✅ RESOLVED: $50/month, monitor usage |
| **PDF generation method** | Puppeteer server-side | Engineering | ✅ RESOLVED: Server-side for quality |
| **GDPR compliance** | Long retention with consent | Legal/Product | ✅ RESOLVED: Keep long-term, compliant |
| **Invite resend limits** | 2 per 24hrs | Product | ✅ RESOLVED: Max 2 resends per 24hrs |
| **Blocked access UI** | Contact host form | Product | ✅ RESOLVED: Yes, include form |
| **Map pin limits** | 100 per map | Engineering | ✅ RESOLVED: 100 pins, revisit if needed |
| **CSV export** | Include feature | Product | ✅ RESOLVED: Yes, add CSV export |
| PDF generation queue | How to handle concurrent requests? | Engineering | TBD - Limit to 3 concurrent? |
| Map API quota alerts | Email notification at $40 spend? | Product/Engineering | TBD |
| Guest invite expiry notifications | Email 1 day before expiry? | Product | TBD - Future enhancement |

---

## Appendix: Design References

- Host Dashboard wireframes: `/design-documentation/features/host-dashboard/README.md`
- QR Code specifications: `/design-documentation/features/qr-code-system/README.md`
- Authentication flows: `/design-documentation/features/host-authentication/README.md`
