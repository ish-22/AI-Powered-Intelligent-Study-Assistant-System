import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient";
  size?: "default" | "sm" | "lg" | "icon";
}

const variantClasses = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
  gradient: "gradient-bg text-white hover:opacity-90 shadow-lg shadow-indigo-500/25",
};

const sizeClasses = {
  default: "h-9 px-4 py-2 text-sm",
  sm: "h-8 px-3 text-xs",
  lg: "h-11 px-8 text-base",
  icon: "h-9 w-9",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button };
