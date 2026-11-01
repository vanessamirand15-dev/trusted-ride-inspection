import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, ClipboardCheck, FileText, Search, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { title: "Trustferly — Inspect before you buy a used car" },
      { name: "description", content: "Connect with independent, verified vehicle inspectors before buying a used car from a private seller." },
      { property: "og:title", content: "Trustferly — Inspect before you buy" },
      { property: "og:description", content: "Independent pre-purchase vehicle inspections for private-party sales." },
    ],
  }),
  component: Index,
});

const steps = [
  { icon: Search, title: "Tell us about the car", text: "Share the vehicle, the seller's location and a time that works." },
  { icon: UserCheck, title: "Matched with a verified pro", text: "A vetted, independent inspector near the car accepts your request." },
  { icon: FileText, title: "Get a detailed report", text: "Photos, findings and a clear verdict — usually the same day." },
];

const points = [
  "150+ point mechanical & body check",
  "Diagnostic scan for hidden fault codes",
  "Road test & undercarriage review",
  "Photo-documented digital report",
];

function Index() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 md:grid-cols-2 md:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold text-accent">
            <BadgeCheck className="h-4 w-4" /> Independent. Unbiased. Verified.
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
            Know the car before you hand over the cash.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            Trustferly connects used-car buyers with independent professional inspectors — so private
            sales are safer and more transparent.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="cta" size="lg"><Link to="/book">Book an inspection</Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/how-it-works">How it works</Link></Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">We never sell cars, list vehicles or offer financing.</p>
        </div>
        <div className="relative">
          <img src={hero} width={1408} height={1056} alt="Inspector reviewing a used sedan" className="rounded-3xl object-cover shadow-soft" />
          <div className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl bg-card p-4 shadow-soft md:-left-8">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-foreground">
              <ClipboardCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-navy">Inspection complete</p>
              <p className="text-xs text-muted-foreground">2018 Honda Accord · 3 findings</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-center text-3xl font-bold md:text-4xl">Three steps to a confident purchase</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-2xl border bg-background p-7">
                <div className="flex items-center justify-between">
                  <s.icon className="h-7 w-7 text-primary" />
                  <span className="font-display text-sm text-muted-foreground">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-3xl font-bold md:text-4xl">What every inspection covers</h2>
          <p className="mt-4 text-muted-foreground">Inspectors work for you — not the seller. No commissions, no conflicts.</p>
        </div>
        <ul className="space-y-3">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-soft">
              <ShieldCheck className="h-5 w-5 shrink-0 text-accent" />
              <span className="font-medium text-navy">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto max-w-6xl rounded-3xl bg-navy-gradient px-8 py-14 text-center">
          <h2 className="text-3xl font-bold text-navy-foreground md:text-4xl">Found a car you like?</h2>
          <p className="mx-auto mt-3 max-w-lg text-navy-foreground/70">Book an independent inspection before you commit.</p>
          <Button asChild variant="onDark" size="lg" className="mt-8"><Link to="/book">Book an inspection</Link></Button>
        </div>
      </section>
    </>
  );
}
