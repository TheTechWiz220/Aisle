import { i as __toESM } from "../_runtime.mjs";
import { i as categoryLabel, o as formatCompact, s as formatUsdc, u as pricingLine } from "./catalog-CiQ-Tjo_.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { d as Copy, f as Check, m as ArrowLeft, o as Star } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as useInstalled, n as Route$2, p as cn, s as useAisleStore } from "./router-Bj9pAB_N.mjs";
import { t as Button } from "./button-CyH6reGX.mjs";
import { t as ToolMark } from "./tool-mark-CYOu3VTX.mjs";
import { c as PayDialog, t as Badge } from "./pay-dialog-DoAMEKVv.mjs";
import { t as Root } from "../_libs/radix-ui__react-separator.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools._toolId-muJRy4-K.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Separator({ className, orientation = "horizontal", decorative = true, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		decorative,
		orientation,
		className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className),
		...props
	});
}
function ToolPage() {
	const { tool } = Route$2.useLoaderData();
	const installed = useInstalled(tool.id);
	const [pay, setPay] = (0, import_react.useState)(false);
	const run = useAisleStore((s) => s.run);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [output, setOutput] = (0, import_react.useState)(null);
	async function runSample() {
		setRunning(true);
		setOutput(null);
		await new Promise((r) => setTimeout(r, 500));
		const result = await run(tool.id);
		setRunning(false);
		if (!result.ok) {
			toast(result.reason === "missing" ? "Install first" : result.reason === "busy" ? "Still signing" : "Not enough USDC in the channel");
			return;
		}
		setOutput(result.response);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-8 md:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "inline-flex h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Store"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolMark, {
							mark: tool.mark,
							className: "size-14 text-xl"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "font-serif text-4xl italic leading-tight text-fg",
										children: tool.name
									}),
									tool.isNew ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "accent",
										children: "New"
									}) : null,
									installed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "success",
										children: "Installed"
									}) : null
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-muted",
								children: [
									tool.publisher,
									tool.verified ? " · Verified" : "",
									" · ",
									categoryLabel(tool.category)
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-2xl text-base leading-normal text-fg/90",
						children: tool.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Rating",
								value: tool.rating.toFixed(1),
								icon: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Installs",
								value: formatCompact(tool.installs)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Latency",
								value: `${tool.latencyMs} ms`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Reviews",
								value: String(tool.reviews)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-10 font-serif text-2xl italic",
						children: "Capabilities"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 flex flex-wrap gap-2",
						children: tool.capabilities.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex h-9 items-center rounded-md bg-surface-2 px-3 font-mono text-xs text-fg shadow-[0_0_0_1px_var(--color-border)]",
							children: c
						}) }, c))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-10 font-serif text-2xl italic",
						children: "Sample"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-3 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
							title: "Request",
							code: tool.sampleRequest
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
							title: "Response",
							code: tool.sampleResponse
						})]
					}),
					output ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
							title: "Last run",
							code: output
						})
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-10 font-serif text-2xl italic",
						children: "From agents"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-3",
						children: tool.reviewList.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono text-xs text-muted",
									children: [r.agent, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-subtle",
										children: [" · ", r.shop]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 text-xs tabular-nums text-subtle",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-current" }), r.rating]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-normal text-fg",
								children: r.text
							})]
						}, r.agent))
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "lg:sticky lg:top-24 h-fit rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-sm tabular-nums text-fg",
							children: pricingLine(tool.pricing)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: tool.installPrice === 0 ? "Free to install" : `Install ${formatUsdc(tool.installPrice)}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-4" }),
						installed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRow, { value: installed.key }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden space-y-3 lg:block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "w-full",
									onClick: runSample,
									disabled: running,
									children: running ? "Running…" : "Run sample"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "secondary",
									className: "w-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/installed",
										children: "Installed tools"
									})
								})]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "hidden w-full lg:inline-flex",
							onClick: () => setPay(true),
							children: tool.installPrice === 0 ? "Install" : `Pay ${formatUsdc(tool.installPrice)}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs leading-normal text-subtle",
							children: "A voucher is signed against this agent’s Solana channel. You get a capability key. Nothing else to configure."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-16 z-30 border-t border-border bg-bg/95 p-3 backdrop-blur-sm md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]",
				children: installed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					onClick: runSample,
					disabled: running,
					children: running ? "Running…" : "Run sample"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					onClick: () => setPay(true),
					children: tool.installPrice === 0 ? "Install" : `Pay ${formatUsdc(tool.installPrice)}`
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayDialog, {
				tool,
				open: pay,
				onOpenChange: setPay
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-20 lg:hidden" })
		]
	});
}
function Stat({ label, value, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-surface px-3 py-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs text-subtle",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
			className: "mt-1 flex items-center gap-1 font-mono text-sm tabular-nums text-fg",
			children: [icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-current" }) : null, value]
		})]
	});
}
function CodeBlock({ title, code }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-lg bg-surface-2 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-border px-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, { value: code })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "overflow-x-auto p-3 font-mono text-xs leading-relaxed text-fg/90",
			children: code
		})]
	});
}
function KeyRow({ value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 rounded-md bg-surface-2 px-3 py-2 shadow-[0_0_0_1px_var(--color-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
			className: "min-w-0 flex-1 truncate font-mono text-xs text-fg",
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, { value })]
	});
}
function CopyButton({ value }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "inline-flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:text-fg",
		onClick: async () => {
			try {
				await navigator.clipboard.writeText(value);
				setCopied(true);
				setTimeout(() => setCopied(false), 1200);
			} catch {
				toast("Copy failed");
			}
		},
		"aria-label": "Copy",
		children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" })
	});
}
//#endregion
export { ToolPage as component };
