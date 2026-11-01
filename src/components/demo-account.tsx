import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { createBooking, ownBookings, sampleState, canCancel, type Booking, type DemoState } from '@/lib/demo-bookings';

interface AccountContext extends DemoState {
  ready: boolean;
  login: (name: string, email?: string, sample?: boolean) => void;
  logout: () => void;
  addBooking: (input: Omit<Booking, 'id' | 'accountId' | 'timestamps'>) => Booking | undefined;
  cancelBooking: (id: string) => void;
  updateAccount: (name: string, email: string) => void;
}
const Context = createContext<AccountContext | null>(null);
const key = 'trustferly-demonstration';
export function DemoAccountProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>({ account: null, bookings: [] });
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const saved = sessionStorage.getItem(key); if (saved) { const parsed = JSON.parse(saved); if (Array.isArray(parsed.bookings)) setState(parsed); } } catch { /* New demo session */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) { try { sessionStorage.setItem(key, JSON.stringify(state)); } catch { /* Storage unavailable; keep in-memory demo */ } } }, [state, ready]);
  const value: AccountContext = {
    ...state, ready,
    login: (name, email = '', sample = false) => setState(sample ? sampleState() : { account: { id: crypto.randomUUID(), name, email }, bookings: [] }),
    logout: () => setState({ account: null, bookings: [] }),
    addBooking: input => {
      if (!state.account) return;
      const booking = createBooking(state.account.id, input);
      setState(s => ({ ...s, bookings: [booking, ...s.bookings] }));
      return booking;
    },
    cancelBooking: id => setState(s => ({ ...s, bookings: s.bookings.map(b => b.id === id && b.accountId === s.account?.id && canCancel(b) ? { ...b, cancelledAt: new Date().toISOString() } : b) })),
    updateAccount: (name, email) => setState(s => ({ ...s, account: s.account ? { ...s.account, name, email } : null })),
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useDemoAccount() {
  const context = useContext(Context);
  if (!context) throw new Error('Demo account provider is missing');
  return context;
}
export function useBookings() { return ownBookings(useDemoAccount()); }