"use client";

import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'scale';
  delay?: number;
}

export function AnimatedSection({
  children,
  className,
  animation = 'fade-up',
  delay = 0
}: AnimatedSectionProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const animationClasses = {
    'fade-up': {
      initial: 'opacity-0 translate-y-8',
      animate: 'opacity-100 translate-y-0'
    },
    'fade-in': {
      initial: 'opacity-0',
      animate: 'opacity-100'
    },
    'scale': {
      initial: 'opacity-0 scale-95',
      animate: 'opacity-100 scale-100'
    }
  };

  const { initial, animate } = animationClasses[animation];

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        inView ? animate : initial,
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
