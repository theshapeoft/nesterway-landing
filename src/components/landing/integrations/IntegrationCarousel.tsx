"use client";

import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { integrations } from "@/lib/data/integrations";
import { Section, SectionHeader } from "../shared";

export function IntegrationCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    dragFree: true
  });

  // Auto-rotation
  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);

    return () => clearInterval(autoplay);
  }, [emblaApi]);

  return (
    <Section variant="sand" id="integrations">
      <SectionHeader
        subtitle="Integrations"
        title="Works With Your Favorite Tools"
        description="Seamlessly integrate with the platforms you already use"
        centered
      />

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-12 items-center">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="flex-[0_0_200px] min-w-0"
            >
              <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-32">
                {/* Placeholder for logo - in production, use actual logo images */}
                <div className="text-center">
                  <div className="text-4xl mb-2">
                    {integration.name[0]}
                  </div>
                  <div className="text-sm font-semibold text-gray-700">
                    {integration.name}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logo Grid (Alternative static display) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-12">
        {integrations.slice(0, 10).map((integration) => (
          <div
            key={integration.id}
            className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center aspect-square"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">
                {integration.name[0]}
              </div>
              <div className="text-xs font-medium text-gray-600">
                {integration.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
