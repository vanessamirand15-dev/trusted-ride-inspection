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
