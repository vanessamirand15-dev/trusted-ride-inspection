# Account and booking demonstration
## Demo payment protection disclosure
- [ ] Add the homepage payment protection demo card and update payment-related FAQs; verify both visibly.
## Unified real accounts
- [x] Replace buyer demo login with shared real email, Google, Apple and Lovable accounts (Facebook unsupported). Social providers enabled; external provider sign-in not exercised.
- [x] Require saved name, phone and contact preferences before buyer bookings; persist owner-only requests with RLS.
- [x] Add Your Bookings navigation and softer global background, preserve seller and mock payment flows.
- [x] Test profile onboarding, saved requests, signed-out redirects, blocked foreign-owner insertion/read, blocked lifecycle escalation, cancellation persistence and safe sign-out.
## Seller inspections
- [x] Add a dedicated seller area with own-car booking, account access and saved seller requests.
- [x] Verify seller signup, booking completion and buyer flow preservation.
## Car listing intake
- [x] Add an optional Car listing URL field without blocking manual booking entry.
- [x] Add a pasted listing text option: buyers copy ad text, the browser fills vehicle details locally for review, manual entry stays available (parser tested).
- [ ] Extract available vehicle details automatically from a URL: blocked because Firecrawl connection creation was denied by workspace permissions and no accessible connection exists. A workspace member with connection permissions must connect Firecrawl before extraction can be implemented and tested.
- [ ] Verify successful and failed live extraction after Firecrawl is connected.

## Academic financial screens
- [x] Add a dedicated dummy payment step before buyer confirmation, including billing address and disclaimer.
- [x] Add Wallet & Payouts to real and sample inspector portals with mock setup and fictional ledger.
- [x] Verify booking completion, sample wallet setup, financial input non-persistence and narrow-screen layout.
- [ ] Verify wallet within a real signed-in inspector account: blocked because the existing QA login did not succeed and the requesting user has no account available for session minting.

- [x] Add shared demonstration accounts and booking entities with tested lifecycle rules.
- [x] Add login/signup, account, settings, booking list and booking detail pages.
- [x] Tie the booking form to the signed-in demonstration account.
- [x] Add top-left expandable navigation with signed-in account links.
- [x] Verify signup, sample login, booking creation, timelines, cancellation, and mobile navigation.
- [x] Add sample multi-angle photo gallery to the completed demonstration booking.
- Inspector accounts are deferred by request.

## Inspection report and visual identity
- [x] Add the uploaded company logo and browser icon.
- [x] Add a full sample condition report and vehicle history to the completed sample booking.
- [x] Refine headings and darken gray text.
- [x] Verify the sample report and logo on wide and narrow screens.

## Academic prototype landing page (all copy in English)
- [x] Add academic project badge noting all data is simulated. (Removed again at user request.)
- [x] Add FAQ accordion below the coverage section.
- [x] Add "View Sample Report (Demo)" modal on hero and coverage sections.
- [x] Add projected metrics card and simulated testimonials.
- [x] Add zip/city availability demo lookup in the hero.
- [x] Add guarantee and secure payment badges to footer and CTAs.

## Startup pitch polish
- [x] Simplify landing labels without presenting invented proof as verified facts.
- [x] Replace the public sample report with a Honda Accord report, category flags, three findings and illustrative signature.
- [x] Add the two requested pricing tiers to home, pricing and booking selection, with price tests.
- [x] Verify report interactions, pricing selection and narrow-screen layouts.
- The uploaded brief ends at “Include”; any missing requirements await the remainder.

## Interactive MVP flows (latest brief, cut off after item 3)
- [x] Enrich the sample report modal: VIN/mileage overview, inspector rating, summary recommendation, print/download placeholder.
- [x] Rebuild booking as a 4-step wizard: vehicle details, service level, date & time slot, simulated checkout success.
- [x] Make the hero ZIP search show a dynamic inspector-count banner.
- [x] Verify form inputs and labels render in Inter like the rest of the site (no layout or color changes).
- [x] Add an AI Gateway "explain findings in plain English" action on reports, shown beside originals and marked as a draft pending inspector confirmation.
- [x] Fix signup from the booking gate returning to the booking form instead of the bookings list.

## Final MVP polish
- [x] Add "Estimate Your Inspection Value" calculator (vehicle age + class → recommended inspection, cost, potential savings).
- [x] Add "Buying Blind" vs "Inspected by Trustferly" comparison section.
- [x] Add 3-pillar trust section: background checks, same/next-day service, reschedule protection.

## Master brief (all-in-one)
- [x] Restore the mandatory "Academic MVP Prototype" disclaimer in the top bar and footer (user reversed the earlier removal); standardize captions to "Sample data for MVP demonstration".
- [x] Extend the booking wizard: seller contact details in scheduling step, mock card inputs and a generated tracking ID at confirmation.
- [x] Replace "Apply to inspect" with a dedicated inspector application form (certification #, experience, city/state, equipment checklist, 48-hour success state).
- [x] Add footer legal modals: Terms of Service, Privacy Policy, Cancellation Policy with sample terms.
- Already covered by prior work: sample report modal, dynamic savings calculator, FAQ accordion, ZIP availability search.
- Note: booking stays an account-linked page wizard (login-first requirement) rather than a modal; all four steps match the brief's content.

## Inspector portal
- [x] /apply onboarding form, /inspector/dashboard (profile, radius, job feed, accept/decline, my inspections), footer links
- [x] /inspector/profile document uploads + verification badge
- [x] /inspector/inspection/$id checklist, section photos, notes, submit report
- [x] /inspector/finances earnings overview + availability calendar
- [x] Header without "For inspectors"; footer "For Professionals" with Apply as inspector + Inspector Portal
- [x] Specialties selection + payout tiers ($80–$100 standard, $150–$220+ luxury) on /apply and /inspector/profile
- [x] Job cards show category badge and tier payout; inspection form sections + luxury diagnostic notes
- [x] Real inspector sign up/login, saved profile + assigned jobs, private documents (inspector + reviewers)  (tested end to end)
- [ ] Production refactor brief (3 tiers $149/$229/$349, multi-step /apply, maps link, extended report builder, chat/support) — uploaded file is cut off at item 5
- [x] Header strictly Logo / How it works / Pricing / Book inspection; pro links only in footer For Professionals

## Header rework (latest brief)
- [x] Utility bar: phone, Need Help dialog, Become an Inspector, Inspector Login (WhatsApp removed at user request)
- [x] Main nav: How it works, Pricing, Coverage Area, Sample Report, FAQ + Sign in + Book inspection
- [x] Mobile drawer with all nav, support and professional links

## Coverage & contact
- [x] Nationwide coverage section: US map with regional pins, ZIP checker (every valid US ZIP is active)
- [x] Contact Support footer column, Contact Us section + dialog with saved form

- [x] Car listing URL: free direct page import (structured data + title), editable, with paste/manual fallback
- [x] Declutter Request an inspection: three clear intake options (link, screenshot, paste text)
- [x] Reorder intake options on /book: Enter details manually first, then Link, Screenshot, Paste text — done
