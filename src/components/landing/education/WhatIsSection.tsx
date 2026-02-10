import { Smartphone, RefreshCw, Sparkles } from "lucide-react";

const benefits = [
  {
    icon: Smartphone,
    title: "For Your Guests",
    description: "Scan a QR code and instantly access WiFi, house rules, and local gems. No app downloads, works offline, beautifully designed.",
  },
  {
    icon: RefreshCw,
    title: "For You",
    description: "Update once, everyone sees the latest info. Stop answering the same questions. Reclaim your time and peace of mind.",
  },
  {
    icon: Sparkles,
    title: "For Your Business",
    description: "Professional presentation that elevates your brand. Better reviews, fewer complaints, guests who recommend you.",
  },
];

export function WhatIsSection() {
  return (
    <section className="py-24 md:py-32 bg-white" id="what-is">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-ocean-500" />
            <span className="text-sm font-medium tracking-widest uppercase text-ocean-600">
              What is Nesterway
            </span>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-medium text-neutral-900 leading-tight mb-6">
                A modern alternative to
                <span className="text-coral-500"> printed binders</span> and
                <span className="text-coral-500"> unread emails</span>
              </h2>
              <p className="text-xl text-neutral-600 leading-relaxed">
                Your guests scan a QR code and instantly access everything they need — 
                WiFi passwords, house rules, local recommendations, emergency contacts. 
                Updates sync in real-time. Works offline in remote areas.
              </p>
            </div>
            
            {/* Visual mockup placeholder */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-sand-100 to-sand-200 border border-sand-300 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-4 rounded-xl bg-white shadow-lg border border-sand-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-sand-100" />
                    <div>
                      <div className="h-4 w-32 bg-sand-200 rounded" />
                      <div className="h-3 w-24 bg-sand-100 rounded mt-2" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 w-full bg-sand-100 rounded" />
                    <div className="h-3 w-4/5 bg-sand-100 rounded" />
                    <div className="h-3 w-3/4 bg-sand-100 rounded" />
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="h-20 rounded-lg bg-ocean-50 border border-ocean-100" />
                    <div className="h-20 rounded-lg bg-coral-400/10 border border-coral-400/20" />
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-coral-400/10 blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-ocean-500/10 blur-xl" />
            </div>
          </div>

          {/* Benefits grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="group p-8 rounded-2xl bg-sand-50 hover:bg-sand-100 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-ocean-500/10 text-ocean-600 flex items-center justify-center mb-5 group-hover:bg-ocean-500 group-hover:text-white transition-colors duration-300">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
