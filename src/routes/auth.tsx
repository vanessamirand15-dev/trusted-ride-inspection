import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { AuthForm } from '@/components/auth-form';
import { useDemoAccount } from '@/components/demo-account';
import { pageHead } from '@/lib/page-head';
import { buyerDestination } from '@/lib/account-navigation';
export const Route = createFileRoute('/auth')({
  validateSearch: (search: Record<string, unknown>) => ({ next: buyerDestination(search['next']) }),
  head: () => pageHead('Log in or sign up', 'Access your Trustferly account and manage your vehicle inspection bookings.'),
  component: Page,
});
function Page() {
  const { next } = Route.useSearch();
  const { account, ready } = useDemoAccount();
  const navigate = useNavigate();
  useEffect(() => { if (ready && account) void navigate({ to: next, replace: true }); }, [ready, account, next, navigate]);
  return <AuthForm />;
}