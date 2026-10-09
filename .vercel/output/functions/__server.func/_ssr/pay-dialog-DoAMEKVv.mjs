import { i as __toESM } from "../_runtime.mjs";
import { f as shortAddress, s as formatUsdc, u as pricingLine } from "./catalog-CiQ-Tjo_.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as X } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay$1, c as DialogTrigger$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as channelRemaining, o as coverPlan, p as cn, s as useAisleStore } from "./router-Bj9pAB_N.mjs";
import { t as Button } from "./button-CyH6reGX.mjs";
import { t as ToolMark } from "./tool-mark-CYOu3VTX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pay-dialog-DoAMEKVv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
var DialogTrigger = DialogTrigger$1;
var DialogPortal = DialogPortal$1;
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-50 bg-bg/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface p-5 shadow-[0_0_0_1px_var(--color-border),0_24px_48px_-16px_rgb(0_0_0_/_0.5)] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 rounded-sm p-2 text-muted transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5 pr-8", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-serif text-xl leading-snug text-fg", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm leading-normal text-muted", className),
		...props
	});
}
function DialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tracking-wide", {
	variants: { variant: {
		default: "bg-surface-2 text-muted shadow-[0_0_0_1px_var(--color-border)]",
		accent: "bg-accent/15 text-accent",
		success: "bg-success/15 text-success",
		danger: "bg-danger/15 text-danger"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function PayDialog({ tool, open, onOpenChange }) {
	const liquid = useAisleStore((s) => s.liquid);
	const channel = useAisleStore((s) => s.channel);
	const install = useAisleStore((s) => s.install);
	const faucet = useAisleStore((s) => s.faucet);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const plan = coverPlan(liquid, channel, tool.installPrice);
	const remaining = channelRemaining(channel);
	const after = plan.kind === "ready" ? remaining - tool.installPrice : plan.kind === "open" ? plan.ceiling - tool.installPrice : plan.kind === "topup" ? remaining + plan.amount - tool.installPrice : null;
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
		toast.success(tool.installPrice === 0 ? `Installed ${tool.name}` : `Voucher signed · ${tool.name}`, { description: result.auth?.signature ? shortAddress(result.auth.signature) : "Capability key is ready." });
		onOpenChange(false);
	}
	const action = tool.installPrice === 0 ? "Install" : plan.kind === "open" ? `Open ${formatUsdc(plan.ceiling)} & pay` : plan.kind === "topup" ? "Top up & pay" : plan.kind === "ready" ? `Sign ${formatUsdc(tool.installPrice)}` : "Need USDC";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolMark, { mark: tool.mark })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: tool.installPrice === 0 ? `Install ${tool.name}` : `Pay for ${tool.name}` }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: tool.installPrice === 0 ? "Free to install. You receive a capability key immediately." : "A cumulative Ed25519 voucher against the Solana USDC channel. No account, no OAuth." })
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-4 space-y-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Usage",
						value: pricingLine(tool.pricing)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: tool.pricing.kind === "monthly" ? "This month" : tool.pricing.kind === "one-time" ? "License" : "This voucher",
						value: formatUsdc(tool.installPrice)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: channel ? "Channel left" : "Liquid",
						value: formatUsdc(channel ? remaining : liquid)
					}),
					after !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Headroom after",
						value: formatUsdc(Math.max(0, after))
					}) : null,
					channel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Channel",
						value: shortAddress(channel.id)
					}) : null
				]
			}),
			plan.kind === "short" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-md bg-surface-2 p-3 text-sm text-muted shadow-[0_0_0_1px_var(--color-border)]",
				children: [
					"Need ",
					formatUsdc(tool.installPrice),
					" of headroom. Liquid is ",
					formatUsdc(liquid),
					".",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: "secondary",
							onClick: () => {
								faucet().then((r) => {
									if (!r.ok) toast(r.reason === "cap" ? "Faucet cap reached" : "Still signing");
								});
							},
							children: [
								"Faucet ",
								25,
								" USDC"
							]
						})
					})
				]
			}) : null,
			plan.kind === "open" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-xs leading-normal text-subtle",
				children: [
					"Opens a channel and escrows ",
					formatUsdc(plan.ceiling),
					" with the payment-channels program, then signs the voucher."
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "ghost",
				onClick: () => onOpenChange(false),
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				onClick: () => void confirm(),
				disabled: busy || plan.kind === "short",
				children: busy ? "Signing…" : action
			})] })
		] })
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "font-mono tabular-nums text-fg",
			children: value
		})]
	});
}
//#endregion
export { DialogHeader as a, PayDialog as c, DialogDescription as i, Dialog as n, DialogTitle as o, DialogContent as r, DialogTrigger as s, Badge as t };
