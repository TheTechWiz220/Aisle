import { i as __toESM } from "../_runtime.mjs";
import { d as searchTools, f as shortAddress, l as getTool, p as usageCharge, s as formatUsdc } from "./catalog-CiQ-Tjo_.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { J as notFound, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, x as useRouter, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { a as Store, i as Terminal, n as Wallet, r as TriangleAlert, u as Layers } from "../_libs/lucide-react.mjs";
import { t as Provider } from "../_libs/radix-ui__react-tooltip.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Bj9pAB_N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error instanceof Error ? error.message : "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function TooltipProvider({ delayDuration = 200, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provider, {
		delayDuration,
		...props
	});
}
function Toaster$1(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		theme: "dark",
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast bg-surface text-fg border-border shadow-[0_0_0_1px_var(--color-border)]",
			description: "text-muted",
			actionButton: "bg-accent text-accent-fg",
			cancelButton: "bg-surface-2 text-fg"
		} },
		...props
	});
}
/** Solana payment-channels wire format. Devnet mirror — vouchers are real Ed25519. */
var CLUSTER = "solana:devnet";
var CHANNEL_PROGRAM = "CHNLxYvVA28MJP9PrFuDXccuoGXAx7jBacfLEkahyGsX";
var USDC_MINT = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
var CHANNEL_PRESETS = [
	5,
	10,
	25
];
var ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function base58Encode(source) {
	if (source.length === 0) return "";
	const zeroes = source.findIndex((b) => b !== 0);
	const leading = zeroes === -1 ? source.length : zeroes;
	let pbegin = leading === source.length ? source.length : leading;
	const pend = source.length;
	const size = (pend - pbegin) * Math.log(256) / Math.log(58) + 1 >>> 0;
	const b58 = new Uint8Array(size);
	let length = 0;
	while (pbegin !== pend) {
		let carry = source[pbegin];
		let i = 0;
		for (let it = size - 1; (carry !== 0 || i < length) && it !== -1; it--, i++) {
			carry += 256 * b58[it] >>> 0;
			b58[it] = carry % 58;
			carry = carry / 58 >>> 0;
		}
		length = i;
		pbegin++;
	}
	let it = size - length;
	while (it !== size && b58[it] === 0) it++;
	let str = "1".repeat(leading);
	for (; it < size; ++it) str += ALPHABET[b58[it]];
	return str;
}
function base58Decode(source) {
	if (source.length === 0) return /* @__PURE__ */ new Uint8Array();
	let psz = 0;
	let zeroes = 0;
	while (source[psz] === "1") {
		zeroes++;
		psz++;
	}
	const size = (source.length - psz) * Math.log(58) / Math.log(256) + 1 >>> 0;
	const b256 = new Uint8Array(size);
	let length = 0;
	while (psz < source.length) {
		const ch = ALPHABET.indexOf(source[psz]);
		if (ch === -1) throw new Error("bad base58");
		let carry = ch;
		let i = 0;
		for (let it = size - 1; (carry !== 0 || i < length) && it !== -1; it--, i++) {
			carry += 58 * b256[it];
			b256[it] = carry % 256;
			carry = Math.floor(carry / 256);
		}
		length = i;
		psz++;
	}
	let it = size - length;
	while (it !== size && b256[it] === 0) it++;
	const out = new Uint8Array(zeroes + (size - it));
	out.set(b256.subarray(it), zeroes);
	return out;
}
function usdcToAtomic(amount) {
	return BigInt(Math.round(amount * 1e6));
}
function asBuffer(bytes) {
	const copy = new Uint8Array(bytes.byteLength);
	copy.set(bytes);
	return copy;
}
function bytesToB64(bytes) {
	let s = "";
	for (const b of bytes) s += String.fromCharCode(b);
	return btoa(s);
}
function b64ToBytes(b64) {
	const s = atob(b64);
	const out = new Uint8Array(s.length);
	for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
	return out;
}
/** 50-byte voucher: magic, channel id, cumulative u64 LE, expires_at i64 LE. */
function encodeVoucher(channelId, cumulativeAtomic, expiresAt = 0n) {
	if (channelId.length !== 32) throw new Error("channel id must be 32 bytes");
	const msg = /* @__PURE__ */ new Uint8Array(50);
	msg[0] = 86;
	msg[1] = 1;
	msg.set(channelId, 2);
	const view = new DataView(msg.buffer);
	view.setBigUint64(34, cumulativeAtomic, true);
	view.setBigInt64(42, expiresAt, true);
	return msg;
}
function decodeVoucher(msg) {
	if (msg.length !== 50 || msg[0] !== 86 || msg[1] !== 1) return null;
	const view = new DataView(msg.buffer, msg.byteOffset, msg.byteLength);
	return {
		channel: msg.slice(2, 34),
		cumulative: view.getBigUint64(34, true),
		expiresAt: view.getBigInt64(42, true)
	};
}
async function generateAgentKeys() {
	const kp = await crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
	const raw = new Uint8Array(await crypto.subtle.exportKey("raw", kp.publicKey));
	const pkcs8 = new Uint8Array(await crypto.subtle.exportKey("pkcs8", kp.privateKey));
	return {
		address: base58Encode(raw),
		publicKey: bytesToB64(raw),
		privateKeyPkcs8: bytesToB64(pkcs8)
	};
}
async function signMessage(privateKeyPkcs8B64, message) {
	const pkcs8 = b64ToBytes(privateKeyPkcs8B64);
	const key = await crypto.subtle.importKey("pkcs8", asBuffer(pkcs8), { name: "Ed25519" }, false, ["sign"]);
	return new Uint8Array(await crypto.subtle.sign({ name: "Ed25519" }, key, asBuffer(message)));
}
async function verifyVoucher(input) {
	let pub;
	let msg;
	let sig;
	try {
		pub = b64ToBytes(input.publicKey);
		msg = b64ToBytes(input.voucher);
		sig = b64ToBytes(input.signature);
	} catch {
		return {
			ok: false,
			error: "invalid_voucher"
		};
	}
	if (pub.length !== 32 || msg.length !== 50 || sig.length !== 64) return {
		ok: false,
		error: "invalid_voucher"
	};
	if (base58Encode(pub) !== input.payer) return {
		ok: false,
		error: "payer_mismatch"
	};
	const decoded = decodeVoucher(msg);
	if (!decoded || decoded.cumulative <= 0n) return {
		ok: false,
		error: "invalid_voucher"
	};
	const key = await crypto.subtle.importKey("raw", asBuffer(pub), { name: "Ed25519" }, false, ["verify"]);
	if (!await crypto.subtle.verify({ name: "Ed25519" }, key, asBuffer(sig), asBuffer(msg))) return {
		ok: false,
		error: "bad_signature"
	};
	return {
		ok: true,
		channel: base58Encode(decoded.channel),
		cumulativeAtomic: decoded.cumulative
	};
}
function round6(n) {
	return Math.round(n * 1e6) / 1e6;
}
function rid() {
	const bytes = /* @__PURE__ */ new Uint8Array(4);
	crypto.getRandomValues(bytes);
	return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function mintKey(toolId) {
	const bytes = /* @__PURE__ */ new Uint8Array(8);
	crypto.getRandomValues(bytes);
	return `aisle_live_${toolId}_${[...bytes].map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}
function channelRemaining(channel) {
	if (!channel || channel.status !== "open") return 0;
	return Math.max(0, round6(channel.ceiling - channel.authorized));
}
function coverPlan(liquid, channel, amount) {
	if (amount <= 0) return { kind: "none" };
	if (channel?.status === "open") {
		const left = channelRemaining(channel);
		if (left + 1e-9 >= amount) return { kind: "ready" };
		const gap = round6(amount - left);
		if (liquid + 1e-9 >= gap) return {
			kind: "topup",
			amount: gap
		};
		return { kind: "short" };
	}
	if (liquid + 1e-9 >= amount) return {
		kind: "open",
		ceiling: round6(Math.min(liquid, Math.max(amount, 10)))
	};
	return { kind: "short" };
}
function spendableOf(liquid, channel) {
	if (channel?.status === "open") return {
		amount: channelRemaining(channel),
		kind: "channel"
	};
	return {
		amount: liquid,
		kind: "liquid"
	};
}
var useAisleStore = create()(persist((set, get) => {
	async function withLock(fn) {
		if (get().signing) return {
			ok: false,
			reason: "busy"
		};
		set({ signing: true });
		try {
			return await fn();
		} finally {
			set({ signing: false });
		}
	}
	function openUnlocked(ceiling) {
		const s = get();
		if (s.channel?.status === "open") return {
			ok: false,
			reason: "open"
		};
		const amount = round6(ceiling);
		if (!(amount > 0) || s.liquid + 1e-9 < amount) return {
			ok: false,
			reason: "funds"
		};
		const idBytes = /* @__PURE__ */ new Uint8Array(32);
		crypto.getRandomValues(idBytes);
		const channelId = base58Encode(idBytes);
		const at = Date.now();
		const channel = {
			id: channelId,
			status: "open",
			ceiling: amount,
			authorized: 0,
			openedAt: at,
			vouchers: []
		};
		const line = {
			id: rid(),
			type: "open",
			label: "Open channel",
			amount: -amount,
			at
		};
		set({
			liquid: round6(s.liquid - amount),
			channel,
			ledger: [line, ...s.ledger].slice(0, 80)
		});
		return {
			ok: true,
			channelId,
			ceiling: amount
		};
	}
	function topUpUnlocked(amount) {
		const s = get();
		const channel = s.channel;
		if (!channel || channel.status !== "open") return {
			ok: false,
			reason: "none"
		};
		const n = round6(amount);
		if (!(n > 0) || s.liquid + 1e-9 < n) return {
			ok: false,
			reason: "funds"
		};
		const at = Date.now();
		const line = {
			id: rid(),
			type: "topup",
			label: "Top up channel",
			amount: -n,
			at
		};
		set({
			liquid: round6(s.liquid - n),
			channel: {
				...channel,
				ceiling: round6(channel.ceiling + n)
			},
			ledger: [line, ...s.ledger].slice(0, 80)
		});
		return { ok: true };
	}
	async function spendUnlocked(input) {
		if (!(input.amount > 0)) return {
			ok: false,
			reason: "zero"
		};
		const plan = coverPlan(get().liquid, get().channel, input.amount);
		if (plan.kind === "short" || plan.kind === "none") return {
			ok: false,
			reason: "funds"
		};
		let opened;
		let topped;
		if (plan.kind === "open") {
			const openedResult = openUnlocked(plan.ceiling);
			if (!openedResult.ok) return {
				ok: false,
				reason: "funds"
			};
			opened = {
				ceiling: openedResult.ceiling,
				channelId: openedResult.channelId
			};
		} else if (plan.kind === "topup") {
			if (!topUpUnlocked(plan.amount).ok) return {
				ok: false,
				reason: "funds"
			};
			topped = plan.amount;
		}
		const s = get();
		const channel = s.channel;
		if (!channel || channel.status !== "open" || !s.privateKeyPkcs8) return {
			ok: false,
			reason: "channel"
		};
		const next = round6(channel.authorized + input.amount);
		if (next - channel.ceiling > 1e-8) return {
			ok: false,
			reason: "funds"
		};
		const channelBytes = base58Decode(channel.id);
		if (channelBytes.length !== 32) return {
			ok: false,
			reason: "channel"
		};
		const message = encodeVoucher(channelBytes, usdcToAtomic(next), 0n);
		const sig = await signMessage(s.privateKeyPkcs8, message);
		const signature = base58Encode(sig);
		const at = Date.now();
		const voucher = {
			id: rid(),
			toolId: input.toolId,
			publisher: input.publisher,
			label: input.label,
			delta: input.amount,
			cumulative: next,
			signature,
			at
		};
		const cur = get().channel;
		if (!cur || cur.id !== channel.id) return {
			ok: false,
			reason: "channel"
		};
		set({ channel: {
			...cur,
			authorized: next,
			vouchers: [voucher, ...cur.vouchers].slice(0, 40)
		} });
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
			topped
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
			generateAgentKeys().then((keys) => {
				if (get().address && get().privateKeyPkcs8) {
					set({ hydrated: true });
					return;
				}
				const at = Date.now();
				const line = {
					id: rid(),
					type: "faucet",
					label: "Devnet faucet",
					amount: 25,
					at
				};
				set({
					hydrated: true,
					address: keys.address,
					publicKey: keys.publicKey,
					privateKeyPkcs8: keys.privateKeyPkcs8,
					liquid: 25,
					ledger: [line]
				});
			});
		},
		faucet: () => withLock(async () => {
			const s = get();
			const escrow = s.channel?.status === "open" ? s.channel.ceiling : 0;
			if (s.liquid + escrow >= 100) return {
				ok: false,
				reason: "cap"
			};
			const at = Date.now();
			const line = {
				id: rid(),
				type: "faucet",
				label: "Devnet faucet",
				amount: 25,
				at
			};
			set({
				liquid: round6(s.liquid + 25),
				ledger: [line, ...s.ledger].slice(0, 80)
			});
			return {
				ok: true,
				amount: 25
			};
		}),
		openChannel: (ceiling) => withLock(async () => openUnlocked(ceiling)),
		topUp: (amount) => withLock(async () => topUpUnlocked(amount)),
		settle: () => withLock(async () => {
			const s = get();
			const channel = s.channel;
			if (!channel || channel.status !== "open") return {
				ok: false,
				reason: "none"
			};
			const owed = /* @__PURE__ */ new Map();
			for (const v of channel.vouchers) owed.set(v.publisher, round6((owed.get(v.publisher) ?? 0) + v.delta));
			const payouts = [...owed.entries()].map(([publisher, amount]) => ({
				publisher,
				amount
			})).filter((p) => p.amount > 0);
			const refund = Math.max(0, round6(channel.ceiling - channel.authorized));
			let signature = "";
			if (s.privateKeyPkcs8) {
				const msg = new TextEncoder().encode(`aisle.settle.v1|${channel.id}|${usdcToAtomic(channel.authorized).toString()}`);
				signature = base58Encode(await signMessage(s.privateKeyPkcs8, msg));
			}
			const at = Date.now();
			const settlement = {
				at,
				channelId: channel.id,
				ceiling: channel.ceiling,
				authorized: channel.authorized,
				refund,
				payouts,
				signature,
				voucherCount: channel.vouchers.length
			};
			const ledger = get().ledger;
			set({
				liquid: round6(get().liquid + refund),
				channel: null,
				lastSettlement: settlement,
				ledger: refund > 0 ? [{
					id: rid(),
					type: "refund",
					label: "Refund unused USDC",
					amount: refund,
					at
				}, ...ledger].slice(0, 80) : ledger
			});
			return {
				ok: true,
				settlement
			};
		}),
		authorize: (input) => withLock(() => spendUnlocked(input)),
		install: (tool) => withLock(async () => {
			if (get().installed.some((i) => i.toolId === tool.id)) return {
				ok: false,
				reason: "already"
			};
			let auth = null;
			if (tool.installPrice > 0) {
				const spent = await spendUnlocked({
					amount: tool.installPrice,
					label: `Install ${tool.name}`,
					publisher: tool.publisher,
					toolId: tool.id
				});
				if (!spent.ok) return {
					ok: false,
					reason: spent.reason === "channel" ? "channel" : spent.reason === "busy" ? "busy" : "funds"
				};
				auth = spent;
			}
			set({ installed: [{
				toolId: tool.id,
				key: mintKey(tool.id),
				paid: tool.installPrice,
				installedAt: Date.now(),
				runs: 0
			}, ...get().installed] });
			return {
				ok: true,
				auth
			};
		}),
		uninstall: (toolId) => {
			set({ installed: get().installed.filter((i) => i.toolId !== toolId) });
		},
		run: (toolId) => withLock(async () => {
			const row = get().installed.find((i) => i.toolId === toolId);
			const tool = getTool(toolId);
			if (!row || !tool) return {
				ok: false,
				reason: "missing"
			};
			const charge = usageCharge(tool);
			let auth = null;
			if (charge > 0) {
				const spent = await spendUnlocked({
					amount: charge,
					label: `Run ${tool.name}`,
					publisher: tool.publisher,
					toolId: tool.id
				});
				if (!spent.ok) return {
					ok: false,
					reason: spent.reason === "channel" ? "channel" : spent.reason === "busy" ? "busy" : "funds"
				};
				auth = spent;
			}
			set({ installed: get().installed.map((i) => i.toolId === toolId ? {
				...i,
				runs: i.runs + 1
			} : i) });
			return {
				ok: true,
				response: tool.sampleResponse,
				auth
			};
		}),
		recordJob: (job) => {
			set({ jobs: [{
				...job,
				id: rid(),
				at: Date.now()
			}, ...get().jobs].slice(0, 12) });
		}
	};
}, {
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
		jobs: s.jobs
	}),
	skipHydration: true
}));
function useInstalled(toolId) {
	return useAisleStore((s) => s.installed.find((i) => i.toolId === toolId));
}
function AppShell({ children }) {
	const markHydrated = useAisleStore((s) => s.markHydrated);
	const hydrated = useAisleStore((s) => s.hydrated);
	const address = useAisleStore((s) => s.address);
	const purse = spendableOf(useAisleStore((s) => s.liquid), useAisleStore((s) => s.channel));
	const installedCount = useAisleStore((s) => s.installed.length);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		const result = useAisleStore.persist.rehydrate();
		Promise.resolve(result).then(() => markHydrated());
	}, [markHydrated]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 md:h-16 md:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-baseline gap-2 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-serif text-2xl italic leading-none text-fg",
								children: "Aisle"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-xs tracking-wide text-subtle sm:inline",
								children: "for agents"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "ml-4 hidden items-center gap-1 md:flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
									to: "/",
									active: pathname === "/",
									children: "Store"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
									to: "/run",
									active: pathname.startsWith("/run"),
									children: "Run"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NavLink, {
									to: "/installed",
									active: pathname.startsWith("/installed"),
									children: ["Installed", installedCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-1.5 tabular-nums text-subtle",
										children: installedCount
									}) : null]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
									to: "/protocol",
									active: pathname.startsWith("/protocol"),
									children: "Protocol"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-2 sm:gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden font-mono text-xs text-subtle lg:inline",
								children: address ? shortAddress(address) : ""
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/wallet",
								className: "inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm text-fg shadow-[0_0_0_1px_var(--color-border)] transition-[box-shadow,background-color] duration-150 hover:bg-surface-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4 text-muted" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden text-xs text-subtle sm:inline",
										children: purse.kind === "channel" ? "channel" : "liquid"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular-nums",
										children: hydrated ? formatUsdc(purse.amount) : "—"
									})
								]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-6xl flex-1 px-4 pb-24 md:px-6 md:pb-16",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 backdrop-blur-sm md:hidden pb-[max(0.5rem,env(safe-area-inset-bottom))]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabLink, {
							to: "/",
							icon: Store,
							label: "Store",
							active: pathname === "/"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabLink, {
							to: "/run",
							icon: Terminal,
							label: "Run",
							active: pathname.startsWith("/run")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabLink, {
							to: "/installed",
							icon: Layers,
							label: "Installed",
							active: pathname.startsWith("/installed"),
							badge: installedCount
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabLink, {
							to: "/wallet",
							icon: Wallet,
							label: "Wallet",
							active: pathname.startsWith("/wallet")
						})
					]
				})
			})
		]
	});
}
function NavLink({ to, active, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		className: cn("inline-flex h-11 items-center rounded-md px-3 text-sm transition-colors duration-150", active ? "text-fg" : "text-muted hover:text-fg"),
		children
	});
}
function TabLink({ to, icon: Icon, label, active, badge }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: cn("relative flex min-h-12 flex-col items-center justify-center gap-0.5 text-xs tracking-wide", active ? "text-fg" : "text-muted"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }),
			badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute top-1 right-1/2 translate-x-5 rounded-full bg-accent px-1.5 text-xs tabular-nums text-accent-fg",
				children: badge
			}) : null
		]
	});
}
var styles_default = "/assets/styles-DKawYVwG.css";
var APP_NAME = "Aisle";
var Route$8 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "The app store for agents. Find a tool, pay in marks, run it. No setup."
			},
			{
				name: "theme-color",
				content: "#0c0c0d"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Instrument+Serif:ital@0;1&display=swap"
			}
		]
	}),
	component: Root
});
function Root() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$5 = () => import("./routes-Dfd1YLQW.mjs");
var Route$7 = createFileRoute("/")({
	validateSearch: (s) => ({
		q: typeof s.q === "string" ? s.q : void 0,
		cat: typeof s.cat === "string" ? s.cat : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter$5, "component"),
	head: () => ({ meta: [{ title: "Aisle — The app store for agents" }] })
});
var $$splitComponentImporter$4 = () => import("./installed-DepS0Amq.mjs");
var Route$6 = createFileRoute("/installed")({
	component: lazyRouteComponent($$splitComponentImporter$4, "component"),
	head: () => ({ meta: [{ title: "Installed — Aisle" }] })
});
var $$splitComponentImporter$3 = () => import("./protocol-CIizhs60.mjs");
var Route$5 = createFileRoute("/protocol")({
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	head: () => ({ meta: [{ title: "Protocol — Aisle" }] })
});
var $$splitComponentImporter$2 = () => import("./run-7GW8NjnH.mjs");
var Route$4 = createFileRoute("/run")({
	validateSearch: (s) => ({ task: typeof s.task === "string" ? s.task : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	head: () => ({ meta: [{ title: "Run — Aisle" }] })
});
var $$splitComponentImporter$1 = () => import("./wallet-Dy3FMf2r.mjs");
var Route$3 = createFileRoute("/wallet")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	head: () => ({ meta: [{ title: "Channel — Aisle" }] })
});
var $$splitNotFoundComponentImporter = () => import("./tools._toolId-BTqPV9Yd.mjs");
var $$splitComponentImporter = () => import("./tools._toolId-muJRy4-K.mjs");
var Route$2 = createFileRoute("/tools/$toolId")({
	loader: ({ params }) => {
		const tool = getTool(params.toolId);
		if (!tool) throw notFound();
		return { tool };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	head: ({ loaderData }) => ({ meta: [{ title: loaderData ? `${loaderData.tool.name} — Aisle` : "Aisle" }] })
});
var Route$1 = createFileRoute("/api/v1/catalog")({ server: { handlers: { GET: async ({ request }) => {
	const url = new URL(request.url);
	const q = url.searchParams.get("q") ?? "";
	const category = url.searchParams.get("category") ?? void 0;
	const id = url.searchParams.get("id");
	if (id) {
		const tool = getTool(id);
		if (!tool) return Response.json({
			ok: false,
			error: "not_found"
		}, { status: 404 });
		return Response.json({
			ok: true,
			tool: {
				id: tool.id,
				name: tool.name,
				tagline: tool.tagline,
				category: tool.category,
				publisher: tool.publisher,
				install: tool.installPrice,
				pricing: tool.pricing,
				capabilities: tool.capabilities,
				latencyMs: tool.latencyMs
			}
		});
	}
	const tools = searchTools(q, category).map((t) => ({
		id: t.id,
		name: t.name,
		tagline: t.tagline,
		category: t.category,
		publisher: t.publisher,
		install: t.installPrice,
		pricing: t.pricing,
		capabilities: t.capabilities
	}));
	return Response.json({
		ok: true,
		query: q,
		category: category ?? null,
		count: tools.length,
		tools
	});
} } } });
var Body = object({
	tool: string().optional(),
	payer: string().optional(),
	publicKey: string().optional(),
	voucher: string().optional(),
	signature: string().optional()
});
function challenge(toolId, price) {
	return {
		x402Version: 2,
		error: "payment_required",
		accepts: [{
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
					expiresAt: "i64-le"
				},
				tool: toolId
			}
		}]
	};
}
var Route = createFileRoute("/api/v1/x402")({ server: { handlers: { POST: async ({ request }) => {
	let raw = {};
	try {
		raw = await request.json();
	} catch {
		raw = {};
	}
	const parsed = Body.safeParse(raw);
	const body = parsed.success ? parsed.data : {};
	const tool = getTool(body.tool || "north");
	if (!tool) return Response.json({
		ok: false,
		error: "not_found"
	}, { status: 404 });
	const price = usageCharge(tool) || tool.installPrice || .001;
	if (!Boolean(body.payer && body.publicKey && body.voucher && body.signature)) return Response.json(challenge(tool.id, price), {
		status: 402,
		headers: {
			"PAYMENT-REQUIRED": "mpp; network=solana:devnet",
			"cache-control": "no-store"
		}
	});
	const verified = await verifyVoucher({
		payer: body.payer ?? "",
		publicKey: body.publicKey ?? "",
		voucher: body.voucher ?? "",
		signature: body.signature ?? ""
	});
	if (!verified.ok) return Response.json({
		...challenge(tool.id, price),
		error: verified.error
	}, {
		status: 402,
		headers: { "PAYMENT-REQUIRED": "mpp; network=solana:devnet" }
	});
	const cumulativeUsdc = Number(verified.cumulativeAtomic) / 1e6;
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
		body: tool.sampleResponse
	});
} } } });
var rootRouteChildren = {
	IndexRoute: Route$7.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$8
	}),
	InstalledRoute: Route$6.update({
		id: "/installed",
		path: "/installed",
		getParentRoute: () => Route$8
	}),
	ProtocolRoute: Route$5.update({
		id: "/protocol",
		path: "/protocol",
		getParentRoute: () => Route$8
	}),
	RunRoute: Route$4.update({
		id: "/run",
		path: "/run",
		getParentRoute: () => Route$8
	}),
	WalletRoute: Route$3.update({
		id: "/wallet",
		path: "/wallet",
		getParentRoute: () => Route$8
	}),
	ToolsToolIdRoute: Route$2.update({
		id: "/tools/$toolId",
		path: "/tools/$toolId",
		getParentRoute: () => Route$8
	}),
	ApiV1CatalogRoute: Route$1.update({
		id: "/api/v1/catalog",
		path: "/api/v1/catalog",
		getParentRoute: () => Route$8
	}),
	ApiV1X402Route: Route.update({
		id: "/api/v1/x402",
		path: "/api/v1/x402",
		getParentRoute: () => Route$8
	})
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent,
		scrollRestoration: true
	});
}
//#endregion
export { channelRemaining as a, useInstalled as c, CLUSTER as d, USDC_MINT as f, Route$7 as i, CHANNEL_PRESETS as l, Route$2 as n, coverPlan as o, cn as p, Route$4 as r, useAisleStore as s, router_exports as t, CHANNEL_PROGRAM as u };
