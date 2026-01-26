import Link from "next/link";
import { cn } from "@/lib/utils";

interface CTAButtonProps {
  children: React.ReactNode;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'lg' | 'xl';
  className?: string;
}

export function CTAButton({
  children,
  href,
  variant = 'primary',
  size = 'default',
  className
}: CTAButtonProps) {
  const variantClasses = {
    primary: 'bg-ocean-600 text-white hover:bg-ocean-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-coral-500 text-white hover:bg-coral-600 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-ocean-600 text-ocean-600 hover:bg-ocean-50',
    ghost: 'text-ocean-600 hover:bg-ocean-50'
  };

  const sizeClasses = {
    default: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 touch-target',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </Link>
  );
}
