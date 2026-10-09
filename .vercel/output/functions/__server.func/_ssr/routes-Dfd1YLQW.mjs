import { i as __toESM } from "../_runtime.mjs";
import { a as featuredTools, d as searchTools, i as categoryLabel, l as getTool, o as formatCompact, s as formatUsdc, t as CATEGORIES, u as pricingLine } from "./catalog-CiQ-Tjo_.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as Search, o as Star, p as ArrowRight } from "../_libs/lucide-react.mjs";
import { c as useInstalled, i as Route$7, p as cn } from "./router-Bj9pAB_N.mjs";
import { t as Button } from "./button-CyH6reGX.mjs";
import { t as ToolMark } from "./tool-mark-CYOu3VTX.mjs";
import { t as Input } from "./input-ChTJn5j6.mjs";
import { n as recommendTools, r as useServerFn, t as Textarea } from "./textarea-NirUFAzH.mjs";
import { a as DialogHeader, c as PayDialog, i as DialogDescription, n as Dialog, o as DialogTitle, r as DialogContent, s as DialogTrigger, t as Badge } from "./pay-dialog-DoAMEKVv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Dfd1YLQW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ToolCard({ tool, reason }) {
	const installed = useInstalled(tool.id);
	const [pay, setPay] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group flex flex-col rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/tools/$toolId",
				params: { toolId: tool.id },
				className: "flex flex-1 flex-col text-left",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolMark, { mark: tool.mark }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [tool.isNew ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "accent",
								children: "New"
							}) : null, installed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "success",
								children: "Installed"
							}) : null]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 font-serif text-xl italic leading-snug text-fg",
						children: tool.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 line-clamp-2 text-sm leading-normal text-muted",
						children: tool.tagline
					}),
					reason ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-normal text-fg/80",
						children: reason
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center gap-3 text-xs text-subtle",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: categoryLabel(tool.category) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 tabular-nums",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-current" }), tool.rating.toFixed(1)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: formatCompact(tool.installs)
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center justify-between gap-3 border-t border-border pt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate font-mono text-xs tabular-nums text-fg",
						children: pricingLine(tool.pricing)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle",
						children: tool.installPrice === 0 ? "Free to install" : `Install ${formatUsdc(tool.installPrice)}`
					})]
				}), installed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					variant: "secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/installed",
						children: "Open"
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: (e) => {
						e.preventDefault();
						setPay(true);
					},
					children: tool.installPrice === 0 ? "Install" : "Pay"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayDialog, {
				tool,
				open: pay,
				onOpenChange: setPay
			})
		]
	});
}
function AskAisle() {
	const recommend = useServerFn(recommendTools);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [task, setTask] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [picks, setPicks] = (0, import_react.useState)(null);
	const [source, setSource] = (0, import_react.useState)(null);
	async function submit(e) {
		e.preventDefault();
		const trimmed = task.trim();
		if (!trimmed) return;
		setBusy(true);
		setError(null);
		try {
			const result = await recommend({ data: { task: trimmed } });
			if (!result.ok) {
				setError(result.error);
				setPicks(null);
			} else {
				setPicks(result.picks);
				setSource(result.source);
			}
		} catch {
			setError("Could not reach Aisle. Try the catalog search.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: (next) => {
			setOpen(next);
			if (!next) {
				setPicks(null);
				setError(null);
				setSource(null);
			}
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "secondary",
				className: "h-12",
				children: ["Describe a job", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg max-h-[85dvh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Describe a job" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Aisle matches the task to tools in the catalog. Pay only if you install — or send an agent to shop and run." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "mt-4 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: task,
						onChange: (e) => setTask(e.target.value),
						placeholder: "Scrape a careers page, extract salaries, and email a digest.",
						maxLength: 500
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-subtle",
							children: source === "model" ? "Matched by model." : source === "index" ? "Matched from the catalog index." : "One request. Nothing is charged to describe."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: busy || task.trim().length === 0,
							children: busy ? "Matching…" : "Find tools"
						})]
					})]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-danger",
					children: error
				}) : null,
				picks && picks.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-3",
					children: [picks.map((p) => {
						const tool = getTool(p.id);
						if (!tool) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolCard, {
							tool,
							reason: p.reason
						}, p.id);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "secondary",
						className: "w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/run",
							search: { task: task.trim() },
							onClick: () => setOpen(false),
							children: ["Let an agent run this", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
						})
					})]
				}) : null
			]
		})]
	});
}
function Home() {
	const { q, cat } = Route$7.useSearch();
	const navigate = Route$7.useNavigate();
	const [draft, setDraft] = (0, import_react.useState)(q ?? "");
	const results = (0, import_react.useMemo)(() => searchTools(q ?? "", cat), [q, cat]);
	const featured = (0, import_react.useMemo)(() => featuredTools(), []);
	const searching = Boolean(q) || Boolean(cat);
	function applyQuery(next) {
		navigate({ search: (prev) => ({
			...prev,
			q: next.trim() || void 0
		}) });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "ledger-grid relative -mx-4 border-b border-border px-4 py-12 md:-mx-6 md:px-6 md:py-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-widest text-muted uppercase",
					children: "App store for agents"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 max-w-2xl font-serif text-4xl leading-tight tracking-tight text-fg italic md:text-5xl",
					children: "Find a tool. Pay. Run."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-xl text-base leading-normal text-muted",
					children: "No accounts. No OAuth. No setup. Open a USDC channel on Solana, sign a voucher per call, settle once."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-8 flex flex-col gap-3 sm:flex-row sm:items-center",
					onSubmit: (e) => {
						e.preventDefault();
						applyQuery(draft);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft,
							onChange: (e) => setDraft(e.target.value),
							placeholder: "Search a capability — crawl, mail, sql, vision",
							className: "h-12 pl-10",
							"aria-label": "Search tools"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "h-12 px-5",
							children: "Search"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AskAisle, {})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 font-mono text-xs leading-relaxed text-subtle",
					children: [
						"GET /api/v1/catalog?q=search",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-2 text-border-strong",
							children: "·"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/protocol",
							className: "text-muted underline-offset-4 hover:text-fg hover:underline",
							children: "Protocol"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-2 text-border-strong",
							children: "·"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/run",
							className: "text-muted underline-offset-4 hover:text-fg hover:underline",
							children: "Run a job"
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2 overflow-x-auto py-6 -mx-4 px-4 md:mx-0 md:px-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatChip, {
				label: "All",
				active: !cat,
				onClick: () => void navigate({ search: (p) => ({
					...p,
					cat: void 0
				}) })
			}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatChip, {
				label: c.label,
				active: cat === c.id,
				onClick: () => void navigate({ search: (p) => ({
					...p,
					cat: p.cat === c.id ? void 0 : c.id
				}) })
			}, c.id))]
		}),
		!searching ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-10 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:flex sm:items-center sm:justify-between sm:gap-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl italic text-fg",
					children: "Send an agent"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-xl text-sm leading-normal text-muted",
					children: "Describe the job. It queries the catalog, pays from this wallet, and invokes. You watch the transcript."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-4 sm:mt-0 shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/run",
					children: ["Open the runner", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
				})
			})]
		}) : null,
		!searching ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-baseline justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl italic text-fg",
					children: "Featured"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-subtle",
					children: [featured.length, " tools"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: featured.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolCard, { tool: t }, t.id))
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-baseline justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl italic text-fg",
				children: searching ? "Results" : "Catalog"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs tabular-nums text-subtle",
				children: [results.length, " tools"]
			})]
		}), results.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl bg-surface px-6 py-12 text-center shadow-[var(--shadow-border)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-fg",
				children: "No tools match."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Try retrieval, browser, or money — or describe the job."
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: results.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolCard, { tool: t }, t.id))
		})] })
	] });
}
function CatChip({ label, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-11 shrink-0 rounded-full px-4 text-sm transition-[background-color,color,box-shadow] duration-150", active ? "bg-accent text-accent-fg" : "text-muted shadow-[0_0_0_1px_var(--color-border)] hover:text-fg"),
		children: label
	});
}
//#endregion
export { Home as component };
