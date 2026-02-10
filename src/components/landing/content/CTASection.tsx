import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 md:py-32 bg-neutral-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-coral-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-ocean-500/10 blur-3xl" />
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-6xl font-medium text-white mb-6 leading-tight">
            Ready to transform your
            <br />
            <span className="text-coral-400">guest experience?</span>
          </h2>
          <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
            Join 1,200+ hosts who&apos;ve stopped answering repetitive questions 
            and started getting better reviews.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/signup"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-neutral-900 text-lg font-medium rounded-full hover:bg-sand-100 transition-all duration-300 hover:gap-4"
            >
              Start for free
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              href="/stay/demo-property"
              className="inline-flex items-center gap-3 px-8 py-4 text-white text-lg font-medium rounded-full border border-white/20 hover:bg-white/10 transition-colors"
            >
              See live demo
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-12 pt-12 border-t border-white/10">
            <p className="text-neutral-500 text-sm mb-4">Trusted by hosts worldwide</p>
            <div className="flex items-center justify-center gap-8 text-neutral-600">
              <span className="text-2xl font-serif font-medium text-neutral-400">Airbnb</span>
              <span className="text-2xl font-serif font-medium text-neutral-400">VRBO</span>
              <span className="text-2xl font-serif font-medium text-neutral-400">Booking.com</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
