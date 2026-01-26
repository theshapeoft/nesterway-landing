import { FeatureCard } from "./FeatureCard";
import { features } from "@/lib/data/features";
import { Section, SectionHeader } from "../shared";

export function FeaturesGrid() {
  return (
    <Section variant="default" id="features">
      <SectionHeader
        subtitle="Features"
        title="Everything Your Guests Need"
        description="All the tools to create amazing digital property guides that save you time and delight your guests"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {features.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>
    </Section>
  );
}
