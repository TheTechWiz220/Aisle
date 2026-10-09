import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { CATEGORIES, featuredTools, searchTools } from "@/lib/catalog";
import { AskAisle } from "@/components/ask-aisle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolCard } from "@/components/tool-card";
import { cn } from "@/lib/utils";

type Search = { q?: string; cat?: string };

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
    cat: typeof s.cat === "string" ? s.cat : undefined,
  }),
  component: Home,
  head: () => ({
    meta: [{ title: "Aisle — The app store for agents" }],
  }),
});

function Home() {
  const { q, cat } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [draft, setDraft] = useState(q ?? "");

  const results = useMemo(() => searchTools(q ?? "", cat), [q, cat]);
  const featured = useMemo(() => featuredTools(), []);
  const searching = Boolean(q) || Boolean(cat);

  function applyQuery(next: string) {
    void navigate({
      search: (prev) => ({ ...prev, q: next.trim() || undefined }),
    });
  }

  return (
    <div>
      <section className="ledger-grid relative -mx-4 border-b border-border px-4 py-12 md:-mx-6 md:px-6 md:py-16">
        <p className="text-xs tracking-widest text-muted uppercase">App store for agents</p>
        <h1 className="mt-3 max-w-2xl font-serif text-4xl leading-tight tracking-tight text-fg italic md:text-5xl">
          Find a tool. Pay. Run.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-normal text-muted">
          No accounts. No OAuth. No setup. Open a USDC channel on Solana, sign a voucher per call, settle once.
        </p>

        <form
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          onSubmit={(e) => {
            e.preventDefault();
            applyQuery(draft);
          }}
        >
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Search a capability — crawl, mail, sql, vision"
              className="h-12 pl-10"
              aria-label="Search tools"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="h-12 px-5">
              Search
            </Button>
            <AskAisle />
          </div>
        </form>

        <p className="mt-6 font-mono text-xs leading-relaxed text-subtle">
          GET /api/v1/catalog?q=search
          <span className="mx-2 text-border-strong">·</span>
          <Link to="/protocol" className="text-muted underline-offset-4 hover:text-fg hover:underline">
            Protocol
          </Link>
          <span className="mx-2 text-border-strong">·</span>
          <Link to="/run" className="text-muted underline-offset-4 hover:text-fg hover:underline">
            Run a job
          </Link>
        </p>
      </section>

      <div className="flex gap-2 overflow-x-auto py-6 -mx-4 px-4 md:mx-0 md:px-0">
        <CatChip
          label="All"
          active={!cat}
          onClick={() => void navigate({ search: (p) => ({ ...p, cat: undefined }) })}
        />
        {CATEGORIES.map((c) => (
          <CatChip
            key={c.id}
            label={c.label}
            active={cat === c.id}
            onClick={() =>
              void navigate({
                search: (p) => ({ ...p, cat: p.cat === c.id ? undefined : c.id }),
              })
            }
          />
        ))}
      </div>

      {!searching ? (
        <section className="mb-10 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div className="min-w-0">
            <h2 className="font-serif text-2xl italic text-fg">Send an agent</h2>
            <p className="mt-1 max-w-xl text-sm leading-normal text-muted">
              Describe the job. It queries the catalog, pays from this wallet, and invokes. You watch the transcript.
            </p>
          </div>
          <Button asChild className="mt-4 sm:mt-0 shrink-0">
            <Link to="/run">
              Open the runner
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </section>
      ) : null}

      {!searching ? (
        <section className="mb-10">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-serif text-2xl italic text-fg">Featured</h2>
            <p className="text-xs text-subtle">{featured.length} tools</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-serif text-2xl italic text-fg">
            {searching ? "Results" : "Catalog"}
          </h2>
          <p className="text-xs tabular-nums text-subtle">{results.length} tools</p>
        </div>
        {results.length === 0 ? (
          <div className="rounded-xl bg-surface px-6 py-12 text-center shadow-[var(--shadow-border)]">
            <p className="text-fg">No tools match.</p>
            <p className="mt-1 text-sm text-muted">Try retrieval, browser, or money — or describe the job.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CatChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-11 shrink-0 rounded-full px-4 text-sm transition-[background-color,color,box-shadow] duration-150",
        active
          ? "bg-accent text-accent-fg"
          : "text-muted shadow-[0_0_0_1px_var(--color-border)] hover:text-fg",
      )}
    >
      {label}
    </button>
  );
}
