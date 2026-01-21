# Product Requirements Document: Host Dashboard & Property Management

**Version**: 1.0
**Created**: 22 December 2025
**Status**: Draft for Review

---

## 1. Executive Summary

### Problem Statement
Property owners currently have no way to create, edit, or manage their property manuals within Travelama. All content is hardcoded, requiring developer intervention for any changes.

### Solution
Build a self-service host dashboard that allows property owners to:
- Sign up and manage their account
- Create and manage multiple properties
- Edit all aspects of their property manual in real-time
- Generate and download QR codes for guest access

### Success Metrics
| Metric | Target |
|--------|--------|
| Host signup completion rate | > 80% |
| Time to create first property | < 10 minutes |
| Property manual completeness | > 90% of sections filled |
| Host satisfaction (NPS) | > 50 |

---

## 2. User Stories

### 2.1 Authentication

#### US-001: Host Signup
**As a** property owner
**I want to** create an account with my email
**So that** I can manage my rental properties

**Acceptance Criteria:**
- [ ] Can sign up with email and password
- [ ] Email verification required before full access
- [ ] Password requirements: 8+ chars, 1 uppercase, 1 number
- [ ] Error messages for invalid inputs
- [ ] Redirect to onboarding after verification

#### US-002: Host Login
**As a** registered host
**I want to** log into my account
**So that** I can access my property dashboard

**Acceptance Criteria:**
- [ ] Can log in with email and password
- [ ] "Forgot password" flow with email reset
- [ ] "Remember me" option for 30-day session
- [ ] Redirect to dashboard after login
- [ ] Show error for invalid credentials

#### US-003: Host Logout
**As a** logged-in host
**I want to** log out of my account
**So that** I can secure my session

**Acceptance Criteria:**
- [ ] Logout button in dashboard header
- [ ] Session cleared on logout
- [ ] Redirect to home page

---

### 2.2 Property Management

#### US-004: Create New Property
**As a** host
**I want to** create a new property listing
**So that** I can generate a digital manual for my guests

**Acceptance Criteria:**
- [ ] "Add Property" button on dashboard
- [ ] Required fields: Property name, Area selection
- [ ] Auto-generate URL slug from property name
- [ ] Property created in "draft" status
- [ ] Redirect to property editor after creation

#### US-005: View Property List
**As a** host
**I want to** see all my properties in one place
**So that** I can manage multiple listings

**Acceptance Criteria:**
- [ ] Dashboard shows all properties as cards
- [ ] Each card shows: name, area, status (draft/published), last updated
- [ ] Quick actions: Edit, View live, Copy link, Delete
- [ ] Empty state with "Add your first property" CTA

#### US-006: Delete Property
**As a** host
**I want to** delete a property I no longer manage
**So that** guests can't access outdated information

**Acceptance Criteria:**
- [ ] Delete option in property menu
- [ ] Confirmation modal with property name
- [ ] Soft delete (can be restored within 30 days)
- [ ] QR codes stop working immediately
- [ ] Success toast after deletion

#### US-007: Publish/Unpublish Property
**As a** host
**I want to** control when my property is live
**So that** I can prepare content before guests see it

**Acceptance Criteria:**
- [ ] Toggle between Draft and Published status
- [ ] Draft properties show "Preview" watermark
- [ ] Only published properties accessible via QR/link
- [ ] Warning if publishing with incomplete sections

---

### 2.3 Property Editor

#### US-008: Edit Basic Information
**As a** host
**I want to** edit my property's basic details
**So that** guests see accurate information

**Editable Fields:**
- [ ] Property name
- [ ] Welcome message (rich text, 500 char max)
- [ ] Host name
- [ ] Host photo (upload or URL)
- [ ] Checkout time (time picker)
- [ ] Property area (dropdown of available areas)

**Acceptance Criteria:**
- [ ] Auto-save on field blur (with "Saving..." indicator)
- [ ] Validation errors shown inline
- [ ] Preview changes before publishing
- [ ] Undo last change option

#### US-009: Manage Wi-Fi Networks
**As a** host
**I want to** add and edit Wi-Fi network details
**So that** guests can easily connect

**Acceptance Criteria:**
- [ ] Add multiple networks (e.g., 2.4GHz and 5GHz)
- [ ] Fields per network: Name, Password, Security type, Description
- [ ] Mark one network as "Primary" (shown first)
- [ ] Reorder networks via drag-and-drop
- [ ] Delete network with confirmation
- [ ] Password field with show/hide toggle

#### US-010: Manage Emergency Contact
**As a** host
**I want to** set emergency contact information
**So that** guests can reach someone if needed

**Acceptance Criteria:**
- [ ] Fields: Name, Phone, Email (at least one contact method required)
- [ ] Phone number validation with country code
- [ ] Email validation
- [ ] Preview how it appears in emergency modal

#### US-011: Manage House Rules
**As a** host
**I want to** add and organize house rules
**So that** guests understand expectations

**Acceptance Criteria:**
- [ ] Add unlimited rules
- [ ] Each rule has: Text, Severity (Normal/Critical)
- [ ] Critical rules highlighted in red
- [ ] Reorder rules via drag-and-drop
- [ ] Delete rule with confirmation
- [ ] Suggested rules templates (optional)

#### US-012: Manage Appliances & How-Tos
**As a** host
**I want to** document how appliances work
**So that** guests don't need to contact me for help

**Acceptance Criteria:**
- [ ] Add unlimited appliances
- [ ] Fields: Name, Location (optional), Instructions (rich text)
- [ ] Support for images in instructions (future)
- [ ] Reorder via drag-and-drop
- [ ] Common appliance templates (optional)

#### US-013: Manage Custom Sections
**As a** host
**I want to** add custom information sections
**So that** I can include property-specific details

**Acceptance Criteria:**
- [ ] Add custom sections (e.g., "Parking", "Check-in Instructions", "Local Tips")
- [ ] Fields: Title, Icon (from preset list), Content (rich text or list)
- [ ] Reorder sections via drag-and-drop
- [ ] Delete section with confirmation
- [ ] Maximum 10 custom sections

#### US-014: Live Preview
**As a** host
**I want to** preview my property page as guests see it
**So that** I can verify my changes look correct

**Acceptance Criteria:**
- [ ] "Preview" button in editor
- [ ] Opens in new tab or side panel
- [ ] Shows mobile view by default (toggleable)
- [ ] "Draft" watermark on preview
- [ ] Real-time updates as content changes

---

### 2.4 QR Code Management

#### US-015: Generate QR Code
**As a** host
**I want to** generate a QR code for my property
**So that** guests can scan it to access the manual

**Acceptance Criteria:**
- [ ] QR code auto-generated for each property
- [ ] Download options: PNG (print-ready), SVG, PDF
- [ ] Size options for download (small, medium, large)
- [ ] QR code includes Travelama branding (optional toggle)
- [ ] Copy direct link button

#### US-016: QR Code Customization (Future)
**As a** host
**I want to** customize my QR code appearance
**So that** it matches my property branding

**Acceptance Criteria:**
- [ ] Color customization (foreground/background)
- [ ] Logo placement option
- [ ] Frame/border styles
- [ ] Preview before download

---

### 2.5 Account Management

#### US-017: Edit Profile
**As a** host
**I want to** update my account details
**So that** my information stays current

**Acceptance Criteria:**
- [ ] Edit name and email
- [ ] Email change requires verification
- [ ] Change password (requires current password)
- [ ] Delete account option (with data export)

#### US-018: Subscription Management (Future)
**As a** host
**I want to** manage my subscription
**So that** I can access premium features

**Acceptance Criteria:**
- [ ] View current plan (Free/Pro/Business)
- [ ] Upgrade/downgrade options
- [ ] Billing history
- [ ] Payment method management

---

## 3. Information Architecture

### 3.1 Dashboard Structure

```
/dashboard
├── / (Property List - default view)
├── /properties/new (Create Property)
├── /properties/[id] (Property Editor)
│   ├── /basic (Basic Info tab)
│   ├── /wifi (Wi-Fi Networks tab)
│   ├── /rules (House Rules tab)
│   ├── /appliances (Appliances tab)
│   ├── /sections (Custom Sections tab)
│   ├── /emergency (Emergency Contact tab)
│   └── /qr (QR Code tab)
├── /account (Account Settings)
└── /billing (Subscription - future)
```

### 3.2 Editor Navigation

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Properties    Sliema Sanctuary    [Preview] [⋮]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Basic Info │ Wi-Fi │ Rules │ Appliances │ Sections │ │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                                                       │   │
│  │                   Tab Content Area                    │   │
│  │                                                       │   │
│  │                                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Status: Draft  •  Last saved: 2 minutes ago                │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐                     │
│  │  Save Draft    │  │   Publish      │                     │
│  └────────────────┘  └────────────────┘                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Data Model Updates

### 4.1 New Tables

```sql
-- Hosts table (extends Supabase auth.users)
CREATE TABLE hosts (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    photo_url TEXT,
    subscription_tier VARCHAR(20) DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties table (updated)
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID NOT NULL REFERENCES hosts(id) ON DELETE CASCADE,
    area_id UUID REFERENCES areas(id) ON DELETE SET NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    welcome_message TEXT,
    host_display_name VARCHAR(100),
    host_photo_url TEXT,
    checkout_time TIME DEFAULT '11:00',
    status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hosts can view own properties"
    ON properties FOR SELECT
    USING (auth.uid() = host_id);

CREATE POLICY "Hosts can insert own properties"
    ON properties FOR INSERT
    WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update own properties"
    ON properties FOR UPDATE
    USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete own properties"
    ON properties FOR DELETE
    USING (auth.uid() = host_id);

-- Public can view published properties
CREATE POLICY "Public can view published properties"
    ON properties FOR SELECT
    USING (status = 'published' AND is_deleted = false);
```

### 4.2 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/signup | Create host account | Public |
| POST | /api/auth/login | Login | Public |
| POST | /api/auth/logout | Logout | Host |
| POST | /api/auth/forgot-password | Request reset | Public |
| POST | /api/auth/reset-password | Reset password | Public |
| GET | /api/properties | List host's properties | Host |
| POST | /api/properties | Create property | Host |
| GET | /api/properties/[id] | Get property details | Host |
| PUT | /api/properties/[id] | Update property | Host |
| DELETE | /api/properties/[id] | Soft delete property | Host |
| POST | /api/properties/[id]/publish | Publish property | Host |
| POST | /api/properties/[id]/unpublish | Unpublish property | Host |
| GET | /api/properties/[id]/qr | Generate QR code | Host |
| PUT | /api/properties/[id]/wifi | Update WiFi networks | Host |
| PUT | /api/properties/[id]/sections | Update sections | Host |
| GET | /api/host/profile | Get host profile | Host |
| PUT | /api/host/profile | Update host profile | Host |

---

## 5. UI/UX Requirements

### 5.1 Design Principles
- **Mobile-first**: Hosts may edit on mobile devices
- **Auto-save**: Never lose work, save on every change
- **Progressive disclosure**: Show advanced options only when needed
- **Immediate feedback**: Confirm all actions with toasts/indicators

### 5.2 Component Library Extensions

| Component | Purpose |
|-----------|---------|
| FormField | Consistent input styling with labels and errors |
| ImageUploader | Drag-drop or click to upload photos |
| RichTextEditor | Basic formatting for descriptions |
| DraggableList | Reorder items with drag handles |
| StatusBadge | Draft/Published/Archived indicators |
| TabNav | Editor section navigation |
| ConfirmModal | Destructive action confirmation |
| LoadingSpinner | Async operation indicator |

### 5.3 Responsive Breakpoints
- **Mobile** (<640px): Single column, bottom sheet modals
- **Tablet** (640-1024px): Two column where appropriate
- **Desktop** (>1024px): Side-by-side preview option

---

## 6. Technical Requirements

### 6.1 Authentication
- **Provider**: Supabase Auth
- **Methods**: Email/password (MVP), Google OAuth (future)
- **Session**: JWT with httpOnly cookie, 7-day expiry
- **Refresh**: Automatic token refresh

### 6.2 File Storage
- **Provider**: Supabase Storage
- **Buckets**: `host-photos`, `property-images`
- **Limits**: 5MB per image, 10 images per property (MVP)
- **Processing**: Client-side resize before upload

### 6.3 Real-time Updates
- **Auto-save**: Debounced (500ms) on input change
- **Optimistic UI**: Show changes immediately, rollback on error
- **Conflict resolution**: Last-write-wins (MVP)

### 6.4 Security
- **RLS**: All property data protected by row-level security
- **Input validation**: Zod schemas on all API routes
- **Rate limiting**: 100 requests/minute per host
- **CSRF**: Protected via Supabase auth

---

## 7. Implementation Phases

### Phase 1: Authentication (Week 1)
- [ ] Set up Supabase project and auth
- [ ] Build signup/login/logout flows
- [ ] Email verification flow
- [ ] Password reset flow
- [ ] Protected route middleware

### Phase 2: Property CRUD (Week 2)
- [ ] Dashboard layout with property list
- [ ] Create property flow
- [ ] Property editor shell with tab navigation
- [ ] Basic info editing
- [ ] Publish/unpublish functionality

### Phase 3: Property Sections (Week 3)
- [ ] Wi-Fi networks management
- [ ] Emergency contact editing
- [ ] House rules management
- [ ] Appliances management
- [ ] Custom sections

### Phase 4: QR & Polish (Week 4)
- [ ] QR code generation and download
- [ ] Live preview functionality
- [ ] Image upload for host photos
- [ ] Auto-save with indicators
- [ ] Error handling and edge cases

---

## 8. Success Criteria

### MVP Launch Criteria
- [ ] Host can complete full signup flow
- [ ] Host can create and publish a property
- [ ] Host can edit all property sections
- [ ] Host can generate and download QR code
- [ ] Guest can access published property via QR/link
- [ ] No critical bugs in core flows

### Quality Requirements
- [ ] All forms have validation with clear errors
- [ ] Auto-save works reliably
- [ ] Page load times < 2 seconds
- [ ] Works on mobile Safari and Chrome
- [ ] Accessibility: keyboard navigable, screen reader compatible

---

## 9. Open Questions

1. **Multi-language support**: Should hosts be able to create manuals in multiple languages?
2. **Property templates**: Should we offer pre-built templates for different property types?
3. **Team access**: Should hosts be able to invite co-hosts or property managers?
4. **Analytics**: What metrics should hosts see about their property usage?
5. **Pricing tiers**: What features differentiate Free vs Pro plans?

---

## 10. Appendix

### A. Competitor Analysis
- **Touch Stay**: Full-featured, complex UI, expensive
- **Hostfully**: Guidebook focused, good UX, limited customization
- **YourWelcome**: Tablet-based, hardware dependent

### B. User Research Findings
- Hosts want quick setup (< 15 minutes for first property)
- Most common sections: Wi-Fi, checkout, house rules, local tips
- Mobile editing is important for on-the-go updates
- QR code placement: inside property, on welcome letter

---

*Document prepared for product and engineering review. Feedback welcome before development begins.*
