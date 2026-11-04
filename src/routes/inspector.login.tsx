import { createFileRoute, Link } from '@tanstack/react-router';
import { AuthForm } from '@/components/auth-form';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/inspector/login')({
  head: () => pageHead('Inspector sign in', 'Sign in or create your Trustferly inspector account to manage your profile, documents and assigned jobs.'),
  component: Page,
});

function Page() {
  return <><AuthForm destination="/inspector/portal" /><p className="mb-12 px-5 text-center text-sm text-muted-foreground">Just exploring? <Link to="/inspector/dashboard" className="text-primary hover:underline">Open the sample portal (demo data)</Link></p></>;
}
