import { createContext, useContext, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { createBooking, canCancel, ownBookings, type DemoState } from '@/lib/demo-bookings';
import { openDemoAccount } from '@/lib/demo-access';
import { quickCustomerState, rescheduleQuickBooking, type CustomerView } from '@/lib/quick-customer';
import { useDemoAccount } from '@/components/demo-account';

function useQuickState() {
  const [state, setState] = useState<DemoState>({ account: null, bookings: [] });
  const [phone, setPhone] = useState('(202) 555-0142');
  const [preference, setPreference] = useState('email');
  const navigate = useNavigate();
  return {
    account: state.account, bookings: ownBookings(state), phone, preference, ready: true, error: '',
    login: (name: string, password: string, sample = false) => { setState(quickCustomerState(openDemoAccount(name, password, sample))); setPhone('(202) 555-0142'); setPreference('email'); },
    logout: async () => { setState({ account: null, bookings: [] }); await navigate({ to: '/auth' }); },
    updateAccount: async (name: string, nextPhone: string, nextPreference: string) => { setState(current => ({ ...current, account: current.account ? { ...current.account, name: name.trim() } : null })); setPhone(nextPhone.trim()); setPreference(nextPreference); },
    addBooking: async (input: Parameters<ReturnType<typeof useDemoAccount>['addBooking']>[0]) => {
      if (!state.account) throw new Error('Please log in first.');
      const booking = createBooking(state.account.id, input);
      setState(current => ({ ...current, bookings: [...current.bookings, booking] })); return booking;
    },
    cancelBooking: async (id: string) => { setState(current => ({ ...current, bookings: current.bookings.map(b => b.id === id && b.accountId === current.account?.id && canCancel(b) ? { ...b, cancelledAt: new Date().toISOString() } : b) })); },
    reschedule: (id: string, date: string) => setState(current => rescheduleQuickBooking(current, id, date)),
    advance: (id: string) => setState(current => ({ ...current, bookings: current.bookings.map(b => b.id === id && b.accountId === current.account?.id && canCancel(b) ? { ...b, inspector: b.inspector || 'Alex Morgan', timestamps: [...b.timestamps, new Date().toISOString()] } : b) })),
  };
}
const Context = createContext<ReturnType<typeof useQuickState> | null>(null);
export function QuickCustomerProvider({ children }: { children: ReactNode }) { const value = useQuickState(); return <Context.Provider value={value}>{children}</Context.Provider>; }
export function useQuickCustomer() { const value = useContext(Context); if (!value) throw new Error('Quick account provider is missing'); return value; }
export function useCustomerAccount() {
  const real = useDemoAccount(); const quick = useQuickCustomer();
  const path = useLocation({ select: location => location.pathname });
  return path === '/demo' ? quick : real;
}
const views = { '/bookings': 'bookings', '/account': 'account', '/account/settings': 'settings', '/book': 'book', '/bookings/$bookingId': 'detail' } as const;
export function CustomerLink({ to, bookingId, children, ...props }: { to: keyof typeof views; bookingId?: string; children: ReactNode; className?: string; onClick?: () => void }) {
  const quick = useQuickCustomer();
  if (quick.account) return <Link to="/demo" search={{ view: views[to] as CustomerView, ...(bookingId ? { bookingId } : {}) }} {...props}>{children}</Link>;
  if (to === '/bookings/$bookingId') return <Link to={to} params={{ bookingId: bookingId ?? '' }} {...props}>{children}</Link>;
  return <Link to={to} {...props}>{children}</Link>;
}