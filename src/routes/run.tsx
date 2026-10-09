import { createFileRoute, Link } from "@tanstack/react-router";
import { AgentConsole } from "@/components/agent-console";

type Search = { task?: string };

export const Route = createFileRoute("/run")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    task: typeof s.task === "string" ? s.task : undefined,
  }),
  component: RunPage,
  head: () => ({ meta: [{ title: "Run — Aisle" }] }),
});

function RunPage() {
  const { task } = Route.useSearch();

  return (
    <div className="py-8 md:py-10">
      <p className="text-xs tracking-widest text-muted uppercase">Agent runtime</p>
      <h1 className="mt-2 font-serif text-4xl italic leading-tight text-fg">Watch it shop.</h1>
      <p className="mt-3 max-w-2xl text-base leading-normal text-muted">
        Describe a job. The agent queries the catalog, pays in marks, and invokes. No accounts. No OAuth. No setup.
      </p>
      <p className="mt-2 text-sm text-subtle">
        Same protocol as a deployed agent.{" "}
        <Link to="/protocol" className="text-muted underline-offset-4 hover:text-fg hover:underline">
          Read it
        </Link>
        .
      </p>

      <div className="mt-8">
        <AgentConsole initialTask={task} />
      </div>
    </div>
  );
}
