import { describe, expect, it } from 'vitest';
import { acceptJob, availableJobs, jobsByStatus, sampleJobs } from './demo-inspector';

describe('inspector jobs', () => {
  it('shows only pending jobs inside the radius', () => {
    const ids = availableJobs(sampleJobs, 25, []).map(j => j.id);
    expect(ids).toEqual(['j3', 'j1', 'j2', 'j5']);
  });
  it('hides declined jobs', () => {
    expect(availableJobs(sampleJobs, 50, ['j4']).map(j => j.id)).not.toContain('j4');
  });
  it('accepting moves a job to Upcoming and out of the feed', () => {
    const next = acceptJob(sampleJobs, 'j1');
    expect(jobsByStatus(next, 'Upcoming').map(j => j.id)).toContain('j1');
    expect(availableJobs(next, 25, []).map(j => j.id)).not.toContain('j1');
  });
});
import { completeJob, earnings } from './demo-inspector';
describe('inspector earnings', () => {
  it('sums completed and pending payouts', () => {
    expect(earnings(sampleJobs)).toEqual({ completed: 1, total: 95, pending: 190 });
  });
  it('submitting a report completes the job', () => {
    expect(earnings(completeJob(sampleJobs, 'm2'))).toEqual({ completed: 2, total: 190, pending: 95 });
  });
});
