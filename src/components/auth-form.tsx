import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useDemoAccount } from '@/components/demo-account';
import { Apple, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.3h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.02.15 3.5 2.7.24.03c2.2-2.1 3.5-5.1 3.5-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5l-.14.01-3.6 2.8-.05.13C3.4 21.3 7.4 24 12 24z" />
      <path fill="#FBBC05" d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.2-1.7.4-2.4l-.01-.16-3.7-2.8-.12.06C.5 8.2 0 10 0 12s.5 3.8 1.3 5.4l3.9-3z" />
      <path fill="#EA4335" d="M12 4.6c2.2 0 3.6.9 4.5 1.7l3.3-3.2C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.3 6.6l3.9 3c1-2.9 3.7-5 6.8-5z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#1877F2" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4h-3v-3.5h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12z" />
    </svg>
  );
}

export function AuthForm({ destination }: { destination?: '/inspector/portal' }) {
  const { ready, account } = useDemoAccount();
  const navigate = useNavigate();
  useEffect(() => { if (destination && ready && account) void navigate({ to: destination, replace: true }); }, [destination, ready, account, navigate]);
  const [signup, setSignup] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [socialMessage, setSocialMessage] = useState('');
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
    <div className="my-6 flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Or continue with</span>
      <span className="h-px flex-1 bg-border" />
    </div>
    <div className="space-y-3">
      <Button type="button" variant="outline" size="lg" className="w-full" onClick={() => setSocialMessage('Social login will be available in a future update.')}><GoogleIcon />Continue with Google</Button>
      <Button type="button" variant="outline" size="lg" className="w-full" onClick={() => setSocialMessage('Social login will be available in a future update.')}><Apple />Continue with Apple</Button>
      <Button type="button" variant="outline" size="lg" className="w-full" onClick={() => setSocialMessage('Social login will be available in a future update.')}><FacebookIcon />Continue with Facebook</Button>
      {socialMessage && <p role="status" className="text-center text-sm text-muted-foreground">{socialMessage}</p>}
    </div>
    {!signup && !destination && <div className="mt-6 border-t pt-5 text-sm"><p className="font-medium">Sample account</p><p className="mt-1 text-muted-foreground">Username: test user · Password: password</p></div>}
  </section>;
}
