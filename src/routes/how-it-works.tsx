import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/site-chrome";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — Trustferly" },
      { name: "description", content: "How Trustferly matches used-car buyers with independent inspectors." },
      { property: "og:title", content: "How Trustferly works" },
      { property: "og:description", content: "From booking to report: independent pre-purchase inspections explained." },
    ],
  }),
  component: Page,
});

const steps = [
  ["Book online", "Enter the vehicle details, the seller's address and preferred times. Pay securely up front."],
  ["We match an inspector", "A background-checked, certified inspector near the vehicle accepts the job."],
  ["Inspection on site", "The inspector meets the car wherever it is — driveway, street or garage."],
  ["Report delivered", "You receive a photo-documented report with a clear summary and repair estimates."],
  ["You decide", "Negotiate, walk away or buy with confidence. We never take a cut of the sale."],
];

function Page() {
  return (
    <>
      <PageIntro eyebrow="How it works" title="Independent eyes on every deal" text="A simple process designed around the buyer — and only the buyer." />
      <ol className="mx-auto max-w-3xl space-y-4 px-5 pb-16">
        {steps.map(([t, d], i) => (
          <li key={t} className="flex gap-5 rounded-2xl bg-card p-6 shadow-soft">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent font-display font-semibold text-accent-foreground">{i + 1}</span>
            <div>
              <h3 className="text-lg font-semibold">{t}</h3>
              <p className="mt-1 text-muted-foreground">{d}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="pb-20 text-center">
        <Button asChild variant="cta" size="lg"><Link to="/book">Book an inspection</Link></Button>
      </div>
    </>
  );
}
