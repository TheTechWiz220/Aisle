import { i as __toESM } from "../_runtime.mjs";
import { f as shortAddress, l as getTool, p as usageCharge, s as formatUsdc } from "./catalog-CiQ-Tjo_.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { s as Square } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as channelRemaining, p as cn, r as Route$4, s as useAisleStore } from "./router-Bj9pAB_N.mjs";
import { t as Button } from "./button-CyH6reGX.mjs";
import { t as ToolMark } from "./tool-mark-CYOu3VTX.mjs";
import { n as recommendTools, r as useServerFn, t as Textarea } from "./textarea-NirUFAzH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/run-7GW8NjnH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEMO_JOBS = [
	{
		id: "10k",
		label: "10-K research",
		task: "Search the web for Harbor Systems latest 10-K and cite sources."
	},
	{
		id: "jobs",
		label: "Careers extract",
		task: "Crawl a careers site and extract structured job listings with salary."
	},
	{
		id: "invoice",
		label: "Invoice to AP",
		task: "Parse an invoice PDF and email the total to AP."
	},
	{
		id: "login",
		label: "Headed login",
		task: "Open a headed browser session and fill a login form."
	},
	{
		id: "jail",
		label: "Untrusted code",
		task: "Run untrusted python in a sandbox with no network."
	}
];
function sleep(ms, signal) {
	return new Promise((resolve, reject) => {
		if (signal.aborted) {
			reject(new DOMException("aborted", "AbortError"));
			return;
		}
		const t = window.setTimeout(resolve, ms);
		const onAbort = () => {
			window.clearTimeout(t);
			reject(new DOMException("aborted", "AbortError"));
		};
		signal.addEventListener("abort", onAbort, { once: true });
	});
}
function AgentConsole({ initialTask = "" }) {
	const recommend = useServerFn(recommendTools);
	const [task, setTask] = (0, import_react.useState)(initialTask);
	const [phase, setPhase] = (0, import_react.useState)("idle");
	const [lines, setLines] = (0, import_react.useState)([]);
	const [spent, setSpent] = (0, import_react.useState)(0);
	const [usedIds, setUsedIds] = (0, import_react.useState)([]);
	const logRef = (0, import_react.useRef)(null);
	const abortRef = (0, import_react.useRef)(null);
	const lineId = (0, import_react.useRef)(0);
	const busyRef = (0, import_react.useRef)(false);
	const address = useAisleStore((s) => s.address);
	const liquid = useAisleStore((s) => s.liquid);
	const channel = useAisleStore((s) => s.channel);
	const installed = useAisleStore((s) => s.installed);
	const jobs = useAisleStore((s) => s.jobs) ?? [];
	const faucet = useAisleStore((s) => s.faucet);
	const headroom = channel ? channelRemaining(channel) : liquid;
	(0, import_react.useEffect)(() => {
		if (initialTask) setTask(initialTask);
	}, [initialTask]);
	(0, import_react.useEffect)(() => {
		const el = logRef.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [lines, phase]);
	(0, import_react.useEffect)(() => {
		return () => abortRef.current?.abort();
	}, []);
	function append(line) {
		lineId.current += 1;
		setLines((prev) => [...prev, {
			...line,
			id: lineId.current
		}]);
	}
	async function execute(nextTask) {
		const trimmed = nextTask.trim();
		if (!trimmed || busyRef.current) return;
		abortRef.current?.abort();
		const ac = new AbortController();
		abortRef.current = ac;
		const { signal } = ac;
		lineId.current = 0;
		setLines([]);
		setSpent(0);
		setUsedIds([]);
		setPhase("running");
		busyRef.current = true;
		let runSpent = 0;
		const runTools = [];
		const bump = (n) => {
			runSpent = Math.round((runSpent + n) * 1e3) / 1e3;
			setSpent(runSpent);
		};
		try {
			append({
				kind: "sys",
				kicker: "job",
				title: "Accepted.",
				body: trimmed
			});
			await sleep(380, signal);
			append({
				kind: "req",
				kicker: "GET",
				title: "/api/v1/catalog",
				body: `q=${encodeURIComponent(trimmed.slice(0, 80))}`
			});
			await sleep(280, signal);
			const result = await recommend({ data: { task: trimmed } });
			if (signal.aborted) return;
			if (!result.ok) {
				append({
					kind: "err",
					kicker: "err",
					title: result.error
				});
				setPhase("idle");
				return;
			}
			const picks = result.picks;
			append({
				kind: "ok",
				kicker: "200",
				title: `${picks.length} tool${picks.length === 1 ? "" : "s"} · ${result.source === "model" ? "model match" : "index match"}`,
				body: picks.map((p) => getTool(p.id)?.name ?? p.id).join(" · ") || "none"
			});
			await sleep(420, signal);
			if (picks.length === 0) {
				append({
					kind: "sys",
					kicker: "end",
					title: "No tools matched. Try a more specific job."
				});
				setPhase("done");
				return;
			}
			for (const pick of picks) {
				if (signal.aborted) return;
				const tool = getTool(pick.id);
				if (!tool) continue;
				append({
					kind: "sys",
					kicker: "pick",
					title: tool.name,
					body: pick.reason
				});
				await sleep(360, signal);
				const already = useAisleStore.getState().installed.find((i) => i.toolId === tool.id);
				if (!already) {
					append({
						kind: "req",
						kicker: "POST",
						title: "/v1/checkout",
						body: `{ "tool": "${tool.id}", "agent": "${useAisleStore.getState().address}" }`
					});
					await sleep(320, signal);
					const paid = await useAisleStore.getState().install(tool);
					if (!paid.ok) {
						append({
							kind: "err",
							kicker: "402",
							title: paid.reason === "busy" ? "Signer busy" : "Channel cannot cover this",
							body: `Need ${formatUsdc(tool.installPrice)} to install ${tool.name}. Faucet USDC and run again.`
						});
						useAisleStore.getState().recordJob({
							task: trimmed,
							spent: runSpent,
							toolIds: runTools,
							status: "blocked"
						});
						setPhase("blocked");
						return;
					}
					if (paid.auth?.opened) append({
						kind: "pay",
						kicker: "open",
						title: `Channel escrowed · ${formatUsdc(paid.auth.opened.ceiling)}`,
						body: paid.auth.opened.channelId
					});
					if (paid.auth?.topped) append({
						kind: "pay",
						kicker: "top",
						title: `Channel topped up · ${formatUsdc(paid.auth.topped)}`
					});
					const key = useAisleStore.getState().installed.find((i) => i.toolId === tool.id)?.key;
					bump(tool.installPrice);
					append({
						kind: "pay",
						kicker: "200",
						title: tool.installPrice === 0 ? `Checkout ${tool.name} · free` : `Voucher ${tool.name} · ${formatUsdc(-tool.installPrice)}`,
						body: paid.auth?.signature ? `${key ?? ""}\n${paid.auth.signature}` : key
					});
				} else append({
					kind: "ok",
					kicker: "204",
					title: `${tool.name} already installed`,
					body: already.key
				});
				await sleep(280, signal);
				append({
					kind: "req",
					kicker: "POST",
					title: `/v1/${tool.id}`,
					body: tool.sampleRequest
				});
				await sleep(520, signal);
				const invoked = await useAisleStore.getState().run(tool.id);
				if (!invoked.ok) {
					append({
						kind: "err",
						kicker: invoked.reason === "missing" ? "404" : "402",
						title: invoked.reason === "missing" ? "Tool missing" : "Channel cannot cover this run"
					});
					useAisleStore.getState().recordJob({
						task: trimmed,
						spent: runSpent,
						toolIds: runTools,
						status: "blocked"
					});
					setPhase("blocked");
					return;
				}
				const charge = usageCharge(tool);
				bump(charge);
				runTools.push(tool.id);
				setUsedIds([...runTools]);
				append({
					kind: "ok",
					kicker: "200",
					title: charge > 0 ? `Invoke ${tool.name} · ${formatUsdc(-charge)}` : `Invoke ${tool.name} · free`,
					body: invoked.auth?.signature ? `${invoked.response}\n\nvoucher ${invoked.auth.signature}` : invoked.response
				});
				await sleep(280, signal);
			}
			append({
				kind: "sys",
				kicker: "end",
				title: `Done. ${runTools.length} tool${runTools.length === 1 ? "" : "s"}. ${formatUsdc(runSpent)} authorized.`
			});
			useAisleStore.getState().recordJob({
				task: trimmed,
				spent: runSpent,
				toolIds: runTools,
				status: "done"
			});
			setPhase("done");
		} catch (err) {
			if (err instanceof DOMException && err.name === "AbortError") return;
			append({
				kind: "err",
				kicker: "err",
				title: "Runner failed. Try again."
			});
			setPhase("idle");
		} finally {
			busyRef.current = false;
		}
	}
	function stop() {
		abortRef.current?.abort();
		setPhase("idle");
		append({
			kind: "sys",
			kicker: "end",
			title: "Stopped."
		});
	}
	function onSubmit(e) {
		e.preventDefault();
		execute(task);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: task,
					onChange: (e) => setTask(e.target.value),
					placeholder: "Search the web for a filing, parse an invoice, fill a form — the agent shops.",
					maxLength: 500,
					"aria-label": "Job for the agent"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto pb-1 -mx-1 px-1",
					children: DEMO_JOBS.map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setTask(job.task);
						},
						className: cn("h-11 shrink-0 rounded-full px-4 text-sm text-muted shadow-[0_0_0_1px_var(--color-border)] transition-colors duration-150 hover:text-fg", task === job.task && "bg-accent text-accent-fg shadow-none"),
						children: job.label
					}, job.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs text-subtle",
						children: [
							address ? shortAddress(address) : "key…",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mx-2 text-border-strong",
								children: "·"
							}),
							phase === "running" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shimmer-text",
								children: "shopping"
							}) : phase === "blocked" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-danger",
								children: "blocked"
							}) : phase === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-success",
								children: "done"
							}) : "idle",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mx-2 text-border-strong",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: formatUsdc(headroom)
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: phase === "running" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "secondary",
							onClick: stop,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3.5" }), "Stop"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: task.trim().length === 0,
							children: "Run agent"
						})
					})]
				})
			]
		}),
		phase === "blocked" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-fg",
				children: "The channel cannot cover the next tool. Faucet USDC, then run again."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: "secondary",
					onClick: () => {
						faucet().then((r) => {
							if (!r.ok) toast(r.reason === "cap" ? "Faucet cap reached" : "Still signing");
						});
					},
					children: "Faucet 25 USDC"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					onClick: () => void execute(task),
					children: "Resume"
				})]
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid gap-4 lg:grid-cols-[1fr_18rem]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: logRef,
				className: "max-h-[32rem] overflow-y-auto rounded-xl bg-surface-2 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface-2/95 px-4 py-2 backdrop-blur-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle",
						children: "Transcript"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs tabular-nums text-muted",
						children: [formatUsdc(spent), " this run"]
					})]
				}), lines.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 py-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-xl italic text-fg",
						children: "Waiting for a job."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-md text-sm leading-normal text-muted",
						children: "The agent will GET the catalog, open a USDC channel if it needs one, then sign a voucher per call."
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "divide-y divide-border",
					children: [lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "px-4 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("w-10 shrink-0 pt-0.5 font-mono text-xs tabular-nums", line.kind === "err" ? "text-danger" : line.kind === "pay" || line.kind === "ok" ? "text-success" : "text-subtle"),
								children: line.kicker
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs leading-relaxed text-fg",
									children: line.title
								}), line.body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "mt-2 overflow-x-auto font-mono text-xs leading-relaxed text-muted",
									children: line.body
								}) : null]
							})]
						})
					}, line.id)), phase === "running" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cursor-blink inline-block h-3.5 w-1.5 bg-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shimmer-text font-mono text-xs",
							children: "working"
						})]
					}) : null]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "h-fit rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-widest text-muted uppercase",
						children: "This run"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-mono text-2xl tabular-nums text-fg",
						children: formatUsdc(spent)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-subtle",
						children: [usedIds.length, " tools invoked"]
					}),
					usedIds.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted",
						children: "Nothing invoked this run yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-3",
						children: usedIds.map((id) => {
							const tool = getTool(id);
							const row = installed.find((i) => i.toolId === id);
							if (!tool) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolMark, {
									mark: tool.mark,
									className: "size-9 text-sm"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/tools/$toolId",
										params: { toolId: tool.id },
										className: "block truncate text-sm text-fg hover:underline",
										children: tool.name
									}), row ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-mono text-xs text-subtle",
										children: row.key
									}) : null]
								})]
							}, id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-xs leading-normal text-subtle",
						children: "Checkout and invoke sign the same Solana channel as the store. Keys persist on this device."
					})
				]
			})]
		}),
		jobs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl italic text-fg",
				children: "Recent jobs"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 divide-y divide-border rounded-xl bg-surface shadow-[var(--shadow-border)]",
				children: jobs.slice(0, 6).map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex w-full items-baseline justify-between gap-4 px-4 py-3 text-left hover:bg-surface-2",
					onClick: () => {
						setTask(job.task);
						toast("Job loaded. Run when ready.");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm text-fg",
							children: job.task
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 text-xs text-subtle",
							children: [
								job.toolIds.length,
								" tools",
								job.status === "blocked" ? " · blocked" : ""
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "shrink-0 font-mono text-xs tabular-nums text-muted",
						children: formatUsdc(job.spent)
					})]
				}) }, job.id))
			})]
		}) : null
	] });
}
function RunPage() {
	const { task } = Route$4.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-8 md:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-widest text-muted uppercase",
				children: "Agent runtime"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-serif text-4xl italic leading-tight text-fg",
				children: "Watch it shop."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-base leading-normal text-muted",
				children: "Describe a job. The agent queries the catalog, pays in marks, and invokes. No accounts. No OAuth. No setup."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-subtle",
				children: [
					"Same protocol as a deployed agent.",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/protocol",
						className: "text-muted underline-offset-4 hover:text-fg hover:underline",
						children: "Read it"
					}),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentConsole, { initialTask: task })
			})
		]
	});
}
//#endregion
export { RunPage as component };
