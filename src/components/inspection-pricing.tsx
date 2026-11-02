import { Link } from '@tanstack/react-router';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { inspectionPlans } from '@/lib/inspection-plans';

export function InspectionPricing() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {inspectionPlans.map((plan, index) => (
        <article key={plan.id} className={`flex min-w-0 flex-col rounded-lg border bg-card p-6 sm:p-8 ${index === 0 ? 'border-primary' : ''}`}>
          <p className="text-sm font-semibold text-accent">{index === 0 ? 'For everyday vehicles' : 'For premium and exotic vehicles'}</p>
          <h3 className="mt-3 text-2xl font-semibold leading-snug">{plan.name}</h3>
          <p className="mt-5 text-4xl font-semibold text-navy">${plan.price}<span className="ml-2 text-sm font-normal text-muted-foreground">per inspection</span></p>
          <ul className="mb-8 mt-6 space-y-4">
            {plan.features.map(feature => <li key={feature} className="flex items-start gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" /><span>{feature}</span></li>)}
          </ul>
          <Button asChild variant={index === 0 ? 'cta' : 'outline'} className="mt-auto w-full"><Link to="/book" search={{ plan: plan.id }}>Choose {index === 0 ? 'Standard' : 'Premium'}<ArrowRight /></Link></Button>
        </article>
      ))}
    </div>
  );
}