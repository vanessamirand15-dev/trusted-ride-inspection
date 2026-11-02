import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InspectorShell, PhotoUpload, useInspectorState } from '@/components/inspector-state';
import { completeJob } from '@/lib/demo-inspector';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/inspector/inspection/$id')({
  head: () => pageHead('Inspection report builder', 'Complete the digital checklist, add photos and submit the inspection report.'),
  component: Page,
});

const sections = ['Engine', 'Transmission', 'Exterior', 'Interior', 'Test Drive'];
const results = ['Pass', 'Needs attention', 'Fail'] as const;

function Page() {
  const { id } = Route.useParams();
  const { jobs, update, ready } = useInspectorState();
  const navigate = useNavigate();
  const [checks, setChecks] = useState<Record<string, string>>({});
  const job = jobs.find(j => j.id === id);
  if (!ready) return <p className="p-20 text-muted-foreground" role="status">Loading…</p>;
  if (!job) return <InspectorShell title="Job not found" subtitle="This inspection is not in your list."><Button asChild><Link to="/inspector/dashboard">Back to dashboard</Link></Button></InspectorShell>;
  const done = job.status === 'Completed';
  return <InspectorShell title={job.vehicle} subtitle={`${job.location} · ${job.distance.toFixed(1)} mi · $${job.payout} payout`}>
    {done ? <p className="rounded-2xl border bg-teal-soft p-6 text-accent">Report submitted to the buyer.</p> :
    <form className="space-y-5" onSubmit={e => { e.preventDefault(); update({ jobs: completeJob(jobs, job.id) }); navigate({ to: '/inspector/dashboard' }); }}>
      {sections.map(s => <fieldset key={s} className="rounded-2xl border bg-card p-6 shadow-soft">
        <legend className="sr-only">{s}</legend>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{s}</h2>
          <div className="flex gap-2">{results.map(r => <label key={r} className={`cursor-pointer rounded-md border px-3 py-1.5 text-sm ${checks[s] === r ? 'border-primary bg-primary text-primary-foreground' : 'bg-background'}`}>
            <input type="radio" name={s} value={r} required className="sr-only" onChange={() => setChecks({ ...checks, [s]: r })} />{r}</label>)}</div>
        </div>
        <textarea rows={2} placeholder={`${s} notes`} className="mt-4 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
        <div className="mt-3"><PhotoUpload label={`Add ${s.toLowerCase()} photos`} /></div>
      </fieldset>)}
      <label className="block rounded-2xl border bg-card p-6 text-lg font-semibold shadow-soft">Summary notes
        <textarea required rows={4} placeholder="Overall condition and recommendation for the buyer" className="mt-3 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal outline-none focus:ring-2 focus:ring-ring" />
      </label>
      <Button type="submit" variant="cta" size="lg" className="w-full"><Send />Submit Inspection Report</Button>
      <p className="text-xs text-muted-foreground">Demonstration only · No report is sent to a real buyer.</p>
    </form>}
  </InspectorShell>;
}
