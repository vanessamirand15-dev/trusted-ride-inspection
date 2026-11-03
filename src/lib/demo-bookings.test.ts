import { describe, expect, it } from 'vitest';
import { canCancel, createBooking, ownBookings, sampleState, stages, statusOf } from './demo-bookings';
describe('demonstration booking rules', () => {
  it('saves a seller own-car request under the requesting account', () => {
    const booking = createBooking('seller-1', { vehicle: '2020 Toyota Camry', vin: '', location: 'Austin, TX', date: '2026-11-05', package: 'Standard', purpose: 'seller' });
    expect(booking.purpose).toBe('seller');
    expect(ownBookings({ account: { id: 'seller-1', name: 'Seller', email: '' }, bookings: [booking] })).toEqual([booking]);
    expect(ownBookings({ account: { id: 'buyer-1', name: 'Buyer', email: '' }, bookings: [booking] })).toEqual([]);
    expect(statusOf(booking)).toBe('Requested');
  });
  it('uses the agreed five stages in order', () => {
    expect([...stages]).toEqual(['Requested', 'Scheduled', 'Inspection in progress', 'Report being prepared', 'Completed']);
  });
  it('associates new requests with their account at the requested stage', () => {
    const b = createBooking('buyer-2', { vehicle: '2018 Honda Accord', vin: '', location: 'LA', date: '2026-11-02', package: 'Complete' }, '2026-11-01T19:35:00Z');
    expect(b.accountId).toBe('buyer-2');
    expect(b.timestamps).toEqual(['2026-11-01T19:35:00Z']);
    expect(statusOf(b)).toBe('Requested');
  });
  it('shows multiple bookings belonging only to the current account', () => {
    const sample = sampleState();
    expect(ownBookings(sample)).toHaveLength(3);
    expect(ownBookings({ ...sample, account: { id: 'other', name: 'Other', email: '' } })).toEqual([]);
    expect(ownBookings({ ...sample, account: null })).toEqual([]);
  });
  it('maps fulfilled stages to their current statuses', () => {
    expect(sampleState().bookings.map(statusOf)).toEqual(['Scheduled', 'Inspection in progress', 'Completed']);
  });
  it('allows cancellation of open bookings but not completed or cancelled ones', () => {
    const [open, , completed] = sampleState().bookings;
    if (!open || !completed) throw new Error('Missing sample bookings');
    expect(canCancel(open)).toBe(true);
    expect(canCancel(completed)).toBe(false);
    expect(canCancel({ ...open, cancelledAt: '2026-11-01T19:35:00Z' })).toBe(false);
    expect(statusOf({ ...open, cancelledAt: '2026-11-01T19:35:00Z' })).toBe('Cancelled');
  });
});