import { useState, type ReactNode } from "react";
import { z } from "zod";
import { BadgeCheck, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { COVERAGE_HUBS, COVERAGE_RADIUS_MILES, checkCoverage } from "@/lib/coverage";

export const SUPPORT_EMAIL = "support@trustferly.demo";
export const PHONE_DISPLAY = "1-800-555-RIDE";
export const PHONE_HREF = "tel:18005557433";
export const SUPPORT_HOURS = "Mon to Fri, 8 AM to 6 PM PST";
export const FORM_NOTICE = "Academic MVP Prototype — For demonstration purposes only. Illustrative support contact info.";

const SUBJECTS = ["General Inquiry", "Inspector Partnership", "Booking Support", "Academic Project Inquiry"] as const;

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.enum(SUBJECTS),
  message: z.string().trim().min(1, "Please write a message").max(2000),
});

const waitlistSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  zip: z.string().trim().regex(/^\d{5}$/, "Enter a 5 digit ZIP code"),
  city: z.string().trim().max(100).optional(),
});

function Notice() {
  return <p className="text-xs text-muted-foreground">{FORM_NOTICE}</p>;
}

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "General Inquiry" as string, message: "" });
  const [error, setError] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    setError(""); setState("sending");
    const { error: dbError } = await supabase.from("contact_submissions").insert(parsed.data);
    if (dbError) { setState("idle"); return setError("Could not send your message. Please try again."); }
    setState("sent");
  };
  if (state === "sent") {
    return (
      <div role="status" className="rounded-lg bg-teal-soft p-5">
        <p className="flex items-center gap-2 font-semibold text-accent"><BadgeCheck className="h-5 w-5" />Message received</p>
        <p className="mt-1 text-sm text-accent/80">Thanks, {form.name.split(" ")[0]}. Your message was saved for the Trustferly team.</p>
        <div className="mt-3"><Notice /></div>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium">Name<Input className="mt-1" value={form.name} maxLength={100} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
        <label className="text-sm font-medium">Email<Input className="mt-1" type="email" value={form.email} maxLength={255} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
      </div>
      <label className="block text-sm font-medium">Subject
        <select className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
          {SUBJECTS.map(s => <option key={s}>{s}</option>)}
        </select>
      </label>
      <label className="block text-sm font-medium">Message<Textarea className="mt-1" rows={4} maxLength={2000} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></label>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" variant="cta" disabled={state === "sending"}><Send />{state === "sending" ? "Sending" : "Send message"}</Button>
      <Notice />
    </form>
  );
}

export function ContactDetails() {
  return (
    <div className="space-y-3 text-sm">
      <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-3 rounded-lg border bg-card p-4 font-medium hover:bg-secondary"><Mail className="h-5 w-5 shrink-0 text-accent" />{SUPPORT_EMAIL}</a>
      <a href={PHONE_HREF} className="flex items-center gap-3 rounded-lg border bg-card p-4 font-medium hover:bg-secondary"><Phone className="h-5 w-5 shrink-0 text-accent" />{PHONE_DISPLAY}</a>
      <p className="flex items-center gap-3 rounded-lg border bg-card p-4 text-muted-foreground"><Clock className="h-5 w-5 shrink-0 text-accent" />{SUPPORT_HOURS}</p>
    </div>
  );
}

export function ContactDialog({ trigger }: { trigger: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-lg p-6 sm:p-8">
        <DialogTitle className="text-2xl font-semibold">Contact us</DialogTitle>
        <DialogDescription>Reach Trustferly support by email, phone or the form below.</DialogDescription>
        <div className="mt-4"><ContactDetails /></div>
        <div className="mt-6"><ContactForm /></div>
      </DialogContent>
    </Dialog>
  );
}

function WaitlistDialog({ open, onOpenChange, zip }: { open: boolean; onOpenChange: (o: boolean) => void; zip: string }) {
  const [form, setForm] = useState({ name: "", email: "", zip, city: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = waitlistSchema.safeParse({ ...form, city: form.city || undefined });
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    setError(""); setSending(true);
    const { error: dbError } = await supabase.from("coverage_requests").insert({ ...parsed.data, city: parsed.data.city ?? null });
    setSending(false);
    if (dbError) return setError("Could not save your request. Please try again.");
    setDone(true);
  };
  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (o) { setDone(false); setForm(f => ({ ...f, zip: zip || f.zip })); } }}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-lg p-6 sm:p-8">
        <DialogTitle className="text-2xl font-semibold">Request coverage in your city</DialogTitle>
        <DialogDescription>Don't see your ZIP code? Join the waitlist and we'll let you know when inspectors arrive.</DialogDescription>
        {done ? (
          <div role="status" className="mt-4 rounded-lg bg-teal-soft p-4 text-sm text-accent">
            <p className="font-semibold">You're on the list for {form.zip}.</p>
            <div className="mt-2"><Notice /></div>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-4 space-y-3" noValidate>
            <label className="block text-sm font-medium">Name<Input className="mt-1" maxLength={100} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
            <label className="block text-sm font-medium">Email<Input className="mt-1" type="email" maxLength={255} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm font-medium">ZIP code<Input className="mt-1" inputMode="numeric" maxLength={5} value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} /></label>
              <label className="text-sm font-medium">City<Input className="mt-1" maxLength={100} value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></label>
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button type="submit" variant="cta" disabled={sending}>{sending ? "Saving" : "Join the waitlist"}</Button>
            <Notice />
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function ZipChecker() {
  const [zip, setZip] = useState("");
  const [result, setResult] = useState<{ zip: string; status: ReturnType<typeof checkCoverage> } | null>(null);
  const [waitlist, setWaitlist] = useState(false);
  return (
    <div>
      <form className="flex flex-wrap gap-2" onSubmit={e => { e.preventDefault(); setResult({ zip: zip.trim(), status: checkCoverage(zip) }); }}>
        <label htmlFor="coverage-zip" className="sr-only">ZIP code</label>
        <Input id="coverage-zip" inputMode="numeric" maxLength={5} value={zip} onChange={e => { setZip(e.target.value); setResult(null); }} placeholder="e.g. 98101" className="max-w-[12rem] bg-card" />
        <Button type="submit" variant="cta"><MapPin />Check ZIP</Button>
      </form>
      {result && (
        <div role="status" className={`mt-3 rounded-lg px-4 py-3 text-sm ${result.status === "active" ? "bg-teal-soft text-accent" : "bg-secondary text-foreground"}`}>
          {result.status === "active" && <p className="flex items-center gap-2 font-semibold"><BadgeCheck className="h-4 w-4" />Active coverage available in {result.zip}.</p>}
          {result.status === "expanding" && (
            <>
              <p className="font-semibold">Expanding soon to your area ({result.zip}).</p>
              <Button variant="link" className="h-auto p-0" onClick={() => setWaitlist(true)}>Request Trustferly coverage in your city</Button>
            </>
          )}
          {result.status === "invalid" && <p>Please enter a 5 digit ZIP code.</p>}
        </div>
      )}
      <p className="mt-3 text-sm text-muted-foreground">
        Don't see your ZIP code?{" "}
        <button type="button" className="font-medium text-primary underline-offset-4 hover:underline" onClick={() => setWaitlist(true)}>Request Trustferly coverage in your city.</button>
      </p>
      <WaitlistDialog open={waitlist} onOpenChange={setWaitlist} zip={result?.status === "expanding" ? result.zip : ""} />
    </div>
  );
}

export function CoverageSection() {
  const [active, setActive] = useState<string>(COVERAGE_HUBS[0].name);
  return (
    <section id="coverage-areas" className="mx-auto max-w-6xl scroll-mt-32 px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">Coverage</p>
      <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Coverage & Service Areas</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">Verified inspectors travel up to {COVERAGE_RADIUS_MILES} miles from each Puget Sound hub.</p>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-teal-soft shadow-soft">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
            <path d="M28 0 C 22 20, 34 30, 30 45 S 22 70, 30 100 L 0 100 L 0 0 Z" className="fill-primary/10" />
          </svg>
          {COVERAGE_HUBS.map(h => (
            <button
              key={h.name}
              type="button"
              onClick={() => setActive(h.name)}
              aria-pressed={active === h.name}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
            >
              <span className={`block rounded-full border-2 border-accent/40 bg-accent/15 transition-all ${active === h.name ? "h-28 w-28" : "h-16 w-16"}`} />
              <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
              <span className="absolute left-1/2 top-1/2 mt-3 -translate-x-1/2 whitespace-nowrap rounded bg-card px-2 py-0.5 text-xs font-medium shadow-soft">{h.name}</span>
            </button>
          ))}
          <p className="absolute bottom-2 right-3 text-[10px] text-muted-foreground">Illustrative map · not to scale</p>
        </div>
        <div>
          <ul className="space-y-2">
            {COVERAGE_HUBS.map(h => (
              <li key={h.name}>
                <button type="button" onClick={() => setActive(h.name)} className={`flex w-full items-center justify-between rounded-lg border p-3 text-left text-sm transition-colors ${active === h.name ? "border-accent bg-teal-soft" : "bg-card hover:bg-secondary"}`}>
                  <span className="flex items-center gap-2 font-medium"><MapPin className="h-4 w-4 text-accent" />{h.name}</span>
                  <span className="text-xs text-muted-foreground">{h.zips}</span>
                </button>
              </li>
            ))}
            <li className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">Plus surrounding communities within a {COVERAGE_RADIUS_MILES} mile radius</li>
          </ul>
          <div className="mt-6"><ZipChecker /></div>
          <p className="mt-4 text-xs text-muted-foreground">{FORM_NOTICE}</p>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-32 px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">Support</p>
      <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Contact Us</h2>
      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_1.4fr]">
        <ContactDetails />
        <div className="rounded-2xl border bg-card p-6 shadow-soft"><ContactForm /></div>
      </div>
    </section>
  );
}
