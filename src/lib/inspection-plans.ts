export const inspectionPlans = [
  {
    id: 'standard',
    name: 'Standard Pre-Purchase Inspection',
    price: 149,
    features: ['150+ point checklist', 'Road test', 'OBD-II diagnostic scan', 'Same-day digital report'],
  },
  {
    id: 'premium',
    name: 'Premium & Exotic Inspection',
    price: 229,
    features: ['Everything in Standard', 'Engine compression test', 'Paint depth gauge inspection', 'Priority inspector matching'],
  },
] as const;

export function packageLabel(plan: typeof inspectionPlans[number]) {
  return `${plan.name} · $${plan.price}`;
}