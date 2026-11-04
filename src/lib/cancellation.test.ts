import { expect, it } from 'vitest';
import { cancellationFeeApplies } from './cancellation';
it('charges no cancellation fee through twelve hours after requesting an inspection', () => {
  expect(cancellationFeeApplies('2026-11-04T00:00:00Z', '2026-11-04T12:00:00Z')).toBe(false);
});
it('applies a cancellation fee after twelve hours from the request', () => {
  expect(cancellationFeeApplies('2026-11-04T00:00:00Z', '2026-11-04T12:00:01Z')).toBe(true);
});