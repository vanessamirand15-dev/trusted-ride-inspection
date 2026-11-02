import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/site-chrome";
import { AccountGate } from '@/components/account-ui';
import { useDemoAccount } from '@/components/demo-account';
import { inspectionPlans, packageLabel } from '@/lib/inspection-plans';

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>): { plan?: 'standard' | 'premium' } => {
    const plan = search['plan'];
    return plan === 'standard' || plan === 'premium' ? { plan } : {};
  },
  head: () => ({
    meta: [
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { title: "Book an inspection · Trustferly" },
      { name: "description", content: "Request an independent pre-purchase inspection for a used vehicle." },
      { property: "og:title", content: "Book a Trustferly inspection" },
      { property: "og:description", content: "Request a verified inspector for the car you're considering." },
    ],
  }),
  component: Page,
});

const field = "mt-1 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

function Page() {
  return <AccountGate next="/book"><BookingForm /></AccountGate>;
}
function BookingForm() {
  const { plan } = Route.useSearch();
  const { account, addBooking } = useDemoAccount();
  const navigate = useNavigate();
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const booking = addBooking({ vehicle: String(data.get('vehicle')), vin: String(data.get('vin')), location: String(data.get('location')), date: String(data.get('date')), package: String(data.get('package')) });
    if (booking) navigate({ to: '/bookings/$bookingId', params: { bookingId: booking.id } });
  };

  return (
    <>
      <PageIntro eyebrow="Book" title="Request an inspection" text="Tell us about the vehicle and we'll match you with a verified inspector." />
      <div className="mx-auto max-w-2xl px-5 pb-24">
          <form onSubmit={submit} className="grid gap-5 border-y py-8 md:grid-cols-2">
            <label className="text-sm font-medium text-navy">Your name<input required defaultValue={account?.name} className={field} /></label>
            <label className="text-sm font-medium text-navy">Email or username<input required defaultValue={account?.email || account?.name} className={field} /></label>
            <label className="text-sm font-medium text-navy">Year, make & model<input name="vehicle" required placeholder="2018 Honda Accord" className={field} /></label>
            <label className="text-sm font-medium text-navy">VIN (optional)<input name="vin" className={field} /></label>
            <label className="text-sm font-medium text-navy md:col-span-2">Vehicle location<input name="location" required placeholder="City or address" className={field} /></label>
            <label className="text-sm font-medium text-navy">Preferred date<input name="date" required type="date" className={field} /></label>
            <label className="text-sm font-medium text-navy">Package
              <select name="package" className={field} defaultValue={plan === 'premium' ? packageLabel(inspectionPlans[1]) : packageLabel(inspectionPlans[0])}>{inspectionPlans.map(p => <option key={p.id}>{packageLabel(p)}</option>)}</select>
            </label>
            <Button type="submit" variant="cta" size="lg" className="md:col-span-2">Request inspection</Button>
            <p className="text-xs text-muted-foreground md:col-span-2">Demonstration booking · No real inspection is arranged.</p>
          </form>
      </div>
    </>
  );
}
