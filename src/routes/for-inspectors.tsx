import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { BadgeCheck, CalendarClock, MapPin, Wallet } from "lucide-react";
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
  { icon: Wallet, t: "Get paid fast", d: "Fair payout after every completed report." },
];

const equipment = ['OBD-II diagnostic scanner', 'Paint depth gauge', 'OBD scanner', 'Inspection flashlight & tools'];

const field = "mt-1 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

function ApplicationForm() {
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-3xl border bg-card p-10 text-center shadow-soft" role="status">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-foreground">
          <BadgeCheck className="h-8 w-8" />
        </span>
        <h2 className="mt-6 text-2xl font-semibold">Application received</h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">We'll contact you within 48 hours about the next steps.</p>
        <p className="mt-6 text-xs text-muted-foreground">Sample data for MVP demonstration · No real application is submitted.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-3xl border bg-card p-7 shadow-soft md:grid-cols-2 md:p-9">
      <label className="text-sm font-medium text-navy">Full name<input required name="name" className={field} autoComplete="off" /></label>
      <label className="text-sm font-medium text-navy">ASE / mechanic certification #<input required name="cert" placeholder="ASE-1234567" className={field} autoComplete="off" /></label>
      <label className="text-sm font-medium text-navy">Years of experience<input required name="years" type="number" min="0" max="60" className={field} /></label>
      <label className="text-sm font-medium text-navy">City / State<input required name="city" placeholder="Los Angeles, CA" className={field} autoComplete="off" /></label>
      <fieldset className="md:col-span-2">
        <legend className="text-sm font-medium text-navy">Equipment you own</legend>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {equipment.map(item => (
            <label key={item} className="flex items-center gap-2.5 rounded-lg border bg-background px-3 py-2.5 text-sm">
              <input type="checkbox" name="equipment" value={item} className="h-4 w-4 accent-primary" />{item}
            </label>
          ))}
        </div>
      </fieldset>
      <Button type="submit" variant="cta" size="lg" className="md:col-span-2">Submit application</Button>
      <p className="text-xs text-muted-foreground md:col-span-2">Sample data for MVP demonstration · No real application is submitted.</p>
    </form>
  );
}

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
      <div className="mx-auto max-w-3xl px-5 pb-24">
        <h2 className="text-center text-2xl font-semibold md:text-3xl">Apply as an inspector</h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-muted-foreground">Tell us about your certifications and equipment. We review every application by hand.</p>
        <div className="mt-8"><ApplicationForm /></div>
      </div>
    </>
  );
}
