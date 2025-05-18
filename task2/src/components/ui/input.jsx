import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-[oklch(var(--foreground))] placeholder:text-[oklch(var(--muted-foreground))] selection:bg-[oklch(var(--primary))] selection:text-[oklch(var(--primary-foreground))] dark:bg-transparent border-[oklch(var(--border))] flex h-9 w-full min-w-0 rounded-[var(--radius)] border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-[oklch(var(--ring))] focus-visible:ring-[oklch(var(--ring))]/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-[oklch(var(--destructive))]/20 dark:aria-invalid:ring-[oklch(var(--destructive))]/40 aria-invalid:border-[oklch(var(--destructive))]",
        className
      )}
      {...props} />
  );
}

export { Input }
