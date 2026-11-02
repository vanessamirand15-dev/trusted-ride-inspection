import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, MapPin, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/site-chrome";

export const Route = createFileRoute("/for-inspectors")({
  head: () => ({
    meta: [
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { title: "For inspectors · Trustferly" },
      { name: "description", content: "Join Trustferly as an independent professional vehicle inspector." },
      { property: "og:title", content: "Become a Trustferly inspector" },
      { property: "og:description", content: "Flexible, independent vehicle inspection work near you." },
    ],
  }),
  component: Page,
});

const perks = [
  { icon: CalendarClock, t: "Set your schedule", d: "Accept only the jobs that fit your week." },
  { icon: MapPin, t: "Work locally", d: "Requests are matched to your service area." },
  { icon: Wallet, t: "Get paid fast", d: "Payouts after every completed report." },
];

function Page() {
  return (
    <>
      <PageIntro eyebrow="For inspectors" title="Put your expertise to work" text="Certified mechanics and inspectors: help buyers make safer decisions, on your terms." />
      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-12 md:grid-cols-3">
        {perks.map((p) => (
          <div key={p.t} className="rounded-2xl bg-card p-7 shadow-soft">
            <p.icon className="h-7 w-7 text-accent" />
            <h3 className="mt-4 text-lg font-semibold">{p.t}</h3>
            <p className="mt-1 text-muted-foreground">{p.d}</p>
          </div>
        ))}
      </div>
      <div className="pb-24 text-center">
        <Button asChild variant="cta" size="lg"><Link to="/book">Apply to inspect</Link></Button>
      </div>
    </>
  );
}
