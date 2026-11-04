import { describe, expect, it } from 'vitest';
import { profileIsComplete } from './buyer-profile';
describe('required buyer profile', () => {
  const complete = { full_name: 'Vanessa', phone: '5551234567', contact_preference: 'email', buyer_profile_completed: true };
  it('requires saved name', () => expect(profileIsComplete({ ...complete, full_name: '' })).toBe(false));
  it('requires saved phone', () => expect(profileIsComplete({ ...complete, phone: '' })).toBe(false));
  it('requires a valid contact preference', () => expect(profileIsComplete({ ...complete, contact_preference: '' })).toBe(false));
  it('requires completed onboarding', () => expect(profileIsComplete({ ...complete, buyer_profile_completed: false })).toBe(false));
  it('allows completed profiles', () => expect(profileIsComplete(complete)).toBe(true));
});