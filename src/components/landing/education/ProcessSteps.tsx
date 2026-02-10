import { landingContent } from "@/lib/data/landing-content";

export function ProcessSteps() {
  const { process } = landingContent;

  return (
    <section className="py-24 md:py-32 bg-sand-100">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-12 bg-ocean-500" />
              <span className="text-sm font-medium tracking-widest uppercase text-ocean-600">
                How it Works
              </span>
              <div className="h-px w-12 bg-ocean-500" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-neutral-900 mb-4">
              {process.title}
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              {process.subtitle}
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {process.steps.map((step, index) => (
              <div key={step.number} className="relative group">
                {/* Connection line (desktop) */}
                {index < process.steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+3rem)] right-[-1rem] h-px bg-sand-300 group-hover:bg-ocean-300 transition-colors" />
                )}

                {/* Step card */}
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                  {/* Step number */}
                  <div className="w-14 h-14 rounded-xl bg-neutral-900 text-white text-xl font-serif font-semibold flex items-center justify-center mb-6">
                    {step.number}
                  </div>

                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
