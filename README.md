# Travelama Landing Page

TouchStay-inspired marketing landing page for Travelama. A comprehensive, production-ready landing page with full interactivity, animations, and Travelama-specific content.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server (port 3001)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit http://localhost:3001 to view the landing page.

## ✨ What's Included

- ✅ **Navigation**: Sticky header with dropdowns & mobile menu
- ✅ **Hero**: Animated background, dual CTAs, social proof
- ✅ **Testimonials**: Auto-rotating carousel (6 testimonials)
- ✅ **Features**: 12 feature cards with icons
- ✅ **Pricing**: Interactive calculator with slider
- ✅ **Integrations**: Auto-scrolling partner logos
- ✅ **Blog**: 3 article preview cards
- ✅ **Footer**: Comprehensive links & newsletter
- ✅ **Animations**: Scroll-triggered fade-ins
- ✅ **Responsive**: Mobile-first design (375px → 1920px+)

## 📁 Structure

```
src/
├── app/
│   ├── globals.css          # Styles + animations
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── landing/             # All landing components
│   │   ├── navigation/      # Header, menus
│   │   ├── hero/            # Hero + background
│   │   ├── features/        # Features grid
│   │   ├── pricing/         # Calculator
│   │   └── ...
│   └── ui/                  # shadcn components
├── lib/
│   └── data/                # All content
│       ├── landing-content.ts
│       ├── testimonials.ts
│       ├── features.ts
│       └── blog.ts
└── hooks/
    └── useInView.ts         # Scroll animations
```

## 📝 Edit Content

All content is in `/src/lib/data/`:

- **Hero/Sections**: `landing-content.ts`
- **Testimonials**: `testimonials.ts`
- **Features**: `features.ts`
- **Blog Articles**: `blog.ts`

Simply edit these files and save - the page updates automatically in dev mode.

## 🎨 Design Tokens

**Colors**:
- Ocean: `#0E7490` (primary)
- Sand: `#F5F0E8` (backgrounds)
- Coral: `#F97316` (accents)

**Breakpoints**:
- Mobile: 640px
- Tablet: 768px
- Desktop: 1024px
- Large: 1280px

## 🧪 Test It Works

```bash
npm run dev
```

Then verify:
- [ ] Hover "Features" → dropdown appears
- [ ] Click hamburger menu → mobile menu opens
- [ ] Wait 5 seconds → testimonial changes
- [ ] Drag pricing slider → price updates
- [ ] All CTAs navigate correctly

## 🚢 Deploy

### Vercel
```bash
vercel
```

### Netlify
Build command: `npm run build`
Publish directory: `.next`

## 🔧 Customize

### Change Port
Edit `package.json` → `"dev"` script → change `-p 3001` to your port

### Add New Section
1. Create component in `src/components/landing/[category]/`
2. Export in category's `index.ts`
3. Import in `src/app/page.tsx`

### Modify Content
Edit files in `src/lib/data/`

## 📊 Performance

Target Lighthouse scores:
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 90+

## 🛠️ Tech Stack

- Next.js 16.1.0 (Turbopack)
- React 19
- Tailwind CSS v4
- shadcn/ui
- embla-carousel-react
- TypeScript

## 📚 Documentation

See `/Users/tyrelsmythe/travelama/LANDING_PAGE_IMPLEMENTATION.md` for full implementation details.

---

**Status**: ✅ Production Ready
**Port**: 3001
**Main App Port**: 3000 (separate project)
