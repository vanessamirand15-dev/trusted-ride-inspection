import { Settings } from '@/components/customer-settings';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Save } from 'lucide-react';
import { AccountGate, AccountLayout, inputClass } from '@/components/account-ui';
import { useDemoAccount } from '@/components/demo-account';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/_authenticated/_buyer/account/settings')({ head: () => pageHead('Account settings', 'Update your Trustferly contact details and preferences.'), component: Page });
function Page() { return <AccountGate next="/account/settings"><Settings /></AccountGate>; }
