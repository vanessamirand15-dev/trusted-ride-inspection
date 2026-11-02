import { createFileRoute, Link } from '@tanstack/react-router';
import { AccountGate, AccountLayout } from '@/components/account-ui';
import { useDemoAccount, useBookings } from '@/components/demo-account';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/account/')({ head: () => pageHead('Your account', 'Manage your Trustferly buyer account and vehicle inspection bookings.'), component: Page });
function Page() {
  return <AccountGate next="/account"><Overview /></AccountGate>;
}
function Overview() {
  const { account, logout } = useDemoAccount();
  const bookings = useBookings();
  return <AccountLayout title={`Hello, ${account?.name}`} subtitle="Your name, contact details, and all of your inspections in one place.">
    <dl className="grid gap-6 border-y py-8 sm:grid-cols-3"><div><dt className="text-sm text-muted-foreground">Name</dt><dd className="mt-2 break-words font-medium">{account?.name}</dd></div><div><dt className="text-sm text-muted-foreground">Email or username</dt><dd className="mt-2 break-words font-medium">{account?.email || 'Not provided'}</dd></div><div><dt className="text-sm text-muted-foreground">Inspection bookings</dt><dd className="mt-2 text-2xl font-semibold">{bookings.length}</dd></div></dl>
    <div className="mt-8 flex flex-wrap gap-3"><Button asChild><Link to="/bookings">Your Bookings</Link></Button><Button asChild variant="outline"><Link to="/account/settings">Edit your details</Link></Button><Button variant="ghost" onClick={logout}><LogOut />Sign out</Button></div>
  </AccountLayout>;
}