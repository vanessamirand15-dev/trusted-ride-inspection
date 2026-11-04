import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { AuthForm } from '@/components/auth-form';
import { useDemoAccount } from '@/components/demo-account';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/auth')({
  validateSearch: (search: Record<string, unknown>): { next?: '/book' | '/bookings' } => search['next'] === '/book' ? { next: '/book' } : {},
  head: () => pageHead('Log in or sign up', 'Access your Trustferly account and manage your vehicle inspection bookings.'),
  component: Page,
});
function Page() {
  const { account, ready } = useDemoAccount();
  const navigate = useNavigate();
  useEffect(() => { if (ready && account) void navigate({ to: '/bookings', replace: true }); }, [ready, account, navigate]);
  return <AuthForm />;
}