import { StarRating } from "../social-proof/StarRating";
import { Section } from "../shared";
import { featuredTestimonial } from "@/lib/data/testimonials";

export function CustomerQuote() {
  return (
    <Section variant="ocean">
      <div className="max-w-4xl mx-auto text-center">
        {/* Quote Icon */}
        <div className="text-6xl text-white/30 mb-6">&ldquo;</div>

        {/* Rating */}
        <StarRating
          rating={featuredTestimonial.rating}
          size="lg"
          className="justify-center mb-8"
        />

        {/* Quote */}
        <blockquote className="text-2xl md:text-3xl font-medium text-white mb-8 leading-relaxed">
          {featuredTestimonial.quote}
        </blockquote>

        {/* Author */}
        <div className="flex items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-semibold">
            {featuredTestimonial.author[0]}
          </div>
          <div className="text-left">
            <div className="text-lg font-semibold text-white">
              {featuredTestimonial.author}
            </div>
            <div className="text-white/80">
              {featuredTestimonial.role}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
