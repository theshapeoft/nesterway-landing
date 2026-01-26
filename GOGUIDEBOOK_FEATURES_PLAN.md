# GoGuidebook Competitor Features - Implementation Plan

**Date:** 2026-01-23
**Competitor:** GoGuidebook
**Status:** Planning Phase

---

## Feature Overview

Based on competitor analysis, implement 3 major feature areas:
1. Guest Access Control & Invites
2. Enhanced Quick Share (PDF Export)
3. Interactive Map System with Categories

---

## 1. Guest Access Control & Invites System

### 1.1 Public vs Invite-Only Mode `P0`

**User Story:** As a host, I want to control whether my guide is publicly accessible or invite-only, so I can manage who views my property information.

**Acceptance Criteria:**
- [ ] Property settings: "Access Control" section with radio toggle
  - Public: Anyone with link/QR can access
  - Invite-Only: Requires guest invitation to access
- [ ] Default: Public mode
- [ ] When switched to Invite-Only:
  - Public URL shows "Access Restricted" message
  - Provides "Enter Access Code" option
  - Shows host contact for access requests
- [ ] Setting persists per property
- [ ] Clear UI indicator in property editor showing current mode

**Database Schema:**
```sql
ALTER TABLE properties ADD COLUMN access_mode TEXT DEFAULT 'public' CHECK (access_mode IN ('public', 'invite_only'));
```

---

### 1.2 Forced Registration `P0`

**User Story:** As a host, I want to optionally require guests to register before viewing my guide, so I can collect contact information for remarketing.

**Acceptance Criteria:**
- [ ] Property settings: "Require Guest Registration" toggle (default: OFF)
- [ ] When enabled, first-time visitors see registration form before guide access
- [ ] Registration form collects:
  - Full name (required)
  - Email (required)
  - Additional guests count (optional)
  - Purpose: "This allows the host to collect contact info for newsletters, updates, etc."
- [ ] After registration, guest gets immediate access
- [ ] Cookie/localStorage persists registration (no re-entry for 30 days)
- [ ] Host can view submissions in Data tab

**Database Schema:**
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

### 1.3 Guest Invite Management `P0`

**User Story:** As a host, I want to create time-limited invites for specific guests with check-in/out dates, so I can control when and how long they can access my guide.

**Acceptance Criteria:**
- [ ] New "Invites" tab in main navigation
- [ ] "Create Invite" button opens invite form:
  - Guest name (required)
  - Guest email (required)
  - Check-in date (required)
  - Check-out date (required)
  - Lead time before access (days before check-in, default: 7)
  - Access duration after checkout (days after check-out, default: 3)
  - Property selection (dropdown)
  - Optional: Custom welcome message
- [ ] System auto-generates unique access code per invite
- [ ] Email sent to guest with:
  - Welcome message
  - Access code
  - Link to guide (includes code in URL)
  - Access availability dates
  - Host contact info
- [ ] Invite list shows:
  - Guest name, email
  - Property name
  - Check-in/out dates
  - Access window (calculated)
  - Status: Pending, Active, Expired
  - Actions: Resend email, Edit, Delete
- [ ] Access validation:
  - Before lead time: "Your guide will be available on [date]"
  - Active period: Full guide access
  - After expiry: "Your access has expired. Contact host for extension."
- [ ] Dashboard shows "Invites Created" count

**Database Schema:**
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
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_guest_invites_property ON guest_invites(property_id);
CREATE INDEX idx_guest_invites_code ON guest_invites(access_code);
CREATE INDEX idx_guest_invites_email ON guest_invites(guest_email);

-- Function to generate unique 8-char access code
CREATE OR REPLACE FUNCTION generate_access_code()
RETURNS TEXT AS $$
BEGIN
  RETURN UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
END;
$$ LANGUAGE plpgsql;
```

**Email Template:**
```
Subject: Welcome to [Property Name] - Your Digital Guide

Hi [Guest Name],

Your digital guide for [Property Name] is ready!

📅 Your Stay: [Check-in Date] to [Check-out Date]
🔑 Access Code: [ACCESS-CODE]
🔗 Guide Link: [URL with code]

Your guide will be available starting [lead time date] and will remain accessible until [expiry date].

[Custom Message if provided]

Need help? Contact [Host Name] at [Host Email]

Welcome!
```

---

### 1.4 Invite Status Automation `P1`

**User Story:** As a host, I want invites to automatically update status based on dates, so I don't manually manage access windows.

**Acceptance Criteria:**
- [ ] Cron job/scheduled task runs daily:
  - Updates status from 'pending' to 'active' when current date >= (check_in - lead_time)
  - Updates status from 'active' to 'expired' when current date > (check_out + post_checkout)
- [ ] Guest page access check validates status in real-time
- [ ] Expired invites show in dashboard with distinct styling
- [ ] Optional: Email notification to guest 1 day before expiry

**Technical Notes:**
- Use Supabase Edge Function scheduled via pg_cron or Vercel Cron
- Alternative: Check status on page load (acceptable for MVP)

---

### 1.5 Guest Registration Data Export `P1`

**User Story:** As a host, I want to export guest registration data as CSV, so I can add contacts to my email marketing system.

**Acceptance Criteria:**
- [ ] "Data" tab shows guest registrations table:
  - Columns: Name, Email, Additional Guests, Registered Date
  - Sortable by date
  - Search/filter by name or email
- [ ] "Export CSV" button above table
- [ ] CSV includes: Full Name, Email, Additional Guests, Registration Date, IP Address
- [ ] Filename: `[property-slug]-registrations-[YYYY-MM-DD].csv`
- [ ] Empty state: "No guest registrations yet. Enable registration in Details tab."
- [ ] Privacy note: "Guest data is stored securely. Only export and use data in compliance with privacy laws."

**CSV Format:**
```csv
Full Name,Email,Additional Guests,Registration Date,IP Address
John Doe,john@example.com,2,2026-01-15 14:30:00,192.168.1.1
Jane Smith,jane@example.com,0,2026-01-16 09:15:00,192.168.1.2
```

---

### 1.6 Contact Host Form (Blocked Access) `P1`

**User Story:** As a guest without an invite code, I want to request access from the host, so I can view the guide if I need it.

**Acceptance Criteria:**
- [ ] When accessing invite-only property without valid code:
  - Shows "Access Restricted" heading
  - Message: "This guide is invite-only. To request access, contact the host or enter your access code below."
  - Two options presented:
    1. "Enter Access Code" field with Submit button
    2. "Contact Host for Access" button
- [ ] Contact form modal:
  - Your name (required)
  - Your email (required)
  - Message (optional, max 500 chars)
  - [Send Request] button
- [ ] Form submission:
  - Sends email to host with guest details and message
  - Shows success: "Your request has been sent to the host. They will contact you directly."
  - Rate limit: 1 request per email per 24 hours
- [ ] Email to host:
  - Subject: "Access Request for [Property Name]"
  - Body: Guest name, email, message, direct link to create invite
  - Reply-to: Guest email

**Email Template to Host:**
```
Subject: Access Request for [Property Name]

Hi [Host Name],

A guest has requested access to your property guide.

Name: [Guest Name]
Email: [Guest Email]
Message: [Guest Message]

You can create an invite for this guest here:
[Link to Invites page with email pre-filled]

Or reply directly to this email to contact the guest.
```

---

## 2. Enhanced Quick Share - Full Guide PDF Export

### 2.1 Full Guide PDF Download `P1`

**User Story:** As a host, I want to download a complete PDF version of my guide, so I can email it to guests or print physical copies.

**Acceptance Criteria:**
- [ ] "Quick Share" tab in property editor (alongside Details, Content, Map, Data, Analytics)
- [ ] Section: "GENERATE PDF VERSION OF GUIDE"
- [ ] "Generate & Download" button with loading state
- [ ] "Customization Options" button opens modal:
  - Include/exclude sections: WiFi, Rules, Appliances, Emergency Contacts, Custom Sections, Map
  - Header/footer: Property name, host contact, page numbers
  - Branding: Include Travelama logo (toggle)
- [ ] PDF includes:
  - Cover page: Property photo, name, address, host name
  - Table of contents with page numbers
  - All enabled sections with formatting preserved
  - Embedded map image if map exists
  - Footer: "Generated by Travelama.com" (if branding enabled)
- [ ] PDF filename: `[property-slug]-guide-[YYYY-MM-DD].pdf`
- [ ] Analytics event: `pdf_downloaded`

**Technical Notes:**
- **Use server-side Puppeteer** for high-quality PDF generation
- Generate via API route (`/api/properties/[id]/export-pdf`)
- Custom PDF template with professional design:
  - Cover page with property hero image
  - Styled headers with brand colors
  - Icons for each section
  - Proper page breaks and spacing
  - Print-optimized typography
- Max file size: 10MB
- Loading indicator with progress (generation takes 3-5s)
- Consider implementing PDF template in React component, render to HTML, convert via Puppeteer

**UI Layout:**
```
Quick Share Tab
├── SHARE YOUR GUIDE
│   ├── Guide Link [Copy button]
│   └── QR Code (with download options)
├── GENERATE ONE-PAGE ACCESS FLYER
│   ├── [Generate & Download] [Customization Options]
└── GENERATE PDF VERSION OF GUIDE
    ├── [Generate & Download] [Customization Options]
```

---

## 3. Interactive Map System with Categories

### 3.1 Map Creation & Management `P0`

**User Story:** As a host, I want to create reusable maps with categorized pins, so I can show guests local recommendations organized by type.

**Acceptance Criteria:**
- [ ] New "Map" tab in property editor navigation
- [ ] "Add Map" button opens map creation modal
- [ ] Map creation form:
  - Map title (internal, not shown to guests)
  - Pin categories section:
    - Add category with: Category title, Pin color (dropdown: Blue, Red, Yellow, Green, Purple, Orange)
    - Multiple categories supported
    - [Add Category] button
  - "Show Guide Address on Map?" toggle (default: Yes)
- [ ] Account-level maps section shows all created maps:
  - Map title
  - Number of pins
  - Actions: Edit, Delete
- [ ] Map assignment to guide:
  - Dropdown: "Set Active Map For This Guide"
  - Select from existing maps or create new
  - [Save] button
- [ ] One map can be reused across multiple properties

**Database Schema:**
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
  place_id TEXT, -- Google Places ID
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Link maps to properties
ALTER TABLE properties ADD COLUMN active_map_id UUID REFERENCES maps(id) ON DELETE SET NULL;

CREATE INDEX idx_maps_user ON maps(user_id);
CREATE INDEX idx_map_categories_map ON map_categories(map_id);
CREATE INDEX idx_map_pins_category ON map_pins(category_id);
```

---

### 3.2 Pin Management with Location Search `P0`

**User Story:** As a host, I want to add pins to my map by searching for locations, so I can easily add restaurants, attractions, and landmarks.

**Acceptance Criteria:**
- [ ] Map editing interface shows:
  - Google Maps embed (centered on property or default location)
  - "Add Map Pin" button
  - "Filter Map" button (filters by category)
  - Current pins list (grouped by category)
- [ ] Add pin modal:
  - Pin title (required)
  - Pin location: Search field with autocomplete (Google Places API)
  - Map preview shows selected location
  - Pin description (optional, rich text)
  - Categorize this pin: Dropdown of categories for this map
  - [Add Map Pin] button
- [ ] Pin location search:
  - Google Places Autocomplete
  - Returns: Name, address, lat/lng, place_id
  - Map marker updates on selection
  - Allow manual pin dropping on map
- [ ] Pin list shows:
  - Category headers with color indicator
  - Pin title, address
  - Edit/Delete actions
- [ ] Empty state: "No map pins exist. Try adding a new map pin."

**Technical Notes:**
- Use `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` (already in env)
- Google Maps JavaScript API for map display
- Autocomplete widget for location search
- Store place_id for future updates

**Pin Limits:**
- 100 pins maximum per map
- Show warning at 90 pins: "You're approaching the pin limit (90/100)"
- Block pin creation at 100: "Pin limit reached. Remove pins or contact support to increase limit."
- Pin count displayed in map list: "[Map Title] — 45/100 pins"

---

### 3.3 Guest View - Map Tab `P0`

**User Story:** As a guest, I want to view an interactive map with categorized recommendations, so I can explore nearby places organized by type.

**Acceptance Criteria:**
- [ ] Guest guide navigation shows "Map" tab (if property has active map)
- [ ] Map tab displays:
  - Full-screen interactive Google Map
  - Property location pin (if show_property_address = true)
  - All pins color-coded by category
  - Category filter legend:
    - Checkboxes for each category
    - Category color indicators
    - Toggle visibility of pins by category
- [ ] Pin interaction:
  - Click pin: Info window shows title, description, address
  - "Get Directions" link (opens Google Maps in new tab)
- [ ] Mobile-optimized: Responsive map, touch-friendly
- [ ] Tab shown only if property has active_map_id set

**UI Components:**
```
Map Tab (Guest View)
├── Category Filters (Floating panel)
│   ├── ☑ Restaurants (Blue) — 5 pins
│   ├── ☑ Beach Clubs (Yellow) — 3 pins
│   └── ☑ Attractions (Red) — 2 pins
└── Google Map
    ├── Property Pin (if enabled)
    └── Category Pins (color-coded markers)
```

---

### 3.4 Map Category Filtering `P1`

**User Story:** As a guest, I want to filter map pins by category, so I can focus on specific types of recommendations.

**Acceptance Criteria:**
- [ ] Category legend shows category name, color, pin count
- [ ] Checkbox toggles category visibility
- [ ] Unchecked categories: Pins hidden from map
- [ ] Filter state persists during session (localStorage)
- [ ] "Show All" / "Hide All" quick actions
- [ ] Mobile: Collapsible filter panel (bottom sheet)

---

## Implementation Summary

### Phase 1: Guest Access Control Foundation (2 weeks)
1. Database schema: properties.access_mode, guest_invites table
2. Public/Invite-Only mode toggle in property settings
3. Access code generation & validation
4. Blocked access page with "Enter Code" form
5. Contact Host form for access requests

### Phase 2: Invite Management (2 weeks)
6. Invites tab in main navigation
7. Create invite form (guest details, dates, lead time, post-checkout access)
8. Invite list view with status indicators
9. Email templates for invite notifications
10. Resend/Edit/Delete invite actions
11. Rate limiting (2 resends per 24hrs)

### Phase 3: Registration & Data Export (1 week)
12. Forced registration toggle & form
13. Guest registrations database table
14. Registration submissions in Data tab
15. CSV export functionality
16. Privacy compliance messaging

### Phase 4: Invite Automation (1 week)
17. Scheduled job for status updates (pending → active → expired)
18. Expiry notifications
19. Real-time access validation on guest pages

### Phase 5: Enhanced PDF Export (2 weeks)
20. Server-side Puppeteer setup
21. PDF generation API route
22. Custom PDF template design (cover, TOC, sections)
23. Customization options modal
24. Loading states & progress indicators

### Phase 6: Interactive Maps Foundation (2 weeks)
25. Database schema: maps, map_categories, map_pins tables
26. Map tab in property editor
27. Map creation form with categories
28. Account-level maps management
29. Map assignment to properties

### Phase 7: Map Pin Management (2 weeks)
30. Google Places API integration
31. Add pin modal with location search
32. Map display with pins
33. Pin editing & deletion
34. Pin limit enforcement (100 per map)
35. Category color coding

### Phase 8: Guest Map Experience (1 week)
36. Guest map tab in property view
37. Interactive map with color-coded pins
38. Category filter legend
39. Pin info windows with directions link
40. Mobile-responsive map UI

**Total Estimated Time: 13-14 weeks**

---

## Database Migration Checklist

- [ ] Add `access_mode` column to properties
- [ ] Create `guest_registrations` table
- [ ] Create `guest_invites` table
- [ ] Create `generate_access_code()` function
- [ ] Create `maps` table
- [ ] Create `map_categories` table
- [ ] Create `map_pins` table
- [ ] Add `active_map_id` column to properties
- [ ] Set up indexes
- [ ] Set up RLS policies

---

## Technical Dependencies

| Feature | Library | Purpose |
|---------|---------|---------|
| PDF Generation | `puppeteer`, `puppeteer-core` | Server-side high-quality PDF |
| PDF API | Next.js API Route | PDF generation endpoint |
| Google Maps | `@googlemaps/js-api-loader` | Map display |
| Google Places | Google Places API | Location autocomplete |
| Email | Resend (existing) | Invite & access request emails |
| Cron | Vercel Cron or Supabase Edge Function | Invite status automation |
| CSV Export | Native JS | Generate CSV from data |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Invite feature adoption | 30%+ of hosts | `guest_invites` count |
| PDF downloads | 40%+ of hosts | `pdf_downloaded` events |
| Maps created | 25%+ of hosts | `maps` count |
| Average pins per map | 5+ | `map_pins` / `maps` |
| Guest map engagement | 60%+ click on map tab | Analytics: map tab views |

---

## Resolved Decisions

1. **Invite email delivery:** ✅ Use existing Resend with custom HTML templates
2. **Map API budget:** ✅ $50/month starter budget (~7,000 map loads, ~17,500 autocomplete requests)
3. **PDF generation:** ✅ Server-side (Puppeteer) for higher quality, nicely designed output
4. **GDPR compliance:** ✅ Keep data as long as possible but compliant (no auto-delete, long retention with user consent)
5. **Invite resend limit:** ✅ Max 2 resends per 24 hours per invite
6. **Non-invite access:** ✅ Show "Contact Host for Access" form with host email
7. **Map pin limits:** ✅ 100 pins per map (reasonable limit, revisit if needed)
8. **CSV export:** ✅ Include CSV export for guest registration data

### Map Pin Pricing Guidance

**Google Maps API Costs (2026):**
- Maps JavaScript API: $7 per 1,000 loads
- Places Autocomplete: $2.83 per 1,000 requests
- Geocoding: $5 per 1,000 requests

**$50/month budget supports:**
- ~7,000 map loads (if guests view maps)
- ~17,500 Places API autocomplete requests
- Mixed usage: ~5,000 map loads + 8,800 autocomplete = ~$50

**Pin Limit Rationale:**
- 100 pins per map = sufficient for comprehensive local guide
- Average expected: 15-30 pins per map
- Limit prevents runaway costs while remaining generous
- Can increase per-property if host needs more (premium feature later)
