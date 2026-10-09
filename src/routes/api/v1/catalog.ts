import { createFileRoute } from "@tanstack/react-router";
import { getTool, searchTools } from "@/lib/catalog";

export const Route = createFileRoute("/api/v1/catalog")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const q = url.searchParams.get("q") ?? "";
        const category = url.searchParams.get("category") ?? undefined;
        const id = url.searchParams.get("id");
        if (id) {
          const tool = getTool(id);
          if (!tool) {
            return Response.json({ ok: false, error: "not_found" }, { status: 404 });
          }
          return Response.json({
            ok: true,
            tool: {
              id: tool.id,
              name: tool.name,
              tagline: tool.tagline,
              category: tool.category,
              publisher: tool.publisher,
              install: tool.installPrice,
              pricing: tool.pricing,
              capabilities: tool.capabilities,
              latencyMs: tool.latencyMs,
            },
          });
        }
        const tools = searchTools(q, category).map((t) => ({
          id: t.id,
          name: t.name,
          tagline: t.tagline,
          category: t.category,
          publisher: t.publisher,
          install: t.installPrice,
          pricing: t.pricing,
          capabilities: t.capabilities,
        }));
        return Response.json({
          ok: true,
          query: q,
          category: category ?? null,
          count: tools.length,
          tools,
        });
      },
    },
  },
});
