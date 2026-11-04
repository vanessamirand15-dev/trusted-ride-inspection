import { useState, type FormEvent } from 'react';
import { Apple, ArrowRight, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import logoAsset from '@/assets/trustferly_logo.png.asset.json';

export function AuthForm() {
  const [signup, setSignup] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMessage('');
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email')).trim(), password = String(f.get('password'));
    try {
      const { data, error } = signup ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } }) : await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (signup && !data.session) setMessage('Check your email to confirm your account. Then return here to sign in and complete your profile.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not sign in. Please try again.'); }
    finally { setBusy(false); }
  }
  async function social(provider: 'google' | 'apple' | 'lovable') {
    setBusy(true); setMessage('');
    try { const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin }); if (result.error) throw result.error; }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not sign in. Please try again.'); }
    finally { setBusy(false); }
  }
  return <section className="mx-auto max-w-md px-5 py-12 md:py-16">
    <img src={logoAsset.url} alt="Trustferly" width={48} height={48} className="mb-6 h-12 w-12" />
    <h1 className="text-3xl font-semibold">{signup ? 'Create your account' : 'Welcome to Trustferly'}</h1>
    <p className="mt-4 rounded-md border bg-teal-soft p-4 text-sm text-foreground">Please log in or create a profile to view and manage your bookings.</p>
    <div className="mt-7 grid gap-3">
      <Button variant="outline" size="lg" disabled={busy} onClick={() => social('google')}><span className="font-semibold" aria-hidden>G</span>Continue with Google</Button>
      <Button variant="outline" size="lg" disabled={busy} onClick={() => social('apple')}><Apple />Continue with Apple</Button>
      <Button variant="outline" size="lg" disabled={busy} onClick={() => social('lovable')}><ShieldCheck />Continue with Lovable</Button>
    </div>
    <div className="my-6 flex items-center gap-4 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />Or use your email<span className="h-px flex-1 bg-border" /></div>
    <form onSubmit={submit} className="space-y-5 rounded-lg border bg-card p-6 shadow-soft">
      <label className="block text-sm font-medium">Email<input required name="email" type="email" autoComplete="email" className="mt-2 w-full rounded-md border bg-card px-3 py-3 outline-none focus:ring-2 focus:ring-ring" /></label>
      <label className="block text-sm font-medium">Password<input required name="password" type="password" minLength={8} autoComplete={signup ? 'new-password' : 'current-password'} className="mt-2 w-full rounded-md border bg-card px-3 py-3 outline-none focus:ring-2 focus:ring-ring" /></label>
      {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
      <Button type="submit" variant="cta" size="lg" disabled={busy} className="w-full"><Mail />{busy ? 'Please wait…' : signup ? 'Create account' : 'Log in'}<ArrowRight /></Button>
      <Button type="button" variant="link" className="h-auto w-full whitespace-normal" onClick={() => { setSignup(!signup); setMessage(''); }}>{signup ? 'Already have an account? Log in' : 'New here? Create an account'}</Button>
    </form>
  </section>;
}