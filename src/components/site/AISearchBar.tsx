import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";

const suggestions = [
  "I have UGX 700,000. What's the best phone?",
  "Cheapest original TV with warranty",
  "Which shop is most trusted?",
  "Quality over price — best laptop",
];

export function AISearchBar() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const ask = (q: string) => {
    if (!q.trim()) return;
    void navigate({ to: "/assistant", search: { q: q.trim() } });
  };

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(value);
        }}
        className="glass flex items-center gap-2 rounded-2xl p-2 shadow-[var(--shadow-float)]"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
          <Sparkles className="h-5 w-5" />
        </span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={200}
          placeholder="Ask anything — “best phone under UGX 800,000”"
          aria-label="Ask the AI shopping assistant"
          className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground sm:text-base"
        />
        <button
          type="submit"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          style={{ backgroundImage: "var(--gradient-gold)" }}
        >
          Ask
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => ask(s)}
            className="shrink-0 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}