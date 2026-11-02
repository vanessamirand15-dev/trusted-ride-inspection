import { useState } from 'react';
import { Check, ClipboardCheck, History, Images, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FindingsExplainer } from '@/components/findings-explainer';
import inspectionPhotos from '@/lib/inspection-photos';
import { displayTime } from '@/components/account-ui';
import type { Booking } from '@/lib/demo-bookings';

const findings = [
  { area: 'Exterior & body', result: 'Cosmetic wear', attention: true, detail: 'Small scratches on the rear bumper and a shallow passenger-door dent. No obvious panel misalignment or visible structural damage.' },
  { area: 'Engine & transmission', result: 'Checked', detail: 'Engine starts smoothly. No visible fluid leaks during the inspection. Gear changes were smooth on the sample road test.' },
  { area: 'Brakes & tires', result: 'Attention advised', attention: true, detail: 'Front tires show uneven wear. Replace the front pair and check wheel alignment. Brake response was consistent; pads show moderate wear.' },
  { area: 'Suspension & steering', result: 'Checked', detail: 'No unusual steering vibration or suspension noise observed during the sample road test.' },
  { area: 'Interior & safety', result: 'Checked', detail: 'Seat belts, windows, locks, lights, and climate controls operated. Light wear on the driver’s seat. No dashboard warning lights remained on.' },
  { area: 'Underbody & fluids', result: 'Checked', detail: 'No active leaks or substantial corrosion visible in accessible areas. Fluid levels were within the expected range.' },
  { area: 'Diagnostics & road test', result: 'Checked', detail: 'No active diagnostic trouble codes in the sample scan. Acceleration, braking, and shifting were assessed on a short local drive.' },
];

export function InspectionReport({ booking }: { booking: Booking }) {
  const [tab, setTab] = useState<'condition' | 'history' | 'photos'>('condition');
  return <div>
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="text-xs font-semibold uppercase text-accent">Sample report · {booking.id}</p><h2 className="mt-2 text-3xl">Vehicle inspection report</h2><p className="mt-2 text-sm text-muted-foreground">{booking.vehicle} · {booking.inspector} · {displayTime(booking.timestamps[4] ?? '')}</p></div>
      <span className="inline-flex items-center gap-2 rounded-md bg-teal-soft px-3 py-2 text-sm font-medium text-accent"><ClipboardCheck size={18} />Inspection complete</span>
    </div>
    <p className="mt-5 border-l-2 border-accent pl-4 text-sm text-muted-foreground">Fictional findings, mileage, and history for this demonstration. Not a real assessment, verified vehicle history, or guarantee.</p>
    <div role="tablist" aria-label="Inspection report sections" className="mt-7 flex gap-1 overflow-x-auto border-b">
      {([{ id: 'condition', label: 'Condition', icon: ClipboardCheck }, { id: 'history', label: 'Vehicle history', icon: History }, { id: 'photos', label: 'Photos', icon: Images }] as const).map(item => <Button key={item.id} id={`report-tab-${item.id}`} role="tab" aria-selected={tab === item.id} aria-controls={`report-panel-${item.id}`} variant="ghost" onClick={() => setTab(item.id)} className={`shrink-0 rounded-none px-3 ${tab === item.id ? 'border-b-2 border-accent text-accent' : 'text-muted-foreground'}`}><item.icon size={16} />{item.label}</Button>)}
    </div>
    <div role="tabpanel" id={`report-panel-${tab}`} aria-labelledby={`report-tab-${tab}`} className="pt-7">
      {tab === 'condition' && <>
        <h3 className="text-2xl">Overall condition</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Generally good condition with minor cosmetic wear. Front tire replacement and an alignment check are recommended before regular use.</p>
        <dl className="mt-6 grid grid-cols-2 gap-5 border-y py-5 text-sm md:grid-cols-4">{[['Mileage', '68,420 miles'], ['Fuel', 'Gasoline'], ['Transmission', 'Automatic'], ['Inspection', 'Visual & road test']].map(([label, value]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>)}</dl>
        <div className="divide-y">{findings.map(item => <div key={item.area} className="py-5"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-sans text-base font-semibold">{item.area}</h3><span className={`inline-flex items-center gap-1.5 text-xs font-medium ${item.attention ? 'text-foreground' : 'text-accent'}`}>{item.attention ? <AlertTriangle size={14} /> : <Check size={14} />}{item.result}</span></div><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p></div>)}</div>
        <div className="border-t pt-5"><h3 className="text-2xl">Inspector’s recommendations</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground"><li>Replace the worn front tires and check alignment.</li><li>Ask the seller for the latest service invoices and confirm upcoming maintenance.</li><li>Confirm title, mileage, and recall status independently before purchase.</li></ul><p className="mt-5 text-xs leading-relaxed text-muted-foreground">Inspection reflects accessible areas at the time of assessment. Internal engine components were not dismantled. A visual inspection cannot establish accident history, title status, or future reliability.</p></div>
      </>}
      {tab === 'history' && <>
        <h3 className="text-2xl">Background & ownership</h3><p className="mt-2 text-sm text-muted-foreground">Illustrative seller information. No records have been independently verified.</p>
        <dl className="mt-6 grid gap-5 text-sm sm:grid-cols-2">{[['Previous owners', '2 owners reported by seller'], ['Previous use', 'Personal use reported'], ['Title status', 'Not independently verified'], ['Accident history', 'Seller reports none; not verified'], ['Mileage history', 'Records needed to confirm'], ['Open recalls', 'VIN lookup required']].map(([label, value]) => <div key={label} className="border-b pb-4"><dt className="text-muted-foreground">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>)}</dl>
        <h3 className="mt-8 text-2xl">Sample service history</h3><ol className="mt-4 divide-y">{[['2019 · First registration', 'Vehicle reportedly registered for personal use.'], ['2022 · 31,000 miles', 'Routine oil service and tire rotation noted in the sample history.'], ['2024 · 52,000 miles', 'Second owner; battery replacement reported.'], ['2026 · 67,900 miles', 'Recent oil and filter change reported by seller.']].map(([event, detail]) => <li key={event} className="py-4 text-sm"><p className="font-medium">{event}</p><p className="mt-1 text-muted-foreground">{detail}</p></li>)}</ol>
        <div className="mt-5 border-t pt-5"><h3 className="text-2xl">Records & supporting documents</h3><p className="mt-2 text-sm text-muted-foreground">No documents attached. Title records, maintenance invoices, and a vehicle history report are still needed.</p></div>
      </>}
      {tab === 'photos' && <><h3 className="text-2xl">Photos from the inspection</h3><div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">{inspectionPhotos.map(photo => <figure key={photo.alt}><img src={photo.src} alt={photo.alt} width={1600} height={1008} loading="lazy" className="aspect-[16/10] w-full rounded-lg border object-cover" /><figcaption className="mt-2 text-xs text-muted-foreground">{photo.alt}</figcaption></figure>)}</div></>}
    </div>
  </div>;
}