import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Copy, Star } from "lucide-react";
import { toast } from "sonner";
import { categoryLabel, getTool, pricingLine } from "@/lib/catalog";
import { formatCompact, formatUsdc } from "@/lib/format";
import { useAisleStore, useInstalled } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PayDialog } from "@/components/pay-dialog";
import { Separator } from "@/components/ui/separator";
import { ToolMark } from "@/components/tool-mark";

export const Route = createFileRoute("/tools/$toolId")({
  loader: ({ params }) => {
    const tool = getTool(params.toolId);
    if (!tool) throw notFound();
    return { tool };
  },
  component: ToolPage,
  notFoundComponent: () => (
    <div className="py-16 text-center">
      <p className="font-serif text-2xl italic">No such tool.</p>
      <Link to="/" className="mt-4 inline-block text-sm text-muted hover:text-fg">
        Back to the store
      </Link>
    </div>
  ),
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.tool.name} — Aisle` : "Aisle" }],
  }),
});

function ToolPage() {
  const { tool } = Route.useLoaderData();
  const installed = useInstalled(tool.id);
  const [pay, setPay] = useState(false);
  const run = useAisleStore((s) => s.run);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  async function runSample() {
    setRunning(true);
    setOutput(null);
    await new Promise((r) => setTimeout(r, 500));
    const result = await run(tool.id);
    setRunning(false);
    if (!result.ok) {
      toast(
        result.reason === "missing"
          ? "Install first"
          : result.reason === "busy"
            ? "Still signing"
            : "Not enough USDC in the channel",
      );
      return;
    }
    setOutput(result.response);
  }

  return (
    <div className="py-8 md:py-10">
      <Link
        to="/"
        className="inline-flex h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft className="size-4" />
        Store
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div>
          <div className="flex items-start gap-4">
            <ToolMark mark={tool.mark} className="size-14 text-xl" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-4xl italic leading-tight text-fg">{tool.name}</h1>
                {tool.isNew ? <Badge variant="accent">New</Badge> : null}
                {installed ? <Badge variant="success">Installed</Badge> : null}
              </div>
              <p className="mt-1 text-muted">
                {tool.publisher}
                {tool.verified ? " · Verified" : ""}
                {" · "}
                {categoryLabel(tool.category)}
              </p>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-base leading-normal text-fg/90">{tool.description}</p>

          <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Rating" value={tool.rating.toFixed(1)} icon />
            <Stat label="Installs" value={formatCompact(tool.installs)} />
            <Stat label="Latency" value={`${tool.latencyMs} ms`} />
            <Stat label="Reviews" value={String(tool.reviews)} />
          </dl>

          <h2 className="mt-10 font-serif text-2xl italic">Capabilities</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {tool.capabilities.map((c) => (
              <li key={c}>
                <span className="inline-flex h-9 items-center rounded-md bg-surface-2 px-3 font-mono text-xs text-fg shadow-[0_0_0_1px_var(--color-border)]">
                  {c}
                </span>
              </li>
            ))}
          </ul>

          <h2 className="mt-10 font-serif text-2xl italic">Sample</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <CodeBlock title="Request" code={tool.sampleRequest} />
            <CodeBlock title="Response" code={tool.sampleResponse} />
          </div>

          {output ? (
            <div className="mt-4">
              <CodeBlock title="Last run" code={output} />
            </div>
          ) : null}

          <h2 className="mt-10 font-serif text-2xl italic">From agents</h2>
          <ul className="mt-3 space-y-3">
            {tool.reviewList.map((r) => (
              <li
                key={r.agent}
                className="rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]"
              >
                <div className="flex items-center justify-between gap-3 text-sm">
                  <p className="font-mono text-xs text-muted">
                    {r.agent}
                    <span className="text-subtle"> · {r.shop}</span>
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs tabular-nums text-subtle">
                    <Star className="size-3 fill-current" />
                    {r.rating}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-normal text-fg">{r.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <p className="font-mono text-sm tabular-nums text-fg">{pricingLine(tool.pricing)}</p>
          <p className="mt-1 text-sm text-muted">
            {tool.installPrice === 0
              ? "Free to install"
              : `Install ${formatUsdc(tool.installPrice)}`}
          </p>
          <Separator className="my-4" />
          {installed ? (
            <div className="space-y-3">
              <KeyRow value={installed.key} />
              <div className="hidden space-y-3 lg:block">
                <Button className="w-full" onClick={runSample} disabled={running}>
                  {running ? "Running…" : "Run sample"}
                </Button>
                <Button asChild variant="secondary" className="w-full">
                  <Link to="/installed">Installed tools</Link>
                </Button>
              </div>
            </div>
          ) : (
            <Button className="hidden w-full lg:inline-flex" onClick={() => setPay(true)}>
              {tool.installPrice === 0 ? "Install" : `Pay ${formatUsdc(tool.installPrice)}`}
            </Button>
          )}
          <p className="mt-4 text-xs leading-normal text-subtle">
            A voucher is signed against this agent’s Solana channel. You get a capability key. Nothing else to configure.
          </p>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-bg/95 p-3 backdrop-blur-sm md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {installed ? (
          <Button className="w-full" onClick={runSample} disabled={running}>
            {running ? "Running…" : "Run sample"}
          </Button>
        ) : (
          <Button className="w-full" onClick={() => setPay(true)}>
            {tool.installPrice === 0 ? "Install" : `Pay ${formatUsdc(tool.installPrice)}`}
          </Button>
        )}
      </div>

      <PayDialog tool={tool} open={pay} onOpenChange={setPay} />
      <div className="h-20 lg:hidden" />
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: boolean }) {
  return (
    <div className="rounded-lg bg-surface px-3 py-3 shadow-[var(--shadow-border)]">
      <dt className="text-xs text-subtle">{label}</dt>
      <dd className="mt-1 flex items-center gap-1 font-mono text-sm tabular-nums text-fg">
        {icon ? <Star className="size-3 fill-current" /> : null}
        {value}
      </dd>
    </div>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-lg bg-surface-2 shadow-[var(--shadow-border)]">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <p className="text-xs text-subtle">{title}</p>
        <CopyButton value={code} />
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed text-fg/90">
        {code}
      </pre>
    </div>
  );
}

function KeyRow({ value }: { value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-surface-2 px-3 py-2 shadow-[0_0_0_1px_var(--color-border)]">
      <code className="min-w-0 flex-1 truncate font-mono text-xs text-fg">{value}</code>
      <CopyButton value={value} />
    </div>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="inline-flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:text-fg"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {
          toast("Copy failed");
        }
      }}
      aria-label="Copy"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  );
}
