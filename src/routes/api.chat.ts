import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, stepCountIs, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import {
  receptionistTools,
  RECEPTIONIST_SYSTEM_PROMPT,
} from "@/lib/ai-receptionist-tools.server";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(messages)) {
          return new Response("messages required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: RECEPTIONIST_SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages),
          tools: receptionistTools,
          stopWhen: stepCountIs(50),
          onError: ({ error }) => {
            console.error("[receptionist chat] stream error:", error);
          },
        });
        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});