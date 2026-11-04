import { CustomerLink as Link, useCustomerAccount } from '@/components/quick-customer';
import { type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { statusOf, type Booking } from '@/lib/demo-bookings';

export const inputClass = 'mt-2 w-full rounded-md border bg-card px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring';
export function AccountGate({ children }: { children: ReactNode; next?: string; bookingPlan?: string; bookingPurpose?: string }) {
  const { ready, error } = useCustomerAccount();
  if (error) return <p role="alert" className="mx-auto max-w-5xl px-5 py-20 text-destructive">{error}</p>;
  if (!ready) return <p role="status" className="mx-auto max-w-5xl px-5 py-20 text-muted-foreground">Loading your account…</p>;
  return children;
}
export function AccountLayout({ title, subtitle, children, action }: { title: string; subtitle: string; children: ReactNode; action?: ReactNode }) {
  return <section className="mx-auto max-w-5xl px-5 py-10 md:py-16">
    <nav aria-label="Account" className="mb-10 flex flex-wrap gap-6 border-b pb-4 text-sm">
      {([{ to: '/bookings', label: 'Your Bookings' }, { to: '/account', label: 'Your account' }, { to: '/account/settings', label: 'Settings' }] as const).map(n => <Link key={n.to} to={n.to} className="text-muted-foreground hover:text-primary">{n.label}</Link>)}
    </nav>
    <div className="mb-9 flex flex-wrap items-start justify-between gap-5"><div><p className="mb-2 text-xs font-semibold uppercase text-accent">Inspection account</p><h1 className="text-3xl font-semibold md:text-4xl">{title}</h1><p className="mt-3 text-muted-foreground">{subtitle}</p></div>{action}</div>
    {children}
  </section>;
}
export function StatusBadge({ booking }: { booking: Booking }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${booking.cancelledAt ? 'bg-secondary text-muted-foreground' : 'bg-teal-soft text-accent'}`}>{statusOf(booking) === 'Completed' && <Check size={13} />}{statusOf(booking)}</span>;
}
export function displayTime(value: string) { return new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }); }
export function displayDate(value: string) { return new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }