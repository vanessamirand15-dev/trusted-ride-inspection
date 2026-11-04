export const cancellationWindowHours = 12;
export function cancellationFeeApplies(requestedAt: string, cancelledAt: string) {
  return Date.parse(cancelledAt) - Date.parse(requestedAt) > cancellationWindowHours * 60 * 60 * 1000;
}
export const cancellationPolicy = 'Cancel within 12 hours of requesting your inspection without a cancellation fee. A cancellation fee applies after 12 hours. Payments are simulated; no real fee is charged or refund processed.';