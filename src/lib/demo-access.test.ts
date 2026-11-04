import { describe, expect, it } from 'vitest';
import { openDemoAccount } from './demo-access';

describe('isolated demo login', () => {
  it('accepts any nonempty name and password without a real email', () => {
    const state = openDemoAccount('Vanessa', 'a');
    expect(state.account?.name).toBe('Vanessa');
    expect(state.account?.email).toBe('');
    expect(state.bookings).toEqual([]);
  });
  it('provides sample bookings for the previous test user with any password', () => {
    expect(openDemoAccount('test user', 'anything').bookings).toHaveLength(3);
  });
  it('requires a name and password', () => {
    expect(() => openDemoAccount('', 'a')).toThrow();
    expect(() => openDemoAccount('Vanessa', '')).toThrow();
  });
});