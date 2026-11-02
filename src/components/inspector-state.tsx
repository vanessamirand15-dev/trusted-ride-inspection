import { Link } from '@tanstack/react-router';
import { useEffect, useState, type ReactNode } from 'react';
import { payoutTiers, specialties, sampleInspector, sampleJobs, type InspectorProfile, type Job } from '@/lib/demo-inspector';

// Demo-only inspector state kept in the browser tab (sessionStorage), shared by portal pages.
const key = 'trustferly-inspector';
export interface InspectorState { profile: InspectorProfile; jobs: Job[]; declined: string[]; availability: Record<string, string[]> }
const initial: InspectorState = { profile: sampleInspector, jobs: sampleJobs, declined: [], availability: { Mon: ['Morning', 'Afternoon'], Tue: ['Morning'], Wed: ['Afternoon'], Thu: ['Morning', 'Afternoon'], Fri: ['Morning'] } };

export function useInspectorState() {
  const [state, setState] = useState<InspectorState>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const s = JSON.parse(sessionStorage.getItem(key) || 'null'); if (s?.jobs) setState({ ...initial, ...s }); } catch { /* fresh demo */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) try { sessionStorage.setItem(key, JSON.stringify(state)); } catch { /* ignore */ } }, [ready, state]);
  return { ...state, ready, update: (patch: Partial<InspectorState>) => setState(s => ({ ...s, ...patch })) };
}

export function InspectorShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const links = [{ to: '/inspector/dashboard', label: 'Dashboard' }, { to: '/inspector/profile', label: 'Profile & verification' }, { to: '/inspector/finances', label: 'Earnings & schedule' }] as const;
  return <section className="mx-auto max-w-6xl px-5 py-10 md:py-16">
    <nav aria-label="Inspector portal" className="mb-10 flex flex-wrap gap-6 border-b pb-4 text-sm">
      {links.map(l => <Link key={l.to} to={l.to} activeProps={{ className: 'text-primary font-semibold' }} className="text-muted-foreground hover:text-primary">{l.label}</Link>)}
    </nav>
    <p className="mb-2 text-xs font-semibold uppercase text-accent">Inspector portal · Demo</p>
    <h1 className="text-3xl font-semibold md:text-4xl">{title}</h1>
    <p className="mt-3 text-muted-foreground">{subtitle}</p>
    <div className="mt-10">{children}</div>
  </section>;
}

export function PhotoUpload({ label }: { label: string }) {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  return <div>
    <label className="inline-flex cursor-pointer items-center rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary">
      {label}
      <input type="file" accept="image/*,application/pdf" multiple className="sr-only" onChange={e => setFiles([...files, ...Array.from(e.target.files || []).map(f => ({ name: f.name, url: f.type.startsWith('image/') ? URL.createObjectURL(f) : '' }))])} />
    </label>
    {files.length > 0 && <ul className="mt-3 flex flex-wrap gap-2">{files.map((f, i) => <li key={i} className="rounded-md border bg-background p-1 text-xs">{f.url ? <img src={f.url} alt={f.name} className="h-16 w-16 rounded object-cover" /> : <span className="block max-w-32 truncate p-2">{f.name}</span>}</li>)}</ul>}
  </div>;
}

export function SpecialtiesAndPayouts() {
  return <fieldset>
    <legend className="mb-4 text-lg font-semibold">Specialties & Vehicle Experience</legend>
    <div className="grid gap-2.5 sm:grid-cols-2">{specialties.map((s, i) => <label key={s} className="flex items-center gap-2.5 rounded-lg border bg-background px-3 py-2.5 text-sm">
      <input type="checkbox" name="specialties" value={s} defaultChecked={i < 2} className="h-4 w-4 accent-primary" />{s}</label>)}</div>
    <div className="mt-5 grid gap-3 sm:grid-cols-2">{payoutTiers.map(t => <div key={t.label} className="rounded-lg border bg-teal-soft p-4">
      <p className="text-sm text-muted-foreground">{t.label} payout</p><p className="mt-1 text-xl font-semibold text-accent">{t.display}</p></div>)}</div>
  </fieldset>;
}
