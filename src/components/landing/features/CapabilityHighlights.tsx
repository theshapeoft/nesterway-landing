import { Rocket, Share2, Heart } from "lucide-react";
import { Section, SectionHeader } from "../shared";
import { landingContent } from "@/lib/data/landing-content";

const iconMap = {
  rocket: Rocket,
  share: Share2,
  heart: Heart
};

export function CapabilityHighlights() {
  const { capabilities } = landingContent;

  return (
    <Section variant="gradient">
      <SectionHeader
        title={capabilities.title}
        centered
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {capabilities.highlights.map((highlight, index) => {
          const Icon = iconMap[highlight.icon as keyof typeof iconMap];

          return (
            <div key={index} className="text-center">
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-ocean-600 text-white flex items-center justify-center mx-auto mb-6">
                <Icon className="w-8 h-8" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {highlight.title}
              </h3>

              {/* Description */}
              <p className="text-lg text-muted-foreground">
                {highlight.description}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
