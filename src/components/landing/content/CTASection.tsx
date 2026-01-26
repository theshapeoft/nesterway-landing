import { Section, CTAButton } from "../shared";
import { landingContent } from "@/lib/data/landing-content";

export function CTASection() {
  const { cta } = landingContent;

  return (
    <Section variant="ocean">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          {cta.title}
        </h2>
        <p className="text-xl text-white/90 mb-10">
          {cta.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <CTAButton
            href="/signup"
            variant="secondary"
            size="xl"
          >
            {cta.primaryButton}
          </CTAButton>
          <CTAButton
            href="/stay/demo-property"
            variant="outline"
            size="xl"
            className="border-white text-white hover:bg-white/10"
          >
            {cta.secondaryButton}
          </CTAButton>
        </div>
      </div>
    </Section>
  );
}
