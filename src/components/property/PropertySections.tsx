"use client";

import {
  ClipboardText,
  Plug,
  Door,
  Car,
  Warning,
  FileText,
  CaretDown,
  CheckCircle,
  XCircle,
} from "@phosphor-icons/react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";
import type { PropertySection, PropertyRule, Appliance } from "@/types";

const iconMap: Record<string, React.ReactNode> = {
  "clipboard-list": <ClipboardText weight="duotone" className="h-5 w-5" />,
  plug: <Plug weight="duotone" className="h-5 w-5" />,
  "door-open": <Door weight="duotone" className="h-5 w-5" />,
  car: <Car weight="duotone" className="h-5 w-5" />,
  "alert-triangle": <Warning weight="duotone" className="h-5 w-5" />,
  "file-text": <FileText weight="duotone" className="h-5 w-5" />,
};

interface PropertySectionsProps {
  sections: PropertySection[];
  className?: string;
}

function isPropertyRuleArray(content: unknown[]): content is PropertyRule[] {
  return content.length > 0 && typeof (content[0] as PropertyRule).severity === "string";
}

function isApplianceArray(content: unknown[]): content is Appliance[] {
  return content.length > 0 && typeof (content[0] as Appliance).instructions === "string";
}

function RulesList({ rules }: { rules: PropertyRule[] }) {
  return (
    <ul className="space-y-3">
      {rules.map((rule, index) => (
        <li
          key={index}
          className={cn(
            "flex items-start gap-3 p-3 rounded-xl transition-colors",
            rule.severity === "critical"
              ? "bg-coral-500/5 text-neutral-800"
              : "bg-sand-50"
          )}
        >
          {rule.severity === "critical" ? (
            <XCircle weight="fill" className="h-5 w-5 text-coral-600 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle weight="fill" className="h-5 w-5 text-success-500 flex-shrink-0 mt-0.5" />
          )}
          <span className={cn(
            "text-sm leading-relaxed",
            rule.severity === "critical" && "font-medium"
          )}>
            {rule.text}
          </span>
        </li>
      ))}
    </ul>
  );
}

function AppliancesList({ appliances }: { appliances: Appliance[] }) {
  return (
    <div className="space-y-4">
      {appliances.map((appliance, index) => (
        <div
          key={index}
          className="bg-sand-50 rounded-xl p-4 border border-sand-200/50"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
              <Plug weight="duotone" className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-neutral-800">{appliance.name}</h4>
              {appliance.location && (
                <p className="text-xs text-neutral-500 mt-0.5">{appliance.location}</p>
              )}
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                {appliance.instructions}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StringList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={index}
          className="flex items-start gap-3 text-neutral-600"
        >
          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
          <span className="text-sm leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PropertySections({ sections, className }: PropertySectionsProps) {
  return (
    <div className={cn("px-4 py-6 pb-28", className)}>
      <div className="mx-auto max-w-lg">
        {/* Section Header */}
        <div className="mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Property Guide
          </h2>
        </div>

        {/* Accordion Sections */}
        <AccordionPrimitive.Root type="multiple" className="space-y-3">
          {sections.map((section, index) => (
            <AccordionPrimitive.Item
              key={section.id}
              value={section.id}
              className="group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm shadow-neutral-900/5 border border-sand-200/50 transition-shadow hover:shadow-md">
                {/* Left Accent Border */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-2xl" />

                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger className="flex flex-1 items-center gap-4 p-4 pl-5 text-left transition-colors hover:bg-sand-50/50 [&[data-state=open]]:bg-sand-50/50">
                    {/* Icon */}
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sand-100 text-primary transition-colors group-hover:bg-primary/10">
                      {iconMap[section.icon] || <FileText weight="duotone" className="h-5 w-5" />}
                    </div>

                    {/* Title */}
                    <span className="flex-1 font-semibold text-neutral-800">
                      {section.title}
                    </span>

                    {/* Chevron */}
                    <CaretDown
                      weight="bold"
                      className="h-5 w-5 text-neutral-400 transition-transform duration-200 group-[[data-state=open]]:rotate-180"
                    />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>

                <AccordionPrimitive.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
                  <div className="px-5 pb-5 pt-0">
                    <div className="border-t border-sand-200/50 pt-4">
                      {isPropertyRuleArray(section.content) ? (
                        <RulesList rules={section.content} />
                      ) : isApplianceArray(section.content) ? (
                        <AppliancesList appliances={section.content} />
                      ) : (
                        <StringList items={section.content as string[]} />
                      )}
                    </div>
                  </div>
                </AccordionPrimitive.Content>
              </div>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      </div>
    </div>
  );
}
