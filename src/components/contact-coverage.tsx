import { useState, type ReactNode } from "react";
import { z } from "zod";
import { BadgeCheck, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { COVERAGE_REGIONS, checkCoverage, type CoverageStatus } from "@/lib/coverage";

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
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Please check the form");
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

export function ZipChecker() {
  const [zip, setZip] = useState("");
  const [result, setResult] = useState<{ zip: string; status: CoverageStatus } | null>(null);
  return (
    <div>
      <form className="flex flex-wrap gap-2" onSubmit={e => { e.preventDefault(); setResult({ zip: zip.trim(), status: checkCoverage(zip) }); }}>
        <Input aria-label="ZIP code" inputMode="numeric" maxLength={5} value={zip} onChange={e => { setZip(e.target.value); setResult(null); }} placeholder="e.g. 98101" className="max-w-[12rem] bg-card" />
        <Button type="submit" variant="cta"><MapPin />Check ZIP</Button>
      </form>
      {result && (
        <div role="status" className={`mt-3 rounded-lg px-4 py-3 text-sm ${result.status === "active" ? "bg-teal-soft text-accent" : "bg-secondary text-foreground"}`}>
          {result.status === "active" && (
            <p className="flex items-center gap-2 font-semibold"><BadgeCheck className="h-4 w-4 shrink-0" />Active coverage available in {result.zip}. Inspectors serve every US ZIP code.</p>
          )}
          {result.status === "invalid" && <p>Please enter a 5 digit ZIP code.</p>}
        </div>
      )}
    </div>
  );
}

export function CoverageSection() {
  const [active, setActive] = useState<string>(COVERAGE_REGIONS[0].name);
  return (
    <section id="coverage" className="mx-auto max-w-6xl scroll-mt-32 px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">Coverage</p>
      <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Nationwide Coverage & Service Areas</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">Trustferly covers the entire United States: verified inspectors are available in every US ZIP code, so you can book an inspection wherever the vehicle is located.</p>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="relative aspect-[5/3] overflow-hidden rounded-2xl border bg-teal-soft p-4 shadow-soft">
          <svg viewBox="0 0 100 62" className="absolute inset-0 h-full w-full" aria-hidden>
            <path
              d="M6 10 L12 6 L20 6 L34 6 L42 8 L50 6 L58 5 L64 6 L74 5 L84 3 L90 2 L92 8 L90 14 L89 20 L86 28 L85 36 L82 44 L81 50 L78 56 L75 51 L70 50 L62 51 L54 56 L50 52 L46 44 L38 40 L28 38 L20 32 L12 30 L8 22 L6 14 Z"
              className="fill-primary/15 stroke-primary/30"
              strokeWidth="0.8"
            />
          </svg>
          {COVERAGE_REGIONS.map(h => (
            <button
              key={h.name}
              type="button"
              onClick={() => setActive(h.name)}
              aria-pressed={active === h.name}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
            >
              <span className={`block rounded-full border-2 border-accent/40 bg-accent/15 transition-all ${active === h.name ? "h-24 w-24" : "h-14 w-14"}`} />
              <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
              <span className="absolute left-1/2 top-1/2 mt-3 -translate-x-1/2 whitespace-nowrap rounded bg-card px-2 py-0.5 text-xs font-medium shadow-soft">{h.name}</span>
            </button>
          ))}
          <p className="absolute bottom-2 right-3 text-[10px] text-muted-foreground">Illustrative map · not to scale</p>
        </div>
        <div>
          <ul className="space-y-2">
            {COVERAGE_REGIONS.map(h => (
              <li key={h.name}>
                <button type="button" onClick={() => setActive(h.name)} className={`flex w-full items-center justify-between rounded-lg border p-3 text-left text-sm transition-colors ${active === h.name ? "border-accent bg-teal-soft" : "bg-card hover:bg-secondary"}`}>
                  <span className="flex items-center gap-2 font-medium"><MapPin className="h-4 w-4 text-accent" />{h.name}</span>
                  <span className="text-xs text-muted-foreground">{h.zips}</span>
                </button>
              </li>
            ))}
            <li className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">Plus every other ZIP code across all 50 states</li>
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
