import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Save } from 'lucide-react';
import { AccountGate, AccountLayout, inputClass } from '@/components/account-ui';
import { useDemoAccount } from '@/components/demo-account';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/_authenticated/_buyer/account/settings')({ head: () => pageHead('Account settings', 'Update the name and contact details on your Trustferly demonstration account.'), component: Page });
function Page() { return <AccountGate next="/account/settings"><Settings /></AccountGate>; }
function Settings() {
  const { account, updateAccount } = useDemoAccount();
  const [saved, setSaved] = useState(false);
  return <AccountLayout title="Account settings" subtitle="Your personal details."><form className="max-w-lg space-y-6" onChange={() => setSaved(false)} onSubmit={e => { e.preventDefault(); const data = new FormData(e.currentTarget); updateAccount(String(data.get('name')), String(data.get('email'))); setSaved(true); }}>
    <label className="block text-sm font-medium">Your name<input required name="name" defaultValue={account?.name} className={inputClass} /></label>
    <label className="block text-sm font-medium">Email<input name="email" defaultValue={account?.email} className={inputClass} /></label>
    <Button type="submit"><Save />Save changes</Button>{saved && <p role="status" className="text-sm text-accent">Changes saved.</p>}
  </form></AccountLayout>;
}