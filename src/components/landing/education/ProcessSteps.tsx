import { ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "../shared";
import { landingContent } from "@/lib/data/landing-content";

export function ProcessSteps() {
  const { process } = landingContent;

  return (
    <Section variant="sand">
      <SectionHeader
        subtitle="How it Works"
        title={process.title}
        description="Three simple steps to transform your guest experience"
        centered
      />

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {process.steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Step Number */}
              <div className="w-16 h-16 rounded-full bg-ocean-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                {step.number}
              </div>

              {/* Arrow (desktop only, not on last step) */}
              {index < process.steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] right-[-3rem] z-[-1]">
                  <ArrowRight className="w-full h-6 text-ocean-300" />
                </div>
              )}

              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
