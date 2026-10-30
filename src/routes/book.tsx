import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/site-chrome";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book an inspection — Trustferly" },
      { name: "description", content: "Request an independent pre-purchase inspection for a used vehicle." },
      { property: "og:title", content: "Book a Trustferly inspection" },
      { property: "og:description", content: "Request a verified inspector for the car you're considering." },
    ],
  }),
  component: Page,
});

const field = "mt-1 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

function Page() {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent) => { e.preventDefault(); setSent(true); };

  return (
    <>
      <PageIntro eyebrow="Book" title="Request an inspection" text="Tell us about the vehicle and we'll match you with a verified inspector." />
      <div className="mx-auto max-w-2xl px-5 pb-24">
        {sent ? (
          <div className="rounded-3xl bg-card p-10 text-center shadow-soft">
            <CircleCheck className="mx-auto h-12 w-12 text-accent" />
            <h2 className="mt-4 text-2xl font-bold">Request received</h2>
            <p className="mt-2 text-muted-foreground">We'll confirm your inspector shortly.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-5 rounded-3xl bg-card p-8 shadow-soft md:grid-cols-2">
            <label className="text-sm font-medium text-navy">Your name<input required className={field} /></label>
            <label className="text-sm font-medium text-navy">Email<input required type="email" className={field} /></label>
            <label className="text-sm font-medium text-navy">Year, make & model<input required placeholder="2018 Honda Accord" className={field} /></label>
            <label className="text-sm font-medium text-navy">VIN (optional)<input className={field} /></label>
            <label className="text-sm font-medium text-navy md:col-span-2">Vehicle location<input required placeholder="City or address" className={field} /></label>
            <label className="text-sm font-medium text-navy">Preferred date<input required type="date" className={field} /></label>
            <label className="text-sm font-medium text-navy">Package
              <select className={field}><option>Essential — $129</option><option>Complete — $189</option><option>Specialty — $249</option></select>
            </label>
            <Button type="submit" variant="cta" size="lg" className="md:col-span-2">Request inspection</Button>
          </form>
        )}
      </div>
    </>
  );
}
