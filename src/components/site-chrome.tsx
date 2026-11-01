import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from 'react';
import { ShieldCheck, Menu, LogOut, UserRound, CalendarDays, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoAccount } from '@/components/demo-account';
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';

const nav = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/pricing", label: "Pricing" },
  { to: "/for-inspectors", label: "For inspectors" },
] as const;

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground">
        <ShieldCheck className="h-5 w-5" />
      </span>
      <span className={`font-display text-xl font-bold ${dark ? "text-navy-foreground" : "text-navy"}`}>
        Trustferly
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { account, logout } = useDemoAccount();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild><Button variant="ghost" size="icon" aria-label="Open menu" title="Open menu"><Menu /></Button></SheetTrigger>
            <SheetContent side="left" className="flex w-[min(90vw,360px)] flex-col overflow-y-auto motion-reduce:animate-none">
              <SheetTitle><Logo /></SheetTitle><SheetDescription className="sr-only">Trustferly navigation</SheetDescription>
              <nav aria-label="Main menu" className="mt-8 space-y-2">
                <Button asChild variant="cta" className="mb-4 w-full justify-start"><Link to="/book" onClick={() => setOpen(false)}><Plus />Book now</Link></Button>
                <Link to="/" onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-sm hover:bg-secondary">Home</Link>
                {nav.map(n => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-sm hover:bg-secondary">{n.label}</Link>)}
              </nav>
              <div className="mt-6 border-t pt-6">
                {account ? <><p className="mb-4 break-words px-3 text-sm font-semibold">{account.name}</p><nav aria-label="Your account" className="space-y-2">
                  {([{ to: '/account', label: 'Your account', icon: UserRound }, { to: '/account/settings', label: 'Account settings', icon: Settings }, { to: '/bookings', label: 'Your Bookings', icon: CalendarDays }] as const).map(n => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-md px-3 py-3 text-sm hover:bg-secondary"><n.icon size={17} />{n.label}</Link>)}
                  <Button variant="ghost" className="w-full justify-start" onClick={() => { logout(); setOpen(false); navigate({ to: '/auth', replace: true }); }}><LogOut />Log out</Button>
                </nav></> : <Button asChild variant="outline" className="w-full"><Link to="/auth" onClick={() => setOpen(false)}><UserRound />Log in / Sign up</Link></Button>}
              </div>
            </SheetContent>
          </Sheet>
          <Logo />
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-navy/70 transition-colors hover:text-navy"
              activeProps={{ className: "text-navy" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="hidden lg:inline-flex"><Link to={account ? '/bookings' : '/auth'}>{account ? 'Your Bookings' : 'Log in'}</Link></Button>
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
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo dark />
          <p className="mt-4 max-w-sm text-sm text-navy-foreground/70">
            Independent pre-purchase inspections for private-party used vehicles. We don't sell cars,
            offer loans, or act as a dealership — we help you buy with confidence.
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
          <Link to="/for-inspectors" className="block text-navy-foreground/70 hover:text-navy-foreground">Apply as inspector</Link>
        </div>
      </div>
      <div className="border-t border-navy-foreground/10 py-5 text-center text-xs text-navy-foreground/50">
        © {new Date().getFullYear()} Trustferly. Independent inspections only.
      </div>
    </footer>
  );
}

export function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="mx-auto max-w-3xl px-5 pb-10 pt-16 text-center md:pt-24">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent">{eyebrow}</p>
      <h1 className="mt-3 text-4xl font-bold md:text-5xl">{title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{text}</p>
    </section>
  );
}
