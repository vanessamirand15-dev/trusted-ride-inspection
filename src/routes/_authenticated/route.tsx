import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';

// Gate for real (Lovable Cloud) inspector accounts. The buyer /auth page is a separate demo flow.
export const Route = createFileRoute('/_authenticated')({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: '/inspector/login' });
  },
  component: () => <Outlet />,
});
