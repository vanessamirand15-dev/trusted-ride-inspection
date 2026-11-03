import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createLovableAiGatewayRunIdFetch, getLovableAiGatewayRunId } from "./run-id.ts";
import type { ParsedListing } from "../listing-parse";

const INSTRUCTIONS = [
  "You read screenshots of used-car listings.",
  "Return ONLY a JSON object with optional string keys: vehicle (year make model trim), vin, mileage, price, location.",
  "Only include values clearly visible in the image. Never guess. Return {} if no car listing is visible.",
].join(" ");

export async function readListingScreenshot(request: Request, dataUrl: string): Promise<ParsedListing> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured");
  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    instructions: INSTRUCTIONS,
    messages: [{ role: "user", content: [{ type: "text", text: "Extract the vehicle details." }, { type: "image", image: new URL(dataUrl) }] }],
    abortSignal: request.signal,
    maxRetries: 0,
    providerOptions: { openai: { forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] } },
  });
  const text = await result.text;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return {};
  const raw = JSON.parse(match[0]) as Record<string, unknown>;
  const out: ParsedListing = {};
  for (const k of ["vehicle", "vin", "mileage", "price", "location"] as const) {
    const v = raw[k];
    if (typeof v === "string" && v.trim()) out[k] = v.trim().slice(0, 120);
  }
  return out;
}
