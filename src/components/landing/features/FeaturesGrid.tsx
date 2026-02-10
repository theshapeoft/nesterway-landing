import { FeatureCard } from "./FeatureCard";
import { features } from "@/lib/data/features";

export function FeaturesGrid() {
  return (
    <section className="py-24 md:py-32 bg-white" id="features">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-12 bg-ocean-500" />
              <span className="text-sm font-medium tracking-widest uppercase text-ocean-600">
                Features
              </span>
              <div className="h-px w-12 bg-ocean-500" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-neutral-900 mb-4">
              Everything you need
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Thoughtfully designed features that make hosting easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
