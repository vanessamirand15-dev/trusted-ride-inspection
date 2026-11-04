import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useDemoAccount } from '@/components/demo-account';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/lib/page-head';
import { buyerDestination } from '@/lib/account-navigation';

export const Route = createFileRoute('/_authenticated/complete-profile')({ validateSearch: (search: Record<string, unknown>) => ({ next: buyerDestination(search['next']) }), head: () => pageHead('Complete your profile', 'Save your contact details and preferences before managing your Trustferly inspections.'), component: Page });
function Page() {
  const { next } = Route.useSearch();
  const { account, phone, preference, ready, updateAccount, logout } = useDemoAccount();
  const navigate = useNavigate();
  const [error, setError] = useState(''), [busy, setBusy] = useState(false);
  if (!ready) return <p role="status" className="px-5 py-16 text-center">Loading your profile…</p>;
  const field = 'mt-2 w-full rounded-md border bg-card px-3 py-3 outline-none focus:ring-2 focus:ring-ring';
  return <section className="mx-auto max-w-lg px-5 py-16"><p className="text-sm font-medium text-accent">Your inspection account</p><h1 className="mt-3 text-3xl font-semibold">Complete your profile</h1><p className="mt-3 text-muted-foreground">Add your contact details before viewing or requesting inspections.</p>
    <form className="mt-8 space-y-5 rounded-lg border bg-card p-6" onSubmit={async e => { e.preventDefault(); const f = new FormData(e.currentTarget); setBusy(true); setError(''); try { await updateAccount(String(f.get('name')), String(f.get('phone')), String(f.get('preference'))); await navigate({ to: next, replace: true }); } catch (error) { setError(error instanceof Error ? error.message : 'Could not save your profile.'); } finally { setBusy(false); } }}>
      <label className="block text-sm font-medium">Full name<input name="name" required defaultValue={account?.name === 'Your account' ? '' : account?.name} autoComplete="name" className={field} /></label>
      <label className="block text-sm font-medium">Phone number<input name="phone" required type="tel" defaultValue={phone} autoComplete="tel" className={field} /></label>
      <label className="block text-sm font-medium">Preferred contact method<select name="preference" defaultValue={preference} className={field}><option value="email">Email</option><option value="phone">Phone</option></select></label>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" variant="cta" disabled={busy} className="w-full">{busy ? 'Saving…' : next === '/book' ? 'Save profile and book inspection' : 'Save profile and view bookings'}</Button>
    </form><Button variant="ghost" onClick={logout} className="mt-4">Sign out</Button>
  </section>;
}