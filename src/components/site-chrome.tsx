import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from 'react';
import { Menu, LogOut, UserRound, CalendarDays, Settings, Plus, ShieldCheck, Lock, CreditCard, Phone, Mail, LifeBuoy } from "lucide-react";
import logoAsset from '@/assets/trustferly_logo.png.asset.json';
import { Button } from "@/components/ui/button";
import { useDemoAccount } from '@/components/demo-account';
import { SampleReportDialog } from '@/components/sample-report-dialog';
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';

import { ContactDialog, FORM_NOTICE, PHONE_DISPLAY, PHONE_HREF, SUPPORT_EMAIL, SUPPORT_HOURS } from '@/components/contact-coverage';

const prototypeNotice = 'Academic MVP Prototype — For demonstration purposes only. Not an active commercial service.';

const legalDocs = [
  {
    label: 'Terms of Service',
    paragraphs: [
      'Trustferly connects used-car buyers with independent, verified inspectors for pre-purchase inspections. We do not sell vehicles, list cars, provide loans, or act as a dealership.',
      'Inspection reports reflect the vehicle\'s accessible condition at the time of the assessment and are not a warranty or a guarantee of future reliability.',
      'Sample terms for MVP demonstration. These are not legally binding terms.',
    ],
  },
  {
    label: 'Privacy Policy',
    paragraphs: [
      'Account details, booking information and vehicle data are used only to arrange and deliver your inspection and report.',
      'We never sell your personal information. Seller contact details are shared only with the assigned inspector.',
      'Sample policy for MVP demonstration. Account contact profiles and inspection requests are saved privately; payment and banking fields remain simulated and are not stored.',
    ],
  },
  {
    label: 'Cancellation Policy',
    paragraphs: [
      'Cancel free of charge before an inspector is assigned. After assignment, cancellations are refundable up to 12 hours before the scheduled slot.',
      'If the seller refuses the inspection or the vehicle is unavailable, you receive a full refund.',
      'Rescheduling is always free when the seller postpones or cancels. Sample policy for MVP demonstration.',
    ],
  },
];

function LegalDialog({ label, paragraphs }: { label: string; paragraphs: string[] }) {
  return (
    <Dialog>
      <DialogTrigger className="block text-left text-navy-foreground/70 transition-colors hover:text-navy-foreground">{label}</DialogTrigger>
      <DialogContent className="max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-lg p-6 sm:p-8">
        <DialogTitle className="text-2xl font-semibold">{label}</DialogTitle>
        <DialogDescription className="sr-only">Sample {label} for the Trustferly demonstration</DialogDescription>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          {paragraphs.map(p => <p key={p}>{p}</p>)}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const nav = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/pricing", label: "Pricing" },
] as const;

function SupportDialog({ trigger }: { trigger: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-lg p-6 sm:p-8">
        <DialogTitle className="text-2xl font-semibold">Need help?</DialogTitle>
        <DialogDescription>Reach Trustferly support through any of these channels.</DialogDescription>
        <div className="mt-5 space-y-3">
          <a href={PHONE_HREF} className="flex items-center gap-3 rounded-lg border p-4 text-sm font-medium transition-colors hover:bg-secondary">
            <Phone className="h-5 w-5 shrink-0 text-accent" />Call {PHONE_DISPLAY}
          </a>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-3 rounded-lg border p-4 text-sm font-medium transition-colors hover:bg-secondary">
            <Mail className="h-5 w-5 shrink-0 text-accent" />Email {SUPPORT_EMAIL}
          </a>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">Demo feature: in production, this opens live chat and the support portal.</p>
      </DialogContent>
    </Dialog>
  );
}

function UtilityBar() {
  return (
    <div className="hidden bg-navy-gradient text-navy-foreground lg:block">
      <div className="mx-auto flex h-9 max-w-6xl items-center justify-between px-5 text-xs font-medium">
        <div className="flex items-center gap-5">
          <a href={PHONE_HREF} className="inline-flex items-center gap-1.5 text-navy-foreground/80 transition-colors hover:text-navy-foreground">
            <Phone className="h-3.5 w-3.5" />{PHONE_DISPLAY}
          </a>
          <SupportDialog trigger={<button type="button" className="inline-flex items-center gap-1.5 text-navy-foreground/80 transition-colors hover:text-navy-foreground"><LifeBuoy className="h-3.5 w-3.5" />Need Help?</button>} />
        </div>
        <div className="flex items-center gap-5">
          <Link to="/apply" className="text-navy-foreground/80 transition-colors hover:text-navy-foreground">Become an Inspector</Link>
          <Link to="/inspector/login" className="text-navy-foreground/80 transition-colors hover:text-navy-foreground">Inspector Login</Link>
        </div>
      </div>
    </div>
  );
}

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img src={logoAsset.url} alt="" width={40} height={40} className="h-10 w-10 shrink-0 object-contain" />
      <span className={`font-display text-xl font-semibold ${dark ? "text-navy-foreground" : "text-navy"}`}>
        Trustferly
      </span>
    </Link>
  );
}

const mainNavLinkClass = "text-sm font-medium text-navy/70 transition-colors hover:text-navy";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { account, logout } = useDemoAccount();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <p className="bg-secondary px-5 py-1.5 text-center text-[11px] font-medium text-muted-foreground">{prototypeNotice}</p>
      <UtilityBar />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild><Button variant="ghost" size="icon" aria-label="Open menu" title="Open menu"><Menu /></Button></SheetTrigger>
            <SheetContent side="left" className="flex w-[min(90vw,360px)] flex-col overflow-y-auto motion-reduce:animate-none">
              <SheetTitle><Logo /></SheetTitle><SheetDescription className="sr-only">Trustferly navigation</SheetDescription>
              <nav aria-label="Main menu" className="mt-8 space-y-2">
                <Button asChild variant="cta" className="mb-4 w-full justify-start"><Link to="/book" onClick={() => setOpen(false)}><Plus />Book now</Link></Button>
                <Link to="/" onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-sm hover:bg-secondary">Home</Link>
                <Link to="/bookings" onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-sm hover:bg-secondary">Your Bookings</Link>
                <Link to="/sellers" onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-sm hover:bg-secondary">For sellers</Link>
                {nav.map(n => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-sm hover:bg-secondary">{n.label}</Link>)}
                <Link to="/" hash="coverage" onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-sm hover:bg-secondary">Coverage Area</Link>
                <SampleReportDialog trigger={<button type="button" className="block w-full rounded-md px-3 py-3 text-left text-sm hover:bg-secondary">Sample Report</button>} />
                <Link to="/" hash="faq" onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-sm hover:bg-secondary">FAQ</Link>
              </nav>
              <div className="mt-6 border-t pt-6">
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Support</p>
                <nav aria-label="Support" className="space-y-2">
                  <a href={PHONE_HREF} className="flex items-center gap-3 rounded-md px-3 py-3 text-sm hover:bg-secondary"><Phone size={17} />{PHONE_DISPLAY}</a>
                  <SupportDialog trigger={<button type="button" className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm hover:bg-secondary"><LifeBuoy size={17} />Need Help?</button>} />
                </nav>
              </div>
              <div className="mt-6 border-t pt-6">
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">For professionals</p>
                <nav aria-label="For professionals" className="space-y-2">
                  <Link to="/apply" onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-sm hover:bg-secondary">Become an Inspector</Link>
                  <Link to="/inspector/login" onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-sm hover:bg-secondary">Inspector Login</Link>
                </nav>
              </div>
              <div className="mt-6 border-t pt-6">
                {account ? <><p className="mb-4 break-words px-3 text-sm font-semibold">{account.name}</p><nav aria-label="Your account" className="space-y-2">
                  {([{ to: '/account', label: 'Your account', icon: UserRound }, { to: '/account/settings', label: 'Account settings', icon: Settings }, { to: '/bookings', label: 'Your Bookings', icon: CalendarDays }] as const).map(n => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-md px-3 py-3 text-sm hover:bg-secondary"><n.icon size={17} />{n.label}</Link>)}
                  <Button variant="ghost" className="w-full justify-start" onClick={() => { void logout(); setOpen(false); }}><LogOut />Log out</Button>
                </nav></> : <Button asChild variant="outline" className="w-full"><Link to="/auth" onClick={() => setOpen(false)}><UserRound />Log in / Sign up</Link></Button>}
              </div>
            </SheetContent>
          </Sheet>
          <Logo />
        </div>
        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={mainNavLinkClass}
              activeProps={{ className: "text-navy" }}
            >
              {n.label}
            </Link>
          ))}
          <Link to="/" hash="coverage" className={mainNavLinkClass}>Coverage Area</Link>
          <SampleReportDialog trigger={<button type="button" className={mainNavLinkClass}>Sample Report</button>} />
          <Link to="/" hash="faq" className={mainNavLinkClass}>FAQ</Link>
        </nav>
        <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="sm" className="hidden md:inline-flex"><Link to="/bookings">Your Bookings</Link></Button>
        <Button asChild variant="cta" size="sm">
          <Link to="/book">Book inspection</Link>
        </Button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-navy-gradient text-navy-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3 lg:grid-cols-6">
        <div className="md:col-span-3 lg:col-span-2">
          <Logo dark />
          <p className="mt-4 max-w-sm text-sm text-navy-foreground/70">
            Independent pre-purchase inspections for private-party used vehicles. We don't sell cars,
            offer loans, or act as a dealership. We help you buy with confidence.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Platform</p>
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="block text-navy-foreground/70 hover:text-navy-foreground">
              {n.label}
            </Link>
          ))}
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Get started</p>
          <Link to="/book" className="block text-navy-foreground/70 hover:text-navy-foreground">Book an inspection</Link>
          <Link to="/sellers" className="block text-navy-foreground/70 hover:text-navy-foreground">For sellers: inspect your car</Link>
          <p className="pt-3 font-semibold">For Professionals</p>
          <Link to="/apply" className="block text-navy-foreground/70 hover:text-navy-foreground">Apply as inspector</Link>
          <Link to="/inspector/login" className="block text-navy-foreground/70 hover:text-navy-foreground">Inspector Portal / Login</Link>
          <Link to="/inspector/dashboard" className="block text-navy-foreground/70 hover:text-navy-foreground">Sample portal (demo)</Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Legal</p>
          {legalDocs.map(d => <LegalDialog key={d.label} label={d.label} paragraphs={d.paragraphs} />)}
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Contact Support</p>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="block break-all text-navy-foreground/70 hover:text-navy-foreground">{SUPPORT_EMAIL}</a>
          <a href={PHONE_HREF} className="block text-navy-foreground/70 hover:text-navy-foreground">{PHONE_DISPLAY}</a>
          <p className="text-xs text-navy-foreground/50">{SUPPORT_HOURS}</p>
          <ContactDialog trigger={<button type="button" className="block text-left text-navy-foreground/70 hover:text-navy-foreground">Contact form</button>} />
        </div>
      </div>
      <div className="border-t border-navy-foreground/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-6 text-xs font-medium text-navy-foreground/70">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" />Satisfaction Guarantee</span>
          <span className="inline-flex items-center gap-1.5"><Lock className="h-4 w-4" />Secure SSL Checkout</span>
          <span className="inline-flex items-center gap-1.5"><CreditCard className="h-4 w-4" />Visa · Mastercard · American Express</span>
        </div>
        <div className="border-t border-navy-foreground/10 py-5 text-center text-xs text-navy-foreground/50">
          <p>© {new Date().getFullYear()} Trustferly. Independent inspections only.</p>
          <p className="mt-1.5">{prototypeNotice}</p>
          <p className="mt-1">{FORM_NOTICE}</p>
        </div>
      </div>
    </footer>
  );
}

export function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="mx-auto max-w-3xl px-5 pb-10 pt-16 text-center md:pt-24">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent">{eyebrow}</p>
      <h1 className="mt-3 text-4xl font-semibold md:text-5xl">{title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{text}</p>
    </section>
  );
}
