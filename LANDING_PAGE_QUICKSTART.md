# Landing Page Quick Start Guide

## 🚀 Run the Landing Page

```bash
cd /Users/tyrelsmythe/travelama
npm run dev
```

Open http://localhost:3000 in your browser to view the landing page.

## 📋 What You'll See

The landing page includes these sections (in order):

1. **Navigation** - Sticky header with logo, dropdowns, mobile menu
2. **Hero** - Animated background, headline, CTAs, social proof
3. **What Is** - Educational section explaining digital guides
4. **Process Steps** - 3-step visualization
5. **Features Grid** - 12 feature cards
6. **Capability Highlights** - 3 benefits columns
7. **Testimonials** - Auto-rotating carousel (6 testimonials)
8. **Customer Quote** - Featured testimonial
9. **Pricing** - Interactive calculator + 3 tier cards
10. **Integrations** - Partner logos carousel
11. **Blog Preview** - 3 article cards
12. **Final CTA** - Call to action
13. **Footer** - Links, social, newsletter

## 🎨 Interactive Features to Test

### Navigation
- **Desktop**: Hover over "Features" or "Resources" to see dropdown menus
- **Mobile**: Click hamburger menu (≡) to open mobile navigation

### Testimonial Carousel
- Auto-rotates every 5 seconds
- Pause by hovering over carousel
- Click arrow buttons to navigate manually

### Pricing Calculator
- Drag the property count slider (1-20)
- Toggle between Monthly/Annual billing
- Watch price update in real-time

### Integration Carousel
- Auto-scrolls continuously
- Shows partner logos

### Scroll Animations
- Scroll down the page
- Watch sections fade in as they enter viewport

## 🔍 Quick Verification

### Check These Work:
1. **Mobile Menu**: Click hamburger → menu opens → X closes it
2. **Dropdown Navigation**: Hover "Features" → see submenu
3. **Hero CTAs**: Click "Start Free Trial" → goes to /signup
4. **Demo Link**: Click "See Demo Property" → goes to /stay/demo-property
5. **Pricing Slider**: Drag slider → price updates
6. **Carousel**: Wait 5 seconds → testimonial changes
7. **Footer Links**: All links navigate correctly

### Responsive Check:
```bash
# Open Chrome DevTools (F12)
# Toggle device toolbar (Ctrl/Cmd + Shift + M)
# Test these sizes:
# - iPhone SE (375px)
# - iPad (768px)
# - Desktop (1280px)
```

## 🛠️ Common Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Run production build locally
npm start

# Type checking
npm run type-check
```

## 📝 Need to Change Content?

All content is in `/src/lib/data/`:

- **Hero/Sections**: `landing-content.ts`
- **Testimonials**: `testimonials.ts`
- **Features**: `features.ts`
- **Integrations**: `integrations.ts`
- **Blog**: `blog.ts`

Edit these files, save, and the page auto-updates.

## 🎯 Next Steps

1. ✅ Verify all sections load
2. ✅ Test mobile responsiveness
3. ✅ Check all links work
4. ✅ Test interactive features
5. 📝 Review content for accuracy
6. 🖼️ Replace placeholder images
7. 🚀 Deploy to production

## 🐛 Troubleshooting

**Port 3000 already in use?**
```bash
# Kill the process
kill -9 $(lsof -ti:3000)
# Or use a different port
PORT=3001 npm run dev
```

**Build failing?**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

**Styles not loading?**
```bash
# Restart dev server
# Press Ctrl+C to stop
# Run npm run dev again
```

## 📊 Performance Check

After running `npm run build`, you'll see:
- Build time
- Page sizes
- Static routes

The landing page should be:
- ○ (Static) - pre-rendered
- Fast to load
- Under 500KB total

---

**Ready to test?** Run `npm run dev` and open http://localhost:3000 🎉
