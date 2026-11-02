import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, CalendarCheck, Car, Check, ChevronLeft, ClipboardList, CreditCard } from "lucide-react";
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

const timeSlots = ['Morning · 8:00 to 11:00', 'Midday · 11:00 to 2:00', 'Afternoon · 2:00 to 5:00'];

const stepMeta = [
  { icon: Car, label: 'Vehicle' },
  { icon: ClipboardList, label: 'Service' },
  { icon: CalendarCheck, label: 'Schedule' },
  { icon: CreditCard, label: 'Confirm' },
];

function Page() {
  const { plan } = Route.useSearch();
  return <AccountGate next="/book" bookingPlan={plan}><BookingWizard /></AccountGate>;
}

function BookingWizard() {
  const { plan } = Route.useSearch();
  const { account, addBooking } = useDemoAccount();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [vehicle, setVehicle] = useState('');
  const [vin, setVin] = useState('');
  const [location, setLocation] = useState('');
  const [planId, setPlanId] = useState<'standard' | 'premium'>(plan === 'premium' ? 'premium' : 'standard');
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState(timeSlots[0]);
  const [sellerName, setSellerName] = useState('');
  const [sellerContact, setSellerContact] = useState('');
  const [address, setAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [done, setDone] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState('');

  const selectedPlan = inspectionPlans.find(p => p.id === planId) ?? inspectionPlans[0];
  const stepOneValid = vehicle.trim().length > 0 && location.trim().length > 0;
  const stepThreeValid = date.length > 0 && sellerName.trim().length > 0 && sellerContact.trim().length > 0 && address.trim().length > 0;
  const cardValid = cardNumber.replace(/\D/g, '').length >= 12 && cardExpiry.trim().length >= 4 && cardCvc.trim().length >= 3;

  const confirm = () => {
    const booking = addBooking({
      vehicle: vehicle.trim(),
      vin: vin.trim(),
      location: `${address.trim()}, ${location.trim()}`,
      date: `${date} · ${slot}`,
      package: packageLabel(selectedPlan),
    });
    if (booking) {
      setBookingId(booking.id);
      setTrackingId(`TF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
      setDone(true);
    }
  };

  if (done) {
    return (
      <>
        <PageIntro eyebrow="Book" title="Request an inspection" text="Tell us about the vehicle and we'll match you with a verified inspector." />
        <div className="mx-auto max-w-2xl px-5 pb-24">
          <div className="rounded-3xl border bg-card p-10 text-center shadow-soft">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-foreground">
              <Check className="h-8 w-8" />
            </span>
            <h2 className="mt-6 text-3xl font-semibold">Inspection Scheduled!</h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">An inspector will be assigned shortly. You can follow every step from your bookings page.</p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-teal-soft px-4 py-2 text-sm font-semibold text-accent">Tracking ID: {trackingId}</p>
            <dl className="mx-auto mt-8 grid max-w-md gap-3 rounded-2xl bg-background p-5 text-left text-sm">
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Vehicle</dt><dd className="font-medium text-navy">{vehicle}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Package</dt><dd className="font-medium text-navy">{packageLabel(selectedPlan)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">When</dt><dd className="font-medium text-navy">{date} · {slot}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Location</dt><dd className="font-medium text-navy">{address}, {location}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Seller</dt><dd className="font-medium text-navy">{sellerName} · {sellerContact}</dd></div>
            </dl>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {bookingId && <Button asChild variant="cta" size="lg"><Link to="/bookings/$bookingId" params={{ bookingId }}>View booking</Link></Button>}
              <Button asChild variant="outline" size="lg"><Link to="/bookings">Your bookings</Link></Button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">Demonstration booking · No real inspection is arranged and no payment is taken.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageIntro eyebrow="Book" title="Request an inspection" text="Tell us about the vehicle and we'll match you with a verified inspector." />
      <div className="mx-auto max-w-2xl px-5 pb-24">
        <ol className="flex items-center gap-2 py-6" aria-label="Booking progress">
          {stepMeta.map((meta, i) => (
            <li key={meta.label} className="flex flex-1 items-center gap-2">
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border text-sm font-semibold ${i < step ? 'border-accent bg-accent text-accent-foreground' : i === step ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-muted-foreground'}`}>
                {i < step ? <Check className="h-4 w-4" /> : <meta.icon className="h-4 w-4" />}
              </span>
              <span className={`hidden text-sm font-medium sm:block ${i === step ? 'text-navy' : 'text-muted-foreground'}`}>{meta.label}</span>
              {i < stepMeta.length - 1 && <span className={`h-px flex-1 ${i < step ? 'bg-accent' : 'bg-border'}`} />}
            </li>
          ))}
        </ol>

        {step === 0 && (
          <section className="grid gap-5 border-y py-8 md:grid-cols-2" aria-label="Vehicle details">
            <h2 className="text-xl font-semibold md:col-span-2">Vehicle details</h2>
            <label className="text-sm font-medium text-navy md:col-span-2">Year, make & model<input required value={vehicle} onChange={e => setVehicle(e.target.value)} placeholder="2021 Honda CR-V" className={field} /></label>
            <label className="text-sm font-medium text-navy">VIN (optional)<input value={vin} onChange={e => setVin(e.target.value)} placeholder="1HGCV1F34LA000000" className={field} /></label>
            <label className="text-sm font-medium text-navy">Vehicle location ZIP or city<input required value={location} onChange={e => setLocation(e.target.value)} placeholder="90001 or Los Angeles" className={field} /></label>
            <div className="flex justify-end md:col-span-2">
              <Button variant="cta" size="lg" disabled={!stepOneValid} onClick={() => setStep(1)}>Continue</Button>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="grid gap-4 border-y py-8" aria-label="Service level">
            <h2 className="text-xl font-semibold">Choose your inspection</h2>
            {inspectionPlans.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlanId(p.id)}
                aria-pressed={planId === p.id}
                className={`rounded-2xl border p-5 text-left transition ${planId === p.id ? 'border-primary bg-card shadow-soft ring-2 ring-ring' : 'bg-background hover:bg-card'}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-navy">{p.name}</p>
                  <p className="text-lg font-semibold text-navy">${p.price}</p>
                </div>
                <ul className="mt-3 grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
                  {p.features.map(f => <li key={f} className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 shrink-0 text-accent" />{f}</li>)}
                </ul>
              </button>
            ))}
            <div className="mt-2 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(0)}><ChevronLeft />Back</Button>
              <Button variant="cta" size="lg" onClick={() => setStep(2)}>Continue</Button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="grid gap-5 border-y py-8" aria-label="Scheduling and seller contact">
            <h2 className="text-xl font-semibold">Scheduling & seller contact</h2>
            <label className="max-w-xs text-sm font-medium text-navy">Preferred date<input required type="date" value={date} onChange={e => setDate(e.target.value)} className={field} /></label>
            <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Preferred time slot">
              {timeSlots.map(t => (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={slot === t}
                  onClick={() => setSlot(t)}
                  className={`rounded-xl border p-4 text-sm font-medium transition ${slot === t ? 'border-primary bg-card shadow-soft ring-2 ring-ring' : 'bg-background hover:bg-card'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="grid gap-5 border-t pt-5 md:grid-cols-2">
              <label className="text-sm font-medium text-navy">Seller name<input required value={sellerName} onChange={e => setSellerName(e.target.value)} placeholder="Jane Doe" className={field} autoComplete="off" /></label>
              <label className="text-sm font-medium text-navy">Seller phone or email<input required value={sellerContact} onChange={e => setSellerContact(e.target.value)} placeholder="(555) 010-2030" className={field} autoComplete="off" /></label>
              <label className="text-sm font-medium text-navy md:col-span-2">Inspection address<input required value={address} onChange={e => setAddress(e.target.value)} placeholder="Street address where the car will be" className={field} autoComplete="off" /></label>
            </div>
            <div className="mt-2 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}><ChevronLeft />Back</Button>
              <Button variant="cta" size="lg" disabled={!stepThreeValid} onClick={() => setStep(3)}>Review & confirm</Button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="grid gap-5 border-y py-8" aria-label="Confirm booking">
            <h2 className="text-xl font-semibold">Review & confirm</h2>
            <dl className="grid gap-3 rounded-2xl border bg-card p-5 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Name</dt><dd className="font-medium text-navy">{account?.name}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Vehicle</dt><dd className="font-medium text-navy">{vehicle}</dd></div>
              {vin && <div className="flex justify-between gap-4"><dt className="text-muted-foreground">VIN</dt><dd className="font-medium text-navy">{vin}</dd></div>}
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Location</dt><dd className="font-medium text-navy">{address}, {location}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Seller</dt><dd className="font-medium text-navy">{sellerName} · {sellerContact}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">When</dt><dd className="font-medium text-navy">{date} · {slot}</dd></div>
              <div className="flex justify-between gap-4 border-t pt-3"><dt className="text-muted-foreground">Package</dt><dd className="font-medium text-navy">{selectedPlan.name}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Total due today</dt><dd className="text-lg font-semibold text-navy">${selectedPlan.price}</dd></div>
            </dl>
            <fieldset className="grid gap-4 rounded-2xl border bg-card p-5 sm:grid-cols-2">
              <legend className="px-1 text-sm font-semibold text-navy">Payment details</legend>
              <label className="text-sm font-medium text-navy sm:col-span-2">Card number<input inputMode="numeric" value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="4242 4242 4242 4242" className={field} autoComplete="off" /></label>
              <label className="text-sm font-medium text-navy">Expiry<input value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} placeholder="MM/YY" className={field} autoComplete="off" /></label>
              <label className="text-sm font-medium text-navy">CVC<input inputMode="numeric" value={cardCvc} onChange={e => setCardCvc(e.target.value)} placeholder="123" className={field} autoComplete="off" /></label>
            </fieldset>
            <p className="flex items-center gap-2 text-xs text-muted-foreground"><CreditCard className="h-4 w-4 shrink-0" />Simulated checkout · No payment is processed and card details are never stored.</p>
            <div className="mt-2 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)}><ChevronLeft />Back</Button>
              <Button variant="cta" size="lg" disabled={!cardValid} onClick={confirm}>Complete Booking</Button>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
