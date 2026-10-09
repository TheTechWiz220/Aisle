import { useState } from "react";
import { toast } from "sonner";
import { type Tool, pricingLine } from "@/lib/catalog";
import { formatUsdc, shortAddress } from "@/lib/format";
import { FAUCET_USDC } from "@/lib/solana";
import { channelRemaining, coverPlan, useAisleStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ToolMark } from "@/components/tool-mark";

export function PayDialog({
  tool,
  open,
  onOpenChange,
}: {
  tool: Tool;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const liquid = useAisleStore((s) => s.liquid);
  const channel = useAisleStore((s) => s.channel);
  const install = useAisleStore((s) => s.install);
  const faucet = useAisleStore((s) => s.faucet);
  const [busy, setBusy] = useState(false);
  const plan = coverPlan(liquid, channel, tool.installPrice);
  const remaining = channelRemaining(channel);
  const after =
    plan.kind === "ready"
      ? remaining - tool.installPrice
      : plan.kind === "open"
        ? plan.ceiling - tool.installPrice
        : plan.kind === "topup"
          ? remaining + plan.amount - tool.installPrice
          : null;

  async function confirm() {
    setBusy(true);
    const result = await install(tool);
    setBusy(false);
    if (!result.ok) {
      if (result.reason === "already") {
        toast("Already installed");
        onOpenChange(false);
        return;
      }
      toast(result.reason === "busy" ? "Still signing" : "Not enough USDC in the channel");
      return;
    }
    toast.success(tool.installPrice === 0 ? `Installed ${tool.name}` : `Voucher signed · ${tool.name}`, {
      description:
        result.auth?.signature
          ? shortAddress(result.auth.signature)
          : "Capability key is ready.",
    });
    onOpenChange(false);
  }

  const action =
    tool.installPrice === 0
      ? "Install"
      : plan.kind === "open"
        ? `Open ${formatUsdc(plan.ceiling)} & pay`
        : plan.kind === "topup"
          ? "Top up & pay"
          : plan.kind === "ready"
            ? `Sign ${formatUsdc(tool.installPrice)}`
            : "Need USDC";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="mb-3">
            <ToolMark mark={tool.mark} />
          </div>
          <DialogTitle>
            {tool.installPrice === 0 ? `Install ${tool.name}` : `Pay for ${tool.name}`}
          </DialogTitle>
          <DialogDescription>
            {tool.installPrice === 0
              ? "Free to install. You receive a capability key immediately."
              : "A cumulative Ed25519 voucher against the Solana USDC channel. No account, no OAuth."}
          </DialogDescription>
        </DialogHeader>

        <dl className="mt-4 space-y-2 text-sm">
          <Row label="Usage" value={pricingLine(tool.pricing)} />
          <Row
            label={tool.pricing.kind === "monthly" ? "This month" : tool.pricing.kind === "one-time" ? "License" : "This voucher"}
            value={formatUsdc(tool.installPrice)}
          />
          <Row
            label={channel ? "Channel left" : "Liquid"}
            value={formatUsdc(channel ? remaining : liquid)}
          />
          {after !== null ? <Row label="Headroom after" value={formatUsdc(Math.max(0, after))} /> : null}
          {channel ? <Row label="Channel" value={shortAddress(channel.id)} /> : null}
        </dl>

        {plan.kind === "short" ? (
          <div className="mt-4 rounded-md bg-surface-2 p-3 text-sm text-muted shadow-[0_0_0_1px_var(--color-border)]">
            Need {formatUsdc(tool.installPrice)} of headroom. Liquid is {formatUsdc(liquid)}.
            <div className="mt-3">
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
                Faucet {FAUCET_USDC} USDC
              </Button>
            </div>
          </div>
        ) : null}

        {plan.kind === "open" ? (
          <p className="mt-4 text-xs leading-normal text-subtle">
            Opens a channel and escrows {formatUsdc(plan.ceiling)} with the payment-channels program, then signs the voucher.
          </p>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={() => void confirm()} disabled={busy || plan.kind === "short"}>
            {busy ? "Signing…" : action}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="font-mono tabular-nums text-fg">{value}</dd>
    </div>
  );
}
