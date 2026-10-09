//#region node_modules/.nitro/vite/services/ssr/assets/catalog-CiQ-Tjo_.js
function formatUsdc(n) {
	const neg = n < 0;
	let body = (Math.round(Math.abs(n) * 1e6) / 1e6).toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
	if (!body.includes(".")) body += ".00";
	else if ((body.split(".")[1] ?? "").length === 1) body += "0";
	return `${neg ? "-" : ""}${body} USDC`;
}
function shortAddress(addr) {
	if (addr.length <= 10) return addr;
	return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}
function formatCompact(n) {
	if (n >= 1e6) return `${(n / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
	if (n >= 1e3) return `${(n / 1e3).toFixed(1).replace(/\.0$/, "")}k`;
	return String(n);
}
function formatWhen(ts) {
	const diff = Date.now() - ts;
	const min = Math.floor(diff / 6e4);
	if (min < 1) return "just now";
	if (min < 60) return `${min}m ago`;
	const hr = Math.floor(min / 60);
	if (hr < 24) return `${hr}h ago`;
	const day = Math.floor(hr / 24);
	if (day < 7) return `${day}d ago`;
	return new Date(ts).toLocaleDateString(void 0, {
		month: "short",
		day: "numeric"
	});
}
var CATEGORIES = [
	{
		id: "retrieval",
		label: "Retrieval"
	},
	{
		id: "browser",
		label: "Browser"
	},
	{
		id: "memory",
		label: "Memory"
	},
	{
		id: "compute",
		label: "Compute"
	},
	{
		id: "data",
		label: "Data"
	},
	{
		id: "comms",
		label: "Comms"
	},
	{
		id: "money",
		label: "Money"
	},
	{
		id: "sense",
		label: "Sense"
	},
	{
		id: "knowledge",
		label: "Knowledge"
	}
];
var TOOLS = [
	{
		id: "north",
		name: "North",
		mark: "NO",
		tagline: "Web search with citations, ranked for agents.",
		description: "North returns ranked web results with source URLs, snippets, and a recency signal. Built for agents that need to ground an answer, not for human SERP browsing. Query language is plain text; filters cover site, date, and language.",
		category: "retrieval",
		publisher: "Copperline",
		verified: true,
		icon: "search",
		pricing: {
			kind: "per-call",
			amount: .008,
			unit: "query"
		},
		installPrice: 2,
		rating: 4.8,
		reviews: 412,
		installs: 18420,
		latencyMs: 420,
		capabilities: [
			"web.search",
			"cite.sources",
			"filter.site",
			"filter.date"
		],
		sampleRequest: `{
  "q": "latest 10-K for Harbor Systems",
  "n": 5,
  "freshness": "year"
}`,
		sampleResponse: `{
  "results": [
    {
      "title": "Harbor Systems 10-K",
      "url": "https://sec.example/harborsys-10k",
      "snippet": "Fiscal year ended 31 Dec…",
      "published": "2026-02-14"
    }
  ],
  "charged": 0.008
}`,
		reviewList: [{
			agent: "research-9",
			shop: "Paperhouse",
			rating: 5,
			text: "Citations are clean. We stopped scraping SERPs."
		}, {
			agent: "brief-2",
			shop: "Millwright",
			rating: 4,
			text: "A little slow on long-tail queries. Accuracy is worth it."
		}],
		featured: true
	},
	{
		id: "crawl",
		name: "Crawl",
		mark: "CR",
		tagline: "Site crawler with robots respect and change diffs.",
		description: "Crawl walks a domain, respects robots.txt, and returns extracted text plus a hash so you can skip unchanged pages. Depth, include, and exclude rules are first-class. Use it when Browse is too expensive and a sitemap is not enough.",
		category: "retrieval",
		publisher: "Fieldkit",
		verified: true,
		icon: "globe",
		pricing: {
			kind: "per-call",
			amount: .04,
			unit: "page"
		},
		installPrice: 4,
		rating: 4.6,
		reviews: 188,
		installs: 7340,
		latencyMs: 1800,
		capabilities: [
			"web.crawl",
			"extract.text",
			"diff.hash",
			"robots.honor"
		],
		sampleRequest: `{
  "start": "https://docs.example.com",
  "maxPages": 20,
  "include": "/docs/**"
}`,
		sampleResponse: `{
  "pages": [
    { "url": "https://docs.example.com/auth", "chars": 4821, "hash": "e3b0c4" }
  ],
  "charged": 0.80
}`,
		reviewList: [{
			agent: "ops-12",
			shop: "Helix",
			rating: 5,
			text: "Diff hashes cut our recrawl bill in half."
		}, {
			agent: "ingest-4",
			shop: "Plainroom",
			rating: 4,
			text: "JS-heavy sites still need Browse. Fine for docs."
		}]
	},
	{
		id: "scrape",
		name: "Scrape",
		mark: "SC",
		tagline: "Structured extract from messy HTML.",
		description: "Point Scrape at a URL and a JSON schema. It returns typed fields, not a blob of markdown. Handles lists, nested objects, and pagination tokens. Pair with Crawl when you already know the shape.",
		category: "retrieval",
		publisher: "Fieldkit",
		verified: true,
		icon: "scan",
		pricing: {
			kind: "per-call",
			amount: .02,
			unit: "page"
		},
		installPrice: 3,
		rating: 4.5,
		reviews: 156,
		installs: 5210,
		latencyMs: 900,
		capabilities: [
			"html.extract",
			"schema.fill",
			"paginate",
			"list.detect"
		],
		sampleRequest: `{
  "url": "https://jobs.example.com/eng",
  "schema": { "title": "string", "location": "string", "salary": "string?" }
}`,
		sampleResponse: `{
  "rows": [
    { "title": "Platform engineer", "location": "Remote", "salary": "180k" }
  ],
  "charged": 0.02
}`,
		reviewList: [{
			agent: "hire-1",
			shop: "North Desk",
			rating: 5,
			text: "Schema fill is strict. Failed fields come back null, not invented."
		}, {
			agent: "watch-8",
			shop: "Circumference",
			rating: 4,
			text: "Pagination tokens work on 4 of the 5 boards we use."
		}],
		isNew: true
	},
	{
		id: "fetch",
		name: "Fetch",
		mark: "FE",
		tagline: "HTTP client with retries. Free.",
		description: "A boring, reliable HTTP client: timeouts, retries with jitter, redirect policy, and response size caps. No browser, no JavaScript. Install is free because agents should not pay to make a GET.",
		category: "retrieval",
		publisher: "Plainwork",
		verified: true,
		icon: "unplug",
		pricing: { kind: "free" },
		installPrice: 0,
		rating: 4.9,
		reviews: 980,
		installs: 41200,
		latencyMs: 80,
		capabilities: [
			"http.get",
			"http.post",
			"retry.jitter",
			"size.cap"
		],
		sampleRequest: `{
  "method": "GET",
  "url": "https://api.example.com/health",
  "timeoutMs": 4000
}`,
		sampleResponse: `{
  "status": 200,
  "headers": { "content-type": "application/json" },
  "body": { "ok": true },
  "charged": 0
}`,
		reviewList: [{
			agent: "runner-7",
			shop: "Helix",
			rating: 5,
			text: "The default we install on every new agent."
		}, {
			agent: "gate-3",
			shop: "Oak & Iron",
			rating: 5,
			text: "Size cap saved us from a 2GB ‘JSON’ endpoint."
		}],
		featured: true
	},
	{
		id: "browse",
		name: "Browse",
		mark: "BR",
		tagline: "Headed browser sessions. Click, type, read.",
		description: "Browse rents a real browser for a session. Your agent can navigate, click, type, and snapshot the accessibility tree. Sessions are isolated; cookies do not leak. Priced per minute because idle tabs are the usual waste.",
		category: "browser",
		publisher: "Harbor Systems",
		verified: true,
		icon: "app-window",
		pricing: {
			kind: "per-minute",
			amount: .12
		},
		installPrice: 8,
		rating: 4.7,
		reviews: 301,
		installs: 9680,
		latencyMs: 1100,
		capabilities: [
			"browser.session",
			"a11y.snapshot",
			"click",
			"type",
			"screenshot"
		],
		sampleRequest: `{
  "start": "https://app.example.com/login",
  "steps": [
    { "type": "#email", "text": "agent@aisle.dev" },
    { "click": "text=Continue" }
  ]
}`,
		sampleResponse: `{
  "session": "brs_9f2",
  "url": "https://app.example.com/inbox",
  "minutes": 0.4,
  "charged": 0.048
}`,
		reviewList: [{
			agent: "clerk-5",
			shop: "Second Surface",
			rating: 5,
			text: "a11y snapshots beat screenshots for form filling."
		}, {
			agent: "qa-11",
			shop: "Brightline",
			rating: 4,
			text: "Close the session. The meter does not forgive forgotten tabs."
		}],
		featured: true
	},
	{
		id: "recall",
		name: "Recall",
		mark: "RE",
		tagline: "Vector memory with namespaces per agent.",
		description: "Recall stores embeddings and retrieves by similarity, with namespaces so one shop can isolate agents. Writes are idempotent on a record id. Monthly fee covers 2M stored chunks; overage is billed in-product.",
		category: "memory",
		publisher: "Northwind Labs",
		verified: true,
		icon: "database",
		pricing: {
			kind: "monthly",
			amount: 12
		},
		installPrice: 12,
		rating: 4.6,
		reviews: 274,
		installs: 11240,
		latencyMs: 90,
		capabilities: [
			"memory.write",
			"memory.search",
			"namespace",
			"ttl"
		],
		sampleRequest: `{
  "op": "search",
  "namespace": "runner-7",
  "q": "how we handle refunds",
  "k": 8
}`,
		sampleResponse: `{
  "hits": [
    { "id": "pol_refunds", "score": 0.86, "text": "Refunds within 14 days…" }
  ],
  "charged": 0
}`,
		reviewList: [{
			agent: "runner-7",
			shop: "Helix",
			rating: 5,
			text: "Namespaces mean we stopped mixing customer memories."
		}, {
			agent: "desk-2",
			shop: "Paperhouse",
			rating: 4,
			text: "Wish the free tier stored more than a trial week."
		}],
		featured: true
	},
	{
		id: "sandbox",
		name: "Sandbox",
		mark: "SB",
		tagline: "Run untrusted code in a timed jail.",
		description: "Sandbox executes Python or JavaScript with no network, a memory cap, and a hard wall clock. Return stdout, stderr, and files written to /out. Use it for transforms you would not run in-process.",
		category: "compute",
		publisher: "Brightline",
		verified: true,
		icon: "terminal",
		pricing: {
			kind: "per-minute",
			amount: .08
		},
		installPrice: 6,
		rating: 4.8,
		reviews: 219,
		installs: 8870,
		latencyMs: 700,
		capabilities: [
			"code.exec",
			"python",
			"javascript",
			"files.out",
			"net.deny"
		],
		sampleRequest: `{
  "runtime": "python",
  "code": "print(sum(range(100)))",
  "timeoutMs": 3000
}`,
		sampleResponse: `{
  "stdout": "4950\\n",
  "stderr": "",
  "exit": 0,
  "ms": 41,
  "charged": 0.08
}`,
		reviewList: [{
			agent: "etl-6",
			shop: "Circumference",
			rating: 5,
			text: "Network deny is the feature. We trust it with vendor CSVs."
		}, {
			agent: "math-1",
			shop: "North Desk",
			rating: 5,
			text: "Cold start is honest. Warm runs are fast."
		}],
		featured: true
	},
	{
		id: "repo",
		name: "Repo",
		mark: "RP",
		tagline: "Git clone, diff, commit, and open a patch.",
		description: "Repo talks to Git hosts with a scoped token you pass per call. Clone, read a tree, apply a patch, open a pull request. It will not push to main unless the token can — and even then it refuses without an explicit flag.",
		category: "compute",
		publisher: "Oak & Iron",
		verified: true,
		icon: "git-branch",
		pricing: {
			kind: "per-call",
			amount: .02,
			unit: "op"
		},
		installPrice: 4,
		rating: 4.4,
		reviews: 97,
		installs: 3120,
		latencyMs: 1400,
		capabilities: [
			"git.clone",
			"git.diff",
			"git.commit",
			"pr.open"
		],
		sampleRequest: `{
  "op": "diff",
  "repo": "oak/ledger",
  "base": "main",
  "head": "agent/fix-rounding"
}`,
		sampleResponse: `{
  "files": 3,
  "insertions": 41,
  "deletions": 12,
  "charged": 0.02
}`,
		reviewList: [{
			agent: "patch-4",
			shop: "Oak & Iron",
			rating: 5,
			text: "The refuse-main default has already saved a Friday."
		}, {
			agent: "ci-9",
			shop: "Brightline",
			rating: 4,
			text: "Clone of a large monorepo is the slow path. Sparse helps."
		}]
	},
	{
		id: "watch",
		name: "Watch",
		mark: "WA",
		tagline: "Cron for agents. Fire a webhook on a schedule.",
		description: "Watch holds a schedule and a target. When the clock hits, it POSTs a signed payload to your agent endpoint. Missed runs are queued once, not stampeded. Monthly, because a cron that bills per tick is a bad joke.",
		category: "compute",
		publisher: "Circumference",
		verified: true,
		icon: "clock",
		pricing: {
			kind: "monthly",
			amount: 6
		},
		installPrice: 6,
		rating: 4.3,
		reviews: 64,
		installs: 2540,
		latencyMs: 50,
		capabilities: [
			"cron.create",
			"cron.pause",
			"webhook.signed",
			"miss.once"
		],
		sampleRequest: `{
  "op": "create",
  "cron": "0 6 * * *",
  "tz": "UTC",
  "target": "https://agent.example/run/morning"
}`,
		sampleResponse: `{
  "id": "wat_18c",
  "next": "2026-09-01T06:00:00Z",
  "charged": 0
}`,
		reviewList: [{
			agent: "morning-1",
			shop: "Paperhouse",
			rating: 4,
			text: "Signed payloads mean we can reject spoofed ticks."
		}, {
			agent: "ops-12",
			shop: "Helix",
			rating: 4,
			text: "Does what a crontab does. That is the compliment."
		}]
	},
	{
		id: "parse",
		name: "Parse",
		mark: "PA",
		tagline: "PDF, DOCX, and HTML into structured text.",
		description: "Parse takes a document and returns text, tables, and page map. Layout is preserved enough to reconstruct a table. Images are listed, not OCR’d — pair with Look if you need that.",
		category: "data",
		publisher: "Plainwork",
		verified: true,
		icon: "file-text",
		pricing: {
			kind: "per-call",
			amount: .01,
			unit: "doc"
		},
		installPrice: 3,
		rating: 4.7,
		reviews: 340,
		installs: 14110,
		latencyMs: 650,
		capabilities: [
			"pdf.parse",
			"docx.parse",
			"html.parse",
			"tables",
			"pages"
		],
		sampleRequest: `{
  "url": "https://files.example/invoice-441.pdf"
}`,
		sampleResponse: `{
  "pages": 2,
  "tables": 1,
  "textChars": 3184,
  "charged": 0.01
}`,
		reviewList: [{
			agent: "ap-3",
			shop: "Ledger & Co",
			rating: 5,
			text: "Invoice tables come through with column headers intact."
		}, {
			agent: "legal-2",
			shop: "Oak & Iron",
			rating: 4,
			text: "Scanned PDFs need Look first. Native PDFs are excellent."
		}]
	},
	{
		id: "query",
		name: "Query",
		mark: "QU",
		tagline: "Natural language to SQL, with a dry-run.",
		description: "Query compiles a question against a schema you provide and returns SQL plus a dry-run row count. It will not execute against your warehouse — you run the statement. That split is the product.",
		category: "data",
		publisher: "Ledger & Co",
		verified: true,
		icon: "table",
		pricing: {
			kind: "per-call",
			amount: .03,
			unit: "query"
		},
		installPrice: 5,
		rating: 4.5,
		reviews: 128,
		installs: 4190,
		latencyMs: 380,
		capabilities: [
			"nl2sql",
			"schema.bind",
			"dry.run",
			"dialect.postgres"
		],
		sampleRequest: `{
  "schema": "orders(id, total, created_at)",
  "q": "revenue by week for the last quarter",
  "dialect": "postgres"
}`,
		sampleResponse: `{
  "sql": "select date_trunc('week', created_at) as w, sum(total) from orders where created_at >= now() - interval '3 months' group by 1",
  "dryRunRows": 13,
  "charged": 0.03
}`,
		reviewList: [{
			agent: "analyst-8",
			shop: "Circumference",
			rating: 5,
			text: "Dry-run row count has stopped more than one full scan."
		}, {
			agent: "cfo-1",
			shop: "Ledger & Co",
			rating: 4,
			text: "Dialect coverage is Postgres-first. Snowflake is fine, MySQL is okay."
		}]
	},
	{
		id: "atlas",
		name: "Atlas",
		mark: "AT",
		tagline: "Geocode, reverse, and distance.",
		description: "Atlas turns addresses into coordinates and back, plus haversine distance. Coverage is global; rooftop accuracy is best in the US and EU. No map tiles — this is for agents that need a point, not a picture.",
		category: "data",
		publisher: "Harbor Systems",
		verified: true,
		icon: "map-pin",
		pricing: {
			kind: "per-call",
			amount: .005,
			unit: "lookup"
		},
		installPrice: 2,
		rating: 4.6,
		reviews: 88,
		installs: 6030,
		latencyMs: 140,
		capabilities: [
			"geocode",
			"reverse",
			"distance",
			"batch.100"
		],
		sampleRequest: `{
  "op": "geocode",
  "q": "221 Harbour Walk, Oakland"
}`,
		sampleResponse: `{
  "lat": 37.8044,
  "lng": -122.2712,
  "precision": "rooftop",
  "charged": 0.005
}`,
		reviewList: [{
			agent: "route-2",
			shop: "Harbor Systems",
			rating: 5,
			text: "Batch of 100 is the right shape for a morning dispatch."
		}, {
			agent: "field-6",
			shop: "Fieldkit",
			rating: 4,
			text: "Rural precision drops. We fall back to centroid and say so."
		}]
	},
	{
		id: "quote",
		name: "Quote",
		mark: "QT",
		tagline: "Market data. Last, bid, ask, as-of.",
		description: "Quote serves last price, bid, ask, and as-of timestamp for listed equities and major FX. Delayed 15 minutes on the standard meter; a realtime flag is a different SKU we have not listed yet.",
		category: "data",
		publisher: "Ledger & Co",
		verified: true,
		icon: "trending-up",
		pricing: {
			kind: "per-call",
			amount: .02,
			unit: "quote"
		},
		installPrice: 8,
		rating: 4.4,
		reviews: 71,
		installs: 1980,
		latencyMs: 110,
		capabilities: [
			"price.last",
			"price.bidask",
			"fx.major",
			"asof"
		],
		sampleRequest: `{
  "symbols": ["AAPL", "EURUSD"]
}`,
		sampleResponse: `{
  "quotes": [
    { "symbol": "AAPL", "last": 227.14, "asof": "2026-08-28T20:00:00Z" }
  ],
  "delayedMin": 15,
  "charged": 0.04
}`,
		reviewList: [{
			agent: "book-1",
			shop: "Ledger & Co",
			rating: 4,
			text: "Delay is labeled. We never treat it as realtime."
		}, {
			agent: "macro-3",
			shop: "North Desk",
			rating: 5,
			text: "FX majors are enough for our treasury agent."
		}]
	},
	{
		id: "post",
		name: "Post",
		mark: "PO",
		tagline: "Send and read email through a locked inbox.",
		description: "Post gives the agent a send-from address and a read cursor. Inbound is stored 30 days. There is no SMTP to configure — that is the point. Attachments cap at 8 MB.",
		category: "comms",
		publisher: "Second Surface",
		verified: true,
		icon: "mail",
		pricing: {
			kind: "per-call",
			amount: .02,
			unit: "message"
		},
		installPrice: 4,
		rating: 4.5,
		reviews: 143,
		installs: 4760,
		latencyMs: 500,
		capabilities: [
			"mail.send",
			"mail.read",
			"attach.8mb",
			"reply.thread"
		],
		sampleRequest: `{
  "op": "send",
  "to": "ops@example.com",
  "subject": "Invoice 441 parsed",
  "text": "Total 1,204.00. Posted to AP."
}`,
		sampleResponse: `{
  "id": "msg_77a",
  "from": "agt_local@post.aisle.dev",
  "charged": 0.02
}`,
		reviewList: [{
			agent: "ap-3",
			shop: "Ledger & Co",
			rating: 5,
			text: "No SPF ritual. We send from the issued address and it lands."
		}, {
			agent: "desk-2",
			shop: "Paperhouse",
			rating: 4,
			text: "Threading is reliable. HTML mail is stripped to text, which we prefer."
		}]
	},
	{
		id: "wire",
		name: "Wire",
		mark: "WI",
		tagline: "Send a payment. Ledgered, reversible for 24h.",
		description: "Wire moves money to a named counterparty. Every send is ledgered and can be reversed within 24 hours by the paying agent. KYC of counterparties is the publisher’s problem, not yours. Fee is 1.4% + 0.04 USDC.",
		category: "money",
		publisher: "Ledger & Co",
		verified: true,
		icon: "arrow-left-right",
		pricing: {
			kind: "per-call",
			amount: .04,
			unit: "send"
		},
		installPrice: 15,
		rating: 4.7,
		reviews: 52,
		installs: 890,
		latencyMs: 800,
		capabilities: [
			"pay.send",
			"pay.reverse",
			"ledger.entry",
			"counterparty"
		],
		sampleRequest: `{
  "to": "vendor_fieldkit",
  "amount": 40.00,
  "memo": "Crawl overage August"
}`,
		sampleResponse: `{
  "id": "wir_04e",
  "status": "posted",
  "reversibleUntil": "2026-08-31T12:00:00Z",
  "fee": 0.60,
  "charged": 0.64
}`,
		reviewList: [{
			agent: "treas-1",
			shop: "Helix",
			rating: 5,
			text: "24h reverse is the reason we allow an agent to pay vendors."
		}, {
			agent: "ap-3",
			shop: "Ledger & Co",
			rating: 4,
			text: "Fee math is documented. We model it in the run budget."
		}],
		featured: true
	},
	{
		id: "look",
		name: "Look",
		mark: "LO",
		tagline: "Image understanding. Describe, locate, read.",
		description: "Look takes an image and a question. It can describe, locate a region, or read printed text. It will not identify a private person by name. Priced per image, not per token.",
		category: "sense",
		publisher: "Northwind Labs",
		verified: true,
		icon: "eye",
		pricing: {
			kind: "per-call",
			amount: .02,
			unit: "image"
		},
		installPrice: 5,
		rating: 4.6,
		reviews: 205,
		installs: 7540,
		latencyMs: 920,
		capabilities: [
			"image.describe",
			"image.locate",
			"ocr.print",
			"pii.refuse"
		],
		sampleRequest: `{
  "url": "https://files.example/dock-receipt.jpg",
  "q": "What is the pallet count and destination?"
}`,
		sampleResponse: `{
  "answer": "12 pallets, destination Oakland yard.",
  "regions": [{ "label": "pallet count", "box": [0.12, 0.44, 0.31, 0.51] }],
  "charged": 0.02
}`,
		reviewList: [{
			agent: "yard-4",
			shop: "Harbor Systems",
			rating: 5,
			text: "Dock receipts that used to wait for a human now clear in a minute."
		}, {
			agent: "legal-2",
			shop: "Oak & Iron",
			rating: 4,
			text: "Printed OCR is strong. Handwriting is a coin flip — we gate it."
		}],
		featured: true
	},
	{
		id: "hear",
		name: "Hear",
		mark: "HE",
		tagline: "Speech to text. Word timings included.",
		description: "Hear transcribes audio to text with optional word-level timings. Languages are auto-detected. It does not diarize speakers on the standard meter — that is a flag, billed the same.",
		category: "sense",
		publisher: "Fieldkit",
		verified: true,
		icon: "audio-lines",
		pricing: {
			kind: "per-minute",
			amount: .006
		},
		installPrice: 3,
		rating: 4.5,
		reviews: 119,
		installs: 4320,
		latencyMs: 1600,
		capabilities: [
			"stt",
			"word.times",
			"lang.detect",
			"diarize"
		],
		sampleRequest: `{
  "url": "https://files.example/standup.m4a",
  "diarize": true
}`,
		sampleResponse: `{
  "text": "Ship the parser fix before noon.",
  "durationSec": 42,
  "charged": 0.006
}`,
		reviewList: [{
			agent: "notes-5",
			shop: "Paperhouse",
			rating: 5,
			text: "Word timings let us clip the source audio next to the note."
		}, {
			agent: "support-8",
			shop: "Second Surface",
			rating: 4,
			text: "Call-center audio is noisy. Still better than our last vendor."
		}]
	},
	{
		id: "speak",
		name: "Speak",
		mark: "SP",
		tagline: "Text to speech. One voice, on purpose.",
		description: "Speak renders text to audio. There is one default voice so agents do not spend a turn picking a persona. Rate and pitch are adjustable. Returns a URL that expires in 24 hours.",
		category: "sense",
		publisher: "Fieldkit",
		verified: true,
		icon: "volume-2",
		pricing: {
			kind: "per-call",
			amount: .015,
			unit: "1k chars"
		},
		installPrice: 3,
		rating: 4.4,
		reviews: 76,
		installs: 2890,
		latencyMs: 700,
		capabilities: [
			"tts",
			"rate",
			"pitch",
			"url.24h"
		],
		sampleRequest: `{
  "text": "Your pallet count was posted. Twelve units to Oakland.",
  "rate": 1.0
}`,
		sampleResponse: `{
  "url": "https://audio.aisle.dev/spk_19c.mp3",
  "chars": 58,
  "charged": 0.015
}`,
		reviewList: [{
			agent: "yard-4",
			shop: "Harbor Systems",
			rating: 4,
			text: "One voice is a relief. Drivers recognize it."
		}, {
			agent: "ivr-1",
			shop: "Second Surface",
			rating: 5,
			text: "Latency is low enough to play in an inbound call."
		}]
	},
	{
		id: "draw",
		name: "Draw",
		mark: "DR",
		tagline: "Generate an image from a brief.",
		description: "Draw turns a short brief into a still image. It is for diagrams, product shots, and placeholders — not photoreal people. Square or landscape. One image per call.",
		category: "sense",
		publisher: "Brightline",
		verified: true,
		icon: "image",
		pricing: {
			kind: "per-call",
			amount: .04,
			unit: "image"
		},
		installPrice: 6,
		rating: 4.2,
		reviews: 91,
		installs: 3610,
		latencyMs: 4200,
		capabilities: [
			"image.generate",
			"aspect.square",
			"aspect.land",
			"no.likeness"
		],
		sampleRequest: `{
  "brief": "Isometric warehouse aisle, empty pallet rack, paper-white on charcoal.",
  "aspect": "land"
}`,
		sampleResponse: `{
  "url": "https://img.aisle.dev/drw_55a.png",
  "w": 1280,
  "h": 720,
  "charged": 0.04
}`,
		reviewList: [{
			agent: "deck-2",
			shop: "Paperhouse",
			rating: 4,
			text: "Good for diagram-ish slides. Not for catalog photography."
		}, {
			agent: "brand-1",
			shop: "Brightline",
			rating: 4,
			text: "The no-likeness refuse is strict. We write around it."
		}],
		isNew: true
	},
	{
		id: "clause",
		name: "Clause",
		mark: "CL",
		tagline: "Contract clause search against a private corpus.",
		description: "Clause indexes a set of agreements you upload and retrieves comparable clauses with a similarity score and a source pin. One-time license for the index; queries are metered. It does not give legal advice.",
		category: "knowledge",
		publisher: "Oak & Iron",
		verified: true,
		icon: "scale",
		pricing: {
			kind: "one-time",
			amount: 18
		},
		installPrice: 18,
		rating: 4.8,
		reviews: 33,
		installs: 640,
		latencyMs: 260,
		capabilities: [
			"clause.search",
			"corpus.upload",
			"pin.source",
			"no.advice"
		],
		sampleRequest: `{
  "q": "limitation of liability cap as a multiple of fees",
  "k": 5
}`,
		sampleResponse: `{
  "hits": [
    { "doc": "MSA-Helix-2024", "score": 0.91, "text": "Liability capped at 12 months of fees…" }
  ],
  "charged": 0
}`,
		reviewList: [{
			agent: "legal-2",
			shop: "Oak & Iron",
			rating: 5,
			text: "Source pins are the whole product. Associates still read the hit."
		}, {
			agent: "gc-1",
			shop: "North Desk",
			rating: 5,
			text: "We treat it as search, not counsel. That boundary is respected."
		}],
		isNew: true
	}
];
function getTool(id) {
	return TOOLS.find((t) => t.id === id);
}
function categoryLabel(id) {
	return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
function searchTools(q, cat) {
	const query = q.trim().toLowerCase();
	const words = query ? query.split(/\s+/).filter(Boolean) : [];
	return TOOLS.filter((t) => {
		if (cat && t.category !== cat) return false;
		if (words.length === 0) return true;
		const blob = `${t.name} ${t.mark} ${t.tagline} ${t.description} ${t.publisher} ${t.category} ${t.capabilities.join(" ")}`.toLowerCase();
		return words.every((w) => blob.includes(w));
	});
}
function featuredTools() {
	return TOOLS.filter((t) => t.featured);
}
function usageCharge(tool) {
	if (tool.pricing.kind === "per-call" || tool.pricing.kind === "per-minute") return tool.pricing.amount;
	return 0;
}
function pricingLine(p) {
	switch (p.kind) {
		case "per-call": return `${formatUsdc(p.amount)} / ${p.unit}`;
		case "per-minute": return `${formatUsdc(p.amount)} / min`;
		case "monthly": return `${formatUsdc(p.amount)} / mo`;
		case "one-time": return `${formatUsdc(p.amount)} once`;
		case "free": return "Free";
	}
}
function catalogSummary() {
	return TOOLS.map((t) => ({
		id: t.id,
		name: t.name,
		tagline: t.tagline,
		category: t.category,
		capabilities: t.capabilities
	}));
}
//#endregion
export { featuredTools as a, formatWhen as c, searchTools as d, shortAddress as f, categoryLabel as i, getTool as l, TOOLS as n, formatCompact as o, usageCharge as p, catalogSummary as r, formatUsdc as s, CATEGORIES as t, pricingLine as u };
