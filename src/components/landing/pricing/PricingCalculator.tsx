"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui";
import { Section, SectionHeader, CTAButton } from "../shared";
import { landingContent } from "@/lib/data/landing-content";

export function PricingCalculator() {
  const { pricing } = landingContent;
  const [propertyCount, setPropertyCount] = useState(1);
  const [isAnnual, setIsAnnual] = useState(false);

  const calculatePrice = () => {
    if (propertyCount <= 1) return { monthly: 0, annual: 0 };

    const baseMonthlyPerProperty = propertyCount <= 5 ? 12 : 10;
    const baseAnnualPerProperty = propertyCount <= 5 ? 10 : 8;

    const monthly = propertyCount * baseMonthlyPerProperty;
    const annual = propertyCount * baseAnnualPerProperty * 12;

    return { monthly, annual };
  };

  const { monthly, annual } = calculatePrice();
  const displayPrice = isAnnual ? annual : monthly;
  const displayPeriod = isAnnual ? 'year' : 'month';

  return (
    <Section variant="default" id="pricing">
      <SectionHeader
        subtitle="Pricing"
        title={pricing.title}
        description={pricing.subtitle}
        centered
      />

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {pricing.tiers.map((tier, index) => (
          <Card
            key={index}
            className={`relative ${
              tier.popular
                ? 'border-ocean-600 border-2 shadow-xl scale-105'
                : 'border-gray-200'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-ocean-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
            )}
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {tier.name}
              </h3>
              <div className="text-sm text-muted-foreground mb-4">
                {tier.properties}
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold text-gray-900">
                  ${tier.price}
                  {tier.price > 0 && (
                    <span className="text-lg text-muted-foreground font-normal">
                      /{tier.period}
                    </span>
                  )}
                  {tier.price === 0 && (
                    <span className="text-lg text-muted-foreground font-normal">
                      /{tier.period}
                    </span>
                  )}
                </div>
                {tier.annualPrice && isAnnual && (
                  <div className="text-sm text-ocean-600 font-semibold mt-1">
                    Save ${(tier.price - tier.annualPrice!) * 12}/year
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                {tier.description}
              </p>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <span className="text-ocean-600 mr-2">✓</span>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <CTAButton
                href="/signup"
                variant={tier.popular ? 'primary' : 'outline'}
                size="lg"
                className="w-full"
              >
                Get Started
              </CTAButton>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Calculator */}
      <Card className="max-w-2xl mx-auto border-2 border-ocean-200">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            {pricing.calculator.title}
          </h3>
          <p className="text-muted-foreground text-center mb-8">
            {pricing.calculator.description}
          </p>

          {/* Property Count Slider */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-semibold text-gray-700">
                Number of Properties
              </label>
              <span className="text-2xl font-bold text-ocean-600">
                {propertyCount}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={propertyCount}
              onChange={(e) => setPropertyCount(Number(e.target.value))}
              className="w-full h-2 bg-ocean-200 rounded-lg appearance-none cursor-pointer accent-ocean-600"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>1</span>
              <span>20</span>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span
              className={`text-sm font-medium ${
                !isAnnual ? 'text-gray-900' : 'text-muted-foreground'
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isAnnual ? 'bg-ocean-600' : 'bg-gray-300'
              }`}
              aria-label="Toggle billing period"
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  isAnnual ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${
                isAnnual ? 'text-gray-900' : 'text-muted-foreground'
              }`}
            >
              Annual
              <span className="ml-1 text-xs text-ocean-600 font-semibold">
                (Save 17%)
              </span>
            </span>
          </div>

          {/* Price Display */}
          <div className="text-center p-6 bg-ocean-50 rounded-lg">
            {displayPrice === 0 ? (
              <div>
                <div className="text-5xl font-bold text-ocean-600 mb-2">
                  Free
                </div>
                <div className="text-lg text-gray-700">
                  Forever for 1 property
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl font-bold text-ocean-600 mb-2">
                  ${displayPrice}
                  <span className="text-2xl text-muted-foreground">
                    /{displayPeriod}
                  </span>
                </div>
                {isAnnual && (
                  <div className="text-sm text-ocean-600 font-semibold">
                    Save ${monthly * 12 - annual} compared to monthly billing
                  </div>
                )}
              </div>
            )}
            <CTAButton
              href="/signup"
              variant="primary"
              size="lg"
              className="mt-6"
            >
              Start Free Trial
            </CTAButton>
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}
