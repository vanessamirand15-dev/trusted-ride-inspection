import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, Plus, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { inputClass, displayTime, StatusBadge } from '@/components/account-ui';
import { openDemoAccount } from '@/lib/demo-access';
import { canCancel, createBooking, stages, statusOf, type DemoState } from '@/lib/demo-bookings';
import { inspectionPlans, packageLabel } from '@/lib/inspection-plans';
import { pageHead } from '@/lib/page-head';
import { InspectionReport } from '@/components/inspection-report';

export const Route = createFileRoute('/demo')({ head: () => pageHead('Demo account', 'Explore fictional Trustferly inspection bookings without creating a real account.'), component: DemoPage });

function DemoPage() {
  const [state, setState] = useState<DemoState>({ account: null, bookings: [] });
  const [selected, setSelected] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const booking = state.bookings.find(item => item.id === selected);
  if (!state.account) return <section className="mx-auto max-w-md px-5 py-16 md:py-24">
    <p className="mb-7 flex items-center gap-2 text-sm font-medium text-accent"><ShieldCheck size={20} />Demo account</p>
    <h1 className="text-4xl font-semibold">Welcome back</h1>
    <p className="mt-3 text-muted-foreground">Demonstration only. No real account is created and no private bookings are accessed.</p>
    <form className="mt-7 space-y-5" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); try { setState(openDemoAccount(String(data.get('name') || ''), String(data.get('password') || ''))); } catch (error) { setError(error instanceof Error ? error.message : 'Please try again.'); } }}>
      <label className="block text-sm font-medium">Name or username<input name="name" required autoComplete="off" className={inputClass} /></label>
      <label className="block text-sm font-medium">Demo password<input name="password" required type="password" autoComplete="off" className={inputClass} /></label>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" variant="cta" size="lg" className="w-full">Enter demo<ArrowRight /></Button>
    </form>
    <Button variant="outline" className="mt-4 w-full" onClick={() => setState(openDemoAccount('test user', 'demo', true))}>Open sample account</Button>
    <Button asChild variant="link" className="mt-4"><Link to="/auth"><ArrowLeft />Real account login</Link></Button>
  </section>;
  return <section className="mx-auto max-w-5xl px-5 py-12">
    <p className="mb-6 border-b pb-4 text-sm text-muted-foreground">Demo account · Fictional bookings · Changes last only while this page is open</p>
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-semibold">Your Bookings</h1><p className="mt-2 text-muted-foreground">{state.account.name}</p></div><div className="flex gap-3"><Button variant="outline" onClick={() => { setState({ account: null, bookings: [] }); setSelected(''); setAdding(false); }}>Exit demo</Button><Button variant="cta" onClick={() => { setAdding(true); setSelected(''); }}><Plus />New demo inspection</Button></div></div>
    {adding && <form className="mt-8 space-y-5 border-y py-6" onSubmit={event => { event.preventDefault(); if (!state.account) return; const data = new FormData(event.currentTarget); const plan = inspectionPlans.find(plan => plan.id === data.get('plan')) ?? inspectionPlans[0]; if (!plan) return; const item = createBooking(state.account.id, { vehicle: String(data.get('vehicle')), vin: '', location: String(data.get('location')), date: String(data.get('date')), package: packageLabel(plan.id), purpose: 'buyer' }); setState({ ...state, bookings: [...state.bookings, item] }); setAdding(false); setSelected(item.id); }}>
      <h2 className="text-xl font-semibold">New demo inspection</h2>
      <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-medium">Vehicle<input required name="vehicle" className={inputClass} /></label><label className="text-sm font-medium">Location<input required name="location" className={inputClass} /></label><label className="text-sm font-medium">Inspection date<input required name="date" type="date" className={inputClass} /></label><label className="text-sm font-medium">Inspection package<select name="plan" className={inputClass}>{inspectionPlans.map(plan => <option key={plan.id} value={plan.id}>{packageLabel(plan.id)}</option>)}</select></label></div>
      <Button type="submit" variant="cta">Save demo request</Button>
    </form>}
    {booking ? <div className="mt-8"><Button variant="ghost" onClick={() => setSelected('')}><ArrowLeft />All demo bookings</Button><h2 className="mt-5 text-2xl font-semibold">{booking.vehicle}</h2><p className="mt-2 text-muted-foreground">{booking.location} · {booking.package}</p><div className="mt-4"><StatusBadge booking={booking} /></div><ol className="my-8 space-y-4">{stages.map((stage, index) => <li key={stage} className="flex items-center gap-3"><span className={`h-3 w-3 shrink-0 rounded-full ${booking.timestamps[index] ? 'bg-accent' : 'bg-border'}`} /><span>{stage}{booking.timestamps[index] && <span className="block text-sm text-muted-foreground">{displayTime(booking.timestamps[index])}</span>}</span></li>)}</ol>{canCancel(booking) && <Button variant="outline" onClick={() => setState({ ...state, bookings: state.bookings.map(item => item.id === booking.id ? { ...item, cancelledAt: new Date().toISOString() } : item) })}>Cancel demo inspection</Button>}{statusOf(booking) === 'Completed' && <InspectionReport booking={booking} />}</div> : !adding && <div className="mt-8 grid gap-4 sm:grid-cols-2">{state.bookings.length === 0 && <p className="text-muted-foreground">No demo inspections yet.</p>}{state.bookings.map(item => <Button key={item.id} variant="outline" className="h-auto justify-between whitespace-normal p-5 text-left" onClick={() => setSelected(item.id)}><span><span className="block font-semibold">{item.vehicle}</span><span className="mt-2 block text-sm text-muted-foreground">{statusOf(item)}</span></span><ArrowRight className="shrink-0" /></Button>)}</div>}
  </section>;
}