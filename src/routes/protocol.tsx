import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { catalogSummary, getTool, searchTools, usageCharge } from "@/lib/catalog";
import { formatUsdc, shortAddress } from "@/lib/format";
import { useAisleStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/protocol")({
  component: ProtocolPage,
  head: () => ({ meta: [{ title: "Protocol — Aisle" }] }),
});

function ProtocolPage() {
  const [q, setQ] = useState("search");
  const [submitted, setSubmitted] = useState("search");

  const payload = useMemo(() => {
    const tools = searchTools(submitted).slice(0, 6).map((t) => ({
      id: t.id,
      name: t.name,
      tagline: t.tagline,
      category: t.category,
      install: t.installPrice,
      pricing: t.pricing,
      capabilities: t.capabilities,
    }));
    return {
      ok: true,
      query: submitted,
      count: tools.length,
      tools,
    };
  }, [submitted]);

  const north = getTool("north");

  return (
    <div className="py-8 md:py-10">
      <p className="text-xs tracking-widest text-muted uppercase">Machine interface</p>
      <h1 className="mt-2 font-serif text-4xl italic leading-tight text-fg">Protocol</h1>
      <p className="mt-3 max-w-2xl text-base leading-normal text-muted">
        Agents do not fill forms. They query the catalog, open a Solana USDC channel, and attach a voucher to the call.
      </p>

      <div className="mt-6 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:flex sm:items-center sm:justify-between sm:gap-8">
        <p className="text-sm leading-normal text-muted">
          The runner is this protocol, live. Watch an agent find, pay, and run against the same wallet.
        </p>
        <Button asChild className="mt-4 sm:mt-0 shrink-0">
          <Link to="/run">
            Open the runner
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <ol className="mt-10 grid gap-4 sm:grid-cols-2">
        <Step n="01" title="Find" body="GET the public catalog. No key, no account." />
        <Step n="02" title="Open" body="Deposit a USDC ceiling into the payment-channels program. Escrow, not Aisle." />
        <Step n="03" title="Meter" body="Each call is a 50-byte Ed25519 voucher. Cumulative. No transaction." />
        <Step n="04" title="Settle" body="One settlement pays publishers and returns whatever the agent did not spend." />
      </ol>

      <X402Probe />

      <h2 className="mt-12 font-serif text-2xl italic">Catalog</h2>
      <p className="mt-2 text-sm text-muted">
        Public. {catalogSummary().length} tools. Filter with <code className="font-mono text-fg">q</code> and{" "}
        <code className="font-mono text-fg">category</code>.
      </p>

      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(q.trim());
        }}
      >
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Catalog query"
          className="font-mono"
        />
        <Button type="submit">GET</Button>
      </form>
      <p className="mt-2 font-mono text-xs text-subtle">GET /api/v1/catalog?q={submitted || "…"}</p>
      <pre className="mt-3 max-h-80 overflow-auto rounded-xl bg-surface-2 p-4 font-mono text-xs leading-relaxed text-fg/90 shadow-[var(--shadow-border)]">
        {JSON.stringify(payload, null, 2)}
      </pre>
      <p className="mt-2 text-xs text-subtle">
        The same payload is served at{" "}
        <a className="text-muted underline-offset-4 hover:text-fg hover:underline" href={`/api/v1/catalog?q=${encodeURIComponent(submitted)}`}>
          /api/v1/catalog
        </a>
        .
      </p>

      <h2 className="mt-12 font-serif text-2xl italic">Invoke</h2>
      {north ? (
        <pre className="mt-3 overflow-auto rounded-xl bg-surface-2 p-4 font-mono text-xs leading-relaxed text-fg/90 shadow-[var(--shadow-border)]">{`POST https://run.aisle.dev/v1/north
Authorization: Bearer aisle_live_north_…
${north.sampleRequest}`}</pre>
      ) : null}

      <p className="mt-8 text-sm text-muted">
        Start in the{" "}
        <Link to="/" className="text-fg underline-offset-4 hover:underline">
          store
        </Link>
        , or{" "}
        <Link to="/run" className="text-fg underline-offset-4 hover:underline">
          run a job
        </Link>
        . Pay for North, or send the 402 above. Then settle the channel.
      </p>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
      <p className="font-mono text-xs tabular-nums text-subtle">{n}</p>
      <h3 className="mt-2 font-serif text-xl italic text-fg">{title}</h3>
      <p className="mt-1 text-sm leading-normal text-muted">{body}</p>
    </li>
  );
}

function X402Probe() {
  const authorize = useAisleStore((s) => s.authorize);
  const channel = useAisleStore((s) => s.channel);
  const [status, setStatus] = useState<number | null>(null);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState<"ask" | "pay" | null>(null);
  const north = getTool("north");
  const price = north ? usageCharge(north) : 0;

  async function ask() {
    setBusy("ask");
    try {
      const res = await fetch("/api/v1/x402", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tool: "north" }),
      });
      const json = await res.json();
      setStatus(res.status);
      setBody(JSON.stringify(json, null, 2));
    } catch {
      toast("Could not reach the pay gate");
    } finally {
      setBusy(null);
    }
  }

  async function pay() {
    if (!north) return;
    setBusy("pay");
    try {
      const auth = await authorize({
        amount: price,
        label: "x402 North",
        publisher: north.publisher,
        toolId: north.id,
      });
      if (!auth.ok) {
        toast(auth.reason === "busy" ? "Still signing" : "Need USDC. Open a channel from the wallet, or faucet more.");
        setBusy(null);
        return;
      }
      const res = await fetch("/api/v1/x402", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "payment-signature": auth.signature,
        },
        body: JSON.stringify({
          tool: "north",
          payer: auth.payer,
          publicKey: auth.publicKey,
          voucher: auth.voucherB64,
          signature: auth.signatureB64,
        }),
      });
      const json = await res.json();
      setStatus(res.status);
      setBody(JSON.stringify(json, null, 2));
    } catch {
      toast("Payment retry failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="mt-8 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
      <p className="text-xs tracking-widest text-muted uppercase">x402 gate</p>
      <h2 className="mt-2 font-serif text-2xl italic text-fg">North, without an account</h2>
      <p className="mt-2 max-w-2xl text-sm leading-normal text-muted">
        A call with no voucher returns 402. The retry carries an MPP session voucher — the channel’s new cumulative total, not a fresh transaction. North is {formatUsdc(price)} per query.
        {channel ? ` Open channel ${shortAddress(channel.id)}.` : " No channel yet — signing will open one."}
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button type="button" variant="secondary" disabled={busy !== null} onClick={() => void ask()}>
          {busy === "ask" ? "Requesting…" : "Request without paying"}
        </Button>
        <Button type="button" disabled={busy !== null} onClick={() => void pay()}>
          {busy === "pay" ? "Signing…" : "Sign voucher & retry"}
        </Button>
      </div>
      {status !== null ? (
        <div className="mt-4">
          <p className={`font-mono text-xs ${status === 200 ? "text-success" : "text-danger"}`}>{status}</p>
          <pre className="mt-2 max-h-80 overflow-auto font-mono text-xs leading-relaxed text-fg/90">{body}</pre>
        </div>
      ) : (
        <p className="mt-4 font-mono text-xs text-subtle">POST /api/v1/x402</p>
      )}
    </section>
  );
}
