import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { BadgeCheck, CalendarClock, Clock, DollarSign, FileText, LogOut, MapPin, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { pageHead } from '@/lib/page-head';
import { specialties } from '@/lib/demo-inspector';

export const Route = createFileRoute('/_authenticated/inspector/portal')({
  head: () => pageHead('Inspector portal', 'Your Trustferly inspector profile, private verification documents and assigned inspection jobs.'),
  component: Page,
});

const field = 'mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring';
const docTypes = ['Mechanic certification', "Driver's license", 'Insurance'];
const statuses = ['Upcoming', 'In Progress', 'Completed'] as const;
const nextStatus: Record<string, string> = { Upcoming: 'In Progress', 'In Progress': 'Completed' };

function usePortal() {
  return useQuery({
    queryKey: ['inspector-portal'],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user!.id;
      const [profile, jobs, docs, roles] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', uid).maybeSingle(),
        supabase.from('inspection_jobs').select('*').eq('inspector_id', uid).order('scheduled_at'),
        supabase.from('inspector_documents').select('*').eq('inspector_id', uid).order('created_at', { ascending: false }),
        supabase.from('user_roles').select('role').eq('user_id', uid),
      ]);
      if (profile.error) throw profile.error;
      return { uid, profile: profile.data, jobs: jobs.data ?? [], docs: docs.data ?? [], isReviewer: (roles.data ?? []).length > 0 };
    },
  });
}

function Page() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data, isLoading, error } = usePortal();
  const refresh = () => qc.invalidateQueries({ queryKey: ['inspector-portal'] });

  async function signOut() {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    navigate({ to: '/inspector/login', replace: true });
  }

  if (isLoading) return <p className="p-16 text-center text-muted-foreground">Loading your portal…</p>;
  if (error || !data?.profile) return <p className="p-16 text-center text-destructive">Could not load your profile. Please sign in again.</p>;
  const { profile } = data;
  const verified = profile.verification_status === 'Active & Verified';

  return <section className="mx-auto max-w-6xl px-5 py-10 md:py-16">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase text-accent">Inspector portal</p>
        <h1 className="text-3xl font-semibold md:text-4xl">Welcome{profile.full_name ? `, ${profile.full_name}` : ''}</h1>
        <span className={`mt-3 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${verified ? 'bg-teal-soft text-accent' : 'bg-warning-soft text-warning'}`}>
          {verified ? <BadgeCheck size={13} /> : <Clock size={13} />}{profile.verification_status}
        </span>
      </div>
      <Button variant="outline" onClick={signOut}><LogOut />Sign out</Button>
    </div>
    <Tabs defaultValue="jobs" className="mt-10">
      <TabsList><TabsTrigger value="jobs">Assigned jobs ({data.jobs.length})</TabsTrigger><TabsTrigger value="profile">Profile</TabsTrigger><TabsTrigger value="docs">Documents</TabsTrigger>{data.isReviewer && <TabsTrigger value="review">Review</TabsTrigger>}</TabsList>
      <TabsContent value="jobs" className="mt-6 space-y-8">
        {data.jobs.length === 0 && <p className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">No jobs assigned yet. Once a reviewer verifies your profile and assigns an inspection, it will appear here.</p>}
        {data.jobs.length > 0 && statuses.map(s => <div key={s}>
          <h3 className="mb-3 text-lg font-semibold">{s}</h3>
          <div className="space-y-4">
            {data.jobs.filter(j => j.status === s).map(j => <article key={j.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card p-5 shadow-soft">
              <div>
                <div className="flex items-center gap-2"><h4 className="text-lg font-semibold">{j.vehicle}</h4><span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">{j.category} Tier</span></div>
                <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-1.5"><MapPin size={14} />{j.location}</li>
                  <li className="flex items-center gap-1.5"><CalendarClock size={14} />{new Date(j.scheduled_at).toLocaleString()}</li>
                  <li className="flex items-center gap-1.5 font-medium text-accent"><DollarSign size={14} />{(j.payout_cents / 100).toFixed(0)} payout</li>
                </ul>
              </div>
              {nextStatus[j.status] && <Button variant="cta" onClick={async () => { await supabase.from('inspection_jobs').update({ status: nextStatus[j.status]! }).eq('id', j.id); refresh(); }}>
                {j.status === 'Upcoming' ? 'Start inspection' : 'Mark completed'}</Button>}
            </article>)}
            {data.jobs.filter(j => j.status === s).length === 0 && <p className="text-sm text-muted-foreground">Nothing here.</p>}
          </div>
        </div>)}
      </TabsContent>
      <TabsContent value="profile" className="mt-6"><ProfileForm profile={profile} onSaved={refresh} /></TabsContent>
      <TabsContent value="docs" className="mt-6"><Documents uid={data.uid} docs={data.docs} onChange={refresh} /></TabsContent>
      {data.isReviewer && <TabsContent value="review" className="mt-6"><Review /></TabsContent>}
    </Tabs>
  </section>;
}

type Profile = NonNullable<ReturnType<typeof usePortal>['data']>['profile'] & {};

function ProfileForm({ profile, onSaved }: { profile: NonNullable<Profile>; onSaved: () => void }) {
  const [saved, setSaved] = useState('');
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const { error } = await supabase.from('profiles').update({
      full_name: String(f.get('full_name')), phone: String(f.get('phone')), base_zip: String(f.get('base_zip')),
      radius_miles: Number(f.get('radius_miles')), certification: String(f.get('certification')),
      years_experience: Number(f.get('years_experience')), specialties: f.getAll('specialties').map(String),
    }).eq('id', profile.id);
    setSaved(error ? error.message : 'Profile saved.');
    if (!error) onSaved();
  }
  return <form onSubmit={save} className="grid gap-4 rounded-2xl border bg-card p-6 shadow-soft sm:grid-cols-2">
    <label className="text-sm font-medium">Full name<input name="full_name" defaultValue={profile.full_name} className={field} /></label>
    <label className="text-sm font-medium">Email<input value={profile.email} disabled className={field} /></label>
    <label className="text-sm font-medium">Phone<input name="phone" defaultValue={profile.phone} className={field} /></label>
    <label className="text-sm font-medium">Base ZIP code<input name="base_zip" defaultValue={profile.base_zip} maxLength={5} inputMode="numeric" className={field} /></label>
    <label className="text-sm font-medium">Certification number<input name="certification" defaultValue={profile.certification} className={field} /></label>
    <label className="text-sm font-medium">Years of experience<input name="years_experience" type="number" min={0} defaultValue={profile.years_experience} className={field} /></label>
    <label className="text-sm font-medium">Service radius (miles)<input name="radius_miles" type="number" min={5} max={150} defaultValue={profile.radius_miles} className={field} /></label>
    <fieldset className="sm:col-span-2"><legend className="mb-2 text-sm font-medium">Specialties</legend>
      <div className="grid gap-2 sm:grid-cols-2">{specialties.map(s => <label key={s} className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm"><input type="checkbox" name="specialties" value={s} defaultChecked={profile.specialties.includes(s)} className="h-4 w-4 accent-primary" />{s}</label>)}</div>
    </fieldset>
    <div className="flex items-center gap-4 sm:col-span-2"><Button type="submit" variant="cta">Save profile</Button>{saved && <span role="status" className="text-sm text-muted-foreground">{saved}</span>}</div>
  </form>;
}

type Doc = { id: string; doc_type: string; file_name: string; storage_path: string; created_at: string };

async function openDoc(path: string) {
  const { data } = await supabase.storage.from('inspector-documents').createSignedUrl(path, 60);
  if (data?.signedUrl) window.open(data.signedUrl, '_blank', 'noopener');
}

function Documents({ uid, docs, onChange }: { uid: string; docs: Doc[]; onChange: () => void }) {
  const [status, setStatus] = useState('');
  async function upload(type: string, file: File) {
    setStatus(`Uploading ${file.name}…`);
    const path = `${uid}/${crypto.randomUUID()}-${file.name.replace(/[^\w.-]/g, '_')}`;
    const up = await supabase.storage.from('inspector-documents').upload(path, file);
    if (up.error) return setStatus(up.error.message);
    const { error } = await supabase.from('inspector_documents').insert({ inspector_id: uid, doc_type: type, file_name: file.name, storage_path: path });
    setStatus(error ? error.message : `${file.name} uploaded.`);
    onChange();
  }
  async function remove(d: Doc) {
    await supabase.storage.from('inspector-documents').remove([d.storage_path]);
    await supabase.from('inspector_documents').delete().eq('id', d.id);
    onChange();
  }
  return <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Documents are stored privately. Only you and Trustferly reviewers can open them.</p>
    <div className="grid gap-4 md:grid-cols-3">{docTypes.map(t => <div key={t} className="rounded-2xl border bg-card p-5 shadow-soft">
      <h3 className="font-semibold">{t}</h3>
      <ul className="mt-3 space-y-2 text-sm">{docs.filter(d => d.doc_type === t).map(d => <li key={d.id} className="flex items-center justify-between gap-2">
        <button type="button" onClick={() => openDoc(d.storage_path)} className="flex min-w-0 items-center gap-1.5 text-primary hover:underline"><FileText size={14} /><span className="truncate">{d.file_name}</span></button>
        <button type="button" aria-label={`Delete ${d.file_name}`} onClick={() => remove(d)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
      </li>)}</ul>
      <label className="mt-4 inline-flex cursor-pointer items-center rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary">Upload file
        <input type="file" accept="image/*,application/pdf" className="sr-only" onChange={e => { const f = e.target.files?.[0]; if (f) upload(t, f); e.target.value = ''; }} />
      </label>
    </div>)}</div>
    {status && <p role="status" className="text-sm text-muted-foreground">{status}</p>}
  </div>;
}

function Review() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['reviewer-inspectors'],
    queryFn: async () => {
      const [p, d] = await Promise.all([supabase.from('profiles').select('*').order('created_at'), supabase.from('inspector_documents').select('*')]);
      return { profiles: p.data ?? [], docs: d.data ?? [] };
    },
  });
  async function setStatus(id: string, verification_status: string) {
    await supabase.from('profiles').update({ verification_status }).eq('id', id);
    qc.invalidateQueries({ queryKey: ['reviewer-inspectors'] }); qc.invalidateQueries({ queryKey: ['inspector-portal'] });
  }
  async function assign(e: React.FormEvent<HTMLFormElement>, inspector_id: string) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await supabase.from('inspection_jobs').insert({ inspector_id, vehicle: String(f.get('vehicle')), category: String(f.get('category')), location: String(f.get('location')), scheduled_at: new Date(String(f.get('when'))).toISOString(), payout_cents: Number(f.get('payout')) * 100 });
    e.currentTarget.reset();
    qc.invalidateQueries({ queryKey: ['inspector-portal'] });
  }
  return <div className="space-y-4">{data?.profiles.map(p => <article key={p.id} className="rounded-2xl border bg-card p-5 shadow-soft">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h3 className="font-semibold">{p.full_name || p.email}</h3><p className="text-sm text-muted-foreground">{p.email} · {p.certification || 'No certification yet'} · {p.verification_status}</p></div>
      <div className="flex gap-2"><Button size="sm" variant="cta" onClick={() => setStatus(p.id, 'Active & Verified')}>Verify</Button><Button size="sm" variant="outline" onClick={() => setStatus(p.id, 'Pending Review')}>Mark pending</Button></div>
    </div>
    <ul className="mt-3 flex flex-wrap gap-3 text-sm">{data.docs.filter(d => d.inspector_id === p.id).map(d => <li key={d.id}><button type="button" onClick={() => openDoc(d.storage_path)} className="text-primary hover:underline">{d.doc_type}: {d.file_name}</button></li>)}</ul>
    <form onSubmit={e => assign(e, p.id)} className="mt-4 grid gap-2 sm:grid-cols-6">
      <input name="vehicle" required placeholder="Vehicle" className={`${field} sm:col-span-2`} />
      <input name="location" required placeholder="Location" className={field} />
      <select name="category" className={field}><option>Standard</option><option>Luxury</option></select>
      <input name="when" type="datetime-local" required className={field} />
      <input name="payout" type="number" min={0} required placeholder="Payout $" className={field} />
      <Button type="submit" size="sm" variant="outline" className="sm:col-span-6 sm:w-fit">Assign job</Button>
    </form>
  </article>)}</div>;
}
