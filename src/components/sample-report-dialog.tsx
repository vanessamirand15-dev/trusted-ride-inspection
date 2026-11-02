import { useState } from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { InspectionReport } from '@/components/inspection-report';
import { sampleState } from '@/lib/demo-bookings';

const sampleBooking = sampleState().bookings.find(b => b.id === 'sample-mazda')!;

export function SampleReportDialog({ variant = 'outline' }: { variant?: 'outline' | 'onDark' }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size="lg"><FileText />View Sample Report (Demo)</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-lg">
        <DialogTitle className="sr-only">Sample inspection report</DialogTitle>
        <DialogDescription className="sr-only">Simulated inspection report shown for demonstration purposes only</DialogDescription>
        <span className="inline-flex w-fit items-center rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">Sample report / Demo only</span>
        <div className="mt-4"><InspectionReport booking={sampleBooking} /></div>
      </DialogContent>
    </Dialog>
  );
}
