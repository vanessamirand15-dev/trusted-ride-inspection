import { createFileRoute, Link } from '@tanstack/react-router';
import inspectionPhotos from '@/lib/inspection-photos';
import { InspectionReport } from '@/components/inspection-report';
import { useState } from 'react';
import { ArrowLeft, Check, MessageSquare, X, FileText } from 'lucide-react';
import { AccountGate, StatusBadge, displayTime, displayDate } from '@/components/account-ui';
import { useBookings, useDemoAccount } from '@/components/demo-account';
import { stages, canCancel, statusOf } from '@/lib/demo-bookings';
import { pageHead } from '@/lib/page-head';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
export const Route = createFileRoute('/bookings_/$bookingId')({ head: () => pageHead('Inspection booking', 'View your inspection timeline, inspector, and booking details.'), component: Page });
function Page() { return <AccountGate><Detail /></AccountGate>; }
function Detail() {
  const { bookingId } = Route.useParams();
  const booking = useBookings().find(b => b.id === bookingId);
  const { cancelBooking } = useDemoAccount();
  const [dialog, setDialog] = useState<'contact' | 'cancel' | 'report' | null>(null);
  const [sent, setSent] = useState(false);
  if (!booking) return <section className="mx-auto max-w-4xl px-5 py-20"><h1 className="text-3xl">Booking not found</h1><Button asChild className="mt-6"><Link to="/bookings">Your Bookings</Link></Button></section>;
  return <section className="mx-auto max-w-4xl px-5 py-10 md:py-16">
    <Link to="/bookings" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft size={16} />Your Bookings</Link>
    <div className="flex flex-wrap items-start justify-between gap-5"><div><p className="mb-2 text-xs font-semibold uppercase text-accent">Inspection booking</p><h1 className="text-3xl md:text-4xl">{booking.vehicle}</h1><p className="mt-3 text-muted-foreground">{booking.package}</p></div><StatusBadge booking={booking} /></div>
    <div className="mt-9 grid gap-10 border-t pt-9 md:grid-cols-[1.2fr_1fr]">
      <div><h2 className="mb-7 text-2xl">Inspection progress</h2><ol aria-label="Booking progress">
        {stages.map((stage, i) => { const fulfilled = Boolean(booking.timestamps[i]); return <li key={stage} className="relative flex min-h-24 gap-4 pb-7" aria-current={!booking.cancelledAt && i === booking.timestamps.length - 1 ? 'step' : undefined}>
          {i < stages.length - 1 && <span aria-hidden="true" className={`absolute bottom-0 left-[15px] top-8 w-0.5 ${booking.timestamps[i + 1] ? 'bg-accent' : 'bg-border'}`} />}
          <span aria-hidden="true" className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${fulfilled ? 'border-accent bg-accent text-accent-foreground' : 'border-border bg-background text-muted-foreground'}`}>{fulfilled ? <Check size={15} /> : <span className="h-2 w-2 rounded-full bg-border" />}</span>
          <div><p className={`pt-1 text-sm font-semibold ${fulfilled ? 'text-foreground' : 'text-muted-foreground'}`}>{stage}</p><p className="mt-1 text-xs text-muted-foreground">{fulfilled ? displayTime(booking.timestamps[i] ?? '') : booking.cancelledAt ? 'Not reached' : 'Pending'}</p></div>
        </li>; })}
      </ol>{booking.cancelledAt && <p className="border-t pt-4 text-sm text-destructive">Cancelled · {displayTime(booking.cancelledAt)}</p>}</div>
      <div><h2 className="text-2xl">Booking details</h2><dl className="mt-6 space-y-5 text-sm">{[['Vehicle', booking.vehicle], ['Location', booking.location], ['Preferred date', displayDate(booking.date)], ['VIN', booking.vin || 'Not provided'], ['Inspector', booking.inspector || 'Awaiting assignment']].map(([label, value]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="mt-1 break-words font-medium">{value}</dd></div>)}</dl>
        {statusOf(booking) === 'Completed' && <figure className="mt-8 border-t pt-6"><figcaption className="text-sm text-muted-foreground">Photos from the inspection</figcaption><div className="mt-3 grid grid-cols-2 gap-3">{inspectionPhotos.map(photo => <img key={photo.alt} src={photo.src} alt={photo.alt} width={1600} height={1008} loading="lazy" className="w-full rounded-lg border object-cover" />)}</div><p className="mt-2 text-xs text-muted-foreground">Sample photos for demonstration purposes.</p></figure>}
        <div className="mt-8 flex flex-col items-start gap-3 border-t pt-6">
          {booking.inspector && <Button variant="outline" onClick={() => { setSent(false); setDialog('contact'); }}><MessageSquare />Contact your inspector</Button>}
          {statusOf(booking) === 'Completed' && <Button asChild><a href="#inspection-report"><FileText />View inspection report</a></Button>}
          {canCancel(booking) && <Button variant="ghost" className="text-destructive" onClick={() => setDialog('cancel')}><X />Cancel inspection</Button>}
        </div>
      </div>
    </div>
    {statusOf(booking) === 'Completed' && <section id="inspection-report" className="mt-12 scroll-mt-24 border-t pt-10"><InspectionReport booking={booking} /></section>}
    <Dialog open={dialog !== null} onOpenChange={open => { if (!open) setDialog(null); }}><DialogContent className="max-h-[85vh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg">
      <DialogTitle>{dialog === 'cancel' ? 'Cancel this inspection?' : dialog === 'report' ? 'Sample inspection report' : `Contact ${booking.inspector}`}</DialogTitle>
      <DialogDescription>{dialog === 'cancel' ? 'The booking will remain in Your Bookings marked as cancelled.' : dialog === 'report' ? `${booking.vehicle} · Demonstration report` : 'Demonstration message only; no message will be sent to a real inspector.'}</DialogDescription>
      {dialog === 'cancel' && <div className="flex flex-wrap gap-3"><Button variant="outline" onClick={() => setDialog(null)}>Keep booking</Button><Button variant="destructive" onClick={() => { cancelBooking(booking.id); setDialog(null); }}>Confirm cancellation</Button></div>}
      {dialog === 'contact' && (sent ? <p role="status" className="text-accent">Sample message saved for this demonstration.</p> : <form onSubmit={e => { e.preventDefault(); setSent(true); }}><label className="text-sm">Message<textarea required className="mt-2 min-h-32 w-full rounded-md border bg-card p-3 focus:ring-2 focus:ring-ring" /></label><Button type="submit" className="mt-4"><MessageSquare />Send sample message</Button></form>)}
      {dialog === 'report' && <div className="space-y-4 text-sm"><p>Completed {displayTime(booking.timestamps[4] ?? '')}</p><p>Inspector: {booking.inspector}</p><dl className="space-y-3">{[['Exterior & body', 'Minor cosmetic wear'], ['Engine & transmission', 'No major issues observed'], ['Brakes & tires', 'Front tires showing wear'], ['Road test', 'Completed']].map(([k, v]) => <div key={k} className="border-t pt-3"><dt className="font-medium">{k}</dt><dd className="mt-1 text-muted-foreground">{v}</dd></div>)}</dl><p className="text-xs text-muted-foreground">Illustrative findings, not an actual vehicle assessment.</p></div>}
    </DialogContent></Dialog>
  </section>;
}
