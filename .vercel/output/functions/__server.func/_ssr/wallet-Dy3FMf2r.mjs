import { i as __toESM } from "../_runtime.mjs";
import { c as formatWhen, f as shortAddress, s as formatUsdc } from "./catalog-CiQ-Tjo_.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as channelRemaining, d as CLUSTER, f as USDC_MINT, l as CHANNEL_PRESETS, s as useAisleStore, u as CHANNEL_PROGRAM } from "./router-Bj9pAB_N.mjs";
import { t as Button } from "./button-CyH6reGX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wallet-Dy3FMf2r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	const [busy, setBusy] = (0, import_react.useState)(null);
	const remaining = channelRemaining(channel);
	const used = channel ? channel.authorized / channel.ceiling : 0;
	async function onFaucet() {
		setBusy("faucet");
		const result = await faucet();
		setBusy(null);
		if (!result.ok) toast(result.reason === "cap" ? "Faucet cap reached" : "Still signing");
		else toast.success(`Faucet ${formatUsdc(result.amount)}`);
	}
	async function onOpen(amount) {
		setBusy(`open-${amount}`);
		const result = await openChannel(amount);
		setBusy(null);
		if (!result.ok) {
			toast(result.reason === "funds" ? "Not enough liquid USDC" : result.reason === "open" ? "Channel already open" : "Still signing");
			return;
		}
		toast.success(`Escrowed ${formatUsdc(result.ceiling)}`);
	}
	async function onTopUp(amount) {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-8 md:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs tracking-widest text-muted uppercase",
				children: ["Solana ", CLUSTER.replace("solana:", "")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-serif text-4xl italic leading-tight text-fg",
				children: "Channel"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-muted",
				children: "Deposit a USDC ceiling once. Each tool call signs a voucher. Settle once — publishers are paid, the rest comes back."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]",
					children: !hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Preparing the agent key…"
					}) : channel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-subtle",
							children: "Headroom"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-4xl tabular-nums tracking-tight text-fg",
							children: formatUsdc(remaining)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-1.5 overflow-hidden rounded-full bg-surface-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-accent",
								style: { width: `${Math.min(100, used * 100)}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 grid grid-cols-3 gap-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "Ceiling",
									value: formatUsdc(channel.ceiling)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "Authorized",
									value: formatUsdc(channel.authorized)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "Liquid",
									value: formatUsdc(liquid)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 break-all font-mono text-xs text-subtle",
							children: channel.id
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap gap-2",
							children: [
								CHANNEL_PRESETS.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "secondary",
									disabled: busy !== null || liquid + 1e-9 < n,
									onClick: () => void onTopUp(n),
									children: ["Top up ", n]
								}, n)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "secondary",
									disabled: busy !== null,
									onClick: () => void onFaucet(),
									children: ["Faucet ", 25]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									disabled: busy !== null,
									onClick: () => void onSettle(),
									children: busy === "settle" ? "Settling…" : "Settle & refund"
								})
							]
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-subtle",
							children: "Liquid · not yet escrowed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-4xl tabular-nums tracking-tight text-fg",
							children: formatUsdc(liquid)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: "Open a channel to pay for tools. The program holds the deposit, not Aisle."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap gap-2",
							children: [CHANNEL_PRESETS.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: n === 10 ? "default" : "secondary",
								disabled: busy !== null || liquid + 1e-9 < n,
								onClick: () => void onOpen(n),
								children: busy === `open-${n}` ? "Opening…" : `Open ${n} USDC`
							}, n)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								disabled: busy !== null,
								onClick: () => void onFaucet(),
								children: ["Faucet ", 25]
							})]
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-subtle",
							children: "Agent"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 break-all font-mono text-sm text-fg",
							children: address || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-2 inline-flex h-11 items-center text-sm text-muted underline-offset-4 hover:text-fg hover:underline",
							onClick: () => {
								if (!address) return;
								navigator.clipboard.writeText(address);
								toast("Address copied");
							},
							children: "Copy address"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-6 space-y-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Program",
									value: shortAddress(CHANNEL_PROGRAM),
									full: CHANNEL_PROGRAM
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "USDC mint",
									value: shortAddress(USDC_MINT),
									full: USDC_MINT
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Cluster",
									value: "devnet"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-xs leading-normal text-subtle",
							children: "Vouchers are Ed25519 over the 50-byte payment-channels message. This preview settles locally so it runs without a funded wallet. The program id is the mainnet program."
						})
					]
				})]
			}),
			last ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-widest text-muted uppercase",
						children: "Last settlement"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-mono text-xs text-subtle",
						children: [
							shortAddress(last.channelId),
							" · ",
							formatWhen(last.at)
						]
					}),
					last.payouts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "Nothing was authorized. The ceiling came back."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 divide-y divide-border",
						children: last.payouts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-baseline justify-between gap-4 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: p.publisher
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono tabular-nums",
								children: formatUsdc(p.amount)
							})]
						}, p.publisher))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-muted",
						children: [
							"Refunded ",
							formatUsdc(last.refund),
							" to the agent wallet."
						]
					}),
					last.signature ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 break-all font-mono text-xs text-subtle",
						children: last.signature
					}) : null
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex items-baseline justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl italic",
					children: "Vouchers"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/protocol",
					className: "text-sm text-muted underline-offset-4 hover:text-fg hover:underline",
					children: "Protocol"
				})]
			}),
			!channel || channel.vouchers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "None on the open channel. Pay for a tool, or send the 402 from the protocol page."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 divide-y divide-border rounded-xl bg-surface shadow-[var(--shadow-border)]",
				children: channel.vouchers.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm text-fg",
							children: v.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "shrink-0 font-mono text-sm tabular-nums text-fg",
							children: ["−", formatUsdc(v.delta)]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 truncate font-mono text-xs text-subtle",
						children: [
							"cum ",
							formatUsdc(v.cumulative),
							" · ",
							shortAddress(v.signature),
							" · ",
							formatWhen(v.at)
						]
					})]
				}, v.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-serif text-2xl italic",
				children: "Cash"
			}),
			ledger.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "No movements yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 divide-y divide-border rounded-xl bg-surface shadow-[var(--shadow-border)]",
				children: ledger.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-baseline justify-between gap-4 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm text-fg",
							children: t.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-subtle",
							children: [
								formatWhen(t.at),
								" · ",
								t.type === "open" || t.type === "topup" ? "escrowed" : t.type
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: `shrink-0 font-mono text-sm tabular-nums ${t.amount < 0 ? "text-fg" : "text-success"}`,
						children: [t.amount > 0 ? "+" : "", formatUsdc(t.amount)]
					})]
				}, t.id))
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs text-subtle",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-1 font-mono text-sm tabular-nums text-fg",
		children: value
	})] });
}
function Field({ label, value, full }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "font-mono text-xs text-fg",
			title: full,
			children: value
		})]
	});
}
//#endregion
export { WalletPage as component };
