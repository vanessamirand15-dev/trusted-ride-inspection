import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Save } from 'lucide-react';
import { AccountGate, AccountLayout, inputClass } from '@/components/account-ui';
import { useDemoAccount } from '@/components/demo-account';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/_authenticated/_buyer/account/settings')({ head: () => pageHead('Account settings', 'Update your Trustferly contact details and preferences.'), component: Page });
function Page() { return <AccountGate next="/account/settings"><Settings /></AccountGate>; }
function Settings() {
  const { account, phone, preference, updateAccount } = useDemoAccount();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(''), [busy, setBusy] = useState(false);
  return <AccountLayout title="Account settings" subtitle="Your personal details."><form className="max-w-lg space-y-6" onChange={() => setSaved(false)} onSubmit={async e => { e.preventDefault(); const data = new FormData(e.currentTarget); setBusy(true); setError(''); try { await updateAccount(String(data.get('name')), String(data.get('phone')), String(data.get('preference'))); setSaved(true); } catch (error) { setError(error instanceof Error ? error.message : 'Could not save changes.'); } finally { setBusy(false); } }}>
    <label className="block text-sm font-medium">Your name<input required name="name" defaultValue={account?.name} className={inputClass} /></label>
    <p className="text-sm text-muted-foreground">Email: {account?.email}</p>
    <label className="block text-sm font-medium">Phone number<input required type="tel" name="phone" defaultValue={phone} className={inputClass} /></label>
    <label className="block text-sm font-medium">Preferred contact method<select name="preference" defaultValue={preference} className={inputClass}><option value="email">Email</option><option value="phone">Phone</option></select></label>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <Button type="submit" disabled={busy}><Save />{busy ? 'Saving…' : 'Save changes'}</Button>{saved && <p role="status" className="text-sm text-accent">Changes saved.</p>}
  </form></AccountLayout>;
}