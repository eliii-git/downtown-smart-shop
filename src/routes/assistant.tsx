import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { ArrowUp, Loader2, Sparkles, Star } from "lucide-react";
import { Shell } from "@/components/site/Shell";
import { TrustScore } from "@/components/site/TrustScore";
import { askAssistant, type Answer } from "@/lib/assistant";
import { getShop, ugx } from "@/data/marketplace";

export const Route = createFileRoute("/assistant")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search['q'] === "string" ? search['q'].slice(0, 200) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "AI Shopping Assistant — Ask, Compare, Buy | DownTown Uganda" },
      {
        name: "description",
        content:
          "Ask in plain language and get a recommendation that weighs price, trust score, authenticity, warranty and delivery across Kikubo shops.",
      },
      { property: "og:title", content: "AI Shopping Assistant — Ask, Compare, Buy" },
      {
        property: "og:description",
        content: "Plain-language shopping advice across Kikubo's wholesale stock.",
      },
    ],
  }),
  component: Assistant,
});

type Turn = { role: "user" | "ai"; text?: string; answer?: Answer };

function Assistant() {
  const { q } = useSearch({ from: "/assistant" });
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const seeded = useRef(false);
  const endRef = useRef<HTMLDivElement>(null);

  const send = (text: string) => {
    const clean = text.trim().slice(0, 200);
    if (!clean || thinking) return;
    setInput("");
    setTurns((t) => [...t, { role: "user", text: clean }]);
    setThinking(true);
    window.setTimeout(() => {
      setTurns((t) => [...t, { role: "ai", answer: askAssistant(clean) }]);
      setThinking(false);
    }, 700);
  };

  useEffect(() => {
    if (q && !seeded.current) {
      seeded.current = true;
      send(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns, thinking]);

  return (
    <Shell hideFooter>
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col px-4 py-8 sm:px-6">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-primary-foreground"
            style={{ backgroundImage: "var(--gradient-gold)" }}
          >
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold sm:text-2xl">AI Shopping Assistant</h1>
            <p className="truncate text-xs text-muted-foreground">
              Reasons across price, trust, warranty and delivery
            </p>
          </div>
        </div>

        <div className="mt-8 flex-1 space-y-6">
          {turns.length === 0 && !thinking ? (
            <div className="surface-card p-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Ask me the way you'd ask a trader you trust. For example:
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {[
                  "I have UGX 700,000. What's the best phone?",
                  "I need the cheapest original TV.",
                  "Which shop is most trusted?",
                  "I want quality over price — laptop.",
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-xl border border-border p-3 text-left text-sm transition-colors hover:border-primary/40 hover:bg-secondary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {turns.map((t, i) =>
            t.role === "user" ? (
              <div key={i} className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground">
                  {t.text}
                </p>
              </div>
            ) : (
              <AnswerBlock key={i} answer={t.answer!} onFollowUp={send} />
            ),
          )}

          {thinking ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Comparing live Kikubo stock…
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="glass sticky bottom-20 mt-8 flex items-center gap-2 rounded-2xl p-2 lg:bottom-4"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={200}
            placeholder="Ask about price, quality, sellers…"
            aria-label="Message the assistant"
            className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={thinking || !input.trim()}
            aria-label="Send"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-primary-foreground disabled:opacity-40"
            style={{ backgroundImage: "var(--gradient-gold)" }}
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </form>
      </div>
    </Shell>
  );
}

function AnswerBlock({ answer, onFollowUp }: { answer: Answer; onFollowUp: (q: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="surface-card p-5">
        <p className="text-sm leading-relaxed">{answer.intro}</p>
        <ul className="mt-4 space-y-1.5 border-t border-border pt-4">
          {answer.reasoning.map((r) => (
            <li key={r} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        {answer.picks.map((pick, idx) => {
          const shop = getShop(pick.product.shopId);
          return (
            <Link
              key={pick.product.id}
              to="/product/$productId"
              params={{ productId: pick.product.id }}
              className="surface-card hover-lift grid grid-cols-[auto_minmax(0,1fr)] gap-4 p-4"
            >
              <img
                src={pick.product.image}
                alt={pick.product.name}
                loading="lazy"
                width={800}
                height={800}
                className="h-20 w-20 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0">
                <div className="flex min-w-0 items-start justify-between gap-2">
                  <h3 className="min-w-0 truncate text-sm font-semibold">
                    {idx === 0 ? "🥇 " : ""}
                    {pick.product.name}
                  </h3>
                  <span className="shrink-0 rounded-md bg-primary/12 px-2 py-0.5 text-xs font-semibold text-primary">
                    {pick.score}/100
                  </span>
                </div>
                <p className="mt-1 font-display text-base font-bold">{ugx(pick.product.retail)}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{pick.why}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {shop ? <TrustScore score={shop.trustScore} /> : null}
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    {pick.product.rating}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {answer.followUps.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => onFollowUp(f)}
            className="shrink-0 rounded-full border border-border px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}