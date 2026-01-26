import { Card, CardContent } from "@/components/ui";
import { Section, SectionHeader } from "../shared";
import { landingContent } from "@/lib/data/landing-content";

export function WhatIsSection() {
  const { whatIs } = landingContent;

  return (
    <Section variant="ocean" id="what-is">
      <SectionHeader
        title={whatIs.title}
        description={whatIs.description}
        centered
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12">
        {whatIs.benefits.map((benefit, index) => (
          <Card
            key={index}
            className="border-none bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
          >
            <CardContent className="p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-3">
                {benefit.title}
              </h3>
              <p className="text-white/90">
                {benefit.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
