import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useDemoAccount } from '@/components/demo-account';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

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
    if (!signup && !destination && !email.includes('@')) { setBusy(false); void navigate({ to: '/demo', search: { name: email } }); return; }
    try {
      const { data, error } = signup ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: { full_name: String(f.get('name') || '').trim() } } }) : await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (signup && !data.session) setMessage('Check your email to confirm your account. Then return here to sign in and complete your profile.');
    } catch (error) {
      const text = error instanceof Error ? error.message : '';
      setMessage(/already registered/i.test(text) ? 'An account with this email already exists. Choose Log in instead.' : /invalid login/i.test(text) ? 'Email or password is incorrect.' : /password/i.test(text) ? 'Please use a password with at least 6 characters.' : text || 'Could not sign in. Please try again.');
    }
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
      <label className="block text-sm font-medium">{!signup && !destination ? 'Email or any username' : 'Email'}<input required name="email" type={!signup && !destination ? 'text' : 'email'} autoComplete={!signup && !destination ? 'username' : 'email'} className="mt-2 w-full rounded-md border bg-card px-3 py-3 outline-none focus:ring-2 focus:ring-ring" /></label>
      <label className="block text-sm font-medium">Password<input required name="password" type="password" minLength={signup || destination ? 6 : 1} autoComplete={signup ? 'new-password' : 'current-password'} className="mt-2 w-full rounded-md border bg-card px-3 py-3 outline-none focus:ring-2 focus:ring-ring" /></label>
      {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
      <Button type="submit" variant="cta" size="lg" disabled={busy} className="w-full">{busy ? 'Please wait…' : signup ? 'Create account' : 'Log in'}<ArrowRight /></Button>
    </form>
    {!signup && !destination && <div className="mt-6 border-t pt-5 text-sm"><p className="font-medium">Sample account</p><p className="mt-1 text-muted-foreground">Username: test user · Password: password</p></div>}
  </section>;
}
