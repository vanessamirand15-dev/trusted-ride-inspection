import { BookingWizard } from '@/components/booking-wizard';
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type DragEvent as ReactDragEvent } from "react";
import { BadgeCheck, CalendarCheck, Car, Check, ChevronLeft, ClipboardList, ClipboardPaste, CreditCard, ExternalLink, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoTip } from "@/components/info-tip";
import { PageIntro } from "@/components/site-chrome";
import { AccountGate } from '@/components/account-ui';
import { useDemoAccount } from '@/components/demo-account';
import { inspectionPlans, packageLabel } from '@/lib/inspection-plans';
import { FinancialDisclaimer, MockPaymentGateway } from '@/components/mock-finance';
import { parseListingText, type ParsedListing } from '@/lib/listing-parse';
import { useServerFn } from '@tanstack/react-start';
import { importListingFromUrl } from '@/lib/listing-import.functions';
import { readListingScreenshotFn } from '@/lib/ai/read-screenshot.functions';

export const Route = createFileRoute("/_authenticated/_buyer/book")({
  validateSearch: (search: Record<string, unknown>): { plan?: 'standard' | 'premium'; purpose?: 'seller' } => {
    const plan = search['plan'];
    return { ...(plan === 'standard' || plan === 'premium' ? { plan } : {}), ...(search['purpose'] === 'seller' ? { purpose: 'seller' as const } : {}) };
  },
  head: () => ({
    meta: [
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { title: "Book an inspection · Trustferly" },
      { name: "description", content: "Request an independent pre-purchase inspection for a used vehicle." },
      { property: "og:title", content: "Book a Trustferly inspection" },
      { property: "og:description", content: "Request a verified inspector for the car you're considering." },
    ],
  }),
  component: Page,
});

function Page() { const { plan, purpose } = Route.useSearch(); return <AccountGate><BookingWizard plan={plan} purpose={purpose} /></AccountGate>; }
