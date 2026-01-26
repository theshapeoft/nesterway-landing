import { CTAButton } from "../shared";
import { AnimatedBackground } from "./AnimatedBackground";
import { landingContent } from "@/lib/data/landing-content";

export function HeroSection() {
  const { hero } = landingContent;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-ocean-50 via-white to-sand-50">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 pt-20 pb-16">
        <div className="max-w-5xl mx-auto text-center">
          {/* Stat Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-ocean-200 shadow-sm mb-8">
            <span className="text-sm font-semibold text-ocean-700">
              ⚡ {hero.statBadge}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            {hero.headline}
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            {hero.subheadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <CTAButton
              href={hero.primaryCTA.href}
              variant="primary"
              size="xl"
            >
              {hero.primaryCTA.text}
            </CTAButton>
            <CTAButton
              href={hero.secondaryCTA.href}
              variant="outline"
              size="xl"
            >
              {hero.secondaryCTA.text}
            </CTAButton>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <span className="text-yellow-500 mr-2">★★★★★</span>
              <span>Loved by 1,000+ hosts</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300" />
            <div>Free forever for 1 property</div>
            <div className="hidden sm:block w-px h-4 bg-gray-300" />
            <div>No credit card required</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-gray-400 rounded-full" />
        </div>
      </div>
    </section>
  );
}
