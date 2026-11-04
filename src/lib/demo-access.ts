import { sampleState, type DemoState } from './demo-bookings';

export function openDemoAccount(name: string, password: string, sample = false): DemoState {
  if (!name.trim() || !password.trim()) throw new Error('Enter a name and password to continue.');
  if (sample || name.trim().toLowerCase() === 'test user') return sampleState();
  return { account: { id: crypto.randomUUID(), name: name.trim(), email: '' }, bookings: [] };
}