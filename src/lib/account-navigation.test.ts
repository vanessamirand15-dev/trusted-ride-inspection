import { describe, expect, it } from 'vitest';
import { buyerDestination, inspectorAccountPath } from './account-navigation';

describe('restored account navigation', () => {
  it('returns customers requesting an inspection to the booking form', () => {
    expect(buyerDestination('/book')).toBe('/book');
  });
  it('defaults account login to owned bookings and rejects external destinations', () => {
    expect(buyerDestination(undefined)).toBe('/bookings');
    expect(buyerDestination('https://example.com')).toBe('/bookings');
  });
  it('keeps inspector account options separate from customer and sample pages', () => {
    expect(inspectorAccountPath('/inspector/portal')).toBe(true);
    expect(inspectorAccountPath('/inspector/login')).toBe(true);
    expect(inspectorAccountPath('/account')).toBe(false);
    expect(inspectorAccountPath('/demo')).toBe(false);
    expect(inspectorAccountPath('/inspector/dashboard')).toBe(false);
  });
});