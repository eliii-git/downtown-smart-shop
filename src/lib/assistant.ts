import { getShop, products, ugx, type Product } from "@/data/marketplace";

export type Answer = {
  intro: string;
  reasoning: string[];
  picks: { product: Product; why: string; score: number }[];
  followUps: string[];
};

const CATEGORY_HINTS: [RegExp, string][] = [
  [/phone|smartphone|samsung|galaxy|iphone/i, "Electronics"],
  [/tv|television|screen/i, "Electronics"],
  [/laptop|computer|pc|notebook/i, "Computing"],
  [/fabric|cloth|kitenge|wax|tailor/i, "Fashion & Fabric"],
  [/pot|cook|kitchen|saucepan/i, "Home & Kitchen"],
  [/headphone|earbud|audio|speaker/i, "Audio"],
];

function parseBudget(q: string): number | null {
  const cleaned = q.replace(/,/g, "").toLowerCase();
  const m =
    cleaned.match(/(?:ugx|shs?|shillings?)\s*([\d.]+)\s*(m|million|k)?/) ??
    cleaned.match(/([\d.]+)\s*(m|million|k)\b/) ??
    cleaned.match(/\b(\d{5,9})\b/);
  if (!m) return null;
  const n = Number(m[1]);
  if (!Number.isFinite(n)) return null;
  const unit = m[2];
  if (unit === "m" || unit === "million") return n * 1_000_000;
  if (unit === "k") return n * 1_000;
  return n;
}

export function askAssistant(query: string): Answer {
  const q = query.trim();
  const budget = parseBudget(q);
  const wantsCheap = /cheap|lowest|affordable|budget/i.test(q);
  const wantsQuality = /quality|best|durable|original|genuine|authentic/i.test(q);
  const wantsTrust = /trust|trusted|reliable|reputable|safe/i.test(q);
  const hint = CATEGORY_HINTS.find(([re]) => re.test(q))?.[1];

  let pool = products;
  if (hint) pool = pool.filter((p) => p.category === hint);
  if (budget) {
    const within = pool.filter((p) => p.retail <= budget);
    if (within.length) pool = within;
  }
  if (!pool.length) pool = products;

  const maxPrice = Math.max(...pool.map((p) => p.retail));

  const scored = pool
    .map((p) => {
      const shop = getShop(p.shopId);
      const trust = (shop?.trustScore ?? 60) / 100;
      const value = 1 - p.retail / (maxPrice || 1);
      const quality = p.rating / 5;
      const authentic = p.authenticity === "Verified original" ? 1 : 0.6;
      const warranty = Math.min(p.warrantyMonths / 24, 1);
      const delivery = 1 - Math.min(p.deliveryDays / 5, 1);
      const popularity = Math.min(p.reviews / 400, 1);

      const w = wantsCheap
        ? { value: 0.34, quality: 0.14, trust: 0.2, authentic: 0.12, warranty: 0.06, delivery: 0.08, popularity: 0.06 }
        : wantsTrust
          ? { value: 0.1, quality: 0.16, trust: 0.36, authentic: 0.18, warranty: 0.08, delivery: 0.06, popularity: 0.06 }
          : wantsQuality
            ? { value: 0.1, quality: 0.28, trust: 0.2, authentic: 0.2, warranty: 0.12, delivery: 0.04, popularity: 0.06 }
            : { value: 0.2, quality: 0.2, trust: 0.22, authentic: 0.16, warranty: 0.1, delivery: 0.06, popularity: 0.06 };

      const score =
        value * w.value +
        quality * w.quality +
        trust * w.trust +
        authentic * w.authentic +
        warranty * w.warranty +
        delivery * w.delivery +
        popularity * w.popularity;

      const why = [
        `${shop?.name} scores ${shop?.trustScore} on trust`,
        p.authenticity === "Verified original" ? "verified original stock" : `sold as ${p.authenticity.toLowerCase()}`,
        p.warrantyMonths ? `${p.warrantyMonths}-month warranty` : "no warranty offered",
        `${p.deliveryDays}-day delivery at ${ugx(p.deliveryCost)}`,
      ].join(" · ");

      return { product: p, score: Math.round(score * 100), why };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const top = scored[0];
  const priority = wantsCheap
    ? "lowest landed cost"
    : wantsTrust
      ? "seller reliability"
      : wantsQuality
        ? "quality and authenticity"
        : "overall value";

  const intro = top
    ? `Go with the ${top.product.name} at ${ugx(top.product.retail)}. ${top.product.aiVerdict}`
    : "I could not find a match in the current Kikubo stock. Try widening your budget or category.";

  const reasoning = [
    budget
      ? `Filtered to stock at or under ${ugx(budget)}${hint ? ` in ${hint}` : ""}.`
      : hint
        ? `Focused on ${hint} listings.`
        : "Searched all live Kikubo listings.",
    `Weighted the ranking toward ${priority} based on how you asked.`,
    "Compared price, seller trust score, authenticity, warranty, delivery cost and time, ratings and recent sales volume.",
    top
      ? `${top.product.name} came out ahead — ${top.product.pros.slice(0, 2).join(" and ").toLowerCase()}.`
      : "No listing cleared the threshold.",
  ];

  return {
    intro,
    reasoning,
    picks: scored,
    followUps: [
      "Compare the top two side by side",
      "Only show verified original stock",
      "What is the bulk price for 10 units?",
      "Which seller replies fastest?",
    ],
  };
}