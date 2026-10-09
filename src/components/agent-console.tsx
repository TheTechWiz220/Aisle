import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Square } from "lucide-react";
import { toast } from "sonner";
import { getTool, usageCharge } from "@/lib/catalog";
import { formatUsdc, shortAddress } from "@/lib/format";
import { DEMO_JOBS } from "@/lib/jobs";
import { recommendTools } from "@/lib/recommend";
import { channelRemaining, useAisleStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolMark } from "@/components/tool-mark";
import { cn } from "@/lib/utils";

type Line = {
  id: number;
  kind: "sys" | "req" | "ok" | "pay" | "err";
  kicker: string;
  title: string;
  body?: string;
};

type Phase = "idle" | "running" | "done" | "blocked";

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("aborted", "AbortError"));
      return;
    }
    const t = window.setTimeout(resolve, ms);
    const onAbort = () => {
      window.clearTimeout(t);
      reject(new DOMException("aborted", "AbortError"));
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

export function AgentConsole({ initialTask = "" }: { initialTask?: string }) {
  const recommend = useServerFn(recommendTools);
  const [task, setTask] = useState(initialTask);
  const [phase, setPhase] = useState<Phase>("idle");
  const [lines, setLines] = useState<Line[]>([]);
  const [spent, setSpent] = useState(0);
  const [usedIds, setUsedIds] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const lineId = useRef(0);
  const busyRef = useRef(false);
  const address = useAisleStore((s) => s.address);
  const liquid = useAisleStore((s) => s.liquid);
  const channel = useAisleStore((s) => s.channel);
  const installed = useAisleStore((s) => s.installed);
  const jobs = useAisleStore((s) => s.jobs) ?? [];
  const faucet = useAisleStore((s) => s.faucet);
  const headroom = channel ? channelRemaining(channel) : liquid;

  useEffect(() => {
    if (initialTask) setTask(initialTask);
  }, [initialTask]);

  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [lines, phase]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  function append(line: Omit<Line, "id">) {
    lineId.current += 1;
    setLines((prev) => [...prev, { ...line, id: lineId.current }]);
  }

  async function execute(nextTask: string) {
    const trimmed = nextTask.trim();
    if (!trimmed || busyRef.current) return;

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    const { signal } = ac;

    lineId.current = 0;
    setLines([]);
    setSpent(0);
    setUsedIds([]);
    setPhase("running");
    busyRef.current = true;

    let runSpent = 0;
    const runTools: string[] = [];

    const bump = (n: number) => {
      runSpent = Math.round((runSpent + n) * 1000) / 1000;
      setSpent(runSpent);
    };

    try {
      append({
        kind: "sys",
        kicker: "job",
        title: "Accepted.",
        body: trimmed,
      });
      await sleep(380, signal);

      append({
        kind: "req",
        kicker: "GET",
        title: "/api/v1/catalog",
        body: `q=${encodeURIComponent(trimmed.slice(0, 80))}`,
      });
      await sleep(280, signal);

      const result = await recommend({ data: { task: trimmed } });
      if (signal.aborted) return;
      if (!result.ok) {
        append({ kind: "err", kicker: "err", title: result.error });
        setPhase("idle");
        return;
      }

      const picks = result.picks;
      append({
        kind: "ok",
        kicker: "200",
        title: `${picks.length} tool${picks.length === 1 ? "" : "s"} · ${result.source === "model" ? "model match" : "index match"}`,
        body: picks.map((p) => getTool(p.id)?.name ?? p.id).join(" · ") || "none",
      });
      await sleep(420, signal);

      if (picks.length === 0) {
        append({ kind: "sys", kicker: "end", title: "No tools matched. Try a more specific job." });
        setPhase("done");
        return;
      }

      for (const pick of picks) {
        if (signal.aborted) return;
        const tool = getTool(pick.id);
        if (!tool) continue;

        append({
          kind: "sys",
          kicker: "pick",
          title: tool.name,
          body: pick.reason,
        });
        await sleep(360, signal);

        const already = useAisleStore.getState().installed.find((i) => i.toolId === tool.id);
        if (!already) {
          append({
            kind: "req",
            kicker: "POST",
            title: "/v1/checkout",
            body: `{ "tool": "${tool.id}", "agent": "${useAisleStore.getState().address}" }`,
          });
          await sleep(320, signal);
          const paid = await useAisleStore.getState().install(tool);
          if (!paid.ok) {
            append({
              kind: "err",
              kicker: "402",
              title: paid.reason === "busy" ? "Signer busy" : "Channel cannot cover this",
              body: `Need ${formatUsdc(tool.installPrice)} to install ${tool.name}. Faucet USDC and run again.`,
            });
            useAisleStore.getState().recordJob({
              task: trimmed,
              spent: runSpent,
              toolIds: runTools,
              status: "blocked",
            });
            setPhase("blocked");
            return;
          }
          if (paid.auth?.opened) {
            append({
              kind: "pay",
              kicker: "open",
              title: `Channel escrowed · ${formatUsdc(paid.auth.opened.ceiling)}`,
              body: paid.auth.opened.channelId,
            });
          }
          if (paid.auth?.topped) {
            append({
              kind: "pay",
              kicker: "top",
              title: `Channel topped up · ${formatUsdc(paid.auth.topped)}`,
            });
          }
          const key = useAisleStore.getState().installed.find((i) => i.toolId === tool.id)?.key;
          bump(tool.installPrice);
          append({
            kind: "pay",
            kicker: "200",
            title:
              tool.installPrice === 0
                ? `Checkout ${tool.name} · free`
                : `Voucher ${tool.name} · ${formatUsdc(-tool.installPrice)}`,
            body: paid.auth?.signature ? `${key ?? ""}\n${paid.auth.signature}` : key,
          });
        } else {
          append({
            kind: "ok",
            kicker: "204",
            title: `${tool.name} already installed`,
            body: already.key,
          });
        }
        await sleep(280, signal);

        append({
          kind: "req",
          kicker: "POST",
          title: `/v1/${tool.id}`,
          body: tool.sampleRequest,
        });
        await sleep(520, signal);

        const invoked = await useAisleStore.getState().run(tool.id);
        if (!invoked.ok) {
          append({
            kind: "err",
            kicker: invoked.reason === "missing" ? "404" : "402",
            title: invoked.reason === "missing" ? "Tool missing" : "Channel cannot cover this run",
          });
          useAisleStore.getState().recordJob({
            task: trimmed,
            spent: runSpent,
            toolIds: runTools,
            status: "blocked",
          });
          setPhase("blocked");
          return;
        }
        const charge = usageCharge(tool);
        bump(charge);
        runTools.push(tool.id);
        setUsedIds([...runTools]);
        append({
          kind: "ok",
          kicker: "200",
          title: charge > 0 ? `Invoke ${tool.name} · ${formatUsdc(-charge)}` : `Invoke ${tool.name} · free`,
          body: invoked.auth?.signature
            ? `${invoked.response}\n\nvoucher ${invoked.auth.signature}`
            : invoked.response,
        });
        await sleep(280, signal);
      }

      append({
        kind: "sys",
        kicker: "end",
        title: `Done. ${runTools.length} tool${runTools.length === 1 ? "" : "s"}. ${formatUsdc(runSpent)} authorized.`,
      });
      useAisleStore.getState().recordJob({
        task: trimmed,
        spent: runSpent,
        toolIds: runTools,
        status: "done",
      });
      setPhase("done");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      append({ kind: "err", kicker: "err", title: "Runner failed. Try again." });
      setPhase("idle");
    } finally {
      busyRef.current = false;
    }
  }

  function stop() {
    abortRef.current?.abort();
    setPhase("idle");
    append({ kind: "sys", kicker: "end", title: "Stopped." });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    void execute(task);
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-3">
        <Textarea
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Search the web for a filing, parse an invoice, fill a form — the agent shops."
          maxLength={500}
          aria-label="Job for the agent"
        />
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {DEMO_JOBS.map((job) => (
            <button
              key={job.id}
              type="button"
              onClick={() => {
                setTask(job.task);
              }}
              className={cn(
                "h-11 shrink-0 rounded-full px-4 text-sm text-muted shadow-[0_0_0_1px_var(--color-border)] transition-colors duration-150 hover:text-fg",
                task === job.task && "bg-accent text-accent-fg shadow-none",
              )}
            >
              {job.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-subtle">
            {address ? shortAddress(address) : "key…"}
            <span className="mx-2 text-border-strong">·</span>
            {phase === "running" ? (
              <span className="shimmer-text">shopping</span>
            ) : phase === "blocked" ? (
              <span className="text-danger">blocked</span>
            ) : phase === "done" ? (
              <span className="text-success">done</span>
            ) : (
              "idle"
            )}
            <span className="mx-2 text-border-strong">·</span>
            <span className="tabular-nums">{formatUsdc(headroom)}</span>
          </p>
          <div className="flex gap-2">
            {phase === "running" ? (
              <Button type="button" variant="secondary" onClick={stop}>
                <Square className="size-3.5" />
                Stop
              </Button>
            ) : (
              <Button type="submit" disabled={task.trim().length === 0}>
                Run agent
              </Button>
            )}
          </div>
        </div>
      </form>

      {phase === "blocked" ? (
        <div className="mt-4 rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]">
          <p className="text-sm text-fg">The channel cannot cover the next tool. Faucet USDC, then run again.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                void faucet().then((r) => {
                  if (!r.ok) toast(r.reason === "cap" ? "Faucet cap reached" : "Still signing");
                });
              }}
            >
              Faucet 25 USDC
            </Button>
            <Button type="button" size="sm" onClick={() => void execute(task)}>
              Resume
            </Button>
          </div>
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_18rem]">
        <div
          ref={logRef}
          className="max-h-[32rem] overflow-y-auto rounded-xl bg-surface-2 shadow-[var(--shadow-border)]"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface-2/95 px-4 py-2 backdrop-blur-sm">
            <p className="text-xs text-subtle">Transcript</p>
            <p className="font-mono text-xs tabular-nums text-muted">
              {formatUsdc(spent)} this run
            </p>
          </div>
          {lines.length === 0 ? (
            <div className="px-4 py-10">
              <p className="font-serif text-xl italic text-fg">Waiting for a job.</p>
              <p className="mt-2 max-w-md text-sm leading-normal text-muted">
                The agent will GET the catalog, open a USDC channel if it needs one, then sign a voucher per call.
              </p>
            </div>
          ) : (
            <ol className="divide-y divide-border">
              {lines.map((line) => (
                <li key={line.id} className="px-4 py-3">
                  <div className="flex gap-3">
                    <span
                      className={cn(
                        "w-10 shrink-0 pt-0.5 font-mono text-xs tabular-nums",
                        line.kind === "err"
                          ? "text-danger"
                          : line.kind === "pay" || line.kind === "ok"
                            ? "text-success"
                            : "text-subtle",
                      )}
                    >
                      {line.kicker}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs leading-relaxed text-fg">{line.title}</p>
                      {line.body ? (
                        <pre className="mt-2 overflow-x-auto font-mono text-xs leading-relaxed text-muted">
                          {line.body}
                        </pre>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
              {phase === "running" ? (
                <li className="flex items-center gap-3 px-4 py-3">
                  <span className="cursor-blink inline-block h-3.5 w-1.5 bg-accent" />
                  <span className="shimmer-text font-mono text-xs">working</span>
                </li>
              ) : null}
            </ol>
          )}
        </div>

        <aside className="h-fit rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <p className="text-xs tracking-widest text-muted uppercase">This run</p>
          <p className="mt-2 font-mono text-2xl tabular-nums text-fg">{formatUsdc(spent)}</p>
          <p className="mt-1 text-xs text-subtle">{usedIds.length} tools invoked</p>
          {usedIds.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Nothing invoked this run yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {usedIds.map((id) => {
                const tool = getTool(id);
                const row = installed.find((i) => i.toolId === id);
                if (!tool) return null;
                return (
                  <li key={id} className="flex items-center gap-3">
                    <ToolMark mark={tool.mark} className="size-9 text-sm" />
                    <div className="min-w-0">
                      <Link
                        to="/tools/$toolId"
                        params={{ toolId: tool.id }}
                        className="block truncate text-sm text-fg hover:underline"
                      >
                        {tool.name}
                      </Link>
                      {row ? (
                        <p className="truncate font-mono text-xs text-subtle">{row.key}</p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="mt-5 text-xs leading-normal text-subtle">
            Checkout and invoke sign the same Solana channel as the store. Keys persist on this device.
          </p>
        </aside>
      </div>

      {jobs.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-serif text-2xl italic text-fg">Recent jobs</h2>
          <ul className="mt-4 divide-y divide-border rounded-xl bg-surface shadow-[var(--shadow-border)]">
            {jobs.slice(0, 6).map((job) => (
              <li key={job.id}>
                <button
                  type="button"
                  className="flex w-full items-baseline justify-between gap-4 px-4 py-3 text-left hover:bg-surface-2"
                  onClick={() => {
                    setTask(job.task);
                    toast("Job loaded. Run when ready.");
                  }}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-fg">{job.task}</p>
                    <p className="mt-0.5 text-xs text-subtle">
                      {job.toolIds.length} tools
                      {job.status === "blocked" ? " · blocked" : ""}
                    </p>
                  </div>
                  <p className="shrink-0 font-mono text-xs tabular-nums text-muted">
                    {formatUsdc(job.spent)}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
