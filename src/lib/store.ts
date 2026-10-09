import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getTool, usageCharge, type Tool } from "@/lib/catalog";
import {
  base58Decode,
  base58Encode,
  bytesToB64,
  encodeVoucher,
  FAUCET_CAP,
  FAUCET_USDC,
  generateAgentKeys,
  signMessage,
  SUGGESTED_CEILING,
  usdcToAtomic,
} from "@/lib/solana";

export type Installed = {
  toolId: string;
  key: string;
  paid: number;
  installedAt: number;
  runs: number;
};

export type VoucherRecord = {
  id: string;
  toolId?: string;
  publisher: string;
  label: string;
  delta: number;
  cumulative: number;
  signature: string;
  at: number;
};

export type Channel = {
  id: string;
  status: "open";
  ceiling: number;
  authorized: number;
  openedAt: number;
  vouchers: VoucherRecord[];
};

export type LedgerLine = {
  id: string;
  type: "faucet" | "open" | "topup" | "refund";
  label: string;
  amount: number;
  at: number;
};

export type Payout = { publisher: string; amount: number };

export type Settlement = {
  at: number;
  channelId: string;
  ceiling: number;
  authorized: number;
  refund: number;
  payouts: Payout[];
  signature: string;
  voucherCount: number;
};

export type JobRecord = {
  id: string;
  task: string;
  at: number;
  spent: number;
  toolIds: string[];
  status: "done" | "blocked";
};

export type AuthOk = {
  ok: true;
  signature: string;
  signatureB64: string;
  voucherB64: string;
  publicKey: string;
  payer: string;
  channelId: string;
  cumulative: number;
  opened?: { ceiling: number; channelId: string };
  topped?: number;
};

export type AuthFail = { ok: false; reason: "funds" | "channel" | "busy" | "zero" };

export type CoverPlan =
  | { kind: "none" }
  | { kind: "ready" }
  | { kind: "open"; ceiling: number }
  | { kind: "topup"; amount: number }
  | { kind: "short" };

type AisleState = {
  hydrated: boolean;
  signing: boolean;
  address: string;
  publicKey: string;
  privateKeyPkcs8: string;
  liquid: number;
  channel: Channel | null;
  lastSettlement: Settlement | null;
  installed: Installed[];
  ledger: LedgerLine[];
  jobs: JobRecord[];
  markHydrated: () => void;
  faucet: () => Promise<{ ok: true; amount: number } | { ok: false; reason: "cap" | "busy" }>;
  openChannel: (
    ceiling: number,
  ) => Promise<{ ok: true; channelId: string; ceiling: number } | { ok: false; reason: "funds" | "open" | "busy" }>;
  topUp: (amount: number) => Promise<{ ok: true } | { ok: false; reason: "funds" | "none" | "busy" }>;
  settle: () => Promise<{ ok: true; settlement: Settlement } | { ok: false; reason: "none" | "busy" }>;
  authorize: (input: { amount: number; label: string; publisher: string; toolId?: string }) => Promise<AuthOk | AuthFail>;
  install: (tool: Tool) => Promise<{ ok: true; auth: AuthOk | null } | { ok: false; reason: "funds" | "channel" | "busy" | "already" }>;
  uninstall: (toolId: string) => void;
  run: (
    toolId: string,
  ) => Promise<
    { ok: true; response: string; auth: AuthOk | null } | { ok: false; reason: "missing" | "funds" | "channel" | "busy" }
  >;
  recordJob: (job: Omit<JobRecord, "id" | "at">) => void;
};

function round6(n: number): number {
  return Math.round(n * 1_000_000) / 1_000_000;
}

function rid(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function mintKey(toolId: string): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `aisle_live_${toolId}_${hex}`;
}

export function channelRemaining(channel: Channel | null): number {
  if (!channel || channel.status !== "open") return 0;
  return Math.max(0, round6(channel.ceiling - channel.authorized));
}

export function coverPlan(liquid: number, channel: Channel | null, amount: number): CoverPlan {
  if (amount <= 0) return { kind: "none" };
  if (channel?.status === "open") {
    const left = channelRemaining(channel);
    if (left + 1e-9 >= amount) return { kind: "ready" };
    const gap = round6(amount - left);
    if (liquid + 1e-9 >= gap) return { kind: "topup", amount: gap };
    return { kind: "short" };
  }
  if (liquid + 1e-9 >= amount) {
    const ceiling = round6(Math.min(liquid, Math.max(amount, SUGGESTED_CEILING)));
    return { kind: "open", ceiling };
  }
  return { kind: "short" };
}

export function spendableOf(liquid: number, channel: Channel | null): { amount: number; kind: "channel" | "liquid" } {
  if (channel?.status === "open") return { amount: channelRemaining(channel), kind: "channel" };
  return { amount: liquid, kind: "liquid" };
}

export const useAisleStore = create<AisleState>()(
  persist(
    (set, get) => {
      async function withLock<T extends { ok: boolean }>(
        fn: () => Promise<T>,
      ): Promise<T | { ok: false; reason: "busy" }> {
        if (get().signing) return { ok: false, reason: "busy" };
        set({ signing: true });
        try {
          return await fn();
        } finally {
          set({ signing: false });
        }
      }

      function openUnlocked(
        ceiling: number,
      ): { ok: true; channelId: string; ceiling: number } | { ok: false; reason: "funds" | "open" } {
        const s = get();
        if (s.channel?.status === "open") return { ok: false, reason: "open" };
        const amount = round6(ceiling);
        if (!(amount > 0) || s.liquid + 1e-9 < amount) return { ok: false, reason: "funds" };
        const idBytes = new Uint8Array(32);
        crypto.getRandomValues(idBytes);
        const channelId = base58Encode(idBytes);
        const at = Date.now();
        const channel: Channel = {
          id: channelId,
          status: "open",
          ceiling: amount,
          authorized: 0,
          openedAt: at,
          vouchers: [],
        };
        const line: LedgerLine = { id: rid(), type: "open", label: "Open channel", amount: -amount, at };
        set({
          liquid: round6(s.liquid - amount),
          channel,
          ledger: [line, ...s.ledger].slice(0, 80),
        });
        return { ok: true, channelId, ceiling: amount };
      }

      function topUpUnlocked(amount: number): { ok: true } | { ok: false; reason: "funds" | "none" } {
        const s = get();
        const channel = s.channel;
        if (!channel || channel.status !== "open") return { ok: false, reason: "none" };
        const n = round6(amount);
        if (!(n > 0) || s.liquid + 1e-9 < n) return { ok: false, reason: "funds" };
        const at = Date.now();
        const line: LedgerLine = { id: rid(), type: "topup", label: "Top up channel", amount: -n, at };
        set({
          liquid: round6(s.liquid - n),
          channel: { ...channel, ceiling: round6(channel.ceiling + n) },
          ledger: [line, ...s.ledger].slice(0, 80),
        });
        return { ok: true };
      }

      async function spendUnlocked(input: {
        amount: number;
        label: string;
        publisher: string;
        toolId?: string;
      }): Promise<AuthOk | AuthFail> {
        if (!(input.amount > 0)) return { ok: false, reason: "zero" };
        const plan = coverPlan(get().liquid, get().channel, input.amount);
        if (plan.kind === "short" || plan.kind === "none") return { ok: false, reason: "funds" };

        let opened: { ceiling: number; channelId: string } | undefined;
        let topped: number | undefined;
        if (plan.kind === "open") {
          const openedResult = openUnlocked(plan.ceiling);
          if (!openedResult.ok) return { ok: false, reason: "funds" };
          opened = { ceiling: openedResult.ceiling, channelId: openedResult.channelId };
        } else if (plan.kind === "topup") {
          const toppedResult = topUpUnlocked(plan.amount);
          if (!toppedResult.ok) return { ok: false, reason: "funds" };
          topped = plan.amount;
        }

        const s = get();
        const channel = s.channel;
        if (!channel || channel.status !== "open" || !s.privateKeyPkcs8) {
          return { ok: false, reason: "channel" };
        }
        const next = round6(channel.authorized + input.amount);
        if (next - channel.ceiling > 1e-8) return { ok: false, reason: "funds" };
        const channelBytes = base58Decode(channel.id);
        if (channelBytes.length !== 32) return { ok: false, reason: "channel" };
        const message = encodeVoucher(channelBytes, usdcToAtomic(next), 0n);
        const sig = await signMessage(s.privateKeyPkcs8, message);
        const signature = base58Encode(sig);
        const at = Date.now();
        const voucher: VoucherRecord = {
          id: rid(),
          toolId: input.toolId,
          publisher: input.publisher,
          label: input.label,
          delta: input.amount,
          cumulative: next,
          signature,
          at,
        };
        const cur = get().channel;
        if (!cur || cur.id !== channel.id) return { ok: false, reason: "channel" };
        set({
          channel: {
            ...cur,
            authorized: next,
            vouchers: [voucher, ...cur.vouchers].slice(0, 40),
          },
        });
        return {
          ok: true,
          signature,
          signatureB64: bytesToB64(sig),
          voucherB64: bytesToB64(message),
          publicKey: s.publicKey,
          payer: s.address,
          channelId: channel.id,
          cumulative: next,
          opened,
          topped,
        };
      }

      return {
        hydrated: false,
        signing: false,
        address: "",
        publicKey: "",
        privateKeyPkcs8: "",
        liquid: 0,
        channel: null,
        lastSettlement: null,
        installed: [],
        ledger: [],
        jobs: [],
        markHydrated: () => {
          const s = get();
          if (s.address && s.privateKeyPkcs8 && s.publicKey) {
            set({ hydrated: true });
            return;
          }
          void generateAgentKeys().then((keys) => {
            if (get().address && get().privateKeyPkcs8) {
              set({ hydrated: true });
              return;
            }
            const at = Date.now();
            const line: LedgerLine = { id: rid(), type: "faucet", label: "Devnet faucet", amount: FAUCET_USDC, at };
            set({
              hydrated: true,
              address: keys.address,
              publicKey: keys.publicKey,
              privateKeyPkcs8: keys.privateKeyPkcs8,
              liquid: FAUCET_USDC,
              ledger: [line],
            });
          });
        },
        faucet: () =>
          withLock(async () => {
            const s = get();
            const escrow = s.channel?.status === "open" ? s.channel.ceiling : 0;
            if (s.liquid + escrow >= FAUCET_CAP) return { ok: false as const, reason: "cap" as const };
            const at = Date.now();
            const line: LedgerLine = { id: rid(), type: "faucet", label: "Devnet faucet", amount: FAUCET_USDC, at };
            set({
              liquid: round6(s.liquid + FAUCET_USDC),
              ledger: [line, ...s.ledger].slice(0, 80),
            });
            return { ok: true as const, amount: FAUCET_USDC };
          }),
        openChannel: (ceiling) => withLock(async () => openUnlocked(ceiling)),
        topUp: (amount) => withLock(async () => topUpUnlocked(amount)),
        settle: () =>
          withLock(async () => {
            const s = get();
            const channel = s.channel;
            if (!channel || channel.status !== "open") return { ok: false as const, reason: "none" as const };
            const owed = new Map<string, number>();
            for (const v of channel.vouchers) {
              owed.set(v.publisher, round6((owed.get(v.publisher) ?? 0) + v.delta));
            }
            const payouts = [...owed.entries()]
              .map(([publisher, amount]) => ({ publisher, amount }))
              .filter((p) => p.amount > 0);
            const refund = Math.max(0, round6(channel.ceiling - channel.authorized));
            let signature = "";
            if (s.privateKeyPkcs8) {
              const msg = new TextEncoder().encode(
                `aisle.settle.v1|${channel.id}|${usdcToAtomic(channel.authorized).toString()}`,
              );
              signature = base58Encode(await signMessage(s.privateKeyPkcs8, msg));
            }
            const at = Date.now();
            const settlement: Settlement = {
              at,
              channelId: channel.id,
              ceiling: channel.ceiling,
              authorized: channel.authorized,
              refund,
              payouts,
              signature,
              voucherCount: channel.vouchers.length,
            };
            const ledger = get().ledger;
            set({
              liquid: round6(get().liquid + refund),
              channel: null,
              lastSettlement: settlement,
              ledger:
                refund > 0
                  ? [{ id: rid(), type: "refund" as const, label: "Refund unused USDC", amount: refund, at }, ...ledger].slice(0, 80)
                  : ledger,
            });
            return { ok: true as const, settlement };
          }),
        authorize: (input) => withLock(() => spendUnlocked(input)),
        install: (tool) =>
          withLock(async () => {
            if (get().installed.some((i) => i.toolId === tool.id)) {
              return { ok: false as const, reason: "already" as const };
            }
            let auth: AuthOk | null = null;
            if (tool.installPrice > 0) {
              const spent = await spendUnlocked({
                amount: tool.installPrice,
                label: `Install ${tool.name}`,
                publisher: tool.publisher,
                toolId: tool.id,
              });
              if (!spent.ok) {
                return {
                  ok: false as const,
                  reason:
                    spent.reason === "channel" ? ("channel" as const) : spent.reason === "busy" ? ("busy" as const) : ("funds" as const),
                };
              }
              auth = spent;
            }
            const row: Installed = {
              toolId: tool.id,
              key: mintKey(tool.id),
              paid: tool.installPrice,
              installedAt: Date.now(),
              runs: 0,
            };
            set({ installed: [row, ...get().installed] });
            return { ok: true as const, auth };
          }),
        uninstall: (toolId) => {
          set({ installed: get().installed.filter((i) => i.toolId !== toolId) });
        },
        run: (toolId) =>
          withLock(async () => {
            const row = get().installed.find((i) => i.toolId === toolId);
            const tool = getTool(toolId);
            if (!row || !tool) return { ok: false as const, reason: "missing" as const };
            const charge = usageCharge(tool);
            let auth: AuthOk | null = null;
            if (charge > 0) {
              const spent = await spendUnlocked({
                amount: charge,
                label: `Run ${tool.name}`,
                publisher: tool.publisher,
                toolId: tool.id,
              });
              if (!spent.ok) {
                return {
                  ok: false as const,
                  reason:
                    spent.reason === "channel" ? ("channel" as const) : spent.reason === "busy" ? ("busy" as const) : ("funds" as const),
                };
              }
              auth = spent;
            }
            set({
              installed: get().installed.map((i) => (i.toolId === toolId ? { ...i, runs: i.runs + 1 } : i)),
            });
            return { ok: true as const, response: tool.sampleResponse, auth };
          }),
        recordJob: (job) => {
          const row: JobRecord = { ...job, id: rid(), at: Date.now() };
          set({ jobs: [row, ...get().jobs].slice(0, 12) });
        },
      };
    },
    {
      name: "aisle.solana.v1",
      partialize: (s) => ({
        address: s.address,
        publicKey: s.publicKey,
        privateKeyPkcs8: s.privateKeyPkcs8,
        liquid: s.liquid,
        channel: s.channel,
        lastSettlement: s.lastSettlement,
        installed: s.installed,
        ledger: s.ledger,
        jobs: s.jobs,
      }),
      skipHydration: true,
    },
  ),
);

export function useInstalled(toolId: string): Installed | undefined {
  return useAisleStore((s) => s.installed.find((i) => i.toolId === toolId));
}
