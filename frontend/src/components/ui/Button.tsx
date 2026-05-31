import * as React from "react";
import { cn } from "@/src/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: "bg-[#15803D] text-white hover:bg-[#166534] shadow-lg shadow-[#15803D]/20 active:shadow-inner transition-all",
      secondary: "bg-[#F0FDF4] text-[#15803D] hover:bg-[#DCFCE7] border border-[#DCFCE7]",
      outline: "border-2 border-slate-200 hover:border-primary/30 hover:bg-slate-50 text-slate-700",
      ghost: "hover:bg-slate-100/50 text-[#475569] hover:text-[#1E293B] font-bold",
      danger: "bg-[#DC2626] text-white hover:bg-[#B91C1C] shadow-lg shadow-[#DC2626]/20 active:shadow-inner transition-all",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs font-bold",
      md: "px-6 py-3 text-sm font-bold",
      lg: "px-8 py-4 text-base font-bold",
      icon: "p-3",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl font-bold transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.96]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
