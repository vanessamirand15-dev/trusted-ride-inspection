import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

interface ExplainInput {
  vehicle: string;
  findings: { title: string; note: string; action?: string; cost?: string }[];
}

export const explainFindingsFn = createServerFn({ method: "POST" })
  .inputValidator((input: ExplainInput) => {
    if (!input || typeof input.vehicle !== "string" || !Array.isArray(input.findings) || input.findings.length === 0) {
      throw new Error("A vehicle and at least one finding are required.");
    }
    return {
      vehicle: input.vehicle.slice(0, 120),
      findings: input.findings.slice(0, 12).map((f) => ({
        title: String(f.title ?? "").slice(0, 120),
        note: String(f.note ?? "").slice(0, 600),
        action: f.action ? String(f.action).slice(0, 60) : undefined,
        cost: f.cost ? String(f.cost).slice(0, 20) : undefined,
      })),
    };
  })
  .handler(async ({ data }) => {
    try {
      const { explainFindings } = await import("./explain-findings.server.ts");
      const explanation = await explainFindings(getRequest(), data.vehicle, data.findings);
      return { explanation };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "The explanation could not be generated. Please try again." };
    }
  });
