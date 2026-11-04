import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { buyerDestination, inspectorAccountPath } from '@/lib/account-navigation';

// Shared gate for real buyer and inspector accounts.
export const Route = createFileRoute('/_authenticated')({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      if (inspectorAccountPath(location.pathname)) throw redirect({ to: '/inspector/login' });
      throw redirect({ to: '/auth', search: { next: buyerDestination(location.pathname) } });
    }
    return { userId: data.user.id };
  },
  component: () => <Outlet />,
});
