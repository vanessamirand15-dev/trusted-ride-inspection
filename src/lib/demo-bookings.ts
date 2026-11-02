export const stages = ['Requested', 'Scheduled', 'Inspection in progress', 'Report being prepared', 'Completed'] as const;
export type Stage = typeof stages[number];
export interface DemoAccount { id: string; name: string; email: string }
export interface Booking {
  id: string; accountId: string; vehicle: string; vin: string; location: string;
  date: string; package: string; timestamps: string[]; inspector?: string;
  cancelledAt?: string;
}
export interface DemoState { account: DemoAccount | null; bookings: Booking[] }
export function statusOf(booking: Booking): Stage | 'Cancelled' {
  return booking.cancelledAt ? 'Cancelled' : (stages[Math.min(Math.max(booking.timestamps.length - 1, 0), stages.length - 1)] ?? 'Requested');
}
export function ownBookings(state: DemoState) {
  return state.account ? state.bookings.filter(b => b.accountId === state.account?.id) : [];
}
export function canCancel(booking: Booking) {
  return !booking.cancelledAt && booking.timestamps.length < stages.length;
}
export function createBooking(accountId: string, input: Omit<Booking, 'id' | 'accountId' | 'timestamps'>, now = new Date().toISOString()): Booking {
  return { ...input, id: crypto.randomUUID(), accountId, timestamps: [now] };
}
export function sampleState(): DemoState {
  const account = { id: 'sample-buyer', name: 'Test User', email: 'test@example.com' };
  const base = { accountId: account.id, vin: '', location: 'Los Angeles, CA', package: 'Complete · $189', inspector: 'Alex Morgan' };
  return { account, bookings: [
    { ...base, id: 'sample-honda', vehicle: '2018 Honda Accord', date: '2026-11-02', timestamps: ['2026-10-31T16:00:00-07:00', '2026-11-01T09:30:00-08:00'] },
    { ...base, id: 'sample-toyota', vehicle: '2021 Toyota RAV4', date: '2026-11-01', timestamps: ['2026-10-29T10:00:00-07:00', '2026-10-30T12:00:00-07:00', '2026-11-01T10:00:00-08:00'] },
    { ...base, id: 'sample-mazda', vehicle: '2019 Mazda CX-5', date: '2026-10-28', timestamps: ['2026-10-25T11:00:00-07:00', '2026-10-26T14:00:00-07:00', '2026-10-28T09:00:00-07:00', '2026-10-28T11:00:00-07:00', '2026-10-28T15:00:00-07:00'] },
  ] };
}