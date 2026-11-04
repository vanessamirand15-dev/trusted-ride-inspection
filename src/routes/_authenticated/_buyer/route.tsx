import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { profileIsComplete } from '@/lib/buyer-profile';
import { buyerDestination } from '@/lib/account-navigation';
export const Route = createFileRoute('/_authenticated/_buyer')({
  beforeLoad: async ({ context, location }) => {
    const { data, error } = await supabase.from('profiles').select('full_name,phone,contact_preference,buyer_profile_completed').eq('id', context.userId).single();
    if (error) throw new Error('Your profile could not be loaded. Please try again.');
    if (!profileIsComplete(data)) throw redirect({ to: '/complete-profile', search: { next: buyerDestination(location.pathname) } });
  },
  component: () => <Outlet />,
});