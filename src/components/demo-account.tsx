import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { profileIsComplete } from '@/lib/buyer-profile';
import type { Booking, DemoState } from '@/lib/demo-bookings';

interface AccountContext extends DemoState {
  ready: boolean; error: string; phone: string; preference: string;
  logout: () => Promise<void>;
  addBooking: (input: Omit<Booking, 'id' | 'accountId' | 'timestamps'>) => Promise<Booking>;
  cancelBooking: (id: string) => Promise<void>;
  updateAccount: (name: string, phone: string, preference: string) => Promise<void>;
}
const Context = createContext<AccountContext | null>(null);
export function DemoAccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [identityReady, setIdentityReady] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  useEffect(() => {
    let active = true;
    // Authentication transitions are subscribed once in the root route.
    const refresh = () => { void supabase.auth.getUser().then(({ data }) => { if (active) { setUser(data.user); setIdentityReady(true); } }); };
    refresh();
    window.addEventListener('trustferly-auth-change', refresh);
    return () => { active = false; window.removeEventListener('trustferly-auth-change', refresh); };
  }, []);
  const profile = useQuery({ queryKey: ['buyer-profile', user?.id], enabled: Boolean(user), queryFn: async () => {
    if (!user) return null;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (error) throw error; return data;
  } });
  const bookings = useQuery({ queryKey: ['buyer-bookings', user?.id], enabled: Boolean(user && profileIsComplete(profile.data ?? null)), queryFn: async (): Promise<Booking[]> => {
    if (!user) return [];
    const { data, error } = await supabase.from('buyer_bookings').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(b => ({ id: b.id, accountId: b.user_id, vehicle: b.vehicle, vin: b.vin, location: b.location, date: b.preferred_date, package: b.package, timestamps: b.timestamps, purpose: b.purpose === 'seller' ? 'seller' : 'buyer', ...(b.inspector ? { inspector: b.inspector } : {}), ...(b.cancelled_at ? { cancelledAt: b.cancelled_at } : {}) }));
  } });
  const value: AccountContext = {
    account: user ? { id: user.id, name: profile.data?.full_name || 'Your account', email: user.email ?? '' } : null,
    bookings: user ? bookings.data ?? [] : [], phone: profile.data?.phone ?? '', preference: profile.data?.contact_preference ?? 'email',
    ready: identityReady && (!user || (!profile.isPending && (!profileIsComplete(profile.data ?? null) || !bookings.isPending))),
    error: profile.error?.message || bookings.error?.message || '',
    logout: async () => { await queryClient.cancelQueries(); queryClient.clear(); setUser(null); await supabase.auth.signOut(); await navigate({ to: '/auth', replace: true }); },
    addBooking: async input => {
      if (!user) throw new Error('Please sign in first.');
      const { data, error } = await supabase.from('buyer_bookings').insert({ user_id: user.id, vehicle: input.vehicle, vin: input.vin, location: input.location, preferred_date: input.date, package: input.package, purpose: input.purpose ?? 'buyer' }).select().single();
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ['buyer-bookings', user.id] });
      return { ...input, id: data.id, accountId: user.id, timestamps: data.timestamps };
    },
    cancelBooking: async id => { if (!user) throw new Error('Please sign in first.'); const { error } = await supabase.from('buyer_bookings').update({ cancelled_at: new Date().toISOString() }).eq('id', id).eq('user_id', user.id); if (error) throw error; await queryClient.invalidateQueries({ queryKey: ['buyer-bookings', user.id] }); },
    updateAccount: async (name, phone, preference) => { if (!user) throw new Error('Please sign in first.'); const { error } = await supabase.from('profiles').update({ full_name: name.trim(), phone: phone.trim(), contact_preference: preference, buyer_profile_completed: true }).eq('id', user.id); if (error) throw error; await queryClient.invalidateQueries({ queryKey: ['buyer-profile', user.id] }); },
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useDemoAccount() { const context = useContext(Context); if (!context) throw new Error('Account provider is missing'); return context; }
export function useBookings() { return useDemoAccount().bookings; }