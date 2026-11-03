import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { nativeSelectClass } from "@/lib/ui";
import { cn } from "@/lib/utils";

export function NativeSelect({ className, density = "regular", ...props }: ComponentProps<"select"> & { density?: "regular" | "compact" }) {
  return <span className="relative block min-w-0">
    <select {...props} className={cn(nativeSelectClass, density === "compact" && "min-h-9 py-1 pr-8 pl-2.5 md:text-sm", className)} />
    <ChevronDown size={density === "compact" ? 14 : 16} aria-hidden className={cn("pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted", density === "compact" ? "right-2.5" : "right-3")} />
  </span>;
}
