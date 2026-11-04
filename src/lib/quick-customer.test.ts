import { expect, it } from 'vitest';
import { openDemoAccount } from './demo-access';
import { quickCustomerState, rescheduleQuickBooking } from './quick-customer';
import { ownBookings, statusOf } from './demo-bookings';
it('gives any Quick Login customer fictional upcoming, completed and cancelled bookings owned only by them', () => {
  const state = quickCustomerState(openDemoAccount('Vanessa', 'x'));
  expect(ownBookings(state)).toHaveLength(4);
  expect(state.bookings.map(statusOf)).toEqual(['Scheduled', 'Inspection in progress', 'Completed', 'Cancelled']);
  expect(ownBookings({ ...state, account: { id: 'other', name: 'Other', email: '' } })).toEqual([]);
});
it('reschedules only owned open requests without changing completed reports', () => {
  const state = quickCustomerState(openDemoAccount('Vanessa', 'x'));
  expect(rescheduleQuickBooking(state, 'sample-honda', '2026-11-09').bookings[0]?.date).toBe('2026-11-09');
  expect(() => rescheduleQuickBooking(state, 'sample-mazda', '2026-11-09')).toThrow();
  expect(() => rescheduleQuickBooking({ ...state, account: null }, 'sample-honda', '2026-11-09')).toThrow();
});