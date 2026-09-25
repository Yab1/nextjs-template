import * as React from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "border-border bg-background text-foreground focus-visible:ring-ring flex h-9 w-full rounded-[var(--radius)] border px-3 text-sm outline-none focus-visible:ring-2",
        className
      )}
      {...props}
    />
  );
}
