import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function TrustScore({
  score,
  size = "sm",
  className,
}: {
  score: number;
  size?: "sm" | "lg";
  className?: string;
}) {
  const tone =
    score >= 85
      ? "text-success border-success/30 bg-success/10"
      : score >= 70
        ? "text-primary border-primary/30 bg-primary/10"
        : "text-destructive border-destructive/30 bg-destructive/10";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        tone,
        size === "lg" ? "px-3.5 py-1.5 text-sm" : "px-2.5 py-1 text-xs",
        className,
      )}
      title="AI Trust Score"
    >
      <ShieldCheck className={size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5"} />
      Trust {score}
    </span>
  );
}