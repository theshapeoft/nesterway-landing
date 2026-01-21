---
title: Property Digital Manual — User Journey
description: Complete user journey analysis for the property page experience
feature: property-digital-manual
last-updated: 2025-12-21
version: 1.0.0
related-files:
  - ./README.md
  - ./screen-states.md
  - ./interactions.md
status: approved
---

# User Journey — Property Digital Manual

## Primary User Goal

Get essential property information immediately after arrival to feel settled and oriented.

## User Context

**Who**: Tired traveler who just arrived at a short-term rental
**When**: First 30 minutes after arrival, often late evening
**Where**: Standing in the property, phone in hand
**Emotional state**: Tired, slightly stressed, wants to settle in
**Tech comfort**: High (uses apps daily)

## Success Criteria

The user successfully:
1. Connects to Wi-Fi (primary goal)
2. Understands basic house rules
3. Knows how to get help if needed
4. Feels welcomed and confident

---

## Journey Map

### Phase 1: Discovery (0-30 seconds)

**Trigger**: Guest notices QR code in property (entry, living room, welcome card)

**User Action**: Opens phone camera, scans QR code

**System Response**:
- Native camera recognizes QR
- Prompt to open link appears
- Guest taps to open

**Design Considerations**:
- QR code must be prominently placed
- URL should be short and memorable as backup
- QR links directly to property page (no intermediary)

**Potential Friction**:
- QR code not visible
- Poor lighting for scanning
- Older phone without QR support

**Mitigation**:
- Multiple QR placements suggested to hosts
- High-contrast QR design
- Human-readable URL displayed below QR

---

### Phase 2: First Impression (0-5 seconds)

**Context**: Page loads in browser

**User Sees**:
1. Property name confirms right location
2. Welcome message creates warmth
3. Quick access bar shows essentials immediately
4. Page feels fast and responsive

**Critical Metrics**:
- First Contentful Paint: < 1 second
- Largest Contentful Paint: < 1.5 seconds
- Time to Interactive: < 2 seconds

**Design Decisions**:
- Property name is first text element (confirms location)
- Quick access bar is above the fold on all devices
- Skeleton loading for smooth perceived performance
- Minimal initial JavaScript for fast TTI

**Emotional Goal**: "This looks helpful and easy to use"

---

### Phase 3: Wi-Fi Connection (5-30 seconds)

**User Goal**: Connect to internet to message family "we arrived safely"

**Primary Flow**:

```
User taps Wi-Fi icon in quick access bar
         ↓
Bottom sheet opens with Wi-Fi details
         ↓
    ┌────┴────┐
    ↓         ↓
QR Scan    Tap to Copy
    ↓         ↓
Camera       Password copied
opens        Toast confirms
    ↓         ↓
Auto-join   Paste in Wi-Fi
network     settings
    ↓         ↓
  Connected!
```

**Design Decisions**:
- Wi-Fi is first item in quick access bar
- Password displayed in large, monospace font
- QR code for one-tap connection (iOS 11+)
- Manual copy as fallback
- "Having trouble?" expandable section

**Interaction Details**:
1. Tap Wi-Fi icon → Bottom sheet slides up (300ms)
2. Network name displayed prominently
3. Password in copy field with visible copy button
4. QR code centered below password
5. Tap copy → Haptic feedback + toast "Copied!"
6. QR instructions for camera-based connection

**Edge Cases**:
- Multiple networks (show all with labels)
- Guest network vs. Main network (clearly labeled)
- No password (open network - rare but possible)

**Success State**: User is online within 30 seconds of scanning initial QR

---

### Phase 4: Orientation (30 seconds - 5 minutes)

**User Goal**: Understand the space and rules

**Typical Browse Pattern**:
1. Scroll past welcome to see sections
2. Tap "House Rules" to expand
3. Scan rules quickly (bullet format)
4. Note check-out time
5. Glance at appliance guides if needed

**Content Structure — House Rules**:
- 5-7 key rules maximum
- Bullet points, not paragraphs
- Most important first (noise, smoking)
- Honest and friendly tone

**Design Decisions**:
- Sections are collapsed by default (reduces overwhelm)
- Section icons provide visual scanning
- Expand/collapse is smooth (300ms)
- Expanded state persists during session
- Critical rules (no smoking) use warning styling

**Interaction Pattern**:
- Tap section header to expand/collapse
- Chevron rotates to indicate state
- Content slides down smoothly
- Focus moves to expanded content (accessibility)

---

### Phase 5: Just-in-Time Information (Ongoing)

**Context**: Throughout stay, guest returns for specific info

**Common Return Visits**:
- Check-out procedure (morning of departure)
- Appliance help (washing machine, coffee)
- Transport info (getting to airport)
- Local recommendations (via Explore link)

**Design for Return Visits**:
- Quick access bar always visible at top
- Sections remember expanded state (session)
- Page loads instantly from cache (PWA)
- Deep links work (e.g., /stay/sliema#checkout)

---

### Phase 6: Exploration Link (Variable timing)

**User Goal**: Discover local recommendations

**Trigger Points**:
- "Explore Sliema" button in quick access
- "Explore [Area]" CTA in footer
- Natural curiosity after settling in

**Design Decisions**:
- Explore CTA uses accent color (coral) for visibility
- Positioned in quick access for easy discovery
- Repeated in footer for scrolled context
- Links to area guide with back navigation

---

## Edge Cases & Error States

### Offline Access

**Scenario**: Guest loses internet or is on data roaming

**Solution**:
- Critical content cached via Service Worker
- Cached: Wi-Fi details, house rules, emergency contacts
- Not cached: Images, area guide content
- Offline indicator shown subtly

### QR Scan Fails

**Scenario**: Camera doesn't recognize QR or link is broken

**Solution**:
- Human-readable URL below QR code
- Error page with host contact info
- Suggest manual URL entry

### Page Load Failure

**Scenario**: Slow connection or server error

**Solution**:
- Skeleton loading state (not blank)
- Retry button on error
- Cached version if available
- Host contact as fallback

---

## Device Considerations

### Small Phones (320px width)

- Quick access items may scroll horizontally
- Typography scales down appropriately
- Touch targets remain 44px minimum
- Modals use full-screen bottom sheet

### Large Phones (390px+ width)

- Comfortable single-column layout
- All quick access visible without scroll
- Optimal reading experience

### Tablets (768px+ width)

- Centered content container (max 640px)
- Larger typography comfortable for desk use
- Side-by-side layout possible for some content

---

## Accessibility Journey

### Screen Reader Flow

1. Page title announced: "Sliema Sanctuary — Travelama"
2. Welcome message is first heading
3. Quick access bar is navigation landmark
4. Sections are collapsible regions
5. Focus management on modal open/close

### Keyboard Navigation

1. Tab through quick access buttons
2. Enter to open bottom sheets
3. Escape to close modals
4. Tab cycles within modal
5. Focus returns to trigger on close

### Motor Accessibility

- All touch targets 44px minimum
- Swipe gestures have tap alternatives
- No time limits on interactions
- Animations respect reduced-motion

---

## Metrics & Analytics

### Track These Events

| Event | Measurement | Target |
|-------|-------------|--------|
| `page_view` | Page loads | Baseline |
| `wifi_opened` | Wi-Fi section opened | 90%+ |
| `wifi_copied` | Password copied | 70%+ |
| `wifi_qr_shown` | QR code viewed | 50%+ |
| `section_expanded` | Any section opened | 80%+ |
| `explore_clicked` | Area guide link clicked | 30%+ |
| `error_displayed` | Error state shown | < 1% |
| `offline_served` | Cached version served | Track |

### Session Patterns

- Average session duration
- Return visit rate
- Sections viewed per session
- Time to first interaction

---

## Related Documentation

- [Screen States](screen-states.md) — Visual specifications for each state
- [Interactions](interactions.md) — Detailed interaction patterns
- [Accessibility](accessibility.md) — Full accessibility requirements
