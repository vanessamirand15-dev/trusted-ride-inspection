import { describe, expect, it } from 'vitest';
import { inspectionPlans } from './inspection-plans';

describe('inspection packages', () => {
  it('prices the standard inspection at $149', () => {
    expect(inspectionPlans.find(p => p.id === 'standard')?.price).toBe(149);
  });
  it('prices the premium inspection at $229', () => {
    expect(inspectionPlans.find(p => p.id === 'premium')?.price).toBe(229);
  });
  it('includes the four standard checks', () => {
    expect(inspectionPlans[0].features).toEqual(['150+ point checklist', 'Road test', 'OBD-II diagnostic scan', 'Same-day digital report']);
  });
  it('adds the requested premium checks and matching', () => {
    expect(inspectionPlans[1].features).toEqual(['Everything in Standard', 'Engine compression test', 'Paint depth gauge inspection', 'Priority inspector matching']);
  });
  it('provides hover detail text for every package', () => {
    for (const plan of inspectionPlans) expect(plan.details.length).toBeGreaterThan(40);
    expect(inspectionPlans[0].details).toMatch(/sedans, SUVs and trucks/);
    expect(inspectionPlans[1].details).toMatch(/luxury diagnostics/);
  });
});