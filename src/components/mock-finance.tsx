import { useState, type FormEvent } from 'react';
import { Building2, CreditCard, Check, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

const field = 'mt-1 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring';

export function FinancialDisclaimer() {
  return <div className="border-l-2 border-accent bg-teal-soft px-4 py-3 text-sm text-accent">
    <p className="font-medium">Academic MVP Prototype — For demonstration purposes only</p>
    <p className="mt-1">Use dummy details only. No money moves and financial details are not saved or sent.</p>
  </div>;
}

export function MockPaymentGateway({ amount, onContinue, onBack }: { amount: number; onContinue: () => void; onBack: () => void }) {
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.currentTarget.reset();
    onContinue();
  }
  return <section className="space-y-5 border-y py-8" aria-label="Mock Payment Gateway">
    <h2 className="flex items-center gap-2 text-xl font-semibold"><CreditCard className="h-5 w-5 text-primary" />Mock Payment Gateway</h2>
    <FinancialDisclaimer />
    <div className="flex justify-between gap-4 text-sm"><span className="text-muted-foreground">Simulated inspection total</span><span className="text-lg font-semibold">${amount}</span></div>
    <form onSubmit={submit} autoComplete="off" className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-medium sm:col-span-2">Credit Card Number<input required name="mock-card" inputMode="numeric" maxLength={23} placeholder="4242 4242 4242 4242" className={field} /></label>
      <label className="text-sm font-medium">Expiration Date<input required name="mock-expiry" maxLength={7} placeholder="12/30" className={field} /></label>
      <label className="text-sm font-medium">CVV<input required name="mock-cvv" type="password" inputMode="numeric" maxLength={4} placeholder="123" className={field} /></label>
      <label className="text-sm font-medium sm:col-span-2">Billing Address<input required name="mock-billing" placeholder="123 Example Street, Los Angeles, CA 90001" className={field} /></label>
      <div className="mt-2 flex flex-wrap justify-between gap-3 sm:col-span-2">
        <Button type="button" variant="ghost" onClick={onBack}>Back</Button>
        <Button type="submit" variant="cta" size="lg">Continue to confirmation</Button>
      </div>
    </form>
  </section>;
}

const payouts = [
  { id: 'DEMO-1042', date: 'Oct 28, 2026', vehicle: '2020 Honda Accord', amount: 90 },
  { id: 'DEMO-1038', date: 'Oct 24, 2026', vehicle: '2019 Porsche Macan', amount: 180 },
  { id: 'DEMO-1031', date: 'Oct 20, 2026', vehicle: '2021 Toyota RAV4', amount: 100 },
];

export function MockWallet() {
  const [configured, setConfigured] = useState(false);
  function setup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.currentTarget.reset();
    setConfigured(true);
  }
  return <section className="space-y-6" aria-label="Wallet & Payouts">
    <h2 className="flex items-center gap-2 text-xl font-semibold"><Wallet className="h-5 w-5 text-primary" />Wallet & Payouts</h2>
    <FinancialDisclaimer />
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold"><Building2 className="h-5 w-5 text-accent" />Mock Direct Deposit</h3>
        <form onSubmit={setup} autoComplete="off" className="mt-4 space-y-4">
          <label className="block text-sm font-medium">Routing Number<input required name="mock-routing" inputMode="numeric" maxLength={9} placeholder="000000000" className={field} /></label>
          <label className="block text-sm font-medium">Account Number<input required name="mock-account" type="password" inputMode="numeric" maxLength={17} placeholder="000000000000" className={field} /></label>
          <Button type="submit" variant="cta">Simulate direct deposit setup</Button>
          {configured && <p role="status" className="flex items-start gap-2 text-sm text-accent"><Check className="h-4 w-4 shrink-0" />Mock setup complete. No bank account was connected or saved.</p>}
        </form>
      </div>
      <div className="min-w-0">
        <h3 className="text-lg font-semibold">Recent Earnings</h3>
        <p className="mt-1 text-sm text-muted-foreground">Fictional past payouts, not your actual earnings.</p>
        <ul className="mt-4 divide-y border-y">{payouts.map(p => <li key={p.id} className="flex items-start justify-between gap-3 py-4">
          <div className="min-w-0"><p className="text-sm font-medium">{p.vehicle}</p><p className="mt-1 text-xs text-muted-foreground">{p.date} · {p.id}</p><span className="mt-2 inline-block rounded-md bg-teal-soft px-2 py-1 text-xs text-accent">Simulated paid</span></div>
          <span className="shrink-0 font-semibold text-accent">${p.amount.toFixed(2)}</span>
        </li>)}</ul>
      </div>
    </div>
  </section>;
}