import Link from "next/link";
import { ArrowRight, Star, Play } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-sand-50 overflow-hidden">
      {/* Subtle grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative elements */}
      <div className="absolute top-20 right-[15%] w-64 h-64 rounded-full bg-coral-400/10 blur-3xl" />
      <div className="absolute bottom-40 left-[10%] w-96 h-96 rounded-full bg-ocean-500/5 blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-12 bg-ocean-600" />
            <span className="text-sm font-medium tracking-widest uppercase text-ocean-600">
              The Art of Welcome
            </span>
          </div>

          {/* Main headline - Editorial style */}
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium text-neutral-900 leading-[0.95] tracking-tight mb-8">
            Every great stay
            <br />
            <span className="text-coral-500">begins with</span>
            <br />
            a great guide
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-neutral-600 max-w-2xl mb-12 leading-relaxed">
            Create beautiful digital property guides that your guests will love. 
            QR code access, offline-ready, and updated in real-time.
          </p>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-16">
            <Link 
              href="/signup"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white text-lg font-medium rounded-full hover:bg-neutral-800 transition-all duration-300 hover:gap-4"
            >
              Start for free
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link 
              href="/stay/demo-property"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-neutral-700 text-lg font-medium rounded-full border border-neutral-200 hover:border-neutral-300 hover:bg-sand-100 transition-all duration-300"
            >
              <Play className="w-5 h-5 text-coral-500" />
              See a live demo
            </Link>
          </div>

          {/* Social proof - Refined */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 pt-8 border-t border-sand-300">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1,2,3,4].map((i) => (
                  <div 
                    key={i} 
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-sand-200 to-sand-300 border-2 border-sand-50 flex items-center justify-center text-sm font-medium text-neutral-600"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-neutral-600 ml-2">1,200+ hosts</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex text-coral-500">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-neutral-600">4.9/5 rating</span>
            </div>
            
            <div className="text-neutral-500">
              <span className="text-neutral-900 font-semibold">Free forever</span> for your first property
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path 
            d="M0 120V60C240 100 480 20 720 40C960 60 1200 100 1440 60V120H0Z" 
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
