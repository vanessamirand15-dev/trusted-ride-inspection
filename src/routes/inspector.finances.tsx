import { createFileRoute } from '@tanstack/react-router';
import { InspectorShell, useInspectorState } from '@/components/inspector-state';
import { earnings, jobsByStatus } from '@/lib/demo-inspector';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/inspector/finances')({
  head: () => pageHead('Inspector earnings and schedule', 'Track payouts and set your daily availability and preferred inspection times.'),
  component: Page,
});

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const slots = ['Morning', 'Afternoon', 'Evening'];

function Page() {
  const { jobs, availability, update } = useInspectorState();
  const e = earnings(jobs);
  const toggle = (d: string, s: string) => {
    const cur = availability[d] || [];
    update({ availability: { ...availability, [d]: cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s] } });
  };
  return <InspectorShell title="Earnings & schedule" subtitle="Sample payouts and your weekly availability.">
    <div className="grid gap-5 sm:grid-cols-3">
      {[['Completed jobs', String(e.completed)], ['Total payout', `$${e.total}`], ['Pending payouts', `$${e.pending}`]].map(([l, v]) => <div key={l} className="rounded-2xl border bg-card p-6 shadow-soft"><p className="text-sm text-muted-foreground">{l}</p><p className="mt-2 text-3xl font-semibold">{v}</p></div>)}
    </div>
    <h2 className="mt-12 text-xl font-semibold">Completed payouts</h2>
    <ul className="mt-4 divide-y rounded-2xl border bg-card">{jobsByStatus(jobs, 'Completed').map(j => <li key={j.id} className="flex justify-between p-4 text-sm"><span>{j.vehicle} · {j.location}</span><span className="font-medium text-accent">${j.payout}</span></li>)}</ul>
    <h2 className="mt-12 text-xl font-semibold">Weekly availability</h2>
    <p className="mt-1 text-sm text-muted-foreground">Tap a slot to toggle when you accept inspections.</p>
    <div className="mt-4 overflow-x-auto rounded-2xl border bg-card p-4">
      <table className="w-full min-w-[520px] text-sm">
        <thead><tr><th /> {days.map(d => <th key={d} className="p-2 font-medium">{d}</th>)}</tr></thead>
        <tbody>{slots.map(s => <tr key={s}><th className="p-2 text-left font-medium">{s}</th>{days.map(d => { const on = (availability[d] || []).includes(s); return <td key={d} className="p-1">
          <button type="button" aria-pressed={on} aria-label={`${d} ${s}`} onClick={() => toggle(d, s)} className={`h-10 w-full rounded-md border text-xs ${on ? 'border-accent bg-accent text-accent-foreground' : 'bg-background text-muted-foreground'}`}>{on ? 'Available' : 'Off'}</button></td>; })}</tr>)}</tbody>
      </table>
    </div>
  </InspectorShell>;
}
