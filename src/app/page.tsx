import {
  LandingNav,
  HeroSection,
  TestimonialCarousel,
  WhatIsSection,
  FeaturesGrid,
  CapabilityHighlights,
  ProcessSteps,
  PricingCalculator,
  IntegrationCarousel,
  CustomerQuote,
  BlogPreview,
  CTASection,
  LandingFooter
} from "@/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <LandingNav />

      {/* Hero Section */}
      <HeroSection />

      {/* What Is Digital Guide */}
      <WhatIsSection />

      {/* Process Steps */}
      <ProcessSteps />

      {/* Features Grid */}
      <FeaturesGrid />

      {/* Capability Highlights */}
      <CapabilityHighlights />

      {/* Testimonial Carousel */}
      <TestimonialCarousel />

      {/* Customer Quote */}
      <CustomerQuote />

      {/* Pricing Calculator */}
      <PricingCalculator />

      {/* Integration Carousel */}
      <IntegrationCarousel />

      {/* Blog Preview */}
      <BlogPreview />

      {/* Final CTA */}
      <CTASection />

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
