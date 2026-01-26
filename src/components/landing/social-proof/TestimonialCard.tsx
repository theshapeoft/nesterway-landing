import { Card, CardContent } from "@/components/ui";
import { StarRating } from "./StarRating";
import { Testimonial } from "@/lib/data/testimonials";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6 md:p-8 flex flex-col h-full">
        {/* Rating */}
        <StarRating rating={testimonial.rating} className="mb-4" />

        {/* Quote */}
        <blockquote className="text-lg text-gray-700 mb-6 flex-1">
          "{testimonial.quote}"
        </blockquote>

        {/* Author */}
        <div className="flex items-center gap-4">
          {testimonial.image && (
            <div className="w-12 h-12 rounded-full bg-ocean-100 flex items-center justify-center text-ocean-700 font-semibold">
              {testimonial.author[0]}
            </div>
          )}
          <div>
            <div className="font-semibold text-gray-900">
              {testimonial.author}
            </div>
            <div className="text-sm text-muted-foreground">
              {testimonial.role}
              {testimonial.propertyCount && (
                <span> • {testimonial.propertyCount} properties</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
