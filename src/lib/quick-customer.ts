import { sampleState, type DemoState } from './demo-bookings';
export type CustomerView = 'bookings' | 'account' | 'settings' | 'book' | 'detail';
export function quickCustomerState(state: DemoState): DemoState {
  if (!state.account) return state;
  const sample = sampleState();
  const base = sample.bookings[0];
  const account = { ...state.account, email: state.account.email || 'customer@example.com' };
  return { account, bookings: [...sample.bookings, ...(base ? [{ ...base, id: 'sample-cancelled', vehicle: '2020 Subaru Outback', cancelledAt: '2026-11-03T18:00:00Z' }] : [])].map(b => ({ ...b, accountId: account.id, vin: 'EXAMPLE VIN', ...(b.id === 'sample-honda' ? { date: '2026-11-07' } : {}) })) };
}
export function rescheduleQuickBooking(state: DemoState, id: string, date: string): DemoState {
  const booking = state.bookings.find(b => b.id === id && b.accountId === state.account?.id);
  if (!booking || booking.cancelledAt || booking.timestamps.length >= 5) throw new Error('Only your open inspections can be rescheduled.');
  if (!date.trim()) throw new Error('Select an inspection date.');
  return { ...state, bookings: state.bookings.map(b => b.id === id ? { ...b, date } : b) };
}