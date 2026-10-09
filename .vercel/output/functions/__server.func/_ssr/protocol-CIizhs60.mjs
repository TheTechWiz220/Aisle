import { i as __toESM } from "../_runtime.mjs";
import { d as searchTools, f as shortAddress, l as getTool, p as usageCharge, r as catalogSummary, s as formatUsdc } from "./catalog-CiQ-Tjo_.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { p as ArrowRight } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as useAisleStore } from "./router-Bj9pAB_N.mjs";
import { t as Button } from "./button-CyH6reGX.mjs";
import { t as Input } from "./input-ChTJn5j6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/protocol-CIizhs60.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProtocolPage() {
	const [q, setQ] = (0, import_react.useState)("search");
	const [submitted, setSubmitted] = (0, import_react.useState)("search");
	const payload = (0, import_react.useMemo)(() => {
		const tools = searchTools(submitted).slice(0, 6).map((t) => ({
			id: t.id,
			name: t.name,
			tagline: t.tagline,
			category: t.category,
			install: t.installPrice,
			pricing: t.pricing,
			capabilities: t.capabilities
		}));
		return {
			ok: true,
			query: submitted,
			count: tools.length,
			tools
		};
	}, [submitted]);
	const north = getTool("north");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-8 md:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-widest text-muted uppercase",
				children: "Machine interface"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-serif text-4xl italic leading-tight text-fg",
				children: "Protocol"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-base leading-normal text-muted",
				children: "Agents do not fill forms. They query the catalog, open a Solana USDC channel, and attach a voucher to the call."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:flex sm:items-center sm:justify-between sm:gap-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-normal text-muted",
					children: "The runner is this protocol, live. Watch an agent find, pay, and run against the same wallet."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-4 sm:mt-0 shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/run",
						children: ["Open the runner", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "mt-10 grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
						n: "01",
						title: "Find",
						body: "GET the public catalog. No key, no account."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
						n: "02",
						title: "Open",
						body: "Deposit a USDC ceiling into the payment-channels program. Escrow, not Aisle."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
						n: "03",
						title: "Meter",
						body: "Each call is a 50-byte Ed25519 voucher. Cumulative. No transaction."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
						n: "04",
						title: "Settle",
						body: "One settlement pays publishers and returns whatever the agent did not spend."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X402Probe, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-12 font-serif text-2xl italic",
				children: "Catalog"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					"Public. ",
					catalogSummary().length,
					" tools. Filter with ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "font-mono text-fg",
						children: "q"
					}),
					" and",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "font-mono text-fg",
						children: "category"
					}),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 flex flex-col gap-2 sm:flex-row",
				onSubmit: (e) => {
					e.preventDefault();
					setSubmitted(q.trim());
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					"aria-label": "Catalog query",
					className: "font-mono"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "GET"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 font-mono text-xs text-subtle",
				children: ["GET /api/v1/catalog?q=", submitted || "…"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "mt-3 max-h-80 overflow-auto rounded-xl bg-surface-2 p-4 font-mono text-xs leading-relaxed text-fg/90 shadow-[var(--shadow-border)]",
				children: JSON.stringify(payload, null, 2)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-subtle",
				children: [
					"The same payload is served at",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "text-muted underline-offset-4 hover:text-fg hover:underline",
						href: `/api/v1/catalog?q=${encodeURIComponent(submitted)}`,
						children: "/api/v1/catalog"
					}),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-12 font-serif text-2xl italic",
				children: "Invoke"
			}),
			north ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "mt-3 overflow-auto rounded-xl bg-surface-2 p-4 font-mono text-xs leading-relaxed text-fg/90 shadow-[var(--shadow-border)]",
				children: `POST https://run.aisle.dev/v1/north
Authorization: Bearer aisle_live_north_…
${north.sampleRequest}`
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-8 text-sm text-muted",
				children: [
					"Start in the",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "text-fg underline-offset-4 hover:underline",
						children: "store"
					}),
					", or",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/run",
						className: "text-fg underline-offset-4 hover:underline",
						children: "run a job"
					}),
					". Pay for North, or send the 402 above. Then settle the channel."
				]
			})
		]
	});
}
function Step({ n, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tabular-nums text-subtle",
				children: n
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-2 font-serif text-xl italic text-fg",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm leading-normal text-muted",
				children: body
			})
		]
	});
}
function X402Probe() {
	const authorize = useAisleStore((s) => s.authorize);
	const channel = useAisleStore((s) => s.channel);
	const [status, setStatus] = (0, import_react.useState)(null);
	const [body, setBody] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(null);
	const north = getTool("north");
	const price = north ? usageCharge(north) : 0;
	async function ask() {
		setBusy("ask");
		try {
			const res = await fetch("/api/v1/x402", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ tool: "north" })
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
				toolId: north.id
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
					"payment-signature": auth.signature
				},
				body: JSON.stringify({
					tool: "north",
					payer: auth.payer,
					publicKey: auth.publicKey,
					voucher: auth.voucherB64,
					signature: auth.signatureB64
				})
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-8 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-widest text-muted uppercase",
				children: "x402 gate"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 font-serif text-2xl italic text-fg",
				children: "North, without an account"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 max-w-2xl text-sm leading-normal text-muted",
				children: [
					"A call with no voucher returns 402. The retry carries an MPP session voucher — the channel’s new cumulative total, not a fresh transaction. North is ",
					formatUsdc(price),
					" per query.",
					channel ? ` Open channel ${shortAddress(channel.id)}.` : " No channel yet — signing will open one."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "secondary",
					disabled: busy !== null,
					onClick: () => void ask(),
					children: busy === "ask" ? "Requesting…" : "Request without paying"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					disabled: busy !== null,
					onClick: () => void pay(),
					children: busy === "pay" ? "Signing…" : "Sign voucher & retry"
				})]
			}),
			status !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `font-mono text-xs ${status === 200 ? "text-success" : "text-danger"}`,
					children: status
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "mt-2 max-h-80 overflow-auto font-mono text-xs leading-relaxed text-fg/90",
					children: body
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 font-mono text-xs text-subtle",
				children: "POST /api/v1/x402"
			})
		]
	});
}
//#endregion
export { ProtocolPage as component };
