import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Copy, Play } from "lucide-react";
import { toast } from "sonner";
import { getTool, pricingLine } from "@/lib/catalog";
import { formatUsdc, formatWhen } from "@/lib/format";
import { useAisleStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ToolMark } from "@/components/tool-mark";

export const Route = createFileRoute("/installed")({
  component: InstalledPage,
  head: () => ({ meta: [{ title: "Installed — Aisle" }] }),
});

function InstalledPage() {
  const installed = useAisleStore((s) => s.installed);
  const uninstall = useAisleStore((s) => s.uninstall);
  const run = useAisleStore((s) => s.run);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [output, setOutput] = useState<{ id: string; body: string } | null>(null);

  async function runSample(toolId: string) {
    setRunningId(toolId);
    await new Promise((r) => setTimeout(r, 450));
    const result = await run(toolId);
    setRunningId(null);
    if (!result.ok) {
      toast(
        result.reason === "missing"
          ? "Missing tool"
          : result.reason === "busy"
            ? "Still signing"
            : "Not enough USDC in the channel",
      );
      return;
    }
    setOutput({ id: toolId, body: result.response });
  }

  return (
    <div className="py-8 md:py-10">
      <h1 className="font-serif text-4xl italic leading-tight text-fg">Installed</h1>
      <p className="mt-2 max-w-xl text-muted">
        Capability keys for this agent. A sample run signs a voucher against the open channel.
      </p>

      {installed.length === 0 ? (
        <div className="mt-10 rounded-xl bg-surface px-6 py-12 text-center shadow-[var(--shadow-border)]">
          <p className="font-serif text-2xl italic text-fg">Nothing installed.</p>
          <p className="mt-2 text-sm text-muted">The catalog is open. Pay once, run after.</p>
          <Button asChild className="mt-6">
            <Link to="/">Browse the store</Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {installed.map((row) => {
            const tool = getTool(row.toolId);
            if (!tool) return null;
            return (
              <li
                key={row.toolId}
                className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <ToolMark mark={tool.mark} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <Link
                        to="/tools/$toolId"
                        params={{ toolId: tool.id }}
                        className="font-serif text-xl italic text-fg hover:underline"
                      >
                        {tool.name}
                      </Link>
                      <p className="font-mono text-xs tabular-nums text-subtle">
                        {pricingLine(tool.pricing)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-muted">{tool.tagline}</p>
                    <div className="mt-3 flex items-center gap-2 rounded-md bg-surface-2 px-3 py-2 shadow-[0_0_0_1px_var(--color-border)]">
                      <code className="min-w-0 flex-1 truncate font-mono text-xs text-fg">
                        {row.key}
                      </code>
                      <CopyBtn value={row.key} />
                    </div>
                    <p className="mt-2 text-xs tabular-nums text-subtle">
                      Installed {formatWhen(row.installedAt)}
                      {" · "}
                      {row.runs} {row.runs === 1 ? "run" : "runs"}
                      {" · "}
                      paid {formatUsdc(row.paid)}
                    </p>
                    {output?.id === tool.id ? (
                      <pre className="mt-3 overflow-x-auto rounded-md bg-surface-2 p-3 font-mono text-xs leading-relaxed text-fg/90 shadow-[0_0_0_1px_var(--color-border)]">
                        {output.body}
                      </pre>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 gap-2 sm:flex-col">
                    <Button
                      size="sm"
                      onClick={() => void runSample(tool.id)}
                      disabled={runningId === tool.id}
                    >
                      <Play className="size-3.5" />
                      {runningId === tool.id ? "Running…" : "Run"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => uninstall(tool.id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="inline-flex size-9 items-center justify-center rounded-md text-muted hover:text-fg"
      aria-label="Copy key"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {
          toast("Copy failed");
        }
      }}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  );
}
