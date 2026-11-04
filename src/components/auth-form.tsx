import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useDemoAccount } from '@/components/demo-account';
import { Apple, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';

export function AuthForm({ destination }: { destination?: '/inspector/portal' }) {
  const { ready, account } = useDemoAccount();
  const navigate = useNavigate();
  useEffect(() => { if (destination && ready && account) void navigate({ to: destination, replace: true }); }, [destination, ready, account, navigate]);
  const [signup, setSignup] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMessage('');
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email')).trim(), password = String(f.get('password'));
    try {
      const { data, error } = signup ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: { full_name: String(f.get('name') || '').trim() } } }) : await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (signup && !data.session) setMessage('Check your email to confirm your account. Then return here to sign in and complete your profile.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not sign in. Please try again.'); }
    finally { setBusy(false); }
  }
  async function social(provider: 'google' | 'apple' | 'lovable') {
    setBusy(true); setMessage('');
    try { const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: `${window.location.origin}${destination ? '/inspector/login' : '/auth'}` }); if (result.error) throw result.error; }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not sign in. Please try again.'); }
    finally { setBusy(false); }
  }
  return <section className="mx-auto max-w-md px-5 py-16 md:py-24">
    <div className="mb-7 flex items-center gap-2 text-sm font-medium text-accent"><ShieldCheck size={20} />{destination ? 'Inspector account' : 'Buyer account'}</div>
    <h1 className="text-4xl font-semibold">{signup ? 'Create your account' : 'Welcome back'}</h1>
    <p className="mt-3 text-muted-foreground">{signup ? 'A fresh start for your next vehicle inspection.' : 'Your inspections, all in one place.'}</p>
    <div className="my-7 grid grid-cols-2 border-b" role="tablist" aria-label="Account access">
      <Button type="button" role="tab" aria-selected={!signup} variant="ghost" className={!signup ? 'rounded-none border-b-2 border-primary text-primary' : 'rounded-none'} onClick={() => { setSignup(false); setMessage(''); }}>Log in</Button>
      <Button type="button" role="tab" aria-selected={signup} variant="ghost" className={signup ? 'rounded-none border-b-2 border-primary text-primary' : 'rounded-none'} onClick={() => { setSignup(true); setMessage(''); }}>Sign up</Button>
    </div>
    <form onSubmit={submit} className="space-y-5">
      {signup && <label className="block text-sm font-medium">Your name<input name="name" required autoComplete="name" className="mt-2 w-full rounded-md border bg-card px-3 py-3 outline-none focus:ring-2 focus:ring-ring" /></label>}
      <label className="block text-sm font-medium">Email<input required name="email" type="email" autoComplete="email" className="mt-2 w-full rounded-md border bg-card px-3 py-3 outline-none focus:ring-2 focus:ring-ring" /></label>
      <label className="block text-sm font-medium">Password<input required name="password" type="password" minLength={8} autoComplete={signup ? 'new-password' : 'current-password'} className="mt-2 w-full rounded-md border bg-card px-3 py-3 outline-none focus:ring-2 focus:ring-ring" /></label>
      {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
      <Button type="submit" variant="cta" size="lg" disabled={busy} className="w-full">{busy ? 'Please wait…' : signup ? 'Create account' : 'Log in'}<ArrowRight /></Button>
    </form>
    <div className="my-6 flex items-center gap-4 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />Or continue with<span className="h-px flex-1 bg-border" /></div>
    <div className="grid gap-3">
      <Button variant="outline" size="lg" disabled={busy} onClick={() => social('google')}><span className="font-semibold" aria-hidden>G</span>Continue with Google</Button>
      <Button variant="outline" size="lg" disabled={busy} onClick={() => social('apple')}><Apple />Continue with Apple</Button>
      <Button variant="outline" size="lg" disabled={busy} onClick={() => social('lovable')}><ShieldCheck />Continue with Lovable</Button>
    </div>
    {!destination && <div className="mt-7 border-t pt-5"><Button asChild variant="outline" size="lg" className="w-full"><Link to="/demo">Try the demo account<ArrowRight /></Link></Button><p className="mt-3 text-xs text-muted-foreground">Demonstration only. No real account or email confirmation required.</p></div>}
  </section>;
}