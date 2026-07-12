import { TreePine } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Logo({
  className,
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-[linear-gradient(135deg,rgba(77,101,74,1),rgba(47,35,30,1))] text-[rgb(var(--primary-foreground))] shadow-[0_14px_30px_rgba(17,14,14,0.22)]">
        <TreePine className="h-4 w-4 opacity-85" />
        <span className="absolute -bottom-1.5 right-0 flex h-5 w-5 items-center justify-center rounded-full border border-[rgba(255,255,255,0.4)] bg-[rgb(var(--accent))] text-[10px] font-bold text-[rgb(var(--accent-foreground))] shadow-[0_8px_16px_rgba(17,14,14,0.18)]">
          A
        </span>
      </div>
      <div className="min-w-0">
        <p
          className={cn(
            "display-font text-[1.75rem] font-medium leading-none tracking-[-0.04em]",
            inverted ? "text-white" : undefined,
          )}
        >
          Aygoot
        </p>
        <p
          className={cn(
            "text-[10px] font-semibold uppercase tracking-[0.32em]",
            inverted ? "text-white/54" : "text-[rgb(var(--muted-foreground))]",
          )}
        >
          Dilijan private houses
        </p>
      </div>
    </div>
  );
}
