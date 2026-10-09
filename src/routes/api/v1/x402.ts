import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getTool, usageCharge } from "@/lib/catalog";
import { CHANNEL_PROGRAM, CLUSTER, USDC_MINT, usdcToAtomic, verifyVoucher } from "@/lib/solana";

const Body = z.object({
  tool: z.string().optional(),
  payer: z.string().optional(),
  publicKey: z.string().optional(),
  voucher: z.string().optional(),
  signature: z.string().optional(),
});

function challenge(toolId: string, price: number) {
  return {
    x402Version: 2,
    error: "payment_required",
    accepts: [
      {
        scheme: "mpp",
        network: CLUSTER,
        asset: USDC_MINT,
        maxAmountRequired: usdcToAtomic(price).toString(),
        extra: {
          program: CHANNEL_PROGRAM,
          session: "channel",
          voucher: {
            bytes: 50,
            magic: "5601",
            channelId: "32 bytes",
            cumulative: "u64-le",
            expiresAt: "i64-le",
          },
          tool: toolId,
        },
      },
    ],
  };
}

export const Route = createFileRoute("/api/v1/x402")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let raw: unknown = {};
        try {
          raw = await request.json();
        } catch {
          raw = {};
        }
        const parsed = Body.safeParse(raw);
        const body = parsed.success ? parsed.data : {};
        const tool = getTool(body.tool || "north");
        if (!tool) return Response.json({ ok: false, error: "not_found" }, { status: 404 });
        const price = usageCharge(tool) || tool.installPrice || 0.001;

        const hasPayment = Boolean(body.payer && body.publicKey && body.voucher && body.signature);
        if (!hasPayment) {
          return Response.json(challenge(tool.id, price), {
            status: 402,
            headers: { "PAYMENT-REQUIRED": "mpp; network=solana:devnet", "cache-control": "no-store" },
          });
        }

        const verified = await verifyVoucher({
          payer: body.payer ?? "",
          publicKey: body.publicKey ?? "",
          voucher: body.voucher ?? "",
          signature: body.signature ?? "",
        });
        if (!verified.ok) {
          return Response.json(
            { ...challenge(tool.id, price), error: verified.error },
            { status: 402, headers: { "PAYMENT-REQUIRED": "mpp; network=solana:devnet" } },
          );
        }

        const cumulativeUsdc = Number(verified.cumulativeAtomic) / 1_000_000;
        return Response.json({
          ok: true,
          verified: true,
          scheme: "mpp",
          network: CLUSTER,
          program: CHANNEL_PROGRAM,
          payer: body.payer,
          channel: verified.channel,
          cumulativeAtomic: verified.cumulativeAtomic.toString(),
          cumulativeUsdc,
          tool: tool.id,
          body: tool.sampleResponse,
        });
      },
    },
  },
});
