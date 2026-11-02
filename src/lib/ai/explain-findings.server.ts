import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";
import { createLovableAiGatewayRunIdFetch, getLovableAiGatewayRunId } from "./run-id.ts";

export interface FindingInput {
  title: string;
  note: string;
  action?: string;
  cost?: string;
}

const INSTRUCTIONS = [
  "You help used-car buyers understand a professional pre-purchase inspection report.",
  "Rewrite the inspector's findings in plain, friendly English that a first-time buyer can understand.",
  "For each finding: what it means, why it matters, and what the buyer could do next.",
  "Stay strictly faithful to the findings given. Never invent new problems, costs, or severity.",
  "Keep each explanation to two or three short sentences. Use the finding titles as bold headings.",
].join(" ");

export async function explainFindings(request: Request, vehicle: string, findings: FindingInput[]) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("AI is not configured");

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const messages: ModelMessage[] = [
    {
      role: "user",
      content: `Vehicle: ${vehicle}\n\nFindings:\n${findings
        .map((f, i) => `${i + 1}. ${f.title}\n   Inspector note: ${f.note}${f.action ? `\n   Recommended action: ${f.action}` : ""}${f.cost ? `\n   Estimated repair cost: ${f.cost}` : ""}`)
        .join("\n")}`,
    },
  ];

  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    instructions: INSTRUCTIONS,
    messages,
    abortSignal: request.signal,
    maxRetries: 0,
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  const text = (await result.text).trim();
  if (!text) throw new Error("The explanation came back empty. Please try again.");
  return text;
}
