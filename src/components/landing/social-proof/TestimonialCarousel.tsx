"use client";

import { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TestimonialCard } from "./TestimonialCard";
import { testimonials } from "@/lib/data/testimonials";
import { Section, SectionHeader } from "../shared";

export function TestimonialCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Auto-rotation
  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    // Pause on hover
    const container = emblaApi.rootNode();

    const handleMouseEnter = () => clearInterval(autoplay);
    const handleMouseLeave = () => {
      clearInterval(autoplay);
      const newAutoplay = setInterval(() => {
        emblaApi.scrollNext();
      }, 5000);
      return () => clearInterval(newAutoplay);
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearInterval(autoplay);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [emblaApi]);

  return (
    <Section variant="sand" id="testimonials">
      <SectionHeader
        subtitle="Testimonials"
        title="Loved by Hosts Worldwide"
        description="See what hosts are saying about how Nesterway transformed their guest experience"
      />

      <div className="relative">
        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] min-w-0"
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={scrollPrev}
            className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl hover:bg-ocean-50 flex items-center justify-center transition-all touch-target"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-ocean-600" />
          </button>
          <button
            onClick={scrollNext}
            className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl hover:bg-ocean-50 flex items-center justify-center transition-all touch-target"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-ocean-600" />
          </button>
        </div>
      </div>
    </Section>
  );
}
