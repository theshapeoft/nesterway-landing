import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  description,
  centered = true,
  className
}: SectionHeaderProps) {
  return (
    <div className={cn(
      'mb-12 md:mb-16',
      centered && 'text-center',
      className
    )}>
      {subtitle && (
        <p className="text-sm font-semibold text-ocean-600 uppercase tracking-wide mb-3">
          {subtitle}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
