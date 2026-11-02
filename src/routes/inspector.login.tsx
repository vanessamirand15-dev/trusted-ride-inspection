import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/inspector/login')({
  head: () => pageHead('Inspector sign in', 'Sign in or create your Trustferly inspector account to manage your profile, documents and assigned jobs.'),
  component: Page,
});

const field = 'mt-1 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring';

function Page() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) navigate({ to: '/inspector/portal', replace: true }); });
  }, [navigate]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email')).trim();
    const password = String(f.get('password'));
    setBusy(true); setMsg(null);
    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/inspector/login`, data: { full_name: String(f.get('name')).trim() } },
      });
      setBusy(false);
      if (error) return setMsg({ ok: false, text: error.message });
      if (data.session) return navigate({ to: '/inspector/portal' });
      return setMsg({ ok: true, text: 'Check your email to confirm your account, then sign in here.' });
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setMsg({ ok: false, text: error.message });
    navigate({ to: '/inspector/portal' });
  }

  return <section className="mx-auto max-w-md px-5 py-16">
    <p className="mb-2 text-xs font-semibold uppercase text-accent">Inspector account</p>
    <h1 className="text-3xl font-semibold">{mode === 'signin' ? 'Inspector sign in' : 'Create inspector account'}</h1>
    <p className="mt-3 text-muted-foreground">Your profile, verification documents and assigned jobs are saved to your account.</p>
    <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border bg-card p-6 shadow-soft">
      {mode === 'signup' && <label className="block text-sm font-medium">Full name<input name="name" required className={field} /></label>}
      <label className="block text-sm font-medium">Email<input name="email" type="email" required autoComplete="email" className={field} /></label>
      <label className="block text-sm font-medium">Password<input name="password" type="password" required minLength={8} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} className={field} /></label>
      {msg && <p role="status" className={`text-sm ${msg.ok ? 'text-accent' : 'text-destructive'}`}>{msg.text}</p>}
      <Button type="submit" variant="cta" className="w-full" disabled={busy}>{busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}</Button>
      <button type="button" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMsg(null); }} className="w-full text-sm text-primary hover:underline">
        {mode === 'signin' ? 'New inspector? Create an account' : 'Already have an account? Sign in'}
      </button>
    </form>
    <p className="mt-6 text-center text-sm text-muted-foreground">Just exploring? <Link to="/inspector/dashboard" className="text-primary hover:underline">Open the sample portal (demo data)</Link></p>
  </section>;
}
