import { createFileRoute } from '@tanstack/react-router';
import { AuthScreen, AccountGate } from '@/components/account-ui';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/auth')({
  validateSearch: (search: Record<string, unknown>) => ({ next: search.next === '/book' ? '/book' as const : '/bookings' as const }),
  head: () => pageHead('Log in or sign up', 'Access your Trustferly demonstration account and inspection bookings.'),
  component: Page,
});
function Page() {
  const { next } = Route.useSearch();
  return <AccountGate next={next}><section className="mx-auto max-w-md px-5 py-20"><h1 className="text-3xl">You’re logged in</h1><Button asChild className="mt-6"><Link to={next}>{next === '/book' ? 'New booking' : 'Your Bookings'}</Link></Button></section></AccountGate>;
}