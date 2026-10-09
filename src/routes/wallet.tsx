import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { formatUsdc, formatWhen, shortAddress } from "@/lib/format";
import { CHANNEL_PRESETS, CHANNEL_PROGRAM, CLUSTER, FAUCET_USDC, USDC_MINT } from "@/lib/solana";
import { channelRemaining, useAisleStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/wallet")({
  component: WalletPage,
  head: () => ({ meta: [{ title: "Channel — Aisle" }] }),
});

function WalletPage() {
  const hydrated = useAisleStore((s) => s.hydrated);
  const address = useAisleStore((s) => s.address);
  const liquid = useAisleStore((s) => s.liquid);
  const channel = useAisleStore((s) => s.channel);
  const ledger = useAisleStore((s) => s.ledger);
  const last = useAisleStore((s) => s.lastSettlement);
  const faucet = useAisleStore((s) => s.faucet);
  const openChannel = useAisleStore((s) => s.openChannel);
  const topUp = useAisleStore((s) => s.topUp);
  const settle = useAisleStore((s) => s.settle);
  const [busy, setBusy] = useState<string | null>(null);
  const remaining = channelRemaining(channel);
  const used = channel ? channel.authorized / channel.ceiling : 0;

  async function onFaucet() {
    setBusy("faucet");
    const result = await faucet();
    setBusy(null);
    if (!result.ok) toast(result.reason === "cap" ? "Faucet cap reached" : "Still signing");
    else toast.success(`Faucet ${formatUsdc(result.amount)}`);
  }

  async function onOpen(amount: number) {
    setBusy(`open-${amount}`);
    const result = await openChannel(amount);
    setBusy(null);
    if (!result.ok) {
      toast(result.reason === "funds" ? "Not enough liquid USDC" : result.reason === "open" ? "Channel already open" : "Still signing");
      return;
    }
    toast.success(`Escrowed ${formatUsdc(result.ceiling)}`);
  }

  async function onTopUp(amount: number) {
    setBusy(`top-${amount}`);
    const result = await topUp(amount);
    setBusy(null);
    if (!result.ok) toast(result.reason === "funds" ? "Not enough liquid USDC" : "No open channel");
  }

  async function onSettle() {
    setBusy("settle");
    const result = await settle();
    setBusy(null);
    if (!result.ok) {
      toast("No open channel");
      return;
    }
    toast.success(`Settled · refund ${formatUsdc(result.settlement.refund)}`);
  }

  return (
    <div className="py-8 md:py-10">
      <p className="text-xs tracking-widest text-muted uppercase">Solana {CLUSTER.replace("solana:", "")}</p>
      <h1 className="mt-2 font-serif text-4xl italic leading-tight text-fg">Channel</h1>
      <p className="mt-2 max-w-xl text-muted">
        Deposit a USDC ceiling once. Each tool call signs a voucher. Settle once — publishers are paid, the rest comes back.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]">
          {!hydrated ? (
            <p className="text-sm text-muted">Preparing the agent key…</p>
          ) : channel ? (
            <>
              <p className="text-xs text-subtle">Headroom</p>
              <p className="mt-1 font-mono text-4xl tabular-nums tracking-tight text-fg">{formatUsdc(remaining)}</p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full bg-accent" style={{ width: `${Math.min(100, used * 100)}%` }} />
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <Stat label="Ceiling" value={formatUsdc(channel.ceiling)} />
                <Stat label="Authorized" value={formatUsdc(channel.authorized)} />
                <Stat label="Liquid" value={formatUsdc(liquid)} />
              </dl>
              <p className="mt-4 break-all font-mono text-xs text-subtle">{channel.id}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {CHANNEL_PRESETS.map((n) => (
                  <Button
                    key={n}
                    variant="secondary"
                    disabled={busy !== null || liquid + 1e-9 < n}
                    onClick={() => void onTopUp(n)}
                  >
                    Top up {n}
                  </Button>
                ))}
                <Button variant="secondary" disabled={busy !== null} onClick={() => void onFaucet()}>
                  Faucet {FAUCET_USDC}
                </Button>
                <Button disabled={busy !== null} onClick={() => void onSettle()}>
                  {busy === "settle" ? "Settling…" : "Settle & refund"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-subtle">Liquid · not yet escrowed</p>
              <p className="mt-1 font-mono text-4xl tabular-nums tracking-tight text-fg">{formatUsdc(liquid)}</p>
              <p className="mt-3 text-sm text-muted">Open a channel to pay for tools. The program holds the deposit, not Aisle.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {CHANNEL_PRESETS.map((n) => (
                  <Button
                    key={n}
                    variant={n === 10 ? "default" : "secondary"}
                    disabled={busy !== null || liquid + 1e-9 < n}
                    onClick={() => void onOpen(n)}
                  >
                    {busy === `open-${n}` ? "Opening…" : `Open ${n} USDC`}
                  </Button>
                ))}
                <Button variant="secondary" disabled={busy !== null} onClick={() => void onFaucet()}>
                  Faucet {FAUCET_USDC}
                </Button>
              </div>
            </>
          )}
        </section>

        <section className="rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]">
          <p className="text-xs text-subtle">Agent</p>
          <p className="mt-2 break-all font-mono text-sm text-fg">{address || "—"}</p>
          <button
            type="button"
            className="mt-2 inline-flex h-11 items-center text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
            onClick={() => {
              if (!address) return;
              void navigator.clipboard.writeText(address);
              toast("Address copied");
            }}
          >
            Copy address
          </button>
          <dl className="mt-6 space-y-3 text-sm">
            <Field label="Program" value={shortAddress(CHANNEL_PROGRAM)} full={CHANNEL_PROGRAM} />
            <Field label="USDC mint" value={shortAddress(USDC_MINT)} full={USDC_MINT} />
            <Field label="Cluster" value="devnet" />
          </dl>
          <p className="mt-6 text-xs leading-normal text-subtle">
            Vouchers are Ed25519 over the 50-byte payment-channels message. This preview settles locally so it runs without a funded wallet. The program id is the mainnet program.
          </p>
        </section>
      </div>

      {last ? (
        <section className="mt-4 rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]">
          <p className="text-xs tracking-widest text-muted uppercase">Last settlement</p>
          <p className="mt-2 font-mono text-xs text-subtle">{shortAddress(last.channelId)} · {formatWhen(last.at)}</p>
          {last.payouts.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Nothing was authorized. The ceiling came back.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {last.payouts.map((p) => (
                <li key={p.publisher} className="flex items-baseline justify-between gap-4 py-2 text-sm">
                  <span className="text-fg">{p.publisher}</span>
                  <span className="font-mono tabular-nums">{formatUsdc(p.amount)}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-sm text-muted">Refunded {formatUsdc(last.refund)} to the agent wallet.</p>
          {last.signature ? (
            <p className="mt-2 break-all font-mono text-xs text-subtle">{last.signature}</p>
          ) : null}
        </section>
      ) : null}

      <div className="mt-10 flex items-baseline justify-between gap-4">
        <h2 className="font-serif text-2xl italic">Vouchers</h2>
        <Link to="/protocol" className="text-sm text-muted underline-offset-4 hover:text-fg hover:underline">
          Protocol
        </Link>
      </div>
      {!channel || channel.vouchers.length === 0 ? (
        <p className="mt-3 text-sm text-muted">
          None on the open channel. Pay for a tool, or send the 402 from the protocol page.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border rounded-xl bg-surface shadow-[var(--shadow-border)]">
          {channel.vouchers.map((v) => (
            <li key={v.id} className="px-4 py-3">
              <div className="flex items-baseline justify-between gap-4">
                <p className="truncate text-sm text-fg">{v.label}</p>
                <p className="shrink-0 font-mono text-sm tabular-nums text-fg">−{formatUsdc(v.delta)}</p>
              </div>
              <p className="mt-1 truncate font-mono text-xs text-subtle">
                cum {formatUsdc(v.cumulative)} · {shortAddress(v.signature)} · {formatWhen(v.at)}
              </p>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-10 font-serif text-2xl italic">Cash</h2>
      {ledger.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No movements yet.</p>
      ) : (
        <ul className="mt-4 divide-y divide-border rounded-xl bg-surface shadow-[var(--shadow-border)]">
          {ledger.map((t) => (
            <li key={t.id} className="flex items-baseline justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm text-fg">{t.label}</p>
                <p className="text-xs text-subtle">
                  {formatWhen(t.at)} · {t.type === "open" || t.type === "topup" ? "escrowed" : t.type}
                </p>
              </div>
              <p className={`shrink-0 font-mono text-sm tabular-nums ${t.amount < 0 ? "text-fg" : "text-success"}`}>
                {t.amount > 0 ? "+" : ""}
                {formatUsdc(t.amount)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-subtle">{label}</dt>
      <dd className="mt-1 font-mono text-sm tabular-nums text-fg">{value}</dd>
    </div>
  );
}

function Field({ label, value, full }: { label: string; value: string; full?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="font-mono text-xs text-fg" title={full}>
        {value}
      </dd>
    </div>
  );
}
