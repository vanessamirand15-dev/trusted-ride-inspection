import { CustomerLink as Link } from '@/components/quick-customer';
import { Plus, ArrowUpRight, CarFront, CalendarDays, MapPin } from 'lucide-react';
import { AccountGate, AccountLayout, StatusBadge, displayDate } from '@/components/account-ui';
import { useCustomerAccount } from '@/components/quick-customer';
import { Button } from '@/components/ui/button';

export function Bookings() {
  const bookings = useCustomerAccount().bookings;
  return <AccountLayout title="Your Bookings" subtitle={`${bookings.length} ${bookings.length === 1 ? 'inspection' : 'inspections'} · Every car, a clearer picture.`} action={<Button asChild variant="cta"><Link to="/book"><Plus />New booking</Link></Button>}>
    {bookings.length === 0 ? <div className="border-y py-16 text-center"><CarFront className="mx-auto mb-5 h-10 w-10 text-accent" /><h2 className="text-2xl">You have no upcoming inspections</h2><p className="mt-3 text-muted-foreground">Your first inspection starts here.</p><Button asChild variant="outline" className="mt-6"><Link to="/book"><Plus />Book an inspection</Link></Button></div> : <div className="grid gap-4 md:grid-cols-2">
      {bookings.map(b => <Link key={b.id} to="/bookings/$bookingId" bookingId={b.id} className="group rounded-lg border bg-card p-6 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div className="mb-6 flex items-center justify-between gap-3"><StatusBadge booking={b} /><ArrowUpRight size={20} className="shrink-0 text-muted-foreground group-hover:text-primary" /></div>
        <h2 className="text-2xl">{b.vehicle}</h2><p className="mt-2 text-sm text-muted-foreground">{b.package}</p>
        <div className="mt-6 space-y-2 border-t pt-4 text-sm text-muted-foreground"><p className="flex items-center gap-2"><CalendarDays size={15} />{displayDate(b.date.split(' · ')[0] ?? b.date)}</p><p className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0" />{b.location}</p></div>
      </Link>)}
    </div>}
  </AccountLayout>;
}