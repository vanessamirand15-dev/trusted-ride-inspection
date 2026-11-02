import { createFileRoute } from '@tanstack/react-router';
import { BadgeCheck, Clock } from 'lucide-react';
import { InspectorShell, PhotoUpload, useInspectorState } from '@/components/inspector-state';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/inspector/profile')({
  head: () => pageHead('Inspector profile and verification', 'Upload certifications, license and insurance to verify your Trustferly inspector profile.'),
  component: Page,
});

const docs = [
  { name: 'Mechanic certifications', status: 'Verified' },
  { name: "Driver's license", status: 'Verified' },
  { name: 'Insurance', status: 'Pending Review' },
];

function Page() {
  const { profile } = useInspectorState();
  const verified = profile.backgroundCheck === 'Verified';
  return <InspectorShell title="Profile & verification" subtitle="Keep your documents current so buyers can trust every report.">
    <div className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border bg-card p-6 shadow-soft">
      <div><p className="text-lg font-semibold">{profile.name}</p><p className="text-sm text-muted-foreground">{profile.certification} · {profile.years} yrs · {profile.zip} · {profile.radius} mi radius</p></div>
      <span className={`ml-auto inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ${verified ? 'bg-teal-soft text-accent' : 'bg-warning-soft text-warning'}`}>
        {verified ? <BadgeCheck size={16} /> : <Clock size={16} />}{verified ? 'Active & Verified' : 'Pending Review'}
      </span>
    </div>
    <div className="grid gap-5 md:grid-cols-3">
      {docs.map(d => <div key={d.name} className="rounded-2xl border bg-card p-6 shadow-soft">
        <div className="flex items-start justify-between gap-2"><h2 className="font-semibold">{d.name}</h2>
          <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${d.status === 'Verified' ? 'bg-teal-soft text-accent' : 'bg-warning-soft text-warning'}`}>{d.status}</span></div>
        <p className="mt-2 mb-4 text-sm text-muted-foreground">PDF or photo. Files stay in this browser tab.</p>
        <PhotoUpload label="Upload document" />
      </div>)}
    </div>
    <p className="mt-6 text-xs text-muted-foreground">Demonstration only · Documents are not sent or reviewed.</p>
  </InspectorShell>;
}
