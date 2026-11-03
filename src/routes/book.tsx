import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, CalendarCheck, Car, Check, ChevronLeft, ClipboardList, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/site-chrome";
import { AccountGate } from '@/components/account-ui';
import { useDemoAccount } from '@/components/demo-account';
import { inspectionPlans, packageLabel } from '@/lib/inspection-plans';
import { FinancialDisclaimer, MockPaymentGateway } from '@/components/mock-finance';
import { parseListingText, type ParsedListing } from '@/lib/listing-parse';
import { useServerFn } from '@tanstack/react-start';
import { importListingFromUrl } from '@/lib/listing-import.functions';
import { readListingScreenshotFn } from '@/lib/ai/read-screenshot.functions';

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
  { icon: CreditCard, label: 'Payment' },
  { icon: Check, label: 'Confirm' },
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
  const [listingUrl, setListingUrl] = useState('');
  const [listingText, setListingText] = useState('');
  const [listingStatus, setListingStatus] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [vin, setVin] = useState('');
  const [location, setLocation] = useState('');
  const [planId, setPlanId] = useState<'standard' | 'premium'>(plan === 'premium' ? 'premium' : 'standard');
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState(timeSlots[0]);
  const [sellerName, setSellerName] = useState('');
  const [sellerContact, setSellerContact] = useState('');
  const [address, setAddress] = useState('');
  const [done, setDone] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState('');

  const selectedPlan = inspectionPlans.find(p => p.id === planId) ?? inspectionPlans[0];
  const stepOneValid = vehicle.trim().length > 0 && location.trim().length > 0;
  const stepThreeValid = date.length > 0 && sellerName.trim().length > 0 && sellerContact.trim().length > 0 && address.trim().length > 0;

  const readListing = useServerFn(importListingFromUrl);
  const [urlBusy, setUrlBusy] = useState(false);
  const [urlStatus, setUrlStatus] = useState('');
  const importFromUrl = async () => {
    setUrlBusy(true); setUrlStatus('Reading the listing…');
    try {
      const res = await readListing({ data: { url: listingUrl } });
      if (!res.ok) setUrlStatus(`${res.reason} Paste the ad text below or enter the details by hand.`);
      else setUrlStatus(applyListing(res.listing, 'We could not find vehicle details on that page. Paste the ad text below or enter them by hand.'));
    } catch {
      setUrlStatus('Something went wrong reading that link. Paste the ad text below or enter the details by hand.');
    } finally { setUrlBusy(false); }
  };

  const [intake, setIntake] = useState<'link' | 'shot' | 'text' | 'manual'>('link');
  const readShot = useServerFn(readListingScreenshotFn);
  const [shotPreview, setShotPreview] = useState('');
  const [shotBusy, setShotBusy] = useState(false);
  const [shotStatus, setShotStatus] = useState('');
  const onShot = (file?: File) => {
    setShotStatus('');
    if (!file) { setShotPreview(''); return; }
    if (file.size > 5 * 1024 * 1024) { setShotPreview(''); setShotStatus('That image is too large. Please use one under 5 MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => setShotPreview(String(reader.result));
    reader.readAsDataURL(file);
  };
  const importFromShot = async () => {
    setShotBusy(true); setShotStatus('Reading the screenshot…');
    try {
      const res = await readShot({ data: { image: shotPreview } });
      if (!res.ok) setShotStatus(`${res.reason} Paste the ad text below or enter the details by hand.`);
      else setShotStatus(applyListing(res.listing, 'We could not find vehicle details in that screenshot. Paste the ad text below or enter them by hand.'));
    } catch {
      setShotStatus('Something went wrong reading that screenshot. Paste the ad text below or enter the details by hand.');
    } finally { setShotBusy(false); }
  };

  const fillFromListing = () => {
    setListingStatus(applyListing(parseListingText(listingText), 'We could not read vehicle details from that text. Please enter them by hand below.'));
  };

  const applyListing = (parsed: ParsedListing, emptyMessage: string) => {
    const filled: string[] = [];
    if (parsed.vehicle) { setVehicle(parsed.vehicle); filled.push('year, make & model'); }
    if (parsed.vin) { setVin(parsed.vin); filled.push('VIN'); }
    if (parsed.location) { setLocation(parsed.location); filled.push('location'); }
    const extras = [
      parsed.mileage ? `mileage (${parsed.mileage})` : '',
      parsed.price ? `asking price (${parsed.price})` : '',
    ].filter(Boolean).join(' and ');
    return (filled.length === 0
      ? emptyMessage
      : `Filled ${filled.join(', ')}${extras ? `, also found ${extras}` : ''}. Review and edit the details below.`);
  };

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
            <div className="mt-4 text-left"><FinancialDisclaimer /></div>
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
            <div className="grid gap-4 rounded-lg border bg-muted/40 p-5 md:col-span-2">
              <div>
                <p className="font-semibold text-navy">Fill details automatically (optional)</p>
                <p className="text-sm text-muted-foreground">Choose one of these options, or skip it and enter the details yourself.</p>
              </div>
              <div role="tablist" aria-label="Ways to add your listing" className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-4">
                {([['link', 'Link', 'Paste the listing page address'], ['shot', 'Screenshot', 'Upload a photo of the ad'], ['text', 'Paste text', 'Copy the ad text in'], ['manual', 'Enter details manually', 'Type them in yourself']] as const).map(([id, label, hint]) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={intake === id}
                    onClick={() => { setIntake(id); if (id === 'manual') setTimeout(() => document.getElementById('vehicle-input')?.focus(), 0); }}
                    className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition ${intake === id ? 'border-primary bg-card shadow-soft ring-2 ring-ring' : 'bg-background hover:border-primary/40 hover:bg-card'}`}
                  >
                    <span aria-hidden className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border ${intake === id ? 'border-primary bg-primary' : 'border-input'}`}>
                      {intake === id && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                    </span>
                    <span>
                      <span className={`block text-sm font-medium ${intake === id ? 'text-navy' : 'text-foreground'}`}>{label}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>
                    </span>
                  </button>
                ))}
              </div>
              {intake === 'manual' && <p className="text-sm text-muted-foreground">No problem. Type your vehicle details in the read-out fields below.</p>}
              {intake === 'link' && (<>
                <label className="text-sm font-medium text-navy">Car listing URL<input type="url" value={listingUrl} onChange={e => setListingUrl(e.target.value)} placeholder="https://example.com/vehicle-listing" className={field} autoComplete="off" /></label>
                <p className="text-sm text-muted-foreground">Some sites, like Facebook Marketplace, block automatic reading. If so, try a screenshot or paste the text.</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button type="button" variant="cta" disabled={!listingUrl.trim() || urlBusy} onClick={importFromUrl}><ExternalLink />{urlBusy ? 'Reading listing…' : 'Import from link'}</Button>
                  {urlStatus && <p role="status" className="text-sm text-muted-foreground">{urlStatus}</p>}
                </div>
              </>)}
              {intake === 'shot' && (<>
                <label className="text-sm font-medium text-navy">Listing screenshot (PNG, JPG or WebP, up to 5 MB)<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => onShot(e.target.files?.[0])} className={field} /></label>
                {shotPreview && <img src={shotPreview} alt="Uploaded listing screenshot" className="max-h-56 w-auto rounded-md border object-contain" />}
                <div className="flex flex-wrap items-center gap-3">
                  <Button type="button" variant="cta" disabled={!shotPreview || shotBusy} onClick={importFromShot}><ScanSearch />{shotBusy ? 'Reading screenshot…' : 'Read screenshot'}</Button>
                  {shotStatus && <p role="status" className="text-sm text-muted-foreground">{shotStatus}</p>}
                </div>
              </>)}
              {intake === 'text' && (<>
                <label htmlFor="listing-text" className="text-sm font-medium text-navy">Paste the ad text</label>
                <textarea
                  id="listing-text"
                  rows={4}
                  value={listingText}
                  onChange={e => setListingText(e.target.value)}
                  placeholder={"2021 Honda CR-V EX-L\nMileage: 45,000 miles\n$28,500\nLocated in Los Angeles, CA 90001"}
                  className={`${field} resize-y`}
                />
                <div className="flex flex-wrap items-center gap-3">
                  <Button type="button" variant="cta" disabled={!listingText.trim()} onClick={fillFromListing}><ClipboardPaste />Fill details from text</Button>
                  {listingStatus && <p role="status" className="text-sm text-muted-foreground">{listingStatus}</p>}
                </div>
              </>)}
            </div>
            <p className="text-sm font-semibold text-navy md:col-span-2">Your vehicle <span className="font-normal text-muted-foreground">· check and edit these read-outs</span></p>
            <label className="block rounded-xl border bg-muted/40 px-3 py-2 transition focus-within:ring-2 focus-within:ring-ring md:col-span-2" htmlFor="vehicle-input">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Year, make &amp; model</span>
              <input id="vehicle-input" required value={vehicle} onChange={e => setVehicle(e.target.value)} placeholder="2021 Honda CR-V" className="w-full bg-transparent p-0 text-base font-semibold text-navy outline-none" />
            </label>
            <label className="block rounded-xl border bg-muted/40 px-3 py-2 transition focus-within:ring-2 focus-within:ring-ring">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">VIN (optional)</span>
              <input value={vin} onChange={e => setVin(e.target.value)} placeholder="1HGCV1F34LA000000" className="w-full bg-transparent p-0 text-base font-semibold text-navy outline-none" />
            </label>
            <label className="block rounded-xl border bg-muted/40 px-3 py-2 transition focus-within:ring-2 focus-within:ring-ring">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Vehicle location ZIP or city</span>
              <input required value={location} onChange={e => setLocation(e.target.value)} placeholder="90001 or Los Angeles" className="w-full bg-transparent p-0 text-base font-semibold text-navy outline-none" />
            </label>
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
              <Button variant="cta" size="lg" disabled={!stepThreeValid} onClick={() => setStep(3)}>Continue to payment</Button>
            </div>
          </section>
        )}

        {step === 3 && <MockPaymentGateway amount={selectedPlan.price} onBack={() => setStep(2)} onContinue={() => setStep(4)} />}

        {step === 4 && (
          <section className="grid gap-5 border-y py-8" aria-label="Confirm booking">
            <h2 className="text-xl font-semibold">Review & confirm</h2>
            <FinancialDisclaimer />
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
            <p className="flex items-center gap-2 text-sm text-accent"><Check className="h-4 w-4 shrink-0" />Mock payment step complete. No charge made.</p>
            <div className="mt-2 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(3)}><ChevronLeft />Back</Button>
              <Button variant="cta" size="lg" onClick={confirm}>Complete Booking</Button>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
