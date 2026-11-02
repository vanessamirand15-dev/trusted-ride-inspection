// Browser-safe inspector demonstration model. Fictional data only.
export type JobStatus = 'Upcoming' | 'In Progress' | 'Completed';
export interface InspectorProfile {
  name: string; email: string; certification: string; years: number;
  zip: string; radius: number; backgroundCheck: 'Pending' | 'Verified';
}
export interface Job {
  id: string; vehicle: string; location: string; distance: number;
  scheduledAt: string; payout: number; status?: JobStatus;
}

export const sampleInspector: InspectorProfile = {
  name: 'Alex Morgan', email: 'alex.inspector@example.com', certification: 'ASE-1234567',
  years: 9, zip: '90012', radius: 25, backgroundCheck: 'Verified',
};

export const sampleJobs: Job[] = [
  { id: 'j1', vehicle: '2017 Ford F-150', location: 'Pasadena, CA', distance: 9.4, scheduledAt: '2026-11-05T10:00:00', payout: 95 },
  { id: 'j2', vehicle: '2020 Tesla Model 3', location: 'Santa Monica, CA', distance: 15.2, scheduledAt: '2026-11-06T14:30:00', payout: 140 },
  { id: 'j3', vehicle: '2015 Subaru Outback', location: 'Glendale, CA', distance: 6.8, scheduledAt: '2026-11-07T09:00:00', payout: 95 },
  { id: 'j4', vehicle: '2019 Porsche Macan', location: 'Irvine, CA', distance: 38.5, scheduledAt: '2026-11-08T11:00:00', payout: 160 },
  { id: 'j5', vehicle: '2016 Jeep Wrangler', location: 'Long Beach, CA', distance: 22.1, scheduledAt: '2026-11-09T13:00:00', payout: 110 },
  { id: 'm1', vehicle: '2018 Honda Accord', location: 'Burbank, CA', distance: 11.0, scheduledAt: '2026-11-04T15:00:00', payout: 95, status: 'Upcoming' },
  { id: 'm2', vehicle: '2021 Toyota RAV4', location: 'Culver City, CA', distance: 12.3, scheduledAt: '2026-11-02T10:00:00', payout: 95, status: 'In Progress' },
  { id: 'm3', vehicle: '2019 Mazda CX-5', location: 'Torrance, CA', distance: 19.7, scheduledAt: '2026-10-28T09:30:00', payout: 95, status: 'Completed' },
];

/** Pending jobs the inspector can see: unassigned, not declined, within radius. */
export function availableJobs(jobs: Job[], radius: number, declined: string[]) {
  return jobs.filter(j => !j.status && !declined.includes(j.id) && j.distance <= radius).sort((a, b) => a.distance - b.distance);
}
export function acceptJob(jobs: Job[], id: string): Job[] {
  return jobs.map(j => (j.id === id && !j.status ? { ...j, status: 'Upcoming' } : j));
}
export function jobsByStatus(jobs: Job[], status: JobStatus) { return jobs.filter(j => j.status === status); }
export function completeJob(jobs: Job[], id: string): Job[] {
  return jobs.map(j => (j.id === id && (j.status === 'Upcoming' || j.status === 'In Progress') ? { ...j, status: 'Completed' } : j));
}
export function earnings(jobs: Job[]) {
  const done = jobsByStatus(jobs, 'Completed');
  const pending = jobs.filter(j => j.status === 'Upcoming' || j.status === 'In Progress');
  return { completed: done.length, total: done.reduce((s, j) => s + j.payout, 0), pending: pending.reduce((s, j) => s + j.payout, 0) };
}
