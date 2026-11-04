import { useEffect, useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { inputClass } from '@/components/account-ui';
import { useQuickCustomer } from '@/components/quick-customer';
import { Overview } from '@/components/customer-overview';
import { Settings } from '@/components/customer-settings';
import { Bookings } from '@/components/customer-bookings';
import { Detail } from '@/components/customer-booking-detail';
import { BookingWizard } from '@/components/booking-wizard';
import type { CustomerView } from '@/lib/quick-customer';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/demo')({
  validateSearch: (search: Record<string, unknown>): { name?: string; view?: CustomerView; bookingId?: string } => {
    const name = search['name']; const view = search['view']; const bookingId = search['bookingId'];
    return { ...(typeof name === 'string' && name.trim() ? { name: name.trim().slice(0, 60) } : {}), ...(view === 'account' || view === 'settings' || view === 'book' || view === 'detail' || view === 'bookings' ? { view } : {}), ...(typeof bookingId === 'string' ? { bookingId } : {}) };
  },
  head: ({ match }) => pageHead(match.search.view === 'settings' ? 'Quick access account settings' : match.search.view === 'account' ? 'Quick access customer profile' : match.search.view === 'detail' ? 'Quick access inspection details' : match.search.view === 'book' ? 'Quick access inspection request' : 'Quick access account', 'Manage fictional Trustferly customer details, inspection requests and example reports with quick account access.'),
  component: DemoPage,
});
function DemoPage() {
  const { name, view, bookingId } = Route.useSearch();
  const quick = useQuickCustomer();
  const [error, setError] = useState('');
  useEffect(() => { if (name && !quick.account) quick.login(name, 'quick'); }, [name]);
  if (!quick.account) return <section className="mx-auto max-w-md px-5 py-16 md:py-24">
    <p className="mb-7 flex items-center gap-2 text-sm font-medium text-accent"><ShieldCheck size={20} />Quick access</p>
    <h1 className="text-4xl font-semibold">Welcome back</h1>
    <p className="mt-3 text-muted-foreground">Example bookings only. No live inspection requests are submitted.</p>
    <form className="mt-7 space-y-5" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); try { quick.login(String(data.get('name') || ''), String(data.get('password') || '')); } catch (error) { setError(error instanceof Error ? error.message : 'Please try again.'); } }}>
      <label className="block text-sm font-medium">Name or username<input name="name" required autoComplete="off" className={inputClass} /></label>
      <label className="block text-sm font-medium">Password<input name="password" required type="password" autoComplete="off" className={inputClass} /></label>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" variant="cta" size="lg" className="w-full">Log in<ArrowRight /></Button>
    </form>
    <Button variant="outline" className="mt-4 w-full" onClick={() => quick.login('test user', 'demo', true)}>Open sample account</Button>
    <Button asChild variant="link" className="mt-4"><Link to="/auth"><ArrowLeft />Email account login</Link></Button>
  </section>;
  return <>
    <p className="mx-auto max-w-5xl border-b px-5 py-4 text-sm text-muted-foreground">Example customer information and bookings. No live inspection or payment is submitted. Changes last until you leave or refresh.</p>
    {view === 'account' ? <Overview /> : view === 'settings' ? <Settings /> : view === 'book' ? <BookingWizard /> : view === 'detail' && bookingId ? <Detail key={bookingId} bookingId={bookingId} /> : <Bookings />}
  </>;
}
