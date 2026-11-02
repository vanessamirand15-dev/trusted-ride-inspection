import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { BadgeCheck, CalendarClock, Calculator, ShieldCheck, TriangleAlert, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { inspectionPlans, packageLabel } from '@/lib/inspection-plans';

const ages = ['0-3 yrs', '4-8 yrs', '9+ yrs'] as const;
const classes = ['Sedan', 'SUV', 'Truck', 'Luxury'] as const;

const savingsByAge: Record<(typeof ages)[number], number> = { '0-3 yrs': 300, '4-8 yrs': 450, '9+ yrs': 650 };

export function CostEstimator() {
  const [age, setAge] = useState<(typeof ages)[number]>('4-8 yrs');
  const [vehicleClass, setVehicleClass] = useState<(typeof classes)[number]>('Sedan');

  const premium = vehicleClass === 'Luxury' || age === '9+ yrs';
  const plan = premium ? inspectionPlans[1] : inspectionPlans[0];
  const savings = savingsByAge[age] + (vehicleClass === 'Luxury' || vehicleClass === 'Truck' ? 150 : 0);

  const selectClass = 'mt-1 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring';

  return (
    <section aria-labelledby="estimator-heading" className="border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2 md:items-center">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-accent"><Calculator className="h-4 w-4" />Estimate Your Inspection Value</p>
          <h2 id="estimator-heading" className="mt-3 text-3xl font-semibold md:text-4xl">What could an inspection save you?</h2>
          <p className="mt-4 text-muted-foreground">Answer two quick questions to see the inspection we recommend and the repair costs it could help you avoid or negotiate down.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-navy">Vehicle age
              <select value={age} onChange={e => setAge(e.target.value as (typeof ages)[number])} className={selectClass}>
                {ages.map(a => <option key={a}>{a}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-navy">Vehicle class
              <select value={vehicleClass} onChange={e => setVehicleClass(e.target.value as (typeof classes)[number])} className={selectClass}>
                {classes.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
          </div>
        </div>
        <div className="rounded-3xl border bg-card p-8 shadow-soft" role="status" aria-live="polite">
          <p className="text-sm text-muted-foreground">Recommended inspection</p>
          <p className="mt-1 text-xl font-semibold text-navy">{packageLabel(plan)}</p>
          <dl className="mt-6 grid grid-cols-2 gap-5 border-t pt-6">
            <div><dt className="text-sm text-muted-foreground">Estimated cost</dt><dd className="mt-1 text-3xl font-semibold text-navy">${plan.price}</dd></div>
            <div><dt className="text-sm text-muted-foreground">Potential savings on hidden repairs</dt><dd className="mt-1 text-3xl font-semibold text-accent">${savings}+</dd></div>
          </dl>
          <Button asChild variant="cta" size="lg" className="mt-7 w-full"><Link to="/book" search={{ plan: plan.id }}>Book the {plan.name}</Link></Button>
          <p className="mt-4 text-xs text-muted-foreground">Illustrative estimate for demonstration. Actual findings and savings vary by vehicle.</p>
        </div>
      </div>
    </section>
  );
}

const blindRisks = ['Hidden transmission faults surface after the sale', 'Undisclosed accident history stays invisible', 'Unexpected repair bills land on you'];
const protectedGains = ['150+ point diagnostic check before you pay', 'Findings give you leverage to negotiate a discount', 'Peace of mind from an independent verdict'];

export function RiskCompare() {
  return (
    <section aria-labelledby="compare-heading" className="border-t">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <h2 id="compare-heading" className="text-center text-3xl font-semibold md:text-4xl">The cost of guessing vs. the value of knowing</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border bg-card p-8">
            <p className="flex items-center gap-2 text-lg font-semibold"><TriangleAlert className="h-5 w-5 text-warning" />Buying blind</p>
            <ul className="mt-5 space-y-3">
              {blindRisks.map(r => <li key={r} className="flex items-start gap-3 text-sm text-muted-foreground"><TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />{r}</li>)}
            </ul>
          </div>
          <div className="rounded-3xl border border-accent bg-teal-soft p-8">
            <p className="flex items-center gap-2 text-lg font-semibold text-accent"><ShieldCheck className="h-5 w-5" />Inspected by Trustferly</p>
            <ul className="mt-5 space-y-3">
              {protectedGains.map(g => <li key={g} className="flex items-start gap-3 text-sm font-medium text-navy"><BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{g}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const pillars = [
  { icon: ShieldCheck, title: 'Rigorous Background Checks', text: '100% verified, certified mechanics. Every inspector passes identity, certification and quality screening.' },
  { icon: Zap, title: 'Same-Day / Next-Day Service', text: 'Quick turnaround so you never lose a deal to another buyer while waiting.' },
  { icon: CalendarClock, title: 'Reschedule Protection', text: 'Free rescheduling if the seller postpones or cancels. Your booking stays safe.' },
];

export function TrustPillars() {
  return (
    <section aria-labelledby="trust-heading" className="border-t bg-card">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <h2 id="trust-heading" className="text-center text-3xl font-semibold md:text-4xl">Why buyers trust Trustferly</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pillars.map(p => (
            <div key={p.title} className="rounded-2xl border bg-background p-7 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-teal-soft text-accent"><p.icon className="h-6 w-6" /></span>
              <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
