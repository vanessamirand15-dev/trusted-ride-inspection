import { Overview } from '@/components/customer-overview';
import { createFileRoute, Link } from '@tanstack/react-router';
import { AccountGate, AccountLayout } from '@/components/account-ui';
import { useDemoAccount, useBookings } from '@/components/demo-account';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/_authenticated/_buyer/account/')({ head: () => pageHead('Your account', 'Manage your Trustferly buyer account and vehicle inspection bookings.'), component: Page });
function Page() {
  return <AccountGate next="/account"><Overview /></AccountGate>;
}
