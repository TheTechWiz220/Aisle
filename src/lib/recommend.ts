import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { catalogSummary, TOOLS } from "@/lib/catalog";

export type ToolPick = { id: string; reason: string };

function lexicalPicks(task: string): ToolPick[] {
  const words = task
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 3);
  const scored = TOOLS.map((t) => {
    const blob =
      `${t.name} ${t.tagline} ${t.description} ${t.capabilities.join(" ")} ${t.category} ${t.publisher}`.toLowerCase();
    const matched = words.filter((w) => blob.includes(w));
    return { t, matched, score: matched.length };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 3);
  if (top.length === 0) {
    return catalogSummary()
      .slice(0, 3)
      .map((t) => ({
        id: t.id,
        reason: "A common starting tool when the job is underspecified.",
      }));
  }
  return top.map(({ t, matched }) => ({
    id: t.id,
    reason: `Matches “${matched.slice(0, 2).join("”, “")}” in ${t.name}.`,
  }));
}

export const recommendTools = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ task: z.string().min(1).max(500) }).parse(input))
  .handler(async ({ data }): Promise<{ ok: true; picks: ToolPick[]; source: "model" | "index" } | { ok: false; error: string }> => {
    const fallback = lexicalPicks(data.task);
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: true, picks: fallback, source: "index" };
    }

    const catalog = catalogSummary();
    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          max_tokens: 400,
          temperature: 0.2,
          messages: [
            {
              role: "system",
              content:
                "You recommend tools from Aisle's catalog for an agent task. Reply with JSON only: {\"picks\":[{\"id\":\"north\",\"reason\":\"...\"}]}. Max 3 picks. Only use ids from the catalog. Reasons are one dry sentence. No markdown.",
            },
            {
              role: "user",
              content: `Catalog:\n${JSON.stringify(catalog)}\n\nTask:\n${data.task}`,
            },
          ],
        }),
      });
      if (!res.ok) {
        return { ok: true, picks: fallback, source: "index" };
      }
      const body = (await res.json()) as {
        choices: { message: { content: string } }[];
      };
      const text = body.choices[0]?.message.content ?? "";
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      if (jsonStart < 0 || jsonEnd < 0) {
        return { ok: true, picks: fallback, source: "index" };
      }
      const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1)) as {
        picks?: { id?: string; reason?: string }[];
      };
      const ids = new Set(catalog.map((t) => t.id));
      const picks = (parsed.picks ?? [])
        .filter((p): p is { id: string; reason: string } => Boolean(p.id && p.reason && ids.has(p.id)))
        .slice(0, 3);
      if (picks.length === 0) {
        return { ok: true, picks: fallback, source: "index" };
      }
      return { ok: true, picks, source: "model" };
    } catch {
      return { ok: true, picks: fallback, source: "index" };
    }
  });
