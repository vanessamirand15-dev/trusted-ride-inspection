import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageIntro } from '@/components/site-chrome';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/apply')({
  head: () => pageHead('Apply as an inspector', 'Apply to join Trustferly as an independent certified vehicle inspector.'),
  component: Page,
});

const field = 'mt-1 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring';

function Page() {
  const [sent, setSent] = useState(false);
  const [radius, setRadius] = useState(25);
  const submit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); setSent(true); };
  return <>
    <PageIntro eyebrow="Inspector onboarding" title="Apply to inspect with Trustferly" text="Tell us about yourself, your certifications and how far you are willing to travel." />
    <div className="mx-auto max-w-3xl px-5 pb-24">
      {sent ? <div className="rounded-3xl border bg-card p-10 text-center shadow-soft" role="status">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-foreground"><BadgeCheck className="h-8 w-8" /></span>
        <h2 className="mt-6 text-2xl font-semibold">Application received</h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">Your background check is pending. Meanwhile, explore the inspector dashboard with sample data.</p>
        <Button asChild variant="cta" className="mt-6"><Link to="/inspector/dashboard">Open inspector dashboard</Link></Button>
        <p className="mt-6 text-xs text-muted-foreground">Demonstration only · No real application is submitted.</p>
      </div> :
      <form onSubmit={submit} className="space-y-8 rounded-3xl border bg-card p-7 shadow-soft md:p-9">
        <fieldset className="grid gap-5 md:grid-cols-2">
          <legend className="mb-4 text-lg font-semibold">Personal info</legend>
          <label className="text-sm font-medium">Full name<input required name="name" className={field} autoComplete="off" /></label>
          <label className="text-sm font-medium">Email<input required type="email" name="email" className={field} autoComplete="off" /></label>
          <label className="text-sm font-medium">Phone<input required type="tel" name="phone" className={field} autoComplete="off" /></label>
          <label className="text-sm font-medium">Home ZIP code<input required name="zip" inputMode="numeric" pattern="[0-9]{5}" className={field} autoComplete="off" /></label>
        </fieldset>
        <fieldset className="grid gap-5 md:grid-cols-2">
          <legend className="mb-4 text-lg font-semibold">Certification and experience</legend>
          <label className="text-sm font-medium">ASE / mechanic certification #<input required name="cert" placeholder="ASE-1234567" className={field} autoComplete="off" /></label>
          <label className="text-sm font-medium">Years of experience<input required name="years" type="number" min="0" max="60" className={field} /></label>
          <label className="text-sm font-medium md:col-span-2">Specialties<textarea name="notes" rows={3} placeholder="European cars, trucks, EVs…" className={field} /></label>
        </fieldset>
        <fieldset>
          <legend className="mb-4 text-lg font-semibold">Service radius</legend>
          <label className="text-sm font-medium">Maximum distance willing to travel: <span className="text-primary">{radius} miles</span>
            <input type="range" min={5} max={100} step={5} value={radius} onChange={e => setRadius(Number(e.target.value))} className="mt-3 w-full accent-primary" />
          </label>
        </fieldset>
        <label className="flex items-start gap-3 rounded-lg border bg-background p-4 text-sm">
          <input required type="checkbox" name="consent" className="mt-1 h-4 w-4 accent-primary" />
          I consent to a background check and verification of my certifications.
        </label>
        <Button type="submit" variant="cta" size="lg" className="w-full">Submit application</Button>
        <p className="text-xs text-muted-foreground">Demonstration only · No real application is submitted.</p>
      </form>}
    </div>
  </>;
}
