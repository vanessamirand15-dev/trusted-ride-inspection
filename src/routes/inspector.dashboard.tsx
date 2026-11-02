import { createFileRoute, Link } from '@tanstack/react-router';
import { InspectorShell, useInspectorState } from '@/components/inspector-state';
import { BadgeCheck, CalendarClock, Check, DollarSign, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { pageHead } from '@/lib/page-head';
import { acceptJob, availableJobs, jobsByStatus, type InspectorProfile, type Job, type JobStatus } from '@/lib/demo-inspector';

export const Route = createFileRoute('/inspector/dashboard')({
  head: () => pageHead('Inspector dashboard', 'Manage your inspector profile, service radius and inspection jobs on Trustferly.'),
  component: Page,
});

const field = 'mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring';
const when = (v: string) => new Date(v).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

function Page() {
  const { profile, jobs, declined, update } = useInspectorState();
  const setProfile = (p: InspectorProfile) => update({ profile: p });
  const setJobs = (j: Job[]) => update({ jobs: j });
  const setDeclined = (d: string[]) => update({ declined: d });
  const feed = availableJobs(jobs, profile.radius, declined);
  return <InspectorShell title={`Welcome, ${profile.name}`} subtitle="Sample inspector account with fictional jobs.">
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <aside className="h-fit rounded-2xl border bg-card p-6 shadow-soft">
        <h2 className="text-lg font-semibold">Profile</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div><dt className="text-muted-foreground">Email</dt><dd>{profile.email}</dd></div>
          <div><dt className="text-muted-foreground">Certification</dt><dd>{profile.certification} · {profile.years} yrs</dd></div>
          <div><dt className="text-muted-foreground">Background check</dt><dd><span className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-teal-soft px-2.5 py-1 text-xs font-medium text-accent"><BadgeCheck size={13} />{profile.backgroundCheck}</span></dd></div>
        </dl>
        <div className="mt-6 space-y-4 border-t pt-5">
          <label className="block text-sm font-medium">Base ZIP code<input value={profile.zip} onChange={e => setProfile({ ...profile, zip: e.target.value })} className={field} inputMode="numeric" maxLength={5} /></label>
          <label className="block text-sm font-medium">Service radius: <span className="text-primary">{profile.radius} miles</span>
            <input type="range" min={5} max={100} step={5} value={profile.radius} onChange={e => setProfile({ ...profile, radius: Number(e.target.value) })} className="mt-3 w-full accent-primary" />
          </label>
        </div>
      </aside>
      <Tabs defaultValue="available">
        <TabsList><TabsTrigger value="available">Available jobs ({feed.length})</TabsTrigger><TabsTrigger value="mine">My inspections</TabsTrigger></TabsList>
        <TabsContent value="available" className="mt-6 space-y-4">
          {feed.length === 0 && <p className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">No pending requests within {profile.radius} miles. Try widening your radius.</p>}
          {feed.map(j => <JobCard key={j.id} job={j}>
            <Button variant="cta" onClick={() => setJobs(acceptJob(jobs, j.id))}><Check />Accept Job</Button>
            <Button variant="outline" onClick={() => setDeclined([...declined, j.id])}><X />Decline Job</Button>
          </JobCard>)}
        </TabsContent>
        <TabsContent value="mine" className="mt-6 space-y-8">
          {(['Upcoming', 'In Progress', 'Completed'] as JobStatus[]).map(s => <div key={s}>
            <h3 className="mb-3 text-lg font-semibold">{s}</h3>
            <div className="space-y-4">
              {jobsByStatus(jobs, s).map(j => <JobCard key={j.id} job={j}>{s !== 'Completed' && <Button asChild variant="cta"><Link to="/inspector/inspection/$id" params={{ id: j.id }}>{s === 'Upcoming' ? 'Start inspection' : 'Continue report'}</Link></Button>}</JobCard>)}
              {jobsByStatus(jobs, s).length === 0 && <p className="text-sm text-muted-foreground">Nothing here yet.</p>}
            </div>
          </div>)}
        </TabsContent>
      </Tabs>
    </div>
  </InspectorShell>;
}

function JobCard({ job, children }: { job: Job; children?: React.ReactNode }) {
  return <article className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card p-5 shadow-soft">
    <div>
      <h4 className="text-lg font-semibold">{job.vehicle}</h4>
      <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
        <li className="flex items-center gap-1.5"><MapPin size={14} />{job.location} · {job.distance.toFixed(1)} mi away</li>
        <li className="flex items-center gap-1.5"><CalendarClock size={14} />{when(job.scheduledAt)}</li>
        <li className="flex items-center gap-1.5 font-medium text-accent"><DollarSign size={14} />{job.payout} payout</li>
      </ul>
    </div>
    {children && <div className="flex gap-2">{children}</div>}
  </article>;
}
