export type BuyerDestination = '/book' | '/bookings';

export function buyerDestination(value: unknown): BuyerDestination {
  return value === '/book' ? '/book' : '/bookings';
}

export function inspectorAccountPath(path: string) {
  return path === '/inspector/portal' || path === '/inspector/login';
}