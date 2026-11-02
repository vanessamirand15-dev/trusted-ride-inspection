import { Link, useNavigate } from '@tanstack/react-router';
import { useState, type FormEvent, type ReactNode } from 'react';
import { ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDemoAccount } from '@/components/demo-account';
import { statusOf, type Booking } from '@/lib/demo-bookings';
import logoAsset from '@/assets/trustferly_logo.png.asset.json';

export const inputClass = 'mt-2 w-full rounded-md border bg-card px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring';
export function AuthScreen({ next = '/bookings' }: { next?: '/book' | '/bookings' | '/account' | '/account/settings' }) {
  const [signup, setSignup] = useState(false);
  const [error, setError] = useState('');
  const { login } = useDemoAccount();
  const navigate = useNavigate();
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const identity = String(data.get('identity') || '').trim();
    const password = String(data.get('password') || '');
    if (!identity || !password.trim()) { setError('Enter a name and password to continue.'); return; }
    const sample = !signup && identity.toLowerCase() === 'test user';
    if (sample && password !== 'password') { setError('The sample account password is password.'); return; }
    login(signup ? String(data.get('name') || identity).trim() : identity, signup ? identity : '', sample);
    navigate({ to: sample || signup ? '/bookings' : next });
  }
  return <section className="mx-auto max-w-md px-5 py-16 md:py-24">
    <div className="mb-7 flex items-center gap-2 text-sm font-medium text-accent"><img src={logoAsset.url} alt="Trustferly logo" width={32} height={32} className="h-8 w-8" /> Buyer account <span className="ml-auto rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground">Demo</span></div>
    <h1 className="text-4xl font-semibold">{signup ? 'Create your account' : 'Welcome back'}</h1>
    <p className="mt-3 text-muted-foreground">{signup ? 'A fresh start for your next vehicle inspection.' : 'Your inspections, all in one place.'}</p>
    <div className="my-7 grid grid-cols-2 border-b" role="tablist" aria-label="Account access">
      <Button role="tab" aria-selected={!signup} variant="ghost" className={!signup ? 'rounded-none border-b-2 border-primary text-primary' : 'rounded-none'} onClick={() => { setSignup(false); setError(''); }}>Log in</Button>
      <Button role="tab" aria-selected={signup} variant="ghost" className={signup ? 'rounded-none border-b-2 border-primary text-primary' : 'rounded-none'} onClick={() => { setSignup(true); setError(''); }}>Sign up</Button>
    </div>
    <form onSubmit={submit} className="space-y-5">
      {signup && <label className="block text-sm font-medium">Your name<input name="name" required className={inputClass} autoComplete="off" /></label>}
      <label className="block text-sm font-medium">{signup ? 'Email or username' : 'Username'}<input name="identity" required className={inputClass} autoComplete="off" /></label>
      <label className="block text-sm font-medium">Password<input name="password" required type="password" className={inputClass} autoComplete="off" /></label>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button className="w-full" size="lg" type="submit" variant="cta">{signup ? 'Create account' : 'Log in'}<ArrowRight /></Button>
    </form>
    <p className="mt-6 text-xs text-muted-foreground">Demonstration only · No real account is created.</p>
    {!signup && <div className="mt-6 border-t pt-5 text-sm"><p className="font-medium">Sample account</p><p className="mt-1 text-muted-foreground">Username: test user · Password: password</p></div>}
  </section>;
}
export function AccountGate({ children, next = '/bookings' }: { children: ReactNode; next?: '/book' | '/bookings' | '/account' | '/account/settings' }) {
  const { ready, account } = useDemoAccount();
  if (!ready) return <div className="mx-auto max-w-5xl px-5 py-20 text-muted-foreground" role="status">Loading account…</div>;
  return account ? children : <AuthScreen next={next} />;
}
export function AccountLayout({ title, subtitle, children, action }: { title: string; subtitle: string; children: ReactNode; action?: ReactNode }) {
  return <section className="mx-auto max-w-5xl px-5 py-10 md:py-16">
    <nav aria-label="Account" className="mb-10 flex flex-wrap gap-6 border-b pb-4 text-sm">
      {([{ to: '/bookings', label: 'Your Bookings' }, { to: '/account', label: 'Your account' }, { to: '/account/settings', label: 'Settings' }] as const).map(n => <Link key={n.to} to={n.to} activeOptions={{ exact: true }} activeProps={{ className: 'text-primary font-semibold' }} className="text-muted-foreground hover:text-primary">{n.label}</Link>)}
    </nav>
    <div className="mb-9 flex flex-wrap items-start justify-between gap-5"><div><p className="mb-2 text-xs font-semibold uppercase text-accent">Buyer account</p><h1 className="text-3xl font-semibold md:text-4xl">{title}</h1><p className="mt-3 text-muted-foreground">{subtitle}</p></div>{action}</div>
    {children}
  </section>;
}
export function StatusBadge({ booking }: { booking: Booking }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${booking.cancelledAt ? 'bg-secondary text-muted-foreground' : 'bg-teal-soft text-accent'}`}>{statusOf(booking) === 'Completed' && <Check size={13} />}{statusOf(booking)}</span>;
}
export function displayTime(value: string) { return new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }); }
export function displayDate(value: string) { return new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }