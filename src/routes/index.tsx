import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Car, ClipboardCheck, FileText, Lock, MapPin, Search, ShieldCheck, Star, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SampleReportDialog } from "@/components/sample-report-dialog";
import { InspectionPricing } from '@/components/inspection-pricing';
import { CostEstimator, RiskCompare, TrustPillars } from '@/components/home-sections';
import { ContactSection, CoverageSection, ZipChecker } from '@/components/contact-coverage';
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { title: "Trustferly · Inspect before you buy a used car" },
      { name: "description", content: "Connect with independent, verified vehicle inspectors before buying a used car from a private seller." },
      { property: "og:title", content: "Trustferly · Inspect before you buy" },
      { property: "og:description", content: "Independent pre-purchase vehicle inspections for private-party sales." },
    ],
  }),
  component: Index,
});

const steps = [
  { icon: Search, title: "Tell us about the car", text: "Share the vehicle, the seller's location and a time that works." },
  { icon: UserCheck, title: "Matched with a verified pro", text: "A vetted, independent inspector near the car accepts your request." },
  { icon: FileText, title: "Get a detailed report", text: "Photos, findings and a clear verdict, usually the same day." },
];

const points = [
  "150+ point mechanical & body check",
  "Diagnostic scan for hidden fault codes",
  "Road test & undercarriage review",
  "Photo-documented digital report",
];

const metrics = [
  { value: "1,200+", label: "Inspections completed" },
  { value: "4.9/5", label: "Average customer rating" },
  { value: "$450", label: "Average savings per buyer" },
];

const faqs = [
  { q: "What happens if the seller refuses to allow the inspection?", a: "If the seller refuses or the vehicle is not available, we refund the full amount you paid." },
  { q: "Do I need to be present during the inspection?", a: "No. The inspector goes to the vehicle's location, completes the entire procedure, and sends the full digital report to your phone or email." },
  { q: "How long does it take to receive the report?", a: "Usually the same day, within a few hours after the on-site inspection is finished." },
  { q: "How are inspectors vetted?", a: "Every inspector passes a background check, automotive certification validation, and quality standard training before joining the platform." },
];

const reviews = [
  { name: "Mariana S.", location: "Los Angeles, CA", text: "The inspector found uneven tire wear and a hidden fault code that the seller never mentioned. I negotiated $600 off the price." },
  { name: "Daniel R.", location: "Pasadena, CA", text: "I booked in the morning and had a full photo report on my phone by the afternoon. The process could not have been easier." },
  { name: "Priya K.", location: "Santa Monica, CA", text: "As a first-time buyer I had no idea what to look for. The report explained everything in plain language and gave me real confidence." },
];

function Index() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 md:grid-cols-2 md:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold text-accent">
            <BadgeCheck className="h-4 w-4" /> Independent. Unbiased. Verified.
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-6xl">
            Trustferly vehicle inspections
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            Independent vehicle inspections for buyers and sellers. Check a car before buying, or inspect your own car before selling.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2" aria-label="Buyer and seller inspection options">
            <Button asChild variant="cta" size="lg" className="h-auto min-h-16 justify-start whitespace-normal px-4 py-3"><Link to="/book"><Search className="shrink-0" /><span className="text-left"><span className="block">Buying a car</span><span className="block text-xs font-normal">Inspect before you buy</span></span></Link></Button>
            <Button asChild variant="outline" size="lg" className="h-auto min-h-16 justify-start whitespace-normal border-accent bg-teal-soft px-4 py-3 text-accent hover:bg-accent hover:text-accent-foreground"><Link to="/sellers"><Car className="shrink-0" /><span className="text-left"><span className="block">Selling my car</span><span className="block text-xs font-normal">Inspect my own vehicle</span></span></Link></Button>
          </div>
          <div className="mt-4"><SampleReportDialog /></div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-accent" />Satisfaction Guarantee</span>
            <span className="inline-flex items-center gap-1.5"><Lock className="h-4 w-4 text-accent" />Secure SSL Checkout</span>
          </div>
          <div className="mt-8 max-w-lg"><p className="mb-2 text-sm font-medium text-navy">Check coverage for your ZIP code</p><ZipChecker /></div>
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
        <div className="mx-auto max-w-6xl px-5 py-10">
          <p className="text-center text-xs font-medium text-muted-foreground">Sample data for MVP demonstration · Illustrative platform figures, not measured results</p>
          <dl className="mt-6 grid gap-6 text-center sm:grid-cols-3">
            {metrics.map((m) => (
              <div key={m.label}>
                <dd className="font-display text-4xl font-semibold text-navy">{m.value}</dd>
                <dt className="mt-1 text-sm text-muted-foreground">{m.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-center text-3xl font-semibold md:text-4xl">Three steps to a confident purchase</h2>
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
          <h2 className="text-3xl font-semibold md:text-4xl">What every inspection covers</h2>
          <p className="mt-4 text-muted-foreground">Inspectors work for you, not the seller. No commissions, no conflicts.</p>
          <div className="mt-6"><SampleReportDialog /></div>
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

      <RiskCompare />

      <TrustPillars />

      <CoverageSection />
      <section id="faq" className="scroll-mt-24 border-t bg-card">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <h2 className="text-center text-3xl font-semibold md:text-4xl">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CostEstimator />

      <section aria-labelledby="home-pricing" className="border-t bg-card">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <p className="text-center text-sm font-semibold text-accent">Transparent pricing</p>
          <h2 id="home-pricing" className="mt-3 text-center text-3xl font-semibold md:text-4xl">Choose the inspection your car needs</h2>
          <p className="mx-auto mb-10 mt-4 max-w-xl text-center text-muted-foreground">Two clear packages. Independent advice. No commission on the vehicle sale.</p>
          <InspectionPricing />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="text-center text-xs font-medium text-muted-foreground">Sample data for MVP demonstration · Illustrative buyer stories, not verified customer reviews</p>
        <h2 className="mt-3 text-center text-3xl font-semibold md:text-4xl">A clearer picture before you buy</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.name} className="rounded-2xl border bg-card p-7 shadow-soft">
              <div className="flex gap-1 text-accent" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <blockquote className="mt-4 text-muted-foreground">"{r.text}"</blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-semibold text-navy">{r.name}</span>
                <span className="text-muted-foreground"> · {r.location}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto max-w-6xl rounded-3xl bg-navy-gradient px-8 py-14 text-center">
          <h2 className="text-3xl font-semibold text-navy-foreground md:text-4xl">Found a car you like?</h2>
          <p className="mx-auto mt-3 max-w-lg text-navy-foreground/70">Book an independent inspection before you commit.</p>
          <Button asChild variant="onDark" size="lg" className="mt-8"><Link to="/book">Book an inspection</Link></Button>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-navy-foreground/70">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" />Satisfaction Guarantee</span>
            <span className="inline-flex items-center gap-1.5"><Lock className="h-4 w-4" />Secure SSL Checkout</span>
          </div>
        </div>
      </section>
      <ContactSection />
    </>
  );
}
