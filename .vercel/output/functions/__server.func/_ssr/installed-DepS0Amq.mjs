import { i as __toESM } from "../_runtime.mjs";
import { c as formatWhen, l as getTool, s as formatUsdc, u as pricingLine } from "./catalog-CiQ-Tjo_.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { d as Copy, f as Check, l as Play } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as useAisleStore } from "./router-Bj9pAB_N.mjs";
import { t as Button } from "./button-CyH6reGX.mjs";
import { t as ToolMark } from "./tool-mark-CYOu3VTX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/installed-DepS0Amq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InstalledPage() {
	const installed = useAisleStore((s) => s.installed);
	const uninstall = useAisleStore((s) => s.uninstall);
	const run = useAisleStore((s) => s.run);
	const [runningId, setRunningId] = (0, import_react.useState)(null);
	const [output, setOutput] = (0, import_react.useState)(null);
	async function runSample(toolId) {
		setRunningId(toolId);
		await new Promise((r) => setTimeout(r, 450));
		const result = await run(toolId);
		setRunningId(null);
		if (!result.ok) {
			toast(result.reason === "missing" ? "Missing tool" : result.reason === "busy" ? "Still signing" : "Not enough USDC in the channel");
			return;
		}
		setOutput({
			id: toolId,
			body: result.response
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-8 md:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-4xl italic leading-tight text-fg",
				children: "Installed"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-muted",
				children: "Capability keys for this agent. A sample run signs a voucher against the open channel."
			}),
			installed.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 rounded-xl bg-surface px-6 py-12 text-center shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-2xl italic text-fg",
						children: "Nothing installed."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "The catalog is open. Pay once, run after."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							children: "Browse the store"
						})
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 space-y-3",
				children: installed.map((row) => {
					const tool = getTool(row.toolId);
					if (!tool) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-4 sm:flex-row sm:items-start",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolMark, { mark: tool.mark }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-baseline justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/tools/$toolId",
												params: { toolId: tool.id },
												className: "font-serif text-xl italic text-fg hover:underline",
												children: tool.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-mono text-xs tabular-nums text-subtle",
												children: pricingLine(tool.pricing)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-muted",
											children: tool.tagline
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 flex items-center gap-2 rounded-md bg-surface-2 px-3 py-2 shadow-[0_0_0_1px_var(--color-border)]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
												className: "min-w-0 flex-1 truncate font-mono text-xs text-fg",
												children: row.key
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyBtn, { value: row.key })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-2 text-xs tabular-nums text-subtle",
											children: [
												"Installed ",
												formatWhen(row.installedAt),
												" · ",
												row.runs,
												" ",
												row.runs === 1 ? "run" : "runs",
												" · ",
												"paid ",
												formatUsdc(row.paid)
											]
										}),
										output?.id === tool.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
											className: "mt-3 overflow-x-auto rounded-md bg-surface-2 p-3 font-mono text-xs leading-relaxed text-fg/90 shadow-[0_0_0_1px_var(--color-border)]",
											children: output.body
										}) : null
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex shrink-0 gap-2 sm:flex-col",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										onClick: () => void runSample(tool.id),
										disabled: runningId === tool.id,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5" }), runningId === tool.id ? "Running…" : "Run"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => uninstall(tool.id),
										children: "Remove"
									})]
								})
							]
						})
					}, row.toolId);
				})
			})
		]
	});
}
function CopyBtn({ value }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "inline-flex size-9 items-center justify-center rounded-md text-muted hover:text-fg",
		"aria-label": "Copy key",
		onClick: async () => {
			try {
				await navigator.clipboard.writeText(value);
				setCopied(true);
				setTimeout(() => setCopied(false), 1200);
			} catch {
				toast("Copy failed");
			}
		},
		children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" })
	});
}
//#endregion
export { InstalledPage as component };
