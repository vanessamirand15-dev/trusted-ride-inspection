import { createFileRoute } from "@tanstack/react-router";
import { InspectionPricing } from '@/components/inspection-pricing';
import { PageIntro } from "@/components/site-chrome";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { title: "Pricing · Trustferly" },
      { name: "description", content: "Transparent flat-rate pricing for pre-purchase vehicle inspections." },
      { property: "og:title", content: "Trustferly pricing" },
      { property: "og:description", content: "Flat-rate independent inspection packages." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageIntro eyebrow="Pricing" title="Simple, flat-rate inspections" text="No hidden fees. No commissions on the car sale." />
      <div className="mx-auto max-w-5xl px-5 pb-24">
        <InspectionPricing />
      </div>
    </>
  );
}
