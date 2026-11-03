export const inspectionPlans = [
  {
    id: 'standard',
    name: 'Standard Pre-Purchase Inspection',
    price: 149,
    details: 'Best for everyday sedans, SUVs and trucks. A certified inspector travels to the car, runs the full checklist in about two hours and delivers the digital report the same day.',
    features: ['150+ point checklist', 'Road test', 'OBD-II diagnostic scan', 'Same-day digital report'],
  },
  {
    id: 'premium',
    name: 'Premium & Exotic Inspection',
    price: 229,
    details: 'For luxury, exotic or high value vehicles. Includes everything in Standard plus the deeper engine and paint tests, and we match you with an inspector experienced in luxury diagnostics first.',
    features: ['Everything in Standard', 'Engine compression test', 'Paint depth gauge inspection', 'Priority inspector matching'],
  },
] as const;

export function packageLabel(plan: typeof inspectionPlans[number]) {
  return `${plan.name} · $${plan.price}`;
}