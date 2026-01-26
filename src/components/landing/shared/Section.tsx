import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'sand' | 'ocean' | 'gradient';
  container?: boolean;
  id?: string;
}

export function Section({
  children,
  className,
  variant = 'default',
  container = true,
  id
}: SectionProps) {
  const variantClasses = {
    default: 'bg-white',
    sand: 'bg-sand-50',
    ocean: 'bg-ocean-50',
    gradient: 'bg-gradient-to-b from-white to-sand-50'
  };

  return (
    <section
      id={id}
      className={cn(
        'py-16 md:py-24',
        variantClasses[variant],
        className
      )}
    >
      {container ? (
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}
