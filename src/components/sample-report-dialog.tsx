import { useState } from 'react';
import { BadgeCheck, CheckCircle2, FileText, Flag, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import brakePhoto from '@/assets/report-honda-brakes.jpg';
import tirePhoto from '@/assets/report-honda-tire.jpg';
import enginePhoto from '@/assets/report-honda-engine.jpg';

const findings = [
  { title: 'Front brake pads', photo: brakePhoto, note: 'Front brake pads at 20% life remaining. Replace soon to maintain braking performance.', cost: '$180', action: 'Service soon' },
  { title: 'Uneven front tire wear', photo: tirePhoto, note: 'Inner shoulder wear suggests an alignment check. Review tread depth and rotate tires at the next service.', cost: '$95', action: 'Service soon' },
  { title: 'Minor valve cover seepage', photo: enginePhoto, note: 'Dry residue near the valve cover. No active drip observed. Clean the area and monitor at the next oil change.', cost: '$0', action: 'Monitor' },
];

export function SampleReportDialog({ variant = 'outline' }: { variant?: 'outline' | 'onDark' }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size="lg"><FileText />View Sample Report</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-lg p-5 sm:p-8">
        <header className="border-b pb-6 pr-5">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-accent"><FileText className="h-4 w-4" />Trustferly inspection report</p>
          <DialogTitle className="text-2xl font-semibold leading-snug sm:text-3xl">2018 Honda Accord</DialogTitle>
          <DialogDescription className="mt-2">Example report · Fictional findings, photos and inspector credentials.</DialogDescription>
          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm"><span>Inspected October 28, 2026</span><span>Report TF-ACCORD-1028</span></div>
        </header>
        <section aria-label="Overall assessment" className="flex flex-wrap items-center justify-between gap-5 border-b py-5">
          <div><p className="text-sm text-muted-foreground">Overall verdict</p><h2 className="mt-1 flex items-start gap-2 text-xl font-semibold"><BadgeCheck className="mt-0.5 h-6 w-6 shrink-0 text-accent" />Approved with Caveats</h2><p className="mt-2 text-sm text-muted-foreground">Good overall condition. Address wear items before purchase.</p></div>
          <div><p className="text-sm text-muted-foreground">Overall score</p><p className="text-4xl font-semibold text-navy">8.5<span className="text-lg font-normal text-muted-foreground">/10</span></p></div>
        </section>
        <section aria-label="Inspection checklist" className="py-3"><h2 className="text-lg font-semibold">Condition checklist</h2><ul className="mt-4 grid gap-3 sm:grid-cols-2">{['Engine', 'Transmission', 'Frame', 'Electronics'].map(category => <li key={category} className="flex items-center justify-between gap-3 border-b pb-3"><span className="flex items-center gap-2"><Flag className="h-4 w-4 fill-current text-accent" />{category}</span><span className="text-sm text-accent">Passed</span></li>)}<li className="flex items-center justify-between gap-3 border-b pb-3 sm:col-span-2"><span className="flex items-center gap-2"><Flag className="h-4 w-4 fill-current text-warning" />Brakes &amp; Tires</span><span className="text-sm text-warning">Needs attention</span></li></ul><p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />OBD-II scan: no active diagnostic trouble codes.</p></section>
        <section className="border-t pt-5"><h2 className="text-lg font-semibold">Inspection findings <span className="text-muted-foreground">(3)</span></h2><div className="mt-4 space-y-6">{findings.map((finding, index) => <article key={finding.title} className="grid gap-4 border-b pb-6 sm:grid-cols-[160px_1fr]"><img src={finding.photo} alt={`Illustrative inspection photo: ${finding.title}`} loading="lazy" width={1024} height={768} className="aspect-[4/3] w-full rounded-lg object-cover" /><div className="min-w-0"><p className="flex items-center gap-2 text-xs font-semibold text-warning"><TriangleAlert className="h-4 w-4" />{finding.action}</p><h3 className="mt-2 text-base font-semibold">{index + 1}. {finding.title}</h3><p className="mt-2 text-sm text-muted-foreground">{finding.note}</p><p className="mt-3 text-sm font-medium">Estimated repair cost: {finding.cost}</p></div></article>)}</div></section>
        <footer className="flex flex-wrap items-end justify-between gap-4 pt-2"><div><p className="text-sm text-muted-foreground">Inspector signature</p><p className="mt-2 text-2xl italic text-navy">Alex Morgan</p><p className="mt-1 text-sm text-muted-foreground">ASE-certified inspector · Example signature</p></div><p className="max-w-xs text-xs text-muted-foreground">This example illustrates an inspection, not a warranty or a verified vehicle record.</p></footer>
      </DialogContent>
    </Dialog>
  );
}
