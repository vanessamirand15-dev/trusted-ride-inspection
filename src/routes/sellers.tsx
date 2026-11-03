import { createFileRoute, Link } from '@tanstack/react-router';
import { Car, ClipboardCheck, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageIntro } from '@/components/site-chrome';
import { StatusBadge } from '@/components/account-ui';
import { useBookings, useDemoAccount } from '@/components/demo-account';

export const Route = createFileRoute('/sellers')({
  head: () => ({ meta: [
    { title: 'Seller vehicle inspections · Trustferly' },
    { name: 'description', content: 'Request an independent inspection of your own car before selling and track your seller inspections.' },
    { property: 'og:title', content: 'Seller vehicle inspections · Trustferly' },
    { property: 'og:description', content: 'Understand your car’s condition before listing it for sale.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Sellers,
});

function Sellers() {
  const { account } = useDemoAccount();
  const bookings = useBookings().filter(booking => booking.purpose === 'seller');
  return <>
    <PageIntro eyebrow="For sellers" title="Inspect your car before selling" text="Get an independent view of your vehicle’s condition, whether it is already listed or you are preparing to sell." />
    <section className="mx-auto max-w-5xl px-5 pb-16">
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild variant="cta" size="lg"><Link to="/book" search={{ purpose: 'seller' }}><Car />Inspect my car</Link></Button>
        {account && <Button asChild variant="outline" size="lg"><Link to="/bookings">All your bookings</Link></Button>}
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">{account ? `Booking as ${account.name}` : 'Create an account or log in first to save and track your inspection.'}</p>
      <div className="mt-12 grid gap-8 border-y py-8 sm:grid-cols-3">
        {[{ icon: Car, title: 'Your vehicle', text: 'Add your car details. A listing is optional, so you can book before advertising it.' }, { icon: ClipboardCheck, title: 'Independent inspection', text: 'Choose from the same inspection packages and provide your own contact details and vehicle location.' }, { icon: FileText, title: 'Condition report', text: 'Track the inspection in your account and review findings and photos when the report is complete.' }].map(item => <div key={item.title}><item.icon className="h-6 w-6 text-accent" /><h2 className="mt-4 text-lg font-semibold">{item.title}</h2><p className="mt-2 text-sm text-muted-foreground">{item.text}</p></div>)}
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-semibold">Your seller inspections</h2>
        {bookings.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2">{bookings.map(booking => <Link key={booking.id} to="/bookings/$bookingId" params={{ bookingId: booking.id }} className="rounded-lg border bg-card p-5 transition-colors hover:border-primary"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold">{booking.vehicle}</h3><StatusBadge booking={booking} /></div><p className="mt-3 text-sm text-muted-foreground">{booking.location}</p><p className="mt-2 text-sm text-primary">View inspection →</p></Link>)}</div> : <div className="mt-5 border-b py-6"><p className="text-muted-foreground">{account ? 'No seller inspections yet.' : 'Your seller inspections will appear here after you log in and make a request.'}</p><Button asChild variant="outline" className="mt-4"><Link to="/book" search={{ purpose: 'seller' }}><Plus />Request a seller inspection</Link></Button></div>}
      </div>
      <p className="mt-8 text-xs text-muted-foreground">Demonstration only. No real inspection is arranged. A condition report is not ownership verification, a warranty or a guarantee of sale.</p>
    </section>
  </>;
}