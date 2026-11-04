import { createFileRoute, Link } from '@tanstack/react-router';
import { AuthForm } from '@/components/auth-form';
import { pageHead } from '@/lib/page-head';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const Route = createFileRoute('/inspector/login')({
  head: () => pageHead('Inspector sign in', 'Sign in or create your Trustferly inspector account to manage your profile, documents and assigned jobs.'),
  component: Page,
});

function Page() {
  return <><section className="mx-auto max-w-md px-5 pt-10">
    <Button asChild variant="outline" size="lg" className="w-full"><Link to="/inspector/dashboard">Explore Inspector Portal<ArrowRight /></Link></Button>
    <p className="mt-3 text-center text-sm text-muted-foreground">No account or password needed. Example profile and jobs for testing only.</p>
  </section><AuthForm destination="/inspector/portal" /></>;
}
