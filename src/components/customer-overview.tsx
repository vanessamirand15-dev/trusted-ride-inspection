import { CustomerLink as Link } from '@/components/quick-customer';
import { AccountGate, AccountLayout } from '@/components/account-ui';
import { useCustomerAccount } from '@/components/quick-customer';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function Overview() {
  const { account, logout, phone, preference } = useCustomerAccount();
  const bookings = useCustomerAccount().bookings;
  return <AccountLayout title={`Hello, ${account?.name}`} subtitle="Your name, contact details, and all of your inspections in one place.">
    <dl className="grid gap-6 border-y py-8 sm:grid-cols-3"><div><dt className="text-sm text-muted-foreground">Name</dt><dd className="mt-2 break-words font-medium">{account?.name}</dd></div><div><dt className="text-sm text-muted-foreground">Email</dt><dd className="mt-2 break-words font-medium">{account?.email || 'Not provided'}</dd></div><div><dt className="text-sm text-muted-foreground">Inspection bookings</dt><dd className="mt-2 text-2xl font-semibold">{bookings.length}</dd></div></dl>
    <dl className="mt-6 grid gap-6 sm:grid-cols-2"><div><dt className="text-sm text-muted-foreground">Phone number</dt><dd className="mt-2 font-medium">{phone}</dd></div><div><dt className="text-sm text-muted-foreground">Preferred contact method</dt><dd className="mt-2 font-medium">{preference === 'phone' ? 'Phone' : 'Email'}</dd></div></dl>
    <section className="mt-8 border-t pt-6"><h2 className="text-2xl">Saved vehicles</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">{bookings.filter((b, i) => bookings.findIndex(item => item.vehicle === b.vehicle) === i).map(b => <Link key={b.id} to="/bookings/$bookingId" bookingId={b.id} className="rounded-lg border bg-card p-5"><span className="block font-semibold">{b.vehicle}</span><span className="mt-2 block text-sm text-muted-foreground">{b.vin || 'VIN not provided'} · {b.location}</span></Link>)}</div></section>
    <div className="mt-8 flex flex-wrap gap-3"><Button asChild><Link to="/bookings">Your Bookings</Link></Button><Button asChild variant="outline"><Link to="/account/settings">Edit your details</Link></Button><Button variant="ghost" onClick={logout}><LogOut />Sign out</Button></div>
  </AccountLayout>;
}