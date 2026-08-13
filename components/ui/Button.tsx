import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "icon";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "ghost", size = "md", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 disabled:opacity-40",
        variant === "primary" && "bg-accent text-accent-contrast hover:opacity-85",
        variant === "ghost" && "text-muted hover:bg-panel-muted hover:text-foreground",
        variant === "outline" && "border border-border bg-panel text-foreground hover:bg-panel-muted",
        variant === "danger" && "text-danger hover:bg-danger/10",
        size === "sm" && "h-8 px-2.5 text-xs",
        size === "md" && "h-10 px-3.5 text-sm",
        size === "icon" && "size-9",
        className,
      )}
      {...props}
    />
  );
});
