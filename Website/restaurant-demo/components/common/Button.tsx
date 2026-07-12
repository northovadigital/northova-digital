import clsx from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300",
        variant === "primary" &&
          "bg-[var(--primary)] text-white hover:opacity-90",
        variant === "secondary" &&
          "border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}