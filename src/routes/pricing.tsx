import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/site-chrome";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Trustferly" },
      { name: "description", content: "Transparent flat-rate pricing for pre-purchase vehicle inspections." },
      { property: "og:title", content: "Trustferly pricing" },
      { property: "og:description", content: "Flat-rate independent inspection packages." },
    ],
  }),
  component: Page,
});

const plans = [
  { name: "Essential", price: 129, features: ["100-point inspection", "Diagnostic scan", "Digital photo report"] },
  { name: "Complete", price: 189, popular: true, features: ["150+ point inspection", "Diagnostic scan", "Road test", "Repair cost estimates"] },
  { name: "Specialty", price: 249, features: ["EV, luxury & classic", "Battery / specialty checks", "Inspector call-through"] },
];

function Page() {
  return (
    <>
      <PageIntro eyebrow="Pricing" title="Simple, flat-rate inspections" text="No hidden fees. No commissions on the car sale." />
      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-24 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={`rounded-3xl bg-card p-8 shadow-soft ${p.popular ? "ring-2 ring-primary" : "border"}`}>
            {p.popular && <span className="rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold text-accent">Most chosen</span>}
            <h3 className="mt-4 text-xl font-semibold">{p.name}</h3>
            <p className="mt-2 font-display text-4xl font-bold text-navy">${p.price}</p>
            <ul className="mt-6 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-accent" />{f}</li>
              ))}
            </ul>
            <Button asChild variant={p.popular ? "cta" : "outline"} className="mt-8 w-full"><Link to="/book">Choose {p.name}</Link></Button>
          </div>
        ))}
      </div>
    </>
  );
}
